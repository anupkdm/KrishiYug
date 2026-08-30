import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { SEED_DATA } from "../data/seedData.js";
import { LabourModel } from "./Labour.js";
import { HiringRequestModel } from "./HiringRequest.js";
import { FarmerModel } from "./Farmer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE_PATH = path.join(__dirname, "../data/krishi_database.json");

class KrishiDataStore {
  constructor() {
    this.farmers = [];
    this.labourers = [];
    this.machinery = [];
    this.schemes = [];
    this.marketPrices = [];
    this.historicalMarketRecords = [];
    this.labourRequirements = [];
    this.labourApplications = [];
    this.hiringRequests = [];
    this.machineryBookings = [];
    this.notifications = [];
    this.advisories = [];
    
    // Live telemetry simulation state
    this.telemetry = {
      temperature: 28.5,
      humidity: 74,
      rainfallProbNext24h: 65,
      recentRainfallMm: 12,
      soilMoisture: 42,
      windSpeedKmh: 14.2,
      sunlightHours: 6.8,
      airQualityIndex: 48,
      lastUpdated: new Date().toISOString()
    };

    this.initDatabase();
  }

  initDatabase() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
        const parsed = JSON.parse(raw);
        this.farmers = parsed.farmers || [];
        this.labourers = parsed.labourers || [];
        this.machinery = parsed.machinery || [];
        this.schemes = parsed.schemes || [];
        this.marketPrices = parsed.marketPrices || [];
        this.historicalMarketRecords = parsed.historicalMarketRecords || [];
        this.labourRequirements = parsed.labourRequirements || [];
        this.labourApplications = parsed.labourApplications || [];
        this.hiringRequests = parsed.hiringRequests || [];
        this.machineryBookings = parsed.machineryBookings || [];
        this.notifications = parsed.notifications || [];
        if (parsed.telemetry) this.telemetry = parsed.telemetry;
        console.log(`✅ [Database] Loaded persistent data: ${this.labourers.length} labourers, ${this.farmers.length} farmers from ${DB_FILE_PATH}`);
      } else {
        console.log("ℹ️ [Database] Initializing new database file from seed data...");
        this.farmers = JSON.parse(JSON.stringify(SEED_DATA.farmers));
        this.labourers = JSON.parse(JSON.stringify(SEED_DATA.labourers));
        this.machinery = JSON.parse(JSON.stringify(SEED_DATA.machinery));
        this.schemes = JSON.parse(JSON.stringify(SEED_DATA.schemes));
        this.marketPrices = JSON.parse(JSON.stringify(SEED_DATA.marketPrices));
        this.historicalMarketRecords = JSON.parse(JSON.stringify(SEED_DATA.historicalMarketRecords));
        this.labourRequirements = JSON.parse(JSON.stringify(SEED_DATA.labourRequirements));
        this.labourApplications = JSON.parse(JSON.stringify(SEED_DATA.labourApplications));
        this.hiringRequests = [];
        this.machineryBookings = JSON.parse(JSON.stringify(SEED_DATA.machineryBookings));
        this.notifications = JSON.parse(JSON.stringify(SEED_DATA.notifications));
        this.save();
      }
    } catch (err) {
      console.error("⚠️ [Database] Error initializing database file, falling back to seed data:", err.message);
      this.farmers = JSON.parse(JSON.stringify(SEED_DATA.farmers));
      this.labourers = JSON.parse(JSON.stringify(SEED_DATA.labourers));
      this.machinery = JSON.parse(JSON.stringify(SEED_DATA.machinery));
      this.schemes = JSON.parse(JSON.stringify(SEED_DATA.schemes));
      this.marketPrices = JSON.parse(JSON.stringify(SEED_DATA.marketPrices));
      this.historicalMarketRecords = JSON.parse(JSON.stringify(SEED_DATA.historicalMarketRecords));
      this.labourRequirements = JSON.parse(JSON.stringify(SEED_DATA.labourRequirements));
      this.labourApplications = JSON.parse(JSON.stringify(SEED_DATA.labourApplications));
      this.hiringRequests = [];
      this.machineryBookings = JSON.parse(JSON.stringify(SEED_DATA.machineryBookings));
      this.notifications = JSON.parse(JSON.stringify(SEED_DATA.notifications));
    }
  }

  save() {
    try {
      const data = {
        farmers: this.farmers,
        labourers: this.labourers,
        machinery: this.machinery,
        schemes: this.schemes,
        marketPrices: this.marketPrices,
        historicalMarketRecords: this.historicalMarketRecords,
        labourRequirements: this.labourRequirements,
        labourApplications: this.labourApplications,
        hiringRequests: this.hiringRequests,
        machineryBookings: this.machineryBookings,
        notifications: this.notifications,
        telemetry: this.telemetry,
        lastSaved: new Date().toISOString()
      };
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("❌ [Database] Failed to write database file:", err.message);
    }
  }

  // Farmers
  findFarmerByEmail(email) {
    return this.farmers.find(f => f.email && f.email.toLowerCase() === email.toLowerCase());
  }

  findFarmerById(id) {
    return this.farmers.find(f => f.id === id);
  }

  addFarmer(farmerData) {
    const id = `farmer-${Date.now()}`;
    const newFarmer = {
      id,
      ...farmerData,
      farm: {
        id: `farm-${Date.now()}`,
        name: farmerData.farmName || `${farmerData.name}'s Farm`,
        sizeAcres: parseFloat(farmerData.farmSize) || 5,
        soilType: farmerData.soilType || "Medium Black Soil",
        soilPH: 7.2,
        soilMoisture: 45,
        irrigationSource: farmerData.irrigationSource || "Borewell & Drip",
        primaryCrop: farmerData.primaryCrop || "Soybean",
        secondaryCrop: farmerData.secondaryCrop || "Wheat",
        cropSeason: "Kharif",
        cropStage: "Vegetative / Pod Stage",
        sowingDate: new Date().toISOString().split("T")[0]
      },
      category: parseFloat(farmerData.farmSize) <= 5 ? "Small & Marginal" : "Medium Landholder",
      createdAt: new Date().toISOString()
    };
    this.farmers.push(newFarmer);
    this.save();

    if (mongoose.connection?.readyState === 1) {
      FarmerModel.create(newFarmer).catch(err => console.warn("Atlas farmer write:", err.message));
    }

    return newFarmer;
  }

  updateFarmer(id, updates) {
    const idx = this.farmers.findIndex(f => f.id === id);
    if (idx === -1) return null;
    this.farmers[idx] = { 
      ...this.farmers[idx], 
      ...updates, 
      location: { 
        ...(this.farmers[idx].location || {}), 
        ...(updates.location || {}) 
      },
      farm: { 
        ...(this.farmers[idx].farm || {}), 
        ...(updates.farm || {}) 
      },
      updatedAt: new Date().toISOString() 
    };
    this.save();

    if (mongoose.connection?.readyState === 1) {
      FarmerModel.findOneAndUpdate({ id }, this.farmers[idx], { new: true }).catch(err => console.warn("Atlas farmer update:", err.message));
    }

    return this.farmers[idx];
  }

  // Labourers
  findLabourByEmail(email) {
    return this.labourers.find(l => l.email && l.email.toLowerCase() === email.toLowerCase());
  }

  findLabourById(id) {
    return this.labourers.find(l => l.id === id);
  }

  getAllLabourers(filters = {}) {
    let list = [...this.labourers];
    if (filters.skill) {
      list = list.filter(l => l.skills && l.skills.some(s => s.toLowerCase().includes(filters.skill.toLowerCase())));
    }
    if (filters.availability) {
      list = list.filter(l => l.availability && l.availability.toLowerCase() === filters.availability.toLowerCase());
    }
    if (filters.location) {
      list = list.filter(l => (String(l.location || '') + " " + String(l.preferredWorkArea || '') + " " + String(l.district || '')).toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.maxWage) {
      list = list.filter(l => l.expectedDailyWage <= parseFloat(filters.maxWage));
    }
    if (filters.minExperience) {
      list = list.filter(l => l.experienceYears >= parseInt(filters.minExperience));
    }
    return list;
  }

  addLabour(labourData) {
    const id = `labour-${Date.now()}`;
    const newLabour = {
      id,
      ...labourData,
      dailyWage: labourData.dailyWage || labourData.expectedDailyWage || 450,
      expectedDailyWage: labourData.expectedDailyWage || labourData.dailyWage || 450,
      rating: labourData.rating || 4.8,
      completedJobsCount: 0,
      isVerified: true,
      isNewRegistration: true,
      registeredAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    // Add to beginning of labourers list so newly registered labour appears first
    this.labourers.unshift(newLabour);

    // Add a notification about new labour registration
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: `🌾 New Farm Worker Registered: ${newLabour.name}`,
      message: `${newLabour.name} (${newLabour.location || 'Local'}) registered with skills: ${newLabour.skills?.join(', ') || 'General Work'}. Daily wage: ₹${newLabour.expectedDailyWage}.`,
      category: "Labour",
      severity: "success",
      timestamp: new Date().toISOString(),
      isRead: false
    });

    this.save();

    if (mongoose.connection?.readyState === 1) {
      LabourModel.create(newLabour).catch(err => console.warn("Atlas labour write:", err.message));
    }

    return newLabour;
  }

  updateLabour(id, updates) {
    const idx = this.labourers.findIndex(l => l.id === id);
    if (idx === -1) return null;
    this.labourers[idx] = { ...this.labourers[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();

    if (mongoose.connection?.readyState === 1) {
      LabourModel.findOneAndUpdate({ id }, updates).catch(err => console.warn("Atlas labour update:", err.message));
    }

    return this.labourers[idx];
  }

  // Labour Requirements
  getLabourRequirements(filters = {}) {
    let reqs = [...this.labourRequirements];
    if (filters.crop) {
      reqs = reqs.filter(r => r.crop.toLowerCase().includes(filters.crop.toLowerCase()));
    }
    if (filters.farmerId) {
      reqs = reqs.filter(r => r.farmerId === filters.farmerId);
    }
    if (filters.status) {
      reqs = reqs.filter(r => r.status.toLowerCase() === filters.status.toLowerCase());
    }
    return reqs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  addLabourRequirement(reqData) {
    const id = `req-${Date.now()}`;
    const newReq = {
      id,
      ...reqData,
      status: "Open",
      applicantsCount: 0,
      createdAt: new Date().toISOString()
    };
    this.labourRequirements.unshift(newReq);
    
    // Add notification
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: `Labour Requirement Posted: ${reqData.activity}`,
      message: `Posted requirement for ${reqData.workersRequired} workers for ${reqData.crop} (${reqData.activity}).`,
      category: "Labour",
      severity: "info",
      timestamp: new Date().toISOString(),
      isRead: false
    });

    this.save();
    return newReq;
  }

  // Labour Applications
  applyForLabourRequirement(applicationData) {
    const id = `app-${Date.now()}`;
    const newApp = {
      id,
      ...applicationData,
      status: "Pending",
      appliedDate: new Date().toISOString()
    };
    this.labourApplications.unshift(newApp);

    // Increment applicantsCount on requirement
    const req = this.labourRequirements.find(r => r.id === applicationData.requirementId);
    if (req) {
      req.applicantsCount = (req.applicantsCount || 0) + 1;
    }

    // Add notification to farmer
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: `New Labour Application: ${applicationData.labourName}`,
      message: `${applicationData.labourName} applied for your job "${applicationData.activity || 'Agricultural Work'}". Expected wage: ₹${applicationData.wageExpected || 'N/A'}.`,
      category: "Labour",
      severity: "info",
      timestamp: new Date().toISOString(),
      isRead: false
    });

    this.save();
    return newApp;
  }

  getLabourApplications(filters = {}) {
    let apps = [...this.labourApplications];
    if (filters.labourId) {
      apps = apps.filter(a => a.labourId === filters.labourId);
    }
    if (filters.farmerId) {
      apps = apps.filter(a => a.farmerId === filters.farmerId);
    }
    if (filters.requirementId) {
      apps = apps.filter(a => a.requirementId === filters.requirementId);
    }
    return apps;
  }

  updateApplicationStatus(id, status) {
    const app = this.labourApplications.find(a => a.id === id);
    if (!app) return null;
    app.status = status;
    this.save();
    return app;
  }

  // Direct Hiring Requests (Farmer -> Labour)
  addHiringRequest(hireData) {
    const id = `hire-${Date.now()}`;
    const newHire = {
      id,
      ...hireData,
      status: hireData.status || "Pending",
      createdAt: new Date().toISOString()
    };
    this.hiringRequests.unshift(newHire);

    // Notification for labourer
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: `🤝 New Job Offer from Farmer ${hireData.farmerName || 'Local Farmer'}`,
      message: `Farmer ${hireData.farmerName || 'Patil'} wants to hire you for ${hireData.workType} starting on ${hireData.date} (${hireData.duration} days) for ₹${hireData.totalCost || hireData.dailyWage * hireData.duration}.`,
      category: "Labour",
      severity: "success",
      timestamp: new Date().toISOString(),
      isRead: false
    });

    this.save();

    if (mongoose.connection?.readyState === 1) {
      HiringRequestModel.create(newHire).catch(err => console.warn("Atlas hire write:", err.message));
    }

    return newHire;
  }

  getHiringRequests(filters = {}) {
    let list = [...this.hiringRequests];
    if (filters.farmerId) {
      list = list.filter(h => h.farmerId === filters.farmerId);
    }
    if (filters.labourId) {
      list = list.filter(h => h.labourId === filters.labourId);
    }
    if (filters.status) {
      list = list.filter(h => h.status.toLowerCase() === filters.status.toLowerCase());
    }
    return list;
  }

  updateHiringRequestStatus(id, status) {
    const req = this.hiringRequests.find(h => h.id === id);
    if (!req) return null;
    req.status = status;
    req.updatedAt = new Date().toISOString();

    // Add notification to farmer
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: `Hiring Request ${status}: ${req.labourName}`,
      message: `${req.labourName} has ${status.toLowerCase()} your hiring request for ${req.workType} starting ${req.date}.`,
      category: "Labour",
      severity: status === "Accepted" ? "success" : "warning",
      timestamp: new Date().toISOString(),
      isRead: false
    });

    this.save();

    if (mongoose.connection?.readyState === 1) {
      HiringRequestModel.findOneAndUpdate({ id }, { status }).catch(err => console.warn("Atlas hire update:", err.message));
    }

    return req;
  }

  // Machinery
  getMachinery(filters = {}) {
    let machs = [...this.machinery];
    if (filters.category) {
      machs = machs.filter(m => m.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.crop) {
      machs = machs.filter(m => m.suitableCrops.some(c => c.toLowerCase().includes(filters.crop.toLowerCase()) || c === "All Crops"));
    }
    return machs;
  }

  bookMachinery(bookingData) {
    const id = `book-${Date.now()}`;
    const newBooking = {
      id,
      ...bookingData,
      status: "Confirmed",
      bookedAt: new Date().toISOString()
    };
    this.machineryBookings.unshift(newBooking);

    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: `Machinery Booking Confirmed: ${bookingData.machineryName}`,
      message: `Successfully booked ${bookingData.machineryName} for ${bookingData.bookingDate}. Total estimated rental: ₹${bookingData.totalCost}.`,
      category: "Machinery",
      severity: "success",
      timestamp: new Date().toISOString(),
      isRead: false
    });

    this.save();
    return newBooking;
  }

  // Schemes
  getSchemes(filters = {}) {
    let list = [...this.schemes];
    if (filters.category) {
      list = list.filter(s => s.category.toLowerCase().includes(filters.category.toLowerCase()));
    }
    return list;
  }

  // Market Prices
  getMarketPrices(filters = {}) {
    let prices = [...this.marketPrices];
    if (filters.crop) {
      prices = prices.filter(p => p.crop.toLowerCase() === filters.crop.toLowerCase());
    }
    if (filters.state) {
      prices = prices.filter(p => p.state.toLowerCase() === filters.state.toLowerCase());
    }
    if (filters.district) {
      prices = prices.filter(p => p.district.toLowerCase() === filters.district.toLowerCase());
    }
    if (filters.mandi) {
      prices = prices.filter(p => p.mandi.toLowerCase().includes(filters.mandi.toLowerCase()));
    }
    return prices;
  }

  // Notifications
  getNotifications() {
    return this.notifications;
  }

  markNotificationRead(id) {
    const n = this.notifications.find(item => item.id === id);
    if (n) {
      n.isRead = true;
      this.save();
    }
    return n;
  }

  markAllNotificationsRead() {
    this.notifications.forEach(n => { n.isRead = true; });
    this.save();
    return true;
  }

  // Live telemetry update
  updateTelemetry(newData) {
    this.telemetry = {
      ...this.telemetry,
      ...newData,
      lastUpdated: new Date().toISOString()
    };
    this.save();
    return this.telemetry;
  }
}

export const store = new KrishiDataStore();
