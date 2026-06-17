# Capstone Planning

## Project Idea

Task Manager with Authentication.

## Core Features

- User signup and login
- JWT-based protected dashboard
- Add personal tasks
- Edit task details
- Mark tasks as completed or active
- Delete tasks
- Search tasks
- Filter by status
- Store each user's tasks separately

## Database Models

### User

- `name`: String, required
- `email`: String, required, unique
- `password`: String, required, hashed before saving

### Task

- `title`: String, required
- `description`: String
- `category`: String
- `dueDate`: Date
- `completed`: Boolean
- `user`: ObjectId reference to User

## API Routes

### Authentication

- `POST /api/auth/signup`
- `POST /api/auth/login`

### Tasks

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Deployment Plan

- Backend: Render
- Database: MongoDB Atlas
- Frontend: Netlify
- Update `API_BASE_URL` in `frontend/script.js` after the backend is deployed.
