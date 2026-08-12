import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { readContent, writeContent, resetContent, readAuth, writeAuth, reseedAuthFromEnvIfRequested } from './store.js';
import {
  buildResetUrl,
  createResetToken,
  matchesResetToken,
  sendPasswordResetEmail,
  smtpConfigured
} from './mail.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const PORT = process.env.PORT || 5055;
const JWT_SECRET = process.env.JWT_SECRET || 'federico-cms-dev-secret-change-me';
const UPLOAD_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype) || file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only images or PDF allowed'));
  }
});

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'federico-cms' });
});

app.get('/api/content', (_req, res) => {
  try {
    res.json(readContent());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  const authData = readAuth();
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
  if (username !== authData.username || !bcrypt.compareSync(password, authData.passwordHash)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '12h' });
  res.json({ token, username });
});

app.get('/api/admin/me', auth, (req, res) => {
  res.json({ username: req.user.username });
});

app.put('/api/admin/content', auth, (req, res) => {
  try {
    const saved = writeContent(req.body);
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/api/admin/content/reset', auth, (_req, res) => {
  try {
    res.json(resetContent());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/admin/password', auth, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters' });
  }
  const authData = readAuth();
  if (!bcrypt.compareSync(currentPassword, authData.passwordHash)) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }
  authData.passwordHash = bcrypt.hashSync(newPassword, 10);
  authData.updatedAt = new Date().toISOString();
  delete authData.passwordResetTokenHash;
  delete authData.passwordResetExpires;
  writeAuth(authData);
  res.json({ ok: true });
});

const GENERIC_FORGOT_MSG =
  'If that email matches an admin account, a reset link will be sent (or logged on the server).';

app.post('/api/admin/forgot-password', async (req, res) => {
  try {
    const email = String(req.body?.email || '')
      .trim()
      .toLowerCase();
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'A valid email is required' });
    }

    const authData = readAuth();
    const content = readContent();
    const allowedEmails = [
      process.env.ADMIN_EMAIL,
      content?.profile?.email
    ]
      .filter(Boolean)
      .map((e) => String(e).trim().toLowerCase());

    const emailOk = allowedEmails.includes(email);
    if (!emailOk) {
      // Same response timing / message — do not reveal whether email exists
      return res.json({ ok: true, message: GENERIC_FORGOT_MSG });
    }

    const { token, tokenHash, expiresAt } = createResetToken();
    authData.passwordResetTokenHash = tokenHash;
    authData.passwordResetExpires = expiresAt;
    authData.updatedAt = new Date().toISOString();
    writeAuth(authData);

    const resetUrl = buildResetUrl(token);
    console.log(`[password-reset] link for ${email} (expires ${expiresAt}): ${resetUrl}`);

    let emailed = false;
    if (smtpConfigured()) {
      await sendPasswordResetEmail({ to: email, resetUrl });
      emailed = true;
    }

    const payload = {
      ok: true,
      message: emailed
        ? 'If that email matches an admin account, a reset link has been sent.'
        : GENERIC_FORGOT_MSG,
      emailed
    };

    // Optional helper when SMTP is not set yet (enable temporarily on Render)
    if (process.env.RETURN_RESET_LINK === 'true' || process.env.RETURN_RESET_LINK === '1') {
      payload.resetUrl = resetUrl;
    }

    res.json(payload);
  } catch (err) {
    console.error('[password-reset]', err);
    res.status(500).json({ message: err.message || 'Could not start password reset' });
  }
});

app.post('/api/admin/reset-password', (req, res) => {
  const { token, newPassword } = req.body || {};
  if (!token || !newPassword || String(newPassword).length < 8) {
    return res.status(400).json({ message: 'Valid token and a new password (min 8 characters) are required' });
  }

  const authData = readAuth();
  if (!matchesResetToken(authData, token)) {
    return res.status(400).json({ message: 'Invalid or expired reset link. Request a new one.' });
  }

  authData.passwordHash = bcrypt.hashSync(String(newPassword), 10);
  authData.updatedAt = new Date().toISOString();
  delete authData.passwordResetTokenHash;
  delete authData.passwordResetExpires;
  writeAuth(authData);
  res.json({ ok: true, message: 'Password updated. You can sign in now.' });
});

app.post('/api/admin/upload', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ ok: true, url, filename: req.file.filename });
});

app.listen(PORT, () => {
  reseedAuthFromEnvIfRequested();
  readContent();
  console.log(`Federico CMS API running on http://localhost:${PORT}`);
});
