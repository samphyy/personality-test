'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-inner">
      <button
        onClick={() => setLanguage('en')}
        className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-all ${
          language === 'en'
            ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm font-black'
            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
        title="Switch to English"
      >
        <span>EN</span>
      </button>

      <button
        onClick={() => setLanguage('km')}
        className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-all ${
          language === 'km'
            ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm font-black'
            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
        title="ប្តូរទៅភាសាខ្មែរ (Khmer)"
      >
        <span>ខ្មែរ</span>
      </button>
    </div>
  );
}
