import mongoose from "mongoose";

let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

export async function dbConnect() {
  const uri = process.env.MONGODB_URI;            // ⬅️ read here
  if (!uri) throw new Error("Missing MONGODB_URI"); // ⬅️ check here (runtime only)

  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { dbName: "expense_tracker" }).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
