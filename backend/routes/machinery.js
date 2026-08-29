import express from "express";
import { store } from "../models/store.js";
import { MachineryService } from "../services/machineryService.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// GET all machinery
router.get("/", (req, res) => {
  const { category, crop } = req.query;
  const list = store.getMachinery({ category, crop });
  res.json({ machinery: list });
});

// GET crop-based machinery recommendations
router.get("/recommendations", (req, res) => {
  const { crop, farmSizeAcres, stage, soilType, operation } = req.query;
  const recs = MachineryService.getRecommendations({
    crop: crop || "Soybean",
    farmSizeAcres: farmSizeAcres || 8.5,
    stage: stage || "Harvesting",
    soilType: soilType || "Black Cotton Soil",
    operation: operation || "Harvesting & Threshing"
  });
  res.json(recs);
});

// POST Book Machinery
router.post("/book", authenticateJWT, (req, res) => {
  try {
    const { machineryId, acreage, bookingDate, contactPhone, notes } = req.body;
    if (!machineryId) {
      return res.status(400).json({ error: "machineryId is required" });
    }

    const booking = MachineryService.bookMachine({
      machineryId,
      farmerId: req.user.id,
      farmerName: req.user.name,
      farmLocation: req.body.farmLocation || "Niphad, Nashik",
      acreage: parseFloat(acreage) || 5,
      bookingDate: bookingDate || new Date().toISOString().split("T")[0],
      contactPhone: contactPhone || req.user.phone || "+91 98000 00000",
      notes: notes || "Booking for upcoming field operation."
    });

    res.status(201).json({
      message: "Machinery booking confirmed",
      booking
    });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: err.message || "Failed to book machinery" });
  }
});

// GET Farmer's Machinery Bookings
router.get("/bookings", authenticateJWT, (req, res) => {
  const userBookings = store.machineryBookings.filter(b => b.farmerId === req.user.id);
  res.json({ bookings: userBookings });
});

export default router;
