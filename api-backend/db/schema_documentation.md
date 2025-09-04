# 📊 Database Schema Documentation: Gamified Financial Visualizer

This document outlines the schema of the main tables in the PostgreSQL database. Each table includes its attributes and the purpose of each field.

---

## 1. Table: `users`

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

## 2. Table: `user_tokens`

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

## 3. Table: `avatar_images`

The `avatar_images` table stores references to selectable avatar images that users can choose for profile customization.

| Column Name         | Data Type     | Constraints / Default               | Description                                                   |
|----------------------|--------------|-------------------------------------|---------------------------------------------------------------|
| `avatar_id`          | SERIAL       | **PK**                              | Unique identifier for each avatar image.                      |
| `avatar_image_path`  | VARCHAR(255) | **NOT NULL**                        | File path or URL pointing to the stored avatar image asset.   |
| `created_at`         | TIMESTAMP    | DEFAULT `CURRENT_TIMESTAMP`         | Timestamp when the avatar image was added to the system.      |

> Provides a library of avatar options for users.


---

## 4. Table: `banner_images`

The `banner_images` table stores decorative UI assets such as icons, and feature tab images.

| Column Name        | Data Type     | Constraints / Default       | Description                                                  |
|---------------------|--------------|-----------------------------|--------------------------------------------------------------|
| `banner_id`         | SERIAL       | **PK**                      | Unique identifier for each banner image.                     |
| `banner_image_path` | VARCHAR(255) | **NOT NULL**                | File path or URL pointing to the stored banner image asset.  |
| `created_at`        | TIMESTAMP    | DEFAULT `CURRENT_TIMESTAMP` | Timestamp when the banner image was added to the system.     |

> Supports profile themes, and decorative assets for goals or categories.


---

## 5. Table: `user_preferences`

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

## 6. Table: `user_push_subscriptions`

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

## 7. Table: `accounts`

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


## 8. Table: `categories`

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

## 9. Table: `custom_categories`

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

## 10. Table: `visual_assets`

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

## 11. Table: `ar_scene_state`

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

## 12. Table: `communities`

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

## 13. Table: `community_members`

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

## 14. Table: `friendships`

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

## 15. Table: `goals`

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

## 16. Table: `goal_progress`

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

## 17. Table: `challenges`

The `challenges` table represents community-based challenges where users collaborate or compete around specific financial behaviors.  
Each challenge belongs to a community and has defined rules, progress metrics, and status tracking.

| Column Name         | Data Type      | Constraints / Default               | Description                                                                 |
|---------------------|---------------|-------------------------------------|-----------------------------------------------------------------------------|
| `challenge_id`      | SERIAL        | **PK**                              | Unique identifier for each challenge.                                       |
| `community_id`      | INT           | **NOT NULL**, FK → `communities(community_id)`, `ON DELETE CASCADE` | Community to which the challenge belongs.                                   |
| `creator_id`        | INT           | **NOT NULL**, FK → `users(user_id)`, `ON DELETE CASCADE` | User who created the challenge.                                             |
| `challenge_title`   | VARCHAR(100)  | **NOT NULL**                        | Title or name of the challenge.                                             |
| `challenge_type`    | VARCHAR(50)   | **NOT NULL**, CHECK constraint      | Thematic type: one of `savings`, `debt`, `investment`, `spending limit`, `donation`. |
| `target_amount`     | NUMERIC(12,2) | **NOT NULL**, CHECK (> 0)           | Financial goal amount for the challenge. Must be greater than 0.            |
| `current_amount`    | NUMERIC(12,2) | DEFAULT `0`, **NOT NULL**           | Running total of all contributions toward the challenge.                    |
| `start_date`        | DATE          | **NOT NULL**                        | Explicit start date of the challenge.                                       |
| `target_date`       | DATE          | **NOT NULL**                        | Intended completion/milestone date.                                         |
| `end_date`          | DATE          |                                     | Actual end date if completed or expired.                                    |
| `banner_id`         | INT           | DEFAULT `1`, FK → `banner_images(banner_id)`, `ON UPDATE CASCADE` | Banner image associated with the challenge.                                 |
| `category_id`       | INT           | FK → `categories(category_id)`      | Optional system-level classification.                                       |
| `custom_category_id`| INT           | FK → `custom_categories(custom_category_id)` | Optional user-defined category classification.                              |
| `measurement_type`  | VARCHAR(50)   | **NOT NULL**, CHECK constraint      | Progress metric. One of: `amount_saved`, `goals_completed`, `transactions_logged`, `amount_invested`, `amount_donated`, `spending_within_limit`. |
| `difficulty`        | VARCHAR(20)   | DEFAULT `easy`, **NOT NULL**        | Challenge difficulty: `easy`, `medium`, `hard`, or `extreme`.               |
| `challenge_status`  | VARCHAR(50)   | DEFAULT `active`, **NOT NULL**      | Current status: one of `active`, `completed`, `cancelled`, or `expired`.    |
| `created_at`        | TIMESTAMP     | DEFAULT `CURRENT_TIMESTAMP`         | Timestamp when the challenge was created.                                   |
| `updated_at`        | TIMESTAMP     | DEFAULT `CURRENT_TIMESTAMP`         | Timestamp of the last update (auto-updated via triggers).                   |

