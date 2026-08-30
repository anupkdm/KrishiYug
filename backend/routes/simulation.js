import express from "express";
import { store } from "../models/store.js";
import { SimulationService } from "../services/simulationService.js";

const router = express.Router();

// POST Trigger simulation tick manually or periodically
router.post("/tick", (req, res) => {
  const result = SimulationService.tick();
  res.json(result);
});

// GET Current Simulation Telemetry State
router.get("/state", (req, res) => {
  res.json({
    telemetry: store.telemetry,
    serverTime: new Date().toISOString(),
    isLive: true,
    dbStatus: {
      isHealthy: !SimulationService.isDbDown(),
      simulatedDown: SimulationService.isDbDown()
    }
  });
});

// GET Database Health & Simulation Status
router.get("/db-health", (req, res) => {
  res.json({
    isHealthy: !SimulationService.isDbDown(),
    simulatedDown: SimulationService.isDbDown(),
    timestamp: new Date().toISOString()
  });
});

// POST Toggle Database Simulated Failure
router.post("/toggle-db-failure", (req, res) => {
  const result = SimulationService.toggleDbFailure();
  res.json(result);
});

// POST Restore Database Simulation
router.post("/restore-db", (req, res) => {
  const result = SimulationService.restoreDb();
  res.json(result);
});

export default router;
