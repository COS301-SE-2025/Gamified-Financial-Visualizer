# 🎯 Goal Service API Endpoints

This document outlines the backend service endpoints for managing personal and community financial goals in the Gamified Financial Visualizer platform.

_Last updated: 2025-05-23_

---

## 🆕 Goal Creation Endpoints

| Method | Endpoint             | Description                                      | Auth Required | Notes |
|--------|----------------------|--------------------------------------------------|----------------|-------|
| POST   | /api/goals/personal  | Create a personal goal                          | ✅              | Sets `user_id`, `community_id` must be `null` |
| POST   | /api/goals/community | Create a community goal                         | ✅              | Sets `community_id`, `user_id` must be `null` |

---

## 📊 Goal Management & Progress

| Method | Endpoint                      | Description                                      | Auth Required | Notes |
|--------|-------------------------------|--------------------------------------------------|----------------|-------|
| GET    | /api/goals/my                | Get all goals created by the user                | ✅              | Filters by `user_id` |
| GET    | /api/goals/community/:id     | Get all goals within a specific community        | ✅              | Filters by `community_id` |
| POST   | /api/goals/:goalId/progress  | Add contribution to a goal                       | ✅              | Logs entry in `goal_progress` |
| GET    | /api/goals/:goalId/progress  | Get progress history of a specific goal          | ✅              | From `goal_progress` table |

---

## 🔧 Goal Update / Status Management

| Method | Endpoint                 | Description                                | Auth Required | Notes |
|--------|--------------------------|--------------------------------------------|----------------|-------|
| PATCH  | /api/goals/:goalId       | Update goal metadata (target, name, etc.)  | ✅              | Conditional field updates |
| DELETE | /api/goals/:goalId       | Delete a goal                              | ✅              | Optional soft delete (not shown in schema) |
| PATCH  | /api/goals/:goalId/status| Change goal status                         | ✅              | Updates `goal_status` field |

---

## 📚 Schema Reference: `goals`

| Column Name      | Description                                             |
|------------------|---------------------------------------------------------|
| `goal_id`        | Primary key                                             |
| `user_id`        | Set for personal goals                                  |
| `community_id`   | Set for community goals                                 |
| `goal_name`      | Goal title                                              |
| `goal_type`      | `savings`, `debt`, `investment`, etc.                   |
| `target_amount`  | Numeric goal target                                     |
| `current_amount` | Numeric progress tracker                                |
| `target_date`    | Deadline for achieving the goal                         |
| `goal_status`    | `in-progress`, `completed`, `cancelled`, etc.           |
| `created_at`     | Timestamp                                               |

> ⚠️ Note: Either `user_id` or `community_id` must be set, not both — enforced via schema `CHECK` constraint:contentReference[oaicite:4]{index=4}.

