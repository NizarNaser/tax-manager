import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // تحميل القيم من .env.local

const MONGO_URI = process.env.MONGO_URI;

async function testDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB!");
  } catch (err) {
    console.error("❌ MongoDB error:", err.message);
  }
}

testDB();
