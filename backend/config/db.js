import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.log("ℹ️ [MongoDB Atlas] MONGODB_URI not found in .env. Using persistent local JSON database (backend/data/krishi_database.json).");
    console.log("👉 To connect MongoDB Atlas, add: MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/krishimitra to backend/.env");
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`=======================================================`);
    console.log(`🍃 [MongoDB Atlas] CONNECTED SUCCESSFULLY!`);
    console.log(`📦 Host: ${conn.connection.host}`);
    console.log(`🗄️ Database: ${conn.connection.name}`);
    console.log(`=======================================================`);
    return true;
  } catch (err) {
    console.error("❌ [MongoDB Atlas] Connection Error:", err.message);
    console.log("⚠️ Falling back to local persistent store so server keeps running.");
    return false;
  }
};
