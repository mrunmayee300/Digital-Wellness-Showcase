const express = require("express");
const router = express.Router();
const multer = require("multer");
const Work = require("../models/Work");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ errors: ["File is required"] });

    const { title, category, description } = req.body;

    if (!title || !category) {
      return res.status(400).json({ errors: ["Title and category required"] });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "digital-wellness" },
      async (err, result) => {
        if (err) return res.status(500).json({ errors: ["Upload failed"] });

        const work = await Work.create({
          title,
          category,
          description,
          imageUrl: result.secure_url
        });

        return res.status(201).json(work);
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: ["Server error"] });
  }
});

module.exports = router;
