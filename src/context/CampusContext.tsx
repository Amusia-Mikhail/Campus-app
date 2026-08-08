/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { HeroProfile, UserProgress, SkillType, Chapter } from '../data/models';
import {
  IStoryRepository,
  IUserRepository,
  IProgressRepository,
  SupabaseStoryRepository,
  SupabaseUserRepository,
  SupabaseProgressRepository
} from '../data/repositories';
import {
  isDigitalGoodsSupported,
  queryDigitalGoodsPurchases,
  purchaseViaDigitalGoods,
  PRODUCT_ID_MONTHLY,
  PRODUCT_ID_ANNUAL,
  PRODUCT_ID_REMOVE_ADS
} from '../utils/digitalGoodsBilling';
import { syncPosesFromCompletedChapters } from '../utils/biscuitAlbum';
import { DORM_DECOR_ITEMS } from '../data/dormDecor';

export type TabType = 'home' | 'story' | 'map' | 'progress' | 'settings';

interface CampusContextProps {
  profile: HeroProfile;
  progress: UserProgress;
  isAdmin: boolean;
  equippedDecorIds: string[];
  toggleEquipDecor: (decorId: string) => void;
  unlockAndEquipDecor: (decorId: string) => void;
  autoOpenDecorId: string | null;
  setAutoOpenDecorId: (id: string | null) => void;
  isDecorUnlocked: (decorId: string) => boolean;
  awardRugBadge: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedChapterId: string | null;
  setSelectedChapterId: (id: string | null) => void;
  updateProfile: (updates: Partial<HeroProfile>) => Promise<void>;
  completeChapter: (chapterId: string, isPractice?: boolean) => Promise<void>;
  incrementSkill: (skill: SkillType, amount: number) => Promise<void>;
  incrementFriendship: (npcName: string, amount: number) => Promise<number>;
  completeCoffeeTalk: (friendshipPoints: number) => Promise<number>;
  toggleSaveWord: (wordId: string) => Promise<void>;
  isWordSaved: (wordId: string) => boolean;
  resetProgress: () => void;
  storyRepository: IStoryRepository;
  userRepository: IUserRepository;
  progressRepository: IProgressRepository;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isAuthenticated: boolean;
  loginAsAdmin: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, onboardingDetails: { name: string, major: HeroProfile['major'], dorm: string, examPreference?: string }) => Promise<void>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;

  // New states for error resilience and stale session handling
  isInitialLoading: boolean;
  initialLoadingError: string | null;
  handleRetryInitialLoad: () => void;
  sessionExpired: boolean;
  setSessionExpired: (expired: boolean) => void;
  handleReauthenticate: () => void;
  isOnline: boolean;

  // Practice mode state
  isPracticeMode: boolean;
  setIsPracticeMode: (val: boolean) => void;
  practiceChapterId: string | null;
  setPracticeChapterId: (id: string | null) => void;
  mainStoryCurrentChapter: string;

  // UI Language
  uiLanguage: string;
  setUiLanguage: (lang: string) => void;

  // Sound Effects
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;

  // Onboarding Tour
  isTourActive: boolean;
  startTour: () => void;
  endTour: () => void;

  // Campus Plus Freemium Subscription & Weekly Caps
  isCampusPlus: boolean;
  subscriptionPlan: 'free' | 'monthly' | 'annual';
  hasRemovedAds: boolean;
  buyRemoveAds: () => Promise<{ success: boolean; error?: string }>;
  toggleSandboxRemoveAds: () => void;
  isAdFree: boolean;
  aiGradesUsedThisWeek: number;
  aiGradesFreeLimit: number;
  canUseRealAiGrade: boolean;
  recordAiGradeUsed: () => void;
  practiceAttemptsUsedThisWeek: number;
  practiceAttemptsFreeLimit: number;
  canUsePracticeMode: boolean;
  recordPracticeAttemptUsed: () => void;
  subscribeCampusPlus: (planId?: string) => Promise<{ success: boolean; error?: string }>;
  cancelCampusPlus: () => void;
  toggleSandboxSubscription: () => void;
  openSubscriptionSubscreen: () => void;
  activeSubscreenRequest: string | null;
  setActiveSubscreenRequest: (subscreen: string | null) => void;
  showSubtleSparkleCue: boolean;
  dismissSubtleSparkleCue: () => void;
}

const CampusContext = createContext<CampusContextProps | undefined>(undefined);

