'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Copy,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Share2,
} from 'lucide-react';
import { AssessmentResult } from '@/types';
import { ARCHETYPES } from '@/data/archetypes';

interface CompareInviteModalProps {
  result: AssessmentResult;
  isOpen: boolean;
  onClose: () => void;
}

export default function CompareInviteModal({ result, isOpen, onClose }: CompareInviteModalProps) {
  const router = useRouter();
  const [userName, setUserName] = useState('You');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const o = result.scores.openness.percentage;
  const c = result.scores.conscientiousness.percentage;
  const e = result.scores.extraversion.percentage;
  const a = result.scores.agreeableness.percentage;
  const n = result.scores.neuroticism.percentage;
  const archId = result.archetype.id;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://personality-test.ysamphy.com';
  const inviteUrl = `${origin}/compare?u1=${encodeURIComponent(userName.trim() || 'Partner')}&o1=${o}&c1=${c}&e1=${e}&a1=${a}&n1=${n}&arch1=${archId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const sampleArchetypes = [
    {
      id: 'dynamic-catalyst',
      name: 'The Dynamic Catalyst',
      desc: 'Extroverted, spontaneous, high-energy leader.',
      scores: { o: 75, c: 50, e: 88, a: 70, n: 30 },
    },
    {
      id: 'empathic-harmonizer',
      name: 'The Empathic Harmonizer',
      desc: 'High agreeableness, relational warmth, team diplomacy.',
      scores: { o: 65, c: 60, e: 60, a: 92, n: 40 },
    },
    {
      id: 'grounded-operator',
      name: 'The Grounded Operator',
      desc: 'High conscientiousness, methodical process, pragmatic stability.',
      scores: { o: 35, c: 90, e: 45, a: 70, n: 25 },
    },
  ];

  const handleSelectSample = (sample: typeof sampleArchetypes[0]) => {
    const compareUrl = `/compare?u1=${encodeURIComponent(userName.trim() || 'You')}&o1=${o}&c1=${c}&e1=${e}&a1=${a}&n1=${n}&arch1=${archId}&u2=${encodeURIComponent(sample.name)}&o2=${sample.scores.o}&c2=${sample.scores.c}&e2=${sample.scores.e}&a2=${sample.scores.a}&n2=${sample.scores.n}&arch2=${sample.id}`;
    router.push(compareUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold">Compare Profiles & Synergy</h3>
              <p className="text-xs text-slate-400">Invite a partner, coworker, or friend to compare blueprints</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Your Display Name
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="e.g. Samphy"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>

        {/* Option 1: Copy Shareable Invite Link */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Option 1: Send Personalized Invite Link
            </span>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
              Viral Invite
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            When they open this link, they will see your invitation, take the assessment, and unlock your dual radar chart with synergy analysis!
          </p>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-slate-300 focus:outline-none select-all"
            />
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shrink-0 transition-all shadow-md shadow-purple-600/25 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Option 2: Test Sample Comparison */}
        <div className="space-y-3">
          <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Option 2: Preview Instant Synergy with a Sample Archetype</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {sampleArchetypes.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className="w-full p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-purple-500/50 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-purple-300 transition-colors">
                    {sample.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">{sample.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
