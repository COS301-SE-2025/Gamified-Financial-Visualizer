# 📊 Database Schema Documentation: Gamified Financial Visualizer

This document outlines the schema of the main tables in the PostgreSQL database. Each table includes its attributes and the purpose of each field.

---

## 🧑‍💼 Table: `users`
Stores user account and authentication metadata.

| Column Name            | Data Type    | Description                                                                 |
|------------------------|--------------|-----------------------------------------------------------------------------|
| `user_id`              | SERIAL       | Primary key for the user.                                                   |
| `email`                | VARCHAR(255) | Unique login email address.                                                 |
| `username`             | VARCHAR(50)  | Unique display name for the user.                                           |
| `full_name`            | VARCHAR(100) | **Required** full name, provided during registration.                       |
| `hashed_password`      | TEXT         | Securely hashed password.                                                   |
| `two_factor_enabled`   | BOOLEAN      | Indicates whether 2FA is currently active for the user.                     |
| `two_factor_mandatory` | BOOLEAN      | **True** if 2FA must be completed to access the system after registration.  |
| `created_at`           | TIMESTAMP    | Timestamp when the user account was created. **Never null.**               |
| `updated_at`           | TIMESTAMP    | Timestamp of the last update to the user’s record. **Never null.**         |

> ⚙️ `two_factor_mandatory` ensures OTP is enforced on first login, while allowing users to later opt out of continuous 2FA logins if `two_factor_enabled = false`.

---

## 🔐 Table: `user_tokens`
Stores authentication tokens for active user sessions. Used to manage login states, token expiration, and secure user access.

| Column Name     | Data Type  | Description                                                              |
|------------------|-----------|--------------------------------------------------------------------------|
| `token_id`       | SERIAL    | Primary key. Unique ID for the token record.                             |
| `user_id`        | INT       | Foreign key to `users`. Identifies the user that owns the token.         |
| `token`          | TEXT      | The session token (e.g., JWT, Paseto, or opaque value).                  |
| `created_at`     | TIMESTAMP | Timestamp when the token was issued. Defaults to current time.           |
| `expires_at`     | TIMESTAMP | When the token becomes invalid and should be rejected.                   |

> Tokens are typically created on login and removed on logout. Backend services should validate token expiration on every request.

---

## ⚙️ Table: `user_preferences`
Holds user customization and in-app notification settings.

| Column Name                    | Data Type     | Description                                                                 |
|--------------------------------|---------------|-----------------------------------------------------------------------------|
| `user_id`                      | INT NOT NULL  | Primary key and FK to `users`. One-to-one relationship.                     |
| `theme`                        | VARCHAR(50)   | Selected UI theme. Must be `'light'` or `'dark'`.                           |
| `in_app_notifications_enabled` | BOOLEAN       | Toggles in-app notifications on or off. Defaults to `TRUE`.                 |
| `avatar_id`                    | INT NOT NULL  | FK to `avatar_images.avatar_id`. Identifies selected avatar image.         |
| `ar_customizations_jsonb`      | JSONB         | JSON data for user’s AR environment customizations.                         |
| `created_at`                   | TIMESTAMP     | Timestamp when preferences were created. **Never null.**                    |
| `updated_at`                   | TIMESTAMP     | Timestamp for last update. Auto-updated by trigger. **Never null.**        |

> 🔒 Avatar selection is restricted to entries in the `avatar_images` table. Images are served from `/avatars/{avatar_name}` or stored as binary blobs depending on deployment mode.

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

| Column Name      | Data Type     | Description                                                                 |
|-------------------|--------------|-----------------------------------------------------------------------------|
| `account_id`      | SERIAL       | Primary key. Unique identifier for each account.                            |
| `user_id`         | INT          | Foreign key to `users`. Associates the account with a specific user.        |
| `bank_name`       | VARCHAR(100) | Name of the financial institution. Defaults to `'GFV Bank'`.                |
| `account_name`    | VARCHAR(100) | Custom name for the account. Must be unique per user. Defaults to `'My Account'`. |
| `account_type`    | VARCHAR(50)  | Type of account. Must be one of the predefined values (see below).          |
| `currency`        | VARCHAR(20)  | Currency code. Must be one of the supported values (see below).             |
| `account_balance` | NUMERIC(14,2)| Current total balance of the account. Calculated from associated transactions. |
| `created_at`      | TIMESTAMP    | Timestamp when the account was added. **Never null.**                       |

