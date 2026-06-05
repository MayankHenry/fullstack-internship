const express = require("express");
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Sample data store (in-memory)
let users = [
    { id: 1, name: "Rahul", email: "rahul@example.com", age: 22 },
    { id: 2, name: "Aditi", email: "aditi@example.com", age: 25 }
];

let nextId = 3;

// ============= BASIC ROUTES =============

// GET - Retrieve all users
app.get("/users", (req, res) => {
    res.json({
        success: true,
        count: users.length,
        data: users
    });
});

// GET - Retrieve a single user by ID
app.get("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            msg: "User not found"
        });
    }

    res.json({
        success: true,
        data: user
    });
});

// POST - Create a new user
app.post("/users", (req, res) => {
    // Validation
    if (!req.body.name || !req.body.email) {
        return res.status(400).json({
            success: false,
            msg: "Name and Email are required"
        });
    }

    if (req.body.age && (req.body.age < 0 || req.body.age > 150)) {
        return res.status(400).json({
            success: false,
            msg: "Please provide a valid age"
        });
    }

    const newUser = {
        id: nextId++,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age || null
    };

    users.push(newUser);

    res.status(201).json({
        success: true,
        msg: "User created successfully",
        data: newUser
    });
});

// PUT - Update a user by ID
app.put("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            msg: "User not found"
        });
    }

    // Validate age if provided
    if (req.body.age && (req.body.age < 0 || req.body.age > 150)) {
        return res.status(400).json({
            success: false,
            msg: "Please provide a valid age"
        });
    }

    // Update only provided fields
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.age !== undefined) user.age = req.body.age;

    res.json({
        success: true,
        msg: "User updated successfully",
        data: user
    });
});

// DELETE - Remove a user by ID
app.delete("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = users.length;

    users = users.filter(u => u.id !== id);

    if (users.length === initialLength) {
        return res.status(404).json({
            success: false,
            msg: "User not found"
        });
    }

    res.json({
        success: true,
        msg: "User deleted successfully"
    });
});

// ============= ADDITIONAL ROUTES (ASSIGNMENTS) =============

// GET - Search users by name (query parameter)
app.get("/users/search/by-name", (req, res) => {
    const name = req.query.name;

    if (!name) {
        return res.status(400).json({
            success: false,
            msg: "Please provide a name to search"
        });
    }

    const searchResults = users.filter(u =>
        u.name.toLowerCase().includes(name.toLowerCase())
    );

    if (searchResults.length === 0) {
        return res.status(404).json({
            success: false,
            msg: `No users found with name containing "${name}"`
        });
    }

    res.json({
        success: true,
        count: searchResults.length,
        data: searchResults
    });
});

// GET - Get all adult users (age >= 18)
app.get("/users/filter/adults", (req, res) => {
    const adults = users.filter(u => u.age && u.age >= 18);

    res.json({
        success: true,
        count: adults.length,
        data: adults
    });
});

// GET - Get only emails of all users
app.get("/users/extract/emails", (req, res) => {
    const emails = users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email
    }));

    res.json({
        success: true,
        count: emails.length,
        data: emails
    });
});

// ============= ERROR HANDLING =============

// 404 - Route not found
app.use((req, res) => {
    res.status(404).json({
        success: false,
        msg: "Route not found",
        path: req.path
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✓ API running at http://localhost:${PORT}`);
    console.log(`✓ Available routes:`);
    console.log(`  GET    /users`);
    console.log(`  GET    /users/:id`);
    console.log(`  POST   /users`);
    console.log(`  PUT    /users/:id`);
    console.log(`  DELETE /users/:id`);
    console.log(`  GET    /users/search/by-name?name=<name>`);
    console.log(`  GET    /users/filter/adults`);
    console.log(`  GET    /users/extract/emails`);
});
