# 📊 Database Schema Documentation: Gamified Financial Visualizer

This document outlines the schema of the main tables in the PostgreSQL database. Each table includes its attributes and the purpose of each field.

---

## 🧑‍💼 Table: `users`
Stores user account and authentication metadata.

| Column Name          | Data Type    | Description                                      |
|----------------------|--------------|--------------------------------------------------|
| `user_id`            | SERIAL       | Primary key for the user.                        |
| `email`              | VARCHAR(255) | Unique login and verification email.             |
| `username`           | VARCHAR(50)  | Unique display name.                             |
| `full_name`          | VARCHAR(100) | **Required** full name, used at registration.    |
| `hashed_password`    | TEXT         | Secure hashed password.                          |
| `password_salt`      | TEXT         | Salt used in password hashing.                   |
| `email_verified`     | BOOLEAN      | True if email has been verified.                 |
| `two_factor_enabled` | BOOLEAN      | Enables two-factor authentication.               |
| `created_at`         | TIMESTAMP    | Timestamp when the user was created.             |
| `updated_at`         | TIMESTAMP    | Last modification timestamp (auto-updated).      |

---


## ⚙️ Table: `user_preferences`
Holds user customization and in-app notification settings.

| Column Name                    | Data Type    | Description                                                 |
|--------------------------------|--------------|-------------------------------------------------------------|
| `user_id`                      | INT NOT NULL | Primary key and FK to `users`. One-to-one relationship.     |
| `theme`                        | VARCHAR(50)  | Selected UI theme. Must be `'light'` or `'dark'`.           |
| `in_app_notifications_enabled` | BOOLEAN      | Toggles in-app notifications on or off. Defaults to `TRUE`. |
| `avatar_id`                    | VARCHAR(50)  | ID of selected avatar icon. Defaults to `'default_01'`.     |
| `ar_customizations_jsonb`      | JSONB        | JSON data for user’s AR environment customizations.         |
| `created_at`                   | TIMESTAMP    | Timestamp when preferences were created.                    |
| `updated_at`                   | TIMESTAMP    | Timestamp for last update. Auto-updated by trigger.         |

---


## 📲 Table: `user_push_subscriptions`
Stores device-specific push subscription details for PWA notifications.

| Column Name  | Data Type | Description                                          |
|--------------|-----------|------------------------------------------------------|
| `push_id`    | SERIAL    | Primary key for the push subscription record.        |
| `user_id`    | INT       | Foreign key to `users`. Links subscription to user.  |
| `endpoint`   | TEXT      | Web push endpoint URL where notifications are sent.  |
| `p256dh`     | TEXT      | Public encryption key used for secure messaging.     |
| `auth`       | TEXT      | Authentication secret for verifying the message.     |
| `created_at` | TIMESTAMP | Timestamp when the subscription was registered.      |
| `enabled`    | BOOLEAN   | True if the subscription is currently active.        |

---


## 💼 Table: `accounts`
Stores user-linked financial accounts across various financial institutions or platforms.

| Column Name     | Data Type     | Description                                                                 |
|------------------|--------------|-----------------------------------------------------------------------------|
| `account_id`     | SERIAL       | Primary key. Unique identifier for each account.                            |
| `user_id`        | INT          | Foreign key to `users`. Associates the account with a specific user.       |
| `bank_name`      | VARCHAR(100) | Name of the financial institution. Defaults to `'GFV Bank'`.               |
| `account_name`   | VARCHAR(100) | Custom name for the account. Defaults to `'My Account'`.                   |
| `account_type`   | VARCHAR(50)  | Type of account. Must be one of the predefined values (see below).         |
| `currency`       | VARCHAR(20)  | Currency code. Must be one of the supported values (see below).            |
| `account_number` | TEXT         | Virtual or masked account number. Defaults to `'GFV-XXXX-XXXX'`.           |
| `is_active`      | BOOLEAN      | Indicates whether the account is currently active. Defaults to `TRUE`.     |
| `created_at`     | TIMESTAMP    | Timestamp when the account was added.                                      |

### 🏦 Allowed `account_type` values:
- `current`
- `cheque`
- `savings`
- `credit`
- `fixed deposit`
- `business`
- `transmission`
- `tax-free savings`
- `trust`
- `corporate trading`
- `crypto`
- `forex`

