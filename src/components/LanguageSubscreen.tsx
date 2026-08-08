/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCampus } from '../context/CampusContext';
import { ArrowLeft, Check, Globe } from 'lucide-react';
import { translations } from '../utils/translations';

interface SubscreenProps {
  onBack: () => void;
}

const LANGUAGES = [
  { code: 'EN', label: 'English', flag: '🇺🇸' },
  { code: 'RU', label: 'Русский', flag: '🇷🇺' },
  { code: 'ES', label: 'Español', flag: '🇪🇸' },
  { code: 'DE', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ZH', label: '中文', flag: '🇨🇳' },
  { code: 'JA', label: '日本語', flag: '🇯🇵' },
  { code: 'IT', label: 'Italiano', flag: '🇮🇹' },
  { code: 'KO', label: '한국어', flag: '🇰🇷' },
];

export const LanguageSubscreen: React.FC<SubscreenProps> = ({ onBack }) => {
  const { uiLanguage, setUiLanguage } = useCampus();
  const t = translations[uiLanguage] || translations.EN;

  return (
    <div className="space-y-6 animate-fade-in" id="language-subscreen">
      {/* Back Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-navy/60 dark:text-slate-400 hover:text-terracotta transition-colors cursor-pointer"
        id="language-back-btn"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {uiLanguage === 'RU' ? 'Назад' : (uiLanguage === 'ES' ? 'Atrás' : 'Back')}
      </button>

      {/* Screen Title */}
      <div className="space-y-1" id="language-header">
        <h2 className="text-2xl font-serif font-bold text-burgundy dark:text-rose-400 flex items-center gap-2">
          <Globe className="w-5 h-5 text-terracotta" />
          {t.languageSelectorTitle}
        </h2>
        <p className="text-xs text-navy/50 dark:text-slate-400">
          {t.languageSelectorSubtitle}
        </p>
      </div>

      {/* Flags List Selector */}
      <div className="grid grid-cols-1 gap-2.5" id="language-options-list">
        {LANGUAGES.map((lang) => {
          const isSelected = uiLanguage === lang.code;
          return (
            <button
              key={lang.code}
              id={`lang-opt-${lang.code.toLowerCase()}`}
              onClick={() => {
                setUiLanguage(lang.code);
              }}
              className={`flex justify-between items-center p-4 rounded-2xl border transition-all text-left cursor-pointer active:scale-[0.99] w-full ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 border-terracotta text-terracotta shadow-md ring-1 ring-terracotta/20 font-bold'
                  : 'bg-white dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 border-navy/5 dark:border-slate-800 text-navy dark:text-slate-200 hover:border-navy/10 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl select-none leading-none filter drop-shadow-sm" role="img" aria-label={lang.label}>
                  {lang.flag}
                </span>
                <span className="text-sm font-semibold">{lang.label}</span>
              </div>

              {isSelected && (
                <div className="p-1 rounded-full bg-terracotta/10 text-terracotta">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Persistent Practice Disclaimer Card */}
      <div 
        className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3 mt-4" 
        id="language-lessons-disclaimer"
      >
        <span className="text-xl leading-none select-none filter drop-shadow-sm">📖</span>
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-wider block">
            Practice Guard
          </span>
          <p className="text-xs text-navy/70 dark:text-slate-300 leading-relaxed">
            {t.languageOnlyLabel}
          </p>
        </div>
      </div>
    </div>
  );
};
