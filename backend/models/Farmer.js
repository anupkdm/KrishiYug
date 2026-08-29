import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    location: {
      village: { type: String, default: "Niphad" },
      district: { type: String, default: "Nashik" },
      state: { type: String, default: "Maharashtra" },
      region: { type: String, default: "Western Region" },
      pincode: { type: String, default: "422001" }
    },
    farm: {
      id: { type: String },
      name: { type: String, default: "Patil Farm" },
      sizeAcres: { type: Number, default: 5 },
      soilType: { type: String, default: "Medium Black Soil" },
      soilPH: { type: Number, default: 7.2 },
      soilMoisture: { type: Number, default: 45 },
      irrigationSource: { type: String, default: "Borewell & Drip" },
      primaryCrop: { type: String, default: "Soybean" },
      secondaryCrop: { type: String, default: "Wheat" },
      cropSeason: { type: String, default: "Kharif" },
      cropStage: { type: String, default: "Vegetative" },
      sowingDate: { type: String }
    },
    category: { type: String, default: "Small & Marginal" }
  },
  {
    timestamps: true
  }
);

export const FarmerModel = mongoose.models.Farmer || mongoose.model("Farmer", farmerSchema);
