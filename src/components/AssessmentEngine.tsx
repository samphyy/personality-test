'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { QUESTIONS, TRAIT_DEFINITIONS } from '@/data/questions';
import { computeAssessmentResults } from '@/lib/scoring';
import { Question } from '@/types';

interface AssessmentEngineProps {
  initialMode?: 'full' | 'quick';
}

const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly Disagree', short: '1', mobileLabel: 'Strongly Disagree', color: 'border-rose-300 hover:border-rose-500 hover:bg-rose-50/70 text-rose-700 active:bg-rose-100' },
  { value: 2, label: 'Disagree', short: '2', mobileLabel: 'Disagree', color: 'border-orange-300 hover:border-orange-500 hover:bg-orange-50/70 text-orange-700 active:bg-orange-100' },
  { value: 3, label: 'Neutral', short: '3', mobileLabel: 'Neutral', color: 'border-slate-300 hover:border-slate-500 hover:bg-slate-50/70 text-slate-700 active:bg-slate-100' },
  { value: 4, label: 'Agree', short: '4', mobileLabel: 'Agree', color: 'border-teal-300 hover:border-teal-500 hover:bg-teal-50/70 text-teal-700 active:bg-teal-100' },
  { value: 5, label: 'Strongly Agree', short: '5', mobileLabel: 'Strongly Agree', color: 'border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50/70 text-emerald-700 active:bg-emerald-100' },
];

