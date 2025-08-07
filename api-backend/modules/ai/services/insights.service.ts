import pool from '../../../config/db';
import { logger } from '../../../config/logger';
import {redisClient } from '../../../config/redis';

// 1) Raw transactions for a given month
export async function getRawTransactions(userId: string, month: number) {
  const year = new Date().getFullYear();
  try {
  const { rows } = await pool.query(`
    SELECT
      transaction_date AS date,
      transaction_name AS description,
      transaction_amount AS amount,
      transaction_type,
      c.category_name AS category
    FROM transactions t
    JOIN categories c ON t.category_id = c.category_id
    JOIN accounts a ON t.account_id = a.account_id
    WHERE a.user_id = $1
      AND EXTRACT(YEAR FROM transaction_date) = $2
      AND EXTRACT(MONTH FROM transaction_date) = $3
    ORDER BY transaction_date
  `, [userId, year, month]);

  return rows;
  } catch (error) {
    logger.error('Error fetching raw transactions:', error);
    throw error;
  }
};

// 2) Raw goals for a given month
export async function getRawGoals(userId: string, month: number) {
  const year = new Date().getFullYear();
  try {
  const { rows } = await pool.query(`
    SELECT goal_id, goal_name, goal_status, target_amount, current_amount
    FROM goals
    WHERE user_id = $1
      AND EXTRACT(YEAR FROM start_date) = $2
      AND EXTRACT(MONTH FROM start_date) = $3
  `, [userId, year, month]);
  return rows;
  } catch (error) {
    logger.error('Error fetching raw goals:', error);
    throw error;
  }
};

// 3) Raw budgets
export async function getRawBudgets(userId: string) {
  const year = new Date().getFullYear();
  try {
    const { rows } = await pool.query(`
      SELECT b.budget_name, bc.current_amount, c.category_name AS category
      FROM budgets b
      JOIN budget_categories bc ON b.budget_id = bc.budget_id
      JOIN categories c ON bc.category_id = c.category_id
      WHERE b.user_id = $1
    `, [userId]);
    return rows;
  } catch (error) {
    logger.error('Error fetching raw budgets:', error);
    throw error;
  }
};

// Data insights service for fetching user insights
// services/insights.service.ts



interface UserScore {
  userScore: number;
  avgUserScore: number;
  savingsRate: number;
  avgSavingsRate: number;
  spendingRate: number;
  avgSpendingRate: number;
  investmentRate: number;
  avgInvestmentRate: number;
  insights: string[];
}

