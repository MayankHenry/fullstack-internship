const express = require("express");
const auth = require("../middleware/auth");
const Task = require("../models/Task");

const router = express.Router();

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const { status, category, search } = req.query;
    const query = { user: req.user.id };

    if (status === "completed") query.completed = true;
    if (status === "active") query.completed = false;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const tasks = await Task.find(query).sort({ completed: 1, dueDate: 1, createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch tasks" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, category, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = await Task.create({
      title,
      description,
      category,
      dueDate: dueDate || null,
      user: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Could not create task" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, description, category, dueDate, completed } = req.body;
    const updates = { title, description, category, dueDate: dueDate || null, completed };

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Could not update task" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete task" });
  }
});

module.exports = router;
