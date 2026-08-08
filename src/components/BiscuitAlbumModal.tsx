/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, CheckCircle, Sparkles, Heart, Camera, Award, Palette, Image as ImageIcon, Cat, Crown } from 'lucide-react';
import { BiscuitIllustration, getPoseImage } from './BiscuitIllustration';
import { useCampus } from '../context/CampusContext';
import { translations } from '../utils/translations';
import {
  ALL_BISCUIT_POSES,
  getDiscoveredPoses,
  syncPosesFromCompletedChapters,
  getBiscuitStageInfo,
  getPosesForStage,
  getDiscoveredPosesForStage,
  BiscuitPoseId,
  BiscuitStageId,
} from '../utils/biscuitAlbum';

interface BiscuitAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BiscuitAlbumModal: React.FC<BiscuitAlbumModalProps> = ({ isOpen, onClose }) => {
  const { progress, uiLanguage, isCampusPlus, setActiveSubscreenRequest, setActiveTab } = useCampus();
  const t = translations[uiLanguage] || translations['EN'];

  const [discoveredPoses, setDiscoveredPoses] = useState<BiscuitPoseId[]>([]);
  const [selectedStageTab, setSelectedStageTab] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      const synced = syncPosesFromCompletedChapters(progress.completedChapterIds || [], isCampusPlus);
      setDiscoveredPoses(synced);
    }
  }, [isOpen, progress.completedChapterIds, isCampusPlus]);

  if (!isOpen) return null;

  const completedCount = (progress.completedChapterIds || []).length;
  const stageInfo = getBiscuitStageInfo(completedCount);
  const activeStageIndex = stageInfo.stageIndex;
  
  // Selected stage view (defaults to currently unlocked active stage)
  const viewStageIndex = selectedStageTab !== null ? selectedStageTab : activeStageIndex;

  // Stages metadata
  const STAGES_META: Array<{
    index: number;
    id: BiscuitStageId;
    titleKey: string;
    descKey: string;
    reqLabel: string;
    unlocked: boolean;
    leadPose: string;
  }> = [
    {
      index: 0,
      id: 'kitten',
      titleKey: 'biscuitStageKitten',
      descKey: 'biscuitStageKittenDesc',
      reqLabel: 'Ch. 1–15',
      unlocked: true,
      leadPose: 'sleeping',
    },
    {
      index: 1,
      id: 'adolescent',
      titleKey: 'biscuitStageAdolescent',
      descKey: 'biscuitStageAdolescentDesc',
      reqLabel: 'Ch. 16–33',
      unlocked: completedCount >= 16,
      leadPose: 'alert',
    },
    {
      index: 2,
      id: 'adult',
      titleKey: 'biscuitStageAdult',
      descKey: 'biscuitStageAdultDesc',
      reqLabel: 'Ch. 34–50',
      unlocked: completedCount >= 34,
      leadPose: 'watching',
    },
  ];

  // Stage currently viewed
  const currentStageMeta = STAGES_META[viewStageIndex];
  const rawStagePoses = getPosesForStage(currentStageMeta.id);
  const stagePoses = [...rawStagePoses].sort((a, b) => {
    const aPrem = !!a.isPremiumProgression;
    const bPrem = !!b.isPremiumProgression;
    if (aPrem !== bPrem) {
      return aPrem ? 1 : -1;
    }
    return 0;
  });
  const stageDiscovered = getDiscoveredPosesForStage(currentStageMeta.id, discoveredPoses);

  // Total progress percentage toward max (50 chapters)
  const overallChaptersPct = Math.min(100, Math.round((completedCount / 50) * 100));

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 dark:bg-black/80 backdrop-blur-md overflow-y-auto"
        id="biscuit-album-modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-cream dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 text-navy dark:text-slate-100 max-h-[90vh] flex flex-col"
          id="biscuit-album-modal-card"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-terracotta/15 via-burgundy/10 to-amber-500/15 dark:from-terracotta/25 dark:via-burgundy/20 dark:to-amber-500/20 p-6 border-b border-navy/10 dark:border-slate-800 shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 text-navy/60 dark:text-slate-300 hover:text-navy dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer border border-navy/5 shadow-xs"
              aria-label="Close modal"
              id="close-biscuit-album-btn"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-terracotta dark:text-amber-400 bg-terracotta/10 dark:bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-terracotta/20">
                    🐾 {t.biscuitAlbumTitle || "Biscuit's Album"}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-burgundy dark:text-rose-300 mt-1">
                  {t.biscuitAlbumSubtitle || 'Moments & Poses Discovered on Campus'}
                </h3>
              </div>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Age Progression / Growth Stage Redesigned Section */}
            <div className="bg-cream-card/90 dark:bg-slate-800 border border-navy/10 dark:border-slate-700 p-4 sm:p-5 rounded-2xl shadow-sm space-y-4 relative overflow-hidden" id="biscuit-growth-stage-card">
              
              {/* Card Header & Current Stage Ribbon */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Award className="w-4.5 h-4.5 text-terracotta dark:text-amber-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-navy/70 dark:text-slate-300">
                    {t.biscuitStageTitle || 'Growth Stage'}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/15 via-terracotta/15 to-burgundy/15 dark:from-amber-400/25 dark:to-burgundy/25 px-3 py-1 rounded-full border border-terracotta/30 shadow-xs">
                  <Sparkles className="w-3 h-3 text-amber-500 animate-spin" />
                  <span className="text-xs font-serif font-bold text-burgundy dark:text-amber-300">
                    {t[STAGES_META[activeStageIndex].titleKey] || stageInfo.stage}
                  </span>
                </div>
              </div>

              {/* 3 Interactive Growth Stage Cards */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-2">
                {STAGES_META.map((stg) => {
                  const isActiveStage = activeStageIndex === stg.index;
                  const isSelectedView = viewStageIndex === stg.index;

                  return (
                    <button
                      key={stg.id}
                      type="button"
                      onClick={() => setSelectedStageTab(stg.index)}
                      className={`relative rounded-2xl p-3 sm:p-3.5 pt-4 flex flex-col items-center text-center transition-all duration-300 cursor-pointer select-none group focus:outline-none ${
                        isActiveStage
                          ? 'bg-gradient-to-b from-amber-500/15 via-terracotta/20 to-burgundy/10 dark:from-amber-950/70 dark:via-slate-800 dark:to-slate-900 border-2 border-terracotta dark:border-amber-400 shadow-[0_6px_20px_rgba(217,119,6,0.25)] ring-2 ring-terracotta/20 dark:ring-amber-400/30'
                          : isSelectedView
                          ? 'bg-amber-100/90 dark:bg-slate-800 border-2 border-amber-500 dark:border-amber-400 shadow-md'
                          : stg.unlocked
                          ? 'bg-white dark:bg-slate-800/90 border border-amber-900/15 dark:border-amber-500/20 hover:border-terracotta/40 dark:hover:border-amber-400/50 hover:bg-amber-50/60 dark:hover:bg-slate-700 shadow-xs'
                          : 'bg-slate-50/80 dark:bg-slate-900/80 border border-dashed border-navy/15 dark:border-slate-700 opacity-75 hover:opacity-100'
                      }`}
                      id={`biscuit-stage-card-${stg.id}`}
                    >
                      {/* Active Stage Badge Ribbon - positioned neatly floating at top border without overlapping content */}
                      {isActiveStage && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 via-terracotta to-burgundy text-white text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-white/40 z-20 whitespace-nowrap">
                          <Sparkles className="w-2.5 h-2.5 fill-current text-amber-200" /> Active Stage
                        </span>
                      )}

                      {/* Stage Illustration Avatar */}
                      <div className="my-1 transition-transform duration-300 group-hover:scale-105">
                        <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 transition-all p-0.5 shadow-md ${
                          isActiveStage
                            ? 'border-terracotta dark:border-amber-400 bg-amber-100 dark:bg-slate-900 ring-2 ring-amber-400/30'
                            : isSelectedView
                            ? 'border-amber-500 dark:border-amber-400 bg-amber-50 dark:bg-slate-900'
                            : 'border-amber-300/70 dark:border-slate-600 bg-white dark:bg-slate-900'
                        }`}>
                          <img
                            src={getPoseImage(stg.id === 'adult' ? 'adult_archway' : stg.leadPose)}
                            alt={t[stg.titleKey] || stg.id}
                            className={`w-full h-full object-cover rounded-xl select-none pointer-events-none ${!stg.unlocked ? 'opacity-85' : ''}`}
                          />
                          {!stg.unlocked && (
                            <div className="absolute inset-0 bg-slate-950/25 backdrop-blur-[0.5px] flex items-center justify-center">
                              <Lock className="w-3.5 h-3.5 text-white drop-shadow-md" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stage Title */}
                      <span className={`text-[11px] sm:text-xs font-serif font-bold leading-tight mt-1 ${
                        isActiveStage
                          ? 'text-burgundy dark:text-amber-200'
                          : isSelectedView
                          ? 'text-amber-950 dark:text-amber-300'
                          : stg.unlocked
                          ? 'text-navy dark:text-amber-100/90'
                          : 'text-navy/60 dark:text-slate-400'
                      }`}>
                        {t[stg.titleKey] || stg.id}
                      </span>

                      {/* Chapter Requirement Badge */}
                      <span className={`text-[9.5px] font-mono font-semibold mt-1.5 px-2 py-0.5 rounded-full border ${
                        stg.unlocked
                          ? 'text-terracotta dark:text-amber-300 bg-terracotta/10 dark:bg-amber-400/15 border-terracotta/20 dark:border-amber-400/30'
                          : 'text-navy/50 dark:text-slate-400 bg-navy/5 dark:bg-slate-900/60 border-navy/10 dark:border-slate-700'
                      }`}>
                        {stg.reqLabel}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Textured Progress Bar Section */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-navy/70 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <span>Semester Journey:</span>
                    <span className="text-terracotta dark:text-amber-400">Ch. {completedCount} / 50</span>
                  </span>
                  <span>{overallChaptersPct}%</span>
                </div>

                {/* Weighted Multi-Segment Textured Progress Track */}
                <div className="relative w-full h-4 bg-slate-200/90 dark:bg-slate-800/90 rounded-full p-0.5 border border-navy/10 dark:border-slate-700 shadow-inner overflow-hidden">
                  {/* Subtle Gloss Line */}
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-white/30 dark:bg-white/10 rounded-t-full pointer-events-none z-10" />

                  {/* Gradient Progress Fill */}
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-terracotta to-burgundy dark:from-amber-400 dark:via-terracotta dark:to-rose-400 transition-all duration-700 rounded-full shadow-xs relative"
                    style={{ width: `${overallChaptersPct}%` }}
                  >
                    {/* Animated pulse highlight at progress tip */}
                    {overallChaptersPct > 0 && overallChaptersPct < 100 && (
                      <span className="absolute right-0 top-0 bottom-0 w-2 bg-white/60 rounded-r-full animate-pulse" />
                    )}
                  </div>

                  {/* Stage Milestone Markers (at Ch. 16 and Ch. 34 boundaries: ~30% and ~66%) */}
                  <div className="absolute inset-0 pointer-events-none flex justify-between items-center px-[30%] z-20">
                    <div className={`w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 shadow-xs ${completedCount >= 16 ? 'bg-amber-400' : 'bg-slate-300 dark:bg-slate-700'}`} title="Adolescent Stage (Ch. 16)" />
                  </div>
                  <div className="absolute inset-0 pointer-events-none flex justify-between items-center px-[66%] z-20">
                    <div className={`w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 shadow-xs ${completedCount >= 34 ? 'bg-amber-400' : 'bg-slate-300 dark:bg-slate-700'}`} title="Adult Stage (Ch. 34)" />
                  </div>
                </div>
              </div>

              {/* Selected Stage Narrative Context Box */}
              <div className="bg-amber-50/80 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700/80 p-3.5 rounded-xl flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                  <Heart className="w-4 h-4 fill-current text-amber-600 dark:text-amber-400" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-xs font-serif font-bold text-burgundy dark:text-rose-300">
                      {t[currentStageMeta.titleKey] || currentStageMeta.id}
                    </h5>
                    <span className="text-[9px] font-mono text-amber-800 dark:text-amber-300 bg-amber-200/60 dark:bg-amber-900/60 px-1.5 py-0.2 rounded font-semibold">
                      {currentStageMeta.reqLabel}
                    </span>
                  </div>
                  <p className="text-xs text-navy/75 dark:text-slate-300 leading-relaxed font-sans">
                    {t[currentStageMeta.descKey] ||
                      "Biscuit grows up alongside your semester journey! Keep completing story chapters to unlock more memories with campus's favorite cat."}
                  </p>
                </div>
              </div>
            </div>

            {/* Poses Gallery Header & Stage-Specific Counter */}
            <div className="flex items-center justify-between gap-3 border-b border-navy/10 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <h4 className="text-sm font-serif font-bold text-burgundy dark:text-rose-300 truncate">
                  {t.biscuitDiscoveredCount || 'Discovered Poses'} — {t[currentStageMeta.titleKey] || currentStageMeta.id}
                </h4>
              </div>
              <span className="inline-flex items-center justify-center text-xs font-mono font-bold text-terracotta bg-terracotta/10 px-2.5 py-1 rounded-full border border-terracotta/20 whitespace-nowrap shrink-0">
                {stageDiscovered.length}&nbsp;/&nbsp;{stagePoses.length}
              </span>
            </div>

            {/* Poses Grid filtered to Currently Selected Growth Stage */}
            {stagePoses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stagePoses.map((poseMeta) => {
                  const isPlusExclusive = !!poseMeta.isPlusExclusive;
                  const isPremiumProgression = !!poseMeta.isPremiumProgression;
                  const isFinale = !!poseMeta.isFinale;
                  const isPlusPose = isPlusExclusive || isPremiumProgression;
                  const hasPlus = isCampusPlus;

                  const completedNums = (progress.completedChapterIds || []).map(Number);
                  const maxCompletedChapter = completedNums.length > 0 ? Math.max(...completedNums) : 0;
                  const currentChapterNum = Number(progress.currentChapterId || '1');
                  const maxReachedChapter = Math.max(completedCount, maxCompletedChapter, currentChapterNum);

                  const chapterReached = poseMeta.reqChapter
                    ? maxReachedChapter >= poseMeta.reqChapter ||
                      (progress.completedChapterIds || []).includes(String(poseMeta.reqChapter)) ||
                      (progress.encounteredPoses || []).includes(poseMeta.id)
                    : true;

                  const isUnlocked = isPlusExclusive
                    ? hasPlus
                    : isPremiumProgression
                    ? hasPlus && chapterReached
                    : discoveredPoses.includes(poseMeta.id);

                  const titleText = t[poseMeta.translationKeyTitle] || poseMeta.defaultTitle || poseMeta.id;
                  const descText = t[poseMeta.translationKeyDesc] || poseMeta.defaultDesc || '';
                  const poseImgSrc = getPoseImage(poseMeta.id);

                  // LUXURY PREMIUM CARD FRAME STYLING for all Premium/Plus cards
                  if (isPlusPose) {
                    // Behavioral Separation:
                    // Standalone Plus Poses (isPlusExclusive): Always show Blurred Teaser Preview (State B) if !hasPlus, HD Artwork (State C) if hasPlus.
                    // Chapter Progression Poses (isPremiumProgression):
                    //   State A (!chapterReached): Luxury Mystery Envelope
                    //   State B (chapterReached && !hasPlus): Blurred Image Teaser Preview with "Subscribe to Unlock"
                    //   State C (chapterReached && hasPlus): Full-Color HD Unlocked Artwork
                    let stateA = false;
                    let stateB = false;
                    let stateC = false;

                    if (isPremiumProgression) {
                      if (!chapterReached) {
                        stateA = true;
                      } else if (!hasPlus) {
                        stateB = true;
                      } else {
                        stateC = true;
                      }
                    } else if (isPlusExclusive) {
                      if (!hasPlus) {
                        stateB = true;
                      } else {
                        stateC = true;
                      }
                    }

                    const cardContent = (
                      <>
                        {/* Glowing Gold Plus Badge */}
                        <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 z-20 border border-amber-200/40">
                          <Crown className="w-3 h-3 fill-current text-amber-100" />
                          <span>Plus</span>
                        </div>

                        {/* STATE A: ELITE LUXURY MYSTERY ENVELOPE (Chapter Not Reached Yet) */}
                        {stateA && (
                          <>
                            <div className="relative my-1.5 aspect-square rounded-2xl p-6 text-center border-2 border-amber-400/60 bg-gradient-to-br from-amber-950/80 via-stone-900 to-amber-900/90 shadow-xl overflow-hidden backdrop-blur-md flex flex-col items-center justify-center">
                              {/* Decorative background: radial gold glow */}
                              <div className="bg-amber-500/10 rounded-full blur-xl absolute inset-0 pointer-events-none" />

                              {/* Glowing 3D-style gold emblem */}
                              <div className="relative z-10 w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 p-0.5 shadow-lg flex items-center justify-center shrink-0">
                                <div className="w-full h-full rounded-full bg-amber-950/60 flex items-center justify-center text-amber-200">
                                  <Lock className="w-5 h-5 drop-shadow-xs" />
                                </div>
                              </div>

                              {/* Gold-embossed ribbon pill */}
                              <div className="relative z-10 inline-block bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-inner mb-2">
                                Unlocks at Chapter {poseMeta.reqChapter}
                              </div>

                              {/* Refined serif requirement text */}
                              <p className="relative z-10 font-serif text-amber-100/90 text-xs font-medium leading-tight max-w-[200px]">
                                Reach Chapter {poseMeta.reqChapter} in your campus story to reveal this memory
                              </p>

                              {isFinale && (
                                <div className="absolute bottom-2.5 left-2.5 z-20 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-lg border border-amber-200 flex items-center gap-1">
                                  <span>🎓 SEMESTER FINALE</span>
                                </div>
                              )}
                            </div>
                            <div className="mt-1">
                              <h5 className="text-xs font-serif font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                                <span>{titleText}</span>
                              </h5>
                              <p className="text-[11px] text-navy/70 dark:text-slate-300 mt-1 leading-relaxed">
                                {descText || 'Keep exploring new story chapters across campus to discover this moment with Biscuit!'}
                              </p>
                            </div>
                          </>
                        )}

                        {/* STATE B: BEAUTIFUL BLURRED TEASER PREVIEW (Chapter Reached Without Plus / Standalone Plus) */}
                        {stateB && (
                          <>
                            <div className="relative my-1.5 aspect-square rounded-xl overflow-hidden border border-amber-400/30 dark:border-amber-500/30 bg-gradient-to-br from-amber-300/40 via-terracotta/25 to-burgundy/20 dark:from-amber-900/50 dark:via-terracotta/30 dark:to-slate-900 p-1 flex items-center justify-center">
                              {/* Radial Glow Background */}
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.35)_0%,rgba(194,89,65,0.18)_60%,transparent_100%)] pointer-events-none z-0" />

                              {/* Real Pose Image under heavy blur & warm scale glow */}
                              <img
                                src={poseImgSrc}
                                alt={titleText}
                                className="w-full h-full object-cover rounded-lg filter blur-md scale-105 opacity-80 select-none pointer-events-none transition-all duration-300 z-0"
                              />

                              {/* Paywall Lock Overlay */}
                              <div className="absolute inset-0 bg-slate-950/45 dark:bg-slate-950/65 backdrop-blur-[1px] rounded-xl flex flex-col items-center justify-center p-3 text-center z-10">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-terracotta text-white flex items-center justify-center shadow-lg mb-1.5 border border-white/50 shrink-0">
                                  <Crown className="w-4.5 h-4.5 fill-current text-amber-100 drop-shadow-xs" />
                                </div>
                                <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest block drop-shadow-xs">
                                  PLUS LOCK
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onClose();
                                    setActiveSubscreenRequest('subscription');
                                    setActiveTab('settings');
                                  }}
                                  className="mt-2 text-[10.5px] font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-1.5 px-4 rounded-full shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95 flex items-center gap-1 border border-white/30"
                                >
                                  <Crown className="w-3 h-3 fill-current text-amber-200" />
                                  <span>Subscribe to Unlock</span>
                                </button>
                              </div>

                              {isFinale && (
                                <div className="absolute bottom-2.5 left-2.5 z-20 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-lg border border-amber-200 flex items-center gap-1">
                                  <span>🎓 SEMESTER FINALE</span>
                                </div>
                              )}
                            </div>
                            <div className="mt-1">
                              <h5 className="text-xs font-serif font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                                <span>{titleText}</span>
                              </h5>
                              <p className="text-[11px] text-navy/70 dark:text-slate-300 mt-1 leading-relaxed">
                                {descText}
                              </p>
                            </div>
                          </>
                        )}

                        {/* STATE C: HIGH-DEFINITION UNBLURRED ARTWORK (Subscribed with Plus & Chapter Reached) */}
                        {stateC && (
                          <>
                            <div className="relative my-1.5 aspect-square rounded-xl overflow-hidden border border-amber-400/40 dark:border-amber-500/40 bg-white/60 dark:bg-slate-800/80 p-2 flex items-center justify-center shadow-xs">
                              <img
                                src={poseImgSrc}
                                alt={titleText}
                                className="w-full h-full object-cover rounded-lg shadow-xs"
                              />

                              {isFinale && (
                                <div className="absolute bottom-2.5 left-2.5 z-20 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-lg border border-amber-200 flex items-center gap-1">
                                  <span>🎓 SEMESTER FINALE</span>
                                </div>
                              )}
                            </div>
                            <div className="mt-1">
                              <h5 className="text-xs font-serif font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                                <span>{titleText}</span>
                                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                              </h5>
                              <p className="text-[11px] text-navy/80 dark:text-slate-300 mt-1 leading-relaxed">
                                {descText}
                              </p>
                            </div>
                          </>
                        )}
                      </>
                    );

                    // GRAND FINALE CONTAINER (Chapter 50 / `plus_semester_finale`)
                    if (isFinale) {
                      return (
                        <div
                          key={poseMeta.id}
                          id={`biscuit-pose-card-${poseMeta.id}`}
                          className="relative p-1 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 shadow-[0_0_25px_rgba(245,158,11,0.4)] animate-pulse-subtle transition-all duration-300"
                        >
                          <div className="rounded-[22px] bg-gradient-to-b from-amber-50 via-yellow-50/40 to-amber-100/60 dark:from-amber-950/80 dark:via-slate-900 dark:to-slate-900 p-4 border border-amber-300 dark:border-amber-500/60 flex flex-col justify-between h-full relative overflow-hidden">
                            {cardContent}
                          </div>
                        </div>
                      );
                    }

                    // Standard Premium Card Container
                    return (
                      <div
                        key={poseMeta.id}
                        className="relative rounded-2xl p-3.5 flex flex-col justify-between shadow-md overflow-hidden transition-all duration-300 border-2 border-amber-300/80 dark:border-amber-500/60 bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-amber-100/40 dark:from-amber-950/50 dark:via-orange-950/30 dark:to-slate-900"
                        id={`biscuit-pose-card-${poseMeta.id}`}
                      >
                        {cardContent}
                      </div>
                    );
                  }

                  // Standard Free Poses
                  return (
                    <div
                      key={poseMeta.id}
                      className={`relative rounded-2xl border transition-all duration-300 p-3.5 flex flex-col justify-between ${
                        isUnlocked
                          ? 'bg-cream-card dark:bg-slate-800 border-navy/10 dark:border-slate-700 shadow-sm hover:shadow-md'
                          : 'bg-navy/5 dark:bg-slate-900/60 border-navy/10 dark:border-slate-800 opacity-75'
                      }`}
                      id={`biscuit-pose-card-${poseMeta.id}`}
                    >
                      {isUnlocked ? (
                        <>
                          <div className="relative mb-3">
                            <BiscuitIllustration
                              pose={poseMeta.id as any}
                              className="w-full shadow-xs rounded-xl overflow-hidden border border-navy/10 dark:border-slate-700 bg-cream-card dark:bg-slate-800 p-3"
                            />
                            <span className="absolute top-2 right-2 bg-emerald-600/90 text-white text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 backdrop-blur-xs border border-white/20">
                              <CheckCircle className="w-3 h-3" /> Unlocked
                            </span>
                          </div>
                          <div>
                            <h5 className="text-sm font-serif font-bold text-burgundy dark:text-amber-200 flex items-center gap-1.5">
                              <span>{titleText}</span>
                            </h5>
                            <p className="text-xs text-navy/70 dark:text-slate-300 mt-1 leading-relaxed">
                              {descText}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="relative mb-3 aspect-square rounded-2xl bg-navy/10 dark:bg-slate-800 flex flex-col items-center justify-center p-4 border border-dashed border-navy/20 dark:border-slate-700">
                            <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-slate-700/80 text-navy/40 dark:text-slate-300 flex items-center justify-center mb-2 shadow-xs border border-navy/5 dark:border-slate-600">
                              <Lock className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-navy/50 dark:text-slate-400 text-center">
                              {poseMeta.reqChapter ? `Unlocks at Ch. ${poseMeta.reqChapter}` : t.biscuitLockedPose || 'Locked Pose'}
                            </span>
                          </div>
                          <div>
                            <h5 className="text-xs font-serif font-bold text-navy/50 dark:text-slate-400">
                              {titleText}
                            </h5>
                            <p className="text-[11px] text-navy/40 dark:text-slate-400 mt-1 leading-normal italic">
                              {descText || t.biscuitLockedDesc || 'Keep exploring new story chapters across campus to discover this moment with Biscuit!'}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-navy/15 dark:border-slate-700">
                <Camera className="w-8 h-8 text-navy/30 dark:text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-navy/60 dark:text-slate-400 font-sans">
                  No poses registered for this stage yet. More pose illustrations coming soon!
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-white/60 dark:bg-slate-900/60 border-t border-navy/10 dark:border-slate-800 text-center shrink-0">
            <button
              onClick={onClose}
              className="bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold py-2.5 px-6 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            >
              Close Album
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