> Either `category_id` or `custom_category_id` may be set, but not both.  
> Triggers manage progress aggregation, automatic completion when `target_amount` is met, and expiry when past the deadline.  
> Challenges are inherently **community-driven** and cannot exist outside of a community.

---

## 18. Table: `challenge_progress`

The `challenge_progress` table tracks each user’s participation and contributions in a specific community challenge.  
Users must join a challenge before they can contribute progress.

| Column Name          | Data Type      | Constraints / Default               | Description                                                                 |
|----------------------|---------------|-------------------------------------|-----------------------------------------------------------------------------|
| `challenge_id`       | INT           | **NOT NULL**, FK → `challenges(challenge_id)`, `ON DELETE CASCADE` | The challenge that the user is participating in.                            |
| `user_id`            | INT           | **NOT NULL**, FK → `users(user_id)`, `ON DELETE CASCADE` | The participating user.                                                     |
| `participation_status`| VARCHAR(20)  | **NOT NULL**, DEFAULT `invited`, CHECK constraint | Status of the participant: one of `invited`, `joined`, or `left`.           |
| `join_date`          | TIMESTAMP     | DEFAULT `CURRENT_TIMESTAMP`         | Timestamp when the user joined the challenge.                               |
| `last_updated`       | TIMESTAMP     | DEFAULT `CURRENT_TIMESTAMP`         | Timestamp of the last progress update.                                      |
| `progress_amount`    | NUMERIC(12,2) | DEFAULT `0`                          | Amount contributed by the user toward the challenge.                        |

> Composite primary key (`challenge_id`, `user_id`) ensures each user can only have one membership record per challenge.  
> Updates to `progress_amount` automatically roll up into the challenge’s `current_amount`.

---

### Trigger Behavior

| Trigger Function              | When It Runs                                | What It Does                                                               |
|-------------------------------|---------------------------------------------|----------------------------------------------------------------------------|
| `update_challenge_progress()` | On `INSERT`, `UPDATE`, or `DELETE` in `challenge_progress` | Recalculates the challenge’s `current_amount` and refreshes `updated_at`. |
| `complete_challenge_if_met()` | After `current_amount >= target_amount`      | Automatically sets `challenge_status = 'completed'`.                       |
| `expire_challenge_if_overdue()`| On any challenge `UPDATE`                   | Marks `challenge_status = 'expired'` if the `end_date` has passed.         |

> These triggers ensure that challenges remain synchronized with participant contributions and status conditions in real time.


---

## 19. Table: `leaderboard_entries`

The `leaderboard_entries` table stores snapshots of user rankings based on XP points.  
Leaderboards can be calculated globally, within communities, or friend networks to encourage competition.

