/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCampus } from '../context/CampusContext';
import { Chapter, SkillType } from '../data/models';
import { translations } from '../utils/translations';
import * as htmlToImage from 'html-to-image';
import {
  Award,
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  CheckCircle2,
  Hourglass,
  Calendar,
  GraduationCap,
  AlertTriangle,
  X,
  Download,
  Compass,
  Moon,
  Map,
  Heart,
  Sparkles,
  Users,
  Flame,
  Lock,
  FileText,
  Clock,
  Trash2,
  Crown,
  Plus,
  ChevronLeft,
  Scroll
} from 'lucide-react';
import { BADGE_DEFINITIONS, Badge, getBadgeTitle, getBadgeDesc } from '../utils/badgeHelper';
import { BadgeMedallion } from '../components/BadgeMedallion';
import { MyNotesScreen } from './MyNotesScreen';
import { AcademicTranscriptModal } from '../components/AcademicTranscriptModal';
import {
  getSavedReportSnapshots,
  saveReportSnapshot,
  deleteReportSnapshot,
  SemesterReportSnapshot
} from '../utils/reportHistory';

const getBadgeIcon = (iconName: string, className: string = "w-8 h-8") => {
  switch (iconName) {
    case 'Footprints': return <Flame className={className} />;
    case 'BookOpen': return <BookOpen className={className} />;
    case 'Moon': return <Moon className={className} />;
    case 'Map': return <Map className={className} />;
    case 'CalendarCheck': return <Calendar className={className} />;
    case 'PenTool': return <PenTool className={className} />;
    case 'MessageSquare': return <Users className={className} />;
    case 'Flag': return <Compass className={className} />;
    case 'GraduationCap': return <GraduationCap className={className} />;
    case 'Heart': return <Heart className={className} />;
    case 'Award': return <Award className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    default: return <Award className={className} />;
  }
};

