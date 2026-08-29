import { store } from "../models/store.js";

export class MatchingService {
  /**
   * Sizing calculations for labour requirements based on Indian Agronomy benchmarks
   */
  static calculateLabourRequirement({ crop, farmSizeAcres, activity, wageOffered }) {
    const size = parseFloat(farmSizeAcres) || 1;
    const cropKey = (crop || "").toLowerCase();
    const actKey = (activity || "").toLowerCase();

    // Base worker-days per acre for operations
    let workerDaysPerAcre = 2.0;
    let recommendedDurationDays = 3;
    let activityDifficulty = "Moderate";

    if (actKey.includes("harvest")) {
      if (cropKey.includes("wheat") || cropKey.includes("soybean") || cropKey.includes("paddy")) {
        workerDaysPerAcre = 2.5;
        recommendedDurationDays = Math.max(2, Math.ceil(size / 3));
      } else if (cropKey.includes("onion") || cropKey.includes("tomato") || cropKey.includes("vegetable") || cropKey.includes("fruit")) {
        workerDaysPerAcre = 4.0;
        recommendedDurationDays = Math.max(2, Math.ceil(size / 2));
      } else if (cropKey.includes("cotton")) {
        workerDaysPerAcre = 3.5;
        recommendedDurationDays = Math.max(3, Math.ceil(size / 2.5));
      } else if (cropKey.includes("sugarcane")) {
        workerDaysPerAcre = 4.5;
        recommendedDurationDays = Math.max(4, Math.ceil(size / 2));
      }
      activityDifficulty = "High (Seasonal Peak)";
    } else if (actKey.includes("sowing") || actKey.includes("transplant")) {
      workerDaysPerAcre = cropKey.includes("rice") || cropKey.includes("onion") ? 3.5 : 1.8;
      recommendedDurationDays = Math.max(1, Math.ceil(size / 3));
      activityDifficulty = "Time-Sensitive";
    } else if (actKey.includes("weed")) {
      workerDaysPerAcre = 2.2;
      recommendedDurationDays = Math.max(2, Math.ceil(size / 3));
      activityDifficulty = "Moderate";
    } else if (actKey.includes("spray") || actKey.includes("pesticide") || actKey.includes("fertilizer")) {
      workerDaysPerAcre = 0.8;
      recommendedDurationDays = Math.max(1, Math.ceil(size / 5));
      activityDifficulty = "Specialized Technical";
    } else if (actKey.includes("pruning") || actKey.includes("maintenance")) {
      workerDaysPerAcre = 2.0;
      recommendedDurationDays = Math.max(2, Math.ceil(size / 4));
      activityDifficulty = "Skilled";
    }

    const totalWorkerDays = Math.max(1, Math.round(size * workerDaysPerAcre));
    const recommendedWorkers = Math.max(1, Math.ceil(totalWorkerDays / recommendedDurationDays));
    const baseDailyWage = parseFloat(wageOffered) || 450;
    const estimatedLabourCost = recommendedWorkers * recommendedDurationDays * baseDailyWage;

    return {
      crop,
      farmSizeAcres: size,
      activity,
      recommendedWorkers,
      recommendedDurationDays,
      totalWorkerDays,
      estimatedLabourCost,
      activityDifficulty,
      benchmarkWageAverage: 450,
      savingsWithMechanizationRecommendation: size > 4 && actKey.includes("harvest") ? "Up to 45% cost savings possible by combining with Harvester/Reaper" : null
    };
  }

  /**
   * Multi-Factor Weighted Labour Matching Algorithm
   * Scores all candidate labourers against a requirement
   */
  static getLabourMatches({ requirementId, crop, activity, location, district, state, wageOffered, requiredSkill }) {
    const labourers = store.labourers;
    const targetActivity = (activity || requiredSkill || "").toLowerCase();
    const targetDistrict = (district || location || "").toLowerCase();
    const offeredWage = parseFloat(wageOffered) || 480;

    const scoredLabourers = labourers.map(labour => {
      let score = 0;
      const reasons = [];

      // 1. Skill Matching (35%)
      const hasDirectSkill = labour.skills.some(s => {
        const sLow = s.toLowerCase();
        return targetActivity.includes(sLow) || sLow.includes(targetActivity) ||
          (targetActivity.includes("harvest") && sLow.includes("harvest")) ||
          (targetActivity.includes("weed") && sLow.includes("weed")) ||
          (targetActivity.includes("spray") && (sLow.includes("spray") || sLow.includes("pesticide") || sLow.includes("drone"))) ||
          (targetActivity.includes("machin") && sLow.includes("machin"));
      });

      if (hasDirectSkill) {
        score += 35;
        reasons.push("Direct skill match for " + targetActivity);
      } else if (labour.skills.includes("General Farm Labour") || labour.skills.includes("Crop Maintenance")) {
        score += 22;
        reasons.push("General farm labour compatibility");
      } else {
        score += 10;
      }

      // 2. Location Proximity (30%)
      const labourLoc = (labour.location + " " + labour.preferredWorkArea + " " + (labour.district || "")).toLowerCase();
      if (targetDistrict && labourLoc.includes(targetDistrict)) {
        score += 30;
        reasons.push("Same district & preferred work zone");
      } else if (labour.state && state && labour.state.toLowerCase() === state.toLowerCase()) {
        score += 18;
        reasons.push("Same state / neighboring taluka");
      } else {
        score += 10;
        reasons.push("Inter-district mobile labourer");
      }

      // 3. Availability Matching (20%)
      if (labour.availability === "Immediate") {
        score += 20;
        reasons.push("Immediately available");
      } else if (labour.availability === "This Week") {
        score += 16;
        reasons.push("Available this week");
      } else {
        score += 10;
        reasons.push("Scheduled availability");
      }

      // 4. Wage Compatibility (15%)
      const wageDiff = offeredWage - labour.expectedDailyWage;
      if (wageDiff >= 0) {
        score += 15;
        reasons.push("Offered wage matches or exceeds expectations (+₹" + wageDiff + ")");
      } else if (Math.abs(wageDiff) <= 50) {
        score += 10;
        reasons.push("Wage within negotiable ±₹50 window");
      } else {
        score += 5;
      }

      // Bonus for high experience & rating
      if (labour.rating >= 4.8) score = Math.min(100, score + 3);
      if (labour.experienceYears >= 7) score = Math.min(100, score + 2);

      // Distance estimation
      const estimatedDistanceKm = labourLoc.includes(targetDistrict) ? (3 + Math.floor(Math.random() * 8)) : (15 + Math.floor(Math.random() * 20));

      return {
        ...labour,
        matchScore: Math.min(99, Math.max(45, Math.round(score))),
        matchReasons: reasons,
        estimatedDistanceKm
      };
    });

    // Sort descending by match score
    return scoredLabourers.sort((a, b) => b.matchScore - a.matchScore);
  }
}
