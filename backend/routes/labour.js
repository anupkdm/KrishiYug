import express from "express";
import { store } from "../models/store.js";
import { MatchingService } from "../services/matchingService.js";
import { authenticateJWT } from "../middleware/auth.js";
import { checkDbAvailability } from "../middleware/offlineSimulatorMiddleware.js";

const router = express.Router();

// GET all labourers (with filters)
router.get("/", (req, res) => {
  const { skill, availability, location, maxWage, minExperience } = req.query;
  let labourers = [...store.labourers];

  if (skill) {
    labourers = labourers.filter(l => l.skills.some(s => s.toLowerCase().includes(skill.toLowerCase())));
  }
  if (availability) {
    labourers = labourers.filter(l => l.availability.toLowerCase() === availability.toLowerCase());
  }
  if (location) {
    labourers = labourers.filter(l => (l.location + " " + l.preferredWorkArea).toLowerCase().includes(location.toLowerCase()));
  }
  if (maxWage) {
    labourers = labourers.filter(l => l.expectedDailyWage <= parseFloat(maxWage));
  }
  if (minExperience) {
    labourers = labourers.filter(l => l.experienceYears >= parseInt(minExperience));
  }

  res.json({
    totalCount: labourers.length,
    labourers: labourers.map(({ passwordHash: _, ...l }) => l)
  });
});

// GET Labour matches for a farmer's requirement
router.get("/matches", (req, res) => {
  const { requirementId, crop, activity, location, district, state, wageOffered, requiredSkill } = req.query;
  const matchedLabourers = MatchingService.getLabourMatches({
    requirementId,
    crop,
    activity,
    location,
    district,
    state,
    wageOffered,
    requiredSkill
  });

  res.json({
    totalMatched: matchedLabourers.length,
    matches: matchedLabourers.map(({ passwordHash: _, ...l }) => l)
  });
});

// POST Labour Application (Apply for a job)
router.post("/apply", checkDbAvailability, authenticateJWT, (req, res) => {
  try {
    const { requirementId, note, wageExpected } = req.body;
    if (!requirementId) {
      return res.status(400).json({ error: "requirementId is required" });
    }

    const reqItem = store.labourRequirements.find(r => r.id === requirementId);
    if (!reqItem) {
      return res.status(404).json({ error: "Labour requirement not found" });
    }

    const application = store.applyForLabourRequirement({
      requirementId,
      labourId: req.user.id,
      labourName: req.user.name,
      labourPhone: req.user.phone || "+91 98000 00000",
      farmerId: reqItem.farmerId,
      farmName: reqItem.farmName,
      activity: reqItem.activity,
      crop: reqItem.crop,
      wageExpected: parseFloat(wageExpected) || reqItem.dailyWageOffered,
      note: note || "Experienced agricultural worker applying for this requirement."
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application
    });
  } catch (err) {
    console.error("Apply error:", err);
    res.status(500).json({ error: "Failed to apply for labour requirement" });
  }
});

// GET My Applications (for Labourer)
router.get("/my-applications", authenticateJWT, (req, res) => {
  const apps = store.getLabourApplications({ labourId: req.user.id });
  res.json({ applications: apps });
});

// POST Direct Hiring Request (Farmer -> Labour)
router.post("/request", checkDbAvailability, authenticateJWT, (req, res) => {
  try {
    const { labourId, workType, date, duration, totalCost, dailyWage, notes } = req.body;
    if (!labourId) {
      return res.status(400).json({ error: "labourId is required" });
    }
    const labour = store.findLabourById(labourId);
    if (!labour) {
      return res.status(404).json({ error: "Labourer not found" });
    }

    const wage = parseFloat(dailyWage) || labour.expectedDailyWage || 450;
    const dur = parseInt(duration) || 1;
    const cost = parseFloat(totalCost) || (wage * dur);

    const hiringRequest = store.addHiringRequest({
      farmerId: req.user.id,
      farmerName: req.user.name || "Local Farmer",
      farmerPhone: req.user.phone || "+91 98000 00000",
      farmerLocation: req.user.location ? `${req.user.location.village || ''}, ${req.user.location.district || 'Nashik'}` : "Nashik, Maharashtra",
      labourId,
      labourName: labour.name,
      labourPhone: labour.phone,
      workType: workType || "Harvesting",
      date: date || new Date().toISOString().split("T")[0],
      duration: dur,
      dailyWage: wage,
      totalCost: cost,
      notes: notes || `Direct hiring request for ${workType}.`,
      status: "Pending"
    });

    res.status(201).json({
      message: `Hiring request successfully sent to ${labour.name}`,
      request: hiringRequest
    });
  } catch (err) {
    console.error("Hiring request error:", err);
    res.status(500).json({ error: "Failed to send hiring request" });
  }
});

// GET Hiring Requests (for Farmer or Labourer)
router.get("/requests", authenticateJWT, (req, res) => {
  const isFarmer = req.user.role === "FARMER";
  const list = store.getHiringRequests(isFarmer ? { farmerId: req.user.id } : { labourId: req.user.id });
  res.json({ requests: list });
});

// PUT Update Hiring Request Status (Labourer Accepts/Rejects)
router.put("/request/:id", checkDbAvailability, authenticateJWT, (req, res) => {
  try {
    const { status } = req.body; // "Accepted" | "Rejected" | "Completed"
    if (!status) {
      return res.status(400).json({ error: "status is required" });
    }
    const updated = store.updateHiringRequestStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: "Hiring request not found" });
    }
    res.json({ message: `Hiring request marked as ${status}`, request: updated });
  } catch (err) {
    console.error("Update hire request error:", err);
    res.status(500).json({ error: "Failed to update hiring request" });
  }
});

// PUT Update Labour Profile
router.put("/profile", checkDbAvailability, authenticateJWT, (req, res) => {
  const updated = store.updateLabour(req.user.id, req.body);
  if (!updated) return res.status(404).json({ error: "Labourer not found" });
  const { passwordHash: _, ...profile } = updated;
  res.json({ message: "Labour profile updated", labour: profile });
});

export default router;
