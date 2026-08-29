import mongoose from "mongoose";
import dotenv from "dotenv";
import { SEED_DATA } from "../data/seedData.js";
import { LabourModel } from "../models/Labour.js";
import { FarmerModel } from "../models/Farmer.js";
import { HiringRequestModel } from "../models/HiringRequest.js";

dotenv.config();

const seedAtlas = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error("MONGODB_URI not found in .env");
      process.exit(1);
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoURI);
    console.log("Connected to Atlas!");

    // Clear existing collections
    console.log("Seeding Labourers...");
    await LabourModel.deleteMany({});
    const formattedLabourers = SEED_DATA.labourers.map(l => ({
      ...l,
      dailyWage: l.expectedDailyWage || 450,
      expectedDailyWage: l.expectedDailyWage || 450,
      village: l.village || "Niphad",
      district: l.district || "Nashik",
      state: l.state || "Maharashtra",
      role: l.role || "Harvesting Worker"
    }));
    await LabourModel.insertMany(formattedLabourers);
    console.log(`✓ Inserted ${formattedLabourers.length} Labourers to MongoDB Atlas`);

    console.log("Seeding Farmers...");
    await FarmerModel.deleteMany({});
    await FarmerModel.insertMany(SEED_DATA.farmers);
    console.log(`✓ Inserted ${SEED_DATA.farmers.length} Farmers to MongoDB Atlas`);

    console.log("=======================================================");
    console.log("🎉 MongoDB Atlas Seed Completed Successfully!");
    console.log("=======================================================");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seedAtlas();