### 💱 Allowed `currency` values:
- **Fiat**: `ZAR`, `USD`, `EUR`, `GBP`, `JPY`, `CAD`, `AUD`, `CHF`, `CNY`, `INR`, `KES`, `NGN`
- **Crypto**: `BTC`, `ETH`, `USDT`, `BUSD`, `LTC`, `XRP`, `SOL`, `BNB`, `DOGE`, `USDC`

---




## 💳 Table: `transactions`
Tracks all user transactions, including income, expenses, transfers, and system fees. Supports both global and custom categories, and identifies recurring entries.

| Column Name           | Data Type     | Description                                                                 |
|------------------------|--------------|-----------------------------------------------------------------------------|
| `transaction_id`       | SERIAL       | Primary key. Unique identifier for the transaction.                         |
| `account_id`           | INT          | Foreign key to `accounts`. Specifies which account this transaction affects. |
| `category_id`          | INT          | Foreign key to `categories`. Used if the transaction is assigned a global category. |
| `custom_category_id`   | INT          | Foreign key to `custom_categories`. Used if assigned a personal category.   |
| `transaction_amount`   | NUMERIC(12,2)| Amount of the transaction. Cannot be 0.                                     |
| `transaction_type`     | VARCHAR(20)  | Required. Must be one of: `expense`, `income`, `transfer`, `fee`, `withdrawal`, `deposit`. |
| `transaction_date`     | TIMESTAMP    | The date and time when the transaction occurred. Defaults to now.           |
| `description`          | TEXT         | Required text description of the transaction. Useful for classification.    |
| `note`                 | TEXT         | Optional additional notes about the transaction.                            |
| `is_recurring`         | BOOLEAN      | Marks the transaction as recurring or not. Defaults to `FALSE`.             |
| `created_at`           | TIMESTAMP    | Timestamp when the transaction was created in the system.                   |

> Only one of `category_id` or `custom_category_id` must be present per transaction. This is enforced via a `CHECK` constraint.

---


## 🏷️ Table: `categories`
Shared global categories for classifying user transactions, such as expenses, income, and transfers.

| Column Name     | Data Type    | Description                                                                 |
|------------------|-------------|-----------------------------------------------------------------------------|
| `category_id`     | SERIAL      | Primary key. Unique identifier for each category.                          |
| `category_name`   | VARCHAR(100)| Name of the category. Must be unique and chosen from a predefined list.    |

### ✅ Allowed `category_name` values:

- `groceries`
- `transport`
- `fuel`
- `utilities`
- `rent`
- `mortgage`
- `internet`
- `phone`
- `insurance`
- `medical`
- `health`
- `fitness`
- `education`
- `subscriptions`
- `entertainment`
- `restaurants`
- `clothing`
- `personal care`
- `gifts`
- `charity`
- `taxes`
- `savings`
- `investments`
- `loan repayment`
- `debt`
- `travel`
- `accommodation`
- `salary`
- `freelance`
- `bonus`
- `refund`
- `transfer in`
- `transfer out`
- `cash withdrawal`
- `cash deposit`
- `business income`
- `business expense`
- `maintenance`
- `repairs`
- `childcare`
- `pets`
- `home improvement`
- `fees`
- `commissions`
- `interest income`
- `dividends`
- `crypto purchase`
- `crypto sale`
- `forex`
- `wallet top-up`
- `wallet withdrawal`

> These categories are fixed at the schema level via a `CHECK` constraint and are available to all users for consistency in classification.

---


## 🛠️ Table: `custom_categories`
Stores user-defined personal categories for transaction classification, allowing customization beyond global system categories.

| Column Name             | Data Type     | Description                                                   |
|--------------------------|---------------|---------------------------------------------------------------|
| `custom_category_id`     | SERIAL        | Primary key. Unique identifier for each custom category.      |
| `user_id`                | INT           | Foreign key to `users`. Specifies the owner of the category.  |
| `custom_category_name`   | VARCHAR(100)  | Name of the custom category. Must be unique per user.         |

> This table includes a uniqueness constraint on (`user_id`, `custom_category_name`) to prevent duplicate names for the same user. A trigger also prevents custom names from matching global categories.

---


## 🔁 Table: `recurring_transactions`
Tracks repeating transactions such as subscriptions, monthly bills, or salary deposits. Each entry links to a base transaction and includes frequency and scheduling metadata.

