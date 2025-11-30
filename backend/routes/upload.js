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

// Custom middleware to handle optional file upload based on content-type
const optionalFileUpload = (req, res, next) => {
  // If content-type is application/json, skip multer (URL-based upload)
  if (req.headers['content-type']?.includes('application/json')) {
    return next();
  }
  
  // For multipart/form-data, use multer (file upload)
  upload.single('file')(req, res, (err) => {
    // Ignore multer errors if no file is provided (will be validated in route handler)
    if (err && err.code !== 'LIMIT_UNEXPECTED_FILE') {
      return next(err);
    }
    next();
  });
};

// Email validation for IIITN format
const validateIIITNEmail = (email) => {
  const pattern = /^bt2\d{7}@iiitn\.ac\.in$/i;
  return pattern.test(email);
};

// Validation rules for form fields
const validateFields = [
  body('name').trim().notEmpty().withMessage('Student name is required'),
  body('roll').trim().notEmpty().withMessage('Roll number is required'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .custom((value) => {
      if (!validateIIITNEmail(value)) {
        throw new Error('Only IIITN students (bt2xxxxxxx@iiitn.ac.in) can upload');
      }
      return true;
    }),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['Comic', 'Website', 'Magazine', 'Skit', 'Other']).withMessage('Valid category is required')
];

/**
 * POST /api/upload
 * Upload student work to cloud storage and save metadata to MongoDB
 * Supports both file uploads and URL-based uploads (for Website/Video categories)
 */
router.post('/', optionalFileUpload, validateFields, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const isWebsiteOrVideo = req.body.category === 'Website' || req.body.category === 'Skit';
    let fileUrl = '';
    let fileType = 'other';

    if (isWebsiteOrVideo) {
      // Handle URL-based uploads
      if (!req.body.url || !req.body.url.trim()) {
        return res.status(400).json({ error: `${req.body.category} URL is required` });
      }

      // Validate URL format
      try {
        new URL(req.body.url.trim());
      } catch (e) {
        return res.status(400).json({ error: 'Invalid URL format' });
      }

      fileUrl = req.body.url.trim();
      fileType = req.body.category === 'Website' ? 'website' : 'video';
    } else {
      // Handle file uploads
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

      fileUrl = cloudinaryResult.url;

      // Determine file type for our database
      if (req.file.mimetype.startsWith('image/')) {
        fileType = 'image';
      } else if (req.file.mimetype.startsWith('video/')) {
        fileType = 'video';
      } else if (req.file.mimetype === 'application/pdf') {
        fileType = 'pdf';
      } else if (req.file.mimetype.includes('zip')) {
        fileType = 'zip';
      }
    }

    // Save work metadata to MongoDB Atlas
    const work = new Work({
      name: req.body.name.trim(),
      roll: req.body.roll.trim(),
      email: req.body.email.trim().toLowerCase(),
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      category: req.body.category,
      fileUrl: fileUrl,
      fileType: fileType,
      timestamp: new Date()
    });

    const savedWork = await work.save();

    console.log(`✅ Work uploaded successfully: ${savedWork._id}`);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Work uploaded successfully',
      work: savedWork,
      cloudUrl: fileUrl
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