| Column Name        | Data Type   | Constraints / Default               | Description                                                                 |
|--------------------|------------|-------------------------------------|-----------------------------------------------------------------------------|
| `entry_id`         | SERIAL     | **PK**                              | Unique identifier for the leaderboard entry.                                |
| `user_id`          | INT        | **NOT NULL**, FK → `users(user_id)`, `ON DELETE CASCADE` | The user being ranked.                                                      |
| `leaderboard_score`| INT        | **NOT NULL**                        | The user’s score at the time (e.g., `user_points.total_points`).            |
| `ranking`          | INT        |                                     | The user’s rank in the leaderboard (1 = top position).                      |
| `created_at`       | TIMESTAMP  | DEFAULT `CURRENT_TIMESTAMP`         | Timestamp when the leaderboard snapshot was recorded.                       |

> Leaderboard entries can be recalculated periodically or stored historically for tracking long-term performance.

---

## 20. Table: `budgets`

The `budgets` table defines user-specific financial budgets within a set time range.  
Budgets help users track and control spending behavior, often linked to categories or custom allocations.

| Column Name   | Data Type     | Constraints / Default               | Description                                                                 |
|---------------|--------------|-------------------------------------|-----------------------------------------------------------------------------|
| `budget_id`   | SERIAL       | **PK**                              | Unique identifier for each budget.                                          |
| `user_id`     | INT          | **NOT NULL**, FK → `users(user_id)`, `ON DELETE CASCADE` | The owner of the budget.                                                    |
| `budget_name` | VARCHAR(100) | **NOT NULL**, **UNIQUE per user**   | User-defined name for the budget (e.g., `"March 2025 Budget"`).             |
| `period_start`| DATE         | **NOT NULL**                        | Starting date of the budget period.                                         |
| `period_end`  | DATE         | **NOT NULL**                        | Ending date of the budget period.                                           |
| `created_at`  | TIMESTAMP    | DEFAULT `CURRENT_TIMESTAMP`         | Timestamp when the budget was created.                                      |

> A user cannot define multiple budgets with the same name — enforced via `UNIQUE(user_id, budget_name)`.  
> Budgets can be linked to category allocations for detailed spending analysis.


---

## 21. Table: `budget_categories`

The `budget_categories` table defines budget allocations per category under a specific budget.  
It supports both global categories and user-defined custom categories to provide detailed budget tracking.

| Column Name         | Data Type      | Constraints / Default               | Description                                                                 |
|---------------------|---------------|-------------------------------------|-----------------------------------------------------------------------------|
| `budget_category_id`| SERIAL        | **PK**                              | Unique identifier for the category allocation.                              |
| `budget_id`         | INT           | **NOT NULL**, FK → `budgets(budget_id)`, `ON DELETE CASCADE` | Identifies which budget this allocation belongs to.                         |
| `category_id`       | INT           | FK → `categories(category_id)`       | Link to a global category (nullable).                                       |
| `custom_category_id`| INT           | FK → `custom_categories(custom_category_id)` | Link to a user-defined category (nullable).                                 |
| `current_amount`    | NUMERIC(12,2) | DEFAULT `0`, CHECK (≥ 0)             | Tracks the actual amount spent so far in this category.                      |
| `target_amount`     | NUMERIC(12,2) | **NOT NULL**, CHECK (≥ 0)            | Maximum amount the user plans to spend in this category during the budget period. |

> Either `category_id` or `custom_category_id` must be provided — but not both.  
> `current_amount` is dynamically updated as transactions are logged against the budget.


---

## 22. Table: `transactions`

The `transactions` table tracks all financial activity, including income, expenses, transfers, fees, and deposits/withdrawals.  
Transactions can be linked to budgets, goals, or challenges, and may award gamified points for achievements.

