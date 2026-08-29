import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { Badge } from "../../components/common/Badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  IndianRupee, 
  Truck, 
  Sparkles, 
  Calendar, 
  BarChart3, 
  ArrowRight,
  ShieldAlert,
  Info,
  CheckCircle2
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

export const MarketIntelligenceTab = () => {
  const { user } = useAuth();
  const [prices, setPrices] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(user?.farm?.primaryCrop || "Soybean");
  const [selectedState, setSelectedState] = useState("");
  const [quantityQtl, setQuantityQtl] = useState(50);
  const [comparisonData, setComparisonData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [timeframe, setTimeframe] = useState("7d"); // "7d" | "30d" | "seasonal"
  const [loading, setLoading] = useState(true);

  const CROPS = [
    "Soybean",
    "Wheat",
    "Onion",
    "Cotton",
    "Tomato",
    "Rice",
    "Maize",
    "Sugarcane",
    "Potato"
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pricesRes, compRes, predRes, histRes] = await Promise.all([
        api.getMarketPrices({ crop: selectedCrop, state: selectedState }),
        api.getMarketComparison({ crop: selectedCrop, quantity: quantityQtl }),
        api.getMarketPrediction(selectedCrop),
        api.getHistoricalMarketTrends()
      ]);

      setPrices(pricesRes.prices || []);
      setComparisonData(compRes);
      setPredictionData(predRes);
      setHistoricalData(histRes.historicalTrends || []);
    } catch (err) {
      console.error("Market data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCrop, selectedState, quantityQtl]);

  // Chart data filter based on timeframe
  const getChartData = () => {
    if (timeframe === "7d") {
      return historicalData.slice(0, 7);
    } else if (timeframe === "30d") {
      return historicalData.slice(0, 11);
    } else {
      return historicalData.slice(11); // monthly seasonal
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-200">
              Market Intelligence & Mandi Analytics
            </span>
            <span className="text-xs font-bold text-slate-400">• Real-Time APMC Feeds</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-1">
            Mandi Price Comparison, Trends & AI Forecasts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare prices across terminal Mandis, factor in transport logistics, and project 7–30 day selling windows.
          </p>
        </div>

        {/* Crop Selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <span className="text-xs font-bold text-slate-600 pl-2">Select Crop:</span>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-agri-500"
          >
            {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* SECTION 1: Market Price Comparison with Transport Cost (Requirements #16 & #17) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Logistics & Net Realization Engine</span>
            <h2 className="text-xl font-extrabold text-slate-900 font-display mt-0.5">
              Multi-Mandi Price & Transport Comparison ({selectedCrop})
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600">Dispatched Quantity:</span>
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <input
                type="number"
                min="5"
                step="5"
                value={quantityQtl}
                onChange={(e) => setQuantityQtl(e.target.value)}
                className="w-16 text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
              />
              <span className="text-xs text-slate-400 font-semibold">Quintals</span>
            </div>
          </div>
        </div>

        {/* Best Market Highlight Card */}
        {comparisonData?.bestMarket && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-agri-500/10 to-transparent border border-emerald-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xl shadow-md">
                🏆
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                    Best Net Realization Market
                  </span>
                  <span className="text-xs font-bold text-slate-900">{comparisonData.bestMarket.name}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Gross Price: <strong>₹{comparisonData.bestMarket.todayPrice}/Qtl</strong> • Net After Transport: <strong className="text-emerald-700">₹{comparisonData.bestMarket.netRealizedPricePerQuintal}/Qtl</strong> (~{comparisonData.bestMarket.estimatedDistanceKm} km)
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-500">Net Estimated Revenue ({quantityQtl} Qtl)</div>
              <div className="text-xl font-extrabold text-emerald-700 font-display">
                ₹{comparisonData.bestMarket.netRevenue?.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] font-semibold text-emerald-800">
                +₹{comparisonData.summary?.netAdditionalRevenue?.toLocaleString('en-IN')} extra profit
              </span>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Mandi / Terminal Market</th>
                <th className="py-3 px-3">Gross Price (Today)</th>
                <th className="py-3 px-3">Est. Distance</th>
                <th className="py-3 px-3">Transport Cost / Qtl</th>
                <th className="py-3 px-3">Net Realized Price</th>
                <th className="py-3 px-3">Gross Revenue</th>
                <th className="py-3 px-3">Net Revenue ({quantityQtl} Q)</th>
                <th className="py-3 px-3">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {comparisonData?.comparison?.map((m, idx) => (
                <tr key={m.mandi} className={`hover:bg-slate-50/80 transition-colors ${idx === 0 ? "bg-emerald-50/30 font-semibold" : ""}`}>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900">{m.mandi}</div>
                    <div className="text-[10px] text-slate-400">{m.district}, {m.state}</div>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-900">
                    ₹{m.todayPrice} <span className="text-[10px] font-normal text-slate-400">/ Qtl</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">{m.distanceKm} km</td>
                  <td className="py-3.5 px-3 text-rose-600 font-semibold">-₹{m.transportCostPerQuintal}/Qtl</td>
                  <td className="py-3.5 px-3 font-extrabold text-emerald-700">₹{m.netRealizedPricePerQuintal}/Qtl</td>
                  <td className="py-3.5 px-3 text-slate-600">₹{m.grossRevenue?.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-3 font-bold text-slate-900">₹{m.netRevenue?.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      m.trend.includes("Up") ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
                    }`}>
                      {m.trend.includes("Up") ? "↑" : "→"} {m.priceChangePercent}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {comparisonData?.summary?.advisoryNote && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Transportation & Profit Consideration:</strong> {comparisonData.summary.advisoryNote}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Future Market Price Prediction Engine (Requirement #19) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-harvest-500/20 text-harvest-400 flex items-center justify-center border border-harvest-400/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-harvest-400 text-slate-950">
                  AI/Model Price Prediction
                </span>
              </div>
              <h2 className="text-xl font-bold font-display text-white mt-1">
                7, 15 & 30-Day Market Price Prediction ({selectedCrop})
              </h2>
            </div>
          </div>

          <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/15 text-right">
            <div className="text-[10px] text-slate-300 uppercase font-semibold">Model Confidence</div>
            <div className="text-lg font-extrabold text-emerald-400 font-mono">
              {predictionData?.confidenceScore || 88}%
            </div>
          </div>
        </div>

        {/* 3 Timeframe Forecast Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {predictionData?.forecasts?.map((fc, idx) => (
            <div key={fc.timeframe} className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{fc.timeframe}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  fc.direction === "Upward" ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30" : "bg-rose-400/20 text-rose-300"
                }`}>
                  {fc.direction} ({fc.percentChange}%)
                </span>
              </div>

              <div>
                <div className="text-2xl font-extrabold text-white font-display">
                  ₹{fc.predictedPrice?.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Expected change: <strong className="text-emerald-400">+{fc.expectedChange} ₹/Qtl</strong>
                </div>
              </div>

              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full" 
                  style={{ width: `${80 + idx * 6}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Influencing Driving Factors */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-harvest-300">
            Key Influencing Indicators (AI Reasoning)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
            {predictionData?.influencingFactors?.map((fac, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{fac}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-slate-400 italic">
          * {predictionData?.disclaimer}
        </p>
      </div>

      {/* SECTION 3: Interactive Historical & Seasonal Charts (Requirement #18) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Interactive Analytics</span>
            <h2 className="text-xl font-extrabold text-slate-900 font-display mt-0.5">
              Historical Price Trends & Seasonal Cycles
            </h2>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setTimeframe("7d")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeframe === "7d" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              7-Day Trend
            </button>
            <button
              onClick={() => setTimeframe("30d")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeframe === "30d" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              30-Day View
            </button>
            <button
              onClick={() => setTimeframe("seasonal")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeframe === "seasonal" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Seasonal 1-Year Cycle
            </button>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={getChartData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSoybean" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorOnion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorWheat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey={timeframe === "seasonal" ? "month" : "date"} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={['dataMin - 200', 'dataMax + 200']} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Area type="monotone" dataKey="soybean" name="Soybean (₹/Q)" stroke="#16a34a" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSoybean)" />
              <Area type="monotone" dataKey="onion" name="Onion (₹/Q)" stroke="#d97706" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOnion)" />
              <Area type="monotone" dataKey="wheat" name="Wheat (₹/Q)" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorWheat)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
