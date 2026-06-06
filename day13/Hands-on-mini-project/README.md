# User Management API - Day 13 Mini Project (MongoDB)

A REST API built with **Express.js** and **MongoDB** using **Mongoose** to persist users.

---

## **Project Structure**

```
user-management-api/
├── models/
│   └── User.js
├── package.json
├── server.js
└── README.md
```

---

## **Installation & Setup**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start MongoDB locally:**
   - If installed locally, run:
     ```bash
     mongod
     ```
   - Or use MongoDB Atlas and set `MONGODB_URI`.

3. **Start the server:**
   ```bash
   MONGODB_URI="mongodb://127.0.0.1:27017/userdb" npm start
   ```

   The API will run at: `http://localhost:3000`

   If `MONGODB_URI` is not provided, the app defaults to `mongodb://127.0.0.1:27017/userdb`.

---

## **MongoDB User Model**

Users are stored with the following schema:

- `name` (String, required)
- `email` (String, required)
- `age` (Number)
- `isActive` (Boolean, default: true)

---

## **API Endpoints**

### **1. GET All Users**
- **Endpoint:** `GET /users`
- **Description:** Retrieve all users from MongoDB

### **2. GET Single User by ID**
- **Endpoint:** `GET /users/:id`
- **Description:** Retrieve a specific user by MongoDB ObjectId

### **3. CREATE New User**
- **Endpoint:** `POST /users`
- **Description:** Add a new user to the database
- **Request Body Example:**
  ```json
  {
    "name": "Aman",
    "email": "aman@example.com",
    "age": 20,
    "isActive": true
  }
  ```

### **4. UPDATE User by ID**
- **Endpoint:** `PUT /users/:id`
- **Description:** Update user details by ObjectId

### **5. DELETE User by ID**
- **Endpoint:** `DELETE /users/:id`
- **Description:** Remove a user from the database

---

## **Additional Routes**

### **Search Users by Name**
- `GET /users/search/by-name?name=<name>`

### **Get Adult Users**
- `GET /users/filter/adults`

### **Get All User Emails**
- `GET /users/extract/emails`

### **Get Users Older Than a Value**
- `GET /users/age/:min`
- Returns users whose age is greater than or equal to `:min`

### **Get Only Active Users**
- `GET /users/active`
- Returns users whose `isActive` field is `true`

---

## **Assignment Ideas**

1. Add a `Product` model with `name`, `price`, and `category`, then build CRUD routes.
2. Extend the user schema with more fields and query only active users.
3. Add route `GET /users/age/:min` to fetch users older than the given age.
4. Push your MongoDB-connected API to GitHub.

2. **Test Examples:**

   **Add a new user:**
   ```bash
   POST http://localhost:3000/users
   Content-Type: application/json
   
   {
     "name": "Priya",
     "email": "priya@example.com",
     "age": 21
   }
   ```

   **Get all users:**
   ```bash
   GET http://localhost:3000/users
   ```

   **Update a user:**
   ```bash
   PUT http://localhost:3000/users/1
   Content-Type: application/json
   
   {
     "age": 26
   }
   ```

   **Delete a user:**
   ```bash
   DELETE http://localhost:3000/users/2
   ```

   **Search by name:**
   ```bash
   GET http://localhost:3000/users/search/by-name?name=Rahul
   ```

---

## **Key Concepts Learned**

✅ REST API principles (CRUD operations)  
✅ HTTP methods (GET, POST, PUT, DELETE)  
✅ JSON data handling  
✅ Route parameters (`:id`)  
✅ Query parameters (`?name=...`)  
✅ Input validation  
✅ Error handling with status codes  
✅ In-memory data storage  

---

## **Next Steps**

- Connect to a **MongoDB** or **MySQL** database
- Add **authentication** (JWT)
- Implement **middleware** for logging
- Add **pagination** for large datasets
- Create **unit tests** with Jest
- Deploy to **Heroku** or **AWS**

---

## **Author Notes**

This is a beginner-friendly REST API project. In production, you would use a database instead of in-memory arrays and add proper error handling and security measures.

---
