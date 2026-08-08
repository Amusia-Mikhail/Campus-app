/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCampus, TabType } from '../context/CampusContext';
import { Chapter, SkillType } from '../data/models';
import { getDynamicChapters } from '../data/repositories';
import { buildings } from './MapScreen';
import { translations } from '../utils/translations';
import { calculateActiveStreak } from '../utils/streak';
import { getTodayCoffeeDialogue } from '../data/dailyCoffeeDialogues';
import { MorningCoffeeModal } from '../components/MorningCoffeeModal';
import { AnimatedCoffeeMug } from '../components/AnimatedCoffeeMug';
import { playSound } from '../utils/soundEffects';
import {
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  Play,
  Award,
  GraduationCap,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Target,
  Heart,
  MessageSquare,
  Calendar,
  Coffee,
  Flame,
  CheckCircle2,
  BookMarked,
  X,
  Lock
} from 'lucide-react';
import { VocabularyNotebookModal } from '../components/VocabularyNotebookModal';
import { AdBannerSlot } from '../components/AdBannerSlot';
import { BadgeMedallion } from '../components/BadgeMedallion';
import { DORM_DECOR_ITEMS, DECOR_CATEGORIES, DecorCategory } from '../data/dormDecor';

// Eager module-level preloading for dorm background and decor overlays
if (typeof window !== 'undefined') {
  const bgImg = new Image();
  bgImg.src = '/images/dorm_bg.jpg';
  DORM_DECOR_ITEMS.forEach((item) => {
    const img = new Image();
    img.src = item.image;
  });
}

const JORDAN_MILESTONES = [
  {
    threshold: 10,
    chapterId: 'jordan_milestone_10',
    title: "Jordan's Campus Secret",
    description: "Jordan wants to show you a hidden study spot near Elm Hall and share a story about Biscuit!"
  },
  {
    threshold: 25,
    chapterId: 'jordan_milestone_25',
    title: "Coffee & Deep Talks",
    description: "Jordan invited you to grab coffee at the Student Union and chat about campus life."
  },
  {
    threshold: 50,
    chapterId: 'jordan_milestone_50',
    title: "A Special Campus Gift",
    description: "Jordan has a special handcrafted bookmark gift for you outside the library!"
  },
  {
    threshold: 75,
    chapterId: 'jordan_milestone_75',
    title: "Late Night Cramming",
    description: "Jordan is feeling stressed before a big midterm in the dorm. Offer some study support!"
  },
  {
    threshold: 100,
    chapterId: 'jordan_milestone_100',
    title: "Family Call",
    description: "Jordan overheard you chatting with family and wants to share a personal moment about home."
  },
  {
    threshold: 130,
    chapterId: 'jordan_milestone_130',
    title: "Roommate Ritual",
    description: "Jordan has an exciting idea to start a weekly hot chocolate & movie night tradition!"
  },
  {
    threshold: 160,
    chapterId: 'jordan_milestone_160',
    title: "Standing Up for a Friend",
    description: "Jordan wants to thank you for supporting them during a group project dispute."
  },
  {
    threshold: 200,
    chapterId: 'jordan_milestone_200',
    title: "End of Semester",
    description: "Jordan meets you under the Quad trees to look back on an amazing semester together!"
  }
];

