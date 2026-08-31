'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language } from '@/types';
import { UI_TRANSLATIONS } from '@/data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('ocean_app_language') as Language;
      if (savedLang === 'en' || savedLang === 'km') {
        setLanguageState(savedLang);
      }
    } catch (e) {}
    setMounted(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('ocean_app_language', lang);
    } catch (e) {}
  }, []);

  const toggleLanguage = useCallback(() => {
    const nextLang: Language = language === 'en' ? 'km' : 'en';
    setLanguage(nextLang);
  }, [language, setLanguage]);

  const t = useCallback(
    (key: string): string => {
      const currentDict = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
      if (currentDict[key]) {
        return currentDict[key];
      }
      return UI_TRANSLATIONS.en[key] || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      <div className={language === 'km' ? 'font-sans' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
