# 📊 Database Schema Documentation: Gamified Financial Visualizer

This document outlines the schema of the main tables in the PostgreSQL database. Each table includes its attributes and the purpose of each field.

---

## Table: `users`

The `users` table stores core account information and authentication metadata for every registered user in the system.

| Column Name            | Data Type    | Constraints / Default                      | Description                                                                |
|------------------------|--------------|-------------------------------------------|----------------------------------------------------------------------------|
| `user_id`              | SERIAL       | **PK**                                    | Unique identifier for each user.                                           |
| `email`                | VARCHAR(255) | **UNIQUE**, **NOT NULL**                  | User’s login email address.                                                |
| `username`             | VARCHAR(50)  | **UNIQUE**, **NOT NULL**                  | User-chosen display name.                                                  |
| `full_name`            | VARCHAR(100) | **NOT NULL**                              | User’s full name, required at registration.                                |
| `hashed_password`      | TEXT         | **NOT NULL**                              | Securely hashed password.                                                  |
| `two_factor_enabled`   | BOOLEAN      | DEFAULT `FALSE`                           | Indicates if two-factor authentication is currently active.                |
| `two_factor_mandatory` | BOOLEAN      | DEFAULT `TRUE`                            | Requires 2FA on first login; can be relaxed if disabled later.              |
| `created_at`           | TIMESTAMP    | DEFAULT `CURRENT_TIMESTAMP`, **NOT NULL** | Timestamp when the user account was created.                               |
| `updated_at`           | TIMESTAMP    | DEFAULT `CURRENT_TIMESTAMP`, **NOT NULL** | Timestamp of the most recent update to the user record.                    |

> `two_factor_mandatory` ensures OTP is enforced on first login, while allowing users to later opt out of continuous 2FA logins if `two_factor_enabled = false`.

---

## Table: `user_tokens`

The `user_tokens` table stores authentication tokens for active user sessions.  
It is used to manage login states, handle token expiration, and secure user access.

| Column Name | Data Type  | Constraints / Default              | Description                                                        |
|-------------|-----------|-----------------------------------|--------------------------------------------------------------------|
| `token_id`  | SERIAL    | **PK**                            | Unique identifier for the token record.                            |
| `user_id`   | INT       | **UNIQUE**, **NOT NULL**, FK → `users(user_id)` | The user who owns the token. Cascades on user deletion.            |
| `token`     | TEXT      | **NOT NULL**                      | Session token value (e.g., JWT, Paseto, or opaque string).         |
| `created_at`| TIMESTAMP | DEFAULT `CURRENT_TIMESTAMP`        | Timestamp when the token was issued.                               |
| `expires_at`| TIMESTAMP | **NOT NULL**                      | Expiration time after which the token is invalid.                   |

> Tokens are created on login and invalidated on logout. Backend services should always validate `expires_at` before granting access.


---

## Table: `avatar_images`

The `avatar_images` table stores references to selectable avatar images that users can choose for profile customization.

| Column Name         | Data Type     | Constraints / Default               | Description                                                   |
|----------------------|--------------|-------------------------------------|---------------------------------------------------------------|
| `avatar_id`          | SERIAL       | **PK**                              | Unique identifier for each avatar image.                      |
| `avatar_image_path`  | VARCHAR(255) | **NOT NULL**                        | File path or URL pointing to the stored avatar image asset.   |
| `created_at`         | TIMESTAMP    | DEFAULT `CURRENT_TIMESTAMP`         | Timestamp when the avatar image was added to the system.      |

> Provides a library of avatar options for users.


---

## Table: `banner_images`

The `banner_images` table stores decorative UI assets such as icons, and feature tab images.

| Column Name        | Data Type     | Constraints / Default       | Description                                                  |
|---------------------|--------------|-----------------------------|--------------------------------------------------------------|
| `banner_id`         | SERIAL       | **PK**                      | Unique identifier for each banner image.                     |
| `banner_image_path` | VARCHAR(255) | **NOT NULL**                | File path or URL pointing to the stored banner image asset.  |
| `created_at`        | TIMESTAMP    | DEFAULT `CURRENT_TIMESTAMP` | Timestamp when the banner image was added to the system.     |

> Supports profile themes, and decorative assets for goals or categories.


---

## Table: `user_preferences`

The `user_preferences` table stores each user’s customization settings and in-app notification preferences.  
It has a one-to-one relationship with the `users` table.