export const HomeScreen: React.FC = () => {
  const {
    profile,
    progress,
    setActiveTab,
    setSelectedChapterId,
    storyRepository,
    resetProgress,
    uiLanguage,
    soundEnabled,
    completeCoffeeTalk,
    mainStoryCurrentChapter,
    setIsPracticeMode,
    isAdmin,
    equippedDecorIds,
    toggleEquipDecor,
    isDecorUnlocked,
    awardRugBadge,
    autoOpenDecorId,
    setAutoOpenDecorId
  } = useCampus();

  const t = translations[uiLanguage] || translations.EN;

  const [isVocabModalOpen, setIsVocabModalOpen] = useState(false);
  const [isRugModalOpen, setIsRugModalOpen] = useState(false);
  const [isDecorateModalOpen, setIsDecorateModalOpen] = useState(false);
  const [selectedDecorCategory, setSelectedDecorCategory] = useState<'all' | DecorCategory>('all');
  const [isRoomLoading, setIsRoomLoading] = useState(true);

  useEffect(() => {
    if (autoOpenDecorId) {
      setIsDecorateModalOpen(true);
      const item = DORM_DECOR_ITEMS.find((d) => d.id === autoOpenDecorId);
      if (item) {
        setSelectedDecorCategory(item.category);
      }
      setAutoOpenDecorId(null);
    }
  }, [autoOpenDecorId, setAutoOpenDecorId]);

  const [rugTapCount, setRugTapCount] = useState<number>(0);
  const rugTapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleRugClick = () => {
    playSound('click', soundEnabled);
    setRugTapCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        if (rugTapTimerRef.current) clearTimeout(rugTapTimerRef.current);
        awardRugBadge();
        playSound('chime', soundEnabled);
        setIsRugModalOpen(true);
        return 0;
      }
      if (rugTapTimerRef.current) clearTimeout(rugTapTimerRef.current);
      rugTapTimerRef.current = setTimeout(() => {
        setRugTapCount(0);
      }, 1200);
      return newCount;
    });
  };

  const targetStoryChapterId = mainStoryCurrentChapter || progress.currentChapterId || '1';

  const [chapters, setChapters] = useState<Chapter[]>(() => {
    return getDynamicChapters(profile.major, profile.dorm);
  });
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(() => {
    const initial = getDynamicChapters(profile.major, profile.dorm);
    return initial.find((c) => c.id === targetStoryChapterId) || null;
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState<number>(0);

  // Morning Coffee with Jordan State
  const [isCoffeeModalOpen, setIsCoffeeModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [lockedTooltip, setLockedTooltip] = useState<{
    id: string;
    text: string;
    position: { top: string; left: string };
  } | null>(null);

  useEffect(() => {
    if (lockedTooltip) {
      const timer = setTimeout(() => {
        setLockedTooltip(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [lockedTooltip]);

  const handleLockedSilhouetteClick = (item: (typeof DORM_DECOR_ITEMS)[0]) => {
    playSound('click', soundEnabled);

    const buildingNames: Record<string, string> = {
      dorm: profile.dorm || t.buildingDormName || 'Dorm Hall',
      lecture_hall: t.buildingLectureName || 'Lecture Hall',
      seminar_room: t.buildingSeminarName || 'Seminar Room',
      writing_center: t.buildingWritingName || 'Writing Center',
      library: t.buildingLibraryName || 'Campus Library',
      dining_hall: t.buildingDiningName || 'Dining Hall',
      student_union: t.buildingUnionName || 'Student Union',
      science_lab: t.buildingLabName || 'Science Lab',
      career_center: t.buildingCareerName || 'Career Center',
      quad: t.buildingQuadName || 'University Quad',
    };

    let locName = 'Required Location';
    if (item.requiredLocationId && buildingNames[item.requiredLocationId]) {
      locName = buildingNames[item.requiredLocationId];
    } else if (item.requiredLocationsCompleted) {
      const mapByNum: Record<number, string> = {
        1: profile.dorm || t.buildingDormName || 'Dorm Hall',
        2: t.buildingLectureName || 'Lecture Hall',
        3: t.buildingSeminarName || 'Seminar Room',
        4: t.buildingWritingName || 'Writing Center',
        5: t.buildingLibraryName || 'Campus Library',
        6: t.buildingDiningName || 'Dining Hall',
        7: t.buildingUnionName || 'Student Union',
        8: t.buildingLabName || 'Science Lab',
        9: t.buildingCareerName || 'Career Center',
        10: t.buildingQuadName || 'University Quad',
      };
      if (mapByNum[item.requiredLocationsCompleted]) {
        locName = mapByNum[item.requiredLocationsCompleted];
      }
    }

    const tooltipTemplate = t.dormRoomLockedTooltip || 'Complete "{location}"';
    setLockedTooltip({
      id: item.id,
      text: tooltipTemplate.replace('{location}', locName),
      position: {
        top: item.position.top,
        left: item.position.left,
      },
    });
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const getTodayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const todayDate = getTodayISO();
  const lastCoffeeDate = progress.lastCoffeeDate || localStorage.getItem('campus_last_coffee_date') || '';
  const coffeeStreak = progress.coffeeStreak ?? Number(localStorage.getItem('campus_coffee_streak') || 0);
  const isCoffeePending = lastCoffeeDate !== todayDate;
  const todayDialogue = getTodayCoffeeDialogue(todayDate);

  const [isMugTapped, setIsMugTapped] = useState<boolean>(false);

  const handleMugTap = () => {
    if (isMugTapped) return;
    setIsMugTapped(true);
    playSound('chime', soundEnabled);

    setTimeout(() => {
      setIsMugTapped(false);
      setIsCoffeeModalOpen(true);
    }, 400);
  };

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const all = await storyRepository.getChapters();
        setChapters(all);
        const active = all.find((c) => c.id === targetStoryChapterId);
        setCurrentChapter(active || null);
      } catch (e: any) {
        console.error('Failed to fetch home chapters:', e);
        if (e.message !== 'STALE_SESSION' && chapters.length === 0) {
          setError('Failed to sync academic catalogs. Check your network connection.');
        }
      }
    };
    fetchChapters();
  }, [targetStoryChapterId, storyRepository, retryTrigger]);

  const handleContinueStory = () => {
    setIsPracticeMode(false);
    const targetId = currentChapter?.id || targetStoryChapterId;
    setSelectedChapterId(targetId);
    setActiveTab('story');
  };

  const getLocationName = (locationId: string) => {
    switch (locationId) {
      case 'dorm':
        return profile.dorm || t.buildingDormName;
      case 'lecture_hall':
        return t.buildingLectureName;
      case 'seminar_room':
        return t.buildingSeminarName;
      case 'writing_center':
        return t.buildingWritingName;
      case 'library':
        return t.buildingLibraryName;
      case 'dining_hall':
        return t.buildingDiningName;
      case 'student_union':
        return t.buildingUnionName;
      case 'science_lab':
        return t.buildingLabName;
      case 'career_center':
        return t.buildingCareerName;
      case 'quad':
        return t.buildingQuadName;
      default:
        return locationId.replace('_', ' ');
    }
  };

  const getSkillNameTranslated = (s: SkillType) => {
    switch (s) {
      case SkillType.LISTENING: return t.listening;
      case SkillType.SPEAKING: return t.speaking;
      case SkillType.WRITING: return t.writing;
      case SkillType.READING: return t.reading;
    }
  };

  const getFocusAreaMessage = (): { skill: SkillType; message: string; matches: boolean; score: number } | null => {
    if (chapters.length === 0) return null;

    const skillScores = progress.skills;
    const skills = [SkillType.LISTENING, SkillType.SPEAKING, SkillType.WRITING, SkillType.READING];
    
    // Find the skill with the lowest score
    const sorted = [...skills].map(s => ({ skill: s, score: skillScores[s] || 0 }))
                             .sort((a, b) => a.score - b.score);
    const weakest = sorted[0] || { skill: SkillType.LISTENING, score: 0 };
    const weakSkill = weakest.skill;
    const translatedSkill = getSkillNameTranslated(weakSkill);

    if (!currentChapter) {
      const template = t.focusAreaWeakestOnly || "Your {skill} score is your weakest area ({score}). Great job completing the semester! Keep practicing in Practice Mode to perfect your skills.";
      const message = template
        .replace('{skill}', translatedSkill || '')
        .replace('{score}', Math.round(weakest.score).toString());

      return {
        skill: weakSkill,
        score: weakest.score,
        message,
        matches: false
      };
    }

    const nextChTitle = currentChapter.title;
    const nextChLocation = getLocationName(currentChapter.locationId);
    
    // Check if next chapter's skill matches the weakest skill
    const matches = currentChapter.skill === weakSkill;

    if (matches) {
      // Determine task name based on chapter type
      let taskName = t.taskLecture || 'Lecture';
      if (currentChapter.type === 'DISCUSSION') taskName = t.taskDiscussion || 'Discussion';
      else if (currentChapter.type === 'LECTURE') taskName = t.taskLecture || 'Lecture';
      else if (currentChapter.type === 'INDEPENDENT_WORK') taskName = t.taskWriting || 'Writing';
      else if (currentChapter.type === 'LIBRARY') taskName = t.taskReading || 'Reading';
      else if (currentChapter.type === 'CAMPUS_LIFE') taskName = t.taskSpeaking || 'Speaking';
      else taskName = getSkillNameTranslated(currentChapter.skill as SkillType) || currentChapter.skill;

      const template = t.focusAreaWeakestMatches || 'Your {skill} score is your weakest area. Good news: your next chapter, "{title}" at {location}, is a {task} task.';
      const message = template
        .replace('{skill}', translatedSkill || '')
        .replace('{title}', nextChTitle)
        .replace('{location}', nextChLocation)
        .replace('{task}', taskName);

      return {
        skill: weakSkill,
        score: weakest.score,
        message,
        matches: true
      };
    } else {
      // Non-matching phrase
      let comingUpType = t.taskLecture || 'Lecture';
      if (weakSkill === SkillType.LISTENING) comingUpType = t.comingUpLectureHall || 'Lecture Hall';
      else if (weakSkill === SkillType.SPEAKING) comingUpType = t.comingUpSeminarRoom || 'Seminar Room';
      else if (weakSkill === SkillType.WRITING) comingUpType = t.comingUpIndependentWork || 'Independent Work';
      else if (weakSkill === SkillType.READING) comingUpType = t.comingUpLibrary || 'Library';

      const template = t.focusAreaWeakestMismatches || 'Your {skill} score is your weakest area. Keep it in mind — a {comingUpType} chapter is coming up soon.';
      const message = template
        .replace('{skill}', translatedSkill || '')
        .replace('{comingUpType}', comingUpType);

      return {
        skill: weakSkill,
        score: weakest.score,
        message,
        matches: false
      };
    }
  };

  const focusArea = getFocusAreaMessage();

  const getSkillIcon = (skill: SkillType) => {
    switch (skill) {
      case SkillType.LISTENING:
        return <Headphones className="w-5 h-5 text-terracotta" />;
      case SkillType.SPEAKING:
        return <Mic className="w-5 h-5 text-terracotta" />;
      case SkillType.WRITING:
        return <PenTool className="w-5 h-5 text-terracotta" />;
      case SkillType.READING:
        return <BookOpen className="w-5 h-5 text-terracotta" />;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 bg-cream dark:bg-slate-950 text-navy dark:text-slate-100 font-sans" id="home-screen-loading">
        {/* Shimmer Header */}
        <div className="flex justify-between items-start animate-pulse">
          <div className="space-y-2 flex-1">
            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-850 rounded-md"></div>
            <div className="h-8 w-44 bg-slate-200 dark:bg-slate-850 rounded-md"></div>
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-850 rounded-md"></div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-880"></div>
        </div>

        {/* Shimmer Hero Card */}
        <div className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-3xl p-5 space-y-4 animate-pulse">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-850 rounded-md"></div>
          <div className="space-y-2">
            <div className="h-6 w-full bg-slate-200 dark:bg-slate-850 rounded-md"></div>
            <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-850 rounded-md"></div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-850 rounded-md"></div>
            <div className="h-9 w-28 bg-slate-200 dark:bg-slate-850 rounded-xl"></div>
          </div>
        </div>

        {/* Shimmer Skill Levels */}
        <div className="space-y-3">
          <div className="h-4 w-28 bg-slate-200 dark:bg-slate-850 rounded-md animate-pulse"></div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-2xl p-4 space-y-3 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-850"></div>
                  <div className="h-4 w-8 bg-slate-200 dark:bg-slate-850 rounded-md"></div>
                </div>
                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-850 rounded-md"></div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-850 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-5 bg-cream dark:bg-slate-950 text-navy dark:text-slate-100" id="home-screen-error">
        <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="space-y-1.5 max-w-[280px]">
          <h3 className="font-serif text-lg font-bold text-burgundy dark:text-rose-400">Sync Unsuccessful</h3>
          <p className="text-xs text-navy/60 dark:text-slate-300 leading-relaxed">
            {error}
          </p>
        </div>
        <button
          onClick={() => setRetryTrigger((prev) => prev + 1)}
          className="bg-terracotta hover:bg-terracotta-dark text-white font-sans text-xs font-semibold py-2.5 px-6 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  const isAllCompleted = progress.completedChapterIds.length === chapters.length && chapters.length > 0;

  const jordanScore = progress.friendshipPoints['Jordan'] || 0;
  const activeMilestone = JORDAN_MILESTONES.find(
    m => jordanScore >= m.threshold && !progress.completedChapterIds.includes(m.chapterId)
  );

  const activeStreak = calculateActiveStreak(progress.completionDates);
  const getStreakText = () => {
    if (activeStreak === 0) {
      return t.activeStreakZero || '0 days active';
    }
    if (activeStreak === 1) {
      return t.activeStreakOne || '1 day active in a row';
    }
    return (t.activeStreakPlural || '{count} days active in a row').replace('{count}', String(activeStreak));
  };

  const getMilestoneTitle = (m: typeof JORDAN_MILESTONES[0]) => {
    const key = `jordanMilestone${m.threshold}Title` as keyof typeof t;
    return (t[key] as string) || m.title;
  };

  const getMilestoneDesc = (m: typeof JORDAN_MILESTONES[0]) => {
    const key = `jordanMilestone${m.threshold}Desc` as keyof typeof t;
    return (t[key] as string) || m.description;
  };

  const getCategoryName = (catId: string, fallback: string) => {
    const keyMap: Record<string, keyof typeof t> = {
      academic: 'decorCatAcademic',
      cozy: 'decorCatCozy',
      art: 'decorCatArt',
    };
    const key = keyMap[catId];
    return (key && (t[key] as string)) || fallback;
  };

  const getItemName = (item: typeof DORM_DECOR_ITEMS[0]) => {
    const key = `decor_${item.id}_name` as keyof typeof t;
    return (t[key] as string) || item.name;
  };

  const getItemDesc = (item: typeof DORM_DECOR_ITEMS[0]) => {
    const key = `decor_${item.id}_desc` as keyof typeof t;
    return (t[key] as string) || item.description;
  };

  const completedLocationIds = useMemo(() => {
    return progress.completedLocationIds || [];
  }, [progress.completedLocationIds]);

  const completedLocationsCount = useMemo(() => {
    if (isAdmin) return 10;
    const buildingIds = ['dorm', 'lecture_hall', 'seminar_room', 'writing_center', 'library', 'dining_hall', 'student_union', 'science_lab', 'career_center', 'quad'];
    const completedChapters = progress.completedChapterIds || [];
    let count = 0;
    if (chapters && chapters.length > 0) {
      for (const bId of buildingIds) {
        const locChapters = chapters.filter((c) => c.locationId === bId);
        if (locChapters.length > 0 && locChapters.every((c) => completedChapters.includes(c.id))) {
          count++;
        }
      }
    }
    const numericCompleted = completedChapters.map(Number).filter((n) => !isNaN(n));
    const maxCompleted = numericCompleted.length > 0 ? Math.max(...numericCompleted) : 0;
    let mathCount = Math.floor(maxCompleted / 5);
    for (let locNum = 1; locNum <= 10; locNum++) {
      if (completedChapters.includes(String(locNum * 5)) && locNum > mathCount) {
        mathCount = locNum;
      }
    }
    return Math.max(count, mathCount, (progress.completedLocationIds || []).length);
  }, [isAdmin, chapters, progress.completedChapterIds, progress.completedLocationIds]);

  const equippedItemsList = useMemo(() => {
    return DORM_DECOR_ITEMS.filter((item) => {
      const isUnlocked = isDecorUnlocked(item.id);
      const isEquipped = equippedDecorIds.includes(item.id);
      return isUnlocked === true && isEquipped === true;
    });
  }, [equippedDecorIds, isDecorUnlocked]);

  return (
    <div
      className="flex-1 overflow-y-auto px-5 pb-6 space-y-6 bg-cream dark:bg-slate-950 text-navy dark:text-slate-100 font-sans"
      style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}
      id="home-screen"
    >
      {/* Greeting Header */}
      <div className="flex justify-between items-start" id="home-header">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono uppercase tracking-widest text-terracotta">{t.activeSemester}</span>
            <span className="text-navy/20 dark:text-slate-700 font-bold">•</span>
            {/* Days Active Streak Stat */}
            <div
              id="days-active-streak"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-medium"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{getStreakText()}</span>
            </div>

            <span className="text-navy/20 dark:text-slate-700 font-bold">•</span>

            {/* Coffee Streak / Ready Badge */}
            {isCoffeePending ? (
              <button
                id="coffee-pending-pill"
                onClick={handleMugTap}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-gradient-to-r from-amber-600 to-terracotta text-white rounded-full text-xs font-bold shadow-xs hover:scale-105 transition-all cursor-pointer animate-pulse"
              >
                <Coffee className="w-3.5 h-3.5 text-amber-100" />
                <span>{t.coffeeReadyBadge || '☕ Coffee Ready'}</span>
              </button>
            ) : (
              <button
                id="coffee-completed-badge"
                onClick={() => setToastMessage((t.coffeeAlreadyHadToast || 'You already had coffee with Jordan today! Coffee Streak: {count}.').replace('{count}', String(coffeeStreak || 1)).replace(' {days}', '').replace('{days}', ''))}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 rounded-full text-xs font-semibold cursor-pointer hover:bg-amber-500/20 transition-all select-none"
              >
                <Coffee className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{(t.coffeeStreakBadge || '☕ Coffee Streak: {count}').replace('{count}', String(coffeeStreak || 1)).replace(' {days}', '').replace('{days}', '')}</span>
              </button>
            )}

            <span className="text-navy/20 dark:text-slate-700 font-bold">•</span>

            {/* Academic Vocabulary Notebook Pill */}
            <button
              id="vocab-notebook-pill"
              onClick={() => {
                playSound('click', soundEnabled);
                setIsVocabModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-terracotta/10 dark:bg-rose-950/40 border border-terracotta/20 dark:border-rose-800/40 text-terracotta dark:text-rose-300 rounded-full text-xs font-bold hover:bg-terracotta/20 transition-all cursor-pointer select-none"
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>{(t.vocabCountPill || 'Vocab ({count})').replace('{count}', String(progress.savedWordIds?.length || 0))}</span>
            </button>
          </div>
          <h1 className="text-3xl font-serif font-semibold text-burgundy dark:text-rose-400">
            {t.welcomeBack}, <br />
            <span className="text-navy dark:text-slate-200">{profile.name}</span>
          </h1>
          <p className="text-xs text-navy/50 dark:text-slate-400 font-medium">
            {t.homeMajor || 'Major'}: {uiLanguage === 'RU' && profile.major === 'Undecided' ? t.majorUndecided : uiLanguage === 'RU' && profile.major === 'Computer Science' ? t.majorCS : uiLanguage === 'RU' && profile.major === 'Business' ? t.majorBusiness : uiLanguage === 'RU' && profile.major === 'Psychology' ? t.majorPsychology : profile.major} • {t.homeDorm || 'Dorm'}: {profile.dorm === 'Elm Hall' ? (t.dormElm || 'Elm Hall') : profile.dorm === 'Oak Hall' ? (t.dormOak || 'Oak Hall') : profile.dorm === 'Pine Hall' ? (t.dormPine || 'Pine Hall') : profile.dorm}
          </p>
        </div>
        <div className="p-2 bg-cream-card dark:bg-slate-800 rounded-full border border-navy/5 dark:border-slate-755 shadow-inner">
          <GraduationCap className="w-6 h-6 text-terracotta" />
        </div>
      </div>

      {/* Interactive Dorm Room Canvas & Decor Overlays */}
      <div
        className="relative w-full rounded-3xl overflow-hidden border border-navy/10 dark:border-slate-800 shadow-lg bg-slate-900 select-none"
        id="dorm-room-canvas"
      >
        <div className="absolute top-3 left-3 right-3 z-20 flex justify-end items-center pointer-events-none">
          <button
            id="decorate-room-btn"
            onClick={() => {
              playSound('click', soundEnabled);
              setIsDecorateModalOpen(true);
            }}
            className="bg-terracotta hover:bg-terracotta-dark text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer pointer-events-auto active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.decorateRoomBtn || 'Decorate Room'}</span>
          </button>
        </div>

        <div className="relative w-full">
          {isRoomLoading && (
            <div className="absolute inset-0 z-20 bg-amber-100/60 dark:bg-slate-900/80 animate-pulse rounded-2xl flex flex-col items-center justify-center pointer-events-none">
              <div className="w-8 h-8 rounded-full border-2 border-terracotta border-t-transparent animate-spin mb-2" />
              <span className="text-xs font-serif font-medium text-amber-800/70 dark:text-slate-300">Loading Room...</span>
            </div>
          )}
          <img
            src="/images/dorm_bg.jpg"
            alt="Dorm Room Background"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            onLoad={() => setIsRoomLoading(false)}
            style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }}
          />

          {/* Equipped Decor Item Overlays */}
          {equippedItemsList.map((item) => (
            <img
              key={item.id}
              src={item.image}
              alt={getItemName(item)}
              title={getItemName(item)}
              loading="eager"
              decoding="sync"
              style={{
                position: 'absolute',
                top: item.position.top,
                left: item.position.left,
                width: item.position.width,
                zIndex: item.position.zIndex,
                pointerEvents: 'none'
              }}
            />
          ))}

          {/* Locked Decor Item Hitboxes */}
          {DORM_DECOR_ITEMS.filter((item) => !isDecorUnlocked(item.id)).map((item) => (
            <div
              key={`locked-${item.id}`}
              title={`Locked: ${getItemName(item)}`}
              onClick={() => handleLockedSilhouetteClick(item)}
              className="absolute cursor-pointer opacity-0 hover:bg-amber-500/10 transition-colors rounded-lg z-10 aspect-square"
              style={{
                position: 'absolute',
                top: item.position.top,
                left: item.position.left,
                width: item.position.width,
                zIndex: item.position.zIndex,
                pointerEvents: 'auto',
              }}
            />
          ))}

          {/* Locked Silhouette Floating Tooltip Overlay */}
          <AnimatePresence>
            {lockedTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
              >
                <div className="bg-slate-900/95 dark:bg-slate-800/95 text-amber-200 text-xs font-semibold px-3.5 py-1.5 rounded-xl shadow-xl border border-amber-500/40 backdrop-blur-md whitespace-nowrap flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{lockedTooltip.text}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* White Rug Easter Egg Click/Tap Zone */}
          <div
            id="white-rug-easter-egg-zone"
            onClick={handleRugClick}
            title="Tap to investigate White Rug"
            style={{
              position: 'absolute',
              top: '72.0%',
              left: '21.0%',
              width: '44.0%',
              height: '24.0%',
              cursor: 'pointer',
              zIndex: 4
            }}
            className="group transition-all rounded-full hover:bg-white/10 hover:border-2 hover:border-amber-400/40"
          />
        </div>
      </div>

      {/* Cozy Coffee Corner Hero Widget (Only rendered when Coffee is pending) */}
      {isCoffeePending && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleMugTap}
          className="relative w-full rounded-3xl p-5 border-2 border-amber-500/40 shadow-xl overflow-hidden cursor-pointer select-none bg-gradient-to-br from-[#3c1d11] via-[#5c2d1b] to-[#2a130b] text-amber-50 hover:border-amber-400/60 transition-colors"
          id="cozy-coffee-corner-widget"
        >
          {/* Ambient Background Glows */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/25 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-terracotta/25 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-3">
            {/* Header / Streak Pills */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                ☕ {t.morningCoffeeHeader || 'Morning Coffee with Jordan'}
              </span>
              {coffeeStreak > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-amber-400/20 text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  <Flame className="w-3 h-3 text-amber-400 fill-current" />
                  <span>{(t.coffeeStreakText || '{count} Day Streak').replace('{count}', String(coffeeStreak))}</span>
                </span>
              )}
            </div>

            {/* Large Hero Floating Coffee Mug Visual with Fly-Up Tap Animation */}
            <div className="py-1">
              <motion.div
                animate={
                  isMugTapped
                    ? { y: -20, scale: 1.2, opacity: 0 }
                    : { y: 0, scale: 1, opacity: 1 }
                }
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="relative gpu-accelerated"
              >
                <AnimatedCoffeeMug
                  size="large"
                  showAura={true}
                  isBursting={isMugTapped}
                />
              </motion.div>
            </div>

            {/* Sleek Minimal CTA Button */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/30 via-amber-400/20 to-terracotta/30 hover:bg-amber-500/40 text-amber-100 text-xs font-serif font-bold px-4 py-2 rounded-2xl border border-amber-400/30 shadow-xs transition-all">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>{t.coffeeTapMugCta || 'Tap Mug to Drink & Chat!'}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Jordan Friendship Milestone Notification Banner */}
      {activeMilestone && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-terracotta/15 via-burgundy/10 to-amber-500/10 border-2 border-terracotta/30 rounded-3xl p-5 shadow-md space-y-3 relative overflow-hidden"
          id="jordan-milestone-notification"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-terracotta text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-terracotta uppercase tracking-wider block">
                  {t.jordanTalkWantsToTalk || 'Jordan wants to talk to you'}
                </span>
                <h3 className="text-sm font-serif font-bold text-burgundy dark:text-rose-400">
                  {getMilestoneTitle(activeMilestone)}
                </h3>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-terracotta/10 border border-terracotta/20 text-terracotta rounded-full text-[10px] font-mono font-bold shrink-0">
              {jordanScore} Friendship Pts
            </span>
          </div>

          <p className="text-xs text-navy/80 dark:text-slate-300 leading-relaxed font-sans">
            {getMilestoneDesc(activeMilestone)}
          </p>

          <div className="flex justify-end pt-1">
            <button
              id="talk-with-jordan-btn"
              onClick={() => {
                setSelectedChapterId(activeMilestone.chapterId);
                setActiveTab('story');
              }}
              className="bg-terracotta hover:bg-terracotta-dark text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {t.jordanTalkWithJordan || 'Talk with Jordan'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Continue Story Hero Card */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden"
        id="story-hero-card"
      >
        <div className="absolute right-[-10px] top-[-10px] opacity-10 pointer-events-none">
          <BookOpen className="w-32 h-32 text-navy dark:text-slate-500" />
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta"></span>
          </span>
          <span className="text-xs font-semibold text-terracotta uppercase tracking-wider">{t.currentChapter}</span>
        </div>

        {currentChapter ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-xl font-serif font-semibold text-navy dark:text-slate-100 leading-snug">
                {isNaN(Number(currentChapter.id)) || currentChapter.id.includes('milestone') ? (
                  <span className="inline-flex items-center gap-2 flex-wrap">
                    <span className="bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold inline-flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> [Special Talk]
                    </span>
                    {currentChapter.title}
                  </span>
                ) : (
                  `${t.homeChapter || 'Chapter'} ${currentChapter.id}: ${currentChapter.title}`
                )}
              </h2>
              <p className="text-xs text-navy/60 dark:text-slate-300 leading-relaxed font-sans line-clamp-2">
                {currentChapter.intro}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-xs text-navy/70 dark:text-slate-400 font-mono">
                <span className="px-2 py-0.5 bg-cream-card dark:bg-slate-800 rounded-md border border-navy/5 dark:border-slate-700 text-[11px] font-semibold text-burgundy dark:text-rose-300">
                  {getSkillNameTranslated(currentChapter.skill as SkillType)} {t.homePractice || 'Practice'}
                </span>
              </div>
              <button
                id="continue-story-btn"
                onClick={handleContinueStory}
                className="bg-terracotta hover:bg-terracotta-dark text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {t.resumeStory}
              </button>
            </div>
          </div>
        ) : isAllCompleted ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-xl font-serif font-semibold text-sage leading-snug flex items-center gap-1.5">
                <Award className="w-5 h-5 text-sage" /> {t.homeSemesterCompleted || 'Semester Completed!'}
              </h2>
              <p className="text-xs text-navy/60 dark:text-slate-300 leading-relaxed font-sans">
                {t.homeCompletedDescription || 'Incredible work! You have navigated through all academic English situations, debates, essays, and campus life chats in your first semester!'}
              </p>
            </div>

            <div className="pt-2">
              <button
                id="restart-semester-btn"
                onClick={resetProgress}
                className="bg-navy hover:bg-navy-light text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {t.homeRestartSemester || 'Restart Semester'}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-navy/50 dark:text-slate-400">Loading...</p>
        )}
      </motion.div>

      {/* Reserved Web Ad Slot (Zero visual impact when ads are disabled) */}
      <AdBannerSlot />

      {/* Focus Area Insight Card */}
      {focusArea && (
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-br from-white to-[#fbf9f4] dark:from-slate-900 dark:to-slate-950 border border-navy/10 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden"
          id="focus-area-insight-card"
        >
          <div className="absolute right-[-10px] top-[-10px] opacity-10 pointer-events-none">
            <Target className="w-24 h-24 text-terracotta" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-terracotta" />
              <span className="text-xs font-bold text-terracotta uppercase tracking-wider">
                {t.focusAreaTitle || 'Focus Area'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-terracotta/10 text-terracotta px-2 py-0.5 rounded-md border border-terracotta/10">
              {t.focusAreaScoreLabel || 'Score'}: {Math.round(focusArea.score)}
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-sans text-navy/80 dark:text-slate-200 leading-relaxed">
              {focusArea.message}
            </p>
            <p className="text-[10px] text-navy/40 dark:text-slate-500 font-mono">
              {t.focusAreaDisclaimer || '* This is an informational tip to help direct your studying. Practice Mode is available under Academic Progress.'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Skill Progress Overview */}
      <div className="space-y-3" id="skills-overview-section">
        <div className="flex justify-between items-center">
          <h3 className="text-sm uppercase tracking-wider font-semibold text-navy/80 dark:text-slate-200">{t.skillsBreakdown}</h3>
          <span className="text-xs text-terracotta font-semibold hover:underline cursor-pointer" onClick={() => setActiveTab('progress')}>
            {t.homeDetailedAnalytics || 'Detailed Analytics'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3" id="skills-grid">
          {(Object.keys(progress.skills) as SkillType[]).map((skill) => {
            const percentage = progress.skills[skill] || 0;
            const roundedPercentage = Math.round(percentage);
            const level = Math.min(6, Math.floor(roundedPercentage / 20) + 1);
            return (
              <div
                key={skill}
                className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="p-1.5 bg-cream-card dark:bg-slate-800 rounded-lg border border-navy/5 dark:border-slate-800">
                    {getSkillIcon(skill)}
                  </div>
                  <span className="font-mono text-xs font-semibold text-navy/40 dark:text-slate-500">LVL {level}</span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-mono font-semibold text-navy/50 dark:text-slate-400 uppercase tracking-tight">{getSkillNameTranslated(skill)}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-mono font-bold text-burgundy dark:text-rose-300">{roundedPercentage}</span>
                    <span className="text-xs font-mono text-navy/40 dark:text-slate-500">/100</span>
                  </div>
                </div>

                {/* Micro Progress Bar */}
                <div className="w-full bg-navy/5 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-terracotta h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${roundedPercentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Insights: Jordan's Note & Academic Advice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="daily-insights-section">
        {/* Jordan's Note Card */}
        <div className="bg-gradient-to-br from-amber-500/10 via-cream-card to-white dark:from-slate-900 dark:to-slate-880 border border-amber-500/20 dark:border-slate-800 rounded-2xl p-4 flex items-start gap-3 shadow-xs relative overflow-hidden" id="jordan-note-card">
          <div className="w-8 h-8 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center font-bold text-sm shrink-0 border border-terracotta/20">
            <MessageSquare className="w-4 h-4 text-terracotta" />
          </div>
          <div className="space-y-1 w-full">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-burgundy dark:text-rose-400">
                {t.jordanNoteTitle || "Jordan's Note"}
              </h4>
              <span className="text-[9px] font-mono text-terracotta/80 font-bold px-1.5 py-0.5 bg-terracotta/10 rounded-md">
                Roommate
              </span>
            </div>
            <p className="text-xs text-navy/80 dark:text-slate-200 leading-relaxed italic font-serif">
              "{(() => {
                const getDayOfYear = () => {
                  const now = new Date();
                  const start = new Date(now.getFullYear(), 0, 0);
                  const diff = now.getTime() - start.getTime();
                  const oneDay = 1000 * 60 * 60 * 24;
                  return Math.floor(diff / oneDay);
                };
                const dayOfYear = getDayOfYear();
                const jNotes = t.jordanNotes || [];
                if (jNotes.length === 0) return '';
                const jordanIndex = (dayOfYear + 7) % jNotes.length;
                return jNotes[jordanIndex];
              })()}"
            </p>
          </div>
        </div>

        {/* Academic Highlights / Advice */}
        <div className="bg-cream-card dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-2xl p-4 flex items-start gap-3" id="campus-advice-card">
          <div className="p-1.5 bg-white dark:bg-slate-800 rounded-xl text-terracotta shrink-0 border border-navy/5 dark:border-slate-800">
            <Sparkles className="w-5 h-5 text-terracotta" />
          </div>
          <div className="space-y-1 w-full">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-burgundy dark:text-rose-400">
              {t.academicTipTitle}
            </h4>
            <p className="text-xs text-navy/70 dark:text-slate-300 leading-relaxed">
              {(() => {
                const getDayOfYear = () => {
                  const now = new Date();
                  const start = new Date(now.getFullYear(), 0, 0);
                  const diff = now.getTime() - start.getTime();
                  const oneDay = 1000 * 60 * 60 * 24;
                  return Math.floor(diff / oneDay);
                };
                const dayOfYear = getDayOfYear();
                const tips = t.academicTips || [];
                if (tips.length === 0) return '';
                const tipIndex = dayOfYear % tips.length;
                const activeTip = tips[tipIndex];

                const parts = activeTip.split(/("[^"]+")/);
                return parts.map((part, idx) => {
                  if (part.startsWith('"') && part.endsWith('"')) {
                    return (
                      <span key={idx} className="font-semibold text-terracotta font-mono">
                        {part}
                      </span>
                    );
                  }
                  return part;
                });
              })()}
            </p>
          </div>
        </div>
      </div>

      {/* Morning Coffee Modal */}
      <MorningCoffeeModal
        isOpen={isCoffeeModalOpen}
        onClose={() => setIsCoffeeModalOpen(false)}
        dialogue={todayDialogue}
        streakCount={coffeeStreak}
        soundEnabled={soundEnabled}
        onSelectOption={(opt) => completeCoffeeTalk(opt.friendshipPoints)}
      />

      {/* Full-Screen Coffee Transition Overlay */}
      <AnimatePresence>
        {isMugTapped && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm pointer-events-none gpu-accelerated"
            id="coffee-fullscreen-transition"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30, opacity: 0 }}
              animate={{ scale: 1.25, y: 0, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.38, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex flex-col items-center justify-center space-y-4 gpu-accelerated"
              style={{
                willChange: 'transform, opacity',
                transform: 'translate3d(0, 0, 0)',
              }}
            >
              <AnimatedCoffeeMug size="large" showAura={true} isBursting={true} />
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.25 }}
                className="text-amber-100 font-serif font-bold text-base sm:text-lg tracking-wide drop-shadow-md bg-stone-900/90 px-5 py-2.5 rounded-2xl border border-amber-500/40 shadow-2xl"
              >
                {t.coffeeBrewingMsg || 'Brewing Coffee with Jordan...'}
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs font-sans font-medium px-5 py-3 rounded-2xl shadow-xl border border-slate-700/60 flex items-center gap-2 pointer-events-none"
            id="coffee-toast-notification"
          >
            <span>☕</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <VocabularyNotebookModal
        isOpen={isVocabModalOpen}
        onClose={() => setIsVocabModalOpen(false)}
      />

      {/* Easter Egg Rug Discovered Modal */}
      <AnimatePresence>
        {isRugModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="rug-easter-egg-modal">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-amber-500/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center relative"
            >
              <button
                onClick={() => setIsRugModalOpen(false)}
                className="absolute top-4 right-4 text-navy/40 dark:text-slate-400 hover:text-navy dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex justify-center mx-auto my-1">
                <BadgeMedallion badgeId="rug_investigator" size="xl" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-burgundy dark:text-rose-400">
                  Easter Egg Discovered!
                </h3>
                <p className="text-sm text-navy/80 dark:text-slate-200 leading-relaxed font-sans">
                  You uncovered the secret rug placement easter egg!
                </p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-xs text-amber-900 dark:text-amber-200 font-medium flex items-center justify-center gap-2">
                <BadgeMedallion badgeId="rug_investigator" size="xs" />
                <span>Achievement Unlocked: <strong>Ass-hands</strong></span>
              </div>
              <button
                onClick={() => setIsRugModalOpen(false)}
                className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-semibold py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Awesome!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Decorate Room Modal */}
      <AnimatePresence>
        {isDecorateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="decorate-room-modal">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative max-h-[85vh] flex flex-col"
            >
              <div className="flex justify-between items-center border-b border-navy/10 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-burgundy dark:text-rose-400 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-terracotta" />
                    {t.decorModalTitle || 'Decorate Dorm Room'}
                  </h3>
                  <p className="text-xs text-navy/60 dark:text-slate-400">
                    {isAdmin ? (t.decorDevAdminSubtext || '✨ Dev Admin Mode: All decor items unlocked!') : (t.decorNormalSubtext || 'Equip unlocked decor to personalize your space.')}
                  </p>
                </div>
                <button
                  onClick={() => setIsDecorateModalOpen(false)}
                  className="text-navy/40 dark:text-slate-400 hover:text-navy dark:hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar scrollbar-none touch-pan-x shrink-0">
                <button
                  onClick={() => setSelectedDecorCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 shrink-0 cursor-pointer whitespace-nowrap ${
                    selectedDecorCategory === 'all'
                      ? 'bg-terracotta text-white shadow-xs font-bold'
                      : 'bg-navy/5 dark:bg-slate-800 text-navy/70 dark:text-slate-300 hover:bg-navy/10 dark:hover:bg-slate-700'
                  }`}
                >
                  {t.decorCatAll || 'All'}
                </button>
                {DECOR_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedDecorCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 shrink-0 cursor-pointer whitespace-nowrap ${
                      selectedDecorCategory === cat.id
                        ? 'bg-terracotta text-white shadow-xs font-bold'
                        : 'bg-navy/5 dark:bg-slate-800 text-navy/70 dark:text-slate-300 hover:bg-navy/10 dark:hover:bg-slate-700'
                    }`}
                  >
                    {getCategoryName(cat.id, cat.name)}
                  </button>
                ))}
              </div>

              {/* Items List - Fixed max height with vertical scrolling */}
              <div className="overflow-y-auto pr-1 flex-1 h-[380px] max-h-[380px]">
                <div className="space-y-3">
                  {DORM_DECOR_ITEMS.map((item) => {
                    const isVisible = selectedDecorCategory === 'all' || item.category === selectedDecorCategory;
                    const isUnlocked = isAdmin ||
                      item.unlockedByDefault === true ||
                      item.isUnlocked === true ||
                      (progress.unlockedDecorIds || []).includes(item.id) ||
                      isDecorUnlocked(item.id) ||
                      (!!item.requiredLocationsCompleted && completedLocationsCount >= item.requiredLocationsCompleted) ||
                      (!!item.requiredLocationId && completedLocationIds.includes(item.requiredLocationId));
                    const isEquipped = equippedDecorIds.includes(item.id);
                    const categoryInfo = DECOR_CATEGORIES.find((c) => c.id === item.category);

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all duration-300 ease-in-out ${
                          isVisible ? 'flex opacity-100' : 'hidden opacity-0'
                        } items-start justify-between gap-3 min-h-[115px] ${
                          isEquipped && isUnlocked
                            ? 'bg-terracotta/5 border-terracotta/30 dark:bg-rose-950/20 dark:border-rose-800/40'
                            : 'bg-cream-card/50 dark:bg-slate-800/50 border-navy/5 dark:border-slate-800'
                        }`}
                      >
                        {/* Left: Thumbnail */}
                        <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-800 p-1 border border-navy/10 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                          <img src={item.image} alt={getItemName(item)} className="w-full h-full object-contain" />
                        </div>

                        {/* Center Column: Title, Category, Description, Unlock Requirement */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-xs font-bold text-navy dark:text-slate-100">{getItemName(item)}</h4>
                              {categoryInfo && (
                                <span className="text-[9px] font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded-md border border-amber-500/20 whitespace-nowrap">
                                  {getCategoryName(categoryInfo.id, categoryInfo.name)}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-navy/60 dark:text-slate-400 leading-tight mt-1">{getItemDesc(item)}</p>
                          </div>

                          {!isUnlocked && item.requiredLocationsCompleted && (
                            <div className="mt-1.5">
                              <span className="inline-block text-[10px] font-medium text-amber-800 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                                {(t.decorUnlocksAfterLoc || 'Unlocks after completing "{location}"').replace(
                                  '{location}',
                                  {
                                    1: profile.dorm || t.buildingDormName || 'Dorm Hall',
                                    2: t.buildingLectureName || 'Lecture Hall',
                                    3: t.buildingSeminarName || 'Seminar Room',
                                    4: t.buildingWritingName || 'Writing Center',
                                    5: t.buildingLibraryName || 'Campus Library',
                                    6: t.buildingDiningName || 'Dining Hall',
                                    7: t.buildingUnionName || 'Student Union',
                                    8: t.buildingLabName || 'Science Lab',
                                    9: t.buildingCareerName || 'Career Center',
                                    10: t.buildingQuadName || 'University Quad',
                                  }[item.requiredLocationsCompleted] || `Location ${item.requiredLocationsCompleted}`
                                )}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Right Column: Equip / Equipped Button or Locked Badge */}
                        <div className="shrink-0 flex items-start pt-0.5">
                          {isUnlocked ? (
                            <button
                              onClick={() => {
                                playSound('click', soundEnabled);
                                toggleEquipDecor(item.id);
                              }}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                                isEquipped
                                  ? 'bg-terracotta text-white shadow-xs hover:bg-terracotta-dark'
                                  : 'bg-white dark:bg-slate-800 border border-navy/10 dark:border-slate-700 text-navy dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              {isEquipped ? (t.decorEquipped || 'Equipped') : (t.decorEquip || 'Equip')}
                            </button>
                          ) : (
                            <button
                              disabled
                              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed flex items-center gap-1 shrink-0"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              {t.decorLocked || 'Locked'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => setIsDecorateModalOpen(false)}
                className="w-full bg-navy dark:bg-slate-800 hover:bg-navy-light text-white font-semibold py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                {t.decorClose || 'Close'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
