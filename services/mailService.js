const nodemailer = require('nodemailer');
const path = require('path');
const { getEmailHTML, getEmailSubject } = require('../templates/emailTemplate');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendResumeMail = async (recipientEmail) => {
  const resumePath = path.join(__dirname, '..', 'resume', 'Vikas_Parmar_Resume.pdf');

  const mailOptions = {
    from: `"${process.env.SENDER_NAME}" <${process.env.MAIL_USER}>`,
    to: recipientEmail,
    subject: getEmailSubject(),
    html: getEmailHTML(),
    attachments: [
      {
        filename: 'Vikas_Parmar_Resume.pdf',
        path: resumePath,
        contentType: 'application/pdf',
      },
    ],
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = { sendResumeMail };