export default function AssessmentEngine({ initialMode = 'full' }: AssessmentEngineProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'full' | 'quick'>(initialMode);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [direction, setDirection] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter questions based on mode
  const activeQuestions: Question[] = mode === 'quick'
    ? QUESTIONS.filter((q) => q.isQuickTest)
    : QUESTIONS;

  const currentQuestion = activeQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / activeQuestions.length) * 100);
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  // Local storage restoration
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`ocean_assessment_${mode}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers && typeof parsed.answers === 'object') {
          setAnswers(parsed.answers);
        }
        if (typeof parsed.currentIndex === 'number' && parsed.currentIndex < activeQuestions.length) {
          setCurrentIndex(parsed.currentIndex);
        }
      }
    } catch (e) {
      console.warn('Could not restore local assessment progress', e);
    }
  }, [mode, activeQuestions.length]);

  // Save progress
  const persistState = useCallback(
    (newAnswers: Record<number, number>, newIndex: number) => {
      try {
        localStorage.setItem(
          `ocean_assessment_${mode}`,
          JSON.stringify({ answers: newAnswers, currentIndex: newIndex, updatedAt: Date.now() })
        );
      } catch (e) {
        console.warn('Could not save progress to localStorage', e);
      }
    },
    [mode]
  );

  const handleSelectAnswer = useCallback(
    (value: number) => {
      if (!currentQuestion) return;

      const newAnswers = { ...answers, [currentQuestion.id]: value };
      setAnswers(newAnswers);

      // Auto-advance after brief visual feedback
      setTimeout(() => {
        if (currentIndex < activeQuestions.length - 1) {
          setDirection(1);
          const nextIdx = currentIndex + 1;
          setCurrentIndex(nextIdx);
          persistState(newAnswers, nextIdx);
        } else {
          persistState(newAnswers, currentIndex);
        }
      }, 180);
    },
    [answers, currentIndex, currentQuestion, activeQuestions.length, persistState]
  );

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      persistState(answers, prevIdx);
    }
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setDirection(1);
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      persistState(answers, nextIdx);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to restart this test? Your answers will be cleared.')) {
      setAnswers({});
      setCurrentIndex(0);
      try {
        localStorage.removeItem(`ocean_assessment_${mode}`);
      } catch (e) {}
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const result = computeAssessmentResults(answers, mode);
    try {
      localStorage.setItem('ocean_last_result', JSON.stringify(result));
    } catch (e) {}
    router.push('/results');
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        handleSelectAnswer(parseInt(e.key, 10));
      } else if (e.key === 'ArrowLeft' || e.key === 'p') {
        handlePrev();
      } else if (e.key === 'ArrowRight' || e.key === 'n') {
        if (currentIndex < activeQuestions.length - 1) {
          handleNext();
        }
      } else if (e.key === 'Enter' && answeredCount === activeQuestions.length) {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, activeQuestions.length, answeredCount, handleSelectAnswer]);

  if (!currentQuestion) return null;

  const currentTrait = TRAIT_DEFINITIONS[currentQuestion.trait];
  const isCompleted = answeredCount === activeQuestions.length;
  const estMinutes = Math.max(1, Math.ceil((activeQuestions.length - answeredCount) * 0.12));

  // Slide Animation Variants
  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
      scale: 0.99,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      scale: 0.99,
      transition: { duration: 0.15, ease: 'easeIn' },
    }),
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Top Header Controls & Mode Switcher */}
      <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <span className="text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {currentIndex + 1} / {activeQuestions.length}
          </span>
          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
            ~{estMinutes}m left
          </span>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Mode Pill */}
          <div className="bg-slate-100 dark:bg-slate-800 p-0.5 sm:p-1 rounded-xl flex items-center text-[11px] sm:text-xs font-semibold">
            <button
              onClick={() => {
                if (confirm('Switch to Full 30-item test? Current progress will be saved.')) {
                  setMode('full');
                  setCurrentIndex(0);
                }
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all ${
                mode === 'full'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Full (30)
            </button>
            <button
              onClick={() => {
                if (confirm('Switch to Quick 15-item test?')) {
                  setMode('quick');
                  setCurrentIndex(0);
                }
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all ${
                mode === 'quick'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Quick (15)
            </button>
          </div>

          <button
            onClick={handleReset}
            title="Reset Assessment"
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 sm:h-2.5 rounded-full overflow-hidden mb-5 sm:mb-8">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-500 via-teal-500 to-emerald-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question Card Frame */}
      <div className="relative min-h-[340px] sm:min-h-[380px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-5 sm:p-10 flex flex-col justify-between overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentQuestion.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex-1 flex flex-col justify-between"
          >
            {/* Trait & Facet Tag */}
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                <span
                  className="inline-flex items-center text-[11px] sm:text-xs font-bold px-2.5 py-0.5 sm:py-1 rounded-lg"
                  style={{
                    backgroundColor: `${currentTrait.color}15`,
                    color: currentTrait.color,
                  }}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {currentTrait.label}
                </span>
                {currentQuestion.facet && (
                  <span className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500">
                    • {currentQuestion.facet}
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 leading-snug tracking-tight my-4 sm:my-8">
                &ldquo;{currentQuestion.text}&rdquo;
              </h2>
            </div>

            {/* Likert Scale Choices */}
            <div className="my-2 sm:my-6">
              {/* DESKTOP & TABLET VIEW: 5 Card Grid */}
              <div className="hidden sm:grid sm:grid-cols-5 gap-3">
                {LIKERT_OPTIONS.map((opt) => {
                  const isSelected = currentAnswer === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelectAnswer(opt.value)}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all group ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/90 dark:bg-brand-950/40 text-brand-950 dark:text-brand-200 shadow-md shadow-brand-500/15 scale-[1.02]'
                          : `bg-slate-50/60 dark:bg-slate-800/40 ${opt.color}`
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-transform group-hover:scale-110 ${
                          isSelected
                            ? 'bg-brand-500 text-white'
                            : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm'
                        }`}
                      >
                        {opt.short}
                      </span>

                      <span className="text-xs font-semibold text-center leading-tight text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                        {opt.label}
                      </span>

                      {isSelected && (
                        <span className="absolute top-2 right-2 text-brand-500 dark:text-brand-400">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* MOBILE OPTIMIZED VIEW: Touch-Friendly 5-Button Spectrum with Labels */}
              <div className="sm:hidden space-y-3">
                <div className="grid grid-cols-5 gap-1.5">
                  {LIKERT_OPTIONS.map((opt) => {
                    const isSelected = currentAnswer === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelectAnswer(opt.value)}
                        className={`h-14 rounded-2xl border-2 flex flex-col items-center justify-center transition-all active:scale-95 ${
                          isSelected
                            ? 'border-brand-500 bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-105 font-black'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold'
                        }`}
                      >
                        <span className="text-base leading-none font-black">{opt.short}</span>
                        {isSelected && <span className="text-[9px] uppercase tracking-wider mt-0.5 opacity-90">✓</span>}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between text-[11px] font-bold text-slate-500 px-1 pt-1">
                  <span className="text-rose-600 dark:text-rose-400">← Disagree</span>
                  <span className="text-slate-400">Neutral</span>
                  <span className="text-emerald-600 dark:text-emerald-400">Agree →</span>
                </div>
              </div>

              {/* Keyboard Helper Hint */}
              <div className="hidden sm:flex items-center justify-center space-x-4 mt-6 text-xs text-slate-400 dark:text-slate-500">
                <span>
                  Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border font-mono">1</kbd> to{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border font-mono">5</kbd> on your keyboard • Use <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border font-mono">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border font-mono">→</kbd> to navigate
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Navigation Controls */}
        <div className="pt-4 sm:pt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-2 sm:mt-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center space-x-1 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Desktop Question Dots */}
          <div className="hidden md:flex items-center space-x-1">
            {activeQuestions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    isCurrent
                      ? 'w-6 bg-brand-500 rounded-lg'
                      : isAnswered
                      ? 'bg-emerald-400 dark:bg-emerald-500'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                  title={`Question ${idx + 1}`}
                />
              );
            })}
          </div>

          {currentIndex < activeQuestions.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center space-x-1 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-slate-800 transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isCompleted || isSubmitting}
              className="flex items-center space-x-1.5 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-brand-500 to-teal-600 text-white shadow-lg shadow-brand-500/25 hover:from-brand-600 hover:to-teal-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>{isSubmitting ? 'Generating...' : 'View Results'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