| Column Name       | Data Type     | Description                                                                 |
|--------------------|--------------|-----------------------------------------------------------------------------|
| `recurring_id`     | SERIAL       | Primary key. Unique identifier for the recurring pattern.                   |
| `transaction_id`   | INT          | Foreign key to `transactions`. The base transaction this recurrence is based on. Must be unique. |
| `frequency`        | VARCHAR(50)  | Recurrence interval. Allowed values: `daily`, `weekly`, `biweekly`, `monthly`, `quarterly`, `yearly`. |
| `next_occurrence`  | DATE         | The next expected date this transaction should occur.                       |
| `end_date`         | DATE         | Optional end date for the recurrence. If null, it's considered indefinite.  |
| `last_run`         | DATE         | Timestamp of the last time this recurrence was processed.                   |
| `created_at`       | TIMESTAMP    | Timestamp when the recurrence was created. Defaults to current timestamp.  |

> Each recurring transaction is linked to a single transaction template via `transaction_id`.

---


## 🧠 Table: `ai_scores`
Stores AI-generated financial health evaluations for users, based on their transaction history, budgeting behavior, and other financial activities.

| Column Name              | Data Type     | Description                                                                 |
|---------------------------|--------------|-----------------------------------------------------------------------------|
| `score_id`                | SERIAL       | Primary key. Unique identifier for each AI evaluation.                      |
| `user_id`                 | INT          | Foreign key to `users`. The user this score belongs to.                     |
| `generated_at`            | TIMESTAMP    | Timestamp when the score was generated. Defaults to current timestamp.      |
| `score_value`             | INTEGER      | Numeric representation of the user's financial health.                      |
| `financial_health_level` | VARCHAR(50)  | Textual rating of financial status. Allowed values: `poor`, `fair`, `average`, `good`, `excellent`. |

> These scores are generated by the system’s AI engine and may be used for analytics, progress tracking, or personalized recommendations.

---

## 🏠 Table: `visual_assets`
Stores visual representations of financial progress in a user's AR environment. These assets evolve or unlock based on financial activity like goal completion or budgeting performance.

| Column Name     | Data Type     | Description                                                                 |
|------------------|--------------|-----------------------------------------------------------------------------|
| `asset_id`       | SERIAL       | Primary key. Unique identifier for each visual asset.                       |
| `user_id`        | INT          | Foreign key to `users`. Specifies who owns the asset.                       |
| `asset_type`     | VARCHAR(50)  | Type of asset. Must be one of the predefined types (see list below).        |
| `tier_status`    | VARCHAR(20)  | Visual tier level. Allowed values: `wood`, `bronze`, `silver`, `gold`, `platinum`, `diamond`. |
| `created_at`     | TIMESTAMP    | Timestamp when the asset was added.                                         |

### 🎨 Allowed `asset_type` values:
- `house`
- `flat`
- `shop`
- `shop_cafe`
- `shop_bakery`
- `bank`
- `school`
- `fountain`
- `tree`
- `bench`
- `car`
- `sign_post`
- `road`
- `pavement`
- `grass`
- `floor`
- `bushes`
- `parking_lot`
- `lamp_post`

> These assets are used to visually gamify user progress in an AR environment, like a growing city or virtual map.

---


## 🧱 Table: `ar_scene_state`
Stores the current state of a user’s AR (augmented reality) financial environment, which can reflect their progress, assets, and visual layout in a gamified 3D space.

| Column Name     | Data Type  | Description                                                                 |
|------------------|-----------|-----------------------------------------------------------------------------|
| `scene_id`       | SERIAL    | Primary key. Unique ID for the scene record.                                |
| `user_id`        | INT       | Foreign key to `users`. Each user has one AR scene (enforced by `UNIQUE`).  |
| `snapshot_jsonb` | JSONB     | A serialized snapshot of the user's AR environment (positions, objects, etc.). |
| `last_updated`   | TIMESTAMP | Timestamp when the AR state was last updated.                               |

> This table supports real-time visual updates and persistent rendering across sessions.

---

## 🎯 Table: `goals`
Defines financial goals set by a user or a community. Tracks both individual and group goals with progress and status information.

