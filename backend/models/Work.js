const mongoose = require("mongoose");

const workSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  description: {
    type: String,
    default: "",
  },
  imageUrl: {
    type: String,
    required: [true, "Image URL is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Work", workSchema);
