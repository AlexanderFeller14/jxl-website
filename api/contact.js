import nodemailer from 'nodemailer';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeText(input, maxLength = 3000) {
  return String(input || '')
    .replace(/\0/g, '')
    .replace(/\r/g, '')
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function parseBody(rawBody) {
  if (!rawBody) return {};
  if (typeof rawBody === 'object') return rawBody;
  if (typeof rawBody === 'string') {
    try {
      return JSON.parse(rawBody);
    } catch {
      return {};
    }
  }
  return {};
}

function buildTransportFromEnv() {
  const host = process.env.SMTP_HOST || 'mail.privateemail.com';
  const portRaw = process.env.SMTP_PORT || '465';
  const port = Number.parseInt(portRaw, 10) || 465;
  const secure = (process.env.SMTP_SECURE || 'true').toLowerCase() !== 'false';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error('missing_smtp_credentials');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const body = parseBody(req.body);
  const name = sanitizeText(body.name, 140);
  const email = sanitizeText(body.email, 180).toLowerCase();
  const budget = sanitizeText(body.budget, 120);
  const message = sanitizeText(body.message, 5000);
  const website = sanitizeText(body.website, 200);

  if (website) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'missing_required_fields' });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ ok: false, error: 'invalid_email' });
  }

  const to = process.env.CONTACT_TO_EMAIL || 'alex@jxl-visuals.com';
  const from = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER || to;
  const subject = `Neue Anfrage von ${name}`;

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Budget (CHF): ${budget || 'nicht angegeben'}`,
    '',
    message
  ].join('\n');

  const html = `
    <h2>Neue Anfrage über jxl-visuals.com</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Budget (CHF):</strong> ${escapeHtml(budget || 'nicht angegeben')}</p>
    <hr />
    <p style="white-space:pre-wrap;">${escapeHtml(message)}</p>
  `;

  try {
    const transporter = buildTransportFromEnv();
    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject,
      text,
      html
    });
    return res.status(200).json({ ok: true });
  } catch (error) {
    const code = String(error?.message || '').includes('missing_smtp_credentials')
      ? 'missing_smtp_credentials'
      : 'send_failed';
    return res.status(500).json({ ok: false, error: code });
  }
}
