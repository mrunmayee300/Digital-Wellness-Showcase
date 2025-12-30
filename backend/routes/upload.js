const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Work = require("../models/Work");

// Configure multer storage (in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload route (multipart/form-data)
router.post("/", upload.single("file"), async (req, res) => {
  try {
    // Validation
    if (!req.file) {
      return res.status(400).json({ errors: ["File is required"] });
    }

    const { title, category, description } = req.body;
    if (!title || !category) {
      return res.status(400).json({ errors: ["Title and category are required"] });
    }

    // Upload to Cloudinary
    const cloudinary = require("cloudinary").v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const uploadResult = await cloudinary.uploader.upload_stream(
      { folder: "digital-wellness" },
      (error, result) => {
        if (error) return res.status(500).json({ errors: ["Cloudinary upload failed", error] });

        // Save work to DB
        const workData = {
          title,
          category,
          description,
          imageUrl: result.secure_url,
          createdAt: new Date(),
        };

        Work.create(workData)
          .then((doc) => res.status(201).json(doc))
          .catch((err) => res.status(500).json({ errors: ["Database save failed", err] }));
      }
    );

    // Pipe the buffer into uploader
    uploadResult.end(req.file.buffer);

  } catch (err) {
    console.error("Upload route error:", err);
    return res.status(500).json({ errors: ["Unexpected server error", err.message] });
  }
});

module.exports = router;
