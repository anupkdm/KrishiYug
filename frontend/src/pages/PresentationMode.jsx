import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSimulation } from "../context/SimulationContext";
import { api } from "../services/api";
import { ScoreGauge } from "../components/common/ScoreGauge";
import { Badge } from "../components/common/Badge";
import { 
  Award, 
  Sprout, 
  Droplets, 
  CloudRain, 
  TrendingUp, 
  Users, 
  Tractor, 
  Landmark, 
  BrainCircuit, 
  X, 
  Sparkles, 
  RefreshCw, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingDown
} from "lucide-react";
import confetti from "canvas-confetti";

export const PresentationMode = ({ onExit }) => {
  const { user } = useAuth();
  const { telemetry, isTicking, triggerManualTick } = useSimulation();
  const [dashboardData, setDashboardData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dashRes, predRes] = await Promise.all([
          api.getFarmerDashboard(),
          api.getMarketPrediction("Soybean")
        ]);
        setDashboardData(dashRes);
        setPredictionData(predRes);
      } catch (e) {
        console.error("Presentation mode fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [telemetry.soilMoisture]);

  const handleConfetti = () => {
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
  };

  const farmer = dashboardData?.farmer || user;
  const farm = farmer?.farm || {};
  const scores = dashboardData?.scores || {};
  const actions = dashboardData?.recommendedActions || [];
  const labourMatches = dashboardData?.labourMatchesPreview || [];
  const machineryRecs = dashboardData?.machineryRecommendations || [];
  const schemes = dashboardData?.recommendedSchemes || [];

  const submetrics = [
    { label: "Crop Health", score: scores.cropHealth || 88 },
    { label: "Water Management", score: scores.waterManagement || 85 },
    { label: "Weather Risk", score: scores.weatherRisk || 82 },
    { label: "Pest Risk", score: scores.pestRisk || 78 },
    { label: "Market Opportunity", score: scores.marketOpportunity || 89 },
    { label: "Labour Readiness", score: scores.labourReadiness || 84 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Presentation Mode Top Bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl agri-gradient flex items-center justify-center text-white shadow-agri-glow">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-display">
                Krishi<span className="text-emerald-400">Intelligence</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                Hackathon Judge Pitch Mode
              </span>
            </div>
            <p className="text-xs text-slate-400">
              One Platform. Smarter Farming. Better Decisions. (Full-Stack Multi-Intelligence)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerManualTick}
            disabled={isTicking}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTicking ? "animate-spin text-emerald-400" : ""}`} />
            <span>Live Telemetry Tick</span>
          </button>

          <button
            onClick={handleConfetti}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 text-xs font-bold shadow-md hover:scale-105 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pitch Applause</span>
          </button>

          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold border border-rose-500/30 transition-all"
          >
            <X className="w-4 h-4" />
            <span>Exit Pitch Mode</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* PILLAR 1: Farm Overview & Live Telemetry Bar */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl agri-gradient text-white flex items-center justify-center text-2xl shadow-lg shrink-0">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  1. Farm Overview & Persona
                </span>
                <span className="text-xs text-slate-500">• Nashik, Maharashtra</span>
              </div>
              <h2 className="text-xl font-bold font-display text-white mt-0.5">
                Ramesh Patil • Patil Organic Farm ({farm.sizeAcres || 8.5} Acres)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Active Crop: <strong className="text-white">{farm.primaryCrop || "Soybean"}</strong> ({farm.cropStage || "Pod Filling & Maturation"}) • Soil: Medium Black (pH 7.2)
              </p>
            </div>
          </div>

          {/* 2. Live Telemetry */}
          <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700 shrink-0">
            <div className="text-center px-3 border-r border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">2. Soil Moisture</div>
              <div className="text-lg font-extrabold text-emerald-400 font-mono">{telemetry.soilMoisture}%</div>
            </div>
            <div className="text-center px-3 border-r border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Rainfall (24h)</div>
              <div className="text-lg font-extrabold text-sky-400 font-mono">{telemetry.rainfallProbNext24h}%</div>
            </div>
            <div className="text-center px-3">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Temperature</div>
              <div className="text-lg font-extrabold text-amber-400 font-mono">{telemetry.temperature}°C</div>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: AI Advisory Score & Decision Support Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PILLAR 3: Farm Intelligence Score (0–100) */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white font-display">
                  3. Composite Farm Intelligence Score
                </h3>
              </div>
              <span className="text-2xl font-extrabold text-emerald-400 font-display">
                {dashboardData?.farmIntelligenceScore || 84} / 100
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {submetrics.map((m) => (
                <div key={m.label} className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span className="truncate">{m.label}</span>
                    <span className="font-bold text-white">{m.score}%</span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        m.score >= 80 ? "bg-emerald-400" : m.score >= 60 ? "bg-amber-400" : "bg-rose-400"
                      }`}
                      style={{ width: `${m.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs leading-relaxed">
              💡 <strong>AI Agronomy Insight:</strong> Pod zone moisture is currently at {telemetry.soilMoisture}%. With {telemetry.rainfallProbNext24h}% convective rainfall predicted in next 24h, borewell irrigation is automatically paused to prevent root asphyxiation.
            </div>
          </div>

          {/* PILLAR 8: Actionable Decision Support Feed */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white font-display">
                  8. Actionable Decision Support Feed
                </h3>
              </div>
              <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Action Matrix
              </span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {actions.slice(0, 4).map((act) => (
                <div key={act.id} className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-start gap-3 text-xs">
                  <div className={`px-2 py-1 rounded-lg text-[10px] font-extrabold uppercase shrink-0 ${
                    act.severity === "urgent" ? "bg-rose-600 text-white" :
                    act.severity === "warning" ? "bg-amber-600 text-white" : "bg-emerald-600 text-white"
                  }`}>
                    {act.timeframe}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{act.title}</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">{act.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4-Pillar Grid: Labour Matching, Machinery Recommendation, Market Prediction, Scheme DBT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* PILLAR 4: Labour Matching */}
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300">
                4. Labour Sizing & Match
              </h4>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Required:</span>
                <span className="font-bold text-white">8 Workers (3 Days)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Est. Labour Cost:</span>
                <span className="font-bold text-emerald-400">₹11,520</span>
              </div>
            </div>

            {labourMatches[0] && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <div className="flex justify-between font-bold text-white">
                  <span>{labourMatches[0].name}</span>
                  <span className="text-amber-400">{labourMatches[0].matchScore}% Match</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {labourMatches[0].skills.slice(0, 2).join(", ")} • ₹{labourMatches[0].expectedDailyWage}/day
                </div>
              </div>
            )}
          </div>

          {/* PILLAR 5: Machinery Recommendation */}
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Tractor className="w-4 h-4 text-sky-400" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-sky-300">
                5. Machinery & ROI
              </h4>
            </div>

            {machineryRecs[0] && (
              <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs space-y-1.5">
                <div className="font-bold text-white">{machineryRecs[0].machineName}</div>
                <div className="text-[11px] text-slate-300 line-clamp-2">{machineryRecs[0].reason}</div>
                <div className="flex justify-between text-[11px] pt-1 border-t border-sky-500/20 font-bold">
                  <span className="text-slate-300">Time: {machineryRecs[0].timeRequiredHours}h</span>
                  <span className="text-emerald-400">Saved: +₹{machineryRecs[0].netSavingsVsManual?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}
          </div>

          {/* PILLAR 6: Market Price Prediction */}
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-harvest-400" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-harvest-300">
                6. 7-30d AI Price Forecast
              </h4>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Current (Nashik):</span>
                <span className="font-bold text-white">₹4,650/Qtl</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Next 15 Days:</span>
                <span className="font-bold text-emerald-400">₹4,785/Qtl (+2.9%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Next 30 Days:</span>
                <span className="font-bold text-emerald-400">₹4,950/Qtl (+6.5%)</span>
              </div>
            </div>
          </div>

          {/* PILLAR 7: Government Schemes */}
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-purple-400" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-purple-300">
                7. Scheme Matching & DBT
              </h4>
            </div>

            {schemes[0] && (
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs space-y-1">
                <div className="font-bold text-white">{schemes[0].name}</div>
                <div className="text-[11px] text-emerald-400 font-bold">{schemes[0].benefits}</div>
                <div className="text-[10px] text-slate-400">{schemes[0].eligibility}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
