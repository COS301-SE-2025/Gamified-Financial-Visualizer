# CodeBlooded API Endpoints – Sprint 1

**Version:** 1.0.0  
**Description:** API documentation for authentication  
**Base URL:** `https://codeblooded_api.example.com`

## 🔐 Authentication Schemes

### 📘 Schemas

#### RegisterRequest
**Required fields:**
- `full_name`
- `username`
- `email`
- `password`

**Properties:**
```json
{
  "full_name": "Jane Doe",
  "username": "jane.doe",
  "email": "jane@example.com",
  "password": "SecretPass@123"
}
```

#### LoginRequest
**Required fields:**
- `username`
- `password`

**Properties:**
```json
{
  "username": "jane.doe",
  "password": "SecretPass@123"
}
```

#### RegisterResponse
**Properties:**
```json
{
  "status": "success",
  "timestamp": "2025-05-20T20:47:10.000Z",
  "message": "User registered successfully.",
  "data": {
    "user": {
      "id": "1",
      "full_name": "Jane Doe",
      "username": "jane.doe",
      "email": "jane@example.com"
    }
  }
}
```

#### LoginResponse
**Properties:**
```json
{
  "status": "success",
  "timestamp": "2025-05-20T20:47:15.000Z",
  "message": "User authenticated successfully.",
  "data": {
    "user": {
      "id": "1",
      "username": "jane.doe"
    }
  }
}
```

## 📨 Authentication Endpoints

### POST `/api/auth/register`
**Summary:** Register a new user

**Request Body** (`application/json`):
```json
{
  "full_name": "Jane Doe",
  "username": "jane.doe",
  "email": "jane@example.com",
  "password": "SecretPass@123"
}
```

**Responses:**
- `201 Created`: Successful registration
- `400 Bad Request`: Invalid input

---

### POST `/api/auth/login`
**Summary:** Login an existing user

**Request Body** (`application/json`):
```json
{
  "username": "jane.doe",
  "password": "SecretPass@123"
}
```

**Responses:**
- `200 OK`: Successful login
- `401 Unauthorized`: Invalid credentials

---

## 🏘 Community Endpoints

### GET `/api/community/:userId`
**Description:** Returns detailed community info for all communities a user is a member of, including member lists.

**Request Body:** None

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "community_id": 4,
      "community_name": "Finance Legends",
      "description": "Learning and saving together",
      "banner": "banner1.jpeg",
      "created_at": "2024-05-01T12:00:00.000Z",
      "members": [
        {
          "user_id": 1,
          "username": "jane.doe",
          "email": "jane@example.com"
        }
      ]
    }
  ]
}
```

---

### GET `/api/community/user/:userId`
**Description:** Returns a summary list of communities the user belongs to (no member info).

**Request Body:** None

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "community_id": 4,
      "community_name": "Finance Legends",
      "banner": "banner1.jpeg",
      "description": "Learning and saving together",
      "created_at": "2024-05-01T12:00:00.000Z"
    }
  ]
}
```

---

### POST `/api/community`
**Description:** Creates a new community and assigns the creator as a member.

**Request Body:**
```json
{
  "user_id": 1,
  "community_name": "Young Investors Inc",
  "description": "Beginner community for new investors",
  "banner": "banner2.jpg"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Community name updated.",
  "data": {
    "community_id": 7,
    "community_name": "Young Investors Inc",
    "updated_at": "2024-05-21T12:00:00.000Z"
  }
}
```

---

### DELETE `/api/community/:communityId`
**Description:** Deletes a community by ID.

**Request Body:** None

**Response:**
```json
{
  "status": "success",
  "message": "Community 7 deleted successfully."
}
```

---

## 🏋 Goal Endpoints (Personal & Community)

### POST `/api/goal`
**Description:** Creates a personal financial goal.

**Request Body:**
```json
{
  "user_id": 1,
  "goal_name": "Save for Trip to Zanzibar",
  "goal_type": "savings",
  "target_amount": 10000,
  "target_date": "2025-12-31",
  "goal_status": "in-progress"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Goal created successfully.",
  "data": {
    "goal_id": 42,
  }
}
```

---

### POST `/api/goal/community`
**Description:** Creates a goal for a specific community.

