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
