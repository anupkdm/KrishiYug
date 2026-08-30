import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { SEED_DATA } from "./seedData.js";

const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://anupkadam96k_db_user:PpcBgZb6LnBoea0d@cluster0.mjwpsl6.mongodb.net/krishimitra?retryWrites=true&w=majority";
const JWT_SECRET = process.env.JWT_SECRET || "krishi-secret-jwt-key-2026-hackathon-secure";

let isConnecting = false;

const getDbConnection = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (isConnecting) {
    while (mongoose.connection.readyState !== 1) {
      await new Promise(r => setTimeout(r, 100));
    }
    return mongoose.connection;
  }

  try {
    isConnecting = true;
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log("🍃 MongoDB Atlas connected successfully in Serverless function");
    isConnecting = false;
    return mongoose.connection;
  } catch (err) {
    isConnecting = false;
    console.error("❌ MongoDB Atlas connection error:", err.message);
    return null;
  }
};

// Schemas with strict collection names
const LabourSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  passwordHash: { type: String, default: "" },
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
}, { timestamps: true, collection: "labours" });

const FarmerSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  passwordHash: { type: String, default: "" },
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
}, { timestamps: true, collection: "farmers" });

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
}, { timestamps: true, collection: "hiringrequests" });

const LabourModel = mongoose.models.Labour || mongoose.model("Labour", LabourSchema);
const FarmerModel = mongoose.models.Farmer || mongoose.model("Farmer", FarmerSchema);
const HiringRequestModel = mongoose.models.HiringRequest || mongoose.model("HiringRequest", HiringRequestSchema);

