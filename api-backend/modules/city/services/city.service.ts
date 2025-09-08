// modules/city/services/city.service.ts
import { BUILDING_BINDINGS_STATIC } from './buildingMappings';
import { BuildingTooltip, StaticBindingMeta } from './type';
import pool from '../../../config/db'; // uses your default export
import { logger } from '../../../config/logger';

// Optional Redis cache (no-op if not present)
let redis: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { redisClient } = require('../../../config/redis');
  redis = redisClient;
} catch {
  /* ignore */
}

// -------- Category group mapping (FILL THESE) --------
const categoryIdsBySlug: Record<string, number[]> = {
  groceries: [],       // e.g. [101, 102]
  health:    [],
  home:      [],
  personal:  [],
  entertainment: [],
  subscriptions: [],
  utilities: [],
};

// ---------- Helpers ----------
type KV = Record<string, string | number | null>;

const MONEY = (n: number | null | undefined, currency = 'R') =>
  (n ?? 0).toLocaleString('en-ZA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).replace(/^/, currency);

const PCT = (p: number | null | undefined) => `${Math.round((p ?? 0) * 100)}%`;

// Date windows use transactions.transaction_date (timestamp without tz)
const MTD_CONDITION = `
  tx.transaction_date >= date_trunc('month', now())
  AND tx.transaction_date < now()
`;
const LAST_7D_CONDITION = `
  tx.transaction_date >= now() - interval '7 days'
`;

async function tryGet<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn(); } catch (e) { logger?.warn?.('city.service tryGet fallback', e); return fallback; }
}

// ---------- Transactions-based metrics (schema-correct) ----------
async function getIncomeMTD(userId: number): Promise<number> {
  return tryGet(async () => {
    const { rows } = await pool.query(
      `SELECT COALESCE(SUM(tx.transaction_amount),0)::numeric AS v
       FROM transactions tx
       JOIN accounts a ON a.account_id = tx.account_id
       WHERE a.user_id = $1
         AND ${MTD_CONDITION}
         AND tx.transaction_type = 'income'`,
      [userId]
    );
    return Number(rows[0]?.v ?? 0);
  }, 0);
}

async function getExpensesMTD(userId: number): Promise<number> {
  return tryGet(async () => {
    const { rows } = await pool.query(
      `SELECT COALESCE(SUM(tx.transaction_amount),0)::numeric AS v
       FROM transactions tx
       JOIN accounts a ON a.account_id = tx.account_id
       WHERE a.user_id = $1
         AND ${MTD_CONDITION}
         AND tx.transaction_type = 'expense'`,
      [userId]
    );
    return Number(rows[0]?.v ?? 0);
  }, 0);
}

async function getSpendMTDByCats(userId: number, catIds: number[]): Promise<number> {
  if (!catIds?.length) return 0;
  return tryGet(async () => {
    const { rows } = await pool.query(
      `SELECT COALESCE(SUM(tx.transaction_amount),0)::numeric AS v
       FROM transactions tx
       JOIN accounts a ON a.account_id = tx.account_id
       WHERE a.user_id = $1
         AND ${MTD_CONDITION}
         AND tx.transaction_type = 'expense'
         AND tx.category_id = ANY($2::int[])`,
      [userId, catIds]
    );
    return Number(rows[0]?.v ?? 0);
  }, 0);
}

async function getVisitsLast7d(userId: number, catIds: number[]): Promise<number> {
  if (!catIds?.length) return 0;
  return tryGet(async () => {
    const { rows } = await pool.query(
      `SELECT COUNT(DISTINCT DATE(tx.transaction_date))::int AS v
       FROM transactions tx
       JOIN accounts a ON a.account_id = tx.account_id
       WHERE a.user_id = $1
         AND ${LAST_7D_CONDITION}
         AND tx.transaction_type = 'expense'
         AND tx.category_id = ANY($2::int[])`,
      [userId, catIds]
    );
    return Number(rows[0]?.v ?? 0);
  }, 0);
}

async function getBudgetForName(userId: number, budgetName: string): Promise<number> {
  // Your budgets table has no amount in the provided schema.
  // Log a warning once and return 0 to keep the API stable.
  logger?.warn?.(`[city.service] budgets has no 'amount' column; returning 0 for '${budgetName}'`);
  return 0;
}
async function getBudgetForCats(userId: number, slug: keyof typeof categoryIdsBySlug): Promise<number> {
  return getBudgetForName(userId, slug);
}

