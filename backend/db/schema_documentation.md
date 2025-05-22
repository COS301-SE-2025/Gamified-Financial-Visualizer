# 📊 Database Schema Documentation: Gamified Financial Visualizer

This document outlines the schema of the main tables in the PostgreSQL database. Each table includes its attributes and the purpose of each field.

---

## 🧑‍💼 Table: `users`
Stores user account and authentication metadata.

| Column Name         | Data Type    | Description |
|---------------------|--------------|-------------|
| `user_id`           | SERIAL       | Primary key for the user. |
| `email`             | VARCHAR(255) | Unique login and verification email. |
| `username`          | VARCHAR(50)  | Unique display name. |
| `full_name`         | VARCHAR(100) | **Required** full name, used at registration. |
| `hashed_password`   | TEXT         | Secure hashed password. |
| `password_salt`     | TEXT         | Salt used in password hashing. |
| `email_verified`    | BOOLEAN      | True if email has been verified. |
| `two_factor_enabled`| BOOLEAN      | Enables two-factor authentication. |
| `created_at`        | TIMESTAMP    | Timestamp when the user was created. |
| `updated_at`        | TIMESTAMP    | Last modification timestamp (auto-updated). |

---

## ⚙️ Table: `user_preferences`
Holds user customization and in-app notification settings.

| Column Name                        | Data Type | Description |
|------------------------------------|-----------|-------------|
| `user_id`                          | INT NOT NULL | FK to `users`. One-to-one relationship. |
| `theme`                            | VARCHAR   | Selected UI theme. Must be 'light' or 'dark'. |
| `in_app_notifications_enabled`     | BOOLEAN   | Toggles in-app notifications on/off. |
| `ar_customizations_jsonb`          | JSONB     | Custom AR configuration per user. |
| `created_at`                       | TIMESTAMP | When preferences were created. |
| `updated_at`                       | TIMESTAMP | Last modification timestamp. Auto-updated. |

---

## 📲 Table: `user_push_subscriptions`
Stores device-specific push subscription details for PWA notifications.

| Column Name       | Data Type | Description |
|-------------------|-----------|-------------|
| `id`              | SERIAL    | Primary key. |
| `user_id`         | INT       | FK to `users`. |
| `endpoint`        | TEXT      | Web push endpoint URL. |
| `p256dh`          | TEXT      | User public encryption key. |
| `auth`            | TEXT      | Authentication secret. |
| `created_at`      | TIMESTAMP | When the subscription was saved. |
| `enabled`         | BOOLEAN   | Whether this device is still active. |

---

## 💼 Table: `accounts`
Stores user-linked financial accounts.

| Column Name     | Data Type    | Description |
|------------------|-------------|-------------|
| `account_id`     | SERIAL      | Unique account ID. |
| `user_id`        | INT         | FK to `users`. |
| `bank_name`      | VARCHAR     | Name of the institution. |
| `account_type`   | VARCHAR     | Checking, Savings, Credit, etc. |

---

## 💳 Table: `transactions`
Tracks all income and expense transactions.

| Column Name         | Data Type | Description |
|----------------------|----------|-------------|
| `transaction_id`     | SERIAL   | Unique transaction ID. |
| `account_id`         | INT      | FK to `accounts`. |
| `amount`             | NUMERIC  | Transaction amount. |
| `date`               | TIMESTAMP| When it occurred. |
| `description`        | TEXT     | Free-text description (used by AI). |
| `category_id`        | INT      | FK to global category. |
| `user_category_id`   | INT      | FK to user-created category. |
| `is_recurring`       | BOOLEAN  | Marks if it's recurring. |
| `ai_classified`      | BOOLEAN  | Whether AI auto-classified it. |

---

## 🏷️ Table: `categories`
Shared default categories (e.g., food, rent).

| Column Name  | Data Type | Description |
|---------------|-----------|-------------|
| `category_id` | SERIAL    | Primary key. |
| `name`        | VARCHAR   | Category name. |
| `icon`        | VARCHAR   | Icon name or path. |
| `is_default`  | BOOLEAN   | True if global. |

---

## 🛠️ Table: `user_categories`
User-defined personal categories.

| Column Name         | Data Type | Description |
|----------------------|----------|-------------|
| `user_category_id`   | SERIAL   | Primary key. |
| `user_id`            | INT      | FK to `users`. |
| `name`               | VARCHAR  | Custom category name. |
| `icon`               | VARCHAR  | User's icon choice. |

---

## 🔁 Table: `recurring_transactions`
Tracks repeating transactions like subscriptions.

| Column Name       | Data Type | Description |
|--------------------|----------|-------------|
| `recurring_id`     | SERIAL   | Primary key. |
| `transaction_id`   | INT      | FK to `transactions`. |
| `frequency`        | VARCHAR  | E.g., Monthly, Weekly. |
| `next_occurrence`  | DATE     | When it recurs next. |

---

## 🧠 Table: `ai_scores`
AI-calculated financial health scores.

| Column Name           | Data Type | Description |
|------------------------|----------|-------------|
| `score_id`             | SERIAL   | Primary key. |
| `user_id`              | INT      | FK to `users`. |
| `timestamp`            | TIMESTAMP| Score generation time. |
| `score_value`          | NUMERIC  | Quantitative score. |
| `financial_health_level` | VARCHAR| Descriptive rating. |

