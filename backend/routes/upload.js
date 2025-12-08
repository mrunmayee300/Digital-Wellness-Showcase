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

// Image filter for thumbnails (only images)
const imageFilter = (req, file, cb) => {
  const allowedImageTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'
  ];

  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Thumbnail must be an image file (JPEG, PNG, GIF, WebP)'), false);
  }
};

// Configure multer middleware for main file
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 300 * 1024 * 1024 // 300MB limit
  }
});

// Configure multer middleware for thumbnail images (smaller size limit)
const uploadThumbnail = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for thumbnails
  }
});

// Combined upload middleware for both file and thumbnail
const uploadFields = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Use image filter for thumbnail, file filter for main file
    if (file.fieldname === 'thumbnail') {
      imageFilter(req, file, cb);
    } else {
      fileFilter(req, file, cb);
    }
  },
  limits: {
    fileSize: 300 * 1024 * 1024 // 300MB limit (applies to main file)
  }
}).fields([
  { name: 'file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

// Email validation for IIITN format
const validateIIITNEmail = (email) => {
  const pattern = /^bt2\d{7}@iiitn\.ac\.in$/i;
  return pattern.test(email);
};

// Custom middleware to handle optional file upload based on content-type
const optionalFileUpload = (req, res, next) => {
  // If content-type is application/json, skip multer (URL-based upload)
  if (req.headers['content-type']?.includes('application/json')) {
    return next();
  }

  // For multipart/form-data, use multer (file upload with optional thumbnail)
  uploadFields(req, res, (err) => {
    // Ignore multer errors if no file/thumbnail is provided; validation will catch missing file later
    if (err && err.code !== 'LIMIT_UNEXPECTED_FILE') {
      return next(err);
    }
    next();
  });
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
  body('category').isIn(['Comic', 'Website', 'Magazine', 'Skit', 'Video', 'Other']).withMessage('Valid category is required'),
  body('url').optional().isURL().withMessage('Valid URL is required for Website/Video categories')
];

/**
 * POST /api/upload
 * Upload student work to cloud storage and save metadata to MongoDB
 * Supports both file uploads and URL submissions (for Website/Video)
 * Also handles thumbnail/landing page image uploads for Website and Video categories
 */
router.post('/', optionalFileUpload, validateFields, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const category = req.body.category;
    const isUrlCategory = category === 'Website' || category === 'Video';
    let fileUrl = '';
    let fileType = 'other';
    let thumbnailUrl = null;

    // Handle thumbnail image upload (for Website and Video categories)
    if (isUrlCategory && req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      const thumbnailFile = req.files.thumbnail[0];
      
      // Check thumbnail file size (10MB limit)
      if (thumbnailFile.size > 10 * 1024 * 1024) {
        return res.status(400).json({ error: 'Thumbnail image size exceeds 10MB limit' });
      }

      // Upload thumbnail to Cloudinary
      console.log(`Uploading thumbnail image: ${thumbnailFile.originalname}...`);
      const thumbnailResult = await uploadToCloudinary(
        thumbnailFile.buffer,
        'image',
        'student-works/thumbnails'
      );

      thumbnailUrl = thumbnailResult.url;
      console.log(`✅ Thumbnail uploaded: ${thumbnailUrl}`);
    }

    // Handle URL-based submissions (Website/Video)
    if (isUrlCategory) {
      if (!req.body.url || !req.body.url.trim()) {
        return res.status(400).json({ error: `${category} URL is required` });
      }
      
      fileUrl = req.body.url.trim();
      fileType = category === 'Website' ? 'website' : 'video';
      
      console.log(`Saving ${category} URL: ${fileUrl}`);
    } else {
      // Handle file uploads for other categories
      const mainFile = req.files && req.files.file ? req.files.file[0] : null;
      
      if (!mainFile) {
        return res.status(400).json({ error: 'File is required' });
      }

      // Check file size (double check, even though multer should handle it)
      if (mainFile.size > 300 * 1024 * 1024) {
        return res.status(400).json({ error: 'File size exceeds 300MB limit' });
      }

      // Determine resource type for Cloudinary
      const resourceType = getResourceType(mainFile.mimetype);

      // Upload file directly to Cloudinary from buffer (no local storage)
      console.log(`Uploading ${mainFile.originalname} to Cloudinary...`);
      const cloudinaryResult = await uploadToCloudinary(
        mainFile.buffer,
        resourceType,
        'student-works'
      );

      fileUrl = cloudinaryResult.url;

      // Determine file type for our database
      if (mainFile.mimetype.startsWith('image/')) {
        fileType = 'image';
      } else if (mainFile.mimetype.startsWith('video/')) {
        fileType = 'video';
      } else if (mainFile.mimetype === 'application/pdf') {
        fileType = 'pdf';
      } else if (mainFile.mimetype.includes('zip')) {
        fileType = 'zip';
      }
    }

    // Save work metadata to MongoDB Atlas
    const workData = {
      name: req.body.name.trim(),
      roll: req.body.roll.trim(),
      email: req.body.email.trim().toLowerCase(),
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      category: category,
      fileUrl: fileUrl,
      fileType: fileType,
      timestamp: new Date()
    };

    // Add thumbnail URL if available
    if (thumbnailUrl) {
      workData.thumbnailUrl = thumbnailUrl;
    }

    const work = new Work(workData);
    const savedWork = await work.save();

    console.log(`✅ Work uploaded successfully: ${savedWork._id}`);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Work uploaded successfully',
      work: savedWork,
      cloudUrl: fileUrl,
      thumbnailUrl: thumbnailUrl
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
