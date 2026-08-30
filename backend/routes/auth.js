import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { CONFIG } from "../config/config.js";
import { store } from "../models/store.js";
import { authenticateJWT } from "../middleware/auth.js";
import { checkDbAvailability } from "../middleware/offlineSimulatorMiddleware.js";

const router = express.Router();

// Helper to create JWT token
const createToken = (user, role) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role
    },
    CONFIG.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 1. Farmer Registration
router.post("/farmer/register", checkDbAvailability, async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      location, // or village, district, state, region
      village,
      district,
      state,
      region,
      farmSize,
      primaryCrop,
      secondaryCrop,
      soilType,
      irrigationSource
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    if (store.findFarmerByEmail(email)) {
      return res.status(400).json({ error: "A farmer account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newFarmer = store.addFarmer({
      name,
      email,
      phone: phone || "+91 98000 00000",
      passwordHash,
      location: {
        village: village || location?.village || "Rural Village",
        district: district || location?.district || "Nashik",
        state: state || location?.state || "Maharashtra",
        region: region || location?.region || "Western Region",
        pincode: "422001"
      },
      farmSize: parseFloat(farmSize) || 5,
      primaryCrop: primaryCrop || "Soybean",
      secondaryCrop: secondaryCrop || "Wheat",
      soilType: soilType || "Medium Black Soil",
      irrigationSource: irrigationSource || "Drip & Tube Well"
    });

    const token = createToken(newFarmer, "FARMER");
    const { passwordHash: _, ...farmerProfile } = newFarmer;

    res.status(201).json({
      message: "Farmer registered successfully",
      token,
      user: { ...farmerProfile, role: "FARMER" }
    });
  } catch (err) {
    console.error("Farmer register error:", err);
    res.status(500).json({ error: "Failed to register farmer" });
  }
});

// 2. Farmer Login
router.post("/farmer/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const farmer = store.findFarmerByEmail(email);
    if (!farmer) {
      return res.status(401).json({ error: "Invalid farmer credentials or account does not exist." });
    }

    const isMatch = await bcrypt.compare(password, farmer.passwordHash).catch(() => false);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password." });
    }

    const token = createToken(farmer, "FARMER");
    const { passwordHash: _, ...farmerProfile } = farmer;

    res.json({
      message: "Farmer login successful",
      token,
      user: { ...farmerProfile, role: "FARMER" }
    });
  } catch (err) {
    console.error("Farmer login error:", err);
    res.status(500).json({ error: "Failed to login farmer" });
  }
});

// 3. Labour Registration
router.post("/labour/register", checkDbAvailability, async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      location,
      village,
      district,
      state,
      preferredWorkArea,
      skills,
      experienceYears,
      availability,
      expectedDailyWage,
      bio
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    if (store.findLabourByEmail(email)) {
      return res.status(400).json({ error: "A labourer account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const formattedLocation = location || `${village ? village + ", " : ""}${district || "Nashik"}, ${state || "Maharashtra"}`;

    const newLabour = store.addLabour({
      name,
      email,
      phone: phone || "+91 98000 00000",
      passwordHash,
      village: village || "Rural Village",
      district: district || "Nashik",
      state: state || "Maharashtra",
      location: formattedLocation,
      preferredWorkArea: preferredWorkArea || `${district || "Nashik"} & Neighboring Talukas`,
      skills: Array.isArray(skills) ? skills : (skills ? [skills] : ["General Farm Labour"]),
      experienceYears: parseInt(experienceYears) || 3,
      availability: availability || "Immediate",
      expectedDailyWage: parseFloat(expectedDailyWage) || 450,
      bio: bio || "Dedicated agricultural worker ready for farm assignments.",
      rating: 4.9,
      completedJobsCount: 0,
      isVerified: true
    });

    const token = createToken(newLabour, "LABOUR");
    const { passwordHash: _, ...labourProfile } = newLabour;

    res.status(201).json({
      message: "Labourer registered successfully",
      token,
      user: { ...labourProfile, role: "LABOUR" }
    });
  } catch (err) {
    console.error("Labour register error:", err);
    res.status(500).json({ error: "Failed to register labourer" });
  }
});

// 4. Labour Login
router.post("/labour/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const labour = store.findLabourByEmail(email);
    if (!labour) {
      return res.status(401).json({ error: "Invalid labour credentials or account does not exist." });
    }

    const isMatch = await bcrypt.compare(password, labour.passwordHash).catch(() => false);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password." });
    }

    const token = createToken(labour, "LABOUR");
    const { passwordHash: _, ...labourProfile } = labour;

    res.json({
      message: "Labour login successful",
      token,
      user: { ...labourProfile, role: "LABOUR" }
    });
  } catch (err) {
    console.error("Labour login error:", err);
    res.status(500).json({ error: "Failed to login labourer" });
  }
});

// 6. Get Current Authenticated User Profile
router.get("/me", authenticateJWT, (req, res) => {
  if (req.user.role === "FARMER") {
    const farmer = store.findFarmerById(req.user.id);
    if (!farmer) return res.status(404).json({ error: "Farmer not found" });
    const { passwordHash: _, ...profile } = farmer;
    return res.json({ user: { ...profile, role: "FARMER" } });
  }

  if (req.user.role === "LABOUR") {
    const labour = store.findLabourById(req.user.id);
    if (!labour) return res.status(404).json({ error: "Labourer not found" });
    const { passwordHash: _, ...profile } = labour;
    return res.json({ user: { ...profile, role: "LABOUR" } });
  }

  res.status(400).json({ error: "Invalid role" });
});

export default router;
