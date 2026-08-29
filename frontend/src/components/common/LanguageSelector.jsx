import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Globe, Check, ChevronDown } from "lucide-react";

export const LanguageSelector = ({ variant = "default" }) => {
  const { language, setLanguage, languages, currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition-all border ${
          variant === "dark"
            ? "bg-white/10 hover:bg-white/20 text-white border-white/20"
            : variant === "auth"
            ? "bg-white/90 hover:bg-white text-slate-800 border-slate-200 shadow-sm"
            : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
        }`}
        aria-expanded={isOpen}
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
        <span className="font-semibold">{currentLanguage.nativeLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 opacity-60 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-white shadow-xl border border-slate-200/80 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            भाषा निवडा / Choose Language
          </div>
          {languages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? "bg-emerald-50 text-emerald-800 font-bold"
                    : "text-slate-700 hover:bg-slate-50 font-medium"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  <div>
                    <div className="leading-none">{lang.nativeLabel}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{lang.label}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
