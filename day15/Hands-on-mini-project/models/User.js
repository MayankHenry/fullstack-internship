const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email"]
  },
  age: {
    type: Number,
    min: [1, "Age must be at least 1"],
    max: [100, "Age cannot be greater than 100"]
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