// ---------- Goals / progress ----------
async function getGoalsStats(userId: number): Promise<{ active: number; completionPct: number; streakWeeks: number; autoContrib: number; }> {
  return tryGet(async () => {
    const { rows: activeRows } = await pool.query(
      `SELECT COUNT(*)::int AS v
       FROM goals g
       WHERE g.user_id = $1 AND g.goal_status = 'in-progress'`,
      [userId]
    );

    const { rows: compRows } = await pool.query(
      `SELECT COALESCE(AVG(LEAST(g.current_amount / NULLIF(g.target_amount,0), 1.0)), 0)::numeric AS v
       FROM goals g
       WHERE g.user_id = $1`,
      [userId]
    );

    const { rows: autoRows } = await pool.query(
      `SELECT COALESCE(SUM(gp.amount_added),0)::numeric AS v
       FROM goal_progress gp
       JOIN goals g ON g.goal_id = gp.goal_id
       WHERE g.user_id = $1
         AND gp.progress_date >= date_trunc('month', now())::date
         AND gp.progress_date <= now()::date`,
      [userId]
    );

    const { rows: streakRows } = await pool.query(
      `SELECT COALESCE(COUNT(*),0)::int AS v
       FROM (
         SELECT date_trunc('week', gp.progress_date)::date wk, COUNT(*) cnt
         FROM goal_progress gp
         JOIN goals g ON g.goal_id = gp.goal_id
         WHERE g.user_id = $1
           AND gp.progress_date > (now() - interval '12 weeks')::date
         GROUP BY 1
       ) w WHERE w.cnt > 0`,
      [userId]
    );

    return {
      active: Number(activeRows[0]?.v ?? 0),
      completionPct: Number(compRows[0]?.v ?? 0),
      streakWeeks: Number(streakRows[0]?.v ?? 0),
      autoContrib: Number(autoRows[0]?.v ?? 0),
    };
  }, { active: 0, completionPct: 0, streakWeeks: 0, autoContrib: 0 });
}

// Health EF (heuristic via goal names/types)
async function getHealthEFpct(userId: number): Promise<number> {
  return tryGet(async () => {
    const { rows } = await pool.query(
      `SELECT COALESCE(AVG(LEAST(g.current_amount / NULLIF(g.target_amount,0), 1.0)), 0)::numeric AS v
       FROM goals g
       WHERE g.user_id = $1 AND g.goal_type = 'savings' AND g.goal_name ILIKE '%health%'`,
      [userId]
    );
    return Number(rows[0]?.v ?? 0);
  }, 0);
}

async function getRepairsTopup(userId: number): Promise<number> {
  return tryGet(async () => {
    const { rows } = await pool.query(
      `SELECT COALESCE(SUM(gp.amount_added),0)::numeric AS v
       FROM goal_progress gp
       JOIN goals g ON g.goal_id = gp.goal_id
       WHERE g.user_id = $1
         AND g.goal_name ILIKE '%repair%'
         AND gp.progress_date >= date_trunc('month', now())::date
         AND gp.progress_date <= now()::date`,
      [userId]
    );
    return Number(rows[0]?.v ?? 0);
  }, 0);
}

// ---------- Learning (optional; safe if table not present) ----------
async function getLessonsCount(): Promise<number> { return 0; }

async function getQuizAvg(userId: number): Promise<number> {
  return tryGet(async () => {
    const sql = `
      SELECT COALESCE(AVG(q.attempt_score), 0)::numeric AS v
      FROM quiz_attempts q
      WHERE q.user_id = $1
    `;
    const { rows } = await pool.query(sql, [userId]);
    return Number(rows[0]?.v ?? 0);
  }, 0);
}

async function getLearnStreak(userId: number): Promise<number> {
  return tryGet(async () => {
    const sql = `
      SELECT COALESCE(COUNT(*), 0)::int AS v
      FROM quiz_attempts q
      WHERE q.user_id = $1
    `;
    const { rows } = await pool.query(sql, [userId]);
    return Number(rows[0]?.v ?? 0);
  }, 0);
}

