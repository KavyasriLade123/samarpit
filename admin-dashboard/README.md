# Samarpit Admin Dashboard (Full Stack)

## Project structure

- `frontend/` - React + Tailwind admin application
- `backend/` - Node.js + Express + MongoDB + JWT APIs

## Backend setup

1. Copy `backend/.env.example` to `backend/.env`
2. Update Mongo URI and JWT secret
3. Run:
   - `cd backend`
   - `npm install`
   - `npm run dev`

Default admin (seeded automatically if missing):
- Email: `admin@samarpit.org`
- Password: `Admin@123`

## Frontend setup

1. Copy `frontend/.env.example` to `frontend/.env`
2. Run:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## Features included

- JWT admin login + role middleware
- Dashboard stats + recent activity feed
- Student CRUD with auto-generated IDs
- Employee CRUD with auto-generated IDs
- Project/task CRUD with assignment and status tracking
- Filters (employee/student/status), search, pagination
- ID card generation + PDF download
- Notifications dropdown
- Dark mode toggle
- Student/Employee dashboard preview cards
