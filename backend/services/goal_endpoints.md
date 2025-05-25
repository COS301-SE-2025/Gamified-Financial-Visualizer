# 🎯 Goal Service Endpoints (Database-backed only)

This document outlines the **database-backed service functions** implemented in `goal.service.ts` for managing personal and community financial goals in the Gamified Financial Visualizer platform.

_Last updated: 2025-05-23_

---

## 🆕 Goal Creation

| Method | Endpoint                 | Description                        | Function Name              |
|--------|--------------------------|------------------------------------|----------------------------|
| POST   | /api/goals/personal      | Create a new personal goal         | `createPersonalGoal()`     |
| POST   | /api/goals/community     | Create a new community goal        | `createCommunityGoal()`    |

---

## 📖 Goal Retrieval

| Method | Endpoint                             | Description                                  | Function Name              |
|--------|--------------------------------------|----------------------------------------------|----------------------------|
| GET    | /api/goals/:id                       | Get a specific goal by ID                    | `getGoal()`                |
| GET    | /api/goals/my                        | Get all goals created by the user            | `getUserGoals()`           |
| GET    | /api/goals/personal                  | Get only personal goals for a user           | `getPersonalGoals()`       |
| GET    | /api/goals/community/:id             | Get goals for a community                    | `getCommunityGoals()`      |
| GET    | /api/goals/community/my              | Get all community goals user is part of      | `getCommunityGoalsForUser()`|
| GET    | /api/goals/latest                    | Get user's most recently created goal        | `getLatestGoal()`          |
| GET    | /api/goals/friends                   | Get in-progress goals from user’s friends    | `getFriendsGoals()`        |

---

## 🔧 Goal Management

| Method | Endpoint                  | Description                                | Function Name            |
|--------|---------------------------|--------------------------------------------|--------------------------|
| PATCH  | /api/goals/:id            | Update an existing goal                    | `updateGoal()`           |
| PATCH  | /api/goals/:id/status     | Update goal status                         | `updateGoalStatus()`     |
| DELETE | /api/goals/:id            | Delete a goal                              | `deleteGoal()`           |
| PATCH  | /api/goals/:id/complete   | Mark goal as completed and reward points   | `completeGoal()`         |

---

## 📈 Goal Progress

| Method | Endpoint                         | Description                                | Function Name              |
|--------|----------------------------------|--------------------------------------------|----------------------------|
| POST   | /api/goals/:id/progress          | Add progress contribution to a goal        | `addGoalProgress()`        |
| GET    | /api/goals/:id/progress          | Get goal contribution history              | `getGoalProgress()`        |
| PATCH  | /api/goals/:id/progress/reduce   | Reduce goal progress and user points       | `reduceProgress()`         |

---

## 🏆 User Stats & Badges

| Method | Endpoint                  | Description                                | Function Name          |
|--------|---------------------------|--------------------------------------------|------------------------|
| GET    | /api/users/:id/points     | Get user's current points                  | `getUserPoints()`      |
| GET    | /api/users/:id/stats      | Get user's goal statistics summary         | `getGoalStats()`       |
| GET    | /api/users/:id/badges     | Get user's earned goal-related badges      | `getGoalBadges()`      |

---

## 🖼️ UI Banner Management

| Method | Endpoint              | Description                          | Function Name        |
|--------|-----------------------|--------------------------------------|----------------------|
| POST   | /api/banners          | Upload new banner image              | `createBanner()`     |
| GET    | /api/banners          | Get all goal-related banner images   | `getBanners()`       |

---
