import express from 'express';
import bodyParser from 'body-parser';
import request from 'supertest';
import axios from 'axios';

import pool from '../../config/db';
import { logger } from '../../config/logger';
import insightsRouter from '../../modules/ai/routes/insightsRouter';
import * as insights from '../../modules/ai/services/insights.service';
import { redisClient } from '../../config/redis';

// ── Mocks (match your example style) ───────────────────────────────────────────
// ⬇️ add near the other jest.mocks
jest.mock('../../config/redis', () => {
   const get = jest.fn();
   const set = jest.fn();
   const connect = jest.fn();
   const disconnect = jest.fn();
   const on = jest.fn();
   return {
      redisClient: { get, set, connect, disconnect, on, isOpen: true },
   };
});


jest.mock('../../config/db');
jest.mock('../../config/logger', () => ({
   logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}));
jest.mock('axios');
jest.mock('../../modules/ai/services/insights.service');

const mockQuery = pool.query as jest.Mock;
const mockAxios = axios as jest.Mocked<typeof axios>;
const svc = insights as jest.Mocked<typeof insights>;

// Local app with only the insights router mounted
const app = express();
app.use(bodyParser.json());
app.use('/api/insights', insightsRouter);

beforeEach(() => {
   jest.clearAllMocks();
   // Make sure crypto path in /wealth is skipped (no external fetch)
   delete (process.env as any).CMC_APIKEY;
});

