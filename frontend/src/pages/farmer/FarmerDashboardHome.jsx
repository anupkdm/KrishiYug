import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSimulation } from "../../context/SimulationContext";
import { useLanguage } from "../../context/LanguageContext";
import { api } from "../../services/api";
import { 
  Sprout, 
  Droplets, 
  TrendingUp, 
  Users, 
  Tractor, 
  Landmark, 
  BrainCircuit, 
  ArrowRight,
  MapPin,
  Sparkles,
  SunMedium,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Satellite,
  Check
} from "lucide-react";

export const FarmerDashboardHome = ({ onNavigate }) => {
  const { user } = useAuth();
  const { telemetry } = useSimulation();
  const { t, language } = useLanguage();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Region Switcher State
  const [selectedRegion, setSelectedRegion] = useState("Nashik (Nashik Valley)");
  const [showRegionMenu, setShowRegionMenu] = useState(false);

  // Active Bottom Telemetry Pill & Animated Tractor Position (0, 1, 2, 3)
  const [activeTelemetryIndex, setActiveTelemetryIndex] = useState(0);

  const regions = [
    { name: "Nashik (Nashik Valley)", sub: "Major Onion & Grape Belt", temp: 22.6, moisture: 38.5, ndvi: 0.72, apmc: "Nashik (Panchavati) APMC" },
    { name: "Pune (Baramati Agri Hub)", sub: "Sugarcane & Vegetables", temp: 24.1, moisture: 41.2, ndvi: 0.76, apmc: "Pune (Gultekdi) APMC" },
    { name: "Nagpur (Vidarbha Basin)", sub: "Cotton & Soybean Hub", temp: 26.5, moisture: 34.0, ndvi: 0.68, apmc: "Nagpur (Kalamna) APMC" },
    { name: "Aurangabad (Marathwada)", sub: "Pulses, Maize & Cotton", temp: 25.8, moisture: 32.5, ndvi: 0.65, apmc: "Jalna / Sambhajinagar APMC" },
    { name: "Kolhapur (Sugar Belt)", sub: "Jaggery & Heavy Soils", temp: 23.4, moisture: 46.0, ndvi: 0.81, apmc: "Kolhapur (Shahupuri) APMC" }
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await api.getFarmerDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [telemetry.soilMoisture, telemetry.temperature]);

  // Dynamic 3D Hero Carousel Slides matching KrishiSamadhan
  const heroSlides = [
    {
      id: "jai-jawan",
      icon: "🌾",
      title: language === "mr" 
        ? "जय जवान, जय किसान — प्रगत तंत्रज्ञानाने शेतकरी समृद्ध!" 
        : language === "hi" 
        ? "जय जवान, जय किसान — आधुनिक तकनीक से किसान समृद्ध!" 
        : "Jai Jawan, Jai Kisan — Empowering Farmers with Precision Tech!",
      subtitle: language === "mr"
        ? "उपग्रह डेटा, अचूक हवामान अंदाज, कृत्रिम बुद्धिमत्ता पीक सल्ला आणि भरघोस उत्पादनासाठी आधुनिक साधने."
        : language === "hi"
        ? "नेक्स्ट-जेन सैटेलाइट टेलीमेट्री, सटीक मौसम पूर्वानुमान और भरपूर पैदावार के लिए एआई फसल सलाह।"
        : "Next-gen satellite telemetry, AI pathology, and microclimate intelligence for high yields.",
      targetTab: "ai-advisor"
    },
    {
      id: "smart-agri",
      icon: "🚜",
      title: language === "mr" 
        ? "स्मार्ट शेती • भरघोस उत्पादन • समृद्ध शेतकरी!" 
        : language === "hi" 
        ? "स्मार्ट खेती • भरपूर उपज • समृद्ध किसान!" 
        : "Smart Agriculture • Abundant Harvest • Greater Prosperity!",
      subtitle: language === "mr"
        ? "एकत्रित पीक सल्ला, अनुभवी शेतमजूर, भाड्याने ट्रॅक्टर-यंत्रे आणि थेट शासकीय योजनांचा लाभ."
        : language === "hi"
        ? "सटीक फसल सलाह, अनुभवी खेत मजदूर, किराए पर ट्रैक्टर-उपकरण और सरकारी योजनाओं का सीधा लाभ।"
        : "Unified farm advisory, trusted labour hiring, modern machinery rentals, and government schemes.",
      targetTab: "ai-advisor"
    },
    {
      id: "weather-alert",
      icon: "🌧️",
      title: language === "mr" 
        ? "हवामान सल्ला: २४ तासांत पाऊस • पाणी देणे तात्पुरते थांबवा!" 
        : language === "hi" 
        ? "मौसम सलाह: 24 घंटे में 80% बारिश • सिंचाई रोकें!" 
        : "Weather Advisory: 80% Rain in 24h • Irrigation On Hold",
      subtitle: language === "mr"
        ? "मुळांमध्ये ३८.५% पुरेसा ओलावा असल्याने बोरवेल पंप बंद ठेवा. यामुळे पाणी व वीज बिलाची बचत होईल."
        : language === "hi"
        ? "मिट्टी में 38.5% पर्याप्त नमी है। बोरवेल पंप रोककर पानी और बिजली की बचत करें और जड़ों को सड़ने से बचाएं।"
        : "Soil moisture is at optimal 38.5% — hold borewell pump to prevent waterlogging & save electricity.",
      targetTab: "ai-advisor"
    },
    {
      id: "market-forecast",
      icon: "💰",
      title: language === "mr" 
        ? "बाजार भाव तेजी: सोयाबीन ₹४,६५०/क्विंटल • शुक्रवारी ₹४,८२० चा अंदाज" 
        : language === "hi" 
        ? "मंडी भाव में उछाल: सोयाबीन ₹4,650/क्विंटल • शुक्रवार को ₹4,820 तक पहुंचेगा" 
        : "APMC Price Surge: Soybean ₹4,650/Qtl • Expected ₹4,820 Peak",
      subtitle: language === "mr"
        ? "नाशिक बाजार समितीत भाव वाढीचा कल (+१.५३%). ३ दिवस माल रोखून धरल्यास जास्तीत जास्त नफा मिळेल."
        : language === "hi"
        ? "नासिक मंडी में भाव बढ़ रहा है (+1.53%)। अधिकतम मुनाफे के लिए अपनी फसल 3 दिन रोककर रखें।"
        : "Market forecast shows peak rates by Friday. Hold stocks 3 days for maximum return.",
      targetTab: "market"
    },
    {
      id: "labour-tractor-ready",
      icon: "🤝",
      title: language === "mr" 
        ? "४ कुशल शेतमजूर आणि ४५ HP ट्रॅक्टर जवळच उपलब्ध" 
        : language === "hi" 
        ? "4 कुशल खेत मजदूर और 45 HP ट्रैक्टर नजदीकी केंद्र पर तैयार" 
        : "4 Verified Workers & 45HP Tractor Ready Nearby",
      subtitle: language === "mr"
        ? "५ किमी परिसरात कापणी मजूर ₹४५०/दिवस दराने उपलब्ध. रोटाव्हेटरसह महिंद्रा ट्रॅक्टर भाड्याने बुक करा."
        : language === "hi"
        ? "5 किमी के दायरे में कटाई मजदूर ₹450/दिन पर उपलब्ध। रोटावेटर के साथ महिंद्रा ट्रैक्टर किराए पर बुक करें।"
        : "Harvest crew available within 5 km at ₹450/day. Mahindra 575 DI Tractor with Rotavator ready for booking.",
      targetTab: "labour-hiring"
    }
  ];

  // Auto-advance 3D carousel
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, heroSlides.length]);

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  const farmer = dashboardData?.farmer || user;
  const currentRegionData = regions.find(r => r.name === selectedRegion) || regions[0];

  // Module content mapped cleanly with dedicated section background images in requested order
  const modules = [
    {
      id: "market-prices",
      number: "1",
      icon: "💰",
      iconBg: "bg-purple-50 border-purple-200/80 text-purple-700",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80",
      accentGlow: "from-purple-500/10",
      title: language === "mr" ? "१. बाजार भाव (Market Prices)" : language === "hi" ? "1. मंडी भाव (Mandi Prices)" : "1. Mandi Prices",
      description: language === "mr" 
        ? "ताजे बाजार भाव, किमतीचा अंदाज आणि पीक विकण्याचा किंवा थांबण्याचा सल्ला." 
        : language === "hi" 
        ? "ताज़ा मंडी भाव, मूल्य रुझान और फसल बेचने या रुकने का सीधा सुझाव।" 
        : "Live APMC market rates, 7-day price forecasting, and optimal Sell or Wait recommendations.",
      actionLabel: language === "mr" ? "बाजार भाव तपासा" : language === "hi" ? "मंडी भाव देखें" : "Mandi Prices",
      targetTab: "market"
    },
    {
      id: "labour-machinery",
      number: "2",
      icon: "👷",
      iconBg: "bg-amber-50 border-amber-200/80 text-amber-700",
      image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80",
      accentGlow: "from-amber-500/10",
      title: language === "mr" ? "२. शेती मजूर व यंत्रसामग्री" : language === "hi" ? "2. मजदूर व कृषि उपकरण" : "2. Labour & Machinery",
      description: language === "mr" 
        ? "जवळपासचे कुशल शेतमजूर आणि भाड्याने उपलब्ध ट्रॅक्टर व यंत्रसामग्री." 
        : language === "hi" 
        ? "पास में उपलब्ध कुशल खेत मजदूर और किराए पर ट्रैक्टर व कृषि मशीनें।" 
        : "Find verified nearby farm workers and rent modern tractors, harvesters, and sprayers.",
      actionLabel: language === "mr" ? "मजूर व यंत्रे शोधा" : language === "hi" ? "मजदूर व मशीनें देखें" : "Labour & Machinery",
      targetTab: "labour-hiring"
    },
    {
      id: "govt-schemes",
      number: "3",
      icon: "🏛️",
      iconBg: "bg-emerald-50 border-emerald-200/80 text-emerald-700",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
      accentGlow: "from-emerald-500/10",
      title: language === "mr" ? "३. शासकीय योजना (Govt Schemes)" : language === "hi" ? "3. सरकारी योजनाएं (Govt Schemes)" : "3. Government Schemes",
      description: language === "mr" 
        ? "पीएम-किसान, सौर कृषी पंप, पीक विमा आणि शासकीय अनुदानाची माहिती." 
        : language === "hi" 
        ? "पीएम-किसान, सोलर पंप, फसल बीमा और सरकारी सब्सिडी की पूरी जानकारी।" 
        : "Direct benefit transfers, solar pump subsidies, crop insurance, and state farm assistance.",
      actionLabel: language === "mr" ? "योजना पहा" : language === "hi" ? "योजनाएं देखें" : "Government Schemes",
      targetTab: "schemes"
    },
    {
      id: "ai-advisory",
      number: "4",
      icon: "🤖",
      iconBg: "bg-blue-50 border-blue-200/80 text-blue-700",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80",
      accentGlow: "from-blue-500/10",
      title: language === "mr" ? "४. कृषी सल्ला (Farm Advisory)" : language === "hi" ? "4. फसल सलाह (Farm Advisory)" : "4. Farm Advisory",
      description: language === "mr" 
        ? "पिकांचे दैनंदिन योग्य नियोजन, रोग-कीड नियंत्रण आणि पाणी देण्याचा अचूक सल्ला." 
        : language === "hi" 
        ? "फसल का दैनिक प्रबंधन, मौसम चेतावनी और सिंचाई का सटीक सुझाव।" 
        : "Personalized daily agricultural actions, weather risk alerts, and irrigation schedules.",
      actionLabel: language === "mr" ? "कृषी सल्ला पहा" : language === "hi" ? "फसल सलाह देखें" : "Farm Advisory",
      targetTab: "ai-advisor"
    }
  ];

  // Telemetry items for bottom interactive row
  const telemetryItems = [
    { id: 0, icon: "🌡️", label: `${currentRegionData.temp}°C Live Temp`, detail: "Optimal growing temp for vegetative growth" },
    { id: 1, icon: "💧", label: `${currentRegionData.moisture}% Soil Moisture`, detail: "Root moisture optimal (35-50% standard)" },
    { id: 2, icon: "🌾", label: `NDVI ${currentRegionData.ndvi} (Healthy Biomass)`, detail: "Satellite Sentinel-2 high vigor reflection" },
    { id: 3, icon: "💰", label: currentRegionData.apmc, detail: "Modal APMC price: ₹4,650/Qtl (+1.53% Today)" }
  ];

  return (
    <div className="space-y-7 pb-12 font-sans">
      {/* 1. DARK FOREST GREEN HERO SECTION WITH SPOTLIGHT & INTERACTION */}
      <div className="bg-gradient-to-b from-[#024a2c] via-[#033f25] to-[#01351e] rounded-[28px] sm:rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-visible">
        {/* TOP LEFT SPOTLIGHT / CONE OF LIGHT */}
        <div className="absolute top-0 left-10 w-28 h-7 bg-emerald-300/30 rounded-full blur-md pointer-events-none -translate-y-2 shadow-[0_0_30px_rgba(52,211,153,0.5)]" />
        <div 
          className="absolute top-6 left-12 w-24 h-16 pointer-events-none opacity-40"
          style={{
            background: "linear-gradient(to bottom, rgba(52,211,153,0.35), transparent)",
            clipPath: "polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)"
          }}
        />

        {/* TOP RIGHT AMBIENT AURA */}
        <div className="absolute -top-10 right-16 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Pill Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-20">
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Spotlight Brand Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-white text-xs font-semibold shadow-[0_0_15px_rgba(52,211,153,0.3)]">
              <span className="text-emerald-300">🌱</span>
              <span>Krishi Samadhan Intelligence</span>
            </div>

            {/* Satellite Telemetry Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-medium">
              <span className="animate-spin-slow">🛰️</span>
              <span>Sentinel-2 & Live Telemetry</span>
            </div>
          </div>

          {/* Interactive Region Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRegionMenu(!showRegionMenu)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white text-xs font-semibold transition-all shadow-sm group"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>📍 {selectedRegion} (Switch Region)</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Region Dropdown Menu */}
            {showRegionMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80 border-b border-white/10">
                  Select Agriculture Region
                </div>
                <div className="py-1 space-y-1">
                  {regions.map((reg) => (
                    <button
                      key={reg.name}
                      onClick={() => {
                        setSelectedRegion(reg.name);
                        setShowRegionMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        selectedRegion === reg.name ? "bg-emerald-600/60 text-white font-bold" : "text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{reg.name}</div>
                        <div className="text-[10px] text-emerald-200/70">{reg.sub}</div>
                      </div>
                      {selectedRegion === reg.name && <Check className="w-4 h-4 text-emerald-300" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CENTER 3D SLIDING INTERACTIVE HERO CARD */}
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative bg-black/35 backdrop-blur-md rounded-2xl border border-white/15 p-5 sm:p-6 mt-4 mb-4 z-10 text-left overflow-hidden shadow-2xl transition-all duration-300"
          style={{ perspective: "1200px" }}
        >
          {/* Internal Ambient Radial Lighting */}
          <div className="absolute -top-10 -right-10 w-56 h-56 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Slides Display Area */}
          <div className="relative min-h-[96px] sm:min-h-[82px] flex items-center">
            {heroSlides.map((slide, idx) => {
              const isActive = idx === currentSlide;
              return (
                <div
                  key={slide.id}
                  onClick={() => onNavigate(slide.targetTab)}
                  className={`absolute inset-0 flex flex-col justify-center cursor-pointer transition-all duration-500 ease-out transform ${
                    isActive
                      ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                      : idx < currentSlide
                      ? "opacity-0 -translate-x-12 scale-95 pointer-events-none"
                      : "opacity-0 translate-x-12 scale-95 pointer-events-none"
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                    <span className="text-2xl sm:text-3xl filter drop-shadow">{slide.icon}</span>
                    <h2 className="text-base sm:text-xl md:text-2xl font-black text-white tracking-tight font-display hover:text-emerald-300 transition-colors">
                      {slide.title}
                    </h2>
                  </div>

                  <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
                    {slide.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Glowing Animated Progress Bar (Matching KrishiSamadhan reference image) */}
          <div className="flex items-center gap-2 mt-4 pt-1 z-20">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide 
                    ? "w-7 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" 
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* BOTTOM TELEMETRY ROW */}
        <div className="relative pt-1 z-10">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {telemetryItems.map((item, idx) => {
              const isSelected = activeTelemetryIndex === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTelemetryIndex(idx)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md border text-xs font-medium transition-all duration-300 ${
                    isSelected 
                      ? "bg-white/30 border-emerald-300 text-white shadow-[0_0_15px_rgba(52,211,153,0.4)] scale-102 font-bold" 
                      : "bg-white/10 hover:bg-white/20 border-white/20 text-white/90"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. SECTION HEADING */}
      <div className="pt-2">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display">
          {language === "mr" 
            ? `शेतकरी मार्गदर्शक मॉड्यूल्स (${selectedRegion.split(" ")[0]})` 
            : language === "hi" 
            ? `किसान इंटेलिजेंस मॉड्यूल्स (${selectedRegion.split(" ")[0]})` 
            : `Farmer Intelligence Modules (${selectedRegion.split(" ")[0]})`}
        </h2>
      </div>

      {/* 3. 4-COLUMN GRID OF FARMER MODULE CARDS WITH DEDICATED SECTION IMAGES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-400/60 transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Top Image Banner with Floating Icon Badge */}
            <div className="relative h-36 w-full overflow-hidden bg-slate-100">
              <img
                src={mod.image}
                alt=""
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80";
                }}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
              
              {/* Floating Section Icon */}
              <div className={`absolute bottom-3 left-4 w-11 h-11 rounded-2xl ${mod.iconBg} bg-white/95 backdrop-blur-md border shadow-md flex items-center justify-center text-xl`}>
                {mod.icon}
              </div>
            </div>

            {/* Pure Crisp White Content Area */}
            <div className="p-5 flex-1 flex flex-col justify-between bg-white">
              <div>
                {/* Title */}
                <h3 className="font-extrabold text-base text-slate-900 font-display tracking-tight mb-2">
                  {mod.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {mod.description}
                </p>
              </div>

              {/* Rounded Outline Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onNavigate(mod.targetTab)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-slate-800 hover:text-emerald-700 text-xs font-bold transition-all flex items-center justify-center gap-2 group/btn shadow-sm"
                >
                  <span>{mod.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform text-emerald-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
