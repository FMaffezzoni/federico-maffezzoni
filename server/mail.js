import crypto from 'crypto';

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function createResetToken() {
  const token = crypto.randomBytes(32).toString('hex');
  return {
    token,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
  };
}

export function matchesResetToken(authData, token) {
  if (!token || !authData?.passwordResetTokenHash || !authData?.passwordResetExpires) return false;
  if (new Date(authData.passwordResetExpires).getTime() < Date.now()) return false;
  return hashToken(token) === authData.passwordResetTokenHash;
}

export function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendPasswordResetEmail({ to, resetUrl }) {
  if (!smtpConfigured()) {
    throw new Error('Email is not configured on the server');
  }

  let nodemailer;
  try {
    nodemailer = await import('nodemailer');
  } catch {
    throw new Error(
      'nodemailer is not installed. Push updated package.json / package-lock.json and redeploy, or use RETURN_RESET_LINK=true.'
    );
  }

  const transporter = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  await transporter.sendMail({
    from,
    to,
    subject: 'Reset your Federico site admin password',
    text: [
      'You requested a password reset for the Federico Maffezzoni website admin.',
      '',
      'Open this link within 1 hour to choose a new password:',
      resetUrl,
      '',
      'If you did not request this, you can ignore this email.'
    ].join('\n'),
    html: `
      <p>You requested a password reset for the Federico Maffezzoni website admin.</p>
      <p><a href="${resetUrl}">Reset password</a></p>
      <p>This link expires in 1 hour. If you did not request this, ignore this email.</p>
    `
  });
}

export function buildResetUrl(token) {
  const site = (
    process.env.PUBLIC_SITE_URL ||
    'https://federicomaffezzoni.it'
  ).replace(/\/$/, '');
  return `${site}/admin/reset-password?token=${encodeURIComponent(token)}`;
}
