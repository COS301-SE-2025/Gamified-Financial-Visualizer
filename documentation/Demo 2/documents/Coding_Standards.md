

# Coding Standards Document  
**Project:** Gamified Financial Visualizer  
**Team:** CodeBlooded  

## 1. File Naming Conventions  

### General Rules:
- Use kebab-case for file and folder names (e.g., `dashboard-component.jsx`, `api-utils.js`).  
- Avoid spaces, special characters, or uppercase letters in filenames.  
- Match component names with file names (e.g., `UserProfile.jsx` → `user-profile.jsx`).  

### Frontend (React): 
- **Components:** `[component-name].jsx` (PascalCase for component names, kebab-case for files).  
- **Styles:** `[component-name].module.css` (CSS Modules).  
- **Tests:** `[component-name].test.js` (Jest/React Testing Library).  

### Backend (Node.js/REST API):
- **Controllers:** `[resource]-controller.js` (e.g., `user-controller.js`).  
- **Models:** `[model-name].js` (PascalCase for model names).  
- **Routes:** `[resource]-routes.js` (e.g., `auth-routes.js`).  

## 2. Folder Structure

```
gamified-financial-visualizer/  
├── frontend/                  # Frontend (React)  
│   ├── public/  
│   ├── src/  
│   │   ├── assets/          # Images, fonts, etc.  
│   │   ├── components/      # Reusable UI components  
│   │   ├── pages/           # Page-level components  
│   │   ├── layouts/         # React page layouts 
│   │   └── App.jsx          # Main app entry  
│   └── ...  
├── api-backend/              # Backend (Node.js)  
│   ├── config/              # DB/config files  
│   ├── events/  
│   ├── modules/             # Auth, Transactions, Community, etc.
│   │   ├── service1/     
│   │   ├── service2/     
│   ├── jobs/  
│   ├── queues/  
│   ├── schedulars/  
│   ├── tests/               # Unit and integration tests
│   └── server.ts            # Entry point  
├── documentation/            # Project documentation  
└── .github/                 # GitHub workflows/CI  
```

## 3. Linting & Formatting

### ESLint:
- Airbnb JavaScript/React style guide (extends `eslint-config-airbnb`).  
- Custom rules:  
  - Max line length: 100 characters.  
  - Always use semicolons.  
  - Prefer `const` over `let` where possible.  
- Run lint checks before commits (Husky pre-commit hook).  

### Prettier: 
- Single quotes, trailing commas, and 2-space indentation.  
- `.prettierrc` config:
  ```json
  {
    "singleQuote": true,
    "trailingComma": "es5",
    "tabWidth": 2
  }
  ```

## 4. Style Guides

### React (Frontend) 
- Functional components with Hooks (avoid classes).  
- TypeScript strongly encouraged (if adopted, use interfaces for props).  
- Props destructuring in function parameters.  
- Avoid inline styles; use CSS Modules or styled-components.  

### REST API (Backend)
**Endpoints:**
- Use nouns (e.g., `/api/users`, `/api/transactions`).  
- Versioning: `/api/v1/...` (if needed).  

**HTTP Methods:**
- `GET` (read), `POST` (create), `PUT/PATCH` (update), `DELETE`.  

**Responses:**
- JSON format with consistent structure:  
  ```json
  {
    "success": true,
    "data": { ... },
    "error": null
  }
  ```			

**Error Handling:**
- HTTP status codes (e.g., `400` for bad requests, `404` for not found).  
- Include error messages in responses.  

## 5. Git & Branching

**Branch Naming:**
- `subsystem/feature/[description]` (e.g., `frontend/feature/user-auth`).  
- `subsystem/bugfix/[description]` (e.g., `backend/bugfix/login-error`).  

**Commits:**
- Conventional Commits (e.g., `feat: add login button`, `fix: resolve API 500 error`).  

**Pull Requests:**
- Require 1 approval before merging to `main`.  
- Link PRs to GitHub Issues.  

## 6. Testing

**Frontend:** 
- Jest + React Testing Library.  
- Test files colocated with components (e.g., `__tests__/button.test.js`).  

**Backend:** 
- Jest.  
- Test API endpoints and utility functions.  
- **Coverage:** Aim for 80%+ test coverage.  

## Review & Updates:
This document is a living standard. Propose changes via PRs!
