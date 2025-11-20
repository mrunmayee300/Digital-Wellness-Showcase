const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Work = require('../models/Work');
const { uploadToCloudinary, getResourceType } = require('../config/cloudinary');

const router = express.Router();

// Configure multer to store files in memory (not on disk)
// This allows direct streaming to Cloudinary
const storage = multer.memoryStorage();

// File filter to accept specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/quicktime', 'video/x-msvideo',
    'application/pdf',
    'application/zip', 'application/x-zip-compressed'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: images, videos, PDFs, ZIP files'), false);
  }
};

// Configure multer middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 300 * 1024 * 1024 // 300MB limit
  }
});

// Validation rules for form fields
const validateFields = [
  body('name').trim().notEmpty().withMessage('Student name is required'),
  body('roll').trim().notEmpty().withMessage('Roll number is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['Comic', 'Website', 'Magazine', 'Skit', 'Other']).withMessage('Valid category is required')
];

/**
 * POST /api/upload
 * Upload student work to cloud storage and save metadata to MongoDB
 */
router.post('/', upload.single('file'), validateFields, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    // Check file size (double check, even though multer should handle it)
    if (req.file.size > 300 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 300MB limit' });
    }

    // Determine resource type for Cloudinary
    const resourceType = getResourceType(req.file.mimetype);

    // Upload file directly to Cloudinary from buffer (no local storage)
    console.log(`Uploading ${req.file.originalname} to Cloudinary...`);
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      resourceType,
      'student-works'
    );

    // Determine file type for our database
    let fileType = 'other';
    if (req.file.mimetype.startsWith('image/')) {
      fileType = 'image';
    } else if (req.file.mimetype.startsWith('video/')) {
      fileType = 'video';
    } else if (req.file.mimetype === 'application/pdf') {
      fileType = 'pdf';
    } else if (req.file.mimetype.includes('zip')) {
      fileType = 'zip';
    }

    // Save work metadata to MongoDB Atlas
    const work = new Work({
      name: req.body.name.trim(),
      roll: req.body.roll.trim(),
      email: req.body.email.trim().toLowerCase(),
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      category: req.body.category,
      fileUrl: cloudinaryResult.url,
      fileType: fileType,
      timestamp: new Date()
    });

    const savedWork = await work.save();

    console.log(`✅ Work uploaded successfully: ${savedWork._id}`);

    // Return success response with cloud URL
    res.status(201).json({
      success: true,
      message: 'Work uploaded successfully',
      work: savedWork,
      cloudUrl: cloudinaryResult.url
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: error.message
    });
  }
});

module.exports = router;
