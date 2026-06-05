# **Day 13 – REST APIs with Express.js (GET, POST, PUT, DELETE)**

---

## **Learning Objectives**

By the end of Day 13, students will:

- Understand what **REST APIs** are and why they are used.
- Learn HTTP methods: **GET, POST, PUT, DELETE**.
- Build RESTful routes in Express.
- Work with JSON data (reading, sending, modifying).
- Create a simple in-memory data API.
- Build a mini project: **Simple User Management API**.

---

## **1. What is a REST API?**

- **REST (Representational State Transfer)** is a standard way to design APIs.
- APIs expose data and actions over **HTTP methods**:
  - **GET** → Read data.
  - **POST** → Create data.
  - **PUT** → Update data.
  - **DELETE** → Delete data.

Example:

```
GET    /users         → List users  
POST   /users         → Add new user  
PUT    /users/:id     → Update user  
DELETE /users/:id     → Delete user  
```

---

## **2. Setup Express Project**

```bash
mkdir rest-api
cd rest-api
npm init -y
npm install express
```

Create server.js:

```javascript
const express = require("express");
const app = express();

app.use(express.json()); // to parse JSON

app.listen(3000, () => {
    console.log("API running at http://localhost:3000");
});
```

---

## **3. Creating a Sample Data Store**

We'll use an array for now (later we'll connect to a database).

```javascript
let users = [
    {id: 1, name: "Rahul", email: "rahul@example.com"},
    {id: 2, name: "Aditi", email: "aditi@example.com"}
];
```

---

## **4. Implementing REST API Routes**

### **4.1 GET – Read Data**

```javascript
app.get("/users", (req, res) => {
    res.json(users);
});
```

### **4.2 POST – Create Data**

```javascript
app.post("/users", (req, res) => {
    const newUser = {id: users.length + 1, ...req.body};
    users.push(newUser);
    res.status(201).json(newUser);
});
```

### **4.3 PUT – Update Data**

```javascript
app.put("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    let user = users.find(u => u.id === id);

    if (!user) return res.status(404).json({msg: "User not found"});

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    res.json(user);
});
```

### **4.4 DELETE – Remove Data**

```javascript
app.delete("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    users = users.filter(u => u.id !== id);
    res.json({msg: "User deleted"});
});
```

---

## **5. Testing the API**

Use **Postman** or browser to test:

- GET /users → Show all users.
- POST /users → Add new user. (Body: { "name": "Aman", "email": "aman@example.com" })
- PUT /users/1 → Update user with ID 1.
- DELETE /users/2 → Remove user with ID 2.

📝 **Practice Task 1**

- Create a route /users/:id to return details of a single user by ID.

---

## **6. Error Handling in REST APIs**

### **Example: Handle Not Found**

```javascript
app.get("/users/:id", (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (!user) return res.status(404).json({msg: "User not found"});
    res.json(user);
});
```

### **Example: Validation**

```javascript
app.post("/users", (req, res) => {
    if (!req.body.name || !req.body.email) {
        return res.status(400).json({msg: "Name and Email required"});
    }
    const newUser = {id: users.length + 1, ...req.body};
    users.push(newUser);
    res.status(201).json(newUser);
});
```

---

## **7. Hands-on Mini Project – User Management API**

**Requirements:**

1. Setup routes for: GET /users – List all users.
2. GET /users/:id – Get user by ID.
3. POST /users – Add user.
4. PUT /users/:id – Update user.
5. DELETE /users/:id – Remove user.
6. Use in-memory array for storage.
7. Validate input data.

**Expected Output (API in Postman):**

- Add users dynamically.
- Fetch all users.
- Update or delete users.

---

## **8. Recap**

- Learned what **REST APIs** are.
- Implemented CRUD using Express.js.
- Used JSON for request & response.
- Practiced error handling & validation.
- Built a **User Management API**.

---

## **Assignments**

1. Add a /users/search?name=Rahul route that returns users by name.
2. Add an age field to users and filter /users/adults (age ≥ 18).
3. Extend API: Return only emails of all users at /users/emails.
4. Push your REST API project to GitHub.