describe('Insights API Integration Tests', () => {
   describe('GET /api/insights/transactions/:userId', () => {
      it('returns income/expense per month + global averages', async () => {
         // 1) Grouped per user rows
         mockQuery
            .mockResolvedValueOnce({
               rows: [
                  { month: 1, account_name: 'Main', income: '1500', expense: '900' },
                  { month: 2, account_name: 'Main', income: '1000', expense: '800' },
               ],
            })
            // 2) Global averages (by month)
            .mockResolvedValueOnce({
               rows: [
                  { month: 1, avg_income: '3000', avg_expense: '1800' },
                  { month: 2, avg_income: '2000', avg_expense: '1600' },
               ],
            })
            // 3) User count
            .mockResolvedValueOnce({ rows: [ { user_count: 3 } ] });

         const res = await request(app).get('/api/insights/transactions/9').expect(200);

         expect(res.body.userId).toBe('9');
         expect(res.body.insights).toEqual(
            expect.arrayContaining([
               expect.objectContaining({ month: 1, accountName: 'Main', income: 1500, expense: 900 }),
            ])
         );

         const janAvg = res.body.globalAvg.monthlyAverages.find((m: any) => String(m.month) === '1');
         expect(janAvg.avgIncome).toBeCloseTo(3000 / 3, 5);
         expect(janAvg.avgExpense).toBeCloseTo(1800 / 3, 5);
      });

      it('404 when no rows', async () => {
         mockQuery.mockResolvedValueOnce({ rows: [] });
         const res = await request(app).get('/api/insights/transactions/9').expect(404);
         expect(res.body.error).toMatch(/No transactions/i);
      });
   });

   describe('GET /api/insights/transactions/heatmap/:userId', () => {
      it('cache miss → hits DB, caches, returns mapped rows', async () => {
         // cache miss
         (redisClient.get as jest.Mock).mockResolvedValueOnce(null);

         // DB rows shape expected by route (day, transactions, total_spent)
         mockQuery.mockResolvedValueOnce({
            rows: [
               { day: '2025-08-01', transactions: 4, total_spent: 250.5 },
               { day: '2025-08-02', transactions: 2, total_spent: 99.99 },
            ],
         });

         const res = await request(app)
            .get('/api/insights/transactions/heatmap/9')
            .expect(200);

         expect(res.body).toEqual([
            { date: '2025-08-01', transactions: 4, amount: 250.5 },
            { date: '2025-08-02', transactions: 2, amount: 99.99 },
         ]);

         // set was called to cache the DB result
         expect(redisClient.set).toHaveBeenCalled();
      });

      it('cache hit → returns cached and bypasses DB', async () => {
         // cached value MUST be a JSON string that parses to the same "DB rows" shape (with `day`)
         (redisClient.get as jest.Mock).mockResolvedValueOnce(
            JSON.stringify([ { day: '2025-07-31', transactions: 3, total_spent: 120 } ])
         );

         const res = await request(app)
            .get('/api/insights/transactions/heatmap/9')
            .expect(200);

         // DB not called on cache hit
         expect(mockQuery).not.toHaveBeenCalled();

         expect(res.body).toEqual([
            { date: '2025-07-31', transactions: 3, amount: 120 },
         ]);
      });
   });

   describe('GET /api/insights/category/:userId', () => {
       it('merges user totals with cached averages', async () => {
    // 1) DB returns the user’s per-category totals for a month
    //    This is the FIRST query in the route.
    mockQuery.mockResolvedValueOnce({
      rows: [
        // month is 1..12 from SQL EXTRACT(MONTH...)
        { month: 6, account_name: 'Checking', category: 'subscriptions', user_spent: '1200.50' },
        { month: 6, account_name: 'Checking', category: 'groceries',     user_spent: '800.00'   },
      ],
    });

    // 2) Redis cache HIT for averages (so the route will NOT run the second SQL)
    //    IMPORTANT: the cached JSON must be an ARRAY of rows with keys:
    //    { month: number, category: string, avg_spent: number|string }
    (redisClient.get as jest.Mock).mockResolvedValueOnce(
      JSON.stringify([
        { month: 6, category: 'subscriptions', avg_spent: 2000.75 },
        { month: 6, category: 'groceries',     avg_spent: 1500    },
      ])
    );

    const res = await request(app).get('/api/insights/category/9').expect(200);

    // Only the first query (user totals) should have run
    expect(mockQuery).toHaveBeenCalledTimes(1);
    // No new cache set on a hit path
    expect(redisClient.set).not.toHaveBeenCalled();

    // Expected shape from the router
    expect(res.body).toEqual({
      spendingData: [
        {
          month: 'Jun',
          accounts: {
            Checking: {
              subscriptions: 1200.5,
              groceries: 800,
            },
          },
          totals: {
            subscriptions: 1200.5,
            groceries: 800,
          },
          averages: {
            subscriptions: 2000.75,
            groceries: 1500,
          },
          comparisons: {
            subscriptions: 'lower', // 1200.5 < 2000.75
            groceries: 'lower',     // 800 < 1500
          },
        },
      ],
    });
  });
   });

   describe('GET /api/insights/wealth/:userId', () => {
      it('returns fiat-only wealth breakdown (no crypto path)', async () => {
         mockQuery.mockResolvedValueOnce({
            rows: [
               {
                  account_name: 'Main',
                  account_type: 'bank',
                  account_balance: '5000',
                  currency: 'ZAR',
                  current_month_income: '1000',
                  current_month_expense: '300',
               },
               {
                  account_name: 'Savings',
                  account_type: 'bank',
                  account_balance: '1500',
                  currency: 'ZAR',
                  current_month_income: '0',
                  current_month_expense: '0',
               },
            ],
         });

         const res = await request(app).get('/api/insights/wealth/9').expect(200);
         expect(res.body.totalWealth).toBe(6500);
         expect(res.body.change_24h_percent).toBe(0);
         expect(res.body.breakdown).toHaveLength(2);
      });
   });

   describe('GET /api/insights/radar/:userId', () => {
      it('merges user vs average series', async () => {
         svc.radarChartInsights.mockResolvedValueOnce({
            radar: [
               { axis: 'Savings Rate', value: 40 },
               { axis: 'Investing Rate', value: 12 },
            ],
            radarAverage: [
               { axis: 'Savings Rate', value: 35 },
               { axis: 'Investing Rate', value: 10 },
            ],
         } as any);

         const res = await request(app).get('/api/insights/radar/9').expect(200);
         expect(res.body.radar).toEqual([
            { axis: 'Savings Rate', user: 40, average: 35 },
            { axis: 'Investing Rate', user: 12, average: 10 },
         ]);
      });

      it('400 for invalid userId', async () => {
         await request(app).get('/api/insights/radar/not-a-number').expect(400);
      });

      it('404 when service returns empty', async () => {
         svc.radarChartInsights.mockResolvedValueOnce({} as any);
         const res = await request(app).get('/api/insights/radar/9').expect(404);
         expect(res.body.error).toMatch(/No radar data/i);
      });
   });

   describe('GET /api/insights/sentiment/user/:userId/:month', () => {
      it('builds userData and proxies to Python', async () => {
         svc.getRawTransactions.mockResolvedValueOnce([
            {
               date: '2025-07-10T10:00:00.000Z',
               amount: 100,
               transaction_type: 'expense',
               category: 'groceries',
               description: 'x',
            },
         ] as any);
         svc.getRawGoals.mockResolvedValueOnce([
            { goal_id: 1, goal_name: 'EF', goal_status: 'in-progress', target_amount: '5000', current_amount: '1200' },
         ] as any);
         svc.getRawBudgets.mockResolvedValueOnce([ { category: 'groceries', current_amount: '0' } ] as any);

         mockAxios.post.mockResolvedValueOnce({ data: { sentiment: 'Stable', summaryText: 'OK' } } as any);

         const res = await request(app).get('/api/insights/sentiment/user/9/7').expect(200);
         expect(res.body.sentiment).toBe('Stable');

         // verify the date normalization (+00:00)
         const [ , postedBody ] = (mockAxios.post.mock.calls[ 0 ] as any[]).slice(0, 2);
         expect(postedBody.transactions[ 0 ].date.endsWith('+00:00')).toBe(true);
      });
   });

   describe('GET /api/insights/sentiment/user/:userId', () => {
      it('proxies to Python current-month endpoint', async () => {
         mockAxios.get.mockResolvedValueOnce({ data: { sentiment: 'Confident' } } as any);
         const res = await request(app).get('/api/insights/sentiment/user/9').expect(200);
         expect(res.body.sentiment).toBe('Confident');
         expect(mockAxios.get).toHaveBeenCalled();
      });
   });

   describe('GET /api/insights/trends/:userId', () => {
      const RealDate = Date;

      beforeAll(() => {
         // Freeze "now" so loop runs Jan..Aug (8 months)
         (global as any).Date = class extends RealDate {
            constructor(...args: any[]) {
               super(...args as []);
               if (args.length) return new RealDate(...args as []);
               return new RealDate('2025-08-15T12:00:00Z');
            }
            static now() { return new RealDate('2025-08-15T12:00:00Z').valueOf(); }
         } as unknown as DateConstructor;
      });

      afterAll(() => {
         (global as any).Date = RealDate;
      });

      it('aggregates months and posts to Python /insights/trends', async () => {
         svc.getRawTransactions.mockImplementation(async (_uid: string, m: number) => ([
            { date: `2025-${String(m).padStart(2, '0')}-05T00:00:00.000Z`, amount: 100, transaction_type: 'expense', category: 'utilities' },
         ] as any));
         svc.getRawGoals.mockResolvedValue([] as any);
         svc.getRawBudgets.mockResolvedValue([ { category: 'utilities', current_amount: '0' } ] as any);

         mockAxios.post.mockResolvedValueOnce({ data: { globalTrend: { months: [ 'Jan' ], spending: [ 100 ] } } } as any);

         const res = await request(app).get('/api/insights/trends/9').expect(200);
         expect(res.body.globalTrend.spending).toBeDefined();
         // called once with aggregated payload
         expect(mockAxios.post).toHaveBeenCalledTimes(1);
      });
   });

   describe('GET /api/insights/score/:userId', () => {
      it('returns user score object (route currently returns non-awaited value)', async () => {
         // Route doesn't await, so return a plain object (not a Promise)
         svc.getUserScore.mockReturnValue({
            userScore: 70,
            avgUserScore: 65,
            savingsRate: 20,
            avgSavingsRate: 18,
            spendingRate: 65,
            avgSpendingRate: 70,
            investmentRate: 15,
            avgInvestmentRate: 12,
            insights: [ 'OK' ],
         } as any);

         const res = await request(app).get('/api/insights/score/9').expect(200);
         expect(res.body.userScore).toBe(70);
      });
   });
});