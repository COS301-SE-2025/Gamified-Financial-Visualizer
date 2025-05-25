# 💳 Transaction Service Endpoints (Database-backed only)

This document outlines **all required endpoints** and corresponding database service functions related to financial transaction tracking, categorization, recurring entry support, and budget association.

_Last updated: 2025-05-23_

---

## 🆕 Transaction Logging & Editing

| Method | Endpoint                   | Description                                         | Function Name               |
|--------|----------------------------|-----------------------------------------------------|-----------------------------|
| POST   | /api/transactions          | Log a new transaction                               | `createTransaction()`       |
| PUT    | /api/transactions/:id      | Update an existing transaction                      | `updateTransaction()`       |
| DELETE | /api/transactions/:id      | Delete a transaction                                | `deleteTransaction()`       |
| GET    | /api/transactions/user     | Get all transactions for a user                     | `getTransactionsByUser()`   |
| GET    | /api/transactions/account/:accountId | Get all transactions for an account        | `getTransactionsByAccount()`|

---

## 🔁 Recurring Transactions

| Method | Endpoint                              | Description                                       | Function Name                   |
|--------|---------------------------------------|---------------------------------------------------|---------------------------------|
| POST   | /api/transactions/recurring           | Create a recurring transaction                    | `createRecurringTransaction()`  |
| GET    | /api/transactions/recurring           | Get all recurring transactions for a user         | `getRecurringTransactions()`    |
| PATCH  | /api/transactions/recurring/:id       | Update next run or stop recurrence                | `updateRecurringTransaction()`  |

---

## 🧠 Categorization

| Method | Endpoint                              | Description                                      | Function Name                  |
|--------|---------------------------------------|--------------------------------------------------|--------------------------------|
| POST   | /api/categories/custom                 | Create a user-defined custom category            | `createCustomCategory()`       |
| GET    | /api/categories                        | Get all global categories                        | `getAllCategories()`           |
| GET    | /api/categories/custom/user/:userId    | Get custom categories for a user                 | `getCustomCategories()`        |

---

## 📊 Budgeting

| Method | Endpoint                          | Description                                           | Function Name                  |
|--------|-----------------------------------|-------------------------------------------------------|--------------------------------|
| POST   | /api/budgets                      | Create a new budget                                  | `createBudget()`               |
| GET    | /api/budgets/user/:userId         | Get all budgets for a user                           | `getBudgetsByUser()`           |
| GET    | /api/budgets/:budgetId            | Get a specific budget                                | `getBudgetById()`              |
| DELETE | /api/budgets/:budgetId            | Delete a budget and its category allocations         | `deleteBudget()`               |
| POST   | /api/budgets/:budgetId/categories | Allocate category or custom category to a budget     | `addBudgetCategory()`          |
| GET    | /api/budgets/:budgetId/categories | View all allocations for a budget                    | `getBudgetCategories()`        |

---

## 🔎 Insights & Search

| Method | Endpoint                      | Description                                | Function Name               |
|--------|-------------------------------|--------------------------------------------|-----------------------------|
| GET    | /api/transactions/search      | Search transactions by keyword or filters  | `searchTransactions()`      |
| GET    | /api/transactions/summary     | Get summary totals by type/category/date   | `getTransactionSummary()`   |

---

## 💡 Notes

- All transaction entries must obey the mutual exclusivity of `category_id` and `custom_category_id` enforced by a `CHECK` constraint in the schema.
- Budget allocations must also obey a similar exclusivity constraint.
- Recurring entries are tracked in their own table with `next_occurrence`, `frequency`, and optional `end_date`.