| Column Name       | Data Type     | Description                                                                 |
|--------------------|--------------|-----------------------------------------------------------------------------|
| `goal_id`          | SERIAL       | Primary key. Unique identifier for each goal.                              |
| `user_id`          | INT          | Foreign key to `users`. Set for personal goals (nullable for community goals). |
| `community_id`     | INT          | Foreign key to `communities`. Set for shared goals (nullable for personal goals). |
| `goal_name`        | VARCHAR(100) | Name/title of the goal.                                                     |
| `goal_type`        | VARCHAR(50)  | Type of goal. Must be one of: `savings`, `debt`, `investment`, `spending limit`, `donation`. |
| `target_amount`    | NUMERIC(12,2)| Required. The total amount the user aims to reach. Must be greater than 0. |
| `current_amount`   | NUMERIC(12,2)| Tracks the current amount contributed toward the goal. Defaults to `0`.     |
| `target_date`      | DATE         | The deadline by which the user aims to achieve the goal.                   |
| `goal_status`      | VARCHAR(50)  | Status of the goal. Must be one of: `in-progress`, `completed`, `paused`, `cancelled`, `failed`. |
| `created_at`       | TIMESTAMP    | Timestamp when the goal was created.                                       |

> Either `user_id` or `community_id` must be set, but not both. This is enforced via a `CHECK` constraint to distinguish between personal and community goals.

---


## 📈 Table: `goal_progress`
Tracks incremental contributions made toward achieving a specific financial goal. This table supports both individual and collaborative efforts on personal or community goals.

| Column Name       | Data Type     | Description                                                                 |
|--------------------|--------------|-----------------------------------------------------------------------------|
| `progress_id`      | SERIAL       | Primary key. Unique identifier for each progress entry.                    |
| `goal_id`          | INT          | Foreign key to `goals`. Identifies the goal being contributed to.          |
| `contributor_id`   | INT          | Foreign key to `users`. Identifies who made the contribution.              |
| `progress_date`    | DATE         | Date of the contribution. Defaults to the current date.                     |
| `amount_added`     | NUMERIC(12,2)| Amount of money added toward the goal. Must be greater than 0.             |

> Useful for visualizing progress over time and attributing collaborative goal effort.

---


## 👥 Table: `friendships`
Represents mutual or pending social connections between users. Supports basic friend request and approval workflows.

| Column Name           | Data Type     | Description                                                              |
|------------------------|--------------|--------------------------------------------------------------------------|
| `user_id`              | INT          | Foreign key to `users`. The user initiating the friendship.              |
| `friend_id`            | INT          | Foreign key to `users`. The target user of the friendship request.       |
| `relationship_status` | VARCHAR(20)  | Status of the relationship. Must be one of: `pending`, `accepted`, `declined`. |
| `created_at`           | TIMESTAMP    | Timestamp when the relationship was initiated or recorded.              |

> A friendship is only stored once per pair. The primary key constraint `(user_id, friend_id)` ensures uniqueness, and a `CHECK` constraint ensures that a user cannot friend themselves.

---

## 🏘️ Table: `communities`
Stores information about user-created financial communities where members can collaborate on goals, compete in challenges, and share insights.

| Column Name      | Data Type     | Description                                                           |
|-------------------|--------------|-----------------------------------------------------------------------|
| `community_id`    | SERIAL       | Primary key. Unique identifier for each community.                   |
| `owner_id`        | INT          | Foreign key to `users`. The creator/owner of the community.          |
| `community_name`  | VARCHAR(100) | Name of the community.                                               |
| `description`     | TEXT         | Optional description of the community's purpose or goals.            |
| `created_at`      | TIMESTAMP    | Timestamp when the community was created.                            |

---

## 👥 Table: `community_members`
Tracks membership of users within communities, including invitation/request status and join timestamp.

| Column Name         | Data Type  | Description                                                                  |
|----------------------|-----------|------------------------------------------------------------------------------|
| `community_id`       | INT       | Foreign key to `communities`. Identifies the community.                     |
| `user_id`            | INT       | Foreign key to `users`. Identifies the user who is a member or invitee.     |
| `membership_status`  | VARCHAR(20) | Status of membership. Must be one of: `invited`, `requested`, `accepted`, `declined`. |
| `joined_at`          | TIMESTAMP | Timestamp when the user joined or was invited. Defaults to current timestamp. |

> The primary key `(community_id, user_id)` ensures a user has only one status per community.

---



















## 🏆 Table: `leaderboard_entries`
Tracks leaderboard scores for individual users or communities in the context of challenges. Used for gamification and competition ranking.