**Request Body:**
```json
{
  "user_id": 1,
  "community_id": 5,
  "goal_name": "Greendale Community Savings",
  "goal_type": "savings",
  "target_amount": 5000,
  "target_date": "2025-06-30",
  "goal_status": "in-progress"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Community goal created successfully.",
  "data": {
    "goal_id": 43,
    "user_id": 1,
    "community_id": 5,
    "goal_name": "Greendale Community Savings",
    "goal_type": "savings",
    "target_amount": 5000,
    "current_amount": 0,
    "goal_status": "in-progress",
    "target_date": "2025-06-30",
    "created_at": "2024-05-21T10:20:00.000Z"
  }
}
```

---

### GET `/api/goal/user/:userId`
**Description:** Fetches all personal goals for a user.

**Request Body:** None

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "goal_id": 42,
      "user_id": 1,
      "community_id": null,
      "goal_name": "Save for Trip to Durban",
      "goal_type": "savings",
      "target_amount": 10000,
      "current_amount": 0,
      "goal_status": "in-progress",
      "target_date": "2025-12-31",
      "created_at": "2024-05-21T10:15:00.000Z"
    }
  ]
}
```

---

### GET `/api/goal/user/:userId/community`
**Description:** Fetches all community goals from communities the user belongs to.

**Request Body:** None

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "goal_id": 43,
      "user_id": 1,
      "community_id": 5,
      "goal_name": "Sandton Community Savings",
      "goal_type": "savings",
      "target_amount": 5000,
      "current_amount": 0,
      "goal_status": "in-progress",
      "target_date": "2025-06-30",
      "created_at": "2024-05-21T10:20:00.000Z"
    }
  ]
}
```

---

### PUT `/api/goal/:goalId`
**Description:** Update the name of a personal goal.

**Request Body:**
```json
{
  "user_id": 1,
  "goal_name": "Buy my BMW"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Goal name updated successfully.",
  "data": {
    "goal_id": "42",
    "goal_name": "Buy my BMW",
    "updated_at": "2024-05-21T11:00:00.000Z"
  }
}
```

---

### PUT `/api/goal/community/:goalId`
**Description:** Update the name of a community goal.

**Request Body:**
```json
{
  "user_id": 1,
  "goal_name": "Midrand Community Goal"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Community goal name updated successfully.",
  "data": {
    "goal_id": "43",
    "goal_name": "Midrand Community Goal",
    "updated_at": "2024-05-21T11:10:00.000Z"
  }
}
```

---

### DELETE `/api/goal/:goalId`
**Description:** Delete a personal goal.

**Request Body:**
```json
{
  "user_id": 1
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Goal 42 deleted successfully."
}
```

---

### DELETE `/api/goal/community/:goalId`
**Description:** Delete a community goal.

**Request Body:**
```json
{
  "user_id": 1
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Community goal 43 deleted successfully."
}
```

---

### GET `/api/goal/user/:userId/in-progress`
**Description:** Returns all personal goals for the specified user that are still in progress.

**Request Body:** None

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "goal_id": 42,
      "user_id": 1,
      "community_id": null,
      "goal_name": "Save for Trip to Cape Town",
      "goal_type": "savings",
      "target_amount": 50000,
      "current_amount": 1000,
      "goal_status": "in-progress",
      "target_date": "2025-12-31",
      "created_at": "2024-05-21T10:15:00.000Z"
    }
  ]
}
```

---

### GET `/api/goal/user/:userId/achieved`
**Description:** Returns all personal goals for the specified user that have been achieved.

**Request Body:** None

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "goal_id": 39,
      "user_id": 1,
      "community_id": null,
      "goal_name": "Emergency Fund",
      "goal_type": "savings",
      "target_amount": 5000,
      "current_amount": 5000,
      "goal_status": "achieved",
      "target_date": "2024-12-31",
      "created_at": "2024-04-15T09:00:00.000Z"
    }
  ]
}
```

---

### GET `/api/goal/user/:userId/community/in-progress`
**Description:** Returns all in-progress community goals for communities the user is a member of.

