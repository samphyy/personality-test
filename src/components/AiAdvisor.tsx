'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Briefcase,
  TrendingUp,
  MessageSquare,
  Shield,
  Lightbulb,
} from 'lucide-react';
import { AssessmentResult } from '@/types';

interface AiAdvisorProps {
  result: AssessmentResult;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

function FormattedMarkdown({ content }: { content: string }) {
  if (!content) return null;

  // Normalize line endings
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rawLines = normalized.split('\n');
  const elements: React.ReactNode[] = [];
  let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const renderInline = (str: string): React.ReactNode => {
    // Regex splits by bold (**text**) or italic (*text*)
    const tokens = str.split(/(\*\*.*?\*\*|\*[^*]+?\*)/g);
    return tokens.map((token, i) => {
      if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
        return (
          <strong key={i} className="font-bold text-slate-900 dark:text-white">
            {token.slice(2, -2)}
          </strong>
        );
      }
      if (token.startsWith('*') && token.endsWith('*') && token.length > 2 && !token.startsWith('**')) {
        return (
          <em key={i} className="italic text-slate-800 dark:text-slate-200">
            {token.slice(1, -1)}
          </em>
        );
      }
      return token;
    });
  };

  const flushList = () => {
    if (!listBuffer) return;
    if (listBuffer.type === 'ul') {
      elements.push(
        <ul key={`ul-${elements.length}`} className="space-y-2 my-2.5">
          {listBuffer.items.map((item, idx) => (
            <li key={idx} className="flex items-start text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2.5 shrink-0 mt-2" />
              <div className="flex-1 leading-relaxed">{renderInline(item)}</div>
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={`ol-${elements.length}`} className="space-y-2 my-2.5">
          {listBuffer.items.map((item, idx) => (
            <li key={idx} className="flex items-start text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <span className="w-4 h-4 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 text-[10px] font-bold flex items-center justify-center mr-2.5 shrink-0 mt-0.5 border border-teal-200 dark:border-teal-800">
                {idx + 1}
              </span>
              <div className="flex-1 leading-relaxed">{renderInline(item)}</div>
            </li>
          ))}
        </ol>
      );
    }
    listBuffer = null;
  };

  rawLines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      return;
    }

    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3
          key={`h3-${index}`}
          className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-4 mb-2 flex items-center gap-1.5 first:mt-0"
        >
          {renderInline(line.slice(4))}
        </h3>
      );
    } else if (line.startsWith('#### ')) {
      flushList();
      elements.push(
        <h4
          key={`h4-${index}`}
          className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mt-3.5 mb-1.5"
        >
          {renderInline(line.slice(5))}
        </h4>
      );
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      const itemText = line.slice(2);
      if (!listBuffer || listBuffer.type !== 'ul') {
        flushList();
        listBuffer = { type: 'ul', items: [itemText] };
      } else {
        listBuffer.items.push(itemText);
      }
    } else if (/^\d+\.\s/.test(line)) {
      const itemText = line.replace(/^\d+\.\s/, '');
      if (!listBuffer || listBuffer.type !== 'ol') {
        flushList();
        listBuffer = { type: 'ol', items: [itemText] };
      } else {
        listBuffer.items.push(itemText);
      }
    } else {
      flushList();
      elements.push(
        <p key={`p-${index}`} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
          {renderInline(line)}
        </p>
      );
    }
  });

  flushList();

  return <div className="space-y-1">{elements}</div>;
}

export default function AiAdvisor({ result }: AiAdvisorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const o = result.scores.openness.percentage;
  const c = result.scores.conscientiousness.percentage;
  const e = result.scores.extraversion.percentage;
  const a = result.scores.agreeableness.percentage;
  const n = result.scores.neuroticism.percentage;
  const archName = result.archetype.name;

  const quickPrompts = [
    {
      label: 'Leadership Style',
      icon: Briefcase,
      query: 'What type of leadership style fits my personality profile and trait scores?',
    },
    {
      label: 'Salary & Negotiation',
      icon: TrendingUp,
      query: 'How should I negotiate a raise or promotion with my personality blueprint?',
    },
    {
      label: 'Burnout & Stress Shield',
      icon: Shield,
      query: 'How do I manage workplace stress, energy depletion, and burnout based on my profile?',
    },
    {
      label: 'Opposite Personalities',
      icon: MessageSquare,
      query: 'How can I communicate better and resolve friction with people who have opposite traits?',
    },
    {
      label: 'Career Superpowers',
      icon: Lightbulb,
      query: 'What are my top 3 high-leverage career superpowers and ideal work environments?',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          scores: {
            openness: o,
            conscientiousness: c,
            extraversion: e,
            agreeableness: a,
            neuroticism: n,
          },
          archetype: {
            id: result.archetype.id,
            name: result.archetype.name,
            tagline: result.archetype.tagline,
          },
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.response || 'I was unable to analyze this inquiry at this moment. Please try again.',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: 'Sorry, I encountered an issue generating your response. Please try again.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <section id="ai-advisor" className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden space-y-6 p-6 sm:p-10 print:hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-brand-500/20 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-bold text-brand-600 dark:text-brand-400">
                Personalized AI Coach
              </span>
              <span className="text-[10px] bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold px-2 py-0.5 rounded-full border border-brand-200/60 dark:border-brand-800/60">
                Loaded with your Blueprint
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              Ask Your AI Career & Personality Advisor
            </h3>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Chat</span>
          </button>
        )}
      </div>

      {/* Quick Prompt Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          ⚡ 1-Click Guided Questions
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => {
            const Icon = prompt.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt.query)}
                disabled={loading}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800/80 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-brand-300 border border-slate-200 dark:border-slate-700/80 hover:border-brand-300 dark:hover:border-brand-800 transition-all disabled:opacity-50 text-left shadow-sm active:scale-95"
              >
                <Icon className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <span>{prompt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="min-h-[220px] max-h-[520px] overflow-y-auto space-y-4 pr-1">
        {messages.length === 0 ? (
          <div className="py-10 text-center space-y-3 bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80">
            <Sparkles className="w-8 h-8 text-brand-500 mx-auto" />
            <div className="max-w-md mx-auto space-y-1">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                How can I help you thrive as {archName}?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click one of the quick questions above or type your own inquiry about leadership, promotions, career alignment, or communication.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isCopied = copiedId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm mt-0.5">
                    y
                  </div>
                )}

                <div
                  className={`relative max-w-2xl rounded-2xl p-4 sm:p-5 text-sm ${
                    isUser
                      ? 'bg-brand-500 text-white font-medium rounded-tr-none'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 rounded-tl-none shadow-sm'
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700 pb-2 mb-3">
                      <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                        YSAMPHY AI Psychometrics
                      </span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs flex items-center space-x-1"
                        title="Copy answer"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-[10px] text-emerald-500 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[10px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {isUser ? (
                    <div className="whitespace-pre-line leading-relaxed text-xs sm:text-sm">
                      {msg.text}
                    </div>
                  ) : (
                    <FormattedMarkdown content={msg.text} />
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold text-xs shrink-0 animate-pulse">
              y
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
              <span>Analyzing your Big Five psychometric blueprint...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder={`Ask anything about your ${archName} blueprint...`}
          disabled={loading}
          className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputQuery.trim() || loading}
          className="px-5 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/25 transition-all flex items-center space-x-1.5 shrink-0 active:scale-95"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}