> 🔒 A user may not reuse the same `account_name` for multiple accounts. Uniqueness is enforced per user.  
> 💰 `account_balance` should be dynamically updated by the backend whenever a transaction is created, updated, or deleted.

### 🏦 Allowed `account_type` values:
- `current`
- `cheque`
- `savings`
- `investment`
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
Tracks all user transactions, including income, expenses, transfers, and system fees. Supports both global and custom categories, and identifies recurring entries. Transactions may also contribute to financial goals or challenges, and reward gamified points.

| Column Name           | Data Type     | Description                                                                 |
|------------------------|--------------|-----------------------------------------------------------------------------|
| `transaction_id`       | SERIAL       | Primary key. Unique identifier for the transaction.                         |
| `account_id`           | INT          | Foreign key to `accounts`. Specifies which account this transaction affects. |
| `category_id`          | INT          | Foreign key to `categories`. Used if the transaction is assigned a global category. |
| `custom_category_id`   | INT          | Foreign key to `custom_categories`. Used if assigned a personal category.   |
| `budget_id` | INT | Foreign key to budgets. Updates budget progress dynamically if linked. |
| `transaction_amount`   | NUMERIC(12,2)| Amount of the transaction. Cannot be 0.                                     |
| `transaction_type`     | VARCHAR(20)  | Required. Must be one of: `expense`, `income`, `transfer`, `fee`, `withdrawal`, `deposit`. |
| `transaction_date`     | TIMESTAMP    | The date and time when the transaction occurred. Defaults to now.           |
| `transaction_name`     | TEXT         | Short name or label for the transaction (e.g., "Netflix", "Salary").        |
| `is_recurring`         | BOOLEAN      | Marks the transaction as recurring or not. Defaults to `FALSE`.             |
| `linked_goal_id`       | INT          | Foreign key to `goals`. Automatically updates progress if linked.           |
| `linked_challenge_id`  | INT          | Foreign key to `challenges`. Automatically updates progress if linked.      |
| `points_awarded`       | INT          | XP points awarded for this transaction. Defaults to `0`.                    |
| `created_at`           | TIMESTAMP    | Timestamp when the transaction was created in the system. **Never null.**   |

> ✅ Only one of `category_id` or `custom_category_id` must be present per transaction (enforced by `CHECK` constraint).  
> 🔁 When `is_recurring` is true, additional metadata is stored in the `recurring_transactions` table.  
> 🎯 If linked to a goal or challenge, their progress is automatically updated when the transaction is created.  
> 💰 If `budget_id` is provided, the transaction contributes toward that budget’s progress and remaining balance.
> 🏆 Points may be awarded for gamification and used toward achievements.

---



## 🏷️ Table: `categories`
Shared global categories for classifying user transactions, such as expenses, income, and transfers.

| Column Name     | Data Type     | Description                                                                 |
|------------------|--------------|-----------------------------------------------------------------------------|
| `category_id`     | SERIAL       | Primary key. Unique identifier for each category.                           |
| `category_name`   | VARCHAR(100) | Name of the category. Must be unique and selected from a predefined list.   |

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

> ✅ These categories are system-defined and enforced using a `CHECK` constraint. This ensures consistent classification across all users and prevents duplicate or invalid entries.

---

## 🛠️ Table: `custom_categories`
Stores user-defined personal categories for transaction classification, allowing customization beyond global system categories.

| Column Name             | Data Type     | Description                                                               |
|--------------------------|---------------|---------------------------------------------------------------------------|
| `custom_category_id`     | SERIAL        | Primary key. Unique identifier for each custom category.                  |
| `user_id`                | INT           | Foreign key to `users`. Specifies the owner of the category.              |
| `custom_category_name`   | VARCHAR(100)  | Name of the custom category. Must be unique per user (case-insensitive).  |

> 🔒 This table enforces uniqueness on (`user_id`, `custom_category_name`) to prevent duplicate names per user.  
> ⚠️ A trigger prevents users from creating custom category names that conflict with global category names, even with different casing.

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
| `is_active`        | BOOLEAN      | Indicates whether the recurrence is currently running. Defaults to `TRUE`.  |
| `created_at`       | TIMESTAMP    | Timestamp when the recurrence was created. Defaults to current timestamp.   |

