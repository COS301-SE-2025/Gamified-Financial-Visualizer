import express from 'express';
import axios from 'axios';
import pool from '../../../config/db';
import { logger } from '../../../config/logger';
import { redisClient } from '../../../config/redis';
import * as insightsService from '../services/insights.service';
const router = express.Router();

const AI_URL = process.env.AI_SERVICE_URL || 'https://gamified-finance-ai-avf0gsfrf5a4b9cj.southafricanorth-01.azurewebsites.net';
// const AI_URL = 'http://localhost:6000'; 

// Endpoint to fetch user insights on income and expenses per month in the current year
router.get('/transactions/:userId', async (req, res) => {
   const { userId } = req.params;
   const year = new Date().getFullYear(); // Get current year

   if (!year) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
   }

   try {
      // Fetch transactions from the database split between income and expenses per month
      const transactions = await pool.query(
         `SELECT EXTRACT(MONTH FROM transaction_date) AS month, accounts.account_name, 
-- Income: include income, deposit, transfer
  SUM(CASE 
        WHEN transaction_type IN ('income', 'deposit', 'transfer') 
        THEN transaction_amount 
        ELSE 0 
      END) AS income,

  -- Expense: include expense, transfer, fee, withdrawal
  SUM(CASE 
        WHEN transaction_type IN ('expense', 'transfer', 'fee', 'withdrawal') 
        THEN transaction_amount 
        ELSE 0 
      END) AS expense
            FROM transactions
            JOIN accounts ON transactions.account_id = accounts.account_id
            WHERE accounts.user_id = $1 AND EXTRACT(YEAR FROM transaction_date) = $2
           GROUP BY month, accounts.account_name
            `,
         [ userId, year ]
      );

      if (transactions.rows.length === 0) {
         res.status(404).json({ error: 'No transactions found for this user in the current year' });
         return;
      }

      // get global average income and expenses
      const globalAvg = await pool.query(
         `SELECT  month , AVG(income) AS avg_income, AVG(expense) AS avg_expense
            FROM (
               SELECT EXTRACT(MONTH FROM transaction_date) AS month, 
                  SUM(CASE WHEN transaction_type = 'income' THEN transaction_amount ELSE 0 END) AS income, 
                  SUM(CASE WHEN transaction_type IN ('expense', 'withdrawal', 'fee', 'transfer') THEN transaction_amount ELSE 0 END) AS expense
               FROM transactions
               GROUP BY month
            ) AS monthly_totals
             GROUP BY month
             ORDER BY month`
      );

      if (globalAvg.rows.length === 0) {
         res.status(404).json({ error: 'No global average data found' });
         return;
      }

      const numberOfUsers = await pool.query(
         `SELECT COUNT(DISTINCT user_id) AS user_count FROM accounts`
      );

      if (numberOfUsers.rows.length === 0 || numberOfUsers.rows[ 0 ].user_count === 0) {
         res.status(404).json({ error: 'No users found in the system' });
         return;
      }
      const monthlyAverages = globalAvg.rows.map(row => ({
         month: row.month,
         avgIncome: parseFloat(row.avg_income) / numberOfUsers.rows[ 0 ].user_count || 0,
         avgExpense: parseFloat(row.avg_expense) / numberOfUsers.rows[ 0 ].user_count || 0
      }));


      // Format the response
      const insights = transactions.rows.map(row => ({
         month: row.month,
         accountName: row.account_name,
         income: parseFloat(row.income) || 0,
         expense: parseFloat(row.expense) || 0
      }));

      res.status(200).json({ userId, year, insights, globalAvg: { monthlyAverages } });
   } catch (error) {
      logger.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

router.get('/transactions/heatmap/:userId', async (req, res) => {
   const { userId } = req.params;
   const year = new Date().getFullYear(); // Get current year
   if (!year) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
   }

   // Format the response
   interface HeatmapRow {
      day: string;
      transactions: number;
      total_spent: number;
   }

   interface HeatmapData {
      date: string;
      transactions: number;
      amount: number;
   }

   try {
      // check cache first
      const cacheKey = `heatmap_${userId}_${year}`;
      const cachedData = await redisClient.get(cacheKey);
      // Fetch transactions from the database split between income and expenses per month

      let transactionsRows;

      if (!cachedData) {
          const result = await pool.query(
            `SELECT 
               DATE(transaction_date) AS day,
               COUNT(*) AS transactions,
               SUM(transaction_amount) AS total_spent
            FROM transactions
            JOIN accounts ON transactions.account_id = accounts.account_id
            WHERE accounts.user_id = $1
              AND transaction_date >= CURRENT_DATE - INTERVAL '1 year'
            GROUP BY day
            ORDER BY day;`,
            [ userId ]
          );
         transactionsRows = result.rows;
      } else {
         transactionsRows = JSON.parse(cachedData);
      }

      if (transactionsRows.length === 0) {
         res.status(404).json({ error: 'No transactions found for this user in the current year' });
         return;
      }

      // Cache it
      await redisClient.set(`heatmap_${userId}_${year}`, JSON.stringify(transactionsRows), {
         EX: 21600
      });

      // Format response
      const heatmapData = transactionsRows.map((row: HeatmapRow) => ({
         date: row.day,
         transactions: row.transactions,
         amount: row.total_spent
      }));

      res.status(200).json( heatmapData );
   } catch (error) {
      logger.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

// get per category insights
// Get user's spending vs average per category
router.get('/category/:userId', async (req, res) => {
   const { userId } = req.params;
   const year = new Date().getFullYear();

   try {
      // Step 1: User's total spending per category
      const categorySpending = await pool.query(
         `SELECT 
     EXTRACT(MONTH FROM t.transaction_date) AS month,
     c.category_name AS category,
     a.account_name,
     SUM(t.transaction_amount) AS user_spent
   FROM transactions t
   JOIN categories c ON t.category_id = c.category_id
   JOIN accounts a ON t.account_id = a.account_id
   WHERE a.user_id = $1
     AND t.transaction_type IN ('expense', 'withdrawal', 'fee', 'transfer')
     AND EXTRACT(YEAR FROM t.transaction_date) = $2
   GROUP BY month, a.account_name, c.category_name
   ORDER BY month, a.account_name, c.category_name`,
         [ userId, year ]
      );

      const categoryInsights = categorySpending.rows.map(row => ({
         month: row.month,
         accountName: row.account_name,
         category: row.category,
         userSpent: parseFloat(row.user_spent) || 0
      }));
      // Step 2: Average spending per category across all users
      // check cache
      const cacheKey = `avg_spending_${year}`;
      const cachedAvg = await redisClient.get(cacheKey);
      let avgSpending;
      if (!cachedAvg) {
         logger.info('Cache miss for average spending, querying database');
         avgSpending = await pool.query(
            `SELECT 
               month,
               category,
               AVG(total_spent) AS avg_spent
               FROM (
               SELECT 
                  EXTRACT(MONTH FROM t.transaction_date) AS month,
                  c.category_name AS category,
                  a.user_id,
                  SUM(t.transaction_amount) AS total_spent
               FROM transactions t
               JOIN categories c ON t.category_id = c.category_id
               JOIN accounts a ON t.account_id = a.account_id
               WHERE t.transaction_type IN ('expense', 'withdrawal', 'fee', 'transfer')
                  AND EXTRACT(YEAR FROM t.transaction_date) = $1
               GROUP BY a.user_id, month, category
               ) AS user_monthly_totals
               GROUP BY month, category
               ORDER BY month, category`
            , [ year ]
         );
         // Cache the average spending for 1 day
         await redisClient.set(cacheKey, JSON.stringify(avgSpending.rows), {
            EX: 86400 // 1 day expiration
         });

      } else {
         logger.info('Cache hit for average spending, using cached data');
         avgSpending = JSON.parse(cachedAvg);
      }

      const monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

      const spendingData: any[] = [];

      categoryInsights.forEach(row => {
         const monthName = monthNames[ row.month - 1 ];
         const account = row.accountName;
         const category = row.category;
         const amount = row.userSpent;

         let monthEntry = spendingData.find(entry => entry.month === monthName);
         if (!monthEntry) {
            monthEntry = {
               month: monthName,
               accounts: {},
               totals: {},
               averages: {},
               comparisons: {}
            };
            spendingData.push(monthEntry);
         }

         // Accounts
         if (!monthEntry.accounts[ account ]) {
            monthEntry.accounts[ account ] = {};
         }
         monthEntry.accounts[ account ][ category ] = (monthEntry.accounts[ account ][ category ] || 0) + amount;

         // Totals
         monthEntry.totals[ category ] = (monthEntry.totals[ category ] || 0) + amount;
      });

      // Merge averages per month
      interface MonthEntry {
         month: string;
         accounts: Record<string, Record<string, number>>;
         totals: Record<string, number>;
         averages: Record<string, number>;
         comparisons: Record<string, string>;
      }

      interface AvgSpendingRow {
         month: number;
         category: string;
         avg_spent: string | number;
      }


      (avgSpending as AvgSpendingRow[]).forEach((row: AvgSpendingRow) => {
         const monthName = monthNames[ row.month - 1 ];
         const category = row.category;
         const avg = parseFloat(row.avg_spent as string) || 0;

         const monthEntry = spendingData.find((entry: MonthEntry) => entry.month === monthName);
         if (monthEntry) {
            monthEntry.averages[ category ] = avg;

            const userTotal = monthEntry.totals[ category ] || 0;
            monthEntry.comparisons[ category ] = userTotal > avg ? 'higher' : 'lower';
         }
      });
      res.status(200).json({ spendingData });
   } catch (error) {
      logger.error('Error fetching category insights:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

// get wealth insights
router.get('/wealth/:userId', async (req, res) => {
   const { userId } = req.params;
   const now = new Date();
   const currentMonth = now.getMonth() + 1;
   const currentYear = now.getFullYear();


   try {
      // Get all financial accounts for the user
      const accounts = await pool.query(
         `SELECT 
         a.account_name,
         a.account_type,
         a.account_balance,
         a.currency,

         -- Current month income
         SUM(CASE 
               WHEN t.transaction_type IN ('income', 'deposit', 'transfer') 
                     AND EXTRACT(MONTH FROM t.transaction_date) = $2 
                     AND EXTRACT(YEAR FROM t.transaction_date) = $3
               THEN t.transaction_amount 
               ELSE 0 
               END) AS current_month_income,

         -- Current month expense
         SUM(CASE 
               WHEN t.transaction_type IN ('expense', 'withdrawal', 'fee', 'transfer') 
                     AND EXTRACT(MONTH FROM t.transaction_date) = $2 
                     AND EXTRACT(YEAR FROM t.transaction_date) = $3
               THEN t.transaction_amount 
               ELSE 0 
               END) AS current_month_expense

         FROM accounts a
         LEFT JOIN transactions t ON a.account_id = t.account_id
         WHERE a.user_id = $1
         GROUP BY a.account_name, a.account_type, a.account_balance, a.currency
         ORDER BY a.account_name;
         `,
         [ userId, currentMonth, currentYear ]
      );

      //

      // convert all crypto balances to fiat
      const cryptoAccounts = accounts.rows.filter(acc => acc.account_type === 'crypto');
      const fiatAccounts = accounts.rows.filter(acc => acc.account_type !== 'crypto');

      // If no crypto accounts, return fiat balances only
      const CMC_APIKEY = process.env.CMC_APIKEY;
      let percentChange = 0;
      if (CMC_APIKEY && cryptoAccounts.length > 0) {
         let USD_TO_ZAR = await fetch('https://open.er-api.com/v6/latest/USD')
            .then(res => res.json())
            .then(data => data.rates.ZAR);

         if (!USD_TO_ZAR) {
            logger.error('Failed to fetch USD to ZAR conversion rate');
            USD_TO_ZAR = 17; // Fallback to a default value if API fails
         }

         // cache USD to ZAR conversion rate
         const cacheKey = `USD_TO_ZAR`;
         await redisClient.set(cacheKey, USD_TO_ZAR, {
            EX: 3600 // 1 hour expiration
         }); // Cache for 1 hour

         const cryptoPrices = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
            headers: {
               'X-CMC_PRO_API_KEY': CMC_APIKEY,
               'Accept': 'application/json'
            }
         }).then(res => res.json());

         const priceMap: { [ symbol: string ]: number } = {};
         let totalPercentChange = 0;
         let percentChangeCount = 0;
         cryptoPrices.data.forEach((coin: { symbol: string; quote: { USD: { price: number; percent_change_24h: number } } }) => {
            priceMap[ coin.symbol ] = coin.quote.USD.price * USD_TO_ZAR; // Convert to ZAR
            totalPercentChange += coin.quote.USD.percent_change_24h;
            percentChangeCount++;
         });

         // Calculate average percent change for all crypto coins
         percentChange = percentChangeCount > 0 ? totalPercentChange / percentChangeCount : 0;

         // Convert crypto balances to fiat
         cryptoAccounts.forEach(acc => {
            const symbol = acc.currency.toUpperCase();
            if (priceMap[ symbol ]) {
               acc.account_balance = (parseFloat(acc.account_balance) * priceMap[ symbol ]).toFixed(2);
               acc.account_type = 'crypto';

            }
         });
      }

      //  Aggregate wealth
      const accountDetails = accounts.rows.map(row => ({
         accountName: row.account_name,
         accountType: row.account_type,
         balance: parseFloat(row.account_balance),
         currency: row.currency,
         currentMonthIncome: parseFloat(row.current_month_income) || 0,
         currentMonthExpense: parseFloat(row.current_month_expense) || 0
      }));
      const totalBalance = accountDetails.reduce((acc, item) => acc + parseFloat(item.balance.toString()), 0);
      const changeZar = totalBalance * (percentChange / 100);


      // Format for chart frontend
      const chartData = {
         totalWealth: totalBalance,
         netWorth: totalBalance,
         breakdown: accountDetails.map(acc => ({
            name: acc.accountName,
            value: parseFloat(acc.balance.toString()),
            type: acc.accountType,
            currentMonthIncome: parseFloat(acc.currentMonthIncome.toString()),
            currentMonthExpense: parseFloat(acc.currentMonthExpense.toString()),
            currency: acc.currency
         })),
         change_24h_percent: parseFloat(percentChange.toFixed(2)),
         change_24h_zar: parseFloat(changeZar.toFixed(2))
      };

      res.status(200).json(chartData);
   } catch (error) {
      logger.error('Error fetching wealth insights:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});


// get radar insights
router.get('/radar/:userId', async (req, res) => {
   const { userId } = req.params;
   const year = new Date().getFullYear();

   // Basic guard
   const uid = Number(userId);
   if (!Number.isFinite(uid)) {
      res.status(400).json({ error: 'Invalid userId' });
      return;
   }

   try {
      // Call your service (returns { radar, radarAverage })
      const radarDataResp = await insightsService.radarChartInsights(uid);
      if (!radarDataResp || !radarDataResp.radar || !radarDataResp.radarAverage) {
         res.status(404).json({ error: 'No radar data found for this user' });
         return;
      }

      type RadarPoint = { axis: string; value: number | string };

      const userSeries: RadarPoint[] = radarDataResp.radar;
      const avgSeries: RadarPoint[] = radarDataResp.radarAverage;

      // Build a quick lookup for averages
      const avgMap = new Map<string, number>(
         avgSeries.map(p => [ p.axis, Number(p.value) || 0 ])
      );

      // Merge to a single array so frontend can render 2 polygons easily
      const combined = userSeries.map(p => ({
         axis: p.axis,
         user: Number(p.value) || 0,
         average: avgMap.get(p.axis) ?? 0
      }));

      // Return both combined + raw in case you want raw series elsewhere
      res.status(200).json({
         userId: uid,
         year,
         radar: combined,             // [{ axis, user, average }]
         raw: {
            user: userSeries,          // [{ axis, value }]
            average: avgSeries         // [{ axis, value }]
         }
      });
   } catch (error) {
      logger.error('Error fetching radar insights:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

const INSIGHTS_BASE = `${AI_URL}/insights`;

// 1) Month + User → Wrapped insights
//    e.g. GET /sentiment/user/42/7  → proxies to GET http://localhost:6000/insights/42/7
router.get("/sentiment/user/:userId/:month", async (req, res) => {
   const { userId, month } = req.params;
   try {
      const [ txRes, goalsRes, budgetsRes ] = await Promise.all([
         insightsService.getRawTransactions(userId, parseInt(month)),
         insightsService.getRawGoals(userId, parseInt(month)),
         insightsService.getRawBudgets(userId)
      ]);


      const transformedTransactions = txRes.map(t => ({
         ...t,
         date: new Date(t.date).toISOString().replace('Z', '+00:00')
      }));

      const transformedGoals = goalsRes.map(g => ({
         id: g.goal_id,
         title: g.goal_name,
         status: g.goal_status,
         target_amount: parseFloat(g.target_amount),
         progress: parseFloat(g.current_amount)
      }));
      const transformedBudgets = budgetsRes.map(b => ({
         category: b.category,
         amount: parseFloat(b.current_amount)
      }));
      const userData = {
         transactions: transformedTransactions,
         goals: transformedGoals,
         budgets: transformedBudgets
      };


      // send JSON to Python endpoint
      const { data } = await axios.post(
         `${AI_URL}/insights/user/${userId}/${month}`,
         userData,
         {
            timeout: 300000, // 12 seconds timeout
            validateStatus: (status) => status < 500 // Accept all HTTP status codes
         }
      );

      res.status(200).json(data);
   } catch (err) {
      console.error("Error proxying to Python insights:", err);
      if (err instanceof Error) {
         res.status(400).json({ error: err.message });
      } else {
         res.status(500).json({ error: String(err) });
      }
   }
});

router.get("/wrapped/user/:userId/:month/", async (req, res) => {
   const { userId, month } = req.params;
   try {
      const data = await insightsService.generateWrappedInsights(parseInt(userId), parseInt(month));
      res.json(data);
   } catch (err) {
      if (err instanceof Error) {
         console.error("Error fetching wrapped insights:", err.message);
         res.status((err as any).response?.status || 500).json({
            error: "Failed to fetch wrapped insights",
            details: err.message
         });
      } else {
         console.error("Error fetching wrapped insights:", err);
         res.status(500).json({
            error: "Failed to fetch wrapped insights",
            details: String(err)
         });
      }
   }
});

// 2) User only → current-month insights shortcut
//    e.g. GET /sentiment/user/42 → proxies to GET http://localhost:6000/insights/42
router.get("/sentiment/user/:userId", async (req, res) => {
   const { userId } = req.params;
   try {
      const { data } = await axios.get(`${INSIGHTS_BASE}/${userId}`);
      res.json(data);
   } catch (err) {
      if (err instanceof Error) {
         console.error("Error fetching current-month insights:", err.message);
         res.status((err as any).response?.status || 500).json({
            error: "Failed to fetch current-month insights",
            details: err.message
         });
      } else {
         console.error("Error fetching current-month insights:", err);
         res.status(500).json({
            error: "Failed to fetch current-month insights",
            details: String(err)
         });
      }
   }
});


router.get('/trends/:userId', async (req, res) => {
   const { userId } = req.params;
   try {
      // generate trends data for the user from January to current month
      // Fetch user's transactions, goals, and budgets from the database
      // Note: This is a simplified example, you might want to adjust the queries based on your actual database schema
      if (!userId) {
         res.status(400).json({ error: 'Missing required fields' });
         return;
      }

      // Get current month (1-indexed)
      const currentMonth = new Date().getMonth() + 1;

      // Initialize arrays to collect results
      const allTransactions = [];
      const allGoals = [];

      // Loop through months 1 to currentMonth
      for (let month = 1; month <= currentMonth; month++) {
          const [ txResAll, goalsRes ] = await Promise.all([
            insightsService.getRawTransactions(userId, month),
            insightsService.getRawGoals(userId, month)
          ]);
          // Filter txResAll to only include expense-type transactions
          const txRes = txResAll.filter(t => 
            ['expense', 'withdrawal', 'fee', 'transfer'].includes(t.transaction_type)
          );

         allTransactions.push(...txRes);
         allGoals.push(...goalsRes);
      }

      // Budgets are not month-specific, so fetch once
      const budgetsRes = await insightsService.getRawBudgets(userId);

      // Final result
      const result = {
         transactions: allTransactions,
         goals: allGoals,
         budgets: budgetsRes
      };

      const transformedTransactions = allTransactions.map(t => ({
         ...t,
         date: new Date(t.date).toISOString().replace('Z', '+00:00')
      }));

      const transformedGoals = allGoals.map(g => ({
         id: g.goal_id,
         title: g.goal_name,
         status: g.goal_status,
         target_amount: parseFloat(g.target_amount),
         progress: parseFloat(g.current_amount)
      }));

      const transformedBudgets = budgetsRes.map(b => ({
         category: b.category,
         amount: parseFloat(b.current_amount)
      }));
      const userData = {
         transactions: transformedTransactions,
         goals: transformedGoals,
         budgets: transformedBudgets
      };

      // Fetch trends data from the database

      const trends = await axios.post(`${AI_URL}/insights/trends`,
         userData,
         {
            timeout: 120000, // 2 minutes
            validateStatus: (status) => status < 500
         }

      );

      if (!trends.data) {
         res.status(404).json({ error: 'No trends data found for this user' });
         return;
      }

      // Return the trends data
      res.status(200).json(trends.data);
   } catch (error) {
      logger.error('Error fetching trends:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

router.get('/score/:userId', async (req, res) => {
   const { userId } = req.params;

   try {
      // Get insights based on the score
      const insights = insightsService.getUserScore(userId);

      res.status(200).json(insights);
   } catch (error) {
      logger.error('Error fetching user score:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

// get impulse insights
router.get('/impulse/:userId', async (req, res) => {
   const { userId } = req.params;

});

// recommend budgets
router.get('/budget/:userId', async (req, res) => {
   const { userId } = req.params;
   const year = new Date().getFullYear();

   try {
      // Fetch user's total spending per category
      const userSpending = await pool.query(
         `SELECT categories.category_name AS category, 
                  SUM(transaction_amount) AS total_spent
            FROM transactions
            JOIN categories ON transactions.category_id = categories.id
            WHERE user_id = $1 
               AND transaction_type IN ('expense', 'withdrawal', 'fee', 'transfer')
               AND EXTRACT(YEAR FROM transaction_date) = $2
            GROUP BY category`,
         [ userId, year ]
      );

      // Calculate recommended budget based on average spending
      const budgetRecommendations = userSpending.rows.map(row => ({
         category: row.category,
         recommendedBudget: parseFloat(row.total_spent) * 1.1 // 10% more than the average spent
      }));

      res.status(200).json({ userId, year, budgetRecommendations });
   } catch (error) {
      logger.error('Error fetching budget recommendations:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});


export default router;