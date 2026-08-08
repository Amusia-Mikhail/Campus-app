import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Hourglass, Heart, BookOpen, Lock } from 'lucide-react';
import { Chapter } from '../data/models';
import { useCampus } from '../context/CampusContext';
import { translations } from '../utils/translations';

export interface ChapterListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  chapters: Chapter[];
  completedChapterIds: string[];
  currentChapterId: string;
  jordanPoints?: number;
  onSelectChapter?: (chapterId: string) => void;
  onLockedClick?: (requiredPts: number, currentPts: number) => void;
}

export const ChapterListModal: React.FC<ChapterListModalProps> = ({
  isOpen,
  onClose,
  title,
  chapters,
  completedChapterIds,
  currentChapterId,
  jordanPoints = 0,
  onSelectChapter,
  onLockedClick,
}) => {
  const { uiLanguage } = useCampus();
  const t = translations[uiLanguage] || translations.EN;

  const modalTitle = title || t.specialJordanDialogueHeader || 'Chapter & Special Talk Directory';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-navy/5 dark:border-slate-800 bg-cream-light dark:bg-slate-950">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-base font-serif font-bold text-burgundy dark:text-rose-400">
                {modalTitle}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-navy/40 dark:text-slate-500 hover:bg-navy/5 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="p-5 overflow-y-auto space-y-2.5 flex-1">
            {chapters.map((ch) => {
              const isCompleted = completedChapterIds.includes(ch.id);
              const isCurrent = currentChapterId === ch.id;
              const isMilestone = isNaN(Number(ch.id)) || ch.id.includes('milestone');
              const requiredPts = isMilestone ? (Number(ch.id.replace('jordan_milestone_', '')) || 0) : 0;
              const isLockedSpecial = isMilestone && !isCompleted && jordanPoints < requiredPts;

              return (
                <div
                  key={ch.id}
                  onClick={() => {
                    if (isLockedSpecial) {
                      onLockedClick?.(requiredPts, jordanPoints);
                      return;
                    }
                    if (onSelectChapter) {
                      onSelectChapter(ch.id);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isLockedSpecial
                      ? 'opacity-75 bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 cursor-pointer'
                      : onSelectChapter
                      ? 'cursor-pointer hover:border-terracotta/40 hover:shadow-xs'
                      : ''
                  } ${
                    isCurrent
                      ? 'border-terracotta/50 bg-terracotta/5 dark:bg-terracotta/10'
                      : isCompleted
                      ? 'border-navy/5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40'
                      : 'border-navy/5 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5 shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-sage" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full border-2 border-terracotta flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse"></span>
                        </div>
                      ) : isLockedSpecial ? (
                        <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      ) : isMilestone ? (
                        <Heart className="w-4 h-4 text-rose-500 fill-rose-100 dark:fill-rose-950" />
                      ) : (
                        <Hourglass className="w-4 h-4 text-navy/20 dark:text-slate-600" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <h4 className={`text-xs font-serif font-bold ${isCompleted ? 'text-navy/50 dark:text-slate-500 line-through' : 'text-navy dark:text-slate-200'}`}>
                        {isMilestone ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
                              [{t.specialJordanDialogueHeader || 'Special Talk'}]
                            </span>
                            {ch.title}
                          </span>
                        ) : (
                          `${t.homeChapter || 'Ch'} ${ch.id}: ${ch.title}`
                        )}
                      </h4>
                      <p className="text-[10px] text-navy/40 dark:text-slate-500 font-semibold uppercase tracking-tight">
                        {ch.skill} • {ch.locationId.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  {isLockedSpecial ? (
                    <span className="text-[9px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 border border-amber-300/60 dark:border-amber-800/60 px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> {requiredPts} Pts
                    </span>
                  ) : isCurrent ? (
                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider bg-terracotta text-white px-2 py-0.5 rounded shadow-xs shrink-0">
                      Active
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ChapterListModal;
