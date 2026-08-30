import express from "express";
import { AdvisoryService } from "../services/advisoryService.js";
import { store } from "../models/store.js";

const router = express.Router();

// POST Generate Multi-Parameter AI Advisory
router.post("/generate", (req, res) => {
  try {
    const advisory = AdvisoryService.generateAdvisory(req.body);
    store.advisories.unshift(advisory);
    res.json(advisory);
  } catch (err) {
    console.error("Advisory generation error:", err);
    res.status(500).json({ error: "Failed to generate AI agricultural advisory" });
  }
});

// GET Latest Advisory
router.get("/latest", (req, res) => {
  const { crop = "Soybean", farmSize = 8.5 } = req.query;
  const advisory = AdvisoryService.generateAdvisory({ crop, farmSize });
  res.json(advisory);
});

// GET Dynamic Condition-Driven Advisory Feed
router.get("/feed", (req, res) => {
  try {
    const feed = AdvisoryService.generateAdvisoryFeed(req.query);
    res.json(feed);
  } catch (err) {
    console.error("Advisory feed error:", err);
    res.status(500).json({ error: "Failed to generate condition-based advisory feed" });
  }
});

// GET Advisory History
router.get("/history", (req, res) => {
  res.json({ advisories: store.advisories.slice(0, 10) });
});

export default router;
