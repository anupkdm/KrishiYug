import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
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
  Zap,
  Volume2,
  Share2,
  Clock,
  MessageSquareHeart,
  Globe,
  Radio,
  Satellite,
  Thermometer,
  Wind,
  Layers,
  Check,
  Compass
} from "lucide-react";

// Fallback baseline advisories if backend is bootstrapping
const DEFAULT_FARMER_ADVISORIES = [
  {
    id: "ADV-501",
    title: "Postpone Irrigation Due to Rain Forecast",
    priority: "Urgent Alert",
    category: "Weather Action",
    recommendationText: "Unseasonal moderate to heavy rain (22-35mm) predicted on Friday & Saturday in Pune & Nashik districts. Postpone planned canal/drip irrigation to avoid soil waterlogging and root asphyxiation.",
    reasonText: "Excess water combined with heavy rain causes root rot and nutrient leaching. Postponing saves water resources and prevents crop damage.",
    validityPeriod: "Valid for next 36 hours",
    createdAt: "Real-time Telemetry",
    isRead: false,
    channelAvailability: ["In-App", "SMS", "WhatsApp"],
    dataSource: "IMD Agro-Meteorology + Soil Sensor",
    conditions: { rainfallProb: 65, soilMoisture: 42 }
  },
  {
    id: "ADV-502",
    title: "High Risk of Pink Bollworm in Cotton Fields",
    priority: "Warning",
    category: "Pest Warning",
    recommendationText: "Regional surveillance indicates rising pink bollworm moth catches in Warangal district. Install 12 Pheromone traps/hectare and inspect rosetted flowers in early morning. Apply Chlorantraniliprole 18.5% SC if moth catch exceeds 8/trap/night.",
    reasonText: "Night humidity above 75% accelerates bollworm larval emergence. Pheromone traps enable early detection before economic threshold is breached.",
    validityPeriod: "Valid for next 5 days",
    createdAt: "Real-time Surveillance",
    isRead: false,
    channelAvailability: ["In-App", "SMS", "WhatsApp", "Voice Call"],
    dataSource: "Humidity Sensor + ICAR Pest Model",
    conditions: { humidity: 74, temperature: 28.5 }
  },
  {
    id: "ADV-503",
    title: "PMFBY Kharif Crop Insurance Enrollment Deadline",
    priority: "Opportunity",
    category: "Scheme Opportunity",
    recommendationText: "Apply for Pradhan Mantri Fasal Bima Yojana (PMFBY) before August 31st to secure 85% subsidized insurance cover for standing Wheat/Cotton crops. Premium is only 2% for Kharif and 1.5% for Rabi crops.",
    reasonText: "Protects against weather uncertainty and pest damage with minimal farmer premium. Satellite-based rapid loss assessment ensures claim settlement within 21 days.",
    validityPeriod: "Valid until Aug 31, 2026",
    createdAt: "Scheme Notification",
    isRead: true,
    channelAvailability: ["In-App", "WhatsApp"],
    dataSource: "Ministry of Agriculture & Farmers Welfare",
    conditions: {}
  }
];