> 🔁 Each recurring transaction is linked to a single transaction template via `transaction_id`.  
> ⛔ Set `is_active = FALSE` to stop a recurring transaction without deleting it.

---



## 🧠 Table: `ai_scores`
Stores AI-generated financial health evaluations for users, based on their transaction history, budgeting behavior, and other financial activities.

| Column Name              | Data Type     | Description                                                                 |
|--------------------------|---------------|------------------------------------------------------------------------------|
| `score_id`               | SERIAL        | Primary key. Unique identifier for each AI evaluation.                       |
| `user_id`                | INT           | Foreign key to `users`. The user this score belongs to.                      |
| `generated_at`           | TIMESTAMP     | Timestamp when the score was generated. Defaults to current timestamp.       |
| `score_value`            | INTEGER       | Numeric representation of the user's financial health.                       |
| `financial_health_level` | VARCHAR(50)   | Textual rating of financial status. Allowed values: `poor`, `fair`, `average`, `good`, `excellent`. |

> 🧠 These scores are generated by the system’s AI engine and may be used for analytics, progress tracking, or personalized recommendations.

---

## 🏠 Table: `visual_assets`
Stores visual representations of financial progress in a user's AR environment. These assets evolve or unlock based on financial activity like goal completion, XP growth, or budget consistency.

| Column Name     | Data Type     | Description                                                                 |
|------------------|--------------|-----------------------------------------------------------------------------|
| `asset_id`       | SERIAL       | Primary key. Unique identifier for each visual asset.                       |
| `user_id`        | INT          | Foreign key to `users`. Specifies who owns the asset.                       |
| `asset_type`     | VARCHAR(50)  | Type of asset. Must be one of the predefined types (see list below).        |
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

> 🎮 These assets are used to visually gamify progress in the user’s AR environment.  
> 🏆 Access to certain asset types can be restricted or enhanced based on the user’s `tier_status` (stored in `user_points`).

---

## 🧱 Table: `ar_scene_state`
Stores the current state of a user’s AR (augmented reality) financial environment, which reflects their visual layout, progress, and virtual city.

| Column Name       | Data Type  | Description                                                                 |
|--------------------|-----------|-----------------------------------------------------------------------------|
| `scene_id`         | SERIAL    | Primary key. Unique ID for the scene record.                                |
| `user_id`          | INT       | Foreign key to `users`. Each user has one AR scene (enforced by `UNIQUE`).  |
| `snapshot_jsonb`   | JSONB     | Serialized snapshot of the user's AR layout (positions, objects, styles).   |
| `last_updated`     | TIMESTAMP | Timestamp when the AR scene was last saved or rendered.                     |

> 🧩 This table supports real-time layout saving and persistent state rendering for AR-based financial progress environments.

---

## 🏘️ Table: `communities`
Stores information about user-created financial communities where members can collaborate on challenges, share insights, and compete socially.

| Column Name        | Data Type     | Description                                                                 |
|--------------------|--------------|-----------------------------------------------------------------------------|
| `community_id`     | SERIAL       | Primary key. Unique identifier for each community.                          |
| `owner_id`         | INT          | Foreign key to `users`. The creator/owner of the community.                 |
| `community_name`   | VARCHAR(100) | Name of the community.                                                      |
| `description`      | TEXT         | Optional description of the community's purpose or culture.                 |
| `banner_filename`  | VARCHAR(100) | File name of the community banner image (e.g., `beach_theme.png`). Defaults to `default_banner_01.png`. |
| `created_at`       | TIMESTAMP    | Timestamp when the community was created.                                   |

> 📛 Community banners are chosen from predefined options stored in `/public/banners/` and served via `/banners/{filename}`.

---

## 👥 Table: `community_members`
Tracks membership of users within communities, including their invitation/request status and when they joined.

| Column Name        | Data Type   | Description                                                                 |
|--------------------|------------|-----------------------------------------------------------------------------|
| `community_id`     | INT        | Foreign key to `communities`. Identifies the community.                    |
| `user_id`          | INT        | Foreign key to `users`. Identifies the user who is a member or invitee.    |
| `membership_status`| VARCHAR(20)| Membership state: one of `invited`, `requested`, `accepted`, `declined`.   |
| `joined_at`        | TIMESTAMP  | Timestamp when the membership record was created. Defaults to now.         |

