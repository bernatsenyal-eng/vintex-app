# VINTEX - Expense and Sales Tracker

A full-stack web app for tracking sales and expenses from Vinted, with user authentication, team management, and invitation codes.

## Features

- User registration and login
- Team creation and management
- Invitation codes for joining groups
- Admin panel for managing team members and permissions
- Track sales and expenses
- View group statistics

## Setup (Local Development)

### Backend

1. Install dependencies: `npm install`
2. Set up MongoDB and update `.env` with your MONGO_URI
3. Run: `npm start`

### Frontend

Open `frontend/index.html` in a browser. Make sure the backend is running on localhost:5000.

## Deployment

### Frontend (Netlify)

1. Upload the `frontend` folder to Netlify.
2. Set publish directory to `frontend`.
3. Get the Netlify URL (e.g., `https://tu-app.netlify.app`).

### Backend (Vercel)

1. Upload the `backend` folder to Vercel.
2. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL` (Netlify URL).
3. Get the Vercel URL (e.g., `https://tu-backend.vercel.app`).
4. Update `API_BASE` in `frontend/index.html` with the Vercel URL.

## API Endpoints

- POST /api/auth/register - Register user
- POST /api/auth/login - Login
- POST /api/auth/join - Join group with invite code
- POST /api/groups - Create group
- GET /api/sales - Get sales
- POST /api/sales - Add sale
- DELETE /api/sales/:id - Delete sale
- GET /api/expenses - Get expenses
- POST /api/expenses - Add expense
- DELETE /api/expenses/:id - Delete expense
- GET /api/users - Get team members (admin)
- PUT /api/users/:id/permissions - Update permissions (admin)
- DELETE /api/users/:id - Remove user (admin)
- GET /api/groups - Get group info
- PUT /api/groups/invite - Generate new invite code (admin)