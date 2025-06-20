-- ========================================
-- Gamified Financial Visualizer Schema (PostgreSQL)
-- ========================================

-- USERS
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    hashed_password TEXT NOT NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_mandatory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- USER TOKENS
CREATE TABLE user_tokens (
    token_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- AVATAR IMAGES (Selectable user avatars)
CREATE TABLE avatar_images (
    avatar_id SERIAL PRIMARY KEY,
    avatar_image_path VARCHAR(255) NOT NULL, -- e.g., 'avatars/avatar1.png'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BANNER IMAGES (Decorative UI assets like icons, tabs, event banners)
CREATE TABLE banner_images (
    banner_id SERIAL PRIMARY KEY,
    banner_image_path VARCHAR(255) NOT NULL, -- e.g., 'banners/banner1.jpg'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- USER PREFERENCES TABLE
CREATE TABLE user_preferences (
    user_id INT NOT NULL PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    theme VARCHAR(50) CHECK (theme IN ('light', 'dark')),
    in_app_notifications_enabled BOOLEAN DEFAULT TRUE,
    avatar_id INT NOT NULL DEFAULT 1 REFERENCES avatar_images(avatar_id) ON DELETE SET DEFAULT,
    banner_id INT NOT NULL DEFAULT 1 REFERENCES banner_images(banner_id) ON DELETE SET DEFAULT,
    ar_customizations_jsonb JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- USER PUSH SUBSCRIPTIONS (for PWA push support - out of app notifications)
CREATE TABLE user_push_subscriptions (
    push_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    enabled BOOLEAN DEFAULT TRUE
);

-- Trigger function to auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers (Trigger on users table)
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_user_preferences_updated_at
BEFORE UPDATE ON user_preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();



-- ACCOUNTS
CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    bank_name VARCHAR(100) NOT NULL DEFAULT 'GFV Bank',
    account_name VARCHAR(100) NOT NULL DEFAULT 'My Account',
    account_type VARCHAR(50) NOT NULL CHECK (
        account_type IN (
            'current', 'cheque', 'savings', 'credit', 'fixed deposit',
            'business', 'transmission', 'tax-free savings', 'trust', 
            'corporate trading', 'crypto', 'forex'
        )
    ),
    currency VARCHAR(20) NOT NULL CHECK (
        currency IN (
            'ZAR', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'KES', 'NGN',
            'BTC', 'ETH', 'USDT', 'BUSD', 'LTC', 'XRP', 'SOL', 'BNB', 'DOGE', 'USDC'
        )
    ) DEFAULT 'ZAR',
    account_balance NUMERIC(14, 2) NOT NULL DEFAULT 0,  -- total of all transactions
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, account_name)
);

-- GLOBAL CATEGORIES
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE CHECK (
        category_name IN (
            'groceries', 'transport', 'fuel', 'utilities', 'rent', 'mortgage',
            'internet', 'phone', 'insurance', 'medical', 'health', 'fitness',
            'education', 'subscriptions', 'entertainment', 'restaurants',
            'clothing', 'personal care', 'gifts', 'charity', 'taxes',
            'savings', 'investments', 'loan repayment', 'debt', 'travel',
            'accommodation', 'salary', 'freelance', 'bonus', 'refund',
            'transfer in', 'transfer out', 'cash withdrawal', 'cash deposit',
            'business income', 'business expense', 'maintenance', 'repairs',
            'childcare', 'pets', 'home improvement', 'fees', 'commissions',
            'interest income', 'dividends', 'crypto purchase', 'crypto sale',
            'forex', 'wallet top-up', 'wallet withdrawal'
        )
    )
);

-- USER CUSTOM CATEGORIES
CREATE TABLE custom_categories (
    custom_category_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    custom_category_name VARCHAR(100) NOT NULL,
    UNIQUE (user_id, custom_category_name)
);

-- AI SCORE
CREATE TABLE ai_scores (
    score_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    score_value INTEGER NOT NULL,
    financial_health_level VARCHAR(50) NOT NULL CHECK (
        financial_health_level IN ('poor', 'fair', 'average', 'good', 'excellent')
    )
);

-- VISUAL ASSET
CREATE TABLE visual_assets (
    asset_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    asset_type VARCHAR(50) NOT NULL CHECK (
        asset_type IN (
            'house', 'flat', 'shop', 'shop_cafe', 'shop_bakery', 'bank', 'school',
            'fountain', 'tree', 'bench', 'car', 'sign_post', 'road', 'pavement',
            'grass', 'floor', 'bushes', 'parking_lot', 'lamp_post'
        )
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AR SCENE STATE
CREATE TABLE ar_scene_state (
    scene_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    snapshot_jsonb JSONB,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- COMMUNITIES
CREATE TABLE communities (
    community_id   SERIAL PRIMARY KEY,
    owner_id       INT  NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    community_name VARCHAR(100) NOT NULL,
    description    TEXT,
    banner_id      INT  NOT NULL DEFAULT 1 REFERENCES banner_images(banner_id)  -- <-- new FK
                  ON UPDATE CASCADE,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- COMMUNITY MEMBERS
CREATE TABLE community_members (
    community_id INT REFERENCES communities(community_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    membership_status VARCHAR(20) NOT NULL CHECK (
        membership_status IN ('invited', 'requested', 'accepted', 'declined')
    ),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (community_id, user_id)
);

-- FRIENDSHIPS
CREATE TABLE friendships (
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    friend_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    relationship_status VARCHAR(20) NOT NULL CHECK (
        relationship_status IN ('pending', 'accepted', 'declined')
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, friend_id),
    CHECK (user_id < friend_id) -- enforces ordering and prevents (B,A) if (A,B) exists
);

-- GOALS
CREATE TABLE goals (
    goal_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    goal_name VARCHAR(100) NOT NULL,
    goal_type VARCHAR(50) NOT NULL CHECK (
        goal_type IN ('savings', 'debt', 'investment', 'spending limit', 'donation')
    ),
    target_amount NUMERIC(12, 2) NOT NULL CHECK (target_amount > 0),
    current_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,

    start_date DATE NOT NULL,                    -- When the goal starts
    target_date DATE NOT NULL,                   -- When the user *wants* to achieve it
    end_date DATE,                               -- When it was actually completed (optional)

    banner_id INT NOT NULL DEFAULT 1
               REFERENCES banner_images(banner_id)
               ON UPDATE CASCADE,

    category_id INT REFERENCES categories(category_id),
    custom_category_id INT REFERENCES custom_categories(custom_category_id),

    goal_status VARCHAR(50) NOT NULL CHECK (
        goal_status IN ('in-progress', 'completed', 'cancelled', 'failed')
    ),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (user_id, goal_name),

    CHECK (
        (category_id IS NULL AND custom_category_id IS NOT NULL)
        OR
        (category_id IS NOT NULL AND custom_category_id IS NULL)
    )
);

-- Trigger function to auto-update `updated_at` column on goal updates
CREATE OR REPLACE FUNCTION update_goal_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger binding to `goals`
CREATE TRIGGER trg_set_goal_updated_at
BEFORE UPDATE ON goals
FOR EACH ROW
EXECUTE FUNCTION update_goal_updated_at_column();



-- GOAL PROGRESS
CREATE TABLE goal_progress (
    progress_id SERIAL PRIMARY KEY,
    goal_id INT NOT NULL REFERENCES goals(goal_id) ON DELETE CASCADE,
    contributor_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    progress_date DATE NOT NULL DEFAULT CURRENT_DATE,
    amount_added NUMERIC(12, 2) NOT NULL CHECK (amount_added > 0)
);

-- TRIGGERS to update goal current amount on progress insert/update
CREATE OR REPLACE FUNCTION update_goal_current_amount()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE goals
  SET current_amount = current_amount + NEW.amount_added
  WHERE goal_id = NEW.goal_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_goal_amount
AFTER INSERT ON goal_progress
FOR EACH ROW
EXECUTE FUNCTION update_goal_current_amount();

-- On update, adjust the goal's current amount based on the change in amount_added
CREATE OR REPLACE FUNCTION adjust_goal_on_progress_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE goals
  SET current_amount = current_amount - OLD.amount_added + NEW.amount_added
  WHERE goal_id = NEW.goal_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_adjust_goal_amount
AFTER UPDATE ON goal_progress
FOR EACH ROW
EXECUTE FUNCTION adjust_goal_on_progress_update();

-- On delete, subtract the amount added from the goal's current amount
CREATE OR REPLACE FUNCTION subtract_goal_on_progress_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE goals
  SET current_amount = current_amount - OLD.amount_added
  WHERE goal_id = OLD.goal_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_subtract_goal_amount
AFTER DELETE ON goal_progress
FOR EACH ROW
EXECUTE FUNCTION subtract_goal_on_progress_delete();



-- CHALLENGES
CREATE TABLE challenges (
    challenge_id SERIAL PRIMARY KEY,
    community_id INT NOT NULL REFERENCES communities(community_id) ON DELETE CASCADE,
    creator_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    challenge_title VARCHAR(100) NOT NULL,
    challenge_type VARCHAR(50) NOT NULL CHECK (
        challenge_type IN ('savings', 'debt', 'investment', 'spending limit', 'donation')
    ),
    target_amount NUMERIC(12,2) NOT NULL CHECK (target_amount > 0),
    current_amount NUMERIC(12,2) NOT NULL DEFAULT 0,

    start_date DATE NOT NULL,                     -- 🆕 Explicit start of challenge
    target_date DATE NOT NULL,                    -- Goal or milestone date
    end_date DATE,                                -- Actual end if completed/expired

    banner_id INT NOT NULL DEFAULT 1
               REFERENCES banner_images(banner_id)
               ON UPDATE CASCADE,

    category_id INT REFERENCES categories(category_id),
    custom_category_id INT REFERENCES custom_categories(custom_category_id),
    CHECK (
        (category_id IS NULL AND custom_category_id IS NOT NULL)
        OR
        (category_id IS NOT NULL AND custom_category_id IS NULL)
    ),

    measurement_type VARCHAR(50) NOT NULL CHECK (
        measurement_type IN (
            'amount_saved',
            'goals_completed',
            'transactions_logged',
            'amount_invested',
            'amount_donated',
            'spending_within_limit'
        )
    ),

    challenge_status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (
        challenge_status IN ('active', 'completed', 'cancelled', 'expired')
    ),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CHALLENGE PROGRESS
CREATE TABLE challenge_progress (
    challenge_id INT NOT NULL REFERENCES challenges(challenge_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    participation_status VARCHAR(20) NOT NULL DEFAULT 'invited' CHECK (
        participation_status IN ('invited', 'joined', 'left')
    ),
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress_amount NUMERIC(12,2) DEFAULT 0,
    PRIMARY KEY (challenge_id, user_id)
);

CREATE OR REPLACE FUNCTION update_challenge_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE challenges
  SET 
    current_amount = (
      SELECT COALESCE(SUM(progress_amount), 0)
      FROM challenge_progress
      WHERE challenge_id = NEW.challenge_id
    ),
    updated_at = CURRENT_TIMESTAMP
  WHERE challenge_id = NEW.challenge_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for INSERT or UPDATE
CREATE TRIGGER trg_update_challenge_progress_after_change
AFTER INSERT OR UPDATE ON challenge_progress
FOR EACH ROW
EXECUTE FUNCTION update_challenge_progress();

-- Trigger for DELETE
CREATE TRIGGER trg_update_challenge_progress_after_delete
AFTER DELETE ON challenge_progress
FOR EACH ROW
EXECUTE FUNCTION update_challenge_progress();


CREATE OR REPLACE FUNCTION complete_challenge_if_met()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE challenges
  SET 
    challenge_status = 'completed',
    updated_at = CURRENT_TIMESTAMP
  WHERE 
    challenge_id = NEW.challenge_id
    AND current_amount >= target_amount
    AND challenge_status = 'active';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_auto_complete_challenge
AFTER UPDATE OF current_amount ON challenges
FOR EACH ROW
WHEN (NEW.current_amount >= NEW.target_amount AND NEW.challenge_status = 'active')
EXECUTE FUNCTION complete_challenge_if_met();

CREATE OR REPLACE FUNCTION expire_challenge_if_overdue()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.challenge_status = 'active' AND NEW.end_date < CURRENT_DATE THEN
    UPDATE challenges
    SET 
      challenge_status = 'expired',
      updated_at = CURRENT_TIMESTAMP
    WHERE challenge_id = NEW.challenge_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_auto_expire_challenge
AFTER UPDATE ON challenges
FOR EACH ROW
EXECUTE FUNCTION expire_challenge_if_overdue();



-- LEADERBOARD ENTRIES
CREATE TABLE leaderboard_entries (
    entry_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    leaderboard_score INT NOT NULL, -- This is user_points.total_points
    ranking INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BUDGETS
CREATE TABLE budgets (
    budget_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    budget_name VARCHAR(100) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, budget_name)  -- Ensures budget names are unique per user
);

-- BUDGET ALLOCATIONS PER CATEGORY
CREATE TABLE budget_categories (
    budget_category_id SERIAL PRIMARY KEY,
    budget_id INT NOT NULL REFERENCES budgets(budget_id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(category_id),
    custom_category_id INT REFERENCES custom_categories(custom_category_id),
    target_amount NUMERIC(12, 2) NOT NULL CHECK (target_amount >= 0),
    CHECK (
        (category_id IS NOT NULL AND custom_category_id IS NULL)
        OR (category_id IS NULL AND custom_category_id IS NOT NULL)
    )
);

-- TRANSACTIONS
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(category_id),
    custom_category_id INT REFERENCES custom_categories(custom_category_id),
    budget_id INT REFERENCES budgets(budget_id) ON DELETE SET NULL,
    transaction_amount NUMERIC(12, 2) NOT NULL CHECK (transaction_amount != 0),
    transaction_type VARCHAR(20) NOT NULL CHECK (
        transaction_type IN ('expense', 'income', 'transfer', 'fee', 'withdrawal', 'deposit')
    ),
    transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    transaction_name TEXT NOT NULL DEFAULT '',
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    linked_goal_id INT REFERENCES goals(goal_id) ON DELETE SET NULL,
    linked_challenge_id INT REFERENCES challenges(challenge_id) ON DELETE SET NULL,
    points_awarded INT DEFAULT 0 CHECK (points_awarded >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (category_id IS NULL AND custom_category_id IS NOT NULL)
        OR
        (category_id IS NOT NULL AND custom_category_id IS NULL)
    )
);

-- TRIGGER FUNCTION to prevent duplicate category names
CREATE OR REPLACE FUNCTION prevent_duplicate_category()
RETURNS TRIGGER AS $$
BEGIN
    NEW.custom_category_name := LOWER(NEW.custom_category_name);
    IF EXISTS (
        SELECT 1 FROM categories WHERE LOWER(category_name) = LOWER(NEW.custom_category_name)
    ) THEN
        RAISE EXCEPTION 'Custom category "%s" already exists in global categories.', NEW.custom_category_name;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER on insert or update to custom_categories
CREATE TRIGGER check_duplicate_global_category
BEFORE INSERT OR UPDATE ON custom_categories
FOR EACH ROW
EXECUTE FUNCTION prevent_duplicate_category();




-- RECURRING TRANSACTIONS
CREATE TABLE recurring_transactions (
    recurring_id SERIAL PRIMARY KEY,
    transaction_id INT UNIQUE REFERENCES transactions(transaction_id),
    frequency VARCHAR(50) NOT NULL CHECK (
        frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')
    ),
    next_occurrence DATE NOT NULL,
    end_date DATE, -- Optional end to the recurrence
    last_run DATE DEFAULT NULL, -- Logs the last time it was run
    is_active BOOLEAN NOT NULL DEFAULT TRUE, -- Marks whether the recurrence is currently running
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- MODULE BANNERS (for learning modules)
CREATE TABLE module_banners (
    module_banner_id   SERIAL PRIMARY KEY,
    banner_image_path VARCHAR(255) NOT NULL, -- e.g., 'module_banners/banner1.jpg'
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- LEARNING MODULES
CREATE TABLE learning_modules (
    module_id SERIAL PRIMARY KEY,
    module_title VARCHAR(100) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) CHECK (
        difficulty IN ('beginner', 'intermediate', 'advanced')
    ),
    module_banner_id    INT NOT NULL DEFAULT 1
                   REFERENCES module_banners(module_banner_id)
                   ON UPDATE CASCADE
);

-- LESSONS
CREATE TABLE lessons (
    lesson_id SERIAL PRIMARY KEY,
    module_id INT NOT NULL REFERENCES learning_modules(module_id) ON DELETE CASCADE,
    lesson_number INT NOT NULL,
    lesson_title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    estimated_duration INT, -- in minutes (optional)
    UNIQUE (module_id, lesson_number)
);

-- QUIZZES
CREATE TABLE quizzes (
    quiz_id SERIAL PRIMARY KEY,
    module_id INT NOT NULL REFERENCES learning_modules(module_id) ON DELETE CASCADE,
    questions_jsonb JSONB NOT NULL,
    max_score INT NOT NULL,
    pass_score INT NOT NULL CHECK (pass_score <= max_score)
);

-- QUIZ ATTEMPTS
CREATE TABLE quiz_attempts (
    attempt_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    quiz_id INT NOT NULL REFERENCES quizzes(quiz_id),
    attempt_score INT NOT NULL,
    passed BOOLEAN,
    attempt_number INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BADGES (for achievements and gamification)
CREATE TABLE badges (
    badge_id SERIAL PRIMARY KEY,
    badge_title VARCHAR(100) NOT NULL UNIQUE,
    image_path VARCHAR(255) NOT NULL, -- e.g., 'badges/badge1.png'
    rarity VARCHAR(20) CHECK (
        rarity IN ('Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Obsidian')
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ACHIEVEMENTS
CREATE TABLE achievements (
    achievement_id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES achievements(achievement_id) ON DELETE CASCADE,
    badge_id INT NOT NULL REFERENCES badges(badge_id) ON DELETE RESTRICT,
    achievement_title VARCHAR(100) NOT NULL,
    achievement_description TEXT NOT NULL,
    achievement_type VARCHAR(50) NOT NULL CHECK (
        achievement_type IN ('goal', 'quiz', 'challenge', 'transaction', 'milestone', 'tutorial', 'misc')
    ),
    points_awarded INT NOT NULL CHECK (points_awarded >= 0),
    trigger_condition_json JSONB NOT NULL,
    is_umbrella BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT DEFAULT 0
);

-- USER ACHIEVEMENTS
CREATE TABLE user_achievements (
    user_id        INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    achievement_id INT NOT NULL REFERENCES achievements(achievement_id) ON DELETE CASCADE,
    awarded_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    achievement_status VARCHAR(20) NOT NULL DEFAULT 'incomplete' CHECK (
        achievement_status IN ('incomplete', 'complete')
    ),
    progress_value INT DEFAULT 0,
    PRIMARY KEY (user_id, achievement_id)
);

-- USER POINTS
CREATE TABLE user_points (
    user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    total_points INT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tier_status VARCHAR(20) NOT NULL DEFAULT 'wood' CHECK (
    tier_status IN ('wood', 'bronze', 'silver', 'gold', 'platinum', 'diamond'))
);

-- USER POINTS HISTORY
CREATE TABLE points_log (
    log_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    source VARCHAR(50) NOT NULL CHECK (
        source IN ('achievement', 'quiz', 'goal', 'challenge', 'transaction')
    ),
    source_id INT,
    points INT NOT NULL CHECK (points > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- POINTS RULES
CREATE TABLE point_rules (
    rule_id SERIAL PRIMARY KEY,
    action_type VARCHAR(50) UNIQUE NOT NULL CHECK (
        action_type IN ('transaction', 'goal_created', 'goal_completed', 'quiz_completed', 'achievement_unlocked', 'challenge_completed')
    ),
    base_points INT NOT NULL CHECK (base_points >= 0)
);



-- ========================================
-- INDEXES
-- ========================================

-- Indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Indexes for accounts
CREATE INDEX idx_accounts_user_id ON accounts(user_id);

-- Indexes for transactions
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_user_type_date ON transactions(transaction_type, transaction_date);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_custom_category_id ON transactions(custom_category_id);
CREATE INDEX idx_transactions_budget_id ON transactions(budget_id);

-- Indexes for goals
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_goal_status ON goals(goal_status);

-- Indexes for goal_progress
CREATE INDEX idx_goal_progress_goal_id ON goal_progress(goal_id);
CREATE INDEX idx_goal_progress_contributor_id ON goal_progress(contributor_id);

-- Indexes for user_achievements
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);

-- Indexes for quiz_attempts
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);

-- Indexes for budgets
CREATE INDEX idx_budgets_user_id ON budgets(user_id);

-- Indexes for budget_categories
CREATE INDEX idx_budget_categories_budget_id ON budget_categories(budget_id);

-- ========================================
-- ADDITIONAL INDEXES (Optimized for Queries)
-- ========================================

-- Participation filters per challenge (e.g., joined, invited)
CREATE INDEX idx_challenge_progress_status ON challenge_progress(challenge_id, participation_status);

-- Query user achievements by status (complete/incomplete)
CREATE INDEX idx_user_achievements_status ON user_achievements(user_id, achievement_status);

-- Load active/inactive challenges per community
CREATE INDEX idx_challenges_community_status ON challenges(community_id, challenge_status);

-- Filter user goals by status
CREATE INDEX idx_goals_user_status ON goals(user_id, goal_status);

-- Account types per user (e.g., crypto, savings)
CREATE INDEX idx_accounts_user_type ON accounts(user_id, account_type);

-- Quiz pass/fail history queries
CREATE INDEX idx_quiz_attempts_user_passed ON quiz_attempts(user_id, passed);

-- Points activity logs and audit trails
CREATE INDEX idx_points_log_user_date ON points_log(user_id, created_at DESC);

-- Speed up duplicate custom category checks
CREATE INDEX idx_custom_categories_user_name ON custom_categories(user_id, custom_category_name);

-- Goal progress over time (e.g., charting or tracking)
CREATE INDEX idx_goal_progress_date ON goal_progress(goal_id, progress_date DESC);

-- JSONB field: Achievement trigger filters
CREATE INDEX idx_achievements_trigger_condition ON achievements USING GIN (trigger_condition_json);

-- JSONB field: AR customizations in user preferences
CREATE INDEX idx_user_preferences_ar_customizations ON user_preferences USING GIN (ar_customizations_jsonb);
