import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { 
  Database, 
  Satellite, 
  CloudRain, 
  TrendingUp, 
  Users, 
  Tractor, 
  Landmark, 
  BrainCircuit, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  MapPin, 
  Activity,
  ArrowRight,
  Sparkles,
  Info,
  Server,
  FileText
} from "lucide-react";

export const AboutDataSourcesTab = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  const dataSections = [
    {
      id: "ai-advisor",
      title: "1. AI Farm Advisor & Decision Matrix",
      category: "Agronomic & Environmental Intelligence",
      icon: BrainCircuit,
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-300 text-emerald-950",
      accent: "bg-emerald-600 text-white",
      description: "Delivers predictive, farm-level recommendations across irrigation scheduling, pest outbreak alerts, crop vigor, and selling windows.",
      sources: [
        {
          name: "IoT Soil & Microclimate Telemetry",
          provider: "Soil Moisture Probes, Ambient Temperature & Humidity Sensors",
          type: "Live Real-Time Field Telemetry",
          details: "Measures volumetric soil moisture content (%), ambient temperature (°C), and relative humidity (%) to compute root-zone water tension and evapotranspiration rates."
        },
        {
          name: "Agro-Meteorological Forecast Models",
          provider: "India Meteorological Department (IMD) / Mausam / GFS Models",
          type: "Official Weather Radar & Numerical Predictions",
          details: "24h–72h convective rainfall probability forecasts, wind speed thresholds, and cloud canopy cover predictions to prevent unseasonal irrigation and spray drift."
        },
        {
          name: "Sentinel-2 Multi-Spectral Satellite Imagery",
          provider: "European Space Agency (ESA) Copernicus Earth Observation",
          type: "Earth Observation Satellite (Bands B4 Red & B8 NIR)",
          details: "Calculates Normalized Difference Vegetation Index (NDVI: 0.0 to 1.0) and chlorophyll absorption metrics at 10m spatial resolution to detect localized crop stress before visible yellowing."
        },
        {
          name: "Bioclimatic Pest & Disease Surveillance",
          provider: "ICAR-NIBSM, MPKV Rahuri & State Agricultural University Bulletins",
          type: "Bio-indicator & Thermal Degree-Day Models",
          details: "Predicts larval emergence thresholds for Spodoptera litura (Tobacco Caterpillar), Pink Bollworm, and Helicoverpa armigera based on night humidity >70% and temperature regimes."
        }
      ]
    },
    {
      id: "market",
      title: "2. Mandi Market Intelligence & Net Profit Optimizer",
      category: "Agricultural Commodity Economics",
      icon: TrendingUp,
      color: "from-amber-500/20 to-orange-500/20 border-amber-300 text-amber-950",
      accent: "bg-amber-600 text-white",
      description: "Calculates true net profitability per quintal by benchmarking daily wholesale prices against distance-weighted road transport logistics.",
      sources: [
        {
          name: "Agmarknet APMC Wholesale Price Feeds",
          provider: "Directorate of Marketing & Inspection (DMI), Ministry of Agriculture",
          type: "Official Government Mandi Price Database (agmarknet.gov.in)",
          details: "Real-time daily modal, minimum, and maximum commodity prices recorded across Lasalgaon, Pune, Nashik, Ahmednagar, Latur, and regional APMC yards."
        },
        {
          name: "Dynamic Logistics & Road Transport Matrix",
          provider: "OpenStreetMap Routing & Regional Agricultural Logistics Index",
          type: "Geospatial Distance & Multi-Vehicle Cost Algorithms",
          details: "Calculates vehicle-specific transport costs (₹/km/quintal for Pickups, Tempos, and Trucks) + mandi loading/unloading levies to determine the true net profit per mandi."
        },
        {
          name: "National e-NAM Portal Integration",
          provider: "Small Farmers' Agribusiness Consortium (SFAC)",
          type: "Unified National Agriculture Market (enam.gov.in)",
          details: "Benchmarks regional mandi prices against national trading indices to advise farmers whether to hold stock or sell immediately during peak price windows."
        }
      ]
    },
    {
      id: "labour-hiring",
      title: "3. Farm Labour Matching & Verified Directory",
      category: "Agricultural Workforce & Employment",
      icon: Users,
      color: "from-blue-500/20 to-indigo-500/20 border-blue-300 text-blue-950",
      accent: "bg-blue-600 text-white",
      description: "Connects landholders directly with verified local agricultural workers with transparent daily wage benchmarks and zero middlemen fees.",
      sources: [
        {
          name: "Verified Agricultural Labour Profiles",
          provider: "Direct Gram Panchayat & Community Peer Endorsements",
          type: "Community-Validated Worker Database",
          details: "Profiles include verified skills (Harvesting, Sowing, Pruning, Spraying, Tractor Operation), experience years, daily wage expectations, and village locations."
        },
        {
          name: "State Agricultural Minimum Wage Standards",
          provider: "Directorate of Economics & Statistics (DES) & State Labour Department",
          type: "Statutory Agricultural Wage Guidelines",
          details: "Provides benchmark wage rates per operation to ensure fair compensation for workers while maintaining affordable operational costs for farmers."
        },
        {
          name: "Geospatial Proximity Matching",
          provider: "Local Village & Block-Level Spatial Radius Index",
          type: "Proximity Radius Matching (5km – 25km)",
          details: "Matches farmers with available workers within their taluka or district to minimize worker commute times and reduce hiring turnaround to under 2 hours."
        }
      ]
    },
    {
      id: "machinery",
      title: "4. Machinery & Custom Hiring Centers (CHC)",
      category: "Mechanization & Equipment Sharing",
      icon: Tractor,
      color: "from-purple-500/20 to-violet-500/20 border-purple-300 text-purple-950",
      accent: "bg-purple-600 text-white",
      description: "On-demand rental platform for heavy tractors, combine harvesters, power tillers, and agricultural spraying drones.",
      sources: [
        {
          name: "Sub-Mission on Agricultural Mechanization (SMAM)",
          provider: "Ministry of Agriculture & Farmers Welfare (agrimachinery.nic.in)",
          type: "National Farm Mechanization Norms & Custom Hiring Guidelines",
          details: "Rental pricing benchmarks and operational guidelines aligned with central Custom Hiring Centre (CHC) subsidized equipment standards."
        },
        {
          name: "Verified Local Machinery Owner Registry",
          provider: "KrishiYug Registered Farm Equipment Providers",
          type: "Direct Equipment Owner Directory",
          details: "Listing vetted tractor owners, combine harvester operators, rotavator units, and DGCA-certified agricultural drone sprayers with transparent hourly and acre-based rates."
        }
      ]
    },
    {
      id: "schemes",
      title: "5. Government Schemes, Subsidies & DBT Portal",
      category: "Welfare & Direct Benefit Transfer (DBT)",
      icon: Landmark,
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-300 text-emerald-950",
      accent: "bg-emerald-700 text-white",
      description: "Direct eligibility checking, documentation checklists, and verified application portals for 9+ Central and State welfare initiatives.",
      sources: [
        {
          name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
          provider: "Department of Agriculture & Farmers Welfare (pmkisan.gov.in)",
          type: "100% Central Income Support (₹6,000/year via DBT)",
          details: "Aadhaar-seeded direct bank transfers for small and marginal landholders."
        },
        {
          name: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
          provider: "National Crop Insurance Portal (pmfby.gov.in)",
          type: "Subsidized Crop Insurance (85% Subsidy)",
          details: "Comprehensive cover against drought, flood, pests, and unseasonal rainfall with satellite-based rapid loss assessment."
        },
        {
          name: "PM-KUSUM Solar Agriculture Pump Scheme",
          provider: "Ministry of New and Renewable Energy (pmkusum.mnre.gov.in)",
          type: "60% Solar Pump Capital Subsidy",
          details: "Standalone solar irrigation pump installation for off-grid and diesel-dependent farmlands."
        },
        {
          name: "Soil Health Card Scheme",
          provider: "DAC&FW Soil Health Portal (soilhealth.dac.gov.in)",
          type: "100% Free Macro & Micronutrient Testing",
          details: "12-parameter soil fertility testing (N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, OC) with custom fertilizer dosage guidance."
        }
      ]
    },
    {
      id: "architecture",
      title: "6. Offline Architecture & Data Resilience Engine",
      category: "Zero Data Loss Technical Infrastructure",
      icon: Layers,
      color: "from-slate-500/20 to-slate-700/20 border-slate-300 text-slate-950",
      accent: "bg-slate-900 text-white",
      description: "Ensures the entire platform remains 100% operable in rural farmlands with intermittent or zero cellular connectivity.",
      sources: [
        {
          name: "Client-Side IndexedDB Storage (`KrishiMitraOfflineDB`)",
          provider: "Browser W3C IndexedDB Engine",
          type: "Local Structured Client Storage",
          details: "Persists hiring requests, profile updates, and telemetry inputs locally into browser storage when offline, queued for automatic background replication."
        },
        {
          name: "Progressive Web App (PWA) Service Worker",
          provider: "W3C Service Worker API (`/sw.js`)",
          type: "Cache-First App Shell & Asset Storage",
          details: "Pre-caches HTML, JavaScript bundles, stylesheets, fonts, and logos so the application loads instantly without ever showing a browser disconnect error."
        },
        {
          name: "MongoDB Atlas Primary Cloud Database",
          provider: "MongoDB Cloud Atlas Cluster",
          type: "Enterprise Multi-Region Database",
          details: "Stores verified user accounts, telemetry histories, and hiring transactions with automated conflict-free replication upon internet reconnection."
        }
      ]
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/60 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-400" /> Platform Architecture & Data Provenance
            </span>
            <span className="text-xs text-emerald-200/80 font-semibold">• 100% Transparent Sourcing</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
            About KrishiYug & Official Data Sources
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            KrishiYug is built upon an open, multi-intelligence data architecture. Every recommendation, Mandi price comparison, weather alert, and scheme eligibility metric is derived from verified government repositories, satellite constellations, and calibrated IoT sensors.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 text-xs font-bold text-emerald-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Agmarknet / e-NAM APMC
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ESA Sentinel-2 Satellite
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> IMD Agro-Meteorology
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Offline PWA Ready
            </span>
          </div>
        </div>

        {/* Decorative Background Icon */}
        <BrainCircuit className="w-96 h-96 text-emerald-500/5 absolute -right-16 -bottom-16 pointer-events-none" />
      </div>

      {/* Grid of All 6 Data Sourcing Modules */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 font-display">
              Module-Wise Data Infrastructure & Scientific Models
            </h2>
            <p className="text-xs text-slate-500">
              Detailed technical breakdown of how each portal feature collects, validates, and synthesizes data.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {dataSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div 
                key={sec.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-5"
              >
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs border ${sec.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        {sec.category}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 font-display">
                        {sec.title}
                      </h3>
                    </div>
                  </div>

                  {onNavigate && sec.id !== "architecture" && (
                    <button
                      onClick={() => onNavigate(sec.id)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 transition-all flex items-center gap-1 self-start sm:self-auto border border-slate-200"
                    >
                      <span>Open {sec.title.split(".")[1]?.trim() || "Module"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {sec.description}
                </p>

                {/* Sources Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  {sec.sources.map((src, sIdx) => (
                    <div 
                      key={sIdx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:bg-white hover:border-emerald-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-extrabold text-xs text-slate-900 font-display">
                          {src.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-black text-[9px] uppercase tracking-wide shrink-0">
                          {src.type.split(" ")[0]}
                        </span>
                      </div>

                      <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                        <span>🏛️ {src.provider}</span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed font-medium pt-1 border-t border-slate-200/60">
                        {src.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust & Transparency Guarantee Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white border border-emerald-700/40 space-y-4 shadow-lg">
        <div className="flex items-center gap-2 text-emerald-300 text-xs font-black uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Open Source & Data Integrity Guarantee
        </div>

        <h3 className="text-xl font-extrabold font-display">
          Zero Commercial Exploitation • Direct Farmer Welfare
        </h3>

        <p className="text-xs text-emerald-100/90 leading-relaxed max-w-3xl font-medium">
          KrishiYug operates strictly as a decision support and empowerment tool. We do not sell farmer crop data, charge commission on labour hiring transactions, or take cuts on machinery bookings. All market price indices, weather alerts, and subsidy documentation checklists remain 100% free and publicly accessible forever.
        </p>

        <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-emerald-200">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Direct-to-Farmer Connectivity
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real APMC Transparent Pricing
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Offline-First Privacy Architecture
          </span>
        </div>
      </div>
    </div>
  );
};
