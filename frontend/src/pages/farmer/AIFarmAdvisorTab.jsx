import React, { useState, useEffect, useMemo } from "react";
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
  Globe,
  Send,
  AlertTriangle,
  Layers,
  ChevronRight
} from "lucide-react";

// ─── Realistic Multi-Source Advisory Synthesis Function ────────────────────────
export function synthesizeFarmerAdvisories(params, telemetry) {
  const crop = params.crop || "Soybean";
  const growthStage = params.growthStage || "Pod Filling & Maturation";
  const soilMoisture = parseFloat(params.soilMoisture !== undefined ? params.soilMoisture : (telemetry?.soilMoisture || 38));
  const temp = parseFloat(params.temperature || telemetry?.temperature || 24.6);
  const humidity = parseFloat(params.humidity || telemetry?.humidity || 80);
  const rainfallProb = parseFloat(params.rainfallProb || telemetry?.rainfallProbNext24h || 65);
  const recentRainfall = parseFloat(params.recentRainfallMm || telemetry?.recentRainfallMm || 12);
  const windSpeed = parseFloat(params.windSpeed || telemetry?.windSpeedKmh || 14.2);
  const farmSize = parseFloat(params.farmSize || 8.5);
  const location = params.farmLocation || "Nashik, Maharashtra";
  const farmerName = params.farmerName || "Rameshwar Patil";

  // Simulated NDVI vegetation index from moisture, crop stage, and temperature
  const simulatedNdvi = Math.min(0.88, Math.max(0.25, 
    0.50 + (soilMoisture - 30) * 0.007 - (temp > 35 ? 0.12 : 0) - (humidity > 85 ? 0.05 : 0)
  )).toFixed(2);

  const advisories = [];
  let idCount = 501;

  // 1. WEATHER & IRRIGATION ADVISORY (Real-time telemetry driven)
  if (rainfallProb >= 50) {
    advisories.push({
      id: `ADV-${idCount++}`,
      title: "Postpone Irrigation Due to Rain Forecast",
      priority: "Urgent Alert",
      category: "Weather Action",
      recommendationText: `High probability of rainfall (${rainfallProb}%) with estimated ${Math.round(rainfallProb * 0.45)}mm convective precipitation forecast for ${location} in the next 24-36 hours. Immediately postpone planned drip/canal irrigation to prevent waterlogging and root asphyxiation in standing ${crop}.`,
      reasonText: `Current soil moisture is already at ${soilMoisture}%. Additional rain will saturate root zones beyond field capacity (>65%), causing nutrient leaching and fungal collar rot.`,
      targetFarmerName: farmerName,
      validityPeriod: "Valid for next 36 hours",
      createdAt: "Today, Real-time Update",
      isRead: false,
      channelAvailability: ["In-App", "SMS", "WhatsApp"],
      dataSource: "IMD Weather Radar + IoT Soil Sensor",
      triggerCondition: `Rain Prob ${rainfallProb}% + Soil Moisture ${soilMoisture}%`
    });
  } else if (soilMoisture < 32) {
    advisories.push({
      id: `ADV-${idCount++}`,
      title: "Critical Moisture Deficit — Initiate Drip Irrigation",
      priority: "Urgent Alert",
      category: "Irrigation Schedule",
      recommendationText: `Soil moisture has depleted to ${soilMoisture}% (wilting threshold 22%). Apply 25-30mm drip irrigation in morning hours (6:00–9:00 AM) to protect ${crop} during the sensitive ${growthStage} phase.`,
      reasonText: `Capillary tension exceeds root extraction capacity at <32% moisture. Water stress now will trigger irreversible flower/pod shedding.`,
      targetFarmerName: farmerName,
      validityPeriod: "Immediate Action Required",
      createdAt: "Today, Real-time Update",
      isRead: false,
      channelAvailability: ["In-App", "SMS", "WhatsApp", "Voice Call"],
      dataSource: "Capacitive Soil Probe + ET Model",
      triggerCondition: `Soil Moisture ${soilMoisture}% < 32%`
    });
  } else {
    advisories.push({
      id: `ADV-${idCount++}`,
      title: "Optimal Soil Moisture — Maintain Scheduled Irrigation",
      priority: "General Advisory",
      category: "Irrigation Schedule",
      recommendationText: `Soil moisture (${soilMoisture}%) is in the optimal agronomic range for ${crop}. Continue scheduled light fertigation. Re-evaluate moisture levels in 48 hours.`,
      reasonText: `Root zone moisture levels support active transpiration without hypoxia risk.`,
      targetFarmerName: farmerName,
      validityPeriod: "Valid for 48 hours",
      createdAt: "Today, Real-time Update",
      isRead: true,
      channelAvailability: ["In-App"],
      dataSource: "Soil Moisture Probe",
      triggerCondition: `Soil Moisture ${soilMoisture}% (Optimal)`
    });
  }

  // 2. PEST & DISEASE BIO-WEATHER ADVISORY
  if (humidity >= 70 && temp >= 20 && temp <= 35) {
    advisories.push({
      id: `ADV-${idCount++}`,
      title: `High Risk of ${crop === "Cotton" ? "Pink Bollworm & Whitefly" : "Spodoptera (Tobacco Caterpillar) & Semilooper"}`,
      priority: "Warning",
      category: "Pest Warning",
      recommendationText: `Current atmospheric humidity (${humidity}%) and temperature (${temp}°C) create peak micro-climatic conditions for ${crop === "Cotton" ? "Pink Bollworm moth flights" : "Spodoptera litura larval emergence"} in ${location}. Install 5–8 Pheromone traps/acre and scout undersides of leaves at 7:00 AM. Apply NSKE 5% (Neem Extract) or Chlorantraniliprole 18.5% SC @ 0.3ml/L if trap catches exceed 8 moths/night.`,
      reasonText: `High relative humidity (>70%) combined with ambient warmth accelerates egg-to-larva development from 5 days down to 3 days.`,
      targetFarmerName: farmerName,
      validityPeriod: "Valid for next 5 days",
      createdAt: "Today, 08:30 AM",
      isRead: false,
      channelAvailability: ["In-App", "SMS", "WhatsApp", "Voice Call"],
      dataSource: "ICAR Pest Surveillance Model + IoT Sensor Feed",
      triggerCondition: `Humidity ${humidity}% + Temp ${temp}°C`
    });
  }

  // 3. SATELLITE NDVI & CROP HEALTH MONITORING
  if (parseFloat(simulatedNdvi) >= 0.60) {
    advisories.push({
      id: `ADV-${idCount++}`,
      title: `Satellite Sentinel-2 Vigor Index: High Biomass (NDVI ${simulatedNdvi})`,
      priority: "General Advisory",
      category: "Crop Stress",
      recommendationText: `Multi-spectral satellite telemetry (Sentinel-2 B4/B8) confirms vigorous crop canopy and strong chlorophyll absorption across your ${farmSize}-acre ${crop} plot. Maintain micronutrient balance (Zinc + Boron spray at 2g/L) to maximize pod filling weight.`,
      reasonText: `NDVI ${simulatedNdvi} reflects healthy leaf area index and uninterrupted photosynthesis assimilation.`,
      targetFarmerName: farmerName,
      validityPeriod: "Next satellite pass in 4 days",
      createdAt: "Satellite Pass: Today 10:15 AM",
      isRead: true,
      channelAvailability: ["In-App", "WhatsApp"],
      dataSource: "Sentinel-2 Multi-Spectral Imagery (ESA/Copernicus)",
      triggerCondition: `Canopy NDVI ${simulatedNdvi} (Healthy)`
    });
  } else {
    advisories.push({
      id: `ADV-${idCount++}`,
      title: `Satellite Alert: Moderate Crop Stress Detected (NDVI ${simulatedNdvi})`,
      priority: "Warning",
      category: "Crop Stress",
      recommendationText: `Satellite vegetation index (NDVI ${simulatedNdvi}) indicates localized canopy stress in your ${crop} plot. Conduct field inspection for nutrient deficiency or early fungal infection. Apply foliar spray of 19:19:19 water-soluble NPK @ 5g/L.`,
      reasonText: `NDVI below 0.60 signals reduced photosynthetically active biomass, likely caused by soil compaction or localized moisture stress.`,
      targetFarmerName: farmerName,
      validityPeriod: "Inspect within 24 hours",
      createdAt: "Satellite Pass: Today 10:15 AM",
      isRead: false,
      channelAvailability: ["In-App", "SMS"],
      dataSource: "Sentinel-2 Multi-Spectral Imagery",
      triggerCondition: `Canopy NDVI ${simulatedNdvi} < 0.60`
    });
  }

  // 4. MARKET PRICE INTELLIGENCE ADVISORY
  advisories.push({
    id: `ADV-${idCount++}`,
    title: `${crop} Mandi Prices Trending Upward (+4.2% at Regional APMC)`,
    priority: "Opportunity",
    category: "Market Price Alert",
    recommendationText: `${crop} modal price at Pune & Lasalgaon APMC crossed ₹2,850/Quintal (+₹180/Q upward trend over 7 days). Arrival volumes are currently moderate (1,450 quintals). If dry warehouse storage is available, consider staging harvest dispatch over next 7–10 days to maximize realization.`,
    reasonText: `Flour mills and oilseed processors are active buyers due to tightening regional supplies before festive demand.`,
    targetFarmerName: farmerName,
    validityPeriod: "Market Window: Next 5-7 days",
    createdAt: "APMC Live Feed: Today 11:00 AM",
    isRead: false,
    channelAvailability: ["In-App", "SMS", "WhatsApp"],
    dataSource: "Agmarknet APMC Real-time Price Matrix",
    triggerCondition: `Price Trend +4.2% (Upward Bias)`
  });

  // 5. GOVERNMENT SCHEME & CROP INSURANCE
  advisories.push({
    id: `ADV-${idCount++}`,
    title: "PMFBY Kharif Crop Insurance Enrollment Open",
    priority: "Opportunity",
    category: "Scheme Opportunity",
    recommendationText: `Secure 85% subsidized crop insurance for your ${farmSize} acres under Pradhan Mantri Fasal Bima Yojana (PMFBY). Farmer premium is only 2% for Kharif crops (approx ₹340/acre). Covers localized perils, drought, unseasonal rains, and post-harvest losses.`,
    reasonText: `Given unpredictable monsoon convective spells (${rainfallProb}% rain forecast), PMFBY offers comprehensive risk mitigation with rapid satellite-based claim settlement.`,
    targetFarmerName: null,
    validityPeriod: "Enrollment Deadline: Aug 31, 2026",
    createdAt: "Ministry of Agriculture Bulletin",
    isRead: true,
    channelAvailability: ["In-App", "WhatsApp"],
    dataSource: "National Crop Insurance Portal (PMFBY)",
    triggerCondition: `Active Kharif Enrollment Window`
  });

  // 6. LABOUR & MACHINERY MECHANIZATION SIZING
  const workersNeeded = Math.max(4, Math.ceil(farmSize * 1.2));
  advisories.push({
    id: `ADV-${idCount++}`,
    title: `Pre-Book ${workersNeeded} Agricultural Workers for Upcoming Harvest Window`,
    priority: "Opportunity",
    category: "Labour Planning",
    recommendationText: `With ${crop} in ${growthStage}, the harvesting window is estimated in 12–15 days. Reserve ${workersNeeded} verified agricultural workers or pre-book a Combine Harvester via KrishiYug Custom Hiring to avoid peak season wage surges (30–40% price hike during harvest rush).`,
    reasonText: `Advance scheduling guarantees labour availability and locks in standard wages (₹450/day vs ₹600/day peak).`,
    targetFarmerName: farmerName,
    validityPeriod: "Book within next 7 days",
    createdAt: "Today 09:00 AM",
    isRead: false,
    channelAvailability: ["In-App", "SMS"],
    dataSource: "KrishiYug Labour Matching & Mechanization Engine",
    triggerCondition: `${crop} at ${growthStage} on ${farmSize} acres`
  });

  // Calculate composite intelligence score
  const cropHealthScore = parseFloat(simulatedNdvi) >= 0.60 ? 88 : 72;
  const waterScore = rainfallProb > 50 || (soilMoisture >= 35 && soilMoisture <= 60) ? 88 : 60;
  const weatherScore = rainfallProb > 80 ? 65 : 85;
  const pestScore = humidity > 75 ? 48 : 82;
  const marketScore = 89;
  const labourReadiness = 82;

  const overallScore = Math.round(
    cropHealthScore * 0.25 +
    waterScore * 0.20 +
    pestScore * 0.15 +
    weatherScore * 0.15 +
    marketScore * 0.15 +
    labourReadiness * 0.10
  );

  return {
    overallScore,
    submetrics: [
      { label: "Crop Health", score: cropHealthScore },
      { label: "Water Management", score: waterScore },
      { label: "Weather Risk", score: weatherScore },
      { label: "Pest Risk", score: pestScore },
      { label: "Market Opportunity", score: marketScore },
      { label: "Labour Readiness", score: labourReadiness }
    ],
    conditions: {
      soilMoisture,
      temperature: temp,
      humidity,
      rainfallProbability: rainfallProb,
      recentRainfallMm: recentRainfall,
      windSpeedKmh: windSpeed,
      simulatedNdvi
    },
    advisories
  };
}