export const ProgressScreen: React.FC = () => {
  const {
    progress,
    storyRepository,
    profile,
    setSelectedChapterId,
    setIsPracticeMode,
    setPracticeChapterId,
    setActiveTab,
    uiLanguage,
    canUsePracticeMode,
    recordPracticeAttemptUsed,
    setActiveSubscreenRequest,
    isCampusPlus
  } = useCampus();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState<number>(0);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState<boolean>(false);
  const [reportTab, setReportTab] = useState<'current' | 'history'>('current');
  const [savedSnapshots, setSavedSnapshots] = useState<SemesterReportSnapshot[]>([]);
  const [viewingSnapshot, setViewingSnapshot] = useState<SemesterReportSnapshot | null>(null);
  const [snapshotSavedToast, setSnapshotSavedToast] = useState<boolean>(false);
  const [showPracticeSelection, setShowPracticeSelection] = useState<boolean>(false);
  const [showMyNotes, setShowMyNotes] = useState<boolean>(false);
  const [activeExamTab, setActiveExamTab] = useState<'TOEFL' | 'IELTS'>(profile.examPreference === 'IELTS' ? 'IELTS' : 'TOEFL');
  const [progressSubTab, setProgressSubTab] = useState<'stats' | 'badges'>('stats');

  const t = translations[uiLanguage] || translations.EN;

  useEffect(() => {
    if (profile.examPreference === 'IELTS') {
      setActiveExamTab('IELTS');
    } else if (profile.examPreference === 'TOEFL') {
      setActiveExamTab('TOEFL');
    }
  }, [profile.examPreference]);

  useEffect(() => {
    const loadChapters = async () => {
      setLoading(true);
      setError(null);
      try {
        const all = await storyRepository.getChapters();
        setChapters(all);
      } catch (e: any) {
        console.error('Failed to load progress chapters:', e);
        if (e.message !== 'STALE_SESSION') {
          setError('Failed to fetch your academic record. Check your network.');
        }
      } finally {
        setLoading(false);
      }
    };
    loadChapters();
  }, [storyRepository, retryTrigger]);

  useEffect(() => {
    if (showReportModal) {
      getSavedReportSnapshots().then((list) => setSavedSnapshots(list));
    }
  }, [showReportModal]);

  const handleSaveSnapshot = async () => {
    try {
      await saveReportSnapshot({
        studentName: profile.name || 'Alex',
        major: profile.major || (uiLanguage === 'RU' ? 'Не определено' : (uiLanguage === 'ES' ? 'No Decidido' : 'Undecided')),
        dorm: profile.dorm || 'Elm Hall',
        completedCount,
        totalChapters,
        skills: progress.skills,
        toeflEst: `${toeflLow}-${toeflHigh}`,
        ieltsEst: Math.round(((ieltsLow + ieltsHigh) / 2) * 10) / 10
      });
      setSnapshotSavedToast(true);
      setTimeout(() => setSnapshotSavedToast(false), 3000);
      const updated = await getSavedReportSnapshots();
      setSavedSnapshots(updated);
    } catch (e) {
      console.error('Error saving report snapshot:', e);
    }
  };

  const handleDeleteSnapshot = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteReportSnapshot(id);
      const updated = await getSavedReportSnapshots();
      setSavedSnapshots(updated);
      if (viewingSnapshot && viewingSnapshot.id === id) {
        setViewingSnapshot(null);
      }
    } catch (e) {
      console.error('Error deleting report snapshot:', e);
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

  const getTranslatedLocationName = (locId: string) => {
    switch (locId) {
      case 'dorm': return profile.dorm || t.buildingDormName || 'Dorm';
      case 'lecture_hall': return t.buildingLectureName || 'Lecture Hall';
      case 'seminar_room': return t.buildingSeminarName || 'Seminar Room';
      case 'writing_center': return t.buildingWritingName || 'Writing Center';
      case 'library': return t.buildingLibraryName || 'Library';
      case 'dining_hall': return t.buildingDiningName || 'Dining Hall';
      case 'student_union': return t.buildingUnionName || 'Student Union';
      case 'science_lab': return t.buildingLabName || 'Science Lab';
      case 'career_center': return t.buildingCareerName || 'Career Center';
      case 'quad': return t.buildingQuadName || 'Quad';
      default: return locId.replace('_', ' ');
    }
  };

  const getTranslatedChapterType = (type: string) => {
    switch (type) {
      case 'DISCUSSION': return t.taskDiscussion || 'Discussion';
      case 'LECTURE': return t.taskLecture || 'Lecture';
      case 'INDEPENDENT_WORK': return t.taskWriting || 'Writing';
      case 'LIBRARY': return t.taskReading || 'Reading';
      case 'CAMPUS_LIFE': return t.taskSpeaking || 'Speaking';
      default: return type.replace('_', ' ');
    }
  };

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

  // Map skill percentage to CEFR Level descriptors
  const getCEFRLevel = (score: number) => {
    if (score < 30) return { code: 'A2', desc: 'Elementary Academic' };
    if (score < 60) return { code: 'B1', desc: 'Intermediate Academic' };
    if (score < 85) return { code: 'B2', desc: 'Upper Intermediate' };
    return { code: 'C1', desc: 'Advanced Academic' };
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 bg-cream dark:bg-slate-950 text-navy dark:text-slate-100 font-sans" id="progress-screen-loading">
        {/* Progress Header Shimmer */}
        <div className="space-y-2 animate-pulse">
          <div className="h-3.5 w-28 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
        </div>

        {/* Large Metric Card Shimmer */}
        <div className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-3xl p-5 animate-pulse flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
            <div className="h-7 w-16 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
            <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* Skills progress lines Shimmer */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-2xl p-4 space-y-3 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                <div className="h-4 w-10 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-5 bg-cream dark:bg-slate-950 text-navy dark:text-slate-100" id="progress-screen-error">
        <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="space-y-1.5 max-w-[280px]">
          <h3 className="font-serif text-lg font-bold text-burgundy dark:text-rose-400">
            {uiLanguage === 'RU' ? 'Академические записи отключены' : (uiLanguage === 'ES' ? 'Registros Académicos Fuera de Línea' : 'Academic Records Offline')}
          </h3>
          <p className="text-xs text-navy/60 dark:text-slate-300 leading-relaxed">
            {error}
          </p>
        </div>
        <button
          onClick={() => setRetryTrigger((prev) => prev + 1)}
          className="bg-terracotta hover:bg-terracotta-dark text-white font-sans text-xs font-semibold py-2.5 px-6 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
        >
          {uiLanguage === 'RU' ? 'Попробовать снова' : (uiLanguage === 'ES' ? 'Intentar de Nuevo' : 'Try Again')}
        </button>
      </div>
    );
  }

  if (showMyNotes) {
    return <MyNotesScreen onBack={() => setShowMyNotes(false)} />;
  }

  const TOTAL_CHAPTERS = 50;
  const totalChapters = TOTAL_CHAPTERS;
  const numericCompletedChapters = (progress.completedChapterIds || [])
    .filter((id) => !isNaN(Number(id)))
    .map(Number);
  const completedCount = Math.min(numericCompletedChapters.length, TOTAL_CHAPTERS);
  const completionPercentage = Math.round((completedCount / TOTAL_CHAPTERS) * 100);

  const totalFriendshipStories = 8;
  const unlockedFriendshipStories = (progress.completedChapterIds || [])
    .filter((id) => String(id).startsWith('jordan_milestone_') || (isNaN(Number(id)) && String(id).includes('milestone'))).length;

  // TOEFL/IELTS Estimations
  const listeningScore = progress.skills[SkillType.LISTENING] || 0;
  const speakingScore = progress.skills[SkillType.SPEAKING] || 0;
  const writingScore = progress.skills[SkillType.WRITING] || 0;
  const readingScore = progress.skills[SkillType.READING] || 0;
  const averageScore = (listeningScore + speakingScore + writingScore + readingScore) / 4;

  const toeflCenter = (averageScore / 100) * 120;
  const toeflEst = Math.max(0, Math.min(120, Math.round(toeflCenter)));
  const toeflLow = Math.max(0, toeflEst - 5);
  const toeflHigh = Math.min(120, toeflEst + 5);

  const ieltsCenter = (averageScore / 100) * 9;
  const ieltsEst = Math.max(0, Math.min(9, Math.round(ieltsCenter * 2) / 2));
  const ieltsLow = Math.max(0, ieltsEst - 0.5);
  const ieltsHigh = Math.min(9, ieltsEst + 0.5);

  const toeflPercent = (toeflEst / 120) * 100;
  const ieltsPercent = (ieltsEst / 9) * 100;
  const avgCefr = getCEFRLevel(averageScore);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const triggerDownload = (dataUrl: string) => {
    const link = document.createElement('a');
    link.download = `Campus_Semester_Report_${profile.name || 'Alex'}.png`;
    link.href = dataUrl;
    link.click();
  };

  const downloadReport = () => {
    const node = document.getElementById('semester-report-card');
    if (!node) return;
    
    htmlToImage.toPng(node, { 
      cacheBust: true,
      style: {
        transform: 'none',
        transformOrigin: 'top left',
        backgroundColor: '#fbf9f4'
      }
    })
    .then(async (dataUrl) => {
      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `Campus_Semester_Report_${profile.name || 'Alex'}.png`, { type: 'image/png' });

        const nav = navigator as any;
        if (nav.share && nav.canShare && nav.canShare({ files: [file] })) {
          await nav.share({
            files: [file],
            title: 'Campus Semester Report',
            text: `Check out my academic progress on Campus!`,
          });
        } else {
          triggerDownload(dataUrl);
        }
      } catch (err: any) {
        if (err && err.name === 'AbortError') {
          console.log('Share canceled by user.');
          return;
        }
        console.error('Share API not supported or failed, falling back to download:', err);
        triggerDownload(dataUrl);
      }
    })
    .catch((err) => {
      console.error('Failed to export image:', err);
    });
  };

  const handleSave = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    downloadReport();
  };

  const completedChapters = chapters.filter((ch) => progress.completedChapterIds.includes(ch.id));
  const completedBySkill = {
    [SkillType.LISTENING]: completedChapters.filter((ch) => ch.skill === SkillType.LISTENING),
    [SkillType.SPEAKING]: completedChapters.filter((ch) => ch.skill === SkillType.SPEAKING),
    [SkillType.WRITING]: completedChapters.filter((ch) => ch.skill === SkillType.WRITING),
    [SkillType.READING]: completedChapters.filter((ch) => ch.skill === SkillType.READING),
  };

  const isChapter50Completed = (progress.completedChapterIds || []).length >= 50 || (progress.completedChapterIds || []).some((id: any) => String(id) === '50' || id === 50);

  return (
    <div
      className="flex-1 overflow-y-auto px-5 pb-6 space-y-6 bg-cream dark:bg-slate-950 text-navy dark:text-slate-100 font-sans"
      style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}
      id="progress-screen"
    >
      {/* Progress Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" id="progress-header">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-terracotta uppercase tracking-wider block">{t.progressStudentDashboard || 'Student Dashboard'}</span>
          <h2 className="text-3xl font-serif font-bold text-burgundy dark:text-rose-400">{t.academicProgress}</h2>
          <p className="text-xs text-navy/50 dark:text-slate-400">{t.progressDashboardSubtitle || 'Track your English comprehension skills and semester milestones.'}</p>
        </div>
        
        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {isChapter50Completed ? (
            <button
              id="view-official-transcript-btn"
              onClick={() => setShowTranscriptModal(true)}
              className="bg-gradient-to-r from-amber-600 via-amber-500 to-terracotta hover:from-amber-700 hover:to-terracotta-dark text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0 border border-amber-300/40"
            >
              <Scroll className="w-4 h-4 text-amber-100" />
              <span>📜 {t.graduationTranscript || 'Graduation Transcript'}</span>
            </button>
          ) : (
            <button
              id="view-official-transcript-btn-locked"
              disabled
              title="Complete Chapter 50 to unlock your Official Graduation Transcript"
              className="bg-slate-200/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs font-semibold py-2.5 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 opacity-80 cursor-not-allowed shrink-0 select-none"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>🎓 {t.officialTranscriptLocked || 'Official Transcript (Unlocks at Ch. 50)'}</span>
            </button>
          )}

          <button
            id="semester-report-btn"
            onClick={() => setShowReportModal(true)}
            className="bg-burgundy dark:bg-rose-500 hover:bg-burgundy/90 dark:hover:bg-rose-600 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
          >
            <Award className="w-4 h-4 text-white" />
            {t.progressSemesterReport || 'Semester Report'}
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Switcher */}
      <div className="flex bg-navy/5 dark:bg-slate-900 p-1 rounded-xl w-full" id="progress-subtabs-control">
        <button
          onClick={() => setProgressSubTab('stats')}
          className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
            progressSubTab === 'stats'
              ? 'bg-white dark:bg-slate-800 text-terracotta shadow-sm'
              : 'text-navy/60 dark:text-slate-400 hover:text-navy dark:hover:text-slate-200'
          }`}
          id="toggle-stats-tab"
        >
          {t.progressStatsTab || 'Dashboard'}
        </button>
        <button
          onClick={() => setProgressSubTab('badges')}
          className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            progressSubTab === 'badges'
              ? 'bg-white dark:bg-slate-800 text-terracotta shadow-sm'
              : 'text-navy/60 dark:text-slate-400 hover:text-navy dark:hover:text-slate-200'
          }`}
          id="toggle-badges-tab"
        >
          {t.progressBadgesTab || 'Achievements'}
          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold transition-all ${
            progressSubTab === 'badges'
              ? 'bg-terracotta text-white'
              : 'bg-navy/10 dark:bg-slate-850 text-navy/60 dark:text-slate-400'
          }`}>
            {BADGE_DEFINITIONS.filter(b => b.check(progress, chapters)).length}
          </span>
        </button>
      </div>

      {progressSubTab === 'stats' ? (
        <>
          {/* Main Chapter Progress Donut / Circle Card */}
          <div className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 p-5 rounded-3xl shadow-sm flex items-center gap-5" id="completion-gauge-card">
        {/* Circular Gauge */}
        <div className="relative w-20 h-20 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-navy/5 dark:text-slate-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-terracotta transition-all duration-500"
              strokeDasharray={`${completionPercentage}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-mono font-bold text-burgundy dark:text-rose-300">{completedCount}</span>
            <span className="text-[9px] font-mono font-semibold text-navy/40 dark:text-slate-500">/{totalChapters}</span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-serif text-lg font-bold text-burgundy dark:text-rose-400">{t.chaptersCompleted}</h3>
          <p className="text-xs text-navy/60 dark:text-slate-300 leading-relaxed">
            {uiLanguage === 'RU' ? (
              <>Вы успешно завершили <span className="font-semibold text-burgundy dark:text-rose-300">{completionPercentage}%</span> сюжетных сценариев первого семестра.</>
            ) : uiLanguage === 'ES' ? (
              <>Ha completado con éxito el <span className="font-semibold text-burgundy dark:text-rose-300">{completionPercentage}%</span> de los escenarios narrativos del primer semestre.</>
            ) : (
              <>You have successfully completed <span className="font-semibold text-burgundy dark:text-rose-300">{completionPercentage}%</span> of the first-semester narrative scenarios.</>
            )}
          </p>
        </div>
      </div>

      {/* Jordan Friendship Stories Secondary Progress Card */}
      <div className="w-full overflow-hidden bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" id="friendship-stories-widget">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center font-bold shrink-0 border border-rose-200/50 dark:border-rose-900/40">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-serif font-bold text-burgundy dark:text-rose-400 truncate">
              {t.jordanFriendshipHeader || 'Jordan Friendship Progress'}
            </h4>
            <p className="text-[10px] font-mono text-navy/50 dark:text-slate-400 truncate">
              {t.jordanFriendshipSub || 'Special Bonding Conversations with Jordan'}
            </p>
          </div>
        </div>
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-rose-700 dark:text-rose-300 shrink-0 flex items-center gap-1.5 max-w-full">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 shrink-0" />
          <span className="truncate">{(t.jordanFriendshipBadge || '♥️ Friendship Stories: {unlocked} / {total} Unlocked').replace('{unlocked}', String(unlockedFriendshipStories)).replace('{total}', String(totalFriendshipStories))}</span>
        </div>
      </div>

      {/* Practice Mode Call To Action Card */}
      <div className="bg-gradient-to-r from-terracotta/10 to-burgundy/10 dark:from-terracotta/15 dark:to-burgundy/15 border border-terracotta/20 dark:border-terracotta/30 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in" id="practice-mode-cta">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-terracotta text-white font-mono text-[9px] font-bold uppercase rounded-md tracking-wider">{t.progressStudyHall || 'STUDY HALL'}</span>
            <h3 className="text-base font-serif font-bold text-burgundy dark:text-rose-400">
              {t.progressPracticeModeTitle || 'Continuous Practice Mode'}
            </h3>
          </div>
          <p className="text-xs text-navy/75 dark:text-slate-300 leading-relaxed max-w-xl">
            {t.progressPracticeModeDesc ? (() => {
              const desc = t.progressPracticeModeDesc;
              if (desc.includes('50% бонусных очков навыков')) {
                const parts = desc.split('50% бонусных очков навыков');
                return <>{parts[0]}<strong className="text-terracotta font-bold">50% бонусных очков навыков</strong>{parts[1]}</>;
              } else if (desc.includes('50% de puntos de habilidad de bonificación')) {
                const parts = desc.split('50% de puntos de habilidad de bonificación');
                return <>{parts[0]}<strong className="text-terracotta font-bold">50% de puntos de habilidad de bonificación</strong>{parts[1]}</>;
              } else if (desc.includes('50% bonus skill points')) {
                const parts = desc.split('50% bonus skill points');
                return <>{parts[0]}<strong className="text-terracotta font-bold">50% bonus skill points</strong>{parts[1]}</>;
              }
              return desc;
            })() : (
              <>Redo completed narrative chapters as practice attempts to strengthen your vocabulary and comprehension. Earn <strong className="text-terracotta font-bold">50% bonus skill points</strong> for each practice check!</>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowPracticeSelection(true)}
          className="bg-terracotta hover:bg-terracotta-dark text-white text-xs font-semibold py-3 px-5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Award className="w-4 h-4" />
          {t.progressEnterPractice || 'Enter Practice Room'}
        </button>
      </div>

      {/* My Lecture Notes Card */}
      <div className="bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in" id="my-notes-cta">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-burgundy/10 dark:bg-rose-400/10 text-burgundy dark:text-rose-300 font-mono text-[9px] font-bold uppercase rounded-md tracking-wider">
              {t.lectureNotebookLabel || 'Lecture Notebook'}
            </span>
            <h3 className="text-base font-serif font-bold text-burgundy dark:text-rose-400">
              {t.myNotesTitle || 'My Lecture Notes'}
            </h3>
          </div>
          <p className="text-xs text-navy/75 dark:text-slate-300 leading-relaxed max-w-xl">
            {t.myNotesSubtitle || 'Review your freeform notes taken during listening chapters'}
          </p>
        </div>
        <button
          onClick={() => setShowMyNotes(true)}
          className="bg-navy hover:bg-navy-light dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold py-3 px-5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <FileText className="w-4 h-4 text-terracotta" />
          {t.viewNotesBtn || 'View Notes'}
        </button>
      </div>

      {/* Detailed Skill Breakdown */}
      <div className="space-y-3" id="skill-breakdown-section">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-navy/70 dark:text-slate-400">{t.skillsBreakdown}</h3>
        
        <div className="space-y-3" id="skills-detail-list">
          {(Object.keys(progress.skills) as SkillType[]).map((skill) => {
            const score = progress.skills[skill] || 0;
            const roundedScore = Math.round(score);
            const cefr = getCEFRLevel(score);

            return (
              <div
                key={skill}
                className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-cream-card dark:bg-slate-800 rounded-lg border border-navy/5 dark:border-slate-800 shrink-0">
                      {getSkillIcon(skill)}
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-navy dark:text-slate-200 uppercase tracking-tight">{getSkillNameTranslated(skill)}</h4>
                      <p className="text-[10px] text-navy/50 dark:text-slate-400 font-semibold">{cefr.desc}</p>
                    </div>
                  </div>
                  
                  {/* CEFR Badge */}
                  <span className="px-2 py-0.5 bg-terracotta/10 border border-terracotta/10 rounded-md text-[10px] font-mono font-bold text-terracotta">
                    {cefr.code}
                  </span>
                </div>

                {/* Progress bar + percentages */}
                <div className="space-y-1">
                  <div className="w-full bg-navy/5 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-terracotta h-2 rounded-full transition-all duration-500"
                      style={{ width: `${roundedScore}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono font-semibold text-navy/40 dark:text-slate-500">
                    <span>A1</span>
                    <span>B1 (30)</span>
                    <span>B2 (60)</span>
                    <span>C1 (85)</span>
                    <span className="text-burgundy dark:text-rose-300 font-bold">Score: {roundedScore}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TOEFL/IELTS Estimator Section */}
      <div className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4" id="exam-estimator-card">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-terracotta uppercase tracking-wider block">
            {t.progressExamEquivalency || 'Exam Equivalency'}
          </span>
          <h3 className="text-base font-serif font-bold text-burgundy dark:text-rose-400">{t.estimatedExamRange}</h3>
        </div>
        
        {completedCount < 5 ? (
          <div className="py-6 text-center text-xs text-navy/40 dark:text-slate-500 font-medium bg-cream-card dark:bg-slate-800/50 rounded-2xl border border-dashed border-navy/10 dark:border-slate-800">
            {t.progressExamUnlockNeeded || 'Complete a few more chapters to see your estimate. (Need 5 or more completed chapters)'}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Toggle Switch */}
            <div className="flex bg-navy/5 dark:bg-slate-800 p-1 rounded-xl w-full" id="exam-toggle-controls">
              <button
                onClick={() => setActiveExamTab('TOEFL')}
                className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  activeExamTab === 'TOEFL'
                    ? 'bg-white dark:bg-slate-900 text-terracotta shadow-sm'
                    : 'text-navy/60 dark:text-slate-400 hover:text-navy dark:hover:text-slate-200'
                }`}
                id="toggle-toefl-btn"
              >
                TOEFL iBT
              </button>
              <button
                onClick={() => setActiveExamTab('IELTS')}
                className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  activeExamTab === 'IELTS'
                    ? 'bg-white dark:bg-slate-900 text-terracotta shadow-sm'
                    : 'text-navy/60 dark:text-slate-400 hover:text-navy dark:hover:text-slate-200'
                }`}
                id="toggle-ielts-btn"
              >
                IELTS Band
              </button>
            </div>

            {/* Circular Gauge Focal Point */}
            <div className="flex flex-col items-center py-6" id="exam-gauge-container">
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Path Ring */}
                  <path
                    className="text-navy/5 dark:text-slate-800"
                    strokeWidth="2.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Active Progress Ring */}
                  <path
                    className="text-terracotta transition-all duration-500"
                    strokeDasharray={`${activeExamTab === 'TOEFL' ? toeflPercent : ieltsPercent}, 100`}
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                {/* Center Score Display */}
                <div className="text-center z-10">
                  <span className="text-4xl font-mono font-bold text-burgundy dark:text-rose-400">
                    {activeExamTab === 'TOEFL' ? toeflEst : ieltsEst.toFixed(1)}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-navy/40 dark:text-slate-500 uppercase tracking-widest block mt-0.5">
                    {activeExamTab === 'TOEFL' 
                      ? (t.progressOf120 || 'of 120')
                      : (t.progressOf9 || 'of 9.0')}
                  </span>
                </div>
              </div>
            </div>

            {/* CEFR and Range Labels */}
            <div className="text-center space-y-1 pb-4" id="exam-range-labels">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-terracotta/10 border border-terracotta/10 rounded-full text-xs font-mono font-bold text-terracotta">
                <span>{t.progressEstimated || 'Estimated'}: {avgCefr.code}</span>
                <span className="text-navy/40 dark:text-slate-500">•</span>
                <span>{avgCefr.desc}</span>
              </div>
              <div className="text-xs font-semibold text-navy/70 dark:text-slate-300">
                {t.progressExpectedRange || 'Expected Range'}: <span className="font-bold text-burgundy dark:text-rose-300">{activeExamTab === 'TOEFL' ? `${toeflLow}-${toeflHigh}` : `${ieltsLow.toFixed(1)}-${ieltsHigh.toFixed(1)}`}</span>
              </div>
            </div>

            {/* Supporting Stat Cards Side by Side */}
            <div className="grid grid-cols-2 gap-3 pt-2" id="exam-supporting-stats">
              <div className="bg-cream-card dark:bg-slate-800/40 p-3 rounded-2xl border border-navy/5 dark:border-slate-800/60 flex items-center gap-2.5 min-w-0">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-navy/5 dark:text-slate-800" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-terracotta transition-all duration-500" strokeDasharray={`${completionPercentage}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-mono text-sm sm:text-base font-bold text-burgundy dark:text-rose-300">
                    {completedCount}
                  </div>
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <span className="text-[10px] font-mono font-bold text-navy/50 dark:text-slate-400 uppercase tracking-wider block leading-tight text-wrap">
                    {t.progressExercises || 'Exercises'}
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-burgundy dark:text-rose-400 block whitespace-nowrap">
                    {completedCount} / {totalChapters}
                  </span>
                </div>
              </div>
              
              <div className="bg-cream-card dark:bg-slate-800/40 p-3 rounded-2xl border border-navy/5 dark:border-slate-800/60 flex items-center gap-2.5 min-w-0">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-navy/5 dark:text-slate-800" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-terracotta transition-all duration-500" strokeDasharray={`${Math.round(averageScore)}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-mono text-sm sm:text-base font-bold text-burgundy dark:text-rose-300">
                    {Math.round(averageScore)}%
                  </div>
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <span className="text-[10px] font-mono font-bold text-navy/50 dark:text-slate-400 uppercase tracking-wider block leading-tight text-wrap">
                    {t.skillAverage || 'Skill Average'}
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-burgundy dark:text-rose-400 block whitespace-nowrap">
                    {Math.round(averageScore)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Existing Motivational Disclaimer */}
            <p className="text-[10px] text-navy/40 dark:text-slate-500 leading-relaxed text-center block">
              {uiLanguage === 'RU' 
                ? 'Это мотивационная оценка, основанная на вашем прогрессе в сюжете, а не официальный прогноз баллов. Она не отражает вашу реальную готовность к экзамену.'
                : uiLanguage === 'ES'
                ? 'Esta es una estimación motivacional basada en su progreso en la historia, no una predicción oficial del puntaje. No refleja su preparación real para el examen.'
                : 'This is a motivational estimate based on your in-story progress, not an official score prediction. It does not reflect your actual exam readiness.'}
            </p>
          </div>
        )}
      </div>

      {/* Chapters Timeline Timeline Checklist */}
      <div className="space-y-3" id="chapters-timeline-section">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-navy/70 dark:text-slate-400">
          {t.progressTimelineChecklist || 'Semester Timeline Checklist'}
        </h3>
        
        <div className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-2xl p-4 shadow-sm divide-y divide-navy/5 dark:divide-slate-800" id="timeline-list">
          {chapters.map((ch, idx) => {
            const isCompleted = progress.completedChapterIds.includes(ch.id);
            const isCurrent = progress.currentChapterId === ch.id;
            const isMilestone = isNaN(Number(ch.id)) || ch.id.includes('milestone');

            return (
              <div key={ch.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="pt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-sage" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-terracotta flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse"></span>
                      </div>
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
                            [Special Talk]
                          </span>
                          {ch.title}
                        </span>
                      ) : (
                        `Ch ${ch.id}: ${ch.title}`
                      )}
                    </h4>
                    <p className="text-[10px] text-navy/40 dark:text-slate-500 font-semibold uppercase tracking-tight">
                      {getSkillNameTranslated(ch.skill) || ch.skill} • {getTranslatedLocationName(ch.locationId)}
                    </p>
                  </div>
                </div>

                {isCurrent && (
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider bg-terracotta text-white px-1.5 py-0.5 rounded shadow-sm">
                    {t.progressActiveGoal || 'Active Goal'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-4 pt-1" id="achievements-badges-grid">
          {BADGE_DEFINITIONS.map((badge) => {
            const isEarned = badge.check(progress, chapters);
            const title = getBadgeTitle(badge, t);
            const desc = getBadgeDesc(badge, t);

            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.03 }}
                className={`bg-white dark:bg-slate-900 border ${
                  isEarned
                    ? 'border-terracotta/20 dark:border-terracotta/30 shadow-md'
                    : 'border-navy/5 dark:border-slate-800/60 opacity-70'
                } p-4 rounded-3xl flex flex-col items-center justify-between text-center relative overflow-hidden transition-all h-[200px]`}
              >
                {/* Illustrated Badge Medallion */}
                <div className="relative shrink-0 flex items-center justify-center">
                  <BadgeMedallion badgeId={badge.id} isEarned={isEarned} size="md" />
                  {!isEarned && (
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 p-0.5 rounded-full border border-navy/10 dark:border-slate-800 text-navy/60 dark:text-slate-400">
                      <Lock className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 flex-1 flex flex-col justify-center min-w-0 mt-2">
                  <h4 className={`text-xs font-serif font-bold ${
                    isEarned ? 'text-burgundy dark:text-rose-400' : 'text-navy/50 dark:text-slate-400'
                  } truncate`}>
                    {title}
                  </h4>
                  <p className="text-[10px] text-navy/60 dark:text-slate-300 leading-tight line-clamp-3 font-medium">
                    {desc}
                  </p>
                </div>

                <div className="pt-2 w-full">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                    isEarned
                      ? 'bg-terracotta/10 text-terracotta'
                      : 'bg-navy/5 dark:bg-slate-800 text-navy/40 dark:text-slate-500'
                  }`}>
                    {isEarned ? (t.badgeEarnedAt ? t.badgeEarnedAt.replace('{date}', '') : 'Unlocked') : (t.badgeLocked || 'Locked')}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Exportable Semester Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
            id="report-modal-overlay"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-full flex flex-col items-center max-w-md w-full gap-4 py-6"
            >
              {/* Top Navigation Switcher for Current vs Saved History */}
              <div className="flex bg-white/90 dark:bg-slate-900 p-1 rounded-2xl shadow-md w-full border border-navy/10 dark:border-slate-800 backdrop-blur-xs" id="report-modal-tab-switcher">
                <button
                  type="button"
                  onClick={() => {
                    setReportTab('current');
                    setViewingSnapshot(null);
                  }}
                  className={`flex-1 py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    reportTab === 'current'
                      ? 'bg-burgundy text-white shadow-sm'
                      : 'text-navy/60 dark:text-slate-400 hover:text-navy dark:hover:text-slate-200'
                  }`}
                  id="report-tab-current-btn"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{uiLanguage === 'RU' ? 'Текущий отчет' : (uiLanguage === 'ES' ? 'Reporte Actual' : 'Current Report')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReportTab('history');
                    setViewingSnapshot(null);
                  }}
                  className={`flex-1 py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    reportTab === 'history'
                      ? 'bg-burgundy text-white shadow-sm'
                      : 'text-navy/60 dark:text-slate-400 hover:text-navy dark:hover:text-slate-200'
                  }`}
                  id="report-tab-history-btn"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{uiLanguage === 'RU' ? 'История снимков' : (uiLanguage === 'ES' ? 'Historial de Fotos' : 'Saved History')}</span>
                  {savedSnapshots.length > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                      reportTab === 'history' ? 'bg-white/20 text-white' : 'bg-navy/10 dark:bg-slate-800 text-navy/70 dark:text-slate-300'
                    }`}>
                      {savedSnapshots.length}
                    </span>
                  )}
                </button>
              </div>

              {snapshotSavedToast && (
                <div className="w-full bg-emerald-600 text-white text-xs font-semibold py-2.5 px-4 rounded-2xl text-center shadow-lg flex items-center justify-center gap-2 animate-bounce">
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>{uiLanguage === 'RU' ? 'Снимок успешно сохранен в историю!' : (uiLanguage === 'ES' ? '¡Foto guardada en el historial con éxito!' : 'Snapshot saved to report history!')}</span>
                </div>
              )}

              {reportTab === 'current' && (
                <>
                  {/* Current Report Card (The area to capture) */}
                  <div
                    id="semester-report-card"
                    className="w-full bg-[#fbf9f4] text-[#1a2e40] border-4 border-[#5c1d24] rounded-3xl p-6 shadow-2xl flex flex-col space-y-5"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    {/* Header of Report */}
                    <div className="text-center space-y-1 border-b-2 border-[#5c1d24]/20 pb-4">
                      <span className="text-[10px] font-mono font-bold text-[#c05c46] uppercase tracking-wider block">
                        {uiLanguage === 'RU' ? 'Официальный академический отчет' : (uiLanguage === 'ES' ? 'Registro Académico Oficial' : 'Official Academic Record')}
                      </span>
                      <h2 className="text-2xl font-serif font-bold text-[#5c1d24]">
                        {uiLanguage === 'RU' ? 'СЕМЕСТРОВЫЙ ОТЧЕТ CAMPUS' : (uiLanguage === 'ES' ? 'BOLETA SEMESTRAL CAMPUS' : 'CAMPUS SEMESTER REPORT')}
                      </h2>
                      <p className="text-[10px] text-[#1a2e40]/60 uppercase tracking-widest font-mono font-bold">
                        {uiLanguage === 'RU' ? 'Сюжетная RPG первого семестра по английскому языку' : (uiLanguage === 'ES' ? 'RPG Narrativo de Inglés del Primer Semestre' : 'First Semester English Narrative RPG')}
                      </p>
                    </div>

                    {/* Profile Grid */}
                    <div className="grid grid-cols-2 gap-4 bg-[#5c1d24]/5 p-4 rounded-2xl border border-[#5c1d24]/10 text-xs">
                      <div>
                        <span className="text-[9px] font-mono text-[#1a2e40]/50 uppercase tracking-tight block font-semibold">
                          {uiLanguage === 'RU' ? 'Имя студента' : (uiLanguage === 'ES' ? 'Nombre del Estudiante' : 'Student Name')}
                        </span>
                        <strong className="text-sm font-semibold text-[#1a2e40]">{profile.name || 'Alex'}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-[#1a2e40]/50 uppercase tracking-tight block font-semibold">
                          {uiLanguage === 'RU' ? 'Выбранная специальность' : (uiLanguage === 'ES' ? 'Especialidad Declarada' : 'Declared Major')}
                        </span>
                        <strong className="text-sm font-semibold text-[#1a2e40]">{profile.major || (uiLanguage === 'RU' ? 'Не определено' : (uiLanguage === 'ES' ? 'No Decidido' : 'Undecided'))}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-[#1a2e40]/50 uppercase tracking-tight block font-semibold">
                          {uiLanguage === 'RU' ? 'Общежитие' : (uiLanguage === 'ES' ? 'Residencia' : 'Residence Hall')}
                        </span>
                        <strong className="text-sm font-semibold text-[#1a2e40]">{profile.dorm || 'Elm Hall'}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-[#1a2e40]/50 uppercase tracking-tight block font-semibold">
                          {uiLanguage === 'RU' ? 'Пройдено сценариев' : (uiLanguage === 'ES' ? 'Escenarios Completados' : 'Scenario Completion')}
                        </span>
                        <strong className="text-sm font-semibold text-[#1a2e40]">{completedCount} / {totalChapters} {uiLanguage === 'RU' ? 'глав' : (uiLanguage === 'ES' ? 'capítulos' : 'Chapters')} ({completionPercentage}%)</strong>
                      </div>
                    </div>

                    {/* Skill Score Breakdown */}
                    <div className="space-y-3">
                      <h3 className="text-[10px] uppercase tracking-wider font-bold text-[#1a2e40]/70">
                        {uiLanguage === 'RU' ? 'Академическая компетентность в навыках' : (uiLanguage === 'ES' ? 'Competencia de Habilidades Académicas' : 'Academic Skill Competency')}
                      </h3>
                      <div className="space-y-2">
                        {[SkillType.LISTENING, SkillType.SPEAKING, SkillType.WRITING, SkillType.READING].map((skill) => {
                          const score = progress.skills[skill] || 0;
                          const roundedScore = Math.round(score);
                          const cefr = getCEFRLevel(score);
                          return (
                            <div key={skill} className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#1a2e40]/5 shadow-xs">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-[#1a2e40] uppercase">
                                  {skill === SkillType.LISTENING ? t.listening : (skill === SkillType.SPEAKING ? t.speaking : (skill === SkillType.WRITING ? t.writing : t.reading))}
                                </span>
                                <span className="text-[9px] text-[#1a2e40]/50 font-bold">({cefr.desc})</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-mono font-bold text-[#c05c46]">Score: {roundedScore}</span>
                                <span className="px-1.5 py-0.5 bg-[#c05c46]/10 rounded text-[9px] font-mono font-bold text-[#c05c46]">
                                  {cefr.code}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* TOEFL / IELTS Equivalency Estimates */}
                    <div className="space-y-2 border-t border-[#5c1d24]/10 pt-4">
                      <h3 className="text-[10px] uppercase tracking-wider font-bold text-[#1a2e40]/70 text-center">
                        {uiLanguage === 'RU' ? 'Эквивалент стандартизированного экзамена (оценка)' : (uiLanguage === 'ES' ? 'Equivalencia de Examen Estandarizado (Estimación)' : 'Standardized Exam Equivalency (Estimate)')}
                      </h3>
                      {completedCount < 5 ? (
                        <p className="text-xs text-center text-[#1a2e40]/50 italic">
                          {uiLanguage === 'RU' ? 'Пройдите не менее 5 глав, чтобы разблокировать оценки стандартизированных экзаменов.' : (uiLanguage === 'ES' ? 'Complete al menos 5 capítulos para desbloquear las estimaciones estandarizadas.' : 'Complete at least 5 chapters to unlock standardized estimates.')}
                        </p>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 text-center">
                          <div className="bg-white p-3 rounded-xl border border-[#1a2e40]/5 shadow-xs">
                            <span className="text-[9px] font-mono text-[#1a2e40]/50 uppercase block font-semibold">TOEFL iBT</span>
                            <strong className="text-xl font-mono font-bold text-[#5c1d24]">~{toeflLow}-{toeflHigh}</strong>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-[#1a2e40]/5 shadow-xs">
                            <span className="text-[9px] font-mono text-[#1a2e40]/50 uppercase block font-semibold">IELTS Band</span>
                            <strong className="text-xl font-mono font-bold text-[#5c1d24]">~{ieltsLow.toFixed(1)}-{ieltsHigh.toFixed(1)}</strong>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer of Card */}
                    <div className="border-t border-[#5c1d24]/10 pt-4 text-center space-y-2">
                      <p className="text-[9px] text-[#1a2e40]/50 leading-relaxed italic block">
                        {uiLanguage === 'RU' 
                          ? 'Дисклеймер: Это мотивационная оценка, основанная на вашем прогрессе в сюжете, а не официальный прогноз баллов. Она не отражает вашу реальную готовность к экзамену.'
                          : uiLanguage === 'ES'
                          ? 'Aviso: Esta es una estimación motivacional basada en su progreso en la historia, no una predicción oficial del puntaje. No refleja su preparación real para el examen.'
                          : 'Disclaimer: This is a motivational estimate based on in-story progress, not an official score prediction. It does not reflect actual exam readiness.'}
                      </p>
                      <p className="text-[8px] font-mono font-bold text-[#1a2e40]/40 uppercase tracking-widest block pt-1 border-t border-[#5c1d24]/5">
                        {uiLanguage === 'RU' ? 'Сгенерировано' : (uiLanguage === 'ES' ? 'Generado el' : 'Generated on')} {formattedDate} • Campus App
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2.5 w-full justify-center">
                    <button
                      type="button"
                      onClick={handleSaveSnapshot}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      id="save-report-snapshot-btn"
                    >
                      <Clock className="w-4 h-4" />
                      <span>{uiLanguage === 'RU' ? 'Сохранить снимок' : (uiLanguage === 'ES' ? 'Guardar Foto' : 'Save Snapshot')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="bg-[#c05c46] hover:bg-[#a64a35] text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      id="save-report-img-btn"
                    >
                      <Download className="w-4 h-4" />
                      <span>{uiLanguage === 'RU' ? 'Сохранить как фото' : (uiLanguage === 'ES' ? 'Guardar Imagen' : 'Save Image')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReportModal(false)}
                      className="bg-[#1a2e40] hover:bg-[#0c1822] text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <X className="w-4 h-4" />
                      <span>{uiLanguage === 'RU' ? 'Закрыть' : (uiLanguage === 'ES' ? 'Cerrar' : 'Close')}</span>
                    </button>
                  </div>
                </>
              )}

              {reportTab === 'history' && (
                <div className="w-full flex flex-col items-center space-y-4">
                  {viewingSnapshot ? (
                    <>
                      <div className="w-full flex justify-between items-center">
                        <button
                          type="button"
                          onClick={() => setViewingSnapshot(null)}
                          className="bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 text-navy dark:text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>{uiLanguage === 'RU' ? 'Назад к истории' : (uiLanguage === 'ES' ? 'Volver al Historial' : 'Back to History')}</span>
                        </button>
                        <span className="text-[10px] font-mono font-bold text-navy/50 dark:text-slate-400">
                          {new Date(viewingSnapshot.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Historical Report Card */}
                      <div
                        id="semester-report-card"
                        className="w-full bg-[#fbf9f4] text-[#1a2e40] border-4 border-[#5c1d24] rounded-3xl p-6 shadow-2xl flex flex-col space-y-5"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                      >
                        <div className="text-center space-y-1 border-b-2 border-[#5c1d24]/20 pb-4">
                          <span className="text-[10px] font-mono font-bold text-[#c05c46] uppercase tracking-wider block">
                            {uiLanguage === 'RU' ? 'Исторический архивный отчет' : (uiLanguage === 'ES' ? 'Registro Histórico Archivado' : 'Historical Archived Record')}
                          </span>
                          <h2 className="text-2xl font-serif font-bold text-[#5c1d24]">
                            {uiLanguage === 'RU' ? 'СЕМЕСТРОВЫЙ ОТЧЕТ CAMPUS' : (uiLanguage === 'ES' ? 'BOLETA SEMESTRAL CAMPUS' : 'CAMPUS SEMESTER REPORT')}
                          </h2>
                          <p className="text-[10px] text-[#1a2e40]/60 uppercase tracking-widest font-mono font-bold">
                            Snapshot: {new Date(viewingSnapshot.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-[#5c1d24]/5 p-4 rounded-2xl border border-[#5c1d24]/10 text-xs">
                          <div>
                            <span className="text-[9px] font-mono text-[#1a2e40]/50 uppercase tracking-tight block font-semibold">Student Name</span>
                            <strong className="text-sm font-semibold text-[#1a2e40]">{viewingSnapshot.studentName}</strong>
                          </div>
                          <div>
                            <span className="text-[9px] font-mono text-[#1a2e40]/50 uppercase tracking-tight block font-semibold">Declared Major</span>
                            <strong className="text-sm font-semibold text-[#1a2e40]">{viewingSnapshot.major}</strong>
                          </div>
                          <div>
                            <span className="text-[9px] font-mono text-[#1a2e40]/50 uppercase tracking-tight block font-semibold">Residence Hall</span>
                            <strong className="text-sm font-semibold text-[#1a2e40]">{viewingSnapshot.dorm}</strong>
                          </div>
                          <div>
                            <span className="text-[9px] font-mono text-[#1a2e40]/50 uppercase tracking-tight block font-semibold">Scenario Completion</span>
                            <strong className="text-sm font-semibold text-[#1a2e40]">{viewingSnapshot.completedCount} / {viewingSnapshot.totalChapters} Chapters</strong>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-[10px] uppercase tracking-wider font-bold text-[#1a2e40]/70">Skill Competency</h3>
                          <div className="space-y-2">
                            {[SkillType.LISTENING, SkillType.SPEAKING, SkillType.WRITING, SkillType.READING].map((skill) => {
                              const score = viewingSnapshot.skills?.[skill] || 0;
                              const cefr = getCEFRLevel(score);
                              return (
                                <div key={skill} className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#1a2e40]/5 shadow-xs">
                                  <span className="text-xs font-mono font-bold text-[#1a2e40] uppercase">{skill}</span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono font-bold text-[#c05c46]">Score: {Math.round(score)}</span>
                                    <span className="px-1.5 py-0.5 bg-[#c05c46]/10 rounded text-[9px] font-mono font-bold text-[#c05c46]">{cefr.code}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-center border-t border-[#5c1d24]/10 pt-4">
                          <div className="bg-white p-3 rounded-xl border border-[#1a2e40]/5 shadow-xs">
                            <span className="text-[9px] font-mono text-[#1a2e40]/50 uppercase block font-semibold">TOEFL iBT</span>
                            <strong className="text-xl font-mono font-bold text-[#5c1d24]">~{viewingSnapshot.toeflEst}</strong>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-[#1a2e40]/5 shadow-xs">
                            <span className="text-[9px] font-mono text-[#1a2e40]/50 uppercase block font-semibold">IELTS Band</span>
                            <strong className="text-xl font-mono font-bold text-[#5c1d24]">~{viewingSnapshot.ieltsEst}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full justify-center">
                        <button
                          type="button"
                          onClick={handleSave}
                          className="bg-[#c05c46] hover:bg-[#a64a35] text-white text-xs font-semibold py-3 px-5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                        >
                          <Download className="w-4 h-4" />
                          <span>Save Image</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewingSnapshot(null)}
                          className="bg-[#1a2e40] hover:bg-[#0c1822] text-white text-xs font-semibold py-3 px-5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                        >
                          <X className="w-4 h-4" />
                          <span>Back</span>
                        </button>
                      </div>
                    </>
                  ) : isCampusPlus ? (
                    <div className="w-full space-y-3">
                      <div className="text-center space-y-1 mb-2">
                        <h3 className="text-base font-serif font-bold text-navy dark:text-slate-100">
                          {uiLanguage === 'RU' ? 'Сохраненные академические снимки' : (uiLanguage === 'ES' ? 'Fotos Académicas Guardadas' : 'Saved Academic Snapshots')}
                        </h3>
                        <p className="text-xs text-navy/60 dark:text-slate-400">
                          {uiLanguage === 'RU' ? 'Нажмите на любой снимок, чтобы просмотреть исторический отчет' : (uiLanguage === 'ES' ? 'Toque cualquier foto para ver el reporte histórico' : 'Tap any snapshot to view that historical report card')}
                        </p>
                      </div>

                      {savedSnapshots.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 border border-dashed border-navy/15 dark:border-slate-800 rounded-3xl p-8 text-center space-y-3">
                          <Clock className="w-8 h-8 text-navy/30 dark:text-slate-500 mx-auto" />
                          <p className="text-xs text-navy/60 dark:text-slate-400 max-w-xs mx-auto">
                            {uiLanguage === 'RU' 
                              ? 'Сохраненных снимков пока нет. Перейдите на вкладку «Текущий отчет» и нажмите «Сохранить снимок», чтобы зафиксировать ваш прогресс.' 
                              : (uiLanguage === 'ES'
                              ? 'Aún no hay fotos guardadas. Abra la pestaña "Reporte Actual" y toque "Guardar Foto" para registrar su progreso.'
                              : 'No saved snapshots yet. Open the Current Report tab and tap "Save Snapshot" to record your progress over time.')}
                          </p>
                          <button
                            type="button"
                            onClick={() => setReportTab('current')}
                            className="bg-burgundy text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-sm hover:bg-burgundy/90 cursor-pointer"
                          >
                            Go to Current Report
                          </button>
                        </div>
                      ) : (
                        <div className="w-full space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                          {savedSnapshots.map((snap) => {
                            const dateStr = new Date(snap.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            });
                            const pct = snap.totalChapters > 0 ? Math.round((snap.completedCount / snap.totalChapters) * 100) : 0;

                            return (
                              <div
                                key={snap.id}
                                onClick={() => setViewingSnapshot(snap)}
                                className="bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="space-y-0.5">
                                    <span className="text-[10px] font-mono font-bold text-terracotta uppercase tracking-wider block">
                                      {dateStr}
                                    </span>
                                    <h4 className="text-sm font-serif font-bold text-burgundy dark:text-rose-400 group-hover:text-terracotta transition-colors">
                                      {snap.studentName} • {snap.major}
                                    </h4>
                                    <p className="text-xs text-navy/60 dark:text-slate-400">
                                      {snap.completedCount} / {snap.totalChapters} Chapters ({pct}%)
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteSnapshot(snap.id, e)}
                                    className="p-1.5 rounded-lg text-navy/30 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                                    title="Delete Snapshot"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-navy/5 dark:border-slate-800 text-[10px] font-mono">
                                  <span className="bg-navy/5 dark:bg-slate-800 text-navy dark:text-slate-200 px-2 py-0.5 rounded font-semibold">
                                    TOEFL: ~{snap.toeflEst}
                                  </span>
                                  <span className="bg-navy/5 dark:bg-slate-800 text-navy dark:text-slate-200 px-2 py-0.5 rounded font-semibold">
                                    IELTS: ~{snap.ieltsEst}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Paywall Card for Free Users attempting to view Report History */
                    <div className="w-full bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-slate-900 dark:to-slate-950 border border-amber-300 dark:border-amber-500/40 rounded-3xl p-6 shadow-xl text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white mx-auto flex items-center justify-center shadow-md border border-white/40">
                        <Crown className="w-6 h-6 fill-current text-amber-100" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-base font-serif font-bold text-amber-950 dark:text-amber-200">
                          {uiLanguage === 'RU' ? 'История семестровых отчетов' : (uiLanguage === 'ES' ? 'Historial de Reportes Semestrales' : 'Semester Report History')}
                        </h3>
                        <p className="text-xs text-navy/70 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
                          {uiLanguage === 'RU'
                            ? 'Сохранение и отслеживание нескольких архивных отчетов доступно эксклюзивно для подписчиков Campus Plus.'
                            : (uiLanguage === 'ES'
                            ? 'Guardar y comparar fotos de progreso a lo largo del tiempo es una función exclusiva para suscriptores Campus Plus.'
                            : 'Saving and comparing dated snapshot report cards over time is exclusive to Campus Plus subscribers. Track your skill growth across the semester!')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowReportModal(false);
                          setActiveSubscreenRequest('subscription');
                          setActiveTab('settings');
                        }}
                        className="bg-gradient-to-r from-amber-500 to-terracotta hover:from-amber-600 hover:to-terracotta-dark text-white text-xs font-bold py-3 px-6 rounded-xl shadow-md transition-all cursor-pointer active:scale-95 inline-flex items-center gap-2"
                      >
                        <Crown className="w-4 h-4 fill-current text-amber-100" />
                        <span>Upgrade to Campus Plus</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Practice Selection Overlay Modal */}
      <AnimatePresence>
        {showPracticeSelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
            id="practice-selection-modal"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-cream dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-lg w-full flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-navy/5 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-terracotta uppercase tracking-wider block">{t.progressCompletedExercises || 'Completed Exercises'}</span>
                  <h3 className="text-xl font-serif font-bold text-burgundy dark:text-rose-400">{t.progressAcademicPracticeRoom || 'Academic Practice Room'}</h3>
                </div>
                <button
                  onClick={() => setShowPracticeSelection(false)}
                  className="p-1.5 rounded-full hover:bg-navy/5 dark:hover:bg-slate-800 text-navy/40 dark:text-slate-500 hover:text-navy dark:hover:text-slate-200 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable list of exercises grouped by skill */}
              <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
                {completedCount === 0 ? (
                  <div className="text-center py-10 px-4 bg-white dark:bg-slate-950 rounded-2xl border border-dashed border-navy/10 dark:border-slate-800 space-y-3">
                    <p className="text-xs text-navy/50 dark:text-slate-400 font-medium leading-relaxed">
                      {t.progressNoCompleted || "You haven't completed any scenarios yet. Keep exploring the Campus Map to unlock exercises!"}
                    </p>
                    <button
                      onClick={() => {
                        setShowPracticeSelection(false);
                        setActiveTab('map');
                      }}
                      className="bg-navy hover:bg-navy-light text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-sm transition-all cursor-pointer inline-flex items-center gap-1"
                    >
                      {t.progressGoToMap || 'Go to Map'}
                    </button>
                  </div>
                ) : (
                  (Object.keys(completedBySkill) as SkillType[]).map((skill) => {
                    const skillChs = completedBySkill[skill];
                    if (skillChs.length === 0) return null;

                    return (
                      <div key={skill} className="space-y-2">
                        <div className="flex items-center gap-2 border-b border-navy/5 dark:border-slate-855 pb-1">
                          <div className="p-1 bg-cream-card dark:bg-slate-800 rounded border border-navy/5 dark:border-slate-800 shrink-0">
                            {getSkillIcon(skill)}
                          </div>
                          <h4 className="text-xs font-mono font-bold text-navy dark:text-slate-300 uppercase tracking-wider">
                            {getSkillNameTranslated(skill) || skill} ({skillChs.length})
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {skillChs.map((ch) => (
                            <button
                              key={ch.id}
                              onClick={() => {
                                if (!canUsePracticeMode) {
                                  if (confirm("You've used your 5 free Practice Mode attempts for this week! Would you like to view Campus Plus subscription options for unlimited practice?")) {
                                    setActiveSubscreenRequest('subscription');
                                    setActiveTab('settings');
                                    setShowPracticeSelection(false);
                                    return;
                                  }
                                }
                                recordPracticeAttemptUsed();
                                setPracticeChapterId(ch.id);
                                setSelectedChapterId(ch.id);
                                setIsPracticeMode(true);
                                setActiveTab('story');
                                setShowPracticeSelection(false);
                              }}
                              className="text-left bg-white dark:bg-slate-950 border border-navy/5 dark:border-slate-855 p-3.5 rounded-2xl hover:border-terracotta/40 dark:hover:border-terracotta/40 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between h-24 cursor-pointer"
                            >
                              <div className="space-y-0.5">
                                <span className="text-[9px] font-mono font-bold text-navy/40 dark:text-slate-500 uppercase tracking-tight block">
                                  {isNaN(Number(ch.id)) || ch.id.includes('milestone') ? (
                                    <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500 inline" /> [Special Talk]
                                    </span>
                                  ) : (
                                    `Ch ${ch.id} • ${getTranslatedChapterType(ch.type)}`
                                  )}
                                </span>
                                <h5 className="text-xs font-serif font-bold text-burgundy dark:text-rose-400 leading-snug group-hover:text-terracotta transition-colors line-clamp-2">
                                  {ch.title}
                                </h5>
                              </div>
                              <span className="text-[9px] font-mono font-bold text-navy/50 dark:text-slate-400 uppercase tracking-tight block truncate">
                                📍 {getTranslatedLocationName(ch.locationId)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Info Footer */}
              <div className="border-t border-navy/5 dark:border-slate-800 pt-4 text-center">
                <p className="text-[10px] text-navy/40 dark:text-slate-500 italic leading-relaxed">
                  {t.progressPracticeWarning || 'Practice mode does not increase your completed chapter counts or advance the storyline.'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Official Academic Transcript Modal */}
      <AcademicTranscriptModal
        isOpen={showTranscriptModal}
        onClose={() => setShowTranscriptModal(false)}
      />
    </div>
  );
};
