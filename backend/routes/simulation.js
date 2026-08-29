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
    isLive: true
  });
});

export default router;