// ---------- Utilities (derived from transactions) ----------
async function getUtilities(userId: number): Promise<{ avgPerDay: number; waterTrendPct: number; offpeakDays7d: number; }> {
  const utilCats = categoryIdsBySlug.utilities || [];
  const spendMTD = await getSpendMTDByCats(userId, utilCats);
  const daysElapsed = new Date().getDate();
  const avgPerDay = daysElapsed ? spendMTD / daysElapsed : 0;

  const waterTrendPct = await tryGet(async () => {
    if (!utilCats.length) return 0;
    const { rows: r1 } = await pool.query(
      `SELECT COALESCE(SUM(tx.transaction_amount),0)::numeric AS v
       FROM transactions tx
       JOIN accounts a ON a.account_id = tx.account_id
       WHERE a.user_id=$1
         AND tx.category_id = ANY($2::int[])
         AND tx.transaction_type='expense'
         AND tx.transaction_date BETWEEN now() - interval '7 days' AND now()`,
      [userId, utilCats]
    );
    const { rows: r2 } = await pool.query(
      `SELECT COALESCE(SUM(tx.transaction_amount),0)::numeric AS v
       FROM transactions tx
       JOIN accounts a ON a.account_id = tx.account_id
       WHERE a.user_id=$1
         AND tx.category_id = ANY($2::int[])
         AND tx.transaction_type='expense'
         AND tx.transaction_date BETWEEN now() - interval '14 days' AND now() - interval '7 days'`,
      [userId, utilCats]
    );
    const a = Number(r1[0]?.v ?? 0), b = Number(r2[0]?.v ?? 0);
    if (b === 0) return 0;
    return (a - b) / b;
  }, 0);

  // IMPORTANT: off peak being Monday to Friday
  const offpeakDays7d = await tryGet(async () => {
    if (!utilCats.length) return 0;
    const { rows } = await pool.query(
      `SELECT COUNT(DISTINCT DATE(tx.transaction_date))::int AS v
       FROM transactions tx
       JOIN accounts a ON a.account_id = tx.account_id
       WHERE a.user_id=$1
       AND tx.category_id = ANY($2::int[])
       AND tx.transaction_type='expense'
       AND EXTRACT(ISODOW FROM tx.transaction_date) BETWEEN 1 AND 5
       AND tx.transaction_date >= now() - interval '7 days'`,
      [userId, utilCats]
    );
    return Number(rows[0]?.v ?? 0);
  }, 0);

  return { avgPerDay, waterTrendPct, offpeakDays7d };
}

// ---------- Lifestyle / Trend ----------
async function getTrendVsLastMonth(userId: number, catIds: number[]): Promise<number> {
  if (!catIds?.length) return 0;
  return tryGet(async () => {
    const { rows: thisM } = await pool.query(
      `SELECT COALESCE(SUM(tx.transaction_amount),0)::numeric AS v
       FROM transactions tx
       JOIN accounts a ON a.account_id = tx.account_id
       WHERE a.user_id=$1
         AND ${MTD_CONDITION}
         AND tx.transaction_type='expense'
         AND tx.category_id = ANY($2::int[])`,
      [userId, catIds]
    );
    const { rows: lastM } = await pool.query(
      `SELECT COALESCE(SUM(tx.transaction_amount),0)::numeric AS v
       FROM transactions tx
       JOIN accounts a ON a.account_id = tx.account_id
       WHERE a.user_id=$1
         AND tx.transaction_date >= date_trunc('month', now()) - interval '1 month'
         AND tx.transaction_date <  date_trunc('month', now())
         AND tx.transaction_type='expense'
         AND tx.category_id = ANY($2::int[])`,
      [userId, catIds]
    );
    const a = Number(thisM[0]?.v ?? 0), b = Number(lastM[0]?.v ?? 0);
    if (b === 0) return 0;
    return (a - b) / b;
  }, 0);
}

// ---------- Not in schema dump (safe fallbacks) ----------
async function getAlertsCount(): Promise<number> { return 0; }
async function getImpulse7d(): Promise<number> { return 0; }

// With no budget amounts table in the dump, keep this safe.
async function getOverBudgetCount(/* userId: number */): Promise<number> {
  logger?.warn?.('[city.service] over-budget calc requires budget amounts; returning 0');
  return 0;
}

async function getMedicalCashbackMTD(): Promise<number> { return 0; }

// ---------- Builders ----------
function buildEffects(meta: StaticBindingMeta, kv: KV) {
  const effects = meta.effects.map((e) => ({
    iconKey: e.iconKey,
    label: e.label,
    tone: e.tone,
    value: String(kv[e.label] ?? '—'),
  }));
  const headline = (kv['headline_value'] as string) ?? meta.headline.defaultValue ?? '—';
  return { headline, effects };
}

