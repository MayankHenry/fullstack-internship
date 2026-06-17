# Blog Platform

A full stack blogging system built with Express.js, MongoDB, and vanilla HTML/CSS/JavaScript. Users can sign up, log in, and create, edit, or delete blog posts. Public visitors can browse and read all posts, while registered users manage their own content and leave comments.

## Features

- User signup and login with JWT authentication
- Password hashing with bcrypt
- Public blog feed with search
- Create, edit, and delete personal posts
- Tag posts for easy discovery
- Comment system for logged-in users
- Responsive design

## Tech Stack

- Frontend: HTML, CSS, JavaScript, Fetch API
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT and bcrypt

## Project Structure

```text
blog-platform/
  backend/
    src/
      middleware/
        auth.js
        optionalAuth.js
      models/
        User.js
        Post.js
        Comment.js
      routes/
        authRoutes.js
        postRoutes.js
        commentRoutes.js
    server.js
    package.json
    .env.example
  frontend/
    index.html
    style.css
    script.js
```

## API Routes

### Authentication

- `POST /api/auth/signup` - register a new user
- `POST /api/auth/login` - login and receive a JWT token

### Posts

- `GET /api/posts` - get all posts (public, supports search, tag, author query params)
- `GET /api/posts/:id` - get a single post by id (public)
- `POST /api/posts` - create a post (requires auth)
- `PUT /api/posts/:id` - update own post (requires auth)
- `DELETE /api/posts/:id` - delete own post (requires auth)

### Comments

- `GET /api/comments/:postId` - get all comments for a post (public)
- `POST /api/comments/:postId` - add a comment to a post (requires auth)
- `DELETE /api/comments/:commentId` - delete own comment (requires auth)

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
MONGO_URI=mongodb://127.0.0.1:27017/blog_platform
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
- Root directory: `blog-platform/backend`
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`

### Frontend on Netlify

- Deploy the `blog-platform/frontend` folder.
- After Render deployment, update `API` in `frontend/script.js`:

```js
const API = "https://your-render-service.onrender.com/api";
```

## Database Models

### User

- `name`: String, required
- `email`: String, required, unique
- `password`: String, required, hashed

### Post

- `title`: String, required
- `content`: String, required
- `excerpt`: String, auto-generated from content
- `tags`: Array of strings
- `author`: ObjectId reference to User

### Comment

- `text`: String, required
- `post`: ObjectId reference to Post
- `author`: ObjectId reference to User
