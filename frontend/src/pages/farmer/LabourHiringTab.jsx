import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useOfflineSync } from "../../context/OfflineSyncContext";
import { api } from "../../services/api";
import { 
  Users, 
  Search, 
  MapPin, 
  Phone, 
  IndianRupee, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  X, 
  PhoneCall, 
  Briefcase, 
  ShieldCheck, 
  Sparkles,
  Send,
  AlertCircle,
  HardDrive
} from "lucide-react";

export const LabourHiringTab = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { executeWithOfflineSupport } = useOfflineSync();
  const [labourers, setLabourers] = useState([]);
  const [hiringRequests, setHiringRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("find"); // "find" | "requests"

  // Search & Role Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  // Contact Modal State
  const [contactModalLabour, setContactModalLabour] = useState(null);

  // Hire Modal State
  const [hireModalLabour, setHireModalLabour] = useState(null);
  const [hireForm, setHireForm] = useState({
    workType: "Harvesting",
    date: new Date().toISOString().split("T")[0],
    duration: 1,
    notes: ""
  });
  const [submittingHire, setSubmittingHire] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const farmerVillage = user?.location?.village || "Niphad";
  const farmerDistrict = user?.location?.district || "Nashik";

  const ROLE_FILTERS = [
    { id: "All", label: t("labour.allWorkers", "All Workers"), icon: "👥" },
    { id: "Harvesting", label: t("labour.harvesting", "Harvesting"), icon: "🌾" },
    { id: "Planting", label: t("labour.planting", "Planting / Sowing"), icon: "🌱" },
    { id: "Spraying", label: t("labour.spraying", "Spraying"), icon: "🚿" },
    { id: "Weeding", label: t("labour.weeding", "Weeding"), icon: "🌿" },
    { id: "Farm Helper", label: t("labour.helper", "Farm Helper"), icon: "🧑‍🌾" }
  ];

  // Fetch Labourers and Hiring Requests from backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const [labourRes, reqsRes] = await Promise.all([
        api.getLabourers().catch(() => ({ labourers: [] })),
        api.getHiringRequests().catch(() => ({ requests: [] }))
      ]);

      setLabourers(labourRes.labourers || []);
      setHiringRequests(reqsRes.requests || []);
    } catch (err) {
      console.error("Error loading labour data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle opening Hire Modal
  const openHireModal = (labour) => {
    setHireModalLabour(labour);
    setHireForm({
      workType: labour.skills?.[0] || "Harvesting",
      date: new Date().toISOString().split("T")[0],
      duration: 1,
      notes: `Hiring for farm work in ${farmerVillage}, ${farmerDistrict}`
    });
  };

  // Submit Hire Request to Backend
  const handleSendHireRequest = async (e) => {
    e.preventDefault();
    if (!hireModalLabour) return;

    setSubmittingHire(true);
    try {
      const dailyWage = hireModalLabour.expectedDailyWage || hireModalLabour.dailyWage || 450;
      const duration = parseInt(hireForm.duration) || 1;
      const totalCost = dailyWage * duration;

      const hirePayload = {
        labourId: hireModalLabour.id,
        workType: hireForm.workType,
        date: hireForm.date,
        duration: duration,
        dailyWage: dailyWage,
        totalCost: totalCost,
        notes: hireForm.notes
      };

      const res = await executeWithOfflineSupport({
        type: "HIRING_REQUEST",
        title: `Hire ${hireModalLabour.name} (${hireForm.workType})`,
        endpoint: "/labour/request",
        payload: hirePayload,
        directApiCall: () => api.sendHiringRequest(hirePayload)
      });

      if (res.isOfflineQueued) {
        setToastMessage(`💾 Queued offline: Hiring request for ${hireModalLabour.name} saved!`);
      } else {
        setToastMessage(`🤝 Hiring request sent to ${hireModalLabour.name}! Worker will accept or call you.`);
      }
      setHireModalLabour(null);
      
      // Refresh requests list
      const reqsRes = await api.getHiringRequests().catch(() => ({ requests: [] }));
      setHiringRequests(reqsRes.requests || []);
    } catch (err) {
      alert("Failed to send hiring request: " + err.message);
    } finally {
      setSubmittingHire(false);
    }
  };

  // Filter labourers by search query and role filter
  const filteredLabourers = labourers.filter((labour) => {
    // 1. Role Filter
    if (selectedRole !== "All") {
      const matchesRole = (
        (labour.role && labour.role.toLowerCase().includes(selectedRole.toLowerCase())) ||
        (labour.skills && labour.skills.some(s => s.toLowerCase().includes(selectedRole.toLowerCase())))
      );
      if (!matchesRole) return false;
    }

    // 2. Search Query (Name, Village, District, Role)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = labour.name && labour.name.toLowerCase().includes(q);
      const matchVillage = labour.village && labour.village.toLowerCase().includes(q);
      const matchLocation = labour.location && labour.location.toLowerCase().includes(q);
      const matchRole = (labour.role && labour.role.toLowerCase().includes(q)) ||
                        (labour.skills && labour.skills.some(s => s.toLowerCase().includes(q)));
      return matchName || matchVillage || matchLocation || matchRole;
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-12 font-sans max-w-5xl mx-auto">
      {/* 1. TOP HEADER SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">👷</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
              {t("labour.title", "FARM LABOUR")}
            </h1>
          </div>
          <p className="text-sm font-semibold text-slate-600 mt-1">
            {t("labour.subtitle", "Find available workers near your farm")}
          </p>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mt-2 w-fit">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>📍 {farmerVillage}, {farmerDistrict}</span>
          </div>
        </div>

        {/* Tab Toggle: Find Labour vs My Hiring Requests */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("find")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "find"
                ? "bg-emerald-700 text-white shadow-sm font-extrabold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t("labour.findWorkers", "Find Workers")} ({filteredLabourers.length})
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "requests"
                ? "bg-emerald-700 text-white shadow-sm font-extrabold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>{t("labour.myRequests", "My Hiring Requests")}</span>
            {hiringRequests.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black flex items-center justify-center">
                {hiringRequests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Toast Alert Message */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage("")}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* VIEW 1: FIND AVAILABLE LABOUR */}
      {activeTab === "find" && (
        <div className="space-y-5">
          {/* SEARCH & QUICK ROLE PILLS */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder={t("labour.searchPlaceholder", "🔍 Search by name / village / role (e.g. Ramesh, Niphad, Harvesting)...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium bg-slate-50/70"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Role Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {ROLE_FILTERS.map((f) => {
                const isSelected = selectedRole === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedRole(f.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    <span>{f.icon}</span>
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LABOUR CARDS LIST */}
          {loading ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-500">{t("common.loading", "Loading available farm workers...")}</p>
            </div>
          ) : filteredLabourers.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <div className="text-4xl mb-2">🧑‍🌾</div>
              <h3 className="font-bold text-base text-slate-800">No Workers Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                No workers currently match "{searchQuery || selectedRole}". Try selecting "All Workers" or clearing your search.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRole("All");
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-sm"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {filteredLabourers.map((labour) => {
                const roleDisplay = labour.role || labour.skills?.slice(0, 2).join(", ") || "Harvesting Worker";
                const wage = labour.expectedDailyWage || labour.dailyWage || 450;
                const village = labour.village || labour.location?.split(",")?.[0] || "Niphad";

                return (
                  <div
                    key={labour.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
                  >
                    {/* Card Top: Name & Availability */}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 font-black text-xl flex items-center justify-center shadow-inner">
                            👨‍🌾
                          </div>
                          <div>
                            <h3 className="font-black text-base text-slate-900 font-display">
                              {labour.name}
                            </h3>
                            <p className="text-xs font-semibold text-slate-500">
                              {labour.preferredWorkArea ? `📍 ${labour.preferredWorkArea}` : "Verified Agricultural Worker"}
                            </p>
                          </div>
                        </div>

                        {/* Availability Pill */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>🟢 {labour.availability || t("common.immediate", "Available")}</span>
                        </div>
                      </div>

                      {/* Card Details: Village, Phone, Role, Daily Wage */}
                      <div className="space-y-1.5 pt-2 pb-3 text-xs font-medium text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 w-24">📍 {t("labour.village", "Village")}:</span>
                          <span className="text-slate-800 font-semibold">{village}, {farmerDistrict}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 w-24">📞 {t("labour.phone", "Phone")}:</span>
                          <span className="text-slate-800 font-mono font-bold tracking-wide">
                            {labour.phone ? labour.phone.slice(0, 8) + "XXXX" : "98765 XXXXX"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 w-24">🧑‍🌾 {t("labour.role", "Role")}:</span>
                          <span className="text-emerald-900 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            {roleDisplay}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 w-24">💰 {t("labour.dailyWage", "Daily Wage")}:</span>
                          <span className="text-emerald-700 font-black text-sm">
                            ₹{wage}{t("common.perDay", "/day")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions: [ 📞 CONTACT ] and [ 🤝 HIRE ] */}
                    <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100 mt-2">
                      <button
                        onClick={() => setContactModalLabour(labour)}
                        className="w-full py-2.5 px-3 rounded-2xl border-2 border-slate-300 hover:border-emerald-600 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t("labour.contact", "CONTACT")}</span>
                      </button>

                      <button
                        onClick={() => openHireModal(labour)}
                        className="w-full py-2.5 px-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-700/30 hover:scale-[1.02]"
                      >
                        <span>🤝 {t("labour.hire", "HIRE")}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: MY HIRING REQUESTS */}
      {activeTab === "requests" && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Sent Hiring Requests
            </h2>
            <span className="text-xs font-bold text-slate-500">
              Total: {hiringRequests.length}
            </span>
          </div>

          {hiringRequests.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-3xl mb-1">📋</div>
              <p className="text-xs font-bold text-slate-600">No hiring requests sent yet.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Click "Hire" on any available worker card to send a direct job offer.</p>
              <button
                onClick={() => setActiveTab("find")}
                className="mt-3 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"
              >
                Browse Workers
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {hiringRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base">👨‍🌾</span>
                      <span className="font-bold text-sm text-slate-900">{req.labourName}</span>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        req.status === "Accepted"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : req.status === "Rejected"
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span>🌱 Work: <strong>{req.workType}</strong></span>
                      <span>📅 Date: <strong>{req.date}</strong></span>
                      <span>⏱️ Duration: <strong>{req.duration} Days</strong></span>
                      <span>💰 Total: <strong className="text-emerald-700 font-bold">₹{req.totalCost}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <a
                      href={`tel:${req.labourPhone}`}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-emerald-50 text-slate-700 text-xs font-bold flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Call Worker</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. CONTACT MODAL */}
      {contactModalLabour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 text-2xl flex items-center justify-center mx-auto shadow-inner">
              📞
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 font-display">
                Contact {contactModalLabour.name}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Call the labour directly on their registered phone number?
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold uppercase text-slate-400">Registered Phone</div>
              <div className="text-base font-black text-slate-900 font-mono mt-0.5">
                {contactModalLabour.phone || "+91 98765 43210"}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                📍 {contactModalLabour.village || contactModalLabour.location || "Niphad, Nashik"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setContactModalLabour(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>

              <a
                href={`tel:${contactModalLabour.phone || "+919876543210"}`}
                onClick={() => setContactModalLabour(null)}
                className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/30"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 4. HIRE MODAL ⭐ */}
      {hireModalLabour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 sm:p-7 space-y-5 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤝</span>
                <h3 className="text-lg font-black text-slate-900 font-display">
                  Hire {hireModalLabour.name}
                </h3>
              </div>
              <button
                onClick={() => setHireModalLabour(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendHireRequest} className="space-y-4">
              {/* Work Required */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  🌱 Work Required:
                </label>
                <select
                  value={hireForm.workType}
                  onChange={(e) => setHireForm({ ...hireForm, workType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {WORK_TYPES.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  📅 Start Date:
                </label>
                <input
                  type="date"
                  required
                  value={hireForm.date}
                  onChange={(e) => setHireForm({ ...hireForm, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              {/* Duration Days */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  ⏱️ Duration (Days):
                </label>
                <select
                  value={hireForm.duration}
                  onChange={(e) => setHireForm({ ...hireForm, duration: parseInt(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value={1}>1 Day</option>
                  <option value={2}>2 Days</option>
                  <option value={3}>3 Days</option>
                  <option value={5}>5 Days</option>
                  <option value={7}>1 Week (7 Days)</option>
                  <option value={15}>15 Days (Seasonal)</option>
                </select>
              </div>

              {/* Estimated Total Calculation */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase text-emerald-800">
                    Daily Rate: ₹{hireModalLabour.expectedDailyWage || hireModalLabour.dailyWage || 450}/day
                  </div>
                  <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                    {hireForm.duration} Day(s) work
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase text-emerald-800">Estimated Total</div>
                  <div className="text-lg font-black text-emerald-900 font-display">
                    ₹{(hireModalLabour.expectedDailyWage || hireModalLabour.dailyWage || 450) * hireForm.duration}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setHireModalLabour(null)}
                  className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingHire}
                  className="py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingHire ? "Sending..." : "SEND REQUEST"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
