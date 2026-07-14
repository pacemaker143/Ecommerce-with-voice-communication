const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamfier = require('streamifier');

require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

// @route   POST /api/upload
// @desc    Upload an image to Cloudinary
// @access  Public (you can change this to private if needed)

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
        });
        //use streamifier to convert file buffer to stream and pipe it to cloudinary
        streamfier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    //call the streamUpload function 
    const result = await streamUpload(req.file.buffer);

    //respond with the uploaded image URL
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('POST /api/upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;