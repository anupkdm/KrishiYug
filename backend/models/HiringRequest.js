import mongoose from "mongoose";

const hiringRequestSchema = new mongoose.Schema(
  {
    id: { type: String },
    farmerId: { type: String, required: true },
    farmerName: { type: String, required: true },
    farmerPhone: { type: String, default: "" },
    farmerLocation: { type: String, default: "" },
    labourId: { type: String, required: true },
    labourName: { type: String, required: true },
    labourPhone: { type: String, default: "" },
    workType: { type: String, required: true },
    date: { type: String, required: true },
    duration: { type: Number, default: 1 },
    dailyWage: { type: Number, default: 450 },
    totalCost: { type: Number, default: 450 },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Completed"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

export const HiringRequestModel = mongoose.models.HiringRequest || mongoose.model("HiringRequest", hiringRequestSchema);
