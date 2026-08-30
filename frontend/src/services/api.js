import { SEED_DATA } from "../data/seedData.js";

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
  : "/api";

// Local Storage Fallback Cache Helper
const getStoredList = (key, defaultVal) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setStoredList = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {}
};

class ApiService {
  getToken() {
    return localStorage.getItem("krishi_token");
  }

  getHeaders(customHeaders = {}) {
    const token = this.getToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customHeaders
    };
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = this.getHeaders(options.headers);

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (response.ok) {
        return await response.json();
      }
      
      const errData = await response.json().catch(() => ({}));
      if (response.status === 503 || errData.code === "DATABASE_UNAVAILABLE_OFFLINE_MODE") {
        const err = new Error(errData.message || "Database temporarily unavailable (Offline Recovery Mode)");
        err.isDatabaseUnavailable = true;
        err.code = "DATABASE_UNAVAILABLE_OFFLINE_MODE";
        err.status = 503;
        throw err;
      }

      if (response.status === 400 || response.status === 401) {
        throw new Error(errData.error || "Authentication failed");
      }
      throw new Error(`HTTP Error ${response.status}`);
    } catch (err) {
      if (err.isDatabaseUnavailable || err.status === 503) {
        throw err;
      }
      console.warn(`[API Network Notice] Endpoint '${endpoint}' unreachable directly, using client resilience store.`);
      return this.handleFallback(endpoint, options);
    }
  }

  // Client Resilience Store (Offline & Cloud Fallback)
  handleFallback(endpoint, options = {}) {
    const body = options.body ? JSON.parse(options.body) : {};

    // 1. Farmer Login
    if (endpoint === "/auth/farmer/login") {
      const email = body.email || "farmer@krishi.in";
      const farmer = SEED_DATA.farmers.find(f => f.email.toLowerCase() === email.toLowerCase()) || {
        id: "farmer-1",
        name: email.split("@")[0].replace(".", " ").toUpperCase(),
        email: email,
        role: "FARMER",
        location: { village: "Niphad", district: "Nashik", state: "Maharashtra" },
        farm: { name: "Patil Farm", sizeAcres: 8.5, primaryCrop: "Soybean" }
      };
      const userProfile = { ...farmer, role: "FARMER" };
      const token = "mock-jwt-token-farmer-" + Date.now();
      localStorage.setItem("krishi_token", token);
      localStorage.setItem("krishi_user", JSON.stringify(userProfile));
      return { token, user: userProfile, farmer: userProfile };
    }

    // 2. Farmer Register
    if (endpoint === "/auth/farmer/register") {
      const newFarmer = {
        id: `farmer-${Date.now()}`,
        name: body.name || "New Farmer",
        email: body.email || "farmer@krishi.in",
        phone: body.phone || "+91 98000 00000",
        role: "FARMER",
        location: { village: body.village || "Niphad", district: body.district || "Nashik", state: body.state || "Maharashtra" },
        farm: { name: body.farmName || "My Farm", sizeAcres: parseFloat(body.farmSize) || 5, primaryCrop: body.primaryCrop || "Soybean" }
      };
      const token = "mock-jwt-token-farmer-" + Date.now();
      localStorage.setItem("krishi_token", token);
      localStorage.setItem("krishi_user", JSON.stringify(newFarmer));
      return { token, user: newFarmer, farmer: newFarmer };
    }

    // 3. Labour Login
    if (endpoint === "/auth/labour/login") {
      const email = body.email || "labour@krishi.in";
      const labour = SEED_DATA.labourers.find(l => l.email.toLowerCase() === email.toLowerCase()) || {
        id: "labour-1",
        name: email.split("@")[0].replace(".", " ").toUpperCase(),
        email: email,
        role: "LABOUR",
        phone: "+91 98765 43210",
        village: "Niphad",
        district: "Nashik",
        skills: ["Harvesting", "Crop Maintenance"],
        expectedDailyWage: 450,
        availability: "Immediate"
      };
      const userProfile = { ...labour, role: "LABOUR" };
      const token = "mock-jwt-token-labour-" + Date.now();
      localStorage.setItem("krishi_token", token);
      localStorage.setItem("krishi_user", JSON.stringify(userProfile));
      return { token, user: userProfile, labour: userProfile };
    }

    // 4. Labour Register
    if (endpoint === "/auth/labour/register") {
      const newLabour = {
        id: `labour-${Date.now()}`,
        name: body.name || "New Labourer",
        email: body.email || "labour@krishi.in",
        phone: body.phone || "+91 98000 00000",
        role: "LABOUR",
        village: body.village || "Niphad",
        district: body.district || "Nashik",
        state: body.state || "Maharashtra",
        skills: body.skills || ["Harvesting"],
        expectedDailyWage: parseFloat(body.expectedDailyWage) || 450,
        dailyWage: parseFloat(body.expectedDailyWage) || 450,
        availability: body.availability || "Immediate",
        isVerified: true
      };
      const token = "mock-jwt-token-labour-" + Date.now();
      localStorage.setItem("krishi_token", token);
      localStorage.setItem("krishi_user", JSON.stringify(newLabour));
      return { token, user: newLabour, labour: newLabour };
    }

    // 5. Get Current User (/auth/me)
    if (endpoint === "/auth/me") {
      const user = getStoredList("krishi_user", SEED_DATA.farmers[0]);
      return { user };
    }

    // 5b. Farmer Profile (/farmer/profile)
    if (endpoint === "/farmer/profile") {
      const currentUser = getStoredList("krishi_user", SEED_DATA.farmers[0]);
      if (options.method === "PUT") {
        const updated = {
          ...currentUser,
          ...body,
          location: { ...(currentUser.location || {}), ...(body.location || {}) },
          farm: { ...(currentUser.farm || {}), ...(body.farm || {}) }
        };
        localStorage.setItem("krishi_user", JSON.stringify(updated));
        return { message: "Profile updated successfully", farmer: updated, user: updated };
      }
      return { farmer: currentUser, user: currentUser };
    }

    // 6. Get Labourers (/labour)
    if (endpoint.startsWith("/labour") && !endpoint.includes("/request") && !endpoint.includes("/my-applications") && !endpoint.includes("/matches")) {
      const list = getStoredList("krishi_labourers", SEED_DATA.labourers);
      return { totalCount: list.length, labourers: list };
    }

    // 7. Get Labour Matches (/labour/matches)
    if (endpoint.startsWith("/labour/matches")) {
      return { totalMatched: SEED_DATA.labourers.length, matches: SEED_DATA.labourers };
    }

    // 8. Hiring Requests (/labour/requests and /labour/request)
    if (endpoint === "/labour/requests") {
      const reqs = getStoredList("krishi_hiring_requests", [
        {
          id: "hire-sample-1",
          farmerName: "Ramesh Patil",
          farmerPhone: "+91 98231 45678",
          farmerLocation: "Niphad, Nashik",
          labourName: "Suresh Shinde",
          labourPhone: "+91 97654 32109",
          workType: "Harvesting",
          date: "2026-08-30",
          duration: 2,
          dailyWage: 500,
          totalCost: 1000,
          status: "Pending"
        }
      ]);
      return { requests: reqs };
    }

    if (endpoint === "/labour/request" && options.method === "POST") {
      const reqs = getStoredList("krishi_hiring_requests", []);
      const newReq = {
        id: `hire-${Date.now()}`,
        ...body,
        status: "Pending",
        createdAt: new Date().toISOString()
      };
      reqs.unshift(newReq);
      setStoredList("krishi_hiring_requests", reqs);
      return { message: "Hiring request sent successfully", request: newReq };
    }

    // 9. Labour Requirements
    if (endpoint.startsWith("/labour-requirements")) {
      return { requirements: SEED_DATA.labourRequirements || [] };
    }

    // 10. Machinery
    if (endpoint.startsWith("/machinery")) {
      return { machinery: SEED_DATA.machinery || [] };
    }

    // 11. Schemes
    if (endpoint.startsWith("/schemes")) {
      return { schemes: SEED_DATA.schemes || [] };
    }

    // 12. Market
    if (endpoint.startsWith("/market/prices")) {
      return { marketPrices: SEED_DATA.marketPrices || [] };
    }

    // 13. Notifications
    if (endpoint.startsWith("/notifications")) {
      return { notifications: SEED_DATA.notifications || [] };
    }

    // Default fallback
    return {};
  }

  // Auth Methods
  farmerRegister(payload) {
    return this.request("/auth/farmer/register", { method: "POST", body: JSON.stringify(payload) });
  }

  farmerLogin(payload) {
    return this.request("/auth/farmer/login", { method: "POST", body: JSON.stringify(payload) });
  }

  labourRegister(payload) {
    return this.request("/auth/labour/register", { method: "POST", body: JSON.stringify(payload) });
  }

  labourLogin(payload) {
    return this.request("/auth/labour/login", { method: "POST", body: JSON.stringify(payload) });
  }

  getCurrentUser() {
    return this.request("/auth/me");
  }

  // Farmer Profile
  getFarmerProfile() {
    return this.request("/farmer/profile");
  }

  updateFarmerProfile(payload) {
    return this.request("/farmer/profile", { method: "PUT", body: JSON.stringify(payload) });
  }

  // Labour
  getLabourers(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/labour${qs ? `?${qs}` : ''}`);
  }

  getLabourMatches(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/labour/matches${qs ? `?${qs}` : ''}`);
  }

  applyForJob(payload) {
    return this.request("/labour/apply", { method: "POST", body: JSON.stringify(payload) });
  }

  getMyLabourApplications() {
    return this.request("/labour/my-applications");
  }

  sendHiringRequest(payload) {
    return this.request("/labour/request", { method: "POST", body: JSON.stringify(payload) });
  }

  getHiringRequests() {
    return this.request("/labour/requests");
  }

  updateHiringRequestStatus(id, status) {
    return this.request(`/labour/request/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
  }

  updateLabourProfile(payload) {
    return this.request("/labour/profile", { method: "PUT", body: JSON.stringify(payload) });
  }

  // Labour Requirements
  getLabourRequirements(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/labour-requirements${qs ? `?${qs}` : ''}`);
  }

  getLabourRequirementById(id) {
    return this.request(`/labour-requirements/${id}`);
  }

  calculateLabourRequirement(payload) {
    return this.request("/labour-requirements/calculate", { method: "POST", body: JSON.stringify(payload) });
  }

  postLabourRequirement(payload) {
    return this.request("/labour-requirements", { method: "POST", body: JSON.stringify(payload) });
  }

  // Machinery
  getMachinery(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/machinery${qs ? `?${qs}` : ''}`);
  }

  getMachineryRecommendations(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/machinery/recommendations${qs ? `?${qs}` : ''}`);
  }

  bookMachinery(payload) {
    return this.request("/machinery/book", { method: "POST", body: JSON.stringify(payload) });
  }

  getMachineryBookings() {
    return this.request("/machinery/bookings");
  }

  // Schemes
  getSchemes(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/schemes${qs ? `?${qs}` : ''}`);
  }

  getRecommendedSchemes(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/schemes/recommended${qs ? `?${qs}` : ''}`);
  }

  getNewSchemeAlerts() {
    return this.request("/schemes/new");
  }

  // Market
  getMarketPrices(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/market/prices${qs ? `?${qs}` : ''}`);
  }

  getMarketComparison(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/market/comparison${qs ? `?${qs}` : ''}`);
  }

  compareMarketScheme(payload) {
    return this.request("/market/scheme-compare", { method: "POST", body: JSON.stringify(payload) });
  }

  getHistoricalMarketTrends() {
    return this.request("/market/history");
  }

  getMarketPrediction(crop = "Soybean") {
    return this.request(`/market/prediction?crop=${encodeURIComponent(crop)}`);
  }

  // Advisory
  generateAdvisory(payload) {
    return this.request("/advisory/generate", { method: "POST", body: JSON.stringify(payload) });
  }

  getLatestAdvisory(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/advisory/latest${qs ? `?${qs}` : ''}`);
  }

  // Dashboards
  getFarmerDashboard() {
    return this.request("/dashboard/farmer");
  }

  getLabourDashboard() {
    return this.request("/dashboard/labour");
  }

  // Simulation & Notifications
  triggerSimulationTick() {
    return this.request("/simulation/tick", { method: "POST" });
  }

  getSimulationState() {
    return this.request("/simulation/state");
  }

  getNotifications() {
    return this.request("/notifications");
  }

  markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, { method: "PUT" });
  }

  markAllNotificationsRead() {
    return this.request("/notifications/read-all", { method: "PUT" });
  }

  // Database Resilience & Offline Recovery Simulation
  getDbHealth() {
    return this.request("/simulation/db-health");
  }

  toggleDbFailure() {
    return this.request("/simulation/toggle-db-failure", { method: "POST" });
  }

  restoreDb() {
    return this.request("/simulation/restore-db", { method: "POST" });
  }

  replayPendingAction(action) {
    return this.request(action.endpoint, {
      method: action.method || "POST",
      body: JSON.stringify(action.payload),
      headers: action.token ? { Authorization: `Bearer ${action.token}` } : {}
    });
  }
}

export const api = new ApiService();