| Column Name          | Data Type      | Constraints / Default               | Description                                                                 |
|----------------------|---------------|-------------------------------------|-----------------------------------------------------------------------------|
| `transaction_id`     | SERIAL        | **PK**                              | Unique identifier for each transaction.                                     |
| `account_id`         | INT           | **NOT NULL**, FK → `accounts(account_id)`, `ON DELETE CASCADE` | The account affected by this transaction.                                   |
| `category_id`        | INT           | FK → `categories(category_id)`, `ON DELETE SET NULL` | Global category classification (nullable).                                  |
| `custom_category_id` | INT           | FK → `custom_categories(custom_category_id)`, `ON DELETE SET NULL` | User-defined category classification (nullable).                            |
| `budget_id`          | INT           | FK → `budgets(budget_id)`, `ON DELETE SET NULL` | If linked, contributes toward this budget’s progress.                       |
| `transaction_amount` | NUMERIC(12,2) | **NOT NULL**, CHECK (`!= 0`)        | The transaction amount (positive or negative).                              |
| `transaction_type`   | VARCHAR(20)   | **NOT NULL**, CHECK constraint      | One of: `expense`, `income`, `transfer`, `fee`, `withdrawal`, `deposit`.   |
| `transaction_date`   | TIMESTAMP     | DEFAULT `CURRENT_TIMESTAMP`, **NOT NULL** | When the transaction occurred.                                              |
| `transaction_name`   | TEXT          | DEFAULT `''`, **NOT NULL**          | Short label or description (e.g., `"Netflix"`, `"Salary"`).                 |
| `is_recurring`       | BOOLEAN       | DEFAULT `FALSE`, **NOT NULL**       | Indicates whether the transaction repeats.                                  |
| `linked_goal_id`     | INT           | FK → `goals(goal_id)`, `ON DELETE SET NULL` | If linked, updates progress on the associated goal.                         |
| `linked_challenge_id`| INT           | FK → `challenges(challenge_id)`, `ON DELETE SET NULL` | If linked, updates progress on the associated challenge.                    |
| `points_awarded`     | INT           | DEFAULT `0`, CHECK (≥ 0)            | Gamified points awarded for completing this transaction.                    |
| `created_at`         | TIMESTAMP     | DEFAULT `CURRENT_TIMESTAMP`, **NOT NULL** | Timestamp when the transaction was logged in the system.                    |

> Only one of `category_id` or `custom_category_id` may be set per transaction (enforced by a `CHECK` constraint).  
> Recurring transactions (`is_recurring = TRUE`) are managed alongside metadata in a related table.  
> Linking to goals or challenges updates their progress automatically.  
> If associated with a budget, the transaction contributes toward that budget’s tracking.  
> Points awarded can drive gamification and achievements.


---

## 23. Table: `recurring_transactions`

The `recurring_transactions` table tracks repeating transactions such as subscriptions, monthly bills, or salary deposits.  
Each record links to a base transaction and defines its recurrence schedule.

| Column Name      | Data Type     | Constraints / Default               | Description                                                                 |
|------------------|--------------|-------------------------------------|-----------------------------------------------------------------------------|
| `recurring_id`   | SERIAL       | **PK**                              | Unique identifier for the recurring transaction pattern.                    |
| `transaction_id` | INT          | **UNIQUE**, FK → `transactions(transaction_id)`, `ON DELETE CASCADE` | Base transaction this recurrence is linked to. Each transaction can only have one recurrence rule. |
| `frequency`      | VARCHAR(50)  | **NOT NULL**, CHECK constraint      | Recurrence interval: one of `daily`, `weekly`, `biweekly`, `monthly`, `quarterly`, `yearly`. |
| `next_occurrence`| DATE         | **NOT NULL**                        | The next scheduled date this transaction should occur.                      |
| `end_date`       | DATE         |                                     | Optional end date. If null, the recurrence is indefinite.                    |
| `last_run`       | DATE         | DEFAULT `NULL`                      | Logs the last time this recurrence was processed.                           |
| `is_active`      | BOOLEAN      | DEFAULT `TRUE`, **NOT NULL**        | Indicates whether the recurrence is currently active.                        |
| `created_at`     | TIMESTAMP    | DEFAULT `CURRENT_TIMESTAMP`, **NOT NULL** | Timestamp when the recurrence entry was created.                             |

