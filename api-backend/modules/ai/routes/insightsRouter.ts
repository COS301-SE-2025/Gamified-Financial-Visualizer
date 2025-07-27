import express from 'express';
import pool from '../../../config/db';
import { logger } from '../../../config/logger';
import {redisClient } from '../../../config/redis';
import * as insightsService from '../services/insights.service';
const router = express.Router();

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
         `SELECT EXTRACT(MONTH FROM transaction_date) AS month, 
         SUM(CASE WHEN transaction_type = \'income\' THEN  transaction_amount ELSE 0 END)  OR transaction_type = \'deposit\'  OR transaction_type = \'transfer\' AS income, 
         SUM(CASE WHEN transaction_type = \'expense\'  OR transaction_type = \'transfer\'  OR transaction_type = \'fee\'  OR transaction_type = \'withdrawal\' THEN transaction_amount ELSE 0 END) AS expense
         FROM transactions WHERE user_id = $1 AND EXTRACT(YEAR FROM transaction_date) = $2 
         GROUP BY month ORDER BY month`,
         [userId, year]
      );

      if (transactions.rows.length === 0) {
         res.status(404).json({ error: 'No transactions found for this user in the current year' });
         return;
      }

      // Format the response
      const insights = transactions.rows.map(row => ({
         month: row.month,
         income: parseFloat(row.income) || 0,
         expense: parseFloat(row.expense) || 0
      }));

      res.status(200).json({ userId, year, insights });
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
      const userSpending = await pool.query(
         `SELECT categories.category_name AS category, 
                 SUM(transaction_amount) AS user_spent
          FROM transactions
          JOIN categories ON transactions.category_id = categories.id
          WHERE user_id = $1 
            AND transaction_type IN ('expense', 'withdrawal', 'fee', 'transfer')
            AND EXTRACT(YEAR FROM transaction_date) = $2
          GROUP BY category`,
         [userId, year]
      );

      // Step 2: Average spending per category across all users
      const avgSpending = await pool.query(
         `SELECT category, 
                 AVG(total_spent) AS avg_spent
          FROM (
            SELECT user_id, categories.category_name AS category, SUM(transaction_amount) AS total_spent
            FROM transactions
            JOIN categories ON transactions.category_id = categories.id
            WHERE transaction_type IN ('expense', 'withdrawal', 'fee', 'transfer')
              AND EXTRACT(YEAR FROM transaction_date) = $1
            GROUP BY user_id, category
          ) AS user_totals
          GROUP BY category`
         , [year]
      );

      // Step 3: Merge results
      const avgMap: { [category: string]: number } = {};
      avgSpending.rows.forEach(row => {
         avgMap[row.category] = parseFloat(row.avg_spent);
      });

      const comparison = userSpending.rows.map(row => {
         const userSpent = parseFloat(row.user_spent);
         const avgSpent = avgMap[row.category] || 0;
         const status = userSpent > avgSpent ? 'higher' : 'lower';

         return {
            category: row.category,
            userSpent,
            avgSpent,
            status
         };
      });

      res.status(200).json({ categorySpending: comparison });
   } catch (error) {
      logger.error('Error fetching category insights:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

// get wealth insights
router.get('/wealth/:userId', async (req, res) => {
   const { userId } = req.params;

   try {
      // Get all financial accounts for the user
      const accounts = await pool.query(
         `SELECT account_name, account_type, account_balance, currency
          FROM accounts
          WHERE user_id = $1`,
         [userId]
      );

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

         const priceMap: { [symbol: string]: number } = {};
         let totalPercentChange = 0;
         let percentChangeCount = 0;
         cryptoPrices.data.forEach((coin: { symbol: string; quote: { USD: { price: number; percent_change_24h: number } } }) => {
            priceMap[coin.symbol] = coin.quote.USD.price * USD_TO_ZAR; // Convert to ZAR
            totalPercentChange += coin.quote.USD.percent_change_24h;
            percentChangeCount++;
         });

         // Calculate average percent change for all crypto coins
         percentChange = percentChangeCount > 0 ? totalPercentChange / percentChangeCount : 0;

         // Convert crypto balances to fiat
         cryptoAccounts.forEach(acc => {
            const symbol = acc.currency.toUpperCase();
            if (priceMap[symbol]) {
               acc.account_balance = (parseFloat(acc.account_balance) * priceMap[symbol]).toFixed(2);
               acc.account_type = 'crypto'; 

            }
         });
      }

      //  Aggregate wealth
      const accountDetails = accounts.rows;
      const totalBalance = accountDetails.reduce((acc, item) => acc + parseFloat(item.account_balance), 0);
      const changeZar = totalBalance * (percentChange / 100);

      // Format for chart frontend
      const chartData = {
         totalWealth: totalBalance,
         netWorth: totalBalance,
         breakdown: accountDetails.map(acc => ({
            name: acc.account_name,
            value: parseFloat(acc.account_balance),
            type: acc.account_type
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

// get semtiment analysis insights
router.get('/sentiment/:userId', async (req, res) => {
   const { userId } = req.params;
});

// get sentiment analysis insights wrapped
router.get('/sentiment/:month/:userId', async (req, res) => {
   const { userId } = req.params;   
   const month = parseInt(req.params.month, 10);
});

router.get('/score/:userId', async (req, res) => {
   const { userId } = req.params;

   
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
         [userId, year]
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