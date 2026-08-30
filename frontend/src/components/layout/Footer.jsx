import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { KrishiYugLogo } from "../common/KrishiYugLogo";
import { 
  Sprout, 
  PhoneCall, 
  ShieldCheck, 
  MapPin, 
  TrendingUp, 
  Users, 
  Tractor, 
  Landmark, 
  BrainCircuit, 
  ExternalLink,
  Heart,
  Info,
  Database,
  Satellite
} from "lucide-react";

export const Footer = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-gradient-to-b from-[#033b21] via-[#02301a] to-[#012212] text-white pt-12 pb-8 border-t border-emerald-900/60 mt-auto">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-3.5">
            <div className="inline-block bg-white px-3 py-1.5 rounded-2xl shadow-sm">
              <KrishiYugLogo 
                size="sm" 
                onClick={() => onNavigate && onNavigate("dashboard")}
              />
            </div>
            
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              {t("footer.tagline")}
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-emerald-200 border border-white/15 backdrop-blur-sm">
                🇮🇳 Digital Agriculture
              </span>
              <button
                onClick={() => onNavigate && onNavigate("about")}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30 transition-colors cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-emerald-400" />
                <span>About & Data Sources</span>
              </button>
            </div>
          </div>

          {/* Column 2: Key Services & About */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-4">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("market")}
                  className="hover:text-white hover:underline transition-all flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span>💰</span>
                  <span>{t("footer.mandi")}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("labour-hiring")}
                  className="hover:text-white hover:underline transition-all flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span>👷</span>
                  <span>{t("footer.labour")}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("machinery")}
                  className="hover:text-white hover:underline transition-all flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span>🚜</span>
                  <span>{t("footer.machinery")}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("schemes")}
                  className="hover:text-white hover:underline transition-all flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span>🏛️</span>
                  <span>{t("footer.schemes")}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("ai-advisor")}
                  className="hover:text-white hover:underline transition-all flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span>🤖</span>
                  <span>{t("footer.advisory")}</span>
                </button>
              </li>
              <li className="pt-1 border-t border-white/10">
                <button
                  onClick={() => onNavigate && onNavigate("about")}
                  className="text-emerald-300 hover:text-white font-bold transition-all flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === "mr" ? "माहिती व डेटा स्रोत (About & Sources)" : language === "hi" ? "के बारे में और डेटा स्रोत (About & Sources)" : "About & Data Sources"}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Helpline & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-4">
              {t("footer.helplineTitle")}
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-white font-extrabold text-sm mb-1">
                  <PhoneCall className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>{t("footer.helplineNumber")}</span>
                </div>
                <p className="text-[11px] text-emerald-200/90 leading-tight">
                  {t("footer.helplineTime")}
                </p>
              </div>

              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  {t("footer.regionalCenter")}
                </span>
              </div>
            </div>
          </div>

          {/* Column 4: Trust & Verified Sourcing */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-4">
              {language === "mr" ? "डेटा स्रोत व पारदर्शकता" : language === "hi" ? "डेटा स्रोत और पारदर्शिता" : "Verified Data Sources"}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px]">Agmarknet / e-NAM APMC Rates</span>
              </div>
              <div className="flex items-center gap-2">
                <Satellite className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px]">ESA Sentinel-2 Satellite NDVI</span>
              </div>
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px]">IMD Radar & ICAR Pest Models</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px]">Direct Govt Portals & PMFBY / KISAN</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate && onNavigate("about")}
                  className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-emerald-500/30 text-emerald-200 hover:text-white text-[11px] font-bold transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>Explore All 6 Data Architectures</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            © 2026 {t("footer.copyright")}
          </p>

          <div className="flex items-center gap-4 text-xs text-emerald-200/70 flex-wrap justify-center">
            <button
              onClick={() => onNavigate && onNavigate("about")}
              className="text-emerald-300 hover:text-white font-bold transition-colors cursor-pointer"
            >
              About & Data Sources
            </button>
            <span>•</span>
            <span>English • मराठी • हिंदी</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" /> for Farmers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
