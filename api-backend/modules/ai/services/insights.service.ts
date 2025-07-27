import pool from '../../../config/db';
import { logger } from '../../../config/logger';
import {redisClient } from '../../../config/redis';

// Data insights service for fetching user insights
export async function getUserScore(userId: string) {
   // calculate user score based on transactions

   // calculate avg user score based on all users

   // calculate savings rate with user vs avg user savings rate

   // calculate spending rate with user vs avg user spending rate

   // calculate investment rate with user vs avg user investment rate


   // show insights based on the above calculations

   return {
      userScore: 0, // Placeholder for user score calculation
      avgUserScore: 0, // Placeholder for average user score calculation
      savingsRate: 0, // Placeholder for savings rate calculation
      avgSavingsRate: 0, // Placeholder for average savings rate calculation
      spendingRate: 0, // Placeholder for spending rate calculation
      avgSpendingRate: 0, // Placeholder for average spending rate calculation
      investmentRate: 0, // Placeholder for investment rate calculation
      avgInvestmentRate: 0 // Placeholder for average investment rate calculation
   };

}

export async function getUserInsightsWrapped(userId: string, month: number) {
   try {
  // 1. Get transactions from DB for that user/month

  // 2. Get goals & budget activity

  // 3. Generate feature vector

  // 4. Run sentiment engine

  // 5. Build summary response


  /*
   "You set 4 goals and crushed 2 of them. Fastest: Emergency Fund (3 weeks early!)"

 "Your top spending category: Dining (R3,820)"

 "Biggest splurge: R2,100 @ Takealot on July 15th"

 "Savings Rate: 18% — higher than 70% of users your age!"

 "Financial Sentiment: Stable. You’re building consistency and control."

 "Best Week: Week 2 — 3-day no-spend streak and budget adherence!"
   */
   } catch (error) {
      logger.error('Error fetching user insights:', error);
      throw error;
   }
}

export async function generateWrappedInsights(userId: string, month: number ) {
  const currentYear = new Date().getFullYear();

  // Fetch transactions for the month
  const { rows: transactions } = await pool.query(
    `SELECT amount, category, description, transaction_type, transaction_date
     FROM transactions
     WHERE user_id = $1
     AND EXTRACT(MONTH FROM transaction_date) = $2
     AND EXTRACT(YEAR FROM transaction_date) = $3`,
    [userId, month, currentYear]
  );

  // Fetch goals and budgets
  const { rows: goals } = await pool.query(
    `SELECT * FROM goals WHERE user_id = $1 AND EXTRACT(MONTH FROM start_date) = $2`,
    [userId, month]
  );

  const { rows: budgets } = await pool.query(
    `SELECT * FROM budgets WHERE user_id = $1`,
    [userId]
  );

  // === Derived Insights ===

  const totalSpent = transactions
    .filter(tx => tx.transaction_type === 'expense')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const totalIncome = transactions
    .filter(tx => tx.transaction_type === 'income')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpent) / totalIncome) : 0;

  const burnRate = totalSpent / 30;
  const runwayDays = totalIncome > 0 ? (totalIncome / burnRate) : 0;
/*
  const topCategory = getTopSpendingCategory(transactions);
  const largestTransaction = getLargestTransaction(transactions);
  const budgetEfficiency = computeBudgetEfficiency(budgets, transactions);
  const goalStats = computeGoalSummary(goals);

  const impulseScore = detectImpulseScore(transactions);
  const recurringCharges = detectRecurringCharges(transactions);

  const sentiment = analyzeFinancialSentiment({
    savings_rate: savingsRate,
    burn_rate: burnRate,
    goal_completion_ratio: goalStats.completionRatio,
    impulse_score: impulseScore,
    budget_usage_variance: budgetEfficiency.variance
  });

  return {
    month,
    totalSpent,
    totalIncome,
    savingsRate: Math.round(savingsRate * 100),
    burnRate: Math.round(burnRate),
    runwayDays: Math.round(runwayDays),
    topCategory,
    largestTransaction,
    budgetEfficiency,
    goalStats,
    impulseScore,
    recurringCharges,
    sentiment,
    summaryText: generateSummaryText(sentiment, topCategory, goalStats)
  };
  */
}

