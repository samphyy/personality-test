'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { FAQS } from '@/data/faqs';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="faq">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 text-xs font-semibold text-brand-700 dark:text-brand-300">
          <HelpCircle className="w-3.5 h-3.5 text-brand-500" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Everything You Need to Know
        </h2>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Learn how the Big Five model works, why it is trusted by psychologists, and how to interpret your scores.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  {faq.question}
                </span>
                <span className="p-1 rounded-lg text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-5 h-5 text-brand-500" /> : <ChevronDown className="w-5 h-5" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4 animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