export async function getUserScore(userId: string): Promise<UserScore> {
  try {
    // 1) Per-user totals
    const { rows: u } = await pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN transaction_type IN ('income','deposit','transfer') THEN transaction_amount END),0) AS income,
        COALESCE(SUM(CASE WHEN transaction_type IN ('expense','withdrawal','fee') THEN transaction_amount END),0) AS expenses,
        COALESCE(SUM(CASE WHEN LOWER(category) = 'investment' THEN transaction_amount END),0) AS investments
      FROM transactions
      WHERE user_id = $1
    `, [userId]);
    const userIncome     = parseFloat(u[0].income) || 0;
    const userExpenses   = parseFloat(u[0].expenses) || 0;
    const userInvestments= parseFloat(u[0].investments)|| 0;

    // 2) All-users averages of those totals
    const { rows: a } = await pool.query(`
      SELECT
        AVG(income)       AS avg_income,
        AVG(expenses)     AS avg_expenses,
        AVG(investments)  AS avg_investments
      FROM (
        SELECT
          user_id,
          SUM(CASE WHEN transaction_type IN ('income','deposit','transfer') THEN transaction_amount END) AS income,
          SUM(CASE WHEN transaction_type IN ('expense','withdrawal','fee') THEN transaction_amount END)     AS expenses,
          SUM(CASE WHEN LOWER(category) = 'investment' THEN transaction_amount END)                       AS investments
        FROM transactions
        GROUP BY user_id
      ) t
    `);
    const avgIncome      = parseFloat(a[0].avg_income)      || 0;
    const avgExpenses    = parseFloat(a[0].avg_expenses)    || 0;
    const avgInvestments = parseFloat(a[0].avg_investments) || 0;

    // 3) Compute rates (0–100)
    const savingsRate   = userIncome > 0 ? ((userIncome - userExpenses) / userIncome) * 100 : 0;
    const spendingRate  = userIncome > 0 ? (userExpenses / userIncome) * 100 : 0;
    const investmentRate= userIncome > 0 ? (userInvestments / userIncome) * 100 : 0;

    const avgSavingsRate   = avgIncome > 0 ? ((avgIncome - avgExpenses) / avgIncome) * 100 : 0;
    const avgSpendingRate  = avgIncome > 0 ? (avgExpenses / avgIncome) * 100 : 0;
    const avgInvestmentRate= avgIncome > 0 ? (avgInvestments / avgIncome) * 100 : 0;

    // 4) Composite scores
    //    simple average of the three rates
    const userScore    = (savingsRate + (100 - spendingRate) + investmentRate) / 3;
    const avgUserScore = (avgSavingsRate + (100 - avgSpendingRate) + avgInvestmentRate) / 3;

    // 5) Insights based on comparisons
    const insights: string[] = [];
    insights.push(
      savingsRate >= avgSavingsRate
        ? "Your savings rate is above average."
        : "Your savings rate is below average."
    );
    insights.push(
      spendingRate <= avgSpendingRate
        ? "You spend less of your income than most users."
        : "You spend more of your income than most users."
    );
    insights.push(
      investmentRate >= avgInvestmentRate
        ? "Your investment rate is at or above average."
        : "Your investment rate is below average."
    );
    insights.push(
      userScore >= avgUserScore
        ? `Overall, your financial health score (${userScore.toFixed(1)}) is above the average (${avgUserScore.toFixed(1)}).`
        : `Overall, your financial health score (${userScore.toFixed(1)}) is below the average (${avgUserScore.toFixed(1)}).`
    );

    return {
      userScore:    +userScore.toFixed(1),
      avgUserScore: +avgUserScore.toFixed(1),
      savingsRate:    +savingsRate.toFixed(1),
      avgSavingsRate: +avgSavingsRate.toFixed(1),
      spendingRate:    +spendingRate.toFixed(1),
      avgSpendingRate: +avgSpendingRate.toFixed(1),
      investmentRate:    +investmentRate.toFixed(1),
      avgInvestmentRate: +avgInvestmentRate.toFixed(1),
      insights
    };
  } catch (err) {
    logger.error("Error in getUserScore:", err);
    throw new Error("Internal server error");
  }
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

  const topCategory = getTopSpendingCategory(transactions);
  const largestTransaction = getLargestTransaction(transactions);
  const budgetEfficiency = computeBudgetEfficiency(budgets, transactions);
  const goalStats = computeGoalSummary(goals);

  const impulseScore = detectImpulseScore(transactions);

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
    sentiment,
    summaryText: generateSummaryText(sentiment, topCategory, goalStats)
  };
}

export async function radarChartInsights(userId: number) {
  try {
    // 1. Get transactions
    const { rows: transactions } = await pool.query(`
      SELECT transaction_amount AS amount, transaction_type, category_name AS category
      FROM transactions
      JOIN categories ON transactions.category_id = categories.category_id
      WHERE user_id = $1
    `, [userId]);

    // 2. Get budgets
    const { rows: budgets } = await pool.query(`
      SELECT b.budget_id, b.budget_name, bc.current_amount, c.category_name AS category
      FROM budgets b
      JOIN budget_categories bc ON b.budget_id = bc.budget_id
      JOIN categories c ON bc.category_id = c.category_id
      WHERE b.user_id = $1
    `, [userId]);

    // 3. Get AI score (already calculated previously)
    const { rows: scoreRes } = await pool.query(`
      SELECT ai_score
      FROM user_scores
      WHERE user_id = $1
    `, [userId]);

    const income = transactions
      .filter(t => t.transaction_type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const expenses = transactions
      .filter(t => t.transaction_type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    const impulseCount = transactions.filter(
      t => t.transaction_type === 'expense' && parseFloat(t.amount) < 150
    ).length;

    const impulseScore = Math.min(impulseCount / 10, 1.0) * 100; // scale to 100

    const smartSpending = 100 - impulseScore;

    const underBudget = budgets.filter(b => parseFloat(b.current_amount) <= 0).length;
    const totalBudgets = budgets.length;
    const budgetDiscipline = totalBudgets > 0 ? (underBudget / totalBudgets) * 100 : 50;

    // category investments, crypto purchase, crypto sale, forex, dividends to calculate investing rate
    const investmentTransactions = transactions.filter(t =>
      t.category === 'Investments' ||
      t.category === 'Crypto Purchase' ||
      t.category === 'Crypto Sale' ||
      t.category === 'Forex' ||
      t.category === 'Dividends'
    );

    const totalInvestment = investmentTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalIncomeForInvesting = income > 0 ? income : 1; // Avoid division by zero
    const investingRate = (totalInvestment / totalIncomeForInvesting) * 100;

    const financialLiteracy = 70; // Placeholder — can integrate with learning module table

    const financialHealthScore = scoreRes.length ? parseFloat(scoreRes[0].ai_score) : 50;

    return {
      radar: [
        { axis: "Savings Rate", value: Math.round(savingsRate) },
        { axis: "Investing Rate", value: investingRate },
        { axis: "Smart Spending", value: Math.round(smartSpending) },
        { axis: "Spending Discipline", value: Math.round(budgetDiscipline) },
        { axis: "Financial Literacy", value: financialLiteracy },
        { axis: "Financial Health", value: Math.round(financialHealthScore) }
      ]
    };

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

function generateSummaryText(
  sentiment: any,
  topCategory: TopSpendingCategory | null,
  goalStats: GoalSummary
): string {
  const goalText =
    goalStats.created > 0
      ? `You set ${goalStats.created} goal${goalStats.created > 1 ? 's' : ''} and completed ${goalStats.completed}.`
      : `No goals set this month.`;

  const topCategoryText = topCategory
    ? `Your top spending category: ${topCategory.name} (R${topCategory.amount.toLocaleString()})`
    : `No spending categories found.`;

  const sentimentText = sentiment && sentiment.label
    ? `Financial Sentiment: ${sentiment.label}. ${sentiment.summary || ''}`
    : `Financial Sentiment: Data not available.`;

  return [
    goalText,
    topCategoryText,
    sentimentText
  ].join(' ');
}

function analyzeFinancialSentiment({
  savings_rate,
  burn_rate,
  goal_completion_ratio,
  impulse_score,
  budget_usage_variance
}: {
  savings_rate: number;
  burn_rate: number;
  goal_completion_ratio: number;
  impulse_score: number;
  budget_usage_variance: number;
}) {
  // Simple scoring logic based on weighted factors
  let score = 0;
  score += savings_rate * 40; // Savings is important
  score += goal_completion_ratio * 20; // Goal completion
  score += (1 - impulse_score) * 15; // Less impulse, better
  score += (100 - Math.min(budget_usage_variance, 100)) * 15; // Lower variance, better

  // Burn rate: lower is better
  score += (100 - Math.min(burn_rate, 100)) * 10;

  // Normalize score to 0-100
  score = Math.max(0, Math.min(Math.round(score / 100), 100));

  let label = 'Stable';
  let summary = 'You\'re building consistency and control.';

  if (score >= 80) {
    label = 'Excellent';
    summary = 'Your financial habits are outstanding!';
  } else if (score >= 60) {
    label = 'Good';
    summary = 'You\'re on track with your financial goals.';
  } else if (score >= 40) {
    label = 'Stable';
    summary = 'You\'re building consistency and control.';
  } else if (score >= 20) {
    label = 'Caution';
    summary = 'Consider reviewing your spending and savings habits.';
  } else {
    label = 'Risk';
    summary = 'Your financial health needs attention.';
  }

  return {
    label,
    score,
    summary
  };
}
