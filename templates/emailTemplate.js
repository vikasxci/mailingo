function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const getEmailHTML = (content = {}) => {
  const h = content.header || {};
  const b = content.body || {};
  const skills = content.skills || {};
  const highlights = Array.isArray(content.highlights) ? content.highlights : [];
  const cta = content.cta || "My detailed resume is attached. I'd welcome the opportunity to discuss how I can contribute to your team.";
  const f = content.footer || {};

  const name    = escapeHtml(h.name  || 'Vikas Parmar');
  const role    = escapeHtml(h.role  || 'Software Engineer — 2.3 Years Experience');
  const email   = escapeHtml(h.email || 'iamvikas.j30n@gmail.com');
  const phone   = escapeHtml(h.phone || '+91-9424516638');
  const greeting = escapeHtml(b.greeting || 'Dear Hiring Manager,');
  const intro    = escapeHtml(b.intro   || '');
  const current  = escapeHtml(b.current || '');
  const footerName  = escapeHtml(f.name  || name);
  const footerRole  = escapeHtml(f.role  || '');
  const footerEmail = escapeHtml(f.email || email);
  const footerPhone = escapeHtml(f.phone || phone);

  const primaryBadges = (skills.primary || []).map(s =>
    `<span style="display:inline-block;background:#0ea5e9;color:#fff;font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;margin:3px 2px;">${escapeHtml(s)}</span>`
  ).join('');

  const secondaryBadges = (skills.secondary || []).map(s =>
    `<span style="display:inline-block;background:#1e3a5f;color:#fff;font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;margin:3px 2px;">${escapeHtml(s)}</span>`
  ).join('');

  const highlightRows = highlights.map(hl =>
    `<tr><td style="padding:6px 0;font-size:14px;color:#475569;line-height:1.5;">${escapeHtml(hl)}</td></tr>`
  ).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Job Application — Vikas Parmar</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0ea5e9 100%);padding:40px 40px 30px;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">${name}</h1>
              <p style="margin:8px 0 0;font-size:14px;color:#93c5fd;letter-spacing:1px;text-transform:uppercase;">${role}</p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px auto 0;" align="center">
                <tr>
                  <td style="padding:0 12px;">
                    <a href="mailto:${email}" style="color:#93c5fd;font-size:13px;text-decoration:none;">✉ ${email}</a>
                  </td>
                  <td style="border-left:1px solid rgba(255,255,255,0.3);padding:0 12px;">
                    <span style="color:#93c5fd;font-size:13px;">☎ ${phone}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 20px;">
              <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#334155;">
                ${greeting}
              </p>
              <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#334155;">
                ${intro}
              </p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#334155;">
                ${current}
              </p>
            </td>
          </tr>

          <!-- Skills Section -->
          <tr>
            <td style="padding:0 40px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:20px 24px 8px;">
                    <h3 style="margin:0;font-size:14px;text-transform:uppercase;letter-spacing:1.5px;color:#0ea5e9;font-weight:700;">Core Skills</h3>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 24px 20px;">
                    <div style="padding:4px 0;">${primaryBadges}${secondaryBadges}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Highlights -->
          <tr>
            <td style="padding:0 40px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:20px 24px 8px;">
                    <h3 style="margin:0;font-size:14px;text-transform:uppercase;letter-spacing:1.5px;color:#0ea5e9;font-weight:700;">Key Highlights</h3>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 24px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      ${highlightRows}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#334155;">
                ${escapeHtml(cta)}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a;">${footerName}</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#64748b;">${footerRole}</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#64748b;">
                      <a href="mailto:${footerEmail}" style="color:#0ea5e9;text-decoration:none;">${footerEmail}</a>
                      &nbsp;•&nbsp; ${footerPhone}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const getEmailSubject = (content = {}) => {
  return content.subject || 'Application for Software Engineer Role — Vikas Parmar | 2.3 Years Experience';
};

module.exports = { getEmailHTML, getEmailSubject };