> ✅ Primary key `(community_id, user_id)` prevents duplicate membership records.  
> 🧑‍🤝‍🧑 Membership status determines whether the user has been accepted into the community.

---

## 👥 Table: `friendships`
Represents mutual social connections between users. Each friendship is symmetric — stored only once per user pair — and includes the relationship status and timestamp.

| Column Name           | Data Type     | Description                                                                  |
|------------------------|--------------|------------------------------------------------------------------------------|
| `user_id`              | INT          | Foreign key to `users`. Must be less than `friend_id` (enforces uniqueness). |
| `friend_id`            | INT          | Foreign key to `users`. Must be greater than `user_id`.                      |
| `relationship_status` | VARCHAR(20)   | Status of the relationship: `pending`, `accepted`, or `declined`.           |
| `created_at`           | TIMESTAMP    | Timestamp when the friendship record was created.                            |

> 🔄 Friendships are symmetric: only one record exists per user pair.  
> ✅ The `CHECK (user_id < friend_id)` ensures consistency and prevents duplication.  
> 🔐 The primary key `(user_id, friend_id)` ensures each friendship is unique.

---

## 🎯 Table: `goals`
Defines personal financial goals set by users. Each goal tracks a financial target, deadline, and current progress.

| Column Name         | Data Type     | Description                                                                 |
|----------------------|--------------|-----------------------------------------------------------------------------|
| `goal_id`            | SERIAL       | Primary key. Unique identifier for each goal.                               |
| `user_id`            | INT          | Foreign key to `users`. The owner of the goal.                              |
| `goal_name`          | VARCHAR(100) | Name/title of the goal. Must be unique per user.                            |
| `goal_type`          | VARCHAR(50)  | One of: `savings`, `debt`, `investment`, `spending limit`, `donation`.     |
| `target_amount`      | NUMERIC(12,2)| Total amount the user aims to reach. Must be greater than 0.                |
| `current_amount`     | NUMERIC(12,2)| Running total of progress made toward the goal. Defaults to `0`.            |
| `target_date`        | DATE         | Intended completion date for the goal.                                      |
| `end_date`           | DATE         | Actual end/cutoff date. Used to assess on-time completion.                  |
| `category_id`        | INT          | FK to `categories` (global). Used to classify the goal. Nullable.           |
| `custom_category_id` | INT          | FK to `custom_categories`. Used for personal classification. Nullable.      |
| `goal_status`        | VARCHAR(50)  | One of: `in-progress`, `completed`, `cancelled`, `failed`.                  |
| `created_at`         | TIMESTAMP    | When the goal was created.                                                  |
| `updated_at`         | TIMESTAMP    | Auto-updated on any change to the goal.                                     |

> 🧍 Goals are strictly personal — no community linkage.  
> 🧠 Either `category_id` or `custom_category_id` may be set (not both).  
> 📅 Use `end_date` to track overdue or late completions.  
> 🔄 `updated_at` is auto-managed by a backend or trigger.  
> 🔐 Enforces unique `goal_name` per user.

---

## 📈 Table: `goal_progress`
Tracks incremental contributions made toward a user's personal financial goal. Each row represents a single contribution entry made by the goal owner.

| Column Name       | Data Type     | Description                                                                 |
|--------------------|--------------|-----------------------------------------------------------------------------|
| `progress_id`      | SERIAL       | Primary key. Unique identifier for each progress entry.                     |
| `goal_id`          | INT          | Foreign key to `goals`. Identifies the goal being contributed to.           |
| `contributor_id`   | INT          | Foreign key to `users`. Must match the goal's `user_id`.                    |
| `progress_date`    | DATE         | Date of the contribution. Defaults to the current date.                     |
| `amount_added`     | NUMERIC(12,2)| Amount of money added toward the goal. Must be greater than 0.              |

> 🔒 Only the owner of the goal may contribute progress. This is enforced in the backend service layer.  
> 🔄 The associated goal's `current_amount` is automatically updated via a backend trigger when a new progress entry is inserted.  
> 🔁 Edits and deletions to `goal_progress` also update `current_amount` accordingly via trigger functions.

---

### ⚙️ Goal Progress Trigger Behavior

| Operation     | Behavior                                                                          |
|----------------|-----------------------------------------------------------------------------------|
| `INSERT`       | Adds `amount_added` to the goal’s `current_amount`.                              |
| `UPDATE`       | Adjusts `current_amount` by subtracting the old value and adding the new one.     |
| `DELETE`       | Subtracts `amount_added` from the goal’s `current_amount`.                        |

