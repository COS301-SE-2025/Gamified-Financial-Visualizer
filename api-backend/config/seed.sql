-- seed.sql
-- Run this against a clean GamifiedFinanceDB

BEGIN;

-- 1. Populate global categories
INSERT INTO categories (category_name) VALUES
  ('groceries'), ('transport'), ('fuel'), ('utilities'), ('rent'), ('mortgage'),
  ('internet'), ('phone'), ('insurance'), ('medical'), ('health'), ('fitness'),
  ('education'), ('subscriptions'), ('entertainment'), ('restaurants'),
  ('clothing'), ('personal care'), ('gifts'), ('charity'), ('taxes'),
  ('savings'), ('investments'), ('loan repayment'), ('debt'), ('travel'),
  ('accommodation'), ('salary'), ('freelance'), ('bonus'), ('refund'),
  ('transfer in'), ('transfer out'), ('cash withdrawal'), ('cash deposit'),
  ('business income'), ('business expense'), ('maintenance'), ('repairs'),
  ('childcare'), ('pets'), ('home improvement'), ('fees'), ('commissions'),
  ('interest income'), ('dividends'), ('crypto purchase'), ('crypto sale'),
  ('forex'), ('wallet top-up'), ('wallet withdrawal')
;  -- :contentReference[oaicite:0]{index=0}

-- 2–6 in one PL/pgSQL block to capture IDs
DO $$
DECLARE
  uid   INT;
  accid INT;
  bid   INT;
BEGIN
  -- 2. Create test user
  INSERT INTO users (email, username, full_name, hashed_password, password_salt, email_verified, two_factor_enabled)
  VALUES
    ('seed.user@example.com', 'seeduser', 'Seed User', 'hashed_pw_placeholder', 'salt123', TRUE, FALSE)
  RETURNING user_id INTO uid;

  -- Initialize user_points
  INSERT INTO user_points (user_id, total_points)
  VALUES (uid, 0);

  -- Default preferences
  INSERT INTO user_preferences (user_id, theme)
  VALUES (uid, 'light');

  -- 3. Create one bank account
  INSERT INTO accounts (user_id, bank_name, account_name, account_type, currency, account_number)
  VALUES (uid, 'GFV Bank', 'Seed Checking', 'current', 'ZAR', 'GFV-0000-0001')
  RETURNING account_id INTO accid;

  -- 4. Insert 20 random transactions
  FOR i IN 1..20 LOOP
    INSERT INTO transactions (
      account_id,
      category_id,
      transaction_amount,
      transaction_type,
      transaction_date,
      description
    )
    SELECT
      accid,
      -- pick a random category
      (SELECT category_id FROM categories ORDER BY RANDOM() LIMIT 1),
      -- random amount between 10 and 1000
      ROUND((RANDOM() * 990 + 10)::numeric, 2),
      -- randomly expense or income
      CASE WHEN RANDOM() < 0.7 THEN 'expense' ELSE 'income' END,
      NOW() - (INTERVAL '1 day' * (i % 30)),
      'Seed transaction ' || i;
  END LOOP;

  -- 5. Create a monthly budget and three allocations
  INSERT INTO budgets (user_id, budget_name, period_start, period_end)
  VALUES (uid, 'June 2025 Budget', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '15 days')
  RETURNING budget_id INTO bid;

  INSERT INTO budget_categories (budget_id, category_id, target_amount)
    SELECT bid, category_id, 500::numeric
    FROM categories
    WHERE category_name IN ('groceries', 'transport', 'rent')
  ;

  -- 6. Create one personal saving goal
  INSERT INTO goals (user_id, goal_name, goal_type, target_amount, target_date, goal_status)
  VALUES (
    uid,
    'Emergency Fund',
    'savings',
    2000.00,
    CURRENT_DATE + INTERVAL '60 days',
    'in-progress'
  );

END
$$ LANGUAGE plpgsql;

COMMIT;
