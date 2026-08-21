import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Readable } from 'stream';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectMongo, getUploadsBucket, isMongoReady, mongoConfigured } from './db.js';
import {
  initStore,
  readContent,
  writeContent,
  resetContent,
  readAuth,
  writeAuth
} from './store.js';
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

const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype) || file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only images or PDF allowed'));
  }
});

const diskUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      cb(null, `${Date.now()}-${safe}`);
    }
  }),
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

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'federico-cms',
    storage: isMongoReady() ? 'mongodb' : 'filesystem',
    mongoConfigured: mongoConfigured()
  });
});

app.get(
  '/api/content',
  asyncHandler(async (_req, res) => {
    res.json(await readContent());
  })
);

app.post(
  '/api/admin/login',
  asyncHandler(async (req, res) => {
    const { username, password } = req.body || {};
    const authData = await readAuth();
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
    if (username !== authData.username || !bcrypt.compareSync(password, authData.passwordHash)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, username });
  })
);

app.get('/api/admin/me', auth, (req, res) => {
  res.json({ username: req.user.username });
});

app.put(
  '/api/admin/content',
  auth,
  asyncHandler(async (req, res) => {
    const saved = await writeContent(req.body);
    res.json(saved);
  })
);

app.post(
  '/api/admin/content/reset',
  auth,
  asyncHandler(async (_req, res) => {
    res.json(await resetContent());
  })
);

app.post(
  '/api/admin/password',
  auth,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }
    const authData = await readAuth();
    if (!bcrypt.compareSync(currentPassword, authData.passwordHash)) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    authData.passwordHash = bcrypt.hashSync(newPassword, 10);
    authData.updatedAt = new Date().toISOString();
    delete authData.passwordResetTokenHash;
    delete authData.passwordResetExpires;
    await writeAuth(authData);
    res.json({ ok: true });
  })
);

const GENERIC_FORGOT_MSG =
  'If that email matches an admin account, a reset link will be sent (or shown below when email is not configured).';

app.post(
  '/api/admin/forgot-password',
  asyncHandler(async (req, res) => {
    const email = String(req.body?.email || '')
      .trim()
      .toLowerCase();
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'A valid email is required' });
    }

    const authData = await readAuth();
    const content = await readContent();
    const allowedEmails = [
      process.env.ADMIN_EMAIL,
      content?.profile?.email,
      'dott.federicomaffezzoni@gmail.com'
    ]
      .filter(Boolean)
      .map((e) => String(e).trim().toLowerCase());

    const emailOk = allowedEmails.includes(email);
    // Same shape for unknown emails — do not reveal whether the address is registered
    if (!emailOk) {
      return res.json({ ok: true, message: GENERIC_FORGOT_MSG, emailed: false });
    }

    const { token, tokenHash, expiresAt } = createResetToken();
    authData.passwordResetTokenHash = tokenHash;
    authData.passwordResetExpires = expiresAt;
    authData.updatedAt = new Date().toISOString();
    await writeAuth(authData);

    const resetUrl = buildResetUrl(token);
    console.log(`[password-reset] link for ${email} (expires ${expiresAt}): ${resetUrl}`);

    let emailed = false;
    let emailError = null;
    if (smtpConfigured()) {
      try {
        await sendPasswordResetEmail({ to: email, resetUrl });
        emailed = true;
      } catch (err) {
        emailError = err.message || 'Email send failed';
        console.error('[password-reset] SMTP error:', emailError);
      }
    }

    const forceShowLink =
      process.env.RETURN_RESET_LINK === 'true' || process.env.RETURN_RESET_LINK === '1';
    // Without working SMTP, return the link in the UI so reset still works on free hosts
    const showLink = forceShowLink || !emailed;

    const payload = {
      ok: true,
      emailed,
      message: emailed
        ? 'A reset link has been sent to your email. Check your inbox (and spam folder).'
        : showLink
          ? 'Email delivery is not configured. Use the reset link below (valid for 1 hour).'
          : GENERIC_FORGOT_MSG
    };

    if (showLink) payload.resetUrl = resetUrl;
    if (emailError && showLink) payload.emailError = emailError;

    res.json(payload);
  })
);

app.post(
  '/api/admin/reset-password',
  asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body || {};
    if (!token || !newPassword || String(newPassword).length < 8) {
      return res.status(400).json({
        message: 'Valid token and a new password (min 8 characters) are required'
      });
    }

    const authData = await readAuth();
    if (!matchesResetToken(authData, token)) {
      return res.status(400).json({ message: 'Invalid or expired reset link. Request a new one.' });
    }

    authData.passwordHash = bcrypt.hashSync(String(newPassword), 10);
    authData.updatedAt = new Date().toISOString();
    delete authData.passwordResetTokenHash;
    delete authData.passwordResetExpires;
    await writeAuth(authData);
    res.json({ ok: true, message: 'Password updated. You can sign in now.' });
  })
);

app.post(
  '/api/admin/upload',
  auth,
  (req, res, next) => {
    const uploader = isMongoReady() ? memoryUpload : diskUpload;
    uploader.single('file')(req, res, next);
  },
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    if (isMongoReady()) {
      const safe = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filename = `${Date.now()}-${safe}`;
      const bucket = getUploadsBucket();
      await new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(filename, {
          contentType: req.file.mimetype,
          metadata: { originalName: req.file.originalname }
        });
        Readable.from(req.file.buffer)
          .pipe(uploadStream)
          .on('error', reject)
          .on('finish', resolve);
      });
      return res.json({ ok: true, url: `/uploads/${filename}`, filename });
    }

    const url = `/uploads/${req.file.filename}`;
    res.json({ ok: true, url, filename: req.file.filename });
  })
);

/** Serve GridFS uploads when MongoDB is active. */
app.get(
  '/uploads/:filename',
  asyncHandler(async (req, res, next) => {
    if (!isMongoReady()) return next();
    const bucket = getUploadsBucket();
    const files = await bucket.find({ filename: req.params.filename }).limit(1).toArray();
    if (!files.length) return next();
    const file = files[0];
    if (file.contentType) res.set('Content-Type', file.contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    bucket.openDownloadStreamByName(req.params.filename).on('error', next).pipe(res);
  })
);

// Disk fallback (local / pre-Mongo uploads)
app.use('/uploads', express.static(UPLOAD_DIR));

app.use((err, _req, res, _next) => {
  console.error('[api]', err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

async function start() {
  try {
    await connectMongo();
    await initStore();
    app.listen(PORT, () => {
      console.log(`Federico CMS API running on http://localhost:${PORT}`);
      console.log(`Storage: ${isMongoReady() ? 'MongoDB (persistent)' : 'filesystem (ephemeral on Render Free)'}`);
    });
  } catch (err) {
    console.error('Failed to start CMS API:', err);
    process.exit(1);
  }
}

start();
