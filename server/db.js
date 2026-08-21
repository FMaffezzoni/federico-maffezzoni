import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';

let client = null;
let db = null;
let uploadsBucket = null;

export function mongoConfigured() {
  return Boolean(process.env.MONGODB_URI && String(process.env.MONGODB_URI).trim());
}

export async function connectMongo() {
  if (!mongoConfigured()) {
    console.warn('[db] MONGODB_URI not set — using local filesystem (ephemeral on Render Free)');
    return null;
  }
  if (db) return db;

  const uri = process.env.MONGODB_URI.trim();
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(process.env.MONGODB_DB || 'federico_cms');
  uploadsBucket = new GridFSBucket(db, { bucketName: 'uploads' });
  console.log(`[db] Connected to MongoDB database "${db.databaseName}"`);
  return db;
}

export function getDb() {
  if (!db) throw new Error('MongoDB is not connected. Set MONGODB_URI and restart the server.');
  return db;
}

export function getUploadsBucket() {
  if (!uploadsBucket) throw new Error('MongoDB uploads bucket is not ready.');
  return uploadsBucket;
}

export function isMongoReady() {
  return Boolean(db);
}

export async function closeMongo() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    uploadsBucket = null;
  }
}

export { ObjectId };
