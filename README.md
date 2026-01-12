# Focus-Lite 🧠✅

Focus-Lite is a **full-stack task management application** built to demonstrate clean backend architecture, modern frontend practices, and professional DevOps workflows.

This project is intentionally opinionated and development-focused: everything runs locally via **Vagrant + Docker**, with CI quality gates (tests, linting, Sonar) enforcing discipline.

---

## ✨ Features

- User registration & login (JWT authentication)
- Protected task management
  - Create, list, update status, delete tasks
- Server-side validation + database constraints
- Pagination-ready API
- React frontend with protected routes
- Fully containerised dev environment
- Automated tests, linting, and quality gates

---

## 🧱 Tech Stack

### Backend

- Node.js (ES modules)
- Express
- PostgreSQL
- JWT authentication
- Jest + Supertest
- ESLint

### Frontend

- React
- React Router
- Axios
- Vite
- ESLint (React + hooks)

### DevOps / Infra

- Vagrant (Ubuntu VM)
- Docker & Docker Compose
- GitHub Actions (CI)
- SonarCloud (quality gate)

---

## Screenshots

![Register](docs/screenshots/01-register-dark.png)
![Tasks grouped](docs/screenshots/02-tasks-grouped.png)
![Inline edit](docs/screenshots/03-inline-edit.png)
![Toasts](docs/screenshots/04-toast.png)

---

## Architecture (Dev + Prod)

```mermaid
flowchart LR
  subgraph Host[Windows Host]
    B[Browser]
    V[Vagrant CLI]
  end

  subgraph VM[Ubuntu VM (Vagrant)]
    DC[Docker Compose]
    FE_DEV[Vite Dev Server :5173]
    API[Backend API :5000]
    DB[(Postgres :5432)]
    NGINX[Nginx :8080 (prod)]
  end

  B -->|Dev| FE_DEV
  FE_DEV -->|/api| API
  API --> DB

  B -->|Prod| NGINX
  NGINX -->|/api/*| API
  NGINX -->|SPA static| FE_STATIC[React build]
  API --> DB
```

---

## 90-second demo script

1. "This is Focus-Lite: a task manager built with a PERN stack and DevOps-quality workflows."
2. "Auth is JWT-based: register/login, then protected routes."
3. "Tasks support create, inline edit, status updates, delete — all with optimistic UI + rollback."
4. "The UI has dark mode, skeleton loaders, and toast notifications for feedback."
5. "Quality gates: Jest + Supertest tests, ESLint, coverage publishing, and SonarCloud analysis on every PR."
6. "Production mode uses Nginx as the front door serving the built SPA and proxying /api to the backend, with automated DB migrations."

---

## 📁 Project Structure

```text
focus-lite/
├─ Vagrantfile
├─ docker-compose.yml
├─ Makefile
├─ README.md
├─ sonar-project.properties
│
├─ backend/
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ src/
│  │  ├─ app.js
│  │  ├─ index.js
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ routes/
│  │  ├─ middleware/
│  │  ├─ utils/
│  │  └─ db/
│  │     ├─ migrations/
│  │     └─ seeds/
│  └─ test/
│
├─ frontend/
│  ├─ Dockerfile
│  ├─ package.json
│  └─ src/
│     ├─ api/
│     ├─ components/
│     ├─ pages/
│     └─ styles/
```

---

## 📖 API Reference

### Authentication

**POST /api/auth/register**

- Body: `{ email, password }`
- Success: `201` with `{ ok: true, message }`
- Errors: `409` (duplicate email), `422` (validation failed)

**POST /api/auth/login**

- Body: `{ email, password }`
- Success: `200` with `{ ok: true, token }`
- Errors: `401` (invalid credentials), `422` (validation failed)
- Rate limit: 50 requests per 15 minutes per IP

### Tasks (Protected)

All task endpoints require: `Authorization: Bearer <token>`

**GET /api/tasks**

- Success: `200` with `{ ok: true, tasks: [...] }`
- Errors: `401` (missing/invalid token)

**POST /api/tasks**

- Body: `{ title }`
- Success: `201` with `{ ok: true, task: {...} }`
- Errors: `401`, `422` (empty title)

**PATCH /api/tasks/:id**

- Body: `{ title?, status? }` (one or both)
- Status values: `pending`, `in-progress`, `completed`
- Success: `200` with `{ ok: true, task: {...} }`
- Errors: `401`, `404` (task not found), `422` (invalid status)

**DELETE /api/tasks/:id**

- Success: `200` with `{ ok: true, message }`
- Errors: `401`, `404` (task not found)

---

## 🔒 Security

- **JWT Expiry**: Tokens expire after 7 days
- **Password Hashing**: bcrypt with cost factor 12
- **Rate Limiting**: Auth endpoints limited to 50 requests per 15 minutes per IP
- **CORS**: Configured for `http://localhost:5173` (dev) and production origin
- **Helmet**: Security headers enabled in production
- **Validation**: Server-side validation on all inputs with explicit error messages

---
