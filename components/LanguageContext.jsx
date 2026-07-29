"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { dictionary } from "../utils/dictionary";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("de");

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang && dictionary[savedLang]) {
      setLanguage(savedLang);
    }
    
    // Setup dir for arabic
    document.documentElement.dir = (savedLang === 'ar' || language === 'ar') ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLang || language;
  }, [language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key) => {
    return dictionary[language]?.[key] || dictionary["de"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
