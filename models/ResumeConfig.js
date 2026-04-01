const mongoose = require('mongoose');

const resumeConfigSchema = new mongoose.Schema({
  url: { type: String, required: true },
  filename: { type: String, required: true },
  publicId: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ResumeConfig', resumeConfigSchema);
