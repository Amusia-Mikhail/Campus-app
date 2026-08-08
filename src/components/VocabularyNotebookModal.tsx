/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCampus } from '../context/CampusContext';
import { VOCABULARY_DATASET, VocabularyItem } from '../data/vocabulary';
import {
  BookMarked,
  Bookmark,
  X,
  Search,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Volume2,
  Check,
  Layers,
  ListFilter
} from 'lucide-react';
import { translations } from '../utils/translations';
import { playSound } from '../utils/soundEffects';

interface VocabularyNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWordId?: string | null;
}

export const VocabularyNotebookModal: React.FC<VocabularyNotebookModalProps> = ({
  isOpen,
  onClose,
  initialWordId
}) => {
  const { progress, toggleSaveWord, isWordSaved, soundEnabled, uiLanguage } = useCampus();
  const t = translations[uiLanguage || 'EN'] || translations.EN;

  const [activeTab, setActiveTab] = useState<'flashcards' | 'notebook'>('notebook');
  const [filterMode, setFilterMode] = useState<'saved' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // When initialWordId is passed or modal opens with initial word, set initial state
  React.useEffect(() => {
    if (initialWordId) {
      const wordObj = VOCABULARY_DATASET.find(
        (v) => v.id.toLowerCase() === initialWordId.toLowerCase() || v.word.toLowerCase() === initialWordId.toLowerCase()
      );
      if (wordObj) {
        setSelectedWord(wordObj);
      }
    }
  }, [initialWordId, isOpen]);

  if (!isOpen) return null;

  const savedWordIds = progress.savedWordIds || [];

  const filteredWords = VOCABULARY_DATASET.filter((item) => {
    const isSavedMatch = filterMode === 'all' || savedWordIds.includes(item.id);
    const query = searchQuery.trim().toLowerCase();
    const isSearchMatch =
      !query ||
      item.word.toLowerCase().includes(query) ||
      item.definition.toLowerCase().includes(query) ||
      item.synonyms.some((s) => s.toLowerCase().includes(query));
    return isSavedMatch && isSearchMatch;
  });

  const activeFlashcardWords =
    filterMode === 'saved' && savedWordIds.length > 0
      ? VOCABULARY_DATASET.filter((w) => savedWordIds.includes(w.id))
      : VOCABULARY_DATASET;

  const currentFlashcard = activeFlashcardWords[currentCardIndex % (activeFlashcardWords.length || 1)];

  const handleNextCard = () => {
    playSound('click', soundEnabled);
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % activeFlashcardWords.length);
  };

  const handlePrevCard = () => {
    playSound('click', soundEnabled);
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + activeFlashcardWords.length) % activeFlashcardWords.length);
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-navy/80 backdrop-blur-xs select-none">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full h-[90vh] sm:h-[80vh] max-w-md bg-cream dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-navy/10 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden text-navy dark:text-slate-100"
        id="vocabulary-notebook-modal"
      >
        {/* Header Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-b border-navy/5 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-terracotta/10 text-terracotta rounded-xl border border-terracotta/20">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-burgundy dark:text-rose-400">
                {t.vocabHeader || 'Academic Vocabulary'}
              </h3>
              <p className="text-[10px] text-navy/50 dark:text-slate-400 font-mono">
                {(t.vocabWordsSaved || '{saved} / {total} Words Saved').replace('{saved}', String(savedWordIds.length)).replace('{total}', String(VOCABULARY_DATASET.length))}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-navy/5 dark:hover:bg-slate-800 rounded-full text-navy/40 dark:text-slate-500 hover:text-navy dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Toggle Tabs */}
        <div className="bg-slate-100 dark:bg-slate-950 p-1.5 mx-4 mt-3 rounded-2xl flex items-center justify-between gap-1 shrink-0 border border-navy/5 dark:border-slate-800">
          <button
            onClick={() => {
              playSound('click', soundEnabled);
              setActiveTab('notebook');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'notebook'
                ? 'bg-white dark:bg-slate-900 text-terracotta shadow-xs'
                : 'text-navy/50 dark:text-slate-400 hover:text-navy dark:hover:text-slate-200'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>{t.vocabWordListTab || 'Word List'}</span>
          </button>
          <button
            onClick={() => {
              playSound('click', soundEnabled);
              setActiveTab('flashcards');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'flashcards'
                ? 'bg-white dark:bg-slate-900 text-terracotta shadow-xs'
                : 'text-navy/50 dark:text-slate-400 hover:text-navy dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.vocabFlashcardsTab || 'Flashcards'}</span>
          </button>
        </div>

        {/* Tab 1: Word List & Notebook */}
        {activeTab === 'notebook' && (
          <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-3">
            {/* Search and Filter bar */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-navy/40 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t.vocabSearchPlaceholder || 'Search AWL vocabulary...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-navy/10 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-navy dark:text-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-terracotta transition-all"
                />
              </div>

              {/* Filter pills */}
              <div className="flex bg-white dark:bg-slate-950 border border-navy/10 dark:border-slate-800 rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    filterMode === 'all'
                      ? 'bg-terracotta text-white'
                      : 'text-navy/60 dark:text-slate-400'
                  }`}
                >
                  {(t.vocabFilterAll || 'All ({count})').replace('{count}', String(VOCABULARY_DATASET.length))}
                </button>
                <button
                  onClick={() => setFilterMode('saved')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    filterMode === 'saved'
                      ? 'bg-terracotta text-white'
                      : 'text-navy/60 dark:text-slate-400'
                  }`}
                >
                  {(t.vocabFilterSaved || 'Saved ({count})').replace('{count}', String(savedWordIds.length))}
                </button>
              </div>
            </div>

            {/* Scrollable Word Cards */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1" id="vocabulary-word-list">
              {filteredWords.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <BookMarked className="w-10 h-10 text-navy/20 dark:text-slate-600 mx-auto" />
                  <p className="text-xs text-navy/50 dark:text-slate-400 font-medium">
                    {filterMode === 'saved'
                      ? (t.vocabNoSavedWords || 'No saved words yet! Click the bookmark icon on any word to add it.')
                      : (t.vocabNoSearchMatch || 'No words match your search criteria.')}
                  </p>
                </div>
              ) : (
                filteredWords.map((item) => {
                  const saved = isWordSaved(item.id);
                  return (
                    <div
                      key={item.id}
                      id={`vocab-card-${item.id}`}
                      onClick={() => setSelectedWord(item)}
                      className="bg-white dark:bg-slate-950 border border-navy/5 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs hover:border-terracotta/40 transition-all cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-base text-burgundy dark:text-rose-400">
                            {item.word}
                          </h4>
                          <span
                            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                              item.cefr === 'C2'
                                ? 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                                : item.cefr === 'C1'
                                ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                            }`}
                          >
                            {item.cefr}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakWord(item.word);
                            }}
                            className="p-1.5 text-navy/40 dark:text-slate-500 hover:text-terracotta rounded-lg transition-colors cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playSound('click', soundEnabled);
                              toggleSaveWord(item.id);
                            }}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              saved
                                ? 'text-amber-500 bg-amber-500/10'
                                : 'text-navy/30 dark:text-slate-600 hover:text-terracotta'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-navy/70 dark:text-slate-300 leading-snug line-clamp-2">
                        {item.definition}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-navy/40 dark:text-slate-500 pt-0.5">
                        <span className="truncate italic">"{item.example}"</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Flashcards View */}
        {activeTab === 'flashcards' && (
          <div className="flex-1 flex flex-col justify-between p-4 space-y-4 overflow-hidden">
            {activeFlashcardWords.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <Layers className="w-12 h-12 text-navy/20 dark:text-slate-600 mx-auto" />
                <p className="text-xs text-navy/50 dark:text-slate-400">
                  No words available for flashcards in current filter mode.
                </p>
              </div>
            ) : (
              <>
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs font-mono text-navy/60 dark:text-slate-400">
                  <span>
                    {(t.vocabCardProgress || 'Card {current} of {total}').replace('{current}', String(currentCardIndex + 1)).replace('{total}', String(activeFlashcardWords.length))}
                  </span>
                  <span className="text-[10px] text-terracotta font-semibold">
                    {t.vocabTapToFlip || 'Tap card to flip'}
                  </span>
                </div>

                {/* Flip Card Container */}
                <div
                  onClick={() => {
                    playSound('click', soundEnabled);
                    setIsFlipped(!isFlipped);
                  }}
                  className="flex-1 min-h-[260px] bg-white dark:bg-slate-950 border-2 border-navy/10 dark:border-slate-800 hover:border-terracotta/50 rounded-3xl p-6 shadow-md flex flex-col justify-between cursor-pointer transition-all relative overflow-hidden group"
                  id="flashcard-flip-container"
                >
                  {/* Decorative corner tag */}
                  <div className="flex justify-between items-center w-full">
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                        currentFlashcard?.cefr === 'C2'
                          ? 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                          : currentFlashcard?.cefr === 'C1'
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                      }`}
                    >
                      AWL CEFR {currentFlashcard?.cefr}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(currentFlashcard?.word || '');
                      }}
                      className="p-2 bg-cream dark:bg-slate-900 rounded-full text-navy/60 dark:text-slate-300 hover:text-terracotta transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content: Front vs Back */}
                  {!isFlipped ? (
                    // FRONT OF CARD
                    <div className="my-auto text-center space-y-3 py-6">
                      <h2 className="font-serif text-3xl font-bold text-burgundy dark:text-rose-400 tracking-wide">
                        {currentFlashcard?.word}
                      </h2>
                      <p className="text-xs text-navy/40 dark:text-slate-500 font-mono">
                        {t.vocabTapToReveal || '(Tap to reveal definition & example)'}
                      </p>
                    </div>
                  ) : (
                    // BACK OF CARD
                    <div className="my-auto space-y-3 py-2 text-left">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-terracotta block">
                          {t.vocabDefinitionLabel || 'Definition'}
                        </span>
                        <p className="text-sm font-medium text-navy dark:text-slate-200 leading-snug">
                          {currentFlashcard?.definition}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-navy/40 dark:text-slate-500 block">
                          {t.vocabExampleLabel || 'Example Sentence'}
                        </span>
                        <p className="text-xs italic text-navy/70 dark:text-slate-300 leading-relaxed">
                          "{currentFlashcard?.example}"
                        </p>
                      </div>

                      {currentFlashcard?.synonyms && (
                        <div className="pt-1 flex flex-wrap gap-1">
                          {currentFlashcard.synonyms.map((syn) => (
                            <span
                              key={syn}
                              className="text-[9.5px] bg-slate-100 dark:bg-slate-900 border border-navy/5 dark:border-slate-800 text-navy/60 dark:text-slate-400 px-2 py-0.5 rounded-md"
                            >
                              {syn}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card Footer action button */}
                  <div className="flex justify-between items-center pt-2 border-t border-navy/5 dark:border-slate-800/60">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentFlashcard) {
                          playSound('click', soundEnabled);
                          toggleSaveWord(currentFlashcard.id);
                        }
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-terracotta"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isWordSaved(currentFlashcard?.id || '') ? 'fill-current' : ''
                        }`}
                      />
                      <span>
                        {isWordSaved(currentFlashcard?.id || '')
                          ? (t.vocabSavedInNotebook || 'Saved in Notebook')
                          : (t.vocabSaveWord || 'Save Word')}
                      </span>
                    </button>

                    <div className="flex items-center gap-1 text-[11px] text-navy/40 dark:text-slate-500 font-mono">
                      <RotateCw className="w-3 h-3" />
                      <span>{t.vocabFlip || 'Flip'}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Navigation for Flashcards */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={handlePrevCard}
                    className="flex-1 bg-white dark:bg-slate-950 border border-navy/10 dark:border-slate-800 py-3 px-4 rounded-2xl text-xs font-bold text-navy dark:text-slate-200 hover:border-terracotta flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{t.vocabPrevCard || 'Previous'}</span>
                  </button>

                  <button
                    onClick={handleNextCard}
                    className="flex-1 bg-terracotta hover:bg-terracotta-dark text-white py-3 px-4 rounded-2xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  >
                    <span>{t.vocabNextCard || 'Next Card'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Selected Word Detail Sheet Modal Overlay (When clicking a word from list) */}
        <AnimatePresence>
          {selectedWord && (
            <div className="fixed inset-0 z-60 bg-navy/60 backdrop-blur-xs flex items-end justify-center p-0 sm:p-4">
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-navy/10 dark:border-slate-800 space-y-4"
                id="selected-word-sheet"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-2xl font-bold text-burgundy dark:text-rose-400">
                        {selectedWord.word}
                      </h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-terracotta/10 text-terracotta rounded-md border border-terracotta/20">
                        {selectedWord.cefr}
                      </span>
                    </div>
                    <p className="text-xs text-navy/50 dark:text-slate-400">
                      {t.vocabAwlSubtitle || 'Academic Word List (AWL) Vocabulary'}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedWord(null)}
                    className="p-1 text-navy/40 dark:text-slate-500 hover:text-navy dark:hover:text-slate-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-cream dark:bg-slate-950 p-3.5 rounded-2xl border border-navy/5 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-terracotta block">
                      {t.vocabDefinitionLabel || 'Definition'}
                    </span>
                    <p className="text-navy dark:text-slate-200 leading-relaxed font-medium">
                      {selectedWord.definition}
                    </p>
                  </div>

                  <div className="bg-cream dark:bg-slate-950 p-3.5 rounded-2xl border border-navy/5 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-navy/40 dark:text-slate-500 block">
                      {t.vocabExampleLabel || 'Example Usage'}
                    </span>
                    <p className="text-navy/80 dark:text-slate-300 italic leading-relaxed">
                      "{selectedWord.example}"
                    </p>
                  </div>

                  {selectedWord.synonyms && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-navy/40 dark:text-slate-500 block">
                        Synonyms
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedWord.synonyms.map((s) => (
                          <span
                            key={s}
                            className="bg-slate-100 dark:bg-slate-800 border border-navy/10 dark:border-slate-700 text-navy/80 dark:text-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium"
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
                    onClick={() => speakWord(selectedWord.word)}
                    className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-2xl text-navy dark:text-slate-200 font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Volume2 className="w-4 h-4 text-terracotta" />
                    <span>{t.vocabPronounce || 'Pronounce'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playSound('click', soundEnabled);
                      toggleSaveWord(selectedWord.id);
                    }}
                    className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                      isWordSaved(selectedWord.id)
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-terracotta text-white hover:bg-terracotta-dark'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isWordSaved(selectedWord.id) ? 'fill-current' : ''}`} />
                    <span>
                      {isWordSaved(selectedWord.id) ? (t.vocabSavedInNotebook || 'Saved in Notebook') : (t.vocabBookmarkWord || 'Bookmark Word')}
                    </span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