| Column Name       | Data Type | Description                                                                 |
|--------------------|----------|-----------------------------------------------------------------------------|
| `entry_id`         | SERIAL   | Primary key. Unique identifier for each leaderboard entry.                 |
| `user_id`          | INT      | Foreign key to `users`. Set if the entry is for an individual.             |
| `community_id`     | INT      | Foreign key to `communities`. Set if the entry is for a community.         |
| `challenge_id`     | INT      | Foreign key to `challenges`. Identifies the challenge this score relates to. |
| `leaderboard_score`| INT      | The score earned in the challenge.                                          |
| `ranking`          | INT      | The ranking position on the leaderboard.                                    |

> Exactly one of `user_id` or `community_id` must be set, enforced via a `CHECK` constraint. This allows flexible support for both individual and community-based leaderboards.

---


## ⚔️ Table: `challenges`
Represents gamified challenges that users or communities can participate in. Challenges are configured with types, measurement criteria, and reward details.

| Column Name         | Data Type     | Description                                                                 |
|----------------------|--------------|-----------------------------------------------------------------------------|
| `challenge_id`       | SERIAL       | Primary key. Unique identifier for the challenge.                           |
| `challenge_title`    | VARCHAR(100) | Title or name of the challenge.                                             |
| `description`        | TEXT         | Detailed explanation of the challenge's objective.                          |
| `challenge_type`     | VARCHAR(50)  | Type of challenge. Must be one of: `competition`, `cooperative`.           |
| `measurement_type`   | VARCHAR(50)  | How performance is measured. Options: `savings_amount`, `goal_completion`, `transaction_count`. |
| `reward_description` | TEXT         | Description of what the winner or participant will earn.                    |
| `start_date`         | INTERVAL     | Relative interval from initiation (e.g., '0 days' or '1 week'). Acts as template. |
| `duration`           | INTERVAL     | Duration that the challenge lasts from the start date (e.g., '30 days').    |

> Challenges are often used to motivate users or communities to achieve specific financial behaviors over time.

---


## 🎮 Table: `challenge_progress`
Tracks the real-time progress and status of communities participating in challenges. Includes scoring, timelines, and summaries.

| Column Name        | Data Type  | Description                                                                 |
|---------------------|-----------|-----------------------------------------------------------------------------|
| `community_id`      | INT       | Foreign key to `communities`. The group participating in the challenge.     |
| `challenge_id`      | INT       | Foreign key to `challenges`. Identifies which challenge is being tracked.   |
| `owner_id`          | INT       | Foreign key to `users`. Represents the initiating leader for the community. |
| `actual_start`      | TIMESTAMP | Actual start time of the challenge for this community. Defaults to now.     |
| `actual_end`        | TIMESTAMP | Target end time when the challenge is supposed to finish.                   |
| `score`             | NUMERIC   | Total score accumulated by the community.                                   |
| `progress_summary`  | TEXT      | Optional summary describing progress, metrics, or commentary.               |
| `challenge_status`  | VARCHAR(50)| Current state. Must be one of: `joined`, `in-progress`, `completed`, `disqualified`. |

> This table uses `(community_id, challenge_id)` as a composite primary key to ensure uniqueness per community-challenge pair.

---


## 📚 Table: `learning_modules`
Stores financial literacy modules that group together related lessons and quizzes. Each module focuses on a specific topic and difficulty level.

| Column Name     | Data Type     | Description                                                              |
|------------------|--------------|--------------------------------------------------------------------------|
| `module_id`      | SERIAL       | Primary key. Unique identifier for the module.                          |
| `module_title`   | VARCHAR(100) | Title of the module. E.g., "Budgeting Basics".                          |
| `topic`          | VARCHAR(100) | The main topic covered in the module (e.g., "Investing", "Debt").       |
| `difficulty`     | VARCHAR(50)  | Indicates the complexity: `beginner`, `intermediate`, or `advanced`.    |

---

## 🧑‍🏫 Table: `lessons`
Defines lessons that belong to a specific financial module. Each lesson is numbered and contains written content and an optional estimated time to complete.

| Column Name        | Data Type     | Description                                                              |
|---------------------|--------------|--------------------------------------------------------------------------|
| `lesson_id`         | SERIAL       | Primary key. Unique identifier for each lesson.                          |
| `module_id`         | INT          | Foreign key to `learning_modules`. Specifies which module this lesson belongs to. |
| `lesson_number`     | INT          | Sequential order of the lesson within the module. Must be unique per module. |
| `lesson_title`      | VARCHAR(100) | Title of the lesson.                                                     |
| `content`           | TEXT         | The full written content of the lesson.                                  |
| `estimated_duration`| INT          | Optional. Estimated time to complete the lesson, in minutes.             |