> Each recurring transaction is tied to exactly one base `transaction`.  
> Setting `is_active = FALSE` pauses the recurrence without deleting the record.


---

## 24. Table: `learning_modules`

The `learning_modules` table stores financial literacy modules, each grouping together related lessons and quizzes.  
Every module has a topic, difficulty level, and an associated banner for presentation.

| Column Name        | Data Type     | Constraints / Default               | Description                                                                 |
|--------------------|--------------|-------------------------------------|-----------------------------------------------------------------------------|
| `module_id`        | SERIAL       | **PK**                              | Unique identifier for the module.                                           |
| `module_title`     | VARCHAR(100) | **NOT NULL**                        | Title of the module (e.g., `"Budgeting Basics"`).                           |
| `topic`            | VARCHAR(100) | **NOT NULL**                        | The main topic covered (e.g., `"Investing"`, `"Debt"`).                     |
| `difficulty`       | VARCHAR(50)  | CHECK constraint                    | Indicates the complexity: `beginner`, `intermediate`, or `advanced`.        |
| `banner_image_path`| VARCHAR(255) | **NOT NULL**, DEFAULT `'banners/default_module.png'` | Path or URL pointing to the module’s banner image file.                     |

> Each module has a banner image that provides visual context.  
> Modules are linked to lessons and quizzes that reinforce financial literacy skills.


---

## 25. Table: `lessons`

The `lessons` table defines individual lessons that belong to a financial literacy module.  
Each lesson has a sequence number, title, and written content, with an optional estimated completion time.

| Column Name        | Data Type     | Constraints / Default               | Description                                                                 |
|--------------------|--------------|-------------------------------------|-----------------------------------------------------------------------------|
| `lesson_id`        | SERIAL       | **PK**                              | Unique identifier for each lesson.                                          |
| `module_id`        | INT          | **NOT NULL**, FK → `learning_modules(module_id)`, `ON DELETE CASCADE` | The module that this lesson belongs to.                                     |
| `lesson_number`    | INT          | **NOT NULL**, **UNIQUE per module** | Sequential order of the lesson within the module.                           |
| `lesson_title`     | VARCHAR(100) | **NOT NULL**                        | Title of the lesson.                                                        |
| `content`          | TEXT         | **NOT NULL**                        | Full written content of the lesson.                                         |
| `estimated_duration`| INT         |                                     | Optional. Estimated time to complete the lesson, in minutes.                 |

> The combination of (`module_id`, `lesson_number`) ensures lessons are uniquely ordered within each module.


---

## 26. Table: `user_lessons`

The `user_lessons` table tracks user progress in financial literacy lessons.  
Each record indicates that a specific user has completed a specific lesson.

| Column Name   | Data Type   | Constraints / Default               | Description                                                                 |
|---------------|------------|-------------------------------------|-----------------------------------------------------------------------------|
| `user_id`     | INT        | **NOT NULL**, FK → `users(user_id)`, `ON DELETE CASCADE` | The user who completed the lesson.                                          |
| `lesson_id`   | INT        | **NOT NULL**, FK → `lessons(lesson_id)`, `ON DELETE CASCADE` | The lesson that was completed.                                              |
| `completed_at`| TIMESTAMP  | DEFAULT `CURRENT_TIMESTAMP`         | Timestamp when the lesson was marked as completed.                          |

> Composite primary key (`user_id`, `lesson_id`) ensures that each user can only complete a given lesson once.  
> This table allows progress tracking and is used to unlock quizzes, achievements, or module completion milestones.

---


## 27. Table: `quizzes`

The `quizzes` table defines quizzes linked to learning modules.  
Each quiz stores its questions in JSON format and sets the scoring thresholds for passing.

