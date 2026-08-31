'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { AssessmentResult } from '@/types';

interface KitSubscribeFormProps {
  result: AssessmentResult;
}

export default function KitSubscribeForm({ result }: KitSubscribeFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          archetype: result.archetype,
          scores: result.scores,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit. Please try again.');
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Kit Subscribe Error:', err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white p-6 sm:p-10 border border-teal-800/40 shadow-xl overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-brand-500/20 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-6 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-xs font-bold text-brand-300 uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5" />
          <span>Save & Export to Your Inbox</span>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Email Me My Complete PDF Report
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Get your full 5-dimension blueprint, career recommendations, and actionable growth plan sent directly to your email inbox.
          </p>
        </div>

        {success ? (
          <div className="p-6 rounded-2xl bg-brand-950/80 border border-brand-500/40 text-center space-y-2 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">
              Report Dispatched!
            </h4>
            <p className="text-xs sm:text-sm text-brand-200">
              Success! Your report has been dispatched to your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address <span className="text-brand-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center space-x-2 text-xs text-rose-400 bg-rose-950/50 p-2.5 rounded-xl border border-rose-900">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 disabled:opacity-50 font-bold text-sm text-white shadow-lg shadow-brand-500/25 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending Report...' : 'Send My Full Report'}</span>
              </button>

              <span className="text-[11px] text-slate-400 text-center sm:text-right">
                We respect your privacy. No spam, ever. Unsubscribe anytime.
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
