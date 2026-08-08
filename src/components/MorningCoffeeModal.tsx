/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, Flame, Heart, X, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';
import { DailyCoffeeDialogue, DailyCoffeeOption } from '../data/dailyCoffeeDialogues';
import { playSound } from '../utils/soundEffects';
import { AnimatedCoffeeMug } from './AnimatedCoffeeMug';
import { useCampus } from '../context/CampusContext';
import { translations } from '../utils/translations';

interface MorningCoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  dialogue: DailyCoffeeDialogue;
  streakCount: number;
  soundEnabled: boolean;
  onSelectOption: (option: DailyCoffeeOption) => Promise<number>; // returns new streak
}

export const MorningCoffeeModal: React.FC<MorningCoffeeModalProps> = ({
  isOpen,
  onClose,
  dialogue,
  streakCount,
  soundEnabled,
  onSelectOption
}) => {
  const { uiLanguage } = useCampus();
  const t = translations[uiLanguage] || translations.EN;

  const [selectedOption, setSelectedOption] = useState<DailyCoffeeOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newStreak, setNewStreak] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePickOption = async (opt: DailyCoffeeOption) => {
    if (selectedOption || isSubmitting) return;
    setSelectedOption(opt);
    setIsSubmitting(true);
    playSound('chime', soundEnabled);

    try {
      const calculatedStreak = await onSelectOption(opt);
      setNewStreak(calculatedStreak);
      setShowCelebration(true);
    } catch (err) {
      console.error('Error completing coffee talk:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishAndClose = () => {
    playSound('click', soundEnabled);
    setSelectedOption(null);
    setShowCelebration(false);
    setNewStreak(null);
    onClose();
  };

  const activeStreak = newStreak !== null ? newStreak : streakCount;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/65 backdrop-blur-sm" id="morning-coffee-modal-overlay">
          {/* Confetti particles on completion */}
          {showCelebration && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 flex items-center justify-center">
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 1,
                    scale: Math.random() * 0.8 + 0.6,
                    rotate: 0
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 360,
                    y: (Math.random() - 0.7) * 360,
                    opacity: 0,
                    rotate: Math.random() * 360
                  }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="absolute w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: ['#d97706', '#b45309', '#059669', '#2563eb', '#ec4899'][i % 5]
                  }}
                />
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-lg bg-[#FFFDF9] dark:bg-slate-900 border-2 border-amber-900/20 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative overflow-hidden text-navy dark:text-slate-100 font-sans"
            id="morning-coffee-modal-card"
          >
            {/* Header / Top Ribbon */}
            <div className="flex items-center justify-between border-b border-amber-900/10 dark:border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-600/10 dark:bg-amber-500/20 flex items-center justify-center border border-amber-600/20 shrink-0 pt-1">
                  <AnimatedCoffeeMug size="small" showAura={false} floatAnimation={false} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-800 dark:text-amber-400">
                      {t.coffeeDormRitual || 'Dormitory Morning Ritual'}
                    </span>
                    {activeStreak > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-amber-500/15 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                        <Flame className="w-3 h-3 text-amber-600 fill-current" />
                        <span>{(t.coffeeStreakText || '{count} Day Streak').replace('{count}', String(activeStreak))}</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-serif font-bold text-burgundy dark:text-rose-400">
                    {t.morningCoffeeHeader || 'Morning Coffee with Jordan'}
                  </h2>
                </div>
              </div>

              <button
                onClick={handleFinishAndClose}
                className="p-2 rounded-full hover:bg-amber-900/10 dark:hover:bg-slate-800 text-navy/40 dark:text-slate-400 transition-colors cursor-pointer"
                id="close-coffee-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Jordan Character Prompt Box */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-100/30 to-terracotta/10 dark:from-slate-850 dark:to-slate-800 border border-amber-900/15 dark:border-slate-700 rounded-2xl p-4 mb-5 flex items-start gap-3.5 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-terracotta text-white flex items-center justify-center font-serif font-bold text-lg shadow-md shrink-0 border-2 border-white/80">
                J
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-burgundy dark:text-rose-300">
                    {t.coffeeRoommateTitle || 'Jordan (Roommate)'}
                  </span>
                  <span className="text-[10px] font-mono text-terracotta font-semibold">
                    Elm Hall Lounge
                  </span>
                </div>
                <p className="text-sm font-serif italic text-navy/90 dark:text-slate-200 leading-relaxed">
                  "{dialogue.question}"
                </p>
              </div>
            </div>

            {/* Content: Choices or Response */}
            {!selectedOption ? (
              <div className="space-y-3" id="coffee-options-container">
                <span className="text-[11px] font-mono uppercase tracking-wider text-navy/50 dark:text-slate-400 font-semibold block">
                  {t.coffeeChooseResponse || 'Choose your morning response:'}
                </span>
                {dialogue.options.map((opt, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.01, x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePickOption(opt)}
                    className="w-full text-left bg-white dark:bg-slate-800 hover:bg-amber-50/80 dark:hover:bg-slate-750 border border-amber-900/15 dark:border-slate-700 rounded-2xl p-3.5 transition-all shadow-xs flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <span className="text-xs font-sans text-navy dark:text-slate-200 group-hover:text-amber-900 dark:group-hover:text-amber-300 font-medium leading-normal">
                      {opt.text}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg shrink-0 border border-amber-500/20 group-hover:bg-amber-500/20">
                      +{opt.friendshipPoints} Pts
                    </span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
                id="jordan-response-container"
              >
                {/* User's Choice */}
                <div className="bg-white/80 dark:bg-slate-800/80 border border-amber-900/10 dark:border-slate-700 rounded-xl p-3 text-xs text-navy/70 dark:text-slate-300 font-sans italic">
                   {t.coffeeYouReplied || 'You replied:'} "{selectedOption.text}"
                </div>

                {/* Jordan's Reaction */}
                <div className="bg-amber-500/10 dark:bg-amber-950/40 border-2 border-amber-500/30 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 font-serif">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                    <span>{t.coffeeJordanResponse || "Jordan's Response:"}</span>
                  </div>
                  <p className="text-sm font-sans font-medium text-navy dark:text-slate-100 leading-relaxed">
                    "{selectedOption.jordanReply}"
                  </p>
                </div>

                {/* Rewards Celebration Box */}
                <div className="bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600 animate-bounce" />
                    <div>
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                        {t.coffeeFriendshipBoosted || 'Friendship Boosted!'}
                      </span>
                      <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400">
                        {(t.coffeePtsWithJordan || '+{pts} Points with Jordan').replace('{pts}', String(selectedOption.friendshipPoints))}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-900 dark:text-amber-200 rounded-full font-mono text-xs font-bold border border-amber-500/30">
                    <Flame className="w-3.5 h-3.5 text-amber-600 fill-current" />
                    <span>{(t.coffeeStreakText || '{count} Day Streak!').replace('{count}', String(activeStreak))}</span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleFinishAndClose}
                  className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-terracotta hover:from-amber-700 hover:to-terracotta-dark text-white font-serif font-bold text-sm py-3 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  id="finish-coffee-btn"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.coffeeHaveGreatDayCta || 'Have a Great Day in Class!'}</span>
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
