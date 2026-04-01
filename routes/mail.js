const express = require('express');
const router = express.Router();
const Mail = require('../models/Mail');
const { sendResumeMail } = require('../services/mailService');

// Send mail
router.post('/send', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  try {
    const { subject } = await sendResumeMail(email.trim());

    const record = await Mail.create({
      recipientEmail: email.trim(),
      subject,
      status: 'sent',
    });

    return res.json({
      success: true,
      message: `Resume sent successfully to ${email}`,
      data: record,
    });
  } catch (error) {
    await Mail.create({
      recipientEmail: email.trim(),
      subject: 'Application for Software Engineer Role',
      status: 'failed',
      error: error.message,
    });

    console.error('Mail send error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message,
    });
  }
});

// Get all sent mails
router.get('/history', async (req, res) => {
  try {
    const mails = await Mail.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data: mails });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