---

## 💬 Table: `ai_advice`
AI-generated financial suggestions.

| Column Name          | Data Type | Description |
|-----------------------|----------|-------------|
| `advice_id`           | SERIAL   | Primary key. |
| `user_id`             | INT      | FK to `users`. |
| `generated_at`        | TIMESTAMP| Time of generation. |
| `advice_text`         | TEXT     | Textual advice. |
| `disclaimer_included` | BOOLEAN  | Whether disclaimer was added. |

---

## 🏠 Table: `visual_assets`
Links transactions/goals to game-like AR visuals.

| Column Name             | Data Type | Description |
|--------------------------|----------|-------------|
| `asset_id`               | SERIAL   | Primary key. |
| `user_id`                | INT      | FK to `users`. |
| `asset_type`             | VARCHAR  | E.g., House, Tree. |
| `status`                 | VARCHAR  | Growing, Complete, etc. |
| `linked_transaction_id` | INT      | FK to `transactions`. |
| `linked_goal_id`        | INT      | FK to `goals`. |

---

(continues...)


---

## 🎯 Table: `goals`
Defines personal financial goals set by the user.

| Column Name     | Data Type | Description |
|------------------|----------|-------------|
| `goal_id`        | SERIAL   | Primary key. |
| `user_id`        | INT      | FK to `users`. |
| `goal_type`      | VARCHAR  | E.g., Save, Pay off debt. |
| `target_amount`  | NUMERIC  | Goal target. |
| `current_amount` | NUMERIC  | Current progress. |
| `target_date`    | DATE     | Deadline for the goal. |
| `status`         | VARCHAR  | E.g., In-progress, Completed. |

---

## 📈 Table: `goal_progress`
Tracks contributions toward a financial goal.

| Column Name     | Data Type | Description |
|------------------|----------|-------------|
| `progress_id`    | SERIAL   | Primary key. |
| `goal_id`        | INT      | FK to `goals`. |
| `date`           | DATE     | When progress was made. |
| `amount_added`   | NUMERIC  | Contribution value. |

---

## 👥 Table: `friendships`
Represents social connections between users.

| Column Name | Data Type | Description |
|--------------|----------|-------------|
| `user_id`    | INT      | FK to `users`. |
| `friend_id`  | INT      | FK to `users`. |
| `status`     | VARCHAR  | E.g., pending, accepted, blocked. |

---

## 🏆 Table: `leaderboard_entries`
Tracks leaderboard scores for gamification.

| Column Name | Data Type | Description |
|--------------|----------|-------------|
| `entry_id`   | SERIAL   | Primary key. |
| `user_id`    | INT      | FK to `users`. |
| `score`      | INT      | Gamification score. |
| `ranking`    | INT      | Rank on leaderboard. |

---

## ⚔️ Table: `challenges`
Represents game-like financial or educational challenges.

| Column Name  | Data Type | Description |
|---------------|----------|-------------|
| `challenge_id`| SERIAL   | Primary key. |
| `title`       | VARCHAR  | Challenge title. |
| `description` | TEXT     | Challenge details. |
| `start_date`  | DATE     | Start date. |
| `end_date`    | DATE     | End date. |

---

## 🎮 Table: `user_challenges`
Tracks user participation in challenges.

| Column Name   | Data Type | Description |
|----------------|----------|-------------|
| `user_id`      | INT      | FK to `users`. |
| `challenge_id` | INT      | FK to `challenges`. |
| `progress`     | VARCHAR  | Progress metric. |
| `status`       | VARCHAR  | E.g., In-progress, Completed. |

---

## 📚 Table: `learning_modules`
Stores financial literacy module content.

| Column Name | Data Type | Description |
|--------------|----------|-------------|
| `module_id`  | SERIAL   | Primary key. |
| `title`      | VARCHAR  | Module title. |
| `topic`      | VARCHAR  | Subject (e.g., Budgeting). |
| `difficulty` | VARCHAR  | Level (e.g., Beginner). |

---

## 📝 Table: `quizzes`
Linked to modules, contains test questions.

| Column Name     | Data Type | Description |
|------------------|----------|-------------|
| `quiz_id`        | SERIAL   | Primary key. |
| `module_id`      | INT      | FK to `learning_modules`. |
| `questions_jsonb`| JSONB    | Serialized questions. |
| `max_score`      | INT      | Maximum attainable score. |

---

## 🧪 Table: `quiz_attempts`
Tracks attempts and scores on quizzes.

| Column Name | Data Type | Description |
|--------------|----------|-------------|
| `attempt_id` | SERIAL   | Primary key. |
| `user_id`    | INT      | FK to `users`. |
| `quiz_id`    | INT      | FK to `quizzes`. |
| `score`      | INT      | Score achieved. |
| `timestamp`  | TIMESTAMP| Attempt timestamp. |

---

## 🎁 Table: `module_rewards`
Rewards earned from module completions.

| Column Name   | Data Type | Description |
|----------------|----------|-------------|
| `reward_id`    | SERIAL   | Primary key. |
| `user_id`      | INT      | FK to `users`. |
| `module_id`    | INT      | FK to `learning_modules`. |
| `reward_points`| INT      | Points earned. |

---

> ✅ End of database schema documentation.
