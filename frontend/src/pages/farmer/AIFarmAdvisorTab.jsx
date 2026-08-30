import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useSimulation } from "../../context/SimulationContext";
import { api } from "../../services/api";
import { ScoreGauge } from "../../components/common/ScoreGauge";
import { Badge } from "../../components/common/Badge";
import { 
  Droplets, 
  CloudRain, 
  Bug, 
  Sprout, 
  TrendingUp, 
  Tractor, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  Zap,
  Volume2,
  Share2,
  Clock,
  MessageSquareHeart,
  Activity,
  Satellite,
  Thermometer,
  Wind,
  Loader2
} from "lucide-react";

export const AIFarmAdvisorTab = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
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

  // Dynamic advisory feed state
  const [feedData, setFeedData] = useState(null);
  const [feedLoading, setFeedLoading] = useState(true);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [readAdvisories, setReadAdvisories] = useState(new Set());
  const [filterPriority, setFilterPriority] = useState("All");

  // ─── Fetch AI Advisory Report ──────────────────────────────────────
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

  // ─── Fetch Dynamic Advisory Feed (condition-based) ─────────────────
  const fetchAdvisoryFeed = async () => {
    setFeedLoading(true);
    try {
      const res = await api.getAdvisoryFeed({
        crop: formInputs.crop,
        growthStage: formInputs.growthStage,
        soilMoisture: formInputs.soilMoisture,
        temperature: formInputs.temperature,
        humidity: formInputs.humidity,
        rainfallProb: formInputs.rainfallProb,
        recentRainfallMm: formInputs.recentRainfallMm,
        farmSize: formInputs.farmSize,
        farmLocation: formInputs.farmLocation,
        windSpeed: telemetry.windSpeedKmh || 14.2
      });
      setFeedData(res);
    } catch (err) {
      console.error("Advisory feed error:", err);
    } finally {
      setFeedLoading(false);
    }
  };

  // Fetch on mount and when telemetry changes
  useEffect(() => {
    fetchAdvisory();
    fetchAdvisoryFeed();
  }, [telemetry.soilMoisture, telemetry.temperature]);

  // Re-sync form inputs when telemetry updates from simulation
  useEffect(() => {
    setFormInputs(prev => ({
      ...prev,
      soilMoisture: telemetry.soilMoisture || prev.soilMoisture,
      temperature: telemetry.temperature || prev.temperature,
      humidity: telemetry.humidity || prev.humidity,
      rainfallProb: telemetry.rainfallProbNext24h || prev.rainfallProb,
      recentRainfallMm: telemetry.recentRainfallMm || prev.recentRainfallMm,
    }));
  }, [telemetry]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const [reportRes] = await Promise.all([
        api.generateAdvisory(formInputs),
        fetchAdvisoryFeed() // also refresh feed with new params
      ]);
      setAdvisoryReport(reportRes);
    } catch (err) {
      alert("Advisory generation failed: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSimulateAudio = (id) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      setTimeout(() => setPlayingAudioId(null), 4000);
    }
  };

  const markAsRead = (id) => {
    setReadAdvisories(prev => new Set([...prev, id]));
  };

  const handleShare = (advisory) => {
    const text = `🌾 KrishiYug Advisory\n\n📋 ${advisory.title}\n\n${advisory.recommendationText}\n\n🔬 Reason: ${advisory.reasonText}\n\n📊 Data Source: ${advisory.dataSource}\n⏳ ${advisory.validityPeriod}`;
    if (navigator.share) {
      navigator.share({ title: advisory.title, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert("Advisory copied to clipboard! Share via WhatsApp.");
      });
    }
  };

  const advisoryList = feedData?.advisories || [];
  const filteredAdvisories = filterPriority === "All" 
    ? advisoryList 
    : advisoryList.filter(a => a.priority === filterPriority);

  const unreadCount = advisoryList.filter(a => !readAdvisories.has(a.id)).length;
  const conditions = feedData?.currentConditions || {};

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

  const priorityConfig = {
    "Urgent Alert": { bg: "bg-red-500", text: "text-white", cardBorder: "border-red-200 hover:border-red-400", icon: "🔴" },
    "Warning": { bg: "bg-amber-500", text: "text-slate-950", cardBorder: "border-amber-200 hover:border-amber-400", icon: "🟡" },
    "Opportunity": { bg: "bg-emerald-500", text: "text-white", cardBorder: "border-emerald-200 hover:border-emerald-400", icon: "🟢" },
    "General Advisory": { bg: "bg-sky-500", text: "text-white", cardBorder: "border-sky-200 hover:border-sky-400", icon: "🔵" }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-200">
              AI Agricultural Decision Engine
            </span>
            <span className="text-xs font-bold text-slate-400">• Real-Time Condition Analysis</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-1">
            AI Farm Advisor & Decision Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamic advisories driven by live telemetry sensors, weather models, satellite NDVI, soil status, pest surveillance, and mandi data.
          </p>
        </div>

        <button
          onClick={() => { fetchAdvisory(); fetchAdvisoryFeed(); }}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-evaluate Advisory</span>
        </button>
      </div>

      {/* Farm Intelligence Score */}
      <ScoreGauge
        score={advisoryReport?.overallFarmIntelligenceScore || 84}
        max={100}
        label="Farm Intelligence Score (Composite)"
        submetrics={submetrics}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          LIVE CONDITIONS DASHBOARD
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900 font-display">Current Conditions Driving Advisories</h3>
          <span className="text-[10px] text-slate-400 font-bold ml-auto">
            Last updated: {feedData?.generatedAt ? new Date(feedData.generatedAt).toLocaleTimeString("en-IN") : "—"}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {[
            { label: "Soil Moisture", value: `${conditions.soilMoisture || formInputs.soilMoisture}%`, icon: Droplets, color: "text-sky-600 bg-sky-50 border-sky-200" },
            { label: "Temperature", value: `${conditions.temperature || formInputs.temperature}°C`, icon: Thermometer, color: "text-rose-600 bg-rose-50 border-rose-200" },
            { label: "Humidity", value: `${conditions.humidity || formInputs.humidity}%`, icon: CloudRain, color: "text-blue-600 bg-blue-50 border-blue-200" },
            { label: "Rain Prob", value: `${conditions.rainfallProbability || formInputs.rainfallProb}%`, icon: CloudRain, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
            { label: "Recent Rain", value: `${conditions.recentRainfallMm || formInputs.recentRainfallMm}mm`, icon: Droplets, color: "text-cyan-600 bg-cyan-50 border-cyan-200" },
            { label: "Wind", value: `${conditions.windSpeedKmh || 14.2} km/h`, icon: Wind, color: "text-slate-600 bg-slate-50 border-slate-200" },
            { label: "NDVI", value: conditions.simulatedNdvi || "—", icon: Satellite, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
          ].map((item) => (
            <div key={item.label} className={`p-2.5 rounded-xl border ${item.color} text-center`}>
              <item.icon className="w-4 h-4 mx-auto mb-1" />
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">{item.label}</div>
              <div className="text-sm font-extrabold">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          DYNAMIC ADVISORY FEED (condition-based, from backend)
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
        {/* Feed Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <MessageSquareHeart className="w-4 h-4" /> Condition-Based Advisory Feed
              {unreadCount > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black animate-pulse">
                  {unreadCount} NEW
                </span>
              )}
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 font-display">
              Real-Time Farm Recommendations
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Each advisory below is triggered by actual sensor thresholds — weather, soil, satellite NDVI, pest models, and market dynamics.
            </p>
          </div>

          {/* Priority Filter + Count Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {["All", "Urgent Alert", "Warning", "Opportunity"].map(p => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                  filterPriority === p 
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md" 
                    : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50"
                }`}
              >
                {p === "All" ? `All (${advisoryList.length})` 
                  : p === "Urgent Alert" ? `🔴 Urgent (${feedData?.urgentCount || 0})`
                  : p === "Warning" ? `🟡 Warning (${feedData?.warningCount || 0})`
                  : `🟢 Opportunity (${feedData?.opportunityCount || 0})`}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {feedLoading && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Analyzing conditions & generating advisories...</p>
          </div>
        )}

        {/* No advisories */}
        {!feedLoading && filteredAdvisories.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">All Clear!</p>
            <p className="text-xs text-slate-500 mt-1">No advisories triggered under current conditions. Your farm parameters are within optimal ranges.</p>
          </div>
        )}

        {/* Advisory Feed Cards */}
        {!feedLoading && (
          <div className="space-y-4">
            {filteredAdvisories.map((advisory) => {
              const config = priorityConfig[advisory.priority] || priorityConfig["General Advisory"];
              const isRead = readAdvisories.has(advisory.id);

              return (
                <div 
                  key={advisory.id}
                  className={`p-5 sm:p-6 rounded-2xl bg-white border-2 ${config.cardBorder} space-y-4 shadow-sm transition-all ${!isRead ? "ring-1 ring-emerald-200/50" : "opacity-90"}`}
                  onClick={() => markAsRead(advisory.id)}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase ${config.bg} ${config.text}`}>
                        {advisory.priority} · {advisory.category}
                      </span>
                      {advisory.targetFarmerName && (
                        <span className="text-xs text-slate-500 font-semibold">
                          For: {advisory.targetFarmerName}
                        </span>
                      )}
                      {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Unread" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{advisory.validityPeriod}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-base text-slate-900 font-display">{advisory.title}</h3>
                  
                  {/* Recommendation */}
                  <p className="text-sm text-slate-700 leading-relaxed p-4 rounded-2xl bg-slate-50 border border-slate-100 font-medium">
                    "{advisory.recommendationText}"
                  </p>

                  {/* Scientific Reason */}
                  <div className="text-xs text-slate-600">
                    <strong className="text-emerald-700">🔬 Scientific Reason:</strong> {advisory.reasonText}
                  </div>

                  {/* Data Source + Conditions */}
                  <div className="flex items-center gap-3 flex-wrap text-[10px]">
                    {advisory.dataSource && (
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        📡 {advisory.dataSource}
                      </span>
                    )}
                    {advisory.conditions && Object.entries(advisory.conditions).slice(0, 3).map(([key, val]) => (
                      <span key={key} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-bold border border-slate-200">
                        {key}: {typeof val === "number" ? val.toFixed?.(1) || val : val}
                      </span>
                    ))}
                  </div>

                  {/* Channel + Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    {/* Channel badges */}
                    <div className="flex items-center gap-1 mr-2">
                      {advisory.channelAvailability?.map(ch => (
                        <span key={ch} className="px-1.5 py-0.5 rounded text-[9px] font-bold text-slate-400 bg-slate-50 border border-slate-100">
                          {ch}
                        </span>
                      ))}
                    </div>

                    {/* Audio Playback */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSimulateAudio(advisory.id); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        playingAudioId === advisory.id 
                          ? "bg-amber-500 text-white animate-pulse shadow-md" 
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{playingAudioId === advisory.id ? "Playing..." : "Listen"}</span>
                    </button>

                    {/* Share */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleShare(advisory); }}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Share</span>
                    </button>

                    {/* Read Status */}
                    {isRead && (
                      <span className="ml-auto text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Read
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          INTERACTIVE SIMULATION & PARAMETER FORM
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Adjust Farm Parameters & Telemetry Inputs
          </h2>
          <span className="text-[10px] text-slate-400 font-bold ml-2">Change values → advisories auto-update</span>
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

      {/* ═══════════════════════════════════════════════════════════════════
          AI ADVISORY CARDS (existing design preserved)
          ═══════════════════════════════════════════════════════════════════ */}
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