> These database triggers ensure accurate real-time synchronization between goal contributions and total saved progress.

---


---

## ⚔️ Table: `challenges`

Represents community-based challenges where users voluntarily participate and contribute based on specific financial behaviors.

| Column Name         | Data Type     | Description                                                                 |
|----------------------|--------------|-----------------------------------------------------------------------------|
| `challenge_id`       | SERIAL       | Primary key. Unique ID for each challenge.                                  |
| `community_id`       | INT          | FK to `communities`. The group that owns the challenge.                     |
| `creator_id`         | INT          | FK to `users`. The user who created the challenge.                          |
| `challenge_title`    | VARCHAR(100) | Title or name of the challenge. Must be unique per community.               |
| `challenge_type`     | VARCHAR(50)  | Thematic type: one of `savings`, `debt`, `investment`, `spending limit`, `donation`. |
| `target_amount`      | NUMERIC(12,2)| Financial goal for the group. Must be greater than 0.                       |
| `current_amount`     | NUMERIC(12,2)| Auto-updated sum of all participant contributions. Starts at 0.             |
| `target_date`        | DATE         | Intended completion deadline.                                               |
| `end_date`           | DATE         | Optional end/cutoff date for the challenge.                                 |
| `category_id`        | INT          | FK to `categories` for system-level classification.                         |
| `custom_category_id` | INT          | FK to `custom_categories` for personal tagging.                             |
| `measurement_type`   | VARCHAR(50)  | Progress metric. One of:<br>`amount_saved`, `goals_completed`, `transactions_logged`, `amount_invested`, `amount_donated`, `spending_within_limit`. |
| `challenge_status`   | VARCHAR(50)  | Status: one of `active`, `completed`, `cancelled`, `expired`.              |
| `created_at`         | TIMESTAMP    | Timestamp when the challenge was created.                                   |
| `updated_at`         | TIMESTAMP    | Auto-updated on progress or status change.                                  |

> 🔁 Only one of `category_id` or `custom_category_id` can be set per challenge.  
> ⚙️ Status updates and `current_amount` are managed via backend triggers.

---

## 🎮 Table: `challenge_participants`

Tracks individual user participation and progress in a specific challenge. A user must join a challenge to contribute.

| Column Name         | Data Type     | Description                                                                 |
|----------------------|--------------|-----------------------------------------------------------------------------|
| `challenge_id`       | INT          | FK to `challenges`. The challenge the user joined.                          |
| `user_id`            | INT          | FK to `users`. The participant.                                             |
| `join_date`          | TIMESTAMP    | Timestamp when the user joined the challenge. Defaults to now.              |
| `progress_amount`    | NUMERIC(12,2)| How much the user has contributed to the challenge. Starts at 0.            |

> 🧠 The combination of (`challenge_id`, `user_id`) is the primary key.  
> 🔄 Changes to `progress_amount` trigger automatic updates to the challenge's total.

---

## 🧠 Trigger Behavior

| Trigger Function                  | When It Runs                         | What It Does                                                               |
|----------------------------------|--------------------------------------|----------------------------------------------------------------------------|
| `update_challenge_progress()`    | On insert/update/delete in `challenge_participants` | Recalculates `current_amount` and updates `updated_at`.              |
| `complete_challenge_if_met()`    | When `current_amount >= target_amount` | Sets `challenge_status = 'completed'`.                                   |
| `expire_challenge_if_overdue()`  | On any challenge update (time-sensitive) | Sets `challenge_status = 'expired'` if past `end_date`.              |

---

## 🏆 Table: `leaderboard_entries`

Stores periodic leaderboard snapshots based on user XP (from `user_points`). Can be used globally or within friend networks.

| Column Name         | Data Type     | Description                                                                 |
|----------------------|--------------|-----------------------------------------------------------------------------|
| `entry_id`           | SERIAL       | Primary key. Unique ID for this leaderboard entry.                          |
| `user_id`            | INT          | FK to `users`. The user being ranked.                                       |
| `leaderboard_score`  | INT          | The user’s score at the time (typically from `user_points.total_points`).   |
| `ranking`            | INT          | Their position on the leaderboard (1 = top).                                |
| `created_at`         | TIMESTAMP    | When this leaderboard snapshot was created.                                 |

