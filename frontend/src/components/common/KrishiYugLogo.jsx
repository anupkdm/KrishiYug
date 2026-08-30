import React from "react";

export const KrishiYugLogo = ({ 
  size = "md", 
  variant = "dark", // "dark" (for light backgrounds) | "light" (for dark backgrounds)
  showSubtitle = true,
  onClick,
  className = ""
}) => {
  // Size presets
  const sizeConfig = {
    sm: {
      emblem: "w-7 h-7 sm:w-8 sm:h-8",
      title: "text-lg sm:text-xl",
      subtitle: "text-[9px] sm:text-[10px]",
      gap: "gap-2"
    },
    md: {
      emblem: "w-9 h-9 sm:w-10 sm:h-10",
      title: "text-xl sm:text-2xl",
      subtitle: "text-[10px] sm:text-[11px]",
      gap: "gap-2.5"
    },
    lg: {
      emblem: "w-12 h-12 sm:w-14 sm:h-14",
      title: "text-2xl sm:text-3xl",
      subtitle: "text-xs sm:text-sm",
      gap: "gap-3.5"
    }
  }[size] || {
    emblem: "w-9 h-9 sm:w-10 sm:h-10",
    title: "text-xl sm:text-2xl",
    subtitle: "text-[10px] sm:text-[11px]",
    gap: "gap-2.5"
  };

  const isLight = variant === "light";

  return (
    <div 
      onClick={onClick}
      className={`flex items-center ${sizeConfig.gap} select-none ${onClick ? "cursor-pointer group" : ""} ${className}`}
    >
      {/* Precision Vector Emblem matching the KrishiYug logo */}
      <div className={`relative ${sizeConfig.emblem} shrink-0 transition-transform duration-300 ${onClick ? "group-hover:scale-105" : ""}`}>
        <svg 
          viewBox="0 0 120 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          <defs>
            {/* Primary Rich Leaf Gradient */}
            <linearGradient id="leafGradPrimary" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="45%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#0d5929" />
            </linearGradient>

            {/* Deep Shade Gradient */}
            <linearGradient id="leafGradDeep" x1="10" y1="30" x2="90" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="60%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>

            {/* Accent Highlight */}
            <linearGradient id="leafGradAccent" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>

          {/* 1. Left Leaf Shoot */}
          <path 
            d="M 32 46 C 24 38, 26 22, 38 20 C 48 18, 52 28, 48 38 C 44 46, 38 48, 32 46 Z" 
            fill="url(#leafGradAccent)" 
          />
          <path 
            d="M 32 46 C 36 36, 42 28, 48 24" 
            stroke="#15803d" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            opacity="0.6"
          />

          {/* 2. Top Right Main Sprout Leaf */}
          <path 
            d="M 50 44 C 48 30, 58 14, 76 12 C 86 10, 88 24, 78 36 C 68 46, 56 46, 50 44 Z" 
            fill="url(#leafGradPrimary)" 
          />
          <path 
            d="M 52 42 C 60 32, 68 22, 78 16" 
            stroke="#0d5929" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            opacity="0.7"
          />

          {/* 3. Main Dynamic Sprout Body & Growth Loop */}
          <path 
            d="M 52 44 C 44 58, 40 70, 54 84 C 64 94, 82 86, 92 68 C 96 60, 96 52, 94 48 L 84 54 C 84 62, 78 74, 68 76 C 58 78, 52 70, 56 60 C 60 50, 68 44, 52 44 Z" 
            fill="url(#leafGradDeep)" 
          />

          {/* 4. Left Growth Arc (Forming the circular organic enclosure) */}
          <path 
            d="M 36 50 C 22 58, 14 74, 22 90 C 28 100, 42 104, 58 98 C 42 98, 28 90, 26 78 C 24 68, 30 58, 36 50 Z" 
            fill="url(#leafGradDeep)" 
          />

          {/* 5. Base Furrow / Knowledge Book Arc */}
          <path 
            d="M 12 94 Q 40 88, 58 98 Q 76 88, 108 94 Q 76 94, 58 104 Q 40 94, 12 94 Z" 
            fill="#0f5132" 
          />
        </svg>
      </div>

      {/* Brand Typography & Subtitle */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1 leading-none">
          <span className={`font-black tracking-tight font-display ${sizeConfig.title} ${isLight ? "text-white" : "text-[#0d3b22]"}`}>
            Krishi<span className={isLight ? "text-emerald-400" : "text-[#15803d]"}>Yug</span>
          </span>
        </div>

        {showSubtitle && (
          <span className={`font-semibold tracking-tight ${sizeConfig.subtitle} mt-0.5 leading-tight ${isLight ? "text-emerald-200/90" : "text-slate-500"}`}>
            Smart Decision Support & Agricultural Intelligence
          </span>
        )}
      </div>
    </div>
  );
};
