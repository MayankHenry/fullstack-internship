# Day 16 – User Authentication (Signup, Login, JWT, Password Hashing)

## Learning Objectives

By the end of Day 16, you will:

- Understand the basics of **authentication** and **authorization**.
- Learn how to implement **user signup and login** with MongoDB & Express.
- Use **bcrypt** to hash passwords before storing them.
- Use **JWT (JSON Web Token)** for authentication.
- Create **protected routes** that require login.
- Build a mini project: **Secure User Auth API**.

---

## 1. Authentication vs Authorization

- **Authentication** → Verifying identity (Login, Signup).
- **Authorization** → Checking permissions (Who can access what).

Example:

- Login = Authentication ✅
- Admin-only dashboard = Authorization ✅

---

## 2. Setup Project

Install required packages:

```bash
npm init -y
npm install express mongoose bcryptjs jsonwebtoken
```

Create `server.js` and connect to MongoDB:

```js
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/authdb")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
```

---

## 3. User Schema with Password

Create a user schema in `models/User.js`:

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model("User", userSchema);
```

---

## 4. Password Hashing with bcrypt

Never store raw passwords. Use **bcrypt** to hash them.

```js
const bcrypt = require("bcryptjs");

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ msg: "User created successfully" });
});
```

**Practice Task 1**

- Create a new user with `/signup`. Check the DB → password should be hashed.

---

## 5. Login with bcrypt & JWT

Use **JWT** to issue a token after successful login.

```js
const jwt = require("jsonwebtoken");

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1h" });
  res.json({ msg: "Login successful", token });
});
```

**Practice Task 2**

- Try logging in with correct vs incorrect password.
- Observe the JWT token in response.

---

## 6. Middleware for Protected Routes

Create an auth middleware to verify the token.

```js
function auth(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ msg: "No token, access denied" });

  try {
    const verified = jwt.verify(token, "secretkey");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid token" });
  }
}

app.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});
```

**Practice Task 3**

- Access `/profile` with token → works.
- Access without token → denied.

---

## 7. Hands-on Mini Project – Secure User Auth API

**Requirements:**

1. Implement `/signup` and `/login` routes.
2. Use **bcrypt** for password hashing.
3. Issue JWT tokens on login.
4. Create a **/profile** protected route.
5. Store users in MongoDB.

**Expected Flow:**

1. Signup → User created.
2. Login → Token generated.
3. Access `/profile` → Only works with token.

---

## 8. Recap

- Authentication = login/signup, Authorization = permissions.
- Used **bcrypt** to hash passwords.
- Used **JWT** for secure authentication.
- Created middleware to protect routes.
- Built a **Secure User Auth API**.

---

## Assignments

1. Extend `/signup` → Prevent duplicate emails.
2. Add a `role` field (admin, user). Protect `/admin` route → only admins can access.
3. Add a `/logout` route (invalidate token by storing in a blacklist array).
4. Push your Auth API to GitHub.