> 📊 Leaderboards can be recalculated dynamically or stored as historical records.

---

## 📚 Table: `learning_modules`
Stores financial literacy modules that group together related lessons and quizzes. Each module focuses on a specific topic and difficulty level.

| Column Name       | Data Type     | Description                                                              |
|--------------------|--------------|--------------------------------------------------------------------------|
| `module_id`        | SERIAL       | Primary key. Unique identifier for the module.                           |
| `module_title`     | VARCHAR(100) | Title of the module. E.g., "Budgeting Basics".                           |
| `topic`            | VARCHAR(100) | The main topic covered in the module (e.g., "Investing", "Debt").        |
| `difficulty`       | VARCHAR(50)  | Indicates the complexity: `beginner`, `intermediate`, or `advanced`.     |
| `banner_image`     | BYTEA        | Raw binary content of the module's banner image.                         |

> 🖼️ The `banner_image` column stores image files (e.g., PNG, JPEG) directly in binary form. It is loaded by the backend and served as media content.

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

## 💰 Table: `budgets`
Defines financial budgets for users within a specific time range. Used to track and control spending behavior.

| Column Name     | Data Type     | Description                                                                 |
|------------------|--------------|-----------------------------------------------------------------------------|
| `budget_id`      | SERIAL       | Primary key. Unique identifier for the budget.                              |
| `user_id`        | INT          | Foreign key to `users`. The owner of the budget.                            |
| `budget_name`    | VARCHAR(100) | User-defined name for the budget (e.g., "March 2025 Budget"). **Must be unique per user.** |
| `period_start`   | DATE         | The starting date of the budget period.                                     |
| `period_end`     | DATE         | The ending date of the budget period.                                       |
| `created_at`     | TIMESTAMP    | Timestamp when the budget was created. Defaults to current timestamp.       |

> 🔐 A user cannot have two budgets with the same name. Enforced via `UNIQUE(user_id, budget_name)` constraint.  
> 📊 Each budget can be linked to one or more category allocations in the `budget_categories` table.

---

## 📊 Table: `budget_categories`
Defines budget allocations per category under a specific user-defined budget. Supports both global and custom categories.

| Column Name          | Data Type     | Description                                                                 |
|-----------------------|--------------|-----------------------------------------------------------------------------|
| `budget_category_id`  | SERIAL       | Primary key. Unique ID for the category allocation.                         |
| `budget_id`           | INT          | Foreign key to `budgets`. Identifies which budget this allocation belongs to. |
| `category_id`         | INT          | Foreign key to `categories`. Used for global categories (nullable).         |
| `custom_category_id`  | INT          | Foreign key to `custom_categories`. Used for personal categories (nullable).|
| `target_amount`       | NUMERIC(12,2)| The max amount a user plans to spend in this category during the period. Must be ≥ 0. |

> ✅ Either `category_id` or `custom_category_id` must be provided—**not both**. Enforced via a `CHECK` constraint.

---

## 🖼️ Table: `banner_images`

Stores decorative UI image assets like icons, event banners, and feature tabs.

| Column Name   | Data Type  | Description                                                             |
|----------------|-----------|-------------------------------------------------------------------------|
| `banner_id`    | SERIAL    | Primary key. Unique ID for each banner image.                           |
| `image_data`   | BYTEA     | Binary data representing the banner image.                              |
| `created_at`   | TIMESTAMP | Timestamp when the image was added. Defaults to current timestamp.      |

> Used for rotating banners, UI themes, seasonal events, or category illustrations.

---

## 🧑‍🎨 Table: `avatar_images`

Stores user avatar assets that can be selected during profile customization.

| Column Name     | Data Type     | Description                                                              |
|------------------|--------------|--------------------------------------------------------------------------|
| `avatar_id`      | SERIAL       | Primary key. Unique ID for each avatar image.                            |
| `image_data`     | BYTEA        | Binary data representing the avatar image.                               |
| `avatar_name`    | VARCHAR(100) | Unique name or label for the avatar (e.g., `"ninja_cat"`, `"wizard_elf"`). |
| `created_at`     | TIMESTAMP    | Timestamp when the avatar was added. Defaults to current timestamp.      |

> Used for profile personalization. Can be expanded later to support unlockable or animated avatars.

