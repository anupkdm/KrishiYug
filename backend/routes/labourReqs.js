import express from "express";
import { store } from "../models/store.js";
import { MatchingService } from "../services/matchingService.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// GET all labour requirements (jobs feed)
router.get("/", (req, res) => {
  const { crop, farmerId, status } = req.query;
  const reqs = store.getLabourRequirements({ crop, farmerId, status });
  res.json({ requirements: reqs });
});

// GET single labour requirement by ID
router.get("/:id", (req, res) => {
  const reqItem = store.labourRequirements.find(r => r.id === req.params.id);
  if (!reqItem) return res.status(404).json({ error: "Requirement not found" });

  const applications = store.getLabourApplications({ requirementId: req.params.id });
  res.json({
    requirement: reqItem,
    applications
  });
});

// POST Calculate Labour Requirement Sizing
router.post("/calculate", (req, res) => {
  const { crop, farmSizeAcres, activity, wageOffered } = req.body;
  const calculation = MatchingService.calculateLabourRequirement({
    crop: crop || "Soybean",
    farmSizeAcres: farmSizeAcres || 5,
    activity: activity || "Harvesting",
    wageOffered: wageOffered || 450
  });

  res.json(calculation);
});

// POST Create new Labour Requirement (Farmer)
router.post("/", authenticateJWT, (req, res) => {
  try {
    const {
      crop,
      farmSizeAcres,
      activity,
      workersRequired,
      durationDays,
      startDate,
      location,
      dailyWageOffered,
      description,
      requiredSkills
    } = req.body;

    if (!crop || !activity || !workersRequired) {
      return res.status(400).json({ error: "Crop, activity, and workersRequired are required." });
    }

    const farmer = store.findFarmerById(req.user.id);
    const farmerName = farmer ? farmer.name : req.user.name;
    const farmName = farmer?.farm?.name || `${farmerName}'s Farm`;

    const newReq = store.addLabourRequirement({
      farmerId: req.user.id,
      farmerName,
      farmName,
      crop,
      farmSizeAcres: parseFloat(farmSizeAcres) || farmer?.farm?.sizeAcres || 5,
      activity,
      workersRequired: parseInt(workersRequired) || 5,
      durationDays: parseInt(durationDays) || 3,
      startDate: startDate || new Date().toISOString().split("T")[0],
      location: location || farmer?.location?.district ? `${farmer.location.village || ''}, ${farmer.location.district}, ${farmer.location.state}` : "Nashik, Maharashtra",
      dailyWageOffered: parseFloat(dailyWageOffered) || 480,
      description: description || `Requirement for ${workersRequired} farm workers for ${crop} ${activity}.`,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [activity, "Crop Maintenance"]
    });

    res.status(201).json({
      message: "Labour requirement posted successfully",
      requirement: newReq
    });
  } catch (err) {
    console.error("Labour req create error:", err);
    res.status(500).json({ error: "Failed to post labour requirement" });
  }
});

export default router;
