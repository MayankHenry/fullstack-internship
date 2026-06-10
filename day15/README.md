# Day 15 – CRUD Operations with MongoDB (Mongoose In-Depth)

## Learning Objectives

By the end of Day 15, students will:

- Understand how to design and use **Mongoose schemas & models**.
- Perform **CRUD operations**: Create, Read, Update, Delete.
- Learn how to use **query filters** (e.g., age > 18).
- Validate input data using **Mongoose validators**.
- Extend their **User Management API** to fully use MongoDB.
- Build a mini project: **User CRUD API with MongoDB**.

---

## 1. Setting up Mongoose Schema & Model

Create a schema in `Hands-on-mini-project/models/User.js`:

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true, match: /.+@.+\..+/ },
  age: { type: Number, min: 1, max: 100 }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
```

---

## 2. CREATE – Insert Documents

Use the `POST /users` route to insert new users.

**Practice Task 1**

- Create 3 users with different names and emails.

---

## 3. READ – Fetch Documents

Use `GET /users` to fetch all users.

### Find by condition

Use route examples like:

```js
User.find({ age: { $gte: 18 } }).then(users => console.log(users));
```

**Practice Task 2**

- Fetch all users younger than 25.
- Fetch one user by email.

---

## 4. UPDATE – Modify Documents

Use `PUT /users/:id` or `findById` + `save()` to update users.

**Practice Task 3**

- Update a user’s email address.
- Increase age of all users by +1.

---

## 5. DELETE – Remove Documents

Use `DELETE /users/:id` to remove a single user.

**Practice Task 4**

- Delete one user by ID.
- Delete all users older than 60.

---

## 6. Query Operators in MongoDB

Use query examples like:

```js
User.find({ age: { $gt: 20 } });
User.find({ age: { $gte: 18, $lte: 30 } });
User.find({ $or: [{ name: "Aman" }, { name: "Neha" }] });
```

**Practice Task 5**

- Get all users aged between 20 and 30.
- Get all users whose name is either “Aman” or “Neha”.

---

## 7. Validation in Mongoose

Try creating users with invalid data to see Mongoose validation errors.

**Practice Task 6**

- Try creating a user without a name → it should throw a validation error.
- Try creating a user with invalid email → it should throw an error.

---

## 8. Hands-on Mini Project – User CRUD API with MongoDB

**Requirements:**

1. Connect Express server to MongoDB.
2. Implement routes: `GET /users` → Fetch all users.
3. `GET /users/:id` → Fetch user by ID.
4. `POST /users` → Create new user.
5. `PUT /users/:id` → Update user.
6. `DELETE /users/:id` → Delete user.
7. Validate name, email, and age using Mongoose.
8. Return proper error messages.

**Example API Response:**

```json
{
  "id": "64d9b24f3f2a1f9a8c123456",
  "name": "Rahul",
  "email": "rahul@example.com",
  "age": 23
}
```

---

## 9. Recap

- Learned **CRUD with Mongoose**: Create, Read, Update, Delete.
- Used **query filters** to fetch specific data.
- Applied **validation** for data integrity.
- Built a **User CRUD API** fully backed by MongoDB.

---

## Assignments

1. Create a `Product` model (name, price, stock). Implement CRUD.
2. Extend User model: add `role` (admin, user) → fetch all admins.
3. Create a route `/users/average-age` → return average age of users.
4. Push your CRUD API project with MongoDB to GitHub.
