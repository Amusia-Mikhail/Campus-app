/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VOCABULARY_DATASET, VocabularyItem } from '../data/vocabulary';
import { useCampus } from '../context/CampusContext';
import { Bookmark, Volume2, X, Sparkles } from 'lucide-react';
import { playSound } from '../utils/soundEffects';

interface InteractiveVocabularyTextProps {
  text: string;
  className?: string;
}

export const InteractiveVocabularyText: React.FC<InteractiveVocabularyTextProps> = ({
  text,
  className = ''
}) => {
  const { toggleSaveWord, isWordSaved, soundEnabled } = useCampus();
  const [selectedWordItem, setSelectedWordItem] = useState<VocabularyItem | null>(null);

  if (!text) return null;

  // Build a regex matching any word in VOCABULARY_DATASET (sorted by length descending so longer words match first)
  const sortedVocab = [...VOCABULARY_DATASET].sort((a, b) => b.word.length - a.word.length);
  const pattern = new RegExp(
    `\\b(${sortedVocab.map((item) => item.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
    'gi'
  );

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    const matchedWordStr = match[0];
    const matchStart = match.index;

    if (matchStart > lastIndex) {
      parts.push(text.substring(lastIndex, matchStart));
    }

    const vocabItem = VOCABULARY_DATASET.find(
      (v) => v.word.toLowerCase() === matchedWordStr.toLowerCase() || v.id.toLowerCase() === matchedWordStr.toLowerCase()
    );

    if (vocabItem) {
      parts.push(
        <span
          key={`${vocabItem.id}-${matchStart}`}
          onClick={(e) => {
            e.stopPropagation();
            playSound('click', soundEnabled);
            setSelectedWordItem(vocabItem);
          }}
          className="border-b-2 border-dashed border-terracotta text-terracotta dark:text-rose-400 font-semibold cursor-pointer hover:bg-terracotta/10 px-0.5 rounded transition-colors inline-block"
          title={`Click to view academic vocabulary definition (${vocabItem.cefr})`}
        >
          {matchedWordStr}
        </span>
      );
    } else {
      parts.push(matchedWordStr);
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  const speakWord = (wordText: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(wordText);
      utterance.rate = 0.9;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      <span className={className}>{parts}</span>

      {/* Quick Word Details Bottom Sheet Modal */}
      <AnimatePresence>
        {selectedWordItem && (
          <div className="fixed inset-0 z-50 bg-navy/70 backdrop-blur-xs flex items-end justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-navy/10 dark:border-slate-800 space-y-4 text-navy dark:text-slate-100 select-none"
              id="interactive-word-sheet"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-2xl font-bold text-burgundy dark:text-rose-400">
                      {selectedWordItem.word}
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-terracotta/10 text-terracotta rounded-md border border-terracotta/20">
                      AWL CEFR {selectedWordItem.cefr}
                    </span>
                  </div>
                  <p className="text-[11px] text-navy/50 dark:text-slate-400">
                    Academic Vocabulary Definition
                  </p>
                </div>

                <button
                  onClick={() => setSelectedWordItem(null)}
                  className="p-1 text-navy/40 dark:text-slate-500 hover:text-navy dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="bg-cream dark:bg-slate-950 p-3 rounded-2xl border border-navy/5 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-terracotta block">
                    Definition
                  </span>
                  <p className="text-navy dark:text-slate-200 leading-relaxed font-medium">
                    {selectedWordItem.definition}
                  </p>
                </div>

                <div className="bg-cream dark:bg-slate-950 p-3 rounded-2xl border border-navy/5 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-navy/40 dark:text-slate-500 block">
                    Example Usage
                  </span>
                  <p className="text-navy/80 dark:text-slate-300 italic leading-relaxed">
                    "{selectedWordItem.example}"
                  </p>
                </div>

                {selectedWordItem.synonyms && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-navy/40 dark:text-slate-500 block">
                      Synonyms
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedWordItem.synonyms.map((s) => (
                        <span
                          key={s}
                          className="bg-slate-100 dark:bg-slate-800 border border-navy/10 dark:border-slate-700 text-navy/80 dark:text-slate-200 px-2 py-0.5 rounded-md text-[11px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => speakWord(selectedWordItem.word)}
                  className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-2xl text-navy dark:text-slate-200 font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs"
                >
                  <Volume2 className="w-4 h-4 text-terracotta" />
                  <span>Audio</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSound('click', soundEnabled);
                    toggleSaveWord(selectedWordItem.id);
                  }}
                  className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                    isWordSaved(selectedWordItem.id)
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-terracotta text-white hover:bg-terracotta-dark'
                  }`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${isWordSaved(selectedWordItem.id) ? 'fill-current' : ''}`}
                  />
                  <span>
                    {isWordSaved(selectedWordItem.id) ? 'Saved in Notebook' : 'Bookmark Word'}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
