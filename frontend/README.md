
# 📘 Gamified Finance Frontend (React + TailwindCSS)

Welcome to the frontend of the **Gamified Financial Visualizer**. This is a modern React application styled with Tailwind CSS, focused on visualizing financial goals, transactions, learnign financial management and community engagement through a gamified experience.

---

## 🚀 Tech Stack

* **React** (v18+)
* **Tailwind CSS** (v3+)
* **JavaScript (ES6+)**
* **React Router DOM** for routing
* **Jest + React Testing Library** for testing
* **Babel** for converting javascript extention to typescript

---

## 📁 Project Structure

```
src/
├── assets/             # Static images and icons
├── components/         # Reusable UI components
├── pages/              # Top-level routes and views
│   └── Auth/
│   └── CommunityPage/
│   └── Dahsboard/
│   └── GoalsPage/
│   └── Transactions/
├── layouts/            # Common page layouts e.g NavBar for all pages
├── utils/              # Utility functions and API calls
├── App.jsx             # App root with router setup
└── index.js            # Entry point
```

---

## 🧪 Running the Project

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm start
```

This will run the app on [http://localhost:3000](http://localhost:3000).

### 3. Build for production

```bash
npm run build
npm install framer-motion recharts
npm install framer-motion
```

### 4. Test dependencies

```bash
npm install --save-dev jest @types/jest ts-jest babel-jest   @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev jest-environment-jsdom
npm install --save-dev babel-jest @babel/preset-env @babel/preset-react
```
### 5. Run tests

```bash
npm test
```
---

## 🌈 Tailwind Setup

Tailwind is configured using `tailwind.config.js`. Classes are applied directly within JSX using `className`.

To modify Tailwind config:

```bash
tailwind.config.js
```

---

## 🔌 API Integration

All API calls should be made through a helper in `src/utils/api.js`. Example:

```js
import { get } from '../utils/api';

useEffect(() => {
  get('/api/goals/my').then(setGoals);
}, []);
```

---

## 👥 Contributions

Feel free to open issues or submit PRs. Make sure to lint and test before submitting:

```bash
npm run lint
npm test
```

---
## Github commands

Use these commands to create new branches:

```bash
git fetch
git checkout frontend
git pull origin frontend
git checkout -b new-branch-name
```

---

## 🧠 Maintainers

Built and maintained by the **Gamified Finance Team**.

---