// Instantiate repositories
const storyRepo = new SupabaseStoryRepository();
const userRepo = new SupabaseUserRepository();
const progressRepo = new SupabaseProgressRepository() as SupabaseProgressRepository;

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<HeroProfile>({
    name: '',
    major: 'Undecided',
    dorm: 'Elm Hall',
    examPreference: 'TOEFL',
    isOnboarded: false
  });

  const [progress, setProgress] = useState<UserProgress>({
    skills: {
      [SkillType.LISTENING]: 0,
      [SkillType.SPEAKING]: 0,
      [SkillType.WRITING]: 0,
      [SkillType.READING]: 0
    },
    completedChapterIds: [],
    currentChapterId: '1',
    friendshipPoints: {}
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>('1');
  const [isPracticeMode, setIsPracticeModeState] = useState<boolean>(false);
  const [practiceChapterId, setPracticeChapterId] = useState<string | null>(null);

  const numericCompletedChapters = (progress.completedChapterIds || [])
    .filter((id) => !isNaN(Number(id)))
    .map(Number);
  const highestNumericChapter = numericCompletedChapters.length > 0 ? Math.max(...numericCompletedChapters) : 0;
  const mainStoryCurrentChapterNum = Math.min(50, highestNumericChapter + 1);
  const mainStoryCurrentChapter = String(mainStoryCurrentChapterNum);

  const setIsPracticeMode = (val: boolean) => {
    setIsPracticeModeState(val);
    if (!val) {
      setPracticeChapterId(null);
      setSelectedChapterId(mainStoryCurrentChapter);
    }
  };
  const [darkMode, setDarkModeState] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('campus_auth_token'));

  // UI Language State
  const [uiLanguage, setUiLanguageState] = useState<string>(() => {
    return localStorage.getItem('campus_ui_language') || 'EN';
  });

  const setUiLanguage = (lang: string) => {
    setUiLanguageState(lang);
    localStorage.setItem('campus_ui_language', lang);
  };

  // Sound Effects State
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    return localStorage.getItem('campus_sound_effects') !== 'false';
  });

  const setSoundEnabled = (val: boolean) => {
    setSoundEnabledState(val);
    localStorage.setItem('campus_sound_effects', String(val));
  };

  // Onboarding Tour State
  const [isTourActive, setIsTourActive] = useState<boolean>(false);

  const startTour = () => {
    setIsTourActive(true);
    setActiveTab('home');
  };

  const endTour = () => {
    setIsTourActive(false);
    localStorage.removeItem('campus_should_start_tour');
    if (profile.name) {
      localStorage.setItem(`campus_tour_completed_${profile.name}`, 'true');
    } else {
      localStorage.setItem('campus_tour_completed', 'true');
    }
  };

  // Campus Plus Freemium Subscription & Weekly Caps State
  const FREE_AI_GRADES_LIMIT = 5;
  const FREE_PRACTICE_LIMIT = 5;

  const [isCampusPlus, setIsCampusPlus] = useState<boolean>(() => {
    return localStorage.getItem('campus_plus_subscribed') === 'true';
  });

  const [hasRemovedAds, setHasRemovedAds] = useState<boolean>(() => {
    return localStorage.getItem('campus_remove_ads_purchased') === 'true';
  });

  const [subscriptionPlan, setSubscriptionPlan] = useState<'free' | 'monthly' | 'annual'>(() => {
    return (localStorage.getItem('campus_plus_plan') as any) || 'free';
  });

  const [aiGradesUsedThisWeek, setAiGradesUsedThisWeek] = useState<number>(() => {
    return Number(localStorage.getItem('campus_weekly_ai_grades') || 0);
  });

  const [practiceAttemptsUsedThisWeek, setPracticeAttemptsUsedThisWeek] = useState<number>(() => {
    return Number(localStorage.getItem('campus_weekly_practice_attempts') || 0);
  });

  const [activeSubscreenRequest, setActiveSubscreenRequest] = useState<string | null>(null);

  // Weekly counter reset check (resets every 7 days)
  useEffect(() => {
    const checkWeeklyReset = () => {
      const lastResetStr = localStorage.getItem('campus_weekly_last_reset');
      const now = Date.now();
      const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
      if (!lastResetStr || (now - new Date(lastResetStr).getTime() > SEVEN_DAYS_MS)) {
        setAiGradesUsedThisWeek(0);
        setPracticeAttemptsUsedThisWeek(0);
        localStorage.setItem('campus_weekly_ai_grades', '0');
        localStorage.setItem('campus_weekly_practice_attempts', '0');
        localStorage.setItem('campus_weekly_last_reset', new Date().toISOString());
      }
    };
    checkWeeklyReset();
  }, []);

  // Digital Goods API Entitlement query on load
  useEffect(() => {
    const checkDigitalGoodsEntitlements = async () => {
      if (isDigitalGoodsSupported()) {
        try {
          const purchases = await queryDigitalGoodsPurchases();
          if (purchases.includes(PRODUCT_ID_MONTHLY) || purchases.includes(PRODUCT_ID_ANNUAL)) {
            setIsCampusPlus(true);
            const plan = purchases.includes(PRODUCT_ID_ANNUAL) ? 'annual' : 'monthly';
            setSubscriptionPlan(plan);
            localStorage.setItem('campus_plus_subscribed', 'true');
            localStorage.setItem('campus_plus_plan', plan);
          }
          if (purchases.includes(PRODUCT_ID_REMOVE_ADS)) {
            setHasRemovedAds(true);
            localStorage.setItem('campus_remove_ads_purchased', 'true');
          }
        } catch (err) {
          console.warn('[CampusContext] Digital Goods purchase query warning:', err);
        }
      }
    };
    checkDigitalGoodsEntitlements();
  }, []);

  const isAdFree = isCampusPlus || hasRemovedAds;

  const buyRemoveAds = async (): Promise<{ success: boolean; error?: string }> => {
    const result = await purchaseViaDigitalGoods(PRODUCT_ID_REMOVE_ADS);
    if (result.success) {
      setHasRemovedAds(true);
      localStorage.setItem('campus_remove_ads_purchased', 'true');
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const toggleSandboxRemoveAds = () => {
    setHasRemovedAds((prev) => {
      const next = !prev;
      localStorage.setItem('campus_remove_ads_purchased', next ? 'true' : 'false');
      return next;
    });
  };

  const canUseRealAiGrade = isCampusPlus || aiGradesUsedThisWeek < FREE_AI_GRADES_LIMIT;
  const canUsePracticeMode = isCampusPlus || practiceAttemptsUsedThisWeek < FREE_PRACTICE_LIMIT;

  const recordAiGradeUsed = () => {
    if (!isCampusPlus) {
      setAiGradesUsedThisWeek((prev) => {
        const next = prev + 1;
        localStorage.setItem('campus_weekly_ai_grades', String(next));
        return next;
      });
    }
  };

  const recordPracticeAttemptUsed = () => {
    if (!isCampusPlus) {
      setPracticeAttemptsUsedThisWeek((prev) => {
        const next = prev + 1;
        localStorage.setItem('campus_weekly_practice_attempts', String(next));
        return next;
      });
    }
  };

  const [showSubtleSparkleCue, setShowSubtleSparkleCue] = useState<boolean>(false);
  const dismissSubtleSparkleCue = () => setShowSubtleSparkleCue(false);

  const subscribeCampusPlus = async (planId: string = PRODUCT_ID_MONTHLY): Promise<{ success: boolean; error?: string }> => {
    const result = await purchaseViaDigitalGoods(planId);
    if (result.success) {
      setIsCampusPlus(true);
      const plan = planId === PRODUCT_ID_ANNUAL ? 'annual' : 'monthly';
      setSubscriptionPlan(plan);
      localStorage.setItem('campus_plus_subscribed', 'true');
      localStorage.setItem('campus_plus_plan', plan);
      syncPosesFromCompletedChapters(progress.completedChapterIds || [], true, progress.encounteredPoses || []);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const cancelCampusPlus = () => {
    setIsCampusPlus(false);
    setSubscriptionPlan('free');
    localStorage.setItem('campus_plus_subscribed', 'false');
    localStorage.setItem('campus_plus_plan', 'free');
  };

  const toggleSandboxSubscription = () => {
    if (isCampusPlus) {
      cancelCampusPlus();
    } else {
      setIsCampusPlus(true);
      setSubscriptionPlan('monthly');
      localStorage.setItem('campus_plus_subscribed', 'true');
      localStorage.setItem('campus_plus_plan', 'monthly');
      syncPosesFromCompletedChapters(progress.completedChapterIds || [], true, progress.encounteredPoses || []);
    }
  };

  const openSubscriptionSubscreen = () => {
    setActiveSubscreenRequest('subscription');
    setActiveTab('settings');
  };

  // New Loading, Error, and Session Expiry states
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(!!localStorage.getItem('campus_auth_token'));
  const [initialLoadingError, setInitialLoadingError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);
  const [retryTrigger, setRetryTrigger] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetryInitialLoad = () => {
    setRetryTrigger(prev => prev + 1);
  };

  const handleStaleSession = () => {
    setSessionExpired(true);
  };

  const logSessionState = () => {
    const token = localStorage.getItem('campus_auth_token');
    const refreshToken = localStorage.getItem('campus_refresh_token');
    const expiresAtStr = localStorage.getItem('campus_token_expires_at');
    
    if (!token) {
      console.warn('[Session Logger] No campus_auth_token found in localStorage.');
      return;
    }
    
    const expiresAt = expiresAtStr ? Number(expiresAtStr) : null;
    const now = Math.floor(Date.now() / 1000);
    const isValid = expiresAt ? expiresAt > now : false;
    const humanReadableExpiry = expiresAt ? new Date(expiresAt * 1000).toISOString() : 'Unknown';
    
    console.warn(`[Session Logger] ERROR STATE TRIGGERED! Stored Session State:`);
    console.warn(` - Access Token: ${token.substring(0, 10)}... (Length: ${token.length})`);
    console.warn(` - Refresh Token: ${refreshToken ? refreshToken.substring(0, 10) + '... (Length: ' + refreshToken.length + ')' : 'None'}`);
    console.warn(` - Expiry Timestamp: ${expiresAt} (${humanReadableExpiry})`);
    console.warn(` - Current Time: ${now} (${new Date(now * 1000).toISOString()})`);
    console.warn(` - Is Token Valid by Expiry check?: ${isValid}`);
  };

  const attemptTokenRefresh = async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem('campus_refresh_token');
    if (!refreshToken) {
      console.warn('[Session Refresh] Cannot refresh token: No campus_refresh_token found.');
      return false;
    }
    
    console.log('[Session Refresh] Attempting automatic silent refresh...');
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
      
      if (!response.ok) {
        console.error('[Session Refresh] Silent refresh request failed:', response.status);
        return false;
      }
      
      const data = await response.json();
      if (data.session && data.session.access_token) {
        console.log('[Session Refresh] Silent refresh succeeded. Updating tokens.');
        localStorage.setItem('campus_auth_token', data.session.access_token);
        if (data.session.refresh_token) {
          localStorage.setItem('campus_refresh_token', data.session.refresh_token);
        }
        localStorage.setItem(
          'campus_token_expires_at', 
          String(data.session.expires_at || (Math.floor(Date.now() / 1000) + data.session.expires_in))
        );
        setIsAuthenticated(true);
        setSessionExpired(false);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[Session Refresh] Silent refresh encountered an error:', err);
      return false;
    }
  };

  const handleReauthenticate = () => {
    setSessionExpired(false);
    logout();
  };

  const logout = () => {
    localStorage.removeItem('campus_auth_token');
    localStorage.removeItem('campus_refresh_token');
    localStorage.removeItem('campus_token_expires_at');
    localStorage.removeItem('campus_hero_profile');
    localStorage.removeItem('campus_user_progress');
    setIsAuthenticated(false);
    setIsPracticeMode(false);
    setProfile({
      name: '',
      major: 'Undecided',
      dorm: 'Elm Hall',
      isOnboarded: false
    });
    setProgress({
      skills: {
        [SkillType.LISTENING]: 0,
        [SkillType.SPEAKING]: 0,
        [SkillType.WRITING]: 0,
        [SkillType.READING]: 0
      },
      completedChapterIds: [],
      currentChapterId: '1',
      friendshipPoints: {}
    });
  };

  const toggleSaveWord = async (wordId: string) => {
    const currentSaved = progress.savedWordIds || [];
    const exists = currentSaved.includes(wordId);
    const updatedSaved = exists
      ? currentSaved.filter((id) => id !== wordId)
      : [...currentSaved, wordId];

    const updatedProgress = { ...progress, savedWordIds: updatedSaved };
    setProgress(updatedProgress);
    localStorage.setItem('campus_user_progress', JSON.stringify(updatedProgress));

    try {
      await progressRepo.updateProgress({ savedWordIds: updatedSaved });
    } catch (e) {
      console.error('Failed to update progress repository for saved words:', e);
    }
  };

  const isWordSaved = (wordId: string): boolean => {
    return (progress.savedWordIds || []).includes(wordId);
  };

  const syncProgressCurrentChapter = (p: UserProgress, isPracticeModeActive?: boolean): UserProgress => {
    const numericCompletedChapters = (p.completedChapterIds || [])
      .filter((id) => !isNaN(Number(id)))
      .map(Number);
    const highestNumericChapter = numericCompletedChapters.length > 0 ? Math.max(...numericCompletedChapters) : 0;
    const currentStoryChapter = Math.min(50, highestNumericChapter + 1);
    return {
      ...p,
      currentChapterId: String(currentStoryChapter)
    };
  };

  const locationIdByNum: Record<number, string> = {
    1: 'dorm',
    2: 'lecture_hall',
    3: 'seminar_room',
    4: 'writing_center',
    5: 'library',
    6: 'dining_hall',
    7: 'student_union',
    8: 'science_lab',
    9: 'career_center',
    10: 'quad'
  };

  const reconcileProgressDecor = (p: UserProgress): UserProgress => {
    const completedChapters = p.completedChapterIds || [];
    const numericCompleted = completedChapters.map(Number).filter((n) => !isNaN(n));
    const maxCompleted = numericCompleted.length > 0 ? Math.max(...numericCompleted) : 0;
    
    let completedLocationsCount = Math.floor(maxCompleted / 5);
    for (let locNum = 1; locNum <= 10; locNum++) {
      if (completedChapters.includes(String(locNum * 5)) && locNum > completedLocationsCount) {
        completedLocationsCount = locNum;
      }
    }

    let savedLocIds = p.completedLocationIds || [];
    try {
      const rawLocal = localStorage.getItem('campus_completed_location_ids');
      if (rawLocal) {
        const parsed = JSON.parse(rawLocal);
        if (Array.isArray(parsed)) {
          savedLocIds = Array.from(new Set([...savedLocIds, ...parsed]));
        }
      }
    } catch (e) {
      console.error('Failed to parse campus_completed_location_ids:', e);
    }

    if (savedLocIds.length > completedLocationsCount) {
      completedLocationsCount = savedLocIds.length;
    }

    const newLocIds = [...savedLocIds];
    for (let i = 1; i <= completedLocationsCount; i++) {
      const locId = locationIdByNum[i];
      if (locId && !newLocIds.includes(locId)) {
        newLocIds.push(locId);
      }
    }

    const currentUnlocked = p.unlockedDecorIds || [];
    const newlyUnlocked: string[] = [];
    DORM_DECOR_ITEMS.forEach((item) => {
      const reqLocId = item.requiredLocationId || (item.requiredLocationsCompleted ? locationIdByNum[item.requiredLocationsCompleted] : undefined);
      if (
        item.unlockedByDefault ||
        (item.requiredLocationsCompleted && completedLocationsCount >= item.requiredLocationsCompleted) ||
        (reqLocId && newLocIds.includes(reqLocId))
      ) {
        if (!currentUnlocked.includes(item.id)) {
          newlyUnlocked.push(item.id);
        }
      }
    });

    const reconciledUnlocked = Array.from(new Set([...currentUnlocked, ...newlyUnlocked]));

    try {
      localStorage.setItem('campus_completed_location_ids', JSON.stringify(newLocIds));
    } catch (e) {
      console.error('Failed to update campus_completed_location_ids in localStorage:', e);
    }

    return {
      ...p,
      completedLocationIds: newLocIds,
      unlockedDecorIds: reconciledUnlocked
    };
  };

  const isAdmin = profile.name === 'Dev Admin' || !!profile.isAdmin;

  const isDecorUnlocked = (decorId: string): boolean => {
    if (isAdmin) return true;
    const item = DORM_DECOR_ITEMS.find((d) => 
      d.id === decorId ||
      (d.id === 'monstera' && decorId === 'plant') ||
      (d.id === 'mountain_frame' && decorId === 'poster_mountain') ||
      (d.id === 'edinburgh_poster' && decorId === 'poster_edinburgh')
    );
    if (!item) return false;
    if (item.unlockedByDefault || item.isUnlocked) return true;
    const unlockedList = progress.unlockedDecorIds || [];
    if (unlockedList.includes(decorId) || unlockedList.includes(item.id)) {
      return true;
    }

    const completedLocationIds = progress.completedLocationIds || [];
    const reqLocId = item.requiredLocationId || (item.requiredLocationsCompleted ? locationIdByNum[item.requiredLocationsCompleted] : undefined);
    if (reqLocId && completedLocationIds.includes(reqLocId)) {
      return true;
    }

    const completedChapters = progress.completedChapterIds || [];
    const numericCompleted = completedChapters.map(Number).filter((n) => !isNaN(n));
    const maxCompleted = numericCompleted.length > 0 ? Math.max(...numericCompleted) : 0;
    let count = Math.floor(maxCompleted / 5);
    for (let locNum = 1; locNum <= 10; locNum++) {
      if (completedChapters.includes(String(locNum * 5)) && locNum > count) {
        count = locNum;
      }
    }
    if (completedLocationIds.length > count) {
      count = completedLocationIds.length;
    }
    if (item.requiredLocationsCompleted) {
      return count >= item.requiredLocationsCompleted;
    }
    return false;
  };

  const defaultDecorIds = useMemo(() => ['corkboard', 'backpack', 'mug', 'monstera', 'mountain_frame', 'owl', 'edinburgh_poster'], []);
  const equippedDecorIds = useMemo(() => {
    return (progress.equippedDecorIds ?? defaultDecorIds).map(id => {
      if (id === 'plant') return 'monstera';
      if (id === 'poster_mountain') return 'mountain_frame';
      if (id === 'poster_edinburgh') return 'edinburgh_poster';
      return id;
    });
  }, [progress.equippedDecorIds, defaultDecorIds]);

  const [autoOpenDecorId, setAutoOpenDecorId] = useState<string | null>(null);

  const toggleEquipDecor = (decorId: string) => {
    const currentEquipped = progress.equippedDecorIds ?? defaultDecorIds;
    let updated: string[];
    if (currentEquipped.includes(decorId)) {
      updated = currentEquipped.filter((id) => id !== decorId);
    } else {
      updated = [...currentEquipped, decorId];
    }
    const updatedProgress = { ...progress, equippedDecorIds: updated };
    setProgress(updatedProgress);
    localStorage.setItem('campus_user_progress', JSON.stringify(updatedProgress));
  };

  const unlockAndEquipDecor = (decorId: string) => {
    const item = DORM_DECOR_ITEMS.find((d) => 
      d.id === decorId ||
      (d.id === 'monstera' && decorId === 'plant') ||
      (d.id === 'mountain_frame' && decorId === 'poster_mountain') ||
      (d.id === 'edinburgh_poster' && decorId === 'poster_edinburgh')
    );
    const actualId = item ? item.id : decorId;

    const currentUnlocked = progress.unlockedDecorIds ?? [];
    const currentEquipped = progress.equippedDecorIds ?? defaultDecorIds;

    const nextUnlocked = Array.from(new Set([...currentUnlocked, actualId]));
    const nextEquipped = Array.from(new Set([...currentEquipped, actualId]));

    let currentLocIds = progress.completedLocationIds ?? [];
    const reqLocId = item?.requiredLocationId || (item?.requiredLocationsCompleted ? locationIdByNum[item.requiredLocationsCompleted] : undefined);
    if (reqLocId && !currentLocIds.includes(reqLocId)) {
      currentLocIds = [...currentLocIds, reqLocId];
    }

    let updatedProgress: UserProgress = {
      ...progress,
      unlockedDecorIds: nextUnlocked,
      equippedDecorIds: nextEquipped,
      completedLocationIds: currentLocIds
    };

    updatedProgress = reconcileProgressDecor(updatedProgress);

    setProgress(updatedProgress);
    localStorage.setItem('campus_user_progress', JSON.stringify(updatedProgress));
    try {
      progressRepo.updateProgress(updatedProgress);
    } catch (e) {
      console.error('[unlockAndEquipDecor] Error updating progress repository:', e);
    }
  };

  const awardRugBadge = () => {
    localStorage.setItem('campus_badge_rug_investigator', 'true');
    const updatedProgress = { ...progress, rugInvestigated: true };
    setProgress(updatedProgress);
    localStorage.setItem('campus_user_progress', JSON.stringify(updatedProgress));
  };

  const loginAsAdmin = () => {
    const adminProfile: HeroProfile = {
      name: 'Dev Admin',
      major: 'Business',
      dorm: 'Elm Hall',
      examPreference: 'TOEFL',
      isOnboarded: true,
      email: 'admin@campus.edu',
      isAdmin: true
    };
    const adminProgress: UserProgress = {
      skills: {
        [SkillType.LISTENING]: 90,
        [SkillType.SPEAKING]: 80,
        [SkillType.WRITING]: 85,
        [SkillType.READING]: 85
      },
      completedChapterIds: Array.from({ length: 50 }, (_, i) => String(i + 1)),
      currentChapterId: '50',
      friendshipPoints: { 'Jordan': 100, 'Maya': 100, 'Alex': 100, 'Professor Evans': 100 },
      savedWordIds: []
    };

    setProfile(adminProfile);
    setProgress(adminProgress);
    setSelectedChapterId('50');
    setIsAuthenticated(true);
    setSessionExpired(false);
    setActiveTab('home');
  };

  const createLocalSession = (
    email: string,
    onboardingDetails: { name: string; major: HeroProfile['major']; dorm: string; examPreference?: string }
  ) => {
    const localToken = 'local_session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    const localProfile: HeroProfile = {
      name: onboardingDetails.name || 'Hero',
      major: onboardingDetails.major || 'Undecided',
      dorm: onboardingDetails.dorm || 'Elm Hall',
      examPreference: (onboardingDetails.examPreference as any) || 'TOEFL',
      isOnboarded: true,
      email: email || 'student@campus.edu'
    };
    const localProgress: UserProgress = {
      skills: {
        [SkillType.LISTENING]: 0,
        [SkillType.SPEAKING]: 0,
        [SkillType.WRITING]: 0,
        [SkillType.READING]: 0
      },
      completedChapterIds: [],
      currentChapterId: '1',
      friendshipPoints: {}
    };

    localStorage.setItem('campus_auth_token', localToken);
    localStorage.setItem('campus_token_expires_at', String(Math.floor(Date.now() / 1000) + 86400 * 30));
    localStorage.setItem('campus_hero_profile', JSON.stringify(localProfile));
    localStorage.setItem('campus_user_progress', JSON.stringify(localProgress));

    setProfile(localProfile);
    setProgress(localProgress);
    setSelectedChapterId('1');
    setIsAuthenticated(true);
    setSessionExpired(false);

    localStorage.setItem('campus_should_start_tour', 'true');
    setIsTourActive(true);
  };

  const login = async (email: string, password: string) => {
    if (email.trim().toLowerCase() === 'admin@campus.edu') {
      loginAsAdmin();
      return;
    }

    const savedProfile = localStorage.getItem('campus_hero_profile');
    let onboardingDetails: any = {};
    if (savedProfile) {
      try { onboardingDetails = JSON.parse(savedProfile); } catch (e) {}
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: onboardingDetails.name,
          major: onboardingDetails.major,
          dorm: onboardingDetails.dorm
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.error || '';
        if (errMsg.toLowerCase().includes('invalid login credentials') || errMsg.toLowerCase().includes('user not found')) {
          throw new Error(errMsg || 'Invalid email or password.');
        }
        console.warn('[Login API Warning] Remote login failed, creating local session fallback:', errMsg);
        createLocalSession(email, {
          name: onboardingDetails.name || email.split('@')[0] || 'Student',
          major: onboardingDetails.major || 'Undecided',
          dorm: onboardingDetails.dorm || 'Elm Hall'
        });
        return;
      }

      const data = await response.json();
      if (data.session && data.session.access_token) {
        localStorage.setItem('campus_auth_token', data.session.access_token);
        if (data.session.refresh_token) {
          localStorage.setItem('campus_refresh_token', data.session.refresh_token);
        }
        localStorage.setItem(
          'campus_token_expires_at', 
          String(data.session.expires_at || (Math.floor(Date.now() / 1000) + data.session.expires_in))
        );
        localStorage.setItem('campus_hero_profile', JSON.stringify(data.profile));
        localStorage.setItem('campus_user_progress', JSON.stringify(data.progress));
        
        setProfile(data.profile);
        setProgress(data.progress);
        setSelectedChapterId(data.progress.currentChapterId || '1');
        setIsAuthenticated(true);
        setSessionExpired(false);
      } else {
        createLocalSession(email, {
          name: onboardingDetails.name || email.split('@')[0] || 'Student',
          major: onboardingDetails.major || 'Undecided',
          dorm: onboardingDetails.dorm || 'Elm Hall'
        });
      }
    } catch (err: any) {
      const msg = (err.message || '').toLowerCase();
      if (msg.includes('invalid email') || msg.includes('invalid login credentials') || msg.includes('user not found')) {
        throw err;
      }
      console.warn('[Login Error] Remote login failed, creating local session fallback:', err);
      createLocalSession(email, {
        name: onboardingDetails.name || email.split('@')[0] || 'Student',
        major: onboardingDetails.major || 'Undecided',
        dorm: onboardingDetails.dorm || 'Elm Hall'
      });
    }
  };

  const signup = async (email: string, password: string, onboardingDetails: { name: string, major: HeroProfile['major'], dorm: string, examPreference?: string }) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          ...onboardingDetails
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.error || response.statusText;
        console.warn('[Signup API Warning] Remote signup endpoint returned error:', errMsg);
        createLocalSession(email, onboardingDetails);
        return;
      }

      const data = await response.json();
      if (data.session && data.session.access_token) {
        localStorage.setItem('campus_auth_token', data.session.access_token);
        if (data.session.refresh_token) {
          localStorage.setItem('campus_refresh_token', data.session.refresh_token);
        }
        localStorage.setItem(
          'campus_token_expires_at', 
          String(data.session.expires_at || (Math.floor(Date.now() / 1000) + data.session.expires_in))
        );
        localStorage.setItem('campus_hero_profile', JSON.stringify(data.profile));
        localStorage.setItem('campus_user_progress', JSON.stringify(data.progress));
        
        setProfile(data.profile);
        setProgress(data.progress);
        setSelectedChapterId(data.progress.currentChapterId || '1');
        setIsAuthenticated(true);
        setSessionExpired(false);

        // Trigger first-time tour on successful new user signup
        localStorage.setItem('campus_should_start_tour', 'true');
        setIsTourActive(true);
      } else {
        createLocalSession(email, onboardingDetails);
      }
    } catch (err: any) {
      console.warn('[Signup Error] Supabase or network failure during account creation. Creating local session:', err);
      createLocalSession(email, onboardingDetails);
    }
  };

  // Load initial values from repositories
  useEffect(() => {
    const loadInitialData = async () => {
      const token = localStorage.getItem('campus_auth_token');
      if (token) {
        setIsAuthenticated(true);
        setIsInitialLoading(true);
        setInitialLoadingError(null);
        try {
          const expiresAtStr = localStorage.getItem('campus_token_expires_at');
          const now = Math.floor(Date.now() / 1000);
          const isExpired = expiresAtStr ? (Number(expiresAtStr) - 10) < now : true;

          if (isExpired) {
            console.log('[Initial Load] Stored session is expired or close to expiring. Trying silent refresh...');
            const refreshSuccess = await attemptTokenRefresh();
            if (!refreshSuccess) {
              console.error('[Initial Load] Silent refresh failed on expired token.');
              logSessionState();
              setInitialLoadingError('Your session has expired. Please sign in again.');
              handleStaleSession();
              setIsInitialLoading(false);
              return;
            }
          }

          const uProfile = await userRepo.getProfile();
          const uProgress = await progressRepo.getProgress();
          const reconciledProgress = reconcileProgressDecor(uProgress);
          setProfile(uProfile);
          setProgress(reconciledProgress);
          setSelectedChapterId(reconciledProgress.currentChapterId || '1');
        } catch (e: any) {
          console.error('Failed to load initial Supabase data:', e);
          if (e.message === 'STALE_SESSION' || e.message?.includes('expired') || e.message?.includes('invalid')) {
            console.log('[Initial Load] Stale session caught during profile/progress fetch. Attempting recovery refresh...');
            const refreshSuccess = await attemptTokenRefresh();
            if (refreshSuccess) {
              try {
                const uProfile = await userRepo.getProfile();
                const uProgress = await progressRepo.getProgress();
                const reconciledProgress = reconcileProgressDecor(uProgress);
                setProfile(uProfile);
                setProgress(reconciledProgress);
                setSelectedChapterId(reconciledProgress.currentChapterId || '1');
                setIsInitialLoading(false);
                return;
              } catch (retryError) {
                console.error('[Initial Load] Fetch retry failed:', retryError);
              }
            }
            logSessionState();
            setInitialLoadingError('Your session has expired. Please sign in again.');
            handleStaleSession();
          } else {
            const cachedProfile = localStorage.getItem('campus_hero_profile');
            const cachedProgress = localStorage.getItem('campus_user_progress');
            if (cachedProfile && cachedProgress) {
              console.log('[Initial Load] Fetch failed due to network error, but found cached offline data. Loading from local cache.');
              try {
                setProfile(JSON.parse(cachedProfile));
                const parsedProg = JSON.parse(cachedProgress);
                const reconciledProgress = reconcileProgressDecor(parsedProg);
                setProgress(reconciledProgress);
                setSelectedChapterId(reconciledProgress.currentChapterId || '1');
              } catch (parseError) {
                console.error('[Initial Load] Failed to parse cached local data:', parseError);
                setInitialLoadingError('Failed to connect to the campus servers. Please check your network and try again.');
              }
            } else {
              setInitialLoadingError('Failed to connect to the campus servers. Please check your network and try again.');
            }
          }
        } finally {
          setIsInitialLoading(false);
        }
      } else {
        setIsAuthenticated(false);
        setIsInitialLoading(false);
      }

      // Initialize dark mode from localStorage if present
      const savedDark = localStorage.getItem('campus_dark_mode');
      if (savedDark === 'true') {
        setDarkModeState(true);
        document.documentElement.classList.add('dark');
      } else {
        setDarkModeState(false);
        document.documentElement.classList.remove('dark');
      }
    };
    loadInitialData();

    // Subscribe to progress repo changes
    const unsubscribe = progressRepo.subscribe(async () => {
      const token = localStorage.getItem('campus_auth_token');
      if (token) {
        try {
          const p = await progressRepo.getProgress();
          const reconciled = reconcileProgressDecor(p);
          setProgress(reconciled);
        } catch (e: any) {
          if (e.message === 'STALE_SESSION') {
            handleStaleSession();
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isAuthenticated, retryTrigger]);

  const setDarkMode = (val: boolean) => {
    setDarkModeState(val);
    if (val) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('campus_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('campus_dark_mode', 'false');
    }
  };

  const updateProfile = async (updates: Partial<HeroProfile>) => {
    try {
      const updated = await userRepo.updateProfile(updates);
      setProfile(updated);
    } catch (e: any) {
      if (e.message === 'STALE_SESSION') {
        const refreshSuccess = await attemptTokenRefresh();
        if (refreshSuccess) {
          try {
            const updated = await userRepo.updateProfile(updates);
            setProfile(updated);
            return;
          } catch (retryError) {
            console.error('[updateProfile] Retry failed:', retryError);
          }
        }
        handleStaleSession();
      } else {
        throw e;
      }
    }
  };

  const completeChapter = async (chapterId: string, isPractice?: boolean) => {
    const isPrac = isPracticeMode || isPractice;
    if (isPrac) {
      console.log('[completeChapter] Practice attempt finished. Main story progress remains untouched.');
      return;
    }

    try {
      // Check for night owl badge condition (dark mode and after 10 PM / before 5 AM)
      if (darkMode) {
        const hour = new Date().getHours();
        if (hour >= 22 || hour < 5) {
          localStorage.setItem('campus_badge_night_owl', 'true');
        }
      }
      const rawProgress = await progressRepo.completeChapter(chapterId);
      let updatedProgress = syncProgressCurrentChapter(rawProgress, false);

      const endOfLocationMap: Record<string, string> = {
        '5': 'dorm',
        '10': 'lecture_hall',
        '15': 'seminar_room',
        '20': 'writing_center',
        '25': 'library',
        '30': 'dining_hall',
        '35': 'student_union',
        '40': 'science_lab',
        '45': 'career_center',
        '50': 'quad'
      };
      const completedLoc = endOfLocationMap[chapterId];
      if (completedLoc) {
        const curLocs = updatedProgress.completedLocationIds || [];
        if (!curLocs.includes(completedLoc)) {
          updatedProgress = {
            ...updatedProgress,
            completedLocationIds: Array.from(new Set([...curLocs, completedLoc]))
          };
        }
      }

      const decorForChapter: Record<string, string> = {
        '5': 'backpack',
        '10': 'mug',
        '15': 'corkboard',
        '20': 'owl',
        '25': 'monstera',
        '30': 'mountain_frame',
        '35': 'edinburgh_poster'
      };
      const newlyUnlockedDecor = decorForChapter[chapterId];
      if (newlyUnlockedDecor) {
        const currentUnlocked = updatedProgress.unlockedDecorIds || [];
        if (!currentUnlocked.includes(newlyUnlockedDecor)) {
          updatedProgress = {
            ...updatedProgress,
            unlockedDecorIds: Array.from(new Set([...currentUnlocked, newlyUnlockedDecor]))
          };
        }
      }

      updatedProgress = reconcileProgressDecor(updatedProgress);

      localStorage.setItem('campus_user_progress', JSON.stringify(updatedProgress));
      try {
        await progressRepo.updateProgress(updatedProgress);
      } catch (e) {
        console.error('Failed to update progress with unlocked decor:', e);
      }

      setProgress(updatedProgress);

      const numComp = (updatedProgress.completedChapterIds || []).map(Number).filter(n => !isNaN(n));
      const highComp = numComp.length > 0 ? Math.max(...numComp) : 0;
      const nextStoryCh = String(Math.min(50, highComp + 1));
      setSelectedChapterId(nextStoryCh);

      // Check if completing this chapter encountered a premium pose milestone as a free user
      const milestoneNum = Number(chapterId);
      const MILESTONES = [5, 10, 15, 21, 27, 33, 38, 44, 49, 50];
      if (MILESTONES.includes(milestoneNum) && !isCampusPlus) {
        setShowSubtleSparkleCue(true);
        setTimeout(() => {
          setShowSubtleSparkleCue(false);
        }, 3500);
      }
    } catch (e: any) {
      if (e.message === 'STALE_SESSION') {
        const refreshSuccess = await attemptTokenRefresh();
        if (refreshSuccess) {
          try {
            const rawProgress = await progressRepo.completeChapter(chapterId);
            const updatedProgress = syncProgressCurrentChapter(rawProgress, false);
            setProgress(updatedProgress);

            const numComp = (updatedProgress.completedChapterIds || []).map(Number).filter(n => !isNaN(n));
            const highComp = numComp.length > 0 ? Math.max(...numComp) : 0;
            const nextStoryCh = String(Math.min(50, highComp + 1));
            setSelectedChapterId(nextStoryCh);
            return;
          } catch (retryError) {
            console.error('[completeChapter] Retry failed:', retryError);
          }
        }
        handleStaleSession();
      } else {
        throw e;
      }
    }
  };

  const incrementSkill = async (skill: SkillType, amount: number) => {
    try {
      const allChapters = await storyRepo.getChapters();
      const chaptersOfSkill = allChapters.filter((c) => c.skill === skill).length;
      // Calibrate so completing all chapters of this skill reaches exactly 100
      const calibratedAmount = chaptersOfSkill > 0 ? 100 / chaptersOfSkill : amount;
      const updatedProgress = await progressRepo.incrementSkill(skill, calibratedAmount);
      setProgress(updatedProgress);
    } catch (e: any) {
      if (e.message === 'STALE_SESSION') {
        const refreshSuccess = await attemptTokenRefresh();
        if (refreshSuccess) {
          try {
            const allChapters = await storyRepo.getChapters();
            const chaptersOfSkill = allChapters.filter((c) => c.skill === skill).length;
            const calibratedAmount = chaptersOfSkill > 0 ? 100 / chaptersOfSkill : amount;
            const updatedProgress = await progressRepo.incrementSkill(skill, calibratedAmount);
            setProgress(updatedProgress);
            return;
          } catch (retryError) {
            console.error('[incrementSkill] Retry failed:', retryError);
          }
        }
        handleStaleSession();
      } else {
        throw e;
      }
    }
  };

  const incrementFriendship = async (npcName: string, amount: number): Promise<number> => {
    try {
      const points = await progressRepo.incrementFriendship(npcName, amount);
      // Force trigger progress update
      const p = await progressRepo.getProgress();
      setProgress(p);
      return points;
    } catch (e: any) {
      if (e.message === 'STALE_SESSION') {
        const refreshSuccess = await attemptTokenRefresh();
        if (refreshSuccess) {
          try {
            const points = await progressRepo.incrementFriendship(npcName, amount);
            const p = await progressRepo.getProgress();
            setProgress(p);
            return points;
          } catch (retryError) {
            console.error('[incrementFriendship] Retry failed:', retryError);
          }
        }
        handleStaleSession();
        return 0;
      } else {
        throw e;
      }
    }
  };

  const completeCoffeeTalk = async (friendshipPoints: number): Promise<number> => {
    const getTodayISO = () => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };
    const getYesterdayISO = () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const today = getTodayISO();
    const yesterday = getYesterdayISO();
    const lastDate = progress.lastCoffeeDate || localStorage.getItem('campus_last_coffee_date') || '';
    const currentStreak = progress.coffeeStreak ?? Number(localStorage.getItem('campus_coffee_streak') || 0);

    let newStreak = 1;
    if (lastDate === yesterday) {
      newStreak = currentStreak + 1;
    } else if (lastDate === today) {
      newStreak = currentStreak > 0 ? currentStreak : 1;
    } else {
      newStreak = 1;
    }

    localStorage.setItem('campus_last_coffee_date', today);
    localStorage.setItem('campus_coffee_streak', String(newStreak));

    await incrementFriendship('Jordan', friendshipPoints);

    try {
      const updated = await progressRepo.updateProgress({
        lastCoffeeDate: today,
        coffeeStreak: newStreak
      });
      setProgress(updated);
    } catch (err) {
      console.error('Failed to update progress for coffee talk:', err);
      setProgress(prev => ({
        ...prev,
        lastCoffeeDate: today,
        coffeeStreak: newStreak
      }));
    }

    return newStreak;
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    const token = localStorage.getItem('campus_auth_token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch('/api/user/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to change password');
    }
  };

  const deleteAccount = async () => {
    const token = localStorage.getItem('campus_auth_token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch('/api/user/delete-account', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to delete account');
    }

    // Clean up local state and log out
    logout();
  };

  const resetProgress = () => {
    localStorage.removeItem('campus_auth_token');
    localStorage.removeItem('campus_refresh_token');
    localStorage.removeItem('campus_token_expires_at');
    localStorage.removeItem('campus_hero_profile');
    localStorage.removeItem('campus_user_progress');
    localStorage.removeItem('campus_seen_unlocked_buildings');
    setIsAuthenticated(false);
    
    setProfile({
      name: '',
      major: 'Undecided',
      dorm: 'Elm Hall',
      isOnboarded: false
    });
    
    setProgress({
      skills: {
        [SkillType.LISTENING]: 0,
        [SkillType.SPEAKING]: 0,
        [SkillType.WRITING]: 0,
        [SkillType.READING]: 0
      },
      completedChapterIds: [],
      currentChapterId: '1',
      friendshipPoints: {}
    });

    setSelectedChapterId('1');
    setIsPracticeMode(false);
    setActiveTab('home');
  };

  return (
    <CampusContext.Provider
      value={{
        profile,
        progress,
        isAdmin,
        equippedDecorIds,
        toggleEquipDecor,
        unlockAndEquipDecor,
        autoOpenDecorId,
        setAutoOpenDecorId,
        isDecorUnlocked,
        awardRugBadge,
        activeTab,
        setActiveTab,
        selectedChapterId,
        setSelectedChapterId,
        updateProfile,
        completeChapter,
        incrementSkill,
        incrementFriendship,
        completeCoffeeTalk,
        toggleSaveWord,
        isWordSaved,
        resetProgress,
        storyRepository: storyRepo,
        userRepository: userRepo,
        progressRepository: progressRepo,
        darkMode,
        setDarkMode,
        isAuthenticated,
        loginAsAdmin,
        login,
        signup,
        logout,
        changePassword,
        deleteAccount,
        isInitialLoading,
        initialLoadingError,
        handleRetryInitialLoad,
        sessionExpired,
        setSessionExpired,
        handleReauthenticate,
        isOnline,
        isPracticeMode,
        setIsPracticeMode,
        practiceChapterId,
        setPracticeChapterId,
        mainStoryCurrentChapter,
        uiLanguage,
        setUiLanguage,
        soundEnabled,
        setSoundEnabled,
        isTourActive,
        startTour,
        endTour,
        isCampusPlus,
        subscriptionPlan,
        hasRemovedAds,
        buyRemoveAds,
        toggleSandboxRemoveAds,
        isAdFree,
        aiGradesUsedThisWeek,
        aiGradesFreeLimit: FREE_AI_GRADES_LIMIT,
        canUseRealAiGrade,
        recordAiGradeUsed,
        practiceAttemptsUsedThisWeek,
        practiceAttemptsFreeLimit: FREE_PRACTICE_LIMIT,
        canUsePracticeMode,
        recordPracticeAttemptUsed,
        subscribeCampusPlus,
        cancelCampusPlus,
        toggleSandboxSubscription,
        openSubscriptionSubscreen,
        activeSubscreenRequest,
        setActiveSubscreenRequest,
        showSubtleSparkleCue,
        dismissSubtleSparkleCue
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = () => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
};

