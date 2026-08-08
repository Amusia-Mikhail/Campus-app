/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCampus, TabType } from '../context/CampusContext';
import { Chapter } from '../data/models';
import { getDynamicChapters } from '../data/repositories';
import { playSound } from '../utils/soundEffects';
import { LocationIllustration } from '../components/LocationIllustration';
import { BiscuitAlbumModal } from '../components/BiscuitAlbumModal';
import { ChapterListModal } from '../components/ChapterListModal';
import { getPoseImage } from '../components/BiscuitIllustration';
import campusMapDay from '../assets/images/campus_map_day.jpg';
import campusMapNight from '../assets/images/campus_map_night.jpg';
import { translations } from '../utils/translations';
import {
  Home,
  GraduationCap,
  BookOpen,
  Coffee,
  Briefcase,
  Lock,
  Compass,
  CheckCircle,
  HelpCircle,
  MapPin,
  Flame,
  Users,
  PenTool,
  FlaskConical,
  Trees,
  Sparkles,
  AlertTriangle,
  Heart,
  Check,
  X
} from 'lucide-react';

export interface Building {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  chapterId: string; // first chapter corresponding to this building
  x: number; // percentage layout
  y: number; // percentage layout
}

export const buildings: Building[] = [
  {
    id: 'dorm',
    name: 'Elm Hall',
    description: 'Your residence hall and roommate Jordan.',
    icon: <Home className="w-4 h-4" />,
    chapterId: '1',
    x: 18,
    y: 18
  },
  {
    id: 'lecture_hall',
    name: 'Lecture Hall',
    description: 'Main lecture theater for major-specific classes.',
    icon: <GraduationCap className="w-4 h-4" />,
    chapterId: '6',
    x: 50,
    y: 11
  },
  {
    id: 'seminar_room',
    name: 'Seminar Room',
    description: 'Seminar rooms for intense public policy debates.',
    icon: <Users className="w-4 h-4" />,
    chapterId: '11',
    x: 82,
    y: 18
  },
  {
    id: 'writing_center',
    name: 'Writing Center',
    description: 'Peer-tutoring and academic essay refinement.',
    icon: <PenTool className="w-4 h-4" />,
    chapterId: '16',
    x: 85,
    y: 50
  },
  {
    id: 'library',
    name: 'Campus Library',
    description: 'Quiet study booths, letters, and Biscuit the cat.',
    icon: <BookOpen className="w-4 h-4" />,
    chapterId: '21',
    x: 82,
    y: 82
  },
  {
    id: 'dining_hall',
    name: 'Dining Hall',
    description: 'Shared student dining space and meal chats.',
    icon: <Coffee className="w-4 h-4" />,
    chapterId: '26',
    x: 50,
    y: 50
  },
  {
    id: 'student_union',
    name: 'Student Union',
    description: 'Campus Club Fair and community hub.',
    icon: <Sparkles className="w-4 h-4" />,
    chapterId: '31',
    x: 18,
    y: 82
  },
  {
    id: 'science_lab',
    name: 'Science Lab',
    description: 'Chemistry lab workspace for collaborative research.',
    icon: <FlaskConical className="w-4 h-4" />,
    chapterId: '36',
    x: 15,
    y: 50
  },
  {
    id: 'career_center',
    name: 'Career Center',
    description: 'On-campus internships and career counseling.',
    icon: <Briefcase className="w-4 h-4" />,
    chapterId: '41',
    x: 50,
    y: 89
  },
  {
    id: 'quad',
    name: 'University Quad',
    description: 'Beautiful grassy lawns and golden autumn trees.',
    icon: <Trees className="w-4 h-4" />,
    chapterId: '46',
    x: 50,
    y: 30
  }
];