| Column Name      | Data Type | Constraints / Default               | Description                                                                 |
|------------------|----------|-------------------------------------|-----------------------------------------------------------------------------|
| `quiz_id`        | SERIAL   | **PK**                              | Unique identifier for each quiz.                                            |
| `module_id`      | INT      | **NOT NULL**, FK → `learning_modules(module_id)`, `ON DELETE CASCADE` | The learning module this quiz belongs to.                                   |
| `questions_jsonb`| JSONB    | **NOT NULL**                        | JSON-encoded structure containing quiz questions, options, and answers.     |
| `max_score`      | INT      | **NOT NULL**                        | Maximum number of points achievable for the quiz.                           |
| `pass_score`     | INT      | **NOT NULL**, CHECK (`<= max_score`) | Minimum score required to pass the quiz.                                    |

> Quizzes are used to test financial literacy after completing lessons.  
> Passing a quiz may award points or achievements.


---

## 28. Table: `quiz_attempts`

The `quiz_attempts` table logs user attempts at quizzes, including score, pass/fail status, and attempt number.  
It allows tracking of multiple attempts per user and provides data for learning analytics.

| Column Name     | Data Type  | Constraints / Default               | Description                                                                 |
|-----------------|-----------|-------------------------------------|-----------------------------------------------------------------------------|
| `attempt_id`    | SERIAL    | **PK**                              | Unique identifier for each quiz attempt.                                    |
| `user_id`       | INT       | **NOT NULL**, FK → `users(user_id)`, `ON DELETE CASCADE` | The user who attempted the quiz.                                           |
| `quiz_id`       | INT       | **NOT NULL**, FK → `quizzes(quiz_id)`, `ON DELETE CASCADE` | The quiz that was attempted.                                               |
| `attempt_score` | INT       | **NOT NULL**                        | Number of points earned during the attempt.                                |
| `passed`        | BOOLEAN   |                                      | Indicates whether the attempt passed. Typically `TRUE` if `attempt_score ≥ pass_score`. |
| `attempt_number`| INT       | **NOT NULL**                        | Sequential number of the user’s attempts on this quiz.                      |
| `timestamp`     | TIMESTAMP | DEFAULT `CURRENT_TIMESTAMP`         | Timestamp when the attempt occurred.                                       |

> The `passed` field is determined by comparing `attempt_score` against the quiz’s `pass_score`.  
> Users may attempt quizzes multiple times, with `attempt_number` enforcing ordering of attempts.

---

## 29. Table: `badges`

The `badges` table defines collectible achievement badges used in the gamification system.  
Badges are awarded when users unlock specific **achievements**, creating a visible symbol of their progress.

| Column Name  | Data Type     | Constraints / Default               | Description                                                                 |
|--------------|--------------|-------------------------------------|-----------------------------------------------------------------------------|
| `badge_id`   | SERIAL       | **PK**                              | Unique identifier for each badge.                                           |
| `badge_title`| VARCHAR(100) | **NOT NULL**, **UNIQUE**            | Title of the badge (e.g., `"Challenge Champion"`).                          |
| `image_path` | VARCHAR(255) | **NOT NULL**                        | File path or URL to the badge image (e.g., `"badges/badge1.png"`).          |
| `rarity`     | VARCHAR(20)  | CHECK constraint                    | Indicates badge rarity: one of `Common`, `Uncommon`, `Rare`, `Epic`, `Legendary`, `Obsidian`. |
| `created_at` | TIMESTAMP    | DEFAULT `CURRENT_TIMESTAMP`         | Timestamp when the badge was created.                                       |

> Badges are **linked to achievements** and act as the visual collectible tied to them.  
> `rarity` tiers badges from common milestones to highly exclusive rewards.  
> This separation allows multiple achievements to exist while reusing a single badge design.

---

## 30. Table: `achievements`

The `achievements` table defines milestones that users can earn by completing actions such as goals, quizzes, transactions, budgets, or challenges.  
Each achievement is linked to a `badge` for its visual representation and may also belong to a parent umbrella achievement.

