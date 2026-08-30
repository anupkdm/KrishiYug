import React from "react";

export const KrishiYugLogo = ({ 
  size = "md", 
  onClick,
  className = ""
}) => {
  // Height sizing presets that fit perfectly into standard UI bars
  const sizeClasses = {
    sm: "h-8 sm:h-9",
    md: "h-11 sm:h-12 md:h-13",
    lg: "h-14 sm:h-16 md:h-20"
  }[size] || "h-11 sm:h-12 md:h-13";

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center select-none ${onClick ? "cursor-pointer group" : ""} ${className}`}
      title="KrishiYug — Smart Decision Support & Agricultural Intelligence"
    >
      <img 
        src="/images/logo.png" 
        alt="KrishiYug - Smart Decision Support & Agricultural Intelligence" 
        className={`${sizeClasses} w-auto max-w-full object-contain transition-transform duration-200 ${onClick ? "group-hover:scale-102" : ""}`}
        loading="eager"
      />
    </div>
  );
};
