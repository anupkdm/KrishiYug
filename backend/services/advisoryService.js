import { store } from "../models/store.js";

export class AdvisoryService {
  /**
   * Generates Multi-Intelligence AI Agricultural Advisory & Decision Score
   */
  static generateAdvisory(params = {}) {
    const telemetry = store.telemetry;
    const crop = params.crop || "Soybean";
    const growthStage = params.growthStage || "Pod Filling & Maturation";
    const soilMoisture = parseFloat(params.soilMoisture !== undefined ? params.soilMoisture : telemetry.soilMoisture);
    const temp = parseFloat(params.temperature || telemetry.temperature);
    const rainfallProb = parseFloat(params.rainfallProb || telemetry.rainfallProbNext24h);
    const pestSymptoms = (params.pestSymptoms || "").toLowerCase();
    const farmSize = parseFloat(params.farmSize || 8.5);

    // 1. Irrigation Advisory
    let irrigationStatus = "Optimal";
    let irrigationUrgency = "Normal";
    let irrigationAction = "";
    let waterRequirementMm = 0;

    if (rainfallProb > 50) {
      irrigationStatus = "Postpone Irrigation";
      irrigationUrgency = "Hold";
      irrigationAction = `High probability of rainfall (${rainfallProb}%) within the next 24-36 hours. Postpone furrow and flood irrigation to prevent waterlogging and root hypoxia in ${crop}.`;
      waterRequirementMm = 0;
    } else if (soilMoisture < 35) {
      irrigationStatus = "Critical Irrigation Needed";
      irrigationUrgency = "Immediate";
      irrigationAction = `Soil moisture is depleted (${soilMoisture}%). Apply light drip irrigation (25-30 mm) immediately during morning or late afternoon to prevent pod/flower shedding.`;
      waterRequirementMm = 28;
    } else if (soilMoisture >= 35 && soilMoisture <= 60) {
      irrigationStatus = "Adequate Soil Moisture";
      irrigationUrgency = "Maintain";
      irrigationAction = `Current soil moisture (${soilMoisture}%) is well within optimal agronomic range for ${growthStage}. Monitor again in 48 hours.`;
      waterRequirementMm = 10;
    } else {
      irrigationStatus = "High Moisture / Drainage Check";
      irrigationUrgency = "Monitor Drainage";
      irrigationAction = `Soil moisture is high (${soilMoisture}%). Ensure farm drainage channels are clear to prevent fungal collar rot.`;
      waterRequirementMm = 0;
    }

    // 2. Weather Advisory
    let weatherTitle = "Favorable Weather with Convective Rainfall Risk";
    let weatherDetail = `Ambient temperature is ${temp}°C with ${telemetry.humidity}% relative humidity. Expected 25-35mm localized convective showers over the next 36h. Wind speeds at ${telemetry.windSpeedKmh} km/h allow safe ground operations.`;

    // 3. Pest & Disease Risk Assessment
    let pestRiskLevel = "Moderate";
    let pestRiskScore = 65; // out of 100
    let pestAdvisory = "";
    let organicRemedy = "";
    let chemicalRemedy = "";

    if (pestSymptoms.includes("spodoptera") || pestSymptoms.includes("caterpillar") || pestSymptoms.includes("leaf") || telemetry.humidity > 70) {
      pestRiskLevel = "High (Spodoptera / Leaf Roller Threat)";
      pestRiskScore = 48;
      pestAdvisory = "Elevated humidity and ambient warmth favor Spodoptera litura (Tobacco Caterpillar) and Semilooper incidence in vegetative and early pod stages.";
      organicRemedy = "Install Pheromone Traps (5 per acre) + Spray Neem Seed Kernel Extract (NSKE 5%) or Bacillus thuringiensis (Bt @ 1.5 kg/ha).";
      chemicalRemedy = "Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Emamectin Benzoate 5% SG @ 0.4 g/L if pest threshold exceeds 3 larvae/meter row.";
    } else {
      pestRiskLevel = "Low to Normal";
      pestRiskScore = 88;
      pestAdvisory = "No severe pest infestation signals detected. Field bio-indicators show healthy predator activity (ladybird beetles).";
      organicRemedy = "Preventive yellow and blue sticky traps (8 per acre) to monitor sucking pests.";
      chemicalRemedy = "No synthetic chemical spraying advised at current thresholds.";
    }

    // 4. Crop Health Diagnostics
    const cropHealthScore = Math.min(96, Math.max(50, Math.round(92 - (pestRiskLevel.includes("High") ? 15 : 0) - (soilMoisture < 30 ? 12 : 0))));
    const cropHealthDetail = `Crop canopy vigor index is healthy with active nodulation. Chlorophyll absorption index indicates sufficient nitrogen assimilation.`;

    // 5. Market Timing Advisory
    const marketAdvisory = `Soybean & Onion Mandi prices have exhibited an upward trend (+1.5% to +6.7% over 7 days). Holding harvest for 10-15 days or selling via APMC modal peak may fetch +₹180–₹320/Qtl incremental revenue.`;

    // 6. Labour Sizing Advisory
    const recommendedWorkers = Math.max(4, Math.ceil(farmSize * 1.2));
    const labourAdvisory = `With ${growthStage} approaching completion, reserve ${recommendedWorkers} agricultural workers for harvesting & bagging 7–10 days in advance to avoid seasonal wage spikes.`;

    // 7. Machinery Mechanization Advisory
    const machineryAdvisory = `For ${farmSize} acres of ${crop}, utilizing a Combine Harvester can reduce harvesting duration from 4 days to 5.5 hours, saving approx ₹${Math.round(farmSize * 1100)} net operational expenses.`;

    // Calculate Overall Farm Intelligence Score (0–100)
    const waterScore = rainfallProb > 50 || (soilMoisture >= 38 && soilMoisture <= 65) ? 88 : 55;
    const weatherScore = rainfallProb > 80 ? 60 : 85;
    const pestScore = pestRiskScore;
    const marketScore = 89;
    const labourReadiness = 82;
    const machineryReadiness = 85;

    const overallFarmIntelligenceScore = Math.round(
      cropHealthScore * 0.25 +
      waterScore * 0.20 +
      pestScore * 0.15 +
      weatherScore * 0.15 +
      marketScore * 0.10 +
      labourReadiness * 0.08 +
      machineryReadiness * 0.07
    );

    // Recommended Actions Feed (Actionable Decision Support)
    const recommendedActions = [
      {
        id: "act-1",
        timeframe: "Today",
        severity: rainfallProb > 50 ? "warning" : (soilMoisture < 35 ? "urgent" : "normal"),
        icon: "Droplets",
        title: rainfallProb > 50 ? "Postpone Irrigation & Check Drainage" : (soilMoisture < 35 ? "Initiate Drip Irrigation" : "Inspect Furrow Soil Moisture"),
        action: rainfallProb > 50 ? "Do not start borewell pumps. Ensure drainage trenches are clear." : "Maintain moisture in root zone.",
        category: "Water Management"
      },
      {
        id: "act-2",
        timeframe: "Tomorrow",
        severity: "warning",
        icon: "ShieldAlert",
        title: "Install Pheromone & Sticky Traps",
        action: "Place 5 pheromone traps per acre for early caterpillar surveillance before rain onset.",
        category: "Crop Protection"
      },
      {
        id: "act-3",
        timeframe: "This Week",
        severity: "success",
        icon: "Tractor",
        title: "Pre-Book Combine Harvester / Thresher",
        action: `Reserve machinery for ${crop} harvest window (${farmSize} acres) via Custom Hiring Centre.`,
        category: "Mechanization"
      },
      {
        id: "act-4",
        timeframe: "Market",
        severity: "info",
        icon: "TrendingUp",
        title: "Monitor Mandi Price Window",
        action: "Lasalgaon & Indore Mandis showing strong upward momentum. Check market comparison tool before dispatch.",
        category: "Market Intelligence"
      },
      {
        id: "act-5",
        timeframe: "Labour",
        severity: "info",
        icon: "Users",
        title: `Pre-Hire ${recommendedWorkers} Workers`,
        action: "Shortlist matched local labourers for upcoming harvesting operations.",
        category: "Labour Management"
      }
    ];

    return {
      timestamp: new Date().toISOString(),
      crop,
      growthStage,
      farmSizeAcres: farmSize,
      overallFarmIntelligenceScore,
      scores: {
        overall: overallFarmIntelligenceScore,
        cropHealth: cropHealthScore,
        waterManagement: waterScore,
        weatherRisk: weatherScore,
        pestRisk: pestScore,
        marketOpportunity: marketScore,
        labourReadiness,
        machineryReadiness
      },
      telemetry: {
        soilMoisture,
        temperature: temp,
        humidity: telemetry.humidity,
        rainfallProbability: rainfallProb,
        recentRainfallMm: telemetry.recentRainfallMm,
        windSpeedKmh: telemetry.windSpeedKmh
      },
      advisories: {
        irrigation: {
          status: irrigationStatus,
          urgency: irrigationUrgency,
          waterRequirementMm,
          recommendation: irrigationAction
        },
        weather: {
          title: weatherTitle,
          detail: weatherDetail
        },
        pestAndDisease: {
          riskLevel: pestRiskLevel,
          score: pestRiskScore,
          assessment: pestAdvisory,
          organicRemedy,
          chemicalRemedy
        },
        cropHealth: {
          score: cropHealthScore,
          detail: cropHealthDetail
        },
        market: {
          detail: marketAdvisory
        },
        labour: {
          workersRecommended: recommendedWorkers,
          detail: labourAdvisory
        },
        machinery: {
          detail: machineryAdvisory
        }
      },
      recommendedActions
    };
  }
}
