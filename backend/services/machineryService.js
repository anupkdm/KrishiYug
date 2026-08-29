import { store } from "../models/store.js";

export class MachineryService {
  /**
   * Recommends optimal farm machinery based on crop, stage, farm size, soil type & operation
   */
  static getRecommendations({ crop, farmSizeAcres, stage, soilType, operation }) {
    const size = parseFloat(farmSizeAcres) || 5;
    const cropKey = (crop || "").toLowerCase();
    const stageKey = (stage || operation || "").toLowerCase();
    const soilKey = (soilType || "").toLowerCase();

    const recommendations = [];

    // Stage 1: Harvesting
    if (stageKey.includes("harvest") || stageKey.includes("pod") || stageKey.includes("matur")) {
      if (cropKey.includes("wheat") || cropKey.includes("soybean") || cropKey.includes("paddy") || cropKey.includes("rice") || cropKey.includes("maize")) {
        const estHarvesterHours = Math.max(1.5, (size * 0.75).toFixed(1));
        const estHarvesterCost = Math.round(estHarvesterHours * 1800);
        const manualLabourCost = Math.round(size * 2.5 * 3 * 480);
        const labourHoursSaved = Math.round(size * 20);

        recommendations.push({
          rank: 1,
          machineName: "Preet 987 Self-Propelled Combine Harvester",
          category: "Harvester",
          suitabilityScore: 96,
          reason: `Highly effective for large & medium scale ${crop} harvesting. Completes cutting, threshing, and cleaning in a single pass, reducing post-harvest grain losses to < 1.2%.`,
          estimatedRentalCost: estHarvesterCost,
          rentalRateDisplay: "₹1,800 / hr or ₹1,600 / acre",
          timeRequiredHours: estHarvesterHours,
          labourDaysSaved: Math.round(manualLabourCost / 480),
          netSavingsVsManual: manualLabourCost - estHarvesterCost,
          savingsPercent: Math.round(((manualLabourCost - estHarvesterCost) / manualLabourCost) * 100),
          providerName: "Godavari Agri Mechanization Hub",
          providerContact: "+91 98233 44556"
        });

        recommendations.push({
          rank: 2,
          machineName: "Mahindra 575 DI (45 HP) + Multi-Crop Thresher Attachment",
          category: "Tractor & Thresher",
          suitabilityScore: 84,
          reason: `Flexible secondary option if combine harvester is unavailable. Requires manual cutting but speeds up grain separation and bagging.`,
          estimatedRentalCost: Math.round(size * 900 + 1500),
          rentalRateDisplay: "₹650 / hr tractor + ₹400 / hr thresher",
          timeRequiredHours: (size * 1.5).toFixed(1),
          labourDaysSaved: Math.round(size * 8),
          netSavingsVsManual: Math.round(manualLabourCost * 0.35),
          savingsPercent: 35,
          providerName: "Nashik Kisan Seva Kendra",
          providerContact: "+91 98230 11223"
        });
      }
    }

    // Stage 2: Sowing & Land Prep
    if (stageKey.includes("sow") || stageKey.includes("prep") || stageKey.includes("plough") || stageKey.includes("plant") || recommendations.length === 0) {
      const estTractorCost = Math.round(size * 900);
      recommendations.push({
        rank: recommendations.length + 1,
        machineName: "Shaktiman Regular Light 6ft Rotavator + Tractor",
        category: "Rotavator",
        suitabilityScore: 92,
        reason: `Pulverizes ${soilKey || 'black cotton'} soil into optimal seedbed tilth, incorporates stubble residue, and conserves residual sub-surface moisture.`,
        estimatedRentalCost: estTractorCost,
        rentalRateDisplay: "₹700 / acre",
        timeRequiredHours: (size * 0.8).toFixed(1),
        labourDaysSaved: Math.round(size * 5),
        netSavingsVsManual: Math.round(size * 1200),
        savingsPercent: 55,
        providerName: "Panchavati Custom Hiring Centre",
        providerContact: "+91 97654 88990"
      });

      recommendations.push({
        rank: recommendations.length + 1,
        machineName: "Fieldking Multi-Crop Pneumatic Planter & Seeder",
        category: "Seeder",
        suitabilityScore: 89,
        reason: `Guarantees uniform seed depth (3-5 cm) and exact seed-to-seed spacing for ${crop}, preventing seed wastage by up to 25%.`,
        estimatedRentalCost: Math.round(size * 600),
        rentalRateDisplay: "₹600 / acre",
        timeRequiredHours: (size * 0.6).toFixed(1),
        labourDaysSaved: Math.round(size * 4),
        netSavingsVsManual: Math.round(size * 800),
        savingsPercent: 48,
        providerName: "Niphad Taluka Sahakari Sangh",
        providerContact: "+91 94222 33110"
      });
    }

    // Stage 3: Spraying & Crop Protection
    if (stageKey.includes("spray") || stageKey.includes("pest") || stageKey.includes("vegetative") || recommendations.length < 3) {
      recommendations.push({
        rank: recommendations.length + 1,
        machineName: "Garuda Kisan Agri Drone Sprayer (16L)",
        category: "Drone",
        suitabilityScore: 94,
        reason: `Covers 1 acre in just 7 minutes with ultra-fine droplet penetration. Eliminates chemical exposure to human operators and reduces water volume by 80%.`,
        estimatedRentalCost: Math.round(size * 450),
        rentalRateDisplay: "₹450 / acre (Pilot included)",
        timeRequiredHours: ((size * 7) / 60).toFixed(1),
        labourDaysSaved: Math.round(size * 1.5),
        netSavingsVsManual: Math.round(size * 350),
        savingsPercent: 40,
        providerName: "Kisan Smart Tech FPO",
        providerContact: "+91 98222 77889"
      });
    }

    return {
      query: { crop, farmSizeAcres: size, stage, soilType, operation },
      recommendationsCount: recommendations.length,
      recommendations
    };
  }

  static bookMachine(bookingDetails) {
    const machine = store.machinery.find(m => m.id === bookingDetails.machineryId);
    if (!machine) throw new Error("Machinery item not found");

    const acreage = parseFloat(bookingDetails.acreage) || 1;
    const totalCost = Math.round(acreage * machine.rentalPricePerAcre);

    return store.bookMachinery({
      ...bookingDetails,
      machineryName: machine.name,
      totalCost
    });
  }
}
