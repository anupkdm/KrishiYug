import { SimulationService } from "../services/simulationService.js";

/**
 * Middleware to intercept database-writing requests when MongoDB failure simulation is active
 */
export const checkDbAvailability = (req, res, next) => {
  if (SimulationService.isDbDown()) {
    return res.status(503).json({
      success: false,
      code: "DATABASE_UNAVAILABLE_OFFLINE_MODE",
      message: "⚠️ MongoDB is currently unavailable (Simulated Outage). Offline Recovery Mode active.",
      timestamp: new Date().toISOString()
    });
  }
  next();
};