| Column Name                    | Data Type     | Constraints / Default                 | Description                                                                 |
|--------------------------------|---------------|---------------------------------------|-----------------------------------------------------------------------------|
| `user_id`                      | INT           | **PK**, FK → `users(user_id)`, **NOT NULL**, `ON DELETE CASCADE` | Unique identifier linking preferences to a specific user.                   |
| `theme`                        | VARCHAR(50)   | CHECK (`'light'`, `'dark'`)            | Selected UI theme preference.                                               |
| `in_app_notifications_enabled` | BOOLEAN       | DEFAULT `TRUE`                         | Toggles whether in-app notifications are enabled.                           |
| `avatar_id`                    | INT           | FK → `avatar_images(avatar_id)`, NOT NULL, DEFAULT `1`, `ON DELETE SET DEFAULT` | Selected avatar image for the user.                                         |
| `banner_id`                    | INT           | FK → `banner_images(banner_id)`, NOT NULL, DEFAULT `1`, `ON DELETE SET DEFAULT` | Selected banner image for the user.                                         |
| `ar_customizations_jsonb`      | JSONB         |                                       | JSON data for AR environment customizations.                                |
| `created_at`                   | TIMESTAMP     | DEFAULT `CURRENT_TIMESTAMP`            | Timestamp when the preferences were first created.                          |
| `updated_at`                   | TIMESTAMP     | DEFAULT `CURRENT_TIMESTAMP`            | Timestamp for the last update to the preferences record.                    |

> Supports profile personalization, including theme, avatars, banners, and AR world customization.


---

## Table: `user_push_subscriptions`

The `user_push_subscriptions` table stores device-specific push subscription details for Progressive Web App (PWA) notifications.  
Each record represents one push-enabled device or browser instance linked to a user.

| Column Name  | Data Type | Constraints / Default              | Description                                                   |
|--------------|-----------|------------------------------------|---------------------------------------------------------------|
| `push_id`    | SERIAL    | **PK**                             | Unique identifier for the push subscription record.           |
| `user_id`    | INT       | FK → `users(user_id)`, `ON DELETE CASCADE` | User who owns this subscription.                             |
| `endpoint`   | TEXT      | **NOT NULL**                       | Web push endpoint URL where notifications are delivered.      |
| `p256dh`     | TEXT      | **NOT NULL**                       | Public encryption key used for secure message encryption.     |
| `auth`       | TEXT      | **NOT NULL**                       | Authentication secret for verifying push message integrity.   |
| `created_at` | TIMESTAMP | DEFAULT `CURRENT_TIMESTAMP`        | Timestamp when the subscription was created.                  |
| `enabled`    | BOOLEAN   | DEFAULT `TRUE`                     | Indicates if the subscription is currently active/valid.      |

> Supports out-of-app notifications by registering secure endpoints tied to specific user devices.


---

## Table: `accounts`

The `accounts` table stores financial accounts linked to users.  
Each account represents a bank, investment, credit, or digital wallet account associated with a specific user.

| Column Name      | Data Type      | Constraints / Default               | Description                                                                 |
|------------------|---------------|-------------------------------------|-----------------------------------------------------------------------------|
| `account_id`     | SERIAL        | **PK**                              | Unique identifier for each account.                                         |
| `user_id`        | INT           | **NOT NULL**, FK → `users(user_id)`, `ON DELETE CASCADE` | User that owns this account.                                                |
| `bank_name`      | VARCHAR(100)  | **NOT NULL**, DEFAULT `'GFV Bank'`  | Name of the financial institution.                                          |
| `account_name`   | VARCHAR(100)  | **NOT NULL**, DEFAULT `'My Account'`, **UNIQUE per user** | Custom account name provided by the user. Must be unique for each user.     |
| `account_type`   | VARCHAR(50)   | **NOT NULL**, CHECK constraint       | Type of account (must be one of the predefined values listed below).        |
| `currency`       | VARCHAR(20)   | **NOT NULL**, DEFAULT `'ZAR'`, CHECK constraint | Currency code supported by the system.                                     |
| `account_balance`| NUMERIC(14,2) | **NOT NULL**, DEFAULT `0`            | Current total balance of the account. Updated dynamically by transactions.  |
| `created_at`     | TIMESTAMP     | DEFAULT `CURRENT_TIMESTAMP`, **NOT NULL** | Timestamp when the account was created.                                     |

> A user cannot reuse the same `account_name` for multiple accounts.  
> The `account_balance` should always reflect the sum of related transactions.

### Allowed `account_type` values:
- `current`, `cheque`, `savings`, `investment`, `credit`,  
- `fixed deposit`, `business`, `transmission`, `tax-free savings`,  
- `trust`, `corporate trading`, `crypto`, `forex`