const createToken = (user, role) => {
  return jwt.sign(
    { id: user.id || user._id, email: user.email, name: user.name, role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Safe Body Parser for all Serverless Environments
async function parseBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (req.body && typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch(e) { return {}; }
  }

  if (req.readable) {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const raw = Buffer.concat(buffers).toString();
    try { return JSON.parse(raw); } catch(e) { return {}; }
  }
  return {};
}

// Master Serverless Request Handler
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Connect to live MongoDB Atlas
  await getDbConnection();

  const rawUrl = req.url || "/";
  let path = rawUrl.split("?")[0].replace(/^\/api/, "");
  if (!path.startsWith("/")) path = "/" + path;
  const method = req.method;

  const body = await parseBody(req);
  console.log(`[API Request] ${method} ${path}`, JSON.stringify(body));

  try {
    // 1. Health
    if (path === "/health" || path === "/") {
      return res.status(200).json({
        status: "healthy",
        platform: "Krishi Intelligence Multi-Intelligence Platform",
        db: mongoose.connection.readyState === 1 ? "Connected to MongoDB Atlas" : "Offline",
        serverTime: new Date().toISOString()
      });
    }

    // 2. FARMER REGISTRATION -> DIRECT ATLAS SAVE
    if (path.includes("/auth/farmer/register") && method === "POST") {
      const { name, email, password, phone, village, district, state, farmName, farmSize, primaryCrop } = body;
      
      const farmerEmail = (email || `farmer_${Date.now()}@krishi.in`).toLowerCase();
      const farmerName = name || "Registered Farmer";
      const farmerPhone = phone || "+91 98000 00000";

      let passwordHash = "";
      if (password) {
        const salt = await bcrypt.genSalt(10);
        passwordHash = await bcrypt.hash(password, salt);
      }

      const farmerDoc = await FarmerModel.create({
        id: `farmer-${Date.now()}`,
        name: farmerName,
        email: farmerEmail,
        phone: farmerPhone,
        passwordHash,
        location: {
          village: village || "Niphad",
          district: district || "Nashik",
          state: state || "Maharashtra"
        },
        farm: {
          name: farmName || `${farmerName}'s Farm`,
          sizeAcres: parseFloat(farmSize) || 5,
          primaryCrop: primaryCrop || "Soybean"
        }
      });

      console.log(`✅ [MongoDB Atlas] Stored New Farmer: ${farmerDoc.name} (${farmerDoc.email}) ID: ${farmerDoc._id}`);

      const token = createToken(farmerDoc, "FARMER");
      const userObj = farmerDoc.toObject();
      delete userObj.passwordHash;

      return res.status(201).json({
        message: "Farmer registered and saved to MongoDB Atlas",
        token,
        user: { ...userObj, role: "FARMER" }
      });
    }

    // 3. FARMER LOGIN
    if (path.includes("/auth/farmer/login") && method === "POST") {
      const email = (body.email || "").toLowerCase();
      let farmer = await FarmerModel.findOne({ email });
      if (!farmer) {
        farmer = SEED_DATA.farmers.find(f => f.email.toLowerCase() === email) || SEED_DATA.farmers[0];
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

    // 4. LABOUR REGISTRATION -> DIRECT ATLAS SAVE
    if (path.includes("/auth/labour/register") && method === "POST") {
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
      } = body;

      const labourEmail = (email || `labour_${Date.now()}@krishi.in`).toLowerCase();
      const labourName = name || "Registered Worker";
      const labourPhone = phone || "+91 98000 00000";

      let passwordHash = "";
      if (password) {
        const salt = await bcrypt.genSalt(10);
        passwordHash = await bcrypt.hash(password, salt);
      }

      const wage = parseFloat(expectedDailyWage) || 450;
      const formattedLocation = `${village ? village + ", " : ""}${district || "Nashik"}, ${state || "Maharashtra"}`;

      const labourDoc = await LabourModel.create({
        id: `labour-${Date.now()}`,
        name: labourName,
        email: labourEmail,
        phone: labourPhone,
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

      console.log(`✅ [MongoDB Atlas] Stored New Labourer: ${labourDoc.name} (${labourDoc.email}) ID: ${labourDoc._id}`);

      const token = createToken(labourDoc, "LABOUR");
      const userObj = labourDoc.toObject();
      delete userObj.passwordHash;

      return res.status(201).json({
        message: "Labourer registered and saved to MongoDB Atlas",
        token,
        user: { ...userObj, role: "LABOUR" }
      });
    }

    // 5. LABOUR LOGIN
    if (path.includes("/auth/labour/login") && method === "POST") {
      const email = (body.email || "").toLowerCase();
      let labour = await LabourModel.findOne({ email });
      if (!labour) {
        labour = SEED_DATA.labourers.find(l => l.email.toLowerCase() === email) || SEED_DATA.labourers[0];
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

    // 6. GET ALL LABOURERS -> QUERIES FROM LIVE ATLAS
    if (path.includes("/labour") && !path.includes("/request") && !path.includes("/matches")) {
      let atlasLabourers = [];
      try {
        atlasLabourers = await LabourModel.find({}).sort({ createdAt: -1 }).lean();
      } catch (e) {
        console.error("Atlas labour read error:", e);
      }

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

    // 7. HIRING REQUEST -> DIRECT ATLAS SAVE
    if (path.includes("/labour/request") && method === "POST") {
      const hireDoc = await HiringRequestModel.create({
        id: `hire-${Date.now()}`,
        ...body,
        status: "Pending"
      });
      console.log(`✅ [MongoDB Atlas] Stored New Hiring Request: ${hireDoc.id}`);
      return res.status(201).json({
        message: "Hiring request saved to MongoDB Atlas",
        request: hireDoc
      });
    }

    // 8. GET HIRING REQUESTS -> FROM LIVE ATLAS
    if (path.includes("/labour/requests")) {
      const requests = await HiringRequestModel.find({}).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ requests });
    }

    // 9. Market Scheme Comparison
    if (path.includes("/market/scheme-compare") || path.includes("/market/comparison")) {
      const crop = body.crop || "Wheat";
      const location = body.location || "Ahmednagar";
      const moneyNeeded = parseFloat(body.moneyNeeded) || 50000;

      const cropBaseRates = {
        "Wheat": { ahmednagar: 2500, pune: 2800, nashik: 2650, lasalgaon: 2580 },
        "Soybean": { ahmednagar: 4750, pune: 4900, nashik: 4650, lasalgaon: 4620 },
        "Onion": { ahmednagar: 2200, pune: 2600, nashik: 2450, lasalgaon: 2350 },
        "Cotton": { ahmednagar: 7300, pune: 7600, nashik: 7400, lasalgaon: 7250 },
        "Tomato": { ahmednagar: 1800, pune: 2200, nashik: 2050, lasalgaon: 1950 },
        "Maize": { ahmednagar: 2100, pune: 2350, nashik: 2200, lasalgaon: 2180 },
        "Rice": { ahmednagar: 3200, pune: 3600, nashik: 3400, lasalgaon: 3300 },
        "Gram": { ahmednagar: 5100, pune: 5400, nashik: 5250, lasalgaon: 5200 }
      };

      const rates = cropBaseRates[crop] || cropBaseRates["Wheat"];
      const locLower = (location || "").toLowerCase();

      const getTransport = (mandiKey) => {
        if (locLower.includes("ahmednagar")) {
          if (mandiKey === "ahmednagar") return 200;
          if (mandiKey === "pune") return 700;
          if (mandiKey === "nashik") return 450;
          return 400;
        }
        if (locLower.includes("pune")) {
          if (mandiKey === "pune") return 220;
          if (mandiKey === "ahmednagar") return 650;
          if (mandiKey === "nashik") return 750;
          return 720;
        }
        if (mandiKey === "nashik") return 200;
        if (mandiKey === "lasalgaon") return 250;
        if (mandiKey === "ahmednagar") return 420;
        return 680;
      };

      const mandisList = [
        { id: "m-1", key: "ahmednagar", name: "Ahmednagar", pricePerQtl: rates.ahmednagar, transport: getTransport("ahmednagar") },
        { id: "m-2", key: "pune", name: "Pune", pricePerQtl: rates.pune, transport: getTransport("pune") },
        { id: "m-3", key: "nashik", name: "Nashik", pricePerQtl: rates.nashik, transport: getTransport("nashik") },
        { id: "m-4", key: "lasalgaon", name: "Lasalgaon", pricePerQtl: rates.lasalgaon, transport: getTransport("lasalgaon") }
      ];

      const processed = mandisList.map(m => {
        const netPerQtl = m.pricePerQtl - m.transport;
        const quintalsToSell = Math.ceil(moneyNeeded / Math.max(netPerQtl, 1));
        return {
          ...m,
          netPricePerQtl: netPerQtl,
          quintalsNeeded: quintalsToSell,
          totalGross: quintalsToSell * m.pricePerQtl,
          totalTransport: quintalsToSell * m.transport,
          netRevenue: (quintalsToSell * m.pricePerQtl) - (quintalsToSell * m.transport)
        };
      });

      const sorted = [...processed].sort((a, b) => b.netPricePerQtl - a.netPricePerQtl);
      const best = sorted[0];
      const lowest = sorted[sorted.length - 1];

      return res.status(200).json({
        crop,
        location,
        moneyNeeded,
        comparison: sorted,
        bestOption: {
          mandi: best.name,
          badge: `★ ${best.name.toUpperCase()} ★`,
          netPricePerQtl: best.netPricePerQtl,
          pricePerQtl: best.pricePerQtl,
          transport: best.transport,
          quintalsNeeded: best.quintalsNeeded,
          netAdvantagePerQtl: best.netPricePerQtl - lowest.netPricePerQtl
        },
        conclusion: `Based on crop price (₹${best.pricePerQtl.toLocaleString('en-IN')}/Q), transport cost (₹${best.transport}/Q), location (${location}) and money needed (₹${moneyNeeded.toLocaleString('en-IN')}), the system recommends ${best.name} as the most profitable market with the highest net realization of ₹${best.netPricePerQtl.toLocaleString('en-IN')}/Quintal.`
      });
    }

    // 10. Static Seed Handlers
    if (path.includes("/market/prices")) return res.status(200).json({ marketPrices: SEED_DATA.marketPrices });
    if (path.includes("/schemes")) return res.status(200).json({ schemes: SEED_DATA.schemes });
    if (path.includes("/machinery")) return res.status(200).json({ machinery: SEED_DATA.machinery });
    if (path.includes("/notifications")) return res.status(200).json({ notifications: SEED_DATA.notifications });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Serverless route error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
