
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
    password_salt TEXT NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- USER PREFERENCES
CREATE TABLE user_preferences (
    user_id INT NOT NULL PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    theme VARCHAR(50) CHECK (theme IN ('light', 'dark')),
    in_app_notifications_enabled BOOLEAN DEFAULT TRUE,
    avatar_id VARCHAR(50) NOT NULL DEFAULT 'default_01',
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
    account_name VARCHAR(100) NOT NULL DEFAULT 'My Account', -- SHOULD THIS BE UNIQUE???
    account_type VARCHAR(50) NOT NULL CHECK (
        account_type IN (
            'current', 'cheque', 'savings', 'credit', 'fixed deposit',
            'business', 'transmission', 'tax-free savings', 'trust', 
            'corporate trading', 'crypto', 'forex' --- INVESTMENT ACC
        )
    ),
    currency VARCHAR(20) NOT NULL CHECK (
        currency IN (
            'ZAR', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'KES', 'NGN',
            'BTC', 'ETH', 'USDT', 'BUSD', 'LTC', 'XRP', 'SOL', 'BNB', 'DOGE', 'USDC'
        )
    ) DEFAULT 'ZAR',
    account_number TEXT DEFAULT 'GFV-XXXX-XXXX',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GLOBAL CATEGORIES
CREATE TABLE categories ( -- SORT by NAME
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

-- TRIGGER FUNCTION to prevent duplicate category names
CREATE OR REPLACE FUNCTION prevent_duplicate_category()
RETURNS TRIGGER AS $$
BEGIN
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






-- TRANSACTIONS
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL REFERENCES accounts(account_id),
    category_id INT REFERENCES categories(category_id),
    custom_category_id INT REFERENCES custom_categories(custom_category_id),
    transaction_amount NUMERIC(12, 2) NOT NULL CHECK (transaction_amount != 0),
    transaction_type VARCHAR(20) NOT NULL CHECK (
        transaction_type IN ('expense', 'income', 'transfer', 'fee', 'withdrawal', 'deposit')
    ),
    transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT NOT NULL DEFAULT '',
    note TEXT,
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (category_id IS NULL AND custom_category_id IS NOT NULL)
        OR
        (category_id IS NOT NULL AND custom_category_id IS NULL)
    )
);

