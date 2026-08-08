/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { InteractiveVocabularyText } from '../components/InteractiveVocabularyText';
import { Volume2, HelpCircle } from 'lucide-react';

interface LectureScreenProps {
  title?: string;
  transcript?: string;
  notes?: string;
  questions?: { questionText: string; options: string[] }[];
  onComplete?: () => void;
}

export const LectureScreen: React.FC<LectureScreenProps> = ({
  title = 'Academic Lecture',
  transcript = '',
  notes = '',
  questions = [],
  onComplete
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6 max-w-md mx-auto bg-cream dark:bg-slate-950 text-navy dark:text-slate-100 font-sans select-none">
      <div className="border-b border-navy/10 dark:border-slate-800 pb-3 space-y-1">
        <span className="text-[10px] font-mono font-bold text-terracotta uppercase flex items-center gap-1">
          <Volume2 className="w-3.5 h-3.5" /> Interactive Lecture
        </span>
        <h2 className="font-serif text-2xl font-bold text-burgundy dark:text-rose-400">{title}</h2>
      </div>

      {transcript && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-navy/5 dark:border-slate-800 shadow-xs space-y-2">
          <h3 className="text-xs font-mono font-bold uppercase text-terracotta">Lecture Transcript</h3>
          <div className="font-serif text-xs leading-relaxed text-navy/90 dark:text-slate-200">
            <InteractiveVocabularyText text={transcript} />
          </div>
        </div>
      )}

      {questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase text-navy/60 dark:text-slate-400">Comprehension Questions</h3>
          {questions.map((q, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-navy/5 dark:border-slate-800 space-y-2">
              <p className="text-xs font-semibold text-navy dark:text-slate-200 flex items-start gap-1.5">
                <HelpCircle className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                <InteractiveVocabularyText text={q.questionText} />
              </p>
              <div className="space-y-1.5 pl-5">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="text-xs text-navy/80 dark:text-slate-300 bg-cream dark:bg-slate-950 p-2 rounded-xl border border-navy/5 dark:border-slate-800">
                    <InteractiveVocabularyText text={opt} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {onComplete && (
        <button
          onClick={onComplete}
          className="w-full bg-navy hover:bg-navy-light text-white font-bold py-3.5 px-5 rounded-2xl shadow-md transition-all cursor-pointer"
        >
          Complete Lecture
        </button>
      )}
    </div>
  );
};
