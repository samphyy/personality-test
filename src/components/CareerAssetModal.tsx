'use client';

import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Briefcase,
  FileText,
  MessageSquare,
  Sparkles,
  Award,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { AssessmentResult } from '@/types';
import { generateCareerAssets } from '@/lib/careerGenerator';

interface CareerAssetModalProps {
  result: AssessmentResult;
  isOpen: boolean;
  onClose: () => void;
}

export default function CareerAssetModal({ result, isOpen, onClose }: CareerAssetModalProps) {
  const [activeTab, setActiveTab] = useState<'linkedin' | 'resume' | 'interview' | 'headlines'>('linkedin');
  const [bioStyle, setBioStyle] = useState<'executive' | 'storyteller' | 'analytical'>('executive');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const assets = generateCareerAssets(result);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    });
  };

  const handleCopyAllResumeBullets = () => {
    const fullText = assets.resumeBullets.map((b) => `• ${b.bullet}`).join('\n\n');
    handleCopy('all-resume', fullText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-5 sm:p-8 space-y-6 text-slate-900 dark:text-white shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-brand-500/20 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-brand-600 dark:text-brand-400">
                  Career Accelerator
                </span>
                <span className="text-[10px] bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold px-2 py-0.5 rounded-full border border-brand-200/60 dark:border-brand-800/60">
                  {result.archetype.name}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                Resume & LinkedIn Bio Generator
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

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('linkedin')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'linkedin'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>LinkedIn &ldquo;About&rdquo; Bio</span>
          </button>

          <button
            onClick={() => setActiveTab('resume')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'resume'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Resume Impact Bullets</span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'interview'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Interview Talking Scripts</span>
          </button>

          <button
            onClick={() => setActiveTab('headlines')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'headlines'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Headline Ideas</span>
          </button>
        </div>

        {/* TAB 1: LINKEDIN BIOS */}
        {activeTab === 'linkedin' && (
          <div className="space-y-4">
            {/* Style Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Bio Tone:</span>
              <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                {(['executive', 'storyteller', 'analytical'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setBioStyle(style)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                      bioStyle === style
                        ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Bio Preview Box */}
            <div className="relative rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  LinkedIn &ldquo;About&rdquo; Section ({bioStyle})
                </span>
                <button
                  onClick={() => handleCopy(`bio-${bioStyle}`, assets.linkedInBios[bioStyle])}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white transition-all shadow-sm active:scale-95"
                >
                  {copiedKey === `bio-${bioStyle}` ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Bio</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                {assets.linkedInBios[bioStyle]}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: RESUME BULLETS */}
        {activeTab === 'resume' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Tailored bullet points crafted from your dominant OCEAN scores and archetype strengths:
              </p>
              <button
                onClick={handleCopyAllResumeBullets}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 hover:bg-brand-100 dark:hover:bg-brand-900 transition-all shrink-0"
              >
                {copiedKey === 'all-resume' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">All Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All 5 Bullets</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3">
              {assets.resumeBullets.map((item, idx) => {
                const isCopied = copiedKey === `bullet-${idx}`;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-brand-300 dark:hover:border-brand-800 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium hidden sm:inline-block">
                          ({item.trait})
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(`bullet-${idx}`, item.bullet)}
                        className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 text-xs flex items-center space-x-1"
                        title="Copy bullet"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[11px] text-emerald-500 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      &ldquo;{item.bullet}&rdquo;
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: INTERVIEW TALKING SCRIPTS */}
        {activeTab === 'interview' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              High-impact behavioral interview response frameworks backed by your psychometrics:
            </p>

            <div className="space-y-4">
              {assets.interviewScripts.map((script, idx) => {
                const isCopied = copiedKey === `script-${idx}`;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 tracking-wider">
                          Interview Question
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {script.question}
                        </h4>
                      </div>
                      <button
                        onClick={() => handleCopy(`script-${idx}`, script.script)}
                        className="flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors shrink-0 shadow-sm"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[11px] text-emerald-500 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Copy Script</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 italic">
                      💡 <strong>Context:</strong> {script.context}
                    </p>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      {script.script}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: HEADLINE IDEAS */}
        {activeTab === 'headlines' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Punchy LinkedIn headlines to differentiate your profile to recruiters and clients:
            </p>

            <div className="space-y-3">
              {assets.headlineIdeas.map((headline, idx) => {
                const isCopied = copiedKey === `headline-${idx}`;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {headline}
                    </span>
                    <button
                      onClick={() => handleCopy(`headline-${idx}`, headline)}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white transition-all shadow-sm shrink-0 active:scale-95"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
