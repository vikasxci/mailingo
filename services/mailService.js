const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const { getEmailHTML, getEmailSubject } = require('../templates/emailTemplate');

const sendResumeMail = async (recipientEmail) => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    throw new Error('MAIL_USER and MAIL_PASS environment variables are not set');
  }

  // Create transporter lazily so env vars are always available
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const resumePath = path.join(__dirname, '..', 'resume', 'Vikas_Parmar_Resume.pdf');
  const resumeExists = fs.existsSync(resumePath);

  const mailOptions = {
    from: `"${process.env.SENDER_NAME || 'Vikas Parmar'}" <${process.env.MAIL_USER}>`,
    to: recipientEmail,
    subject: getEmailSubject(),
    html: getEmailHTML(),
    attachments: resumeExists
      ? [{ filename: 'Vikas_Parmar_Resume.pdf', path: resumePath, contentType: 'application/pdf' }]
      : [],
  };

  if (!resumeExists) {
    console.warn('Resume PDF not found at:', resumePath, '— sending mail without attachment');
  }

  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = { sendResumeMail };