### Allowed `currency` values:
- **Fiat**: `ZAR`, `USD`, `EUR`, `GBP`, `JPY`, `CAD`, `AUD`, `CHF`, `CNY`, `INR`, `KES`, `NGN`  
- **Crypto**: `BTC`, `ETH`, `USDT`, `BUSD`, `LTC`, `XRP`, `SOL`, `BNB`, `DOGE`, `USDC`
 
---


## Table: `categories`

The `categories` table defines global system-wide categories for classifying user transactions.  
These include expenses, income, transfers, and investment-related activities.  
Categories are standardized to ensure consistent reporting and analytics across all users.

| Column Name    | Data Type     | Constraints / Default      | Description                                                                |
|----------------|--------------|----------------------------|----------------------------------------------------------------------------|
| `category_id`  | SERIAL       | **PK**                     | Unique identifier for each category.                                       |
| `category_name`| VARCHAR(100) | **NOT NULL**, **UNIQUE**, CHECK constraint | Name of the category, selected from the predefined system-wide list.       |

### Allowed `category_name` values:

- `groceries`, `transport`, `fuel`, `utilities`, `rent`, `mortgage`  
- `internet`, `phone`, `insurance`, `medical`, `health`, `fitness`  
- `education`, `subscriptions`, `entertainment`, `restaurants`  
- `clothing`, `personal care`, `gifts`, `charity`, `taxes`  
- `savings`, `investments`, `loan repayment`, `debt`, `travel`, `accommodation`  
- `salary`, `freelance`, `bonus`, `refund`  
- `transfer in`, `transfer out`, `cash withdrawal`, `cash deposit`  
- `business income`, `business expense`, `maintenance`, `repairs`  
- `childcare`, `pets`, `home improvement`, `fees`, `commissions`  
- `interest income`, `dividends`, `crypto purchase`, `crypto sale`, `forex`  
- `wallet top-up`, `wallet withdrawal`

> These categories are **system-defined** and enforced with a `CHECK` constraint.  
> This ensures transactions are consistently classified and prevents invalid or duplicate entries.


---

## Table: `custom_categories`

The `custom_categories` table stores user-defined personal categories for transaction classification.  
This allows users to create custom labels beyond the global system categories.

| Column Name           | Data Type     | Constraints / Default                      | Description                                                                 |
|-----------------------|---------------|--------------------------------------------|-----------------------------------------------------------------------------|
| `custom_category_id`  | SERIAL        | **PK**                                     | Unique identifier for each custom category.                                 |
| `user_id`             | INT           | **NOT NULL**, FK → `users(user_id)`, `ON DELETE CASCADE` | User who owns the custom category.                                          |
| `custom_category_name`| VARCHAR(100)  | **NOT NULL**, **UNIQUE per user**          | Name of the custom category. Must be unique for each user.                  |

> Enforces uniqueness on (`user_id`, `custom_category_name`) so users cannot duplicate their own categories.  
> Applications should prevent users from creating custom categories that overlap with system-defined `categories`.

---

## Table: `visual_assets`

The `visual_assets` table stores unlockable AR world themes that represent a user’s financial progress.  
Themes are tied to gamification features and unlock based on user milestones such as completing goals, earning XP, or maintaining strong financial habits.

| Column Name   | Data Type    | Constraints / Default               | Description                                                                 |
|---------------|-------------|-------------------------------------|-----------------------------------------------------------------------------|
| `asset_id`    | SERIAL      | **PK**                              | Unique identifier for each unlocked theme.                                  |
| `user_id`     | INT         | **NOT NULL**, FK → `users(user_id)`, `ON DELETE CASCADE` | User who owns the unlocked theme.                                           |
| `asset_theme` | VARCHAR(50) | **NOT NULL**, CHECK constraint       | Name of the AR theme. Must be one of the predefined values listed below.    |
| `created_at`  | TIMESTAMP   | DEFAULT `CURRENT_TIMESTAMP`          | Timestamp when the theme was unlocked or granted.                           |

### Allowed `asset_theme` values:
- `classic_day`  
- `sunset_pink`  
- `rainy_evening`  
- `foggy_morning`  
- `golden_hour`  
- `neon_night`

> Unlockable themes enhance the AR experience by changing the overall look and feel of the financial world.  
> Access to specific themes may depend on user level, achievements, or special event rewards.

---

## Table: `ar_scene_state`

The `ar_scene_state` table stores the current state of a user’s AR (augmented reality) financial environment.  
It captures layout, customization, and progress so the user’s virtual city/world can be consistently restored across sessions.

