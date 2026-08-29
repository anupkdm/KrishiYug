import app from "../backend/server.js";
import { connectDB } from "../backend/config/db.js";

let isDbConnected = false;

export default async function handler(req, res) {
  if (!isDbConnected) {
    try {
      await connectDB();
      isDbConnected = true;
    } catch (e) {
      console.warn("DB connection warning in serverless handler:", e.message);
    }
  }
  return app(req, res);
}
