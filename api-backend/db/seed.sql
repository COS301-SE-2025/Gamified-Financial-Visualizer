-- ============================
-- Seed Script
-- ============================

-- Disable referential integrity temporarily if needed
-- SET session_replication_role = 'replica';

INSERT INTO users (full_name, username, email, hashed_password, two_factor_enabled, two_factor_mandatory) VALUES 
    ('Michael Thompson', 'mike.thompson', 'mikethompson@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$CtXtSdWUEbpFeEzHD2TSkw$fwHgGq5BzJIZQvRTFdfBSHw62hKLyDh6Vv34lunC/mQ', FALSE, TRUE),
    ('Sarah Williams', 'sarah_williams', 's.williams@outlook.com', '$argon2id$v=19$m=65536,t=3,p=4$L3/zftunkHQ3X8a3JyjiOw$P5ecE1RSBIeU97/m9WQafHlGQDPRcyV6R9byhy/gECc', FALSE, TRUE),
    ('David Chen', 'david.chen', 'davidchen@yahoo.com', '$argon2id$v=19$m=65536,t=3,p=4$xxMkyn26SrCK++WRU/SeLw$U3RHMiAfkrvOs7F+qpomQqV36xBxvDEcH92t9vV3lzA', FALSE, TRUE),
    ('Emily Rodriguez', 'emily_rod', 'emily.rodriguez@hotmail.com', '$argon2id$v=19$m=65536,t=3,p=4$WgZJKyPrpTPxXXBKa104yQ$HvpwekYgfpGy2wnek3YUwNCD8Phnl28Q0N1NuTPOT3I', FALSE, TRUE),
    ('James Anderson', 'j.anderson', 'james.anderson@company.com', '$argon2id$v=19$m=65536,t=3,p=4$rPqc8COSJhD5+f2dM/eYeQ$3fc1MCiVw6rC6cT2YqNDmgqK09vqKij3rPOMdXSIdjg', FALSE, TRUE),
    ('Lisa Martinez', 'lisa.martinez', 'lisamartinez@email.com', '$argon2id$v=19$m=65536,t=3,p=4$2ngtiB7Je8zceklXwEYtcQ$TJHV2D1Eb6cCoWYZhY5LKkihbHggIDpwV+hDVFBhJt0', FALSE, TRUE),
    ('Robert Johnson', 'rob_johnson', 'robert.j@domain.org', '$argon2id$v=19$m=65536,t=3,p=4$xvGB7oegERa5hGgFWqr0ZQ$mYgXYe3uIaUw4FSmeZS5Mwb6bWfOHCok58Ux9Icw0Do', FALSE, TRUE),
    ('Amanda Foster', 'amanda.foster', 'a.foster@university.edu', '$argon2id$v=19$m=65536,t=3,p=4$1KRFczX/t7jm3L7XacvTzA$x4EluNWLkLb9+h+pKmnlLHdBT+Jir8dNYp+8Dj3bfW4', FALSE, TRUE),
    ('Kevin Park', 'kevin_park', 'kevin.park@service.net', '$argon2id$v=19$m=65536,t=3,p=4$iC0NIxLTs8SkFB5w/aAowQ$BYgkLX7Cd+nPtKY3pkuqt0+SPEfOl1t21fmP6XHvM/M', FALSE, TRUE),
    ('Jessica Brown', 'jess_b.rown', 'jessica.brown@tuks.co.za', '$argon2id$v=19$m=65536,t=3,p=4$OUq2YI1E+4WutYW0QX35DQ$UZGHXicgj4kaBnM0ycOULiaHq11qg21ZQJizraggq/4', FALSE, TRUE);

INSERT INTO avatar_images (avatar_image_path) VALUES
    ('avatars/BeachShore.png'),
    ('avatars/BlueSky.png'),
    ('avatars/bumbleBee.png'),
    ('avatars/CityBuilding.png'),
    ('avatars/Croissant.png'),
    ('avatars/koiFish.png'),
    ('avatars/LakeBoat.png'),
    ('avatars/LightPost.png'),
    ('avatars/Lily.png'),
    ('avatars/panda.png'),
    ('avatars/Phone.png'),
    ('avatars/Ramen.png'),
    ('avatars/Skull.png'),
    ('avatars/snake.png'),
    ('avatars/Totoro.png');

INSERT INTO banner_images (banner_image_path) VALUES
    ('banners/pixelAllyway.jpeg'),
    ('banners/pixelApartment.gif'),
    ('banners/pixelBalcony.gif'),
    ('banners/pixelCornerStore.gif'),
    ('banners/pixelGirl.gif'),
    ('banners/pixelGirlAlly.gif'),
    ('banners/pixelHouse.gif'),
    ('banners/pixelOffice.gif'),
    ('banners/pixelOffice1.gif'),
    ('banners/pixelOffice2.gif'),
    ('banners/pixelOffice3.gif'),
    ('banners/pixelPorch.gif'),
    ('banners/pixelStore.gif'),
    ('banners/pixelStudents.jpeg'),
    ('banners/pixelWindow.gif'),
    ('banners/pixelWoodShop.gif');

INSERT INTO badges (badge_title, image_path, rarity) VALUES
  ('Accepted',        'badges/accepted.png',        'Uncommon'),
  ('Balance Scale',   'badges/balance-scale.png',   'Uncommon'),
  ('Bank',            'badges/bank.png',            'Common'),
  ('Banknote',        'badges/banknote.png',        'Uncommon'),
  ('Brainstorming',   'badges/brainstorming.png',   'Rare'),
  ('Coin',            'badges/coin.png',            'Common'),
  ('Customer',        'badges/customer.png',        'Common'),
  ('Discussion',      'badges/discussion.png',      'Rare'),
  ('Expense',         'badges/expense.png',         'Common'),
  ('Goal',            'badges/goal.png',            'Legendary'),
  ('Growth',          'badges/growth.png',          'Rare'),
  ('High Five',       'badges/hi5.png',             'Obsidian'),
  ('Idea',            'badges/idea.png',            'Uncommon'),
  ('Income',          'badges/income.png',          'Uncommon'),
  ('Investment',      'badges/investment.png',      'Epic'),
  ('Lighthouse',      'badges/lighthouse.png',      'Rare'),
  ('Meeting',         'badges/meeting.png',         'Common'),
  ('Money Bag',       'badges/money-bag.png',       'Obsidian'),
  ('Planning',        'badges/planing.png',         'Uncommon'), 
  ('Presentation',    'badges/presentation.png',    'Rare'),
  ('Profit',          'badges/profit.png',          'Epic'),
  ('Profit (Alt)',    'badges/profit (2).png',      'Epic'),
  ('Start Up',        'badges/start-up.png',        'Epic'),
  ('Support',         'badges/support.png',         'Common'),
  ('Target',          'badges/target.png',          'Common'),
  ('Team',            'badges/team.png',            'Common'),
  ('Trophy',          'badges/trophy.png',          'Legendary');

INSERT INTO user_preferences (user_id, theme, in_app_notifications_enabled, avatar_id, banner_id, ar_customizations_jsonb) VALUES
    (1, 'light', TRUE, 1, 1, '{}'),
    (2, 'dark', TRUE, 2, 2, '{}'),
    (3, 'light', TRUE, 3, 3, '{}'),
    (4, 'dark', TRUE, 4, 1, '{}'),
    (5, 'light', TRUE, 5, 2, '{}'),
    (6, 'dark', TRUE, 6, 3, '{}'),
    (7, 'light', TRUE, 7, 4, '{}'),
    (8, 'dark', TRUE, 8, 5, '{}'),
    (9, 'light', TRUE, 5, 12, '{}'),
    (10, 'dark', TRUE, 2, 2, '{}');

INSERT INTO accounts (user_id, bank_name, account_name, account_type, currency, account_balance) VALUES
    -- Michael Thompson (User 1)
    (1, 'Capitec', 'Everyday Savings', 'savings', 'ZAR', 12500.50),
    (1, 'FNB', 'Crypto Vault', 'crypto', 'BTC', 0.0542),
    (1, 'ABSA', 'Credit Line', 'credit', 'ZAR', -3500.00),

    -- Sarah Williams (User 2)
    (2, 'Nedbank', 'Travel Fund', 'fixed deposit', 'USD', 5000.00),
    (2, 'Standard Bank', 'Everyday Account', 'current', 'ZAR', 8200.75),

    -- David Chen (User 3)
    (3, 'Investec', 'Forex Trader', 'forex', 'USD', 23000.00),
    (3, 'FNB', 'Business Wallet', 'business', 'ZAR', 74000.00),
    (3, 'Binance', 'Ethereum Wallet', 'crypto', 'ETH', 1.802),

    -- Emily Rodriguez (User 4)
    (4, 'Capitec', 'My Primary', 'cheque', 'ZAR', 9800.00),
    (4, 'TymeBank', 'Goal Save', 'savings', 'ZAR', 1500.00),

    -- James Anderson (User 5)
    (5, 'Discovery Bank', 'Lifestyle Account', 'current', 'ZAR', 12200.00),
    (5, 'ABSA', 'Education Fund', 'tax-free savings', 'ZAR', 3000.00),
    (5, 'FNB', 'USD Vault', 'savings', 'USD', 1100.00),

    -- Lisa Martinez (User 6)
    (6, 'Standard Bank', 'Main Account', 'current', 'ZAR', 6800.00),
    (6, 'Binance', 'Litecoin Wallet', 'crypto', 'LTC', 4.5),

    -- Robert Johnson (User 7)
    (7, 'Capitec', 'Monthly Spend', 'current', 'ZAR', 2200.00),
    (7, 'Old Mutual', 'Investment Account', 'investment', 'ZAR', 40500.00),
    (7, 'Coinbase', 'Dogecoin Wallet', 'crypto', 'DOGE', 13000.00),

    -- Amanda Foster (User 8)
    (8, 'TymeBank', 'Student Account', 'savings', 'ZAR', 2700.00),

    -- Kevin Park (User 9)
    (9, 'Investec', 'Trading Account', 'corporate trading', 'USD', 9000.00),
    (9, 'Nedbank', 'Crypto Backup', 'crypto', 'USDT', 125.40),

    -- Jessica Brown (User 10)
    (10, 'Capitec', 'Main ZAR Account', 'current', 'ZAR', 9500.00),
    (10, 'Binance', 'Bitcoin Wallet', 'crypto', 'BTC', 0.0098),
    (10, 'ABSA', 'Bonus Account', 'current', 'ZAR', 1800.00);

INSERT INTO categories (category_name) VALUES
    ('groceries'),
    ('transport'),
    ('fuel'),
    ('utilities'),
    ('rent'),
    ('mortgage'),
    ('internet'),
    ('phone'),
    ('insurance'),
    ('medical'),
    ('health'),
    ('fitness'),
    ('education'),
    ('subscriptions'),
    ('entertainment'),
    ('restaurants'),
    ('clothing'),
    ('personal care'),
    ('gifts'),
    ('charity'),
    ('taxes'),
    ('savings'),
    ('investments'),
    ('loan repayment'),
    ('debt'),
    ('travel'),
    ('accommodation'),
    ('salary'),
    ('freelance'),
    ('bonus'),
    ('refund'),
    ('transfer in'),
    ('transfer out'),
    ('cash withdrawal'),
    ('cash deposit'),
    ('business income'),
    ('business expense'),
    ('maintenance'),
    ('repairs'),
    ('childcare'),
    ('pets'),
    ('home improvement'),
    ('fees'),
    ('commissions'),
    ('interest income'),
    ('dividends'),
    ('crypto purchase'),
    ('crypto sale'),
    ('forex'),
    ('wallet top-up'),
    ('wallet withdrawal');

INSERT INTO custom_categories (user_id, custom_category_name) VALUES
    -- Michael Thompson (User 1)
    (1, 'side hustle'),
    (1, 'streaming services'),

    -- Sarah Williams (User 2)
    (2, 'eco groceries'),
    (2, 'mental wellness'),

    -- David Chen (User 3)
    (3, 'crypto staking'),
    (3, 'family gifts'),
    (3, 'trading bots'),

    -- Emily Rodriguez (User 4)
    (4, 'art supplies'),

    -- James Anderson (User 5)
    (5, 'gym supplements'),
    (5, 'kids education'),

    -- Lisa Martinez (User 6)
    -- (no custom categories)

    -- Robert Johnson (User 7)
    (7, 'gaming expenses'),
    (7, 'bike maintenance'),

    -- Amanda Foster (User 8)
    -- (no custom categories)

    -- Kevin Park (User 9)
    (9, 'conference travel')

    -- Jessica Brown (User 10)
    -- (no custom categories)
    ;

INSERT INTO communities (owner_id, community_name, description, banner_id) VALUES
    (1, 'Money Masters', 'A club for budgeting pros and goal slayers.', 1),        -- Michael
    (3, 'Crypto Crusaders', 'We ride the blockchain waves together.', 2),         -- David
    (4, 'Frugal & Free', 'Minimalist living and financial freedom.', 3),          -- Emily
    (7, 'Side Hustlers United', 'Build wealth through multiple income streams.', 4), -- Robert
    (9, 'Invest Buds', 'Investment talk and challenge groups.', 5);               -- Kevin

INSERT INTO community_members (community_id, user_id, membership_status) VALUES
    -- Money Masters (community_id 1)
    (1, 1, 'accepted'),  -- owner
    (1, 2, 'accepted'),
    (1, 5, 'invited'),
    (1, 6, 'declined'),

    -- Crypto Crusaders (2)
    (2, 3, 'accepted'),  -- owner
    (2, 4, 'requested'),
    (2, 7, 'accepted'),
    (2, 9, 'accepted'),

    -- Frugal & Free (3)
    (3, 4, 'accepted'),  -- owner
    (3, 2, 'requested'),
    (3, 1, 'accepted'),

    -- Side Hustlers United (4)
    (4, 7, 'accepted'),  -- owner
    (4, 8, 'invited'),
    (4, 5, 'requested'),

    -- Invest Buds (5)
    (5, 9, 'accepted'),  -- owner
    (5, 3, 'accepted'),
    (5, 10, 'requested');

INSERT INTO friendships (user_id, friend_id, relationship_status) VALUES
    -- accepted
    (1, 2, 'accepted'),
    (1, 4, 'accepted'),
    (2, 5, 'accepted'),
    (3, 7, 'accepted'),
    (6, 10, 'accepted'),
    (3, 9, 'accepted'),

    -- pending
    (2, 3, 'pending'),
    (4, 5, 'pending'),
    (8, 9, 'pending'),

    -- declined
    (1, 6, 'declined'),
    (7, 10, 'declined');

INSERT INTO goals (user_id, goal_name, goal_type, target_amount, current_amount, start_date, target_date, end_date, banner_id, category_id, custom_category_id, goal_status) VALUES
    -- Michael Thompson (User 1)
    (1, 'Emergency Fund', 'savings', 10000.00, 7500.00, '2025-01-01', '2025-12-01', NULL, 1, 22, NULL, 'in-progress'),
    (1, 'Pay Off Credit Card', 'debt', 5000.00, 5000.00, '2025-03-01', '2025-06-30', '2025-06-28', 2, 24, NULL, 'completed'),
    (1, 'Credit Card Debt', 'debt', 4000.00, 4000.00, '2024-11-01', '2025-03-01', '2025-03-02', 2, 24, NULL, 'completed'),

    -- Sarah Williams (User 2)
    (2, 'Charity Run Donation', 'donation', 2000.00, 1200.00, '2025-04-10', '2025-07-01', NULL, 1, 20, NULL, 'in-progress'),
    (2, 'Wedding Budget Cap', 'spending limit', 15000.00, 9000.00, '2025-01-01', '2025-12-01', NULL, 1, 17, NULL, 'in-progress'),
    (2, 'Sustainable Grocery Plan', 'spending limit', 3000.00, 2850.00, '2025-05-01', '2025-06-30', NULL, 3, NULL, 2, 'in-progress'),
    (2, 'Charity Marathon', 'donation', 2000.00, 2000.00, '2024-12-01', '2025-03-01', '2025-03-10', 4, 20, NULL, 'completed'),

    -- David Chen (User 3)
    (3, 'Crypto Investment Pool', 'investment', 30000.00, 30000.00, '2025-02-15', '2025-05-15', '2025-05-10', 2, 23, NULL, 'completed'),
    (3, 'Trading Bot Funding', 'savings', 10000.00, 500.00, '2025-03-20', '2025-09-01', NULL, 1, NULL, 3, 'in-progress'),
    (3, 'Crypto Portfolio', 'investment', 15000.00, 10500.00, '2025-01-15', '2025-12-31', NULL, 5, NULL, 5, 'in-progress'),
    (3, 'Tech Stash', 'investment', 20000.00, 20000.00, '2024-06-01', '2025-01-01', '2025-01-02', 1, 23, NULL, 'completed'),

    -- Emily Rodriguez (User 4)
    (4, 'Student Loan Repayment', 'debt', 20000.00, 15000.00, '2025-01-01', '2025-10-01', NULL, 3, 24, NULL, 'in-progress'),
    (4, 'Art Supplies Budget', 'spending limit', 1000.00, 850.00, '2025-05-01', '2025-07-01', NULL, 2, NULL, 4, 'in-progress'),

    -- James Anderson (User 5)
    (5, 'Sponsor School Fees', 'donation', 6000.00, 6000.00, '2025-02-01', '2025-07-01', '2025-06-20', 2, NULL, 11, 'completed'),
    (5, 'School Fees', 'savings', 8000.00, 4000.00, '2025-01-01', '2025-04-01', NULL, 3, 13, NULL, 'in-progress'),
    (5, 'Weight Loss Coaching', 'spending limit', 3000.00, 3000.00, '2024-07-01', '2024-11-01', '2024-10-25', 4, 12, NULL, 'completed'),

    -- Robert Johnson (User 7)
    (7, 'Gaming PC Cap', 'spending limit', 25000.00, 26000.00, '2025-01-15', '2025-04-30', '2025-04-29', 4, NULL, 12, 'completed'),
    (7, 'Gaming PC Upgrade', 'savings', 12000.00, 2000.00, '2025-04-01', '2025-12-01', NULL, 5, NULL, 6, 'in-progress'),
    (7, 'Bike Fixes', 'savings', 2500.00, 0.00, '2024-12-01', '2025-03-01', NULL, 2, NULL, 7, 'failed'),

    -- Kevin Park (User 9)
    (9, 'Conference Flights', 'savings', 8000.00, 3000.00, '2025-03-01', '2025-07-01', NULL, 5, NULL, 13, 'in-progress'),
    (9, 'Conference Flight', 'savings', 7500.00, 7500.00, '2024-09-01', '2025-02-01', '2025-01-30', 3, 26, NULL, 'completed'),

    -- Jessica Brown (User 10)
    (10, 'Pet Rescue Fund', 'donation', 3000.00, 0.00, '2025-04-01', '2025-10-01', NULL, 1, 20, NULL, 'cancelled'),
    (10, 'Wedding Fund', 'savings', 25000.00, 10000.00, '2025-01-01', '2026-01-01', NULL, 4, 22, NULL, 'in-progress');

INSERT INTO goal_progress (goal_id, contributor_id, progress_date, amount_added) VALUES
    -- Michael (1–3)
    (1, 1, '2025-01-10', 2000.00), (1, 1, '2025-02-15', 3000.00), (1, 1, '2025-04-01', 2500.00),
    (2, 1, '2025-03-05', 2500.00), (2, 1, '2025-05-15', 2500.00),
    (3, 1, '2024-11-10', 2000.00), (3, 1, '2025-02-25', 2000.00),

    -- Sarah (4–7)
    (4, 2, '2025-04-15', 500.00), (4, 2, '2025-05-10', 700.00),
    (5, 2, '2025-01-30', 4000.00), (5, 2, '2025-04-10', 5000.00),
    (6, 2, '2025-05-05', 1500.00), (6, 2, '2025-06-01', 1350.00),
    (7, 2, '2024-12-15', 1000.00), (7, 2, '2025-02-10', 1000.00),

    -- David (8–11)
    (8, 3, '2025-03-10', 30000.00),
    (9, 3, '2025-04-01', 500.00),
    (10, 3, '2025-02-01', 5000.00), (10, 3, '2025-05-01', 5500.00),
    (11, 3, '2024-06-10', 8000.00), (11, 3, '2024-12-20', 12000.00),

    -- Emily (12–13)
    (12, 4, '2025-01-10', 10000.00), (12, 4, '2025-03-01', 5000.00),
    (13, 4, '2025-05-10', 500.00), (13, 4, '2025-06-01', 350.00),

    -- James (14–16)
    (14, 5, '2025-02-15', 6000.00),
    (15, 5, '2025-01-10', 2000.00), (15, 5, '2025-03-05', 2000.00),
    (16, 5, '2024-07-10', 1000.00), (16, 5, '2024-09-01', 2000.00),

    -- Robert (17–19)
    (17, 7, '2025-01-20', 10000.00), (17, 7, '2025-03-05', 16000.00),
    (18, 7, '2025-04-10', 2000.00),

    -- Kevin (20–21)
    (20, 9, '2025-04-01', 1500.00), (20, 9, '2025-04-20', 1500.00),
    (21, 9, '2024-10-01', 3000.00), (21, 9, '2024-12-01', 4500.00),

    -- Jessica (22)
    (22, 10, '2025-02-01', 5000.00), (22, 10, '2025-04-01', 5000.00);

INSERT INTO challenges (community_id, creator_id, challenge_title, challenge_type, target_amount, current_amount, start_date, target_date, end_date, banner_id, category_id, custom_category_id, measurement_type, difficulty, challenge_status) VALUES
  -- In Progress
  (1, 1, 'No Spend June', 'spending limit', 5000.00, 2000.00, '2025-06-01', '2025-06-30', '2025-06-30', 1, 17, NULL, 'spending_within_limit', 'medium', 'active'),
  (3, 4, 'Declutter Donation Drive', 'donation', 3000.00, 1800.00, '2025-05-01', '2025-06-30', '2025-06-30', 3, 20, NULL, 'amount_donated', 'easy', 'active'),
  (5, 9, 'Q2 Growth Investment', 'investment', 15000.00, 9000.00, '2025-04-01', '2025-06-30', '2025-06-30', 5, 23, NULL, 'amount_invested', 'hard', 'active'),
  (2, 3, 'Bonus Blitz', 'savings', 10000.00, 4000.00, '2025-06-15', '2025-07-15', '2025-07-15', 2, 22, NULL, 'amount_saved', 'medium', 'active'),
  (4, 8, 'Altcoin Marathon', 'investment', 25000.00, 6000.00, '2025-05-01', '2025-08-01', '2025-08-01', 4, 23, NULL, 'amount_invested', 'hard', 'active'),

  -- Upcoming
  (1, 2, 'July Grocery Cap', 'spending limit', 2500.00, 0.00, '2025-07-01', '2025-07-31', '2025-07-31', 1, 1, NULL, 'spending_within_limit', 'easy', 'active'),

  -- Completed
  (2, 3, 'Altcoin Fundraiser', 'investment', 20000.00, 20000.00, '2025-03-01', '2025-04-15', '2025-04-10', 2, 23, NULL, 'amount_invested', 'hard', 'completed'),
  (4, 7, 'Side Gig Savings', 'savings', 8000.00, 8000.00, '2025-02-01', '2025-05-01', '2025-04-30', 4, 22, NULL, 'amount_saved', 'medium', 'completed'),
  (3, 6, 'Charity Challenge', 'donation', 5000.00, 5000.00, '2025-04-01', '2025-05-01', '2025-04-30', 3, 20, NULL, 'amount_donated', 'medium', 'completed'),
  (5, 9, 'Freelance Frenzy', 'savings', 7000.00, 7000.00, '2025-01-01', '2025-03-01', '2025-02-28', 5, 22, NULL, 'amount_saved', 'extreme', 'completed');

INSERT INTO challenge_progress (challenge_id, user_id, participation_status, progress_amount) VALUES
  -- Challenge 1: No Spend June (In Progress)
  (1, 1, 'joined', 1000.00),
  (1, 2, 'joined', 1000.00),
  (1, 5, 'invited', 0.00),

  -- Challenge 2: Altcoin Fundraiser (Completed)
  (2, 3, 'joined', 10000.00),
  (2, 7, 'joined', 5000.00),
  (2, 9, 'joined', 5000.00),

  -- Challenge 3: Donation Drive (In Progress)
  (3, 4, 'joined', 800.00),
  (3, 2, 'joined', 1000.00),

  -- Challenge 4: Side Gig Savings (Completed)
  (4, 7, 'joined', 3000.00),
  (4, 5, 'joined', 5000.00),

  -- Challenge 5: Q2 Growth (In Progress)
  (5, 9, 'joined', 6000.00),
  (5, 3, 'joined', 3000.00),
  (5, 10, 'invited', 0.00),

  -- Challenge 6: July Grocery Cap (Upcoming)
  (6, 1, 'joined', 0.00),
  (6, 4, 'joined', 0.00),

  -- Challenge 7: Bonus Blitz (In Progress)
  (7, 3, 'joined', 1500.00),
  (7, 6, 'joined', 2500.00),

  -- Challenge 8: Charity Challenge (Completed)
  (8, 6, 'joined', 2500.00),
  (8, 4, 'joined', 2500.00),

  -- Challenge 9: Altcoin Marathon (In Progress)
  (9, 8, 'joined', 3500.00),
  (9, 9, 'joined', 2500.00),

  -- Challenge 10: Freelance Frenzy (Completed)
  (10, 9, 'joined', 4000.00),
  (10, 7, 'joined', 3000.00);

INSERT INTO budgets (user_id, budget_name, period_start, period_end) VALUES
    -- Michael Thompson
    (1, 'June Budget', '2025-06-01', '2025-06-30'),
    (1, 'Q2 Spending', '2025-04-01', '2025-06-30'),

    -- Sarah Williams
    (2, 'Sustainability Budget', '2025-05-01', '2025-06-30'),

    -- David Chen
    (3, 'Crypto Strategy', '2025-03-01', '2025-06-30'),

    -- Emily Rodriguez
    (4, 'Art & Living', '2025-05-01', '2025-07-01'),

    -- James Anderson
    (5, 'Family Essentials', '2025-01-01', '2025-04-01'),

    -- Lisa Martinez
    -- No budget

    -- Robert Johnson
    (7, 'Gamer Budget', '2025-04-01', '2025-06-01'),

    -- Amanda Foster
    -- No budget

    -- Kevin Park
    (9, 'Conference Prep', '2025-02-01', '2025-05-01'),

    -- Jessica Brown
    (10, 'Wedding Tracker', '2025-01-01', '2025-12-31');

INSERT INTO budget_categories (budget_id, category_id, custom_category_id, target_amount) VALUES
    -- Michael: June Budget
    (1, 1, NULL, 2000.00), -- groceries
    (1, 17, NULL, 1500.00), -- entertainment

    -- Michael: Q2 Spending
    (2, 24, NULL, 3000.00), -- debt
    (2, 13, NULL, 2500.00), -- education

    -- Sarah: Sustainability
    (3, NULL, 3, 1800.00), -- eco groceries (custom, user 2)
    (3, 20, NULL, 500.00), -- charity

    -- David: Crypto Strategy
    (4, 23, NULL, 10000.00), -- investments
    (4, NULL, 5, 2000.00), -- trading bots (custom, user 3)

    -- Emily: Art & Living
    (5, NULL, 8, 1200.00), -- art supplies (custom, user 4)
    (5, 1, NULL, 800.00), -- groceries

    -- James: Family Essentials
    (6, 13, NULL, 4000.00), -- education
    (6, NULL, 10, 3000.00), -- kids education (custom, user 5)

    -- Robert: Gamer Budget
    (7, NULL, 11, 2500.00), -- gaming expenses (custom, user 7)
    (7, NULL, 12, 800.00), -- bike maintenance (custom, user 7)

    -- Kevin: Conference Prep
    (8, 26, NULL, 7500.00), -- travel
    (8, NULL, 13, 1000.00), -- conference travel (custom, user 9)

    -- Jessica: Wedding Tracker
    (9, 22, NULL, 15000.00), -- savings
    (9, 17, NULL, 5000.00); -- entertainment

INSERT INTO transactions (account_id, category_id, custom_category_id, budget_id, transaction_amount, transaction_type, transaction_date, transaction_name, is_recurring, linked_goal_id, linked_challenge_id, points_awarded, created_at) VALUES 
    (1, NULL, 5.0, NULL, 1233.87, 'fee', '2025-06-25 00:00:00', 'Monthly Account Fee', FALSE, 13.0, NULL, 12, '2025-06-25 00:00:00'),
    (1, 22.0, NULL, NULL, 1951.9, 'income', '2025-06-20 00:00:00', 'Dividend Payment', FALSE, 6.0, NULL, 46, '2025-06-20 00:00:00'),
    (1, NULL, 2.0, NULL, 595.99, 'deposit', '2025-02-02 00:00:00', 'Online Deposit', FALSE, 14.0, NULL, 11, '2025-02-02 00:00:00'),
    (1, NULL, 12.0, 7.0, 1410.56, 'fee', '2025-02-12 00:00:00', 'ATM Withdrawal Fee', TRUE, NULL, 5.0, 1, '2025-02-12 00:00:00'),
    (1, 42.0, NULL, 5.0, 271.46, 'fee', '2025-05-21 00:00:00', 'Monthly Account Fee', TRUE, 10.0, NULL, 45, '2025-05-21 00:00:00'),
    (1, 18.0, NULL, NULL, 4945.37, 'transfer', '2025-05-28 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 43, '2025-05-28 00:00:00'),
    (1, 50.0, NULL, 3.0, 3550.73, 'expense', '2025-03-11 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 3, '2025-03-11 00:00:00'),
    (1, 49.0, NULL, NULL, 3337.78, 'transfer', '2025-06-01 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 0, '2025-06-01 00:00:00'),
    (1, 44.0, NULL, 4.0, 3923.3, 'withdrawal', '2025-02-25 00:00:00', 'Cash Removed from Account', TRUE, 15.0, NULL, 10, '2025-02-25 00:00:00'),
    (1, 7.0, NULL, 6.0, 1446.74, 'transfer', '2025-03-17 00:00:00', 'Transfer from Checking', FALSE, NULL, 5.0, 17, '2025-03-17 00:00:00'),
    (1, 4.0, NULL, NULL, 4619.04, 'deposit', '2025-04-16 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, 2.0, 28, '2025-04-16 00:00:00'),
    (1, NULL, 13.0, NULL, 1904.23, 'income', '2025-02-12 00:00:00', 'Dividend Payment', FALSE, NULL, NULL, 50, '2025-02-12 00:00:00'),
    (1, 39.0, NULL, 1.0, 1629.77, 'income', '2025-01-01 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 38, '2025-01-01 00:00:00'),
    (1, 17.0, NULL, 7.0, 3213.51, 'deposit', '2025-04-04 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 21, '2025-04-04 00:00:00'),
    (1, 5.0, NULL, NULL, 1740.31, 'fee', '2025-01-16 00:00:00', 'Monthly Account Fee', TRUE, NULL, NULL, 6, '2025-01-16 00:00:00'),
    (1, NULL, 13.0, NULL, 793.02, 'fee', '2025-05-18 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 43, '2025-05-18 00:00:00'),
    (1, NULL, 13.0, NULL, 2840.83, 'withdrawal', '2025-06-28 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 33, '2025-06-28 00:00:00'),
    (1, 37.0, NULL, 3.0, 3351.18, 'fee', '2025-02-04 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 31, '2025-02-04 00:00:00'),
    (1, 37.0, NULL, NULL, 4232.45, 'fee', '2025-04-27 00:00:00', 'Monthly Account Fee', FALSE, 19.0, NULL, 31, '2025-04-27 00:00:00'),
    (1, NULL, 12.0, 6.0, 172.46, 'withdrawal', '2025-03-01 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 30, '2025-03-01 00:00:00'),
    (1, NULL, 9.0, 8.0, 1485.23, 'income', '2025-02-16 00:00:00', 'Dividend Payment', TRUE, NULL, NULL, 25, '2025-02-16 00:00:00'),
    (1, 40.0, NULL, 5.0, 1105.86, 'transfer', '2025-03-20 00:00:00', 'Transfer to Savings', FALSE, NULL, 5.0, 22, '2025-03-20 00:00:00'),
    (1, NULL, 3.0, NULL, 4152.17, 'deposit', '2025-06-28 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, 5.0, 9, '2025-06-28 00:00:00'),
    (1, NULL, 3.0, NULL, 509.97, 'expense', '2025-06-17 00:00:00', 'Coffee Shop', FALSE, NULL, 3.0, 33, '2025-06-17 00:00:00'),
    (1, NULL, 4.0, 3.0, 1401.0, 'expense', '2025-06-24 00:00:00', 'Clothing Store Purchase', FALSE, 5.0, 2.0, 44, '2025-06-24 00:00:00'),
    (1, 22.0, NULL, NULL, 1066.42, 'expense', '2025-01-17 00:00:00', 'Clothing Store Purchase', FALSE, NULL, 2.0, 22, '2025-01-17 00:00:00'),
    (1, 30.0, NULL, NULL, 1176.8, 'deposit', '2025-01-20 00:00:00', 'Cash Deposit at Branch', TRUE, 1.0, 4.0, 31, '2025-01-20 00:00:00'),
    (1, NULL, 1.0, NULL, 2350.0, 'withdrawal', '2025-06-26 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 32, '2025-06-26 00:00:00'),
    (1, 47.0, NULL, NULL, 148.29, 'deposit', '2025-05-14 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 45, '2025-05-14 00:00:00'),
    (1, 1.0, NULL, 4.0, 1120.48, 'fee', '2025-04-20 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 6, '2025-04-20 00:00:00'),
    (1, 10.0, NULL, 4.0, 3139.48, 'expense', '2025-01-25 00:00:00', 'Grocery Store Purchase', FALSE, NULL, 2.0, 41, '2025-01-25 00:00:00'),
    (1, 39.0, NULL, 8.0, 4692.5, 'withdrawal', '2025-02-04 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, 3.0, 38, '2025-02-04 00:00:00'),
    (1, 22.0, NULL, 8.0, 1009.28, 'transfer', '2025-06-28 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 45, '2025-06-28 00:00:00'),
    (1, NULL, 6.0, NULL, 712.89, 'withdrawal', '2025-05-04 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 3, '2025-05-04 00:00:00'),
    (1, 25.0, NULL, 7.0, 4332.06, 'income', '2025-02-28 00:00:00', 'Dividend Payment', FALSE, 20.0, NULL, 38, '2025-02-28 00:00:00'),
    (1, 2.0, NULL, NULL, 4871.62, 'expense', '2025-02-19 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 27, '2025-02-19 00:00:00'),
    (1, 4.0, NULL, NULL, 241.11, 'deposit', '2025-03-09 00:00:00', 'Online Deposit', FALSE, 3.0, NULL, 44, '2025-03-09 00:00:00'),
    (1, 51.0, NULL, 4.0, 4966.87, 'deposit', '2025-02-06 00:00:00', 'Cash Deposit at Branch', FALSE, 9.0, NULL, 11, '2025-02-06 00:00:00'),
    (1, NULL, 10.0, NULL, 3983.97, 'fee', '2025-05-17 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, 3.0, 14, '2025-05-17 00:00:00'),
    (1, NULL, 13.0, NULL, 3586.61, 'deposit', '2025-03-29 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 12, '2025-03-29 00:00:00'),
    (1, 33.0, NULL, 6.0, 4711.96, 'deposit', '2025-05-01 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 48, '2025-05-01 00:00:00'),
    (1, 19.0, NULL, NULL, 863.34, 'expense', '2025-03-05 00:00:00', 'Mobile Data Recharge', FALSE, NULL, NULL, 49, '2025-03-05 00:00:00'),
    (1, 39.0, NULL, NULL, 969.38, 'fee', '2025-02-05 00:00:00', 'Service Charge', FALSE, NULL, NULL, 32, '2025-02-05 00:00:00'),
    (1, 33.0, NULL, 2.0, 2969.26, 'expense', '2025-01-29 00:00:00', 'Utility Bill Payment', FALSE, NULL, NULL, 35, '2025-01-29 00:00:00'),
    (1, NULL, 12.0, NULL, 4697.38, 'withdrawal', '2025-05-31 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 28, '2025-05-31 00:00:00'),
    (1, 11.0, NULL, 3.0, 1522.41, 'fee', '2025-05-21 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 15, '2025-05-21 00:00:00'),
    (1, NULL, 10.0, NULL, 814.63, 'withdrawal', '2025-05-23 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 49, '2025-05-23 00:00:00'),
    (1, 11.0, NULL, 8.0, 3468.19, 'expense', '2025-03-20 00:00:00', 'Clothing Store Purchase', FALSE, NULL, NULL, 29, '2025-03-20 00:00:00'),
    (1, NULL, 10.0, NULL, 4574.42, 'income', '2025-04-25 00:00:00', 'Bonus Received', FALSE, NULL, 2.0, 1, '2025-04-25 00:00:00'),
    (1, 45.0, NULL, 6.0, 868.09, 'fee', '2025-05-28 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, 1.0, 16, '2025-05-28 00:00:00'),
    (1, 22.0, NULL, 6.0, 3322.95, 'income', '2025-01-20 00:00:00', 'Salary Payment', FALSE, 22.0, NULL, 49, '2025-01-20 00:00:00'),
    (1, 47.0, NULL, 9.0, 1788.65, 'transfer', '2025-02-05 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 3, '2025-02-05 00:00:00'),
    (1, 33.0, NULL, 5.0, 4700.03, 'income', '2025-03-13 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 26, '2025-03-13 00:00:00'),
    (1, NULL, 11.0, NULL, 3116.74, 'expense', '2025-01-13 00:00:00', 'Fuel Station', FALSE, 23.0, NULL, 13, '2025-01-13 00:00:00'),
    (1, 1.0, NULL, 4.0, 2658.77, 'transfer', '2025-06-07 00:00:00', 'Bank Internal Transfer', FALSE, 23.0, NULL, 14, '2025-06-07 00:00:00'),
    (1, 41.0, NULL, NULL, 2491.13, 'income', '2025-01-31 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 29, '2025-01-31 00:00:00'),
    (1, NULL, 2.0, 8.0, 1805.36, 'expense', '2025-04-26 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 10, '2025-04-26 00:00:00'),
    (1, NULL, 1.0, 4.0, 56.02, 'deposit', '2025-05-10 00:00:00', 'Cash Deposit at Branch', FALSE, 7.0, NULL, 24, '2025-05-10 00:00:00'),
    (1, NULL, 11.0, 8.0, 2825.3, 'deposit', '2025-03-26 00:00:00', 'Cheque Deposit', FALSE, NULL, 5.0, 25, '2025-03-26 00:00:00'),
    (1, 47.0, NULL, NULL, 1649.17, 'transfer', '2025-04-10 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 33, '2025-04-10 00:00:00'),
    (1, 45.0, NULL, NULL, 2873.97, 'transfer', '2025-05-03 00:00:00', 'Transfer from Checking', FALSE, 16.0, NULL, 9, '2025-05-03 00:00:00'),
    (1, NULL, 12.0, NULL, 1261.7, 'deposit', '2025-01-15 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 12, '2025-01-15 00:00:00'),
    (1, NULL, 9.0, NULL, 3405.88, 'deposit', '2025-05-17 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 34, '2025-05-17 00:00:00'),
    (1, 27.0, NULL, 9.0, 1622.13, 'withdrawal', '2025-05-02 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 26, '2025-05-02 00:00:00'),
    (1, 24.0, NULL, NULL, 1012.1, 'income', '2025-06-30 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 12, '2025-06-30 00:00:00'),
    (1, NULL, 2.0, 6.0, 1658.38, 'expense', '2025-02-23 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 37, '2025-02-23 00:00:00'),
    (1, 6.0, NULL, NULL, 3654.11, 'deposit', '2025-04-23 00:00:00', 'Online Deposit', FALSE, 17.0, 2.0, 35, '2025-04-23 00:00:00'),
    (2, 1.0, NULL, NULL, 4873.43, 'fee', '2025-04-19 00:00:00', 'Monthly Account Fee', FALSE, NULL, 1.0, 17, '2025-04-19 00:00:00'),
    (2, 41.0, NULL, NULL, 834.25, 'withdrawal', '2025-05-10 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 41, '2025-05-10 00:00:00'),
    (2, 31.0, NULL, NULL, 1754.43, 'transfer', '2025-05-04 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 40, '2025-05-04 00:00:00'),
    (2, 37.0, NULL, 6.0, 3564.65, 'income', '2025-05-24 00:00:00', 'Freelance Project Payment', FALSE, NULL, 2.0, 0, '2025-05-24 00:00:00'),
    (2, 32.0, NULL, NULL, 3319.49, 'withdrawal', '2025-02-18 00:00:00', 'ATM Cash Withdrawal', FALSE, 4.0, NULL, 20, '2025-02-18 00:00:00'),
    (2, 5.0, NULL, NULL, 2938.44, 'expense', '2025-01-15 00:00:00', 'Grocery Store Purchase', FALSE, 22.0, NULL, 20, '2025-01-15 00:00:00'),
    (2, NULL, 12.0, 2.0, 1520.67, 'income', '2025-06-18 00:00:00', 'Refund Processed', FALSE, 3.0, NULL, 24, '2025-06-18 00:00:00'),
    (2, NULL, 2.0, 4.0, 3034.28, 'transfer', '2025-03-07 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 12, '2025-03-07 00:00:00'),
    (2, 22.0, NULL, 3.0, 3360.71, 'fee', '2025-05-10 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 9, '2025-05-10 00:00:00'),
    (2, 48.0, NULL, NULL, 823.2, 'transfer', '2025-02-21 00:00:00', 'Transfer to Savings', TRUE, 12.0, NULL, 14, '2025-02-21 00:00:00'),
    (2, 24.0, NULL, 7.0, 2210.88, 'transfer', '2025-05-27 00:00:00', 'Transfer to Savings', FALSE, 12.0, NULL, 14, '2025-05-27 00:00:00'),
    (2, NULL, 6.0, 7.0, 4383.99, 'withdrawal', '2025-04-13 00:00:00', 'ATM Cash Withdrawal', FALSE, 6.0, NULL, 35, '2025-04-13 00:00:00'),
    (2, NULL, 1.0, NULL, 1461.63, 'income', '2025-05-22 00:00:00', 'Dividend Payment', FALSE, NULL, 2.0, 7, '2025-05-22 00:00:00'),
    (2, NULL, 2.0, 4.0, 3453.8, 'withdrawal', '2025-04-17 00:00:00', 'Cash Removed from Account', TRUE, 21.0, NULL, 38, '2025-04-17 00:00:00'),
    (2, 48.0, NULL, NULL, 4301.3, 'transfer', '2025-06-08 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 37, '2025-06-08 00:00:00'),
    (2, 9.0, NULL, NULL, 648.51, 'withdrawal', '2025-03-25 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 44, '2025-03-25 00:00:00'),
    (2, 2.0, NULL, NULL, 2626.0, 'deposit', '2025-06-30 00:00:00', 'Cheque Deposit', FALSE, NULL, 3.0, 15, '2025-06-30 00:00:00'),
    (2, 34.0, NULL, NULL, 3208.38, 'expense', '2025-04-26 00:00:00', 'Grocery Store Purchase', FALSE, NULL, NULL, 34, '2025-04-26 00:00:00'),
    (2, 26.0, NULL, 9.0, 4520.95, 'expense', '2025-05-18 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 5, '2025-05-18 00:00:00'),
    (2, 48.0, NULL, NULL, 1613.05, 'fee', '2025-02-11 00:00:00', 'Monthly Account Fee', FALSE, 16.0, 4.0, 29, '2025-02-11 00:00:00'),
    (2, 23.0, NULL, NULL, 3182.86, 'transfer', '2025-02-27 00:00:00', 'Transfer to Savings', FALSE, 23.0, NULL, 24, '2025-02-27 00:00:00'),
    (2, NULL, 4.0, NULL, 2175.04, 'income', '2025-03-04 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 29, '2025-03-04 00:00:00'),
    (2, NULL, 9.0, NULL, 4789.97, 'expense', '2025-01-20 00:00:00', 'Monthly Rent Payment', FALSE, NULL, NULL, 8, '2025-01-20 00:00:00'),
    (2, 43.0, NULL, NULL, 159.55, 'deposit', '2025-06-19 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 47, '2025-06-19 00:00:00'),
    (2, 40.0, NULL, 3.0, 2454.25, 'fee', '2025-06-12 00:00:00', 'ATM Withdrawal Fee', FALSE, 5.0, NULL, 37, '2025-06-12 00:00:00'),
    (2, NULL, 2.0, 5.0, 1619.47, 'deposit', '2025-03-23 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 23, '2025-03-23 00:00:00'),
    (2, 27.0, NULL, NULL, 2658.09, 'deposit', '2025-06-16 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 39, '2025-06-16 00:00:00'),
    (2, NULL, 8.0, NULL, 165.47, 'expense', '2025-03-15 00:00:00', 'Grocery Store Purchase', FALSE, NULL, 2.0, 15, '2025-03-15 00:00:00'),
    (2, NULL, 3.0, 2.0, 3870.75, 'income', '2025-02-22 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 27, '2025-02-22 00:00:00'),
    (2, 47.0, NULL, NULL, 1900.92, 'transfer', '2025-01-07 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 29, '2025-01-07 00:00:00'),
    (2, NULL, 10.0, 5.0, 1617.46, 'transfer', '2025-06-26 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 25, '2025-06-26 00:00:00'),
    (2, 40.0, NULL, 4.0, 3601.48, 'deposit', '2025-01-31 00:00:00', 'Online Deposit', FALSE, 19.0, 3.0, 13, '2025-01-31 00:00:00'),
    (2, NULL, 2.0, 4.0, 2243.25, 'expense', '2025-05-28 00:00:00', 'Coffee Shop', FALSE, 22.0, NULL, 23, '2025-05-28 00:00:00'),
    (2, NULL, 13.0, NULL, 1278.78, 'expense', '2025-06-01 00:00:00', 'Monthly Rent Payment', FALSE, NULL, 4.0, 10, '2025-06-01 00:00:00'),
    (2, 49.0, NULL, NULL, 115.03, 'expense', '2025-05-08 00:00:00', 'Restaurant Dinner', FALSE, 20.0, NULL, 26, '2025-05-08 00:00:00'),
    (2, 38.0, NULL, NULL, 4364.28, 'expense', '2025-06-12 00:00:00', 'Mobile Data Recharge', FALSE, 19.0, 1.0, 4, '2025-06-12 00:00:00'),
    (2, 10.0, NULL, 7.0, 1540.41, 'transfer', '2025-03-08 00:00:00', 'Bank Internal Transfer', FALSE, 10.0, NULL, 30, '2025-03-08 00:00:00'),
    (2, NULL, 5.0, 7.0, 4387.44, 'income', '2025-02-27 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 19, '2025-02-27 00:00:00'),
    (2, 30.0, NULL, 4.0, 3176.52, 'income', '2025-01-19 00:00:00', 'Dividend Payment', FALSE, 1.0, NULL, 48, '2025-01-19 00:00:00'),
    (2, NULL, 3.0, 9.0, 3745.38, 'withdrawal', '2025-03-02 00:00:00', 'Cash Removed from Account', FALSE, NULL, 3.0, 44, '2025-03-02 00:00:00'),
    (3, NULL, 1.0, 1.0, 2783.42, 'deposit', '2025-06-18 00:00:00', 'Cash Deposit at Branch', FALSE, 9.0, NULL, 5, '2025-06-18 00:00:00'),
    (3, 34.0, NULL, NULL, 4992.67, 'withdrawal', '2025-06-01 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 44, '2025-06-01 00:00:00'),
    (3, NULL, 7.0, NULL, 4011.99, 'income', '2025-04-18 00:00:00', 'Salary Payment', TRUE, NULL, NULL, 49, '2025-04-18 00:00:00'),
    (3, 44.0, NULL, NULL, 2915.01, 'expense', '2025-06-01 00:00:00', 'Monthly Rent Payment', FALSE, NULL, NULL, 38, '2025-06-01 00:00:00'),
    (3, 7.0, NULL, 2.0, 1770.46, 'income', '2025-03-17 00:00:00', 'Bonus Received', FALSE, NULL, 5.0, 37, '2025-03-17 00:00:00'),
    (3, NULL, 3.0, NULL, 3605.29, 'transfer', '2025-05-01 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 11, '2025-05-01 00:00:00'),
    (3, 9.0, NULL, NULL, 4559.68, 'transfer', '2025-03-13 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 45, '2025-03-13 00:00:00'),
    (3, 38.0, NULL, NULL, 4250.05, 'transfer', '2025-04-11 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 29, '2025-04-11 00:00:00'),
    (3, NULL, 12.0, NULL, 969.54, 'transfer', '2025-05-14 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 16, '2025-05-14 00:00:00'),
    (3, 35.0, NULL, NULL, 2947.12, 'expense', '2025-06-08 00:00:00', 'Utility Bill Payment', FALSE, NULL, NULL, 28, '2025-06-08 00:00:00'),
    (3, 51.0, NULL, NULL, 2810.26, 'income', '2025-03-22 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 30, '2025-03-22 00:00:00'),
    (3, NULL, 8.0, NULL, 1269.76, 'withdrawal', '2025-02-01 00:00:00', 'Cash Removed from Account', FALSE, NULL, 3.0, 29, '2025-02-01 00:00:00'),
    (3, NULL, 6.0, 9.0, 389.8, 'fee', '2025-01-18 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 12, '2025-01-18 00:00:00'),
    (3, 41.0, NULL, NULL, 4607.91, 'fee', '2025-05-20 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 1, '2025-05-20 00:00:00'),
    (3, 21.0, NULL, NULL, 2921.51, 'expense', '2025-03-05 00:00:00', 'Restaurant Dinner', TRUE, NULL, NULL, 50, '2025-03-05 00:00:00'),
    (3, 40.0, NULL, 8.0, 1287.03, 'withdrawal', '2025-04-24 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, 2.0, 43, '2025-04-24 00:00:00'),
    (3, 19.0, NULL, NULL, 3761.45, 'deposit', '2025-03-21 00:00:00', 'Cheque Deposit', FALSE, 12.0, 4.0, 4, '2025-03-21 00:00:00'),
    (3, 48.0, NULL, 7.0, 1501.59, 'withdrawal', '2025-04-05 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 45, '2025-04-05 00:00:00'),
    (3, NULL, 3.0, NULL, 4104.57, 'transfer', '2025-03-05 00:00:00', 'Bank Internal Transfer', FALSE, 23.0, NULL, 19, '2025-03-05 00:00:00'),
    (3, NULL, 12.0, 1.0, 3543.46, 'fee', '2025-04-15 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 31, '2025-04-15 00:00:00'),
    (3, 24.0, NULL, 1.0, 1336.88, 'transfer', '2025-05-21 00:00:00', 'Bank Internal Transfer', FALSE, NULL, 5.0, 14, '2025-05-21 00:00:00'),
    (3, NULL, 2.0, NULL, 3524.22, 'fee', '2025-04-23 00:00:00', 'Service Charge', FALSE, NULL, NULL, 28, '2025-04-23 00:00:00'),
    (3, 24.0, NULL, 8.0, 4270.43, 'fee', '2025-03-22 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 12, '2025-03-22 00:00:00'),
    (3, NULL, 8.0, 5.0, 43.03, 'withdrawal', '2025-04-30 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 14, '2025-04-30 00:00:00'),
    (3, NULL, 5.0, NULL, 3200.87, 'deposit', '2025-04-14 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 46, '2025-04-14 00:00:00'),
    (3, NULL, 7.0, 8.0, 3425.03, 'deposit', '2025-02-03 00:00:00', 'Online Deposit', FALSE, 2.0, NULL, 9, '2025-02-03 00:00:00'),
    (3, NULL, 4.0, NULL, 4856.97, 'withdrawal', '2025-01-14 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 1, '2025-01-14 00:00:00'),
    (3, 47.0, NULL, NULL, 165.71, 'withdrawal', '2025-01-26 00:00:00', 'Cash Removed from Account', FALSE, 14.0, NULL, 1, '2025-01-26 00:00:00'),
    (3, 45.0, NULL, NULL, 3405.61, 'deposit', '2025-04-23 00:00:00', 'Online Deposit', FALSE, NULL, 3.0, 26, '2025-04-23 00:00:00'),
    (3, 19.0, NULL, 3.0, 2909.87, 'income', '2025-03-22 00:00:00', 'Freelance Project Payment', FALSE, 16.0, NULL, 39, '2025-03-22 00:00:00'),
    (3, NULL, 3.0, NULL, 3323.22, 'transfer', '2025-02-14 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 36, '2025-02-14 00:00:00'),
    (3, 46.0, NULL, NULL, 4880.56, 'income', '2025-03-22 00:00:00', 'Refund Processed', FALSE, NULL, 5.0, 6, '2025-03-22 00:00:00'),
    (3, 10.0, NULL, NULL, 2240.61, 'fee', '2025-01-23 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 20, '2025-01-23 00:00:00'),
    (3, 38.0, NULL, 7.0, 4234.3, 'income', '2025-03-26 00:00:00', 'Interest Income', FALSE, 11.0, NULL, 36, '2025-03-26 00:00:00'),
    (3, NULL, 6.0, 1.0, 374.16, 'transfer', '2025-05-07 00:00:00', 'Transfer from Checking', TRUE, NULL, NULL, 0, '2025-05-07 00:00:00'),
    (3, NULL, 10.0, NULL, 703.91, 'income', '2025-02-09 00:00:00', 'Salary Payment', FALSE, 18.0, 2.0, 29, '2025-02-09 00:00:00'),
    (3, NULL, 13.0, NULL, 167.82, 'deposit', '2025-04-18 00:00:00', 'Online Deposit', FALSE, 5.0, 5.0, 5, '2025-04-18 00:00:00'),
    (3, 32.0, NULL, 3.0, 922.72, 'withdrawal', '2025-05-03 00:00:00', 'ATM Cash Withdrawal', FALSE, 12.0, NULL, 21, '2025-05-03 00:00:00'),
    (3, 22.0, NULL, 7.0, 3624.52, 'fee', '2025-01-11 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 18, '2025-01-11 00:00:00'),
    (3, 4.0, NULL, 9.0, 1486.36, 'withdrawal', '2025-01-23 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 49, '2025-01-23 00:00:00'),
    (3, 36.0, NULL, NULL, 2245.9, 'deposit', '2025-05-10 00:00:00', 'Cash Deposit at Branch', FALSE, 19.0, 5.0, 27, '2025-05-10 00:00:00'),
    (3, 36.0, NULL, 9.0, 727.6, 'fee', '2025-02-01 00:00:00', 'ATM Withdrawal Fee', TRUE, NULL, NULL, 31, '2025-02-01 00:00:00'),
    (3, 39.0, NULL, 9.0, 2384.38, 'deposit', '2025-01-02 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 12, '2025-01-02 00:00:00'),
    (3, 42.0, NULL, NULL, 1908.27, 'expense', '2025-04-29 00:00:00', 'Mobile Data Recharge', FALSE, 5.0, NULL, 32, '2025-04-29 00:00:00'),
    (3, 42.0, NULL, 6.0, 3381.7, 'fee', '2025-04-13 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, 1.0, 7, '2025-04-13 00:00:00'),
    (3, 31.0, NULL, 6.0, 4220.83, 'income', '2025-05-13 00:00:00', 'Refund Processed', FALSE, 22.0, NULL, 33, '2025-05-13 00:00:00'),
    (3, 16.0, NULL, NULL, 4228.99, 'deposit', '2025-02-20 00:00:00', 'Cheque Deposit', TRUE, NULL, NULL, 11, '2025-02-20 00:00:00'),
    (3, NULL, 7.0, 1.0, 709.63, 'income', '2025-01-06 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 2, '2025-01-06 00:00:00'),
    (3, NULL, 2.0, 8.0, 2194.74, 'income', '2025-02-23 00:00:00', 'Freelance Project Payment', FALSE, 14.0, NULL, 7, '2025-02-23 00:00:00'),
    (3, 31.0, NULL, NULL, 4610.54, 'deposit', '2025-05-20 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 42, '2025-05-20 00:00:00'),
    (3, 5.0, NULL, NULL, 2328.36, 'transfer', '2025-06-29 00:00:00', 'Bank Internal Transfer', FALSE, 23.0, NULL, 0, '2025-06-29 00:00:00'),
    (3, 17.0, NULL, 5.0, 1962.64, 'income', '2025-04-06 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 7, '2025-04-06 00:00:00'),
    (3, 30.0, NULL, 2.0, 1504.46, 'income', '2025-01-05 00:00:00', 'Refund Processed', FALSE, 18.0, NULL, 44, '2025-01-05 00:00:00'),
    (3, 11.0, NULL, 1.0, 3868.12, 'income', '2025-04-01 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 3, '2025-04-01 00:00:00'),
    (3, 40.0, NULL, NULL, 4397.85, 'transfer', '2025-01-04 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 46, '2025-01-04 00:00:00'),
    (3, 32.0, NULL, 6.0, 1871.6, 'deposit', '2025-04-19 00:00:00', 'Cheque Deposit', FALSE, 1.0, NULL, 33, '2025-04-19 00:00:00'),
    (3, 9.0, NULL, 7.0, 3385.4, 'fee', '2025-02-21 00:00:00', 'Service Charge', FALSE, NULL, NULL, 3, '2025-02-21 00:00:00'),
    (3, 33.0, NULL, 3.0, 4951.81, 'fee', '2025-05-12 00:00:00', 'ATM Withdrawal Fee', FALSE, 6.0, NULL, 48, '2025-05-12 00:00:00'),
    (3, 21.0, NULL, 6.0, 2142.81, 'withdrawal', '2025-02-14 00:00:00', 'ATM Cash Withdrawal', FALSE, 7.0, NULL, 22, '2025-02-14 00:00:00'),
    (3, NULL, 6.0, 8.0, 1421.51, 'fee', '2025-03-23 00:00:00', 'Monthly Account Fee', FALSE, 9.0, NULL, 3, '2025-03-23 00:00:00'),
    (3, 37.0, NULL, NULL, 3715.17, 'withdrawal', '2025-04-01 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 13, '2025-04-01 00:00:00'),
    (3, NULL, 5.0, 1.0, 4246.37, 'withdrawal', '2025-03-26 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 3, '2025-03-26 00:00:00'),
    (3, 43.0, NULL, 3.0, 3468.86, 'deposit', '2025-01-18 00:00:00', 'Cheque Deposit', FALSE, 2.0, NULL, 40, '2025-01-18 00:00:00'),
    (3, NULL, 7.0, 9.0, 2624.62, 'income', '2025-06-16 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 33, '2025-06-16 00:00:00'),
    (3, NULL, 12.0, 3.0, 2254.01, 'expense', '2025-06-01 00:00:00', 'Mobile Data Recharge', FALSE, 9.0, NULL, 8, '2025-06-01 00:00:00'),
    (3, 5.0, NULL, NULL, 1320.66, 'fee', '2025-06-19 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 23, '2025-06-19 00:00:00'),
    (3, NULL, 12.0, 5.0, 4086.15, 'income', '2025-02-14 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 46, '2025-02-14 00:00:00'),
    (4, NULL, 11.0, NULL, 3893.61, 'transfer', '2025-03-21 00:00:00', 'Transfer from Checking', FALSE, 4.0, NULL, 48, '2025-03-21 00:00:00'),
    (4, NULL, 11.0, NULL, 698.25, 'withdrawal', '2025-06-25 00:00:00', 'Cash Removed from Account', TRUE, 4.0, NULL, 20, '2025-06-25 00:00:00'),
    (4, 22.0, NULL, 4.0, 300.66, 'fee', '2025-01-11 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 23, '2025-01-11 00:00:00'),
    (4, 17.0, NULL, 7.0, 3606.82, 'transfer', '2025-01-07 00:00:00', 'Bank Internal Transfer', FALSE, 12.0, NULL, 31, '2025-01-07 00:00:00'),
    (4, 24.0, NULL, 1.0, 2968.08, 'expense', '2025-03-13 00:00:00', 'Clothing Store Purchase', FALSE, 15.0, NULL, 31, '2025-03-13 00:00:00'),
    (4, 2.0, NULL, NULL, 3858.49, 'fee', '2025-02-12 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 36, '2025-02-12 00:00:00'),
    (4, NULL, 6.0, NULL, 3035.81, 'income', '2025-05-02 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 48, '2025-05-02 00:00:00'),
    (4, 3.0, NULL, 1.0, 3999.42, 'expense', '2025-06-26 00:00:00', 'Clothing Store Purchase', FALSE, 4.0, NULL, 49, '2025-06-26 00:00:00'),
    (4, NULL, 3.0, 6.0, 38.0, 'transfer', '2025-03-31 00:00:00', 'Transfer from Checking', FALSE, 21.0, NULL, 5, '2025-03-31 00:00:00'),
    (4, 28.0, NULL, 5.0, 4225.69, 'expense', '2025-04-22 00:00:00', 'Mobile Data Recharge', TRUE, NULL, NULL, 31, '2025-04-22 00:00:00'),
    (4, NULL, 1.0, NULL, 2594.93, 'withdrawal', '2025-03-01 00:00:00', 'ATM Cash Withdrawal', FALSE, 7.0, NULL, 33, '2025-03-01 00:00:00'),
    (4, NULL, 13.0, NULL, 3898.15, 'expense', '2025-06-12 00:00:00', 'Coffee Shop', FALSE, NULL, NULL, 37, '2025-06-12 00:00:00'),
    (4, NULL, 12.0, NULL, 192.08, 'deposit', '2025-06-20 00:00:00', 'Cheque Deposit', FALSE, 5.0, NULL, 50, '2025-06-20 00:00:00'),
    (4, 40.0, NULL, NULL, 997.9, 'income', '2025-04-26 00:00:00', 'Interest Income', FALSE, NULL, NULL, 39, '2025-04-26 00:00:00'),
    (4, 43.0, NULL, NULL, 1370.26, 'expense', '2025-02-22 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 2, '2025-02-22 00:00:00'),
    (4, 30.0, NULL, NULL, 2167.3, 'transfer', '2025-04-14 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 4, '2025-04-14 00:00:00'),
    (4, 42.0, NULL, 2.0, 2256.58, 'income', '2025-01-05 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 25, '2025-01-05 00:00:00'),
    (4, 34.0, NULL, 5.0, 1816.02, 'expense', '2025-06-09 00:00:00', 'Grocery Store Purchase', FALSE, NULL, NULL, 42, '2025-06-09 00:00:00'),
    (4, NULL, 4.0, 9.0, 1974.48, 'income', '2025-03-14 00:00:00', 'Bonus Received', FALSE, 19.0, NULL, 27, '2025-03-14 00:00:00'),
    (4, NULL, 7.0, NULL, 1591.15, 'withdrawal', '2025-03-15 00:00:00', 'ATM Cash Withdrawal', TRUE, 9.0, NULL, 2, '2025-03-15 00:00:00'),
    (4, 28.0, NULL, NULL, 2053.2, 'transfer', '2025-04-03 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 45, '2025-04-03 00:00:00'),
    (4, 8.0, NULL, NULL, 3947.42, 'transfer', '2025-05-14 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 17, '2025-05-14 00:00:00'),
    (4, 47.0, NULL, NULL, 3834.22, 'deposit', '2025-03-31 00:00:00', 'Online Deposit', FALSE, 22.0, NULL, 50, '2025-03-31 00:00:00'),
    (4, 2.0, NULL, NULL, 2725.75, 'deposit', '2025-03-22 00:00:00', 'Cheque Deposit', FALSE, 12.0, 3.0, 28, '2025-03-22 00:00:00'),
    (4, NULL, 1.0, 6.0, 684.94, 'income', '2025-05-31 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 46, '2025-05-31 00:00:00'),
    (4, 8.0, NULL, 4.0, 2754.44, 'income', '2025-03-24 00:00:00', 'Freelance Project Payment', FALSE, NULL, 3.0, 5, '2025-03-24 00:00:00'),
    (4, 50.0, NULL, NULL, 2346.27, 'fee', '2025-02-11 00:00:00', 'ATM Withdrawal Fee', FALSE, 9.0, NULL, 15, '2025-02-11 00:00:00'),
    (4, 3.0, NULL, NULL, 3219.53, 'deposit', '2025-03-24 00:00:00', 'Cash Deposit at Branch', FALSE, 6.0, NULL, 2, '2025-03-24 00:00:00'),
    (4, 30.0, NULL, NULL, 209.91, 'income', '2025-06-04 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 25, '2025-06-04 00:00:00'),
    (4, 36.0, NULL, NULL, 4985.55, 'transfer', '2025-05-21 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 36, '2025-05-21 00:00:00'),
    (4, NULL, 1.0, NULL, 4387.53, 'expense', '2025-05-13 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 5, '2025-05-13 00:00:00'),
    (4, 19.0, NULL, 2.0, 2027.55, 'deposit', '2025-02-08 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 10, '2025-02-08 00:00:00'),
    (4, 44.0, NULL, 5.0, 112.85, 'transfer', '2025-06-10 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 23, '2025-06-10 00:00:00'),
    (4, 47.0, NULL, 1.0, 1722.14, 'deposit', '2025-05-14 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 28, '2025-05-14 00:00:00'),
    (4, 18.0, NULL, 6.0, 3348.47, 'income', '2025-02-26 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 31, '2025-02-26 00:00:00'),
    (4, 39.0, NULL, 6.0, 4470.51, 'withdrawal', '2025-06-25 00:00:00', 'ATM Cash Withdrawal', TRUE, NULL, 1.0, 49, '2025-06-25 00:00:00'),
    (4, NULL, 10.0, 6.0, 2992.41, 'transfer', '2025-02-14 00:00:00', 'Transfer to Savings', TRUE, 21.0, 1.0, 35, '2025-02-14 00:00:00'),
    (4, NULL, 8.0, 9.0, 1134.21, 'withdrawal', '2025-06-17 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 21, '2025-06-17 00:00:00'),
    (4, NULL, 9.0, NULL, 3066.38, 'withdrawal', '2025-06-21 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 22, '2025-06-21 00:00:00'),
    (4, 34.0, NULL, 1.0, 718.75, 'transfer', '2025-06-05 00:00:00', 'Bank Internal Transfer', TRUE, NULL, NULL, 22, '2025-06-05 00:00:00'),
    (4, NULL, 2.0, 2.0, 661.06, 'income', '2025-06-22 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 15, '2025-06-22 00:00:00'),
    (4, 14.0, NULL, NULL, 3179.05, 'expense', '2025-06-25 00:00:00', 'Fuel Station', FALSE, NULL, NULL, 25, '2025-06-25 00:00:00'),
    (4, NULL, 8.0, NULL, 396.43, 'fee', '2025-02-24 00:00:00', 'Service Charge', TRUE, 7.0, NULL, 3, '2025-02-24 00:00:00'),
    (4, NULL, 10.0, 6.0, 2322.46, 'expense', '2025-06-13 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 30, '2025-06-13 00:00:00'),
    (4, 21.0, NULL, NULL, 421.13, 'expense', '2025-03-18 00:00:00', 'Public Transport Fare', FALSE, NULL, NULL, 15, '2025-03-18 00:00:00'),
    (4, 50.0, NULL, 1.0, 1726.54, 'expense', '2025-02-05 00:00:00', 'Coffee Shop', FALSE, NULL, NULL, 8, '2025-02-05 00:00:00'),
    (4, NULL, 12.0, 4.0, 1767.64, 'deposit', '2025-03-01 00:00:00', 'Cheque Deposit', TRUE, NULL, NULL, 8, '2025-03-01 00:00:00'),
    (4, 4.0, NULL, 2.0, 2505.02, 'transfer', '2025-02-01 00:00:00', 'Transfer from Checking', FALSE, 5.0, NULL, 47, '2025-02-01 00:00:00'),
    (4, NULL, 10.0, NULL, 4647.96, 'transfer', '2025-06-18 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 25, '2025-06-18 00:00:00'),
    (4, NULL, 8.0, 5.0, 466.27, 'income', '2025-02-09 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 46, '2025-02-09 00:00:00'),
    (4, 49.0, NULL, NULL, 1616.17, 'income', '2025-02-23 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 12, '2025-02-23 00:00:00'),
    (4, 22.0, NULL, NULL, 1358.5, 'income', '2025-06-16 00:00:00', 'Interest Income', FALSE, 21.0, NULL, 46, '2025-06-16 00:00:00'),
    (4, NULL, 5.0, 2.0, 1054.92, 'deposit', '2025-05-27 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, 4.0, 14, '2025-05-27 00:00:00'),
    (4, 45.0, NULL, NULL, 627.19, 'deposit', '2025-03-02 00:00:00', 'Online Deposit', FALSE, NULL, 2.0, 43, '2025-03-02 00:00:00'),
    (4, 3.0, NULL, 9.0, 3235.47, 'expense', '2025-06-17 00:00:00', 'Public Transport Fare', FALSE, NULL, NULL, 26, '2025-06-17 00:00:00'),
    (4, 16.0, NULL, NULL, 795.59, 'income', '2025-06-01 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 12, '2025-06-01 00:00:00'),
    (4, 43.0, NULL, 7.0, 2186.95, 'transfer', '2025-02-17 00:00:00', 'Transfer to Savings', FALSE, 13.0, NULL, 7, '2025-02-17 00:00:00'),
    (4, 45.0, NULL, NULL, 2808.25, 'expense', '2025-06-20 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 20, '2025-06-20 00:00:00'),
    (4, NULL, 7.0, NULL, 940.28, 'transfer', '2025-01-18 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 48, '2025-01-18 00:00:00'),
    (4, 18.0, NULL, NULL, 4043.05, 'deposit', '2025-04-14 00:00:00', 'Cheque Deposit', TRUE, NULL, NULL, 20, '2025-04-14 00:00:00'),
    (4, NULL, 1.0, NULL, 3843.79, 'fee', '2025-04-19 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 1, '2025-04-19 00:00:00'),
    (4, NULL, 8.0, NULL, 1762.92, 'expense', '2025-04-21 00:00:00', 'Fuel Station', TRUE, NULL, NULL, 50, '2025-04-21 00:00:00'),
    (5, 27.0, NULL, NULL, 3530.93, 'fee', '2025-04-25 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 6, '2025-04-25 00:00:00'),
    (5, 31.0, NULL, 7.0, 2134.98, 'expense', '2025-03-07 00:00:00', 'Public Transport Fare', FALSE, 20.0, NULL, 7, '2025-03-07 00:00:00'),
    (5, 19.0, NULL, NULL, 3988.5, 'expense', '2025-02-23 00:00:00', 'Grocery Store Purchase', FALSE, NULL, NULL, 13, '2025-02-23 00:00:00'),
    (5, NULL, 4.0, 1.0, 4372.84, 'withdrawal', '2025-01-27 00:00:00', 'ATM Cash Withdrawal', TRUE, NULL, NULL, 44, '2025-01-27 00:00:00'),
    (5, 17.0, NULL, NULL, 2804.04, 'transfer', '2025-01-04 00:00:00', 'Bank Internal Transfer', FALSE, 20.0, NULL, 20, '2025-01-04 00:00:00'),
    (5, 19.0, NULL, 6.0, 3522.93, 'expense', '2025-02-03 00:00:00', 'Utility Bill Payment', FALSE, NULL, NULL, 23, '2025-02-03 00:00:00'),
    (5, 41.0, NULL, NULL, 3529.27, 'expense', '2025-04-05 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 48, '2025-04-05 00:00:00'),
    (5, 20.0, NULL, 9.0, 4355.0, 'withdrawal', '2025-01-05 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 2, '2025-01-05 00:00:00'),
    (5, NULL, 6.0, NULL, 4248.03, 'income', '2025-01-28 00:00:00', 'Interest Income', FALSE, NULL, NULL, 49, '2025-01-28 00:00:00'),
    (5, 33.0, NULL, 5.0, 4868.59, 'expense', '2025-01-26 00:00:00', 'Monthly Rent Payment', FALSE, NULL, NULL, 20, '2025-01-26 00:00:00'),
    (5, 27.0, NULL, 8.0, 985.12, 'withdrawal', '2025-02-01 00:00:00', 'ATM Cash Withdrawal', TRUE, NULL, NULL, 34, '2025-02-01 00:00:00'),
    (5, 44.0, NULL, NULL, 3309.95, 'withdrawal', '2025-06-23 00:00:00', 'Cash Removed from Account', FALSE, 22.0, NULL, 29, '2025-06-23 00:00:00'),
    (5, 25.0, NULL, 4.0, 1550.76, 'expense', '2025-01-19 00:00:00', 'Streaming Subscription', FALSE, 18.0, 4.0, 50, '2025-01-19 00:00:00'),
    (5, 50.0, NULL, 2.0, 4719.86, 'transfer', '2025-05-04 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 6, '2025-05-04 00:00:00'),
    (5, 3.0, NULL, NULL, 920.49, 'withdrawal', '2025-04-01 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 14, '2025-04-01 00:00:00'),
    (5, NULL, 8.0, 4.0, 3622.27, 'fee', '2025-01-21 00:00:00', 'Monthly Account Fee', TRUE, NULL, 4.0, 0, '2025-01-21 00:00:00'),
    (5, 36.0, NULL, 1.0, 4619.4, 'withdrawal', '2025-01-18 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 22, '2025-01-18 00:00:00'),
    (5, 37.0, NULL, 6.0, 4729.25, 'expense', '2025-02-18 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 27, '2025-02-18 00:00:00'),
    (5, NULL, 11.0, NULL, 1522.9, 'expense', '2025-05-10 00:00:00', 'Coffee Shop', FALSE, NULL, NULL, 16, '2025-05-10 00:00:00'),
    (5, 25.0, NULL, 8.0, 2823.11, 'income', '2025-03-26 00:00:00', 'Bonus Received', TRUE, NULL, NULL, 25, '2025-03-26 00:00:00'),
    (5, 23.0, NULL, NULL, 3194.13, 'expense', '2025-02-21 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 31, '2025-02-21 00:00:00'),
    (5, 27.0, NULL, 7.0, 808.68, 'transfer', '2025-05-17 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 29, '2025-05-17 00:00:00'),
    (5, 33.0, NULL, NULL, 2014.4, 'expense', '2025-01-27 00:00:00', 'Public Transport Fare', FALSE, NULL, NULL, 7, '2025-01-27 00:00:00'),
    (5, 18.0, NULL, 2.0, 2274.75, 'fee', '2025-04-04 00:00:00', 'ATM Withdrawal Fee', TRUE, 23.0, 3.0, 30, '2025-04-04 00:00:00'),
    (5, NULL, 2.0, 5.0, 2953.72, 'deposit', '2025-03-04 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 32, '2025-03-04 00:00:00'),
    (5, NULL, 11.0, NULL, 1700.38, 'income', '2025-03-03 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 17, '2025-03-03 00:00:00'),
    (5, 14.0, NULL, NULL, 1491.91, 'income', '2025-06-16 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 21, '2025-06-16 00:00:00'),
    (5, 7.0, NULL, NULL, 1064.81, 'fee', '2025-03-08 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 49, '2025-03-08 00:00:00'),
    (5, 33.0, NULL, 2.0, 3194.74, 'income', '2025-02-05 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 41, '2025-02-05 00:00:00'),
    (5, 43.0, NULL, 7.0, 153.08, 'withdrawal', '2025-02-10 00:00:00', 'Cash Removed from Account', FALSE, 3.0, NULL, 10, '2025-02-10 00:00:00'),
    (5, 15.0, NULL, 3.0, 1712.68, 'transfer', '2025-03-08 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 11, '2025-03-08 00:00:00'),
    (5, NULL, 1.0, 7.0, 1044.92, 'deposit', '2025-01-30 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 45, '2025-01-30 00:00:00'),
    (5, 16.0, NULL, NULL, 364.43, 'deposit', '2025-05-04 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 20, '2025-05-04 00:00:00'),
    (5, 8.0, NULL, 2.0, 3806.52, 'fee', '2025-06-27 00:00:00', 'Service Charge', FALSE, NULL, NULL, 4, '2025-06-27 00:00:00'),
    (5, 31.0, NULL, 9.0, 2380.66, 'fee', '2025-06-11 00:00:00', 'Monthly Account Fee', FALSE, NULL, 1.0, 36, '2025-06-11 00:00:00'),
    (6, NULL, 10.0, NULL, 96.55, 'income', '2025-02-11 00:00:00', 'Dividend Payment', FALSE, NULL, 1.0, 5, '2025-02-11 00:00:00'),
    (6, NULL, 4.0, 7.0, 3151.3, 'withdrawal', '2025-02-07 00:00:00', 'Cash Removed from Account', FALSE, NULL, 3.0, 21, '2025-02-07 00:00:00'),
    (6, NULL, 10.0, 8.0, 4824.69, 'withdrawal', '2025-01-02 00:00:00', 'ATM Cash Withdrawal', TRUE, NULL, NULL, 8, '2025-01-02 00:00:00'),
    (6, NULL, 10.0, 2.0, 2484.98, 'income', '2025-01-17 00:00:00', 'Dividend Payment', TRUE, 15.0, 1.0, 23, '2025-01-17 00:00:00'),
    (6, 41.0, NULL, 7.0, 2140.61, 'withdrawal', '2025-05-02 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, 3.0, 49, '2025-05-02 00:00:00'),
    (6, 27.0, NULL, NULL, 4028.67, 'expense', '2025-02-10 00:00:00', 'Utility Bill Payment', FALSE, NULL, NULL, 6, '2025-02-10 00:00:00'),
    (6, NULL, 8.0, NULL, 2132.72, 'deposit', '2025-04-05 00:00:00', 'Cheque Deposit', TRUE, 14.0, NULL, 46, '2025-04-05 00:00:00'),
    (6, 35.0, NULL, NULL, 2600.83, 'deposit', '2025-03-02 00:00:00', 'Online Deposit', FALSE, NULL, 5.0, 0, '2025-03-02 00:00:00'),
    (6, 35.0, NULL, 1.0, 1253.7, 'transfer', '2025-03-04 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 6, '2025-03-04 00:00:00'),
    (6, 29.0, NULL, NULL, 3520.49, 'expense', '2025-03-10 00:00:00', 'Grocery Store Purchase', FALSE, 9.0, NULL, 35, '2025-03-10 00:00:00'),
    (6, 24.0, NULL, NULL, 3310.53, 'expense', '2025-01-19 00:00:00', 'Streaming Subscription', FALSE, NULL, 1.0, 31, '2025-01-19 00:00:00'),
    (6, 15.0, NULL, 7.0, 714.77, 'transfer', '2025-05-20 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 26, '2025-05-20 00:00:00'),
    (6, 15.0, NULL, 3.0, 4242.66, 'transfer', '2025-04-04 00:00:00', 'Bank Internal Transfer', FALSE, 14.0, NULL, 18, '2025-04-04 00:00:00'),
    (6, 16.0, NULL, NULL, 1754.22, 'deposit', '2025-03-14 00:00:00', 'Cheque Deposit', FALSE, 19.0, NULL, 27, '2025-03-14 00:00:00'),
    (6, NULL, 2.0, 7.0, 4205.97, 'expense', '2025-03-27 00:00:00', 'Grocery Store Purchase', TRUE, 11.0, NULL, 45, '2025-03-27 00:00:00'),
    (6, 12.0, NULL, 9.0, 4185.05, 'fee', '2025-04-28 00:00:00', 'Service Charge', FALSE, NULL, NULL, 26, '2025-04-28 00:00:00'),
    (6, NULL, 8.0, NULL, 1485.68, 'income', '2025-05-01 00:00:00', 'Salary Payment', FALSE, 7.0, NULL, 25, '2025-05-01 00:00:00'),
    (6, 16.0, NULL, 5.0, 3305.43, 'fee', '2025-05-26 00:00:00', 'Monthly Account Fee', TRUE, NULL, 5.0, 27, '2025-05-26 00:00:00'),
    (6, NULL, 3.0, NULL, 87.56, 'expense', '2025-01-09 00:00:00', 'Fuel Station', FALSE, NULL, NULL, 20, '2025-01-09 00:00:00'),
    (6, NULL, 2.0, NULL, 3569.34, 'income', '2025-01-17 00:00:00', 'Freelance Project Payment', TRUE, NULL, NULL, 47, '2025-01-17 00:00:00'),
    (6, NULL, 2.0, NULL, 3125.59, 'fee', '2025-02-12 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 43, '2025-02-12 00:00:00'),
    (6, NULL, 9.0, NULL, 2391.88, 'deposit', '2025-05-20 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 15, '2025-05-20 00:00:00'),
    (6, 26.0, NULL, NULL, 3003.38, 'deposit', '2025-04-13 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 33, '2025-04-13 00:00:00'),
    (6, 51.0, NULL, 5.0, 277.85, 'transfer', '2025-02-15 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 18, '2025-02-15 00:00:00'),
    (6, 21.0, NULL, NULL, 2387.6, 'expense', '2025-04-05 00:00:00', 'Clothing Store Purchase', FALSE, NULL, NULL, 5, '2025-04-05 00:00:00'),
    (6, 44.0, NULL, 2.0, 4119.14, 'income', '2025-02-15 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 3, '2025-02-15 00:00:00'),
    (6, 9.0, NULL, NULL, 4349.59, 'withdrawal', '2025-02-07 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 28, '2025-02-07 00:00:00'),
    (6, NULL, 5.0, NULL, 3210.72, 'transfer', '2025-06-25 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 4, '2025-06-25 00:00:00'),
    (6, 11.0, NULL, NULL, 1650.01, 'withdrawal', '2025-01-29 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 44, '2025-01-29 00:00:00'),
    (6, NULL, 8.0, 7.0, 1971.71, 'fee', '2025-04-10 00:00:00', 'Monthly Account Fee', FALSE, 23.0, NULL, 26, '2025-04-10 00:00:00'),
    (6, 26.0, NULL, 3.0, 3796.71, 'expense', '2025-06-28 00:00:00', 'Mobile Data Recharge', FALSE, 23.0, NULL, 3, '2025-06-28 00:00:00'),
    (6, 25.0, NULL, NULL, 2387.65, 'fee', '2025-05-26 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 47, '2025-05-26 00:00:00'),
    (6, NULL, 10.0, NULL, 2898.02, 'expense', '2025-02-15 00:00:00', 'Coffee Shop', FALSE, 7.0, NULL, 25, '2025-02-15 00:00:00'),
    (6, 15.0, NULL, 1.0, 2409.14, 'deposit', '2025-06-05 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 11, '2025-06-05 00:00:00'),
    (6, 6.0, NULL, NULL, 2132.16, 'deposit', '2025-06-30 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 30, '2025-06-30 00:00:00'),
    (6, 48.0, NULL, 3.0, 4594.22, 'fee', '2025-03-10 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 33, '2025-03-10 00:00:00'),
    (6, 23.0, NULL, 2.0, 467.8, 'income', '2025-06-01 00:00:00', 'Freelance Project Payment', TRUE, NULL, NULL, 41, '2025-06-01 00:00:00'),
    (6, 12.0, NULL, NULL, 4501.53, 'fee', '2025-01-02 00:00:00', 'ATM Withdrawal Fee', FALSE, 17.0, 4.0, 4, '2025-01-02 00:00:00'),
    (6, 44.0, NULL, 2.0, 102.28, 'fee', '2025-02-21 00:00:00', 'Monthly Account Fee', FALSE, 14.0, NULL, 34, '2025-02-21 00:00:00'),
    (6, NULL, 11.0, 5.0, 3833.84, 'fee', '2025-01-26 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 30, '2025-01-26 00:00:00'),
    (6, 42.0, NULL, NULL, 2762.27, 'income', '2025-03-19 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 6, '2025-03-19 00:00:00'),
    (6, 26.0, NULL, 9.0, 4990.07, 'deposit', '2025-04-04 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 29, '2025-04-04 00:00:00'),
    (6, NULL, 7.0, NULL, 1432.0, 'fee', '2025-05-17 00:00:00', 'Service Charge', FALSE, 11.0, NULL, 37, '2025-05-17 00:00:00'),
    (6, 12.0, NULL, NULL, 278.46, 'expense', '2025-06-10 00:00:00', 'Fuel Station', FALSE, NULL, NULL, 18, '2025-06-10 00:00:00'),
    (6, 30.0, NULL, NULL, 4689.86, 'income', '2025-06-16 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 44, '2025-06-16 00:00:00'),
    (6, 8.0, NULL, 1.0, 4066.77, 'expense', '2025-06-14 00:00:00', 'Monthly Rent Payment', FALSE, 5.0, NULL, 16, '2025-06-14 00:00:00'),
    (6, NULL, 5.0, NULL, 1234.49, 'transfer', '2025-04-01 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 25, '2025-04-01 00:00:00'),
    (6, 25.0, NULL, 4.0, 4351.8, 'fee', '2025-03-24 00:00:00', 'ATM Withdrawal Fee', FALSE, 13.0, NULL, 35, '2025-03-24 00:00:00'),
    (6, 1.0, NULL, NULL, 2099.96, 'expense', '2025-06-27 00:00:00', 'Monthly Rent Payment', FALSE, 18.0, NULL, 47, '2025-06-27 00:00:00'),
    (6, 47.0, NULL, 4.0, 4709.02, 'withdrawal', '2025-05-22 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 1, '2025-05-22 00:00:00'),
    (6, 34.0, NULL, 5.0, 319.23, 'deposit', '2025-04-04 00:00:00', 'Online Deposit', FALSE, NULL, 5.0, 31, '2025-04-04 00:00:00'),
    (6, 27.0, NULL, 7.0, 4511.93, 'transfer', '2025-06-21 00:00:00', 'Transfer from Checking', FALSE, 23.0, NULL, 30, '2025-06-21 00:00:00'),
    (6, 45.0, NULL, NULL, 73.87, 'withdrawal', '2025-06-13 00:00:00', 'ATM Cash Withdrawal', FALSE, 7.0, 2.0, 46, '2025-06-13 00:00:00'),
    (6, 9.0, NULL, NULL, 4702.35, 'transfer', '2025-04-23 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 33, '2025-04-23 00:00:00'),
    (6, 6.0, NULL, 4.0, 3006.26, 'income', '2025-05-25 00:00:00', 'Interest Income', TRUE, NULL, NULL, 6, '2025-05-25 00:00:00'),
    (6, 38.0, NULL, 6.0, 2763.12, 'fee', '2025-01-05 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 17, '2025-01-05 00:00:00'),
    (6, NULL, 6.0, 9.0, 4740.11, 'withdrawal', '2025-02-09 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 16, '2025-02-09 00:00:00'),
    (6, NULL, 5.0, 5.0, 1669.37, 'transfer', '2025-04-16 00:00:00', 'Transfer from Checking', FALSE, 18.0, 4.0, 4, '2025-04-16 00:00:00'),
    (6, NULL, 8.0, NULL, 4233.26, 'expense', '2025-04-08 00:00:00', 'Restaurant Dinner', FALSE, 23.0, NULL, 22, '2025-04-08 00:00:00'),
    (6, NULL, 4.0, NULL, 1575.4, 'income', '2025-05-24 00:00:00', 'Interest Income', FALSE, NULL, NULL, 47, '2025-05-24 00:00:00'),
    (6, 48.0, NULL, NULL, 1559.35, 'income', '2025-05-28 00:00:00', 'Dividend Payment', FALSE, NULL, 4.0, 37, '2025-05-28 00:00:00'),
    (6, 20.0, NULL, 6.0, 2220.38, 'income', '2025-02-10 00:00:00', 'Dividend Payment', FALSE, NULL, 2.0, 23, '2025-02-10 00:00:00'),
    (6, 4.0, NULL, NULL, 4790.67, 'transfer', '2025-04-20 00:00:00', 'Bank Internal Transfer', TRUE, NULL, NULL, 17, '2025-04-20 00:00:00'),
    (6, 34.0, NULL, NULL, 2654.99, 'income', '2025-06-02 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 42, '2025-06-02 00:00:00'),
    (6, NULL, 6.0, NULL, 3653.87, 'transfer', '2025-05-15 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 28, '2025-05-15 00:00:00'),
    (6, 12.0, NULL, NULL, 4269.44, 'expense', '2025-05-09 00:00:00', 'Fuel Station', FALSE, NULL, NULL, 12, '2025-05-09 00:00:00'),
    (6, NULL, 4.0, 1.0, 4858.57, 'expense', '2025-01-08 00:00:00', 'Mobile Data Recharge', FALSE, 16.0, NULL, 30, '2025-01-08 00:00:00'),
    (6, 2.0, NULL, NULL, 2630.76, 'transfer', '2025-03-12 00:00:00', 'Bank Internal Transfer', FALSE, 16.0, NULL, 12, '2025-03-12 00:00:00'),
    (6, 6.0, NULL, 4.0, 2347.74, 'transfer', '2025-01-24 00:00:00', 'Transfer from Checking', TRUE, NULL, 1.0, 18, '2025-01-24 00:00:00'),
    (6, 8.0, NULL, 8.0, 4433.03, 'income', '2025-06-20 00:00:00', 'Refund Processed', FALSE, 9.0, 3.0, 32, '2025-06-20 00:00:00'),
    (7, 13.0, NULL, 3.0, 2506.11, 'transfer', '2025-04-03 00:00:00', 'Bank Internal Transfer', FALSE, 17.0, NULL, 12, '2025-04-03 00:00:00'),
    (7, 1.0, NULL, 7.0, 732.56, 'income', '2025-05-22 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 7, '2025-05-22 00:00:00'),
    (7, 30.0, NULL, 9.0, 1823.02, 'deposit', '2025-05-24 00:00:00', 'Cheque Deposit', FALSE, NULL, 4.0, 22, '2025-05-24 00:00:00'),
    (7, NULL, 7.0, 1.0, 4789.37, 'fee', '2025-01-24 00:00:00', 'ATM Withdrawal Fee', TRUE, 23.0, NULL, 33, '2025-01-24 00:00:00'),
    (7, 6.0, NULL, 6.0, 2941.79, 'expense', '2025-02-14 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 43, '2025-02-14 00:00:00'),
    (7, 35.0, NULL, NULL, 3419.74, 'expense', '2025-01-21 00:00:00', 'Grocery Store Purchase', FALSE, NULL, 1.0, 41, '2025-01-21 00:00:00'),
    (7, 40.0, NULL, NULL, 3936.66, 'transfer', '2025-04-30 00:00:00', 'Transfer from Checking', FALSE, 3.0, NULL, 24, '2025-04-30 00:00:00'),
    (7, NULL, 10.0, 1.0, 3061.25, 'deposit', '2025-05-21 00:00:00', 'Cheque Deposit', FALSE, 8.0, NULL, 45, '2025-05-21 00:00:00'),
    (7, NULL, 9.0, 9.0, 4317.6, 'deposit', '2025-03-23 00:00:00', 'Cheque Deposit', FALSE, 12.0, NULL, 2, '2025-03-23 00:00:00'),
    (7, 4.0, NULL, NULL, 264.91, 'withdrawal', '2025-02-15 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 18, '2025-02-15 00:00:00'),
    (7, NULL, 2.0, NULL, 4827.53, 'transfer', '2025-06-06 00:00:00', 'Bank Internal Transfer', FALSE, 3.0, NULL, 15, '2025-06-06 00:00:00'),
    (7, 41.0, NULL, 9.0, 1818.0, 'withdrawal', '2025-02-09 00:00:00', 'Cash Removed from Account', FALSE, NULL, 4.0, 39, '2025-02-09 00:00:00'),
    (7, 16.0, NULL, NULL, 407.17, 'withdrawal', '2025-04-18 00:00:00', 'ATM Cash Withdrawal', TRUE, NULL, NULL, 26, '2025-04-18 00:00:00'),
    (7, 48.0, NULL, 5.0, 2697.06, 'transfer', '2025-06-25 00:00:00', 'Transfer to Savings', FALSE, 1.0, NULL, 18, '2025-06-25 00:00:00'),
    (7, 41.0, NULL, NULL, 3816.79, 'withdrawal', '2025-01-07 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 39, '2025-01-07 00:00:00'),
    (7, 36.0, NULL, NULL, 4628.55, 'deposit', '2025-04-16 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 28, '2025-04-16 00:00:00'),
    (7, 10.0, NULL, NULL, 4271.26, 'expense', '2025-02-21 00:00:00', 'Utility Bill Payment', TRUE, NULL, NULL, 27, '2025-02-21 00:00:00'),
    (7, 28.0, NULL, NULL, 3158.44, 'transfer', '2025-05-18 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 8, '2025-05-18 00:00:00'),
    (7, 11.0, NULL, NULL, 2604.09, 'transfer', '2025-04-02 00:00:00', 'Bank Internal Transfer', FALSE, 21.0, NULL, 6, '2025-04-02 00:00:00'),
    (7, 10.0, NULL, 1.0, 1480.66, 'income', '2025-01-02 00:00:00', 'Dividend Payment', FALSE, 11.0, 1.0, 3, '2025-01-02 00:00:00'),
    (7, NULL, 6.0, 5.0, 1433.39, 'fee', '2025-01-24 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 41, '2025-01-24 00:00:00'),
    (7, NULL, 2.0, 3.0, 2333.86, 'fee', '2025-06-02 00:00:00', 'Monthly Account Fee', FALSE, 10.0, NULL, 49, '2025-06-02 00:00:00'),
    (7, 18.0, NULL, 5.0, 2739.24, 'fee', '2025-01-12 00:00:00', 'Monthly Account Fee', FALSE, 14.0, NULL, 23, '2025-01-12 00:00:00'),
    (7, 23.0, NULL, 4.0, 4830.93, 'expense', '2025-03-13 00:00:00', 'Streaming Subscription', FALSE, 5.0, 3.0, 5, '2025-03-13 00:00:00'),
    (7, NULL, 3.0, NULL, 2982.51, 'expense', '2025-02-02 00:00:00', 'Grocery Store Purchase', FALSE, 19.0, NULL, 15, '2025-02-02 00:00:00'),
    (7, NULL, 13.0, NULL, 3473.95, 'deposit', '2025-01-21 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 13, '2025-01-21 00:00:00'),
    (7, 5.0, NULL, 3.0, 3251.77, 'withdrawal', '2025-02-27 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 12, '2025-02-27 00:00:00'),
    (7, NULL, 10.0, 1.0, 3766.16, 'transfer', '2025-03-15 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 43, '2025-03-15 00:00:00'),
    (7, 51.0, NULL, NULL, 4210.84, 'fee', '2025-02-14 00:00:00', 'Monthly Account Fee', FALSE, NULL, 3.0, 44, '2025-02-14 00:00:00'),
    (7, 27.0, NULL, 9.0, 2314.08, 'deposit', '2025-01-21 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 43, '2025-01-21 00:00:00'),
    (7, 5.0, NULL, 5.0, 3387.28, 'withdrawal', '2025-02-05 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 48, '2025-02-05 00:00:00'),
    (7, 16.0, NULL, 7.0, 4959.61, 'deposit', '2025-06-25 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 36, '2025-06-25 00:00:00'),
    (7, 23.0, NULL, 2.0, 1225.41, 'expense', '2025-02-13 00:00:00', 'Fuel Station', FALSE, NULL, NULL, 17, '2025-02-13 00:00:00'),
    (7, 24.0, NULL, NULL, 2509.34, 'transfer', '2025-06-24 00:00:00', 'Transfer from Checking', FALSE, 10.0, NULL, 1, '2025-06-24 00:00:00'),
    (7, NULL, 11.0, 3.0, 3667.73, 'withdrawal', '2025-02-28 00:00:00', 'ATM Cash Withdrawal', FALSE, 10.0, NULL, 41, '2025-02-28 00:00:00'),
    (7, 10.0, NULL, NULL, 1362.0, 'withdrawal', '2025-05-25 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 43, '2025-05-25 00:00:00'),
    (7, NULL, 2.0, NULL, 2859.23, 'deposit', '2025-04-07 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 42, '2025-04-07 00:00:00'),
    (7, 24.0, NULL, NULL, 1326.35, 'transfer', '2025-06-20 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 48, '2025-06-20 00:00:00'),
    (7, NULL, 5.0, 1.0, 549.24, 'fee', '2025-06-07 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, 5.0, 35, '2025-06-07 00:00:00'),
    (7, 1.0, NULL, NULL, 1346.9, 'fee', '2025-05-11 00:00:00', 'Monthly Account Fee', TRUE, NULL, NULL, 45, '2025-05-11 00:00:00'),
    (7, NULL, 8.0, NULL, 72.33, 'withdrawal', '2025-02-13 00:00:00', 'ATM Cash Withdrawal', FALSE, 13.0, 5.0, 1, '2025-02-13 00:00:00'),
    (7, 15.0, NULL, 8.0, 449.06, 'deposit', '2025-03-26 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 3, '2025-03-26 00:00:00'),
    (7, 36.0, NULL, 6.0, 1016.59, 'transfer', '2025-06-09 00:00:00', 'Transfer from Checking', FALSE, 14.0, NULL, 39, '2025-06-09 00:00:00'),
    (7, 29.0, NULL, 4.0, 4328.86, 'withdrawal', '2025-05-24 00:00:00', 'ATM Cash Withdrawal', TRUE, NULL, NULL, 21, '2025-05-24 00:00:00'),
    (7, 23.0, NULL, 2.0, 3663.92, 'expense', '2025-03-20 00:00:00', 'Utility Bill Payment', FALSE, NULL, NULL, 1, '2025-03-20 00:00:00'),
    (7, 21.0, NULL, NULL, 3065.78, 'deposit', '2025-05-23 00:00:00', 'Cheque Deposit', FALSE, NULL, 1.0, 12, '2025-05-23 00:00:00'),
    (7, NULL, 2.0, 3.0, 636.66, 'income', '2025-06-22 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 16, '2025-06-22 00:00:00'),
    (7, 12.0, NULL, 6.0, 1909.29, 'deposit', '2025-04-20 00:00:00', 'Cheque Deposit', FALSE, NULL, 4.0, 19, '2025-04-20 00:00:00'),
    (7, 20.0, NULL, NULL, 1998.17, 'withdrawal', '2025-01-24 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 28, '2025-01-24 00:00:00'),
    (7, 46.0, NULL, NULL, 3695.34, 'expense', '2025-03-02 00:00:00', 'Fuel Station', FALSE, NULL, 3.0, 40, '2025-03-02 00:00:00'),
    (7, 47.0, NULL, NULL, 916.34, 'withdrawal', '2025-02-14 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 15, '2025-02-14 00:00:00'),
    (7, 14.0, NULL, NULL, 1592.51, 'withdrawal', '2025-01-28 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 18, '2025-01-28 00:00:00'),
    (7, NULL, 12.0, NULL, 3344.61, 'transfer', '2025-01-11 00:00:00', 'Transfer from Checking', FALSE, 20.0, 2.0, 16, '2025-01-11 00:00:00'),
    (7, 18.0, NULL, 1.0, 3307.84, 'transfer', '2025-06-14 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 50, '2025-06-14 00:00:00'),
    (7, NULL, 10.0, NULL, 4114.18, 'deposit', '2025-06-03 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, 3.0, 1, '2025-06-03 00:00:00'),
    (7, NULL, 6.0, 1.0, 1659.49, 'expense', '2025-03-12 00:00:00', 'Streaming Subscription', FALSE, NULL, 2.0, 50, '2025-03-12 00:00:00'),
    (7, 9.0, NULL, NULL, 4587.89, 'transfer', '2025-04-02 00:00:00', 'Transfer from Checking', FALSE, 3.0, NULL, 12, '2025-04-02 00:00:00'),
    (7, 10.0, NULL, 8.0, 873.35, 'income', '2025-06-17 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 38, '2025-06-17 00:00:00'),
    (7, NULL, 6.0, NULL, 3416.35, 'withdrawal', '2025-03-06 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 25, '2025-03-06 00:00:00'),
    (7, 26.0, NULL, NULL, 1936.41, 'deposit', '2025-01-12 00:00:00', 'Online Deposit', FALSE, 9.0, NULL, 29, '2025-01-12 00:00:00'),
    (7, 19.0, NULL, NULL, 302.48, 'deposit', '2025-05-20 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 28, '2025-05-20 00:00:00'),
    (7, 22.0, NULL, 4.0, 667.01, 'income', '2025-05-30 00:00:00', 'Interest Income', FALSE, NULL, 1.0, 5, '2025-05-30 00:00:00'),
    (7, 23.0, NULL, NULL, 1737.51, 'expense', '2025-05-19 00:00:00', 'Fuel Station', FALSE, 10.0, NULL, 36, '2025-05-19 00:00:00'),
    (7, 13.0, NULL, 8.0, 3384.95, 'withdrawal', '2025-05-02 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 50, '2025-05-02 00:00:00'),
    (7, 38.0, NULL, NULL, 2834.39, 'deposit', '2025-01-01 00:00:00', 'Cash Deposit at Branch', FALSE, 11.0, NULL, 16, '2025-01-01 00:00:00'),
    (7, NULL, 11.0, 7.0, 3445.01, 'fee', '2025-02-19 00:00:00', 'Service Charge', FALSE, NULL, NULL, 32, '2025-02-19 00:00:00'),
    (7, 42.0, NULL, NULL, 3172.19, 'transfer', '2025-01-16 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 10, '2025-01-16 00:00:00'),
    (7, 50.0, NULL, NULL, 1169.61, 'expense', '2025-01-02 00:00:00', 'Clothing Store Purchase', FALSE, NULL, NULL, 38, '2025-01-02 00:00:00'),
    (7, NULL, 11.0, 7.0, 4744.24, 'transfer', '2025-05-02 00:00:00', 'Transfer to Savings', TRUE, NULL, NULL, 45, '2025-05-02 00:00:00'),
    (7, 37.0, NULL, NULL, 4220.98, 'deposit', '2025-03-28 00:00:00', 'Online Deposit', TRUE, 15.0, 2.0, 21, '2025-03-28 00:00:00'),
    (8, 46.0, NULL, NULL, 4688.21, 'income', '2025-01-22 00:00:00', 'Freelance Project Payment', FALSE, 5.0, NULL, 12, '2025-01-22 00:00:00'),
    (8, NULL, 3.0, NULL, 4848.58, 'fee', '2025-06-02 00:00:00', 'Monthly Account Fee', TRUE, NULL, 1.0, 16, '2025-06-02 00:00:00'),
    (8, 32.0, NULL, NULL, 4706.15, 'expense', '2025-05-21 00:00:00', 'Mobile Data Recharge', FALSE, NULL, NULL, 29, '2025-05-21 00:00:00'),
    (8, NULL, 10.0, NULL, 1033.48, 'fee', '2025-03-04 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 38, '2025-03-04 00:00:00'),
    (8, 40.0, NULL, 2.0, 915.99, 'expense', '2025-05-27 00:00:00', 'Mobile Data Recharge', TRUE, 21.0, NULL, 45, '2025-05-27 00:00:00'),
    (8, NULL, 5.0, 5.0, 4769.03, 'withdrawal', '2025-02-16 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, 3.0, 39, '2025-02-16 00:00:00'),
    (8, 34.0, NULL, NULL, 3546.94, 'fee', '2025-05-15 00:00:00', 'Monthly Account Fee', FALSE, NULL, 5.0, 50, '2025-05-15 00:00:00'),
    (8, 12.0, NULL, NULL, 2007.89, 'withdrawal', '2025-04-17 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 22, '2025-04-17 00:00:00'),
    (8, 23.0, NULL, NULL, 3653.24, 'income', '2025-01-24 00:00:00', 'Dividend Payment', FALSE, NULL, NULL, 42, '2025-01-24 00:00:00'),
    (8, NULL, 8.0, NULL, 1927.59, 'withdrawal', '2025-06-16 00:00:00', 'Cash Removed from Account', FALSE, 7.0, NULL, 40, '2025-06-16 00:00:00'),
    (8, 3.0, NULL, NULL, 2670.02, 'deposit', '2025-01-25 00:00:00', 'Cheque Deposit', FALSE, 1.0, 3.0, 16, '2025-01-25 00:00:00'),
    (8, 28.0, NULL, 5.0, 3338.96, 'fee', '2025-01-29 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 21, '2025-01-29 00:00:00'),
    (8, 27.0, NULL, NULL, 636.49, 'withdrawal', '2025-02-24 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 37, '2025-02-24 00:00:00'),
    (8, 45.0, NULL, 1.0, 3397.84, 'withdrawal', '2025-03-18 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 5, '2025-03-18 00:00:00'),
    (8, NULL, 6.0, NULL, 3850.59, 'transfer', '2025-05-19 00:00:00', 'Bank Internal Transfer', FALSE, 11.0, NULL, 48, '2025-05-19 00:00:00'),
    (8, 15.0, NULL, NULL, 2913.54, 'withdrawal', '2025-04-04 00:00:00', 'Cash Removed from Account', FALSE, 3.0, NULL, 15, '2025-04-04 00:00:00'),
    (8, 44.0, NULL, 6.0, 4720.63, 'expense', '2025-05-11 00:00:00', 'Grocery Store Purchase', FALSE, 12.0, 5.0, 13, '2025-05-11 00:00:00'),
    (8, 49.0, NULL, NULL, 934.38, 'deposit', '2025-06-23 00:00:00', 'Cheque Deposit', FALSE, 1.0, NULL, 11, '2025-06-23 00:00:00'),
    (8, 29.0, NULL, NULL, 4070.37, 'expense', '2025-03-21 00:00:00', 'Utility Bill Payment', FALSE, NULL, 4.0, 17, '2025-03-21 00:00:00'),
    (8, 19.0, NULL, NULL, 3254.44, 'fee', '2025-03-30 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 12, '2025-03-30 00:00:00'),
    (8, 47.0, NULL, 7.0, 3589.57, 'fee', '2025-03-15 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 0, '2025-03-15 00:00:00'),
    (8, 28.0, NULL, 1.0, 4059.22, 'withdrawal', '2025-01-26 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 50, '2025-01-26 00:00:00'),
    (8, 22.0, NULL, 4.0, 4230.27, 'withdrawal', '2025-06-25 00:00:00', 'ATM Cash Withdrawal', FALSE, 16.0, NULL, 41, '2025-06-25 00:00:00'),
    (8, 7.0, NULL, NULL, 3550.17, 'expense', '2025-06-01 00:00:00', 'Clothing Store Purchase', FALSE, NULL, NULL, 26, '2025-06-01 00:00:00'),
    (8, NULL, 12.0, NULL, 3669.8, 'deposit', '2025-05-17 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 27, '2025-05-17 00:00:00'),
    (8, 21.0, NULL, 6.0, 3152.88, 'withdrawal', '2025-06-17 00:00:00', 'Cash Removed from Account', FALSE, 15.0, 2.0, 27, '2025-06-17 00:00:00'),
    (8, NULL, 4.0, NULL, 3770.43, 'fee', '2025-05-10 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, 4.0, 11, '2025-05-10 00:00:00'),
    (8, 16.0, NULL, NULL, 2637.87, 'expense', '2025-02-07 00:00:00', 'Clothing Store Purchase', FALSE, NULL, 4.0, 9, '2025-02-07 00:00:00'),
    (8, NULL, 1.0, NULL, 3541.24, 'fee', '2025-06-25 00:00:00', 'Service Charge', FALSE, NULL, NULL, 26, '2025-06-25 00:00:00'),
    (8, 46.0, NULL, 8.0, 2893.06, 'fee', '2025-03-18 00:00:00', 'Service Charge', FALSE, NULL, 5.0, 30, '2025-03-18 00:00:00'),
    (8, NULL, 3.0, NULL, 4392.77, 'withdrawal', '2025-02-11 00:00:00', 'ATM Cash Withdrawal', FALSE, 23.0, NULL, 26, '2025-02-11 00:00:00'),
    (8, NULL, 3.0, NULL, 1491.36, 'income', '2025-06-13 00:00:00', 'Interest Income', TRUE, NULL, NULL, 49, '2025-06-13 00:00:00'),
    (8, 25.0, NULL, NULL, 2225.92, 'expense', '2025-05-09 00:00:00', 'Mobile Data Recharge', FALSE, NULL, NULL, 18, '2025-05-09 00:00:00'),
    (8, 47.0, NULL, NULL, 2802.62, 'expense', '2025-03-15 00:00:00', 'Monthly Rent Payment', FALSE, NULL, 1.0, 37, '2025-03-15 00:00:00'),
    (8, 29.0, NULL, NULL, 876.81, 'fee', '2025-02-03 00:00:00', 'Service Charge', FALSE, NULL, NULL, 8, '2025-02-03 00:00:00'),
    (8, 16.0, NULL, NULL, 2349.28, 'withdrawal', '2025-06-13 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 17, '2025-06-13 00:00:00'),
    (8, 25.0, NULL, 8.0, 1632.45, 'deposit', '2025-01-23 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 6, '2025-01-23 00:00:00'),
    (8, 27.0, NULL, NULL, 1714.33, 'withdrawal', '2025-03-06 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, 4.0, 37, '2025-03-06 00:00:00'),
    (8, 37.0, NULL, 2.0, 271.93, 'income', '2025-03-22 00:00:00', 'Freelance Project Payment', FALSE, NULL, 4.0, 32, '2025-03-22 00:00:00'),
    (8, 6.0, NULL, 3.0, 3354.98, 'expense', '2025-03-15 00:00:00', 'Streaming Subscription', FALSE, 20.0, 3.0, 9, '2025-03-15 00:00:00'),
    (8, 20.0, NULL, 8.0, 1828.45, 'transfer', '2025-05-17 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 9, '2025-05-17 00:00:00'),
    (8, 6.0, NULL, NULL, 1309.88, 'withdrawal', '2025-06-13 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 49, '2025-06-13 00:00:00'),
    (8, NULL, 8.0, NULL, 4835.21, 'income', '2025-05-21 00:00:00', 'Dividend Payment', FALSE, 13.0, NULL, 46, '2025-05-21 00:00:00'),
    (8, 48.0, NULL, 2.0, 4327.96, 'expense', '2025-04-26 00:00:00', 'Clothing Store Purchase', FALSE, NULL, NULL, 50, '2025-04-26 00:00:00'),
    (8, 12.0, NULL, NULL, 2141.0, 'fee', '2025-05-07 00:00:00', 'ATM Withdrawal Fee', FALSE, 7.0, 2.0, 35, '2025-05-07 00:00:00'),
    (8, 24.0, NULL, 4.0, 3347.05, 'fee', '2025-03-04 00:00:00', 'ATM Withdrawal Fee', TRUE, NULL, NULL, 25, '2025-03-04 00:00:00'),
    (8, 20.0, NULL, NULL, 2777.62, 'fee', '2025-01-29 00:00:00', 'Service Charge', FALSE, NULL, 2.0, 14, '2025-01-29 00:00:00'),
    (8, 34.0, NULL, 2.0, 810.24, 'withdrawal', '2025-03-30 00:00:00', 'Cash Removed from Account', FALSE, NULL, 3.0, 36, '2025-03-30 00:00:00'),
    (8, 17.0, NULL, NULL, 3264.13, 'fee', '2025-01-13 00:00:00', 'ATM Withdrawal Fee', FALSE, 14.0, NULL, 3, '2025-01-13 00:00:00'),
    (8, NULL, 3.0, 6.0, 639.2, 'withdrawal', '2025-03-28 00:00:00', 'ATM Cash Withdrawal', FALSE, 5.0, NULL, 31, '2025-03-28 00:00:00'),
    (8, 10.0, NULL, NULL, 3868.49, 'expense', '2025-05-31 00:00:00', 'Streaming Subscription', FALSE, 2.0, 4.0, 15, '2025-05-31 00:00:00'),
    (8, 13.0, NULL, 1.0, 959.99, 'withdrawal', '2025-05-30 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 4, '2025-05-30 00:00:00'),
    (8, 11.0, NULL, 7.0, 2659.45, 'transfer', '2025-04-10 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 0, '2025-04-10 00:00:00'),
    (8, NULL, 2.0, NULL, 1630.28, 'withdrawal', '2025-06-18 00:00:00', 'Cash Removed from Account', FALSE, 7.0, 3.0, 36, '2025-06-18 00:00:00'),
    (8, 17.0, NULL, NULL, 3817.2, 'deposit', '2025-02-21 00:00:00', 'Online Deposit', FALSE, NULL, 1.0, 1, '2025-02-21 00:00:00'),
    (8, NULL, 9.0, NULL, 938.94, 'expense', '2025-01-17 00:00:00', 'Clothing Store Purchase', FALSE, NULL, NULL, 14, '2025-01-17 00:00:00'),
    (8, NULL, 3.0, NULL, 4001.89, 'transfer', '2025-06-18 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 12, '2025-06-18 00:00:00'),
    (8, 16.0, NULL, NULL, 2192.69, 'withdrawal', '2025-01-16 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 17, '2025-01-16 00:00:00'),
    (8, 51.0, NULL, NULL, 3816.93, 'fee', '2025-01-17 00:00:00', 'Monthly Account Fee', FALSE, NULL, 4.0, 16, '2025-01-17 00:00:00'),
    (8, 30.0, NULL, NULL, 3853.98, 'transfer', '2025-05-25 00:00:00', 'Transfer from Checking', FALSE, 6.0, NULL, 20, '2025-05-25 00:00:00'),
    (8, NULL, 11.0, NULL, 4216.29, 'income', '2025-03-10 00:00:00', 'Salary Payment', TRUE, NULL, NULL, 23, '2025-03-10 00:00:00'),
    (8, 20.0, NULL, NULL, 3525.77, 'transfer', '2025-01-12 00:00:00', 'Bank Internal Transfer', TRUE, NULL, NULL, 17, '2025-01-12 00:00:00'),
    (8, 49.0, NULL, 6.0, 2905.88, 'expense', '2025-04-24 00:00:00', 'Monthly Rent Payment', TRUE, NULL, NULL, 44, '2025-04-24 00:00:00'),
    (8, 1.0, NULL, NULL, 3170.28, 'deposit', '2025-04-29 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 30, '2025-04-29 00:00:00'),
    (8, 49.0, NULL, NULL, 984.93, 'transfer', '2025-06-20 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 7, '2025-06-20 00:00:00'),
    (8, NULL, 8.0, NULL, 1409.98, 'income', '2025-02-22 00:00:00', 'Dividend Payment', FALSE, NULL, NULL, 36, '2025-02-22 00:00:00'),
    (8, 26.0, NULL, 9.0, 4644.59, 'transfer', '2025-04-06 00:00:00', 'Transfer to Savings', FALSE, 18.0, NULL, 48, '2025-04-06 00:00:00'),
    (8, 17.0, NULL, NULL, 4967.54, 'expense', '2025-05-24 00:00:00', 'Fuel Station', TRUE, NULL, NULL, 12, '2025-05-24 00:00:00'),
    (8, NULL, 1.0, NULL, 266.02, 'withdrawal', '2025-03-21 00:00:00', 'ATM Cash Withdrawal', TRUE, 21.0, NULL, 15, '2025-03-21 00:00:00'),
    (9, 13.0, NULL, NULL, 3358.76, 'withdrawal', '2025-03-20 00:00:00', 'Cash Removed from Account', FALSE, 20.0, NULL, 3, '2025-03-20 00:00:00'),
    (9, NULL, 6.0, NULL, 3371.98, 'fee', '2025-05-20 00:00:00', 'Service Charge', TRUE, NULL, NULL, 44, '2025-05-20 00:00:00'),
    (9, NULL, 9.0, NULL, 474.46, 'withdrawal', '2025-02-28 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 16, '2025-02-28 00:00:00'),
    (9, 29.0, NULL, 1.0, 2658.61, 'deposit', '2025-06-07 00:00:00', 'Cheque Deposit', FALSE, NULL, 1.0, 18, '2025-06-07 00:00:00'),
    (9, NULL, 1.0, NULL, 1499.41, 'withdrawal', '2025-04-15 00:00:00', 'ATM Cash Withdrawal', FALSE, 2.0, NULL, 0, '2025-04-15 00:00:00'),
    (9, 36.0, NULL, 8.0, 571.45, 'transfer', '2025-05-31 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 42, '2025-05-31 00:00:00'),
    (9, 35.0, NULL, NULL, 3400.98, 'fee', '2025-01-17 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 26, '2025-01-17 00:00:00'),
    (9, 33.0, NULL, NULL, 4979.8, 'income', '2025-01-31 00:00:00', 'Dividend Payment', FALSE, NULL, NULL, 33, '2025-01-31 00:00:00'),
    (9, 43.0, NULL, NULL, 126.46, 'transfer', '2025-01-16 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 50, '2025-01-16 00:00:00'),
    (9, NULL, 5.0, NULL, 4126.37, 'transfer', '2025-03-15 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 44, '2025-03-15 00:00:00'),
    (9, 31.0, NULL, 1.0, 3302.72, 'expense', '2025-01-09 00:00:00', 'Coffee Shop', FALSE, NULL, NULL, 48, '2025-01-09 00:00:00'),
    (9, 14.0, NULL, 9.0, 1784.26, 'expense', '2025-03-30 00:00:00', 'Coffee Shop', FALSE, NULL, NULL, 7, '2025-03-30 00:00:00'),
    (9, NULL, 5.0, 5.0, 3155.77, 'income', '2025-06-07 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 45, '2025-06-07 00:00:00'),
    (9, 18.0, NULL, NULL, 297.11, 'expense', '2025-02-16 00:00:00', 'Grocery Store Purchase', FALSE, NULL, NULL, 5, '2025-02-16 00:00:00'),
    (9, NULL, 9.0, 9.0, 4350.21, 'withdrawal', '2025-06-25 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 14, '2025-06-25 00:00:00'),
    (9, 49.0, NULL, NULL, 4080.44, 'transfer', '2025-06-28 00:00:00', 'Transfer to Savings', FALSE, NULL, 2.0, 25, '2025-06-28 00:00:00'),
    (9, NULL, 4.0, NULL, 2069.22, 'expense', '2025-03-27 00:00:00', 'Public Transport Fare', FALSE, NULL, NULL, 30, '2025-03-27 00:00:00'),
    (9, 14.0, NULL, 6.0, 3309.96, 'fee', '2025-04-13 00:00:00', 'Monthly Account Fee', FALSE, 8.0, NULL, 38, '2025-04-13 00:00:00'),
    (9, 4.0, NULL, 9.0, 1466.91, 'expense', '2025-01-22 00:00:00', 'Monthly Rent Payment', FALSE, 23.0, NULL, 14, '2025-01-22 00:00:00'),
    (9, 44.0, NULL, 4.0, 2421.24, 'expense', '2025-05-04 00:00:00', 'Coffee Shop', FALSE, NULL, NULL, 37, '2025-05-04 00:00:00'), 
    (9, 17.0, NULL, NULL, 2871.39, 'fee', '2025-06-10 00:00:00', 'ATM Withdrawal Fee', FALSE, 9.0, NULL, 42, '2025-06-10 00:00:00'),
    (9, NULL, 12.0, NULL, 1168.87, 'fee', '2025-03-17 00:00:00', 'Service Charge', FALSE, NULL, NULL, 43, '2025-03-17 00:00:00'),
    (9, 30.0, NULL, 8.0, 3140.38, 'transfer', '2025-03-09 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 28, '2025-03-09 00:00:00'),
    (9, 29.0, NULL, NULL, 3997.52, 'withdrawal', '2025-05-01 00:00:00', 'Cash Removed from Account', FALSE, NULL, 3.0, 11, '2025-05-01 00:00:00'),
    (9, 23.0, NULL, NULL, 2725.5, 'transfer', '2025-03-30 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 6, '2025-03-30 00:00:00'),
    (9, 31.0, NULL, 7.0, 4479.93, 'withdrawal', '2025-05-21 00:00:00', 'ATM Cash Withdrawal', FALSE, 11.0, NULL, 31, '2025-05-21 00:00:00'),
    (9, 2.0, NULL, 1.0, 1930.33, 'transfer', '2025-04-06 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 27, '2025-04-06 00:00:00'),
    (9, 50.0, NULL, 9.0, 3906.61, 'fee', '2025-05-03 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 39, '2025-05-03 00:00:00'),
    (9, NULL, 12.0, NULL, 1298.85, 'fee', '2025-03-09 00:00:00', 'Service Charge', FALSE, 17.0, NULL, 19, '2025-03-09 00:00:00'),
    (9, 21.0, NULL, NULL, 83.82, 'fee', '2025-02-05 00:00:00', 'ATM Withdrawal Fee', FALSE, 16.0, NULL, 2, '2025-02-05 00:00:00'),
    (9, 2.0, NULL, 8.0, 3357.39, 'income', '2025-04-29 00:00:00', 'Freelance Project Payment', FALSE, NULL, 1.0, 41, '2025-04-29 00:00:00'),
    (9, 8.0, NULL, NULL, 1558.78, 'withdrawal', '2025-05-11 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 29, '2025-05-11 00:00:00'),
    (9, NULL, 7.0, NULL, 359.68, 'income', '2025-03-27 00:00:00', 'Refund Processed', FALSE, 17.0, NULL, 10, '2025-03-27 00:00:00'),
    (9, 22.0, NULL, 4.0, 2617.0, 'transfer', '2025-06-03 00:00:00', 'Transfer to Savings', FALSE, 4.0, NULL, 50, '2025-06-03 00:00:00'),
    (9, NULL, 3.0, NULL, 2515.32, 'income', '2025-04-01 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 35, '2025-04-01 00:00:00'),
    (9, NULL, 1.0, NULL, 3624.4, 'income', '2025-05-04 00:00:00', 'Refund Processed', TRUE, NULL, 5.0, 50, '2025-05-04 00:00:00'),
    (9, NULL, 10.0, 6.0, 4354.52, 'expense', '2025-05-24 00:00:00', 'Mobile Data Recharge', FALSE, 20.0, NULL, 45, '2025-05-24 00:00:00'),
    (9, 26.0, NULL, NULL, 4554.96, 'fee', '2025-02-10 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 4, '2025-02-10 00:00:00'),
    (9, 41.0, NULL, NULL, 128.41, 'fee', '2025-04-24 00:00:00', 'Service Charge', FALSE, NULL, NULL, 45, '2025-04-24 00:00:00'),
    (9, NULL, 1.0, 8.0, 4227.17, 'income', '2025-06-05 00:00:00', 'Interest Income', FALSE, NULL, 2.0, 49, '2025-06-05 00:00:00'),
    (9, 24.0, NULL, NULL, 2387.32, 'expense', '2025-02-15 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 14, '2025-02-15 00:00:00'),
    (9, 35.0, NULL, NULL, 3634.32, 'transfer', '2025-03-08 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 29, '2025-03-08 00:00:00'),
    (9, 27.0, NULL, NULL, 3743.74, 'income', '2025-06-12 00:00:00', 'Bonus Received', FALSE, NULL, 1.0, 35, '2025-06-12 00:00:00'),
    (9, NULL, 8.0, 2.0, 1144.73, 'deposit', '2025-04-16 00:00:00', 'Cheque Deposit', TRUE, NULL, NULL, 25, '2025-04-16 00:00:00'),
    (9, 16.0, NULL, 9.0, 2109.35, 'transfer', '2025-05-24 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 30, '2025-05-24 00:00:00'),
    (10, 39.0, NULL, NULL, 4663.39, 'expense', '2025-05-02 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 19, '2025-05-02 00:00:00'),
    (10, 21.0, NULL, 9.0, 749.02, 'fee', '2025-03-23 00:00:00', 'Service Charge', FALSE, NULL, NULL, 3, '2025-03-23 00:00:00'),
    (10, 43.0, NULL, NULL, 3371.48, 'transfer', '2025-04-13 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 45, '2025-04-13 00:00:00'),
    (10, NULL, 13.0, NULL, 235.62, 'transfer', '2025-02-07 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 46, '2025-02-07 00:00:00'),
    (10, 47.0, NULL, 3.0, 4071.2, 'fee', '2025-01-25 00:00:00', 'Service Charge', FALSE, NULL, NULL, 14, '2025-01-25 00:00:00'),
    (10, 8.0, NULL, 5.0, 3946.12, 'deposit', '2025-01-18 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 41, '2025-01-18 00:00:00'),
    (10, NULL, 6.0, NULL, 4102.76, 'expense', '2025-04-20 00:00:00', 'Fuel Station', FALSE, NULL, NULL, 6, '2025-04-20 00:00:00'),
    (10, 7.0, NULL, 6.0, 4027.25, 'fee', '2025-03-16 00:00:00', 'Monthly Account Fee', FALSE, 21.0, NULL, 47, '2025-03-16 00:00:00'),
    (10, 30.0, NULL, 1.0, 4743.22, 'transfer', '2025-01-21 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 25, '2025-01-21 00:00:00'),
    (10, NULL, 11.0, NULL, 3091.55, 'fee', '2025-06-12 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 7, '2025-06-12 00:00:00'),
    (10, 49.0, NULL, NULL, 3814.57, 'fee', '2025-01-17 00:00:00', 'ATM Withdrawal Fee', FALSE, 13.0, NULL, 23, '2025-01-17 00:00:00'),
    (10, NULL, 12.0, 1.0, 3104.55, 'transfer', '2025-04-11 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 1, '2025-04-11 00:00:00'),
    (10, 14.0, NULL, NULL, 2372.15, 'fee', '2025-06-02 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 0, '2025-06-02 00:00:00'),
    (10, NULL, 3.0, 2.0, 3243.57, 'expense', '2025-04-22 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 5, '2025-04-22 00:00:00'),
    (10, 38.0, NULL, NULL, 4829.55, 'fee', '2025-03-07 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 24, '2025-03-07 00:00:00'),
    (10, 26.0, NULL, NULL, 3606.99, 'fee', '2025-01-14 00:00:00', 'Monthly Account Fee', FALSE, 1.0, NULL, 35, '2025-01-14 00:00:00'),
    (10, 10.0, NULL, NULL, 1290.07, 'expense', '2025-04-11 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 8, '2025-04-11 00:00:00'),
    (10, 2.0, NULL, NULL, 3801.45, 'transfer', '2025-04-27 00:00:00', 'Transfer to Savings', FALSE, 6.0, NULL, 8, '2025-04-27 00:00:00'),
    (10, NULL, 9.0, 6.0, 3597.04, 'withdrawal', '2025-04-24 00:00:00', 'ATM Cash Withdrawal', FALSE, 15.0, NULL, 50, '2025-04-24 00:00:00'),
    (10, 28.0, NULL, NULL, 2950.6, 'expense', '2025-06-12 00:00:00', 'Fuel Station', TRUE, NULL, NULL, 21, '2025-06-12 00:00:00'),
    (10, 23.0, NULL, NULL, 1368.71, 'withdrawal', '2025-02-27 00:00:00', 'Cash Removed from Account', FALSE, 1.0, NULL, 21, '2025-02-27 00:00:00'),
    (10, 47.0, NULL, NULL, 3168.77, 'deposit', '2025-04-11 00:00:00', 'Cheque Deposit', FALSE, 2.0, NULL, 42, '2025-04-11 00:00:00'),
    (10, NULL, 11.0, 7.0, 1450.34, 'withdrawal', '2025-02-17 00:00:00', 'Cash Removed from Account', TRUE, 7.0, NULL, 33, '2025-02-17 00:00:00'),
    (10, 42.0, NULL, NULL, 2175.04, 'deposit', '2025-04-05 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 26, '2025-04-05 00:00:00'),
    (10, 31.0, NULL, NULL, 2560.56, 'income', '2025-03-24 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 23, '2025-03-24 00:00:00'),
    (10, 1.0, NULL, NULL, 1871.74, 'transfer', '2025-03-20 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 15, '2025-03-20 00:00:00'),
    (10, 1.0, NULL, NULL, 3419.68, 'transfer', '2025-06-20 00:00:00', 'Bank Internal Transfer', FALSE, NULL, 5.0, 0, '2025-06-20 00:00:00'),
    (10, 7.0, NULL, NULL, 982.82, 'fee', '2025-03-08 00:00:00', 'ATM Withdrawal Fee', FALSE, 21.0, 4.0, 10, '2025-03-08 00:00:00'),
    (10, 30.0, NULL, 8.0, 4023.59, 'income', '2025-06-22 00:00:00', 'Dividend Payment', FALSE, NULL, 3.0, 49, '2025-06-22 00:00:00'),
    (10, 37.0, NULL, NULL, 3635.63, 'fee', '2025-02-18 00:00:00', 'Monthly Account Fee', FALSE, NULL, 4.0, 31, '2025-02-18 00:00:00'),
    (10, NULL, 1.0, 1.0, 4614.29, 'transfer', '2025-03-22 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 20, '2025-03-22 00:00:00'),
    (10, 23.0, NULL, 1.0, 1115.46, 'fee', '2025-03-04 00:00:00', 'Monthly Account Fee', FALSE, 15.0, NULL, 42, '2025-03-04 00:00:00'),
    (10, 1.0, NULL, 7.0, 2849.44, 'transfer', '2025-01-09 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 13, '2025-01-09 00:00:00'),
    (10, 30.0, NULL, NULL, 4404.13, 'transfer', '2025-03-05 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 28, '2025-03-05 00:00:00'),
    (10, 22.0, NULL, NULL, 3845.52, 'withdrawal', '2025-04-18 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, 4.0, 22, '2025-04-18 00:00:00'),
    (10, NULL, 7.0, NULL, 1976.37, 'deposit', '2025-06-21 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, 2.0, 20, '2025-06-21 00:00:00'),
    (10, 3.0, NULL, 8.0, 1858.92, 'transfer', '2025-06-21 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 9, '2025-06-21 00:00:00'),
    (10, 40.0, NULL, 4.0, 2371.1, 'deposit', '2025-05-09 00:00:00', 'Online Deposit', FALSE, NULL, 4.0, 3, '2025-05-09 00:00:00'),
    (10, 5.0, NULL, NULL, 1164.33, 'expense', '2025-05-22 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 24, '2025-05-22 00:00:00'),
    (10, 5.0, NULL, NULL, 4022.7, 'fee', '2025-04-02 00:00:00', 'Service Charge', FALSE, NULL, NULL, 24, '2025-04-02 00:00:00'),
    (10, 45.0, NULL, NULL, 1474.32, 'fee', '2025-05-30 00:00:00', 'Monthly Account Fee', FALSE, NULL, 2.0, 17, '2025-05-30 00:00:00'),
    (10, 29.0, NULL, 4.0, 636.17, 'deposit', '2025-01-31 00:00:00', 'Cash Deposit at Branch', FALSE, 8.0, NULL, 31, '2025-01-31 00:00:00'),
    (10, 10, NULL, 4.0, 205.02, 'expense', '2025-03-27 00:00:00', 'Coffee Shop', FALSE, NULL, 4.0, 47, '2025-03-27 00:00:00'),
    (10, 36.0, NULL, NULL, 55.06, 'deposit', '2025-01-17 00:00:00', 'Cash Deposit at Branch', FALSE, 6.0, NULL, 39, '2025-01-17 00:00:00'),
    (10, NULL, 13.0, NULL, 2293.21, 'transfer', '2025-04-18 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 41, '2025-04-18 00:00:00'),
    (10, 10.0, NULL, 5.0, 3196.91, 'deposit', '2025-01-16 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 30, '2025-01-16 00:00:00'),
    (10, 35.0, NULL, NULL, 1665.39, 'income', '2025-03-31 00:00:00', 'Salary Payment', TRUE, NULL, NULL, 8, '2025-03-31 00:00:00'),
    (10, NULL, 9.0, 6.0, 4461.47, 'fee', '2025-04-20 00:00:00', 'ATM Withdrawal Fee', FALSE, 7.0, NULL, 8, '2025-04-20 00:00:00'),
    (10, 30.0, NULL, 7.0, 3895.34, 'transfer', '2025-04-20 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 10, '2025-04-20 00:00:00'),
    (10, 7.0, NULL, NULL, 195.42, 'fee', '2025-01-12 00:00:00', 'Monthly Account Fee', FALSE, NULL, 2.0, 17, '2025-01-12 00:00:00'),
    (10, 36.0, NULL, 2.0, 3881.06, 'deposit', '2025-06-14 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 3, '2025-06-14 00:00:00'),
    (10, 48.0, NULL, NULL, 982.92, 'deposit', '2025-01-02 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 32, '2025-01-02 00:00:00'),
    (10, 24.0, NULL, 7.0, 4483.08, 'withdrawal', '2025-05-17 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 8, '2025-05-17 00:00:00'),
    (10, 9.0, NULL, 3.0, 4590.42, 'transfer', '2025-02-10 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 11, '2025-02-10 00:00:00'),
    (10, 22.0, NULL, 9.0, 1366.9, 'fee', '2025-05-13 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 1, '2025-05-13 00:00:00'),
    (10, NULL, 9.0, NULL, 157.4, 'deposit', '2025-05-23 00:00:00', 'Online Deposit', FALSE, NULL, 1.0, 40, '2025-05-23 00:00:00'),
    (10, 33.0, NULL, 6.0, 3721.3, 'deposit', '2025-04-21 00:00:00', 'Cash Deposit at Branch', TRUE, NULL, NULL, 3, '2025-04-21 00:00:00'),
    (10, NULL, 4.0, 3.0, 4163.95, 'fee', '2025-01-24 00:00:00', 'Service Charge', FALSE, 11.0, 4.0, 9, '2025-01-24 00:00:00'),
    (10, 26.0, NULL, 4.0, 2230.85, 'income', '2025-04-01 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 35, '2025-04-01 00:00:00'),
    (10, NULL, 8.0, 6.0, 4370.71, 'income', '2025-02-14 00:00:00', 'Dividend Payment', FALSE, NULL, NULL, 14, '2025-02-14 00:00:00'),
    (10, 46.0, NULL, 3.0, 216.09, 'deposit', '2025-01-25 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 9, '2025-01-25 00:00:00'),
    (10, 50.0, NULL, NULL, 1402.15, 'fee', '2025-02-10 00:00:00', 'Service Charge', FALSE, 15.0, NULL, 19, '2025-02-10 00:00:00'),
    (10, NULL, 12.0, NULL, 2728.95, 'expense', '2025-03-24 00:00:00', 'Grocery Store Purchase', FALSE, 5.0, NULL, 38, '2025-03-24 00:00:00'),
    (10, NULL, 1.0, 4.0, 4642.52, 'income', '2025-02-26 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 40, '2025-02-26 00:00:00'),
    (10, 32.0, NULL, 2.0, 1352.89, 'withdrawal', '2025-05-17 00:00:00', 'Cash Removed from Account', TRUE, NULL, NULL, 50, '2025-05-17 00:00:00'),
    (10, NULL, 13.0, NULL, 4562.26, 'income', '2025-04-07 00:00:00', 'Dividend Payment', FALSE, 7.0, NULL, 43, '2025-04-07 00:00:00'),
    (11, 33.0, NULL, 4.0, 1142.76, 'deposit', '2025-05-21 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 23, '2025-05-21 00:00:00'),
    (11, 46.0, NULL, NULL, 1679.18, 'fee', '2025-01-09 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 44, '2025-01-09 00:00:00'),
    (11, 13.0, NULL, 8.0, 3255.99, 'transfer', '2025-02-10 00:00:00', 'Transfer to Savings', FALSE, 12.0, NULL, 26, '2025-02-10 00:00:00'),
    (11, 32.0, NULL, NULL, 664.25, 'fee', '2025-01-27 00:00:00', 'ATM Withdrawal Fee', FALSE, 16.0, NULL, 41, '2025-01-27 00:00:00'),
    (11, NULL, 3.0, NULL, 113.8, 'income', '2025-02-18 00:00:00', 'Dividend Payment', FALSE, 4.0, NULL, 35, '2025-02-18 00:00:00'),
    (11, 49.0, NULL, 7.0, 121.56, 'transfer', '2025-02-05 00:00:00', 'Bank Internal Transfer', FALSE, NULL, 5.0, 49, '2025-02-05 00:00:00'),
    (11, 9.0, NULL, 2.0, 1852.3, 'withdrawal', '2025-05-27 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, 5.0, 30, '2025-05-27 00:00:00'),
    (11, 47.0, NULL, 4.0, 1471.83, 'transfer', '2025-02-22 00:00:00', 'Transfer to Savings', FALSE, 14.0, NULL, 7, '2025-02-22 00:00:00'),
    (11, 42.0, NULL, NULL, 4053.39, 'income', '2025-04-05 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 7, '2025-04-05 00:00:00'),
    (11, 46.0, NULL, NULL, 1806.39, 'withdrawal', '2025-02-10 00:00:00', 'ATM Cash Withdrawal', TRUE, 5.0, NULL, 11, '2025-02-10 00:00:00'),
    (11, 28.0, NULL, NULL, 4606.46, 'fee', '2025-03-20 00:00:00', 'Monthly Account Fee', FALSE, 7.0, NULL, 22, '2025-03-20 00:00:00'),
    (11, NULL, 11.0, 2.0, 4124.59, 'income', '2025-03-19 00:00:00', 'Freelance Project Payment', FALSE, 13.0, NULL, 33, '2025-03-19 00:00:00'),
    (11, 27.0, NULL, NULL, 3606.21, 'deposit', '2025-03-18 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 3, '2025-03-18 00:00:00'),
    (11, NULL, 13.0, 6.0, 1566.21, 'fee', '2025-04-04 00:00:00', 'Monthly Account Fee', FALSE, 21.0, NULL, 5, '2025-04-04 00:00:00'),
    (11, NULL, 1.0, 7.0, 4797.71, 'fee', '2025-04-11 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 17, '2025-04-11 00:00:00'),
    (11, 46.0, NULL, 5.0, 1102.6, 'withdrawal', '2025-04-17 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 34, '2025-04-17 00:00:00'),
    (11, NULL, 4.0, NULL, 118.94, 'expense', '2025-01-16 00:00:00', 'Utility Bill Payment', TRUE, NULL, NULL, 40, '2025-01-16 00:00:00'),
    (11, 28.0, NULL, 7.0, 4973.57, 'income', '2025-03-24 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 11, '2025-03-24 00:00:00'),
    (11, NULL, 11.0, 9.0, 1984.33, 'income', '2025-06-22 00:00:00', 'Interest Income', FALSE, 7.0, NULL, 31, '2025-06-22 00:00:00'),
    (11, 22.0, NULL, NULL, 2193.73, 'fee', '2025-01-08 00:00:00', 'Service Charge', FALSE, NULL, NULL, 6, '2025-01-08 00:00:00'),
    (11, NULL, 9.0, 6.0, 1024.39, 'deposit', '2025-05-08 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 44, '2025-05-08 00:00:00'),
    (11, NULL, 13.0, NULL, 4219.96, 'income', '2025-05-19 00:00:00', 'Bonus Received', FALSE, NULL, 3.0, 8, '2025-05-19 00:00:00'),
    (11, 37.0, NULL, NULL, 4207.34, 'fee', '2025-03-13 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 29, '2025-03-13 00:00:00'),
    (11, 24.0, NULL, NULL, 4489.35, 'withdrawal', '2025-03-25 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 48, '2025-03-25 00:00:00'),
    (11, 38.0, NULL, NULL, 4585.34, 'transfer', '2025-04-05 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 40, '2025-04-05 00:00:00'),
    (11, 41.0, NULL, NULL, 4106.33, 'transfer', '2025-04-10 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 41, '2025-04-10 00:00:00'),
    (11, 49.0, NULL, 3.0, 4845.37, 'expense', '2025-03-09 00:00:00', 'Fuel Station', FALSE, 20.0, NULL, 37, '2025-03-09 00:00:00'),
    (11, 16.0, NULL, 4.0, 2135.87, 'withdrawal', '2025-01-14 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 41, '2025-01-14 00:00:00'),
    (11, 21.0, NULL, 3.0, 4583.62, 'fee', '2025-04-29 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 33, '2025-04-29 00:00:00'),
    (11, 20.0, NULL, NULL, 1676.91, 'transfer', '2025-06-24 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 49, '2025-06-24 00:00:00'),
    (11, 14.0, NULL, NULL, 1427.51, 'expense', '2025-04-16 00:00:00', 'Utility Bill Payment', FALSE, NULL, NULL, 20, '2025-04-16 00:00:00'),
    (11, NULL, 13.0, 7.0, 3610.97, 'withdrawal', '2025-06-08 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 29, '2025-06-08 00:00:00'),
    (11, 42.0, NULL, 3.0, 1078.66, 'expense', '2025-04-26 00:00:00', 'Coffee Shop', FALSE, NULL, 4.0, 45, '2025-04-26 00:00:00'),
    (11, 1.0, NULL, NULL, 443.81, 'fee', '2025-01-30 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 13, '2025-01-30 00:00:00'),
    (11, 11.0, NULL, NULL, 1262.94, 'transfer', '2025-05-09 00:00:00', 'Bank Internal Transfer', FALSE, 8.0, NULL, 6, '2025-05-09 00:00:00'),
    (11, 47.0, NULL, 3.0, 4881.29, 'deposit', '2025-04-06 00:00:00', 'Cash Deposit at Branch', TRUE, 5.0, NULL, 36, '2025-04-06 00:00:00'),
    (11, 26.0, NULL, 1.0, 3207.6, 'expense', '2025-01-12 00:00:00', 'Utility Bill Payment', FALSE, NULL, NULL, 11, '2025-01-12 00:00:00'),
    (11, 5.0, NULL, 1.0, 3215.9, 'deposit', '2025-01-23 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 41, '2025-01-23 00:00:00'),
    (11, 18.0, NULL, 8.0, 4795.94, 'deposit', '2025-02-17 00:00:00', 'Cheque Deposit', TRUE, NULL, NULL, 15, '2025-02-17 00:00:00'),
    (11, 9.0, NULL, 9.0, 2697.44, 'expense', '2025-01-22 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 2, '2025-01-22 00:00:00'),
    (11, NULL, 4.0, NULL, 1668.99, 'deposit', '2025-05-04 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 19, '2025-05-04 00:00:00'),
    (11, 48.0, NULL, NULL, 668.97, 'fee', '2025-04-10 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 34, '2025-04-10 00:00:00'),
    (11, 9.0, NULL, 2.0, 224.1, 'deposit', '2025-05-29 00:00:00', 'Cheque Deposit', FALSE, NULL, 5.0, 46, '2025-05-29 00:00:00'),
    (12, 18.0, NULL, NULL, 3636.21, 'withdrawal', '2025-04-29 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 24, '2025-04-29 00:00:00'),
    (12, 20.0, NULL, 4.0, 2118.59, 'transfer', '2025-01-17 00:00:00', 'Transfer from Checking', FALSE, NULL, 1.0, 16, '2025-01-17 00:00:00'),
    (12, 51.0, NULL, 7.0, 1399.44, 'fee', '2025-04-02 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 10, '2025-04-02 00:00:00'),
    (12, NULL, 6.0, 6.0, 3263.41, 'expense', '2025-05-18 00:00:00', 'Utility Bill Payment', FALSE, NULL, 1.0, 15, '2025-05-18 00:00:00'),
    (12, 39.0, NULL, 5.0, 4099.22, 'fee', '2025-01-24 00:00:00', 'Service Charge', FALSE, NULL, NULL, 46, '2025-01-24 00:00:00'),
    (12, 1.0, NULL, 6.0, 535.88, 'transfer', '2025-05-10 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 7, '2025-05-10 00:00:00'),
    (12, 46.0, NULL, 5.0, 4780.72, 'deposit', '2025-01-26 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 2, '2025-01-26 00:00:00'),
    (12, 11.0, NULL, NULL, 2523.27, 'fee', '2025-05-17 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 12, '2025-05-17 00:00:00'),
    (12, 35.0, NULL, 7.0, 2623.4, 'withdrawal', '2025-05-15 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 4, '2025-05-15 00:00:00'),
    (12, 35.0, NULL, NULL, 4880.22, 'expense', '2025-06-25 00:00:00', 'Grocery Store Purchase', FALSE, NULL, NULL, 45, '2025-06-25 00:00:00'),
    (12, 11.0, NULL, NULL, 1433.61, 'withdrawal', '2025-04-04 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 23, '2025-04-04 00:00:00'),
    (12, 46.0, NULL, 6.0, 2663.04, 'expense', '2025-04-08 00:00:00', 'Public Transport Fare', FALSE, NULL, 3.0, 39, '2025-04-08 00:00:00'),
    (12, 36.0, NULL, 5.0, 1775.66, 'income', '2025-02-16 00:00:00', 'Dividend Payment', FALSE, 20.0, NULL, 4, '2025-02-16 00:00:00'),
    (12, NULL, 1.0, NULL, 4434.94, 'withdrawal', '2025-05-12 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 10, '2025-05-12 00:00:00'),
    (12, NULL, 9.0, NULL, 1695.43, 'fee', '2025-06-22 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 17, '2025-06-22 00:00:00'),
    (12, 10.0, NULL, 8.0, 1542.07, 'expense', '2025-03-01 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 43, '2025-03-01 00:00:00'),
    (12, NULL, 7.0, 4.0, 1358.83, 'income', '2025-05-01 00:00:00', 'Interest Income', FALSE, 13.0, NULL, 4, '2025-05-01 00:00:00'),
    (12, NULL, 3.0, NULL, 3559.68, 'deposit', '2025-03-22 00:00:00', 'Online Deposit', FALSE, 2.0, 2.0, 17, '2025-03-22 00:00:00'),
    (12, 5.0, NULL, 2.0, 1072.55, 'fee', '2025-05-08 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 44, '2025-05-08 00:00:00'),
    (12, 31.0, NULL, 4.0, 3503.32, 'withdrawal', '2025-02-10 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 8, '2025-02-10 00:00:00'),
    (12, NULL, 6.0, NULL, 4057.62, 'expense', '2025-02-13 00:00:00', 'Clothing Store Purchase', FALSE, 10.0, 1.0, 0, '2025-02-13 00:00:00'),
    (12, 23.0, NULL, NULL, 3526.63, 'income', '2025-04-09 00:00:00', 'Interest Income', FALSE, 23.0, NULL, 14, '2025-04-09 00:00:00'),
    (12, 25.0, NULL, 4.0, 888.64, 'withdrawal', '2025-03-22 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 50, '2025-03-22 00:00:00'),
    (12, 34.0, NULL, NULL, 3773.17, 'expense', '2025-04-07 00:00:00', 'Public Transport Fare', FALSE, 20.0, 1.0, 27, '2025-04-07 00:00:00'),
    (12, NULL, 7.0, 4.0, 1374.9, 'transfer', '2025-03-30 00:00:00', 'Bank Internal Transfer', FALSE, NULL, 1.0, 9, '2025-03-30 00:00:00'),
    (12, NULL, 3.0, 7.0, 1829.33, 'withdrawal', '2025-02-24 00:00:00', 'Cash Removed from Account', FALSE, 13.0, NULL, 7, '2025-02-24 00:00:00'),
    (12, 22.0, NULL, NULL, 1259.6, 'fee', '2025-01-09 00:00:00', 'ATM Withdrawal Fee', FALSE, 3.0, NULL, 22, '2025-01-09 00:00:00'),
    (12, 12.0, NULL, NULL, 92.12, 'deposit', '2025-03-09 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 34, '2025-03-09 00:00:00'),
    (12, 47.0, NULL, 4.0, 1701.13, 'deposit', '2025-05-31 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 4, '2025-05-31 00:00:00'),
    (12, NULL, 4.0, NULL, 3340.87, 'income', '2025-06-29 00:00:00', 'Interest Income', FALSE, 15.0, NULL, 34, '2025-06-29 00:00:00'),
    (12, 35.0, NULL, 6.0, 2418.53, 'expense', '2025-02-06 00:00:00', 'Public Transport Fare', FALSE, 19.0, NULL, 6, '2025-02-06 00:00:00'),
    (12, 15.0, NULL, NULL, 2657.73, 'deposit', '2025-04-23 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 18, '2025-04-23 00:00:00'),
    (12, 8.0, NULL, NULL, 3106.53, 'transfer', '2025-01-09 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 20, '2025-01-09 00:00:00'),
    (12, 1.0, NULL, 5.0, 3987.78, 'deposit', '2025-04-03 00:00:00', 'Cheque Deposit', TRUE, NULL, NULL, 43, '2025-04-03 00:00:00'),
    (12, 40.0, NULL, NULL, 4898.15, 'withdrawal', '2025-05-29 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, 5.0, 22, '2025-05-29 00:00:00'),
    (12, NULL, 4.0, 4.0, 4162.44, 'transfer', '2025-04-05 00:00:00', 'Bank Internal Transfer', FALSE, 11.0, NULL, 10, '2025-04-05 00:00:00'),
    (12, NULL, 8.0, 2.0, 1503.16, 'fee', '2025-03-24 00:00:00', 'Service Charge', FALSE, NULL, NULL, 7, '2025-03-24 00:00:00'),
    (12, 38.0, NULL, 9.0, 3308.66, 'fee', '2025-06-26 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 37, '2025-06-26 00:00:00'),
    (12, 44.0, NULL, NULL, 4277.94, 'transfer', '2025-06-06 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 41, '2025-06-06 00:00:00'),
    (13, NULL, 5.0, NULL, 4417.61, 'expense', '2025-03-18 00:00:00', 'Fuel Station', FALSE, NULL, 4.0, 25, '2025-03-18 00:00:00'),
    (13, NULL, 7.0, NULL, 1484.24, 'expense', '2025-02-24 00:00:00', 'Fuel Station', FALSE, 17.0, NULL, 35, '2025-02-24 00:00:00'),
    (13, 20.0, NULL, 3.0, 2404.63, 'deposit', '2025-04-14 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 40, '2025-04-14 00:00:00'),
    (13, 14.0, NULL, NULL, 2636.46, 'expense', '2025-01-23 00:00:00', 'Coffee Shop', FALSE, NULL, 2.0, 42, '2025-01-23 00:00:00'),
    (13, NULL, 1.0, NULL, 1367.28, 'deposit', '2025-04-05 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 9, '2025-04-05 00:00:00'),
    (13, 37.0, NULL, 5.0, 3545.35, 'fee', '2025-03-07 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 36, '2025-03-07 00:00:00'),
    (13, 46.0, NULL, NULL, 4099.28, 'deposit', '2025-03-15 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 25, '2025-03-15 00:00:00'),
    (13, 25.0, NULL, NULL, 2303.06, 'expense', '2025-03-09 00:00:00', 'Public Transport Fare', FALSE, NULL, NULL, 39, '2025-03-09 00:00:00'),
    (13, 20.0, NULL, NULL, 813.33, 'expense', '2025-06-03 00:00:00', 'Monthly Rent Payment', FALSE, NULL, 3.0, 45, '2025-06-03 00:00:00'),
    (13, 7.0, NULL, 1.0, 3665.17, 'deposit', '2025-04-06 00:00:00', 'Cheque Deposit', FALSE, 12.0, NULL, 16, '2025-04-06 00:00:00'),
    (13, 10.0, NULL, 5.0, 2857.27, 'withdrawal', '2025-06-08 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 47, '2025-06-08 00:00:00'),
    (13, 15.0, NULL, 1.0, 1165.19, 'expense', '2025-03-12 00:00:00', 'Grocery Store Purchase', FALSE, NULL, 2.0, 27, '2025-03-12 00:00:00'),
    (13, NULL, 2.0, NULL, 1541.61, 'withdrawal', '2025-04-24 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 11, '2025-04-24 00:00:00'),
    (13, NULL, 6.0, NULL, 4836.25, 'deposit', '2025-03-02 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 17, '2025-03-02 00:00:00'),
    (13, 43.0, NULL, 9.0, 1306.79, 'expense', '2025-05-11 00:00:00', 'Public Transport Fare', FALSE, NULL, NULL, 20, '2025-05-11 00:00:00'),
    (13, 1.0, NULL, 5.0, 2454.09, 'expense', '2025-05-21 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 26, '2025-05-21 00:00:00'),
    (13, 30.0, NULL, NULL, 131.54, 'fee', '2025-03-11 00:00:00', 'Service Charge', FALSE, NULL, 4.0, 23, '2025-03-11 00:00:00'),
    (13, 50.0, NULL, 5.0, 1702.17, 'fee', '2025-04-20 00:00:00', 'Service Charge', FALSE, 3.0, 3.0, 11, '2025-04-20 00:00:00'),
    (13, 49.0, NULL, NULL, 1476.03, 'expense', '2025-02-19 00:00:00', 'Utility Bill Payment', FALSE, NULL, NULL, 46, '2025-02-19 00:00:00'),
    (13, 16.0, NULL, 9.0, 1967.42, 'fee', '2025-03-13 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 27, '2025-03-13 00:00:00'),
    (13, 38.0, NULL, NULL, 1901.34, 'transfer', '2025-03-18 00:00:00', 'Transfer from Checking', FALSE, 9.0, NULL, 19, '2025-03-18 00:00:00'),
    (13, 31.0, NULL, NULL, 389.74, 'income', '2025-05-02 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 42, '2025-05-02 00:00:00'),
    (13, 11.0, NULL, 9.0, 2578.12, 'fee', '2025-01-12 00:00:00', 'ATM Withdrawal Fee', FALSE, 22.0, NULL, 23, '2025-01-12 00:00:00'),
    (13, 32.0, NULL, NULL, 4185.49, 'fee', '2025-06-13 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 3, '2025-06-13 00:00:00'),
    (13, NULL, 9.0, 9.0, 455.5, 'transfer', '2025-01-22 00:00:00', 'Transfer from Checking', FALSE, 1.0, NULL, 35, '2025-01-22 00:00:00'),
    (13, NULL, 9.0, 6.0, 356.06, 'fee', '2025-01-07 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 39, '2025-01-07 00:00:00'),
    (13, 19.0, NULL, NULL, 3994.13, 'deposit', '2025-03-20 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 29, '2025-03-20 00:00:00'),
    (13, 26.0, NULL, NULL, 3626.68, 'withdrawal', '2025-02-18 00:00:00', 'ATM Cash Withdrawal', FALSE, 22.0, NULL, 12, '2025-02-18 00:00:00'),
    (13, NULL, 8.0, 1.0, 2092.05, 'expense', '2025-03-20 00:00:00', 'Mobile Data Recharge', FALSE, 18.0, NULL, 37, '2025-03-20 00:00:00'),
    (13, 6.0, NULL, NULL, 3834.14, 'transfer', '2025-02-20 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 1, '2025-02-20 00:00:00'),
    (13, 43.0, NULL, 8.0, 3857.84, 'transfer', '2025-02-23 00:00:00', 'Transfer to Savings', FALSE, NULL, 5.0, 29, '2025-02-23 00:00:00'),
    (13, 3.0, NULL, NULL, 1205.31, 'expense', '2025-05-02 00:00:00', 'Fuel Station', FALSE, 10.0, NULL, 47, '2025-05-02 00:00:00'),
    (13, 12.0, NULL, NULL, 1976.74, 'income', '2025-04-17 00:00:00', 'Freelance Project Payment', FALSE, NULL, 4.0, 39, '2025-04-17 00:00:00'),
    (13, NULL, 11.0, NULL, 1415.74, 'transfer', '2025-06-18 00:00:00', 'Transfer from Checking', TRUE, NULL, NULL, 45, '2025-06-18 00:00:00'),
    (13, NULL, 11.0, NULL, 3146.47, 'transfer', '2025-06-04 00:00:00', 'Bank Internal Transfer', FALSE, 8.0, NULL, 44, '2025-06-04 00:00:00'),
    (13, 8.0, NULL, 3.0, 1433.56, 'deposit', '2025-03-27 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 50, '2025-03-27 00:00:00'),
    (13, 35.0, NULL, 2.0, 3222.3, 'expense', '2025-06-30 00:00:00', 'Utility Bill Payment', FALSE, 23.0, NULL, 37, '2025-06-30 00:00:00'),
    (13, NULL, 8.0, NULL, 3399.98, 'fee', '2025-06-15 00:00:00', 'Service Charge', TRUE, 17.0, NULL, 36, '2025-06-15 00:00:00'),
    (13, NULL, 1.0, NULL, 29.47, 'fee', '2025-05-03 00:00:00', 'Service Charge', FALSE, NULL, NULL, 2, '2025-05-03 00:00:00'),
    (13, NULL, 12.0, 9.0, 3833.49, 'withdrawal', '2025-02-27 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 16, '2025-02-27 00:00:00'),
    (13, NULL, 3.0, 3.0, 659.55, 'transfer', '2025-03-03 00:00:00', 'Transfer from Checking', FALSE, NULL, 3.0, 0, '2025-03-03 00:00:00'),
    (13, 11.0, NULL, 2.0, 4638.29, 'transfer', '2025-01-17 00:00:00', 'Transfer to Savings', TRUE, NULL, NULL, 5, '2025-01-17 00:00:00'),
    (13, 7.0, NULL, 7.0, 4754.83, 'transfer', '2025-05-10 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 31, '2025-05-10 00:00:00'),
    (13, 26.0, NULL, 2.0, 2484.92, 'deposit', '2025-03-08 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 9, '2025-03-08 00:00:00'),
    (13, 29.0, NULL, 4.0, 1072.3, 'withdrawal', '2025-02-19 00:00:00', 'Cash Removed from Account', FALSE, 15.0, 4.0, 9, '2025-02-19 00:00:00'),
    (13, 17.0, NULL, NULL, 1702.77, 'expense', '2025-04-26 00:00:00', 'Mobile Data Recharge', FALSE, NULL, 1.0, 21, '2025-04-26 00:00:00'),
    (13, 26.0, NULL, 4.0, 614.68, 'expense', '2025-04-06 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 2, '2025-04-06 00:00:00'),
    (13, 15.0, NULL, NULL, 126.37, 'fee', '2025-03-22 00:00:00', 'Service Charge', FALSE, 9.0, NULL, 16, '2025-03-22 00:00:00'),
    (13, 43.0, NULL, NULL, 2212.71, 'income', '2025-06-19 00:00:00', 'Freelance Project Payment', FALSE, 11.0, NULL, 49, '2025-06-19 00:00:00'),
    (13, 20.0, NULL, 4.0, 4481.27, 'deposit', '2025-06-01 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 6, '2025-06-01 00:00:00'),
    (13, 27.0, NULL, 6.0, 4549.13, 'income', '2025-05-17 00:00:00', 'Dividend Payment', TRUE, NULL, NULL, 1, '2025-05-17 00:00:00'),
    (13, NULL, 10.0, NULL, 823.19, 'income', '2025-01-17 00:00:00', 'Salary Payment', TRUE, NULL, 5.0, 32, '2025-01-17 00:00:00'),
    (13, 48.0, NULL, NULL, 2237.42, 'expense', '2025-06-27 00:00:00', 'Grocery Store Purchase', FALSE, 17.0, NULL, 39, '2025-06-27 00:00:00'),
    (13, 40.0, NULL, 4.0, 2460.65, 'withdrawal', '2025-04-01 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 16, '2025-04-01 00:00:00'),
    (13, 2.0, NULL, 3.0, 653.96, 'fee', '2025-03-25 00:00:00', 'Monthly Account Fee', TRUE, 10.0, NULL, 23, '2025-03-25 00:00:00'),
    (13, 10.0, NULL, NULL, 4857.22, 'income', '2025-05-05 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 9, '2025-05-05 00:00:00'),
    (13, NULL, 5.0, NULL, 460.11, 'deposit', '2025-04-05 00:00:00', 'Cash Deposit at Branch', FALSE, 4.0, NULL, 47, '2025-04-05 00:00:00'),
    (13, NULL, 7.0, NULL, 2150.09, 'income', '2025-05-20 00:00:00', 'Refund Processed', FALSE, NULL, 5.0, 49, '2025-05-20 00:00:00'),
    (13, 44.0, NULL, NULL, 873.16, 'transfer', '2025-06-02 00:00:00', 'Transfer from Checking', FALSE, 4.0, NULL, 44, '2025-06-02 00:00:00'),
    (13, 25.0, NULL, 2.0, 2600.65, 'withdrawal', '2025-04-12 00:00:00', 'ATM Cash Withdrawal', FALSE, 12.0, NULL, 12, '2025-04-12 00:00:00'),
    (13, 23.0, NULL, NULL, 2101.32, 'deposit', '2025-05-24 00:00:00', 'Online Deposit', FALSE, 22.0, NULL, 6, '2025-05-24 00:00:00'),
    (14, 35.0, NULL, 6.0, 2609.59, 'fee', '2025-02-13 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 32, '2025-02-13 00:00:00'),
    (14, 22.0, NULL, 8.0, 3806.24, 'deposit', '2025-02-22 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 13, '2025-02-22 00:00:00'),
    (14, 49.0, NULL, 4.0, 1533.28, 'withdrawal', '2025-04-29 00:00:00', 'ATM Cash Withdrawal', FALSE, 5.0, NULL, 44, '2025-04-29 00:00:00'),
    (14, NULL, 2.0, NULL, 2680.82, 'transfer', '2025-03-09 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 40, '2025-03-09 00:00:00'),
    (14, 27.0, NULL, 9.0, 3005.14, 'expense', '2025-05-24 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 30, '2025-05-24 00:00:00'),
    (14, 35.0, NULL, NULL, 3863.4, 'withdrawal', '2025-02-26 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 5, '2025-02-26 00:00:00'),
    (14, NULL, 7.0, 6.0, 4311.21, 'income', '2025-02-27 00:00:00', 'Salary Payment', FALSE, 21.0, NULL, 42, '2025-02-27 00:00:00'),
    (14, 42.0, NULL, 1.0, 1188.71, 'expense', '2025-06-27 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 8, '2025-06-27 00:00:00'),
    (14, NULL, 8.0, 4.0, 198.82, 'transfer', '2025-03-26 00:00:00', 'Transfer to Savings', FALSE, NULL, 5.0, 29, '2025-03-26 00:00:00'),
    (14, 51.0, NULL, NULL, 2107.82, 'deposit', '2025-05-23 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 0, '2025-05-23 00:00:00'),
    (14, 20.0, NULL, 7.0, 2611.04, 'expense', '2025-05-27 00:00:00', 'Streaming Subscription', FALSE, 23.0, NULL, 7, '2025-05-27 00:00:00'),
    (14, 21.0, NULL, NULL, 842.11, 'withdrawal', '2025-06-24 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, 1.0, 6, '2025-06-24 00:00:00'),
    (14, 43.0, NULL, NULL, 4589.02, 'withdrawal', '2025-03-26 00:00:00', 'ATM Cash Withdrawal', TRUE, NULL, NULL, 47, '2025-03-26 00:00:00'),
    (14, NULL, 1.0, NULL, 2725.41, 'expense', '2025-04-28 00:00:00', 'Grocery Store Purchase', FALSE, NULL, NULL, 22, '2025-04-28 00:00:00'),
    (14, NULL, 11.0, 1.0, 2695.9, 'fee', '2025-05-29 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 44, '2025-05-29 00:00:00'),
    (14, 12.0, NULL, 5.0, 4168.53, 'transfer', '2025-05-06 00:00:00', 'Bank Internal Transfer', TRUE, NULL, NULL, 37, '2025-05-06 00:00:00'),
    (14, 10.0, NULL, NULL, 4361.85, 'withdrawal', '2025-06-08 00:00:00', 'Cash Removed from Account', FALSE, 11.0, 1.0, 30, '2025-06-08 00:00:00'),
    (14, 22.0, NULL, NULL, 114.51, 'fee', '2025-06-03 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 15, '2025-06-03 00:00:00'),
    (14, NULL, 13.0, NULL, 262.32, 'deposit', '2025-01-06 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 18, '2025-01-06 00:00:00'),
    (14, 37.0, NULL, NULL, 4704.56, 'transfer', '2025-05-25 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 48, '2025-05-25 00:00:00'),
    (14, NULL, 11.0, 9.0, 4211.1, 'withdrawal', '2025-05-05 00:00:00', 'ATM Cash Withdrawal', TRUE, 13.0, NULL, 43, '2025-05-05 00:00:00'),
    (14, 23.0, NULL, NULL, 2389.16, 'deposit', '2025-01-13 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 14, '2025-01-13 00:00:00'),
    (14, 20.0, NULL, 5.0, 889.2, 'transfer', '2025-03-29 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 5, '2025-03-29 00:00:00'),
    (14, 45.0, NULL, 5.0, 4182.24, 'income', '2025-01-27 00:00:00', 'Dividend Payment', FALSE, NULL, NULL, 43, '2025-01-27 00:00:00'),
    (14, NULL, 11.0, 6.0, 2501.12, 'fee', '2025-01-14 00:00:00', 'Service Charge', FALSE, NULL, 3.0, 33, '2025-01-14 00:00:00'),
    (14, 35.0, NULL, 7.0, 1240.26, 'withdrawal', '2025-04-17 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 25, '2025-04-17 00:00:00'),
    (14, 48.0, NULL, 7.0, 2735.36, 'expense', '2025-06-20 00:00:00', 'Monthly Rent Payment', FALSE, NULL, NULL, 34, '2025-06-20 00:00:00'),
    (14, NULL, 11.0, 9.0, 2341.33, 'withdrawal', '2025-03-11 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 46, '2025-03-11 00:00:00'),
    (14, 12.0, NULL, 2.0, 1710.05, 'expense', '2025-01-08 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 12, '2025-01-08 00:00:00'),
    (14, NULL, 13.0, 1.0, 1776.51, 'transfer', '2025-03-08 00:00:00', 'Bank Internal Transfer', FALSE, NULL, 1.0, 18, '2025-03-08 00:00:00'),
    (14, 45.0, NULL, 3.0, 138.63, 'deposit', '2025-05-05 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 33, '2025-05-05 00:00:00'),
    (14, NULL, 3.0, NULL, 3028.69, 'income', '2025-03-15 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 21, '2025-03-15 00:00:00'),
    (14, 32.0, NULL, 9.0, 2242.56, 'transfer', '2025-01-28 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 0, '2025-01-28 00:00:00'),
    (14, 10.0, NULL, 6.0, 1788.84, 'income', '2025-01-08 00:00:00', 'Interest Income', TRUE, NULL, NULL, 12, '2025-01-08 00:00:00'),
    (14, NULL, 10.0, NULL, 1507.2, 'deposit', '2025-06-08 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 13, '2025-06-08 00:00:00'),
    (14, NULL, 13.0, 7.0, 1460.38, 'income', '2025-05-03 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 43, '2025-05-03 00:00:00'),
    (14, 39.0, NULL, NULL, 59.37, 'fee', '2025-06-29 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 27, '2025-06-29 00:00:00'),
    (14, 48.0, NULL, NULL, 3013.71, 'fee', '2025-02-03 00:00:00', 'Service Charge', FALSE, NULL, NULL, 17, '2025-02-03 00:00:00'),
    (14, 31.0, NULL, 3.0, 4948.18, 'income', '2025-04-22 00:00:00', 'Interest Income', FALSE, NULL, 5.0, 31, '2025-04-22 00:00:00'),
    (14, 38.0, NULL, 5.0, 2498.11, 'withdrawal', '2025-04-14 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 34, '2025-04-14 00:00:00'),
    (14, 9.0, NULL, 9.0, 1119.7, 'fee', '2025-03-03 00:00:00', 'Monthly Account Fee', TRUE, 10.0, NULL, 47, '2025-03-03 00:00:00'),
    (14, 16.0, NULL, 4.0, 2575.56, 'expense', '2025-02-06 00:00:00', 'Monthly Rent Payment', FALSE, NULL, NULL, 14, '2025-02-06 00:00:00'),
    (14, 41.0, NULL, 9.0, 1407.25, 'fee', '2025-01-14 00:00:00', 'Service Charge', FALSE, NULL, 2.0, 40, '2025-01-14 00:00:00'),
    (14, 23.0, NULL, 6.0, 782.74, 'transfer', '2025-01-17 00:00:00', 'Transfer from Checking', FALSE, 7.0, NULL, 17, '2025-01-17 00:00:00'),
    (14, 18.0, NULL, 2.0, 1836.0, 'fee', '2025-03-17 00:00:00', 'ATM Withdrawal Fee', FALSE, 3.0, 3.0, 1, '2025-03-17 00:00:00'),
    (14, 47.0, NULL, 5.0, 2243.41, 'deposit', '2025-04-27 00:00:00', 'Cash Deposit at Branch', FALSE, 20.0, NULL, 36, '2025-04-27 00:00:00'),
    (14, NULL, 13.0, NULL, 4078.27, 'transfer', '2025-04-26 00:00:00', 'Transfer from Checking', FALSE, 5.0, 4.0, 9, '2025-04-26 00:00:00'),
    (14, 19.0, NULL, NULL, 1421.52, 'expense', '2025-03-20 00:00:00', 'Streaming Subscription', TRUE, NULL, NULL, 10, '2025-03-20 00:00:00'),
    (14, NULL, 3.0, NULL, 1813.92, 'withdrawal', '2025-04-16 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 35, '2025-04-16 00:00:00'),
    (14, 23.0, NULL, NULL, 4113.03, 'transfer', '2025-01-24 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 41, '2025-01-24 00:00:00'),
    (14, NULL, 3.0, NULL, 3269.9, 'fee', '2025-02-05 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 45, '2025-02-05 00:00:00'),
    (14, 42.0, NULL, 9.0, 2805.2, 'income', '2025-01-23 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 5, '2025-01-23 00:00:00'),
    (14, NULL, 1.0, 6.0, 3500.52, 'income', '2025-05-22 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 21, '2025-05-22 00:00:00'),
    (14, 10.0, NULL, NULL, 1291.98, 'transfer', '2025-06-01 00:00:00', 'Transfer to Savings', FALSE, 11.0, NULL, 31, '2025-06-01 00:00:00'),
    (14, 50.0, NULL, 5.0, 1670.22, 'transfer', '2025-03-17 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 15, '2025-03-17 00:00:00'),
    (14, 25.0, NULL, NULL, 2333.39, 'withdrawal', '2025-06-16 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 34, '2025-06-16 00:00:00'),
    (14, 49.0, NULL, NULL, 390.8, 'expense', '2025-03-29 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 1, '2025-03-29 00:00:00'),
    (14, NULL, 13.0, 9.0, 3958.98, 'transfer', '2025-03-19 00:00:00', 'Transfer from Checking', FALSE, 5.0, NULL, 31, '2025-03-19 00:00:00'),
    (14, 3.0, NULL, 5.0, 2545.29, 'fee', '2025-03-02 00:00:00', 'Service Charge', FALSE, NULL, 2.0, 50, '2025-03-02 00:00:00'),
    (14, 51.0, NULL, 5.0, 3206.36, 'withdrawal', '2025-01-11 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 33, '2025-01-11 00:00:00'),
    (15, 46.0, NULL, 6.0, 1450.23, 'transfer', '2025-04-04 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 16, '2025-04-04 00:00:00'),
    (15, 37.0, NULL, 4.0, 4238.07, 'withdrawal', '2025-05-20 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 12, '2025-05-20 00:00:00'),
    (15, 19.0, NULL, 3.0, 3444.65, 'expense', '2025-03-06 00:00:00', 'Grocery Store Purchase', FALSE, 12.0, NULL, 26, '2025-03-06 00:00:00'),
    (15, 7.0, NULL, NULL, 1756.98, 'deposit', '2025-02-19 00:00:00', 'Cheque Deposit', FALSE, NULL, 5.0, 38, '2025-02-19 00:00:00'),
    (15, NULL, 13.0, NULL, 2411.4, 'withdrawal', '2025-04-15 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 25, '2025-04-15 00:00:00'),
    (15, 43.0, NULL, NULL, 3084.74, 'expense', '2025-05-28 00:00:00', 'Grocery Store Purchase', FALSE, 18.0, NULL, 22, '2025-05-28 00:00:00'),
    (15, NULL, 9.0, NULL, 3073.31, 'deposit', '2025-01-26 00:00:00', 'Cash Deposit at Branch', FALSE, 20.0, NULL, 32, '2025-01-26 00:00:00'),
    (15, 37.0, NULL, 7.0, 1135.3, 'fee', '2025-03-05 00:00:00', 'Monthly Account Fee', FALSE, 8.0, NULL, 30, '2025-03-05 00:00:00'),
    (15, 45.0, NULL, NULL, 3730.94, 'transfer', '2025-05-03 00:00:00', 'Transfer to Savings', FALSE, 4.0, NULL, 23, '2025-05-03 00:00:00'),
    (15, 36.0, NULL, 4.0, 416.9, 'fee', '2025-01-23 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, 1.0, 18, '2025-01-23 00:00:00'),
    (15, 21.0, NULL, NULL, 4374.0, 'withdrawal', '2025-02-14 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 45, '2025-02-14 00:00:00'),
    (15, NULL, 5.0, 7.0, 4634.79, 'deposit', '2025-05-24 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 15, '2025-05-24 00:00:00'),
    (15, 11.0, NULL, 3.0, 2151.67, 'expense', '2025-02-13 00:00:00', 'Utility Bill Payment', FALSE, NULL, NULL, 8, '2025-02-13 00:00:00'),
    (15, 51.0, NULL, NULL, 469.49, 'transfer', '2025-03-31 00:00:00', 'Transfer to Savings', FALSE, 18.0, NULL, 11, '2025-03-31 00:00:00'),
    (15, 33.0, NULL, 3.0, 3586.18, 'withdrawal', '2025-04-29 00:00:00', 'ATM Cash Withdrawal', FALSE, 9.0, NULL, 49, '2025-04-29 00:00:00'),
    (15, 38.0, NULL, NULL, 646.34, 'fee', '2025-04-15 00:00:00', 'Service Charge', FALSE, NULL, NULL, 47, '2025-04-15 00:00:00'),
    (15, 12.0, NULL, 2.0, 4162.4, 'transfer', '2025-04-29 00:00:00', 'Transfer from Checking', FALSE, 17.0, 2.0, 26, '2025-04-29 00:00:00'),
    (15, 1.0, NULL, NULL, 229.71, 'income', '2025-06-21 00:00:00', 'Salary Payment', FALSE, 5.0, NULL, 4, '2025-06-21 00:00:00'),
    (15, 26.0, NULL, NULL, 1565.1, 'expense', '2025-02-22 00:00:00', 'Mobile Data Recharge', FALSE, NULL, 2.0, 5, '2025-02-22 00:00:00'),
    (15, 20.0, NULL, 2.0, 4760.17, 'fee', '2025-06-03 00:00:00', 'Monthly Account Fee', TRUE, NULL, 1.0, 8, '2025-06-03 00:00:00'),
    (15, 47.0, NULL, NULL, 1075.34, 'transfer', '2025-04-27 00:00:00', 'Transfer to Savings', FALSE, 12.0, NULL, 19, '2025-04-27 00:00:00'),
    (15, 19.0, NULL, 4.0, 4183.19, 'expense', '2025-04-05 00:00:00', 'Public Transport Fare', FALSE, NULL, 4.0, 5, '2025-04-05 00:00:00'),
    (15, 5.0, NULL, 6.0, 1678.81, 'expense', '2025-01-23 00:00:00', 'Coffee Shop', FALSE, NULL, NULL, 9, '2025-01-23 00:00:00'),
    (15, NULL, 2.0, 3.0, 3754.82, 'income', '2025-03-11 00:00:00', 'Dividend Payment', FALSE, NULL, 5.0, 27, '2025-03-11 00:00:00'),
    (15, 15.0, NULL, 6.0, 3220.4, 'deposit', '2025-03-20 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 30, '2025-03-20 00:00:00'),
    (15, 7.0, NULL, NULL, 2312.6, 'transfer', '2025-05-04 00:00:00', 'Transfer to Savings', FALSE, 17.0, NULL, 44, '2025-05-04 00:00:00'),
    (15, NULL, 12.0, 8.0, 384.61, 'income', '2025-06-11 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 31, '2025-06-11 00:00:00'),
    (15, NULL, 9.0, NULL, 3528.66, 'withdrawal', '2025-04-16 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, 3.0, 24, '2025-04-16 00:00:00'),
    (15, NULL, 3.0, 6.0, 100.1, 'income', '2025-06-08 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 19, '2025-06-08 00:00:00'),
    (15, NULL, 1.0, NULL, 3169.56, 'transfer', '2025-04-11 00:00:00', 'Bank Internal Transfer', FALSE, NULL, 1.0, 20, '2025-04-11 00:00:00'),
    (15, NULL, 1.0, NULL, 1655.22, 'income', '2025-02-10 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 29, '2025-02-10 00:00:00'),
    (16, 40.0, NULL, NULL, 3822.93, 'withdrawal', '2025-05-18 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 3, '2025-05-18 00:00:00'),
    (16, NULL, 3.0, 2.0, 1992.57, 'deposit', '2025-04-29 00:00:00', 'Cash Deposit at Branch', FALSE, 3.0, 4.0, 49, '2025-04-29 00:00:00'),
    (16, 7.0, NULL, 6.0, 2651.16, 'expense', '2025-02-23 00:00:00', 'Mobile Data Recharge', FALSE, NULL, NULL, 50, '2025-02-23 00:00:00'),
    (16, 22.0, NULL, NULL, 2391.71, 'income', '2025-02-01 00:00:00', 'Refund Processed', TRUE, NULL, NULL, 39, '2025-02-01 00:00:00'),
    (16, 34.0, NULL, NULL, 1244.81, 'income', '2025-01-11 00:00:00', 'Bonus Received', FALSE, 8.0, 3.0, 33, '2025-01-11 00:00:00'),
    (16, 34.0, NULL, NULL, 4564.72, 'fee', '2025-01-24 00:00:00', 'Monthly Account Fee', FALSE, 15.0, 5.0, 40, '2025-01-24 00:00:00'),
    (16, 29.0, NULL, 8.0, 2094.35, 'fee', '2025-05-05 00:00:00', 'ATM Withdrawal Fee', TRUE, NULL, NULL, 36, '2025-05-05 00:00:00'),
    (16, 2.0, NULL, 8.0, 825.57, 'income', '2025-05-07 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 27, '2025-05-07 00:00:00'),
    (16, 10.0, NULL, NULL, 633.33, 'withdrawal', '2025-03-29 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 14, '2025-03-29 00:00:00'),
    (16, NULL, 4.0, NULL, 601.18, 'expense', '2025-01-20 00:00:00', 'Mobile Data Recharge', FALSE, 20.0, NULL, 35, '2025-01-20 00:00:00'),
    (16, NULL, 6.0, NULL, 2263.58, 'expense', '2025-06-07 00:00:00', 'Fuel Station', FALSE, 16.0, NULL, 49, '2025-06-07 00:00:00'),
    (16, 15.0, NULL, NULL, 4610.36, 'fee', '2025-02-28 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 26, '2025-02-28 00:00:00'),
    (16, NULL, 11.0, 4.0, 3062.06, 'expense', '2025-03-28 00:00:00', 'Utility Bill Payment', FALSE, NULL, NULL, 25, '2025-03-28 00:00:00'),
    (16, 12.0, NULL, 1.0, 2804.46, 'fee', '2025-06-30 00:00:00', 'Monthly Account Fee', FALSE, NULL, 5.0, 33, '2025-06-30 00:00:00'),
    (16, NULL, 2.0, NULL, 4866.63, 'fee', '2025-06-04 00:00:00', 'Monthly Account Fee', FALSE, 17.0, NULL, 7, '2025-06-04 00:00:00'),
    (16, 27.0, NULL, NULL, 1652.83, 'deposit', '2025-05-27 00:00:00', 'Online Deposit', FALSE, 4.0, 3.0, 47, '2025-05-27 00:00:00'),
    (16, 42.0, NULL, 3.0, 1801.24, 'expense', '2025-01-02 00:00:00', 'Fuel Station', FALSE, NULL, 4.0, 20, '2025-01-02 00:00:00'),
    (16, NULL, 7.0, NULL, 3882.97, 'fee', '2025-03-11 00:00:00', 'Service Charge', FALSE, 15.0, NULL, 47, '2025-03-11 00:00:00'),
    (16, 19.0, NULL, 6.0, 2933.61, 'income', '2025-06-08 00:00:00', 'Interest Income', FALSE, 1.0, NULL, 49, '2025-06-08 00:00:00'),
    (16, 20.0, NULL, 8.0, 4923.24, 'withdrawal', '2025-06-17 00:00:00', 'Cash Removed from Account', FALSE, 17.0, 3.0, 30, '2025-06-17 00:00:00'),
    (16, NULL, 8.0, NULL, 3313.42, 'expense', '2025-02-03 00:00:00', 'Mobile Data Recharge', FALSE, NULL, 2.0, 38, '2025-02-03 00:00:00'),
    (16, NULL, 3.0, NULL, 3552.25, 'withdrawal', '2025-01-10 00:00:00', 'ATM Cash Withdrawal', FALSE, 18.0, NULL, 1, '2025-01-10 00:00:00'),
    (16, 6.0, NULL, 9.0, 450.02, 'fee', '2025-05-21 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 23, '2025-05-21 00:00:00'),
    (16, 31.0, NULL, 7.0, 2981.53, 'fee', '2025-04-27 00:00:00', 'Monthly Account Fee', TRUE, NULL, NULL, 39, '2025-04-27 00:00:00'),
    (16, 15.0, NULL, 9.0, 3382.18, 'expense', '2025-05-21 00:00:00', 'Restaurant Dinner', FALSE, 22.0, NULL, 24, '2025-05-21 00:00:00'),
    (16, 42.0, NULL, 2.0, 2000.22, 'withdrawal', '2025-03-13 00:00:00', 'ATM Cash Withdrawal', FALSE, 5.0, NULL, 22, '2025-03-13 00:00:00'),
    (16, 25.0, NULL, 5.0, 3627.19, 'transfer', '2025-02-05 00:00:00', 'Transfer to Savings', TRUE, 19.0, NULL, 9, '2025-02-05 00:00:00'),
    (16, 21.0, NULL, 4.0, 2586.9, 'withdrawal', '2025-05-14 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 24, '2025-05-14 00:00:00'),
    (16, NULL, 6.0, 6.0, 4986.36, 'withdrawal', '2025-04-24 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 17, '2025-04-24 00:00:00'),
    (16, 20.0, NULL, NULL, 2421.47, 'transfer', '2025-05-27 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 17, '2025-05-27 00:00:00'),
    (16, 11.0, NULL, 5.0, 1459.72, 'fee', '2025-01-30 00:00:00', 'ATM Withdrawal Fee', FALSE, 16.0, 1.0, 21, '2025-01-30 00:00:00'),
    (16, NULL, 12.0, NULL, 1572.85, 'expense', '2025-06-21 00:00:00', 'Coffee Shop', FALSE, NULL, 5.0, 22, '2025-06-21 00:00:00'),
    (16, NULL, 6.0, 9.0, 3194.14, 'transfer', '2025-03-30 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 34, '2025-03-30 00:00:00'),
    (16, NULL, 9.0, 7.0, 2331.01, 'fee', '2025-02-17 00:00:00', 'ATM Withdrawal Fee', FALSE, 20.0, NULL, 48, '2025-02-17 00:00:00'),
    (16, 50.0, NULL, NULL, 1524.93, 'transfer', '2025-03-26 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 38, '2025-03-26 00:00:00'),
    (16, 14.0, NULL, NULL, 1818.52, 'withdrawal', '2025-02-18 00:00:00', 'ATM Cash Withdrawal', TRUE, 3.0, NULL, 43, '2025-02-18 00:00:00'),
    (16, 38.0, NULL, 3.0, 1996.68, 'deposit', '2025-05-01 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 46, '2025-05-01 00:00:00'),
    (16, 18.0, NULL, 8.0, 2788.67, 'income', '2025-01-02 00:00:00', 'Salary Payment', FALSE, 11.0, NULL, 7, '2025-01-02 00:00:00'),
    (16, NULL, 6.0, 6.0, 4036.28, 'fee', '2025-04-16 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 5, '2025-04-16 00:00:00'),
    (16, 49.0, NULL, 6.0, 1567.96, 'fee', '2025-02-23 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 31, '2025-02-23 00:00:00'),
    (16, 5.0, NULL, 4.0, 3624.19, 'income', '2025-04-16 00:00:00', 'Freelance Project Payment', TRUE, NULL, NULL, 22, '2025-04-16 00:00:00'),
    (16, 13.0, NULL, 6.0, 3801.58, 'income', '2025-01-30 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 11, '2025-01-30 00:00:00'),
    (16, 32.0, NULL, NULL, 987.12, 'fee', '2025-05-26 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, 4.0, 0, '2025-05-26 00:00:00'),
    (16, 25.0, NULL, 6.0, 2330.83, 'deposit', '2025-05-23 00:00:00', 'Online Deposit', FALSE, 9.0, NULL, 29, '2025-05-23 00:00:00'),
    (16, 29.0, NULL, 2.0, 3286.27, 'withdrawal', '2025-03-27 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 43, '2025-03-27 00:00:00'),
    (16, 21.0, NULL, 2.0, 2970.9, 'transfer', '2025-03-28 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 35, '2025-03-28 00:00:00'),
    (16, NULL, 6.0, NULL, 515.85, 'withdrawal', '2025-06-18 00:00:00', 'Cash Removed from Account', FALSE, NULL, 4.0, 34, '2025-06-18 00:00:00'),
    (16, 19.0, NULL, NULL, 2276.46, 'transfer', '2025-06-09 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 12, '2025-06-09 00:00:00'),
    (16, 31.0, NULL, NULL, 1489.83, 'income', '2025-03-19 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 0, '2025-03-19 00:00:00'),
    (16, 12.0, NULL, 3.0, 287.53, 'fee', '2025-02-20 00:00:00', 'ATM Withdrawal Fee', FALSE, 3.0, 4.0, 47, '2025-02-20 00:00:00'),
    (16, 8.0, NULL, 2.0, 1749.91, 'deposit', '2025-06-21 00:00:00', 'Online Deposit', FALSE, 11.0, NULL, 22, '2025-06-21 00:00:00'),
    (16, NULL, 11.0, NULL, 4762.38, 'transfer', '2025-05-26 00:00:00', 'Transfer from Checking', FALSE, NULL, 3.0, 20, '2025-05-26 00:00:00'),
    (16, NULL, 10.0, 6.0, 3094.26, 'expense', '2025-05-11 00:00:00', 'Utility Bill Payment', TRUE, 11.0, NULL, 27, '2025-05-11 00:00:00'),
    (16, 20.0, NULL, NULL, 1796.09, 'expense', '2025-05-04 00:00:00', 'Mobile Data Recharge', FALSE, NULL, NULL, 22, '2025-05-04 00:00:00'),
    (16, 18.0, NULL, 6.0, 4815.26, 'expense', '2025-03-18 00:00:00', 'Monthly Rent Payment', FALSE, 19.0, NULL, 11, '2025-03-18 00:00:00'),
    (16, 29.0, NULL, NULL, 1652.23, 'income', '2025-03-06 00:00:00', 'Interest Income', FALSE, NULL, NULL, 18, '2025-03-06 00:00:00'),
    (16, 29.0, NULL, NULL, 749.45, 'income', '2025-02-18 00:00:00', 'Bonus Received', FALSE, 22.0, 2.0, 32, '2025-02-18 00:00:00'),
    (16, 34.0, NULL, NULL, 682.84, 'transfer', '2025-01-23 00:00:00', 'Transfer to Savings', TRUE, 17.0, NULL, 6, '2025-01-23 00:00:00'),
    (17, 7.0, NULL, 1.0, 740.99, 'fee', '2025-05-19 00:00:00', 'Service Charge', FALSE, NULL, NULL, 9, '2025-05-19 00:00:00'),
    (17, 2.0, NULL, 3.0, 2024.54, 'income', '2025-05-29 00:00:00', 'Dividend Payment', TRUE, 5.0, NULL, 29, '2025-05-29 00:00:00'),
    (17, 3.0, NULL, NULL, 2362.93, 'deposit', '2025-03-01 00:00:00', 'Cash Deposit at Branch', TRUE, 2.0, NULL, 25, '2025-03-01 00:00:00'),
    (17, NULL, 7.0, 3.0, 822.74, 'withdrawal', '2025-02-26 00:00:00', 'ATM Cash Withdrawal', FALSE, 21.0, NULL, 5, '2025-02-26 00:00:00'),
    (17, 15.0, NULL, 8.0, 3299.44, 'expense', '2025-05-06 00:00:00', 'Grocery Store Purchase', FALSE, 16.0, NULL, 9, '2025-05-06 00:00:00'),
    (17, 47.0, NULL, 8.0, 2289.23, 'income', '2025-06-20 00:00:00', 'Bonus Received', FALSE, 7.0, NULL, 27, '2025-06-20 00:00:00'),
    (17, NULL, 3.0, 1.0, 2549.47, 'transfer', '2025-04-15 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 11, '2025-04-15 00:00:00'),
    (17, 48.0, NULL, NULL, 4807.17, 'transfer', '2025-06-06 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 27, '2025-06-06 00:00:00'),
    (17, NULL, 12.0, 8.0, 2972.88, 'fee', '2025-01-26 00:00:00', 'Service Charge', FALSE, NULL, NULL, 25, '2025-01-26 00:00:00'),
    (17, 20.0, NULL, NULL, 4163.69, 'expense', '2025-06-27 00:00:00', 'Clothing Store Purchase', FALSE, 23.0, 1.0, 47, '2025-06-27 00:00:00'),
    (17, 51.0, NULL, 3.0, 655.04, 'income', '2025-04-08 00:00:00', 'Dividend Payment', TRUE, NULL, NULL, 43, '2025-04-08 00:00:00'),
    (17, NULL, 13.0, NULL, 1710.43, 'deposit', '2025-04-10 00:00:00', 'Online Deposit', FALSE, 8.0, NULL, 22, '2025-04-10 00:00:00'),
    (17, 13.0, NULL, NULL, 3930.78, 'transfer', '2025-05-14 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 11, '2025-05-14 00:00:00'),
    (17, 13.0, NULL, NULL, 4403.43, 'income', '2025-04-14 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 27, '2025-04-14 00:00:00'),
    (17, 30.0, NULL, NULL, 4506.46, 'withdrawal', '2025-01-16 00:00:00', 'Cash Removed from Account', FALSE, 17.0, NULL, 23, '2025-01-16 00:00:00'),
    (17, 46.0, NULL, 4.0, 4295.23, 'income', '2025-04-11 00:00:00', 'Freelance Project Payment', TRUE, 4.0, NULL, 3, '2025-04-11 00:00:00'),
    (17, 49.0, NULL, 9.0, 4996.75, 'income', '2025-04-28 00:00:00', 'Dividend Payment', FALSE, NULL, NULL, 39, '2025-04-28 00:00:00'),
    (17, NULL, 5.0, 5.0, 4310.11, 'fee', '2025-06-03 00:00:00', 'Service Charge', FALSE, NULL, NULL, 18, '2025-06-03 00:00:00'),
    (17, 8.0, NULL, NULL, 4833.32, 'transfer', '2025-03-22 00:00:00', 'Transfer to Savings', FALSE, 15.0, NULL, 34, '2025-03-22 00:00:00'),
    (17, 19.0, NULL, NULL, 1861.24, 'income', '2025-03-10 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 17, '2025-03-10 00:00:00'),
    (17, 27.0, NULL, NULL, 2073.28, 'income', '2025-04-06 00:00:00', 'Interest Income', FALSE, 4.0, NULL, 26, '2025-04-06 00:00:00'),
    (17, NULL, 13.0, 9.0, 3442.69, 'deposit', '2025-01-05 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 41, '2025-01-05 00:00:00'),
    (17, 23.0, NULL, 6.0, 1476.71, 'withdrawal', '2025-02-11 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 14, '2025-02-11 00:00:00'),
    (17, 51.0, NULL, NULL, 73.32, 'fee', '2025-03-03 00:00:00', 'Service Charge', TRUE, 7.0, NULL, 27, '2025-03-03 00:00:00'),
    (17, NULL, 2.0, NULL, 2873.76, 'deposit', '2025-02-09 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 46, '2025-02-09 00:00:00'),
    (17, 50.0, NULL, 1.0, 324.2, 'deposit', '2025-06-13 00:00:00', 'Online Deposit', FALSE, 13.0, NULL, 23, '2025-06-13 00:00:00'),
    (17, 33.0, NULL, NULL, 4132.4, 'transfer', '2025-05-22 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 40, '2025-05-22 00:00:00'),
    (17, 49.0, NULL, 7.0, 1631.09, 'expense', '2025-05-17 00:00:00', 'Monthly Rent Payment', FALSE, NULL, NULL, 40, '2025-05-17 00:00:00'),
    (17, NULL, 7.0, NULL, 1526.6, 'fee', '2025-06-08 00:00:00', 'Service Charge', FALSE, NULL, NULL, 45, '2025-06-08 00:00:00'),
    (17, 6.0, NULL, NULL, 1348.0, 'income', '2025-06-28 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 45, '2025-06-28 00:00:00'),
    (17, 3.0, NULL, NULL, 1653.66, 'transfer', '2025-05-19 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 25, '2025-05-19 00:00:00'),
    (17, 1.0, NULL, 6.0, 4999.8, 'withdrawal', '2025-05-05 00:00:00', 'Cash Removed from Account', FALSE, NULL, 5.0, 27, '2025-05-05 00:00:00'),
    (17, 14.0, NULL, NULL, 1731.62, 'deposit', '2025-04-25 00:00:00', 'Online Deposit', TRUE, NULL, NULL, 45, '2025-04-25 00:00:00'),
    (18, 27.0, NULL, 5.0, 4657.64, 'withdrawal', '2025-01-03 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 4, '2025-01-03 00:00:00'),
    (18, 35.0, NULL, 6.0, 2421.76, 'expense', '2025-01-20 00:00:00', 'Streaming Subscription', FALSE, NULL, 2.0, 50, '2025-01-20 00:00:00'),
    (18, 47.0, NULL, 6.0, 250.78, 'expense', '2025-06-17 00:00:00', 'Utility Bill Payment', FALSE, NULL, NULL, 13, '2025-06-17 00:00:00'),
    (18, 17.0, NULL, NULL, 3958.31, 'withdrawal', '2025-04-27 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 19, '2025-04-27 00:00:00'),
    (18, 28.0, NULL, 5.0, 24.11, 'withdrawal', '2025-06-26 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 8, '2025-06-26 00:00:00'),
    (18, NULL, 4.0, 2.0, 3142.84, 'income', '2025-01-20 00:00:00', 'Salary Payment', FALSE, NULL, 2.0, 37, '2025-01-20 00:00:00'),
    (18, NULL, 1.0, 3.0, 3485.89, 'fee', '2025-02-13 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 28, '2025-02-13 00:00:00'),
    (18, 20.0, NULL, NULL, 2619.82, 'transfer', '2025-02-11 00:00:00', 'Transfer to Savings', FALSE, 19.0, NULL, 19, '2025-02-11 00:00:00'),
    (18, 11.0, NULL, NULL, 1071.7, 'withdrawal', '2025-01-07 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 36, '2025-01-07 00:00:00'),
    (18, NULL, 8.0, NULL, 4795.2, 'withdrawal', '2025-01-12 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 28, '2025-01-12 00:00:00'),
    (18, NULL, 1.0, 3.0, 3341.3, 'deposit', '2025-05-14 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 12, '2025-05-14 00:00:00'),
    (18, 14.0, NULL, 5.0, 3692.14, 'transfer', '2025-05-18 00:00:00', 'Bank Internal Transfer', FALSE, 14.0, NULL, 43, '2025-05-18 00:00:00'),
    (18, 22.0, NULL, 3.0, 1934.37, 'deposit', '2025-05-19 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 6, '2025-05-19 00:00:00'),
    (18, 46.0, NULL, NULL, 3746.35, 'withdrawal', '2025-02-16 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 6, '2025-02-16 00:00:00'),
    (18, NULL, 2.0, 7.0, 4445.3, 'expense', '2025-02-28 00:00:00', 'Streaming Subscription', FALSE, 18.0, NULL, 16, '2025-02-28 00:00:00'),
    (18, 32.0, NULL, 8.0, 843.99, 'withdrawal', '2025-01-26 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 44, '2025-01-26 00:00:00'),
    (18, 22.0, NULL, NULL, 4379.26, 'fee', '2025-01-12 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 32, '2025-01-12 00:00:00'),
    (18, 42.0, NULL, NULL, 132.74, 'expense', '2025-03-27 00:00:00', 'Streaming Subscription', FALSE, 11.0, NULL, 48, '2025-03-27 00:00:00'),
    (18, 42.0, NULL, 5.0, 3890.03, 'withdrawal', '2025-03-29 00:00:00', 'ATM Cash Withdrawal', FALSE, 2.0, NULL, 39, '2025-03-29 00:00:00'),
    (18, 14.0, NULL, NULL, 2488.89, 'fee', '2025-03-30 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, 4.0, 49, '2025-03-30 00:00:00'),
    (18, 36.0, NULL, NULL, 1349.19, 'expense', '2025-01-30 00:00:00', 'Public Transport Fare', FALSE, NULL, NULL, 8, '2025-01-30 00:00:00'),
    (18, 39.0, NULL, 6.0, 685.82, 'transfer', '2025-01-10 00:00:00', 'Transfer from Checking', FALSE, NULL, 1.0, 23, '2025-01-10 00:00:00'),
    (18, 38.0, NULL, 3.0, 1149.81, 'expense', '2025-06-21 00:00:00', 'Fuel Station', FALSE, 12.0, NULL, 22, '2025-06-21 00:00:00'),
    (18, 3.0, NULL, 2.0, 4237.35, 'fee', '2025-01-11 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 30, '2025-01-11 00:00:00'),
    (18, 39.0, NULL, NULL, 2126.69, 'income', '2025-03-17 00:00:00', 'Bonus Received', FALSE, 19.0, NULL, 30, '2025-03-17 00:00:00'),
    (18, NULL, 8.0, 7.0, 1754.23, 'deposit', '2025-06-27 00:00:00', 'Cash Deposit at Branch', TRUE, NULL, NULL, 41, '2025-06-27 00:00:00'),
    (18, 17.0, NULL, NULL, 4074.92, 'transfer', '2025-03-28 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 2, '2025-03-28 00:00:00'),
    (18, 6.0, NULL, NULL, 153.01, 'withdrawal', '2025-04-07 00:00:00', 'Cash Removed from Account', FALSE, 10.0, NULL, 1, '2025-04-07 00:00:00'),
    (18, 21.0, NULL, 8.0, 3321.13, 'transfer', '2025-01-09 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 17, '2025-01-09 00:00:00'),
    (18, 18.0, NULL, 2.0, 216.32, 'deposit', '2025-02-24 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 0, '2025-02-24 00:00:00'),
    (18, NULL, 11.0, NULL, 1604.38, 'deposit', '2025-05-10 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 42, '2025-05-10 00:00:00'),
    (18, 39.0, NULL, 2.0, 22.97, 'expense', '2025-06-26 00:00:00', 'Coffee Shop', FALSE, NULL, NULL, 39, '2025-06-26 00:00:00'),
    (18, NULL, 12.0, 4.0, 1940.89, 'expense', '2025-03-18 00:00:00', 'Grocery Store Purchase', FALSE, NULL, NULL, 9, '2025-03-18 00:00:00'),
    (18, 48.0, NULL, 4.0, 4226.75, 'expense', '2025-04-16 00:00:00', 'Public Transport Fare', FALSE, 19.0, NULL, 1, '2025-04-16 00:00:00'),
    (18, 49.0, NULL, NULL, 1088.38, 'income', '2025-02-14 00:00:00', 'Interest Income', FALSE, NULL, NULL, 44, '2025-02-14 00:00:00'),
    (18, NULL, 13.0, 3.0, 3192.72, 'deposit', '2025-06-06 00:00:00', 'Online Deposit', FALSE, 13.0, NULL, 9, '2025-06-06 00:00:00'),
    (18, 45.0, NULL, NULL, 2923.39, 'transfer', '2025-06-16 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 37, '2025-06-16 00:00:00'),
    (18, 38.0, NULL, NULL, 1533.5, 'deposit', '2025-05-24 00:00:00', 'Cash Deposit at Branch', TRUE, 20.0, NULL, 25, '2025-05-24 00:00:00'),
    (18, NULL, 3.0, 5.0, 4707.83, 'expense', '2025-06-19 00:00:00', 'Utility Bill Payment', FALSE, 18.0, NULL, 19, '2025-06-19 00:00:00'),
    (18, NULL, 4.0, NULL, 3639.09, 'fee', '2025-05-08 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 10, '2025-05-08 00:00:00'),
    (18, NULL, 11.0, NULL, 2946.83, 'expense', '2025-02-13 00:00:00', 'Monthly Rent Payment', FALSE, 2.0, NULL, 34, '2025-02-13 00:00:00'),
    (18, 39.0, NULL, 2.0, 3598.25, 'fee', '2025-01-04 00:00:00', 'Service Charge', TRUE, NULL, NULL, 18, '2025-01-04 00:00:00'),
    (18, NULL, 7.0, NULL, 2079.09, 'income', '2025-04-12 00:00:00', 'Interest Income', FALSE, NULL, NULL, 11, '2025-04-12 00:00:00'),
    (18, NULL, 13.0, NULL, 694.46, 'income', '2025-01-19 00:00:00', 'Interest Income', FALSE, NULL, 4.0, 4, '2025-01-19 00:00:00'),
    (18, NULL, 2.0, 9.0, 2492.41, 'deposit', '2025-01-03 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 49, '2025-01-03 00:00:00'),
    (18, NULL, 1.0, NULL, 3762.51, 'expense', '2025-03-11 00:00:00', 'Utility Bill Payment', FALSE, NULL, 3.0, 25, '2025-03-11 00:00:00'),
    (18, 41.0, NULL, NULL, 447.38, 'income', '2025-05-19 00:00:00', 'Interest Income', TRUE, NULL, NULL, 49, '2025-05-19 00:00:00'),
    (18, 50.0, NULL, NULL, 2117.6, 'expense', '2025-03-16 00:00:00', 'Clothing Store Purchase', TRUE, NULL, NULL, 17, '2025-03-16 00:00:00'),
    (18, 17.0, NULL, 2.0, 1608.4, 'income', '2025-01-20 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 49, '2025-01-20 00:00:00'),
    (18, NULL, 12.0, NULL, 4173.49, 'withdrawal', '2025-06-09 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 42, '2025-06-09 00:00:00'),
    (18, 27.0, NULL, 5.0, 1461.19, 'transfer', '2025-03-23 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 5, '2025-03-23 00:00:00'),
    (18, NULL, 7.0, 1.0, 1959.68, 'withdrawal', '2025-06-19 00:00:00', 'ATM Cash Withdrawal', TRUE, 14.0, NULL, 12, '2025-06-19 00:00:00'),
    (18, 36.0, NULL, 1.0, 4793.15, 'income', '2025-03-09 00:00:00', 'Dividend Payment', FALSE, 5.0, NULL, 17, '2025-03-09 00:00:00'),
    (18, 44.0, NULL, NULL, 4542.65, 'withdrawal', '2025-03-11 00:00:00', 'Cash Removed from Account', FALSE, NULL, 2.0, 45, '2025-03-11 00:00:00'),
    (18, 9.0, NULL, NULL, 4329.42, 'transfer', '2025-04-20 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 18, '2025-04-20 00:00:00'),
    (18, NULL, 5.0, 4.0, 2273.64, 'fee', '2025-02-14 00:00:00', 'Service Charge', FALSE, NULL, NULL, 17, '2025-02-14 00:00:00'),
    (18, 47.0, NULL, NULL, 4704.79, 'income', '2025-04-17 00:00:00', 'Dividend Payment', FALSE, NULL, NULL, 46, '2025-04-17 00:00:00'),
    (18, NULL, 12.0, NULL, 1010.24, 'withdrawal', '2025-05-29 00:00:00', 'ATM Cash Withdrawal', TRUE, NULL, 2.0, 9, '2025-05-29 00:00:00'),
    (18, 39.0, NULL, NULL, 1848.53, 'deposit', '2025-01-09 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, 3.0, 19, '2025-01-09 00:00:00'),
    (18, 34.0, NULL, NULL, 4901.83, 'fee', '2025-06-07 00:00:00', 'Monthly Account Fee', TRUE, NULL, NULL, 5, '2025-06-07 00:00:00'),
    (18, 25.0, NULL, NULL, 1656.57, 'expense', '2025-03-21 00:00:00', 'Clothing Store Purchase', FALSE, NULL, 5.0, 37, '2025-03-21 00:00:00'),
    (18, 38.0, NULL, 2.0, 1106.85, 'expense', '2025-01-16 00:00:00', 'Coffee Shop', FALSE, 13.0, NULL, 17, '2025-01-16 00:00:00'),
    (18, 20.0, NULL, NULL, 2090.52, 'expense', '2025-02-25 00:00:00', 'Coffee Shop', FALSE, NULL, 3.0, 8, '2025-02-25 00:00:00'),
    (18, 27.0, NULL, 8.0, 1654.5, 'expense', '2025-01-31 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 46, '2025-01-31 00:00:00'),
    (19, NULL, 2.0, NULL, 2858.45, 'income', '2025-06-08 00:00:00', 'Interest Income', FALSE, NULL, NULL, 43, '2025-06-08 00:00:00'),
    (19, 38.0, NULL, NULL, 4846.09, 'withdrawal', '2025-02-17 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 32, '2025-02-17 00:00:00'),
    (19, 42.0, NULL, NULL, 837.42, 'withdrawal', '2025-02-21 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 27, '2025-02-21 00:00:00'),
    (19, NULL, 11.0, 8.0, 4935.12, 'transfer', '2025-04-26 00:00:00', 'Bank Internal Transfer', FALSE, 16.0, NULL, 39, '2025-04-26 00:00:00'),
    (19, 50.0, NULL, 1.0, 2810.41, 'income', '2025-03-10 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 33, '2025-03-10 00:00:00'),
    (19, 25.0, NULL, 6.0, 3805.29, 'withdrawal', '2025-05-08 00:00:00', 'Cash Removed from Account', FALSE, 10.0, NULL, 12, '2025-05-08 00:00:00'),
    (19, 4.0, NULL, NULL, 187.41, 'withdrawal', '2025-03-30 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 17, '2025-03-30 00:00:00'),
    (19, NULL, 11.0, 7.0, 879.03, 'expense', '2025-05-30 00:00:00', 'Grocery Store Purchase', FALSE, NULL, NULL, 21, '2025-05-30 00:00:00'),
    (19, 16.0, NULL, 8.0, 2966.54, 'deposit', '2025-06-28 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 48, '2025-06-28 00:00:00'),
    (19, 16.0, NULL, NULL, 176.13, 'deposit', '2025-06-16 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 46, '2025-06-16 00:00:00'),
    (19, 33.0, NULL, NULL, 1229.44, 'fee', '2025-05-11 00:00:00', 'Service Charge', FALSE, 1.0, NULL, 13, '2025-05-11 00:00:00'),
    (19, 36.0, NULL, 5.0, 4343.47, 'fee', '2025-04-11 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 18, '2025-04-11 00:00:00'),
    (19, 4.0, NULL, NULL, 1711.73, 'income', '2025-01-17 00:00:00', 'Refund Processed', FALSE, 3.0, NULL, 49, '2025-01-17 00:00:00'),
    (19, 18.0, NULL, NULL, 3538.94, 'transfer', '2025-06-08 00:00:00', 'Transfer to Savings', TRUE, NULL, NULL, 24, '2025-06-08 00:00:00'),
    (19, NULL, 1.0, 1.0, 2676.48, 'withdrawal', '2025-05-06 00:00:00', 'Cash Removed from Account', FALSE, 5.0, 4.0, 41, '2025-05-06 00:00:00'),
    (19, 1.0, NULL, 3.0, 116.24, 'income', '2025-03-27 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 47, '2025-03-27 00:00:00'),
    (19, 32.0, NULL, 1.0, 202.59, 'deposit', '2025-06-29 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 35, '2025-06-29 00:00:00'),
    (19, NULL, 2.0, NULL, 3368.31, 'withdrawal', '2025-06-23 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 42, '2025-06-23 00:00:00'),
    (19, 27.0, NULL, NULL, 2558.68, 'withdrawal', '2025-03-08 00:00:00', 'ATM Cash Withdrawal', TRUE, NULL, NULL, 50, '2025-03-08 00:00:00'),
    (19, 45.0, NULL, NULL, 3974.68, 'transfer', '2025-03-22 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 4, '2025-03-22 00:00:00'),
    (19, 19.0, NULL, NULL, 988.68, 'expense', '2025-01-05 00:00:00', 'Public Transport Fare', FALSE, NULL, NULL, 6, '2025-01-05 00:00:00'),
    (19, 25.0, NULL, NULL, 1656.52, 'deposit', '2025-05-24 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 32, '2025-05-24 00:00:00'),
    (19, 28.0, NULL, NULL, 1732.71, 'fee', '2025-05-14 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 1, '2025-05-14 00:00:00'),
    (19, NULL, 12.0, NULL, 3148.1, 'expense', '2025-05-26 00:00:00', 'Coffee Shop', FALSE, NULL, NULL, 25, '2025-05-26 00:00:00'),
    (19, 43.0, NULL, 6.0, 1887.28, 'expense', '2025-03-31 00:00:00', 'Streaming Subscription', FALSE, 4.0, NULL, 31, '2025-03-31 00:00:00'),
    (19, 39.0, NULL, 2.0, 1938.06, 'fee', '2025-02-25 00:00:00', 'ATM Withdrawal Fee', TRUE, 10.0, NULL, 50, '2025-02-25 00:00:00'),
    (19, 45.0, NULL, 3.0, 3004.6, 'expense', '2025-05-11 00:00:00', 'Coffee Shop', FALSE, NULL, NULL, 48, '2025-05-11 00:00:00'),
    (19, 20.0, NULL, 4.0, 1526.45, 'transfer', '2025-05-10 00:00:00', 'Transfer from Checking', FALSE, 22.0, NULL, 31, '2025-05-10 00:00:00'),
    (19, 24.0, NULL, NULL, 2797.69, 'withdrawal', '2025-01-19 00:00:00', 'Cash Removed from Account', TRUE, NULL, 2.0, 12, '2025-01-19 00:00:00'),
    (19, 46.0, NULL, NULL, 1309.82, 'deposit', '2025-02-20 00:00:00', 'Cash Deposit at Branch', TRUE, NULL, NULL, 3, '2025-02-20 00:00:00'),
    (19, NULL, 3.0, 8.0, 3301.77, 'withdrawal', '2025-06-08 00:00:00', 'Cash Removed from Account', FALSE, NULL, 2.0, 23, '2025-06-08 00:00:00'),
    (19, 13.0, NULL, NULL, 948.01, 'transfer', '2025-02-05 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 26, '2025-02-05 00:00:00'),
    (19, 37.0, NULL, NULL, 898.71, 'income', '2025-06-24 00:00:00', 'Interest Income', FALSE, NULL, NULL, 6, '2025-06-24 00:00:00'),
    (19, 15.0, NULL, 1.0, 4897.26, 'deposit', '2025-06-16 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 27, '2025-06-16 00:00:00'),
    (19, NULL, 7.0, 5.0, 3784.24, 'withdrawal', '2025-04-12 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 1, '2025-04-12 00:00:00'),
    (19, 5.0, NULL, 5.0, 4608.19, 'expense', '2025-01-30 00:00:00', 'Coffee Shop', FALSE, 13.0, NULL, 49, '2025-01-30 00:00:00'),
    (19, 38.0, NULL, 2.0, 2100.09, 'deposit', '2025-05-01 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, 3.0, 23, '2025-05-01 00:00:00'),
    (19, 15.0, NULL, 7.0, 3590.63, 'transfer', '2025-01-27 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 47, '2025-01-27 00:00:00'),
    (19, 2.0, NULL, NULL, 2550.68, 'expense', '2025-06-07 00:00:00', 'Mobile Data Recharge', FALSE, NULL, NULL, 1, '2025-06-07 00:00:00'),
    (19, 31.0, NULL, 2.0, 3766.65, 'withdrawal', '2025-01-22 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 0, '2025-01-22 00:00:00'),
    (19, 43.0, NULL, NULL, 4227.67, 'deposit', '2025-06-08 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 18, '2025-06-08 00:00:00'),
    (19, NULL, 9.0, 5.0, 1072.19, 'expense', '2025-01-20 00:00:00', 'Clothing Store Purchase', FALSE, NULL, NULL, 34, '2025-01-20 00:00:00'),
    (19, 22.0, NULL, 5.0, 4413.19, 'transfer', '2025-02-17 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 7, '2025-02-17 00:00:00'),
    (19, 28.0, NULL, 4.0, 4244.6, 'income', '2025-02-23 00:00:00', 'Interest Income', FALSE, NULL, NULL, 17, '2025-02-23 00:00:00'),
    (19, NULL, 12.0, NULL, 2992.42, 'fee', '2025-03-26 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 50, '2025-03-26 00:00:00'),
    (19, 10.0, NULL, NULL, 2295.84, 'deposit', '2025-06-25 00:00:00', 'Online Deposit', FALSE, 2.0, NULL, 50, '2025-06-25 00:00:00'),
    (19, 10.0, NULL, 2.0, 4445.88, 'deposit', '2025-02-13 00:00:00', 'Cheque Deposit', FALSE, 11.0, NULL, 43, '2025-02-13 00:00:00'),
    (19, 20.0, NULL, NULL, 798.06, 'deposit', '2025-05-10 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 6, '2025-05-10 00:00:00'),
    (19, NULL, 11.0, NULL, 3188.85, 'income', '2025-05-07 00:00:00', 'Interest Income', FALSE, NULL, NULL, 26, '2025-05-07 00:00:00'),
    (19, 19.0, NULL, NULL, 260.34, 'income', '2025-06-22 00:00:00', 'Dividend Payment', FALSE, NULL, NULL, 46, '2025-06-22 00:00:00'),
    (19, NULL, 9.0, NULL, 2911.85, 'deposit', '2025-06-27 00:00:00', 'Cash Deposit at Branch', FALSE, 12.0, 5.0, 39, '2025-06-27 00:00:00'),
    (19, 16.0, NULL, NULL, 879.74, 'transfer', '2025-02-25 00:00:00', 'Transfer from Checking', TRUE, NULL, NULL, 35, '2025-02-25 00:00:00'),
    (19, 37.0, NULL, NULL, 3531.55, 'deposit', '2025-06-14 00:00:00', 'Online Deposit', FALSE, 21.0, NULL, 15, '2025-06-14 00:00:00'),
    (19, NULL, 10.0, NULL, 73.28, 'withdrawal', '2025-02-01 00:00:00', 'ATM Cash Withdrawal', TRUE, 10.0, NULL, 50, '2025-02-01 00:00:00'),
    (19, 14.0, NULL, 7.0, 2029.65, 'income', '2025-02-20 00:00:00', 'Interest Income', FALSE, NULL, NULL, 31, '2025-02-20 00:00:00'),
    (19, 17.0, NULL, 2.0, 1000.46, 'expense', '2025-05-02 00:00:00', 'Mobile Data Recharge', FALSE, 7.0, NULL, 39, '2025-05-02 00:00:00'),
    (19, NULL, 9.0, NULL, 1892.29, 'expense', '2025-04-09 00:00:00', 'Public Transport Fare', FALSE, NULL, NULL, 17, '2025-04-09 00:00:00'),
    (19, 41.0, NULL, NULL, 2989.9, 'income', '2025-02-02 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 50, '2025-02-02 00:00:00'),
    (19, NULL, 1.0, NULL, 2601.84, 'income', '2025-01-12 00:00:00', 'Bonus Received', FALSE, NULL, 1.0, 28, '2025-01-12 00:00:00'),
    (19, NULL, 6.0, NULL, 1496.29, 'transfer', '2025-02-19 00:00:00', 'Bank Internal Transfer', TRUE, NULL, NULL, 34, '2025-02-19 00:00:00'),
    (19, NULL, 8.0, NULL, 1359.78, 'deposit', '2025-06-20 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 37, '2025-06-20 00:00:00'),
    (19, 34.0, NULL, 1.0, 3810.7, 'fee', '2025-02-16 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 34, '2025-02-16 00:00:00'),
    (19, 44.0, NULL, NULL, 690.37, 'income', '2025-06-09 00:00:00', 'Dividend Payment', FALSE, 2.0, 1.0, 31, '2025-06-09 00:00:00'),
    (19, NULL, 3.0, NULL, 3591.29, 'expense', '2025-01-14 00:00:00', 'Clothing Store Purchase', FALSE, NULL, NULL, 32, '2025-01-14 00:00:00'),
    (19, NULL, 10.0, NULL, 2677.64, 'income', '2025-05-31 00:00:00', 'Salary Payment', TRUE, 12.0, NULL, 48, '2025-05-31 00:00:00'),
    (19, 46.0, NULL, 9.0, 1663.45, 'expense', '2025-01-02 00:00:00', 'Public Transport Fare', FALSE, NULL, NULL, 12, '2025-01-02 00:00:00'),
    (19, 46.0, NULL, NULL, 3834.9, 'transfer', '2025-03-09 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 47, '2025-03-09 00:00:00'),
    (19, 9.0, NULL, 7.0, 3282.82, 'expense', '2025-05-26 00:00:00', 'Fuel Station', FALSE, NULL, 3.0, 39, '2025-05-26 00:00:00'),
    (19, 28.0, NULL, 4.0, 155.59, 'fee', '2025-03-18 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 6, '2025-03-18 00:00:00'),
    (19, 12.0, NULL, 5.0, 4457.57, 'deposit', '2025-01-12 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 31, '2025-01-12 00:00:00'),
    (20, 18.0, NULL, 1.0, 3450.58, 'deposit', '2025-05-02 00:00:00', 'Online Deposit', FALSE, NULL, 1.0, 7, '2025-05-02 00:00:00'),
    (20, NULL, 13.0, 5.0, 200.39, 'fee', '2025-06-12 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 30, '2025-06-12 00:00:00'),
    (20, 31.0, NULL, NULL, 2297.35, 'deposit', '2025-01-10 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 42, '2025-01-10 00:00:00'),
    (20, 35.0, NULL, 6.0, 1315.82, 'expense', '2025-05-31 00:00:00', 'Streaming Subscription', TRUE, NULL, NULL, 41, '2025-05-31 00:00:00'),
    (20, 19.0, NULL, 1.0, 3358.01, 'income', '2025-04-28 00:00:00', 'Salary Payment', FALSE, NULL, 3.0, 27, '2025-04-28 00:00:00'),
    (20, NULL, 6.0, NULL, 1773.25, 'transfer', '2025-01-05 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 45, '2025-01-05 00:00:00'),
    (20, 18.0, NULL, NULL, 4830.93, 'transfer', '2025-03-20 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 23, '2025-03-20 00:00:00'),
    (20, 25.0, NULL, NULL, 1274.81, 'expense', '2025-06-23 00:00:00', 'Mobile Data Recharge', FALSE, NULL, NULL, 33, '2025-06-23 00:00:00'),
    (20, 51.0, NULL, 8.0, 3704.41, 'deposit', '2025-02-06 00:00:00', 'Cash Deposit at Branch', FALSE, 14.0, NULL, 23, '2025-02-06 00:00:00'),
    (20, NULL, 10.0, 2.0, 2421.44, 'fee', '2025-05-28 00:00:00', 'Monthly Account Fee', FALSE, 14.0, NULL, 11, '2025-05-28 00:00:00'),
    (20, NULL, 9.0, 4.0, 3156.07, 'deposit', '2025-05-07 00:00:00', 'Cash Deposit at Branch', TRUE, NULL, 3.0, 22, '2025-05-07 00:00:00'),
    (20, 34.0, NULL, 1.0, 3388.35, 'transfer', '2025-01-01 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 39, '2025-01-01 00:00:00'),
    (20, 4.0, NULL, NULL, 1103.74, 'deposit', '2025-02-06 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, 2.0, 41, '2025-02-06 00:00:00'),
    (20, 30.0, NULL, NULL, 2159.95, 'withdrawal', '2025-03-09 00:00:00', 'ATM Cash Withdrawal', TRUE, NULL, 1.0, 46, '2025-03-09 00:00:00'),
    (20, 8.0, NULL, NULL, 4478.57, 'withdrawal', '2025-05-17 00:00:00', 'ATM Cash Withdrawal', FALSE, 10.0, NULL, 14, '2025-05-17 00:00:00'),
    (20, 21.0, NULL, 3.0, 2122.17, 'deposit', '2025-03-09 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 10, '2025-03-09 00:00:00'),
    (20, NULL, 7.0, 8.0, 4534.57, 'fee', '2025-06-30 00:00:00', 'Service Charge', FALSE, 10.0, NULL, 46, '2025-06-30 00:00:00'),
    (20, 31.0, NULL, NULL, 3396.86, 'expense', '2025-04-03 00:00:00', 'Coffee Shop', FALSE, NULL, NULL, 26, '2025-04-03 00:00:00'),
    (20, 26.0, NULL, 5.0, 2383.89, 'expense', '2025-05-21 00:00:00', 'Monthly Rent Payment', FALSE, NULL, NULL, 39, '2025-05-21 00:00:00'),
    (20, NULL, 11.0, 7.0, 4029.68, 'transfer', '2025-06-24 00:00:00', 'Transfer from Checking', FALSE, NULL, 1.0, 45, '2025-06-24 00:00:00'),
    (20, 13.0, NULL, 8.0, 2070.21, 'transfer', '2025-03-16 00:00:00', 'Transfer from Checking', FALSE, 2.0, NULL, 24, '2025-03-16 00:00:00'),
    (20, NULL, 2.0, 2.0, 3430.97, 'fee', '2025-01-22 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, 2.0, 17, '2025-01-22 00:00:00'),
    (20, NULL, 12.0, NULL, 1548.57, 'deposit', '2025-06-13 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 6, '2025-06-13 00:00:00'),
    (20, 7.0, NULL, 6.0, 3817.44, 'expense', '2025-06-19 00:00:00', 'Fuel Station', FALSE, NULL, NULL, 32, '2025-06-19 00:00:00'),
    (20, 36.0, NULL, 2.0, 2417.7, 'expense', '2025-03-18 00:00:00', 'Public Transport Fare', FALSE, NULL, 1.0, 34, '2025-03-18 00:00:00'),
    (20, 43.0, NULL, NULL, 3933.67, 'transfer', '2025-01-07 00:00:00', 'Bank Internal Transfer', FALSE, 11.0, NULL, 40, '2025-01-07 00:00:00'),
    (20, NULL, 13.0, 3.0, 4681.22, 'deposit', '2025-01-19 00:00:00', 'Cheque Deposit', TRUE, NULL, NULL, 3, '2025-01-19 00:00:00'),
    (20, 36.0, NULL, 3.0, 4907.69, 'deposit', '2025-04-16 00:00:00', 'Cheque Deposit', FALSE, NULL, 3.0, 29, '2025-04-16 00:00:00'),
    (20, 23.0, NULL, NULL, 3931.83, 'deposit', '2025-03-07 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 8, '2025-03-07 00:00:00'),
    (20, NULL, 8.0, 9.0, 261.31, 'fee', '2025-06-16 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 42, '2025-06-16 00:00:00'),
    (20, 41.0, NULL, 8.0, 1875.29, 'withdrawal', '2025-01-17 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 20, '2025-01-17 00:00:00'),
    (20, NULL, 12.0, NULL, 1348.54, 'expense', '2025-04-29 00:00:00', 'Mobile Data Recharge', FALSE, NULL, NULL, 22, '2025-04-29 00:00:00'),
    (20, 25.0, NULL, 4.0, 4263.69, 'expense', '2025-01-06 00:00:00', 'Monthly Rent Payment', FALSE, NULL, NULL, 10, '2025-01-06 00:00:00'),
    (20, 37.0, NULL, NULL, 3446.66, 'deposit', '2025-05-02 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 35, '2025-05-02 00:00:00'),
    (20, NULL, 4.0, 4.0, 3783.43, 'withdrawal', '2025-03-08 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, 3.0, 5, '2025-03-08 00:00:00'),
    (20, NULL, 9.0, NULL, 2213.35, 'fee', '2025-02-19 00:00:00', 'Service Charge', FALSE, NULL, NULL, 16, '2025-02-19 00:00:00'),
    (20, 15.0, NULL, 9.0, 459.83, 'income', '2025-05-07 00:00:00', 'Dividend Payment', FALSE, 7.0, NULL, 11, '2025-05-07 00:00:00'),
    (20, 41.0, NULL, 4.0, 1491.41, 'deposit', '2025-02-08 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 15, '2025-02-08 00:00:00'),
    (20, 47.0, NULL, NULL, 2283.03, 'deposit', '2025-04-12 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 36, '2025-04-12 00:00:00'),
    (20, NULL, 13.0, 3.0, 4194.42, 'expense', '2025-03-02 00:00:00', 'Clothing Store Purchase', FALSE, NULL, NULL, 42, '2025-03-02 00:00:00'),
    (20, 1.0, NULL, 3.0, 2052.42, 'income', '2025-01-10 00:00:00', 'Bonus Received', TRUE, 6.0, NULL, 43, '2025-01-10 00:00:00'),
    (20, NULL, 4.0, NULL, 2004.47, 'withdrawal', '2025-04-15 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 5, '2025-04-15 00:00:00'),
    (20, 44.0, NULL, NULL, 1364.01, 'income', '2025-03-02 00:00:00', 'Dividend Payment', FALSE, 18.0, NULL, 32, '2025-03-02 00:00:00'),
    (20, NULL, 8.0, NULL, 382.38, 'transfer', '2025-02-17 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 44, '2025-02-17 00:00:00'),
    (20, NULL, 10.0, NULL, 4324.53, 'income', '2025-06-27 00:00:00', 'Refund Processed', FALSE, 6.0, 1.0, 41, '2025-06-27 00:00:00'),
    (20, 35.0, NULL, 9.0, 1551.0, 'transfer', '2025-02-16 00:00:00', 'Transfer to Savings', FALSE, NULL, 4.0, 9, '2025-02-16 00:00:00'),
    (20, 20.0, NULL, 6.0, 1920.68, 'transfer', '2025-02-12 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 45, '2025-02-12 00:00:00'),
    (21, NULL, 6.0, NULL, 2876.01, 'expense', '2025-02-15 00:00:00', 'Coffee Shop', FALSE, NULL, 3.0, 7, '2025-02-15 00:00:00'),
    (21, NULL, 11.0, 9.0, 4085.5, 'expense', '2025-04-14 00:00:00', 'Utility Bill Payment', FALSE, NULL, 5.0, 23, '2025-04-14 00:00:00'),
    (21, 8.0, NULL, 7.0, 843.66, 'deposit', '2025-01-04 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 25, '2025-01-04 00:00:00'),
    (21, NULL, 1.0, NULL, 455.48, 'transfer', '2025-04-21 00:00:00', 'Transfer to Savings', FALSE, NULL, 2.0, 5, '2025-04-21 00:00:00'),
    (21, 51.0, NULL, NULL, 1464.53, 'deposit', '2025-01-08 00:00:00', 'Online Deposit', FALSE, 15.0, 2.0, 20, '2025-01-08 00:00:00'),
    (21, 11.0, NULL, 5.0, 1531.11, 'withdrawal', '2025-04-29 00:00:00', 'Cash Removed from Account', FALSE, NULL, 4.0, 46, '2025-04-29 00:00:00'),
    (21, 37.0, NULL, 1.0, 4610.65, 'fee', '2025-02-03 00:00:00', 'ATM Withdrawal Fee', TRUE, 2.0, 2.0, 49, '2025-02-03 00:00:00'),
    (21, 30.0, NULL, 5.0, 4259.02, 'transfer', '2025-06-06 00:00:00', 'Bank Internal Transfer', FALSE, NULL, 5.0, 50, '2025-06-06 00:00:00'),
    (21, NULL, 12.0, NULL, 393.45, 'income', '2025-04-05 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 8, '2025-04-05 00:00:00'),
    (21, 24.0, NULL, NULL, 2107.03, 'withdrawal', '2025-01-30 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 45, '2025-01-30 00:00:00'),
    (21, 43.0, NULL, NULL, 4450.66, 'withdrawal', '2025-03-07 00:00:00', 'Cash Removed from Account', FALSE, 10.0, NULL, 41, '2025-03-07 00:00:00'),
    (21, NULL, 2.0, 3.0, 641.76, 'income', '2025-06-25 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 4, '2025-06-25 00:00:00'),
    (21, 33.0, NULL, 4.0, 1826.92, 'fee', '2025-05-21 00:00:00', 'Monthly Account Fee', FALSE, 15.0, NULL, 20, '2025-05-21 00:00:00'),
    (21, 23.0, NULL, NULL, 2186.56, 'income', '2025-01-22 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 45, '2025-01-22 00:00:00'),
    (21, NULL, 3.0, 1.0, 4290.47, 'expense', '2025-01-25 00:00:00', 'Restaurant Dinner', FALSE, NULL, 4.0, 25, '2025-01-25 00:00:00'),
    (21, NULL, 8.0, 2.0, 2033.55, 'income', '2025-06-29 00:00:00', 'Freelance Project Payment', FALSE, 22.0, NULL, 20, '2025-06-29 00:00:00'),
    (21, 45.0, NULL, NULL, 4923.47, 'income', '2025-01-26 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 7, '2025-01-26 00:00:00'),
    (21, 25.0, NULL, NULL, 3224.31, 'deposit', '2025-04-30 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 42, '2025-04-30 00:00:00'),
    (21, 49.0, NULL, NULL, 3155.19, 'expense', '2025-04-30 00:00:00', 'Monthly Rent Payment', FALSE, 12.0, NULL, 2, '2025-04-30 00:00:00'),
    (21, NULL, 7.0, 9.0, 1122.89, 'deposit', '2025-03-17 00:00:00', 'Cheque Deposit', FALSE, 8.0, NULL, 34, '2025-03-17 00:00:00'),
    (21, 43.0, NULL, NULL, 2984.9, 'withdrawal', '2025-01-07 00:00:00', 'Cash Removed from Account', FALSE, NULL, 2.0, 7, '2025-01-07 00:00:00'),
    (21, 9.0, NULL, 3.0, 4227.22, 'income', '2025-06-28 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 10, '2025-06-28 00:00:00'),
    (21, 24.0, NULL, NULL, 4037.83, 'expense', '2025-01-06 00:00:00', 'Coffee Shop', FALSE, NULL, NULL, 43, '2025-01-06 00:00:00'),
    (21, NULL, 9.0, NULL, 2340.83, 'deposit', '2025-03-04 00:00:00', 'Online Deposit', FALSE, 5.0, NULL, 28, '2025-03-04 00:00:00'),
    (21, 29.0, NULL, 1.0, 2010.7, 'transfer', '2025-03-14 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 49, '2025-03-14 00:00:00'),
    (21, 26.0, NULL, NULL, 3321.36, 'withdrawal', '2025-05-22 00:00:00', 'ATM Cash Withdrawal', FALSE, 17.0, NULL, 5, '2025-05-22 00:00:00'),
    (21, 14.0, NULL, NULL, 3688.99, 'transfer', '2025-06-30 00:00:00', 'Transfer to Savings', FALSE, NULL, 3.0, 25, '2025-06-30 00:00:00'),
    (21, 46.0, NULL, 5.0, 3015.12, 'transfer', '2025-02-23 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 50, '2025-02-23 00:00:00'),
    (21, 30.0, NULL, 3.0, 4569.01, 'income', '2025-03-15 00:00:00', 'Salary Payment', FALSE, 12.0, NULL, 26, '2025-03-15 00:00:00'),
    (21, NULL, 1.0, NULL, 1851.38, 'transfer', '2025-03-21 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 19, '2025-03-21 00:00:00'),
    (22, NULL, 11.0, 4.0, 4587.2, 'expense', '2025-06-29 00:00:00', 'Clothing Store Purchase', FALSE, 23.0, NULL, 2, '2025-06-29 00:00:00'),
    (22, 39.0, NULL, 8.0, 1411.66, 'deposit', '2025-05-02 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 4, '2025-05-02 00:00:00'),
    (22, 43.0, NULL, NULL, 3068.94, 'expense', '2025-06-03 00:00:00', 'Restaurant Dinner', TRUE, 3.0, NULL, 12, '2025-06-03 00:00:00'),
    (22, 2.0, NULL, NULL, 4735.64, 'income', '2025-03-17 00:00:00', 'Dividend Payment', FALSE, NULL, NULL, 23, '2025-03-17 00:00:00'),
    (22, NULL, 7.0, NULL, 471.86, 'income', '2025-05-16 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 47, '2025-05-16 00:00:00'),
    (22, 10.0, NULL, 1.0, 2052.97, 'withdrawal', '2025-02-28 00:00:00', 'Cash Removed from Account', FALSE, 1.0, 5.0, 30, '2025-02-28 00:00:00'),
    (22, 13.0, NULL, 8.0, 3041.94, 'expense', '2025-01-13 00:00:00', 'Streaming Subscription', FALSE, NULL, 2.0, 22, '2025-01-13 00:00:00'),
    (22, 21.0, NULL, NULL, 4372.56, 'expense', '2025-05-30 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 14, '2025-05-30 00:00:00'),
    (22, 18.0, NULL, NULL, 3453.61, 'deposit', '2025-02-07 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 1, '2025-02-07 00:00:00'),
    (22, NULL, 11.0, 2.0, 4776.55, 'deposit', '2025-03-26 00:00:00', 'Cheque Deposit', FALSE, 21.0, 1.0, 48, '2025-03-26 00:00:00'),
    (22, 16.0, NULL, 5.0, 4459.2, 'fee', '2025-04-16 00:00:00', 'ATM Withdrawal Fee', TRUE, NULL, NULL, 45, '2025-04-16 00:00:00'),
    (22, NULL, 1.0, NULL, 822.83, 'withdrawal', '2025-01-04 00:00:00', 'Cash Removed from Account', FALSE, 6.0, 3.0, 45, '2025-01-04 00:00:00'),
    (22, NULL, 12.0, 6.0, 300.98, 'withdrawal', '2025-05-05 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 20, '2025-05-05 00:00:00'),
    (22, NULL, 2.0, NULL, 3945.36, 'income', '2025-06-26 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 44, '2025-06-26 00:00:00'),
    (22, 41.0, NULL, 7.0, 1529.84, 'deposit', '2025-03-28 00:00:00', 'Cheque Deposit', FALSE, 6.0, NULL, 33, '2025-03-28 00:00:00'),
    (22, NULL, 1.0, NULL, 1278.56, 'expense', '2025-06-18 00:00:00', 'Public Transport Fare', FALSE, 15.0, NULL, 50, '2025-06-18 00:00:00'),
    (22, 13.0, NULL, NULL, 426.07, 'transfer', '2025-06-25 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 47, '2025-06-25 00:00:00'),
    (22, 32.0, NULL, 3.0, 3856.02, 'deposit', '2025-04-28 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 16, '2025-04-28 00:00:00'),
    (22, 34.0, NULL, 4.0, 245.1, 'withdrawal', '2025-05-02 00:00:00', 'ATM Cash Withdrawal', FALSE, 13.0, NULL, 3, '2025-05-02 00:00:00'),
    (22, 23.0, NULL, 7.0, 4624.11, 'income', '2025-03-17 00:00:00', 'Dividend Payment', FALSE, 19.0, NULL, 5, '2025-03-17 00:00:00'),
    (22, 15.0, NULL, 2.0, 4407.98, 'withdrawal', '2025-02-11 00:00:00', 'Cash Removed from Account', FALSE, NULL, 4.0, 28, '2025-02-11 00:00:00'),
    (22, 36.0, NULL, 9.0, 798.66, 'income', '2025-02-01 00:00:00', 'Bonus Received', FALSE, NULL, 2.0, 24, '2025-02-01 00:00:00'),
    (22, 41.0, NULL, 2.0, 3164.67, 'expense', '2025-05-02 00:00:00', 'Monthly Rent Payment', FALSE, 18.0, NULL, 19, '2025-05-02 00:00:00'),
    (22, NULL, 4.0, 4.0, 3227.56, 'fee', '2025-02-02 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 42, '2025-02-02 00:00:00'),
    (22, 26.0, NULL, 3.0, 1917.3, 'deposit', '2025-04-30 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 4, '2025-04-30 00:00:00'),
    (22, 23.0, NULL, 6.0, 818.54, 'expense', '2025-01-14 00:00:00', 'Clothing Store Purchase', FALSE, NULL, NULL, 49, '2025-01-14 00:00:00'),
    (22, 18.0, NULL, NULL, 1331.93, 'expense', '2025-02-28 00:00:00', 'Clothing Store Purchase', FALSE, NULL, 3.0, 45, '2025-02-28 00:00:00'),
    (22, 38.0, NULL, NULL, 222.36, 'income', '2025-03-05 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 32, '2025-03-05 00:00:00'),
    (22, NULL, 1.0, NULL, 1278.56, 'expense', '2025-06-18 00:00:00', 'Public Transport Fare', FALSE, 15.0, NULL, 50, '2025-06-18 00:00:00'),
    (22, 27.0, NULL, NULL, 335.99, 'deposit', '2025-04-30 00:00:00', 'Online Deposit', TRUE, 5.0, NULL, 7, '2025-04-30 00:00:00'),
    (22, 7.0, NULL, NULL, 4883.16, 'deposit', '2025-05-31 00:00:00', 'Cheque Deposit', FALSE, 13.0, NULL, 25, '2025-05-31 00:00:00'),
    (22, 14.0, NULL, NULL, 257.29, 'fee', '2025-03-10 00:00:00', 'Monthly Account Fee', FALSE, 19.0, NULL, 9, '2025-03-10 00:00:00'),
    (22, 20.0, NULL, NULL, 2383.07, 'expense', '2025-06-11 00:00:00', 'Grocery Store Purchase', FALSE, NULL, NULL, 19, '2025-06-11 00:00:00'),
    (22, 33.0, NULL, NULL, 795.03, 'fee', '2025-03-29 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 13, '2025-03-29 00:00:00'),
    (22, 51.0, NULL, NULL, 106.07, 'fee', '2025-05-16 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 8, '2025-05-16 00:00:00'),
    (22, 23.0, NULL, 2.0, 4024.47, 'expense', '2025-01-18 00:00:00', 'Mobile Data Recharge', FALSE, 10.0, NULL, 38, '2025-01-18 00:00:00'),
    (22, NULL, 3.0, NULL, 4113.73, 'deposit', '2025-03-17 00:00:00', 'Cash Deposit at Branch', TRUE, 19.0, NULL, 44, '2025-03-17 00:00:00'),
    (22, 8.0, NULL, NULL, 3136.85, 'income', '2025-01-26 00:00:00', 'Interest Income', FALSE, NULL, NULL, 37, '2025-01-26 00:00:00'),
    (22, 30.0, NULL, NULL, 2496.63, 'fee', '2025-02-01 00:00:00', 'Service Charge', FALSE, 15.0, NULL, 29, '2025-02-01 00:00:00'),
    (22, 7.0, NULL, 9.0, 3427.98, 'income', '2025-04-11 00:00:00', 'Interest Income', FALSE, NULL, 4.0, 34, '2025-04-11 00:00:00'),
    (22, 37.0, NULL, 1.0, 575.56, 'withdrawal', '2025-01-27 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 5, '2025-01-27 00:00:00'),
    (22, NULL, 2.0, 3.0, 4096.86, 'expense', '2025-05-14 00:00:00', 'Grocery Store Purchase', FALSE, NULL, 3.0, 23, '2025-05-14 00:00:00'),
    (22, 30.0, NULL, NULL, 1980.78, 'transfer', '2025-01-25 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 31, '2025-01-25 00:00:00'),
    (22, 48.0, NULL, NULL, 3684.36, 'withdrawal', '2025-06-20 00:00:00', 'ATM Cash Withdrawal', FALSE, 15.0, NULL, 12, '2025-06-20 00:00:00'),
    (22, 16.0, NULL, NULL, 2045.03, 'fee', '2025-01-14 00:00:00', 'Service Charge', TRUE, 5.0, NULL, 35, '2025-01-14 00:00:00'),
    (22, 22.0, NULL, 6.0, 1428.3, 'transfer', '2025-03-30 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 33, '2025-03-30 00:00:00'),
    (22, 12.0, NULL, 9.0, 2989.85, 'expense', '2025-01-17 00:00:00', 'Mobile Data Recharge', FALSE, NULL, 5.0, 13, '2025-01-17 00:00:00'),
    (22, NULL, 10.0, 5.0, 2975.09, 'deposit', '2025-05-01 00:00:00', 'Cheque Deposit', FALSE, 9.0, 4.0, 50, '2025-05-01 00:00:00'),
    (22, NULL, 10.0, NULL, 3559.34, 'expense', '2025-03-27 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 22, '2025-03-27 00:00:00'),
    (22, 24.0, NULL, NULL, 2761.38, 'deposit', '2025-05-25 00:00:00', 'Cheque Deposit', TRUE, NULL, NULL, 12, '2025-05-25 00:00:00'),
    (22, 22.0, NULL, 8.0, 3216.19, 'deposit', '2025-04-08 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 4, '2025-04-08 00:00:00'),
    (22, NULL, 5.0, 3.0, 3910.14, 'deposit', '2025-02-05 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 18, '2025-02-05 00:00:00'),
    (22, 44.0, NULL, 7.0, 292.18, 'income', '2025-01-26 00:00:00', 'Salary Payment', FALSE, 10.0, NULL, 38, '2025-01-26 00:00:00'),
    (22, 41.0, NULL, NULL, 4366.2, 'income', '2025-05-23 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 28, '2025-05-23 00:00:00'),
    (22, 34.0, NULL, 3.0, 1379.74, 'income', '2025-05-24 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 39, '2025-05-24 00:00:00'),
    (22, 6.0, NULL, NULL, 4755.91, 'withdrawal', '2025-03-25 00:00:00', 'ATM Cash Withdrawal', FALSE, 12.0, NULL, 27, '2025-03-25 00:00:00'),
    (22, 22.0, NULL, 1.0, 3216.41, 'income', '2025-02-15 00:00:00', 'Dividend Payment', FALSE, 4.0, 3.0, 19, '2025-02-15 00:00:00'),
    (22, NULL, 1.0, NULL, 4655.16, 'withdrawal', '2025-06-17 00:00:00', 'Cash Removed from Account', FALSE, 1.0, NULL, 28, '2025-06-17 00:00:00'),
    (22, 5.0, NULL, NULL, 4237.08, 'income', '2025-06-27 00:00:00', 'Bonus Received', TRUE, NULL, NULL, 5, '2025-06-27 00:00:00'),
    (22, 42.0, NULL, 2.0, 2681.05, 'income', '2025-02-08 00:00:00', 'Freelance Project Payment', FALSE, NULL, 1.0, 9, '2025-02-08 00:00:00'),
    (22, NULL, 11.0, 3.0, 1599.56, 'transfer', '2025-03-13 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 24, '2025-03-13 00:00:00'),
    (22, 2.0, NULL, NULL, 4466.84, 'deposit', '2025-04-07 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 32, '2025-04-07 00:00:00'),
    (22, NULL, 11.0, NULL, 999.65, 'fee', '2025-02-12 00:00:00', 'Monthly Account Fee', FALSE, 9.0, NULL, 26, '2025-02-12 00:00:00'),
    (23, NULL, 7.0, 7.0, 4464.54, 'transfer', '2025-03-24 00:00:00', 'Transfer to Savings', TRUE, NULL, NULL, 0, '2025-03-24 00:00:00'),
    (23, 14.0, NULL, 6.0, 3603.67, 'transfer', '2025-06-15 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 12, '2025-06-15 00:00:00'),
    (23, 30.0, NULL, NULL, 4868.82, 'transfer', '2025-04-11 00:00:00', 'Bank Internal Transfer', FALSE, 10.0, NULL, 36, '2025-04-11 00:00:00'),
    (23, 29.0, NULL, NULL, 4637.32, 'fee', '2025-03-28 00:00:00', 'Monthly Account Fee', FALSE, 20.0, NULL, 45, '2025-03-28 00:00:00'),
    (23, 50.0, NULL, NULL, 2965.87, 'fee', '2025-01-04 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 7, '2025-01-04 00:00:00'),
    (23, 6.0, NULL, 5.0, 668.81, 'deposit', '2025-06-22 00:00:00', 'Online Deposit', FALSE, 10.0, 5.0, 2, '2025-06-22 00:00:00'),
    (23, 21.0, NULL, NULL, 4218.19, 'deposit', '2025-01-05 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 6, '2025-01-05 00:00:00'),
    (23, NULL, 13.0, NULL, 4281.1, 'deposit', '2025-03-26 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 21, '2025-03-26 00:00:00'),
    (23, NULL, 9.0, 7.0, 2645.69, 'income', '2025-01-01 00:00:00', 'Interest Income', FALSE, 11.0, 1.0, 47, '2025-01-01 00:00:00'),
    (23, 45.0, NULL, 1.0, 472.83, 'fee', '2025-04-19 00:00:00', 'ATM Withdrawal Fee', FALSE, 4.0, NULL, 17, '2025-04-19 00:00:00'),
    (23, 33.0, NULL, NULL, 499.59, 'deposit', '2025-06-14 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 34, '2025-06-14 00:00:00'),
    (23, NULL, 11.0, NULL, 3751.45, 'deposit', '2025-04-13 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 17, '2025-04-13 00:00:00'),
    (23, 9.0, NULL, NULL, 3398.97, 'deposit', '2025-06-02 00:00:00', 'Cheque Deposit', FALSE, NULL, 3.0, 47, '2025-06-02 00:00:00'),
    (23, 41.0, NULL, 2.0, 515.16, 'withdrawal', '2025-05-12 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 33, '2025-05-12 00:00:00'),
    (23, NULL, 4.0, NULL, 4029.92, 'deposit', '2025-06-06 00:00:00', 'Cheque Deposit', FALSE, NULL, 5.0, 48, '2025-06-06 00:00:00'),
    (23, 4.0, NULL, 8.0, 3894.23, 'income', '2025-06-21 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 1, '2025-06-21 00:00:00'),
    (23, 45.0, NULL, 4.0, 1837.37, 'expense', '2025-06-16 00:00:00', 'Streaming Subscription', FALSE, 12.0, NULL, 3, '2025-06-16 00:00:00'),
    (23, 17.0, NULL, NULL, 47.68, 'withdrawal', '2025-01-22 00:00:00', 'Cash Removed from Account', FALSE, 16.0, 1.0, 27, '2025-01-22 00:00:00'),
    (23, NULL, 12.0, 3.0, 4401.23, 'income', '2025-01-03 00:00:00', 'Interest Income', FALSE, NULL, 4.0, 39, '2025-01-03 00:00:00'),
    (23, 48.0, NULL, NULL, 4738.61, 'transfer', '2025-03-30 00:00:00', 'Transfer from Checking', FALSE, 11.0, NULL, 49, '2025-03-30 00:00:00'),
    (23, 29.0, NULL, 5.0, 4323.8, 'transfer', '2025-03-02 00:00:00', 'Transfer to Savings', FALSE, NULL, 4.0, 30, '2025-03-02 00:00:00'),
    (23, NULL, 11.0, 3.0, 4632.82, 'deposit', '2025-01-08 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 4, '2025-01-08 00:00:00'),
    (23, 29.0, NULL, NULL, 4739.93, 'income', '2025-06-03 00:00:00', 'Interest Income', FALSE, 22.0, NULL, 21, '2025-06-03 00:00:00'),
    (23, 23.0, NULL, NULL, 3524.31, 'withdrawal', '2025-01-01 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 30, '2025-01-01 00:00:00'),
    (23, NULL, 4.0, 2.0, 2441.21, 'fee', '2025-02-26 00:00:00', 'Service Charge', FALSE, NULL, NULL, 34, '2025-02-26 00:00:00'),
    (23, NULL, 12.0, NULL, 1303.85, 'withdrawal', '2025-05-27 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 9, '2025-05-27 00:00:00'),
    (23, NULL, 4.0, 4.0, 2029.46, 'income', '2025-02-05 00:00:00', 'Interest Income', FALSE, NULL, NULL, 39, '2025-02-05 00:00:00'),
    (23, 13.0, NULL, NULL, 4888.62, 'transfer', '2025-06-22 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 13, '2025-06-22 00:00:00'),
    (23, 33.0, NULL, 3.0, 4771.81, 'fee', '2025-01-27 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 30, '2025-01-27 00:00:00'),
    (23, 47.0, NULL, 8.0, 2195.66, 'deposit', '2025-01-18 00:00:00', 'Cash Deposit at Branch', FALSE, 19.0, NULL, 23, '2025-01-18 00:00:00'),
    (23, NULL, 3.0, NULL, 4816.65, 'income', '2025-06-06 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 25, '2025-06-06 00:00:00'),
    (23, 47.0, NULL, 2.0, 1439.01, 'deposit', '2025-03-22 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 20, '2025-03-22 00:00:00'),
    (23, 32.0, NULL, NULL, 768.53, 'income', '2025-04-22 00:00:00', 'Dividend Payment', FALSE, NULL, 2.0, 23, '2025-04-22 00:00:00'),
    (23, 41.0, NULL, 5.0, 2375.8, 'withdrawal', '2025-06-30 00:00:00', 'Cash Removed from Account', FALSE, 22.0, NULL, 18, '2025-06-30 00:00:00'),
    (23, NULL, 7.0, 9.0, 2514.49, 'withdrawal', '2025-05-05 00:00:00', 'Cash Removed from Account', FALSE, 20.0, NULL, 30, '2025-05-05 00:00:00'),
    (23, 3.0, NULL, NULL, 1952.19, 'fee', '2025-04-24 00:00:00', 'Monthly Account Fee', TRUE, NULL, NULL, 49, '2025-04-24 00:00:00'),
    (23, 48.0, NULL, 6.0, 500.41, 'expense', '2025-04-11 00:00:00', 'Coffee Shop', FALSE, 22.0, NULL, 6, '2025-04-11 00:00:00'),
    (23, 45.0, NULL, 5.0, 336.5, 'deposit', '2025-05-17 00:00:00', 'Online Deposit', TRUE, 13.0, NULL, 14, '2025-05-17 00:00:00'),
    (23, 4.0, NULL, NULL, 4154.47, 'income', '2025-06-02 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 31, '2025-06-02 00:00:00'),
    (23, 34.0, NULL, NULL, 3834.19, 'transfer', '2025-03-08 00:00:00', 'Transfer to Savings', TRUE, 22.0, NULL, 24, '2025-03-08 00:00:00'),
    (23, 24.0, NULL, 1.0, 4013.05, 'withdrawal', '2025-06-27 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 22, '2025-06-27 00:00:00'),
    (23, NULL, 3.0, 9.0, 4382.33, 'deposit', '2025-05-18 00:00:00', 'Cash Deposit at Branch', FALSE, 21.0, NULL, 15, '2025-05-18 00:00:00'),
    (23, 15.0, NULL, 3.0, 2087.49, 'expense', '2025-03-20 00:00:00', 'Fuel Station', FALSE, NULL, NULL, 39, '2025-03-20 00:00:00'),
    (23, 44.0, NULL, NULL, 1563.61, 'fee', '2025-03-09 00:00:00', 'Service Charge', FALSE, NULL, NULL, 3, '2025-03-09 00:00:00'),
    (24, NULL, 10.0, NULL, 728.74, 'income', '2025-04-13 00:00:00', 'Dividend Payment', FALSE, NULL, NULL, 28, '2025-04-13 00:00:00'),
    (24, 19.0, NULL, NULL, 1208.91, 'fee', '2025-06-22 00:00:00', 'Service Charge', FALSE, NULL, NULL, 49, '2025-06-22 00:00:00'),
    (24, NULL, 11.0, 4.0, 3654.69, 'expense', '2025-02-07 00:00:00', 'Fuel Station', FALSE, NULL, NULL, 38, '2025-02-07 00:00:00'),
    (24, 43.0, NULL, 4.0, 2945.39, 'income', '2025-06-07 00:00:00', 'Dividend Payment', TRUE, 7.0, NULL, 4, '2025-06-07 00:00:00'),
    (24, 10.0, NULL, NULL, 1915.04, 'fee', '2025-06-21 00:00:00', 'Service Charge', FALSE, NULL, NULL, 22, '2025-06-21 00:00:00'),
    (24, 40.0, NULL, 3.0, 2998.44, 'income', '2025-02-28 00:00:00', 'Interest Income', FALSE, NULL, NULL, 11, '2025-02-28 00:00:00'),
    (24, NULL, 8.0, 3.0, 3261.22, 'deposit', '2025-06-03 00:00:00', 'Online Deposit', FALSE, 2.0, NULL, 7, '2025-06-03 00:00:00'),
    (24, 31.0, NULL, NULL, 2743.89, 'expense', '2025-03-14 00:00:00', 'Coffee Shop', FALSE, NULL, 5.0, 33, '2025-03-14 00:00:00'),
    (24, 26.0, NULL, NULL, 2774.57, 'transfer', '2025-02-24 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 28, '2025-02-24 00:00:00'),
    (24, NULL, 11.0, 7.0, 2628.96, 'income', '2025-01-31 00:00:00', 'Salary Payment', TRUE, NULL, 1.0, 29, '2025-01-31 00:00:00'),
    (24, 9.0, NULL, NULL, 3165.05, 'withdrawal', '2025-01-13 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 21, '2025-01-13 00:00:00'),
    (24, NULL, 10.0, NULL, 4964.86, 'income', '2025-01-31 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 14, '2025-01-31 00:00:00'),
    (24, 14.0, NULL, 9.0, 1898.44, 'transfer', '2025-02-05 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 24, '2025-02-05 00:00:00'),
    (24, NULL, 11.0, 6.0, 4619.59, 'deposit', '2025-04-04 00:00:00', 'Cash Deposit at Branch', FALSE, 22.0, NULL, 23, '2025-04-04 00:00:00'),
    (24, 30.0, NULL, NULL, 3485.64, 'expense', '2025-01-15 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 23, '2025-01-15 00:00:00'),
    (24, 22.0, NULL, NULL, 2746.94, 'fee', '2025-06-20 00:00:00', 'Service Charge', FALSE, NULL, NULL, 10, '2025-06-20 00:00:00'),
    (24, 31.0, NULL, NULL, 4289.95, 'income', '2025-01-05 00:00:00', 'Interest Income', FALSE, NULL, NULL, 22, '2025-01-05 00:00:00'),
    (24, 13.0, NULL, NULL, 3063.62, 'deposit', '2025-06-25 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 35, '2025-06-25 00:00:00'),
    (24, 13.0, NULL, NULL, 4009.08, 'transfer', '2025-03-25 00:00:00', 'Bank Internal Transfer', FALSE, 17.0, 4.0, 22, '2025-03-25 00:00:00'),
    (24, 47.0, NULL, 8.0, 2892.5, 'fee', '2025-02-05 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 49, '2025-02-05 00:00:00'),
    (24, 10.0, NULL, 1.0, 1129.91, 'withdrawal', '2025-03-22 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 10, '2025-03-22 00:00:00'),
    (24, NULL, 5.0, NULL, 3832.05, 'withdrawal', '2025-06-23 00:00:00', 'ATM Cash Withdrawal', FALSE, 10.0, 1.0, 31, '2025-06-23 00:00:00'),
    (24, 25.0, NULL, NULL, 33.26, 'fee', '2025-04-19 00:00:00', 'Monthly Account Fee', FALSE, NULL, 1.0, 20, '2025-04-19 00:00:00'),
    (24, 48.0, NULL, 7.0, 3446.6, 'expense', '2025-04-28 00:00:00', 'Monthly Rent Payment', FALSE, NULL, NULL, 4, '2025-04-28 00:00:00'),
    (24, 43.0, NULL, NULL, 660.25, 'withdrawal', '2025-06-12 00:00:00', 'ATM Cash Withdrawal', FALSE, 4.0, NULL, 5, '2025-06-12 00:00:00'),
    (24, 23.0, NULL, 4.0, 3766.09, 'expense', '2025-01-22 00:00:00', 'Grocery Store Purchase', FALSE, NULL, 3.0, 15, '2025-01-22 00:00:00'),
    (24, 14.0, NULL, 2.0, 1939.17, 'deposit', '2025-01-16 00:00:00', 'Online Deposit', FALSE, NULL, 2.0, 27, '2025-01-16 00:00:00'),
    (24, 46.0, NULL, 4.0, 2325.48, 'deposit', '2025-03-23 00:00:00', 'Online Deposit', FALSE, 16.0, NULL, 12, '2025-03-23 00:00:00'),
    (24, NULL, 1.0, NULL, 2211.25, 'deposit', '2025-01-21 00:00:00', 'Cheque Deposit', FALSE, 16.0, NULL, 31, '2025-01-21 00:00:00'),
    (24, 50.0, NULL, 6.0, 4174.69, 'deposit', '2025-04-30 00:00:00', 'Online Deposit', FALSE, NULL, 5.0, 16, '2025-04-30 00:00:00'),
    (24, 35.0, NULL, 1.0, 2786.85, 'transfer', '2025-03-31 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 39, '2025-03-31 00:00:00'),
    (24, NULL, 1.0, NULL, 3781.8, 'deposit', '2025-02-08 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 2, '2025-02-08 00:00:00'),
    (24, 49.0, NULL, NULL, 4145.01, 'income', '2025-01-20 00:00:00', 'Refund Processed', TRUE, NULL, NULL, 8, '2025-01-20 00:00:00'),
    (24, 6.0, NULL, 6.0, 3247.83, 'transfer', '2025-01-18 00:00:00', 'Transfer from Checking', FALSE, NULL, 4.0, 17, '2025-01-18 00:00:00'),
    (24, 48.0, NULL, 6.0, 850.97, 'withdrawal', '2025-03-09 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 5, '2025-03-09 00:00:00'),
    (24, 21.0, NULL, NULL, 2035.19, 'withdrawal', '2025-01-22 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 47, '2025-01-22 00:00:00'),
    (24, NULL, 1.0, NULL, 2553.47, 'withdrawal', '2025-03-04 00:00:00', 'Cash Removed from Account', FALSE, 22.0, NULL, 2, '2025-03-04 00:00:00'),
    (24, 1.0, NULL, 4.0, 4142.73, 'fee', '2025-04-21 00:00:00', 'ATM Withdrawal Fee', FALSE, 12.0, NULL, 30, '2025-04-21 00:00:00'),
    (24, 25.0, NULL, NULL, 4983.92, 'withdrawal', '2025-06-20 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, 3.0, 22, '2025-06-20 00:00:00'),
    (24, 45.0, NULL, NULL, 2267.4, 'income', '2025-03-31 00:00:00', 'Salary Payment', FALSE, 12.0, NULL, 29, '2025-03-31 00:00:00'),
    (24, 19.0, NULL, NULL, 763.84, 'fee', '2025-04-06 00:00:00', 'ATM Withdrawal Fee', FALSE, 4.0, NULL, 39, '2025-04-06 00:00:00'),
    (24, 42.0, NULL, NULL, 958.92, 'expense', '2025-06-21 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 15, '2025-06-21 00:00:00'),
    (24, NULL, 2.0, 3.0, 3993.49, 'fee', '2025-06-02 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 11, '2025-06-02 00:00:00'),
    (24, 12.0, NULL, 9.0, 1425.47, 'expense', '2025-04-25 00:00:00', 'Clothing Store Purchase', FALSE, 7.0, NULL, 13, '2025-04-25 00:00:00'),
    (24, 37.0, NULL, 2.0, 4858.92, 'income', '2025-04-04 00:00:00', 'Interest Income', FALSE, NULL, NULL, 0, '2025-04-04 00:00:00'),
    (24, 29.0, NULL, 8.0, 706.01, 'income', '2025-04-11 00:00:00', 'Freelance Project Payment', FALSE, 9.0, NULL, 20, '2025-04-11 00:00:00'),
    (24, 41.0, NULL, 5.0, 2278.62, 'expense', '2025-05-18 00:00:00', 'Coffee Shop', FALSE, NULL, NULL, 3, '2025-05-18 00:00:00'),
    (24, NULL, 12.0, NULL, 2518.5, 'withdrawal', '2025-04-09 00:00:00', 'Cash Removed from Account', TRUE, NULL, NULL, 10, '2025-04-09 00:00:00'),
    (24, 39.0, NULL, 5.0, 1606.4, 'transfer', '2025-06-10 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 41, '2025-06-10 00:00:00'),
    (24, 37.0, NULL, NULL, 177.1, 'fee', '2025-05-11 00:00:00', 'Monthly Account Fee', FALSE, 11.0, NULL, 34, '2025-05-11 00:00:00'),
    (24, NULL, 9.0, 4.0, 4647.96, 'transfer', '2025-02-18 00:00:00', 'Bank Internal Transfer', FALSE, 16.0, NULL, 8, '2025-02-18 00:00:00'),
    (24, 1.0, NULL, NULL, 1864.84, 'transfer', '2025-02-26 00:00:00', 'Transfer from Checking', FALSE, 21.0, NULL, 5, '2025-02-26 00:00:00'),
    (24, 29.0, NULL, 4.0, 3184.15, 'transfer', '2025-05-29 00:00:00', 'Transfer from Checking', FALSE, 14.0, NULL, 44, '2025-05-29 00:00:00'),
    (24, NULL, 4.0, 6.0, 3283.76, 'deposit', '2024-06-08 00:00:00', 'Cheque Deposit', FALSE, 3.0, NULL, 39, '2024-06-08 00:00:00'),
    (24, 45.0, NULL, 9.0, 1923.45, 'deposit', '2024-01-01 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 35, '2024-01-01 00:00:00'),
    (24, 11.0, NULL, 8.0, 3266.24, 'income', '2024-04-12 00:00:00', 'Salary Payment', FALSE, 23.0, NULL, 50, '2024-04-12 00:00:00'),
    (24, NULL, 1.0, 9.0, 3863.35, 'transfer', '2024-02-17 00:00:00', 'Bank Internal Transfer', FALSE, NULL, 1.0, 11, '2024-02-17 00:00:00'),
    (24, 23.0, NULL, NULL, 2409.31, 'withdrawal', '2024-02-27 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 29, '2024-02-27 00:00:00'),
    (24, 41.0, NULL, NULL, 353.69, 'income', '2024-03-05 00:00:00', 'Bonus Received', FALSE, 6.0, NULL, 48, '2024-03-05 00:00:00'),
    (24, NULL, 7.0, 6.0, 4838.62, 'income', '2024-04-14 00:00:00', 'Interest Income', FALSE, 10.0, NULL, 48, '2024-04-14 00:00:00'),
    (24, NULL, 12.0, NULL, 1903.35, 'deposit', '2024-04-07 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 43, '2024-04-07 00:00:00'),
    (24, 30.0, NULL, NULL, 1999.05, 'income', '2024-05-20 00:00:00', 'Interest Income', FALSE, NULL, NULL, 33, '2024-05-20 00:00:00'),
    (24, 7.0, NULL, NULL, 2954.9, 'transfer', '2024-03-16 00:00:00', 'Transfer to Savings', TRUE, NULL, NULL, 33, '2024-03-16 00:00:00'),
    (24, 41.0, NULL, 1.0, 1643.98, 'transfer', '2024-02-23 00:00:00', 'Bank Internal Transfer', FALSE, NULL, 3.0, 1, '2024-02-23 00:00:00'),
    (24, 21.0, NULL, 5.0, 730.24, 'income', '2024-05-14 00:00:00', 'Interest Income', FALSE, NULL, 1.0, 8, '2024-05-14 00:00:00'),
    (24, 15.0, NULL, 3.0, 146.06, 'fee', '2024-03-12 00:00:00', 'Service Charge', FALSE, 20.0, NULL, 2, '2024-03-12 00:00:00'),
    (24, NULL, 6.0, NULL, 2754.78, 'deposit', '2024-03-31 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 9, '2024-03-31 00:00:00'),
    (24, 22.0, NULL, 6.0, 4023.55, 'fee', '2024-04-24 00:00:00', 'Service Charge', FALSE, NULL, NULL, 37, '2024-04-24 00:00:00'),
    (24, 1.0, NULL, 9.0, 2998.53, 'withdrawal', '2024-02-22 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 33, '2024-02-22 00:00:00'),
    (24, 12.0, NULL, NULL, 4169.93, 'deposit', '2024-04-07 00:00:00', 'Cheque Deposit', FALSE, 10.0, NULL, 18, '2024-04-07 00:00:00'),
    (24, 48.0, NULL, NULL, 1184.92, 'expense', '2024-02-05 00:00:00', 'Mobile Data Recharge', FALSE, NULL, NULL, 23, '2024-02-05 00:00:00'),
    (24, 30.0, NULL, 8.0, 1030.68, 'withdrawal', '2024-01-15 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 28, '2024-01-15 00:00:00'),
    (24, 10.0, NULL, NULL, 4455.16, 'deposit', '2024-05-09 00:00:00', 'Online Deposit', TRUE, NULL, NULL, 13, '2024-05-09 00:00:00'),
    (24, 26.0, NULL, 7.0, 3410.99, 'fee', '2024-04-07 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 13, '2024-04-07 00:00:00'),
    (24, 35.0, NULL, 2.0, 1681.76, 'withdrawal', '2024-01-18 00:00:00', 'Cash Removed from Account', TRUE, NULL, NULL, 40, '2024-01-18 00:00:00'),
    (24, 9.0, NULL, 4.0, 2313.06, 'deposit', '2024-01-09 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 9, '2024-01-09 00:00:00'),
    (24, NULL, 3.0, NULL, 468.33, 'income', '2024-03-18 00:00:00', 'Bonus Received', FALSE, 22.0, 3.0, 46, '2024-03-18 00:00:00'),
    (24, 24.0, NULL, 6.0, 2710.59, 'income', '2024-02-19 00:00:00', 'Refund Processed', FALSE, 7.0, NULL, 42, '2024-02-19 00:00:00'),
    (24, 12.0, NULL, 5.0, 2414.48, 'transfer', '2024-05-30 00:00:00', 'Transfer to Savings', FALSE, 2.0, NULL, 8, '2024-05-30 00:00:00'),
    (24, 44.0, NULL, 7.0, 650.58, 'income', '2024-06-01 00:00:00', 'Freelance Project Payment', FALSE, 23.0, NULL, 24, '2024-06-01 00:00:00'),
    (24, NULL, 1.0, NULL, 4727.21, 'income', '2024-02-11 00:00:00', 'Refund Processed', FALSE, 16.0, NULL, 10, '2024-02-11 00:00:00'),
    (24, NULL, 11.0, 2.0, 4474.81, 'fee', '2024-05-22 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 10, '2024-05-22 00:00:00'),
    (24, 24.0, NULL, NULL, 4660.73, 'fee', '2024-05-28 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 34, '2024-05-28 00:00:00'),
    (24, 6.0, NULL, NULL, 4818.21, 'transfer', '2024-04-19 00:00:00', 'Transfer to Savings', FALSE, NULL, 2.0, 23, '2024-04-19 00:00:00'),
    (24, 16.0, NULL, NULL, 1280.15, 'transfer', '2024-02-18 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 7, '2024-02-18 00:00:00'),
    (24, 40.0, NULL, NULL, 2942.49, 'expense', '2024-05-10 00:00:00', 'Grocery Store Purchase', FALSE, NULL, NULL, 6, '2024-05-10 00:00:00'),
    (24, 10.0, NULL, NULL, 1481.56, 'deposit', '2024-03-21 00:00:00', 'Cheque Deposit', FALSE, 10.0, NULL, 9, '2024-03-21 00:00:00'),
    (24, 43.0, NULL, 9.0, 3880.48, 'withdrawal', '2024-05-18 00:00:00', 'ATM Cash Withdrawal', FALSE, 15.0, NULL, 12, '2024-05-18 00:00:00'),
    (24, 10.0, NULL, NULL, 1012.49, 'expense', '2024-02-05 00:00:00', 'Public Transport Fare', FALSE, NULL, NULL, 3, '2024-02-05 00:00:00'),
    (24, 27.0, NULL, NULL, 95.15, 'fee', '2024-06-15 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 11, '2024-06-15 00:00:00'),
    (24, 6.0, NULL, 8.0, 2996.69, 'withdrawal', '2024-04-20 00:00:00', 'ATM Cash Withdrawal', FALSE, 23.0, NULL, 28, '2024-04-20 00:00:00'),
    (24, NULL, 7.0, NULL, 3016.92, 'transfer', '2024-06-24 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 16, '2024-06-24 00:00:00'),
    (24, NULL, 6.0, NULL, 842.14, 'fee', '2024-02-22 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 10, '2024-02-22 00:00:00'),
    (24, NULL, 4.0, 9.0, 4480.28, 'withdrawal', '2024-03-14 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 32, '2024-03-14 00:00:00'),
    (24, 24.0, NULL, 2.0, 4240.81, 'income', '2024-06-14 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 17, '2024-06-14 00:00:00'),
    (24, 47.0, NULL, NULL, 3640.09, 'transfer', '2024-05-07 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 1, '2024-05-07 00:00:00'),
    (24, 41.0, NULL, 4.0, 2423.05, 'expense', '2024-05-02 00:00:00', 'Grocery Store Purchase', FALSE, NULL, NULL, 15, '2024-05-02 00:00:00'),
    (24, 19.0, NULL, NULL, 3327.44, 'transfer', '2024-04-22 00:00:00', 'Bank Internal Transfer', FALSE, 15.0, NULL, 48, '2024-04-22 00:00:00'),
    (24, 31.0, NULL, 6.0, 4307.01, 'withdrawal', '2024-01-06 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 5, '2024-01-06 00:00:00'),
    (24, 37.0, NULL, NULL, 618.61, 'fee', '2024-02-26 00:00:00', 'Monthly Account Fee', FALSE, NULL, 1.0, 19, '2024-02-26 00:00:00'),
    (24, 16.0, NULL, 3.0, 2030.9, 'deposit', '2024-05-10 00:00:00', 'Online Deposit', FALSE, 1.0, NULL, 0, '2024-05-10 00:00:00'),
    (24, 8.0, NULL, NULL, 3447.4, 'fee', '2024-03-11 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 14, '2024-03-11 00:00:00'),
    (24, NULL, 2.0, 5.0, 452.4, 'income', '2024-03-09 00:00:00', 'Refund Processed', TRUE, NULL, 3.0, 29, '2024-03-09 00:00:00'),
    (24, NULL, 2.0, 7.0, 3964.77, 'deposit', '2024-04-04 00:00:00', 'Cash Deposit at Branch', FALSE, 17.0, NULL, 26, '2024-04-04 00:00:00'),
    (24, 14.0, NULL, NULL, 4898.24, 'fee', '2024-01-16 00:00:00', 'Monthly Account Fee', FALSE, 20.0, NULL, 45, '2024-01-16 00:00:00'),
    (24, 8.0, NULL, NULL, 2874.47, 'withdrawal', '2024-02-01 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 42, '2024-02-01 00:00:00'),
    (24, 48.0, NULL, NULL, 1819.52, 'deposit', '2024-01-27 00:00:00', 'Online Deposit', TRUE, 5.0, NULL, 39, '2024-01-27 00:00:00'),
    (24, NULL, 11.0, NULL, 2217.38, 'income', '2024-03-09 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 21, '2024-03-09 00:00:00'),
    (24, 10.0, NULL, 7.0, 4886.77, 'expense', '2024-01-06 00:00:00', 'Mobile Data Recharge', TRUE, NULL, NULL, 48, '2024-01-06 00:00:00'),
    (24, NULL, 2.0, NULL, 1307.6, 'income', '2024-01-18 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 34, '2024-01-18 00:00:00'),
    (24, 46.0, NULL, 6.0, 143.71, 'withdrawal', '2024-05-29 00:00:00', 'Cash Removed from Account', FALSE, 2.0, NULL, 35, '2024-05-29 00:00:00'),
    (24, 36.0, NULL, 7.0, 4117.56, 'income', '2024-06-22 00:00:00', 'Dividend Payment', FALSE, NULL, 1.0, 24, '2024-06-22 00:00:00'),
    (24, 39.0, NULL, 3.0, 4785.39, 'income', '2024-02-01 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 30, '2024-02-01 00:00:00'),
    (24, NULL, 2.0, NULL, 2474.57, 'fee', '2024-02-20 00:00:00', 'Service Charge', FALSE, NULL, NULL, 48, '2024-02-20 00:00:00'),
    (24, 9.0, NULL, NULL, 1260.44, 'transfer', '2024-03-26 00:00:00', 'Bank Internal Transfer', TRUE, NULL, NULL, 30, '2024-03-26 00:00:00'),
    (24, 17.0, NULL, NULL, 3522.92, 'expense', '2024-01-03 00:00:00', 'Utility Bill Payment', TRUE, NULL, NULL, 17, '2024-01-03 00:00:00'),
    (24, NULL, 7.0, 9.0, 1312.16, 'expense', '2024-05-31 00:00:00', 'Monthly Rent Payment', TRUE, NULL, 1.0, 17, '2024-05-31 00:00:00'),
    (24, 3.0, NULL, 3.0, 3293.86, 'deposit', '2024-04-02 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, 5.0, 2, '2024-04-02 00:00:00'),
    (24, 32.0, NULL, 2.0, 4693.84, 'deposit', '2024-04-03 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 32, '2024-04-03 00:00:00'),
    (24, NULL, 5.0, 4.0, 3478.39, 'income', '2024-02-20 00:00:00', 'Dividend Payment', FALSE, NULL, NULL, 48, '2024-02-20 00:00:00'),
    (24, 43.0, NULL, 8.0, 3595.55, 'transfer', '2024-02-18 00:00:00', 'Transfer from Checking', FALSE, 17.0, NULL, 48, '2024-02-18 00:00:00'),
    (1, 4.0, NULL, NULL, 1249.67, 'expense', '2025-04-03 00:00:00', 'Public Transport Fare', FALSE, NULL, NULL, 47, '2025-04-03 00:00:00'),
    (1, 13.0, NULL, NULL, 369.44, 'withdrawal', '2025-05-22 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 47, '2025-05-22 00:00:00'),
    (1, 16.0, NULL, NULL, 4786.16, 'deposit', '2025-03-01 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 7, '2025-03-01 00:00:00'),
    (1, NULL, 10.0, NULL, 3653.03, 'fee', '2025-05-21 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 3, '2025-05-21 00:00:00'),
    (1, 50.0, NULL, NULL, 2321.13, 'fee', '2025-06-18 00:00:00', 'Service Charge', TRUE, 17.0, NULL, 2, '2025-06-18 00:00:00'),
    (1, NULL, 7.0, 8.0, 3412.28, 'transfer', '2025-06-15 00:00:00', 'Bank Internal Transfer', FALSE, 21.0, NULL, 6, '2025-06-15 00:00:00'),
    (1, 45.0, NULL, NULL, 4960.52, 'income', '2025-02-25 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 48, '2025-02-25 00:00:00'),
    (1, 6.0, NULL, 8.0, 1190.83, 'income', '2025-01-14 00:00:00', 'Bonus Received', FALSE, 6.0, NULL, 12, '2025-01-14 00:00:00'),
    (1, 39.0, NULL, 6.0, 517.13, 'fee', '2025-04-21 00:00:00', 'Service Charge', FALSE, 19.0, NULL, 14, '2025-04-21 00:00:00'),
    (1, 50.0, NULL, 5.0, 827.2, 'withdrawal', '2025-04-10 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, 1.0, 37, '2025-04-10 00:00:00'),
    (1, 9.0, NULL, 7.0, 200.39, 'transfer', '2025-01-16 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 1, '2025-01-16 00:00:00'),
    (1, 45.0, NULL, 4.0, 3846.29, 'transfer', '2025-02-16 00:00:00', 'Transfer from Checking', FALSE, 13.0, NULL, 4, '2025-02-16 00:00:00'),
    (1, NULL, 6.0, NULL, 2873.82, 'fee', '2025-04-01 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, 4.0, 31, '2025-04-01 00:00:00'),
    (1, 1.0, NULL, 3.0, 3312.67, 'fee', '2025-03-27 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 10, '2025-03-27 00:00:00'),
    (1, NULL, 11.0, NULL, 4366.63, 'fee', '2025-01-10 00:00:00', 'Service Charge', FALSE, 13.0, NULL, 18, '2025-01-10 00:00:00'),
    (1, 40.0, NULL, 3.0, 4053.61, 'transfer', '2025-06-24 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 7, '2025-06-24 00:00:00'),
    (1, 27.0, NULL, NULL, 215.72, 'withdrawal', '2025-01-05 00:00:00', 'Cash Removed from Account', FALSE, 10.0, NULL, 33, '2025-01-05 00:00:00'),
    (1, NULL, 4.0, NULL, 1739.93, 'withdrawal', '2025-02-01 00:00:00', 'ATM Cash Withdrawal', FALSE, 11.0, NULL, 46, '2025-02-01 00:00:00'),
    (1, NULL, 8.0, NULL, 3110.93, 'transfer', '2025-05-09 00:00:00', 'Bank Internal Transfer', FALSE, 16.0, NULL, 11, '2025-05-09 00:00:00'),
    (1, 27.0, NULL, 3.0, 1076.17, 'deposit', '2025-05-22 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 36, '2025-05-22 00:00:00'),
    (1, 2.0, NULL, NULL, 78.55, 'income', '2025-01-07 00:00:00', 'Salary Payment', FALSE, 19.0, NULL, 19, '2025-01-07 00:00:00'),
    (1, 40.0, NULL, 1.0, 3318.51, 'expense', '2025-03-22 00:00:00', 'Fuel Station', FALSE, 11.0, NULL, 21, '2025-03-22 00:00:00'),
    (1, 20.0, NULL, 8.0, 101.55, 'transfer', '2025-03-29 00:00:00', 'Transfer to Savings', FALSE, 9.0, NULL, 34, '2025-03-29 00:00:00'),
    (1, NULL, 12.0, 8.0, 417.44, 'fee', '2025-03-16 00:00:00', 'ATM Withdrawal Fee', FALSE, 13.0, 4.0, 27, '2025-03-16 00:00:00'),
    (1, 3.0, NULL, NULL, 4209.18, 'transfer', '2025-04-12 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 34, '2025-04-12 00:00:00'),
    (1, NULL, 7.0, NULL, 2241.15, 'withdrawal', '2025-03-23 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 27, '2025-03-23 00:00:00'),
    (1, 32.0, NULL, 7.0, 3346.89, 'fee', '2025-06-08 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 15, '2025-06-08 00:00:00'),
    (1, 19.0, NULL, NULL, 1208.31, 'transfer', '2025-03-12 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 11, '2025-03-12 00:00:00'),
    (1, NULL, 8.0, NULL, 3463.83, 'withdrawal', '2025-02-27 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 35, '2025-02-27 00:00:00'),
    (1, 25.0, NULL, NULL, 2746.21, 'income', '2025-04-01 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 6, '2025-04-01 00:00:00'),
    (1, 43.0, NULL, NULL, 691.82, 'withdrawal', '2025-01-04 00:00:00', 'Cash Removed from Account', TRUE, NULL, NULL, 1, '2025-01-04 00:00:00'),
    (1, 1.0, NULL, NULL, 131.61, 'deposit', '2025-01-15 00:00:00', 'Cash Deposit at Branch', TRUE, 17.0, 5.0, 40, '2025-01-15 00:00:00'),
    (1, 14.0, NULL, 3.0, 3254.31, 'fee', '2025-05-18 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 17, '2025-05-18 00:00:00'),
    (1, 1.0, NULL, 8.0, 1832.02, 'income', '2025-01-07 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 37, '2025-01-07 00:00:00'),
    (1, 5.0, NULL, 1.0, 938.05, 'withdrawal', '2025-05-01 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 50, '2025-05-01 00:00:00'),
    (1, NULL, 7.0, 8.0, 4524.55, 'fee', '2025-05-06 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 1, '2025-05-06 00:00:00'),
    (1, NULL, 6.0, 4.0, 1611.92, 'fee', '2025-01-02 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 1, '2025-01-02 00:00:00'),
    (1, 40.0, NULL, 8.0, 70.1, 'fee', '2025-03-25 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 8, '2025-03-25 00:00:00'),
    (1, 13.0, NULL, NULL, 3467.98, 'expense', '2025-04-04 00:00:00', 'Monthly Rent Payment', TRUE, NULL, 1.0, 9, '2025-04-04 00:00:00'),
    (1, 40.0, NULL, 3.0, 4368.18, 'expense', '2025-06-15 00:00:00', 'Public Transport Fare', FALSE, 12.0, NULL, 40, '2025-06-15 00:00:00'),
    (2, 2.0, NULL, 1.0, 3348.86, 'fee', '2025-01-16 00:00:00', 'Service Charge', FALSE, NULL, NULL, 14, '2025-01-16 00:00:00'),
    (2, 46.0, NULL, 1.0, 1983.86, 'deposit', '2025-06-16 00:00:00', 'Cash Deposit at Branch', FALSE, 19.0, 5.0, 48, '2025-06-16 00:00:00'),
    (2, 4.0, NULL, 8.0, 3229.48, 'expense', '2025-02-21 00:00:00', 'Coffee Shop', FALSE, NULL, NULL, 50, '2025-02-21 00:00:00'),
    (2, 48.0, NULL, 1.0, 1215.4, 'withdrawal', '2025-06-22 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 11, '2025-06-22 00:00:00'),
    (2, 32.0, NULL, 6.0, 3356.69, 'fee', '2025-06-30 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 29, '2025-06-30 00:00:00'),
    (2, 46.0, NULL, 9.0, 3030.65, 'fee', '2025-05-24 00:00:00', 'ATM Withdrawal Fee', FALSE, 13.0, NULL, 11, '2025-05-24 00:00:00'),
    (2, 26.0, NULL, NULL, 3705.61, 'withdrawal', '2025-01-06 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 10, '2025-01-06 00:00:00'),
    (2, 40.0, NULL, NULL, 1245.53, 'transfer', '2025-06-09 00:00:00', 'Bank Internal Transfer', FALSE, 13.0, NULL, 28, '2025-06-09 00:00:00'),
    (2, 50.0, NULL, NULL, 207.84, 'transfer', '2025-03-02 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 43, '2025-03-02 00:00:00'),
    (2, 39.0, NULL, 4.0, 3874.25, 'transfer', '2025-06-12 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 9, '2025-06-12 00:00:00'),
    (2, 6.0, NULL, 9.0, 4025.69, 'expense', '2025-03-08 00:00:00', 'Grocery Store Purchase', TRUE, NULL, NULL, 22, '2025-03-08 00:00:00'),
    (2, NULL, 3.0, NULL, 4049.26, 'deposit', '2025-03-21 00:00:00', 'Online Deposit', FALSE, NULL, 3.0, 37, '2025-03-21 00:00:00'),
    (2, 48.0, NULL, NULL, 2570.91, 'withdrawal', '2025-06-12 00:00:00', 'Cash Removed from Account', FALSE, 1.0, NULL, 2, '2025-06-12 00:00:00'),
    (2, NULL, 3.0, NULL, 2138.76, 'deposit', '2025-04-18 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 17, '2025-04-18 00:00:00'),
    (2, NULL, 3.0, NULL, 3972.49, 'income', '2025-05-14 00:00:00', 'Refund Processed', FALSE, 14.0, NULL, 33, '2025-05-14 00:00:00'),
    (2, 23.0, NULL, 1.0, 3744.51, 'fee', '2025-04-01 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 15, '2025-04-01 00:00:00'),
    (2, 15.0, NULL, NULL, 2610.73, 'fee', '2025-01-02 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 11, '2025-01-02 00:00:00'),
    (2, 39.0, NULL, 8.0, 3097.37, 'expense', '2025-01-01 00:00:00', 'Monthly Rent Payment', FALSE, NULL, NULL, 37, '2025-01-01 00:00:00'),
    (2, 16.0, NULL, 1.0, 4868.65, 'transfer', '2025-01-14 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 41, '2025-01-14 00:00:00'),
    (2, 12.0, NULL, 1.0, 897.57, 'deposit', '2025-02-02 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 23, '2025-02-02 00:00:00'),
    (2, 13.0, NULL, NULL, 2561.99, 'expense', '2025-01-17 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 6, '2025-01-17 00:00:00'),
    (2, 47.0, NULL, NULL, 264.68, 'deposit', '2025-03-25 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 42, '2025-03-25 00:00:00'),
    (2, 48.0, NULL, NULL, 4197.91, 'deposit', '2025-02-18 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 18, '2025-02-18 00:00:00'),
    (2, NULL, 4.0, 4.0, 2284.64, 'transfer', '2025-04-12 00:00:00', 'Transfer from Checking', FALSE, 3.0, NULL, 14, '2025-04-12 00:00:00'),
    (2, 7.0, NULL, 5.0, 3740.47, 'transfer', '2025-02-15 00:00:00', 'Transfer from Checking', FALSE, NULL, 4.0, 37, '2025-02-15 00:00:00'),
    (2, 45.0, NULL, 2.0, 1979.35, 'expense', '2025-01-08 00:00:00', 'Public Transport Fare', FALSE, NULL, NULL, 44, '2025-01-08 00:00:00'),
    (2, NULL, 4.0, NULL, 4413.36, 'income', '2025-03-25 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 31, '2025-03-25 00:00:00'),
    (2, 5.0, NULL, NULL, 2648.67, 'transfer', '2025-06-21 00:00:00', 'Transfer from Checking', FALSE, NULL, 5.0, 31, '2025-06-21 00:00:00'),
    (2, NULL, 3.0, 3.0, 1050.72, 'expense', '2025-03-15 00:00:00', 'Mobile Data Recharge', FALSE, NULL, NULL, 29, '2025-03-15 00:00:00'),
    (2, 25.0, NULL, NULL, 160.19, 'expense', '2025-06-20 00:00:00', 'Utility Bill Payment', FALSE, NULL, 2.0, 20, '2025-06-20 00:00:00'),
    (2, 26.0, NULL, 5.0, 893.98, 'income', '2025-05-04 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 3, '2025-05-04 00:00:00'),
    (2, 35.0, NULL, NULL, 4768.22, 'fee', '2025-03-24 00:00:00', 'ATM Withdrawal Fee', FALSE, 17.0, 3.0, 15, '2025-03-24 00:00:00'),
    (2, 47.0, NULL, 4.0, 123.35, 'income', '2025-03-14 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 33, '2025-03-14 00:00:00'),
    (2, 13.0, NULL, 7.0, 4010.51, 'expense', '2025-04-18 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 43, '2025-04-18 00:00:00'),
    (2, 6.0, NULL, 4.0, 4418.44, 'income', '2025-01-28 00:00:00', 'Refund Processed', FALSE, 3.0, NULL, 50, '2025-01-28 00:00:00'),
    (2, 40.0, NULL, NULL, 46.0, 'deposit', '2025-01-29 00:00:00', 'Cheque Deposit', FALSE, 13.0, NULL, 1, '2025-01-29 00:00:00'),
    (2, NULL, 3.0, 9.0, 1064.67, 'deposit', '2025-05-07 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 49, '2025-05-07 00:00:00'),
    (3, NULL, 5.0, NULL, 4085.72, 'fee', '2025-03-23 00:00:00', 'Monthly Account Fee', FALSE, 7.0, NULL, 36, '2025-03-23 00:00:00'),
    (3, 23.0, NULL, NULL, 348.76, 'transfer', '2025-02-11 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 17, '2025-02-11 00:00:00'),
    (3, 16.0, NULL, NULL, 3113.34, 'transfer', '2025-05-31 00:00:00', 'Transfer from Checking', FALSE, 20.0, NULL, 20, '2025-05-31 00:00:00'),
    (3, NULL, 6.0, 2.0, 756.79, 'income', '2025-06-22 00:00:00', 'Bonus Received', TRUE, NULL, NULL, 36, '2025-06-22 00:00:00'),
    (3, NULL, 5.0, NULL, 4812.73, 'income', '2025-06-12 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 21, '2025-06-12 00:00:00'),
    (3, 5.0, NULL, NULL, 121.74, 'fee', '2025-04-16 00:00:00', 'Service Charge', FALSE, NULL, NULL, 7, '2025-04-16 00:00:00'),
    (3, 37.0, NULL, 9.0, 1800.35, 'transfer', '2025-01-06 00:00:00', 'Transfer to Savings', FALSE, NULL, 2.0, 39, '2025-01-06 00:00:00'),
    (3, 14.0, NULL, 7.0, 1550.94, 'income', '2025-01-06 00:00:00', 'Interest Income', TRUE, 6.0, NULL, 3, '2025-01-06 00:00:00'),
    (3, 14.0, NULL, 9.0, 1423.32, 'transfer', '2025-06-03 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 44, '2025-06-03 00:00:00'),
    (3, 23.0, NULL, 8.0, 684.73, 'withdrawal', '2025-04-04 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 27, '2025-04-04 00:00:00'),
    (3, NULL, 7.0, NULL, 1880.47, 'deposit', '2025-03-01 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 38, '2025-03-01 00:00:00'),
    (3, 7.0, NULL, NULL, 522.29, 'expense', '2025-05-01 00:00:00', 'Public Transport Fare', FALSE, NULL, NULL, 45, '2025-05-01 00:00:00'),
    (3, 1.0, NULL, 7.0, 4726.51, 'income', '2025-01-11 00:00:00', 'Dividend Payment', FALSE, NULL, NULL, 12, '2025-01-11 00:00:00'),
    (3, 29.0, NULL, NULL, 4856.26, 'withdrawal', '2025-03-19 00:00:00', 'Cash Removed from Account', FALSE, 15.0, NULL, 14, '2025-03-19 00:00:00'),
    (3, 36.0, NULL, NULL, 3423.56, 'withdrawal', '2025-04-03 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 11, '2025-04-03 00:00:00'),
    (3, 36.0, NULL, NULL, 4922.08, 'deposit', '2025-06-25 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 25, '2025-06-25 00:00:00'),
    (3, NULL, 5.0, NULL, 4787.82, 'withdrawal', '2025-06-20 00:00:00', 'ATM Cash Withdrawal', FALSE, 17.0, NULL, 10, '2025-06-20 00:00:00'),
    (3, 49.0, NULL, 2.0, 359.86, 'expense', '2025-01-20 00:00:00', 'Mobile Data Recharge', TRUE, 4.0, NULL, 22, '2025-01-20 00:00:00'),
    (3, 33.0, NULL, 5.0, 4318.37, 'fee', '2025-03-06 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 16, '2025-03-06 00:00:00'),
    (3, 40.0, NULL, 5.0, 1847.5, 'transfer', '2025-03-25 00:00:00', 'Transfer to Savings', FALSE, 4.0, 1.0, 49, '2025-03-25 00:00:00'),
    (3, NULL, 7.0, NULL, 4384.27, 'withdrawal', '2025-02-17 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 31, '2025-02-17 00:00:00'),
    (3, 1.0, NULL, 3.0, 3924.02, 'fee', '2025-04-05 00:00:00', 'Monthly Account Fee', TRUE, 9.0, NULL, 38, '2025-04-05 00:00:00'),
    (3, 2.0, NULL, NULL, 1636.39, 'expense', '2025-06-05 00:00:00', 'Streaming Subscription', FALSE, 12.0, NULL, 34, '2025-06-05 00:00:00'),
    (3, NULL, 5.0, NULL, 3932.76, 'withdrawal', '2025-05-31 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 38, '2025-05-31 00:00:00'),
    (3, 34.0, NULL, NULL, 2315.67, 'deposit', '2025-06-19 00:00:00', 'Cash Deposit at Branch', FALSE, 2.0, NULL, 41, '2025-06-19 00:00:00'),
    (3, 17.0, NULL, 9.0, 2060.61, 'fee', '2025-04-01 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 47, '2025-04-01 00:00:00'),
    (3, NULL, 5.0, 2.0, 118.05, 'income', '2025-04-27 00:00:00', 'Freelance Project Payment', FALSE, 9.0, NULL, 12, '2025-04-27 00:00:00'),
    (3, 46.0, NULL, NULL, 3939.8, 'deposit', '2025-03-03 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, 4.0, 0, '2025-03-03 00:00:00'),
    (3, NULL, 7.0, NULL, 4267.1, 'deposit', '2025-01-19 00:00:00', 'Online Deposit', TRUE, NULL, 3.0, 35, '2025-01-19 00:00:00'),
    (3, 34.0, NULL, NULL, 2110.62, 'withdrawal', '2025-03-26 00:00:00', 'ATM Cash Withdrawal', FALSE, 5.0, NULL, 3, '2025-03-26 00:00:00'),
    (3, NULL, 6.0, NULL, 4683.45, 'deposit', '2025-02-08 00:00:00', 'Online Deposit', FALSE, 10.0, NULL, 5, '2025-02-08 00:00:00'),
    (3, 45.0, NULL, NULL, 723.62, 'withdrawal', '2025-06-29 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 41, '2025-06-29 00:00:00'),
    (3, 8.0, NULL, 6.0, 2902.54, 'transfer', '2025-06-20 00:00:00', 'Bank Internal Transfer', FALSE, 13.0, NULL, 29, '2025-06-20 00:00:00'),
    (3, 6.0, NULL, 2.0, 696.68, 'fee', '2025-06-26 00:00:00', 'Service Charge', TRUE, NULL, 3.0, 44, '2025-06-26 00:00:00'),
    (3, 5.0, NULL, NULL, 2636.72, 'expense', '2025-02-21 00:00:00', 'Grocery Store Purchase', TRUE, NULL, NULL, 5, '2025-02-21 00:00:00'),
    (4, NULL, 8.0, NULL, 1678.49, 'fee', '2025-03-01 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, 2.0, 33, '2025-03-01 00:00:00'),
    (4, NULL, 8.0, NULL, 37.13, 'income', '2025-02-24 00:00:00', 'Interest Income', FALSE, 19.0, NULL, 43, '2025-02-24 00:00:00'),
    (4, NULL, 8.0, 5.0, 2490.31, 'income', '2025-05-20 00:00:00', 'Freelance Project Payment', FALSE, 17.0, NULL, 19, '2025-05-20 00:00:00'),
    (4, 14.0, NULL, NULL, 293.83, 'deposit', '2025-02-28 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, 3.0, 24, '2025-02-28 00:00:00'),
    (4, NULL, 8.0, NULL, 3964.19, 'income', '2025-06-13 00:00:00', 'Salary Payment', FALSE, NULL, 3.0, 33, '2025-06-13 00:00:00'),
    (4, 30.0, NULL, NULL, 2328.26, 'withdrawal', '2025-06-24 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 23, '2025-06-24 00:00:00'),
    (4, 26.0, NULL, 3.0, 879.55, 'deposit', '2025-04-15 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, 1.0, 19, '2025-04-15 00:00:00'),
    (4, 41.0, NULL, NULL, 3993.47, 'withdrawal', '2025-05-08 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 34, '2025-05-08 00:00:00'),
    (4, 16.0, NULL, NULL, 2683.4, 'withdrawal', '2025-03-29 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 35, '2025-03-29 00:00:00'),
    (4, 5.0, NULL, NULL, 115.58, 'income', '2025-06-03 00:00:00', 'Dividend Payment', FALSE, NULL, NULL, 49, '2025-06-03 00:00:00'),
    (4, 5.0, NULL, NULL, 3308.81, 'withdrawal', '2025-02-23 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 35, '2025-02-23 00:00:00'),
    (4, 44.0, NULL, 5.0, 4559.09, 'income', '2025-04-01 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 34, '2025-04-01 00:00:00'),
    (4, NULL, 8.0, 1.0, 376.24, 'fee', '2025-06-07 00:00:00', 'Service Charge', FALSE, NULL, NULL, 9, '2025-06-07 00:00:00'),
    (4, 31.0, NULL, 8.0, 4583.18, 'fee', '2025-02-12 00:00:00', 'ATM Withdrawal Fee', FALSE, 18.0, NULL, 29, '2025-02-12 00:00:00'),
    (4, 34.0, NULL, 7.0, 1403.8, 'fee', '2025-05-24 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 4, '2025-05-24 00:00:00'),
    (4, NULL, 8.0, 7.0, 1878.08, 'income', '2025-03-02 00:00:00', 'Freelance Project Payment', FALSE, 15.0, NULL, 44, '2025-03-02 00:00:00'),
    (4, 48.0, NULL, NULL, 3714.23, 'deposit', '2025-03-07 00:00:00', 'Cheque Deposit', TRUE, NULL, NULL, 19, '2025-03-07 00:00:00'),
    (4, 19.0, NULL, 3.0, 3612.72, 'expense', '2025-01-30 00:00:00', 'Monthly Rent Payment', FALSE, 19.0, NULL, 49, '2025-01-30 00:00:00'),
    (4, 3.0, NULL, NULL, 2450.25, 'deposit', '2025-03-07 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 49, '2025-03-07 00:00:00'),
    (4, 20.0, NULL, 3.0, 3549.64, 'withdrawal', '2025-01-21 00:00:00', 'ATM Cash Withdrawal', TRUE, NULL, NULL, 16, '2025-01-21 00:00:00'),
    (24, 7.0, NULL, NULL, 398.46, 'fee', '2025-06-18 00:00:00', 'Service Charge', FALSE, NULL, NULL, 9, '2025-06-18 00:00:00'),
    (4, 16.0, NULL, NULL, 4265.36, 'transfer', '2025-06-28 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 43, '2025-06-28 00:00:00'),
    (4, 29.0, NULL, NULL, 4840.38, 'withdrawal', '2025-01-02 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 37, '2025-01-02 00:00:00'),
    (4, 16.0, NULL, NULL, 4853.83, 'income', '2025-04-16 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 10, '2025-04-16 00:00:00'),
    (5, 45.0, NULL, NULL, 2409.2, 'deposit', '2025-04-22 00:00:00', 'Cash Deposit at Branch', FALSE, 22.0, NULL, 34, '2025-04-22 00:00:00'),
    (5, NULL, 8.0, 9.0, 4551.44, 'fee', '2025-02-03 00:00:00', 'ATM Withdrawal Fee', TRUE, NULL, NULL, 39, '2025-02-03 00:00:00'),
    (5, 49.0, NULL, NULL, 2261.76, 'deposit', '2025-02-05 00:00:00', 'Online Deposit', TRUE, NULL, 2.0, 12, '2025-02-05 00:00:00'),
    (5, 17.0, NULL, NULL, 4590.93, 'income', '2025-06-24 00:00:00', 'Interest Income', FALSE, NULL, NULL, 7, '2025-06-24 00:00:00'),
    (5, 49.0, NULL, 6.0, 3183.5, 'income', '2025-04-10 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 7, '2025-04-10 00:00:00'),
    (5, 36.0, NULL, NULL, 3359.9, 'fee', '2025-04-24 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 22, '2025-04-24 00:00:00'),
    (5, 45.0, NULL, 8.0, 934.48, 'deposit', '2025-05-29 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 30, '2025-05-29 00:00:00'),
    (5, 51.0, NULL, 2.0, 3825.76, 'expense', '2025-02-09 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 34, '2025-02-09 00:00:00'),
    (5, 49.0, NULL, NULL, 2920.3, 'withdrawal', '2025-05-28 00:00:00', 'ATM Cash Withdrawal', FALSE, 19.0, NULL, 44, '2025-05-28 00:00:00'),
    (5, 22.0, NULL, 7.0, 1544.71, 'income', '2025-06-13 00:00:00', 'Freelance Project Payment', FALSE, 19.0, 1.0, 15, '2025-06-13 00:00:00'),
    (10, NULL, 6.0, 9.0, 1591.33, 'transfer', '2025-01-11 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 3, '2025-01-11 00:00:00'),
    (10, NULL, 2.0, NULL, 3767.2, 'deposit', '2025-05-24 00:00:00', 'Cheque Deposit', FALSE, NULL, 2.0, 11, '2025-05-24 00:00:00'),
    (10, NULL, 7.0, NULL, 1279.57, 'transfer', '2025-02-07 00:00:00', 'Transfer from Checking', FALSE, NULL, 4.0, 14, '2025-02-07 00:00:00'),
    (10, 16.0, NULL, 2.0, 710.49, 'transfer', '2025-04-28 00:00:00', 'Bank Internal Transfer', TRUE, NULL, NULL, 39, '2025-04-28 00:00:00'),
    (10, 14.0, NULL, 1.0, 1232.1, 'withdrawal', '2025-03-25 00:00:00', 'Cash Removed from Account', FALSE, 11.0, NULL, 20, '2025-03-25 00:00:00'),
    (10, 34.0, NULL, NULL, 4003.49, 'income', '2025-06-22 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 15, '2025-06-22 00:00:00'),
    (10, 27.0, NULL, NULL, 2237.88, 'withdrawal', '2025-03-07 00:00:00', 'Cash Removed from Account', FALSE, 3.0, 4.0, 40, '2025-03-07 00:00:00'),
    (10, 14.0, NULL, 4.0, 4398.71, 'transfer', '2025-04-24 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 10, '2025-04-24 00:00:00'),
    (10, NULL, 7.0, 2.0, 854.27, 'deposit', '2025-03-04 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 15, '2025-03-04 00:00:00'),
    (10, NULL, 5.0, NULL, 1825.38, 'withdrawal', '2025-03-09 00:00:00', 'Cash Removed from Account', FALSE, 22.0, NULL, 25, '2025-03-09 00:00:00'),
    (10, NULL, 3.0, 2.0, 20.58, 'income', '2025-04-24 00:00:00', 'Dividend Payment', FALSE, NULL, NULL, 25, '2025-04-24 00:00:00'),
    (10, 24.0, NULL, NULL, 1779.57, 'deposit', '2025-04-14 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 2, '2025-04-14 00:00:00'),
    (10, 8.0, NULL, NULL, 1690.64, 'deposit', '2025-04-20 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 0, '2025-04-20 00:00:00'),
    (10, NULL, 8.0, 2.0, 4642.56, 'deposit', '2025-02-17 00:00:00', 'Cash Deposit at Branch', FALSE, 1.0, NULL, 2, '2025-02-17 00:00:00'),
    (10, 18.0, NULL, NULL, 1994.56, 'fee', '2025-05-02 00:00:00', 'Monthly Account Fee', TRUE, NULL, NULL, 19, '2025-05-02 00:00:00'),
    (10, NULL, 8.0, 1.0, 413.86, 'expense', '2025-01-21 00:00:00', 'Mobile Data Recharge', FALSE, 15.0, NULL, 44, '2025-01-21 00:00:00'),
    (10, 47.0, NULL, 2.0, 136.97, 'expense', '2025-01-06 00:00:00', 'Restaurant Dinner', FALSE, 15.0, NULL, 3, '2025-01-06 00:00:00'),
    (10, 26.0, NULL, 5.0, 696.61, 'income', '2025-03-10 00:00:00', 'Salary Payment', FALSE, 11.0, NULL, 23, '2025-03-10 00:00:00'),
    (11, 8.0, NULL, NULL, 3609.1, 'expense', '2025-01-10 00:00:00', 'Fuel Station', TRUE, NULL, NULL, 42, '2025-01-10 00:00:00'),
    (11, NULL, 8.0, NULL, 3680.95, 'deposit', '2025-02-04 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 38, '2025-02-04 00:00:00'),
    (11, 46.0, NULL, NULL, 4797.02, 'withdrawal', '2025-05-06 00:00:00', 'Cash Removed from Account', TRUE, NULL, NULL, 14, '2025-05-06 00:00:00'),
    (11, NULL, 12.0, 9.0, 4113.43, 'fee', '2025-03-16 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 26, '2025-03-16 00:00:00'),
    (11, 32.0, NULL, NULL, 2240.44, 'expense', '2025-05-06 00:00:00', 'Utility Bill Payment', FALSE, 7.0, NULL, 49, '2025-05-06 00:00:00'),
    (11, 9.0, NULL, NULL, 4865.47, 'transfer', '2025-04-11 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 4, '2025-04-11 00:00:00'),
    (11, 26.0, NULL, NULL, 3685.18, 'transfer', '2025-01-28 00:00:00', 'Transfer from Checking', FALSE, 4.0, NULL, 21, '2025-01-28 00:00:00'),
    (11, 22.0, NULL, 2.0, 1274.11, 'fee', '2025-04-18 00:00:00', 'Service Charge', FALSE, 17.0, NULL, 28, '2025-04-18 00:00:00'),
    (11, 40.0, NULL, 5.0, 2842.5, 'expense', '2025-05-27 00:00:00', 'Grocery Store Purchase', FALSE, NULL, NULL, 27, '2025-05-27 00:00:00'),
    (11, NULL, 6.0, 7.0, 4891.35, 'fee', '2025-02-03 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 36, '2025-02-03 00:00:00'),
    (11, 38.0, NULL, NULL, 1071.08, 'fee', '2025-02-14 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 8, '2025-02-14 00:00:00'),
    (11, 23.0, NULL, NULL, 4377.69, 'deposit', '2025-02-14 00:00:00', 'Online Deposit', TRUE, NULL, 5.0, 12, '2025-02-14 00:00:00'),
    (11, 17.0, NULL, NULL, 1977.71, 'deposit', '2025-02-06 00:00:00', 'Online Deposit', FALSE, NULL, 3.0, 41, '2025-02-06 00:00:00'),
    (11, NULL, 9.0, NULL, 1121.92, 'transfer', '2025-03-08 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 12, '2025-03-08 00:00:00'),
    (11, 24.0, NULL, NULL, 4615.4, 'withdrawal', '2025-05-10 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 50, '2025-05-10 00:00:00'),
    (11, 26.0, NULL, NULL, 4190.37, 'expense', '2025-02-01 00:00:00', 'Restaurant Dinner', FALSE, 3.0, 1.0, 27, '2025-02-01 00:00:00'),
    (11, NULL, 5.0, NULL, 3428.4, 'income', '2025-03-11 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 15, '2025-03-11 00:00:00'),
    (11, NULL, 2.0, NULL, 3648.51, 'fee', '2025-01-27 00:00:00', 'Service Charge', TRUE, 14.0, 3.0, 32, '2025-01-27 00:00:00'),
    (11, NULL, 5.0, NULL, 496.17, 'expense', '2025-03-14 00:00:00', 'Fuel Station', FALSE, NULL, NULL, 19, '2025-03-14 00:00:00'),
    (11, 35.0, NULL, 8.0, 2122.39, 'income', '2025-06-14 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 21, '2025-06-14 00:00:00'),
    (11, 42.0, NULL, NULL, 1739.19, 'transfer', '2025-04-04 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 33, '2025-04-04 00:00:00'),
    (11, NULL, 12.0, 2.0, 3397.54, 'fee', '2025-03-09 00:00:00', 'Service Charge', FALSE, NULL, 3.0, 2, '2025-03-09 00:00:00'),
    (11, 8.0, NULL, NULL, 605.39, 'transfer', '2025-03-05 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 10, '2025-03-05 00:00:00'),
    (11, 15.0, NULL, NULL, 595.98, 'fee', '2025-05-23 00:00:00', 'Service Charge', FALSE, NULL, 2.0, 42, '2025-05-23 00:00:00'),
    (11, 50.0, NULL, NULL, 4710.23, 'fee', '2025-05-07 00:00:00', 'Service Charge', FALSE, NULL, NULL, 7, '2025-05-07 00:00:00'),
    (11, 2.0, NULL, 9.0, 588.55, 'expense', '2025-01-11 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 26, '2025-01-11 00:00:00'),
    (11, NULL, 12.0, 1.0, 1512.43, 'withdrawal', '2025-06-21 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, 3.0, 46, '2025-06-21 00:00:00'),
    (11, 40.0, NULL, 4.0, 21.42, 'withdrawal', '2025-05-27 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 43, '2025-05-27 00:00:00'),
    (11, 10.0, NULL, 6.0, 2282.53, 'withdrawal', '2025-05-04 00:00:00', 'ATM Cash Withdrawal', FALSE, 16.0, NULL, 20, '2025-05-04 00:00:00'),
    (11, 44.0, NULL, NULL, 4371.87, 'income', '2025-05-06 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 13, '2025-05-06 00:00:00'),
    (11, 37.0, NULL, 7.0, 549.5, 'transfer', '2025-01-02 00:00:00', 'Transfer to Savings', FALSE, NULL, 1.0, 38, '2025-01-02 00:00:00'),
    (11, 19.0, NULL, 8.0, 761.33, 'fee', '2025-04-17 00:00:00', 'Monthly Account Fee', FALSE, 18.0, 1.0, 26, '2025-04-17 00:00:00'),
    (11, 3.0, NULL, 5.0, 1281.96, 'expense', '2025-01-22 00:00:00', 'Restaurant Dinner', FALSE, 16.0, NULL, 20, '2025-01-22 00:00:00'),
    (11, 43.0, NULL, 1.0, 547.69, 'transfer', '2025-02-26 00:00:00', 'Transfer from Checking', FALSE, 14.0, NULL, 40, '2025-02-26 00:00:00'),
    (11, NULL, 9.0, NULL, 4020.35, 'withdrawal', '2025-02-18 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 36, '2025-02-18 00:00:00'),
    (11, NULL, 3.0, NULL, 3374.54, 'deposit', '2025-05-12 00:00:00', 'Online Deposit', FALSE, NULL, 3.0, 49, '2025-05-12 00:00:00'),
    (11, 6.0, NULL, 4.0, 1628.51, 'deposit', '2025-05-16 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 2, '2025-05-16 00:00:00'),
    (11, 32.0, NULL, NULL, 2193.87, 'income', '2025-03-10 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 32, '2025-03-10 00:00:00'),
    (11, NULL, 11.0, NULL, 911.46, 'withdrawal', '2025-02-09 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 16, '2025-02-09 00:00:00'),
    (11, 33.0, NULL, NULL, 326.62, 'expense', '2025-05-23 00:00:00', 'Restaurant Dinner', TRUE, 3.0, NULL, 34, '2025-05-23 00:00:00'),
    (11, NULL, 6.0, 6.0, 593.21, 'income', '2025-04-03 00:00:00', 'Refund Processed', TRUE, 4.0, 4.0, 3, '2025-04-03 00:00:00'),
    (11, 15.0, NULL, 7.0, 3369.96, 'transfer', '2025-01-01 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 23, '2025-01-01 00:00:00'),
    (11, 9.0, NULL, NULL, 2110.59, 'income', '2025-03-09 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 35, '2025-03-09 00:00:00'),
    (11, 3.0, NULL, NULL, 124.96, 'deposit', '2025-01-19 00:00:00', 'Cash Deposit at Branch', FALSE, 15.0, NULL, 32, '2025-01-19 00:00:00'),
    (11, 3.0, NULL, NULL, 561.42, 'income', '2025-06-05 00:00:00', 'Interest Income', FALSE, 20.0, NULL, 46, '2025-06-05 00:00:00'),
    (11, NULL, 9.0, NULL, 1081.0, 'deposit', '2025-01-21 00:00:00', 'Online Deposit', TRUE, 12.0, NULL, 38, '2025-01-21 00:00:00'),
    (11, 42.0, NULL, NULL, 4832.89, 'transfer', '2025-05-10 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 12, '2025-05-10 00:00:00'),
    (11, 8.0, NULL, NULL, 2284.34, 'expense', '2025-02-08 00:00:00', 'Clothing Store Purchase', FALSE, NULL, NULL, 44, '2025-02-08 00:00:00'),
    (11, 47.0, NULL, NULL, 3618.73, 'transfer', '2025-06-24 00:00:00', 'Transfer from Checking', FALSE, NULL, 1.0, 23, '2025-06-24 00:00:00'),
    (12, NULL, 9.0, 1.0, 612.85, 'withdrawal', '2025-02-20 00:00:00', 'Cash Removed from Account', FALSE, 21.0, NULL, 47, '2025-02-20 00:00:00'),
    (12, NULL, 6.0, NULL, 3512.8, 'fee', '2025-05-02 00:00:00', 'Service Charge', FALSE, NULL, 5.0, 28, '2025-05-02 00:00:00'),
    (12, 44.0, NULL, NULL, 4499.33, 'transfer', '2025-01-26 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 18, '2025-01-26 00:00:00'),
    (12, NULL, 5.0, 6.0, 399.93, 'transfer', '2025-02-02 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 12, '2025-02-02 00:00:00'),
    (12, 45.0, NULL, NULL, 2100.2, 'income', '2025-05-21 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 36, '2025-05-21 00:00:00'),
    (12, NULL, 11.0, NULL, 3277.71, 'fee', '2025-01-12 00:00:00', 'Service Charge', FALSE, NULL, 2.0, 17, '2025-01-12 00:00:00'),
    (12, 6.0, NULL, NULL, 694.02, 'expense', '2025-05-27 00:00:00', 'Monthly Rent Payment', FALSE, 16.0, NULL, 9, '2025-05-27 00:00:00'),
    (12, 34.0, NULL, NULL, 1841.34, 'expense', '2025-02-24 00:00:00', 'Fuel Station', FALSE, NULL, 2.0, 45, '2025-02-24 00:00:00'),
    (12, NULL, 12.0, NULL, 1218.87, 'transfer', '2025-06-14 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 1, '2025-06-14 00:00:00'),
    (12, NULL, 13.0, 2.0, 3704.6, 'income', '2025-06-12 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 25, '2025-06-12 00:00:00'),
    (12, 26.0, NULL, 7.0, 1176.11, 'income', '2025-05-08 00:00:00', 'Freelance Project Payment', FALSE, 23.0, NULL, 32, '2025-05-08 00:00:00'),
    (12, 46.0, NULL, 3.0, 1840.10, 'withdrawal', '2025-01-06 00:00:00', 'ATM Cash Withdrawal', FALSE, 17.0, NULL, 45, '2025-01-06 00:00:00'),
    (12, 6.0, NULL, 6.0, 4483.52, 'transfer', '2025-06-01 00:00:00', 'Transfer from Checking', TRUE, NULL, NULL, 15, '2025-06-01 00:00:00'),
    (12, 50.0, NULL, NULL, 4645.43, 'transfer', '2025-01-26 00:00:00', 'Bank Internal Transfer', FALSE, NULL, 1.0, 21, '2025-01-26 00:00:00'),
    (12, 12.0, NULL, NULL, 3890.66, 'transfer', '2025-04-25 00:00:00', 'Bank Internal Transfer', FALSE, 8.0, NULL, 32, '2025-04-25 00:00:00'),
    (12, 9.0, NULL, NULL, 1582.93, 'expense', '2025-02-27 00:00:00', 'Monthly Rent Payment', TRUE, 18.0, NULL, 36, '2025-02-27 00:00:00'),
    (12, 11.0, NULL, NULL, 3397.47, 'transfer', '2025-06-08 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 46, '2025-06-08 00:00:00'),
    (12, 7.0, NULL, 3.0, 3579.15, 'deposit', '2025-05-10 00:00:00', 'Cheque Deposit', FALSE, 20.0, NULL, 22, '2025-05-10 00:00:00'),
    (12, 12.0, NULL, NULL, 2750.55, 'expense', '2025-05-08 00:00:00', 'Clothing Store Purchase', FALSE, NULL, 2.0, 9, '2025-05-08 00:00:00'),
    (12, 17.0, NULL, 7.0, 2040.23, 'transfer', '2025-01-12 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 37, '2025-01-12 00:00:00'),
    (12, 48.0, NULL, 1.0, 1294.75, 'deposit', '2025-06-14 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 25, '2025-06-14 00:00:00'),
    (12, NULL, 9.0, 3.0, 3964.0, 'expense', '2025-03-28 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 8, '2025-03-28 00:00:00'),
    (12, 2.0, NULL, 4.0, 2621.0, 'deposit', '2025-06-11 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 1, '2025-06-11 00:00:00'),
    (12, NULL, 12.0, NULL, 3854.16, 'transfer', '2025-03-06 00:00:00', 'Transfer from Checking', FALSE, NULL, 5.0, 21, '2025-03-06 00:00:00'),
    (12, 24.0, NULL, 9.0, 3427.27, 'expense', '2025-01-03 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 12, '2025-01-03 00:00:00'),
    (12, 12.0, NULL, NULL, 3120.09, 'income', '2025-06-16 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 2, '2025-06-16 00:00:00'),
    (12, NULL, 2.0, NULL, 1091.7, 'expense', '2025-03-08 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 12, '2025-03-08 00:00:00'),
    (12, 12.0, NULL, NULL, 1569.59, 'fee', '2025-04-23 00:00:00', 'Monthly Account Fee', FALSE, NULL, 2.0, 22, '2025-04-23 00:00:00'),
    (12, NULL, 5.0, 5.0, 178.09, 'income', '2025-04-17 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 47, '2025-04-17 00:00:00'),
    (12, 39.0, NULL, NULL, 3659.49, 'withdrawal', '2025-05-21 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 50, '2025-05-21 00:00:00'),
    (12, NULL, 10.0, NULL, 1610.33, 'withdrawal', '2025-01-25 00:00:00', 'ATM Cash Withdrawal', FALSE, 22.0, NULL, 33, '2025-01-25 00:00:00'),
    (12, 28.0, NULL, NULL, 3723.68, 'expense', '2025-05-26 00:00:00', 'Streaming Subscription', TRUE, NULL, NULL, 11, '2025-05-26 00:00:00'),
    (12, 42.0, NULL, 7.0, 4536.27, 'deposit', '2025-03-28 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 35, '2025-03-28 00:00:00'),
    (13, 45.0, NULL, 3.0, 4463.52, 'income', '2025-06-16 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 8, '2025-06-16 00:00:00'),
    (13, 7.0, NULL, NULL, 4302.9, 'transfer', '2025-02-19 00:00:00', 'Transfer to Savings', FALSE, 17.0, NULL, 43, '2025-02-19 00:00:00'),
    (13, NULL, 8.0, 7.0, 3026.56, 'withdrawal', '2025-05-05 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 48, '2025-05-05 00:00:00'),
    (13, NULL, 1.0, 3.0, 215.95, 'income', '2025-05-19 00:00:00', 'Refund Processed', FALSE, 19.0, NULL, 15, '2025-05-19 00:00:00'),
    (13, 37.0, NULL, NULL, 2421.53, 'fee', '2025-06-23 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 11, '2025-06-23 00:00:00'),
    (13, 30.0, NULL, 5.0, 1304.9, 'expense', '2025-02-14 00:00:00', 'Monthly Rent Payment', FALSE, NULL, NULL, 38, '2025-02-14 00:00:00'),
    (13, 26.0, NULL, NULL, 2407.73, 'fee', '2025-04-05 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 7, '2025-04-05 00:00:00'),
    (13, 8.0, NULL, NULL, 1453.37, 'fee', '2025-06-04 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 3, '2025-06-04 00:00:00'),
    (13, 40.0, NULL, NULL, 1835.56, 'fee', '2025-05-14 00:00:00', 'ATM Withdrawal Fee', FALSE, 10.0, NULL, 49, '2025-05-14 00:00:00'),
    (13, 7.0, NULL, NULL, 439.75, 'fee', '2025-03-27 00:00:00', 'Service Charge', FALSE, NULL, NULL, 49, '2025-03-27 00:00:00'),
    (13, 6.0, NULL, 1.0, 2393.15, 'fee', '2025-02-22 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 30, '2025-02-22 00:00:00'),
    (13, NULL, 11.0, 4.0, 280.87, 'transfer', '2025-04-10 00:00:00', 'Transfer to Savings', FALSE, NULL, 2.0, 22, '2025-04-10 00:00:00'),
    (13, 9.0, NULL, NULL, 2509.1, 'fee', '2025-05-22 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, 3.0, 42, '2025-05-22 00:00:00'),
    (13, NULL, 4.0, 3.0, 4645.57, 'deposit', '2025-03-05 00:00:00', 'Cheque Deposit', FALSE, 14.0, 5.0, 40, '2025-03-05 00:00:00'),
    (13, NULL, 11.0, 9.0, 1377.13, 'deposit', '2025-04-24 00:00:00', 'Online Deposit', FALSE, NULL, 1.0, 43, '2025-04-24 00:00:00'),
    (13, NULL, 2.0, NULL, 1540.13, 'withdrawal', '2025-05-08 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 19, '2025-05-08 00:00:00'),
    (13, 2.0, NULL, NULL, 4493.49, 'fee', '2025-06-07 00:00:00', 'Monthly Account Fee', FALSE, 11.0, NULL, 41, '2025-06-07 00:00:00'),
    (13, 18.0, NULL, NULL, 4509.19, 'withdrawal', '2025-06-17 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 13, '2025-06-17 00:00:00'),
    (13, NULL, 5.0, NULL, 2906.84, 'withdrawal', '2025-02-01 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 4, '2025-02-01 00:00:00'),
    (13, NULL, 9.0, 7.0, 995.64, 'withdrawal', '2025-01-27 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, 5.0, 12, '2025-01-27 00:00:00'),
    (13, 23.0, NULL, 2.0, 139.01, 'income', '2025-01-23 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 41, '2025-01-23 00:00:00'),
    (13, 6.0, NULL, NULL, 64.37, 'withdrawal', '2025-03-04 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 14, '2025-03-04 00:00:00'),
    (13, NULL, 10.0, 9.0, 3021.54, 'expense', '2025-05-24 00:00:00', 'Grocery Store Purchase', FALSE, NULL, NULL, 46, '2025-05-24 00:00:00'),
    (13, 15.0, NULL, NULL, 3639.3, 'expense', '2025-03-20 00:00:00', 'Utility Bill Payment', FALSE, 8.0, NULL, 19, '2025-03-20 00:00:00'),
    (13, NULL, 3.0, 1.0, 3611.65, 'deposit', '2025-01-24 00:00:00', 'Online Deposit', FALSE, 23.0, 1.0, 13, '2025-01-24 00:00:00'),
    (13, NULL, 3.0, NULL, 400.26, 'transfer', '2025-06-09 00:00:00', 'Transfer to Savings', TRUE, NULL, NULL, 17, '2025-06-09 00:00:00'),
    (13, NULL, 10.0, NULL, 794.47, 'withdrawal', '2025-01-08 00:00:00', 'Cash Removed from Account', FALSE, 15.0, NULL, 42, '2025-01-08 00:00:00'),
    (13, NULL, 9.0, NULL, 748.87, 'fee', '2025-01-06 00:00:00', 'Monthly Account Fee', FALSE, 22.0, NULL, 6, '2025-01-06 00:00:00'),
    (13, 10.0, NULL, NULL, 1772.07, 'transfer', '2025-03-14 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 47, '2025-03-14 00:00:00'),
    (13, 41.0, NULL, NULL, 1854.77, 'withdrawal', '2025-02-08 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 20, '2025-02-08 00:00:00'),
    (13, 12.0, NULL, 7.0, 2303.63, 'fee', '2025-05-08 00:00:00', 'Service Charge', FALSE, 2.0, NULL, 40, '2025-05-08 00:00:00'),
    (13, 11.0, NULL, NULL, 115.23, 'expense', '2025-06-22 00:00:00', 'Coffee Shop', FALSE, NULL, NULL, 34, '2025-06-22 00:00:00'),
    (13, 39.0, NULL, NULL, 3422.13, 'expense', '2025-02-21 00:00:00', 'Fuel Station', TRUE, 10.0, NULL, 47, '2025-02-21 00:00:00'),
    (13, 9.0, NULL, 5.0, 674.87, 'withdrawal', '2025-01-22 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 49, '2025-01-22 00:00:00'),
    (13, 51.0, NULL, NULL, 2644.72, 'expense', '2025-05-22 00:00:00', 'Mobile Data Recharge', FALSE, NULL, NULL, 39, '2025-05-22 00:00:00'),
    (13, 5.0, NULL, 1.0, 2934.27, 'fee', '2025-02-13 00:00:00', 'Monthly Account Fee', FALSE, 17.0, NULL, 29, '2025-02-13 00:00:00'),
    (14, NULL, 8.0, 4.0, 4557.29, 'transfer', '2025-05-24 00:00:00', 'Transfer to Savings', FALSE, 17.0, 4.0, 41, '2025-05-24 00:00:00'),
    (14, 1.0, NULL, NULL, 4353.28, 'deposit', '2025-04-01 00:00:00', 'Cheque Deposit', FALSE, NULL, 3.0, 41, '2025-04-01 00:00:00'),
    (14, NULL, 11.0, NULL, 1442.58, 'fee', '2025-02-27 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 19, '2025-02-27 00:00:00'),
    (14, 11.0, NULL, NULL, 1090.89, 'income', '2025-01-11 00:00:00', 'Interest Income', FALSE, NULL, NULL, 28, '2025-01-11 00:00:00'),
    (14, NULL, 12.0, 6.0, 4245.77, 'expense', '2025-01-03 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 4, '2025-01-03 00:00:00'),
    (14, 42.0, NULL, 9.0, 2348.48, 'withdrawal', '2025-04-08 00:00:00', 'Cash Removed from Account', FALSE, 15.0, NULL, 5, '2025-04-08 00:00:00'),
    (14, 18.0, NULL, 7.0, 4588.83, 'fee', '2025-01-15 00:00:00', 'Monthly Account Fee', FALSE, 13.0, NULL, 9, '2025-01-15 00:00:00'),
    (14, 43.0, NULL, 8.0, 2966.03, 'withdrawal', '2025-06-28 00:00:00', 'ATM Cash Withdrawal', FALSE, 16.0, NULL, 48, '2025-06-28 00:00:00'),
    (14, NULL, 5.0, 5.0, 2594.0, 'withdrawal', '2025-06-09 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 18, '2025-06-09 00:00:00'),
    (14, NULL, 6.0, NULL, 4356.54, 'transfer', '2025-02-07 00:00:00', 'Transfer to Savings', TRUE, NULL, NULL, 27, '2025-02-07 00:00:00'),
    (14, 22.0, NULL, 1.0, 221.78, 'income', '2025-05-27 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 2, '2025-05-27 00:00:00'),
    (14, 11.0, NULL, NULL, 992.41, 'withdrawal', '2025-05-20 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 20, '2025-05-20 00:00:00'),
    (14, NULL, 2.0, NULL, 2739.89, 'withdrawal', '2025-03-13 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 19, '2025-03-13 00:00:00'),
    (14, 26.0, NULL, NULL, 4211.07, 'expense', '2025-02-05 00:00:00', 'Clothing Store Purchase', FALSE, 12.0, NULL, 6, '2025-02-05 00:00:00'),
    (14, 4.0, NULL, 6.0, 1845.51, 'income', '2025-01-29 00:00:00', 'Interest Income', FALSE, NULL, NULL, 15, '2025-01-29 00:00:00'),
    (14, 45.0, NULL, 3.0, 1450.35, 'income', '2025-06-16 00:00:00', 'Salary Payment', TRUE, 6.0, NULL, 39, '2025-06-16 00:00:00'),
    (14, 13.0, NULL, 1.0, 2783.71, 'income', '2025-02-15 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 3, '2025-02-15 00:00:00'),
    (14, NULL, 12.0, 8.0, 3644.75, 'transfer', '2025-04-09 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 23, '2025-04-09 00:00:00'),
    (14, 22.0, NULL, 1.0, 15.13, 'fee', '2025-03-03 00:00:00', 'Monthly Account Fee', FALSE, 9.0, 3.0, 35, '2025-03-03 00:00:00'),
    (14, 20.0, NULL, NULL, 4499.87, 'transfer', '2025-01-05 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 2, '2025-01-05 00:00:00'),
    (14, 12.0, NULL, 3.0, 4341.78, 'fee', '2025-02-16 00:00:00', 'Service Charge', TRUE, NULL, 5.0, 19, '2025-02-16 00:00:00'),
    (14, 12.0, NULL, 5.0, 829.18, 'income', '2025-06-30 00:00:00', 'Interest Income', FALSE, 2.0, NULL, 25, '2025-06-30 00:00:00'),
    (14, 50.0, NULL, 3.0, 3458.93, 'fee', '2025-03-15 00:00:00', 'Service Charge', FALSE, 15.0, NULL, 40, '2025-03-15 00:00:00'),
    (14, NULL, 8.0, NULL, 4819.41, 'income', '2025-06-07 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 14, '2025-06-07 00:00:00'),
    (14, 15.0, NULL, NULL, 3551.74, 'deposit', '2025-04-21 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, 2.0, 28, '2025-04-21 00:00:00'),
    (14, NULL, 2.0, 6.0, 1699.09, 'expense', '2025-03-11 00:00:00', 'Coffee Shop', FALSE, NULL, 2.0, 40, '2025-03-11 00:00:00'),
    (14, 36.0, NULL, NULL, 3435.24, 'income', '2025-05-09 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 15, '2025-05-09 00:00:00'),
    (14, 35.0, NULL, 6.0, 4835.0, 'deposit', '2025-02-23 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 0, '2025-02-23 00:00:00'),
    (14, 8.0, NULL, 4.0, 1284.14, 'income', '2025-05-27 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 37, '2025-05-27 00:00:00'),
    (14, NULL, 5.0, NULL, 1286.86, 'fee', '2025-05-13 00:00:00', 'ATM Withdrawal Fee', FALSE, 8.0, NULL, 12, '2025-05-13 00:00:00'),
    (14, 14.0, NULL, NULL, 2119.14, 'deposit', '2025-06-07 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 30, '2025-06-07 00:00:00'),
    (14, NULL, 13.0, 4.0, 1561.69, 'transfer', '2025-01-13 00:00:00', 'Transfer from Checking', FALSE, NULL, 4.0, 36, '2025-01-13 00:00:00'),
    (14, 40.0, NULL, NULL, 4050.14, 'withdrawal', '2025-06-06 00:00:00', 'Cash Removed from Account', FALSE, NULL, 1.0, 4, '2025-06-06 00:00:00'),
    (14, 16.0, NULL, 2.0, 2425.01, 'fee', '2025-01-24 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 24, '2025-01-24 00:00:00'),
    (14, NULL, 8.0, NULL, 4373.73, 'transfer', '2025-01-03 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 9, '2025-01-03 00:00:00'),
    (14, 13.0, NULL, 9.0, 2355.85, 'fee', '2025-02-22 00:00:00', 'ATM Withdrawal Fee', FALSE, 22.0, 4.0, 37, '2025-02-22 00:00:00'),
    (14, 50.0, NULL, 8.0, 2236.05, 'transfer', '2025-04-18 00:00:00', 'Transfer to Savings', FALSE, 22.0, NULL, 2, '2025-04-18 00:00:00'),
    (14, 26.0, NULL, 3.0, 3034.29, 'income', '2025-04-16 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 47, '2025-04-16 00:00:00'),
    (14, 13.0, NULL, NULL, 2674.38, 'deposit', '2025-02-28 00:00:00', 'Cheque Deposit', FALSE, 11.0, NULL, 13, '2025-02-28 00:00:00'),
    (14, 37.0, NULL, NULL, 4134.44, 'withdrawal', '2025-04-30 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 36, '2025-04-30 00:00:00'),
    (15, 28.0, NULL, 7.0, 4988.79, 'transfer', '2025-02-16 00:00:00', 'Transfer from Checking', FALSE, NULL, 3.0, 40, '2025-02-16 00:00:00'),
    (15, NULL, 6.0, 3.0, 1306.13, 'expense', '2025-03-24 00:00:00', 'Coffee Shop', TRUE, NULL, NULL, 47, '2025-03-24 00:00:00'),
    (15, 3.0, NULL, 7.0, 3806.8, 'expense', '2025-02-24 00:00:00', 'Utility Bill Payment', FALSE, NULL, NULL, 12, '2025-02-24 00:00:00'),
    (15, NULL, 8.0, NULL, 4093.07, 'income', '2025-06-14 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 8, '2025-06-14 00:00:00'),
    (15, NULL, 4.0, 1.0, 4261.8, 'expense', '2025-02-07 00:00:00', 'Mobile Data Recharge', FALSE, NULL, NULL, 10, '2025-02-07 00:00:00'),
    (15, 37.0, NULL, NULL, 1085.84, 'transfer', '2025-01-07 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 0, '2025-01-07 00:00:00'),
    (15, NULL, 11.0, 5.0, 2998.58, 'deposit', '2025-03-01 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 13, '2025-03-01 00:00:00'),
    (15, 7.0, NULL, NULL, 2643.91, 'fee', '2025-02-05 00:00:00', 'ATM Withdrawal Fee', TRUE, NULL, NULL, 12, '2025-02-05 00:00:00'),
    (15, 17.0, NULL, 4.0, 2835.61, 'transfer', '2025-02-05 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 40, '2025-02-05 00:00:00'),
    (15, NULL, 3.0, NULL, 3844.39, 'transfer', '2025-06-28 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 2, '2025-06-28 00:00:00'),
    (15, 22.0, NULL, 3.0, 1578.91, 'expense', '2025-03-25 00:00:00', 'Mobile Data Recharge', FALSE, NULL, NULL, 22, '2025-03-25 00:00:00'),
    (15, 35.0, NULL, NULL, 2893.79, 'deposit', '2025-06-08 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 0, '2025-06-08 00:00:00'),
    (15, 50.0, NULL, 4.0, 4710.99, 'deposit', '2025-03-14 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 7, '2025-03-14 00:00:00'),
    (15, 29.0, NULL, NULL, 2013.76, 'withdrawal', '2025-01-01 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 24, '2025-01-01 00:00:00'),
    (15, NULL, 8.0, NULL, 868.58, 'withdrawal', '2025-06-06 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 7, '2025-06-06 00:00:00'),
    (15, 40.0, NULL, NULL, 3096.28, 'expense', '2025-05-29 00:00:00', 'Coffee Shop', FALSE, NULL, 4.0, 47, '2025-05-29 00:00:00'),
    (15, NULL, 7.0, 8.0, 621.47, 'fee', '2025-06-20 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 4, '2025-06-20 00:00:00'),
    (15, 36.0, NULL, NULL, 2114.36, 'expense', '2025-05-12 00:00:00', 'Coffee Shop', FALSE, 13.0, NULL, 4, '2025-05-12 00:00:00'),
    (15, NULL, 2.0, NULL, 4982.96, 'deposit', '2025-01-18 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 7, '2025-01-18 00:00:00'),
    (15, 23.0, NULL, 5.0, 1130.03, 'deposit', '2025-03-07 00:00:00', 'Cash Deposit at Branch', FALSE, 4.0, 4.0, 11, '2025-03-07 00:00:00'),
    (15, NULL, 9.0, 6.0, 1460.27, 'expense', '2025-03-10 00:00:00', 'Fuel Station', FALSE, NULL, 4.0, 40, '2025-03-10 00:00:00'),
    (15, NULL, 12.0, NULL, 1982.53, 'income', '2025-05-28 00:00:00', 'Dividend Payment', TRUE, NULL, NULL, 8, '2025-05-28 00:00:00'),
    (15, 24.0, NULL, NULL, 3746.0, 'transfer', '2025-05-29 00:00:00', 'Transfer to Savings', FALSE, 3.0, NULL, 44, '2025-05-29 00:00:00'),
    (15, 27.0, NULL, NULL, 581.03, 'withdrawal', '2025-05-25 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 4, '2025-05-25 00:00:00'),
    (24, 8.0, NULL, NULL, 1685.03, 'withdrawal', '2025-03-31 00:00:00', 'Cash Removed from Account', FALSE, 5.0, NULL, 15, '2025-03-31 00:00:00'),
    (24, NULL, 4.0, NULL, 2885.83, 'fee', '2025-01-04 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 26, '2025-01-04 00:00:00'),
    (24, 17.0, NULL, 2.0, 3281.66, 'expense', '2025-06-22 00:00:00', 'Monthly Rent Payment', FALSE, 12.0, NULL, 35, '2025-06-22 00:00:00'),
    (24, 51.0, NULL, 4.0, 4496.06, 'fee', '2025-04-14 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 0, '2025-04-14 00:00:00'),
    (24, NULL, 10.0, NULL, 2637.61, 'deposit', '2025-06-08 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 21, '2025-06-08 00:00:00'),
    (24, 13.0, NULL, 6.0, 4276.49, 'fee', '2025-01-11 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 2, '2025-01-11 00:00:00'),
    (24, NULL, 8.0, 6.0, 4784.2, 'deposit', '2025-02-21 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 28, '2025-02-21 00:00:00'),
    (24, NULL, 13.0, NULL, 1647.79, 'deposit', '2025-06-12 00:00:00', 'Online Deposit', FALSE, 12.0, NULL, 49, '2025-06-12 00:00:00'),
    (24, 1.0, NULL, 8.0, 4417.81, 'expense', '2025-05-02 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 16, '2025-05-02 00:00:00'),
    (24, 39.0, NULL, 6.0, 1805.32, 'expense', '2025-04-15 00:00:00', 'Grocery Store Purchase', FALSE, NULL, NULL, 26, '2025-04-15 00:00:00'),
    (24, 24.0, NULL, NULL, 4188.93, 'withdrawal', '2025-05-20 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 26, '2025-05-20 00:00:00'),
    (24, 44.0, NULL, NULL, 3605.77, 'deposit', '2025-04-30 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 0, '2025-04-30 00:00:00'),
    (24, NULL, 8.0, 3.0, 723.46, 'income', '2025-04-11 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 23, '2025-04-11 00:00:00'),
    (24, 1.0, NULL, 8.0, 190.5, 'withdrawal', '2025-06-13 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 36, '2025-06-13 00:00:00'),
    (24, 22.0, NULL, NULL, 137.86, 'income', '2025-05-16 00:00:00', 'Bonus Received', FALSE, NULL, 1.0, 10, '2025-05-16 00:00:00'),
    (24, 49.0, NULL, 1.0, 1100.26, 'withdrawal', '2025-03-04 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 17, '2025-03-04 00:00:00'),
    (24, NULL, 7.0, 5.0, 1531.23, 'deposit', '2025-03-26 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 15, '2025-03-26 00:00:00'),
    (24, 48.0, NULL, 1.0, 4478.87, 'transfer', '2025-02-03 00:00:00', 'Bank Internal Transfer', FALSE, 8.0, 4.0, 37, '2025-02-03 00:00:00'),
    (24, 39.0, NULL, 8.0, 560.57, 'deposit', '2025-02-05 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 31, '2025-02-05 00:00:00'),
    (24, NULL, 6.0, 7.0, 1563.12, 'fee', '2025-05-11 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, 1.0, 9, '2025-05-11 00:00:00'),
    (24, NULL, 13.0, 9.0, 1897.98, 'deposit', '2025-05-15 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 6, '2025-05-15 00:00:00'),
    (24, NULL, 11.0, NULL, 1892.36, 'fee', '2025-05-12 00:00:00', 'Service Charge', FALSE, 10.0, NULL, 19, '2025-05-12 00:00:00'),
    (24, 42.0, NULL, 1.0, 4576.52, 'income', '2025-02-11 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 45, '2025-02-11 00:00:00'),
    (24, 26.0, NULL, 2.0, 4611.3, 'deposit', '2025-05-30 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 17, '2025-05-30 00:00:00'),
    (24, NULL, 2.0, 2.0, 3508.32, 'expense', '2025-01-22 00:00:00', 'Mobile Data Recharge', FALSE, NULL, NULL, 31, '2025-01-22 00:00:00'),
    (24, NULL, 8.0, 7.0, 1425.49, 'withdrawal', '2025-03-17 00:00:00', 'Cash Removed from Account', FALSE, 6.0, NULL, 6, '2025-03-17 00:00:00'),
    (24, 51.0, NULL, 5.0, 4668.92, 'deposit', '2025-05-31 00:00:00', 'Cash Deposit at Branch', TRUE, NULL, 3.0, 37, '2025-05-31 00:00:00'),
    (24, 21.0, NULL, NULL, 4382.28, 'deposit', '2025-02-01 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 20, '2025-02-01 00:00:00'),
    (24, 27.0, NULL, NULL, 2796.53, 'expense', '2025-05-21 00:00:00', 'Coffee Shop', FALSE, NULL, NULL, 42, '2025-05-21 00:00:00'),
    (24, 39.0, NULL, 1.0, 741.73, 'withdrawal', '2025-02-23 00:00:00', 'ATM Cash Withdrawal', FALSE, 2.0, NULL, 19, '2025-02-23 00:00:00'),
    (24, 10.0, NULL, 8.0, 2475.62, 'income', '2025-06-20 00:00:00', 'Bonus Received', TRUE, NULL, 5.0, 36, '2025-06-20 00:00:00'),
    (24, 20.0, NULL, 2.0, 3740.87, 'expense', '2025-03-08 00:00:00', 'Fuel Station', FALSE, NULL, NULL, 17, '2025-03-08 00:00:00'),
    (24, 4.0, NULL, 7.0, 4613.97, 'expense', '2025-05-06 00:00:00', 'Utility Bill Payment', FALSE, 16.0, NULL, 37, '2025-05-06 00:00:00'),
    (24, 4.0, NULL, NULL, 675.71, 'expense', '2025-02-04 00:00:00', 'Mobile Data Recharge', FALSE, 1.0, NULL, 23, '2025-02-04 00:00:00'),
    (24, NULL, 8.0, NULL, 3778.03, 'expense', '2025-01-22 00:00:00', 'Utility Bill Payment', FALSE, NULL, NULL, 25, '2025-01-22 00:00:00'),
    (24, NULL, 13.0, 5.0, 2560.01, 'deposit', '2025-03-15 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 21, '2025-03-15 00:00:00'),
    (24, 39.0, NULL, 7.0, 2398.79, 'fee', '2025-04-20 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 46, '2025-04-20 00:00:00'),
    (24, 39.0, NULL, NULL, 2397.77, 'fee', '2025-01-21 00:00:00', 'Service Charge', FALSE, NULL, NULL, 35, '2025-01-21 00:00:00'),
    (24, 13.0, NULL, NULL, 1293.11, 'income', '2025-06-08 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 28, '2025-06-08 00:00:00'),
    (24, 20.0, NULL, NULL, 3069.36, 'income', '2025-04-28 00:00:00', 'Interest Income', FALSE, NULL, NULL, 22, '2025-04-28 00:00:00'),
    (24, 37.0, NULL, NULL, 2415.21, 'withdrawal', '2025-01-28 00:00:00', 'Cash Removed from Account', FALSE, 13.0, NULL, 14, '2025-01-28 00:00:00'),
    (24, 14.0, NULL, 8.0, 1155.63, 'income', '2025-04-03 00:00:00', 'Bonus Received', TRUE, NULL, NULL, 4, '2025-04-03 00:00:00'),
    (24, 31.0, NULL, 8.0, 4048.03, 'transfer', '2025-06-29 00:00:00', 'Transfer from Checking', FALSE, 6.0, NULL, 8, '2025-06-29 00:00:00'),
    (24, NULL, 6.0, 7.0, 262.19, 'deposit', '2025-04-08 00:00:00', 'Online Deposit', FALSE, NULL, NULL, 26, '2025-04-08 00:00:00'),
    (24, NULL, 13.0, NULL, 2424.22, 'withdrawal', '2025-02-12 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 24, '2025-02-12 00:00:00'),
    (24, 6.0, NULL, 7.0, 3632.09, 'expense', '2025-04-16 00:00:00', 'Fuel Station', TRUE, NULL, NULL, 19, '2025-04-16 00:00:00'),
    (24, NULL, 4.0, NULL, 4671.11, 'expense', '2025-05-16 00:00:00', 'Fuel Station', FALSE, NULL, NULL, 27, '2025-05-16 00:00:00'),
    (24, 36.0, NULL, 7.0, 3917.15, 'fee', '2025-06-03 00:00:00', 'Monthly Account Fee', FALSE, NULL, 3.0, 11, '2025-06-03 00:00:00'),
    (24, 45.0, NULL, NULL, 4454.47, 'income', '2025-04-22 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 1, '2025-04-22 00:00:00'),
    (23, 30.0, NULL, 2.0, 4683.36, 'fee', '2025-06-10 00:00:00', 'Monthly Account Fee', TRUE, NULL, NULL, 11, '2025-06-10 00:00:00'),
    (23, 45.0, NULL, NULL, 2553.89, 'withdrawal', '2025-04-17 00:00:00', 'ATM Cash Withdrawal', FALSE, 18.0, NULL, 23, '2025-04-17 00:00:00'),
    (23, 7.0, NULL, NULL, 871.2, 'income', '2025-02-19 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 19, '2025-02-19 00:00:00'),
    (23, 38.0, NULL, NULL, 1874.82, 'withdrawal', '2025-06-15 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 32, '2025-06-15 00:00:00'),
    (23, 46.0, NULL, 5.0, 2542.61, 'fee', '2025-01-24 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, 3.0, 16, '2025-01-24 00:00:00'),
    (23, 24.0, NULL, NULL, 2022.35, 'transfer', '2025-01-19 00:00:00', 'Transfer from Checking', TRUE, NULL, NULL, 25, '2025-01-19 00:00:00'),
    (23, NULL, 1.0, 2.0, 4980.48, 'fee', '2025-04-01 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, 4.0, 30, '2025-04-01 00:00:00'),
    (23, 3.0, NULL, NULL, 4125.81, 'fee', '2025-04-15 00:00:00', 'ATM Withdrawal Fee', FALSE, 18.0, NULL, 5, '2025-04-15 00:00:00'),
    (23, 51.0, NULL, 9.0, 2386.17, 'fee', '2025-02-08 00:00:00', 'Service Charge', TRUE, NULL, NULL, 6, '2025-02-08 00:00:00'),
    (23, 24.0, NULL, NULL, 219.23, 'transfer', '2025-01-14 00:00:00', 'Transfer from Checking', FALSE, NULL, 2.0, 15, '2025-01-14 00:00:00'),
    (23, 36.0, NULL, NULL, 2281.16, 'transfer', '2025-01-10 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 31, '2025-01-10 00:00:00'),
    (23, NULL, 2.0, NULL, 4490.73, 'withdrawal', '2025-04-30 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 23, '2025-04-30 00:00:00'),
    (23, 4.0, NULL, 5.0, 3801.01, 'transfer', '2025-05-13 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 25, '2025-05-13 00:00:00'),
    (23, 49.0, NULL, NULL, 98.51, 'withdrawal', '2025-05-30 00:00:00', 'ATM Cash Withdrawal', FALSE, 6.0, 1.0, 32, '2025-05-30 00:00:00'),
    (23, 15.0, NULL, 5.0, 1423.76, 'withdrawal', '2025-01-06 00:00:00', 'Cash Removed from Account', FALSE, 18.0, NULL, 20, '2025-01-06 00:00:00'),
    (23, 8.0, NULL, 6.0, 4696.77, 'fee', '2025-01-12 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, 4.0, 40, '2025-01-12 00:00:00'),
    (23, 20.0, NULL, NULL, 685.84, 'fee', '2025-05-13 00:00:00', 'Service Charge', FALSE, 21.0, NULL, 35, '2025-05-13 00:00:00'),
    (23, 6.0, NULL, NULL, 2485.63, 'income', '2025-06-07 00:00:00', 'Dividend Payment', FALSE, NULL, NULL, 50, '2025-06-07 00:00:00'),
    (23, 45.0, NULL, NULL, 820.05, 'transfer', '2025-01-31 00:00:00', 'Bank Internal Transfer', FALSE, 19.0, NULL, 50, '2025-01-31 00:00:00'),
    (23, NULL, 1.0, 4.0, 2728.98, 'expense', '2025-03-26 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 20, '2025-03-26 00:00:00'),
    (23, 42.0, NULL, 8.0, 2643.12, 'withdrawal', '2025-03-31 00:00:00', 'Cash Removed from Account', FALSE, 9.0, NULL, 45, '2025-03-31 00:00:00'),
    (23, NULL, 5.0, 8.0, 175.16, 'expense', '2025-06-06 00:00:00', 'Public Transport Fare', FALSE, NULL, NULL, 27, '2025-06-06 00:00:00'),
    (23, 38.0, NULL, 5.0, 2449.56, 'fee', '2025-05-31 00:00:00', 'Service Charge', FALSE, NULL, NULL, 35, '2025-05-31 00:00:00'),
    (23, NULL, 3.0, 7.0, 1751.13, 'transfer', '2025-05-21 00:00:00', 'Transfer from Checking', FALSE, 1.0, NULL, 24, '2025-05-21 00:00:00'),
    (23, 36.0, NULL, 4.0, 1690.59, 'withdrawal', '2025-01-21 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 44, '2025-01-21 00:00:00'),
    (23, 1.0, NULL, NULL, 3879.99, 'expense', '2025-05-14 00:00:00', 'Restaurant Dinner', FALSE, 17.0, NULL, 50, '2025-05-14 00:00:00'),
    (23, 42.0, NULL, NULL, 1098.87, 'expense', '2025-04-24 00:00:00', 'Public Transport Fare', FALSE, NULL, NULL, 30, '2025-04-24 00:00:00'),
    (23, NULL, 7.0, 9.0, 2124.72, 'expense', '2025-06-05 00:00:00', 'Monthly Rent Payment', FALSE, NULL, NULL, 15, '2025-06-05 00:00:00'),
    (23, 38.0, NULL, NULL, 3174.57, 'transfer', '2025-05-07 00:00:00', 'Transfer from Checking', TRUE, 4.0, NULL, 42, '2025-05-07 00:00:00'),
    (23, NULL, 6.0, NULL, 1107.66, 'expense', '2025-03-15 00:00:00', 'Public Transport Fare', FALSE, NULL, NULL, 5, '2025-03-15 00:00:00'),
    (23, 50.0, NULL, NULL, 3673.11, 'expense', '2025-04-11 00:00:00', 'Clothing Store Purchase', FALSE, NULL, NULL, 25, '2025-04-11 00:00:00'),
    (23, 24.0, NULL, NULL, 1432.99, 'expense', '2025-04-23 00:00:00', 'Streaming Subscription', FALSE, NULL, NULL, 22, '2025-04-23 00:00:00'),
    (23, 4.0, NULL, 2.0, 4936.52, 'income', '2025-04-27 00:00:00', 'Refund Processed', FALSE, 14.0, NULL, 0, '2025-04-27 00:00:00'),
    (23, 13.0, NULL, NULL, 4469.79, 'deposit', '2025-05-27 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 50, '2025-05-27 00:00:00'),
    (23, 38.0, NULL, 3.0, 4872.99, 'withdrawal', '2025-01-29 00:00:00', 'ATM Cash Withdrawal', FALSE, 13.0, NULL, 25, '2025-01-29 00:00:00'),
    (23, 41.0, NULL, 4.0, 1170.66, 'transfer', '2025-01-14 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 15, '2025-01-14 00:00:00'),
    (23, 49.0, NULL, NULL, 4756.75, 'fee', '2025-01-07 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 22, '2025-01-07 00:00:00'),
    (23, NULL, 8.0, NULL, 2666.04, 'deposit', '2025-05-27 00:00:00', 'Cheque Deposit', FALSE, 11.0, NULL, 23, '2025-05-27 00:00:00'),
    (23, 35.0, NULL, 4.0, 3582.88, 'expense', '2025-06-22 00:00:00', 'Monthly Rent Payment', FALSE, NULL, NULL, 23, '2025-06-22 00:00:00'),
    (23, 44.0, NULL, 4.0, 2304.28, 'withdrawal', '2025-05-09 00:00:00', 'Cash Removed from Account', FALSE, 1.0, NULL, 44, '2025-05-09 00:00:00'),
    (23, 50.0, NULL, NULL, 4498.07, 'expense', '2025-06-07 00:00:00', 'Public Transport Fare', FALSE, NULL, NULL, 38, '2025-06-07 00:00:00'),
    (23, 15.0, NULL, 3.0, 4010.99, 'fee', '2025-06-17 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 21, '2025-06-17 00:00:00'),
    (23, 11.0, NULL, 1.0, 4795.72, 'transfer', '2025-03-28 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 14, '2025-03-28 00:00:00'),
    (23, 25.0, NULL, 4.0, 4721.4, 'income', '2025-04-14 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 41, '2025-04-14 00:00:00'),
    (23, 3.0, NULL, 4.0, 204.99, 'withdrawal', '2025-04-24 00:00:00', 'Cash Removed from Account', FALSE, NULL, 2.0, 35, '2025-04-24 00:00:00'),
    (23, 48.0, NULL, 1.0, 2443.2, 'withdrawal', '2025-06-15 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 13, '2025-06-15 00:00:00'),
    (23, 17, NULL, NULL, 2684.45, 'income', '2025-03-17 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 21, '2025-03-17 00:00:00'),
    (23, 17.0, NULL, NULL, 3245.86, 'transfer', '2025-05-29 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 31, '2025-05-29 00:00:00'),
    (23, NULL, 1.0, NULL, 1961.75, 'expense', '2025-03-09 00:00:00', 'Mobile Data Recharge', FALSE, NULL, 4.0, 17, '2025-03-09 00:00:00'),
    (23, 50.0, NULL, 8.0, 29.97, 'expense', '2025-03-20 00:00:00', 'Fuel Station', FALSE, NULL, NULL, 30, '2025-03-20 00:00:00'),
    (23, 23.0, NULL, 6.0, 616.26, 'transfer', '2025-05-15 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 29, '2025-05-15 00:00:00'),
    (22, NULL, 6.0, NULL, 2680.52, 'fee', '2025-06-22 00:00:00', 'Monthly Account Fee', FALSE, 16.0, NULL, 16, '2025-06-22 00:00:00'),
    (22, 26.0, NULL, NULL, 3245.69, 'transfer', '2025-06-25 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 10, '2025-06-25 00:00:00'),
    (22, 10.0, NULL, NULL, 2777.21, 'income', '2025-03-27 00:00:00', 'Refund Processed', TRUE, NULL, NULL, 47, '2025-03-27 00:00:00'),
    (22, 22.0, NULL, 1.0, 2839.13, 'transfer', '2025-06-04 00:00:00', 'Bank Internal Transfer', FALSE, NULL, 1.0, 33, '2025-06-04 00:00:00'),
    (22, NULL, 2.0, 6.0, 262.33, 'transfer', '2025-06-13 00:00:00', 'Bank Internal Transfer', FALSE, NULL, NULL, 40, '2025-06-13 00:00:00'),
    (22, 10.0, NULL, NULL, 4784.02, 'expense', '2025-05-24 00:00:00', 'Utility Bill Payment', TRUE, NULL, NULL, 49, '2025-05-24 00:00:00'),
    (22, 10.0, NULL, 2.0, 4948.75, 'deposit', '2025-05-02 00:00:00', 'Cheque Deposit', FALSE, 3.0, NULL, 4, '2025-05-02 00:00:00'),
    (22, 30.0, NULL, 5.0, 1068.53, 'expense', '2025-05-24 00:00:00', 'Coffee Shop', FALSE, NULL, NULL, 46, '2025-05-24 00:00:00'),
    (22, NULL, 10.0, NULL, 1047.1, 'fee', '2025-06-11 00:00:00', 'Monthly Account Fee', FALSE, 19.0, NULL, 15, '2025-06-11 00:00:00'),
    (22, 11.0, NULL, 5.0, 2363.04, 'fee', '2025-01-23 00:00:00', 'Service Charge', FALSE, NULL, NULL, 16, '2025-01-23 00:00:00'),
    (22, 6.0, NULL, NULL, 4293.83, 'withdrawal', '2025-04-18 00:00:00', 'Cash Removed from Account', FALSE, NULL, 5.0, 29, '2025-04-18 00:00:00'),
    (21, 21.0, NULL, 2.0, 550.57, 'transfer', '2025-04-17 00:00:00', 'Bank Internal Transfer', FALSE, 10.0, NULL, 29, '2025-04-17 00:00:00'),
    (21, 16.0, NULL, NULL, 2830.38, 'deposit', '2025-05-25 00:00:00', 'Cheque Deposit', FALSE, NULL, 4.0, 39, '2025-05-25 00:00:00'),
    (21, 10.0, NULL, 2.0, 2899.21, 'income', '2025-05-13 00:00:00', 'Freelance Project Payment', FALSE, NULL, NULL, 44, '2025-05-13 00:00:00'),
    (21, NULL, 1.0, 2.0, 999.21, 'income', '2025-01-26 00:00:00', 'Salary Payment', FALSE, NULL, NULL, 10, '2025-01-26 00:00:00'),
    (21, NULL, 11.0, NULL, 1142.63, 'fee', '2025-04-25 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 8, '2025-04-25 00:00:00'),
    (21, 20.0, NULL, 6.0, 2411.29, 'transfer', '2025-04-25 00:00:00', 'Transfer to Savings', TRUE, NULL, NULL, 45, '2025-04-25 00:00:00'),
    (21, NULL, 8.0, 9.0, 1183.72, 'transfer', '2025-03-28 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 33, '2025-03-28 00:00:00'),
    (21, 11.0, NULL, NULL, 1254.15, 'income', '2025-06-06 00:00:00', 'Refund Processed', FALSE, NULL, NULL, 24, '2025-06-06 00:00:00'),
    (21, NULL, 9.0, 8.0, 4907.44, 'transfer', '2025-04-09 00:00:00', 'Transfer from Checking', TRUE, 14.0, NULL, 49, '2025-04-09 00:00:00'),
    (21, 40.0, NULL, 3.0, 2157.43, 'income', '2025-02-09 00:00:00', 'Freelance Project Payment', FALSE, NULL, 3.0, 28, '2025-02-09 00:00:00'),
    (21, NULL, 8.0, NULL, 3840.71, 'fee', '2025-06-03 00:00:00', 'Monthly Account Fee', FALSE, NULL, NULL, 25, '2025-06-03 00:00:00'),
    (21, 19.0, NULL, 7.0, 377.77, 'expense', '2025-01-26 00:00:00', 'Grocery Store Purchase', FALSE, NULL, 1.0, 4, '2025-01-26 00:00:00'),
    (21, 15.0, NULL, 1.0, 4982.32, 'income', '2025-04-10 00:00:00', 'Interest Income', FALSE, NULL, NULL, 42, '2025-04-10 00:00:00'),
    (21, 12.0, NULL, 1.0, 2824.39, 'withdrawal', '2025-05-19 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 33, '2025-05-19 00:00:00'),
    (21, 51.0, NULL, 8.0, 333.52, 'income', '2025-02-08 00:00:00', 'Dividend Payment', FALSE, 20.0, NULL, 21, '2025-02-08 00:00:00'),
    (21, NULL, 5.0, NULL, 3979.7, 'transfer', '2025-01-25 00:00:00', 'Transfer to Savings', FALSE, 14.0, 1.0, 8, '2025-01-25 00:00:00'),
    (21, NULL, 5.0, NULL, 368.68, 'income', '2025-05-05 00:00:00', 'Bonus Received', FALSE, NULL, NULL, 22, '2025-05-05 00:00:00'),
    (21, 41.0, NULL, NULL, 1780.55, 'expense', '2025-04-13 00:00:00', 'Utility Bill Payment', FALSE, NULL, NULL, 45, '2025-04-13 00:00:00'),
    (21, NULL, 6.0, NULL, 4164.68, 'expense', '2025-04-12 00:00:00', 'Restaurant Dinner', FALSE, 20.0, NULL, 20, '2025-04-12 00:00:00'),
    (21, NULL, 6.0, 9.0, 1977.91, 'withdrawal', '2025-03-19 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 46, '2025-03-19 00:00:00'),
    (21, NULL, 6.0, NULL, 3193.18, 'transfer', '2025-01-13 00:00:00', 'Transfer from Checking', TRUE, 23.0, NULL, 36, '2025-01-13 00:00:00'),
    (21, 29.0, NULL, 9.0, 2831.52, 'income', '2025-06-17 00:00:00', 'Interest Income', FALSE, NULL, NULL, 45, '2025-06-17 00:00:00'),
    (21, 48.0, NULL, NULL, 228.92, 'deposit', '2025-05-23 00:00:00', 'Cheque Deposit', FALSE, NULL, NULL, 45, '2025-05-23 00:00:00'),
    (21, 21.0, NULL, NULL, 4109.89, 'income', '2025-02-27 00:00:00', 'Refund Processed', TRUE, 18.0, NULL, 41, '2025-02-27 00:00:00'),
    (21, NULL, 7.0, 1.0, 3685.23, 'deposit', '2025-03-14 00:00:00', 'Cash Deposit at Branch', FALSE, 14.0, NULL, 0, '2025-03-14 00:00:00'),
    (21, 3.0, NULL, 4.0, 2583.1, 'fee', '2025-06-02 00:00:00', 'Service Charge', FALSE, 22.0, NULL, 37, '2025-06-02 00:00:00'),
    (21, 49.0, NULL, 1.0, 2575.0, 'income', '2025-02-09 00:00:00', 'Dividend Payment', FALSE, 7.0, NULL, 5, '2025-02-09 00:00:00'),
    (21, NULL, 3.0, 2.0, 738.55, 'income', '2025-04-23 00:00:00', 'Bonus Received', FALSE, 18.0, NULL, 27, '2025-04-23 00:00:00'),
    (21, 45.0, NULL, NULL, 1457.89, 'deposit', '2025-03-25 00:00:00', 'Cash Deposit at Branch', FALSE, NULL, NULL, 47, '2025-03-25 00:00:00'),
    (21, 25.0, NULL, 8.0, 1211.08, 'fee', '2025-06-21 00:00:00', 'Monthly Account Fee', TRUE, NULL, NULL, 39, '2025-06-21 00:00:00'),
    (21, 29.0, NULL, NULL, 1555.87, 'expense', '2025-06-13 00:00:00', 'Grocery Store Purchase', FALSE, 7.0, NULL, 38, '2025-06-13 00:00:00'),
    (21, NULL, 12.0, 9.0, 4185.63, 'fee', '2025-06-10 00:00:00', 'Service Charge', FALSE, NULL, NULL, 39, '2025-06-10 00:00:00'),
    (21, 10.0, NULL, NULL, 1792.76, 'transfer', '2025-02-26 00:00:00', 'Transfer to Savings', TRUE, NULL, NULL, 11, '2025-02-26 00:00:00'),
    (21, NULL, 1.0, 3.0, 3664.14, 'fee', '2025-04-03 00:00:00', 'ATM Withdrawal Fee', FALSE, NULL, NULL, 9, '2025-04-03 00:00:00'),
    (21, 5.0, NULL, 8.0, 2250.81, 'expense', '2025-05-08 00:00:00', 'Clothing Store Purchase', FALSE, NULL, NULL, 47, '2025-05-08 00:00:00'),
    (21, 25.0, NULL, 8.0, 3909.79, 'withdrawal', '2025-06-09 00:00:00', 'ATM Cash Withdrawal', FALSE, NULL, NULL, 45, '2025-06-09 00:00:00'),
    (21, NULL, 7.0, NULL, 2869.71, 'transfer', '2025-03-14 00:00:00', 'Transfer from Checking', TRUE, 17.0, NULL, 21, '2025-03-14 00:00:00'),
    (21, 23.0, NULL, NULL, 1415.72, 'withdrawal', '2025-05-07 00:00:00', 'ATM Cash Withdrawal', TRUE, NULL, NULL, 19, '2025-05-07 00:00:00'),
    (21, NULL, 1.0, 6.0, 1821.54, 'deposit', '2025-04-26 00:00:00', 'Online Deposit', TRUE, NULL, NULL, 18, '2025-04-26 00:00:00'),
    (21, NULL, 8.0, NULL, 989.64, 'fee', '2025-04-18 00:00:00', 'ATM Withdrawal Fee', FALSE, 14.0, NULL, 1, '2025-04-18 00:00:00'),
    (21, 32.0, NULL, 9.0, 387.8, 'expense', '2025-05-01 00:00:00', 'Restaurant Dinner', FALSE, NULL, NULL, 32, '2025-05-01 00:00:00'),
    (21, 43.0, NULL, NULL, 873.46, 'transfer', '2025-03-11 00:00:00', 'Transfer from Checking', FALSE, NULL, 4.0, 39, '2025-03-11 00:00:00'),
    (21, NULL, 12.0, NULL, 4062.86, 'deposit', '2025-02-06 00:00:00', 'Cheque Deposit', FALSE, 7.0, NULL, 22, '2025-02-06 00:00:00'),
    (21, 42.0, NULL, 5.0, 1578.58, 'transfer', '2025-06-22 00:00:00', 'Transfer to Savings', FALSE, NULL, NULL, 30, '2025-06-22 00:00:00'),
    (21, NULL, 1.0, 7.0, 4143.0, 'expense', '2025-02-09 00:00:00', 'Grocery Store Purchase', FALSE, 18.0, NULL, 11, '2025-02-09 00:00:00'),
    (21, 6.0, NULL, 9.0, 2438.92, 'expense', '2025-03-15 00:00:00', 'Monthly Rent Payment', TRUE, NULL, NULL, 13, '2025-03-15 00:00:00'),
    (21, 4.0, NULL, 8.0, 1607.75, 'withdrawal', '2025-04-15 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 37, '2025-04-15 00:00:00'),
    (21, 19.0, NULL, NULL, 889.37, 'withdrawal', '2025-01-08 00:00:00', 'ATM Cash Withdrawal', TRUE, NULL, NULL, 18, '2025-01-08 00:00:00'),
    (21, 10.0, NULL, 8.0, 2556.09, 'income', '2025-01-29 00:00:00', 'Dividend Payment', FALSE, NULL, NULL, 1, '2025-01-29 00:00:00'),
    (21, 3.0, NULL, NULL, 4459.21, 'deposit', '2025-01-16 00:00:00', 'Online Deposit', TRUE, 21.0, NULL, 17, '2025-01-16 00:00:00'),
    (21, NULL, 6.0, NULL, 159.74, 'withdrawal', '2025-06-13 00:00:00', 'Cash Removed from Account', FALSE, NULL, NULL, 21, '2025-06-13 00:00:00'),
    (21, NULL, 2.0, 7.0, 2287.47, 'transfer', '2025-02-19 00:00:00', 'Transfer from Checking', FALSE, NULL, NULL, 28, '2025-02-19 00:00:00'),
    (21, 38.0, NULL, NULL, 1303.77, 'withdrawal', '2025-05-21 00:00:00', 'Cash Removed from Account', FALSE, NULL, 2.0, 42, '2025-05-21 00:00:00');

INSERT INTO recurring_transactions (transaction_id, frequency, next_occurrence, end_date, last_run, is_active, created_at) VALUES 
    (4, 'yearly', '2025-03-14', '2025-06-01', '2025-02-12', TRUE, '2025-02-12 00:00:00'),
    (5, 'weekly', '2025-06-20', '2025-08-16', '2025-05-21', TRUE, '2025-05-21 00:00:00'),
    (9, 'quarterly', '2025-03-27', '2025-07-31', '2025-02-25', TRUE, '2025-02-25 00:00:00'),
    (15, 'biweekly', '2025-02-15', '2025-06-30', '2025-01-16', TRUE, '2025-01-16 00:00:00'),
    (21, 'monthly', '2025-03-18', '2025-07-27', '2025-02-16', TRUE, '2025-02-16 00:00:00'),
    (27, 'daily', '2025-02-19', '2025-04-16', '2025-01-20', TRUE, '2025-01-20 00:00:00'),
    (77, 'daily', '2025-03-23', '2025-06-02', '2025-02-21', TRUE, '2025-02-21 00:00:00'),
    (81, 'quarterly', '2025-05-17', '2025-10-02', '2025-04-17', TRUE, '2025-04-17 00:00:00'),
    (110, 'quarterly', '2025-05-18', '2025-08-29', '2025-04-18', TRUE, '2025-04-18 00:00:00'),
    (122, 'yearly', '2025-04-04', '2025-08-10', '2025-03-05', TRUE, '2025-03-05 00:00:00'),
    (142, 'weekly', '2025-06-06', '2025-09-27', '2025-05-07', TRUE, '2025-05-07 00:00:00'),
    (149, 'weekly', '2025-03-03', '2025-07-04', '2025-02-01', TRUE, '2025-02-01 00:00:00'),
    (154, 'monthly', '2025-03-22', '2025-04-25', '2025-02-20', TRUE, '2025-02-20 00:00:00'),
    (176, 'biweekly', '2025-07-25', '2025-10-01', '2025-06-25', TRUE, '2025-06-25 00:00:00'),
    (184, 'yearly', '2025-05-22', '2025-08-26', '2025-04-22', TRUE, '2025-04-22 00:00:00'),
    (194, 'daily', '2025-04-14', '2025-08-29', '2025-03-15', TRUE, '2025-03-15 00:00:00'),
    (210, 'quarterly', '2025-07-25', '2025-09-11', '2025-06-25', TRUE, '2025-06-25 00:00:00'),
    (211, 'quarterly', '2025-03-16', '2025-05-31', '2025-02-14', TRUE, '2025-02-14 00:00:00'),
    (214, 'monthly', '2025-07-05', '2025-09-25', '2025-06-05', TRUE, '2025-06-05 00:00:00'),
    (217, 'biweekly', '2025-03-26', '2025-06-26', '2025-02-24', TRUE, '2025-02-24 00:00:00'),
    (221, 'daily', '2025-03-31', '2025-05-06', '2025-03-01', TRUE, '2025-03-01 00:00:00'),
    (234, 'yearly', '2025-05-14', '2025-07-26', '2025-04-14', TRUE, '2025-04-14 00:00:00'),
    (236, 'weekly', '2025-05-21', '2025-06-20', '2025-04-21', TRUE, '2025-04-21 00:00:00'),
    (240, 'daily', '2025-02-26', '2025-06-23', '2025-01-27', TRUE, '2025-01-27 00:00:00'),
    (247, 'daily', '2025-03-03', '2025-06-11', '2025-02-01', TRUE, '2025-02-01 00:00:00'),
    (252, 'weekly', '2025-02-20', '2025-03-30', '2025-01-21', TRUE, '2025-01-21 00:00:00'),
    (256, 'biweekly', '2025-04-25', '2025-09-13', '2025-03-26', TRUE, '2025-03-26 00:00:00'),
    (260, 'yearly', '2025-05-04', '2025-08-10', '2025-04-04', TRUE, '2025-04-04 00:00:00'),
    (274, 'daily', '2025-02-01', '2025-05-01', '2025-01-02', TRUE, '2025-01-02 00:00:00'),
    (275, 'biweekly', '2025-02-16', '2025-07-05', '2025-01-17', TRUE, '2025-01-17 00:00:00'),
    (278, 'daily', '2025-05-05', '2025-07-23', '2025-04-05', TRUE, '2025-04-05 00:00:00'),
    (286, 'quarterly', '2025-04-26', '2025-08-07', '2025-03-27', TRUE, '2025-03-27 00:00:00'),
    (289, 'yearly', '2025-06-25', '2025-07-30', '2025-05-26', TRUE, '2025-05-26 00:00:00'),
    (291, 'daily', '2025-02-16', '2025-04-28', '2025-01-17', TRUE, '2025-01-17 00:00:00'),
    (308, 'daily', '2025-07-01', '2025-10-04', '2025-06-01', TRUE, '2025-06-01 00:00:00'),
    (326, 'daily', '2025-06-24', '2025-11-13', '2025-05-25', TRUE, '2025-05-25 00:00:00'),
    (334, 'weekly', '2025-05-20', '2025-06-28', '2025-04-20', TRUE, '2025-04-20 00:00:00'),
    (340, 'biweekly', '2025-02-23', '2025-06-07', '2025-01-24', TRUE, '2025-01-24 00:00:00'),
    (345, 'monthly', '2025-02-23', '2025-06-07', '2025-01-24', TRUE, '2025-01-24 00:00:00'),
    (354, 'monthly', '2025-05-18', '2025-07-14', '2025-04-18', TRUE, '2025-04-18 00:00:00'),
    (358, 'quarterly', '2025-03-23', '2025-04-26', '2025-02-21', TRUE, '2025-02-21 00:00:00'),
    (381, 'biweekly', '2025-06-10', '2025-08-30', '2025-05-11', TRUE, '2025-05-11 00:00:00'),
    (385, 'daily', '2025-06-23', '2025-08-20', '2025-05-24', TRUE, '2025-05-24 00:00:00'),
    (410, 'yearly', '2025-06-01', '2025-07-09', '2025-05-02', TRUE, '2025-05-02 00:00:00'),
    (411, 'daily', '2025-04-27', '2025-07-03', '2025-03-28', TRUE, '2025-03-28 00:00:00'),
    (413, 'monthly', '2025-07-02', '2025-08-15', '2025-06-02', TRUE, '2025-06-02 00:00:00'),
    (416, 'weekly', '2025-06-26', '2025-09-19', '2025-05-27', TRUE, '2025-05-27 00:00:00'),
    (443, 'monthly', '2025-07-13', '2025-10-23', '2025-06-13', TRUE, '2025-06-13 00:00:00'),
    (457, 'daily', '2025-04-03', '2025-06-14', '2025-03-04', TRUE, '2025-03-04 00:00:00'),
    (472, 'quarterly', '2025-04-09', '2025-05-12', '2025-03-10', TRUE, '2025-03-10 00:00:00'),
    (473, 'weekly', '2025-02-11', '2025-05-04', '2025-01-12', TRUE, '2025-01-12 00:00:00'),
    (474, 'monthly', '2025-05-24', '2025-10-20', '2025-04-24', TRUE, '2025-04-24 00:00:00'),
    (479, 'weekly', '2025-06-23', '2025-10-10', '2025-05-24', TRUE, '2025-05-24 00:00:00'),
    (480, 'weekly', '2025-04-20', '2025-09-07', '2025-03-21', TRUE, '2025-03-21 00:00:00'),
    (482, 'daily', '2025-06-19', '2025-09-18', '2025-05-20', TRUE, '2025-05-20 00:00:00'),
    (516, 'monthly', '2025-06-03', '2025-10-07', '2025-05-04', TRUE, '2025-05-04 00:00:00'),
    (524, 'monthly', '2025-05-16', '2025-10-05', '2025-04-16', TRUE, '2025-04-16 00:00:00'),
    (545, 'daily', '2025-07-12', '2025-09-09', '2025-06-12', TRUE, '2025-06-12 00:00:00'),
    (548, 'monthly', '2025-03-19', '2025-06-11', '2025-02-17', TRUE, '2025-02-17 00:00:00'),
    (572, 'daily', '2025-04-30', '2025-06-13', '2025-03-31', TRUE, '2025-03-31 00:00:00'),
    (582, 'monthly', '2025-05-21', '2025-10-13', '2025-04-21', TRUE, '2025-04-21 00:00:00'),
    (590, 'biweekly', '2025-06-16', '2025-10-07', '2025-05-17', TRUE, '2025-05-17 00:00:00'),
    (601, 'daily', '2025-03-12', '2025-05-30', '2025-02-10', TRUE, '2025-02-10 00:00:00'),
    (608, 'yearly', '2025-02-15', '2025-04-08', '2025-01-16', TRUE, '2025-01-16 00:00:00'),
    (627, 'weekly', '2025-05-06', '2025-06-07', '2025-04-06', TRUE, '2025-04-06 00:00:00'),
    (630, 'biweekly', '2025-03-19', '2025-06-24', '2025-02-17', TRUE, '2025-02-17 00:00:00'),
    (668, 'biweekly', '2025-05-03', '2025-09-27', '2025-04-03', TRUE, '2025-04-03 00:00:00'),
    (707, 'weekly', '2025-07-18', '2025-12-08', '2025-06-18', TRUE, '2025-06-18 00:00:00'),
    (711, 'weekly', '2025-07-15', '2025-10-23', '2025-06-15', TRUE, '2025-06-15 00:00:00'),
    (715, 'yearly', '2025-02-16', '2025-03-26', '2025-01-17', TRUE, '2025-01-17 00:00:00'),
    (724, 'biweekly', '2025-06-16', '2025-08-21', '2025-05-17', TRUE, '2025-05-17 00:00:00'),
    (725, 'daily', '2025-02-16', '2025-06-10', '2025-01-17', TRUE, '2025-01-17 00:00:00'),
    (728, 'monthly', '2025-04-24', '2025-08-18', '2025-03-25', TRUE, '2025-03-25 00:00:00'),
    (747, 'monthly', '2025-04-25', '2025-06-02', '2025-03-26', TRUE, '2025-03-26 00:00:00'),
    (750, 'monthly', '2025-06-05', '2025-10-25', '2025-05-06', TRUE, '2025-05-06 00:00:00'),
    (755, 'monthly', '2025-06-04', '2025-08-08', '2025-05-05', TRUE, '2025-05-05 00:00:00'),
    (768, 'weekly', '2025-02-07', '2025-06-16', '2025-01-08', TRUE, '2025-01-08 00:00:00'),
    (775, 'quarterly', '2025-04-02', '2025-05-23', '2025-03-03', TRUE, '2025-03-03 00:00:00'),
    (782, 'biweekly', '2025-04-19', '2025-08-29', '2025-03-20', TRUE, '2025-03-20 00:00:00'),
    (814, 'yearly', '2025-07-03', '2025-09-24', '2025-06-03', TRUE, '2025-06-03 00:00:00'),
    (829, 'biweekly', '2025-03-03', '2025-05-21', '2025-02-01', TRUE, '2025-02-01 00:00:00'),
    (832, 'quarterly', '2025-06-04', '2025-07-05', '2025-05-05', TRUE, '2025-05-05 00:00:00'),
    (849, 'biweekly', '2025-05-27', '2025-08-31', '2025-04-27', TRUE, '2025-04-27 00:00:00'),
    (852, 'biweekly', '2025-03-07', '2025-06-06', '2025-02-05', TRUE, '2025-02-05 00:00:00'),
    (861, 'daily', '2025-03-20', '2025-06-14', '2025-02-18', TRUE, '2025-02-18 00:00:00'),
    (866, 'yearly', '2025-05-16', '2025-07-23', '2025-04-16', TRUE, '2025-04-16 00:00:00'),
    (878, 'quarterly', '2025-06-10', '2025-09-19', '2025-05-11', TRUE, '2025-05-11 00:00:00'),
    (883, 'daily', '2025-02-22', '2025-04-23', '2025-01-23', TRUE, '2025-01-23 00:00:00'),
    (885, 'quarterly', '2025-06-28', '2025-09-04', '2025-05-29', TRUE, '2025-05-29 00:00:00'),
    (886, 'monthly', '2025-03-31', '2025-07-01', '2025-03-01', TRUE, '2025-03-01 00:00:00'),
    (894, 'daily', '2025-05-08', '2025-08-03', '2025-04-08', TRUE, '2025-04-08 00:00:00'),
    (899, 'biweekly', '2025-05-11', '2025-09-11', '2025-04-11', TRUE, '2025-04-11 00:00:00'),
    (907, 'weekly', '2025-04-02', '2025-05-08', '2025-03-03', TRUE, '2025-03-03 00:00:00'),
    (916, 'monthly', '2025-05-25', '2025-09-08', '2025-04-25', TRUE, '2025-04-25 00:00:00'),
    (942, 'yearly', '2025-07-27', '2025-10-22', '2025-06-27', TRUE, '2025-06-27 00:00:00'),
    (954, 'quarterly', '2025-06-23', '2025-11-19', '2025-05-24', TRUE, '2025-05-24 00:00:00'),
    (958, 'daily', '2025-02-03', '2025-04-30', '2025-01-04', TRUE, '2025-01-04 00:00:00'),
    (963, 'daily', '2025-06-18', '2025-08-15', '2025-05-19', TRUE, '2025-05-19 00:00:00'),
    (964, 'weekly', '2025-04-15', '2025-06-02', '2025-03-16', TRUE, '2025-03-16 00:00:00'),
    (968, 'biweekly', '2025-07-19', '2025-08-19', '2025-06-19', TRUE, '2025-06-19 00:00:00'),
    (974, 'biweekly', '2025-06-28', '2025-08-20', '2025-05-29', TRUE, '2025-05-29 00:00:00'),
    (976, 'biweekly', '2025-07-07', '2025-08-06', '2025-06-07', TRUE, '2025-06-07 00:00:00'),
    (994, 'weekly', '2025-07-08', '2025-11-16', '2025-06-08', TRUE, '2025-06-08 00:00:00'),
    (999, 'daily', '2025-04-07', '2025-07-12', '2025-03-08', TRUE, '2025-03-08 00:00:00'),
    (1006, 'weekly', '2025-03-27', '2025-06-25', '2025-02-25', TRUE, '2025-02-25 00:00:00'),
    (1009, 'biweekly', '2025-02-18', '2025-04-04', '2025-01-19', TRUE, '2025-01-19 00:00:00'),
    (1010, 'yearly', '2025-03-22', '2025-07-09', '2025-02-20', TRUE, '2025-02-20 00:00:00'),
    (1032, 'quarterly', '2025-03-27', '2025-07-13', '2025-02-25', TRUE, '2025-02-25 00:00:00'),
    (1034, 'weekly', '2025-03-03', '2025-05-08', '2025-02-01', TRUE, '2025-02-01 00:00:00'),
    (1040, 'yearly', '2025-03-21', '2025-06-08', '2025-02-19', TRUE, '2025-02-19 00:00:00'),
    (1045, 'biweekly', '2025-06-30', '2025-10-07', '2025-05-31', TRUE, '2025-05-31 00:00:00'),
    (1054, 'monthly', '2025-06-30', '2025-10-03', '2025-05-31', TRUE, '2025-05-31 00:00:00'),
    (1061, 'yearly', '2025-06-06', '2025-07-15', '2025-05-07', TRUE, '2025-05-07 00:00:00'),
    (1064, 'daily', '2025-04-08', '2025-07-30', '2025-03-09', TRUE, '2025-03-09 00:00:00'),
    (1077, 'quarterly', '2025-02-18', '2025-05-22', '2025-01-19', TRUE, '2025-01-19 00:00:00'),
    (1091, 'daily', '2025-02-09', '2025-04-14', '2025-01-10', TRUE, '2025-01-10 00:00:00'),
    (1104, 'weekly', '2025-03-05', '2025-05-02', '2025-02-03', TRUE, '2025-02-03 00:00:00'),
    (1130, 'weekly', '2025-07-03', '2025-11-10', '2025-06-03', TRUE, '2025-06-03 00:00:00'),
    (1138, 'daily', '2025-05-16', '2025-08-03', '2025-04-16', TRUE, '2025-04-16 00:00:00'),
    (1156, 'yearly', '2025-05-30', '2025-08-05', '2025-04-30', TRUE, '2025-04-30 00:00:00'),
    (1163, 'yearly', '2025-04-16', '2025-07-20', '2025-03-17', TRUE, '2025-03-17 00:00:00'),
    (1171, 'daily', '2025-02-13', '2025-04-21', '2025-01-14', TRUE, '2025-01-14 00:00:00'),
    (1176, 'yearly', '2025-06-24', '2025-08-04', '2025-05-25', TRUE, '2025-05-25 00:00:00'),
    (1185, 'biweekly', '2025-07-27', '2025-11-13', '2025-06-27', TRUE, '2025-06-27 00:00:00'),
    (1190, 'monthly', '2025-04-23', '2025-07-15', '2025-03-24', TRUE, '2025-03-24 00:00:00'),
    (1225, 'monthly', '2025-05-24', '2025-08-17', '2025-04-24', TRUE, '2025-04-24 00:00:00'),
    (1227, 'biweekly', '2025-06-16', '2025-09-03', '2025-05-17', TRUE, '2025-05-17 00:00:00'),
    (1229, 'yearly', '2025-04-07', '2025-07-03', '2025-03-08', TRUE, '2025-03-08 00:00:00'),
    (1237, 'biweekly', '2025-07-07', '2025-08-24', '2025-06-07', TRUE, '2025-06-07 00:00:00'),
    (1243, 'monthly', '2025-03-02', '2025-06-18', '2025-01-31', TRUE, '2025-01-31 00:00:00'),
    (1266, 'yearly', '2025-02-19', '2025-07-08', '2025-01-20', TRUE, '2025-01-20 00:00:00'),
    (1281, 'quarterly', '2025-05-09', '2025-06-24', '2025-04-09', TRUE, '2025-04-09 00:00:00'),
    (1296, 'daily', '2025-04-15', '2025-09-07', '2025-03-16', TRUE, '2025-03-16 00:00:00'),
    (1306, 'daily', '2025-06-08', '2025-11-04', '2025-05-09', TRUE, '2025-05-09 00:00:00'),
    (1308, 'monthly', '2025-02-17', '2025-05-03', '2025-01-18', TRUE, '2025-01-18 00:00:00'),
    (1336, 'quarterly', '2025-04-08', '2025-07-20', '2025-03-09', TRUE, '2025-03-09 00:00:00'),
    (1340, 'biweekly', '2025-02-26', '2025-04-08', '2025-01-27', TRUE, '2025-01-27 00:00:00'),
    (1342, 'biweekly', '2025-02-05', '2025-05-23', '2025-01-06', TRUE, '2025-01-06 00:00:00'),
    (1348, 'weekly', '2025-04-25', '2025-09-04', '2025-03-26', TRUE, '2025-03-26 00:00:00'),
    (1349, 'quarterly', '2025-02-02', '2025-06-20', '2025-01-03', TRUE, '2025-01-03 00:00:00'),
    (1350, 'quarterly', '2025-06-30', '2025-08-28', '2025-05-31', TRUE, '2025-05-31 00:00:00'),
    (1359, 'quarterly', '2025-07-18', '2025-10-13', '2025-06-18', TRUE, '2025-06-18 00:00:00'),
    (1385, 'quarterly', '2025-02-03', '2025-06-25', '2025-01-04', TRUE, '2025-01-04 00:00:00'),
    (1386, 'daily', '2025-02-14', '2025-03-21', '2025-01-15', TRUE, '2025-01-15 00:00:00'),
    (1393, 'weekly', '2025-05-04', '2025-06-04', '2025-04-04', TRUE, '2025-04-04 00:00:00'),
    (1405, 'yearly', '2025-04-07', '2025-08-23', '2025-03-08', TRUE, '2025-03-08 00:00:00'),
    (1435, 'daily', '2025-07-22', '2025-11-16', '2025-06-22', TRUE, '2025-06-22 00:00:00'),
    (1439, 'yearly', '2025-02-05', '2025-05-01', '2025-01-06', TRUE, '2025-01-06 00:00:00'),
    (1449, 'quarterly', '2025-02-19', '2025-05-14', '2025-01-20', TRUE, '2025-01-20 00:00:00'),
    (1453, 'biweekly', '2025-05-05', '2025-06-17', '2025-04-05', TRUE, '2025-04-05 00:00:00'),
    (1460, 'yearly', '2025-02-18', '2025-06-13', '2025-01-19', TRUE, '2025-01-19 00:00:00'),
    (1465, 'monthly', '2025-07-26', '2025-11-22', '2025-06-26', TRUE, '2025-06-26 00:00:00'),
    (1466, 'daily', '2025-03-23', '2025-06-26', '2025-02-21', TRUE, '2025-02-21 00:00:00'),
    (1483, 'biweekly', '2025-04-06', '2025-06-30', '2025-03-07', TRUE, '2025-03-07 00:00:00'),
    (1486, 'biweekly', '2025-02-20', '2025-06-27', '2025-01-21', TRUE, '2025-01-21 00:00:00'),
    (1492, 'biweekly', '2025-03-05', '2025-07-31', '2025-02-03', TRUE, '2025-02-03 00:00:00'),
    (1493, 'biweekly', '2025-03-07', '2025-06-25', '2025-02-05', TRUE, '2025-02-05 00:00:00'),
    (1504, 'yearly', '2025-05-28', '2025-09-14', '2025-04-28', TRUE, '2025-04-28 00:00:00'),
    (1515, 'biweekly', '2025-06-01', '2025-10-16', '2025-05-02', TRUE, '2025-05-02 00:00:00'),
    (1519, 'quarterly', '2025-02-09', '2025-03-17', '2025-01-10', TRUE, '2025-01-10 00:00:00'),
    (1521, 'biweekly', '2025-06-05', '2025-10-14', '2025-05-06', TRUE, '2025-05-06 00:00:00'),
    (1530, 'quarterly', '2025-03-16', '2025-05-09', '2025-02-14', TRUE, '2025-02-14 00:00:00'),
    (1536, 'yearly', '2025-02-26', '2025-07-09', '2025-01-27', TRUE, '2025-01-27 00:00:00'),
    (1558, 'quarterly', '2025-06-22', '2025-09-13', '2025-05-23', TRUE, '2025-05-23 00:00:00'),
    (1559, 'quarterly', '2025-05-03', '2025-08-05', '2025-04-03', TRUE, '2025-04-03 00:00:00'),
    (1564, 'daily', '2025-02-20', '2025-05-13', '2025-01-21', TRUE, '2025-01-21 00:00:00'),
    (1580, 'yearly', '2025-07-01', '2025-10-12', '2025-06-01', TRUE, '2025-06-01 00:00:00'),
    (1583, 'weekly', '2025-03-29', '2025-05-17', '2025-02-27', TRUE, '2025-02-27 00:00:00'),
    (1599, 'quarterly', '2025-06-25', '2025-08-11', '2025-05-26', TRUE, '2025-05-26 00:00:00'),
    (1626, 'biweekly', '2025-07-09', '2025-10-14', '2025-06-09', TRUE, '2025-06-09 00:00:00'),
    (1633, 'quarterly', '2025-03-23', '2025-06-16', '2025-02-21', TRUE, '2025-02-21 00:00:00'),
    (1646, 'quarterly', '2025-03-09', '2025-05-18', '2025-02-07', TRUE, '2025-02-07 00:00:00'),
    (1652, 'yearly', '2025-07-16', '2025-12-02', '2025-06-16', TRUE, '2025-06-16 00:00:00'),
    (1657, 'biweekly', '2025-03-18', '2025-04-23', '2025-02-16', TRUE, '2025-02-16 00:00:00'),
    (1678, 'biweekly', '2025-04-23', '2025-08-10', '2025-03-24', TRUE, '2025-03-24 00:00:00'),
    (1684, 'biweekly', '2025-03-07', '2025-05-06', '2025-02-05', TRUE, '2025-02-05 00:00:00'),
    (1698, 'biweekly', '2025-06-27', '2025-08-06', '2025-05-28', TRUE, '2025-05-28 00:00:00'),
    (1727, 'yearly', '2025-06-30', '2025-11-18', '2025-05-31', TRUE, '2025-05-31 00:00:00'),
    (1731, 'yearly', '2025-07-20', '2025-11-02', '2025-06-20', TRUE, '2025-06-20 00:00:00'),
    (1742, 'quarterly', '2025-05-03', '2025-06-22', '2025-04-03', TRUE, '2025-04-03 00:00:00'),
    (1746, 'biweekly', '2025-05-16', '2025-08-27', '2025-04-16', TRUE, '2025-04-16 00:00:00'),
    (1750, 'daily', '2025-07-10', '2025-08-18', '2025-06-10', TRUE, '2025-06-10 00:00:00'),
    (1755, 'quarterly', '2025-02-18', '2025-06-15', '2025-01-19', TRUE, '2025-01-19 00:00:00'),
    (1758, 'weekly', '2025-03-10', '2025-06-22', '2025-02-08', TRUE, '2025-02-08 00:00:00'),
    (1778, 'weekly', '2025-06-06', '2025-08-07', '2025-05-07', TRUE, '2025-05-07 00:00:00'),
    (1803, 'quarterly', '2025-04-26', '2025-06-06', '2025-03-27', TRUE, '2025-03-27 00:00:00'),
    (1806, 'yearly', '2025-06-23', '2025-07-29', '2025-05-24', TRUE, '2025-05-24 00:00:00'),
    (1817, 'yearly', '2025-05-25', '2025-07-21', '2025-04-25', TRUE, '2025-04-25 00:00:00'),
    (1820, 'yearly', '2025-05-09', '2025-10-04', '2025-04-09', TRUE, '2025-04-09 00:00:00'),
    (1832, 'daily', '2025-02-12', '2025-04-01', '2025-01-13', TRUE, '2025-01-13 00:00:00'),
    (1835, 'yearly', '2025-03-29', '2025-07-09', '2025-02-27', TRUE, '2025-02-27 00:00:00'),
    (1841, 'quarterly', '2025-07-21', '2025-12-12', '2025-06-21', TRUE, '2025-06-21 00:00:00'),
    (1844, 'yearly', '2025-03-28', '2025-07-14', '2025-02-26', TRUE, '2025-02-26 00:00:00'),
    (1848, 'weekly', '2025-04-13', '2025-06-25', '2025-03-14', TRUE, '2025-03-14 00:00:00'),
    (1849, 'biweekly', '2025-06-06', '2025-09-12', '2025-05-07', TRUE, '2025-05-07 00:00:00'),
    (1850, 'weekly', '2025-05-26', '2025-07-04', '2025-04-26', TRUE, '2025-04-26 00:00:00'),
    (1857, 'yearly', '2025-04-14', '2025-09-04', '2025-03-15', TRUE, '2025-03-15 00:00:00'),
    (1859, 'biweekly', '2025-02-07', '2025-06-20', '2025-01-08', TRUE, '2025-01-08 00:00:00'),
    (1861, 'quarterly', '2025-02-15', '2025-05-03', '2025-01-16', TRUE, '2025-01-16 00:00:00');


INSERT INTO achievements (achievement_id, parent_id, badge_id, achievement_title, achievement_description, achievement_type, points_awarded, trigger_condition_json, is_umbrella, display_order, banner_image_path) VALUES 
-- 1) Financial Goals (progress-oriented) [parent badge_id = 1] 
(1, NULL, 1, 'Goal Getter', 'Complete savings and financial goals to become a Goal Getter.', 'goal', 55, '{}', TRUE, 1, 'achievements banners/13.png'), 
(2, 1, 1, 'Starter Saver', 'Complete your first goal.', 'goal', 50, '{"type":"goal_completed","count":1}', FALSE, 2, NULL), 
(3, 1, 1, 'Halfway Hero', 'Reach 50% of your target goal.', 'goal', 30, '{"type":"goal_progress","percent":50}', FALSE, 3, NULL), 
(4, 1, 1, 'Goal Smasher', 'Complete 5 financial goals.', 'goal', 100, '{"type":"goal_completed","count":5}', FALSE, 4, NULL), 
(5, 1, 1, 'Consistent Closer', 'Complete a goal 3 months in a row.', 'goal', 75, '{"type":"goal_streak","months":3}', FALSE, 5, NULL), 

-- 2) Challenges [parent badge_id = 6] 
(6, NULL, 6, 'Challenge Champion', 'Engage and excel in community challenges.', 'challenge', 250, '{}', TRUE, 6, 'achievements banners/23.png'), 
(7, 6, 6, 'First Challenge', 'Join your first challenge.', 'challenge', 20, '{"type":"challenge_participation","count":1}', FALSE, 7, NULL), 
(8, 6, 6, 'Top Contributor', 'Contribute the most in a challenge.', 'challenge', 100, '{"type":"challenge_top_contributor"}', FALSE, 8, NULL), 
(9, 6, 6, 'Streak Star', 'Complete 3 challenges in a row.', 'challenge', 75, '{"type":"challenge_streak","count":3}', FALSE, 9, NULL), 
(10, 6, 6, 'Consistent Contender', 'Join or complete 5 challenges in total.', 'challenge', 60, '{"type":"challenges_total","count":5}', FALSE, 10, NULL), 

-- 3) Transactions (foundational usage) [parent badge_id = 10] 
(11, NULL, 10, 'Transaction Master', 'Master your spending and income tracking.', 'transaction', 250, '{}', TRUE, 11, 'achievements banners/19.png'), 
(12, 11, 10, 'First Transaction', 'Logged your very first transaction!', 'transaction', 50, '{"type":"transaction_count","count":1}', FALSE, 12, NULL), 
(13, 11, 10, 'Tracker Beginner', 'Log 10 transactions.', 'transaction', 20, '{"type":"transaction_count","count":10}', FALSE, 13, NULL), 
(14, 11, 10, 'Budget Buddy', 'Link a transaction to a budget.', 'transaction', 30, '{"type":"linked_to_budget"}', FALSE, 14, NULL), 
(15, 11, 10, 'Classifier Pro', 'Classify 50 transactions.', 'transaction', 60, '{"type":"classified_count","count":50}', FALSE, 15, NULL), 

-- 4) Transactions (advanced habits & volume) [parent badge_id = 1] 
(16, NULL, 1, 'Money Mover', 'Show advanced mastery of spending habits.', 'transaction', 0, '{}', TRUE, 16, 'achievements banners/10.png'), 
(17, 16, 1, 'Big Spender', 'Make a single transaction of R1000 or more.', 'transaction', 100, '{"type":"single_transaction","min_amount":1000}', FALSE, 17, NULL), 
(18, 16, 1, 'Transaction Tycoon', 'Log over 500 transactions.', 'transaction', 150, '{"type":"transaction_count","count":500}', FALSE, 18, NULL), 
(19, 16, 1, 'No-Fees Month', 'Go an entire month with no fee transactions.', 'transaction', 120, '{"type":"no_fees_month","months":1}', FALSE, 19, NULL), 
(20, 16, 1, 'All Tagged', 'Have 100% of this month''s transactions categorized.', 'transaction', 120, '{"type":"month_categorized","percent":100}', FALSE, 20, NULL), 

-- 5) Quizzes / Learning [parent badge_id = 2] 
(21, NULL, 2, 'Quiz Conqueror', 'Show off your financial literacy.', 'quiz', 0, '{}', TRUE, 21, 'achievements banners/2.png'), 
(22, 21, 2, 'First Answer', 'Complete your first quiz.', 'quiz', 20, '{"type":"quiz_completed","count":1}', FALSE, 22, NULL), 
(23, 21, 2, 'Quiz Streak', 'Score 80%+ on 3 quizzes in a row.', 'quiz', 50, '{"type":"quiz_streak","count":3,"min_score":80}', FALSE, 23, NULL), 
(24, 21, 2, 'Perfect Score', 'Get 100% in a quiz.', 'quiz', 100, '{"type":"quiz_pass","min_score":100}', FALSE, 24, NULL), 
(25, 21, 2, 'Brainstormer', 'Complete 20 quizzes.', 'quiz', 150, '{"type":"quiz_completed","count":20}', FALSE, 25, NULL), 

-- 6) Tutorials / Onboarding [parent badge_id = 4] 
(26, NULL, 4, 'Tutorial Trailblazer', 'Master the onboarding process with tutorials.', 'tutorial', 0, '{}', TRUE, 26, 'achievements banners/5.png'), 
(27, 26, 4, 'First Steps', 'Complete your first tutorial.', 'tutorial', 10, '{"type":"tutorial_completed","count":1}', FALSE, 27, NULL), 
(28, 26, 4, 'Quick Learner', 'Finish 3 tutorials.', 'tutorial', 30, '{"type":"tutorial_completed","count":3}', FALSE, 28, NULL), 
(29, 26, 4, 'System Savvy', 'Complete all onboarding tutorials.', 'tutorial', 60, '{"type":"tutorial_all_completed"}', FALSE, 29, NULL), 
(30, 26, 4, 'Tutorial Streak', 'Complete tutorials on 3 consecutive days.', 'tutorial', 40, '{"type":"tutorial_streak_days","days":3}', FALSE, 30, NULL), 

-- 7) Community / Social milestones [parent badge_id = 11] 
(31, NULL, 11, 'Community Champion', 'Empower others through social engagement.', 'milestone', 0, '{}', TRUE, 31, 'achievements banners/21.png'), 
(32, 31, 11, 'Friend of Finance', 'Make 5 friends.', 'milestone', 40, '{"type":"friends_made","count":5}', FALSE, 32, NULL), 
(33, 31, 11, 'Community Pillar', 'Participate in 5 communities.', 'milestone', 60, '{"type":"communities_joined","count":5}', FALSE, 33, NULL), 
(34, 31, 11, 'Weekly Winner', 'Be top of the leaderboard for a week.', 'milestone', 75, '{"type":"leaderboard_week_top","weeks":1}', FALSE, 34, NULL), 
(35, 31, 11, 'Top Ranker', 'Reach the #1 spot on any leaderboard.', 'milestone', 200, '{"type":"leaderboard_rank","rank":1}', FALSE, 35, NULL), 

-- 8) Points progression milestones [parent badge_id = 8] 
(36, NULL, 8, 'Point Pursuer', 'Unlock point-based milestones.', 'milestone', 0, '{}', TRUE, 36, 'achievements banners/17.png'), 
(37, 36, 8, '100 Points Club', 'Reach 100 total points.', 'milestone', 20, '{"type":"points_total","points":100}', FALSE, 37, NULL), 
(38, 36, 8, '250 Points Club', 'Reach 250 total points.', 'milestone', 40, '{"type":"points_total","points":250}', FALSE, 38, NULL), 
(39, 36, 8, '500 Points Club', 'Reach 500 total points.', 'milestone', 80, '{"type":"points_total","points":500}', FALSE, 39, NULL), 
(40, 36, 8, '1,000 Points Club', 'Reach 1,000 total points.', 'milestone', 150, '{"type":"points_total","points":1000}', FALSE, 40, NULL), 

-- 9) Investing [parent badge_id = 13] 
(41, NULL, 13, 'Investment Guru', 'Recognize consistent and strategic investing habits.', 'goal', 105, '{}', TRUE, 41, 'achievements banners/11.png'), 
(42, 41, 13, 'Stock Starter', 'Complete your first investment goal.', 'goal', 40, '{"type":"investment_goal","count":1}', FALSE, 42, NULL), 
(43, 41, 13, 'Smart Reinvestor', 'Reinvest dividends or interest at least twice.', 'goal', 60, '{"type":"reinvest_events","count":2}', FALSE, 43, NULL), 
(44, 41, 13, 'Auto-Investor', 'Set up a recurring monthly investment.', 'goal', 70, '{"type":"auto_invest_enabled","months":1}', FALSE, 44, NULL), 
(45, 41, 13, 'Risk Balancer', 'Rebalance your investment goal once.', 'goal', 80, '{"type":"rebalance_performed","count":1}', FALSE, 45, NULL), 

-- 10) Budgeting Mastery [parent badge_id = 14] 
(46, NULL, 14, 'Budget Boss', 'Master the art of budgeting', 'budget', 300, '{}', TRUE, 42, 'achievements banners/18.png'), 
(47, 46, 14, 'Budget Beginner', 'Create your first budget', 'budget', 30, '{"type":"budget_created","count":1}', FALSE, 43, NULL), 
(48, 46, 14, 'Category King', 'Create budgets in 5 different categories', 'budget', 50, '{"type":"budget_categories","count":5}', FALSE, 44, NULL), 
(49, 46, 14, 'Month Master', 'Stay under budget in all categories for a month', 'budget', 100, '{"type":"budget_success_month","months":1}', FALSE, 45, NULL), 
(50, 46, 14, 'Quarterly Saver', 'Stay under budget for 3 consecutive months', 'budget', 150, '{"type":"budget_streak","months":3}', FALSE, 46, NULL), 

-- Learning & Quizzes -- Avid Scholar (complete most learning modules) 
(51, NULL, 2, 'Avid Scholar', 'Complete most available learning modules.', 'quiz', 0, '{}', TRUE, 47, 'achievements banners/1.png'), 
(52, 51, 2, 'Module Novice', 'Complete 3 learning modules.', 'quiz', 20, '{"type":"modules_completed","count":3}', FALSE, 48, NULL), 
(53, 51, 2, 'Module Enthusiast', 'Complete 10 learning modules.', 'quiz', 40, '{"type":"modules_completed","count":10}', FALSE, 49, NULL), 
(54, 51, 2, 'Curriculum Closer', 'Complete all beginner & intermediate modules.', 'quiz', 75, '{"type":"modules_completed_by_level","levels":["beginner","intermediate"]}', FALSE, 50, NULL), 
(55, 51, 2, 'Avid Scholar Badge', 'Complete 80% of all available modules across the catalog.', 'quiz', 120, '{"type":"modules_completion_rate","percent":80}', FALSE, 51, NULL), 

-- Financial Ace (score 100% on a quiz attempt) 
(56, NULL, 2, 'Financial Ace', 'Score 100% on a quiz attempt.', 'quiz', 0, '{}', TRUE, 52, 'achievements banners/3.png'), 
(57, 56, 2, 'First Perfect', 'Score 100% on any quiz once.', 'quiz', 40, '{"type":"quiz_pass","min_score":100,"count":1}', FALSE, 53, NULL), 
(58, 56, 2, 'Perfectionist', 'Score 100% on quizzes 3 times.', 'quiz', 80, '{"type":"quiz_pass","min_score":100,"count":3}', FALSE, 54, NULL), 
(59, 56, 2, 'Lightning Perfect', 'Score 100% on a quiz in under 60 seconds.', 'quiz', 90, '{"type":"quiz_perfect_under_time","min_score":100,"seconds":60}', FALSE, 55, NULL), 
(60, 56, 2, 'Advanced Ace', 'Score 100% on an advanced-difficulty quiz.', 'quiz', 120, '{"type":"quiz_pass_on_difficulty","min_score":100,"difficulty":"advanced"}', FALSE, 56, NULL), 

-- Over Achiever (complete all advanced learning modules) 
(61, NULL, 2, 'Over Achiever', 'Complete all advanced learning modules.', 'quiz', 0, '{}', TRUE, 57, 'achievements banners/6.png'), 
(62, 61, 2, 'Advanced Starter', 'Complete your first advanced module.', 'quiz', 40, '{"type":"modules_completed_by_difficulty","difficulty":"advanced","count":1}', FALSE, 58, NULL), 
(63, 61, 2, 'Advanced Explorer', 'Complete 5 advanced modules.', 'quiz', 70, '{"type":"modules_completed_by_difficulty","difficulty":"advanced","count":5}', FALSE, 59, NULL), 
(64, 61, 2, 'Advanced Streak', 'Complete an advanced module each week for 3 weeks.', 'quiz', 100, '{"type":"module_completion_streak_weeks","difficulty":"advanced","weeks":3}', FALSE, 60, NULL), 
(65, 61, 2, 'Over Achiever Badge', 'Complete all advanced modules in the catalog.', 'quiz', 150, '{"type":"all_modules_completed_by_difficulty","difficulty":"advanced"}', FALSE, 61, NULL), 

-- Quiz Maniac (attempt all quizzes a total of 25 times) 
(66, NULL, 2, 'Quiz Maniac', 'Attempt all quizzes a total of 25 times.', 'quiz', 0, '{}', TRUE, 62, 'achievements banners/7.png'), 
(67, 66, 2, 'Quiz Tourist', 'Attempt quizzes 5 times in total.', 'quiz', 15, '{"type":"quiz_attempts_total","count":5}', FALSE, 63, NULL), 
(68, 66, 2, 'Quiz Regular', 'Attempt quizzes 10 times in total.', 'quiz', 30, '{"type":"quiz_attempts_total","count":10}', FALSE, 64, NULL), 
(69, 66, 2, 'Quiz Addict', 'Attempt quizzes 25 times in total.', 'quiz', 60, '{"type":"quiz_attempts_total","count":25}', FALSE, 65, NULL), 
(70, 66, 2, 'Quiz Marathon', 'Attempt quizzes 100 times in total.', 'quiz', 120, '{"type":"quiz_attempts_total","count":100}', FALSE, 66, NULL), 

-- AR / Exploration 
(71, NULL, 11, 'New World', 'Unlock all city model view themes.', 'ar', 0, '{}', TRUE, 67, 'achievements banners/4.png'), 
(72, 71, 11, 'Theme Explorer', 'Unlock your first city model theme.', 'ar', 20, '{"type":"ar_theme_unlocked","count":1}', FALSE, 68, NULL), 
(73, 71, 11, 'City Stylist', 'Unlock 3 city model themes.', 'ar', 50, '{"type":"ar_theme_unlocked","count":3}', FALSE, 69, NULL), 
(74, 71, 11, 'Urban Designer', 'Unlock 5 city model themes.', 'ar', 75, '{"type":"ar_theme_unlocked","count":5}', FALSE, 70, NULL), 
(75, 71, 11, 'Master Architect', 'Unlock all available city model themes.', 'ar', 100, '{"type":"ar_theme_unlocked","count":"all"}', FALSE, 71, NULL), 

-- AR / Exploration - AR Viewer 
(76, NULL, 11, 'AR Viewer', 'Explore the world of augmented reality.', 'ar', 0, '{}', TRUE, 72, 'achievements banners/8.png'), 
(77, 76, 11, 'First Steps in AR', 'View any AR scene for the first time.', 'ar', 10, '{"type":"ar_scene_viewed","count":1}', FALSE, 73, NULL), 
(78, 76, 11, 'Immersive Explorer', 'View 5 AR scenes.', 'ar', 30, '{"type":"ar_scene_viewed","count":5}', FALSE, 74, NULL), 
(79, 76, 11, 'Augmented Adventurer', 'View 10 AR scenes.', 'ar', 50, '{"type":"ar_scene_viewed","count":10}', FALSE, 75, NULL), 
(80, 76, 11, 'AR Pioneer', 'Spend over 1 hour in AR mode.', 'ar', 75, '{"type":"ar_time_spent","minutes":60}', FALSE, 76, NULL), 

-- Goals / Budget / Transactions / Points - Speed Runner 
(81, NULL, 1, 'Speed Runner', 'Complete a financial goal in under 7 days.', 'goal', 0, '{}', TRUE, 77, 'achievements banners/9.png'), 
(82, 81, 1, 'Quick Start', 'Complete a goal within 14 days.', 'goal', 40, '{"type":"goal_completed_under_days","days":14}', FALSE, 78, NULL), 
(83, 81, 1, 'Speed Runner', 'Complete a goal within 7 days.', 'goal', 75, '{"type":"goal_completed_under_days","days":7}', FALSE, 79, NULL), 
(84, 81, 1, 'Sprint Saver', 'Complete a goal within 3 days.', 'goal', 120, '{"type":"goal_completed_under_days","days":3}', FALSE, 80, NULL), 
(85, 81, 1, 'Lightning Closer', 'Complete a goal within 24 hours.', 'goal', 200, '{"type":"goal_completed_under_hours","hours":24}', FALSE, 81, NULL), 

-- Budget Hero 
(86, NULL, 14, 'Budget Hero', 'Stay under budget for 3 straight months.', 'budget', 0, '{}', TRUE, 82, 'achievements banners/14.png'), 
(87, 86, 14, 'Month on Track', 'Stay under budget for 1 month.', 'budget', 50, '{"type":"budget_streak","months":1}', FALSE, 83, NULL), 
(88, 86, 14, 'Quarter Tamer', 'Stay under budget for 3 months.', 'budget', 120, '{"type":"budget_streak","months":3}', FALSE, 84, NULL), 
(89, 86, 14, 'Half-Year Hero', 'Stay under budget for 6 months.', 'budget', 180, '{"type":"budget_streak","months":6}', FALSE, 85, NULL), 
(90, 86, 14, 'Annual Aegis', 'Stay under budget for 12 months.', 'budget', 300, '{"type":"budget_streak","months":12}', FALSE, 86, NULL), 

-- Transaction Tycoon 
(91, NULL, 10, 'Transaction Tycoon', 'Import over 50 transactions via bank statements.', 'transaction', 0, '{}', TRUE, 87, 'achievements banners/15.png'), 
(92, 91, 10, 'Bank Linker', 'Import transactions once via bank import.', 'transaction', 25, '{"type":"bank_import_count","count":1}', FALSE, 88, NULL), 
(93, 91, 10, 'Statement Streamer', 'Import transactions 5 times.', 'transaction', 60, '{"type":"bank_import_count","count":5}', FALSE, 89, NULL), 
(94, 91, 10, 'Data Drip', 'Import transactions 20 times.', 'transaction', 120, '{"type":"bank_import_count","count":20}', FALSE, 90, NULL), 
(95, 91, 10, 'Transaction Tycoon', 'Import 50+ transactions via statements.', 'transaction', 200, '{"type":"bank_import_total","count":50}', FALSE, 91, NULL), 

-- Points Hoarder 
(96, NULL, 8, 'Points Hoarder', 'Reach 50,000 total points.', 'milestone', 0, '{}', TRUE, 92, 'achievements banners/12.png'), 
(97, 96, 8, 'Points Collector', 'Reach 5,000 total points.', 'milestone', 40, '{"type":"points_total","points":5000}', FALSE, 93, NULL), 
(98, 96, 8, 'Points Saver', 'Reach 10,000 total points.', 'milestone', 80, '{"type":"points_total","points":10000}', FALSE, 94, NULL), 
(99, 96, 8, 'Points Pro', 'Reach 25,000 total points.', 'milestone', 150, '{"type":"points_total","points":25000}', FALSE, 95, NULL), 
(100, 96, 8, 'Points Hoarder', 'Reach 50,000 total points.', 'milestone', 300, '{"type":"points_total","points":50000}', FALSE, 96, NULL), 

-- Customization 
(101, NULL, 11, 'Custom King', 'Create over 10 different custom categories.', 'misc', 0, '{}', TRUE, 97, 'achievements banners/16.png'), 
(102, 101, 11, 'Category Creator', 'Create your first custom category.', 'misc', 10, '{"type":"custom_categories_created","count":1}', FALSE, 98, NULL), 
(103, 101, 11, 'Customizer', 'Create 5 custom categories.', 'misc', 25, '{"type":"custom_categories_created","count":5}', FALSE, 99, NULL), 
(104, 101, 11, 'Custom Kingpin', 'Create 10 custom categories.', 'misc', 50, '{"type":"custom_categories_created","count":10}', FALSE, 100, NULL), 
(105, 101, 11, 'Palette Architect', 'Create 20 custom categories.', 'misc', 100, '{"type":"custom_categories_created","count":20}', FALSE, 101, NULL), 

-- Social / Community / Challenges 
(106, NULL, 11, 'Top Ranker', 'Reach #1 on the leaderboard for 3 weeks in a row.', 'milestone', 0, '{}', TRUE, 102, 'achievements banners/20.png'), 
(107, 106, 11, 'Week One Wonder', 'Hold the #1 leaderboard spot for 1 week.', 'milestone', 50, '{"type":"leaderboard_rank_streak","rank":1,"weeks":1}', FALSE, 103, NULL), 
(108, 106, 11, 'Two-Week Titan', 'Hold the #1 leaderboard spot for 2 weeks.', 'milestone', 100, '{"type":"leaderboard_rank_streak","rank":1,"weeks":2}', FALSE, 104, NULL), 
(109, 106, 11, 'Three-Week Throne', 'Hold the #1 leaderboard spot for 3 weeks.', 'milestone', 150, '{"type":"leaderboard_rank_streak","rank":1,"weeks":3}', FALSE, 105, NULL), 
(110, 106, 11, 'Monthly Monarch', 'Hold the #1 leaderboard spot for 4 weeks.', 'milestone', 200, '{"type":"leaderboard_rank_streak","rank":1,"weeks":4}', FALSE, 106, NULL), 

(111, NULL, 6, 'Challenge Accepted', 'Join your first community financial challenge.', 'challenge', 0, '{}', TRUE, 107, 'achievements banners/22.png'), 
(112, 111, 6, 'First Steps In', 'Join your first community financial challenge.', 'challenge', 10, '{"type":"challenge_participation","count":1}', FALSE, 108, NULL), 
(113, 111, 6, 'Challenge Regular', 'Join 3 community financial challenges.', 'challenge', 30, '{"type":"challenge_participation","count":3}', FALSE, 109, NULL), 
(114, 111, 6, 'Challenge Enthusiast', 'Join 5 community financial challenges.', 'challenge', 60, '{"type":"challenge_participation","count":5}', FALSE, 110, NULL), 
(115, 111, 6, 'Challenge Veteran', 'Join 10 community financial challenges.', 'challenge', 120, '{"type":"challenge_participation","count":10}', FALSE, 111, NULL), 

(116, NULL, 11, 'Trending Now', 'Have a single social post reach 50 likes.', 'milestone', 0, '{}', TRUE, 112, 'achievements banners/24.png'), 
(117, 116, 11, 'Getting Noticed', 'Have a post reach 10 likes.', 'milestone', 10, '{"type":"post_likes","count":10}', FALSE, 113, NULL), 
(118, 116, 11, 'On The Radar', 'Have a post reach 25 likes.', 'milestone', 25, '{"type":"post_likes","count":25}', FALSE, 114, NULL), 
(119, 116, 11, 'Trending Now', 'Have a post reach 50 likes.', 'milestone', 50, '{"type":"post_likes","count":50}', FALSE, 115, NULL), 
(120, 116, 11, 'Viral Vibes', 'Have a post reach 100 likes.', 'milestone', 100, '{"type":"post_likes","count":100}', FALSE, 116, NULL), 

(121, NULL, 11, 'Social Butterfly', 'Comment on 10 or more users'' social posts.', 'milestone', 0, '{}', TRUE, 117, 'achievements banners/25.png'), 
(122, 121, 11, 'First Hello', 'Leave your first comment on a user''s post.', 'milestone', 10, '{"type":"comments_made","count":1}', FALSE, 118, NULL), 
(123, 121, 11, 'Chatty', 'Leave 10 comments on users'' posts.', 'milestone', 20, '{"type":"comments_made","count":10}', FALSE, 119, NULL), 
(124, 121, 11, 'Conversationalist', 'Leave 25 comments on users'' posts.', 'milestone', 40, '{"type":"comments_made","count":25}', FALSE, 120, NULL), 
(125, 121, 11, 'Social Butterfly+', 'Leave 50 comments on users'' posts.', 'milestone', 80, '{"type":"comments_made","count":50}', FALSE, 121, NULL);


INSERT INTO user_achievements (user_id, achievement_id, awarded_at, achievement_status, progress_value) VALUES 
    (1, 47, '2025-04-25 17:46:51', 'complete', 100),
    (1, 49, '2025-01-06 17:46:51', 'complete', 100),
    (1, 39, '2025-02-11 17:46:51', 'complete', 100),
    (1, 38, '2025-06-11 17:46:51', 'complete', 100),
    (1, 19, '2025-03-10 17:46:51', 'complete', 100),
    (1, 23, '2025-02-06 17:46:51', 'complete', 100),
    (1, 25, '2025-04-29 17:46:51', 'complete', 100),
    (1, 15, '2025-02-18 17:46:51', 'complete', 100),
    (1, 12, '2025-06-08 17:46:51', 'complete', 100),
    (1, 2,  '2025-05-29 17:46:51', 'complete', 100),
    (1, 9,  '2025-04-22 17:46:51', 'complete', 100),
    (1, 30, '2025-02-02 17:46:51', 'complete', 100),
    (1, 34, '2025-05-05 17:46:51', 'complete', 100),
    (1, 46, '2025-01-11 17:46:51', 'complete', 100),
    (1, 50, '2025-01-01 17:46:51', 'complete', 100),
    (1, 42, '2025-02-26 17:46:51', 'complete', 100),
    (1, 22, '2025-04-14 17:46:51', 'complete', 100),
    (1, 41, '2025-05-13 17:46:51', 'complete', 100),
    (1, 31, '2025-04-24 17:46:51', 'complete', 100),
    (1, 24, '2025-05-18 17:46:51', 'complete', 100),
    (1, 37, '2025-04-22 17:46:51', 'complete', 100),
    (1, 1,  '2025-06-03 17:46:51', 'incomplete', 83),
    (1, 18, '2025-06-10 17:46:51', 'incomplete', 66),
    (1, 8,  '2025-06-05 17:46:51', 'incomplete', 88),
    (1, 35, '2025-06-08 17:46:51', 'incomplete', 43),
    (1, 40, '2025-05-25 17:46:51', 'incomplete', 32),
    (1, 11, '2025-05-28 17:46:51', 'incomplete', 70),
    (2, 11, '2025-03-20 17:46:51', 'complete', 100),
    (2, 10, '2025-01-28 17:46:51', 'complete', 100),
    (2, 8,  '2025-02-17 17:46:51', 'complete', 100),
    (2, 7,  '2025-04-25 17:46:51', 'complete', 100),
    (2, 20, '2025-01-30 17:46:51', 'complete', 100),
    (2, 35, '2025-02-14 17:46:51', 'complete', 100),
    (2, 12, '2025-05-05 17:46:51', 'complete', 100),
    (2, 26, '2025-01-26 17:46:51', 'complete', 100),
    (2, 16, '2025-04-13 17:46:51', 'complete', 100),
    (2, 30, '2025-05-12 17:46:51', 'complete', 100),
    (2, 39, '2025-03-04 17:46:51', 'complete', 100),
    (2, 45, '2025-02-27 17:46:51', 'complete', 100),
    (2, 9,  '2024-12-22 17:46:51', 'complete', 100),
    (2, 4,  '2025-03-28 17:46:51', 'complete', 100),
    (2, 47, '2025-06-10 17:46:51', 'incomplete', 34),
    (2, 36, '2025-05-27 17:46:51', 'incomplete', 67),
    (2, 23, '2025-06-08 17:46:51', 'incomplete', 29),
    (2, 1,  '2025-06-09 17:46:51', 'incomplete', 13),
    (2, 18, '2025-05-25 17:46:51', 'incomplete', 51),
    (2, 28, '2025-05-24 17:46:51', 'incomplete', 10),
    (2, 46, '2025-06-02 17:46:51', 'incomplete', 16),
    (2, 40, '2025-06-16 17:46:51', 'incomplete', 63),
    (2, 27, '2025-05-25 17:46:51', 'incomplete', 74),
    (3, 27, '2025-01-07 17:46:51', 'complete', 100),
    (3, 41, '2025-03-03 17:46:51', 'complete', 100),
    (3, 29, '2025-05-18 17:46:51', 'complete', 100),
    (3, 20, '2025-06-01 17:46:51', 'complete', 100),
    (3, 24, '2025-05-29 17:46:51', 'complete', 100),
    (3, 6,  '2025-02-09 17:46:51', 'complete', 100),
    (3, 2,  '2025-05-10 17:46:51', 'complete', 100),
    (3, 31, '2025-04-16 17:46:51', 'complete', 100),
    (3, 18, '2025-01-06 17:46:51', 'complete', 100),
    (3, 48, '2025-01-16 17:46:51', 'complete', 100),
    (3, 10, '2025-03-16 17:46:51', 'complete', 100),
    (3, 38, '2025-04-19 17:46:51', 'complete', 100),
    (3, 23, '2025-04-28 17:46:51', 'complete', 100),
    (3, 33, '2025-05-06 17:46:51', 'complete', 100),
    (3, 13, '2025-06-14 17:46:51', 'incomplete', 39),
    (3, 47, '2025-06-07 17:46:51', 'incomplete', 27),
    (3, 7,  '2025-06-13 17:46:51', 'incomplete', 87),
    (3, 40, '2025-06-06 17:46:51', 'incomplete', 13),
    (3, 42, '2025-05-25 17:46:51', 'incomplete', 53),
    (3, 19, '2025-05-24 17:46:51', 'incomplete', 74),
    (3, 34, '2025-06-12 17:46:51', 'incomplete', 80),
    (3, 3,  '2025-05-22 17:46:51', 'incomplete', 24),
    (4, 6,  '2025-04-02 17:46:51', 'complete', 100),
    (4, 38, '2025-01-13 17:46:51', 'complete', 100),
    (4, 37, '2025-04-02 17:46:51', 'complete', 100),
    (4, 40, '2025-05-09 17:46:51', 'complete', 100),
    (4, 13, '2025-03-26 17:46:51', 'complete', 100),
    (4, 4,  '2025-01-03 17:46:51', 'complete', 100),
    (4, 30, '2025-04-02 17:46:51', 'complete', 100),
    (4, 49, '2025-01-17 17:46:51', 'complete', 100),
    (4, 10, '2025-03-11 17:46:51', 'complete', 100),
    (4, 47, '2025-01-19 17:46:51', 'complete', 100),
    (4, 28, '2025-02-25 17:46:51', 'complete', 100),
    (4, 8,  '2025-05-10 17:46:51', 'complete', 100),
    (4, 27, '2025-04-05 17:46:51', 'complete', 100),
    (4, 7,  '2025-03-26 17:46:51', 'complete', 100),
    (4, 46, '2025-05-15 17:46:51', 'complete', 100),
    (4, 14, '2025-04-12 17:46:51', 'complete', 100),
    (4, 1,  '2025-06-04 17:46:51', 'incomplete', 49),
    (4, 3,  '2025-06-04 17:46:51', 'incomplete', 69),
    (4, 12, '2025-06-07 17:46:51', 'incomplete', 50),
    (4, 33, '2025-05-25 17:46:51', 'incomplete', 30),
    (4, 35, '2025-06-08 17:46:51', 'incomplete', 40),
    (4, 42, '2025-05-24 17:46:51', 'incomplete', 52),
    (4, 16, '2025-05-22 17:46:51', 'incomplete', 34),
    (4, 26, '2025-06-02 17:46:51', 'incomplete', 66),
    (4, 25, '2025-06-12 17:46:51', 'incomplete', 63),
    (5, 9,  '2025-03-17 17:46:51', 'complete', 100),
    (5, 45, '2025-01-10 17:46:51', 'complete', 100),
    (5, 21, '2025-03-28 17:46:51', 'complete', 100),
    (5, 10, '2025-03-01 17:46:51', 'complete', 100),
    (5, 48, '2025-01-07 17:46:51', 'complete', 100),
    (5, 47, '2025-03-01 17:46:51', 'complete', 100),
    (5, 4,  '2025-02-08 17:46:51', 'complete', 100),
    (5, 42, '2025-06-04 17:46:51', 'complete', 100),
    (5, 33, '2025-05-22 17:46:51', 'complete', 100),
    (5, 29, '2025-02-08 17:46:51', 'complete', 100),
    (5, 46, '2025-03-31 17:46:51', 'complete', 100),
    (5, 24, '2025-03-29 17:46:51', 'complete', 100),
    (5, 11, '2025-03-30 17:46:51', 'complete', 100),
    (5, 22, '2025-03-16 17:46:51', 'complete', 100),
    (5, 18, '2025-01-02 17:46:51', 'complete', 100),
    (5, 27, '2025-02-12 17:46:51', 'complete', 100),
    (5, 6,  '2024-12-30 17:46:51', 'complete', 100),
    (5, 7,  '2025-06-18 17:46:51', 'complete', 100),
    (5, 39, '2025-01-12 17:46:51', 'complete', 100),
    (5, 40, '2025-02-24 17:46:51', 'complete', 100),
    (5, 17, '2025-05-24 17:46:51', 'incomplete', 14),
    (5, 50, '2025-05-31 17:46:51', 'incomplete', 22),
    (5, 19, '2025-06-16 17:46:51', 'incomplete', 41),
    (5, 2,  '2025-06-14 17:46:51', 'incomplete', 13),
    (5, 3,  '2025-06-17 17:46:51', 'incomplete', 58),
    (5, 1,  '2025-06-18 17:46:51', 'incomplete', 40),
    (5, 36, '2025-06-04 17:46:51', 'incomplete', 68),
    (6, 51, '2025-01-28 17:46:51', 'complete', 100),
    (6, 40, '2025-05-18 17:46:51', 'complete', 100),
    (6, 23, '2025-03-07 17:46:51', 'complete', 100),
    (6, 44, '2025-06-02 17:46:51', 'complete', 100),
    (6, 24, '2025-05-20 17:46:51', 'complete', 100),
    (6, 1,  '2025-02-02 17:46:51', 'complete', 100),
    (6, 4,  '2025-06-18 17:46:51', 'complete', 100),
    (6, 2,  '2025-05-06 17:46:51', 'complete', 100),
    (6, 9,  '2025-01-07 17:46:51', 'complete', 100),
    (6, 37, '2025-02-27 17:46:51', 'complete', 100),
    (6, 29, '2025-06-06 17:46:51', 'incomplete', 18),
    (6, 35, '2025-05-31 17:46:51', 'incomplete', 66),
    (6, 46, '2025-05-26 17:46:51', 'incomplete', 20),
    (6, 42, '2025-05-31 17:46:51', 'incomplete', 61),
    (6, 32, '2025-05-23 17:46:51', 'incomplete', 87),
    (7, 3,  '2025-04-20 17:46:51', 'complete', 100),
    (7, 33, '2025-02-24 17:46:51', 'complete', 100),
    (7, 36, '2025-03-15 17:46:51', 'complete', 100),
    (7, 47, '2025-02-24 17:46:51', 'complete', 100),
    (7, 37, '2024-12-30 17:46:51', 'complete', 100),
    (7, 31, '2025-06-10 17:46:51', 'complete', 100),
    (7, 6,  '2025-02-10 17:46:51', 'complete', 100),
    (7, 22, '2025-06-18 17:46:51', 'complete', 100),
    (7, 4,  '2025-04-20 17:46:51', 'complete', 100),
    (7, 34, '2025-05-15 17:46:51', 'complete', 100),
    (7, 29, '2025-02-12 17:46:51', 'complete', 100),
    (7, 35, '2025-06-12 17:46:51', 'complete', 100),
    (7, 2,  '2025-02-09 17:46:51', 'complete', 100),
    (7, 27, '2025-02-11 17:46:51', 'complete', 100),
    (7, 32, '2025-02-09 17:46:51', 'complete', 100),
    (7, 51, '2025-06-05 17:46:51', 'complete', 100),
    (7, 39, '2025-03-02 17:46:51', 'complete', 100),
    (7, 48, '2025-06-07 17:46:51', 'complete', 100),
    (7, 24, '2025-04-25 17:46:51', 'complete', 100),
    (7, 16, '2025-06-16 17:46:51', 'incomplete', 21),
    (7, 12, '2025-06-01 17:46:51', 'incomplete', 68),
    (7, 5,  '2025-05-30 17:46:51', 'incomplete', 70),
    (7, 46, '2025-05-28 17:46:51', 'incomplete', 54),
    (7, 7,  '2025-06-10 17:46:51', 'incomplete', 14),
    (8, 44, '2025-02-25 17:46:51', 'complete', 100),
    (8, 5,  '2025-04-07 17:46:51', 'complete', 100),
    (8, 31, '2025-04-17 17:46:51', 'complete', 100),
    (8, 29, '2025-02-04 17:46:51', 'complete', 100),
    (8, 47, '2025-05-06 17:46:51', 'complete', 100),
    (8, 12, '2025-02-05 17:46:51', 'complete', 100),
    (8, 1,  '2025-05-23 17:46:51', 'complete', 100),
    (8, 6,  '2025-05-30 17:46:51', 'complete', 100),
    (8, 14, '2025-05-17 17:46:51', 'complete', 100),
    (8, 15, '2025-01-21 17:46:51', 'complete', 100),
    (8, 8,  '2025-06-13 17:46:51', 'complete', 100),
    (8, 21, '2025-06-08 17:46:51', 'incomplete', 51),
    (8, 37, '2025-05-31 17:46:51', 'incomplete', 58),
    (8, 2,  '2025-06-18 17:46:51', 'incomplete', 85),
    (8, 38, '2025-05-29 17:46:51', 'incomplete', 63),
    (8, 27, '2025-05-31 17:46:51', 'incomplete', 47),
    (8, 39, '2025-06-15 17:46:51', 'incomplete', 13),
    (8, 7,  '2025-05-22 17:46:51', 'incomplete', 77),
    (9, 45, '2025-06-12 17:46:51', 'complete', 100),
    (9, 31, '2025-02-06 17:46:51', 'complete', 100),
    (9, 43, '2025-02-03 17:46:51', 'complete', 100),
    (9, 2,  '2025-05-04 17:46:51', 'complete', 100),
    (9, 27, '2025-02-24 17:46:51', 'complete', 100),
    (9, 3,  '2025-02-04 17:46:51', 'complete', 100),
    (9, 1,  '2025-06-16 17:46:51', 'complete', 100),
    (9, 12, '2025-05-05 17:46:51', 'complete', 100),
    (9, 40, '2024-12-25 17:46:51', 'complete', 100),
    (9, 19, '2025-05-19 17:46:51', 'complete', 100),
    (9, 47, '2025-05-16 17:46:51', 'complete', 100),
    (9, 46, '2025-04-06 17:46:51', 'complete', 100),
    (9, 18, '2025-05-28 17:46:51', 'complete', 100),
    (9, 39, '2025-05-09 17:46:51', 'complete', 100),
    (9, 32, '2025-06-04 17:46:51', 'incomplete', 58),
    (9, 10, '2025-06-18 17:46:51', 'incomplete', 49),
    (9, 16, '2025-06-03 17:46:51', 'incomplete', 76),
    (10, 29, '2025-05-12 17:46:51', 'complete', 100),
    (10, 42, '2024-12-24 17:46:51', 'complete', 100),
    (10, 51, '2025-03-14 17:46:51', 'complete', 100),
    (10, 39, '2025-02-09 17:46:51', 'complete', 100),
    (10, 45, '2025-05-19 17:46:51', 'complete', 100),
    (10, 30, '2025-05-10 17:46:51', 'complete', 100),
    (10, 34, '2025-06-12 17:46:51', 'complete', 100),
    (10, 22, '2025-01-30 17:46:51', 'complete', 100),
    (10, 36, '2025-04-03 17:46:51', 'complete', 100),
    (10, 8,  '2025-03-02 17:46:51', 'complete', 100),
    (10, 31, '2025-06-15 17:46:51', 'complete', 100),
    (10, 5,  '2025-02-23 17:46:51', 'complete', 100),
    (10, 11, '2025-01-22 17:46:51', 'complete', 100),
    (10, 32, '2025-01-12 17:46:51', 'complete', 100),
    (10, 25, '2025-06-01 17:46:51', 'complete', 100),
    (10, 13, '2025-04-01 17:46:51', 'complete', 100),
    (10, 14, '2025-05-13 17:46:51', 'complete', 100),
    (10, 2,  '2025-06-12 17:46:51', 'complete', 100),
    (10, 17, '2025-03-10 17:46:51', 'complete', 100),
    (10, 15, '2025-01-24 17:46:51', 'complete', 100),
    (10, 50, '2025-06-15 17:46:51', 'complete', 100),
    (10, 24, '2025-02-08 17:46:51', 'complete', 100),
    (10, 28, '2025-01-15 17:46:51', 'complete', 100),
    (10, 3,  '2025-06-13 17:46:51', 'incomplete', 39),
    (10, 16, '2025-05-26 17:46:51', 'incomplete', 76),
    (10, 26, '2025-06-10 17:46:51', 'incomplete', 10),
    (10, 6,  '2025-06-03 17:46:51', 'incomplete', 82),
    (10, 37, '2025-06-09 17:46:51', 'incomplete', 79);

INSERT INTO user_points (user_id, total_points, tier_status, last_updated) VALUES 
    (1, 780, 'Wood', CURRENT_TIMESTAMP),
    (2, 430, 'Wood', CURRENT_TIMESTAMP),
    (3, 1020, 'Bronze', CURRENT_TIMESTAMP),
    (4, 265, 'Wood', CURRENT_TIMESTAMP),
    (5, 1350, 'Bronze', CURRENT_TIMESTAMP),
    (6, 120, 'Wood', CURRENT_TIMESTAMP),
    (7, 560, 'Wood', CURRENT_TIMESTAMP),
    (8, 880, 'Wood', CURRENT_TIMESTAMP),
    (9, 190, 'Wood', CURRENT_TIMESTAMP),
    (10, 970, 'Wood', CURRENT_TIMESTAMP);

INSERT INTO point_rules (action_type, base_points) VALUES 
  ('transaction', 10),
  ('goal_created', 15),
  ('goal_completed', 75),
  ('quiz_completed', 30),
  ('achievement_unlocked', 50),
  ('challenge_completed', 60);

INSERT INTO points_log (user_id, source, source_id, points, created_at) VALUES
    (1, 'goal', 93, 30, '2025-06-28 15:00:00'),
    (1, 'transaction', 18, 10, '2025-06-04 22:00:00'),
    (1, 'goal', 16, 75, '2025-06-02 22:00:00'),
    (1, 'challenge', 54, 10, '2025-07-02 00:00:00'),
    (1, 'transaction', 35, 50, '2025-06-11 10:00:00'),
    (1, 'challenge', 97, 10, '2025-06-13 10:00:00'),
    (1, 'transaction', 7, 10, '2025-06-21 15:00:00'),
    (1, 'goal', 1, 75, '2025-06-30 01:00:00'),
    (1, 'transaction', 38, 30, '2025-06-18 12:00:00'),
    (1, 'goal', 1, 50, '2025-06-14 06:00:00'),
    (1, 'achievement', 41, 50, '2025-06-14 04:00:00'),
    (1, 'challenge', 32, 100, '2025-06-30 09:00:00'),
    (1, 'goal', 99, 20, '2025-06-23 05:00:00'),
    (1, 'quiz', 98, 30, '2025-07-01 23:00:00'),
    (1, 'quiz', 87, 30, '2025-06-24 11:00:00'),
    (1, 'quiz', 83, 30, '2025-06-14 17:00:00'),
    (1, 'transaction', 30, 50, '2025-06-01 23:00:00'),
    (1, 'transaction', 26, 30, '2025-06-20 18:00:00'),
    (2, 'transaction', 30, 75, '2025-06-30 00:00:00'),
    (2, 'quiz', 47, 30, '2025-06-30 12:00:00'),
    (2, 'achievement', 28, 10, '2025-06-12 09:00:00'),
    (2, 'challenge', 17, 100, '2025-06-16 23:00:00'),
    (2, 'goal', 65, 100, '2025-06-04 14:00:00'),
    (2, 'challenge', 89, 100, '2025-06-19 18:00:00'),
    (2, 'challenge', 26, 10, '2025-06-08 21:00:00'),
    (2, 'challenge', 37, 5, '2025-06-13 03:00:00'),
    (3, 'goal', 8, 10, '2025-06-14 22:00:00'),
    (3, 'transaction', 19, 100, '2025-06-27 03:00:00'),
    (3, 'achievement', 50, 10, '2025-06-25 00:00:00'),
    (3, 'quiz', 11, 20, '2025-06-13 08:00:00'),
    (3, 'goal', 36, 75, '2025-06-04 01:00:00'),
    (3, 'quiz', 19, 50, '2025-06-26 12:00:00'),
    (3, 'transaction', 85, 20, '2025-06-30 06:00:00'),
    (3, 'challenge', 49, 100, '2025-06-13 11:00:00'),
    (3, 'transaction', 49, 100, '2025-06-22 07:00:00'),
    (3, 'achievement', 14, 75, '2025-06-30 11:00:00'),
    (3, 'transaction', 97, 20, '2025-06-03 00:00:00'),
    (3, 'achievement', 28, 30, '2025-06-26 23:00:00'),
    (3, 'achievement', 39, 20, '2025-06-15 06:00:00'),
    (3, 'challenge', 1, 20, '2025-06-08 20:00:00'),
    (3, 'achievement', 44, 30, '2025-06-10 16:00:00'),
    (3, 'transaction', 69, 20, '2025-06-12 12:00:00'),
    (3, 'challenge', 8, 100, '2025-06-22 01:00:00'),
    (3, 'quiz', 7, 50, '2025-06-28 02:00:00'),
    (4, 'challenge', 9, 100, '2025-06-19 11:00:00'),
    (4, 'quiz', 56, 20, '2025-06-10 06:00:00'),
    (4, 'challenge', 94, 75, '2025-06-20 13:00:00'),
    (4, 'quiz', 41, 20, '2025-06-17 19:00:00'),
    (4, 'challenge', 43, 30, '2025-06-23 11:00:00'),
    (5, 'quiz', 6, 100, '2025-06-20 23:00:00'),
    (5, 'challenge', 100, 100, '2025-06-16 17:00:00'),
    (5, 'goal', 5, 100, '2025-06-04 10:00:00'),
    (5, 'transaction', 78, 20, '2025-06-25 12:00:00'),
    (5, 'achievement', 45, 30, '2025-06-18 17:00:00'),
    (5, 'transaction', 22, 30, '2025-06-12 04:00:00'),
    (5, 'quiz', 85, 20, '2025-06-30 00:00:00'),
    (5, 'challenge', 10, 20, '2025-06-18 23:00:00'),
    (5, 'challenge', 69, 50, '2025-06-04 02:00:00'),
    (5, 'goal', 43, 100, '2025-06-06 04:00:00'),
    (5, 'goal', 65, 75, '2025-06-29 18:00:00'),
    (5, 'goal', 24, 100, '2025-06-13 23:00:00'),
    (5, 'challenge', 10, 20, '2025-07-01 05:00:00'),
    (5, 'goal', 49, 100, '2025-06-25 10:00:00'),
    (5, 'quiz', 48, 50, '2025-06-08 14:00:00'),
    (5, 'quiz', 10, 10, '2025-06-24 09:00:00'),
    (5, 'goal', 72, 30, '2025-06-13 03:00:00'),
    (5, 'transaction', 67, 10, '2025-06-19 10:00:00'),
    (5, 'transaction', 48, 50, '2025-06-05 12:00:00'),
    (5, 'challenge', 67, 75, '2025-06-15 01:00:00'),
    (5, 'quiz', 59, 75, '2025-06-05 23:00:00'),
    (5, 'transaction', 5, 100, '2025-06-16 07:00:00'),
    (5, 'quiz', 75, 55, '2025-06-03 19:00:00'),
    (6, 'quiz', 57, 100, '2025-06-03 15:00:00'),
    (6, 'challenge', 56, 20, '2025-06-30 21:00:00'),
    (7, 'achievement', 9, 10, '2025-06-26 07:00:00'),
    (7, 'transaction', 90, 100, '2025-06-26 06:00:00'),
    (7, 'goal', 17, 10, '2025-06-22 12:00:00'),
    (7, 'challenge', 42, 30, '2025-06-18 03:00:00'),
    (7, 'goal', 98, 30, '2025-06-24 14:00:00'),
    (7, 'quiz', 99, 10, '2025-06-04 04:00:00'),
    (7, 'transaction', 98, 50, '2025-06-01 15:00:00'),
    (7, 'challenge', 66, 75, '2025-06-22 00:00:00'),
    (7, 'quiz', 54, 30, '2025-06-23 16:00:00'),
    (7, 'transaction', 66, 30, '2025-06-12 14:00:00'),
    (7, 'achievement', 23, 50, '2025-06-10 21:00:00'),
    (7, 'quiz', 50, 75, '2025-06-02 08:00:00'),
    (7, 'goal', 90, 60, '2025-06-17 23:00:00'),
    (8, 'goal', 8, 20, '2025-06-15 17:00:00'),
    (8, 'goal', 43, 30, '2025-06-28 12:00:00'),
    (8, 'transaction', 88, 20, '2025-06-30 20:00:00'),
    (8, 'challenge', 72, 75, '2025-06-17 07:00:00'),
    (8, 'challenge', 87, 100, '2025-06-04 04:00:00'),
    (8, 'quiz', 76, 10, '2025-06-16 12:00:00'),
    (8, 'transaction', 17, 100, '2025-06-04 20:00:00'),
    (8, 'quiz', 16, 75, '2025-06-01 19:00:00'),
    (8, 'goal', 93, 30, '2025-06-11 09:00:00'),
    (8, 'challenge', 52, 50, '2025-06-30 20:00:00'),
    (8, 'challenge', 1, 75, '2025-06-11 17:00:00'),
    (8, 'achievement', 60, 10, '2025-07-01 06:00:00'),
    (8, 'goal', 30, 20, '2025-07-01 21:00:00'),
    (8, 'goal', 14, 20, '2025-06-04 23:00:00'),
    (8, 'goal', 76, 30, '2025-06-18 20:00:00'),
    (8, 'challenge', 47, 100, '2025-06-26 18:00:00'),
    (9, 'transaction', 80, 10, '2025-06-26 15:00:00'),
    (9, 'quiz', 71, 20, '2025-06-11 15:00:00'),
    (9, 'transaction', 88, 20, '2025-06-23 20:00:00'),
    (9, 'transaction', 97, 50, '2025-06-02 23:00:00'),
    (9, 'quiz', 96, 50, '2025-06-28 11:00:00'),
    (9, 'transaction', 24, 10, '2025-06-07 09:00:00'),
    (9, 'achievement', 33, 30, '2025-06-11 21:00:00'),
    (10, 'quiz', 72, 100, '2025-06-16 07:00:00'),
    (10, 'achievement', 30, 50, '2025-06-12 09:00:00'),
    (10, 'challenge', 27, 100, '2025-06-13 18:00:00'),
    (10, 'transaction', 89, 30, '2025-06-21 15:00:00'),
    (10, 'goal', 93, 30, '2025-06-13 02:00:00'),
    (10, 'transaction', 41, 50, '2025-06-09 20:00:00'),
    (10, 'transaction', 82, 50, '2025-06-09 21:00:00'),
    (10, 'quiz', 42, 30, '2025-07-01 14:00:00'),
    (10, 'challenge', 93, 75, '2025-06-28 12:00:00'),
    (10, 'challenge', 53, 10, '2025-06-07 00:00:00'),
    (10, 'quiz', 83, 30, '2025-06-14 11:00:00'),
    (10, 'transaction', 76, 100, '2025-06-15 04:00:00'),
    (10, 'achievement', 5, 75, '2025-06-11 06:00:00'),
    (10, 'transaction', 31, 50, '2025-06-22 03:00:00'),
    (10, 'goal', 65, 20, '2025-06-23 08:00:00');




INSERT INTO leaderboard_entries (user_id, leaderboard_score, ranking)
SELECT user_id, total_points, DENSE_RANK() OVER (ORDER BY total_points DESC)
FROM user_points;


-- Learning Modules


--- Budgeting Basics
INSERT INTO learning_modules (module_title, topic, difficulty, banner_image_path) VALUES
    ('Budgeting Basics', 'Personal Finance', 'beginner', 'learn_banners/Budget.png');

-- Lessons
INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES
    (1, 1, 'What is Budgeting and Why it Matters', 
    'Budgeting is the act of creating a plan to manage your income and expenses. It gives you control over your money by helping you understand where it goes and how much you can allocate to your needs, wants, and future goals. A budget isn''t about restricting your lifestyle—it''s about making sure your spending aligns with what you truly value and want to achieve. Without a budget, it''s easy to overspend and find yourself falling short when emergencies arise or bills are due. Budgeting reduces financial stress, helps avoid debt, and empowers you to make informed financial decisions. Whether you''re a student managing an allowance or an adult with a salary, budgeting is a foundational skill that builds financial independence.', 6
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    (1, 2, 'Understanding Your Income and Expenses', 
    'The first step in budgeting is understanding how much money you have and where it''s going. Income includes anything you earn—your salary, side hustles, stipends, or allowances. Expenses, on the other hand, are the things you spend money on. These are usually split into two categories: fixed (like rent, subscriptions, school fees) and variable (like groceries, entertainment, or dining out). Tracking every expense, even the small ones, helps reveal patterns in your spending. Many people underestimate how much they spend on daily coffees or spontaneous takeouts. Using tools like budgeting apps or even a simple spreadsheet can give you a clear view of your financial habits. Once you see your income versus expenses laid out, you can start making smarter choices about where to cut back and where to allocate more.', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    (1, 3, 'Setting Financial Goals', 
    'Financial goals are the targets you aim to reach with your money. They help you stay motivated and focused when making spending decisions. Goals can be short-term (saving for a concert, emergency fund), medium-term (paying off a loan, getting a new laptop), or long-term (saving for university or a car). The clearer your goals are, the easier it becomes to prioritize your spending around them. When setting goals, make them SMART: Specific, Measurable, Achievable, Relevant, and Time-bound. For example, instead of saying "I want to save money," a SMART goal would be: “I want to save R1,500 in 3 months for a new phone by saving R125 each week.” Having a plan like this makes it easier to stay on track and adjust your budget if needed.', 6
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    (1, 4, 'Building a Simple Monthly Budget', 
    'Now that you understand your income, expenses, and goals, it''s time to create your actual budget. A popular method is the 50/30/20 rule: 50% of your income goes to needs (rent, transport, groceries), 30% to wants (clothes, takeout, hobbies), and 20% to savings or debt repayments. This method gives structure while leaving room for flexibility and enjoyment. Start by writing down your monthly income, then subtract your fixed and variable expenses. Allocate money to each category using the rule as a guide, adjusting percentages based on your situation. Don''t forget to review your budget at the end of each month—look at what worked and what didn''t. Budgeting is not static—it evolves with your lifestyle, goals, and unexpected changes.', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    (1, 5, 'Sticking to Your Budget', 
    'Creating a budget is one thing—sticking to it is where the real challenge lies. Consistency is key. You can use mobile apps, reminders, or a weekly financial check-in to keep your spending in check. Keep track of your receipts or transactions and review them every few days. This habit keeps you aware of where your money is going and helps you avoid end-of-month surprises. It''s also important to allow flexibility. Life happens—maybe an emergency pops up or a one-time deal you can''t miss. If you overspend one week, reduce your spending the next. Forgive slip-ups, but always get back on track. Reward yourself (in small, affordable ways) for hitting savings goals or sticking to your plan. Financial success doesn''t come from perfection—it comes from persistence.', 7
    );

-- Quizzes
INSERT INTO quizzes (module_id, questions_jsonb, max_score, pass_score) VALUES 
    (1, 
    '[
        {
            "question": "What is the primary purpose of budgeting?",
            "options": [
                "To restrict your spending completely",
                "To help you manage your income and expenses effectively",
                "To make you rich quickly",
                "To track only your large purchases"
            ],
            "correct_answer": 1,
            "points": 1
        },
        {
            "question": "What are the two main categories of expenses?",
            "options": [
                "Income and savings",
                "Fixed and variable",
                "Large and small",
                "Personal and business"
            ],
            "correct_answer": 1,
            "points": 1
        },
        {
            "question": "What does the SMART acronym stand for in financial goal setting?",
            "options": [
                "Simple, Manageable, Achievable, Realistic, Timely",
                "Specific, Measurable, Achievable, Relevant, Time-bound",
                "Strategic, Meaningful, Actionable, Responsible, Targeted",
                "Savings, Money, Assets, Resources, Treasury"
            ],
            "correct_answer": 1,
            "points": 1
        },
        {
            "question": "According to the 50/30/20 rule, what percentage should go to needs?",
            "options": ["20%", "30%", "50%", "70%"],
            "correct_answer": 2,
            "points": 1
        },
        {
            "question": "What is the key to successful budgeting?",
            "options": [
                "Perfection in following the budget",
                "Complete avoidance of all wants",
                "Persistence and consistency",
                "Earning more money"
            ],
            "correct_answer": 2,
            "points": 1
        }
    ]', 
    5, 3);







--- Investment Fundamentals
INSERT INTO learning_modules (module_title, topic, difficulty, banner_image_path) VALUES 
    ('Investment Fundamentals', 'Wealth Building', 'intermediate', 'learn_banners/Investment.png');

-- Lessons
INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Investment Fundamentals' LIMIT 1), 1, 'Introduction to Investing', 
    'Investing is the process of allocating money with the expectation of generating profit or income. Unlike saving, which focuses on preserving money, investing aims to grow your wealth over time through various assets like stocks, bonds, and real estate.

    Key Benefits:
    - Potential for higher returns than savings accounts
    - Protection against inflation
    - Building long-term wealth
    - Generating passive income

    Common Investment Vehicles:
    1. Stocks (Equities)
    2. Bonds (Fixed Income)
    3. Mutual Funds & ETFs
    4. Real Estate
    5. Commodities (Gold, Oil, etc.)

    Understanding your risk tolerance and investment horizon is crucial before beginning your investment journey.', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Investment Fundamentals' LIMIT 1), 2, 'Understanding Risk and Return',
    'The relationship between risk and return is fundamental to investing. Generally, higher potential returns come with higher risk.

    Types of Investment Risk:
    - Market Risk: Overall market fluctuations
    - Inflation Risk: Purchasing power erosion
    - Interest Rate Risk: Bond price sensitivity
    - Liquidity Risk: Difficulty selling assets
    - Concentration Risk: Overexposure to one asset

    Risk Management Strategies:
    1. Diversification: Spreading investments across different assets
    2. Asset Allocation: Balancing stocks, bonds, and other assets
    3. Dollar-Cost Averaging: Investing fixed amounts regularly
    4. Rebalancing: Adjusting portfolio periodically

    Historical Average Annual Returns:
    - Stocks: ~7-10%
    - Bonds: ~3-5%
    - Savings Accounts: ~0.5-2%', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Investment Fundamentals' LIMIT 1), 3, 'Stock Market: Your Money’s Playground', 
    'Think of the stock market like a giant marketplace where pieces of companies (called shares) are bought and sold. It''s where your money can grow while you focus on living your life!

    🔍 Quick Cheat Sheet:
    - NYSE/NASDAQ/JSE = Different "shops" where stocks are traded
    - Bull market = Prices going up (🔼 like a bull’s horns)
    - Bear market = Prices going down (🔽 like a bear swiping down)
    - Market cap = Company size (Large = established, Small = up-and-coming)

    💰 How People Make Money:
    1. Price goes up → Sell for profit (Capital gains)
    2. Company shares profits → You get paid (Dividends)

    🎯 Pro Tips for Beginners:
    • Start with companies you know (Love their products? Research them!)
    • Don''t put all your cash in one stock (That''s like only eating pizza forever)
    • Ignore the hype (If everyone''s screaming "BUY NOW!", take a breath)

    💡 Fun Fact: 
    If you''d invested R1,000 in Naspers in 1994, it''d be worth over R2 million today! But remember – past performance ≠ future results.

    🛒 Buying Stocks is Easier Than You Think:
    1. Choose an app (EasyEquities, ETFSA, etc.)
    2. Deposit money
    3. Buy shares (as little as R100!)
    4. Watch your money work for you (but don''t check daily!)', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Investment Fundamentals' LIMIT 1), 4, 'Building a Diversified Portfolio', 
    'A well-diversified portfolio reduces risk while maximizing returns potential. Your asset allocation should match your goals and risk tolerance.

    Portfolio Construction Principles:
    1. The 60/40 Rule: 60% stocks, 40% bonds (traditional)
    2. Age-Based Allocation: (100 - age)% in stocks
    3. Core-Satellite Approach: Index funds + individual picks

    Rebalancing Strategies:
    - Calendar-Based: Quarterly/annually
    - Threshold-Based: When allocations deviate 5-10%

    Example Portfolio for Moderate Risk:
    - 50% Domestic Stocks
    - 20% International Stocks
    - 20% Bonds
    - 5% Real Estate (REITs)
    - 5% Cash', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Investment Fundamentals' LIMIT 1), 5, 'Long-Term Investment Strategies',
    'Successful investing requires patience and discipline. These proven strategies help investors build wealth over time.

    Buy-and-Hold Strategy:
    - Invest in quality companies
    - Hold through market fluctuations
    - Benefit from compounding returns

    Index Investing:
    - Low-cost index funds/ETFs
    - Matches market performance
    - Minimal maintenance required

    Dividend Growth Investing:
    - Focus on companies with growing dividends
    - Reinvest dividends for compounding
    - Provides income in retirement

    Common Mistakes to Avoid:
    - Emotional trading
    - Chasing "hot" stocks
    - Market timing attempts
    - Overconcentration in one sector', 7
    );

-- Quizzes
INSERT INTO quizzes (module_id, questions_jsonb, max_score, pass_score) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Investment Fundamentals' LIMIT 1),
    '[{
        "question": "What is the primary purpose of investing?",
        "options": [
            "To keep money completely safe",
            "To grow wealth over time",
            "To avoid paying taxes",
            "To impress friends with financial knowledge"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "Which investment typically carries the highest risk?",
        "options": [
            "Government bonds",
            "Savings accounts",
            "Blue-chip stocks",
            "Cryptocurrencies"
        ],
        "correct_answer": 3,
        "points": 1
      },
      {
        "question": "What does diversification aim to achieve?",
        "options": [
            "Maximize returns on a single stock",
            "Reduce overall portfolio risk",
            "Time the market perfectly",
            "Avoid all investment losses"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "What is a key benefit of dollar-cost averaging?",
        "options": [
            "Eliminates all investment risk",
            "Guarantees above-market returns",
            "Reduces impact of market volatility",
            "Requires large upfront capital"
        ],
        "correct_answer": 2,
        "points": 1
      },
      {
        "question": "Which strategy focuses on reinvesting profits?",
        "options": [
            "Market timing",
            "Day trading",
            "Dividend growth investing",
            "Short selling"
        ],
        "correct_answer": 2,
        "points": 1
      }]',
    5, 3);









--- Credit Sensei
INSERT INTO learning_modules (module_title, topic, difficulty, banner_image_path) VALUES 
    ('Credit Sensei', 'Smart Borrowing', 'beginner', 'learn_banners/credit.png');

-- Lessons
INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Credit Sensei' LIMIT 1), 1, 'Credit 101 - The Adulting Hack', 
    '💳 Credit = Borrowing money now that you promise to pay back later (with interest!). It''s like a financial trust score that follows you everywhere.

    🔥 Why It Matters:
    - Can help you buy a car/home/start business
    - Affects cellphone contracts & apartment rentals
    - Good credit = lower interest rates = more money saved

    💸 Credit Golden Rule:
    "Only borrow what you can DEFINITELY pay back by payday" - Your Future Self

    🚦 Credit Types:
    • Credit cards (like a reusable loan)
    • Store accounts (Hi, Mr Price!)
    • Personal loans (Bigger amounts)
    • Student loans (Education investment)

    📱 Pro Tip: 
    Check your credit report for free once a year at TransUnion or Experian!', 6
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Credit Sensei' LIMIT 1), 2, 'Credit Scores Demystified',
    'Your credit score is like a financial report card (but way more important than matric!). Scores range 0-999:

    🟢 767+ = Credit Ninja
    🟡 681-766 = On Your Way
    🔴 0-680 = Needs Work

    🧮 What Affects Your Score:
    1. Payment History (35%) - Pay on time, every time!
    2. Amounts Owed (30%) - Keep balances <30% of limit
    3. Credit Age (15%) - Older accounts help
    4. Credit Mix (10%) - Different types (but don''t overdo it)
    5. New Credit (10%) - Too many applications = red flag

    💯 Quick Boosters:
    • Set up debit orders for minimum payments
    • Keep old accounts open (even if unused)
    • Space out credit applications', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Credit Sensei' LIMIT 1), 3, 'Credit Cards - Friend or Foe?',
    'Credit cards are like fire - useful tool or dangerous weapon depending on how you use them!

    ✅ The Good:
    • Build credit history
    • Earn rewards/cashback
    • Fraud protection
    • Emergency cushion

    ❌ The Bad:
    • 20%+ interest if not paid in full
    • Easy to overspend
    • Fees add up quickly

    🛡️ Safety Rules:
    1. ALWAYS pay full balance monthly
    2. Never use >30% of your limit
    3. Skip "buy now, pay later" unless essential
    4. Freeze your card in an actual freezer if tempted!

    💡 Pro Hack: 
    Use your credit card like a debit card - only spend what''s in your bank account right now.', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Credit Sensei' LIMIT 1), 4, 'Debt Dig-Out Strategies',
    'In a debt hole? Stop digging! Here''s your escape ladder:

    🚨 Danger Signs:
    • Paying one credit card with another
    • Minimum payments only
    • Lying to friends/family about debt

    🔧 Fix-It Tools:
    1️⃣ Snowball Method: 
    - Pay smallest debt first (quick wins!)
    - Then roll that payment to next debt

    2️⃣ Avalanche Method:
    - Attack highest interest debt first
    - Saves most money long-term

    3️⃣ Debt Consolidation:
    - Combine debts into one lower-interest loan
    - BUT don''t run up cards again!

    📞 Lifelines:
    • National Debtline (0800 20 57 28)
    • Debt counseling (it''s confidential!)', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Credit Sensei' LIMIT 1), 5, 'Credit Hacks for Big Goals',
    'Want a car/home/business loan someday? Start prepping NOW:

    🚗 Car Loan Prep (12+ months before):
    • Get credit score >650
    • Save 20% deposit = better rates
    • Keep debt-to-income ratio <35%

    🏡 Home Loan Game Plan:
    • Need 650+ credit score
    • No missed payments for 2 years
    • Stable job history matters too

    💼 Business Funding:
    • Personal credit still counts
    • Separate business account ASAP
    • Build relationships with local banks

    🌟 Golden Rule: 
    The best time to fix your credit was last year. The second-best time? TODAY!', 8
    );

-- Quizzes
INSERT INTO quizzes (module_id, questions_jsonb, max_score, pass_score) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Credit Sensei' LIMIT 1),
    '[{
        "question": "What percentage of your credit limit should you ideally use?",
        "options": [
          "100% - max it out!",
          "30% - the golden rule",
          "75% - shows you need credit",
          "0% - never use it"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "Which action hurts your credit score MOST?",
        "options": [
          "Checking your own score",
          "Missing a payment",
          "Having a student loan",
          "Using a debit card"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "What''s the smartest way to use a credit card?",
        "options": [
          "Pay minimum balance monthly",
          "Pay full balance monthly",
          "Use it only for emergencies",
          "Max it out then get another"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "Which debt repayment method focuses on quick wins?",
        "options": [
          "Snowball method",
          "Avalanche method",
          "Ostrich method (ignore it)",
          "YOLO method"
        ],
        "correct_answer": 0,
        "points": 1
      },
      {
        "question": "What''s the MAIN risk of debt consolidation?",
        "options": [
          "Lower credit utilization",
          "Accumulating new debt",
          "Faster credit score improvement",
          "Higher interest rates"
        ],
        "correct_answer": 1,
        "points": 1
      }]',
    5, 3);








--- 'FOMO vs. Future You'
INSERT INTO learning_modules (module_title, topic, difficulty, banner_image_path) VALUES 
    ('FOMO vs. Future You', 'Social Budgeting', 'beginner', 'learn_banners/Fomo.png');

-- Lessons
INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'FOMO vs. Future You' LIMIT 1), 1, 'Why FOMO Costs More Than Money',
    '💸 **FOMO Fact:** The average South African spends **R1,200/month** on unplanned social outings (yes, that''s **R14k/year!**).  

    🔍 **What''s Really Happening?**  
    - You say *"It''s just one night out!"* → But 5 "just one nights" = a month''s savings.  
    - **Hidden Cost:** The *"I''ll fix it later"* mindset keeps you stuck in paycheck-to-paycheck mode.  

    🎯 **This Lesson''s Goal:**  
    Identify your **FOMO Triggers**:  
    1. **Scrolling Instagram** → "They''re all at the club!"  
    2. **Group Chats** → "Everyone''s going!"  
    3. **FOMO Discounts** → "Last chance! Sale ends tonight!"  

    💡 **Try This:**  
    Next time you feel FOMO, **pause and ask**:  
    *"Will I remember this in 3 months? Or would Future Me rather have R500 closer to a car deposit?"*', 6
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'FOMO vs. Future You' LIMIT 1), 2, 'The 50/30/20 Rule for Fun & Savings',
    '💰 **Budget Like a Pro:**  
    Split your after-tax income like this:  
    - **50% Needs** (Rent, food, transport)  
    - **30% Wants** (Social life, Netflix, takeout)  
    - **20% Future You** (Savings, investments)  

    📌 **Example (R10k salary):**  
    - **R3k for fun** = R750/week (still enough for 2-3 outings!)  
    - **R2k savings** = R24k/year → Hello, emergency fund!  

    🔥 **Hack:**  
    Open a **separate "Guilt-Free Fun" bank account**. When the R750 is gone, **get creative**:  
    - Host a *bring-and-braai* (cheaper than clubs!)  
    - Swap pricey cocktails for *DIY gin tastings*  
    - Try *free events* (comedy nights, hiking, beach days)  

    💡 **Pro Tip:**  
    Automate your savings **right after payday** – Future You will high-five you later!', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'FOMO vs. Future You' LIMIT 1), 3, 'The 24-Hour Rule to Stop Impulse Spending',
    '🛑 **The Problem:**  
    FOMO makes us **spend fast** → regret later.  

    ✅ **The Fix:** **Wait 24 hours** before saying *"YES"* to any non-essential spend.  

    📱 **Real-Life Test:**  
    1. **You see:** "Concert tickets on sale now!"  
    2. **Instead of buying immediately**, set a reminder for **tomorrow**.  
    3. **Ask yourself:**  
        - *"Can I afford this without touching savings?"*  
        - *"Is there a cheaper alternative?"* (e.g., watch the live stream?)  

    📊 **Results:**  
    - **80% of the time**, you''ll realize you *don''t actually need it*.  
    - **20% of the time**, you''ll buy it **with zero guilt** because it was a *real* priority.  

    💬 **Challenge:**  
    Try this for **one week** and track how much you save!', 6
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'FOMO vs. Future You' LIMIT 1), 4, '"Fake Rich" vs. "Real Rich" Habits',
    '🎭 **Fake Rich Habits:**  
    - Buying rounds for the whole squad *"to look cool"*  
    - Leasing a fancy car *just for Instagram*  
    - Maxing out credit cards on designer sales  

    🏆 **Real Rich Habits:**  
    - **Saying NO** to events you can''t afford  
    - **Investing in skills** (online courses > overpriced bottles)  
    - **Delayed gratification** (e.g., saving for a trip instead of clubbing weekly)  

    💡 **Reality Check:**  
    That friend who *always* posts luxury trips?  
    - They might be **in serious debt**.  
    - **OR** they budgeted for months to afford it.  

    🔑 **Takeaway:**  
    *"We buy things we don''t need, with money we don''t have, to impress people we don''t like."* – Fight the FOMO illusion!', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'FOMO vs. Future You' LIMIT 1), 5, 'How to Politely Say "I''m on a Budget"',
    '🚨 **The Struggle:**  
    Your friends want to go to an expensive restaurant, but you''re saving. What do you say?  

    💬 **Scripts That Work:**  
    1. *"I''m saving for [goal], but I''ll join for drinks later!"*  
    2. *"Let''s try [cheaper alternative] instead – my treat next time!"*  
    3. *"I''m doing a no-spend month, but let''s plan a braai soon!"*  

    🔄 **Better Yet – Suggest Alternatives:**  
    - **"Picnic in the park"** > R200 cocktails  
    - **"Game night at home"** > R500 club cover  
    - **"Hike + coffee"** > R300 brunch  

    💡 **Truth Bomb:**  
    *Real friends* won''t judge you for budgeting. If they do? **Time for new friends.**', 6
    );

-- Quizzes
INSERT INTO quizzes (module_id, questions_jsonb, max_score, pass_score) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'FOMO vs. Future You' LIMIT 1),
    '[{
        "question": "What''s the BEST way to handle FOMO spending?",
        "options": [
          "Buy now, worry later",
          "Use the 24-hour rule",
          "Only use credit cards",
          "Avoid friends who spend money"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "How much of your income should go to /wants/ like social outings?",
        "options": [
          "10%",
          "30%",
          "50%",
          "80%"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "What''s a ''Real Rich'' habit?",
        "options": [
            "Leasing a car to look successful",
            "Saving R500/month for a future goal",
            "Buying drinks for everyone at the club",
            "Maxing out credit cards on sales"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "What''s the psychological benefit of the 24-hour rule?",
        "options": [
          "Encourages impulse buying",
          "Reduces buyer''s remorse",
          "Increases social media usage",
          "Guarantees lowest prices"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "Which is NOT an effective budget-friendly alternative?",
        "options": [
          "Premium cocktail lounge",
          "DIY gin tasting at home",
          "Beach picnic with friends",
          "Public hiking trails"
        ],
        "correct_answer": 0,
        "points": 1
      }]',
    5, 3);







--- Retrenchment Rescue
INSERT INTO learning_modules (module_title, topic, difficulty, banner_image_path) VALUES 
    ('Retrenchment Rescue', 'Crisis Management', 'intermediate', 'learn_banners/retrenchment.png');

-- Lessons
INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Retrenchment Rescue' LIMIT 1), 1, 'Your 30-Day Survival Plan',
    '💥 **First 72 Hours Checklist:**  
    1. **Breathe.** Job loss = shock. Don''t make rash money decisions.  
    2. **Confirm paperwork** - Get retrenchment letter & UIF forms signed.  
    3. **Cut non-essentials** NOW (subscriptions, eating out).  

    📉 **Cash Flow Triage:**  
    - **Priority 1:** Rent, utilities, food  
    - **Priority 2:** Minimum debt payments  
    - **Pause:** Savings, investments, luxury spending  

    💡 **SA Pro Tip:**  
    Call providers *before* missing payments - many offer **payment holidays** for retrenchment (Cell C, DSTV, banks).  

    🛠️ **Action Step:**  
    List your **last 3 months'' expenses** - highlight what can be paused or reduced.', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Retrenchment Rescue' LIMIT 1), 2, 'How to Claim UIF Like a Pro',
    '🇿🇦 **UIF Fast Facts:**  
    - You get **38-58% of your salary** for up to 12 months.  
    - First payment takes **6-8 weeks** → act FAST.  

    📝 **Documents Needed:**  
    1. ID copy  
    2. UI-2.8 form (from employer)  
    3. UI-19 form (proof of termination)  
    4. 3 months'' bank statements  

    🚀 **Online Application Steps:**  
    1. Register on [uFiling](https://ufiling.labour.gov.za)  
    2. Upload documents  
    3. Track status via SMS  

    ⚠️ **Avoid These Mistakes:**  
    - Waiting >12 months to claim  
    - Not following up if payment delays  
    - Forgetting to **re-apply every 4 months**  

    💡 **Hack:** Visit a **Labour Centre** early morning to skip queues.', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Retrenchment Rescue' LIMIT 1), 3, 'Emergency Side Hustles That Pay Fast',
    '💰 **Quick Cash Options (R500+ daily):**  
    - **Food Delivery** (Mr D, Uber Eats) – Use a bicycle/scooter  
    - **Freelancing** (Upwork, Fiverr) – Data entry, basic graphic design  
    - **Tutoring** – Maths/English via Zoom (R150-300/hour)  

    🛒 **Sell Smart:**  
    1. **Facebook Marketplace** – Old gadgets, clothes, furniture  
    2. **Back-a-Buddy** – Crowdfund upskilling courses  
    3. **Airvoice/Flash** – Resell prepaid data/Airtime  

    🔥 **Low-Cost Ideas:**  
    - **Car Washing** (R100/car, 5 cars/day = R500)  
    - **CV Writing** (R200 per CV for job seekers)  

    💡 **Pro Tip:**  
    Use free Google Certificates (IT support, digital marketing) to boost earning potential.', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Retrenchment Rescue' LIMIT 1), 4, 'Emotional & Mental Health First Aid',
    '💔 **It''s Not Just Money - It''s Grief:**  
    - Allow yourself to feel anger/sadness (but set a *"worry time"* limit)  
    - Avoid isolation → join free support groups ([SADAG](https://www.sadag.org))  

    🧠 **Crisis Mindset Shifts:**  
    - **"I lost a job, not my worth."**  
    - **"This is temporary - what can I control?"**  

    🆘 **Free SA Resources:**  
    1. **SADAG Helpline:** 0800 456 789  
    2. **LifeLine:** 0861 322 322  
    3. **Local churches/NGOs** often offer free counseling  

    💡 **Action Step:**  
    Schedule **one small win daily** (e.g., 10 job applications, 1 networking call).', 6
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Retrenchment Rescue' LIMIT 1), 5, 'Bouncing Back Stronger',
    '🚀 **Rebuild Strategy:**  
    1. **Upskill for Free:**  
    - Google Digital Garage (certificates)  
    - Coursera Financial Aid (apply for free courses)  
    2. **Network Relentlessly:**  
    - LinkedIn messages: *"I''m exploring X roles - any advice?"*  
    3. **Consider Pivoting:**  
    - Remote work (international companies hire SA talent)  

    📈 **Future-Proofing:**  
    - **Build a 6-month emergency fund** (start small - R500/month)  
    - **Diversify income** (always have 2+ income streams)  

    💡 **Success Story:**  
    *"After retrenchment, I learned coding via YouTube. Now I earn 3x my old salary remotely."* - Thando, 28', 8
    );

-- Quizzes
INSERT INTO quizzes (module_id, questions_jsonb, max_score, pass_score) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Retrenchment Rescue' LIMIT 1),
    '[{
        "question": "What''s the FIRST thing to do after retrenchment?",
        "options": [
          "Panic and withdraw all savings",
          "Get UIF forms signed by employer",
          "Buy lottery tickets",
          "Post about it on social media"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "How much of your salary can UIF cover?",
        "options": [
          "10-20%",
          "38-58%",
          "80-100%",
          "UIF doesn''t pay retrenched workers"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "Which is NOT a fast side hustle?",
        "options": [
          "Selling old clothes online",
          "Freelancing on Fiverr",
          "Waiting for the perfect job",
          "Tutoring via Zoom"
        ],
        "correct_answer": 2,
        "points": 1
      },
      {
        "question": "What''s a key mental health strategy?",
        "options": [
          "Isolate yourself completely",
          "Schedule small daily wins",
          "Avoid discussing job loss",
          "Blame yourself constantly"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "Which expense should be PAUSED first?",
        "options": [
          "Rent/mortgage",
          "Groceries",
          "Streaming subscriptions",
          "Medical insurance"
        ],
        "correct_answer": 2,
        "points": 1
      }]',
    5, 3);









--- Tax Master
INSERT INTO learning_modules (module_title, topic, difficulty, banner_image_path) VALUES 
    ('Tax Master', 'Personal Finance', 'intermediate', 'learn_banners/TaxMaster.png');

-- Lessons
INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Tax Master' LIMIT 1), 1, 'SARS Deadlines You Can''t Miss',
    '📅 SA Tax Calendar Cheat Sheet:

    💡 Key Dates for Individuals:  
    - 31 Oct: Provisional Tax Return (if you earn side income)  
    - 23 Nov: E-filing deadline for non-provisional taxpayers  
    - 31 Jan: Medical tax credit claims must be submitted  

    💼 For Freelancers/Small Business:  
    - 7th of each month: PAYE submissions if registered as employer  
    - Last day of month: VAT returns (if registered)  

    ⚠️ Late Penalties:
    - R250 per month for missed personal returns  
    - 10% of tax due for late business payments  

    📱 Pro Tip:
    Set calendar reminders 1 week before each deadline - SARS won''t send reminders!', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Tax Master' LIMIT 1), 2, '5 Tax Deductions You''re Not Claiming',
    '💰 Hidden SARS Rebates for Salaried Employees:

    1. Home Office Costs
       - Need dedicated workspace + logbook  
       - Claim portion of rent, internet, electricity  

    2. Retirement Contributions  
       - Up to 27.5% of income (max R350k/year)  
       - Includes RA, pension, provident funds  

    3. Travel Expenses  
       - Keep petrol slips if client visits exceed 12,000km/year  

    4. Medical Expenses 
       - Out-of-pocket costs not covered by medical aid  
       - Includes prescribed meds, doctor visits  

    5. Education Fees  
       - Courses related to your current job  
       - E.g. Programmer claiming coding bootcamp  

    📌 Must Have:
    - Keep all receipts for 5 years
    - Use SARS eFiling app to scan and store docs', 9
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Tax Master' LIMIT 1), 3, 'Freelancer Tax Hacks',
    '👩💻 Tax Survival Guide for Gig Workers: 

    📌 Register As:  
    - Provisional Taxpayer if earning > R30k/year side income  
    - VAT Vendor only if turnover > R1 million/year (optional below)  

    💡 Smart Deductions:  
    - Device Depreciation - Claim 33% of laptop/phone cost over 3 years  
    - Coworking Spaces - Full deduction if used for work  
    - Bank Fees - On business accounts  

    🚨 Common Mistakes:  
    - Mixing personal & business accounts → SARS audits  
    - Forgetting UberEarnings count as taxable income  

    📱 Tools That Help:  
    - Wave Apps (free invoicing + expense tracking)  
    - TaxTim (SA-specific tax calculator)', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Tax Master' LIMIT 1), 4, 'SARS Audit Protection',
    '🔍 What Triggers an Audit: 
    - Sudden income jumps (>30% year-on-year)  
    - Claiming 100% home office without proof  
    - Consistent losses in side business  

    🛡️ Audit-Proof Your Taxes:
    1. Document Everything
       - Photos of home office, client meeting logs
    2. Reconcile Bank Statements
       - SARS compares declared income to deposits
    3. Use SARS-Compatible Software
       - Xero, QuickBooks SA versions

    💡 If Audited:
    - You have 21 days to respond
    - Can request extension if needed
    - Never ignore the letter!

    📌 Red Flag: 
    Writing "estimates" instead of actual figures', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Tax Master' LIMIT 1), 5, 'Tax-Free Savings Explained',
    '💸 TFSA vs RA vs Normal Savings:  

    🏦 Tax-Free Savings Account (TFSA) 
    - No tax on interest/dividends/capital gains  
    - Max R36k/year (R500k lifetime limit)  
    - Best for: Short-term goals (5-10 years)  

    🔄 Retirement Annuity (RA) 
    - Tax deduction when contributing  
    - Taxed on withdrawal after retirement  
    - Best for: Long-term growth  

    📈 Normal Savings  
    - Taxed on interest > R23,800/year (under 65)  

    💡 SA Pro Tip:  
    Open a TFSA early - the R500k lifetime limit includes growth! Example:  
    - Invest R36k/year for 10 years = R360k  
    - If it grows to R600k, you can''t contribute more even though you only put in R360k', 7
    );

-- Quizzes
INSERT INTO quizzes (module_id, questions_jsonb, max_score, pass_score) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Tax Master' LIMIT 1),
    '[{
        "question": "When is the deadline for provisional taxpayers?",
        "options": [
          "31 December",
          "31 October",
          "23 November",
          "No deadline"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "What percentage of retirement contributions are deductible?",
        "options": [
          "10% of income",
          "15% of income",
          "27.5% of income",
          "50% of income"
        ],
        "correct_answer": 2,
        "points": 1
      },
      {
        "question": "What is the annual TFSA contribution limit?",
        "options": [
          "R12,000",
          "R36,000",
          "R100,000",
          "No limit"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "Which expense CANNOT be claimed by freelancers?",
        "options": [
          "Home internet (30% if working from home)",
          "New gaming laptop (if used for work)",
          "Business lunches with clients",
          "Commuting to regular office job"
        ],
        "correct_answer": 3,
        "points": 1
      },
      {
    "question": "Why does a R10k side hustle payment often become R3k after tax?",
    "options": [
      "Provisional tax demands 40% upfront",
      "SARS penalties for late registration",
      "You get pushed into a higher tax bracket",
      "All of the above"
    ],
    "correct_answer": 3,
    "points": 1
  }]',
  5, 3);











--- Side Hustler
INSERT INTO learning_modules (module_title, topic, difficulty, banner_image_path) VALUES 
    ('Side Hustler', 'Income Generation', 'beginner', 'learn_banners/sideHustle.png');

-- Lessons
INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Side Hustler' LIMIT 1), 1, '5 Low-Cost Side Hustles to Start This Weekend',
    '🚀 SA-Friendly Side Gigs Under R500 Startup:

    1. Freelance Writing 
       - Platforms: Upwork, PeoplePerHour  
       - Earn: R200-R500/article  

    2. Tutoring
       - Teach school subjects via Zoom
       - Rate: R150-R300/hour  

    3. Reselling Thrift Finds
       - Buy at Hospice shops, sell on Facebook Marketplace
       - Profit margin: 200-300%

    4. Car Washing
       - Mobile service with bucket & sponge
       - Charge R150/car (3 cars/day = R450)

    5. Social Media Management
       - Help small businesses post 3x/week
       - Earn: R800-R2000/month/client

    💡 Pro Tip:
    Start with what you already own - phone, laptop, or bicycle!', 6
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Side Hustler' LIMIT 1), 2, 'From Side Hustle to Registered Business',
    '📌 When to Register Your Hustle:
    - Earning > R30k/year consistently  
    - Want to open business bank account  
    - Need to claim expenses against tax  

    📝 Registration Options:
    1. Sole Proprietor
       - Free to register
       - No separation between personal & business assets

    2. Pty Ltd
       - Costs ~R175 at CIPC  
       - Protects personal assets  

    💼 Must-Have Documents:
    - SARS income tax number (free)
    - Business banking (FNB, Capitec offer free accounts)  

    ⚠️ Watch Out:
    - Don''t register too early - admin costs add up  
    - Keep personal & biz transactions separate from Day 1', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Side Hustler' LIMIT 1), 3, 'Pricing Strategies That Win Clients',
    '💵 How to Price Without Scaring Customers:

    📊 Pricing Models That Work in SA:
    1. Hourly Rate
       - Beginner: R150-R300/hour
       - Expert: R500+/hour

    2. Value-Based Pricing 
       - "I''ll increase your Instagram followers by 500 = R800"  

    3. Package Deals
       - "3 social media posts/week = R1200/month"

    🚫 Common Mistakes:  
    - Charging too low "to get experience"  
    - Not including revisions in quote  

    💡 SA Hack:
    Offer 3 price options (Basic/Standard/Premium) - 80% will pick middle option!', 6
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Side Hustler' LIMIT 1), 4, 'Time Management for Hustlers',
    '⏰ Balance 9-5 + Side Hustle Without Burning Out:

    🗓️ Weekly Schedule Template:  
    - Mon-Wed: 19:00-21:00 - Client work  
    - Sat AM: 08:00-12:00 - Business admin  
    - Sun: REST (non-negotiable)  

    🚀 Productivity Hacks:  
    - Use "time blocking" in Google Calendar  
    - Batch similar tasks (e.g., do all invoicing at once)  
    - Automate with free tools like Wave Apps  

    ⚠️ Red Flags:  
    - Working after 22:00 regularly  
    - Missing main job deadlines  

    💡 Rule of Thumb:  
    Never let side hustle exceed 15 hours/week if employed full-time', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Side Hustler' LIMIT 1), 5, 'Scaling Beyond Your Time',
    '📈 How to Earn While You Sleep:

    🔄 Systems to Automate:
    1. Pre-Made Templates
       - Reusable proposals, invoices, social media posts

    2. Outsource Repetitive Tasks 
       - Hire VA from OfferZen Jump (R50-R100/hour)  

    3. Digital Products
       - Sell eBooks, Notion templates, online courses

    4. Affiliate Marketing
       - Earn commission promoting tools you already use

    💰 Passive Income Ideas for SA:
    - YouTube tutorials (AdSense earnings)
    - Print-on-demand merch with Printful
    - Blog with Google Ads

    💡 First Step:
    Document your process - this becomes your sellable system!', 8
    );

-- Quizzes
INSERT INTO quizzes (module_id, questions_jsonb, max_score, pass_score) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Side Hustler' LIMIT 1),
    '[{
        "question": "Which side hustle has the lowest startup cost?",
        "options": [
          "Opening a coffee stand",
          "Freelance writing",
          "Car wash with rented equipment",
          "T-shirt printing business"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "When should you register your side hustle as a business?",
        "options": [
          "After first payment",
          "When earning >R30k/year",
          "Before starting",
          "Never"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "What percentage of time should a full-time employee dedicate to a side hustle?",
        "options": [
          "5-10 hours/week",
          "15-20 hours/week",
          "25+ hours/week",
          "As much as possible"
        ],
        "correct_answer": 0,
        "points": 1
      },
      {
        "question": "Which is NOT a passive income strategy?",
        "options": [
          "Affiliate marketing",
          "Selling digital products",
          "Freelance consulting",
          "YouTube ad revenue"
        ],
        "correct_answer": 2,
        "points": 1
      },
        {
        "question": "Why do 89% of side hustlers undercharge their first clients?",
        "options": [
            "They confuse ''hourly rate'' with ''take-home pay''",
            "They forget to factor in taxes and expenses",
            "They compare to salaries instead of business costs",
            "All of the above"
        ],
        "correct_answer": 3,
        "points": 1
        }
        ]',
        5,
        3
    );










--- Adulting Starter Pack
INSERT INTO learning_modules (module_title, topic, difficulty, banner_image_path) VALUES 
    ('Adulting Starter Pack', 'Life Skills', 'beginner', 'learn_banners/Adulting.png');

-- Lessons
INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Adulting Starter Pack' LIMIT 1), 1, 'Renting Your First Place - SA Edition',
    '🔑 How to Get Approved Without Rental History:  

    📝 Must-Have Documents:  
    - 3 months bank statements (even if blank)  
    - Copy of ID & proof of income (payslip/letter)  
    - Contactable reference (lecturer/former landlord)  

    💰 Hidden Costs First-Timers Forget:  
    1. Deposit = Usually 1-2 months'' rent  
    2. Electricity Deposit = R1500-R3000 with municipality  
    3. Connection Fees = WiFi installation (~R1000)  

    🚨 Red Flags in Lease Agreements:  
    - "No guests after 8pm" clauses  
    - Verbal agreements only (must be written)  

    💡 SA Pro Tip: 
    View places at night - checks for safety and noise levels', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Adulting Starter Pack' LIMIT 1), 2, 'Understanding Payslips & UIF',
    '🧾 Decoding Your First Payslip: 

    🔍 Key Sections Explained:  
    - Gross Pay: Salary before deductions  
    - PAYE: Income tax (starts at 18% over R91,250/year)  
    - UIF: 1% contribution (max R177/month)  
    - Net Pay: What actually hits your account  

    🛡️ UIF Benefits You Pay For:  
    - Covers you for 12 months if retrenched  
    - Claim sickness benefits if hospitalized  
    - Pays maternity leave (66% of salary)  

    📌 How to Claim: 
    1. Register at labour.gov.za  
    2. Submit UI-2.8 form at nearest labour office  
    3. Wait 6-8 weeks for payment  

    ⚠️ Watch Out: 
    Companies that "forget" to deduct UIF - this is illegal!', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Adulting Starter Pack' LIMIT 1), 3, 'Basic Car Ownership Math',
    '🚗 Real Costs of Your First Car in SA:  

    📊 Monthly Breakdown (Example: 2010 VW Polo):  
    - Loan: R2500 (if you put down R20k deposit)  
    - Insurance: R800 (third-party only)  
    - Petrol: R1500 (for 1000km/month)  
    - Maintenance: R500 (oil changes, tires)  
    = R5300/month minimum  

    💡 Cheaper Alternatives:  
    1. Ride-Sharing: Uber at R1500/month may be cheaper  
    2. Rentals: Rent when needed (~R300/day)  
    3. Public Transport: MyCiTi bus card = R400/month  

    🚨 Used Car Checklist:  
    - Ask for service history  
    - Check for license disk renewal costs  
    - Test drive with radio OFF to hear engine', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Adulting Starter Pack' LIMIT 1), 4, 'Medical Aid vs Hospital Plan',
    '🏥 SA Healthcare Options Compared:

    🛡️ Hospital Plan (R500-R1500/month):  
    - Covers emergencies only  
    - No day-to-day benefits  
    - Best for: Young, healthy people  

    💊 Full Medical Aid (R2000-R5000/month):  
    - GP visits, medication, dentistry  
    - Often includes savings account  
    - Best for: Chronic meds users  

    🚑 Gap Cover (R200-R400/month):  
    - Pays what medical aid doesn''t  
    - Crucial for serious surgeries  

    💡 SA Hack:
    Get hospital plan + savings account (e.g., Discovery Smart) for basic coverage at ~R1000/month', 6
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Adulting Starter Pack' LIMIT 1), 5, 'The 30-Day Credit Cleanse',
    '💳 Fix Your Credit Score in 1 Month:  

    📉 What Ruins Your Score:  
    - Late payments (even R50 phone bills)  
    - Too many credit applications  
    - Maxed-out store cards  

    🛠️ Quick Fixes:  
    1. Get Your Report: ClearScore (free)  
    2. Dispute Errors: Email credit bureau  
    3. Lower Utilization: Keep card balances below 30% limit  

    🚫 Myth Buster:  
    - Checking your own score doesn''t hurt it  
    - Closing old accounts can actually lower your score  

    💡 SA Pro Tip:  
    Set up debit orders for minimum payments so you''re never late', 7
    );

-- Quizzes
INSERT INTO quizzes (module_id, questions_jsonb, max_score, pass_score) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Adulting Starter Pack' LIMIT 1),
    '[{
        "question": "What is the typical rental deposit in SA?",
        "options": [
          "1 week''s rent",
          "1-2 months'' rent",
          "6 months'' rent",
          "No deposit required"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "What percentage is UIF contribution?",
        "options": [
          "0.5% of salary",
          "1% of salary",
          "5% of salary",
          "Only employers pay"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "Which car cost is often underestimated?",
        "options": [
          "Insurance",
          "Maintenance",
          "Petrol",
          "All of the above"
        ],
        "correct_answer": 3,
        "points": 1
      },
      {
        "question": "What credit utilization percentage should you stay below?",
        "options": [
          "10%",
          "30%",
          "75%",
          "100%"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
    "question": "What''s the most overlooked cost when renting your first place?",
    "options": [
        "Electricity deposit (often R2000+)",
        "Municipal account arrears from previous tenant", 
        "Connection fees for WiFi/Lights",
        "All of the above"
    ],
    "correct_answer": 3,
    "points": 1
    }
    ]',
    5,
    3
    );













--- Relationship Money Talks
INSERT INTO learning_modules (module_title, topic, difficulty, banner_image_path) VALUES 
    ('Relationship Money Talks', 'Personal Finance', 'beginner', 'learn_banners/Money Talks.png');

-- Lessons
INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Relationship Money Talks' LIMIT 1), 1, 'How to Split Bills Fairly',
    '💔 The #1 Couples Fight: Money arguments (they are worse than cheating stats!)  

    💡 SA-Friendly Splitting Methods:

    1. Proportional to Income
       - You earn R15k, they earn R10k? You pay 60% of shared bills  
       - Best for: Serious relationships with income gaps  

    2. Fixed Percentage 
       - Both contribute 30% of your salaries to joint account  
       - Best for: Couples who want equality over exact "fairness"  

    3. Expense Categories  
       - You handle groceries, they cover rent  
       - Best for: Newly moved-in couples  

    ⚠️ Watch Out:  
    - "I''ll pay you back later" → Use Splitwise app to track  
    - Uneven spending on "fun" → Set monthly discretionary limits  

    📱 SA Apps That Help: 
    - Splitwise (track IOUs)  
    - StokFella (group bills for housemates/couples)', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Relationship Money Talks' LIMIT 1), 2, 'The R3,000 Dilemma - How to Handle Loans to Partners',
    '💸 Scenario: Your partner needs R3k "just until payday." What do you do?  

    🚦 Step-by-Step Guide:  

    1. Ask Why 
       - Emergency? (Medical, car fix) → Consider gift  
       - Lifestyle? (Shopping, drinks) → Say no  

    2. Set Terms 
       - "I can lend R1,500, repayable over 3 months?"  
       - Put it in writing (Even WhatsApp counts)  

    3. Plan for Non-Payment  
       - "If you can''t repay, we pause date nights until it''s settled"  

    💡 SA Law Note:  
    - Loans over R5k can be enforced in small claims court  
    - But is your relationship worth legal action?  

    📌 Better Alternative:  
    - Offer to help budget instead of giving cash  
    - "Let''s look at your expenses together"', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Relationship Money Talks' LIMIT 1), 3, 'Love Contracts - SA Cohabitation Agreements',
    '📝 What is a Cohabitation Agreement?  
     A legal doc that outlines:  
    - Who owns what (furniture, pets, property)  
    - How bills are split  
    - What happens if you break up  

     SA Law Facts:
    - No common-law marriage - unmarried partners have few rights  
    - Without agreement: Your R20k TV = whoever''s card bought it  

    🔑 Key Clauses to Include:  
    1. Property: "If we separate, I keep my laptop, they keep their PS5"  
    2. Rent: "We split 50/50, or move out with 30 days''s notice"  
    3. Debt: "Personal loans remain individual responsibilities"  

    💡 Get It Done:  
    - Download free templates from LegalWise  
    - Notarize at police station (free) or attorney (~R500)', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Relationship Money Talks' LIMIT 1), 4, '5 Financial Red Flags in Relationships',
    '🚩 Danger Signs You are Dating a Financial Vampire:

    1. "I''m bad with money"
       - Translation: You''ll be their human ATM

    2. Secret Spending
       - Hiding Takealot packages or gym contracts  

    3. Guilt Trips
       - "If you loved me, you''d lend me R2k"

    4. No Savings at 30+ 
       - Unless paying off student debt, this is irresponsible  

    5. They Owe Everyone 
       - "My mom/cousin/ex still asks for money"  

    💡 SA Reality Check:
    50% of divorces cite money fights as main cause.

    🛑 When to Walk Away: 
    - They refuse to discuss money AT ALL 
    - You feel anxious checking your bank balance around them', 6
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Relationship Money Talks' LIMIT 1), 5, 'Money Dates - How to Talk Finances Without Fighting',
    '🍷 Turn Money Chats Into Bonding Time:

    🗓️ Monthly Money Date Agenda:
    1. `Celebrate Wins
       - "We saved R500 on groceries this month!"  

    2. Review Bills
       - Use smart tools to track your spending—start with the best, like Gamified Financial Visualizer, or settle for more old options like 22Seven.

    3. Set Next Month''s Goal  
       - "Let''s save R1k for our Durban trip" 
       - You can use our easy to use budgeting or goal feature :) 

    💬 Phrases That Work:
    - "How can we make this fair?" (Not "You spend too much")
    - `I feel stressed when..." (Use feelings, not accusations)

    🎮 Make It Fun:  
    - Whoever stays under budget picks the next Netflix show  
    - Create a "dream board" of shared goals (house, travel)  

    💡 Pro Tip:  
    Always have money talks in daylight, never during/before bed.', 7
    );

-- Quizzes
INSERT INTO quizzes (module_id, questions_jsonb, max_score, pass_score) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Relationship Money Talks' LIMIT 1),
    '[{
        "question": "What''s the fairest way to split bills with unequal incomes?",
        "options": [
          "50/50 always",
          "Proportional to income",
          "Whoever remembers to pay",
          "The richer person pays all"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "A cohabitation agreement is:",
        "options": [
          "A legal doc for unmarried couples",
          "Only for rich people",
          "Not valid in SA",
           "A marriage certificate"
        ],
        "correct_answer": 4,
        "points": 1
      },
      {
        "question": "Which is NOT a financial red flag?",
        "options": [
          "Having student debt",
          "Borrowing from multiple people",
           "Secret gambling",
          "Refusing to discuss money"
        ],
        "correct_answer": 3,
        "points": 1
      },
  {
    "question": "Why does ''splitting rent 50/50'' often hurt lower-earning partners?",
    "options": [
      "It consumes a larger % of their income",
      "They sacrifice savings while the other builds wealth", 
      "It creates power imbalances in the relationship",
      "All of the above"
    ],
    "correct_answer": 3,
    "points": 1
  },
  {
    "question": "What percentage of couples break up after lending R5k+ to a partner?",
    "options": [
      "12%",
      "37%",
      "64%", 
      "89%"
    ],
    "correct_answer": 2,
    "points": 1
  }
  ]',
  5,
  2
);










--- Money Therapy
INSERT INTO learning_modules (module_title, topic, difficulty, banner_image_path) VALUES 
    ('Money Therapy', 'Financial Wellness', 'beginner', 'learn_banners/MoneyTherapy.png');

-- Lessons
INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Money Therapy' LIMIT 1), 1, 'Your Money Story - What Childhood Taught You',
    '🧠 Trace Your Financial Blueprint:  

    🔍 Exercise: Finish these sentences:  
    1. "In my family, money was..."  
    2. "Rich people are..."  
    3. "I''ll never have enough money to..."  

    💡 Common Money Scripts in SA:  
    - "Money is for survival only" (poverty mindset)  
    - "I deserve to splurge after payday" (feast-or-famine)  
    - "Talking about money is rude" (avoidance)  

    🔄 Rewriting Your Story: 
    1. Identify one limiting belief  
    2. Find evidence against it ("My cousin escaped poverty")  
    3. Create new mantra ("Money flows to me easily")  

    📌 SA Reality:  
    79% of adults repeat their parents'' money habits - be the cycle breaker!', 9
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Money Therapy' LIMIT 1), 2, 'Money Avoidance vs Money Vigilance',
    '⚖️ Your Financial Personality Type  

    🚫 The Avoider:  
    - Hates checking bank balance  
    - Throws away statements unopened  
    - Says "I will deal with it later"

    🔍 The Vigilant: 
    - Tracks every cent  
    - Feels guilty about spending  
    - Hoards savings unnecessarily  

    💡 Healthy Middle Ground:
    - Weekly 10-minute money dates with yourself  
    - 50/30/20 rule (needs/wants/savings)  
    - "Good enough" budgeting (no perfectionism)  

    🛠️ SA Tools to Try:  
    - 22Seven for gentle tracking  
    - PocketGuard for avoiders  
    - Our app''s "Financial Sentiment" feature', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Money Therapy' LIMIT 1), 3, 'Financial Anxiety First Aid',
    '😰 When Money Stress Overwhelms You: 

    🆘 Immediate Relief Techniques:  
    1. 5-4-3-2-1 Grounding: 
       - 5 things you see  
       - 4 things you touch  
       - 3 sounds you hear  
       - 2 smells  
       - 1 deep breath  

    2. Worst-Case Reality Check:  
       - "If I miss this payment...?" (Usually not catastrophic)  

    3. Separate Facts from Feelings:
       - "I feel broke" vs "I have RX until payday"  

    📞 SA Support Resources:  
    - SADAG Mental Health Line: 011 234 4837  
    - Financial Counseling Network (pro bono advisors)  

    💡 Remember:  
    Money problems are temporary situations - not your worth!', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Money Therapy' LIMIT 1), 4, 'The Psychology of Sales',
    '🛍️ Why You Overspend - And How to Stop:  

    🧠 Neurological Tricks Stores Use:  
    1. "R199" Pricing (brain reads as R100s)  
    2. Limited Stock Notifications (FOMO trigger)  
    3. Free Delivery Thresholds ("Might as well add more")  

    🛑 Defense Strategies:  
    - 24-hour rule for purchases >R500  
    - Unsubscribe from promo emails  
    - Pay with cash (physical pain of spending)  

    💡 SA-Specific Triggers:  
    - "Eish, I deserve this after load shedding"  
    - "It''s on sale at Woolies" (but still overpriced)  

    📱 App Blockers to Try: 
    - StayFocusd (limits shopping sites)  
    - Our app''s "Impulse Spend Tracker"', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Money Therapy' LIMIT 1), 5, 'Money & Relationships Revisited',
    '💑 When Partners Have Opposite Money Mindsets:  

    🔍 Identify Your Money Languages:
    1. The Saver (security = love)
    2. The Spender (experiences = love)
    3. The Investor (growth = love)
    4. The Avoider (no conflict = love)

    💬 Communication Scripts:
    - "I feel [emotion] when [behavior], because..."
    - "Could we try [compromise] for 3 months?"

    💰 SA-Friendly Compromises:
    - Separate "no questions asked" accounts (R500/month each)
    - Monthly budget meetings with favorite snacks
    - Visual goal tracker (e.g., vacation fund jar)

    ⚠️ When to Seek Help:
    - Hiding purchases regularly
    - Constant money arguments (3+ monthly)', 9
    );

-- Quizzes
INSERT INTO quizzes (module_id, questions_jsonb, max_score, pass_score) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Money Therapy' LIMIT 1),
    '[{
        "question": "What percentage of adults repeat parental money habits?",
        "options": [
          "25%",
          "52%",
          "79%",
          "90%"
        ],
        "correct_answer": 2,
        "points": 1
      },
      {
        "question": "Which is NOT a money avoidance behavior?",
        "options": [
          "Not checking bank statements",
          "Tracking every expense",
          "Ignoring overdue bills",
          "Avoiding budget talks"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "What technique helps during financial panic?",
        "options": [
          "5-4-3-2-1 grounding",
          "Retail therapy",
          "Ignoring the problem",
          "Taking out more credit"
        ],
        "correct_answer": 0,
        "points": 1
      },
      {
        "question": "Which SA-specific spending trigger is real?",
        "options": [
          "''It''s on sale at Woolies''",
          "''Election year savings''",
          "''Tax season discount''",
          "''Load shedding bonus''"
        ],
        "correct_answer": 0,
        "points": 1
      },
      {
        "question": "What''s the #1 psychological reason people overspend after payday?",
        "options": [
          "Fear of missing out (FOMO)",
          "Compensating for childhood deprivation",
          "Social media envy",
          "All of the above"
        ],
        "correct_answer": 3,
        "points": 1
      }
    ]',
    5,
    3
    );












--- Young & Wealthy
INSERT INTO learning_modules (module_title, topic, difficulty, banner_image_path) VALUES 
    ('Young & Wealthy', 'Wealth Building', 'advanced', 'learn_banners/Young.png');

-- Lessons
INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Young & Wealthy' LIMIT 1), 1, 'Compound Growth Hacking',
    '📈 The Math That Beats Salaries: 

    🔥 SA-Specific Compound Scenarios:  
    - R5k/month at 12% (SA equity avg.) = R4.8M in 20 years  
    - R10k/month in USD ETFs (10% avg.) = $500k in 15 years  

    💡 Advanced Tactics:  
    1. Dividend Reinvestment: Use SA REITs paying 8-12% yields  
    2. Tax Harvesting: Offset capital gains with tax-loss selling  
    3. Leveraged Investing: Prudently use RA top-up tax benefits  

    ⚠️ Advanced Risks:  
    - Sequence risk (withdrawing during market dips)  
    - Currency volatility in offshore investments  

    🛠️ Tools:
    - ETFSA calculator (compare SA vs offshore growth)
    - Tax-free compounding visualizer (our app premium feature)', 10
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Young & Wealthy' LIMIT 1), 2, 'Asset Location Strategy',
    '🌍 Optimal Placement Across Jurisdictions: 

    🗺️ SA Asset Map: 
    - Tax-Free Savings Account: High-growth equities  
    - RA: USD-denominated ETFs (Regulation 28 compliant)  
    - Discretionary: SA dividend-paying stocks (dividend tax = 20%)  

    🇺🇸 Offshore Allocation Sweet Spot:  
    - 30-50% in USD ETFs (VOO, VXUS)  
    - LISPs vs direct ownership tax implications  

    💣 SA-Specific Pitfalls:  
    - Exchange control limits (R1M discretionary allowance)  
    - Estate duty traps on foreign assets  

    💡 Pro Move:  
    Use endowment policies for tax-efficient offshore exposure beyond R1M', 12
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Young & Wealthy' LIMIT 1), 3, 'Advanced Tax Arbitrage',
    '⚖️ Playing SARS Like Chess: 

    ♟️ SA-Specific Moves:
    1. Retirement Annuity Timing:
       - Contribute R350k in high-income years (max deduction)
       - Withdraw at lower tax bracket post-retirement

    2. Trust Structures:
       - Income splitting with family trusts (effective tax rate 20-30%)

    3. Section 12J Sunset Clauses:
       - 100% tax deduction on qualifying venture capital  

    💡 Case Study:
    Earning R1.5M/year? RA contribution saves you R157,500 in tax immediately

    ⚠️ Compliance Note:  
    Always disclose offshore assets - SARS shares data with 100+ countries', 11
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Young & Wealthy' LIMIT 1), 4, 'Leveraged Wealth Building',
    '🏗️ Using OPM (Other People''s Money) Wisely: 

    🏠 SA Property Hacks:
    - Access bonds: Draw down on home equity at prime -1%
    - Rental arbitrage: Lease-to-let strategies in student areas

    📈 Securities Lending:
    - Earn 4-8% p.a. lending your ETF units to short sellers

    🚫 Danger Zones:
    - CFD trading (99% lose money)  
    - Unsecured personal loans for investing  

    💡 Advanced Play:  
    Margin loans at 6% to invest in dividend stocks paying 9% = 3% risk-adjusted spread', 10
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Young & Wealthy' LIMIT 1), 5, 'Exit Strategies & Liquidity Events',
    '🔄 Turning Paper Wealth Into Cash:  

    💸 SA Liquidity Options:
    1. Dividend Recapitalization:
       - Take loans against share portfolios (60-70% LTV)

    2. Asset-Backed Lending:  
       - Use ETF holdings as collateral for property deposits  

    3. Tax-Free Withdrawals:
       - Structured withdrawals from TFSA after 10+ years

    🇺🇸 Offshore Considerations:  
    - Wash sale rules (30-day waiting period)  
    - PFIC taxation traps for SA residents  

    📌 Golden Rule:
    Always maintain 3 liquidity buckets:
    1. Immediate (cash)  
    2. Medium-term (income assets)  
    3. Long-term (growth assets)', 12
    );

-- Quizzes
INSERT INTO quizzes (module_id, questions_jsonb, max_score, pass_score) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Young & Wealthy' LIMIT 1),
    '[{
        "question": "What''s the optimal use of a TFSA for a high earner?",
        "options": [
          "Money market funds",
          "High-growth equities",
          "Forex trading",
          "Cryptocurrency"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "What''s the maximum RA contribution tax deduction?",
        "options": [
          "R50,000",
          "R175,000",
          "R350,000",
          "Unlimited"
        ],
        "correct_answer": 2,
        "points": 1
      },
      {
        "question": "Which leveraged strategy has acceptable risk for advanced investors?",
        "options": [
          "CFD trading",
          "Margin loans for dividend stocks",
          "Unsecured personal loans for crypto",
          "All of the above"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "What''s a key consideration for offshore asset location?",
        "options": [
          "SARS data sharing",
          "Estate duty implications",
          "Exchange control limits",
          "All of the above"
        ],
        "correct_answer": 3,
        "points": 1
      },
      {
        "question": "What''s the minimum recommended liquidity buckets?",
        "options": [
          "1 (cash only)",
          "2 (cash + investments)",
          "3 (cash + income + growth)",
          "No need for liquidity planning"
        ],
        "correct_answer": 2,
        "points": 1
      }
    ]',
    5,
    4
    );










--- Salary Negotiator
INSERT INTO learning_modules (module_title, topic, difficulty, banner_image_path) VALUES 
    ('Salary Negotiator', 'Career Growth', 'intermediate', 'learn_banners/SalaryNegotiator.png');

-- Lessons
INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Salary Negotiator' LIMIT 1), 1, 'The SA Market Value Calculator',
    '💰 Know Your Worth Before Negotiating: 

    📊 SA-Specific Benchmark Tools:
    1. Payscale SA (Industry-adjusted averages)
    2. CareerJunction Salary Report (2024 tech salaries 15% higher)
    3. Recruiter Rule of Thumb:
       - Junior (0-3yrs): R15k-R35k  
       - Mid (4-7yrs): R40k-R75k  
       - Senior (8+ yrs): R80k-R150k  

    🔢 Adjust For:
    - Location: Cape Town salaries 8% > Johannesburg
    - Qualification: Degree adds 18-25% premium
    - Niche Skills: Cloud certs = +R10k-R15k

    💡 Script:
    "Based on my research, the market range for this role with my Python and AWS skills is R55k-R65k. Where does this fit your budget?"', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Salary Negotiator' LIMIT 1), 2, 'The Counteroffer Playbook',
    '🔄 When They Say "We Can Only Offer R50k":

    🚦 Response Strategy: 
    1. Pause (5 second rule) - Don''t react immediately  
    2. Anchor High - "I was expecting R65k based on market data"  
    3. Trade Variables -  
       - "Could we do R55k with a 6-month review?"  
       - "Would R50k plus 10% bonus work?"  

    💼 SA-Specific Perks to Negotiate: 
    - Car allowance (Tax-efficient up to R85k/year)  
    - Education fund (SARS-deductible for employer)  
    - Remote work days (Save 2hrs commute = 11% time bonus)  

    ⚠️ Red Flags: 
    - "We''ll review later" → Get written timelines  
    - "Budget constraints" → Ask for non-cash compensation', 9
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Salary Negotiator' LIMIT 1), 3, 'Promotion Poker',
    '🎯 Timing Your Ask Perfectly:

    📅 SA Corporate Cycles:
    - Budgets set in Feb/March → Ask in January  
    - Performance reviews → Prepare 6 weeks early  

    📈 Build Your Case: 
    1. Metric Map:  
       - "Increased team productivity by 30%"  
       - "Saved R200k in vendor costs"  
    2. Peer Evidence:  
       - "Comparable roles at [Competitor] pay R20k more"  

    💡 Phrase That Works: 
    "I''ve taken on responsibilities beyond my role (list). Let''s discuss aligning my compensation with this scope."

    ⏳ When to Walk Away:  
    - >20% below market after 2 negotiation rounds  
    - Broken promises on previous reviews', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Salary Negotiator' LIMIT 1), 4, 'Benefits Decoder',
    '🏆 R1 = R1.28 in Smart Benefits: 

    🧮 SA Tax-Efficient Compensation:
    1. Retirement Contributions
       - Employer RA contributions = tax-free up to 27.5% of salary

    2. Car Allowance
       - R85k/year tax-free vs taxable salary

    3. Stock Options
       - Capital gains tax (18%) vs income tax (45%)  

    💰 Hidden Value Calculator:
    - R10k car allowance = R14k pre-tax salary
    - R5k education fund = R7k after-tax value

    💡 Script:
    "Instead of a R10k increase, could we structure it as R5k salary + R5k education allowance?"', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Salary Negotiator' LIMIT 1), 5, 'The Exit Interview Pay Bump',
    '✈️ Leveraging Job Offers Ethically:

    🕵️ The 80/20 Intelligence Gathering:
    - Research: "What''s the retention budget for my role?"
    - Signal: "I''ve been approached about opportunities paying R20k more"

    💼 SA-Specific Dynamics: 
    - Q4 (Oct-Dec) = Highest counteroffer success rates  
    - SMEs more flexible than corporates on quick adjustments  

    ⚖️ Ethical Approach:  
    1. Be prepared to actually leave  
    2. Give current employer 72 hours to respond  
    3. Never bluff with fake offers  

    📌 Template:  
    "I enjoy working here but have an offer at R75k. Before I consider it, I wanted to see if we could close this gap."', 8
    );

-- Quizzes
INSERT INTO quizzes (module_id, questions_jsonb, max_score, pass_score) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Salary Negotiator' LIMIT 1),
    '[{
        "question": "What''s the tax-free cap for car allowances in SA?",
        "options": [
          "R45k/year",
          "R85k/year",
          "R120k/year",
          "Unlimited"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "When are SA corporate budgets typically set?",
        "options": [
          "January",
          "February/March",
          "June/July",
          "December"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "Which benefit provides the most tax efficiency?",
        "options": [
          "Cash bonus",
          "Employer RA contributions",
          "Travel allowance",
          "Stock options"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "What''s the recommended response time when leveraging an offer?",
        "options": [
          "24 hours",
          "72 hours",
          "1 week",
          "2 weeks"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
    "question": "Why does a R30k ''increase'' often only net R18k?",
    "options": [
        "Progressive tax brackets jump at R31k",
        "UIF/PAYE deductions scale non-linearly",
        "Retirement contributions auto-increase",
        "All of the above"
    ],
    "correct_answer": 3,
    "points": 1
    }
    ]',
    5,
    3
    );










--- Insurance Decoded
INSERT INTO learning_modules (module_title, topic, difficulty, banner_image_path) VALUES 
    ('Insurance Decoded', 'Risk Management', 'intermediate', 'learn_banners/Insurance.png');

-- Lessons
INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Insurance Decoded' LIMIT 1), 1, 'The SA Insurance Ladder',
    '🛡️ What to Cover & When:

    📊 Age-Based Coverage Matrix:  
    18-25:  
    - Hospital Plan (R500-R1,200/month)  
    - Cellphone insurance (if contract)  

    26-35:  
    - Income Protection (3-6X salary)  
    - Disability Cover (R15k-R25k/month)  

    36-50:  
    - Life Cover (10X salary)  
    - Critical Illness (R500k lump sum)  

    💡 SA-Specific Rules: 
    - HIV+ can get cover after 6 months ARV treatment  
    - Load shedding increases appliance claims → check policy exclusions  

    ⚠️ Overlap Alert:  
    RA already includes life cover - don''t double pay!', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Insurance Decoded' LIMIT 1), 2, 'Policy Fine Print Translator',
    '🔍 Hidden Clauses That Deny Claims: 

    🚨 Top SA Exclusions: 
    1. "Acts of nature" - Some exclude flood damage (check Cape Town policies)  
    2. "Gradual Damage" - Damp/mold claims often rejected  
    3. "Unauthorized Repairs" - Must use insurer''s approved vendors  

    📝 Must-Check Sections: 
    - Average Clause - If underinsured, they pay proportionally  
    - Excess Structure - Often higher for weather-related claims  

    💡 Pro Tip:  
    Request the wording guide - plain English explanation of terms', 9
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Insurance Decoded' LIMIT 1), 3, 'The Bundling Hack',
    '🎁 How to Combine Policies & Save 30%:  

    🔄 SA Provider Combinations:
    1. Car + Home (Outsurance, Discovery)
       - Save up to 25%
    2. Life + Disability (Sanlam, Momentum)
       - Cheaper than separate policies  

    💰 Break-Even Calculator:
    - Bundling saves money if total premium < sum of individual policies
    - Always compare with standalone options annually

    ⚠️ Watch Out For:
    - "Convenience bundling" with unnecessary add-ons
    - Automatic premium increases after first year', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Insurance Decoded' LIMIT 1), 4, 'Claims Kung Fu',
    '🥋 Get Paid Faster in SA: 

    📌 Documentation Checklist:
    1. Car Accident:
       - SAPS case number within 24hrs
       - 3+ photos from different angles

    2. Home Claim:
       - Before/after photos of damaged items
       - Original purchase receipts

    💡 Claims Hacks:
    - Use WhatsApp timestamps as evidence
    - Submit via app instead of email (faster processing)

    🚫 Claim-Killers:
    - Posting on social media before claim settled
    - Admitting fault at accident scene', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Insurance Decoded' LIMIT 1), 5, 'Vitality vs Reality',
    '🏆 Reward Programs Demystified:  

    ⚖️ Discovery Vitality Math:
    - Gold status = 25% cashback on healthy food  
    - But requires gym 12x/month + 10k steps/day  

    📊 Break-Even Analysis:
    - For R499/month premium:
      Need R2,000/month healthy spend to justify cost

    💡 Best For:  
    - Frequent gym-goers  
    - Families (child discounts add value)  

    🚫 Worst For:
    - Infrequent travelers
    - Those without Discovery Bank  

    🔄 Alternatives:
    - Sanlam Reality (better for retirees)
    - Momentum Multiply (stronger investment links)', 7
    );

-- Quizzes
INSERT INTO quizzes (module_id, questions_jsonb, max_score, pass_score) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Insurance Decoded' LIMIT 1),
    '[{
        "question": "What must HIV+ patients do to qualify for cover?",
        "options": [
          "Pay 50% higher premiums",
          "Complete 6 months ARV treatment",
          "Get specialist approval",
          "No cover available"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "What does the ''average clause'' mean?",
        "options": [
          "They pay average market rates",
          "Claims are paid proportionally if underinsured",
          "Only covers average-risk individuals",
          "Premiums adjust to industry averages"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "Which documents are critical for car claims?",
        "options": [
          "Driver''s license copy",
          "SAPS case number",
          "Service history",
          "All of the above"
        ],
        "correct_answer": 3,
        "points": 1
      },
      {
        "question": "How many gym visits needed for Vitality Gold?",
        "options": [
          "4x/month",
          "8x/month",
          "12x/month",
          "16x/month"
        ],
        "correct_answer": 2,
        "points": 1
      },
        {
    "question": "Why does ''full medical aid'' often leave you with massive bills?",
    "options": [
        "Procedure codes are deliberately mismatched",
        "Hospitals charge above medical aid rates",
        "Your plan has hidden sub-limits",
        "All of the above"
    ],
    "correct_answer": 3,
    "points": 1
    }
    ]',
    5,
    3
    );










-- Money Moves for Students
INSERT INTO learning_modules (module_title, topic, difficulty, banner_image_path) VALUES 
    ('Money Moves for Students', 'Personal Finance', 'beginner', 'learn_banners/MoneyForStudents.png');

-- Lessons
INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Money Moves for Students' LIMIT 1), 1, 'The Student Budget Blueprint',
    '📊 R5000/month Survival Guide (2024):

    🍞 Essential Breakdown:
    - Rent: R2500 (shared accommodation)
    - Food: R1500 (bulk staples + varsity meal deals)
    - Transport: R500 (student bus pass)
    - Data: R300 (night surfer packages)
    - Buffer: R200

    💡 SA Student Hacks:
    - Use Yebo Fresh for bulk pantry deliveries
    - Checkers Sixty60 first-order discount for groceries
    - NSFAS allowance? Allocate 20% to emergency savings

    🚨 Budget Killers:
    - Takeout coffee (R25/day = R750/month)
    - Club cover charges (rather pre-drink responsibly)', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Money Moves for Students' LIMIT 1), 2, 'Textbook Hacks That Save Thousands',
    '📚 Avoid Paying Full Price:

    🔄 SA Book Routes:
    1. Rent:
       - Textbook Library (R200/semester vs R800 new)
       - Campus noticeboards (Seniors selling used)

    2. Digital:
       - LibGen for international editions (check copyright)
       - VitalSource for e-book rentals

    3. Sell Back:
       - List on StudentCircle 2 months before exams

    💸 Case Study:
    Accounting 101 textbook:  
    - New: R1200  
    - Used: R600  
    - Rental: R300  
    - E-book: R450  
    - Library: FREE (but limited copies)  

    ⚠️ Warning:
    Avoid photocopy shops - fines up to R5000 for pirated copies', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Money Moves for Students' LIMIT 1), 3, 'Student Discounts You are Missing',
    '🎟️ SA Student Perks (Flash Your Card):

    💰 Big Savings: 
    - Transport: 50% off Metrorail, MyCiTi  
    - Tech: Apple Edu Discount (up to 10%), Microsoft Office FREE  
    - Banking: FNB Student Account (no fees)  

    🍔 Food Deals:  
    - Steers: Free chips with burger (Tuesdays)  
    - McDonalds: R20 coffee refills  
    - Nandos: 10% off with campus ID  

    📱 App Bonuses:  
    - Entertainment: Spotify + Showmax bundle (R99/month)  
    - Shopping: Superbalist student discount (15% off first order)  

    💡 Pro Tip:  
    Keep digital student ID on phone - some places accept screenshots!', 6
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Money Moves for Students' LIMIT 1), 4, 'Side Hustles Between Lectures',
    '🕒 Earn R2000/month in 10 Hours/Week:  

    👩💻 Campus-Friendly Gigs: 
    1. Note-Taking: Sell summaries on Stuvia (R50-R200/doc)  
    2. Reselling: Buy cheap snacks in bulk, sell in res  
    3. Tutoring: High school subjects (R150-R300/hour)  
    4. Event Staffing: Sign up with StudentLink for weekend gigs  

    📌 SA Platforms:  
    - Upwork for freelance writing/design  
    - M4Jam for micro-tasks (R5-R50/job)  

    ⚠️ Avoid:  
    - Pyramid schemes ("financial freedom" seminars)  
    - Unregistered loan sharks in townships', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Money Moves for Students' LIMIT 1), 5, 'Graduation Financial Prep',
    '🎓 Set Up Your Future in Final Year:  

    📝 Pre-Grad Checklist:  
    1. Clear Debt:  
       - NSFAS starts charging interest 1 year after graduating  
    2. Build Credit:  
       - Get student credit card (R500 limit)  
       - Pay Netflix subscription with it  
    3. Job Hunt Fund:  
       - Save R2000 for interview transport/portfolios  

    💼 SA Graduate Reality:  
    - First salary likely R12k-R18k  
    - 40% will be deductions (tax, UIF, medical)  

    💡 Transition Tips:  
    - Keep student discounts until card expires  
    - Switch to youth accounts (e.g., Capitec Youth)', 8
    );

-- Quizzes
INSERT INTO quizzes (module_id, questions_jsonb, max_score, pass_score) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Money Moves for Students' LIMIT 1),
    '[{
        "question": "What percentage of NSFAS allowance should be saved?",
        "options": [
          "5%",
          "10%",
          "20%",
          "30%"
        ],
        "correct_answer": 2,
        "points": 1
      },
      {
        "question": "Which textbook option is usually cheapest?",
        "options": [
          "New from bookstore",
          "E-book rental",
          "Secondhand from senior",
          "Campus library"
        ],
        "correct_answer": 3,
        "points": 1
      },
      {
        "question": "Which is NOT a legit student side hustle?",
        "options": [
          "Selling lecture notes",
          "Tutoring high schoolers",
          "Pyramid scheme recruitment",
          "Event staffing"
        ],
        "correct_answer": 2,
        "points": 1
      },
      {
        "question": "When does NSFAS start charging interest?",
        "options": [
          "Immediately after graduation",
          "1 year after graduating",
          "5 years after graduating",
          "Never"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
    "question": "What''s the #1 way students waste money on textbooks?",
    "options": [
        "Buying new instead of renting",
        "Purchasing international editions unknowingly",
        "Not reselling books after finals",
        "All of the above"
    ],
    "correct_answer": 3,
    "points": 1
    }
    ]',
    5,
    3
    );










--- Big Life Purchases: The Don''ts'
INSERT INTO learning_modules (module_title, topic, difficulty, banner_image_path) VALUES 
    ('Big Life Purchases: The Don''ts', 'Financial Planning', 'intermediate', 'learn_banners/BigLifeChangers.png');

-- Lessons
INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Big Life Purchases: The Don''ts' LIMIT 1), 1, 'Don''t Buy a Car Like This',
    '🚗 Car Buying Traps That Wreck Your Budget:  

    🚫 SA-Specific Mistakes:  
    1. "R3500/month" Scam  
       - 72-month loans at 15% interest = paying 2X car value  
       - Instead: Max 3-year term, 20% deposit  

    2. Demo Model Danger  
       - Ex-rentals with 40,000km sold as "new"  
       - Red Flag: No full service history  

    3. Credit Life Insurance Upsell  
       - Often costs R300-R800/month unnecessarily  
       - Better: Use existing life policy  

    💸 True Cost Example:  
    R200k car on 6-year loan = R380k after interest & insurance', 9
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Big Life Purchases: The Don''ts' LIMIT 1), 2, 'House Hunting Red Flags',
    '🏠 Property Don''ts That Become Nightmares:  

    🚩 SA Warning Signs:  
    1. "Too Good" Listings  
       - Hijacked properties (verify deeds office)  
       - Municipal debts not cleared (you inherit them)  

    2. Developer Promises  
       - "Guaranteed rental income" schemes  
       - "No transfer costs" hidden in inflated price  

    3. Emotional Bidding  
       - Paying 20% above market due to FOMO  

    🔍 Must-Do Checks:  
    - Physically visit at different times  
    - Demand 2 years of utility bills  
    - Check for pending rezoning applications  

    ⚠️ Quote to Remember:  
    "Rather miss the ''perfect'' house than buy a money pit"', 10
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Big Life Purchases: The Don''ts' LIMIT 1), 3, 'Wedding Spending Traps',
    '💍 How SA Couples Waste R100k+:  

    🚫 Budget-Killing Choices:  
    1. Saturday Tax  
       - Venues charge 30% more for Saturdays  
       - Smart Alternative: Friday sunset weddings  

    2. Guest List Creep  
       - Adding 20 "maybe" invites = R15k extra  

    3. Package Deception  
       - "All-inclusive" that excludes chairs/tents  

    💰 Real Costs:  
    - Average SA wedding: R80k-R150k  
    - Divorce rate: 40% within 10 years  

    💡 Better Idea:  
    Spend 50% on wedding, invest 50% in property deposit', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Big Life Purchases: The Don''ts' LIMIT 1), 4, 'Furniture Finance Fails',
    '🛋️ Why 0% Interest Is a Lie:  

    🚨 Retail Tricks That Cost You:  
    1. "No Deposit" Deals  
       - Hidden 25% price markup  
       - Example: R10k couch actually costs R7k cash  

    2. Balloon Payment Shock  
       - Owning R3000 after 2 years on a bed  

    3. Damage Waiver Scam  
       - Paying R150/month for "protection" that excludes spills  

    💡 SA Reality Check:  
    - Secondhand quality furniture = 70% cheaper  
    - "Repo auctions" sell repossessed items at 40% value  

    ⚠️ Rule:  
    If it won''t last 5 years, don''t finance it', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Big Life Purchases: The Don''ts' LIMIT 1), 5, 'Education Investment Pitfalls',
    '🎓 When Degrees Don''t Pay Off:  

    🚫 SA Career Missteps:  
    1. Private College Debt  
       - R120k diploma with no accreditation  

    2. "Guaranteed Job" Lies  
       - TVET colleges promising 100% employment  

    3. Overseas Degree Trap  
       - R500k UK degree for a R25k/month SA job  

    📉 ROI Reality Check:  
    - Teachers: 10+ years to repay student loans  
    - Artists: 62% earn under R8000/month  

    💡 Smarter Paths:  
    - NSFAS-funded public universities  
    - Learn-to-earn coding bootcamps  
    - Part-time studies while working', 9
    );

-- Quizzes
INSERT INTO quizzes (module_id, questions_jsonb, max_score, pass_score) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Big Life Purchases: The Don''ts' LIMIT 1),
    '[{
        "question": "What''s the maximum recommended car loan term?",
        "options": [
          "2 years",
          "3 years",
          "5 years",
          "7 years"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "Which wedding cost is most avoidable?",
        "options": [
          "Saturday venue premium",
          "Marriage officer fees",
          "Basic catering",
          "Marriage license"
        ],
        "correct_answer": 0,
        "points": 1
      },
      {
        "question": "What do repo auctions offer?",
        "options": [
          "Brand new items",
          "Repossessed goods at 40% value",
          "Defective products",
          "Stolen goods"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "Which education option carries accreditation risks?",
        "options": [
          "Public universities",
          "TVET colleges",
          "Private career colleges",
          "Both B & C"
        ],
        "correct_answer": 3,
        "points": 1
      },
      {
    "question": "Why does a ''R3,500/month'' car deal actually cost R100k+ extra?",
    "options": [
        "72-month loan terms with compound interest",
        "Mandatory credit life insurance add-ons",
        "Dealer admin fees inflated by 300%",
        "All of the above"
    ],
    "correct_answer": 3,
    "points": 1
    }
    ]',
    5,
    3
    );













--- Don''t Get Scammed: SA Financial Predators Exposed
INSERT INTO learning_modules (module_title, topic, difficulty, banner_image_path) VALUES 
    ('Don''t Get Scammed: SA Financial Predators Exposed', 'Financial Safety', 'intermediate', 'learn_banners/SATraps.png');

-- Lessons
INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Don''t Get Scammed: SA Financial Predators Exposed' LIMIT 1), 1, 'MLM vs Pyramid: Spot the Difference',
    '🚨 SA''s Most Disguised Scams:  

    🔍 Telltale Signs of a Pyramid Scheme:  
    1. Focus on Recruitment - "Earn R10k/week by signing up 5 friends"  
    2. No Real Product - Vague "financial education packages"  
    3. Inventory Loading - Forced to buy stock you can''t sell  

    💰 SA Case Study:  
    - "Women Empowerment" groups charging R2500 "starter kits"  
    - "Bitcoin Clubs" promising 20% monthly returns  

    💡 Legit Alternatives:  
    - Actual sales jobs with base pay (e.g., retail)  
    - Registered stokvels with transparent rules', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Don''t Get Scammed: SA Financial Predators Exposed' LIMIT 1), 2, 'The 500% Interest Trap',
    '💸 How Loan Sharks Operate in Townships:  

    📉 Math of Destruction:  
    - Borrow R1000 → Owe R5000 in 3 months  
    - "Rollover" loans double debt weekly  

    🕵️ Identifying Illegal Lenders:  
    1. No NCR registration number  
    2. Cash-only transactions  
    3. Keeps your ID/SASSA card  

    🚨 SA Red Flags:  
    - "No paperwork needed"  
    - "We know where you live" threats  

    💡 Emergency Options:  
    - National Debtline (0800 007 081)  
    - CAPitec small loans at 28% APR max', 9
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Don''t Get Scammed: SA Financial Predators Exposed' LIMIT 1), 3, 'Too-Good-To-Be-True Returns',
    '📈 Fake Investment Hall of Shame:  

    🚫 SA Scams That Fooled Thousands:  
    1. "10% Monthly Crypto Returns" (disappeared with R50M)  
    2. "Government Tender Investments" (fake documents)  
    3. "Property Syndication" (ghost developments)  

    🔎 Verification Checklist:  
    - Check FSCA registration (www.fsca.co.za)  
    - Google "[company name] + scam"  
    - Demand physical office visit  

    💡 Safe Alternatives:  
    - EasyEquities for real investing  
    - Registered unit trusts', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Don''t Get Scammed: SA Financial Predators Exposed' LIMIT 1), 4, 'Your Phone is the New Target',
    '📱 SA-Specific Digital Traps:  

    ⚠️ Current Scams (2024):  
    1. "SARS Refund" SMS - Fake link steals banking login  
    2. "Parcel Delivery Fee" - Fake Post Office invoices  
    3. "Job Offer" WhatsApps - Upfront "training fee" scam  

    🔐 Protection Protocol:  
    1. Never share OTPs (even with "bank staff")  
    2. Check sender IDs (real SARS uses 47277)  
    3. Enable 2FA on all accounts  

    📞 Report To:  
    - SA Fraud Hotline: 0800 020 081  
    - Banks reverse scams if reported <24hrs', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Don''t Get Scammed: SA Financial Predators Exposed' LIMIT 1), 5, 'When Loved Ones Become Predators',
    '💔 Emotional Blackmail Scams:  

    🎭 Common Tactics:  
    1. "Emergency Loan" - Niece needing varsity funds  
    2. "Business Opportunity" - Cousin''s sure-bet spaza shop  
    3. "Inheritance Fee" - Distant relative claiming lottery winnings  

    🚫 How to Say No:  
    - "I have a strict no-loan policy"  
    - "Let me check with my financial advisor"  
    - Offer non-cash help instead  

    💡 SA Reality:  
    - 68% of personal loans to family never repaid  
    - Stokvels safer than informal family "investments"', 8
    );

-- Quiz
INSERT INTO quizzes (module_id, questions_jsonb, max_score, pass_score) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Don''t Get Scammed: SA Financial Predators Exposed' LIMIT 1),
    '[{
        "question": "What proves a lender is registered with NCR?",
        "options": [
          "WhatsApp messages",
          "NCR registration number",
          "Flashy car",
          "Many customers"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "Which is a real SARS SMS number?",
        "options": [
          "072 123 4567",
          "47277",
          "SARS123",
          "No official number"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "What percentage of family loans get repaid?",
        "options": [
          "10%",
          "32%",
          "68%",
          "95%"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "Where to check investment company legitimacy?",
        "options": [
          "Facebook likes",
          "FSCA website",
          "Google ads",
          "TikTok comments"
        ],
        "correct_answer": 1,
        "points": 1
      },
        {
    "question": "Why do ''get rich quick'' scams use WhatsApp groups?",
    "options": [
        "To bypass financial regulators",
        "Pressure tactics with fake success screenshots",
        "Disappear after payment with no trace",
        "All of the above"
    ],
    "correct_answer": 3,
    "points": 1
    }
    ]',
    5,
    3
    );








--- Don''t Sign That! Contract Traps for South Africans
INSERT INTO learning_modules (module_title, topic, difficulty, banner_image_path) VALUES 
    ('Don''t Sign That! Contract Traps for South Africans', 'Consumer Rights', 'intermediate', 'learn_banners/ContractTraps.png');

-- Lessons
INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Don''t Sign That! Contract Traps for South Africans' LIMIT 1), 1, 'Cellphone Contract Maths That Screw You',
    '📱 The R15,000 "Free" Phone Trap:  

    🔢 SA Reality Check (24-month contract):  
    - "Free" iPhone 15: R0 upfront  
    - Monthly cost: R999 x 24 = R23,976  
    - Actual phone price: R18,000  
    = You pay R5,976 extra in airtime  

    🚫 Tricks to Spot:  
    1. "Flexi" data that expires monthly  
    2. Handset penalties if you cancel early  
    3. Automatic renewal clauses  

    💡 Smarter Move:  
    Buy phone cash + prepaid = Save R300/month  
    "Would you take a R24k loan to buy a R18k phone?"', 9
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Don''t Sign That! Contract Traps for South Africans' LIMIT 1), 2, 'Gym Lock-In Horror Stories',
    '🏋️ Why Cancelling is Near Impossible:  

    📜 SA Contract Tricks:  
    1. 12-24 month minimum terms (even if gym closes)  
    2. Debit order + admin fee combo (R1500 cancellation)  
    3. "Freeze fee" scams (R200/month to pause membership)  

    💸 Real Case:  
    Sign R499/month x 24 months → Gym closes Month 3 → Still owe R11,976  

    🛑 Escape Routes:  
    1. Cooling-off period: 5 business days to cancel  
    2. CPA Section 14: Cancel if services decline  
    3. Death/disability clause: Submit docs to exit', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Don''t Sign That! Contract Traps for South Africans' LIMIT 1), 3, 'Timeshares: The Vacation That Owns You',
    '🏝️ Why 94% of SA Owners Regret Buying:  

    📉 The Math:  
    - Buy-in: R80,000 once-off  
    - Annual fees: R12,000 (increases 10% yearly)  
    - 10-year cost = R80k + R192k = R272k  
    = Could book 45+ luxury getaways instead  

    🚨 Resale Scams:  
    - "We''ll sell your week for R50k!" (then demand R5k "marketing fee")  

    🔐 Exit Options:  
    1. CPA Section 14 (if mis-sold)  
    2. Voluntary surrender (still pay 2 years fees)  
    3. Debt review if unable to pay', 9
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Don''t Sign That! Contract Traps for South Africans' LIMIT 1), 4, 'Lease Clauses That Rob You',
    '🏠 Illegal Rental Terms in SA:  

    🚩 Never Accept:  
    1. "No CPA Protection" (All rentals covered)  
    2. "Deposit non-refundable" (Max 1 month refundable)  
    3. "No repairs responsibility" (Landlord must fix)  

    💸 Hidden Costs:  
    - "Key deposit" over R500  
    - "Cleaning fee" not in contract  

    ⚖️ Your Rights:  
    1. 5% interest on deposit (must be paid yearly)  
    2. 24hr notice for inspections  
    3. Lease cannot auto-renew without new agreement', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Don''t Sign That! Contract Traps for South Africans' LIMIT 1), 5, 'When "7 Days Free" Costs R2000',
    '💳 Dark Pattern Subscriptions:  

    🔄 How They Get You:  
    1. Pre-checked boxes = "I agree to pay R399/month after trial"  
    2. Obscure cancel process = Must phone during office hours  
    3. Instant debit orders = No 5-day CPA waiting period  

    📌 SA Victims'' Stories:  
    - "Free" ancestry test → R189/month forever  
    - "Sample" skincare → R600/month auto-shipments  

    🛡️ Defense Tactics:  
    1. Virtual cards with R1 limit (Discovery/FNB)  
    2. Screen record cancellation processes  
    3. CPA Section 17 demand refund within 20 days', 7
    );

-- Quiz
INSERT INTO quizzes (module_id, questions_jsonb, max_score, pass_score) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Don''t Sign That! Contract Traps for South Africans' LIMIT 1),
    '[{
        "question": "What''s the max refundable rental deposit in SA?",
        "options": [
          "1 month''s rent",
          "2 months'' rent",
          "3 months'' rent",
          "Non-refundable"
        ],
        "correct_answer": 0,
        "points": 1
      },
      {
        "question": "Which clause is illegal in rental agreements?",
        "options": [
          "No pets allowed",
          "No CPA protection",
          "No loud music after 10pm",
          "No painting walls"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "How long is the cooling-off period for gym contracts?",
        "options": [
          "24 hours",
          "5 business days",
          "14 days",
          "No cooling-off period"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "What increases annually in timeshare costs?",
        "options": [
          "Only buy-in price",
          "Only annual fees",
          "Both buy-in and fees",
          "No increases allowed"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "What''s the most predatory clause in SA cellphone contracts?",
        "options": [
          "Automatic renewal without notice",
          "Admin fees doubling after 12 months",
          "Forced upgrades voiding your warranty", 
          "All of the above"
        ],
        "correct_answer": 3,
        "points": 1
        }
    ]',
    5,
    3
    );












--- Black Friday: The SA Discount Lies
INSERT INTO learning_modules (module_title, topic, difficulty, banner_image_path) VALUES 
    ('Black Friday: The SA Discount Lies', 'Consumer Awareness', 'beginner', 'learn_banners/BlackFriday.png');

-- Lessons
INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Black Friday: The SA Discount Lies' LIMIT 1), 1, 'The "70% Off" Lie You Keep Falling For',
    '🛒 How Retailers Fake Discounts:  

    📈 SA Price Tracking Data:  
    - Takealot "discounted" TVs:  
      - Oct: R12,999 → Nov: R18,999 → BF "sale" R13,499 ("30% off")  
    - Cotton On jeans:  
      - Sept: R399 → BF "50% off" at R449  

    🔍 Spot the Tricks:  
    1. Price jacking 2-3 months before BF  
    2. "Was/Now" pricing with fake original values  
    3. Limited stock of only sale items  

    💡 Prove It Yourself:  
    Use PriceCheck.co.za history tool to verify real discounts', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Black Friday: The SA Discount Lies' LIMIT 1), 2, '0% Interest = 100% Debt Trap',
    '💳 Why Store Credit is a Predator:  

    📉 The Real Math (R5k "interest-free" TV):  
    - 6 months "no interest" at R833/month  
    - Miss 1 payment → 22% interest BACKDATED  
    - Total paid: R5,000 → R6,270  

    🚨 SA Retail Tricks:  
    1. Hidden admin fees (R50-R150/month)  
    2. Auto-debit mandates that overdraft you  
    3. Credit life insurance add-ons (R89/month)  

    💡 Better Option:  
    Save R800/month for 6 months → Buy cash next year', 9
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Black Friday: The SA Discount Lies' LIMIT 1), 3, 'Why "Doorbusters" Are Junk',
    '📱 Black Friday "Deals" to Avoid:  

    🚫 SA Electronics Red Flags:  
    1. "Export Version" phones - No local warranty  
    2. Refurbished as new - Check IMEI numbers  
    3. Display models - 2000+ hours screen wear  

    🔌 Burned Buyers Stories:  
    - R8k "discount" laptop with 30-day warranty  
    - R3k headphones returned → "No refunds on BF sales"  

    💡 Smart Checklist:  
    1. Google "[product] + problems"  
    2. Demand warranty terms in writing  
    3. Film unboxing as proof', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Black Friday: The SA Discount Lies' LIMIT 1), 4, 'How Countdowns Hijack Your Brain',
    '🧠 Retail Mind Games in SA:  

    ⏳ Tactics That Trigger Panic Buys:  
    1. "3 left in stock!" (Same message for 48hrs)  
    2. Fake timers (Page refreshes reset "last chance")  
    3. Cart reservations ("Hold your items for 10min!")  

    💰 The 24-Hour Rule:  
    For any BF purchase:  
    1. Screenshot item  
    2. Wait 24 hours  
    3. Ask: "Would I buy this at full price?"  

    📌 SA Reality:  
    Real discounts continue until Dec 15 - no rush!', 6
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Black Friday: The SA Discount Lies' LIMIT 1), 5, 'When to Actually Shop',
    '🗓️ SA Retail Calendar for Smart Shoppers:  

    🛍️ Better Sale Periods:  
    - Feb/March: Back-to-school (real tech discounts)  
    - End-of-month: Sales targets pressure = real deals  
    - April/Oct: Mid-season clearance (50-70% off)  

    💎 Pro Moves:  
    1. Follow "SA Dealz" on Twitter for legit drops  
    2. Use apps like PriceCheck to track items  
    3. Negotiate in-store ("Can you beat this price?")  

    ⚠️ Remember:  
    Black Friday isn''t cheaper - just louder!', 7
    );

-- Quiz
INSERT INTO quizzes (module_id, questions_jsonb, max_score, pass_score) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Black Friday: The SA Discount Lies' LIMIT 1),
    '[{
        "question": "What proves a discount is fake?",
        "options": [
          "''Was'' price was higher 2 months ago",
          "Limited stock available",
          "Bright red sale tag",
          "All of the above"
        ],
        "correct_answer": 0,
        "points": 1
      },
      {
        "question": "What happens if you miss a ''0% interest'' payment?",
        "options": [
          "Nothing",
          "Backdated interest applies",
          "Small late fee",
          "They cancel the deal"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "Which SA period has better deals than BF?",
        "options": [
          "December holidays",
          "February back-to-school",
          "Easter weekend",
          "None - BF is best"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "What''s the golden rule before BF purchases?",
        "options": [
          "Buy immediately",
          "24-hour wait period",
          "Ask friends first",
          "Check Instagram ads"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "Why do stores use ''Limited Stock!'' labels on Black Friday?",
        "options": [
          "They actually have very few items",
          "To trigger FOMO (Fear Of Missing Out)",
          "Legal requirements for sale items",
          "To manage crowd control"
        ],
        "correct_answer": 1,
        "points": 1
        }
    ]',
    5,
    3
    );









--- Banking Blindly: SA Account Fees That Steal From You
INSERT INTO learning_modules (module_title, topic, difficulty, banner_image_path) VALUES 
    ('Banking Blindly: SA Account Fees That Steal From You', 'Personal Finance', 'beginner', 'learn_banners/BankingBlinding.png');

-- Lessons
INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Banking Blindly: SA Account Fees That Steal From You' LIMIT 1), 1, '"Zero Fees" That Cost R720/Year',
    '🏦 SA Bank Fee Tricks Revealed:  

    💸 "Free" Account Real Costs:  
    - "Pay-as-you-transact":  
      - R5 debit card swipe x 20 transactions = R100/month  
    - "Included" fees:  
      - R4.50 SMS notification x 30 = R135/month  
    - "Optional" charges:  
      - R8 paper statement if you forget to go digital  

    📌 SA Bank Comparison (Monthly):  
    - FNB Easy: R105  
    - Capitec Global One: R35  
    - TymeBank: R0 (legit free)  

    💡 Switch Hack:  
    Use the BankservAfrica Account Switching Kit to change banks in 7 days', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Banking Blindly: SA Account Fees That Steal From You' LIMIT 1), 2, 'How Banks Profit From Unauthorized Debits',
    '🔄 The Debit Order Shakedown:  

    🚨 SA Fraud Stats:  
    - 42% of debit orders are disputed  
    - Banks charge R45-R95 to reverse EACH  

    🔍 Spot Illegal Debits:  
    1. "Recurring Token" scams (subscriptions that won''t die)  
    2. Amount creep (Netflix R159 → R169 → R189)  
    3. Ghost debits (old gym contracts resurrected)  

    🛡️ Protect Yourself:  
    1. Enable Debit Freeze (FNB/Standard)  
    2. Use Debit Order Protection (Capitec)  
    3. Dispute via Directive 8 within 40 days', 9
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Banking Blindly: SA Account Fees That Steal From You' LIMIT 1), 3, 'How R500 Overdrafts Become R5000 Debts',
    '💳 The Overdraft Interest Spiral:  

    📉 Real Example:  
    - R500 overdraft at 22% interest  
    - R15/day unpaid fee  
    - After 3 months = R500 → R1,850  

    ⚠️ Bank Tricks:  
    1. Auto-approve small overdrafts  
    2. Hide compound interest in fine print  
    3. "Courtesy pay" that opts you in automatically  

    💡 Escape Plan:  
    1. Opt out of overdraft facilities  
    2. Pay smallest overdraft first  
    3. Use National Debt Mediation if trapped', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Banking Blindly: SA Account Fees That Steal From You' LIMIT 1), 4, 'The R200 "Service Fee" on Every Overseas Purchase',
    '💱 How Banks Rob You on Forex:  

    💰 Real USD100 Purchase Comparison:  
    - Standard Bank: R1,850 + R200 fee  
    - Wise: R1,790 + R15 fee  
    - Revoult: R1,775 + R0 fee  

    🔎 Hidden Charges:  
    1. 3% "admin fee" on top of bad rates  
    2. Double conversion (USD→EUR→ZAR)  
    3. Weekend markups (extra 2%)  

    💡 Smart Alternatives:  
    1. Global accounts (Discovery/Tyme)  
    2. Prepaid travel cards load during strong ZAR  
    3. Cryptocurrency wallets for large transfers', 7
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Banking Blindly: SA Account Fees That Steal From You' LIMIT 1), 5, 'The Email That Gets Fees Refunded',
    '✍️ Template to Reclaim Your Money:  

    📧 Subject: Formal Complaint - Unauthorized Fees  
    Body:  
    "Per NCA Sec 74, I dispute these charges:  
    1. R95 unauthorized debit reversal fee (Tx123)  
    2. R15 overdraft interest on 01/03  
    3. R200 forex ''service fee''  

    Provide refund within 7 days or I escalate to:  
    - Ombudsman for Banking Services (ombud@obssa.co.za)  
    - FSCA Case#: [Your ID Number]  

    Attached: Proof of transactions"  

    📌 SA Law Weapons:  
    1. National Credit Act (fee limits)  
    2. CPA (unfair contract terms)  
    3. FSCA (banking misconduct)', 8
    );

-- Quiz
INSERT INTO quizzes (module_id, questions_jsonb, max_score, pass_score) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Banking Blindly: SA Account Fees That Steal From You' LIMIT 1),
    '[{
        "question": "Which truly free SA bank account exists?",
        "options": [
          "FNB Easy",
          "Capitec Global One", 
          "TymeBank",
          "All have hidden fees"
        ],
        "correct_answer": 2,
        "points": 1
      },
      {
        "question": "How long to dispute unauthorized debit orders?",
        "options": [
          "7 days",
          "40 days",
          "6 months",
          "1 year"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "What happens to R500 overdraft in 3 months at 22%?",
        "options": [
          "R500",
          "R750",
          "R1,850",
          "R5,000"
        ],
        "correct_answer": 2,
        "points": 1
      },
      {
        "question": "Who regulates bank fee disputes?",
        "options": [
          "SARS",
          "FSCA",
          "Dept of Education", 
          "No one"
        ],
        "correct_answer": 1,
        "points": 1
      },
     {
        "question": "What''s the most common ''hidden'' bank fee in SA?",
        "options": [
           "R5 ''notification fee'' per declined transaction",
           "R15 monthly ''inactivity fee'' for unused accounts",
           "R50 ''paper statement fee'' even for digital users",
           "All of the above"
        ],
        "correct_answer": 3,
        "points": 1
        }
    ]',
    5,
    3
    );











-- Learning Modules
INSERT INTO learning_modules (module_title, topic, difficulty, banner_image_path) VALUES 
    ('Study Debt: SA Education Loans That Don''t Pay Off', 'Education Finance', 'intermediate', 'learn_banners/StudyDebt.png');

-- Lessons
-- Insert lessons for 'Study Debt: SA Education Loans That Don''t Pay Off' (module_id dynamically fetched)
INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Study Debt: SA Education Loans That Don''t Pay Off' LIMIT 1), 1, 'How "Interest-Free" Becomes R250k',
    '🎓 NSFAS Fine Print That Hurts:  

    📉 The Math (R100k Loan @ 8% After 1 Year):  
    - Year 1-5: "No interest" while studying  
    - Year 6: 8% interest BACKDATED to Year 1  
    - Total Owed: R100k → R146k (46% extra)  

    ⚠️ SA Reality Check:  
    - Only 12% NSFAS graduates repay fully  
    - Blacklisted if earning > R30k/year and not paying  

    💡 Escape Routes:  
    1. Pay interest during study years  
    2. Negotiate income-based repayments  
    3. Become a teacher/nurse (partial forgiveness)', 9
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Study Debt: SA Education Loans That Don''t Pay Off' LIMIT 1), 2, 'R150k Diplomas Employers Ignore',
    '🏫 Unaccredited SA Colleges Exposed:  

    🚨 Red Flags:  
    1. "100% Job Placement" claims  
    2. "No Matric Needed" promises  
    3. CHE/SAQA registration missing  

    💸 Victim Stories:  
    - R120k "IT Diploma" = Print shop job @ R5k/month  
    - R80k "Fashion Design" course = Unemployed  

    🔍 Verification Tools:  
    1. Check www.che.ac.za  
    2. Demand SAQA NQF level  
    3. Google "[College] + scam"', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Study Debt: SA Education Loans That Don''t Pay Off' LIMIT 1), 3, 'Why UK Degrees Don''t Equal UK Salaries',
    'R500k Debt for R25k Jobs:  

    📊 SA Return-on-Investment Reality:  
    - UK Degree Cost: R500k (with living expenses)  
    - Average SA Salary: R25k/month  
    - Payback Period: 22+ years  

    🚫 Hidden Costs:  
    1. SAQA evaluation fees (R2000+)  
    2. Unaccredited "colleges" (e.g., non-Russell Group)  
    3. No work visa = Must return to SA  

    💡 Smarter Paths:  
    1. SA universities + exchange programs  
    2. German public universities (free tuition)  
    3. Online degrees + local internships', 9
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Study Debt: SA Education Loans That Don''t Pay Off' LIMIT 1), 4, 'Degrees vs Certificates That Actually Pay',
    '🔄 SA Education ROI Rankings:  

    💵 Top Earning Certificates (1-2 years):  
    1. AWS Cloud Practitioner (R35k-R60k starting)  
    2. CompTIA Security+ (R40k-R70k in cybersecurity)  
    3. PMI-CAPM (Project management @ R45k+)  

    📜 Worthwhile Degrees:  
    1. Actuarial Science (R50k+ starting)  
    2. Data Science (R45k+)  
    3. Nursing (Govt bursaries + quick employment)  

    💣 Worst ROI Degrees:  
    - Generic Business Admin (R18k avg)  
    - Fine Arts (R8k-R15k freelance)  
    - Psychology BA (needs Masters to practice)', 8
    );

INSERT INTO lessons (module_id, lesson_number, lesson_title, content, estimated_duration) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Study Debt: SA Education Loans That Don''t Pay Off' LIMIT 1), 5, 'How to Negotiate Student Debt',
    '⚖️ SA Debt Relief Options:  

    🛠️ Actionable Steps:  
    1. NSFAS: Apply for R0 payments if earning < R30k  
    2. Private Loans: Demand interest rate reduction  
    3. Credit Bureaus: Dispute incorrect listings  

    📝 Template Letter:  
    "Per NCA Sec 87, I request:  
    - Reduced repayment (current: R___ → proposed: R___)  
    - Interest freeze due to financial hardship  
    - Written confirmation within 14 days  

    Failure to respond will be reported to NCR"  

    📞 Helplines:  
    - National Student Financial Aid Scheme: 0800 202 733  
    - Debt Rescue: 086 111 6197', 8
    );

-- Quiz
INSERT INTO quizzes (module_id, questions_jsonb, max_score, pass_score) VALUES 
    ((SELECT module_id FROM learning_modules WHERE module_title = 'Study Debt: SA Education Loans That Don''t Pay Off' LIMIT 1),
    '[{
        "question": "When does NSFAS backdated interest start?",
        "options": [
          "Immediately",
          "After 1 year employment",
          "After 5 years",
          "Never"
        ],
        "correct_answer": 2,
        "points": 1
      },
      {
        "question": "Where to verify college accreditation?",
        "options": [
          "College website",
          "CHE website",
          "Facebook reviews",
          "None needed"
        ],
        "correct_answer": 1,
        "points": 1
      },
      {
        "question": "Which certificate has the highest starting salary?",
        "options": [
          "AWS Cloud",
          "Tourism Diploma",
          "Event Management",
          "Graphic Design"
        ],
        "correct_answer": 0,
        "points": 1
      },
      {
        "question": "What law protects student loan borrowers?",
        "options": [
          "National Credit Act",
          "Consumer Protection Act",
          "Both",
          "Neither"
        ],
        "correct_answer": 2,
        "points": 1
      },
     {
        "question": "What are the consequences of defaulting on student loans?",
        "options": [
          "Legal action",
          "Credit score impact",
          "Wage garnishment",
          "All of the above"
        ],
        "correct_answer": 3,
        "points": 1
        }
    ]',
    5,
    3
    );


