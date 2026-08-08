/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCampus } from '../context/CampusContext';
import { translations } from '../utils/translations';
import { playSound } from '../utils/soundEffects';
import { Compass, ChevronRight, ChevronLeft, X, CheckCircle2 } from 'lucide-react';
import { getOnboardingSteps, StepDefinition } from '../data/onboardingSteps';

interface TourOverlayProps {
  isOpen: boolean;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
}

export const TourOverlay: React.FC<TourOverlayProps> = ({
  isOpen,
  step,
  setStep,
  onClose
}) => {
  const { uiLanguage, setActiveTab, soundEnabled } = useCampus();
  const t = translations[uiLanguage] || translations.EN;

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Compute steps dynamically on uiLanguage change
  const steps: StepDefinition[] = useMemo(() => {
    const normLang = uiLanguage ? String(uiLanguage).toLowerCase() : 'en';
    return getOnboardingSteps(normLang);
  }, [uiLanguage]);

  // Shared motion timing & curve for cohesive onboarding tour animations
  const TOUR_TRANSITION = {
    duration: 0.24,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  const currentStepData = steps[step - 1] || steps[0];

  // Auto-switch tab when step changes
  useEffect(() => {
    if (!isOpen) return;
    setActiveTab(currentStepData.tab);
  }, [isOpen, step, currentStepData.tab, setActiveTab]);

  // Measure container and target element position continuously & on step changes
  useEffect(() => {
    if (!isOpen) return;

    let initialScrollDone = false;

    const measureAndScroll = () => {
      if (containerRef.current) {
        setContainerRect(containerRef.current.getBoundingClientRect());
      }

      // Ensure stats subtab is active if needed for exam estimator card
      if (currentStepData.targetId === 'exam-estimator-card' && !document.getElementById('exam-estimator-card')) {
        const statsBtn = document.getElementById('toggle-stats-tab');
        if (statsBtn) {
          statsBtn.click();
        }
      }

      const el = document.getElementById(currentStepData.targetId) ||
        (currentStepData.targetId === 'view-official-transcript-btn' ? document.getElementById('view-official-transcript-btn-locked') : null);
      if (el) {
        if (!initialScrollDone) {
          initialScrollDone = true;
          // 1. Native scrollIntoView
          el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

          // 2. Explicit parent container scroll calculation
          let parent: HTMLElement | null = el.parentElement;
          while (parent && parent !== document.body) {
            const overflowY = window.getComputedStyle(parent).overflowY;
            if ((overflowY === 'auto' || overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight) {
              const parentRect = parent.getBoundingClientRect();
              const elRect = el.getBoundingClientRect();
              const targetScrollTop = parent.scrollTop + (elRect.top - parentRect.top) - (parentRect.height / 2) + (elRect.height / 2);
              parent.scrollTo({ top: Math.max(0, targetScrollTop), behavior: 'smooth' });
              break;
            }
            parent = parent.parentElement;
          }
        }
        setTargetRect(el.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    };

    measureAndScroll();

    // Poll every 50ms until target element is mounted, scrolled into view, and measured
    const intervalId = setInterval(measureAndScroll, 50);

    const handleScrollOrResize = () => {
      const el = document.getElementById(currentStepData.targetId) ||
        (currentStepData.targetId === 'view-official-transcript-btn' ? document.getElementById('view-official-transcript-btn-locked') : null);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      }
      if (containerRef.current) {
        setContainerRect(containerRef.current.getBoundingClientRect());
      }
    };

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen, step, currentStepData.targetId]);

  if (!isOpen) return null;

  const handleNext = () => {
    playSound('click', soundEnabled);
    if (step < steps.length) {
      setStep((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    playSound('click', soundEnabled);
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    playSound('click', soundEnabled);
    onClose();
  };

  const stepCounterText = (t.tourStepCount || 'Step {current} of {total}')
    .replace('{current}', String(step))
    .replace('{total}', String(steps.length));

  // Calculate coordinates relative to TourOverlay container
  const cWidth = containerRect ? containerRect.width : (typeof window !== 'undefined' ? window.innerWidth : 380);
  const cHeight = containerRect ? containerRect.height : (typeof window !== 'undefined' ? window.innerHeight : 700);

  let relLeft = 0;
  let relTop = 0;
  let relWidth = 0;
  let relHeight = 0;
  let relRight = 0;
  let relBottom = 0;

  if (targetRect && containerRect) {
    relLeft = targetRect.left - containerRect.left;
    relTop = targetRect.top - containerRect.top;
    relWidth = targetRect.width;
    relHeight = targetRect.height;
    relRight = relLeft + relWidth;
    relBottom = relTop + relHeight;
  }

  // Compute smart dynamic tooltip placement relative to spotlighted element
  const getSmartTooltipStyle = (): React.CSSProperties => {
    const cardWidth = Math.min(320, cWidth - 24);
    const estimatedCardHeight = 210;

    if (!targetRect || !containerRect) {
      return {
        position: 'absolute',
        bottom: '80px',
        left: `${(cWidth - cardWidth) / 2}px`,
        width: `${cardWidth}px`,
        zIndex: 30,
      };
    }

    const spaceAbove = relTop - 12;
    const spaceBelow = cHeight - relBottom - 12;

    let top: number | undefined;
    let bottom: number | undefined;

    if (currentStepData.preferredPlacement === 'top' || currentStepData.targetId === 'map-biscuit-cat') {
      // Force placement strictly ABOVE target
      bottom = cHeight - relTop + 14;
      bottom = Math.min(bottom, cHeight - estimatedCardHeight - 12);
      bottom = Math.max(12, bottom);
    } else if (spaceBelow >= estimatedCardHeight) {
      // Place below target
      top = relBottom + 12;
      top = Math.min(top, cHeight - estimatedCardHeight - 12);
      top = Math.max(12, top);
    } else if (spaceAbove >= estimatedCardHeight) {
      // Place above target
      bottom = cHeight - relTop + 12;
      bottom = Math.min(bottom, cHeight - estimatedCardHeight - 12);
      bottom = Math.max(12, bottom);
    } else {
      // Place on whichever vertical side has more space
      if (spaceBelow >= spaceAbove) {
        top = relBottom + 8;
        top = Math.min(top, cHeight - estimatedCardHeight - 12);
        top = Math.max(12, top);
      } else {
        bottom = cHeight - relTop + 8;
        bottom = Math.min(bottom, cHeight - estimatedCardHeight - 12);
        bottom = Math.max(12, bottom);
      }
    }

    // Horizontal centering over target center, strictly clamped within screen/container bounds
    const targetCenterX = relLeft + relWidth / 2;
    let left = targetCenterX - cardWidth / 2;
    // Boundary collision check: ensure tooltip never overflows left or right edges
    left = Math.max(12, Math.min(left, cWidth - cardWidth - 12));

    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${left}px`,
      width: `${cardWidth}px`,
      zIndex: 30,
    };

    if (top !== undefined) {
      style.top = `${top}px`;
    } else if (bottom !== undefined) {
      style.bottom = `${bottom}px`;
    }

    return style;
  };

  const tooltipStyle = getSmartTooltipStyle();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={TOUR_TRANSITION}
          className="absolute inset-0 z-50 overflow-hidden pointer-events-auto select-none"
        >
          {/* Base dark backdrop overlay layer */}
          <div
            className="absolute inset-0 bg-slate-950/65"
            onClick={handleSkip}
          />

          {/* SVG Mask Cutout Window over target element */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <defs>
              <mask id="tour-spotlight-mask">
                {/* White area = dimmed backdrop */}
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                {/* Black cutout = clear window over target element, smoothly animated */}
                <motion.rect
                  initial={false}
                  animate={{
                    x: targetRect && containerRect ? relLeft - 6 : cWidth / 2,
                    y: targetRect && containerRect ? relTop - 6 : cHeight / 2,
                    width: targetRect && containerRect ? relWidth + 12 : 0,
                    height: targetRect && containerRect ? relHeight + 12 : 0,
                    opacity: targetRect && containerRect ? 1 : 0,
                  }}
                  transition={TOUR_TRANSITION}
                  rx="16"
                  ry="16"
                  fill="black"
                />
              </mask>
            </defs>
            {/* Cutout mask layer using dark overlay */}
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="rgba(15, 23, 42, 0.65)"
              mask="url(#tour-spotlight-mask)"
            />
          </svg>

          {/* Spotlight Highlight Box over target element */}
          <motion.div
            initial={false}
            animate={{
              top: targetRect && containerRect ? relTop - 6 : cHeight / 2,
              left: targetRect && containerRect ? relLeft - 6 : cWidth / 2,
              width: targetRect && containerRect ? relWidth + 12 : 0,
              height: targetRect && containerRect ? relHeight + 12 : 0,
              opacity: targetRect && containerRect ? 1 : 0,
            }}
            transition={TOUR_TRANSITION}
            className="absolute pointer-events-none rounded-2xl border-2 border-terracotta dark:border-amber-400 shadow-xl ring-4 ring-terracotta/25 dark:ring-amber-400/25 z-15"
          />

          {/* Floating Tooltip Card with Dynamic Smart Placement & Viewport Boundary Guard */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.95, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -6 }}
              transition={TOUR_TRANSITION}
              style={tooltipStyle}
              className="bg-cream-card dark:bg-slate-900 border-2 border-terracotta/40 dark:border-amber-400/40 rounded-3xl p-5 shadow-2xl pointer-events-auto space-y-3 relative overflow-hidden"
            >
            {/* Top Accent Line */}
            <div className="h-1 w-full bg-gradient-to-r from-terracotta via-amber-500 to-terracotta absolute top-0 left-0 right-0" />

            {/* Header Info */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-terracotta uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-terracotta" />
                <span>{stepCounterText}</span>
              </div>
              <button
                onClick={handleSkip}
                className="text-xs font-semibold text-navy/40 dark:text-slate-400 hover:text-terracotta dark:hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
              >
                {t.tourSkipBtn || 'Skip'}
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Title & One-Sentence Explanation */}
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-burgundy dark:text-rose-400 leading-snug">
                {currentStepData.title}
              </h3>
              <p className="text-xs text-navy/80 dark:text-slate-200 leading-relaxed font-sans">
                {currentStepData.desc}
              </p>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between pt-2">
              <div>
                {step > 1 ? (
                  <button
                    onClick={handleBack}
                    className="bg-navy/5 hover:bg-navy/10 dark:bg-slate-800 dark:hover:bg-slate-750 text-navy dark:text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    {t.tourBackBtn || 'Back'}
                  </button>
                ) : (
                  <span className="text-[10px] text-navy/40 dark:text-slate-500 italic">
                    Campus Guide
                  </span>
                )}
              </div>

              <button
                onClick={handleNext}
                className="bg-terracotta hover:bg-terracotta-dark text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                {step < steps.length ? (
                  <>
                    {t.tourNextBtn || 'Next'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    {t.tourFinishBtn || 'Got it!'}
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
