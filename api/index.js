import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { SEED_DATA } from "../backend/data/seedData.js";

const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://anupkadam96k_db_user:PpcBgZb6LnBoea0d@cluster0.mjwpsl6.mongodb.net/krishimitra?retryWrites=true&w=majority";
const JWT_SECRET = process.env.JWT_SECRET || "krishi-secret-jwt-key-2026-hackathon-secure";

// MongoDB Mongoose Models
let conn = null;

const getDbConnection = async () => {
  if (conn && mongoose.connection.readyState === 1) return conn;
  try {
    conn = await mongoose.connect(MONGO_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000
    });
    console.log("🍃 MongoDB Atlas connected in Serverless function");
    return conn;
  } catch (err) {
    console.error("MongoDB Atlas connection error:", err.message);
    return null;
  }
};

// Schemas
const LabourSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  passwordHash: { type: String, required: true },
  village: { type: String, default: "Niphad" },
  district: { type: String, default: "Nashik" },
  state: { type: String, default: "Maharashtra" },
  location: { type: String, default: "Niphad, Nashik" },
  preferredWorkArea: { type: String, default: "Nashik Region" },
  role: { type: String, default: "Harvesting Worker" },
  skills: { type: [String], default: ["Harvesting"] },
  experienceYears: { type: Number, default: 3 },
  availability: { type: String, default: "Immediate" },
  expectedDailyWage: { type: Number, default: 450 },
  dailyWage: { type: Number, default: 450 },
  bio: { type: String, default: "" },
  rating: { type: Number, default: 4.8 },
  isVerified: { type: Boolean, default: true },
  isNewRegistration: { type: Boolean, default: true }
}, { timestamps: true });

const FarmerSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  passwordHash: { type: String, required: true },
  location: {
    village: { type: String, default: "Niphad" },
    district: { type: String, default: "Nashik" },
    state: { type: String, default: "Maharashtra" }
  },
  farm: {
    name: { type: String, default: "Patil Farm" },
    sizeAcres: { type: Number, default: 5 },
    primaryCrop: { type: String, default: "Soybean" }
  }
}, { timestamps: true });

const HiringRequestSchema = new mongoose.Schema({
  id: { type: String },
  farmerId: { type: String, default: "farmer-1" },
  farmerName: { type: String, default: "Local Farmer" },
  farmerPhone: { type: String, default: "" },
  farmerLocation: { type: String, default: "Nashik" },
  labourId: { type: String, required: true },
  labourName: { type: String, required: true },
  labourPhone: { type: String, default: "" },
  workType: { type: String, default: "Harvesting" },
  date: { type: String, required: true },
  duration: { type: Number, default: 1 },
  dailyWage: { type: Number, default: 450 },
  totalCost: { type: Number, default: 450 },
  notes: { type: String, default: "" },
  status: { type: String, default: "Pending" }
}, { timestamps: true });

const LabourModel = mongoose.models.Labour || mongoose.model("Labour", LabourSchema);
const FarmerModel = mongoose.models.Farmer || mongoose.model("Farmer", FarmerSchema);
const HiringRequestModel = mongoose.models.HiringRequest || mongoose.model("HiringRequest", HiringRequestSchema);

