# TaskFlow - Modern Full-Stack Task Management Application

[![Thiranex Internship Task 02](https://img.shields.io/badge/Thiranex%20Internship-Task%2002-4f46e5.svg)](#)
[![Node.js](https://img.shields.io/badge/Node.js-v24.20.0-339933.svg?logo=nodedotjs)](#)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg?logo=react)](#)
[![Vite](https://img.shields.io/badge/Vite-6.0.7-646CFF.svg?logo=vite)](#)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4.svg?logo=tailwindcss)](#)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-010101.svg?logo=socketdotio)](#)
[![SQLite](https://img.shields.io/badge/Database-SQLite3-003B57.svg?logo=sqlite)](#)
[![Tests Passing](https://img.shields.io/badge/Tests-15%2F15%20Passing-10B981.svg)](#)

A full-stack, responsive task management web application built for creating, updating, organizing, and tracking tasks with real-time WebSocket synchronization, JWT authentication, and Kanban drag-and-drop workflows.

Developed to fulfill all requirements and guidelines for **Thiranex Internship Task 02**.

---

## 📋 Table of Contents
1. [Key Features](#-key-features)
2. [Tech Stack & Architecture](#-tech-stack--architecture)
3. [Quick Start Guide](#-quick-start-guide)
4. [Demo Credentials](#-demo-credentials)
5. [Automated Testing](#-automated-testing)
6. [API Documentation](#-api-documentation)
7. [WebSocket Real-Time Events](#-websocket-real-time-events)
8. [Project Structure](#-project-structure)

---

## ✨ Key Features

### 1. 🔐 User Authentication & Authorization
- **Secure Registration & Login**: User signup with password validation and encrypted password storage using **`bcryptjs`** (salt rounds = 10).
- **JWT Authorization**: Stateless **JSON Web Tokens (JWT)** generated on login/signup, protecting all task operations with expiration and signature verification.
- **Data Isolation**: Tasks are strictly scoped per authenticated user (`user_id` foreign key with cascading deletion).
- **Session Verification**: Instant validation of current session via `/api/auth/me`.
- **1-Click Demo Login**: Pre-configured demo button on the login screen for rapid evaluator testing.

### 2. 📝 Full CRUD Task Management
- **Create**: Add tasks with Title, Description, Priority (`Low`, `Medium`, `High`, `Urgent`), Status (`To Do`, `In Progress`, `Completed`), Category tags (`Frontend`, `Backend`, `DevOps`, `QA`, `Design`, `General`), and Due Date.
- **Read**: Dynamic query filtering (by status, priority, category tag), instant search across titles and descriptions, and flexible sorting (by due date, priority, title, or newest).
- **Update**: Edit task details in a responsive modal, or advance status with 1-click status pills or interactive **Kanban Drag-and-Drop**.
- **Delete**: Permanent task removal protected by a safety confirmation dialog.

### 3. ⚡ Real-Time Updates via WebSockets (Socket.io)
- **Bidirectional Event Sync**: Connects via Socket.io to broadcast task lifecycle events (`task_created`, `task_updated`, `task_deleted`).
- **Zero-Refresh Synchronization**: When any task is added, moved, updated, or removed in one tab or browser, all other connected sessions update in real time.
- **Live Connection Pill**: Header displays a live status badge (`Live Sync Active` with a pulsing green indicator).
- **Activity Toast Notifications**: Visual slide-in banners notify users in real-time when changes occur.
- **Audit Activity Drawer**: Side drawer logging all historical actions (Creation, Status Changes, Updates, Deletions) with timestamps.

### 4. 📱 Responsive Modern UI (Mobile & Web)
- **Dual View Modes**:
  - **Kanban Board View**: Column-based layout (`To Do`, `In Progress`, `Completed`) with native HTML5 drag-and-drop and column-specific quick-add buttons.
  - **List View**: Detailed tabular view with status checkboxes, badges, and inline actions.
- **Goal Progress Bar**: Visual progress indicator displaying completion percentage and count.
- **Responsive Layout**: Collapsible sidebar drawer for mobile devices, touch-friendly buttons, and responsive modals.
- **Modern Design**: Built using Tailwind CSS with clean card elevations, priority badges, and Lucide React icons.

---

## 🛠 Tech Stack & Architecture

```
+--------------------------------------------------------------------------+
|                        BROWSER CLIENT (React + Vite)                     |
|  - AuthContext (JWT)            - SocketContext (Socket.io-client)       |
|  - Kanban Board (HTML5 Drag)    - FilterBar & Search                     |
|  - Responsive Tailwind CSS      - Activity Toasts & Drawer               |
+--------------------------------------------------------------------------+
                       | HTTP (REST)          | WebSockets (WSS/WS)
                       v                      v
+--------------------------------------------------------------------------+
|                         BACKEND (Express.js)                             |
|  - Express REST API             - Socket.io Real-Time Handler            |
|  - Auth Middleware (JWT)        - Task Controller (CRUD + Filters)       |
|  - Activity Logger              - CORS & Error Handling                  |
+--------------------------------------------------------------------------+
                                       |
                                       v
+--------------------------------------------------------------------------+
|                       DATABASE (SQLite3 Persistent)                      |
|  - `users` (id, name, email, password, avatar, role, created_at)         |
|  - `tasks` (id, user_id, title, description, status, priority, due_date) |
|  - `activity_logs` (id, user_id, task_id, action, details, timestamp)    |
|  - Indexed by user_id, status, priority, and due_date                    |
+--------------------------------------------------------------------------+
```

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Socket.io-client |
| **Backend** | Node.js, Express 4, Socket.io 4, JSON Web Token (`jsonwebtoken`), `bcryptjs` |
| **Database** | SQLite3 (Persistent zero-setup database with foreign keys & WAL mode) |
| **Dev Tools** | `concurrently` (unified runner), automated test runner |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v9+

### 1. Install Dependencies
Run the command below in the project root folder to install dependencies for root, backend, and frontend:
```bash
npm run install:all
```

### 2. Seed Database with Sample Data
Populate the SQLite database with realistic initial tasks:
```bash
npm run seed
```

### 3. Start the Full Application
Start both the Express backend (`http://localhost:5000`) and Vite frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🔑 Demo Credentials

A demo account is pre-seeded for easy evaluation:

- **Email**: `demo@thiranex.com`
- **Password**: `Password123!`

*(You can also click the **"Demo Fill"** button directly on the sign-in page to autofill these credentials, or click **"Create Account"** to register a new user).*

---

## 🧪 Automated Testing

A comprehensive integration test suite verifies the API, authentication rules, CRUD logic, and database integrity.

To execute the test suite:
```bash
npm test
```

### Test Suite Output
```text
======================================================
       RUNNING BACKEND API INTEGRATION TESTS          
======================================================

Connected to SQLite database at: ...\backend\database.sqlite
Database tables & indexes initialized successfully.
===============================================
  Task Management API Server Running!
  Local URL:   http://localhost:5099
  Health:      http://localhost:5099/api/health
  Environment: test
===============================================
  [PASS] 1. Health check endpoint responds with online status
  [PASS] 2. User registration returns 201 and JWT token
  [PASS] 3. Duplicate email registration rejected with 409 Conflict
  [PASS] 4. User login returns 200 and valid session data
  [PASS] 5. GET /api/auth/me returns authenticated user profile
  [PASS] 6. Unauthenticated request to /api/tasks is blocked with 401 Unauthorized
  [PASS] 7. Task creation returns 201 and created task with ID
  [PASS] 8. Second task creation succeeds
  [PASS] 9. GET /api/tasks lists user tasks
  [PASS] 10. Filter by status returns strictly matching tasks
  [PASS] 11. Task status updated to "completed"
  [PASS] 12. Task statistics endpoint returns correct aggregated counts
  [PASS] 13. DELETE /api/tasks/:id deletes task successfully
  [PASS] 14. Fetching deleted task returns 404 Not Found
  [PASS] 15. User activity logs recorded and retrieved

======================================================
Test Results: 15 PASSED, 0 FAILED
======================================================
```

---

## 📡 API Documentation

### Base URL: `http://localhost:5000/api`

### Authentication Endpoints

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new user with name, email, password | No |
| `POST` | `/auth/login` | Authenticate user & return JWT token | No |
| `GET` | `/auth/me` | Fetch authenticated user profile | **Yes (Bearer Token)** |

#### Request Payload (`POST /api/auth/register`)
```json
{
  "name": "Alex Johnson",
  "email": "alex@example.com",
  "password": "Password123!"
}
```

### Task Endpoints

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | List user tasks (supports `search`, `status`, `priority`, `category`, `sortBy`) | **Yes** |
| `GET` | `/tasks/stats` | Aggregated metrics (total, pending, in-progress, completed, overdue, urgent) | **Yes** |
| `GET` | `/tasks/activities`| Audit trail of recent user task actions | **Yes** |
| `GET` | `/tasks/:id` | Get details of a single task | **Yes** |
| `POST` | `/tasks` | Create a new task | **Yes** |
| `PUT` | `/tasks/:id` | Update an existing task | **Yes** |
| `DELETE`| `/tasks/:id` | Permanently delete a task | **Yes** |

#### Request Payload (`POST /api/tasks`)
```json
{
  "title": "Implement WebSocket real-time synchronization",
  "description": "Connect frontend Socket.io with Express backend events",
  "status": "pending",
  "priority": "high",
  "category": "Backend",
  "dueDate": "2026-12-01"
}
```

---

## ⚡ WebSocket Real-Time Events

When a user connects, the frontend automatically registers to its authenticated room `user_{userId}`.

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `join_user_room` | Client &rarr; Server | `userId` | Subscribes socket client to user channel |
| `leave_user_room` | Client &rarr; Server | `userId` | Unsubscribes socket client |
| `task_created` | Server &rarr; Client | `{ task, message }` | Emitted when a new task is created |
| `task_updated` | Server &rarr; Client | `{ task, isStatusChanged, message }` | Emitted when a task or status is updated |
| `task_deleted` | Server &rarr; Client | `{ taskId, message }` | Emitted when a task is deleted |

---

## 📂 Project Structure

```
TASK 02/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # SQLite3 database connection & migrations
│   │   ├── controllers/
│   │   │   ├── authController.js     # User registration, login, profile
│   │   │   └── taskController.js     # Full CRUD, filtering, stats, activities
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT bearer token verification
│   │   │   └── errorMiddleware.js    # 404 & global exception handling
│   │   ├── models/
│   │   │   ├── userModel.js          # User queries & password hashing helpers
│   │   │   └── taskModel.js          # Task queries, stats aggregation & logs
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth routes
│   │   │   └── taskRoutes.js         # /api/tasks routes
│   │   ├── scripts/
│   │   │   ├── seed.js               # Database demo seed script
│   │   │   └── test-api.js           # 15-point integration test runner
│   │   ├── socket/
│   │   │   └── socketHandler.js      # Socket.io connection & room broadcaster
│   │   └── server.js                 # Express server & HTTP startup
│   ├── .env.example
│   ├── database.sqlite
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActivityDrawer.jsx    # Real-time action log slide-over
│   │   │   ├── DeleteConfirmModal.jsx# Delete confirmation dialog
│   │   │   ├── FilterBar.jsx         # Search, status, priority, sort & view toggle
│   │   │   ├── KanbanBoard.jsx       # Column drag-and-drop board
│   │   │   ├── Navbar.jsx            # Header with sync status & user profile
│   │   │   ├── ProtectedRoute.jsx    # Auth route guard
│   │   │   ├── RealTimeActivityToast.jsx # Floating live sync notifications
│   │   │   ├── Sidebar.jsx           # Workflow navigation & goal progress
│   │   │   ├── StatsOverview.jsx     # Metric cards overview
│   │   │   ├── TaskCard.jsx          # Draggable task card with priority badges
│   │   │   ├── TaskListView.jsx      # Tabular list layout
│   │   │   └── TaskModal.jsx         # Create & edit modal form
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Authentication state management
│   │   │   └── SocketContext.jsx     # Socket.io connection & toast events
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx     # Main task workspace
│   │   │   ├── LoginPage.jsx         # Sign-in page with demo filler
│   │   │   └── RegisterPage.jsx      # Account creation page
│   │   ├── services/
│   │   │   └── api.js                # Centralized Fetch API client
│   │   ├── App.jsx                   # Root application & routing
│   │   ├── index.css                 # Tailwind CSS styles & animations
│   │   └── main.jsx                  # React DOM entry
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
├── package.json                      # Root orchestrator scripts
└── README.md                         # Project documentation
```

---

## 🎯 Internship Requirements Mapping

| Requirement | Implementation Detail | Status |
| :--- | :--- | :--- |
| **User Authentication & Authorization** | JWT token authentication, bcrypt password hashing, session recovery, `/api/auth/me`, protected endpoints. | ✅ Completed |
| **CRUD Operations for Tasks** | Create, Read, Update, Delete with Title, Description, Status, Priority, Category, Due Date, and Search/Filters. | ✅ Completed |
| **Real-Time Updates (WebSockets)** | Socket.io integrated on both server and client; auto-updates tasks and emits live toasts on all connected tabs. | ✅ Completed |
| **Responsive Design** | Mobile navigation drawer, responsive Kanban & List views, fluid layouts tailored for phone, tablet, and desktop screens. | ✅ Completed |
| **Full-Stack Application Structure** | Decoupled client and server architecture with root scripts (`npm run dev`), SQLite persistence, and test suite. | ✅ Completed |

---

Developed with ❤️ for **Thiranex Internship**.
