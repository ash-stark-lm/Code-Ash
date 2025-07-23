CodeAsh: A Modern Full-Stack Coding Platform
🧠 Problem Statement & Vision
I built CodeAsh to sharpen my MERN stack skills and understand how real-world full-stack projects are designed, architected, and deployed. Existing platforms like LeetCode or HackerRank often lack visualization and openness. CodeAsh aims to fill that gap by offering:
✨ Visualizer support for algorithms

🤖 AI Assistant (Herby) that can directly access your code and debug it

🔐 JWT-auth based secure login system with Redis-based token invalidation

🆓 Zero-cost access to support community learning

This project is fully open-source, developer-friendly, and designed for extensibility.

🚀 Features
🔐 User Authentication (Email/Password + Google OAuth)

JWT-based authentication with auto-login support if token is valid

Redis used to store blacklisted tokens on logout, with automatic expiry

📚 Problem Listing & Filtering

Pagination and lazy loading

Filter by difficulty (Easy, Medium, Hard)

Filter by tags (e.g., Array, Tree, Graph)

🧑‍💻 Editor Features

Monaco Editor with:

Adjustable font size

Language selector (C++, Python, JS, etc.)

Custom themes

💡 Visualizer Section

Fully animated with Framer Motion

Smooth transitions via Lenis for scrolling

Algorithms currently supported:

Sorting: Selection Sort, Bubble Sort, Insertion Sort, Merge Sort

Searching: Binary Search, Linear Search

Stack, Queue

Linked List: Singly & Doubly

Binary Tree: Preorder, Inorder, Postorder

Heap: Max Heap, Min Heap

Graph: DFS, BFS, Flood-Fill

More visualizers to be added soon

🚦 Code Submission & Evaluation

Judge0 API integration via RapidAPI

Submission stored in DB as 'pending' → results updated after polling tokens

Verdicts shown: AC, WA, TLE, Runtime Error

📝 Submission Viewer

Framer Motion transitions

Read-only mode with green/red border for Accepted/Rejected

"Exit Submission View" button animation

📈 User Profile Dashboard

View total problems solved

Track number of submissions

Charts showing progress

🤖 Herby AI Assistant

No dropdowns — click-based actions:

Debug my code

Explain my code

Generate test cases

Herby automatically fetches current problem + user code

Calls OpenAI API to provide intelligent feedback

👨‍🏫 Admin Panel

Full CRUD for problem creation

Add/edit title, statement, difficulty, tags, visible + hidden testcases

Delete problems

🔮 Future Additions

Discussion/comments per problem

Leaderboard

Contest system

Self-hosted judge

🏗️ System Architecture (High-Level Design)

Key Flow Summary:
Authentication: User logs in → JWT issued → stored in localStorage → Redis used to blacklist token on logout

Problem Solving: User selects a problem → Code written in Monaco → Run/Submit triggers backend call

Code Execution:

If "Run": executes on visible testcases

If "Submit": executes on hidden testcases, updates DB

AI Assistance: Click on Herby action → backend grabs code/problem → generates prompt → fetches answer from OpenAI

Visualizer: Route-driven visualizers → rendered using Framer Motion + Lenis

Admin CRUD: Admin panel allows problem management, tags, testcases etc.

🔁 Technical Stack Workflow
🔹 Frontend (React + Vite + TailwindCSS + Framer Motion + Lenis)
Built with Vite for fast development

Uses Framer Motion for page transitions, submission view animations

Lenis ensures smooth page scrolling (visualizer/navigation)

Redux Toolkit used for global state management

Pages: Login, Signup, Problems, Editor, Profile, Admin Panel

🔹 Backend (Node.js + Express.js)
REST API built with Express

Authentication:

JWT-based with middleware to protect routes

Redis used to store blacklisted JWTs on logout

Submission Handling:

/submit/:id route stores code, sends to Judge0

submitBatch() and submitToken() in utils manage integration

AI Agent:

solveDoubt.js controller builds prompts using user code + problem

Sends to OpenAI API → returns debug response

🔹 Database: MongoDB
Models:

Users

Problems (with visible & hidden testcases)

Submissions (linked to user + problem)

Stores submission results, timestamps, verdicts

🔹 Cache Layer: Redis
Used to block blacklisted JWT tokens on logout

TTL applied to tokens to auto-clear expired ones

🔹 Evaluation: Judge0 (via RapidAPI)
Submissions sent in batch per testcase

Token polling used to fetch final verdicts

Stored in DB for profile/statistics

🗂️ Code Structure
📦 Backend (/Backend)
Backend/
├── src/
│ ├── config/ # db.js, redis.js
│ ├── controllers/ # authController, userSubmissionController, solveDoubt.js
│ ├── middleware/ # admin/user auth middlewares
│ ├── models/ # problems.js, submission.js, users.js
│ ├── routes/ # authRoutes.js, problemRoutes.js, submitRoutes.js
│ ├── utils/ # problemUtils.js, validators, hashing, etc.
│ └── index.js # App entry point
├── .env
├── Dockerfile

🎨 Frontend (/Frontend)
Frontend/
├── src/
│ ├── components/
│ │ ├── Admin/
│ │ └── Visualizer/ # Algorithm animations
│ ├── pages/ # Login, Signup, Problems, Editor, Admin
│ ├── Routes/ # React Router setup
│ ├── store/ # Redux store
│ └── utils/ # axiosClient, authSlice, etc.
├── .env
├── Dockerfile

📦 Deployment Guide
🧪 Prerequisites
Node.js, Docker, Railway Account

📦 ENV Files
.env files present in both Frontend/ and Backend/

Must configure Judge0 keys, Mongo URI, JWT secret, etc.

⚙️ Run Locally
docker compose up --build

🚀 Deploy to Railway
Link Railway to both Frontend & Backend repos

Set ENV variables correctly in Railway dashboard

App will auto-build and deploy

👤 Author
Ashish Kumar
MERN Stack Developer | Passionate about full-stack, algorithms, and developer tools
Feel free to star ⭐ this repo or contribute!

<details>
  <summary>📷 Click to expand system design diagram</summary>

![System Diagram](./docs/diagram.png)

</details>
