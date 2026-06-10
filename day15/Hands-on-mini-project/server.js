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

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, errors: ["Invalid user ID"] });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, errors: ["User not found"] });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    sendError(res, error);
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const user = new User({ name, email, age });
    await user.save();

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    sendError(res, error);
  }
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, errors: ["Invalid user ID"] });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, errors: ["User not found"] });
    }

    const updates = ["name", "email", "age"].reduce((acc, key) => {
      if (req.body[key] !== undefined) acc[key] = req.body[key];
      return acc;
    }, {});

    Object.assign(user, updates);
    await user.save();

    res.json({ success: true, data: user });
  } catch (error) {
    sendError(res, error);
  }
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, errors: ["Invalid user ID"] });
  }

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, errors: ["User not found"] });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/users/average-age", async (req, res) => {
  try {
    const result = await User.aggregate([
      { $match: { age: { $exists: true, $ne: null } } },
      { $group: { _id: null, averageAge: { $avg: "$age" } } }
    ]);

    res.json({ success: true, data: { averageAge: result[0]?.averageAge ?? 0 } });
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/users/age-range", async (req, res) => {
  const min = Number(req.query.min ?? 20);
  const max = Number(req.query.max ?? 30);

  if (Number.isNaN(min) || Number.isNaN(max)) {
    return res.status(400).json({ success: false, errors: ["min and max must be numbers"] });
  }

  try {
    const users = await User.find({ age: { $gte: min, $lte: max } });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/users/by-names", async (req, res) => {
  const names = (req.query.names || "").split(",").map(name => name.trim()).filter(Boolean);

  if (names.length === 0) {
    return res.status(400).json({ success: false, errors: ["Please provide at least one name"] });
  }

  try {
    const users = await User.find({ $or: names.map(name => ({ name })) });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    sendError(res, error);
  }
});

app.use((req, res) => {
  res.status(404).json({ success: false, errors: ["Route not found"] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ API running at http://localhost:${PORT}`);
  console.log(`✓ Available routes: GET /users, GET /users/:id, POST /users, PUT /users/:id, DELETE /users/:id`);
});