| Column Name               | Data Type     | Constraints / Default               | Description                                                                 |
|---------------------------|--------------|-------------------------------------|-----------------------------------------------------------------------------|
| `achievement_id`          | SERIAL       | **PK**                              | Unique identifier for each achievement.                                     |
| `parent_id`               | INT          | FK → `achievements(achievement_id)`, `ON DELETE CASCADE` | Optional parent achievement (for umbrella achievements).                    |
| `badge_id`                | INT          | **NOT NULL**, FK → `badges(badge_id)`, `ON DELETE RESTRICT` | Badge associated with this achievement.                                     |
| `achievement_title`       | VARCHAR(100) | **NOT NULL**                        | Title of the achievement.                                                   |
| `achievement_description` | TEXT         | **NOT NULL**                        | Detailed explanation of what the achievement represents.                     |
| `achievement_type`        | VARCHAR(50)  | **NOT NULL**, CHECK constraint      | One of: `goal`, `quiz`, `challenge`, `transaction`, `milestone`, `tutorial`, `misc`, `budget`, `ar`. |
| `points_awarded`          | INT          | **NOT NULL**, CHECK (≥ 0)           | Number of gamified points awarded when earned.                              |
| `trigger_condition_json`  | JSONB        | **NOT NULL**                        | JSON rule defining when the achievement should be awarded.                  |
| `is_umbrella`             | BOOLEAN      | DEFAULT `FALSE`, **NOT NULL**       | Marks if this is an umbrella achievement grouping other achievements.       |
| `display_order`           | INT          | DEFAULT `0`                         | Controls display ordering in the UI.                                        |
| `banner_image_path`       | VARCHAR(255) |                                     | Banner image (used only for umbrella achievements).                         |

> Achievements are awarded automatically by backend logic in response to user actions and system events.  
> Each achievement is visually represented through its associated `badge`.  
> Umbrella achievements allow grouping of multiple sub-achievements under one larger milestone.


---

## 31. Table: `user_achievements`

The `user_achievements` table tracks which achievements users have earned, their completion status, and progress toward partially completed achievements.

| Column Name          | Data Type   | Constraints / Default               | Description                                                                 |
|----------------------|------------|-------------------------------------|-----------------------------------------------------------------------------|
| `user_id`            | INT        | **NOT NULL**, FK → `users(user_id)`, `ON DELETE CASCADE` | The user linked to the achievement.                                         |
| `achievement_id`     | INT        | **NOT NULL**, FK → `achievements(achievement_id)`, `ON DELETE CASCADE` | The achievement being tracked.                                              |
| `awarded_at`         | TIMESTAMP  | DEFAULT `CURRENT_TIMESTAMP`         | Timestamp when the achievement was awarded.                                 |
| `achievement_status` | VARCHAR(20)| DEFAULT `incomplete`, **NOT NULL**, CHECK constraint | Status of the achievement: either `incomplete` or `complete`.                |
| `progress_value`     | INT        | DEFAULT `0`                         | Tracks incremental progress toward an achievement (e.g., 3/5 challenges completed). |

> Composite primary key `(user_id, achievement_id)` ensures that each user has only one record per achievement.  
> The `progress_value` supports partial achievements that unlock only once the goal is fully completed.

---

## 32. Table: `user_points`

The `user_points` table tracks a user’s accumulated gamified points.  
These points are earned through activities such as transactions, goals, quizzes, and challenges, and determine the user’s tier level.

| Column Name    | Data Type   | Constraints / Default               | Description                                                                 |
|----------------|------------|-------------------------------------|-----------------------------------------------------------------------------|
| `user_id`      | INT        | **PK**, FK → `users(user_id)`, `ON DELETE CASCADE` | The user earning points.                                                    |
| `total_points` | INT        | DEFAULT `0`, **NOT NULL**           | The total number of points accumulated by the user.                         |
| `last_updated` | TIMESTAMP  | DEFAULT `CURRENT_TIMESTAMP`         | Timestamp of the most recent update to the points balance.                   |
| `tier_status`  | VARCHAR(20)| **NOT NULL**, CHECK constraint      | The user’s tier: one of `Wood`, `Bronze`, `Silver`, `Gold`, `Platinum`, `Diamond`. |

> Points are used for tier progression, unlocking rewards, and leaderboard displays.  
> The `tier_status` reflects milestones of user engagement and progress in the gamification system.


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
