import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "neucc";

if (!uri) {
  throw new Error("MONGODB_URI is not set. Copy .env.example to .env and fill it in.");
}

// Reuse a single client across the process (important with tsx watch / serverless).
let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;

  client = new MongoClient(uri as string);
  await client.connect();
  db = client.db(dbName);

  console.log(`[db] connected to MongoDB database "${dbName}"`);
  return db;
}

export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
