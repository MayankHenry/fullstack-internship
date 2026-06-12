const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/authdb";
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✓ MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

const sendError = (res, error) => {
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({ success: false, errors: messages });
  }

  if (error.code === 11000) {
    return res.status(400).json({ success: false, errors: ["Email already exists"] });
  }

  return res.status(500).json({ success: false, errors: ["Internal server error"] });
};

const auth = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null;

  if (!token) {
    return res.status(401).json({ success: false, errors: ["No token, access denied"] });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ success: false, errors: ["Invalid token"] });
  }
};

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, errors: ["Name, email, and password are required"] });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ success: true, message: "User created successfully" });
  } catch (error) {
    sendError(res, error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, errors: ["Email and password are required"] });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, errors: ["User not found"] });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, errors: ["Invalid credentials"] });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ success: true, token });
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, errors: ["User not found"] });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/admin", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, errors: ["Access denied: admin only"] });
    }

    res.json({ success: true, message: "Welcome, admin user" });
  } catch (error) {
    sendError(res, error);
  }
});

app.use((req, res) => {
  res.status(404).json({ success: false, errors: ["Route not found"] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Auth API running at http://localhost:${PORT}`);
  console.log("✓ Routes: POST /signup, POST /login, GET /profile, GET /admin");
});
