import {
  getRawTransactions,
  getRawGoals,
  getRawBudgets,
  getUserScore,
  radarChartInsights,
} from '../../modules/ai/services/insights.service';
import pool from '../../config/db';
import { logger } from '../../config/logger';

// --- Mocks (match your example style) ---
jest.mock('../../config/db');
jest.mock('../../config/logger', () => ({
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}));
// Stub Redis so tests never connect to a real instance
jest.mock('../../config/redis', () => ({
  redisClient: { get: jest.fn().mockResolvedValue(null), set: jest.fn() },
}));

const mockQuery = pool.query as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('insights.service', () => {
  describe('getRawTransactions', () => {
    it('returns rows for user + month + current year', async () => {
      const rows = [
        {
          date: '2025-05-01T00:00:00.000Z',
          description: 'Coffee',
          amount: 45,
          transaction_type: 'expense',
          category: 'restaurants',
        },
      ];
      mockQuery.mockResolvedValueOnce({ rows });
      const year = new Date().getFullYear();

      const res = await getRawTransactions('42', 5);

      expect(mockQuery).toHaveBeenCalledTimes(1);
      const [sql, params] = mockQuery.mock.calls[0];
      expect(typeof sql).toBe('string');
      expect(params).toEqual(['42', year, 5]);
      expect(res).toEqual(rows);
    });

    it('logs and rethrows on DB error', async () => {
      const err = new Error('DB down');
      mockQuery.mockRejectedValueOnce(err);
      await expect(getRawTransactions('42', 5)).rejects.toThrow('DB down');
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getRawGoals', () => {
    it('returns monthly goals for user', async () => {
      const rows = [
        {
          goal_id: 1,
          goal_name: 'Emergency Fund',
          goal_status: 'in-progress',
          target_amount: 10000,
          current_amount: 2500,
        },
      ];
      mockQuery.mockResolvedValueOnce({ rows });
      const year = new Date().getFullYear();

      const res = await getRawGoals('9', 7);

      expect(mockQuery).toHaveBeenCalledTimes(1);
      const [sql, params] = mockQuery.mock.calls[0];
      expect(typeof sql).toBe('string');
      expect(params).toEqual(['9', year, 7]);
      expect(res).toEqual(rows);
    });
  });

  describe('getRawBudgets', () => {
    it('returns budgets for user', async () => {
      const rows = [
        { budget_name: 'Food', current_amount: 0, category: 'groceries' },
        { budget_name: 'Rent', current_amount: 500, category: 'rent' },
      ];
      mockQuery.mockResolvedValueOnce({ rows });

      const res = await getRawBudgets('9');

      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(res).toEqual(rows);
    });
  });

  describe('getUserScore', () => {
    it('computes user + average scores and insights', async () => {
      // 1) per-user totals
      mockQuery.mockResolvedValueOnce({
        rows: [{ income: '1000', expenses: '600', investments: '100' }],
      });
      // 2) averages across users
      mockQuery.mockResolvedValueOnce({
        rows: [{ avg_income: '1500', avg_expenses: '900', avg_investments: '200' }],
      });

      const out = await getUserScore('u1');

      // user rates
      expect(out.savingsRate).toBeCloseTo(40.0, 1);
      expect(out.spendingRate).toBeCloseTo(60.0, 1);
      expect(out.investmentRate).toBeCloseTo(10.0, 1);

      // average rates
      expect(out.avgSavingsRate).toBeCloseTo(40.0, 1);
      expect(out.avgSpendingRate).toBeCloseTo(60.0, 1);
      expect(out.avgInvestmentRate).toBeCloseTo(13.3, 1);

      // composite scores
      expect(out.userScore).toBeCloseTo(30.0, 1);
      expect(out.avgUserScore).toBeCloseTo(31.1, 1);

      expect(out.insights.length).toBeGreaterThanOrEqual(3);
    });

    it('handles zero income safely', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ income: '0', expenses: '500', investments: '50' }],
      });
      mockQuery.mockResolvedValueOnce({
        rows: [{ avg_income: '1000', avg_expenses: '600', avg_investments: '100' }],
      });

      const out = await getUserScore('u2');
      expect(out.savingsRate).toBe(0);
      expect(out.spendingRate).toBe(0);
      expect(out.investmentRate).toBe(0);
    });

    it('logs and throws on internal error', async () => {
      const err = new Error('boom');
      mockQuery.mockRejectedValueOnce(err);
      await expect(getUserScore('u3')).rejects.toThrow('Internal server error');
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('radarChartInsights', () => {
    it('computes radar + global averages (no Redis cache)', async () => {
      // 1) transactions
      mockQuery.mockResolvedValueOnce({
        rows: [
          // income-ish
          { amount: 2000, transaction_type: 'income', category: 'salary', date: '2025-06-01' },
          { amount: 500, transaction_type: 'deposit', category: 'transfer in', date: '2025-06-03' },
          // expenses
          { amount: 1200, transaction_type: 'expense', category: 'groceries', date: '2025-06-05' },
          { amount: 100, transaction_type: 'fee', category: 'fees', date: '2025-06-09' },
          { amount: 120, transaction_type: 'withdrawal', category: 'cash withdrawal', date: '2025-06-11' },
          // investments (counted as investing)
          { amount: 300, transaction_type: 'expense', category: 'Investments', date: '2025-06-14' },
          // for last 6 months netflow stability
          { amount: 1800, transaction_type: 'income', category: 'salary', date: '2025-03-01' },
          { amount: 900, transaction_type: 'expense', category: 'rent', date: '2025-03-05' },
        ],
      });

      // 2) budgets
      mockQuery.mockResolvedValueOnce({
        rows: [
          { budget_id: 1, budget_name: 'Food', current_amount: 0, category: 'groceries' },
          { budget_id: 2, budget_name: 'Rent', current_amount: 100, category: 'rent' },
        ],
      });

      // 3) ai_scores
      mockQuery.mockResolvedValueOnce({ rows: [{ ai_score: 72 }] });

      // 4) heavy global averages (because redis.get returned null)
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            avg_savings_rate: 35,
            avg_investing_rate: 12,
            avg_smart_spending: 65,
            avg_budget_discipline: 58,
            avg_cash_flow_stability: 60,
            avg_financial_health: 63,
          },
        ],
      });

      const res = await radarChartInsights(7);

      expect(Array.isArray(res.radar)).toBe(true);
      expect(Array.isArray(res.radarAverage)).toBe(true);
      expect(res.radar).toHaveLength(6);
      expect(res.radarAverage).toHaveLength(6);

      const youSavings = res.radar.find((x: any) => x.axis === 'Savings Rate')!.value;
      const avgSavings = res.radarAverage.find((x: any) => x.axis === 'Savings Rate')!.value;
      expect(typeof youSavings).toBe('number');
      expect(avgSavings).toBe(35);
      // 4 DB calls total
      expect(mockQuery).toHaveBeenCalledTimes(4);
    });
  });
});