> The combination of `module_id` and `lesson_number` is unique to ensure logical ordering within a module.

---


## 📝 Table: `quizzes`
Defines quizzes associated with learning modules. Each quiz contains serialized questions and defines the maximum and passing scores.

| Column Name       | Data Type | Description                                                                 |
|--------------------|----------|-----------------------------------------------------------------------------|
| `quiz_id`          | SERIAL   | Primary key. Unique identifier for the quiz.                                |
| `module_id`        | INT      | Foreign key to `learning_modules`. Identifies the module this quiz belongs to. |
| `questions_jsonb`  | JSONB    | JSON-encoded structure containing quiz questions and options.               |
| `max_score`        | INT      | The maximum number of points a user can earn from this quiz.               |
| `pass_score`       | INT      | The minimum score required to pass. Must be less than or equal to `max_score`. |

---

## 🧪 Table: `quiz_attempts`
Logs individual user quiz attempts, scores, and timestamps. Also tracks pass/fail status based on dynamic rule evaluation.

| Column Name      | Data Type  | Description                                                                 |
|-------------------|-----------|-----------------------------------------------------------------------------|
| `attempt_id`      | SERIAL    | Primary key. Unique ID for the attempt.                                     |
| `user_id`         | INT       | Foreign key to `users`. The user who attempted the quiz.                    |
| `quiz_id`         | INT       | Foreign key to `quizzes`. Identifies the quiz taken.                        |
| `attempt_score`   | INT       | Number of points earned during the attempt.                                 |
| `passed`          | BOOLEAN   | Computed. True if `attempt_score` ≥ `pass_score` of the quiz.               |
| `attempt_number`  | INT       | Sequential number of attempts by the user on this quiz.                     |
| `timestamp`       | TIMESTAMP | When the attempt occurred. Defaults to current timestamp.                   |

> The `passed` field is a stored computed column that automatically evaluates quiz success based on score thresholds.

---



## 🎁 Table: `module_rewards`
Rewards issued to users upon completion of learning modules. Helps gamify the learning experience by awarding points.

| Column Name     | Data Type | Description                                                                 |
|------------------|----------|-----------------------------------------------------------------------------|
| `reward_id`      | SERIAL   | Primary key. Unique identifier for the reward record.                       |
| `user_id`        | INT      | Foreign key to `users`. The user receiving the reward.                      |
| `module_id`      | INT      | Foreign key to `learning_modules`. Specifies which module was completed.    |
| `reward_points`  | INT      | Number of points earned for completing the module.                          |
| `awarded_at`     | TIMESTAMP| Timestamp when the reward was granted. Defaults to current timestamp.       |

> A user can earn points for each module only once. This is enforced with a unique constraint on `(user_id, module_id)`.

---

## 💰 Table: `budgets`
Defines financial budgets for users within a specific time range. Used to track and control spending behavior.

| Column Name     | Data Type     | Description                                                                 |
|------------------|--------------|-----------------------------------------------------------------------------|
| `budget_id`      | SERIAL       | Primary key. Unique identifier for the budget.                             |
| `user_id`        | INT          | Foreign key to `users`. The owner of the budget.                           |
| `budget_name`    | VARCHAR(100) | User-defined name for the budget (e.g., "March 2025 Budget").              |
| `period_start`   | DATE         | The starting date of the budget period.                                    |
| `period_end`     | DATE         | The ending date of the budget period.                                      |
| `created_at`     | TIMESTAMP    | Timestamp when the budget was created. Defaults to current timestamp.      |

> Each budget can be linked to one or more category allocations in the `budget_categories` table.

---

## 📊 Table: `budget_categories`
Defines budget allocations per category under a specific user-defined budget. Supports both global and custom categories.

| Column Name          | Data Type     | Description                                                                 |
|-----------------------|--------------|-----------------------------------------------------------------------------|
| `budget_category_id`  | SERIAL       | Primary key. Unique ID for the category allocation.                         |
| `budget_id`           | INT          | Foreign key to `budgets`. Identifies which budget this allocation belongs to. |
| `category_id`         | INT          | Foreign key to `categories`. Used for global categories (nullable).         |
| `custom_category_id`  | INT          | Foreign key to `custom_categories`. Used for personal categories (nullable).|
| `target_amount`       | NUMERIC(12,2)| The maximum amount a user plans to spend on this category during the budget period. Must be ≥ 0. |

