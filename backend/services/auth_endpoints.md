# 🛡️ Auth Service Endpoints (Database-backed only)

This document outlines only the **database-backed endpoints** implemented in `auth.service.ts` for the Authentication & User Profile microservice of the Gamified Financial Visualizer platform.

_Last updated: 2025-05-23_

---

## 🔐 Authentication Endpoints (with database access)

| Method | Endpoint               | Description                             | Function Name              |
|--------|------------------------|-----------------------------------------|----------------------------|
| POST   | /api/auth/register     | Register a new user                     | `createUser()`             |
| POST   | /api/auth/login        | Log in user and return session token    | `authenticateUser()`       |
| POST   | /api/auth/verify-email | Mark user's email as verified           | `verifyUserEmail()`        |
| POST   | /api/auth/2fa          | Enable/disable two-factor authentication| `setTwoFactorEnabled()`    |

---

## 👤 User Profile Management

| Method | Endpoint                     | Description                                         | Function Name              |
|--------|------------------------------|-----------------------------------------------------|----------------------------|
| GET    | /api/users/me                | Get current user profile                            | `getUserById()`            |
| PUT    | /api/users/me                | Update profile info (name, username, etc)           | `updateUserProfile()`      |
| DELETE | /api/users/me                | Delete user account                                 | `deleteUser()`             |
| GET    | /api/users/:id/preferences   | Get user preference settings                        | `getUserPreferences()`     |
| PUT    | /api/users/:id/preferences   | Update preferences (theme, avatar, AR settings)     | `updateUserPreferences()`  |
| PUT    | /api/users/:id/password      | Update user password                                | `updatePassword()`         |

---

## 📲 Push Notification Subscriptions

| Method | Endpoint                          | Description                              | Function Name                |
|--------|-----------------------------------|------------------------------------------|------------------------------|
| POST   | /api/push-subscriptions           | Register a device for push notifications | `addPushSubscription()`      |
| GET    | /api/push-subscriptions           | List all active push subscriptions       | `getPushSubscriptions()`     |
| DELETE | /api/push-subscriptions/:pushId   | Delete a push notification subscription  | `deletePushSubscription()`   |

---
