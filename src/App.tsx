/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CampusProvider, useCampus, TabType } from './context/CampusContext';
import { playSound } from './utils/soundEffects';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { StoryScreen } from './screens/StoryScreen';
import { MapScreen } from './screens/MapScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AdminPanelScreen } from './screens/AdminPanelScreen';
import { translations } from './utils/translations';
import { BADGE_DEFINITIONS, getBadgeTitle, getBadgeDesc } from './utils/badgeHelper';
import { BadgeMedallion } from './components/BadgeMedallion';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TourOverlay } from './components/TourOverlay';
import {
  Home,
  BookOpen,
  Map,
  Award,
  Settings,
  Battery,
  Wifi,
  Signal,
  Loader2,
  AlertTriangle,
  LogOut,
  Sparkles,
  WifiOff,
  X,
  Flame,
  Moon,
  Calendar,
  PenTool,
  Users,
  Compass,
  GraduationCap,
  Heart
} from 'lucide-react';

const CampusApp: React.FC = () => {
  const {
    profile,
    progress,
    activeTab,
    setActiveTab,
    isInitialLoading,
    initialLoadingError,
    handleRetryInitialLoad,
    sessionExpired,
    handleReauthenticate,
    logout,
    isOnline,
    uiLanguage,
    storyRepository,
    darkMode,
    soundEnabled,
    isTourActive,
    endTour,
    showSubtleSparkleCue,
    dismissSubtleSparkleCue
  } = useCampus();
  const [isAdminRoute, setIsAdminRoute] = useState(window.location.hash === '#/admin-x7k2');
  const [activeToast, setActiveToast] = useState<{ id: string; title: string; desc: string; iconName: string } | null>(null);
  const [tourStep, setTourStep] = useState<number>(1);

  useEffect(() => {
    if (isTourActive) {
      setTourStep(1);
    }
  }, [isTourActive]);

  const t = translations[uiLanguage] || translations.EN;

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminRoute(window.location.hash === '#/admin-x7k2');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Check for newly earned badges and trigger non-intrusive toast notification
  useEffect(() => {
    if (!profile.isOnboarded || isInitialLoading || initialLoadingError) return;

    const checkNewBadges = async () => {
      try {
        const chapters = await storyRepository.getChapters();
        const earnedIds: string[] = [];
        
        // Dynamically track night owl if they completed a chapter in dark mode after 10 PM
        const isNightTime = new Date().getHours() >= 22 || new Date().getHours() < 5;
        if (darkMode && isNightTime && progress.completedChapterIds.length > 0) {
          localStorage.setItem('campus_badge_night_owl', 'true');
        }

        BADGE_DEFINITIONS.forEach(badge => {
          if (badge.check(progress, chapters)) {
            earnedIds.push(badge.id);
          }
        });

        const savedSeen = localStorage.getItem('campus_seen_badges');
        let seenIds: string[] = [];
        if (savedSeen) {
          try {
            seenIds = JSON.parse(savedSeen);
          } catch (e) {
            seenIds = [];
          }
        }

        // Newly earned badges that haven't been shown in a toast yet
        const newEarnedIds = earnedIds.filter(id => !seenIds.includes(id));

        if (newEarnedIds.length > 0) {
          const firstNewId = newEarnedIds[0];
          const badgeDef = BADGE_DEFINITIONS.find(b => b.id === firstNewId);
          if (badgeDef) {
            setActiveToast({
              id: firstNewId,
              title: getBadgeTitle(badgeDef, t),
              desc: getBadgeDesc(badgeDef, t),
              iconName: badgeDef.iconName
            });
            playSound('chime', soundEnabled);
          }

          // Mark all current earned badges as seen
          const updatedSeenIds = Array.from(new Set([...seenIds, ...earnedIds]));
          localStorage.setItem('campus_seen_badges', JSON.stringify(updatedSeenIds));
        }
      } catch (err) {
        console.error('Failed to run badge check:', err);
      }
    };

    // Run badge check
    checkNewBadges();
  }, [progress, profile.isOnboarded, isInitialLoading, initialLoadingError, t, storyRepository, darkMode]);

  // Auto-dismiss toast notification after 4.5 seconds
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  if (isAdminRoute) {
    return <AdminPanelScreen onClose={() => { window.location.hash = ''; }} />;
  }

  // 1. Loading State on load/fetching progress
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-slate-200 dark:bg-slate-950 flex items-center justify-center p-0 md:p-4 select-none">
        <div className="w-full h-screen md:max-w-[400px] md:h-[820px] md:rounded-[40px] md:border-8 md:border-slate-850 md:shadow-2xl overflow-hidden bg-cream dark:bg-slate-950 relative flex flex-col border-slate-900 justify-center items-center p-8 text-center transition-colors">
          <div className="space-y-6">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-terracotta/10 border-t-terracotta animate-spin"></div>
              <Sparkles className="w-6 h-6 text-terracotta absolute animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-burgundy dark:text-rose-400">{t.appLoadingTitle}</h3>
              <p className="text-sm text-navy/60 dark:text-slate-400 max-w-[240px] mx-auto">
                {t.appLoadingSubtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Error State with Retry
  if (initialLoadingError) {
    return (
      <div className="min-h-screen bg-slate-200 dark:bg-slate-950 flex items-center justify-center p-0 md:p-4 select-none">
        <div className="w-full h-screen md:max-w-[400px] md:h-[820px] md:rounded-[40px] md:border-8 md:border-slate-850 md:shadow-2xl overflow-hidden bg-cream dark:bg-slate-950 relative flex flex-col border-slate-900 justify-center items-center p-8 text-center transition-colors">
          <div className="space-y-6 max-w-[280px] w-full">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto border border-red-500/20">
              <AlertTriangle className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-red-600 dark:text-red-400">{t.appConnectionError}</h3>
              <p className="text-xs text-navy/70 dark:text-slate-300 leading-relaxed">
                {initialLoadingError}
              </p>
            </div>
            <div className="space-y-2.5 w-full flex flex-col">
              <button
                onClick={handleRetryInitialLoad}
                className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-sans py-3 px-6 rounded-2xl shadow-md font-medium active:scale-[0.98] transition-all cursor-pointer text-sm"
              >
                {t.appTryAgain}
              </button>
              <button
                onClick={() => {
                  logout();
                  window.location.reload();
                }}
                className="w-full bg-navy/10 hover:bg-navy/15 dark:bg-slate-800 dark:hover:bg-slate-700 text-navy dark:text-slate-200 font-sans py-2.5 px-6 rounded-2xl transition-all cursor-pointer text-xs font-semibold"
              >
                {t.appSignOutAgain}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If student profile is not onboarded, gate the app behind the onboarding process
  if (!profile.isOnboarded) {
    return (
      <div className="min-h-screen bg-slate-200 dark:bg-slate-950 flex items-center justify-center p-0 md:p-4 select-none">
        <div className="w-full h-screen md:max-w-[400px] md:h-[820px] md:rounded-[40px] md:border-8 md:border-slate-850 md:shadow-2xl overflow-hidden bg-cream dark:bg-slate-950 relative flex flex-col border-slate-900 transition-colors">
          
          {/* Simulated Mobile Status Bar (Desktop preview decoration) */}
          <div className="hidden md:flex justify-between items-center px-6 pt-3 pb-2 bg-cream dark:bg-slate-950 text-navy dark:text-slate-300 font-mono text-[10px] font-semibold select-none z-10">
            <span>9:41 AM</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 rotate-90 scale-90" />
            </div>
          </div>
          
          <OnboardingScreen />
        </div>
      </div>
    );
  }

  // Render active screen tab
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'story':
        return <StoryScreen />;
      case 'map':
        return <MapScreen />;
      case 'progress':
        return <ProgressScreen />;
      case 'settings':
        return <SettingsScreen />;
    }
  };

  // Helper to resolve icon elements for badge toasts
  const getToastIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints': return <Flame className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Moon': return <Moon className="w-5 h-5" />;
      case 'Map': return <Map className="w-5 h-5" />;
      case 'CalendarCheck': return <Calendar className="w-5 h-5" />;
      case 'PenTool': return <PenTool className="w-5 h-5" />;
      case 'MessageSquare': return <Users className="w-5 h-5" />;
      case 'Flag': return <Compass className="w-5 h-5" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      case 'Heart': return <Heart className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t.navHome, icon: <Home className="w-5 h-5" /> },
    { id: 'story', label: t.navStory, icon: <BookOpen className="w-5 h-5" /> },
    { id: 'map', label: t.navMap, icon: <Map className="w-5 h-5" /> },
    { id: 'progress', label: t.navProgress, icon: <Award className="w-5 h-5" /> },
    { id: 'settings', label: t.navSettings, icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-slate-950 flex items-center justify-center p-0 md:p-4 transition-colors">
      {/* Viewport constrained Chassis representing high-fidelity phone simulator on desktop */}
      <div className="w-full h-screen md:max-w-[400px] md:h-[820px] md:rounded-[40px] md:border-8 md:border-slate-850 md:shadow-2xl overflow-hidden bg-cream dark:bg-slate-900 relative flex flex-col border-slate-900">
        
        {/* Simulated Mobile Status Bar (Desktop preview decoration) */}
        <div className="hidden md:flex justify-between items-center px-6 pt-3 pb-2 bg-white dark:bg-slate-900 text-navy dark:text-slate-300 font-mono text-[10px] font-semibold select-none z-10">
          <span>9:41 AM</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 rotate-90 scale-90" />
          </div>
        </div>

        {/* Dynamic Screen Viewport Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative bg-cream dark:bg-slate-950">
          {!isOnline && (
            <div className="bg-amber-500/15 border-b border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-semibold py-1.5 px-4 flex items-center justify-center gap-1.5 z-20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              {t.appOfflineMode}
            </div>
          )}
          <div className="flex-1 relative overflow-hidden bg-cream dark:bg-slate-950">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeInOut' }}
                style={{ willChange: 'opacity', transform: 'translateZ(0)' }}
                className="absolute inset-0 flex flex-col overflow-hidden bg-cream dark:bg-slate-950"
              >
                <ErrorBoundary key={activeTab}>
                  {renderScreen()}
                </ErrorBoundary>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Badge Unlocked Non-intrusive Toast Notification Overlay */}
          <AnimatePresence>
            {activeToast && (
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="absolute top-4 left-4 right-4 bg-white dark:bg-slate-900 border-2 border-terracotta rounded-2xl p-3.5 shadow-xl z-50 flex items-start gap-3"
                id="badge-toast-notification"
              >
                <div className="shrink-0">
                  <BadgeMedallion badgeId={activeToast.id} isEarned={true} size="sm" />
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <span className="text-[9.5px] font-mono font-bold text-terracotta uppercase tracking-wider block">
                    {t.badgeNotification || 'Achievement Unlocked!'}
                  </span>
                  <h4 className="text-sm font-serif font-bold text-burgundy dark:text-rose-400 truncate">
                    {activeToast.title}
                  </h4>
                  <p className="text-[10px] text-navy/60 dark:text-slate-300 leading-normal font-medium">
                    {activeToast.desc}
                  </p>
                </div>
                <button
                  onClick={() => setActiveToast(null)}
                  className="p-1 hover:bg-navy/5 dark:hover:bg-slate-800 rounded-lg text-navy/40 dark:text-slate-500 hover:text-navy dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subtle Sparkle Cue for Encountered Premium Pose */}
          <AnimatePresence>
            {showSubtleSparkleCue && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                onClick={() => dismissSubtleSparkleCue()}
                className="absolute top-3 right-4 bg-gradient-to-r from-amber-400 via-amber-500 to-terracotta text-slate-950 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow-md z-40 flex items-center gap-1.5 backdrop-blur-xs cursor-pointer border border-amber-200/60"
              >
                <Sparkles className="w-3 h-3 text-slate-950 animate-spin" style={{ animationDuration: '3s' }} />
                <span>Memory Saved ✨</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation Navigation Tabs */}
        <nav className="bg-white dark:bg-slate-900 border-t border-navy/5 px-4 py-2 flex justify-around items-center select-none z-10 shadow-lg shrink-0" id="bottom-navigation-bar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => {
                  playSound('click', soundEnabled);
                  setActiveTab(item.id);
                }}
                className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer relative active:scale-95"
              >
                <div
                  className={`p-1 rounded-full transition-transform ${
                    isActive
                      ? 'text-terracotta scale-110'
                      : 'text-navy/40 dark:text-slate-500 hover:text-navy dark:hover:text-slate-200 hover:scale-105'
                  }`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-[9px] font-sans font-bold tracking-tight transition-colors ${
                    isActive ? 'text-terracotta' : 'text-navy/40 dark:text-slate-500'
                  }`}
                >
                  {item.label}
                </span>
                
                {/* Micro Active indicator indicator dot */}
                {isActive && (
                  <span className="absolute bottom-0 w-1 h-1 bg-terracotta rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Graceful Stale Session Prompt Overlay Modal */}
        {sessionExpired && (
          <div className="absolute inset-0 bg-navy/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="bg-white dark:bg-slate-950 rounded-3xl p-6 text-center space-y-5 shadow-2xl border border-navy/10 dark:border-slate-800 max-w-[320px]">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto border border-amber-500/20">
                <LogOut className="w-7 h-7 stroke-[1.5]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif text-xl font-bold text-burgundy dark:text-rose-400">{t.appSessionExpired}</h3>
                <p className="text-xs text-navy/70 dark:text-slate-300 leading-relaxed">
                  {t.appSessionExpiredDesc}
                </p>
              </div>
              <button
                onClick={handleReauthenticate}
                className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-sans py-3 px-6 rounded-2xl shadow-md font-semibold transition-all cursor-pointer active:scale-[0.98]"
              >
                {t.appSignInAgain}
              </button>
            </div>
          </div>
        )}

        {/* First-Time Onboarding Tour Overlay */}
        <TourOverlay
          isOpen={isTourActive}
          step={tourStep}
          setStep={setTourStep}
          onClose={endTour}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <CampusProvider>
      <CampusApp />
    </CampusProvider>
  );
}
