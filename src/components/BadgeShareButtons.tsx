'use client';

import React, { useState, useEffect } from 'react';
import { Linkedin, Twitter, Mail, Link as LinkIcon, Check } from 'lucide-react';

interface BadgeShareButtonsProps {
  url: string;
  archetypeName: string;
}

export default function BadgeShareButtons({ url, archetypeName }: BadgeShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // If running on client, we can grab the actual href or use the passed url
    setCurrentUrl(url || window.location.href);
  }, [url]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const shareText = `I just discovered my Big Five Personality Archetype: ${archetypeName}. Check out my blueprint!`;

  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full mt-8">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Share Your Result
      </h3>
      
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0A66C2] text-white hover:scale-110 hover:shadow-lg transition-all"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-5 h-5 fill-current" />
        </a>

        {/* Twitter / X */}
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 text-white hover:scale-110 hover:shadow-lg transition-all"
          aria-label="Share on X"
        >
          <Twitter className="w-5 h-5 fill-current" />
        </a>

        {/* Email */}
        <a
          href={`mailto:?subject=${encodeURIComponent('My Personality Blueprint')}&body=${encodeURIComponent(shareText + '\n\n' + currentUrl)}`}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-500 text-white hover:scale-110 hover:shadow-lg transition-all"
          aria-label="Share via Email"
        >
          <Mail className="w-5 h-5" />
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className={`flex items-center justify-center w-12 h-12 rounded-full text-white hover:scale-110 hover:shadow-lg transition-all ${
            copied ? 'bg-emerald-500' : 'bg-slate-700'
          }`}
          aria-label="Copy Link"
        >
          {copied ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
        </button>
      </div>
      
      <div className="flex items-center w-full max-w-sm mt-4 bg-slate-100 dark:bg-slate-800 rounded-lg p-2 border border-slate-200 dark:border-slate-700">
        <input 
          type="text" 
          readOnly 
          value={currentUrl} 
          className="flex-1 bg-transparent text-xs text-slate-500 dark:text-slate-400 outline-none px-2 truncate"
        />
        <button 
          onClick={handleCopy}
          className="text-xs font-bold text-brand-600 dark:text-brand-400 px-3 py-1 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded transition-colors"
        >
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
    </div>
  );
}