---

## 🏅 Table: `achievements`
Defines achievement milestones users can earn by completing specific actions such as saving goals, completing modules, or participating in challenges.

| Column Name              | Data Type     | Description                                                                 |
|--------------------------|---------------|-----------------------------------------------------------------------------|
| `achievement_id`         | SERIAL        | Primary key. Unique ID for each achievement.                                |
| `achievement_title`      | VARCHAR(100)  | The name of the achievement.                                                |
| `achievement_description`| TEXT          | A detailed explanation of what the achievement represents.                  |
| `achievement_type`       | VARCHAR(50)   | The category. Must be one of: `goal`, `quiz`, `challenge`, `transaction`, `milestone`, `misc`. |
| `points_awarded`         | INT           | Number of gamified points awarded when earned. Must be ≥ 0.                 |
| `badge_icon`             | BYTEA         | Binary image data for the badge icon.                                       |
| `trigger_condition_json` | JSONB         | JSON rule that defines when the achievement is awarded.                     |

> Achievements are awarded by backend logic based on user behavior and system events.

---

## 🧑‍🎓 Table: `user_achievements`
Tracks which users have earned which achievements and when.

| Column Name       | Data Type   | Description                                                                 |
|-------------------|-------------|------------------------------------------------------------------------------|
| `user_id`         | INT         | Foreign key to `users`. The user who earned the achievement.                |
| `achievement_id`  | INT         | Foreign key to `achievements`. The earned achievement.                      |
| `awarded_at`      | TIMESTAMP   | Timestamp when the achievement was granted. Defaults to current time.       |

> ✅ Composite primary key `(user_id, achievement_id)` ensures uniqueness.

---

## 🧮 Table: `user_points`
Tracks a user’s total accumulated gamified points from various activities.

| Column Name     | Data Type   | Description                                                                 |
|------------------|------------|------------------------------------------------------------------------------|
| `user_id`        | INT        | Primary key and foreign key to `users`. The user earning points.           |
| `total_points`   | INT        | Total points accumulated. Defaults to `0`.                                 |
| `last_updated`   | TIMESTAMP  | Timestamp of the last update to the total points.                          |
| `tier_status`    | VARCHAR(20)| User’s tier. Must be one of: `wood`, `bronze`, `silver`, `gold`, `platinum`, `diamond`. Defaults to `wood`. |

> Useful for tier progression, unlocks, and leaderboard displays.

---

## 🗂️ Table: `points_log`
Stores a log of all point-earning events for historical tracking and auditing.

| Column Name    | Data Type    | Description                                                                 |
|----------------|-------------|------------------------------------------------------------------------------|
| `log_id`       | SERIAL      | Primary key. Unique log entry.                                              |
| `user_id`      | INT         | Foreign key to `users`. The user earning points.                            |
| `source`       | VARCHAR(50) | The origin of the event. Must be one of: `achievement`, `quiz`, `goal`, `challenge`, `transaction`. |
| `source_id`    | INT         | Optional ID referencing the event (e.g., `quiz_id`, `achievement_id`).      |
| `points`       | INT         | Points earned from this action. Must be > 0.                                |
| `created_at`   | TIMESTAMP   | When the points were logged. Defaults to now.                               |

> Enables granular tracking of how, when, and why users earned points.

---

## 🧾 Table: `point_rules`
Defines the system’s point-awarding rules for various gamified actions. Used to centrally manage how many points are given for each activity.

| Column Name    | Data Type     | Description                                                                 |
|----------------|---------------|------------------------------------------------------------------------------|
| `rule_id`      | SERIAL        | Primary key. Unique ID for the rule.                                        |
| `action_type`  | VARCHAR(50)   | The type of user action. Must be one of: `transaction`, `goal_created`, `goal_completed`, `quiz_completed`, `achievement_unlocked`, `challenge_completed`. |
| `base_points`  | INT           | Number of points to award for the action. Must be ≥ 0.                      |

> This table allows the backend to dynamically retrieve and apply point rules without hardcoding logic. It supports scalable and adjustable gamification systems.

---

## 🗑️ Delete Rules Strategy (`ON DELETE` Behavior)

To preserve data integrity and avoid orphaned records, the schema uses carefully selected `ON DELETE` rules on foreign key relationships. These rules dictate what happens to dependent records when a parent record is deleted.

### 🔧 Purpose of Delete Rules

