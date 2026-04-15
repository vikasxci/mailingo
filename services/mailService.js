const nodemailer = require('nodemailer');
const { getEmailHTML, getEmailSubject } = require('../templates/emailTemplate');

const DEFAULT_CONTENT = {
  subject: 'Application for Software Engineer Role — Vikas Parmar | 2.3 Years Experience',
  header: { name: 'Vikas Parmar', role: 'Software Engineer — 2.3 Years Experience', email: 'iamvikas.j30n@gmail.com', phone: '+91-9424516638' },
  body: {
    greeting: 'Dear Hiring Manager,',
    intro: "I'm Vikas Parmar, a Software Engineer with 2.3 years of hands-on experience building scalable backend systems. I'm writing to express my strong interest in a Software Engineer role at your organization.",
    current: "I currently work at Supy (Dubai, Remote) on the core platform team, building multi-tenant inventory features in NestJS + MongoDB serving 50+ retail locations.",
  },
  skills: {
    primary: ['TypeScript', 'JavaScript', 'Java', 'Node.js', 'NestJS', 'React.js'],
    secondary: ['MongoDB', 'MySQL', 'Redis', 'NATS', 'WebSockets', 'REST APIs'],
  },
  highlights: [
    '▸ Built global TransactionManager with exponential backoff — adopted across 20+ modules',
    '▸ Shipped bulk recipe upload pipeline — reduced onboarding time by 60%',
    '▸ MCA from NIT Raipur | 400+ DSA problems solved',
  ],
  cta: "My detailed resume is attached. I'd welcome the opportunity to discuss how I can contribute to your team.",
  footer: { name: 'Vikas Parmar', role: "Software Engineer | NIT Raipur '24", email: 'iamvikas.j30n@gmail.com', phone: '+91-9424516638' },
};

const sendResumeMail = async (recipientEmail) => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    throw new Error('MAIL_USER and MAIL_PASS environment variables are not set');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // STARTTLS — required on most cloud platforms (port 465 is blocked)
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
    pool: {
      maxConnections: 1,
      maxMessages: Infinity,
      rateDelta: 1000,
      rateLimit: 5,
    },
    tls: {
      rejectUnauthorized: false,
    },
    logger: true,
    debug: true,
  });

  // Fetch dynamic content from DB, deep-merge with defaults so empty fields fall back
  const MailContent = require('../models/MailContent');
  let content = DEFAULT_CONTENT;
  try {
    const dbContent = await MailContent.findOne().sort({ createdAt: -1 }).lean();
    if (dbContent) {
      content = {
        subject:    dbContent.subject?.trim()                  || DEFAULT_CONTENT.subject,
        header: {
          name:  dbContent.header?.name?.trim()                || DEFAULT_CONTENT.header.name,
          role:  dbContent.header?.role?.trim()                || DEFAULT_CONTENT.header.role,
          email: dbContent.header?.email?.trim()               || DEFAULT_CONTENT.header.email,
          phone: dbContent.header?.phone?.trim()               || DEFAULT_CONTENT.header.phone,
        },
        body: {
          greeting: dbContent.body?.greeting?.trim()           || DEFAULT_CONTENT.body.greeting,
          intro:    dbContent.body?.intro?.trim()              || DEFAULT_CONTENT.body.intro,
          current:  dbContent.body?.current?.trim()            || DEFAULT_CONTENT.body.current,
        },
        skills: {
          primary:   (dbContent.skills?.primary?.length   ? dbContent.skills.primary   : DEFAULT_CONTENT.skills.primary),
          secondary: (dbContent.skills?.secondary?.length ? dbContent.skills.secondary : DEFAULT_CONTENT.skills.secondary),
        },
        highlights: (dbContent.highlights?.length ? dbContent.highlights : DEFAULT_CONTENT.highlights),
        cta:    dbContent.cta?.trim()                          || DEFAULT_CONTENT.cta,
        footer: {
          name:  dbContent.footer?.name?.trim()                || DEFAULT_CONTENT.footer.name,
          role:  dbContent.footer?.role?.trim()                || DEFAULT_CONTENT.footer.role,
          email: dbContent.footer?.email?.trim()               || DEFAULT_CONTENT.footer.email,
          phone: dbContent.footer?.phone?.trim()               || DEFAULT_CONTENT.footer.phone,
        },
      };
    }
  } catch { /* use default */ }

  // Fetch latest resume URL from DB
  const ResumeConfig = require('../models/ResumeConfig');
  let resumeUrl = null;
  try {
    const config = await ResumeConfig.findOne().sort({ uploadedAt: -1 }).lean();
    if (config) resumeUrl = config.url;
  } catch { /* no attachment */ }

  const subject = getEmailSubject(content);

  const mailOptions = {
    from: `"${process.env.SENDER_NAME || content.header.name || 'Vikas Parmar'}" <${process.env.MAIL_USER}>`,
    to: recipientEmail,
    subject,
    html: getEmailHTML(content),
    attachments: resumeUrl
      ? [{ filename: 'Vikas_Parmar_Resume.pdf', url: resumeUrl, contentType: 'application/pdf' }]
      : [],
  };

  if (!resumeUrl) console.warn('No resume URL in DB — sending without attachment');

  const info = await transporter.sendMail(mailOptions);
  return { info, subject };
};

module.exports = { sendResumeMail };
