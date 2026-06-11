Day 17 backend demo

This is a minimal Express backend used for the Day 17 demo. It stores users in memory (for demo purposes only) and issues JWT tokens on login/signup.

Install and run:

```
cd day17/backend
npm install
npm start
```

The server listens on port 3000 by default.

Endpoints:
- POST /signup  {name,email,password} -> { user, token }
- POST /login   {email,password} -> { token, user }
- GET /users    (requires Authorization: Bearer <token>)
- POST /users   (protected)
- PUT /users/:id (protected)
- DELETE /users/:id (protected)
