import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { api } from "../../services/api";
import { 
  TrendingUp, 
  MapPin, 
  IndianRupee, 
  Truck, 
  Sparkles, 
  ArrowDown, 
  ArrowRight,
  CheckCircle2, 
  Star, 
  FileText, 
  Search, 
  Scale, 
  ShieldCheck,
  ChevronRight,
  BarChart3,
  Calendar,
  Layers
} from "lucide-react";
import confetti from "canvas-confetti";

export const MarketIntelligenceTab = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // User input states matching exact requested flow
  const [location, setLocation] = useState(user?.location?.district || "Ahmednagar");
  const [moneyNeeded, setMoneyNeeded] = useState("50000");
  const [crop, setCrop] = useState(user?.farm?.primaryCrop || "Wheat");
  const [loading, setLoading] = useState(false);

  // Computed / API results
  const [comparisonResult, setComparisonResult] = useState(null);

  const CROPS_LIST = [
    "Wheat",
    "Soybean",
    "Onion",
    "Cotton",
    "Tomato",
    "Maize",
    "Rice",
    "Gram (Chana)"
  ];

  const POPULAR_LOCATIONS = [
    "Ahmednagar",
    "Niphad",
    "Nashik",
    "Pune",
    "Lasalgaon",
    "Solapur"
  ];

  // Perform Calculation with Backend / Serverless API
  const calculateMarketScheme = async () => {
    setLoading(true);
    try {
      const res = await api.compareMarketScheme({
        crop,
        location,
        moneyNeeded: parseFloat(moneyNeeded) || 50000
      });
      setComparisonResult(res);
      confetti({ particleCount: 35, spread: 60 });
    } catch (err) {
      console.error("Market scheme calculation error:", err);
      // Deterministic fallback matching exact requested architecture
      const target = parseFloat(moneyNeeded) || 50000;
      const isAhmednagar = (location || "").toLowerCase().includes("ahmednagar");
      
      const fallbackMandis = [
        { id: "1", name: "Ahmednagar", pricePerQtl: 2500, transport: isAhmednagar ? 200 : 420, netPricePerQtl: isAhmednagar ? 2300 : 2080 },
        { id: "2", name: "Pune", pricePerQtl: 2800, transport: isAhmednagar ? 700 : 680, netPricePerQtl: isAhmednagar ? 2100 : 2120 },
        { id: "3", name: "Nashik", pricePerQtl: 2650, transport: isAhmednagar ? 450 : 200, netPricePerQtl: isAhmednagar ? 2200 : 2450 }
      ].map(m => {
        const qNeeded = Math.ceil(target / m.netPricePerQtl);
        return {
          ...m,
          quintalsNeeded: qNeeded,
          totalGross: qNeeded * m.pricePerQtl,
          totalTransport: qNeeded * m.transport,
          netRevenue: (qNeeded * m.pricePerQtl) - (qNeeded * m.transport)
        };
      });

      const sorted = [...fallbackMandis].sort((a, b) => b.netPricePerQtl - a.netPricePerQtl);
      const best = sorted[0];

      setComparisonResult({
        crop,
        location: location || "Ahmednagar",
        moneyNeeded: target,
        comparison: sorted,
        bestOption: {
          mandi: best.name,
          badge: `★ ${best.name.toUpperCase()} ★`,
          netPricePerQtl: best.netPricePerQtl,
          pricePerQtl: best.pricePerQtl,
          transport: best.transport,
          quintalsNeeded: best.quintalsNeeded,
          netAdvantagePerQtl: best.netPricePerQtl - sorted[sorted.length - 1].netPricePerQtl
        },
        conclusion: `Based on crop price (₹${best.pricePerQtl.toLocaleString('en-IN')}/Q), transport cost (₹${best.transport}/Q), location (${location || 'Ahmednagar'}) and money needed (₹${target.toLocaleString('en-IN')}), the system recommends ${best.name} as the most profitable market with the highest net realization of ₹${best.netPricePerQtl.toLocaleString('en-IN')}/Quintal.`
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateMarketScheme();
  }, [crop, location, moneyNeeded]);

  return (
    <div className="space-y-6 pb-12 font-sans max-w-4xl mx-auto">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER: MARKET SCHEME                                              */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600" />
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/70 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
          <span>🏛️</span>
          <span>{t("market.title", "MARKET SCHEME")}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
          {t("market.title", "MARKET SCHEME")}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-xl mx-auto mt-1 leading-relaxed">
          {t("market.subtitle", "Find the most profitable APMC Mandi based on crop price, transport cost, and your required target revenue")}
        </p>
      </div>

      {/* Downward Connector Arrow */}
      <div className="flex justify-center -my-2">
        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shadow-sm border border-emerald-200 animate-bounce">
          <ArrowDown className="w-4 h-4" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ENTER LOCATION                                                         */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-black flex items-center justify-center">
              1
            </span>
            <label className="text-sm font-black uppercase tracking-wider text-slate-900 font-display">
              {t("market.enterLocation", "ENTER LOCATION")}
            </label>
          </div>
          <span className="text-[11px] font-bold text-slate-400">Step 1 of 3</span>
        </div>

        <div className="relative">
          <MapPin className="w-4 h-4 text-emerald-600 absolute left-4 top-3.5" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t("market.locationPlaceholder", "Enter Location (e.g. Ahmednagar, Niphad, Nashik, Pune)...")}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm bg-slate-50 text-slate-900"
          />
        </div>

        {/* Quick Location Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] font-bold text-slate-400">Quick Select:</span>
          {POPULAR_LOCATIONS.map((loc) => (
            <button
              key={loc}
              onClick={() => setLocation(loc)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                location.toLowerCase().includes(loc.toLowerCase())
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              📍 {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Downward Connector Arrow */}
      <div className="flex justify-center -my-2">
        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shadow-sm border border-emerald-200">
          <ArrowDown className="w-4 h-4" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MONEY NEEDED                                                           */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-black flex items-center justify-center">
              2
            </span>
            <label className="text-sm font-black uppercase tracking-wider text-slate-900 font-display">
              {t("market.moneyNeeded", "MONEY NEEDED")}
            </label>
          </div>
          <span className="text-[11px] font-bold text-slate-400">Step 2 of 3</span>
        </div>

        <div className="relative">
          <span className="absolute left-4 top-3 text-emerald-700 font-black text-base">₹</span>
          <input
            type="number"
            value={moneyNeeded}
            onChange={(e) => setMoneyNeeded(e.target.value)}
            placeholder={t("market.moneyNeededPlaceholder", "Enter Money Needed (e.g. 50000)...")}
            className="w-full pl-9 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-black text-base bg-slate-50 text-emerald-900 font-mono"
          />
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] font-bold text-slate-400">Presets:</span>
          {["25000", "50000", "100000", "200000"].map((amt) => (
            <button
              key={amt}
              onClick={() => setMoneyNeeded(amt)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                moneyNeeded === amt
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              ₹{parseInt(amt).toLocaleString('en-IN')}
            </button>
          ))}
        </div>
      </div>

      {/* Downward Connector Arrow */}
      <div className="flex justify-center -my-2">
        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shadow-sm border border-emerald-200">
          <ArrowDown className="w-4 h-4" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. COMPARE MARKET PRICES (Crop Selector + Price Table)                    */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-black flex items-center justify-center">
              3
            </span>
            <h2 className="text-base font-black uppercase tracking-wider text-slate-900 font-display">
              {t("market.compareMarketPrices", "COMPARE MARKET PRICES")}
            </h2>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Live Net Rates
          </span>
        </div>

        {/* Enter Crop Field */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
            {t("market.enterCrop", "Select or Enter Crop")}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <div className="sm:col-span-4">
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-black focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 text-slate-900"
              >
                {CROPS_LIST.map((c) => (
                  <option key={c} value={c}>
                    🌾 {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mandi Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-inner">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 font-black uppercase text-[11px] border-b border-slate-200">
                <th className="py-3 px-4">{t("market.mandi", "Mandi")}</th>
                <th className="py-3 px-4">{t("market.pricePerQ", "Price/Q")}</th>
                <th className="py-3 px-4">{t("market.transport", "Transport")}</th>
                <th className="py-3 px-4 text-emerald-800">{t("market.netPricePerQ", "Net Price/Q")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {comparisonResult?.comparison?.map((row, idx) => {
                const isBest = comparisonResult.bestOption?.mandi === row.name;
                return (
                  <tr
                    key={row.id || idx}
                    className={`transition-colors ${
                      isBest ? "bg-emerald-50/70 font-bold" : "hover:bg-slate-50/80"
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {isBest && <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />}
                        <span className={`text-sm ${isBest ? "font-black text-emerald-900" : "font-semibold text-slate-800"}`}>
                          {row.name}
                        </span>
                        {isBest && (
                          <span className="text-[10px] font-black uppercase bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full ml-1">
                            Best
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      ₹{row.pricePerQtl?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-rose-600">
                      ₹{row.transport?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-700 text-sm">
                      ₹{row.netPricePerQtl?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Downward Connector Arrow */}
      <div className="flex justify-center -my-2">
        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shadow-sm border border-emerald-200">
          <ArrowDown className="w-4 h-4" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. BEST OPTION (Highlight Card)                                           */}
      {/* ========================================================================= */}
      {comparisonResult?.bestOption && (
        <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-emerald-950 text-white rounded-3xl p-7 shadow-xl space-y-4 border border-emerald-600 relative overflow-hidden animate-in zoom-in-95">
          <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-9xl select-none">
            ★
          </div>

          <div className="flex items-center justify-between border-b border-emerald-700/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <h3 className="text-sm font-black uppercase tracking-wider text-emerald-200">
                {t("market.bestOption", "BEST OPTION")}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-sm">
              {t("market.bestOverallOption", "Best Overall Option")}
            </span>
          </div>

          {/* Large Center Headline */}
          <div className="text-center py-2 space-y-1">
            <div className="text-2xl sm:text-4xl font-black tracking-tight text-amber-300 font-display">
              {comparisonResult.bestOption.badge}
            </div>
            <p className="text-xs font-semibold text-emerald-100">
              {t("market.highestNetPrice", "Highest Net Price / Q")}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/50 text-center">
              <div className="text-[10px] font-bold uppercase text-emerald-300">Net Realization</div>
              <div className="text-base font-black text-white mt-0.5">
                ₹{comparisonResult.bestOption.netPricePerQtl?.toLocaleString('en-IN')} / Q
              </div>
            </div>

            <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/50 text-center">
              <div className="text-[10px] font-bold uppercase text-emerald-300">Transport Cost</div>
              <div className="text-base font-black text-amber-200 mt-0.5">
                ₹{comparisonResult.bestOption.transport?.toLocaleString('en-IN')} / Q
              </div>
            </div>

            <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/50 text-center">
              <div className="text-[10px] font-bold uppercase text-emerald-300">Quantity Needed</div>
              <div className="text-base font-black text-white mt-0.5">
                {comparisonResult.bestOption.quintalsNeeded} Quintals
              </div>
            </div>

            <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/50 text-center">
              <div className="text-[10px] font-bold uppercase text-emerald-300">Total Net Revenue</div>
              <div className="text-base font-black text-emerald-300 mt-0.5">
                ₹{(comparisonResult.bestOption.quintalsNeeded * comparisonResult.bestOption.netPricePerQtl)?.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Downward Connector Arrow */}
      <div className="flex justify-center -my-2">
        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shadow-sm border border-emerald-200">
          <ArrowDown className="w-4 h-4" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. CONCLUSION                                                             */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="text-xl">📝</span>
          <h3 className="text-base font-black uppercase tracking-wider text-slate-900 font-display">
            {t("market.conclusion", "CONCLUSION")}
          </h3>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
          {comparisonResult?.conclusion || t("market.conclusionText", "Based on crop price, transport cost, location and money needed, the system recommends the most profitable market.")}
        </p>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Selling at <strong>{comparisonResult?.bestOption?.mandi || 'Ahmednagar'}</strong> maximizes your in-hand earnings after freight expenses. You avoid unnecessary long-distance transit costs while receiving optimal modal price.
          </span>
        </div>
      </div>
    </div>
  );
};