> Either `category_id` or `custom_category_id` must be provided, but not both. This is enforced via a `CHECK` constraint.

---

## 🖼️ Table: `banner_images`
Stores metadata for banner images that are shown in the UI, such as promotional messages, challenge announcements, or educational highlights.

| Column Name     | Data Type  | Description                                                               |
|------------------|-----------|---------------------------------------------------------------------------|
| `banner_id`      | SERIAL    | Primary key. Unique ID for the banner.                                    |
| `image_url`      | TEXT      | URL to the banner image asset.                                            |
| `alt_text`       | TEXT      | Alternative text description for accessibility and SEO.                   |
| `display_start`  | TIMESTAMP | Optional. When the banner should begin displaying in the UI.              |
| `display_end`    | TIMESTAMP | Optional. When the banner should stop being displayed.                    |
| `created_at`     | TIMESTAMP | Timestamp when the banner was added. Defaults to current timestamp.       |

> Used by frontend components to manage rotating messages, seasonal events, or learning tips.

---

## 🏅 Table: `achievements`
Defines achievement milestones users can earn by completing specific actions such as saving goals, completing modules, or participating in challenges.

| Column Name              | Data Type     | Description                                                                  |
|---------------------------|--------------|------------------------------------------------------------------------------|
| `achievement_id`          | SERIAL       | Primary key. Unique ID for each achievement.                                 |
| `achievement_title`       | VARCHAR(100) | The name of the achievement.                                                 |
| `achievement_description` | TEXT         | A detailed explanation of what the achievement represents.                   |
| `points_awarded`          | INT          | The number of gamified points awarded to the user when earned. Must be ≥ 0.  |
| `badge_icon_url`          | TEXT         | Optional. URL to the icon representing this achievement.                     |
| `trigger_condition_json`  | JSONB        | A JSON object defining the rule that triggers the achievement (e.g., `{ "goal_completed": true, "amount": 1000 }`). |

> Achievements are triggered based on various metrics (goals, habits, scores, etc.) evaluated through backend logic or AI events.

---

## 🧑‍🎓 Table: `user_achievements`
Tracks which users have earned which achievements and when.

| Column Name       | Data Type  | Description                                                              |
|--------------------|-----------|--------------------------------------------------------------------------|
| `user_id`          | INT       | Foreign key to `users`. Identifies the user who earned the achievement. |
| `achievement_id`   | INT       | Foreign key to `achievements`. The achievement that was unlocked.        |
| `awarded_at`       | TIMESTAMP | Timestamp when the achievement was granted. Defaults to current time.    |

> The primary key `(user_id, achievement_id)` ensures a user earns each achievement only once.

---

## 🧮 Table: `user_points`
Stores a user’s total accumulated points across all gamified activities such as achievements, quizzes, challenges, and financial goals.

| Column Name     | Data Type  | Description                                                             |
|------------------|-----------|-------------------------------------------------------------------------|
| `user_id`        | INT       | Primary key and foreign key to `users`. Represents the owner of the points. |
| `total_points`   | INT       | Total number of points earned by the user. Defaults to `0`.             |
| `last_updated`   | TIMESTAMP | Timestamp of the most recent update to the user's point total.          |

> This table provides quick access to a user's current point balance and supports ranking or redemption logic.

---

## 🗂️ Table: `points_log`
Detailed log of every point-earning event, specifying the source and origin of the awarded points.

| Column Name   | Data Type   | Description                                                                 |
|----------------|------------|-----------------------------------------------------------------------------|
| `log_id`        | SERIAL     | Primary key. Unique identifier for the log entry.                          |
| `user_id`       | INT        | Foreign key to `users`. Identifies who earned the points.                  |
| `source`        | VARCHAR(50)| The origin of the points. Must be one of: `achievement`, `quiz`, `goal`, `challenge`, `transaction`. |
| `source_id`     | INT        | Reference to the ID of the originating source (e.g., `achievement_id`, `quiz_id`). |
| `points`        | INT        | Number of points earned in this event. Must be greater than 0.            |
| `created_at`    | TIMESTAMP  | Timestamp when the points were logged. Defaults to current timestamp.     |

> Enables detailed audit trails and analytics of point generation per feature. Useful for reward histories, leaderboards, and debugging.

---

> ✅ End of database schema documentation.
