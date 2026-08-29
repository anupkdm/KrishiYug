import { store } from "../models/store.js";

export class SimulationService {
  /**
   * Executes a simulation tick, fluctuating sensor data and market movements
   */
  static tick() {
    const current = store.telemetry;

    // Small random fluctuations in telemetry
    const tempDelta = (Math.random() * 0.8 - 0.4);
    const humidityDelta = (Math.random() * 2 - 1);
    const moistureDelta = (Math.random() * 1.2 - 0.6);

    const newTemp = Math.max(18, Math.min(42, parseFloat((current.temperature + tempDelta).toFixed(1))));
    const newHumidity = Math.max(30, Math.min(95, Math.round(current.humidity + humidityDelta)));
    const newMoisture = Math.max(20, Math.min(85, Math.round(current.soilMoisture + moistureDelta)));

    store.updateTelemetry({
      temperature: newTemp,
      humidity: newHumidity,
      soilMoisture: newMoisture
    });

    // Modulate market prices with realistic market volatility
    store.marketPrices.forEach(p => {
      // 30% chance of price movement
      if (Math.random() > 0.65) {
        const delta = Math.round((Math.random() * 40 - 15) / 5) * 5;
        p.todayPrice = Math.max(p.minPrice, p.todayPrice + delta);
        p.priceChangePercent = parseFloat((((p.todayPrice - p.yesterdayPrice) / p.yesterdayPrice) * 100).toFixed(2));
        p.trend = p.priceChangePercent > 0 ? "Upward" : (p.priceChangePercent < 0 ? "Downward" : "Stable");
      }
    });

    return {
      success: true,
      timestamp: new Date().toISOString(),
      telemetry: store.telemetry,
      activePricesCount: store.marketPrices.length
    };
  }
}