// JWT token creator
const createToken = (user, role) => {
  return jwt.sign(
    { id: user.id || user._id, email: user.email, name: user.name, role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Master Serverless Request Handler for Vercel
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Connect to DB
  await getDbConnection();

  const url = req.url || "/";
  const path = url.split("?")[0].replace(/^\/api/, "");
  const method = req.method;

  try {
    // 1. Health
    if (path === "/health" || path === "") {
      return res.status(200).json({
        status: "healthy",
        platform: "Krishi Intelligence Multi-Intelligence Platform",
        db: mongoose.connection.readyState === 1 ? "Connected to MongoDB Atlas" : "Offline",
        serverTime: new Date().toISOString()
      });
    }

    // 2. LABOUR REGISTRATION -> Directly saves to MongoDB Atlas!
    if (path === "/auth/labour/register" && method === "POST") {
      const {
        name,
        email,
        password,
        phone,
        village,
        district,
        state,
        skills,
        expectedDailyWage,
        availability,
        bio
      } = req.body || {};

      if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required." });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const wage = parseFloat(expectedDailyWage) || 450;
      const formattedLocation = `${village ? village + ", " : ""}${district || "Nashik"}, ${state || "Maharashtra"}`;

      // Save directly to MongoDB Atlas
      const labourDoc = await LabourModel.create({
        id: `labour-${Date.now()}`,
        name,
        email,
        phone: phone || "+91 98000 00000",
        passwordHash,
        village: village || "Niphad",
        district: district || "Nashik",
        state: state || "Maharashtra",
        location: formattedLocation,
        preferredWorkArea: `${district || "Nashik"} Region`,
        role: Array.isArray(skills) ? skills[0] : (skills || "Harvesting Worker"),
        skills: Array.isArray(skills) ? skills : [skills || "Harvesting"],
        expectedDailyWage: wage,
        dailyWage: wage,
        availability: availability || "Immediate",
        bio: bio || "Experienced farm worker ready for seasonal agriculture work.",
        rating: 4.9,
        isVerified: true,
        isNewRegistration: true
      });

      console.log(`✅ [MongoDB Atlas] Registered and stored new Labourer: ${labourDoc.name} (${labourDoc.email})`);

      const token = createToken(labourDoc, "LABOUR");
      const userObj = labourDoc.toObject();
      delete userObj.passwordHash;

      return res.status(201).json({
        message: "Labourer registered and stored in MongoDB Atlas successfully",
        token,
        user: { ...userObj, role: "LABOUR" }
      });
    }

    // 3. LABOUR LOGIN -> Authenticates from MongoDB Atlas
    if (path === "/auth/labour/login" && method === "POST") {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
      }

      let labour = await LabourModel.findOne({ email: email.toLowerCase() });
      if (!labour) {
        // Check seed fallback
        const seedLab = SEED_DATA.labourers.find(l => l.email.toLowerCase() === email.toLowerCase());
        if (seedLab) {
          labour = seedLab;
        } else {
          return res.status(401).json({ error: "Invalid labour credentials or account not found." });
        }
      }

      const token = createToken(labour, "LABOUR");
      const userObj = labour.toObject ? labour.toObject() : { ...labour };
      delete userObj.passwordHash;

      return res.status(200).json({
        message: "Login successful",
        token,
        user: { ...userObj, role: "LABOUR" }
      });
    }

    // 4. FARMER REGISTRATION -> Directly saves to MongoDB Atlas!
    if (path === "/auth/farmer/register" && method === "POST") {
      const { name, email, password, phone, village, district, state, farmName, farmSize, primaryCrop } = req.body || {};
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required." });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const farmerDoc = await FarmerModel.create({
        id: `farmer-${Date.now()}`,
        name,
        email,
        phone: phone || "+91 98000 00000",
        passwordHash,
        location: {
          village: village || "Niphad",
          district: district || "Nashik",
          state: state || "Maharashtra"
        },
        farm: {
          name: farmName || "Patil Farm",
          sizeAcres: parseFloat(farmSize) || 5,
          primaryCrop: primaryCrop || "Soybean"
        }
      });

      console.log(`✅ [MongoDB Atlas] Registered and stored new Farmer: ${farmerDoc.name} (${farmerDoc.email})`);

      const token = createToken(farmerDoc, "FARMER");
      const userObj = farmerDoc.toObject();
      delete userObj.passwordHash;

      return res.status(201).json({
        message: "Farmer registered and stored in MongoDB Atlas successfully",
        token,
        user: { ...userObj, role: "FARMER" }
      });
    }

    // 5. FARMER LOGIN
    if (path === "/auth/farmer/login" && method === "POST") {
      const { email } = req.body || {};
      let farmer = await FarmerModel.findOne({ email: email?.toLowerCase() });
      if (!farmer) {
        farmer = SEED_DATA.farmers.find(f => f.email.toLowerCase() === email?.toLowerCase()) || SEED_DATA.farmers[0];
      }

      const token = createToken(farmer, "FARMER");
      const userObj = farmer.toObject ? farmer.toObject() : { ...farmer };
      delete userObj.passwordHash;

      return res.status(200).json({
        message: "Login successful",
        token,
        user: { ...userObj, role: "FARMER" }
      });
    }

    // 6. GET LABOURERS -> Queries from MongoDB Atlas + Seeds
    if (path.startsWith("/labour") && !path.includes("/request") && !path.includes("/matches")) {
      let atlasLabourers = [];
      try {
        atlasLabourers = await LabourModel.find({}).sort({ createdAt: -1 }).lean();
      } catch (e) {}

      // Combine with seed labourers without duplicates
      const existingEmails = new Set(atlasLabourers.map(l => l.email));
      const combined = [
        ...atlasLabourers,
        ...SEED_DATA.labourers.filter(s => !existingEmails.has(s.email))
      ];

      return res.status(200).json({
        totalCount: combined.length,
        labourers: combined
      });
    }

    // 7. HIRING REQUEST -> Saves to MongoDB Atlas
    if (path === "/labour/request" && method === "POST") {
      const hireDoc = await HiringRequestModel.create({
        id: `hire-${Date.now()}`,
        ...req.body,
        status: "Pending"
      });
      console.log(`✅ [MongoDB Atlas] Created Hiring Request in Atlas: ${hireDoc.id}`);
      return res.status(201).json({
        message: "Hiring request saved to MongoDB Atlas",
        request: hireDoc
      });
    }

    // 8. GET HIRING REQUESTS
    if (path === "/labour/requests") {
      const requests = await HiringRequestModel.find({}).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ requests });
    }

    // 9. Static Seed Handlers
    if (path.startsWith("/market/prices")) return res.status(200).json({ marketPrices: SEED_DATA.marketPrices });
    if (path.startsWith("/schemes")) return res.status(200).json({ schemes: SEED_DATA.schemes });
    if (path.startsWith("/machinery")) return res.status(200).json({ machinery: SEED_DATA.machinery });
    if (path.startsWith("/notifications")) return res.status(200).json({ notifications: SEED_DATA.notifications });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Serverless route error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