export const MapScreen: React.FC = () => {
  const {
    progress,
    setSelectedChapterId,
    setActiveTab,
    storyRepository,
    darkMode,
    profile,
    uiLanguage,
    soundEnabled,
    mainStoryCurrentChapter,
    setIsPracticeMode
  } = useCampus();

  const t = translations[uiLanguage] || translations.EN;

  const [chapters, setChapters] = useState<Chapter[]>(() => {
    return getDynamicChapters(profile.major, profile.dorm);
  });
  const [newlyUnlockedBuildingIds, setNewlyUnlockedBuildingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState<number>(0);
  const [isAlbumOpen, setIsAlbumOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedBuildingForDirectory, setSelectedBuildingForDirectory] = useState<Building | null>(null);
  const [activeSpecialPopover, setActiveSpecialPopover] = useState<{ building: Building; chapter: Chapter } | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    const loadChapters = async () => {
      try {
        const all = await storyRepository.getChapters();
        setChapters(all);
      } catch (e: any) {
        console.error('Failed to load map chapters:', e);
        if (e.message !== 'STALE_SESSION' && chapters.length === 0) {
          setError(t.mapFailedToLoad);
        }
      }
    };
    loadChapters();
  }, [storyRepository, retryTrigger, t.mapFailedToLoad]);

  // Helper to get building order/status
  const getBuildingUnlocked = (bId: string) => {
    const bIdx = buildings.findIndex(x => x.id === bId);
    const b = buildings[bIdx];
    const startChIdNum = b && b.chapterId ? Number(b.chapterId) : (bIdx * 5 + 1);

    const numericCompleted = (progress.completedChapterIds || [])
      .map(Number)
      .filter((n) => !isNaN(n));
    const highestChapter = numericCompleted.length > 0 ? Math.max(...numericCompleted) : 0;
    const currentChNum = Number(mainStoryCurrentChapter) || Number(progress.currentChapterId) || 1;
    const effectiveProgress = Math.max(currentChNum, highestChapter + 1);

    const related = chapters.filter((c) => c.locationId === bId);
    const hasCompletedChapter = related.some((c) => progress.completedChapterIds.includes(c.id));

    return startChIdNum <= effectiveProgress || hasCompletedChapter;
  };

  useEffect(() => {
    if (chapters.length === 0) return;

    const currentUnlockedIds = buildings
      .filter((b) => getBuildingUnlocked(b.id))
      .map((b) => b.id);

    const savedSeen = localStorage.getItem('campus_seen_unlocked_buildings');
    let seenIds: string[] = [];
    if (savedSeen) {
      try {
        seenIds = JSON.parse(savedSeen);
      } catch (e) {
        seenIds = [];
      }
    } else {
      // First time initialization
      if (progress.completedChapterIds.length === 0) {
        seenIds = currentUnlockedIds;
        localStorage.setItem('campus_seen_unlocked_buildings', JSON.stringify(seenIds));
      } else {
        // Active user with empty storage (e.g. clean browser, or we just want to animate the latest unlocked)
        const order = buildings.map(b => b.id);
        const sortedUnlocked = [...currentUnlockedIds].sort((a, b) => order.indexOf(a) - order.indexOf(b));
        if (sortedUnlocked.length > 0) {
          seenIds = sortedUnlocked.slice(0, -1);
          localStorage.setItem('campus_seen_unlocked_buildings', JSON.stringify(currentUnlockedIds));
        }
      }
    }

    const newlyUnlocked = currentUnlockedIds.filter((id) => !seenIds.includes(id));
    if (newlyUnlocked.length > 0) {
      setNewlyUnlockedBuildingIds(newlyUnlocked);
      // Persist the newly unlocked buildings as seen
      const updatedSeen = Array.from(new Set([...seenIds, ...currentUnlockedIds]));
      localStorage.setItem('campus_seen_unlocked_buildings', JSON.stringify(updatedSeen));
    }
  }, [chapters, mainStoryCurrentChapter, progress.currentChapterId, progress.completedChapterIds]);

  const getBuildingStatus = (b: Building) => {
    const unlocked = getBuildingUnlocked(b.id);

    const related = chapters.filter((c) => c.locationId === b.id);
    const coreChapters = related.filter((c) => !isNaN(Number(c.id)) && !c.id.includes('milestone'));
    const specialChapters = related.filter((c) => isNaN(Number(c.id)) || c.id.includes('milestone'));

    const coreCompleted = coreChapters.filter((c) => progress.completedChapterIds.includes(c.id));
    const specialCompleted = specialChapters.filter((c) => progress.completedChapterIds.includes(c.id));

    // isCurrent if user's mainStoryCurrentChapter belongs to this building
    const isCurrent = coreChapters.some((c) => c.id === mainStoryCurrentChapter);

    // isCompleted if all core chapters of this building are in completed list
    const isCompleted = coreChapters.length > 0 && coreCompleted.length === coreChapters.length;

    return {
      unlocked,
      isCurrent,
      isCompleted,
      coreCompletedCount: coreCompleted.length,
      coreTotalCount: coreChapters.length || 5,
      specialCompletedCount: specialCompleted.length,
      specialTotalCount: specialChapters.length
    };
  };

  const getLocalizedBuilding = (id: string) => {
    switch (id) {
      case 'dorm':
        return { name: profile.dorm || t.buildingDormName, description: t.buildingDormDesc };
      case 'lecture_hall':
        return { name: t.buildingLectureName, description: t.buildingLectureDesc };
      case 'seminar_room':
        return { name: t.buildingSeminarName, description: t.buildingSeminarDesc };
      case 'writing_center':
        return { name: t.buildingWritingName, description: t.buildingWritingDesc };
      case 'library':
        return { name: t.buildingLibraryName, description: t.buildingLibraryDesc };
      case 'dining_hall':
        return { name: t.buildingDiningName, description: t.buildingDiningDesc };
      case 'student_union':
        return { name: t.buildingUnionName, description: t.buildingUnionDesc };
      case 'science_lab':
        return { name: t.buildingLabName, description: t.buildingLabDesc };
      case 'career_center':
        return { name: t.buildingCareerName, description: t.buildingCareerDesc };
      case 'quad':
        return { name: t.buildingQuadName, description: t.buildingQuadDesc };
      default:
        return { name: id, description: '' };
    }
  };

  const handleBuildingClick = (b: Building, isEnterScene = false) => {
    const { unlocked } = getBuildingStatus(b);
    if (!unlocked) return;

    setIsPracticeMode(false);

    if (isEnterScene) {
      playSound('pageTurn', soundEnabled);
    } else {
      playSound('click', soundEnabled);
    }

    const related = chapters.filter((c) => c.locationId === b.id);
    const coreChapters = related.filter(c => !isNaN(Number(c.id)) && !c.id.includes('milestone'));
    const activeCore = coreChapters.find((c) => c.id === mainStoryCurrentChapter);

    if (activeCore) {
      setSelectedChapterId(activeCore.id);
      setActiveTab('story');
      return;
    }

    // Find first uncompleted core academic chapter
    const firstUncompletedCore = coreChapters.find(c => !progress.completedChapterIds.includes(c.id));
    if (firstUncompletedCore) {
      setSelectedChapterId(firstUncompletedCore.id);
      setActiveTab('story');
      return;
    }

    // Check for special milestone talk in this location
    const firstUncompletedSpecial = related.find(c => (isNaN(Number(c.id)) || c.id.includes('milestone')) && !progress.completedChapterIds.includes(c.id));
    if (firstUncompletedSpecial) {
      const requiredPts = Number(firstUncompletedSpecial.id.replace('jordan_milestone_', '')) || 0;
      const currentPts = progress.friendshipPoints['Jordan'] || 0;
      if (currentPts < requiredPts) {
        setToastMessage(`Requires ${requiredPts} Friendship Points with Jordan (Current: ${currentPts})`);
        return;
      }
      setSelectedChapterId(firstUncompletedSpecial.id);
      setActiveTab('story');
      return;
    }

    // Fallback to last core or first available chapter
    const fallback = coreChapters[coreChapters.length - 1] || related[0];
    if (fallback) {
      setSelectedChapterId(fallback.id);
      setActiveTab('story');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-cream dark:bg-slate-950 text-navy dark:text-slate-100 font-sans" id="map-screen-loading">
        {/* Map Header Shimmer */}
        <div className="px-5 py-4 border-b border-navy/5 bg-white dark:bg-slate-900 flex justify-between items-center animate-pulse">
          <div className="space-y-1.5">
            <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
            <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          </div>
          <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
        </div>
        {/* Large Canvas Loading Shimmer */}
        <div className="flex-1 flex items-center justify-center p-8 bg-cream dark:bg-slate-950">
          <div className="w-full h-full max-h-[500px] border border-navy/5 dark:border-slate-855 rounded-3xl bg-white dark:bg-slate-900 flex flex-col justify-center items-center p-6 space-y-4 animate-pulse">
            <Compass className="w-12 h-12 text-slate-200 dark:text-slate-800 animate-spin" />
            <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-5 bg-cream dark:bg-slate-950 text-navy dark:text-slate-100" id="map-screen-error">
        <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="space-y-1.5 max-w-[280px]">
          <h3 className="font-serif text-lg font-bold text-burgundy dark:text-rose-400">{t.mapLoadingFailed}</h3>
          <p className="text-xs text-navy/60 dark:text-slate-300 leading-relaxed">
            {error}
          </p>
        </div>
        <button
          onClick={() => setRetryTrigger((prev) => prev + 1)}
          className="bg-terracotta hover:bg-terracotta-dark text-white font-sans text-xs font-semibold py-2.5 px-6 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
        >
          {t.mapTryAgain}
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-cream dark:bg-slate-950 text-navy dark:text-slate-100 overflow-hidden font-sans" id="map-screen">
      {/* Map Header */}
      <div
        className="px-5 pb-4 border-b border-navy/5 bg-white dark:bg-slate-900 flex justify-between items-center"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
        id="map-header"
      >
        <div>
          <span className="text-[10px] font-mono font-bold text-terracotta uppercase tracking-wider block">{t.mapTitle}</span>
          <h2 className="text-xl font-serif font-bold text-burgundy dark:text-rose-400">{t.mapSubtitle}</h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-navy/50 dark:text-slate-400">
          <Compass className="w-4 h-4 text-terracotta animate-spin-slow" />
          <span>{t.mapSemester}</span>
        </div>
      </div>

      {/* Styled Top-down Illustrated Map */}
      <div className="flex-1 relative bg-[#eef3ea] dark:bg-slate-950 p-4 border border-navy/5 overflow-hidden" id="map-canvas-container">
        {/* Full illustrated campus grounds background scene */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none" id="illustrated-map-background">
          <img
            src={darkMode ? campusMapNight : campusMapDay}
            alt="Campus Grounds Map"
            className="w-full h-full object-cover transition-opacity duration-1000 opacity-95 dark:opacity-90"
            referrerPolicy="no-referrer"
          />
          {/* Subtle vignette shade for vector pathways and button readability */}
          <div className="absolute inset-0 bg-cream/10 dark:from-slate-950/20 dark:to-slate-950/40" />
        </div>

        {/* Background Grid Lines & Pathways (Drawn as vectors atop background) */}
        <svg className="absolute inset-0 w-full h-full text-[#c1d1b5] dark:text-slate-800 stroke-current fill-none z-0 opacity-40 mix-blend-multiply dark:mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
          {/* Main Ring Walkway */}
          <ellipse cx="50%" cy="52%" rx="36%" ry="32%" strokeWidth="18" strokeLinecap="round" className="opacity-80" />
          {/* Cross Walkways */}
          <line x1="18%" y1="20%" x2="82%" y2="80%" strokeWidth="10" className="opacity-70" />
          <line x1="82%" y1="20%" x2="18%" y2="80%" strokeWidth="10" className="opacity-70" />
          <line x1="50%" y1="18%" x2="50%" y2="82%" strokeWidth="8" className="opacity-70" />
          
          {/* Accent Landscape Details */}
          <circle cx="35%" cy="32%" r="20" fill="#cbdcc0" className="opacity-60" stroke="none" />
          <circle cx="65%" cy="67%" r="28" fill="#cbdcc0" className="opacity-50" stroke="none" />
          <circle cx="60%" cy="70%" r="4" fill="#5c7f67" className="opacity-40" stroke="none" />
          <circle cx="68%" cy="64%" r="5" fill="#5c7f67" className="opacity-40" stroke="none" />
        </svg>

        {/* Map Elements (Buildings) */}
        {buildings.map((b) => {
          const { unlocked, isCurrent, isCompleted, coreCompletedCount, coreTotalCount, specialCompletedCount, specialTotalCount } = getBuildingStatus(b);
          const loc = getLocalizedBuilding(b.id);
          const buildingName = loc.name;
          
          return (
            <motion.button
              key={b.id}
              onClick={() => handleBuildingClick(b)}
              whileHover={unlocked ? { scale: 1.05 } : {}}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10 cursor-pointer"
              style={{ left: `${b.x}%`, top: `${b.y}%` }}
              id={`building-${b.id}`}
            >
              {/* Glowing Pulse for Current objective */}
              {isCurrent && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 z-20">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-terracotta"></span>
                </span>
              )}

              {/* Illustrated Scene Thumbnail */}
              <div
                className={`w-28 h-20 md:w-36 md:h-24 rounded-[18px] overflow-hidden relative shadow-lg transition-all duration-300 border-2 ${
                  isCurrent
                    ? 'border-terracotta scale-110 shadow-terracotta/40 ring-4 ring-terracotta/15'
                    : isCompleted
                    ? 'border-sage shadow-sage/15'
                    : unlocked
                    ? 'border-navy/20 dark:border-slate-800'
                    : 'border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900'
                }`}
              >
                {newlyUnlockedBuildingIds.includes(b.id) ? (
                  <div className="absolute inset-0 w-full h-full">
                    {/* Background layer: grayscale */}
                    <LocationIllustration locationId={b.id} dimmed={true} className="w-full h-full object-cover" />
                    {/* Foreground layer: full color with clip-path wipe animation from center */}
                    <motion.div
                      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
                      transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.5 }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <LocationIllustration locationId={b.id} dimmed={false} className="w-full h-full object-cover" />
                    </motion.div>
                  </div>
                ) : (
                  <LocationIllustration locationId={b.id} dimmed={!unlocked} className="w-full h-full object-cover" />
                )}
                
                {/* Padlock Badge in Corner (Visible on locked tiles, but NO dim dark overlay) */}
                {!unlocked && (
                  <div className="absolute top-1.5 right-1.5 z-20">
                    <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-900 text-burgundy dark:text-rose-400 flex items-center justify-center shadow-md border border-navy/10 dark:border-slate-800">
                      <Lock className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Progress Flag */}
              <div className="mt-1 flex flex-col items-center">
                <div
                  className={`px-2 py-0.5 rounded-md shadow-sm border text-[9px] font-bold tracking-tight text-center whitespace-nowrap transition-colors ${
                    isCurrent
                      ? 'bg-burgundy text-white border-burgundy'
                      : isCompleted
                      ? 'bg-sage-light text-sage border-sage/20'
                      : unlocked
                      ? 'bg-white dark:bg-slate-900 text-navy dark:text-slate-200 border-navy/10 dark:border-slate-800'
                      : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-600 dark:border-slate-700'
                  }`}
                >
                  {buildingName}
                </div>
                {/* Compact & Floating Location Counter Badge Row */}
                {unlocked && (() => {
                  const { coreCompletedCount, coreTotalCount, specialCompletedCount, specialTotalCount } = getBuildingStatus(b);
                  const isCoreDone = coreCompletedCount === coreTotalCount;

                  return (
                    <div className="flex items-center justify-center gap-1 mt-0.5 pointer-events-auto">
                      {/* Core Counter Pill */}
                      <span className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-semibold shadow-sm flex items-center gap-1 whitespace-nowrap">
                        {isCoreDone && <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />}
                        {coreCompletedCount}/{coreTotalCount} Core
                      </span>

                      {/* Special Quest Pill */}
                      {specialTotalCount > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playSound('click', soundEnabled);
                            const specialCh = chapters.find(
                              (c) => c.locationId === b.id && (isNaN(Number(c.id)) || c.id.includes('milestone'))
                            );
                            if (specialCh) {
                              setActiveSpecialPopover({ building: b, chapter: specialCh });
                            }
                          }}
                          className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-semibold shadow-sm flex items-center gap-1 cursor-pointer hover:bg-rose-700 active:scale-95 transition-all whitespace-nowrap"
                          title="Special Dialogue / Bonding Quest"
                        >
                          <Heart className="w-2.5 h-2.5 fill-white text-white shrink-0" />
                          <span>{specialCompletedCount}/{specialTotalCount}</span>
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            </motion.button>
          );
        })}

        {/* Biscuit the Cat on the map (lives near the Library) - Tappable Album Badge */}
        <motion.button
          type="button"
          onClick={() => {
            playSound('click');
            setIsAlbumOpen(true);
          }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.92 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="absolute z-20 pointer-events-auto cursor-pointer group flex flex-col items-center focus:outline-none transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: '72%', top: '86%' }}
          id="map-biscuit-cat"
          title={t.biscuitBadgeHint || "Tap Biscuit to view album"}
        >
          <div className="relative">
            {/* Soft pulsing halo ring to draw user focus */}
            <span className="absolute -inset-1.5 rounded-full bg-amber-400/40 dark:bg-amber-400/25 animate-ping opacity-75 pointer-events-none" />
            <span className="absolute -inset-1 rounded-full bg-amber-300/30 dark:bg-amber-500/20 blur-xs pointer-events-none" />

            {/* Cat avatar container */}
            <div className="relative w-8.5 h-8.5 rounded-full bg-amber-100 dark:bg-slate-800 border-2 border-amber-400 dark:border-amber-400 shadow-md flex items-center justify-center p-0.5 group-hover:border-amber-500 group-hover:shadow-amber-400/40 transition-all overflow-hidden">
              <img
                src={getPoseImage('alert')}
                alt="Biscuit"
                className="w-full h-full object-cover rounded-full select-none pointer-events-none"
              />
            </div>
          </div>

          <div className="flex flex-col items-center mt-1">
            <span className="text-[8.5px] font-mono font-bold bg-amber-100/95 dark:bg-slate-800/95 text-amber-950 dark:text-amber-200 px-2 py-0.5 rounded-full shadow-xs border border-amber-300/80 dark:border-amber-500/50 uppercase tracking-tight flex items-center gap-1 group-hover:bg-amber-200 dark:group-hover:bg-slate-750 transition-colors">
              <Sparkles className="w-2.5 h-2.5 text-amber-500 animate-spin" />
              Biscuit
            </span>
          </div>
        </motion.button>
      </div>

      {/* Chapter Information Banner at the bottom */}
      <div className="bg-white dark:bg-slate-900 border-t border-navy/5 dark:border-slate-800 p-4 relative" id="map-bottom-drawer">
        {/* Toast Notification for Friendship Gates */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50 bg-burgundy text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl border border-rose-400/40 flex items-center gap-2 whitespace-nowrap"
            >
              <Heart className="w-4 h-4 fill-rose-400 text-rose-400 shrink-0 animate-pulse" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {(() => {
          const activeBuilding = buildings.find((b) => getBuildingStatus(b).isCurrent);
          if (activeBuilding) {
            const { coreCompletedCount, coreTotalCount, specialCompletedCount, specialTotalCount } = getBuildingStatus(activeBuilding);
            const loc = getLocalizedBuilding(activeBuilding.id);
            const displayCurrent = Math.min(coreCompletedCount + 1, coreTotalCount);
            return (
              <div className="flex justify-between items-center gap-3">
                <div className="space-y-0.5 flex-1">
                  <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-terracotta">{t.mapCurrentObjective}</span>
                  <h4 className="text-sm font-serif font-bold text-burgundy dark:text-rose-400">
                    {loc.name} ({displayCurrent}/{coreTotalCount} Core{specialTotalCount > 0 ? ` • ${specialCompletedCount}/${specialTotalCount} Special` : ''})
                  </h4>
                  <p className="text-xs text-navy/60 dark:text-slate-400 leading-tight">{loc.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      playSound('click', soundEnabled);
                      setSelectedBuildingForDirectory(activeBuilding);
                    }}
                    className="p-2.5 rounded-xl border border-navy/10 dark:border-slate-800 text-navy/70 dark:text-slate-300 hover:bg-navy/5 dark:hover:bg-slate-800 transition-all cursor-pointer text-xs font-bold flex items-center gap-1.5"
                    title="View Chapters & Special Talks for this location"
                  >
                    <BookOpen className="w-4 h-4 text-terracotta" />
                    <span className="hidden sm:inline">Directory</span>
                  </button>
                  <button
                    id="enter-building-btn"
                    onClick={() => handleBuildingClick(activeBuilding, true)}
                    className="bg-terracotta hover:bg-terracotta-dark text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all shrink-0 cursor-pointer active:scale-95"
                  >
                    {t.mapEnterScene}
                  </button>
                </div>
              </div>
            );
          } else {
            return (
              <div className="text-center text-xs text-navy/50 dark:text-slate-400 font-medium py-2">
                {t.mapAllCompleted}
              </div>
            );
          }
        })()}
      </div>

      {/* Biscuit's Album Modal */}
      <BiscuitAlbumModal
        isOpen={isAlbumOpen}
        onClose={() => setIsAlbumOpen(false)}
      />

      {/* Chapter & Special Talk Directory Modal */}
      <ChapterListModal
        isOpen={!!selectedBuildingForDirectory}
        onClose={() => setSelectedBuildingForDirectory(null)}
        title={`${selectedBuildingForDirectory ? getLocalizedBuilding(selectedBuildingForDirectory.id).name : ''} Directory`}
        chapters={chapters.filter((c) => selectedBuildingForDirectory && c.locationId === selectedBuildingForDirectory.id)}
        completedChapterIds={progress.completedChapterIds}
        currentChapterId={mainStoryCurrentChapter}
        jordanPoints={progress.friendshipPoints['Jordan'] || 0}
        onSelectChapter={(chapterId) => {
          const ch = chapters.find(c => c.id === chapterId);
          if (ch && (isNaN(Number(ch.id)) || ch.id.includes('milestone'))) {
            const reqPts = Number(ch.id.replace('jordan_milestone_', '')) || 0;
            const currentPts = progress.friendshipPoints['Jordan'] || 0;
            if (currentPts < reqPts) {
              setToastMessage(`Requires ${reqPts} Friendship Points with Jordan (Current: ${currentPts})`);
              return;
            }
          }
          setSelectedChapterId(chapterId);
          setActiveTab('story');
        }}
        onLockedClick={(reqPts, currPts) => {
          setToastMessage((t.jordanRequiresPts || 'Requires {count} Friendship Points').replace('{count}', String(reqPts)));
        }}
      />
      {/* Interactive Special Quest Popover Card */}
      <AnimatePresence>
        {activeSpecialPopover && (() => {
          const { building, chapter } = activeSpecialPopover;
          const requiredPts = Number(chapter.id.replace('jordan_milestone_', '')) || 0;
          const currentPts = progress.friendshipPoints['Jordan'] || 0;
          const isUnlocked = currentPts >= requiredPts;
          const isCompleted = progress.completedChapterIds.includes(chapter.id);
          const progressPercent = Math.min(100, Math.round((currentPts / (requiredPts || 1)) * 100));
          const pointsNeeded = Math.max(0, requiredPts - currentPts);
          const localizedB = getLocalizedBuilding(building.id);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                className="bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl p-5 space-y-4 relative"
              >
                {/* Close button */}
                <button
                  onClick={() => setActiveSpecialPopover(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full text-navy/40 dark:text-slate-500 hover:bg-navy/5 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-2.5 pr-8">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-500 flex items-center justify-center font-bold shrink-0 border border-rose-200 dark:border-rose-900 shadow-xs">
                    <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                      ♥️ {t.specialJordanDialogueHeader || 'SPECIAL JORDAN DIALOGUE'} • {localizedB.name}
                    </span>
                    <h3 className="text-base font-serif font-bold text-burgundy dark:text-rose-300">
                      {chapter.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-navy/70 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-navy/5 dark:border-slate-800">
                  {chapter.intro || 'Special bonding conversation with your roommate Jordan.'}
                </p>

                {/* Friendship Requirement Box */}
                <div className="bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 p-3.5 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <span className="text-navy/70 dark:text-slate-300">{t.jordanRequirementLabel || 'Requirement'}</span>
                    <span className="text-rose-600 dark:text-rose-400">
                      {requiredPts > 0 ? (t.jordanRequiresPts || 'Requires {count} Friendship Points').replace('{count}', String(requiredPts)) : (t.jordanNoRequirement || 'No Requirement')}
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-rose-200/50 dark:bg-rose-900/40 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-rose-500 to-terracotta h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold text-navy/60 dark:text-slate-400">
                      <span>{currentPts} / {requiredPts} Pts</span>
                      <span>{progressPercent}%</span>
                    </div>
                  </div>

                  {/* Status Tag */}
                  <div className="pt-1 flex items-center justify-center">
                    {isCompleted ? (
                      <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> ✅ {t.jordanUnlockedCompleted || 'Unlocked (Completed)'}
                      </span>
                    ) : isUnlocked ? (
                      <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5" /> ✅ {t.jordanUnlockedReady || 'Unlocked! Ready to start'}
                      </span>
                    ) : (
                      <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" /> 🔒 {(t.jordanLockedNeedPts || 'Locked (Need +{pts} pts from lessons)').replace('{pts}', String(pointsNeeded))}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="pt-1 flex gap-2">
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        playSound('click', soundEnabled);
                        setSelectedChapterId(chapter.id);
                        setActiveTab('story');
                        setActiveSpecialPopover(null);
                      }}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-serif font-bold text-xs py-3 px-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Heart className="w-4 h-4 fill-white text-white" />
                      <span>{isCompleted ? (t.jordanReplaySpecialTalk || 'Replay Special Talk') : (t.jordanStartConversation || 'Start Conversation')}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveSpecialPopover(null)}
                      className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-navy dark:text-slate-200 font-bold text-xs py-2.5 px-4 rounded-2xl transition-all cursor-pointer"
                    >
                      {t.jordanGotIt || 'Got It'}
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};
