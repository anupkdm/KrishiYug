import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { LanguageSelector } from "../../components/common/LanguageSelector";
import { Sprout, ArrowLeft, Lock, Mail, User, Phone, MapPin, Layers, CheckCircle2 } from "lucide-react";

export const FarmerAuth = ({ initialMode = "login", onBack, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(initialMode === "register");
  const { farmerLogin, farmerRegister, error } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    village: "Niphad",
    district: "Nashik",
    state: "Maharashtra",
    region: "Western Agro-Zone",
    farmSize: "8.5",
    primaryCrop: "Soybean",
    secondaryCrop: "Wheat",
    soilType: "Medium Black Soil",
    irrigationSource: "Drip & Tube Well"
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    try {
      if (isRegister) {
        if (!formData.name || !formData.email || !formData.password || !formData.district) {
          throw new Error("Please fill in all required registration fields.");
        }
        await farmerRegister(formData);
      } else {
        if (!formData.email || !formData.password) {
          throw new Error("Please provide your email and password.");
        }
        await farmerLogin({ email: formData.email, password: formData.password });
      }
      onSuccess?.();
    } catch (err) {
      setFormError(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
        {/* Header */}
        <div className="agri-gradient p-6 text-white text-center relative">
          <button
            onClick={onBack}
            className="absolute left-4 top-4 p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="absolute right-4 top-4">
            <LanguageSelector variant="dark" />
          </div>
          
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center text-2xl shadow-inner mb-2">
            🌾
          </div>
          <h2 className="text-2xl font-bold font-display">{t("auth.farmerPortalTitle")}</h2>
          <p className="text-xs text-emerald-100 mt-1">
            {isRegister ? t("auth.farmerRegisterSubtitle") : t("auth.farmerLoginSubtitle")}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {(formError || error) && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {formError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    {t("auth.fullName")} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder={t("auth.fullNamePlaceholder")}
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-agri-500 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {t("auth.phoneNumber")}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        name="phone"
                        placeholder="+91 98231 00000"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-agri-500 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {t("auth.farmSize")} *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="farmSize"
                      required
                      placeholder="8.5"
                      value={formData.farmSize}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-agri-500 text-xs font-medium"
                    />
                  </div>
                </div>

                {/* Location Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {t("auth.village")}
                    </label>
                    <input
                      type="text"
                      name="village"
                      placeholder={t("auth.villagePlaceholder")}
                      value={formData.village}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-agri-500 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {t("auth.district")} *
                    </label>
                    <input
                      type="text"
                      name="district"
                      required
                      placeholder={t("auth.districtPlaceholder")}
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-agri-500 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {t("auth.state")} *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-agri-500 text-xs font-medium bg-white"
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Haryana">Haryana</option>
                    </select>
                  </div>
                </div>

                {/* Crops */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {t("auth.primaryCrop")} *
                    </label>
                    <select
                      name="primaryCrop"
                      value={formData.primaryCrop}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-agri-500 text-xs font-medium bg-white"
                    >
                      <option value="Soybean">Soybean (सोयाबीन)</option>
                      <option value="Wheat">Wheat (गेहूं)</option>
                      <option value="Cotton">Cotton (कपास)</option>
                      <option value="Onion">Onion (कांदा / प्याज)</option>
                      <option value="Tomato">Tomato (टोमॅटो / टमाटर)</option>
                      <option value="Rice">Rice (भात / धान)</option>
                      <option value="Sugarcane">Sugarcane (ऊस / गन्ना)</option>
                      <option value="Maize">Maize (मका / मक्का)</option>
                      <option value="Potato">Potato (बटाटा / आलू)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {t("auth.secondaryCrop")}
                    </label>
                    <select
                      name="secondaryCrop"
                      value={formData.secondaryCrop}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-agri-500 text-xs font-medium bg-white"
                    >
                      <option value="Wheat">Wheat (गेहूं)</option>
                      <option value="Soybean">Soybean (सोयाबीन)</option>
                      <option value="Gram / Chickpea">Gram (हरभरा / चना)</option>
                      <option value="Onion">Onion (कांदा / प्याज)</option>
                      <option value="Vegetables">Vegetables (भाजीपाला / सब्जियां)</option>
                      <option value="Groundnut">Groundnut (भुईमूग / मूंगफली)</option>
                      <option value="Mustard">Mustard (मोहरी / सरसों)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Email & Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                {t("auth.email")} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="farmer@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-agri-500 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                {t("auth.password")} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-agri-500 text-xs font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? t("common.loading") : isRegister ? t("auth.farmerRegisterBtn") : t("auth.farmerLoginBtn")}
            </button>
          </form>

          {/* Toggle Register / Login */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            {isRegister ? (
              <p>
                {t("auth.alreadyHaveAccount")}{" "}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="font-bold text-emerald-700 hover:underline"
                >
                  {t("auth.loginHere")}
                </button>
              </p>
            ) : (
              <p>
                {t("auth.newUserFarmer")}{" "}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="font-bold text-emerald-700 hover:underline"
                >
                  {t("auth.createFarmerAccount")}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

