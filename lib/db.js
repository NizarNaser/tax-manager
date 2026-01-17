import mongoose from "mongoose";

const MONGO_URI = (process.env.MONGO_URI || "").trim();

if (!MONGO_URI) throw new Error("MONGO_URI is not defined");

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    console.log("Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log("MongoDB Connected Successfully");
      return mongoose;
    }).catch(err => {
      console.error("MongoDB Connection Error:", err);
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
