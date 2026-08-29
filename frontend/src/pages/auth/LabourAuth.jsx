import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { LanguageSelector } from "../../components/common/LanguageSelector";
import { ArrowLeft, Lock, Mail, User, Phone, MapPin, Briefcase, IndianRupee, Check } from "lucide-react";
import confetti from "canvas-confetti";

export const LabourAuth = ({ initialMode = "login", onBack, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(initialMode === "register");
  const { labourLogin, labourRegister, error } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const WORK_CATEGORIES = [
    "Sowing",
    "Harvesting",
    "Irrigation",
    "Weeding",
    "Fertilizer Application",
    "Pesticide Application",
    "Ploughing",
    "Crop Maintenance",
    "Fruit Picking",
    "Vegetable Harvesting",
    "Machinery Operator",
    "Drone Operator",
    "General Farm Labour",
    "Other"
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "Nashik, Maharashtra",
    preferredWorkArea: "Nashik, Niphad, Dindori",
    skills: ["Harvesting", "Crop Maintenance"],
    experienceYears: "5",
    availability: "Immediate",
    expectedDailyWage: "450",
    bio: "Experienced agricultural labourer ready for seasonal farm work."
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    try {
      if (isRegister) {
        if (!formData.name || !formData.email || !formData.password || formData.skills.length === 0) {
          throw new Error("Please provide your name, email, password, and at least one skill.");
        }
        await labourRegister(formData);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } else {
        if (!formData.email || !formData.password) {
          throw new Error("Please enter your email and password.");
        }
        await labourLogin({ email: formData.email, password: formData.password });
      }
      onSuccess?.();
    } catch (err) {
      setFormError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
        {/* Header */}
        <div className="harvest-gradient p-6 text-white text-center relative">
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
            🛠️
          </div>
          <h2 className="text-2xl font-bold font-display">{t("auth.labourPortalTitle")}</h2>
          <p className="text-xs text-amber-100 mt-1">
            {isRegister ? t("auth.labourRegisterSubtitle") : t("auth.labourLoginSubtitle")}
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {t("auth.phoneNumber")} *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        name="phone"
                        required
                        placeholder="+91 98601 00000"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {t("auth.district")} *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        name="location"
                        required
                        placeholder={t("auth.districtPlaceholder")}
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferred Work Area */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    {t("auth.preferredWorkArea")}
                  </label>
                  <input
                    type="text"
                    name="preferredWorkArea"
                    placeholder={t("auth.preferredWorkAreaPlaceholder")}
                    value={formData.preferredWorkArea}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium"
                  />
                </div>

                {/* Work Categories / Skills Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t("auth.skillsTitle")} *
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 max-h-36 overflow-y-auto">
                    {WORK_CATEGORIES.map((cat) => {
                      const isSelected = formData.skills.includes(cat);
                      return (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => handleSkillToggle(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            isSelected
                              ? "bg-amber-600 text-white shadow-sm font-bold"
                              : "bg-white text-slate-700 border border-slate-200 hover:border-amber-300"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          <span>{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Experience, Availability, Expected Wage */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {t("auth.experience")}
                    </label>
                    <input
                      type="number"
                      name="experienceYears"
                      min="0"
                      value={formData.experienceYears}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {t("auth.availability")}
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium bg-white"
                    >
                      <option value="Immediate">{t("common.immediate")}</option>
                      <option value="This Week">{t("common.thisWeek")}</option>
                      <option value="Next Week">{t("common.nextWeek")}</option>
                      <option value="Part-time">{t("common.partTime")}</option>
                      <option value="Seasonal">{t("common.seasonal")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {t("auth.expectedDailyWage")}
                    </label>
                    <input
                      type="number"
                      name="expectedDailyWage"
                      step="50"
                      value={formData.expectedDailyWage}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium"
                    />
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
                  placeholder="labour@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium"
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? t("common.loading") : isRegister ? t("auth.labourRegisterBtn") : t("auth.labourLoginBtn")}
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
                  className="font-bold text-amber-700 hover:underline"
                >
                  {t("auth.loginHere")}
                </button>
              </p>
            ) : (
              <p>
                {t("auth.newUserLabour")}{" "}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="font-bold text-amber-700 hover:underline"
                >
                  {t("auth.createLabourAccount")}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