export const AIFarmAdvisorTab = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { telemetry } = useSimulation();

  const [formInputs, setFormInputs] = useState({
    crop: user?.farm?.primaryCrop || "Soybean",
    growthStage: user?.farm?.cropStage || "Pod Filling & Maturation",
    soilMoisture: telemetry.soilMoisture || 38,
    soilType: user?.farm?.soilType || "Medium Black Soil (Vertisol)",
    farmLocation: user?.location ? `${user.location.village}, ${user.location.district}` : "Nashik, Maharashtra",
    temperature: telemetry.temperature || 24.6,
    humidity: telemetry.humidity || 80,
    rainfallProb: telemetry.rainfallProbNext24h || 65,
    recentRainfallMm: telemetry.recentRainfallMm || 12,
    irrigationType: user?.farm?.irrigationSource || "Drip & Tube Well",
    pestSymptoms: "Slight leaf edge curling and minor caterpillar observation",
    farmSize: user?.farm?.sizeAcres || 8.5
  });

  const [advisoryReport, setAdvisoryReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [readAdvisories, setReadAdvisories] = useState(new Set());
  const [filterPriority, setFilterPriority] = useState("All");

  // Keep form inputs synced when simulation ticks
  useEffect(() => {
    setFormInputs(prev => ({
      ...prev,
      soilMoisture: telemetry.soilMoisture !== undefined ? telemetry.soilMoisture : prev.soilMoisture,
      temperature: telemetry.temperature !== undefined ? telemetry.temperature : prev.temperature,
      humidity: telemetry.humidity !== undefined ? telemetry.humidity : prev.humidity,
      rainfallProb: telemetry.rainfallProbNext24h !== undefined ? telemetry.rainfallProbNext24h : prev.rainfallProb,
      recentRainfallMm: telemetry.recentRainfallMm !== undefined ? telemetry.recentRainfallMm : prev.recentRainfallMm,
    }));
  }, [telemetry]);

  // Compute live synthesized advisories from current inputs and telemetry
  const synthesized = useMemo(() => {
    return synthesizeFarmerAdvisories(formInputs, telemetry);
  }, [formInputs, telemetry]);

  const advisoryList = synthesized.advisories;
  const filteredAdvisories = filterPriority === "All" 
    ? advisoryList 
    : advisoryList.filter(a => a.priority === filterPriority);

  const unreadCount = advisoryList.filter(a => !readAdvisories.has(a.id)).length;
  const conditions = synthesized.conditions;

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      // Also request backend if available
      const res = await api.generateAdvisory(formInputs).catch(() => null);
      if (res) setAdvisoryReport(res);
    } catch (err) {
      console.warn("Backend advisory warning:", err);
    } finally {
      setTimeout(() => setGenerating(false), 400);
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
    const text = `🌾 *KrishiYug Farm Advisory*\n\n📋 *${advisory.title}*\n_${advisory.priority} • ${advisory.category}_\n\n👉 *Recommendation:*\n"${advisory.recommendationText}"\n\n🔬 *Scientific Reason:*\n${advisory.reasonText}\n\n📡 *Data Source:* ${advisory.dataSource}\n⏳ *Validity:* ${advisory.validityPeriod}\n\n🚜 _KrishiYug Agricultural Intelligence Platform_`;
    
    if (navigator.share) {
      navigator.share({ title: advisory.title, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert("✅ Advisory copied to clipboard! You can paste and share it directly on WhatsApp or SMS.");
      });
    }
  };

  const priorityConfig = {
    "Urgent Alert": { 
      bg: "bg-rose-500", 
      text: "text-white", 
      badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
      cardBorder: "border-rose-200/80 hover:border-rose-400 bg-gradient-to-br from-white to-rose-50/20", 
      icon: "🔴" 
    },
    "Warning": { 
      bg: "bg-amber-500", 
      text: "text-slate-950 font-black", 
      badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
      cardBorder: "border-amber-200/80 hover:border-amber-400 bg-gradient-to-br from-white to-amber-50/20", 
      icon: "🟡" 
    },
    "Opportunity": { 
      bg: "bg-emerald-600", 
      text: "text-white", 
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      cardBorder: "border-emerald-200/80 hover:border-emerald-400 bg-gradient-to-br from-white to-emerald-50/20", 
      icon: "🟢" 
    },
    "General Advisory": { 
      bg: "bg-sky-600", 
      text: "text-white", 
      badgeBg: "bg-sky-50 text-sky-800 border-sky-200",
      cardBorder: "border-sky-200/80 hover:border-sky-400 bg-gradient-to-br from-white to-sky-50/20", 
      icon: "🔵" 
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Agricultural Decision Engine
            </span>
            <span className="text-xs font-bold text-slate-400">• Multi-Parameter Live Synthesis</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-1">
            AI Farm Advisor & Decision Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamic, actionable farm advisories synthesized from real-time soil telemetry, IMD rainfall probability, satellite NDVI, pest surveillance, and APMC mandi price trends.
          </p>
        </div>

        <button
          onClick={() => {
            setGenerating(true);
            setTimeout(() => setGenerating(false), 500);
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${generating ? "animate-spin" : ""}`} />
          <span>Re-evaluate Advisory</span>
        </button>
      </div>

      {/* Farm Intelligence Score Gauge */}
      <ScoreGauge
        score={synthesized.overallScore}
        max={100}
        label="Farm Intelligence Score (Composite)"
        submetrics={synthesized.submetrics}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          LIVE CONDITIONS DASHBOARD (Weather, Soil, Satellite, Wind)
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
            <h3 className="text-sm font-extrabold text-slate-900 font-display">
              Live Environmental Telemetry & Satellite Indicators
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            📡 Auto-refreshing via IoT Simulation
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 pt-1">
          {[
            { label: "Soil Moisture", value: `${conditions.soilMoisture}%`, icon: Droplets, color: "text-sky-600 bg-sky-50 border-sky-200", status: conditions.soilMoisture < 32 ? "Low" : "Optimal" },
            { label: "Temperature", value: `${conditions.temperature}°C`, icon: Thermometer, color: "text-rose-600 bg-rose-50 border-rose-200", status: "Ambient" },
            { label: "Humidity", value: `${conditions.humidity}%`, icon: CloudRain, color: "text-blue-600 bg-blue-50 border-blue-200", status: conditions.humidity > 75 ? "High Risk" : "Normal" },
            { label: "Rain Prob (24h)", value: `${conditions.rainfallProbability}%`, icon: CloudRain, color: "text-indigo-600 bg-indigo-50 border-indigo-200", status: conditions.rainfallProbability > 50 ? "Heavy Rain" : "Low" },
            { label: "Recent Rain", value: `${conditions.recentRainfallMm} mm`, icon: Droplets, color: "text-cyan-600 bg-cyan-50 border-cyan-200", status: "Past 48h" },
            { label: "Wind Speed", value: `${conditions.windSpeedKmh} km/h`, icon: Wind, color: "text-slate-600 bg-slate-50 border-slate-200", status: "Safe" },
            { label: "Canopy NDVI", value: conditions.simulatedNdvi, icon: Satellite, color: "text-emerald-600 bg-emerald-50 border-emerald-200", status: "Sentinel-2" },
          ].map((item) => (
            <div key={item.label} className={`p-3 rounded-2xl border ${item.color} text-center shadow-xs transition-all hover:scale-102`}>
              <item.icon className="w-4 h-4 mx-auto mb-1 opacity-80" />
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-75">{item.label}</div>
              <div className="text-base font-black mt-0.5">{item.value}</div>
              <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-white/80 border border-current/20">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          INTERACTIVE TELEMETRY & FARM PARAMETER TUNER (Above Advisories)
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Adjust Farm Parameters & Telemetry Inputs
            </h2>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Advisories auto-adapt in real time
          </span>
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
              >
                <option value="Soybean">Soybean (सोयाबीन)</option>
                <option value="Wheat">Wheat (गहू / गेहूं)</option>
                <option value="Cotton">Cotton (कापूस / कपास)</option>
                <option value="Onion">Onion (कांदा / प्याज)</option>
                <option value="Tomato">Tomato (टोमॅटो)</option>
                <option value="Rice">Rice / Paddy (भात / धान)</option>
                <option value="Sugarcane">Sugarcane (ऊस / गन्ना)</option>
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
            />
          </div>

          <button
            type="submit"
            disabled={generating}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>{generating ? "Synthesizing AI Agricultural Intelligence..." : "Run AI Advisory Synthesis"}</span>
          </button>
        </form>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          ACTIONABLE FARMER ADVISORIES FEED (from KrishiSamadhan)
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        {/* Feed Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <MessageSquareHeart className="w-4 h-4" /> Personalized Farmer Advisory Feed
              {unreadCount > 0 && (
                <span className="ml-1 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                  {unreadCount} NEW RECOMMENDATIONS
                </span>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 font-display">
              Actionable Farm-Level Recommendations
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
              High-impact, scientifically validated advisories dynamically synthesized from real-time field sensors, satellite observations, and APMC mandi economics.
            </p>
          </div>

          {/* Priority Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { label: `All (${advisoryList.length})`, val: "All" },
              { label: `🔴 Urgent (${advisoryList.filter(a => a.priority === "Urgent Alert").length})`, val: "Urgent Alert" },
              { label: `🟡 Warning (${advisoryList.filter(a => a.priority === "Warning").length})`, val: "Warning" },
              { label: `🟢 Opportunity (${advisoryList.filter(a => a.priority === "Opportunity").length})`, val: "Opportunity" }
            ].map(p => (
              <button
                key={p.val}
                onClick={() => setFilterPriority(p.val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  filterPriority === p.val 
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-sm" 
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Advisory Feed Cards List */}
        <div className="space-y-4">
          {filteredAdvisories.map((adv) => {
            const config = priorityConfig[adv.priority] || priorityConfig["General Advisory"];
            const isRead = readAdvisories.has(adv.id);

            return (
              <div 
                key={adv.id}
                onClick={() => markAsRead(adv.id)}
                className={`p-6 rounded-3xl border-2 ${config.cardBorder} space-y-4 shadow-sm transition-all hover:shadow-md cursor-pointer ${
                  !isRead ? "ring-2 ring-emerald-500/20" : "opacity-95"
                }`}
              >
                {/* Top Meta Line */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-tight ${config.bg} ${config.text} shadow-xs`}>
                      {adv.priority} • {adv.category}
                    </span>
                    {adv.targetFarmerName && (
                      <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-0.5 rounded-lg">
                        For: {adv.targetFarmerName}
                      </span>
                    )}
                    {!isRead && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                        New
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{adv.validityPeriod}</span>
                    </div>
                  </div>
                </div>

                {/* Advisory Title */}
                <h3 className="font-black text-lg text-slate-900 font-display">
                  {adv.title}
                </h3>
                
                {/* Recommendation Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-slate-800 text-sm leading-relaxed font-medium">
                  "{adv.recommendationText}"
                </div>

                {/* Scientific Reason */}
                <div className="text-xs text-slate-600 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                  <strong className="text-emerald-800 font-bold">🔬 Scientific Rationale:</strong> {adv.reasonText}
                </div>

                {/* Telemetry Trigger & Data Source Badges */}
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  {adv.dataSource && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold border border-slate-200 flex items-center gap-1">
                      📡 {adv.dataSource}
                    </span>
                  )}
                  {adv.triggerCondition && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1">
                      ⚡ Trigger: {adv.triggerCondition}
                    </span>
                  )}
                </div>

                {/* Footer Buttons: Audio & Share */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Audio Playback Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSimulateAudio(adv.id);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-xs ${
                        playingAudioId === adv.id 
                          ? "bg-amber-500 text-slate-950 animate-pulse scale-102" 
                          : "bg-emerald-800 text-emerald-50 hover:bg-emerald-700"
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>
                        {playingAudioId === adv.id 
                          ? `Playing Voice Advisory (${language?.toUpperCase() || "EN"})...` 
                          : `Listen Audio (${language === "mr" ? "मराठी" : language === "hi" ? "हिंदी" : "English"})`}
                      </span>
                    </button>

                    {/* Share via WhatsApp / SMS */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(adv);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                    >
                      <Share2 className="w-4 h-4 text-emerald-600" />
                      <span>Share via WhatsApp / SMS</span>
                    </button>
                  </div>

                  {/* Channel Badges */}
                  <div className="flex items-center gap-1.5">
                    {adv.channelAvailability?.map(ch => (
                      <span key={ch} className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500 border border-slate-200">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
