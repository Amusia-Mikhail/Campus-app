/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { InteractiveVocabularyText } from '../components/InteractiveVocabularyText';
import { BookOpen } from 'lucide-react';

interface ChapterScreenProps {
  title?: string;
  paragraphs?: string[];
  content?: string;
  onComplete?: () => void;
}

export const ChapterScreen: React.FC<ChapterScreenProps> = ({
  title = 'Chapter Reading',
  paragraphs = [],
  content = '',
  onComplete
}) => {
  const displayParagraphs = paragraphs.length > 0 ? paragraphs : (content ? [content] : []);

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6 max-w-md mx-auto bg-cream dark:bg-slate-950 text-navy dark:text-slate-100 font-sans select-none">
      <div className="border-b border-navy/10 dark:border-slate-800 pb-3 space-y-1">
        <span className="text-[10px] font-mono font-bold text-terracotta uppercase flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" /> Academic Chapter
        </span>
        <h2 className="font-serif text-2xl font-bold text-burgundy dark:text-rose-400">{title}</h2>
      </div>

      <div className="space-y-4 font-serif text-base leading-relaxed bg-white dark:bg-slate-900 p-5 rounded-3xl border border-navy/5 dark:border-slate-800 shadow-xs">
        {displayParagraphs.map((paragraph, index) => (
          <p key={index} className="text-navy/90 dark:text-slate-200">
            <InteractiveVocabularyText text={paragraph} />
          </p>
        ))}
      </div>

      {onComplete && (
        <button
          onClick={onComplete}
          className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-bold py-3.5 px-5 rounded-2xl shadow-md transition-all cursor-pointer"
        >
          Complete Chapter
        </button>
      )}
    </div>
  );
};
