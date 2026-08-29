import express from "express";
import { store } from "../models/store.js";
import { SchemesService } from "../services/schemesService.js";

const router = express.Router();

// GET all government schemes
router.get("/", (req, res) => {
  const { category } = req.query;
  const list = store.getSchemes({ category });
  res.json({ schemes: list });
});

// GET personalized recommended schemes for farmer
router.get("/recommended", (req, res) => {
  const { state, category, primaryCrop, farmSize } = req.query;
  const recommended = SchemesService.getRecommendedSchemes({
    category: category || "Small & Marginal",
    location: { state: state || "Maharashtra" },
    farm: {
      primaryCrop: primaryCrop || "Soybean",
      sizeAcres: parseFloat(farmSize) || 8.5
    }
  });

  res.json({
    totalRecommended: recommended.length,
    schemes: recommended
  });
});

// GET new scheme alerts
router.get("/new", (req, res) => {
  const alerts = SchemesService.getNewSchemeAlerts();
  res.json({ alerts });
});

export default router;
