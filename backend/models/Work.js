const mongoose = require('mongoose');

/**
 * Work Schema for MongoDB Atlas
 * Stores student submissions with all required fields
 */
const workSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  roll: {
    type: String,
    required: [true, 'Roll number is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Comic', 'Website', 'Magazine', 'Skit', 'Other'],
    trim: true
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  fileType: {
    type: String,
    required: [true, 'File type is required']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for faster queries
workSchema.index({ timestamp: -1 });
workSchema.index({ category: 1 });
workSchema.index({ name: 1, title: 1 }); // For search functionality

const Work = mongoose.model('Work', workSchema);

module.exports = Work;
