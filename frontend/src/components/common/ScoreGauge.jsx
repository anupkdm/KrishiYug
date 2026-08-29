import React from "react";

export const ScoreGauge = ({ score = 84, max = 100, label = "Farm Intelligence Score", submetrics = [] }) => {
  const percentage = Math.min(100, Math.max(0, (score / max) * 100));
  
  let strokeColor = "#16a34a"; // green
  let statusText = "Excellent Farm Health & Readiness";
  let statusBadgeColor = "text-emerald-700 bg-emerald-100";

  if (percentage < 50) {
    strokeColor = "#e11d48"; // red
    statusText = "Action Required (High Stress/Risk)";
    statusBadgeColor = "text-rose-700 bg-rose-100";
  } else if (percentage < 75) {
    strokeColor = "#d97706"; // amber
    statusText = "Moderate (Attention Needed)";
    statusBadgeColor = "text-amber-700 bg-amber-100";
  }

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Circular SVG Gauge */}
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-100"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={strokeColor}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-slate-900 font-display">{score}</span>
              <span className="text-[11px] font-semibold text-slate-400 -mt-1">/ {max}</span>
            </div>
          </div>

          <div>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-1.5 ${statusBadgeColor}`}>
              {statusText}
            </span>
            <h3 className="text-lg font-bold text-slate-900 font-display">{label}</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-0.5">
              Synthesized from real-time soil telemetry, rainfall forecast, pest pressure, mandi price momentum & resource readiness.
            </p>
          </div>
        </div>
      </div>

      {submetrics.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-100">
          {submetrics.map((item, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                <span className="truncate">{item.label}</span>
                <span className="font-bold text-slate-800">{item.score}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.score >= 80 ? "bg-emerald-500" : item.score >= 60 ? "bg-amber-500" : "bg-rose-500"
                  }`}
                  style={{ width: `${Math.min(100, item.score)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
