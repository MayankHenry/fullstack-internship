# **Day 14 – Introduction to Databases (MySQL vs MongoDB) & Setup**

---

## **Learning Objectives**

By the end of Day 14, students will:

- Understand what a **database** is and why web apps need one.
- Learn the difference between **Relational (SQL)** and **Non-Relational (NoSQL)** databases.
- Explore **MySQL** and **MongoDB** basics.
- Install and set up MongoDB (preferred for Node.js apps).
- Learn how to connect Node.js with MongoDB using Mongoose.
- Create a database, collection, and perform simple CRUD operations.

---

## **1. What is a Database?**

- A **database** stores data for applications.
- Instead of keeping data in memory/arrays, we persist it so it survives server restarts.

Example (Users):

```
ID | Name   | Email
1  | Rahul  | rahul@example.com
2  | Aditi  | aditi@example.com
```

---

## **2. SQL vs NoSQL Databases**

### **SQL (Structured Query Language) – Example: MySQL, PostgreSQL**

- Stores data in **tables (rows & columns)**.
- Schema is fixed (predefined structure).
- Best for structured data (banking, inventory).

### **NoSQL (Not Only SQL) – Example: MongoDB**

- Stores data in **documents (JSON-like)**.
- Flexible schema (different fields allowed).
- Best for dynamic data (social apps, IoT).

📝 **Quick Example**

**SQL Table:**

```
Users Table
id | name  | email
1  | Rahul | rahul@example.com
```

**MongoDB Document:**

```
{
  "id": 1,
  "name": "Rahul",
  "email": "rahul@example.com"
}
```

---

## **3. Why MongoDB for Node.js?**

- Stores data as JSON (JavaScript Object Notation).
- Easy integration with Node.js.
- Scalable and flexible schema.
- Widely used in MERN stack (MongoDB, Express, React, Node).

---

## **4. Installing MongoDB**

### **Option 1: Install Locally**

- Download from https://www.mongodb.com/try/download/community
- Run MongoDB server with:

```
mongod
```

### **Option 2: Use MongoDB Atlas (Cloud)**

1. Create account at https://www.mongodb.com/atlas.
2. Create free cluster.
3. Get connection string:

```
mongodb+srv://username:password@cluster.mongodb.net/mydb
```

---

## **5. Connecting Node.js with MongoDB (Mongoose)**

1. Install Mongoose:

```
npm install mongoose
```

2. Connect in `server.js`:

```js
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/testdb")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
```

---

## **6. Creating a Schema & Model**

```js
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});

const User = mongoose.model("User", userSchema);
```

---

## **7. CRUD Operations with MongoDB**

### **Create**

```js
const newUser = new User({ name: "Rahul", email: "rahul@example.com", age: 22 });
newUser.save().then(() => console.log("User saved"));
```

### **Read**

```js
User.find().then(users => console.log(users));
```

### **Update**

```js
User.updateOne({name: "Rahul"}, {age: 23})
  .then(() => console.log("User updated"));
```

### **Delete**

```js
User.deleteOne({name: "Rahul"})
  .then(() => console.log("User deleted"));
```

---

## **8. Hands-on Mini Project – User Database Integration**

**Requirements:**

1. Connect your **User Management API (Day 13)** to MongoDB.
2. Replace in-memory array with MongoDB collection.
3. Implement: GET → Fetch users from DB.
4. POST → Save new user to DB.
5. PUT → Update user in DB.
6. DELETE → Remove user from DB.

**Expected Output:**

- Data is **persisted** in MongoDB.
- Restarting the server does not lose user data.

---

## **9. Recap**

- Learned the difference between **SQL & NoSQL** databases.
- Understood why **MongoDB fits Node.js apps**.
- Installed MongoDB locally or used Atlas.
- Connected Node.js with MongoDB using Mongoose.
- Performed CRUD operations on a real database.
- Integrated database with REST API.

---

## **Assignments**

1. Create a **Product** model with fields: `name`, `price`, `category`. Perform CRUD.
2. Extend User model: Add `isActive` (boolean) and query only active users.
3. Create a route `/users/age/:min` → Fetch all users older than given age.
4. Push your database-connected API to GitHub.
