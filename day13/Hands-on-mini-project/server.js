const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/userdb";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✓ MongoDB connected"))
.catch(err => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
});

// ============= BASIC ROUTES =============

// GET - Retrieve all users
app.get("/users", async (req, res) => {
    const users = await User.find();
    res.json({
        success: true,
        count: users.length,
        data: users
    });
});

// GET - Retrieve a single user by ID
app.get("/users/:id", async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, msg: "Invalid user ID" });
    }

    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ success: false, msg: "User not found" });
    }

    res.json({ success: true, data: user });
});

// POST - Create a new user
app.post("/users", async (req, res) => {
    const { name, email, age, isActive } = req.body;

    if (!name || !email) {
        return res.status(400).json({ success: false, msg: "Name and Email are required" });
    }

    if (age !== undefined && (age < 0 || age > 150)) {
        return res.status(400).json({ success: false, msg: "Please provide a valid age" });
    }

    const newUser = new User({ name, email, age, isActive });
    await newUser.save();

    res.status(201).json({ success: true, msg: "User created successfully", data: newUser });
});

// PUT - Update a user by ID
app.put("/users/:id", async (req, res) => {
    const id = req.params.id;
    const { name, email, age, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, msg: "Invalid user ID" });
    }

    if (age !== undefined && (age < 0 || age > 150)) {
        return res.status(400).json({ success: false, msg: "Please provide a valid age" });
    }

    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ success: false, msg: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (age !== undefined) user.age = age;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.json({ success: true, msg: "User updated successfully", data: user });
});

// DELETE - Remove a user by ID
app.delete("/users/:id", async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, msg: "Invalid user ID" });
    }

    const result = await User.findByIdAndDelete(id);

    if (!result) {
        return res.status(404).json({ success: false, msg: "User not found" });
    }

    res.json({ success: true, msg: "User deleted successfully" });
});

// ============= ADDITIONAL ROUTES =============

// GET - Search users by name (query parameter)
app.get("/users/search/by-name", async (req, res) => {
    const name = req.query.name;

    if (!name) {
        return res.status(400).json({ success: false, msg: "Please provide a name to search" });
    }

    const searchResults = await User.find({
        name: { $regex: name, $options: "i" }
    });

    if (searchResults.length === 0) {
        return res.status(404).json({ success: false, msg: `No users found with name containing "${name}"` });
    }

    res.json({ success: true, count: searchResults.length, data: searchResults });
});

// GET - Get all adult users (age >= 18)
app.get("/users/filter/adults", async (req, res) => {
    const adults = await User.find({ age: { $gte: 18 } });

    res.json({ success: true, count: adults.length, data: adults });
});

// GET - Get only emails of all users
app.get("/users/extract/emails", async (req, res) => {
    const emails = await User.find({}, { name: 1, email: 1 });

    res.json({
        success: true,
        count: emails.length,
        data: emails
    });
});

// GET - Get only active users
app.get("/users/active", async (req, res) => {
    const activeUsers = await User.find({ isActive: true });

    res.json({ success: true, count: activeUsers.length, data: activeUsers });
});

// GET - Get users older than a given age
app.get("/users/age/:min", async (req, res) => {
    const minAge = parseInt(req.params.min, 10);

    if (Number.isNaN(minAge)) {
        return res.status(400).json({ success: false, msg: "Please provide a valid age" });
    }

    const users = await User.find({ age: { $gte: minAge } });

    res.json({ success: true, count: users.length, data: users });
});

// ============= ERROR HANDLING =============

app.use((req, res) => {
    res.status(404).json({ success: false, msg: "Route not found", path: req.path });
});

// Start server
const PORT = process.env.PORT || 3000;
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
    console.log(`  GET    /users/active`);
    console.log(`  GET    /users/age/:min`);
});
