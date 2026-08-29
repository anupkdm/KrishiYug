import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { User, Phone, MapPin, IndianRupee, Save, CheckCircle2, ShieldCheck, Check } from "lucide-react";
import confetti from "canvas-confetti";

export const LabourProfileTab = () => {
  const { user, updateUserProfile } = useAuth();

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
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    preferredWorkArea: user?.preferredWorkArea || "",
    skills: user?.skills || ["General Farm Labour"],
    experienceYears: user?.experienceYears || "1",
    availability: user?.availability || "Immediate",
    expectedDailyWage: user?.expectedDailyWage || "450",
    bio: user?.bio || ""
  });

  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg("");
    try {
      const res = await api.updateLabourProfile({
        ...formData,
        experienceYears: parseInt(formData.experienceYears),
        expectedDailyWage: parseFloat(formData.expectedDailyWage)
      });
      updateUserProfile(res.labour);
      confetti({ particleCount: 40, spread: 60 });
      setSavedMsg("Agricultural labour profile updated successfully!");
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
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full">
            Labour Profile & Skills
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-1">My Agricultural Profile</h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Farm Labour Badge</span>
        </div>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{savedMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Basic Information</h3>
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Phone</label>
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

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Location & Work Areas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Primary Village / District</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Preferred Talukas / Work Zones</label>
              <input
                type="text"
                name="preferredWorkArea"
                value={formData.preferredWorkArea}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Skills & Capabilities</h3>
          <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
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

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Rates & Availability</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Experience (Years)</label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Expected Daily Wage (₹)</label>
              <input
                type="number"
                step="20"
                name="expectedDailyWage"
                value={formData.expectedDailyWage}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Availability Status</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white"
              >
                <option value="Immediate">Immediate</option>
                <option value="This Week">This Week</option>
                <option value="Next Week">Next Week</option>
                <option value="Part-time">Part-time</option>
                <option value="Seasonal">Seasonal</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Bio / Past Farm Achievements</label>
            <textarea
              rows="3"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Profile..." : "Save Labour Profile"}</span>
        </button>
      </form>
    </div>
  );
};
