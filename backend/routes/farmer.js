import express from "express";
import { store } from "../models/store.js";
import { authenticateJWT, requireRole } from "../middleware/auth.js";

const router = express.Router();

// GET Farmer Profile
router.get("/profile", authenticateJWT, requireRole("FARMER"), (req, res) => {
  const farmer = store.findFarmerById(req.user.id);
  if (!farmer) return res.status(404).json({ error: "Farmer not found" });
  const { passwordHash: _, ...profile } = farmer;
  res.json({ farmer: profile });
});

// PUT Update Farmer Profile
router.put("/profile", authenticateJWT, requireRole("FARMER"), (req, res) => {
  const updated = store.updateFarmer(req.user.id, req.body);
  if (!updated) return res.status(404).json({ error: "Farmer not found" });
  const { passwordHash: _, ...profile } = updated;
  res.json({ message: "Profile updated successfully", farmer: profile });
});

export default router;
