const API_BASE = "/api";

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

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `HTTP Error ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (err) {
      console.error(`API Request Error [${endpoint}]:`, err);
      throw err;
    }
  }

  // Auth
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
}

export const api = new ApiService();
