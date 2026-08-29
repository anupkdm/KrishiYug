import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../translations";

const LanguageContext = createContext();

export const AVAILABLE_LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी", flag: "🇮🇳" },
  { code: "hi", label: "Hindi", nativeLabel: "हिंदी", flag: "🇮🇳" }
];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("krishi_language") || "en";
  });

  const setLanguage = (langCode) => {
    if (translations[langCode]) {
      setLanguageState(langCode);
      localStorage.setItem("krishi_language", langCode);
    }
  };

  const t = (path, fallback = "") => {
    if (!path) return fallback;
    const keys = path.split(".");
    
    // 1. Try selected language
    let current = translations[language];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        current = null;
        break;
      }
    }
    if (current !== null && current !== undefined) return current;

    // 2. Fallback to English
    let enFallback = translations["en"];
    for (const key of keys) {
      if (enFallback && enFallback[key] !== undefined) {
        enFallback = enFallback[key];
      } else {
        enFallback = null;
        break;
      }
    }
    if (enFallback !== null && enFallback !== undefined) return enFallback;

    // 3. Fallback to provided string or path
    return fallback || path;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        languages: AVAILABLE_LANGUAGES,
        currentLanguage: AVAILABLE_LANGUAGES.find(l => l.code === language) || AVAILABLE_LANGUAGES[0],
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
