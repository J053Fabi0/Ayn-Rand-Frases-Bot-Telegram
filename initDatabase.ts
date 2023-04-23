import { MONGO_URI } from "./env.ts";
import { MongoClient } from "./deps.ts";

// Connect to MongoDB
export const client = new MongoClient();

await client.connect(MONGO_URI);

const db = client.database();

export default db;