export async function radarChartInsights(userId: number) {
  // get savings rate
  // get investing rate
  // get smart spending
  // get spending discipline
  // get financial literacy state
  // get financial health score

  try {
    const { rows: accounts } = await pool.query(
      `SELECT account_name, account_balance, account_type FROM accounts WHERE user_id = $1`,
      [userId]
    );

    if (accounts.length === 0) {
      return { error: 'No accounts found for this user' };
    }

      // Calculate 24h percent change
      const percentChange = 0; // Placeholder for actual calculation logic


      

  } catch (error) {
    logger.error('Error fetching radar chart insights:', error);
    throw new Error('Internal server error');
  }
}

interface Transaction {
   amount:  number;
   category: string;
   description?: string;
   transaction_type: string;
   transaction_date?: string | Date;
}

interface TopSpendingCategory {
   name: string;
   amount: number;
}

function getTopSpendingCategory(transactions: Transaction[]): TopSpendingCategory | null {
   const categoryMap: Record<string, number> = {};

   transactions.forEach((tx: Transaction) => {
      if (tx.transaction_type === 'expense') {
         categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
      }
   });

   const sorted = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
   return sorted.length > 0 ? { name: sorted[0][0], amount: sorted[0][1] } : null;
}

function getLargestTransaction(transactions: Transaction[]) {
  const maxTx = transactions.reduce((max, tx) =>
    tx.amount > max.amount ? tx : max,
    { amount: 0 }
  );
  return maxTx;
}

interface Budget {
  category_id: string;
  amount: number ;
  [key: string]: any;
}

function computeBudgetEfficiency(budgets: Budget[], transactions: Transaction[]) {
  const usage: Record<string, { limit: number; spent: number }> = {};

  budgets.forEach(budget => {
    usage[budget.category_id] = {
      limit: (budget.amount),
      spent: 0
    };
  });

  transactions.forEach(tx => {
    if (tx.transaction_type === 'expense' && usage[tx.category]) {
      usage[tx.category].spent += tx.amount;
    }
  });

  const stats = Object.values(usage);
  const efficiency = stats.map(b => (b.spent / b.limit) * 100);
  const avg = efficiency.reduce((a, b) => a + b, 0) / efficiency.length;
  const variance = stdDev(efficiency);

  return {
    average: Math.round(avg),
    variance: Math.round(variance),
    categoriesUnderBudget: stats.filter(b => b.spent <= b.limit).length,
    totalCategories: stats.length
  };
}

function stdDev(arr: number[]): number {
   const mean = arr.reduce((a, b) => a + b) / arr.length;
   return Math.sqrt(arr.map(x => (x - mean) ** 2).reduce((a, b) => a + b) / arr.length);
}


interface Goal {
   id?: string;
   user_id?: string;
   name?: string;
   status: string;
   start_date?: string | Date;
   end_date?: string | Date;
   [key: string]: any;
}

interface GoalSummary {
   created: number;
   completed: number;
   completionRatio: number;
}

function computeGoalSummary(goals: Goal[]): GoalSummary {
   const completed = goals.filter((g: Goal) => g.status === 'completed');
   return {
      created: goals.length,
      completed: completed.length,
      completionRatio: goals.length > 0 ? completed.length / goals.length : 0
   };
}

function detectImpulseScore(transactions: Transaction[]): number {
  const smallExpenses = transactions.filter(tx =>
    tx.transaction_type === 'expense' && tx.amount < 150
  );
  return Math.min(smallExpenses.length / 10, 1.0); // Cap at 1.0
}

// LLM insights service