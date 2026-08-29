import React from "react";

export const MetricCard = ({ title, value, unit, subtitle, icon: Icon, trend, trendValue, color = "emerald", className = "" }) => {
  const colorStyles = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    sky: "bg-sky-50 text-sky-600 border-sky-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    gold: "bg-harvest-50 text-harvest-600 border-harvest-100"
  };

  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl font-extrabold text-slate-900 font-display">{value}</span>
            {unit && <span className="text-sm font-medium text-slate-500">{unit}</span>}
          </div>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${colorStyles[color] || colorStyles.emerald}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trendValue) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trendValue && (
            <span className={`inline-flex items-center font-bold ${trend === "up" ? "text-emerald-600" : trend === "down" ? "text-rose-600" : "text-slate-600"}`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </span>
          )}
          {subtitle && <span className="text-slate-500 font-medium truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
