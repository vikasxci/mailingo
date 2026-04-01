const express = require('express');
const router = express.Router();
const MailContent = require('../models/MailContent');

// GET /api/content  — returns current content (or schema defaults if nothing saved yet)
router.get('/', async (req, res) => {
  try {
    let content = await MailContent.findOne().sort({ createdAt: -1 }).lean();
    if (!content) {
      // Return a fresh doc's defaults without saving to DB
      const doc = new MailContent();
      content = doc.toObject();
    }
    return res.json({ success: true, data: content });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/content  — upsert entire content document
router.put('/', async (req, res) => {
  try {
    const content = await MailContent.findOneAndUpdate(
      {},
      req.body,
      { upsert: true, new: true, runValidators: false }
    );
    return res.json({ success: true, message: 'Content updated successfully', data: content });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
