/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useCampus } from '../context/CampusContext';
import { translations } from '../utils/translations';
import { fetchUserNotes, NoteEntry } from '../utils/notes';
import { getDynamicChapters } from '../data/repositories';
import { buildings } from './MapScreen';
import {
  FileText,
  BookOpen,
  ArrowLeft,
  Calendar,
  MapPin,
  Search,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface MyNotesScreenProps {
  onBack: () => void;
}

export const MyNotesScreen: React.FC<MyNotesScreenProps> = ({ onBack }) => {
  const { uiLanguage, profile } = useCampus();
  const t = translations[uiLanguage] || translations.EN;

  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchUserNotes()
      .then((data) => {
        if (isMounted) {
          setNotes(data);
        }
      })
      .catch((err) => {
        console.error('Error loading notes:', err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Load chapters based on user profile
  const allChapters = (profile && profile.major)
    ? getDynamicChapters(profile.major || 'Undecided', profile.dorm || 'Elm Hall')
    : [];

  const getChapterInfo = (chapterId: string | undefined) => {
    if (!chapterId) {
      return { title: 'Lecture Note', locationName: 'Campus Location' };
    }
    const ch = allChapters.find((c) => c.id === chapterId);
    if (!ch) {
      const numMatch = String(chapterId).match(/\d+/);
      const title = numMatch ? `Chapter ${numMatch[0]}` : String(chapterId);
      return { title, locationName: 'Campus Location' };
    }

    const bld = buildings.find((b) => b.id === ch.locationId);
    return {
      title: ch.title || `Chapter ${ch.id}`,
      locationName: bld ? bld.name : 'Campus Building'
    };
  };

  const filteredNotes = (notes || []).filter((note) => {
    if (!note || typeof note !== 'object') return false;
    const noteText = String(note.text || '').trim();
    if (!noteText) return false;
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const info = getChapterInfo(note.chapterId);
    return (
      noteText.toLowerCase().includes(query) ||
      info.title.toLowerCase().includes(query) ||
      info.locationName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in" id="my-notes-screen">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy/10 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-xl text-navy dark:text-slate-200 hover:bg-navy/5 dark:hover:bg-slate-800 transition-all cursor-pointer"
            aria-label={t.backToProgress || 'Back'}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-burgundy/10 dark:bg-rose-400/10 text-burgundy dark:text-rose-300 font-mono text-[10px] font-bold uppercase rounded-md tracking-wider">
                {t.lectureNotebookLabel || 'Lecture Notebook'}
              </span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-burgundy dark:text-rose-400">
              {t.myNotesTitle || 'My Lecture Notes'}
            </h1>
          </div>
        </div>

        <p className="text-xs text-navy/60 dark:text-slate-400 max-w-sm">
          {t.myNotesSubtitle || 'Review your freeform notes taken during listening chapters'}
        </p>
      </div>

      {/* Search Filter Bar */}
      {notes.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-navy/40 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notebook notes by keyword, chapter, or location..."
            className="w-full bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 text-navy dark:text-slate-200 placeholder-navy/40 dark:placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta transition-all"
          />
        </div>
      )}

      {/* Main Content Area */}
      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <RefreshCw className="w-6 h-6 text-terracotta animate-spin mx-auto" />
          <p className="text-xs text-navy/60 dark:text-slate-400 font-semibold">
            Loading your lecture notebook entries...
          </p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-3xl p-10 text-center space-y-4 shadow-sm"
        >
          <div className="w-16 h-16 bg-cream-card dark:bg-slate-800 rounded-2xl border border-navy/10 dark:border-slate-700 flex items-center justify-center mx-auto text-terracotta">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-serif text-lg font-bold text-burgundy dark:text-rose-400">
              {searchQuery.trim() ? 'No Matching Notes Found' : (t.emptyNotesTitle || 'No Notes Yet')}
            </h3>
            <p className="text-xs text-navy/70 dark:text-slate-300 leading-relaxed">
              {searchQuery.trim()
                ? `No lecture notes matched "${searchQuery}". Try a different search term.`
                : (t.emptyNotesText || 'Your lecture notes will appear here once you start taking notes during Listening chapters.')}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4" id="notes-list">
          {filteredNotes.map((note, index) => {
            const info = getChapterInfo(note.chapterId);
            let formattedDate = 'Recent';
            try {
              const d = new Date(note.createdAt);
              if (!isNaN(d.getTime())) {
                formattedDate = d.toLocaleDateString(
                  uiLanguage === 'RU' ? 'ru-RU' : uiLanguage === 'ES' ? 'es-ES' : 'en-US',
                  {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }
                );
              }
            } catch (e) {
              // fallback date
            }

            return (
              <motion.div
                key={note.id || index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 hover:border-terracotta/30 transition-all"
              >
                {/* Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy/5 dark:border-slate-800 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-burgundy dark:text-rose-300">
                      <BookOpen className="w-3.5 h-3.5 text-terracotta shrink-0" />
                      {info.title}
                    </span>
                    <span className="text-navy/20 dark:text-slate-700">•</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-navy/60 dark:text-slate-400">
                      <MapPin className="w-3 h-3 text-navy/40 dark:text-slate-500 shrink-0" />
                      {info.locationName}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-navy/40 dark:text-slate-500">
                    <Calendar className="w-3 h-3 shrink-0" />
                    {formattedDate}
                  </span>
                </div>

                {/* Notebook Text Container */}
                <div className="bg-cream-card dark:bg-slate-950 p-4 rounded-xl border border-navy/5 dark:border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-mono font-bold text-terracotta">
                    <FileText className="w-3 h-3" />
                    Student Notebook Entry
                  </div>
                  <p className="text-xs text-navy/85 dark:text-slate-200 font-serif leading-relaxed whitespace-pre-wrap italic">
                    "{note.text}"
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