export const AIFarmAdvisorTab = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
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
    windSpeed: telemetry.windSpeedKmh || 14.2,
    irrigationType: user?.farm?.irrigationSource || "Drip & Tube Well",
    pestSymptoms: "Slight leaf edge curling and minor caterpillar observation",
    farmSize: user?.farm?.sizeAcres || 8.5
  });

  const [advisoryReport, setAdvisoryReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Advisory feed state
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [readAdvisories, setReadAdvisories] = useState(new Set());
  const [filterPriority, setFilterPriority] = useState("All");
  const [copiedId, setCopiedId] = useState(null);

  // Synchronize telemetry changes from simulation context into form inputs
  useEffect(() => {
    setFormInputs(prev => ({
      ...prev,
      soilMoisture: telemetry.soilMoisture ?? prev.soilMoisture,
      temperature: telemetry.temperature ?? prev.temperature,
      humidity: telemetry.humidity ?? prev.humidity,
      rainfallProb: telemetry.rainfallProbNext24h ?? prev.rainfallProb,
      recentRainfallMm: telemetry.recentRainfallMm ?? prev.recentRainfallMm,
      windSpeed: telemetry.windSpeedKmh ?? prev.windSpeed
    }));
  }, [telemetry.soilMoisture, telemetry.temperature, telemetry.humidity, telemetry.rainfallProbNext24h, telemetry.windSpeedKmh]);

  const fetchAdvisory = async () => {
    setLoading(true);
    try {
      const res = await api.generateAdvisory(formInputs);
      setAdvisoryReport(res);
    } catch (err) {
      console.error("Advisory generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisory();
  }, [telemetry.soilMoisture, telemetry.temperature, telemetry.rainfallProbNext24h]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await api.generateAdvisory(formInputs);
      setAdvisoryReport(res);
    } catch (err) {
      alert("Advisory generation failed: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  // Text-to-Speech audio simulation & Web Speech API integration
  const handleSimulateAudio = (advisory) => {
    if (playingAudioId === advisory.id) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setPlayingAudioId(null);
      return;
    }

    setPlayingAudioId(advisory.id);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = `${advisory.title}. ${advisory.recommendationText}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      
      if (language === 'hi') utterance.lang = 'hi-IN';
      else if (language === 'mr') utterance.lang = 'mr-IN';
      else utterance.lang = 'en-IN';

      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingAudioId(null), 4500);
    }
  };

  const markAsRead = (id) => {
    setReadAdvisories(prev => new Set([...prev, id]));
  };

  const handleShare = (advisory) => {
    const text = `🌾 *KrishiYug AI Farm Advisory*\n\n📌 *${advisory.title}*\n🚨 *Priority:* ${advisory.priority} | 🏷️ *Category:* ${advisory.category}\n\n💡 *Actionable Advice:* \n${advisory.recommendationText}\n\n🔬 *Scientific Agronomic Basis:* \n${advisory.reasonText}\n\n⏳ *Validity:* ${advisory.validityPeriod}\n📡 *Data Source:* ${advisory.dataSource || "Satellite & Ground Sensor Mesh"}\n\n🌱 _Empowering Indian Agriculture through KrishiYug_`;
    
    if (navigator.share) {
      navigator.share({ title: advisory.title, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(advisory.id);
        setTimeout(() => setCopiedId(null), 2500);
      });
    }
  };

  // Effective dynamic feed items from backend response
  const advisoriesList = (advisoryReport?.feed && advisoryReport.feed.length > 0)
    ? advisoryReport.feed
    : DEFAULT_FARMER_ADVISORIES;

  const filteredAdvisories = filterPriority === "All" 
    ? advisoriesList 
    : advisoriesList.filter(a => a.priority === filterPriority);

  const unreadCount = advisoriesList.filter(a => !readAdvisories.has(a.id)).length;

  const scores = advisoryReport?.scores || {};
  const adv = advisoryReport?.advisories || {};
  const sat = advisoryReport?.satellite || {
    ndvi: 0.68,
    ndviStatus: "Optimal Canopy & High Chlorophyll",
    swi: "44%",
    canopyTemp: "26.8°C",
    cloudCover: "58%",
    satellitePass: "Sentinel-2 MSI (Refreshed 3h ago)"
  };

  const submetrics = [
    { label: "Crop Health", score: scores.cropHealth || 88 },
    { label: "Water Management", score: scores.waterManagement || 85 },
    { label: "Weather Risk", score: scores.weatherRisk || 82 },
    { label: "Pest Risk", score: scores.pestRisk || 78 },
    { label: "Market Opportunity", score: scores.marketOpportunity || 89 },
    { label: "Labour Readiness", score: scores.labourReadiness || 84 },
  ];

  const priorityConfig = {
    "Urgent Alert": { bg: "bg-red-500", text: "text-white", border: "border-red-300", cardBorder: "border-red-300 hover:border-red-500 ring-red-100" },
    "Warning": { bg: "bg-amber-500", text: "text-slate-950", border: "border-amber-300", cardBorder: "border-amber-300 hover:border-amber-500 ring-amber-100" },
    "Opportunity": { bg: "bg-emerald-500", text: "text-white", border: "border-emerald-300", cardBorder: "border-emerald-300 hover:border-emerald-500 ring-emerald-100" },
    "General Advisory": { bg: "bg-sky-500", text: "text-white", border: "border-sky-300", cardBorder: "border-sky-300 hover:border-sky-500 ring-sky-100" }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ─── Header ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              Live Agro-Intelligence Engine
            </span>
            <span className="text-xs font-bold text-slate-400">• Soil · Weather · Satellite NDVI</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-1">
            AI Farm Advisor & Decision Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time condition synthesis combining telemetry sensors, IMD meteorological radar, Sentinel-2 satellite canopy reflectance, and APMC mandi algorithms.
          </p>
        </div>

        <button
          onClick={fetchAdvisory}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-2 self-start sm:self-auto shadow-sm active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
          <span>{loading ? "Synthesizing Telemetry..." : "Re-evaluate Advisory"}</span>
        </button>
      </div>

      {/* ─── LIVE SATELLITE & TELEMETRY DIAGNOSTIC RIBBON ────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Sentinel-2 NDVI */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Satellite NDVI</span>
            <Satellite className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-1.5">
            <div className="text-xl font-black text-emerald-700">{sat.ndvi}</div>
            <div className="text-[10px] font-semibold text-slate-600 truncate">{sat.ndviStatus}</div>
          </div>
          <span className="text-[9px] text-slate-400 truncate">Sentinel-2 (B4/B8)</span>
        </div>

        {/* 2. Soil Moisture */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Soil Moisture</span>
            <Droplets className="w-4 h-4 text-sky-600" />
          </div>
          <div className="my-1.5">
            <div className="text-xl font-black text-sky-700">{formInputs.soilMoisture}%</div>
            <div className="text-[10px] font-semibold text-slate-600">
              {formInputs.soilMoisture < 30 ? "Critical Deficit" : formInputs.soilMoisture <= 60 ? "Optimal Root Zone" : "Saturated / Drainage"}
            </div>
          </div>
          <span className="text-[9px] text-slate-400 truncate">Capacitive Probe #1</span>
        </div>

        {/* 3. Ambient Temp & Canopy */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Temp / Canopy</span>
            <Thermometer className="w-4 h-4 text-amber-600" />
          </div>
          <div className="my-1.5">
            <div className="text-xl font-black text-amber-700">{formInputs.temperature}°C</div>
            <div className="text-[10px] font-semibold text-slate-600">Canopy: {sat.canopyTemp}</div>
          </div>
          <span className="text-[9px] text-slate-400 truncate">Thermal Infrared</span>
        </div>

        {/* 4. Rainfall Probability */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">24h Rain Prob</span>
            <CloudRain className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="my-1.5">
            <div className="text-xl font-black text-indigo-700">{formInputs.rainfallProb}%</div>
            <div className="text-[10px] font-semibold text-slate-600">
              {formInputs.rainfallProb > 60 ? "Heavy Rain Window" : formInputs.rainfallProb > 35 ? "Moderate Showers" : "Dry Window"}
            </div>
          </div>
          <span className="text-[9px] text-slate-400 truncate">IMD Radar Ensemble</span>
        </div>

        {/* 5. Humidity & Pest Vigor */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Air Humidity</span>
            <Bug className="w-4 h-4 text-rose-600" />
          </div>
          <div className="my-1.5">
            <div className="text-xl font-black text-rose-700">{formInputs.humidity}%</div>
            <div className="text-[10px] font-semibold text-slate-600">
              {formInputs.humidity > 75 ? "High Pest Emergence" : "Normal Pressure"}
            </div>
          </div>
          <span className="text-[9px] text-slate-400 truncate">ICAR Surveillance</span>
        </div>

        {/* 6. Wind Speed & Spraying */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Wind Speed</span>
            <Wind className="w-4 h-4 text-teal-600" />
          </div>
          <div className="my-1.5">
            <div className="text-xl font-black text-teal-700">{formInputs.windSpeed} km/h</div>
            <div className="text-[10px] font-semibold text-slate-600">
              {formInputs.windSpeed > 20 ? "Spraying Restricted" : "Safe for Foliar Spray"}
            </div>
          </div>
          <span className="text-[9px] text-slate-400 truncate">Anemometer #02</span>
        </div>
      </div>

      {/* ─── Composite Farm Intelligence Score Gauge ────────────────── */}
      <ScoreGauge
        score={advisoryReport?.overallFarmIntelligenceScore || 84}
        max={100}
        label="Farm Intelligence Score (Composite)"
        submetrics={submetrics}
      />

      {/* ─── PERSONALIZED REAL-TIME ADVISORY FEED ──────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
        {/* Feed Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <MessageSquareHeart className="w-4 h-4" /> Live Condition-Driven Recommendations
              {unreadCount > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black animate-pulse">
                  {unreadCount} NEW
                </span>
              )}
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 font-display">
              Actionable Farm-Level Advisories ({filteredAdvisories.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dynamically generated based on live sensor readings, satellite multi-spectral analysis, and weather forecasts.
            </p>
          </div>

          {/* Priority Filter Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {["All", "Urgent Alert", "Warning", "Opportunity"].map(p => {
              const count = p === "All" ? advisoriesList.length : advisoriesList.filter(a => a.priority === p).length;
              return (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border flex items-center gap-1.5 ${
                    filterPriority === p 
                      ? "bg-emerald-700 text-white border-emerald-700 shadow-sm" 
                      : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  <span>{p}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${filterPriority === p ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Advisory Feed Cards */}
        <div className="space-y-4">
          {filteredAdvisories.map((advisory) => {
            const config = priorityConfig[advisory.priority] || priorityConfig["General Advisory"];
            const isRead = readAdvisories.has(advisory.id);

            return (
              <div 
                key={advisory.id}
                className={`p-5 sm:p-6 rounded-2xl bg-white border-2 ${config.cardBorder} space-y-4 shadow-sm transition-all relative ${!isRead ? "ring-2 ring-opacity-60" : "opacity-90"}`}
                onClick={() => markAsRead(advisory.id)}
              >
                {/* Card Header & Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase ${config.bg} ${config.text}`}>
                      {advisory.priority} · {advisory.category}
                    </span>
                    {advisory.dataSource && (
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200 flex items-center gap-1">
                        <Satellite className="w-3 h-3 text-emerald-600" />
                        {advisory.dataSource}
                      </span>
                    )}
                    {!isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Unread advisory" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{advisory.validityPeriod}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-base text-slate-900 font-display">{advisory.title}</h3>
                
                {/* Recommendation Box */}
                <p className="text-sm text-slate-700 leading-relaxed p-4 rounded-2xl bg-slate-50 border border-slate-100 font-medium">
                  "{advisory.recommendationText}"
                </p>

                {/* Scientific Reason & Agronomic Basis */}
                <div className="text-xs text-slate-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/60">
                  <strong className="text-emerald-800">🔬 Scientific & Agronomic Rationale:</strong> {advisory.reasonText}
                </div>

                {/* Conditions / Trigger Telemetry */}
                {advisory.conditions && Object.keys(advisory.conditions).length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500">
                    <span className="font-bold text-slate-600">⚡ Condition Triggers:</span>
                    {advisory.conditions.rainfallProb !== undefined && (
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                        Rain: {advisory.conditions.rainfallProb}%
                      </span>
                    )}
                    {advisory.conditions.soilMoisture !== undefined && (
                      <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-semibold border border-sky-100">
                        Moisture: {advisory.conditions.soilMoisture}%
                      </span>
                    )}
                    {advisory.conditions.temperature !== undefined && (
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-100">
                        Temp: {advisory.conditions.temperature}°C
                      </span>
                    )}
                    {advisory.conditions.humidity !== undefined && (
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold border border-rose-100">
                        Humidity: {advisory.conditions.humidity}%
                      </span>
                    )}
                    {advisory.conditions.windSpeed !== undefined && (
                      <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-semibold border border-teal-100">
                        Wind: {advisory.conditions.windSpeed} km/h
                      </span>
                    )}
                    {advisory.conditions.ndvi !== undefined && (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                        NDVI: {advisory.conditions.ndvi.toFixed ? advisory.conditions.ndvi.toFixed(2) : advisory.conditions.ndvi}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Bar (Audio Playback, WhatsApp Share, Channel Badges) */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Audio Playback Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSimulateAudio(advisory); }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
                        playingAudioId === advisory.id 
                          ? "bg-amber-500 text-slate-950 animate-pulse font-black" 
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{playingAudioId === advisory.id ? "Playing Voice Audio..." : `Listen Audio (${language === "hi" ? "Hindi" : language === "mr" ? "Marathi" : "English"})`}</span>
                    </button>

                    {/* WhatsApp / SMS Share */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleShare(advisory); }}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                    >
                      {copiedId === advisory.id ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700">Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4 text-emerald-600" />
                          <span>Share via WhatsApp / SMS</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Channel Badges & Read Status */}
                  <div className="flex items-center gap-1.5">
                    {advisory.channelAvailability?.map(ch => (
                      <span key={ch} className="px-2 py-0.5 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-500 border border-slate-200">
                        {ch}
                      </span>
                    ))}
                    {isRead && (
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 ml-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── REAL-TIME TELEMETRY ADJUSTMENT & SIMULATION FORM ────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Adjust Farm Telemetry & Test Environmental Scenarios
            </h2>
          </div>
          <span className="text-xs text-slate-400">Sliders trigger instant re-evaluation</span>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Crop Select */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Crop
              </label>
              <select
                value={formInputs.crop}
                onChange={(e) => setFormInputs({ ...formInputs, crop: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-emerald-500"
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

            {/* Growth Stage */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Crop Stage
              </label>
              <select
                value={formInputs.growthStage}
                onChange={(e) => setFormInputs({ ...formInputs, growthStage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-emerald-500"
              >
                <option value="Vegetative / Tillering">Vegetative / Tillering</option>
                <option value="Flowering & Pod Initiation">Flowering & Pod Initiation</option>
                <option value="Pod Filling & Maturation">Pod Filling & Maturation</option>
                <option value="Harvest Readiness">Harvest Readiness</option>
              </select>
            </div>

            {/* Soil Moisture Slider */}
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600 mt-2"
              />
              <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                <span>15% (Dry)</span>
                <span>85% (Wet)</span>
              </div>
            </div>

            {/* Rainfall Probability */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                24h Rain Prob ({formInputs.rainfallProb}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formInputs.rainfallProb}
                onChange={(e) => setFormInputs({ ...formInputs, rainfallProb: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
              />
              <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                <span>0% (Clear)</span>
                <span>100% (Storm)</span>
              </div>
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Temperature ({formInputs.temperature}°C)
              </label>
              <input
                type="range"
                min="15"
                max="48"
                value={formInputs.temperature}
                onChange={(e) => setFormInputs({ ...formInputs, temperature: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600 mt-2"
              />
              <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                <span>15°C</span>
                <span>48°C (Heat)</span>
              </div>
            </div>

            {/* Humidity */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Air Humidity ({formInputs.humidity}%)
              </label>
              <input
                type="range"
                min="20"
                max="98"
                value={formInputs.humidity}
                onChange={(e) => setFormInputs({ ...formInputs, humidity: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600 mt-2"
              />
              <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                <span>20% (Dry)</span>
                <span>98% (Pest)</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Observed Field Symptoms & Pest Flags
            </label>
            <input
              type="text"
              value={formInputs.pestSymptoms}
              onChange={(e) => setFormInputs({ ...formInputs, pestSymptoms: e.target.value })}
              placeholder="e.g. Spodoptera caterpillar, leaf yellowing, whitefly incidence, anthracnose spots..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={generating}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>{generating ? "Evaluating Sensor & Satellite Multi-Models..." : "Run AI Advisory Synthesis"}</span>
          </button>
        </form>
      </div>

      {/* ─── DETAILED DIAGNOSTIC CARDS GRID ──────────────────────────── */}
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
            <Badge variant={formInputs.rainfallProb > 60 ? "danger" : formInputs.rainfallProb > 30 ? "warning" : "success"}>
              {formInputs.rainfallProb > 60 ? "Rain Threat" : "Convective Alert"}
            </Badge>
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

        {/* 4. Crop Health & Satellite Diagnostics */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 font-display">Satellite Crop Health Diagnostics</h3>
                <span className="text-[10px] text-slate-400 font-semibold">Canopy & Chlorophyll Index</span>
              </div>
            </div>
            <Badge variant="success">{adv.cropHealth?.score || 88}% Vigor Score</Badge>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {adv.cropHealth?.detail}
          </p>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] text-slate-400">NDVI Index</div>
              <div className="font-bold text-emerald-700">{sat.ndvi}</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] text-slate-400">Soil Water (SWI)</div>
              <div className="font-bold text-sky-700">{sat.swi}</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] text-slate-400">Soil pH</div>
              <div className="font-bold text-slate-900">{user?.farm?.soilPH || 7.2}</div>
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