-- RECURRING TRANSACTIONS
CREATE TABLE recurring_transactions (
    recurring_id SERIAL PRIMARY KEY,
    transaction_id INT UNIQUE REFERENCES transactions(transaction_id),
    frequency VARCHAR(50) NOT NULL CHECK (
        frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')
    ),
    next_occurrence DATE NOT NULL,
    end_date DATE, -- Optional end to the recurrence
    last_run DATE DEFAULT NULL, -- Helps log last time the recurrence executed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    tier_status VARCHAR(20) NOT NULL CHECK (
        tier_status IN ('wood', 'bronze', 'silver', 'gold', 'platinum', 'diamond')
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
    community_id SERIAL PRIMARY KEY,
    owner_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    community_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- GOALS
CREATE TABLE goals (
    goal_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    community_id INT REFERENCES communities(community_id) ON DELETE CASCADE,
    goal_name VARCHAR(100) NOT NULL,
    goal_type VARCHAR(50) NOT NULL CHECK (
        goal_type IN ('savings', 'debt', 'investment', 'spending limit', 'donation')
    ),
    target_amount NUMERIC(12, 2) NOT NULL CHECK (target_amount > 0),
    current_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    target_date DATE NOT NULL,
    goal_status VARCHAR(50) NOT NULL CHECK (
        goal_status IN ('in-progress', 'completed', 'paused', 'cancelled', 'failed')
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (user_id IS NOT NULL AND community_id IS NULL)
        OR
        (user_id IS NULL AND community_id IS NOT NULL)
    )
);

-- GOAL PROGRESS
CREATE TABLE goal_progress (
    progress_id SERIAL PRIMARY KEY,
    goal_id INT NOT NULL REFERENCES goals(goal_id) ON DELETE CASCADE,
    contributor_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    progress_date DATE NOT NULL DEFAULT CURRENT_DATE,
    amount_added NUMERIC(12, 2) NOT NULL CHECK (amount_added > 0)
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
    CHECK (user_id <> friend_id)
);

-- CHALLENGES
CREATE TABLE challenges (
    challenge_id SERIAL PRIMARY KEY,
    challenge_title VARCHAR(100) NOT NULL,
    description TEXT,
    challenge_type VARCHAR(50) NOT NULL CHECK (
        challenge_type IN ('competition', 'cooperative')
    ),
    measurement_type VARCHAR(50) NOT NULL CHECK (
        measurement_type IN ('savings_amount', 'goal_completion', 'transaction_count')
    ),
    reward_description TEXT,
    -- These will act as the template duration, not absolute dates
    start_date INTERVAL NOT NULL,
    duration INTERVAL NOT NULL
);

-- CHALLENGE PROGRESS
CREATE TABLE challenge_progress (
    community_id INT REFERENCES communities(community_id) ON DELETE CASCADE,
    challenge_id INT REFERENCES challenges(challenge_id),
    owner_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    actual_start TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actual_end TIMESTAMP NOT NULL,
    score NUMERIC DEFAULT 0,
    progress_summary TEXT,
    challenge_status VARCHAR(50) NOT NULL CHECK (
        challenge_status IN ('joined', 'in-progress', 'completed', 'disqualified')
    ),
    PRIMARY KEY (community_id, challenge_id)
);

-- LEADERBOARD
CREATE TABLE leaderboard_entries (
    entry_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    community_id INT REFERENCES communities(community_id) ON DELETE CASCADE,
    challenge_id INT REFERENCES challenges(challenge_id),
    leaderboard_score INT NOT NULL,
    ranking INT,
    CHECK (
        (user_id IS NOT NULL AND community_id IS NULL)
        OR
        (user_id IS NULL AND community_id IS NOT NULL)
    )
);

-- LEARNING MODULES
CREATE TABLE learning_modules (
    module_id SERIAL PRIMARY KEY,
    module_title VARCHAR(100) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) CHECK (
        difficulty IN ('beginner', 'intermediate', 'advanced')
    )
);

-- LESSONS
CREATE TABLE lessons (
    lesson_id SERIAL PRIMARY KEY,
    module_id INT NOT NULL REFERENCES learning_modules(module_id),
    lesson_number INT NOT NULL,
    lesson_title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    estimated_duration INT, -- in minutes (optional)
    UNIQUE (module_id, lesson_number)
);

-- QUIZZES
CREATE TABLE quizzes (
    quiz_id SERIAL PRIMARY KEY,
    module_id INT NOT NULL REFERENCES learning_modules(module_id),
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

-- MODULE REWARDS
CREATE TABLE module_rewards (
    reward_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    module_id INT NOT NULL REFERENCES learning_modules(module_id),
    reward_points INT NOT NULL,
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, module_id)
);

-- BUDGETS
CREATE TABLE budgets (
    budget_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    budget_name VARCHAR(100) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- UI BANNER ADS (IMAGES)
CREATE TABLE banner_images (
    banner_id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_start TIMESTAMP,
    display_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ACHIEVEMENTS
CREATE TABLE achievements (
    achievement_id SERIAL PRIMARY KEY,
    achievement_title VARCHAR(100) NOT NULL,
    achievement_description TEXT NOT NULL,
    points_awarded INT NOT NULL CHECK (points_awarded >= 0),
    badge_icon_url TEXT,
    trigger_condition_json JSONB NOT NULL  -- e.g., {"goal_completed": true, "amount": 1000}
);

-- USER ACHIEVEMENTS
CREATE TABLE user_achievements (
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    achievement_id INT NOT NULL REFERENCES achievements(achievement_id),
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, achievement_id)
);

-- USER POINTS
CREATE TABLE user_points (
    user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    total_points INT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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