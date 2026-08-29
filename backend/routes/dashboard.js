import express from "express";
import { store } from "../models/store.js";
import { AdvisoryService } from "../services/advisoryService.js";
import { SchemesService } from "../services/schemesService.js";
import { MatchingService } from "../services/matchingService.js";
import { MachineryService } from "../services/machineryService.js";
import { authenticateJWT, requireRole } from "../middleware/auth.js";

const router = express.Router();

// GET Farmer Dashboard Aggregated Data
router.get("/farmer", authenticateJWT, requireRole("FARMER"), (req, res) => {
  try {
    const farmer = store.findFarmerById(req.user.id) || store.farmers[0];
    const { passwordHash: _, ...farmerProfile } = farmer;

    // Generate comprehensive real-time advisory
    const advisory = AdvisoryService.generateAdvisory({
      crop: farmer.farm?.primaryCrop || "Soybean",
      growthStage: farmer.farm?.cropStage || "Pod Filling & Maturation",
      soilMoisture: store.telemetry.soilMoisture,
      temperature: store.telemetry.temperature,
      rainfallProb: store.telemetry.rainfallProbNext24h,
      farmSize: farmer.farm?.sizeAcres || 8.5
    });

    // Schemes recommendation
    const recommendedSchemes = SchemesService.getRecommendedSchemes(farmer);

    // Labour requirements & best matches preview
    const myRequirements = store.getLabourRequirements({ farmerId: farmer.id });
    const labourMatches = MatchingService.getLabourMatches({
      crop: farmer.farm?.primaryCrop || "Soybean",
      activity: "Harvesting",
      district: farmer.location?.district || "Nashik",
      state: farmer.location?.state || "Maharashtra",
      wageOffered: 480
    }).slice(0, 4);

    // Machinery recommendation preview
    const machineryRecs = MachineryService.getRecommendations({
      crop: farmer.farm?.primaryCrop || "Soybean",
      farmSizeAcres: farmer.farm?.sizeAcres || 8.5,
      stage: farmer.farm?.cropStage || "Harvesting"
    });

    // Crop prices
    const cropPrices = store.marketPrices.filter(
      p => p.crop.toLowerCase() === (farmer.farm?.primaryCrop || "Soybean").toLowerCase() ||
           p.crop.toLowerCase() === (farmer.farm?.secondaryCrop || "Wheat").toLowerCase() ||
           p.crop.toLowerCase() === "onion"
    );

    const unreadNotifications = store.notifications.filter(n => !n.isRead);

    res.json({
      farmer: farmerProfile,
      telemetry: store.telemetry,
      farmIntelligenceScore: advisory.overallFarmIntelligenceScore,
      scores: advisory.scores,
      advisorySummary: advisory.advisories,
      recommendedActions: advisory.recommendedActions,
      marketPricesPreview: cropPrices,
      labourRequirements: myRequirements,
      labourMatchesPreview: labourMatches,
      machineryRecommendations: machineryRecs.recommendations.slice(0, 3),
      recommendedSchemes: recommendedSchemes.slice(0, 3),
      unreadNotificationsCount: unreadNotifications.length
    });
  } catch (err) {
    console.error("Farmer dashboard error:", err);
    res.status(500).json({ error: "Failed to fetch farmer dashboard data" });
  }
});

// GET Labour Dashboard Aggregated Data
router.get("/labour", authenticateJWT, requireRole("LABOUR"), (req, res) => {
  try {
    const labour = store.findLabourById(req.user.id) || store.labourers[0];
    const { passwordHash: _, ...labourProfile } = labour;

    // Available jobs matching skills or all open
    const allJobs = store.getLabourRequirements({ status: "Open" });
    const myApplications = store.getLabourApplications({ labourId: labour.id });

    // Calculate earnings summary
    const completedApps = myApplications.filter(a => a.status === "Completed" || a.status === "Accepted");
    const totalEarnings = completedApps.reduce((acc, curr) => acc + (curr.wageExpected * 3), 14250); // benchmark base

    const unreadNotifications = store.notifications.filter(n => !n.isRead && (n.category === "Labour" || n.category === "Weather"));

    res.json({
      labour: labourProfile,
      availableJobs: allJobs,
      myApplications,
      stats: {
        totalJobsAvailable: allJobs.length,
        appliedJobsCount: myApplications.length,
        acceptedJobsCount: myApplications.filter(a => a.status === "Accepted").length,
        completedJobsCount: (labour.completedJobsCount || 0) + completedApps.length,
        estimatedTotalEarnings: totalEarnings,
        rating: labour.rating || 4.8
      },
      unreadNotificationsCount: unreadNotifications.length
    });
  } catch (err) {
    console.error("Labour dashboard error:", err);
    res.status(500).json({ error: "Failed to fetch labour dashboard data" });
  }
});

export default router;
