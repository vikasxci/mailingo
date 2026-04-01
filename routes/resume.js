const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const ResumeConfig = require('../models/ResumeConfig');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'), false);
  },
});

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'mailingo',
        public_id: 'resume',
        overwrite: true,
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

// POST /api/resume/upload
router.post('/upload', (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
}, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    const result = await uploadToCloudinary(req.file.buffer);

    // Keep only the latest resume record
    await ResumeConfig.deleteMany({});
    const config = await ResumeConfig.create({
      url: result.secure_url,
      filename: req.file.originalname,
      publicId: result.public_id,
    });

    return res.json({ success: true, message: 'Resume uploaded successfully', data: config });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/resume/current
router.get('/current', async (req, res) => {
  try {
    const config = await ResumeConfig.findOne().sort({ uploadedAt: -1 }).lean();
    return res.json({ success: true, data: config || null });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
