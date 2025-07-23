# 🚀 CodeAsh: A Modern Full-Stack Coding Platform

## 🧠 Problem Statement & Vision

CodeAsh was built to refine my MERN stack skills and explore the end-to-end design of real-world full-stack systems. Unlike traditional coding platforms, CodeAsh brings a modern, visual, and AI-assisted experience to users.

> ✨ Key Differentiators:
- 🔍 **Algorithm Visualizers** with animations
- 🤖 **AI Assistant (Herby)** for smart debugging
- 🔐 **Secure JWT Authentication** with Redis-based token management
- 🆓 **Free & Open Source** to support community learning

---

## 🚦 Key Features

### 🔐 Authentication
- Email/password and Google OAuth login
- JWT-based with auto-login on valid token
- Logout invalidation via Redis (token blacklist + TTL)

### 📚 Problem Browsing
- Paginated & lazily loaded list
- Filter by difficulty and tags (e.g., Array, Tree, Graph)

### 🧑‍💻 Code Editor
- Monaco Editor with:
  - Font size control
  - Theme toggle
  - Language selector (C++, Python, JS, etc.)

### 💡 Visualizer Section
- Smooth animated transitions via **Framer Motion**
- Supported algorithms:
  - Sorting: Selection, Bubble, Insertion, Merge
  - Searching: Linear, Binary
  - Stack, Queue, Linked List (Singly, Doubly)
  - Tree Traversals
  - Heap (Min/Max)
  - Graphs (DFS, BFS, Flood Fill)

### ⚙️ Code Execution & Submission
- Powered by **Judge0 API** (via RapidAPI)
- Runs on testcases (visible/hidden)
- Verdicts: ✅ AC, ❌ WA, ⌛ TLE, 💥 RE
- Submissions saved and verdicts updated after polling

### 📈 User Dashboard
- Tracks:
  - Problems solved
  - Submissions made
- Progress shown via charts

### 🤖 Herby AI Assistant
- Smart actions (click-based, no dropdowns):
  - Debug my code
  - Explain my code
  - Generate test cases
- Automatically fetches current problem + code
- Powered by OpenAI API

### 🧑‍🏫 Admin Panel
- Full CRUD support for problems:
  - Add/edit/delete problems
  - Set difficulty, tags, visible/hidden testcases

---

## 🧬 System Architecture

<details>
  <summary>📷 Click to expand system design diagram. Understand the complete architecture.</summary>

  ![System Diagram](./docs/diagram.png)

</details>

### 🔁 Key Workflow Summary

**Authentication:**
- User logs in → JWT issued → Stored in localStorage
- On logout → Token blacklisted in Redis with TTL

**Code Submission Flow:**
- User selects a problem → Code is typed in Monaco
- "Run Code": evaluates on visible testcases
- "Submit": runs on hidden testcases via Judge0 → stores results in DB

**AI Assistant:**
- User clicks action → Backend grabs code + problem
- Prompt sent to OpenAI → Response shown on UI

**Visualizer:**
- Route-driven → Component loads animation for the selected algorithm

**Admin Interface:**
- Protected by middleware
- Allows CRUD on problems, tags, and testcases

---

## 🧰 Tech Stack

### 🔹 Frontend
- **React + Vite + TailwindCSS**
- **Framer Motion**: page transitions, animated editor
- **Lenis**: smooth scrolling
- **Redux Toolkit**: state management
- Pages: Login, Signup, Editor, Profile, Admin Panel

### 🔹 Backend
- **Node.js + Express**
- REST API with:
  - `/auth`, `/problems`, `/submit`, `/ai`
- Auth with JWT + Redis for logout token storage
- Controllers: `authController`, `problemController`, `solveDoubt`, `userSubmission`

### 🔹 Database
- **MongoDB**
- Models:
  - `User`
  - `Problem` (with visible/hidden testcases)
  - `Submission` (linked to user + problem)

### 🔹 Cache
- **Redis** for JWT token invalidation

### 🔹 Evaluation Engine
- **Judge0 via RapidAPI**
- Batch submission
- Token polling → result updates

---

## 🗂️ Project Structure

### 📦 Backend (`/Backend`)
```
Backend/
├── src/
│   ├── config/           # db.js, redis.js
│   ├── controllers/      # authController, solveDoubt.js, userSubmission, solveDoubt
│   ├── middleware/       # userAuthMiddleware, adminMiddleware
│   ├── models/           # User, Problem, Submission
│   ├── routes/           # authRoutes.js, problemRoutes.js, submitRoutes.js, chatRouter.js
│   ├── utils/            # hashPassword, partialValidator, validator, problemsUtils, referenceSolution, validator
│   └── index.js          # App entry point
├── .env
├── Dockerfile
```

### 🎨 Frontend (`/Frontend`)
```
Frontend/
├── src/
│   ├── components/       # Visualizers, Admin Panel, etc.
│   ├── pages/            # Login, Signup, Problems, Editor
│   ├── Routes/           # React Router setup
│   ├── store/            # Redux store config
│   └── utils/            # axios client, slices, etc.
├── .env
├── Dockerfile
```

---

## ⚙️ Run Locally

### 🧪 Prerequisites
- Node.js
- Docker
- Railway account (for deployment)

### 📦 Environment Variables
`.env` files required in both `Frontend/` and `Backend/`:
- Mongo URI
- JWT secrets
- Judge0 API keys
- Redis config

### 🔧 Build & Start
```bash
docker compose up --build
```

---

## 🚀 Deployment (Railway)

1. Connect Railway to both Frontend & Backend repos
2. Add required ENV variables in Railway dashboard
3. Auto-deploy from GitHub

---

## 👨‍💻 Author

**Ashish Kumar**  
_MERN Stack Developer | Passionate about algorithms & developer tools_

📌 GitHub: [ash-stark-lm](https://github.com/ash-stark-lm)

⭐ If you found this helpful, give the repo a star and feel free to contribute!

---

## 💬 Contributions

Pull requests, issues, and feedback are welcome. Feel free to:
- Add new visualizers
- Improve UI/UX
- Enhance Herby's capabilities
- Suggest new features!