| Column Name     | Data Type  | Constraints / Default              | Description                                                                 |
|-----------------|-----------|------------------------------------|-----------------------------------------------------------------------------|
| `scene_id`      | SERIAL    | **PK**                             | Unique identifier for the AR scene record.                                  |
| `user_id`       | INT       | **UNIQUE**, FK → `users(user_id)`, `ON DELETE CASCADE` | User linked to this AR scene. Each user can only have one active AR scene.  |
| `snapshot_jsonb`| JSONB     |                                    | Serialized snapshot of the AR layout (objects, positions, customizations).  |
| `last_updated`  | TIMESTAMP | DEFAULT `CURRENT_TIMESTAMP`        | Timestamp when the AR scene state was last saved or modified.               |

> Enables real-time saving and persistent rendering of user AR environments, ensuring continuity of visual progress.

---

## Table: `communities`

The `communities` table stores information about user-created financial communities.  
Communities allow users to collaborate on challenges, share insights, and engage in social competition.

| Column Name      | Data Type     | Constraints / Default               | Description                                                                 |
|------------------|--------------|-------------------------------------|-----------------------------------------------------------------------------|
| `community_id`   | SERIAL       | **PK**                              | Unique identifier for each community.                                       |
| `owner_id`       | INT          | **NOT NULL**, FK → `users(user_id)`, `ON DELETE CASCADE` | The creator and owner of the community.                                    |
| `community_name` | VARCHAR(100) | **NOT NULL**                        | Name of the community.                                                      |
| `description`    | TEXT         |                                     | Optional description of the community’s purpose, focus, or culture.         |
| `banner_id`      | INT          | **NOT NULL**, DEFAULT `1`, FK → `banner_images(banner_id)`, `ON UPDATE CASCADE` | Associated banner image representing the community.                         |
| `created_at`     | TIMESTAMP    | DEFAULT `CURRENT_TIMESTAMP`          | Timestamp when the community was created.                                   |

> Communities inherit banners from the `banner_images` table, ensuring consistency and allowing themes to be updated centrally.

---

## Table: `community_members`

The `community_members` table tracks the membership of users within communities, including their invitation or request status and join date.  
It enables management of who belongs to each community and in what capacity.

| Column Name        | Data Type   | Constraints / Default              | Description                                                                 |
|--------------------|------------|------------------------------------|-----------------------------------------------------------------------------|
| `community_id`     | INT        | FK → `communities(community_id)`, `ON DELETE CASCADE` | Identifies the community.                                                   |
| `user_id`          | INT        | FK → `users(user_id)`, `ON DELETE CASCADE`           | Identifies the user who is a member or invitee.                             |
| `membership_status`| VARCHAR(20)| **NOT NULL**, CHECK constraint     | Membership state: must be one of `invited`, `requested`, `accepted`, `declined`. |
| `joined_at`        | TIMESTAMP  | DEFAULT `CURRENT_TIMESTAMP`        | Timestamp when the membership record was created.                           |

> Composite primary key `(community_id, user_id)` ensures no duplicate membership records.  
> The `membership_status` field defines whether the user is pending, accepted, or declined in the community.

---

## Table: `friendships`

The `friendships` table represents mutual social connections between users.  
Each friendship is symmetric, meaning it is stored only once per user pair, and includes the relationship status along with its creation timestamp.

| Column Name          | Data Type   | Constraints / Default              | Description                                                                 |
|----------------------|------------|------------------------------------|-----------------------------------------------------------------------------|
| `user_id`            | INT        | **NOT NULL**, FK → `users(user_id)`, `ON DELETE CASCADE` | One user in the friendship pair.             |
| `friend_id`          | INT        | **NOT NULL**, FK → `users(user_id)`, `ON DELETE CASCADE` | The other user in the friendship pair.      |
| `relationship_status`| VARCHAR(20)| **NOT NULL**, CHECK constraint     | Status of the relationship: one of `pending`, `accepted`, or `declined`.    |
| `created_at`         | TIMESTAMP  | DEFAULT `CURRENT_TIMESTAMP`        | Timestamp when the friendship record was created.                           |

> Friendships are symmetric: only one record exists per user pair. 
> The composite primary key `(user_id, friend_id)` ensures each friendship is unique.

---

## Table: `goals`

The `goals` table defines personal financial goals set by users.  
Each goal tracks a financial target, associated category, deadline, and progress toward completion.

