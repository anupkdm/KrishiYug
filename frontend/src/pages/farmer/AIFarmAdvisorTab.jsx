import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSimulation } from "../../context/SimulationContext";
import { api } from "../../services/api";
import { ScoreGauge } from "../../components/common/ScoreGauge";
import { Badge } from "../../components/common/Badge";
import { 
  BrainCircuit, 
  Droplets, 
  CloudRain, 
  Bug, 
  Sprout, 
  TrendingUp, 
  Users, 
  Tractor, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  Zap
} from "lucide-react";
import confetti from "canvas-confetti";

export const AIFarmAdvisorTab = () => {
  const { user } = useAuth();
  const { telemetry } = useSimulation();

  const [formInputs, setFormInputs] = useState({
    crop: user?.farm?.primaryCrop || "Soybean",
    growthStage: user?.farm?.cropStage || "Pod Filling & Maturation",
    soilMoisture: telemetry.soilMoisture || 42,
    soilType: user?.farm?.soilType || "Medium Black Soil (Vertisol)",
    farmLocation: user?.location ? `${user.location.village}, ${user.location.district}` : "Nashik, Maharashtra",
    temperature: telemetry.temperature || 28.5,
    humidity: telemetry.humidity || 74,
    rainfallProb: telemetry.rainfallProbNext24h || 65,
    recentRainfallMm: telemetry.recentRainfallMm || 12,
    irrigationType: user?.farm?.irrigationSource || "Drip & Tube Well",
    pestSymptoms: "Slight leaf edge curling and minor caterpillar observation",
    farmSize: user?.farm?.sizeAcres || 8.5
  });

  const [advisoryReport, setAdvisoryReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchAdvisory = async () => {
    setLoading(true);
    try {
      const res = await api.generateAdvisory(formInputs);
      setAdvisoryReport(res);
    } catch (err) {
      console.error("Advisory error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisory();
  }, [telemetry.soilMoisture, telemetry.temperature]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await api.generateAdvisory(formInputs);
      setAdvisoryReport(res);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      alert("Advisory generation failed: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const scores = advisoryReport?.scores || {};
  const adv = advisoryReport?.advisories || {};

  const submetrics = [
    { label: "Crop Health", score: scores.cropHealth || 88 },
    { label: "Water Management", score: scores.waterManagement || 85 },
    { label: "Weather Risk", score: scores.weatherRisk || 82 },
    { label: "Pest Risk", score: scores.pestRisk || 78 },
    { label: "Market Opportunity", score: scores.marketOpportunity || 89 },
    { label: "Labour Readiness", score: scores.labourReadiness || 84 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-200">
              AI Agricultural Decision Engine
            </span>
            <span className="text-xs font-bold text-slate-400">• Multi-Parameter Synthesis</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-1">
            AI Farm Advisor & Decision Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic synthesis of telemetry sensors, weather probability models, soil status, pest pressure, and mandi dynamics.
          </p>
        </div>

        <button
          onClick={fetchAdvisory}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-evaluate Advisory</span>
        </button>
      </div>

      {/* Farm Intelligence Score (Requirement #22) */}
      <ScoreGauge
        score={advisoryReport?.overallFarmIntelligenceScore || 84}
        max={100}
        label="Farm Intelligence Score (Composite)"
        submetrics={submetrics}
      />

      {/* Interactive Simulation & Farm Parameter Form (Requirement #20) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Adjust Farm Parameters & Telemetry Inputs
          </h2>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Crop
              </label>
              <select
                value={formInputs.crop}
                onChange={(e) => setFormInputs({ ...formInputs, crop: e.target.value })}
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Crop Growth Stage
              </label>
              <input
                type="text"
                value={formInputs.growthStage}
                onChange={(e) => setFormInputs({ ...formInputs, growthStage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Soil Moisture ({formInputs.soilMoisture}%)
              </label>
              <input
                type="range"
                min="15"
                max="85"
                value={formInputs.soilMoisture}
                onChange={(e) => setFormInputs({ ...formInputs, soilMoisture: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Rainfall Prob Next 24h ({formInputs.rainfallProb}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formInputs.rainfallProb}
                onChange={(e) => setFormInputs({ ...formInputs, rainfallProb: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600 mt-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Observed Pest Symptoms / Crop Stress Flags
            </label>
            <input
              type="text"
              value={formInputs.pestSymptoms}
              onChange={(e) => setFormInputs({ ...formInputs, pestSymptoms: e.target.value })}
              placeholder="e.g. Spodoptera caterpillar, leaf yellowing, whitefly incidence..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={generating}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-agri-600 hover:bg-agri-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>{generating ? "Evaluating AI Decision Models..." : "Run AI Advisory Synthesis"}</span>
          </button>
        </form>
      </div>

      {/* AI Advisory Cards (Requirement #21) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Irrigation Advisory */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 font-display">Irrigation Advisory</h3>
                <span className="text-[10px] text-slate-400 font-semibold">Water Management Engine</span>
              </div>
            </div>
            <Badge variant={adv.irrigation?.status?.includes("Critical") ? "danger" : adv.irrigation?.status?.includes("Postpone") ? "warning" : "success"}>
              {adv.irrigation?.status || "Adequate"}
            </Badge>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {adv.irrigation?.recommendation}
          </p>

          <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between text-xs text-sky-950 font-bold">
            <span>Water Requirement: {adv.irrigation?.waterRequirementMm || 0} mm</span>
            <span>Urgency: {adv.irrigation?.urgency}</span>
          </div>
        </div>

        {/* 2. Weather Advisory */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 font-display">Weather Advisory</h3>
                <span className="text-[10px] text-slate-400 font-semibold">IMD Agro-Meteorology</span>
              </div>
            </div>
            <Badge variant="warning">Convective Alert</Badge>
          </div>

          <h4 className="font-bold text-xs text-slate-900">{adv.weather?.title}</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {adv.weather?.detail}
          </p>
        </div>

        {/* 3. Pest & Disease Risk */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                <Bug className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 font-display">Pest & Disease Diagnosis</h3>
                <span className="text-[10px] text-slate-400 font-semibold">IPM Bio-Control Model</span>
              </div>
            </div>
            <Badge variant={adv.pestAndDisease?.riskLevel?.includes("High") ? "danger" : "success"}>
              {adv.pestAndDisease?.riskLevel || "Moderate"}
            </Badge>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {adv.pestAndDisease?.assessment}
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
              <strong>🌿 Organic Remedy:</strong> {adv.pestAndDisease?.organicRemedy}
            </div>
            <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200 text-rose-950">
              <strong>🧪 Chemical Remedy:</strong> {adv.pestAndDisease?.chemicalRemedy}
            </div>
          </div>
        </div>

        {/* 4. Crop Health & Vigor */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 font-display">Crop Health Diagnostics</h3>
                <span className="text-[10px] text-slate-400 font-semibold">Canopy & Chlorophyll Analysis</span>
              </div>
            </div>
            <Badge variant="success">{adv.cropHealth?.score || 88}% Healthy</Badge>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {adv.cropHealth?.detail}
          </p>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] text-slate-400">Nitrogen / Nodules</div>
              <div className="font-bold text-slate-900">Optimal (Active)</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] text-slate-400">Soil pH</div>
              <div className="font-bold text-slate-900">{user?.farm?.soilPH || 7.2} (Neutral)</div>
            </div>
          </div>
        </div>

        {/* 5. Market Timing Advisory */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-harvest-50 text-harvest-600 flex items-center justify-center border border-harvest-200">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 font-display">Market Timing Advisory</h3>
                <span className="text-[10px] text-slate-400 font-semibold">Selling Window Optimizer</span>
              </div>
            </div>
            <Badge variant="gold">Upward Bias</Badge>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {adv.market?.detail}
          </p>
        </div>

        {/* 6. Labour & Machinery Sizing Advisory */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
                <Tractor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 font-display">Labour & Machinery Advisory</h3>
                <span className="text-[10px] text-slate-400 font-semibold">Resource Optimization</span>
              </div>
            </div>
            <Badge variant="primary">{adv.labour?.workersRecommended || 8} Workers</Badge>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {adv.labour?.detail}
          </p>
          <p className="text-xs text-slate-600 leading-relaxed mt-2 pt-2 border-t border-slate-100">
            🚜 {adv.machinery?.detail}
          </p>
        </div>
      </div>
    </div>
  );
};
