const express = require("express");
const Note = require("../models/Note");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Apply auth middleware to all note routes
router.use(protect);

// @route   GET /api/notes
// @desc    Get all notes for a user (with optional search and color filter)
// @access  Private
router.get("/", async (req, res) => {
  try {
    const { search, color } = req.query;
    
    let query = { user: req.user._id };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }
    
    if (color) {
      query.color = color;
    }

    const notes = await Note.find(query).sort({ isPinned: -1, updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post("/", async (req, res) => {
  try {
    const { title, content, color, isPinned } = req.body;

    const note = await Note.create({
      user: req.user._id,
      title,
      content,
      color,
      isPinned,
    });

    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
router.put("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Make sure user owns the note
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Make sure user owns the note
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await note.deleteOne();
    
    res.json({ message: "Note removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
