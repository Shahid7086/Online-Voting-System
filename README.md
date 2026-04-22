# Online Voting System (MERN)

Production-ready full-stack online voting platform with JWT auth, role-based access, one-vote enforcement, admin analytics, and chart dashboards.

## Tech Stack

- Frontend: React (Vite), Tailwind CSS, React Router, Axios, Chart.js
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt

## Project Structure

```txt
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  server.js
frontend/
  src/
    components/
    context/
    pages/
    services/
```

## Setup Instructions

1. Install Node.js (v18+) and MongoDB locally (or use MongoDB Atlas).
2. Backend setup:
   - Copy `backend/.env.example` to `backend/.env`
   - Set `MONGO_URI` and `JWT_SECRET`
   - Run:
     - `cd backend`
     - `npm install`
     - `npm run dev`
3. Frontend setup:
   - Copy `frontend/.env.example` to `frontend/.env`
   - Run:
     - `cd frontend`
     - `npm install`
     - `npm run dev`
4. Open frontend URL shown by Vite (usually `http://localhost:5173`).

## Auth & Roles

- Register/Login with hashed passwords (`bcryptjs`).
- JWT token is returned from backend and stored in `localStorage`.
- Roles supported:
  - `admin`: candidate management, voting control, analytics
  - `voter`: candidate listing + one-time vote

## Core API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Admin

- `POST /api/admin/candidates`
- `GET /api/admin/candidates`
- `GET /api/admin/total-votes`
- `GET /api/admin/leader`
- `PUT /api/admin/voting-status`
- `GET /api/admin/voting-status`
- `GET /api/admin/results`

### Voter

- `GET /api/voter/candidates`
- `GET /api/voter/status`
- `POST /api/voter/vote`

## Key Behaviors Implemented

- One vote per user enforced with database flag (`hasVoted`) + transaction.
- Voting can be opened/closed by admin.
- Leading candidate endpoint with tie detection.
- Winner displayed only after voting ends (including tie case).
- Responsive dark UI with cards, badges, table, and hover states.
- Bar and pie charts for vote visualization.
- Protected frontend routes and backend middleware-based RBAC.

