import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { buildDefaultContent } from '../src/content/defaultContent.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const AUTH_FILE = path.join(DATA_DIR, 'auth.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function readContent() {
  ensureDir();
  const defaults = buildDefaultContent();
  if (!fs.existsSync(CONTENT_FILE)) {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(defaults, null, 2));
    return defaults;
  }
  const stored = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
  // Fill in newly added schema sections (e.g. testimonials) without wiping edits
  let changed = false;
  for (const key of Object.keys(defaults)) {
    if (stored[key] === undefined) {
      stored[key] = defaults[key];
      changed = true;
    }
  }
  if (changed) {
    stored.updatedAt = new Date().toISOString();
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(stored, null, 2));
  }
  return stored;
}

export function writeContent(content) {
  ensureDir();
  const next = { ...content, updatedAt: new Date().toISOString() };
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(next, null, 2));
  return next;
}

export function resetContent() {
  ensureDir();
  const defaults = buildDefaultContent();
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(defaults, null, 2));
  return defaults;
}

export function readAuth() {
  ensureDir();
  if (!fs.existsSync(AUTH_FILE)) {
    const password = process.env.ADMIN_PASSWORD || 'FedericoAdmin2026!';
    const username = process.env.ADMIN_USERNAME || 'admin';
    const hash = bcrypt.hashSync(password, 10);
    const auth = { username, passwordHash: hash, createdAt: new Date().toISOString() };
    fs.writeFileSync(AUTH_FILE, JSON.stringify(auth, null, 2));
    console.log(`Admin seeded → username: ${username}`);
    return auth;
  }
  return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
}

export function writeAuth(auth) {
  ensureDir();
  fs.writeFileSync(AUTH_FILE, JSON.stringify(auth, null, 2));
  return auth;
}
