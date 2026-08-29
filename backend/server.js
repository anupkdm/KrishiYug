import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { CONFIG } from "./config/config.js";
import { SimulationService } from "./services/simulationService.js";

// Routes
import authRoutes from "./routes/auth.js";
import farmerRoutes from "./routes/farmer.js";
import labourRoutes from "./routes/labour.js";
import labourReqRoutes from "./routes/labourReqs.js";
import machineryRoutes from "./routes/machinery.js";
import schemesRoutes from "./routes/schemes.js";
import marketRoutes from "./routes/market.js";
import advisoryRoutes from "./routes/advisory.js";
import dashboardRoutes from "./routes/dashboard.js";
import simulationRoutes from "./routes/simulation.js";
import notificationsRoutes from "./routes/notifications.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    platform: "Krishi Intelligence Multi-Intelligence Platform",
    tagline: "One Platform. Smarter Farming. Better Decisions.",
    version: "1.0.0",
    serverTime: new Date().toISOString()
  });
});

// API Routes Mounting
app.use("/api/auth", authRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/labour", labourRoutes);
app.use("/api/labour-requirements", labourReqRoutes);
app.use("/api/machinery", machineryRoutes);
app.use("/api/schemes", schemesRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/advisory", advisoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/simulation", simulationRoutes);
app.use("/api/notifications", notificationsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
});

// Start Background Simulation Engine Interval
setInterval(() => {
  try {
    SimulationService.tick();
  } catch (e) {
    console.error("Simulation tick error:", e);
  }
}, CONFIG.SIMULATION_TICK_SECONDS * 1000);

import { connectDB } from "./config/db.js";

const PORT = CONFIG.PORT;

// Connect to MongoDB Atlas (or local fallback) and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🌱 KRISHI INTELLIGENCE REST API SERVER STARTED`);
    console.log(`🌾 Platform: One Platform. Smarter Farming. Better Decisions.`);
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`📡 Simulation Engine: ACTIVE (${CONFIG.SIMULATION_TICK_SECONDS}s interval)`);
    console.log(`=======================================================`);
  });
});