| Column Name         | Data Type      | Constraints / Default               | Description                                                                 |
|---------------------|---------------|-------------------------------------|-----------------------------------------------------------------------------|
| `goal_id`           | SERIAL        | **PK**                              | Unique identifier for each goal.                                            |
| `user_id`           | INT           | **NOT NULL**, FK → `users(user_id)`, `ON DELETE CASCADE` | The owner of the goal.                                                      |
| `goal_name`         | VARCHAR(100)  | **NOT NULL**, **UNIQUE per user**   | Name/title of the goal. Must be unique for each user.                       |
| `goal_type`         | VARCHAR(50)   | **NOT NULL**, CHECK constraint      | One of: `savings`, `debt`, `investment`, `spending limit`, `donation`.     |
| `target_amount`     | NUMERIC(12,2) | **NOT NULL**, CHECK (> 0)           | The total amount the user aims to reach.                                    |
| `current_amount`    | NUMERIC(12,2) | DEFAULT `0`, **NOT NULL**           | Running total of contributions made toward the goal.                        |
| `start_date`        | DATE          | **NOT NULL**                        | The date when the goal begins.                                              |
| `target_date`       | DATE          | **NOT NULL**                        | Intended completion date for the goal.                                      |
| `end_date`          | DATE          |                                     | Actual completion date (nullable).                                          |
| `banner_id`         | INT           | DEFAULT `1`, FK → `banner_images(banner_id)`, `ON UPDATE CASCADE` | Visual banner associated with the goal.                                     |
| `category_id`       | INT           | FK → `categories(category_id)`      | Optional link to a system-wide category.                                    |
| `custom_category_id`| INT           | FK → `custom_categories(custom_category_id)` | Optional link to a user-defined custom category.                            |
| `goal_status`       | VARCHAR(50)   | **NOT NULL**, CHECK constraint      | Status of the goal: one of `in-progress`, `completed`, `cancelled`, `failed`. |
| `created_at`        | TIMESTAMP     | DEFAULT `CURRENT_TIMESTAMP`         | Timestamp when the goal was created.                                        |
| `updated_at`        | TIMESTAMP     | DEFAULT `CURRENT_TIMESTAMP`         | Timestamp of the last update (auto-updated by trigger).                     |

> Goals are **personal only** — they do not link directly to communities.  
> Either `category_id` or `custom_category_id` must be set (but not both).  
> `end_date` enables tracking of overdue or late completions.  
> `updated_at` is automatically refreshed on updates.  
> Enforces unique `goal_name` per user.


---

## Table: `goal_progress`

The `goal_progress` table tracks incremental contributions made toward a user’s personal financial goals.  
Each record represents a single contribution entry, which automatically updates the running total for the associated goal.

| Column Name     | Data Type      | Constraints / Default               | Description                                                                 |
|-----------------|---------------|-------------------------------------|-----------------------------------------------------------------------------|
| `progress_id`   | SERIAL        | **PK**                              | Unique identifier for each progress entry.                                  |
| `goal_id`       | INT           | **NOT NULL**, FK → `goals(goal_id)`, `ON DELETE CASCADE` | The goal being contributed to.                                              |
| `contributor_id`| INT           | **NOT NULL**, FK → `users(user_id)`, `ON DELETE CASCADE` | The user making the contribution (typically the goal owner).                |
| `progress_date` | DATE          | DEFAULT `CURRENT_DATE`, **NOT NULL** | The date of the contribution entry.                                         |
| `amount_added`  | NUMERIC(12,2) | **NOT NULL**, CHECK (> 0)            | The amount of money added toward the goal. Must be greater than 0.          |

> Only the goal owner is permitted to contribute progress entries.  
> The associated goal’s `current_amount` is automatically updated through triggers whenever progress is inserted, updated, or deleted.

---

### Goal Progress Trigger Behavior

| Operation | Trigger Function                  | Behavior                                                                 |
|-----------|-----------------------------------|--------------------------------------------------------------------------|
| `INSERT`  | `update_goal_current_amount`      | Increases the goal’s `current_amount` by adding the new `amount_added`.  |
| `UPDATE`  | `adjust_goal_on_progress_update`  | Recalculates `current_amount` by subtracting the old `amount_added` and adding the new one. |
| `DELETE`  | `subtract_goal_on_progress_delete`| Decreases the goal’s `current_amount` by subtracting the deleted `amount_added`. |

> These database triggers ensure that the `goals.current_amount` field always reflects the real-time total of contributions stored in `goal_progress`.  
> Synchronization occurs automatically whenever progress entries are added, updated, or removed.


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
