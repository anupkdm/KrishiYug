import { store } from "../models/store.js";

export class SchemesService {
  /**
   * Evaluates farmer profile against government scheme criteria
   */
  static getRecommendedSchemes(farmerProfile = {}) {
    const allSchemes = store.schemes;
    const farmerCategory = farmerProfile.category || "Small & Marginal";
    const farmerState = farmerProfile.location?.state || "Maharashtra";
    const farmerCrop = (farmerProfile.farm?.primaryCrop || "Soybean").toLowerCase();
    const farmSize = parseFloat(farmerProfile.farm?.sizeAcres || 5);

    const recommended = allSchemes.map(scheme => {
      let score = 50; // base score for national schemes
      const matchedCriteria = [];

      // 1. Land size / Category eligibility
      if (scheme.suitableLandSize.includes(farmerCategory) || scheme.suitableLandSize.includes("All India") || scheme.suitableLandSize.includes("Small & Marginal")) {
        score += 25;
        matchedCriteria.push(`Eligible for ${farmerCategory} landholding category`);
      }

      // 2. State matching
      if (scheme.stateApplicability === "All India" || scheme.stateApplicability.includes(farmerState)) {
        score += 15;
        matchedCriteria.push(`Applicable in ${farmerState}`);
      }

      // 3. Scheme specific boosts
      if (scheme.name.includes("PM-KISAN")) {
        score += 10;
        matchedCriteria.push("Universal Direct Income Benefit");
      }
      if (scheme.name.includes("Fasal Bima") && (farmerCrop.includes("soybean") || farmerCrop.includes("wheat") || farmerCrop.includes("cotton"))) {
        score += 10;
        matchedCriteria.push(`Special coverage active for ${farmerProfile.farm?.primaryCrop || 'primary crop'}`);
      }
      if (scheme.name.includes("Mechanization") && farmSize <= 10) {
        score += 8;
        matchedCriteria.push("High 40-50% machinery subsidy bracket");
      }
      if (scheme.name.includes("Sinchayee") || scheme.name.includes("Drop More Crop")) {
        score += 7;
        matchedCriteria.push("Drip/Sprinkler micro-irrigation grant priority");
      }

      return {
        ...scheme,
        matchScore: Math.min(99, score),
        matchedCriteria
      };
    });

    return recommended.sort((a, b) => b.matchScore - a.matchScore);
  }

  static getNewSchemeAlerts() {
    return [
      {
        id: "alert-1",
        title: "Kisan Drone Subsidy Window Opened (SMAM)",
        description: "Ministry opens 50% capital subsidy (up to ₹5,00,000 for FPOs / ₹4,00,000 for individual SC/ST/Women/Small farmers) on certified agri-drones.",
        deadline: "2026-09-30",
        portal: "https://agrimachinery.nic.in/",
        tag: "High Subsidy",
        postedDate: "2026-08-25"
      },
      {
        id: "alert-2",
        title: "PMFBY Rabi 2026-27 Enrolment Commenced",
        description: "Enrolment for Wheat, Gram, Mustard and Potato insurance open at 1.5% premium cap. Check with CSC or local bank branch.",
        deadline: "2026-11-15",
        portal: "https://pmfby.gov.in/",
        tag: "Insurance",
        postedDate: "2026-08-27"
      },
      {
        id: "alert-3",
        title: "PM-KISAN 19th Installment DBT Transfer",
        description: "e-KYC mandatory to receive ₹2,000 direct bank transfer. Complete biometric or facial OTP authentication on portal.",
        deadline: "Immediate",
        portal: "https://pmkisan.gov.in/",
        tag: "DBT Direct Transfer",
        postedDate: "2026-08-28"
      }
    ];
  }
}
