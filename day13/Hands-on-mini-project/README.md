# User Management API - Day 13 Mini Project

A simple REST API built with **Express.js** for managing users with **GET, POST, PUT, DELETE** operations.

---

## **Project Structure**

```
user-management-api/
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

2. **Start the server:**
   ```bash
   npm start
   ```

   The API will run at: `http://localhost:3000`

---

## **API Endpoints**

### **1. GET All Users**
- **Endpoint:** `GET /users`
- **Description:** Retrieve all users from the system
- **Response Example:**
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      { "id": 1, "name": "Rahul", "email": "rahul@example.com", "age": 22 },
      { "id": 2, "name": "Aditi", "email": "aditi@example.com", "age": 25 }
    ]
  }
  ```

---

### **2. GET Single User by ID**
- **Endpoint:** `GET /users/:id`
- **Description:** Retrieve a specific user by their ID
- **Example:** `GET /users/1`
- **Response Example:**
  ```json
  {
    "success": true,
    "data": { "id": 1, "name": "Rahul", "email": "rahul@example.com", "age": 22 }
  }
  ```
- **Error Response (404):**
  ```json
  {
    "success": false,
    "msg": "User not found"
  }
  ```

---

### **3. CREATE New User**
- **Endpoint:** `POST /users`
- **Description:** Add a new user to the system
- **Request Body:**
  ```json
  {
    "name": "Aman",
    "email": "aman@example.com",
    "age": 20
  }
  ```
- **Response Example (201 Created):**
  ```json
  {
    "success": true,
    "msg": "User created successfully",
    "data": { "id": 3, "name": "Aman", "email": "aman@example.com", "age": 20 }
  }
  ```
- **Validation Error (400):**
  ```json
  {
    "success": false,
    "msg": "Name and Email are required"
  }
  ```

---

### **4. UPDATE User by ID**
- **Endpoint:** `PUT /users/:id`
- **Description:** Update user details
- **Example:** `PUT /users/1`
- **Request Body (partial update):**
  ```json
  {
    "name": "Rahul Kumar",
    "age": 23
  }
  ```
- **Response Example:**
  ```json
  {
    "success": true,
    "msg": "User updated successfully",
    "data": { "id": 1, "name": "Rahul Kumar", "email": "rahul@example.com", "age": 23 }
  }
  ```

---

### **5. DELETE User by ID**
- **Endpoint:** `DELETE /users/:id`
- **Description:** Remove a user from the system
- **Example:** `DELETE /users/2`
- **Response Example:**
  ```json
  {
    "success": true,
    "msg": "User deleted successfully"
  }
  ```
- **Error Response (404):**
  ```json
  {
    "success": false,
    "msg": "User not found"
  }
  ```

---

## **Additional Routes (Bonus Assignments)**

### **6. Search Users by Name**
- **Endpoint:** `GET /users/search/by-name?name=<name>`
- **Description:** Find users by name (case-insensitive)
- **Example:** `GET /users/search/by-name?name=Rahul`
- **Response Example:**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [{ "id": 1, "name": "Rahul", "email": "rahul@example.com", "age": 22 }]
  }
  ```

---

### **7. Get Adult Users (Age >= 18)**
- **Endpoint:** `GET /users/filter/adults`
- **Description:** Retrieve all users who are 18 years or older
- **Response Example:**
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      { "id": 1, "name": "Rahul", "email": "rahul@example.com", "age": 22 },
      { "id": 2, "name": "Aditi", "email": "aditi@example.com", "age": 25 }
    ]
  }
  ```

---

### **8. Get All User Emails**
- **Endpoint:** `GET /users/extract/emails`
- **Description:** Extract only email information from all users
- **Response Example:**
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      { "id": 1, "name": "Rahul", "email": "rahul@example.com" },
      { "id": 2, "name": "Aditi", "email": "aditi@example.com" }
    ]
  }
  ```

---

## **Testing with Postman**

1. **Open Postman** or use curl in terminal

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
