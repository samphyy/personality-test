'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Target,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Trophy,
  Calendar,
  Clock,
  Flame,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AssessmentResult } from '@/types';
import { generateGrowthHabitPlan, DailyHabit } from '@/lib/habitPlanGenerator';

interface GrowthPlanModalProps {
  result: AssessmentResult;
  isOpen: boolean;
  onClose: () => void;
}

export default function GrowthPlanModal({ result, isOpen, onClose }: GrowthPlanModalProps) {
  const [activeWeek, setActiveWeek] = useState<number | 'all'>('all');
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const plan = generateGrowthHabitPlan(result);
  const storageKey = `ocean_growth_plan_${result.archetype.id}`;

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setCompletedDays(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error reading growth plan progress:', e);
    }
  }, [storageKey]);

  if (!isOpen) return null;

  const toggleDay = (day: number) => {
    setCompletedDays((prev) => {
      let updated: number[];
      if (prev.includes(day)) {
        updated = prev.filter((d) => d !== day);
      } else {
        updated = [...prev, day];
        // Trigger celebratory confetti on milestones
        if (updated.length === 7 || updated.length === 14 || updated.length === 21 || updated.length === 30) {
          try {
            confetti({
              particleCount: 60,
              spread: 55,
              origin: { y: 0.6 },
              colors: ['#1abc9c', '#f59e0b', '#8b5cf6', '#10b981'],
            });
          } catch (e) {}
        }
      }
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset your 30-day checklist progress?')) {
      setCompletedDays([]);
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {}
    }
  };

  const handleCopyFullPlan = () => {
    let fullText = `🎯 30-Day Growth Habit Plan: ${plan.focusTitle}\nArchetype: ${result.archetype.name}\n\n`;
    plan.weeks.forEach((w) => {
      fullText += `### WEEK ${w.week}: ${w.title.toUpperCase()}\nGoal: ${w.goal}\n\n`;
      w.habits.forEach((h) => {
        fullText += `Day ${h.day}: ${h.title} (${h.timeEstimate})\nAction: ${h.action}\nWhy it works: ${h.whyItWorks}\n\n`;
      });
    });

    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const totalCompleted = completedDays.length;
  const progressPercent = Math.round((totalCompleted / 30) * 100);

  const displayedHabits =
    activeWeek === 'all'
      ? plan.weeks.flatMap((w) => w.habits)
      : plan.weeks.find((w) => w.week === activeWeek)?.habits || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-5 sm:p-8 space-y-6 text-slate-900 dark:text-white shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-teal-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400">
                  Micro-Habit Roadmap
                </span>
                <span className="text-[10px] bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/60">
                  {plan.focusTrait} Focus
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                30-Day Growth Habit Plan
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Focus Banner & Progress Tracker */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white space-y-4 shadow-md border border-teal-800/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-teal-300">
                Primary Growth Dimension
              </span>
              <h4 className="text-lg sm:text-xl font-bold">{plan.focusTitle}</h4>
              <p className="text-xs text-slate-300 mt-0.5">{plan.focusSubtitle}</p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold text-amber-300 border border-white/10">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{totalCompleted} / 30 Days</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Habit Completion Streak</span>
              <strong className="text-teal-300 font-bold">{progressPercent}%</strong>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
              <div
                className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-400 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Milestones row */}
          <div className="grid grid-cols-4 gap-2 pt-1 text-center text-[10px]">
            <div className={`p-1.5 rounded-lg border transition-all ${totalCompleted >= 7 ? 'bg-amber-400/20 border-amber-400/60 text-amber-300 font-bold' : 'bg-white/5 border-white/10 text-slate-400'}`}>
              Day 7: Spark
            </div>
            <div className={`p-1.5 rounded-lg border transition-all ${totalCompleted >= 14 ? 'bg-teal-400/20 border-teal-400/60 text-teal-300 font-bold' : 'bg-white/5 border-white/10 text-slate-400'}`}>
              Day 14: Flow
            </div>
            <div className={`p-1.5 rounded-lg border transition-all ${totalCompleted >= 21 ? 'bg-purple-400/20 border-purple-400/60 text-purple-300 font-bold' : 'bg-white/5 border-white/10 text-slate-400'}`}>
              Day 21: Reflex
            </div>
            <div className={`p-1.5 rounded-lg border transition-all ${totalCompleted >= 30 ? 'bg-emerald-400/20 border-emerald-400/60 text-emerald-300 font-bold' : 'bg-white/5 border-white/10 text-slate-400'}`}>
              Day 30: Mastery 👑
            </div>
          </div>
        </div>

        {/* Weekly Filter & Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          {/* Week Selector Chips */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveWeek('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeWeek === 'all'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All 30 Days
            </button>
            {[1, 2, 3, 4].map((wk) => (
              <button
                key={wk}
                onClick={() => setActiveWeek(wk)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeWeek === wk
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Week {wk}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyFullPlan}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Full Plan</span>
                </>
              )}
            </button>

            {totalCompleted > 0 && (
              <button
                onClick={handleResetProgress}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Reset progress"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Habit Checklist Stream */}
        <div className="space-y-3">
          {displayedHabits.map((habit) => {
            const isDone = completedDays.includes(habit.day);

            return (
              <div
                key={habit.day}
                onClick={() => toggleDay(habit.day)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all select-none ${
                  isDone
                    ? 'bg-teal-50/60 dark:bg-teal-950/30 border-teal-300 dark:border-teal-800 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-800'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Checkbox Icon */}
                  <button
                    type="button"
                    className="mt-0.5 shrink-0 text-slate-400 hover:text-teal-500 transition-colors"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-teal-500 fill-teal-100 dark:fill-teal-950" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                    )}
                  </button>

                  {/* Habit Details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDone ? 'bg-teal-200 dark:bg-teal-900 text-teal-900 dark:text-teal-100' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                          Day {habit.day}
                        </span>
                        <h5 className={`text-xs sm:text-sm font-bold ${isDone ? 'text-teal-900 dark:text-teal-200 line-through opacity-85' : 'text-slate-900 dark:text-white'}`}>
                          {habit.title}
                        </h5>
                      </div>

                      <div className="flex items-center space-x-1 text-[10px] text-slate-400 shrink-0">
                        <Clock className="w-3 h-3" />
                        <span>{habit.timeEstimate}</span>
                      </div>
                    </div>

                    <p className={`text-xs sm:text-sm leading-relaxed ${isDone ? 'text-slate-600 dark:text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                      {habit.action}
                    </p>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-0.5">
                      💡 <strong>Why it works:</strong> {habit.whyItWorks}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
