import express from "express";
import { store } from "../models/store.js";
import { MarketService } from "../services/marketService.js";

const router = express.Router();

// GET Current Mandi Prices
router.get("/prices", (req, res) => {
  const { crop, state, district, mandi } = req.query;
  const prices = store.getMarketPrices({ crop, state, district, mandi });
  res.json({
    timestamp: new Date().toISOString(),
    totalRecords: prices.length,
    prices
  });
});

// GET Multi-Mandi Price Comparison (with transport cost analysis)
router.get("/comparison", (req, res) => {
  const { crop = "Onion", quantity = 50, location } = req.query;
  const comparison = MarketService.compareMarkets({
    crop,
    farmerLocation: location || "Nashik, Maharashtra",
    quantityQuintals: quantity
  });
  res.json(comparison);
});

// GET Historical Market Trends
router.get("/history", (req, res) => {
  const trends = MarketService.getHistoricalTrends();
  res.json({
    historicalTrends: trends
  });
});

// GET AI Price Predictions
router.get("/prediction", (req, res) => {
  const { crop = "Soybean" } = req.query;
  const prediction = MarketService.getPricePrediction(crop);
  res.json(prediction);
});

export default router;
