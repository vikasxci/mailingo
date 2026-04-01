const mongoose = require('mongoose');

const mailContentSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      default: 'Application for Software Engineer Role — Vikas Parmar | 2.3 Years Experience',
    },
    header: {
      name: { type: String, default: 'Vikas Parmar' },
      role: { type: String, default: 'Software Engineer — 2.3 Years Experience' },
      email: { type: String, default: 'iamvikas.j30n@gmail.com' },
      phone: { type: String, default: '+91-9424516638' },
    },
    body: {
      greeting: { type: String, default: 'Dear Hiring Manager,' },
      intro: {
        type: String,
        default:
          "I'm Vikas Parmar, a Software Engineer with 2.3 years of hands-on experience building scalable backend systems. I'm writing to express my strong interest in a Software Engineer role at your organization.",
      },
      current: {
        type: String,
        default:
          "I currently work at Supy (Dubai, Remote) on the core platform team, building multi-tenant inventory features in NestJS + MongoDB serving 50+ retail locations. I've independently owned and shipped production systems including transaction management, bulk data pipelines, and branch-cloning workflows.",
      },
    },
    skills: {
      primary: {
        type: [String],
        default: ['TypeScript', 'JavaScript', 'Java', 'Node.js', 'NestJS', 'React.js'],
      },
      secondary: {
        type: [String],
        default: ['MongoDB', 'MySQL', 'Redis', 'NATS', 'WebSockets', 'REST APIs'],
      },
    },
    highlights: {
      type: [String],
      default: [
        '▸ Built global TransactionManager with exponential backoff — adopted across 20+ modules',
        '▸ Shipped bulk recipe upload pipeline — reduced onboarding time by 60%',
        '▸ MCA from NIT Raipur | 400+ DSA problems solved',
      ],
    },
    cta: {
      type: String,
      default:
        "My detailed resume is attached. I'd welcome the opportunity to discuss how I can contribute to your team.",
    },
    footer: {
      name: { type: String, default: 'Vikas Parmar' },
      role: { type: String, default: "Software Engineer | NIT Raipur '24" },
      email: { type: String, default: 'iamvikas.j30n@gmail.com' },
      phone: { type: String, default: '+91-9424516638' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MailContent', mailContentSchema);
