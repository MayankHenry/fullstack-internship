# Day 20 Capstone Project - Task Manager

This is an end-to-end full stack Task Manager built for the internship capstone. It includes user authentication, protected task CRUD, MongoDB storage, and a responsive frontend.

## Features

- User signup and login with JWT authentication
- Password hashing with bcrypt
- Protected task APIs
- Create, read, update, complete, and delete tasks
- Categories, due dates, search, and status filtering
- Responsive HTML, CSS, and JavaScript frontend

## Tech Stack

- Frontend: HTML, CSS, JavaScript, Fetch API
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT and bcrypt

## Project Structure

```text
capstone-project/
  backend/
    src/
      middleware/
      models/
      routes/
    server.js
    package.json
    .env.example
  frontend/
    index.html
    style.css
    script.js
```

## Backend Routes

- `POST /api/auth/signup` - register a user
- `POST /api/auth/login` - login and receive a token
- `GET /api/tasks` - get logged-in user's tasks
- `POST /api/tasks` - create a task
- `PUT /api/tasks/:id` - update a task
- `DELETE /api/tasks/:id` - delete a task

## Local Setup

1. Open the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` from `.env.example` and update values:

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/capstone_task_manager
JWT_SECRET=replace_with_a_long_random_secret
```

4. Start the backend:

```bash
npm run dev
```

5. Open `frontend/index.html` in the browser.

## Deployment

### Backend on Render

- Create a new Web Service on Render.
- Root directory: `capstone-project/backend`
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `PORT`

### Frontend on Netlify

- Deploy the `capstone-project/frontend` folder.
- After Render deployment, update `API_BASE_URL` in `frontend/script.js`:

```js
const API_BASE_URL = "https://your-render-service.onrender.com/api";
```

## Presentation Checklist

- Show signup and login
- Add a task with category and due date
- Edit, complete, filter, and delete tasks
- Show MongoDB data in Atlas
- Show GitHub repository
- Explain deployment on Render and Netlify