- **`ON DELETE CASCADE`**: Automatically deletes child records when the parent is deleted.
- **`ON DELETE SET NULL`**: Retains the child record but nullifies the reference if the parent is removed.
- **No Rule (Default)**: Prevents deletion of parent if child rows exist (`RESTRICT` behavior).

---

### ✅ Key Applications

#### `users`  
- **CASCADE** on:
  - `accounts`
  - `user_tokens`
  - `user_preferences`
  - `user_push_subscriptions`
  - `custom_categories`
  - `goals`
  - `goal_progress`
  - `quiz_attempts`
  - `user_achievements`
  - `user_points`
  - `points_log`
  - `community_members`
  - `friendships`
  - `ai_scores`
  - `visual_assets`
  - `ar_scene_state`
  
  > Ensures that deleting a user removes all their associated records cleanly.

#### `accounts`
- **CASCADE** on `transactions`  
  > Deleting an account also removes all its transactions.

#### `budgets`
- **CASCADE** on `budget_categories`  
  > Removes budget allocations when the parent budget is deleted.

#### `transactions`
- **SET NULL** on:
  - `budget_id`
  - `linked_goal_id`
  - `linked_challenge_id`
  
  > Keeps transaction history even if associated goal/challenge is removed.

#### `transactions`
- **CASCADE** on `recurring_transactions`  
  > Automatically removes recurring metadata if the base transaction is deleted.

#### `goals`
- **CASCADE** on `goal_progress`  
  > Removes all contributions if the goal is deleted.

#### `communities`
- **CASCADE** on:
  - `community_members`
  - `challenge_progress`
  - `leaderboard_entries`
  
  > Prevents orphaned records in community-related tables.

#### `learning_modules`
- **CASCADE** on:
  - `lessons`
  - `quizzes`
  
  > Ensures module deletion removes all linked content.

#### `quizzes`
- **CASCADE** on `quiz_attempts`  
  > Removes attempts if the quiz is deleted.

---

### 🔒 Summary of Best Practices

- Use **CASCADE** when child records lose meaning without the parent (e.g., goal progress, transactions).
- Use **SET NULL** when historical data must remain but without reference (e.g., transactions linked to removed goals).
- Avoid ambiguous defaults; always define an explicit rule when creating foreign keys.

---

## 🧠 Indexing Strategy

To ensure efficient data retrieval and maintain optimal performance, strategic indexes have been added to frequently queried columns across the schema. These indexes reduce lookup time for large datasets, especially in user-centric and transactional operations.

### 🔍 Why Indexing Matters

Indexes improve the speed of:
- Searching and filtering (`WHERE`, `JOIN`, `ORDER BY`)
- Enforcing uniqueness (`UNIQUE`, `PRIMARY KEY`)
- Sorting and aggregations (`GROUP BY`, `DISTINCT`)

However, indexes also slightly increase storage usage and insert/update costs — so they are applied selectively where performance gains justify the tradeoff.

---

### ✅ Key Indexes

#### Users
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

> Speeds up login lookups, username/email validation, and authentication.

#### Accounts
```sql
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
```

> Efficient retrieval of user accounts.

#### Transactions
```sql
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_user_type_date ON transactions(transaction_type, transaction_date);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_custom_category_id ON transactions(custom_category_id);
CREATE INDEX idx_transactions_budget_id ON transactions(budget_id);
```

> Optimizes filtering by account, category, type, and date for dashboards, budgets, and reports.

#### Goals & Progress
```sql
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_goal_status ON goals(goal_status);
CREATE INDEX idx_goal_progress_goal_id ON goal_progress(goal_id);
CREATE INDEX idx_goal_progress_contributor_id ON goal_progress(contributor_id);
```

> Enhances performance on user goals overview and progress calculations.

#### Quizzes & Attempts
```sql
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
```

> Useful for retrieving quiz history and statistics per user/module.

#### Budgets
```sql
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budget_categories_budget_id ON budget_categories(budget_id);
```

> Speeds up fetching budgets and category allocations tied to users.

#### Achievements
```sql
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
```

> Fast access to user achievement records and badge assignment.


ℹ️ Best Practice: All indexes are non-unique unless needed for constraints. They are designed to support core application features like dashboard rendering, financial calculations, leaderboards, and gamification logic.

---

> ✅ End of database schema documentation.
