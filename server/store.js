import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { buildDefaultContent } from '../src/content/defaultContent.js';
import { getDb, isMongoReady, mongoConfigured } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const AUTH_FILE = path.join(DATA_DIR, 'auth.json');

const CONTENT_ID = 'site';
const AUTH_ID = 'admin';

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function mergeMissingKeys(stored, defaults) {
  let changed = false;
  for (const key of Object.keys(defaults)) {
    if (stored[key] === undefined) {
      stored[key] = defaults[key];
      changed = true;
    }
  }
  stored.nav = stored.nav || {};
  for (const key of Object.keys(defaults.nav || {})) {
    if (stored.nav[key] === undefined) {
      stored.nav[key] = defaults.nav[key];
      changed = true;
    }
  }
  return changed;
}

function readContentFile() {
  ensureDir();
  const defaults = buildDefaultContent();
  if (!fs.existsSync(CONTENT_FILE)) {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(defaults, null, 2));
    return defaults;
  }
  const stored = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
  if (mergeMissingKeys(stored, defaults)) {
    stored.updatedAt = new Date().toISOString();
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(stored, null, 2));
  }
  return stored;
}

function writeContentFile(content) {
  ensureDir();
  const next = { ...content, updatedAt: new Date().toISOString() };
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(next, null, 2));
  return next;
}

function buildAuthFromEnv() {
  const password = process.env.ADMIN_PASSWORD || 'FedericoAdmin2026!';
  const username = process.env.ADMIN_USERNAME || 'admin';
  return {
    username,
    passwordHash: bcrypt.hashSync(password, 10),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function readAuthFile() {
  ensureDir();
  if (!fs.existsSync(AUTH_FILE)) {
    const auth = buildAuthFromEnv();
    fs.writeFileSync(AUTH_FILE, JSON.stringify(auth, null, 2));
    console.log(`Admin seeded → username: ${auth.username}`);
    return auth;
  }
  return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
}

function writeAuthFile(auth) {
  ensureDir();
  fs.writeFileSync(AUTH_FILE, JSON.stringify(auth, null, 2));
  return auth;
}

async function migrateFileToMongoIfNeeded() {
  if (!isMongoReady()) return;
  const db = getDb();
  const contentCol = db.collection('site_content');
  const authCol = db.collection('admin_auth');

  const existingContent = await contentCol.findOne({ _id: CONTENT_ID });
  if (!existingContent) {
    let seeded = null;
    if (fs.existsSync(CONTENT_FILE)) {
      try {
        seeded = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
        console.log('[db] Migrating content.json into MongoDB');
      } catch (err) {
        console.warn('[db] Could not read content.json:', err.message);
      }
    }
    if (!seeded) {
      const bootstrap = path.join(__dirname, 'bootstrap-content.json');
      if (fs.existsSync(bootstrap)) {
        try {
          seeded = JSON.parse(fs.readFileSync(bootstrap, 'utf8'));
          console.log('[db] Seeding MongoDB from bootstrap-content.json (live snapshot)');
        } catch (err) {
          console.warn('[db] Could not read bootstrap-content.json:', err.message);
        }
      }
    }
    if (seeded) {
      const { _id, ...payload } = seeded;
      await contentCol.replaceOne(
        { _id: CONTENT_ID },
        { _id: CONTENT_ID, ...payload, updatedAt: payload.updatedAt || new Date().toISOString() },
        { upsert: true }
      );
    }
  }

  const existingAuth = await authCol.findOne({ _id: AUTH_ID });
  if (!existingAuth && fs.existsSync(AUTH_FILE)) {
    try {
      const fromFile = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
      const { _id, ...payload } = fromFile;
      await authCol.replaceOne(
        { _id: AUTH_ID },
        { _id: AUTH_ID, ...payload, updatedAt: payload.updatedAt || new Date().toISOString() },
        { upsert: true }
      );
      console.log('[db] Migrated existing auth.json into MongoDB');
    } catch (err) {
      console.warn('[db] Could not migrate auth.json:', err.message);
    }
  }
}

export async function initStore() {
  if (mongoConfigured() && isMongoReady()) {
    await migrateFileToMongoIfNeeded();
  }
  await reseedAuthFromEnvIfRequested();
  await readContent();
}

export async function readContent() {
  if (isMongoReady()) {
    const db = getDb();
    const col = db.collection('site_content');
    let doc = await col.findOne({ _id: CONTENT_ID });
    const defaults = buildDefaultContent();

    if (!doc) {
      const seed = { _id: CONTENT_ID, ...defaults };
      await col.insertOne(seed);
      const { _id, ...rest } = seed;
      return rest;
    }

    const { _id, ...stored } = doc;
    if (mergeMissingKeys(stored, defaults)) {
      stored.updatedAt = new Date().toISOString();
      await col.replaceOne({ _id: CONTENT_ID }, { _id: CONTENT_ID, ...stored });
    }
    return stored;
  }

  return readContentFile();
}

export async function writeContent(content) {
  const { _id, ...payload } = content || {};
  const next = { ...payload, updatedAt: new Date().toISOString() };

  if (isMongoReady()) {
    const db = getDb();
    await db.collection('site_content').replaceOne(
      { _id: CONTENT_ID },
      { _id: CONTENT_ID, ...next },
      { upsert: true }
    );
    return next;
  }

  return writeContentFile(next);
}

export async function resetContent() {
  const defaults = buildDefaultContent();
  return writeContent(defaults);
}

export async function readAuth() {
  if (isMongoReady()) {
    const db = getDb();
    const col = db.collection('admin_auth');
    let doc = await col.findOne({ _id: AUTH_ID });
    if (!doc) {
      const auth = buildAuthFromEnv();
      await col.insertOne({ _id: AUTH_ID, ...auth });
      console.log(`Admin seeded (MongoDB) → username: ${auth.username}`);
      return auth;
    }
    const { _id, ...auth } = doc;
    return auth;
  }
  return readAuthFile();
}

export async function writeAuth(auth) {
  const next = { ...auth, updatedAt: new Date().toISOString() };
  if (isMongoReady()) {
    const db = getDb();
    await db.collection('admin_auth').replaceOne(
      { _id: AUTH_ID },
      { _id: AUTH_ID, ...next },
      { upsert: true }
    );
    return next;
  }
  return writeAuthFile(next);
}

/** One-time reset for hosts without Shell. Set RESET_ADMIN=true then redeploy. */
export async function reseedAuthFromEnvIfRequested() {
  if (process.env.RESET_ADMIN !== 'true' && process.env.RESET_ADMIN !== '1') {
    return readAuth();
  }
  const auth = buildAuthFromEnv();
  await writeAuth(auth);
  console.log(`Admin RESET from env → username: ${auth.username}`);
  console.log('Turn off RESET_ADMIN in Render after you can log in.');
  return auth;
}
