# 📄 Community Feature API Reference (Frontend ↔ Backend Mapping)

---

## 📍 Component-to-Endpoint Mapping

### CommunityDetailPage.jsx

| Component            | Purpose                                   | Data Needed (API)                         |
| -------------------- | ----------------------------------------- | ----------------------------------------- |
| SearchBar            | Search within community                   | GET /api/community/:id/search?query=... |
| ActionButtons        | Join, leave, invite, create posts         | POST /api/community/:id/join etc.       |
| CommunityHeader      | Name, year, avatar, banner, color         | GET /api/community/:id                  |
| CommunityInfo        | Description + goal progress               | GET /api/community/:id/goal             |
| CommunityFriendsList | Show members/friends in community         | GET /api/community/:id/members          |
| SidebarLeft/Right    | Reusable UI panels (notifications, links) | Static/dynamic based on app context       |

---

## 🧠 Proposed API Endpoints

### 📘 Community Details

ts
GET /api/community/:communityId


*Response:*

json
{
  "id": "abc123",
  "name": "New Business",
  "year": 2027,
  "description": "This group is saving up for our 2028 Japan Trip! 🍜🎌",
  "bannerImage": "/assets/Images/japanBanner.png",
  "avatar": "/assets/Images/japanAvatar.png",
  "color": "#6BAF4E"
}


### 👥 Community Members

ts
GET /api/community/:communityId/members


*Response:*

json
[
  { "id": "u1", "name": "Alice", "avatar": "/avatars/a.png" },
  { "id": "u2", "name": "Bob", "avatar": "/avatars/b.png" }
]


### 📈 Community Goal Progress

ts
GET /api/community/:communityId/goal


*Response:*

json
{
  "goalTitle": "Japan Trip 2028",
  "progress": 62,
  "amountSaved": 3100,
  "targetAmount": 5000,
  "deadline": "2028-01-01"
}


### 🔍 Community Search

ts
GET /api/community/:communityId/search?query=trip


*Response:*

json
{
  "posts": [ { "id": 1, "title": "Trip Tips", "body": "..." } ],
  "members": [ { "id": "u1", "name": "Alice" } ]
}


### ➕ Membership & Invites

ts
POST /api/community/:communityId/join
POST /api/community/:communityId/leave
POST /api/community/:communityId/invite
// Body: { userId: string }


---

### ManageCommunityPage.jsx

| Feature        | UI Element             | Backend Endpoint                 |
| -------------- | ---------------------- | -------------------------------- |
| View metadata  | name, year, banner     | GET /api/community/:id         |
| Goal progress  | progress bar           | GET /api/community/:id/goal    |
| Members list   | <CommunityFriendsList> | GET /api/community/:id/members |
| Add member     | Plus button            | POST /api/community/:id/invite |
| Edit community | Edit button            | PUT /api/community/:id         |
| Delete         | Delete button          | DELETE /api/community/:id      |

---

### CreateCommunityPage.jsx

ts
POST /api/community


*Body:*

json
{
  "name": "Bali Trip",
  "description": "Community Description",
  "bannerImage": "/assets/Images/pixelBar.jpeg"
}


*Response:*

json
{
  "message": "Community created successfully",
  "communityId": "abc123"
}


---

### FriendProfilePage.jsx

| Feature                | Data Source            | Backend Requirement                                                    |
| ---------------------- | ---------------------- | ---------------------------------------------------------------------- |
| Name, XP, Level        | profile.name, level    | GET /api/users/:id/profile                                           |
| Progress bar           | XP, next XP            | Calculated backend                                                     |
| Badges                 | profile.badges\[]      | GET /api/users/:id/badges                                            |
| Quiz stats             | profile.stats          | Aggregated from quizzes                                                |
| Communities joined     | profile.communities\[] | GET /api/users/:id/profile                                           |
| Request/Invite buttons | UI                     | POST /api/users/:id/request-friend, POST /api/community/:id/invite |

---

### CommunityPost & MainContent.jsx

ts
GET /api/communities/public
GET /api/community/slug/:slug


Used for browsing discoverable communities and linking to detail pages.

---

### CommunityListPage.jsx

ts
GET /api/communities/my


Returns communities that the current user is a member/admin of.

---

### BadgesPanel.jsx

ts
GET /api/badges             // Catalog of badges
GET /api/users/me/badges    // Earned by user


---

### GoalCard & MiniGoalsList.jsx

ts
GET /api/goals/my           // All goals for current user
GET /api/goals/my/mini      // Mini goal summary
GET /api/goals/:id          // Goal details


---

### FriendsList.jsx

ts
GET /api/users/me/friends   // List of friends


---

### NotificationsPanel.jsx

ts
GET /api/notifications
POST /api/friends/:id/accept
POST /api/friends/:id/reject
DELETE /api/notifications/:id // Optional


---

## ✅ Method → Purpose Summary

| Method | Endpoint                       | Description            |
| ------ | ------------------------------ | ---------------------- |
| GET    | /api/community/\:id            | Get community metadata |
| GET    | /api/community/\:id/goal       | Get goal + progress    |
| GET    | /api/community/\:id/members    | Get member list        |
| POST   | /api/community/\:id/join       | Join community         |
| POST   | /api/community/\:id/invite     | Invite friend          |
| PUT    | /api/community/\:id            | Edit community         |
| DELETE | /api/community/\:id            | Delete community       |
| GET    | /api/users/\:id/profile        | View friend's profile  |
| POST   | /api/users/\:id/request-friend | Send friend request    |
| GET    | /api/communities/my            | Get user's communities |
| GET    | /api/communities/public        | Discover communities   |
| GET    | /api/badges                    | Badge catalog          |
| GET    | /api/users/me/badges           | Earned badges          |
| GET    | /api/goals/my                  | Get all goals          |
| GET    | /api/goals/\:id                | Get goal detail        |
| GET    | /api/users/me/friends          | Get friend list        |
| GET    | /api/notifications             | List notifications     |