**Request Body:** None

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "goal_id": 43,
      "user_id": 1,
      "community_id": 5,
      "goal_name": "Community Savings",
      "goal_type": "investment",
      "target_amount": 5000,
      "current_amount": 1500,
      "goal_status": "in-progress",
      "target_date": "2025-06-30",
      "created_at": "2024-05-21T10:20:00.000Z"
    }
  ]
}
```

---

### GET `/api/goal/user/:userId/community/achieved`
**Description:** Returns all achieved community goals for communities the user is a member of.

**Request Body:** None

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "goal_id": 31,
      "user_id": 2,
      "community_id": 5,
      "goal_name": "City Book Drive",
      "goal_type": "donation",
      "target_amount": 2000,
      "current_amount": 2000,
      "goal_status": "achieved",
      "target_date": "2024-09-01",
      "created_at": "2024-03-10T08:00:00.000Z"
    }
  ]
}
```

---

### GET `/api/goal/personal/:goalId`
**Description:** Returns a specific personal goal by ID.

**Request Body:** None

**Response:**
```json
{
  "status": "success",
  "data": {
    "goal_id": 42,
    "user_id": 1,
    "community_id": null,
    "goal_name": "Save for Trip",
    "goal_type": "savings",
    "target_amount": 10000,
    "current_amount": 0,
    "goal_status": "in-progress",
    "target_date": "2025-12-31",
    "created_at": "2024-05-21T10:15:00.000Z"
  }
}
```

---

### GET `/api/goal/community/:goalId`
**Description:** Returns a specific community goal by ID.

**Request Body:** None

**Response:**
```json
{
  "status": "success",
  "data": {
    "goal_id": 43,
    "user_id": 1,
    "community_id": 5,
    "goal_name": "Community Savings",
    "goal_type": "shared-savings",
    "target_amount": 5000,
    "current_amount": 1500,
    "goal_status": "in-progress",
    "target_date": "2025-06-30",
    "created_at": "2024-05-21T10:20:00.000Z"
  }
}
```

---

## 💸 Transaction API Endpoints

### POST `/api/transaction`
**Description:** Create a new transaction.

**Request Body:**
```json
{
  "account_id": 1,
  "category_id": 2,
  "custom_category_id": null,
  "transaction_amount": 75.50,
  "transaction_type": "expense",
  "transaction_date": "2024-05-24",
  "description": "Groceries at Pick n Pay",
  "note": "Used voucher",
  "is_recurring": false
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Transaction created successfully",
  "data": {
    "transaction_id": 101,
    "account_id": 1,
    "category_id": 2,
    "custom_category_id": null,
    "transaction_amount": 75.5,
    "transaction_type": "expense",
    "transaction_date": "2024-05-24",
    "description": "Groceries at Pick n Pay",
    "note": "Used voucher with 20% off",
    "is_recurring": false,
    "created_at": "2024-05-24T12:00:00.000Z"
  }
}
```

---

### POST `/api/budget`
**Description:** Create a budget period and assign it to a category.

**Request Body:**
```json
{
  "user_id": 1,
  "period_start": "2024-05-01",
  "period_end": "2024-05-31",
  "category_id": 2,
  "custom_category_id": null,
  "target_amount": 1000
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Budget and category allocation created successfully.",
  "data": {
    "budget_id": 15,
    "budget_category": {
      "budget_id": 15,
      "category_id": 2,
      "custom_category_id": null,
      "target_amount": 1000
    }
  }
}
```

---

### GET `/api/transaction/user/:userId`
**Description:** Fetch all transactions for a user.

**Request Body:** None

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "transaction_id": 101,
      "account_id": 1,
      "category_id": 2,
      "custom_category_id": null,
      "transaction_amount": 75.5,
      "transaction_type": "expense",
      "transaction_date": "2024-05-24",
      "description": "Groceries at Pick n Pay",
      "note": "Used voucher",
      "is_recurring": false,
      "created_at": "2024-05-24T12:00:00.000Z"
    }
  ]
}
```

---

### GET `/api/transaction/user/:userId/summary`
**Description:** Get total amounts grouped by category and transaction type.

**Request Body:** None

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "category_id": 2,
      "total_amount": 3200.00,
      "transaction_type": "expense"
    },
    {
      "category_id": 4,
      "total_amount": 7200.00,
      "transaction_type": "income"
    }
  ]
}
```