import React from "react";
import { useLanguage } from "../../context/LanguageContext";
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
  Heart
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
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-xl shadow-inner">
                🌱
              </div>
              <span className="text-xl font-black tracking-tight font-display text-white">
                {t("common.appName")}
              </span>
            </div>
            
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              {t("footer.tagline")}
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-emerald-200 border border-white/15 backdrop-blur-sm">
                🇮🇳 Digital Agriculture
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                ✓ 100% Free
              </span>
            </div>
          </div>

          {/* Column 2: Key Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-4">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("market")}
                  className="hover:text-white hover:underline transition-all flex items-center gap-1.5"
                >
                  <span>💰</span>
                  <span>{t("footer.mandi")}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("labour-hiring")}
                  className="hover:text-white hover:underline transition-all flex items-center gap-1.5"
                >
                  <span>👷</span>
                  <span>{t("footer.labour")}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("machinery")}
                  className="hover:text-white hover:underline transition-all flex items-center gap-1.5"
                >
                  <span>🚜</span>
                  <span>{t("footer.machinery")}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("schemes")}
                  className="hover:text-white hover:underline transition-all flex items-center gap-1.5"
                >
                  <span>🏛️</span>
                  <span>{t("footer.schemes")}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("ai-advisor")}
                  className="hover:text-white hover:underline transition-all flex items-center gap-1.5"
                >
                  <span>🤖</span>
                  <span>{t("footer.advisory")}</span>
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

          {/* Column 4: Trust & Transparency */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-4">
              {language === "mr" ? "सुरक्षित आणि पारदर्शक" : language === "hi" ? "सुरक्षित और पारदर्शी" : "Security & Trust"}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px]">Direct DBT & Verified Subsidies</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px]">Zero Middlemen / Direct Farmer Contact</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px]">Daily Official APMC Price Feeds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            © 2026 {t("footer.copyright")}
          </p>

          <div className="flex items-center gap-4 text-xs text-emerald-200/70">
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
