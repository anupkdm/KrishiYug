import mongoose from "mongoose";

const labourSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    village: { type: String, default: "Niphad" },
    district: { type: String, default: "Nashik" },
    state: { type: String, default: "Maharashtra" },
    location: { type: String, default: "Niphad, Nashik" },
    preferredWorkArea: { type: String, default: "Nashik Region" },
    role: { type: String, default: "Harvesting Worker" },
    skills: { type: [String], default: ["Harvesting", "Crop Maintenance"] },
    experienceYears: { type: Number, default: 3 },
    availability: { type: String, default: "Immediate" },
    expectedDailyWage: { type: Number, default: 450 },
    dailyWage: { type: Number, default: 450 },
    bio: { type: String, default: "" },
    rating: { type: Number, default: 4.8 },
    completedJobsCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: true },
    isNewRegistration: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

export const LabourModel = mongoose.models.Labour || mongoose.model("Labour", labourSchema);
