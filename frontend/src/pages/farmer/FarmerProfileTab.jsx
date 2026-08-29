import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { User, MapPin, Sprout, Save, CheckCircle2, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";

export const FarmerProfileTab = () => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    village: user?.location?.village || "",
    district: user?.location?.district || "",
    state: user?.location?.state || "",
    farmName: user?.farm?.name || "",
    farmSize: user?.farm?.sizeAcres || "5",
    primaryCrop: user?.farm?.primaryCrop || "Soybean",
    secondaryCrop: user?.farm?.secondaryCrop || "Wheat",
    soilType: user?.farm?.soilType || "Medium Black Soil",
    irrigationSource: user?.farm?.irrigationSource || "Drip & Tube Well"
  });

  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedMessage("");
    try {
      const res = await api.updateFarmerProfile({
        name: formData.name,
        phone: formData.phone,
        location: {
          village: formData.village,
          district: formData.district,
          state: formData.state
        },
        farm: {
          ...user.farm,
          name: formData.farmName,
          sizeAcres: parseFloat(formData.farmSize),
          primaryCrop: formData.primaryCrop,
          secondaryCrop: formData.secondaryCrop,
          soilType: formData.soilType,
          irrigationSource: formData.irrigationSource
        }
      });

      updateUserProfile(res.farmer);
      confetti({ particleCount: 40, spread: 60 });
      setSavedMessage("Farmer profile and farm parameters updated successfully!");
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
            Farmer Profile & Farm Records
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-1">Farm Account Details</h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Aadhaar DBT Profile</span>
        </div>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{savedMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        {/* Personal Details */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Farmer Personal Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Email</label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 text-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Geographic Location</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Village / Town</label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">District</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Farm & Agronomic Parameters */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Farm Holding & Agronomy</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Farm Name</label>
              <input
                type="text"
                name="farmName"
                value={formData.farmName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Farm Size (Acres)</label>
              <input
                type="number"
                step="0.1"
                name="farmSize"
                value={formData.farmSize}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Primary Crop</label>
              <select
                name="primaryCrop"
                value={formData.primaryCrop}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white"
              >
                <option value="Soybean">Soybean</option>
                <option value="Wheat">Wheat</option>
                <option value="Cotton">Cotton</option>
                <option value="Onion">Onion</option>
                <option value="Tomato">Tomato</option>
                <option value="Rice">Rice (Paddy)</option>
                <option value="Sugarcane">Sugarcane</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Secondary Crop</label>
              <input
                type="text"
                name="secondaryCrop"
                value={formData.secondaryCrop}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Soil Type</label>
              <input
                type="text"
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Irrigation Source</label>
              <input
                type="text"
                name="irrigationSource"
                value={formData.irrigationSource}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-2xl bg-agri-600 hover:bg-agri-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Farm Records"}</span>
        </button>
      </form>
    </div>
  );
};
