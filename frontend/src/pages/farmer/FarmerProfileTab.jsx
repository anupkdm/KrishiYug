import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useOfflineSync } from "../../context/OfflineSyncContext";
import { api } from "../../services/api";
import { 
  User, 
  MapPin, 
  Sprout, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Edit3, 
  X, 
  Phone, 
  Mail, 
  Layers, 
  Droplets, 
  Calendar,
  Sparkles,
  HardDrive
} from "lucide-react";

export const FarmerProfileTab = () => {
  const { user, updateUserProfile } = useAuth();
  const { t } = useLanguage();
  const { executeWithOfflineSupport } = useOfflineSync();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    village: "",
    district: "",
    state: "",
    farmName: "",
    farmSize: "5",
    primaryCrop: "Soybean",
    secondaryCrop: "Wheat",
    soilType: "Medium Black Soil",
    irrigationSource: "Drip & Open Well",
    kisanCreditCard: "Active (₹3,00,000 limit)",
    soilHealthScore: "84/100 (Optimal)",
    aadhaarStatus: "DBT Linked",
    pmKisanStatus: "Active (16th Installment Received)",
    soilN: "180 kg/ha (Medium)",
    soilP: "24 kg/ha (Good)",
    soilK: "260 kg/ha (High)",
    soilPH: "6.8 (Neutral)",
    organicCarbon: "0.62% (Moderate)",
    weatherZone: "Western Agro-Climatic Zone",
    annualRainfall: "850 mm (Average)",
    sowingSeason: "Kharif (June - October)",
    harvestExpected: "Late October"
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "+91 98220 12345",
        village: user.location?.village || user.village || "Niphad",
        district: user.location?.district || user.district || "Nashik",
        state: user.location?.state || user.state || "Maharashtra",
        farmName: user.farm?.farmName || "Patil Krishi Farm",
        farmSize: user.farm?.size || user.farmSize || "8.5",
        primaryCrop: user.farm?.primaryCrop || user.primaryCrop || "Soybean",
        secondaryCrop: user.farm?.secondaryCrop || user.secondaryCrop || "Wheat",
        soilType: user.farm?.soilType || user.soilType || "Medium Black Soil",
        irrigationSource: user.farm?.irrigationSource || user.irrigationSource || "Drip & Tube Well",
        kisanCreditCard: user.kisanCreditCard || "Active (₹3,00,000 limit)",
        soilHealthScore: user.soilHealthScore || "84/100 (Optimal)",
        aadhaarStatus: "DBT Linked",
        pmKisanStatus: user.pmKisanStatus || "Active (16th Installment Received)",
        soilN: user.soilN || "180 kg/ha (Medium)",
        soilP: user.soilP || "24 kg/ha (Good)",
        soilK: user.soilK || "260 kg/ha (High)",
        soilPH: user.soilPH || "6.8 (Neutral)",
        organicCarbon: user.organicCarbon || "0.62% (Moderate)",
        weatherZone: user.weatherZone || "Western Agro-Climatic Zone",
        annualRainfall: user.annualRainfall || "850 mm (Average)",
        sowingSeason: user.sowingSeason || "Kharif (June - October)",
        harvestExpected: user.harvestExpected || "Late October"
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "+91 98220 12345",
        village: user.location?.village || user.village || "Niphad",
        district: user.location?.district || user.district || "Nashik",
        state: user.location?.state || user.state || "Maharashtra",
        farmName: user.farm?.farmName || "Patil Krishi Farm",
        farmSize: user.farm?.size || user.farmSize || "8.5",
        primaryCrop: user.farm?.primaryCrop || user.primaryCrop || "Soybean",
        secondaryCrop: user.farm?.secondaryCrop || user.secondaryCrop || "Wheat",
        soilType: user.farm?.soilType || user.soilType || "Medium Black Soil",
        irrigationSource: user.farm?.irrigationSource || user.irrigationSource || "Drip & Tube Well",
        kisanCreditCard: user.kisanCreditCard || "Active (₹3,00,000 limit)",
        soilHealthScore: user.soilHealthScore || "84/100 (Optimal)",
        aadhaarStatus: "DBT Linked",
        pmKisanStatus: user.pmKisanStatus || "Active (16th Installment Received)",
        soilN: user.soilN || "180 kg/ha (Medium)",
        soilP: user.soilP || "24 kg/ha (Good)",
        soilK: user.soilK || "260 kg/ha (High)",
        soilPH: user.soilPH || "6.8 (Neutral)",
        organicCarbon: user.organicCarbon || "0.62% (Moderate)",
        weatherZone: user.weatherZone || "Western Agro-Climatic Zone",
        annualRainfall: user.annualRainfall || "850 mm (Average)",
        sowingSeason: user.sowingSeason || "Kharif (June - October)",
        harvestExpected: user.harvestExpected || "Late October"
      });
    }
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedMessage("");

    const updatePayload = {
      name: formData.name,
      phone: formData.phone,
      location: {
        village: formData.village,
        district: formData.district,
        state: formData.state
      },
      farm: {
        farmName: formData.farmName,
        size: parseFloat(formData.farmSize) || 5,
        primaryCrop: formData.primaryCrop,
        secondaryCrop: formData.secondaryCrop,
        soilType: formData.soilType,
        irrigationSource: formData.irrigationSource
      }
    };

    try {
      const res = await executeWithOfflineSupport({
        type: "FARMER_PROFILE_UPDATE",
        title: `Update Profile: ${formData.name}`,
        endpoint: "/farmer/profile",
        method: "PUT",
        payload: updatePayload,
        directApiCall: () => api.updateFarmerProfile(updatePayload)
      });

      if (res.isOfflineQueued) {
        // Apply locally for seamless UX
        const localUpdated = {
          ...user,
          ...updatePayload,
          location: { ...(user?.location || {}), ...updatePayload.location },
          farm: { ...(user?.farm || {}), ...updatePayload.farm }
        };
        updateUserProfile(localUpdated);
        setSavedMessage("💾 Profile saved locally in IndexedDB! Will sync when database restores.");
      } else {
        const updatedFarmer = res.result?.farmer || res.result?.user || updatePayload;
        updateUserProfile(updatedFarmer);
        setSavedMessage("✅ Farmer profile and farm records updated successfully!");
      }

      setIsEditing(false);
      setTimeout(() => setSavedMessage(""), 5000);
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 font-sans">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-emerald-500/20">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 font-display">
                  {user?.name || formData.name || "Farmer Account"}
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Active Farmer
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{formData.village || "Niphad"}, {formData.district || "Nashik"}, {formData.state || "Maharashtra"}</span>
                <span>•</span>
                <span>{formData.farmSize || "5"} Acres</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Primary Crop</span>
            <span className="text-sm font-black text-slate-800 mt-0.5 block">{formData.primaryCrop || "Soybean"}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Farm Size</span>
            <span className="text-sm font-black text-slate-800 mt-0.5 block">{formData.farmSize || "5"} Acres</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Soil Category</span>
            <span className="text-sm font-black text-slate-800 mt-0.5 block truncate">{formData.soilType || "Medium Black"}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Irrigation</span>
            <span className="text-sm font-black text-slate-800 mt-0.5 block truncate">{formData.irrigationSource || "Drip / Well"}</span>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between gap-3 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{savedMessage}</span>
          </div>
          <button onClick={() => setSavedMessage("")} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Profile Form / View Card */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        {/* Section 1: Farmer Personal Info */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Farmer Personal Information
              </h3>
            </div>
            {!isEditing && (
              <span className="text-[11px] font-semibold text-slate-400">Read Only</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                disabled={!isEditing}
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Ramesh Patil"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isEditing 
                    ? "border-emerald-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                    : "border-slate-200 bg-slate-50 text-slate-700 cursor-not-allowed"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                disabled={!isEditing}
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 98231 45678"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isEditing 
                    ? "border-emerald-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                    : "border-slate-200 bg-slate-50 text-slate-700 cursor-not-allowed"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Geographic Location */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Geographic Location & Region
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Village / Town
              </label>
              <input
                type="text"
                name="village"
                disabled={!isEditing}
                value={formData.village}
                onChange={handleChange}
                placeholder="e.g. Niphad"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isEditing 
                    ? "border-emerald-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                    : "border-slate-200 bg-slate-50 text-slate-700 cursor-not-allowed"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                District
              </label>
              <input
                type="text"
                name="district"
                disabled={!isEditing}
                value={formData.district}
                onChange={handleChange}
                placeholder="e.g. Nashik"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isEditing 
                    ? "border-emerald-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                    : "border-slate-200 bg-slate-50 text-slate-700 cursor-not-allowed"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                State
              </label>
              <input
                type="text"
                name="state"
                disabled={!isEditing}
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Maharashtra"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isEditing 
                    ? "border-emerald-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                    : "border-slate-200 bg-slate-50 text-slate-700 cursor-not-allowed"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Farm & Agronomy Records */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Farm & Agronomy Records
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Farm Name / Title
              </label>
              <input
                type="text"
                name="farmName"
                disabled={!isEditing}
                value={formData.farmName}
                onChange={handleChange}
                placeholder="e.g. Patil Organic Farm"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isEditing 
                    ? "border-emerald-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                    : "border-slate-200 bg-slate-50 text-slate-700 cursor-not-allowed"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Farm Size (Acres)
              </label>
              <input
                type="number"
                step="0.1"
                name="farmSize"
                disabled={!isEditing}
                value={formData.farmSize}
                onChange={handleChange}
                placeholder="e.g. 8.5"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isEditing 
                    ? "border-emerald-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                    : "border-slate-200 bg-slate-50 text-slate-700 cursor-not-allowed"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Primary Kharif / Rabi Crop
              </label>
              {isEditing ? (
                <select
                  name="primaryCrop"
                  value={formData.primaryCrop}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Wheat">Wheat (गहू)</option>
                  <option value="Cotton">Cotton (कापूस)</option>
                  <option value="Onion">Onion (कांदा)</option>
                  <option value="Tomato">Tomato (टोमॅटो)</option>
                  <option value="Grapes">Grapes (द्राक्षे)</option>
                  <option value="Pomegranate">Pomegranate (डाळिंब)</option>
                  <option value="Rice">Rice / Paddy (भात)</option>
                  <option value="Sugarcane">Sugarcane (ऊस)</option>
                  <option value="Maize">Maize (मका)</option>
                </select>
              ) : (
                <input
                  type="text"
                  disabled
                  value={formData.primaryCrop}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 cursor-not-allowed"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Secondary / Intercrop
              </label>
              <input
                type="text"
                name="secondaryCrop"
                disabled={!isEditing}
                value={formData.secondaryCrop}
                onChange={handleChange}
                placeholder="e.g. Wheat, Gram, Vegetables"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isEditing 
                    ? "border-emerald-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                    : "border-slate-200 bg-slate-50 text-slate-700 cursor-not-allowed"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Soil Classification
              </label>
              {isEditing ? (
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="Medium Black Soil">Medium Black Soil (मध्यम काळी माती)</option>
                  <option value="Deep Black Soil">Deep Black Soil (भारी काळी माती)</option>
                  <option value="Red Laterite Soil">Red Laterite Soil (तांबडी माती)</option>
                  <option value="Alluvial Soil">Alluvial Soil (गाळाची माती)</option>
                  <option value="Sandy Loam">Sandy Loam (वालुकामय पोयटा)</option>
                </select>
              ) : (
                <input
                  type="text"
                  disabled
                  value={formData.soilType}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 cursor-not-allowed"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Irrigation Infrastructure
              </label>
              {isEditing ? (
                <select
                  name="irrigationSource"
                  value={formData.irrigationSource}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="Drip & Tube Well">Drip & Tube Well (ठिबक व कूपनलिका)</option>
                  <option value="Sprinkler Irrigation">Sprinkler Irrigation (तुषार सिंचन)</option>
                  <option value="Open Well & Canal">Open Well & Canal (विहीर व कालवा)</option>
                  <option value="Farm Pond (Shet Tale)">Farm Pond / Shet Tale (शेततळे)</option>
                  <option value="Rainfed (Monsoon Dependent)">Rainfed / Monsoon Dependent (जिरायत)</option>
                </select>
              ) : (
                <input
                  type="text"
                  disabled
                  value={formData.irrigationSource}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 cursor-not-allowed"
                />
              )}
            </div>
          </div>
        </div>

        {/* Form Action Buttons (When Editing) */}
        {isEditing && (
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3 animate-in fade-in duration-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save Farm Records"}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