export async function getBuildingTooltip(userId: number, buildingId: string): Promise<BuildingTooltip | null> {
  const meta = BUILDING_BINDINGS_STATIC[buildingId];
  if (!meta) return null;

  const cacheKey = `city:tooltip:${userId}:${buildingId}`;
  if (redis) {
    const cached = await redis.get(cacheKey).catch(() => null);
    if (cached) return JSON.parse(cached);
  }

  const kv: KV = {};

  // BANK
  if (meta.dataKeys.includes('income_mtd')) {
    const income = await getIncomeMTD(userId);
    kv['Income'] = `+${MONEY(income)}`;
  }
  if (meta.dataKeys.includes('expenses_mtd')) {
    const exp = await getExpensesMTD(userId);
    kv['Expenses'] = `-${MONEY(exp)}`;
  }
  if (meta.dataKeys.includes('net_mtd')) {
    const income = await getIncomeMTD(userId);
    const exp = await getExpensesMTD(userId);
    const net = income - exp;
    kv['headline_value'] = `${net < 0 ? '-' : ''}${MONEY(Math.abs(net))}`;
  }
  if (meta.dataKeys.includes('alerts_count')) {
    kv['Alerts'] = String(await getAlertsCount());
  }

  // FOOD MARKET (groceries)
  if (meta.dataKeys.some(k =>
    k.startsWith('spend_mtd:groceries') ||
    k.startsWith('budget:groceries') ||
    k.startsWith('visits_7d:groceries') ||
    k === 'budget_left:groceries'
  )) {
    const cats = categoryIdsBySlug.groceries || [];
    const spend = await getSpendMTDByCats(userId, cats);
    const budget = await getBudgetForCats(userId, 'groceries'); // currently 0 with warning
    const visits = await getVisitsLast7d(userId, cats);
    kv['Spend MTD']   = MONEY(spend);
    kv['Budget']      = MONEY(budget);
    kv['Visits (7d)'] = String(visits);
    kv['headline_value'] = MONEY(Math.max(budget - spend, 0));
  }

  // LIBRARY
  if (meta.dataKeys.includes('lessons_count')) kv['Lessons'] = String(await getLessonsCount());
  if (meta.dataKeys.includes('quiz_avg'))      kv['Quiz avg'] = PCT(await getQuizAvg(userId));
  if (meta.dataKeys.includes('learn_streak'))  kv['Day streak'] = String(await getLearnStreak(userId));
  if (meta.dataKeys.includes('xp_potential'))  kv['headline_value'] = `+${Math.max(0, (await getLessonsCount()) * 12)} XP`;

  // HOSPITAL
  if (meta.dataKeys.includes('health_score')) {
    const ef = await getHealthEFpct(userId);
    const score = Math.max(0, Math.min(100, 50 + 50 * ef));
    kv['headline_value'] = `${Math.round(score)}/100`;
  }
  if (meta.dataKeys.includes('medical_cashback_mtd')) kv['Medical cashback'] = `+${MONEY(await getMedicalCashbackMTD())}`;
  if (meta.dataKeys.includes('spend_mtd:health'))      kv['Spend MTD'] = `-${MONEY(await getSpendMTDByCats(userId, categoryIdsBySlug.health || []))}`;
  if (meta.dataKeys.includes('health_ef_pct'))         kv['Health EF'] = PCT(await getHealthEFpct(userId));

  // RESIDENCES (G004/G005)
  if (meta.dataKeys.includes('spend_mtd:home'))     kv['Home'] = MONEY(await getSpendMTDByCats(userId, categoryIdsBySlug.home || []));
  if (meta.dataKeys.includes('spend_mtd:personal')) kv['Personal'] = MONEY(await getSpendMTDByCats(userId, categoryIdsBySlug.personal || []));
  if (meta.dataKeys.includes('home_personal_mtd')) {
    const h = await getSpendMTDByCats(userId, categoryIdsBySlug.home || []);
    const p = await getSpendMTDByCats(userId, categoryIdsBySlug.personal || []);
    kv['headline_value'] = MONEY(h + p);
  }
  if (meta.dataKeys.includes('income_share:home_personal')) {
    const income = await getIncomeMTD(userId);
    const h = await getSpendMTDByCats(userId, categoryIdsBySlug.home || []);
    const p = await getSpendMTDByCats(userId, categoryIdsBySlug.personal || []);
    kv['Income share'] = income > 0 ? PCT((h + p) / income) : '0%';
  }
  if (meta.dataKeys.includes('repairs_topup')) {
    kv['Repairs top-up'] = MONEY(await getRepairsTopup(userId));
  }
  if (meta.dataKeys.includes('trend_vs_last_month:home_personal')) {
    const hpCats = [...(categoryIdsBySlug.home || []), ...(categoryIdsBySlug.personal || [])];
    const t = await getTrendVsLastMonth(userId, hpCats);
    kv['Trend'] = `${t >= 0 ? '+' : ''}${Math.round(t * 100)}%`;
  }
  if (meta.dataKeys.includes('trend_headline')) {
    kv['headline_value'] = String(kv['Trend'] ?? '0%');
  }

  // UTILITIES (G001)
  if (
    meta.dataKeys.includes('utilities_avg_per_day') ||
    meta.dataKeys.includes('water_trend_pct') ||
    meta.dataKeys.includes('offpeak_days_7d')
  ) {
    const { avgPerDay, waterTrendPct, offpeakDays7d } = await getUtilities(userId);
    if (meta.dataKeys.includes('utilities_avg_per_day')) kv['headline_value'] = MONEY(avgPerDay);
    if (meta.dataKeys.includes('water_trend_pct'))       kv['Water'] = `${waterTrendPct >= 0 ? '+' : ''}${Math.round(waterTrendPct * 100)}%`;
    if (meta.dataKeys.includes('offpeak_days_7d'))       kv['Off-peak days'] = String(offpeakDays7d);
    if (meta.dataKeys.includes('tips'))                  kv['Tips'] = 'View';
  }

  // POLICE (placeholders)
  if (meta.dataKeys.includes('impulse_7d'))        kv['Impulse (7d)'] = String(await getImpulse7d());
  if (meta.dataKeys.includes('overbudget_count'))  kv['Over-budget'] = String(await getOverBudgetCount());

  // HOTEL (lifestyle)
  if (meta.dataKeys.includes('spend_mtd:entertainment')) {
    kv['Entertainment'] = MONEY(await getSpendMTDByCats(userId, categoryIdsBySlug.entertainment || []));
  }
  if (meta.dataKeys.includes('spend_mtd:subscriptions')) {
    kv['Subscriptions'] = MONEY(await getSpendMTDByCats(userId, categoryIdsBySlug.subscriptions || []));
  }
  if (meta.dataKeys.includes('lifestyle_mtd')) {
    const e = await getSpendMTDByCats(userId, categoryIdsBySlug.entertainment || []);
    const s = await getSpendMTDByCats(userId, categoryIdsBySlug.subscriptions || []);
    kv['headline_value'] = MONEY(e + s);
  }
  if (meta.dataKeys.includes('subs_cancel_target')) {
    kv['Cancel target'] = '0';
  }

  // CAFE (community) — safe zeros (no tables in dump)
  if (
    meta.dataKeys.includes('friends_active_7d') ||
    meta.dataKeys.includes('challenges_active') ||
    meta.dataKeys.includes('likes_recent')
  ) {
    kv['Friends active'] = '0';
    kv['Active (7d)']    = '0';
    kv['Challenges']     = '0';
    kv['Likes']          = '0';
    kv['headline_value'] = '0';
  }

  // OFFICES (goals)
  if (
    meta.dataKeys.includes('goals_active') ||
    meta.dataKeys.includes('auto_contrib_mtd') ||
    meta.dataKeys.includes('goal_streak_weeks') ||
    meta.dataKeys.includes('goals_completion_pct')
  ) {
    const gs = await getGoalsStats(userId);
    kv['Active goals']    = String(gs.active);
    kv['Auto-contrib']    = `+${MONEY(gs.autoContrib)}`;
    kv['Streak']          = `${gs.streakWeeks}w`;
    kv['Completion']      = PCT(gs.completionPct);
    kv['headline_value']  = PCT(gs.completionPct);
  }

  const { headline, effects } = buildEffects(meta, kv);

  const payload: BuildingTooltip = {
    id: meta.id,
    label: meta.label,
    description: meta.description,
    rating: meta.rating,
    level: meta.level,
    sizeLabel: meta.sizeLabel,
    headline: { label: meta.headline.label, value: headline, iconKey: meta.headline.iconKey },
    effects,
    upgrade: meta.upgrade,
    cta: meta.cta,
  };

  if (redis) {
    await redis.set(cacheKey, JSON.stringify(payload), { EX: 60 }).catch(() => null);
  }

  return payload;
}

export async function getAllBuildingTooltips(userId: number): Promise<BuildingTooltip[]> {
  const ids = Object.keys(BUILDING_BINDINGS_STATIC);
  const out: BuildingTooltip[] = [];
  for (const id of ids) {
    const t = await getBuildingTooltip(userId, id);
    if (t) out.push(t);
  }
  return out;
}
