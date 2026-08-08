/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCampus } from '../context/CampusContext';
import {
  User,
  Bell,
  Info,
  Moon,
  Sun,
  RotateCcw,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  Code,
  LogOut,
  Globe,
  Volume2,
  VolumeX,
  Compass,
  BookMarked,
  Coffee,
  Terminal,
  Zap
} from 'lucide-react';
import { VocabularyNotebookModal } from '../components/VocabularyNotebookModal';
import {
  StudentProfileSubscreen,
  NotificationsSubscreen,
  HelpdeskSubscreen,
  AboutSubscreen,
  PrivacyPolicySubscreen,
  CampusPlusSubscreen
} from '../components/SettingsSubscreens';
import { Crown } from 'lucide-react';
import { PremiumProfileFrame } from '../components/PremiumProfileFrame';
import { LanguageSubscreen } from '../components/LanguageSubscreen';
import { translations } from '../utils/translations';
import { BADGE_DEFINITIONS, Badge } from '../utils/badgeHelper';
import { BadgeMedallion } from '../components/BadgeMedallion';
import { getDynamicChapters } from '../data/repositories';

type SubscreenType = 'profile' | 'notifications' | 'helpdesk' | 'about' | 'language' | 'privacy' | 'subscription';

const LANGUAGES = [
  { code: 'EN', label: 'English', flag: '🇺🇸' },
  { code: 'RU', label: 'Русский', flag: '🇷🇺' },
  { code: 'ES', label: 'Español', flag: '🇪🇸' },
  { code: 'DE', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ZH', label: '中文', flag: '🇨🇳' },
  { code: 'JA', label: '日本語', flag: '🇯🇵' },
  { code: 'IT', label: 'Italiano', flag: '🇮🇹' },
  { code: 'KO', label: '한국어', flag: '🇰🇷' },
];

export const SettingsScreen: React.FC = () => {
  const {
    darkMode,
    setDarkMode,
    resetProgress,
    profile,
    progress,
    logout,
    uiLanguage,
    soundEnabled,
    setSoundEnabled,
    startTour,
    isCampusPlus,
    activeSubscreenRequest,
    setActiveSubscreenRequest
  } = useCampus();
  const [activeSubscreen, setActiveSubscreen] = useState<SubscreenType | null>(null);
  const [isVocabModalOpen, setIsVocabModalOpen] = useState(false);

  // Check if an external subscreen request was triggered (e.g. from upgrade button)
  React.useEffect(() => {
    if (activeSubscreenRequest) {
      setActiveSubscreen(activeSubscreenRequest as SubscreenType);
      setActiveSubscreenRequest(null);
    }
  }, [activeSubscreenRequest, setActiveSubscreenRequest]);

  const t = translations[uiLanguage] || translations.EN;

  // Calculate earned badges for profile row preview
  const chapters = getDynamicChapters(profile.major, profile.dorm);
  const earnedBadges = BADGE_DEFINITIONS.filter(b => b.check(progress, chapters));

  const handleReset = () => {
    const confirmMsg = uiLanguage === 'RU'
      ? 'Вы уверены, что хотите сбросить свой учебный семестр? Это сотрет все полученные навыки, историю глав и позволит создать нового студента.'
      : uiLanguage === 'ES'
      ? '¿Está seguro de que desea reiniciar su semestre académico? Esto borrará todas las habilidades obtenidas, la historia de capítulos completados y le permitirá crear un nuevo personaje.'
      : 'Are you sure you want to reset your academic semester? This will clear all skill gains, completed chapter history, and let you create a new student character.';
    if (confirm(confirmMsg)) {
      resetProgress();
    }
  };

  const activeLangObj = LANGUAGES.find(l => l.code === uiLanguage) || LANGUAGES[0];

  const sections = [
    {
      title: t.campusPlusHeader || 'Campus Plus Subscription',
      rows: [
        {
          id: 'campus-plus-row',
          icon: <Crown className="w-4 h-4 text-amber-500 fill-amber-500/20" />,
          label: t.campusPlusHeader || 'Campus Plus Pass',
          value: isCampusPlus ? '✨ Plus Active' : 'Upgrade to Plus',
          clickable: true,
          subscreen: 'subscription' as SubscreenType
        }
      ]
    },
    {
      title: t.languageSelectorTitle,
      rows: [
        {
          id: 'language-row',
          icon: <Globe className="w-4 h-4 text-terracotta" />,
          label: t.languageSelectorTitle,
          value: `${activeLangObj.flag} ${activeLangObj.label}`,
          clickable: true,
          subscreen: 'language' as SubscreenType
        }
      ]
    },
    {
      title: t.academicProfileHeader,
      rows: [
        {
          id: 'acc-row',
          icon: <User className="w-4 h-4 text-terracotta" />,
          label: t.studentProfileRow,
          value: profile.name ? `${profile.name} (${profile.major})` : 'Alex',
          clickable: true,
          subscreen: 'profile' as SubscreenType,
          badgesPreview: earnedBadges.slice(0, 4)
        },
        {
          id: 'vocab-notebook-row',
          icon: <BookMarked className="w-4 h-4 text-terracotta" />,
          label: t.vocabNotebookRowLabel || (t as any)['settings.vocabularyNotebookTitle'] || 'Academic Vocabulary Notebook',
          value: (t.vocabSavedWordsCount || (t as any)['settings.vocabularySavedWordsCount'] || '{count} Saved Words').replace('{count}', String(progress.savedWordIds?.length || 0)),
          clickable: true,
          onClick: () => setIsVocabModalOpen(true)
        }
      ]
    },
    {
      title: t.preferencesHeader,
      rows: [
        {
          id: 'darkmode-row',
          icon: darkMode ? <Moon className="w-4 h-4 text-terracotta" /> : <Sun className="w-4 h-4 text-terracotta" />,
          label: t.darkModeRow,
          value: null,
          isToggle: true,
          toggleValue: darkMode,
          onToggle: (v: boolean) => setDarkMode(v)
        },
        {
          id: 'sound-row',
          icon: soundEnabled ? <Volume2 className="w-4 h-4 text-terracotta" /> : <VolumeX className="w-4 h-4 text-terracotta" />,
          label: t.soundEffectsRow || 'Sound Effects',
          value: null,
          isToggle: true,
          toggleValue: soundEnabled,
          onToggle: (v: boolean) => setSoundEnabled(v)
        },
        {
          id: 'notify-row',
          icon: <Bell className="w-4 h-4 text-terracotta" />,
          label: t.academicNotificationsRow,
          value: localStorage.getItem(`campus_notify_daily_reminder_${profile.name || 'Alex'}`) === 'true' ? 'Daily Active' : 'Off',
          clickable: true,
          subscreen: 'notifications' as SubscreenType
        }
      ]
    },
    {
      title: t.infoSupportHeader,
      rows: [
        {
          id: 'replay-tour-row',
          icon: <Compass className="w-4 h-4 text-terracotta" />,
          label: t.replayTourRow || 'Replay Campus Tour',
          value: 'Guided Tour',
          clickable: true,
          onClick: () => {
            startTour();
          }
        },
        {
          id: 'support-row',
          icon: <HelpCircle className="w-4 h-4 text-terracotta" />,
          label: t.helpdeskRow,
          value: 'Q&A Support',
          clickable: true,
          subscreen: 'helpdesk' as SubscreenType
        },
        {
          id: 'about-row',
          icon: <Info className="w-4 h-4 text-terracotta" />,
          label: t.aboutRow,
          value: 'v1.2.0 Build',
          clickable: true,
          subscreen: 'about' as SubscreenType
        },
        {
          id: 'privacy-row',
          icon: <ShieldCheck className="w-4 h-4 text-terracotta" />,
          label: 'Privacy Policy',
          value: 'Data Protection',
          clickable: true,
          subscreen: 'privacy' as SubscreenType
        }
      ]
    }
  ];

  return (
    <div
      className="flex-1 overflow-y-auto px-5 pb-6 space-y-6 bg-cream dark:bg-slate-950 text-navy dark:text-slate-100 font-sans relative"
      style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}
      id="settings-screen"
    >
      
      <AnimatePresence mode="wait">
        {!activeSubscreen ? (
          // MAIN SETTINGS LIST
          <motion.div
            key="main-settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
            id="main-settings-container"
          >
            {/* Settings Header */}
            <div className="space-y-1" id="settings-header">
              <span className="text-[10px] font-mono font-bold text-terracotta uppercase tracking-wider block">{t.appConfigHeader}</span>
              <h2 className="text-3xl font-serif font-bold text-burgundy dark:text-rose-400">{t.settingsTitle}</h2>
              <p className="text-xs text-navy/50 dark:text-slate-400">{t.settingsSubtitle}</p>
            </div>

            {/* List of Settings card blocks */}
            <div className="space-y-5" id="settings-sections">
              {sections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-2">
                  <h3 className="text-[10px] uppercase tracking-wider font-bold text-navy/50 dark:text-slate-500 px-1">{sec.title}</h3>
                  
                  <div className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-2xl p-1 shadow-sm divide-y divide-navy/5 dark:divide-slate-800">
                    {sec.rows.map((row) => (
                      <div
                        key={row.id}
                        id={row.id}
                        onClick={() => {
                          if (row.onClick) {
                            row.onClick();
                          } else if (row.clickable && row.subscreen) {
                            setActiveSubscreen(row.subscreen);
                          }
                        }}
                        className={`flex justify-between items-center p-3.5 rounded-xl transition-all ${
                          row.clickable ? 'cursor-pointer hover:bg-navy/[0.03] dark:hover:bg-slate-800/40 active:scale-[0.99]' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {row.id === 'acc-row' && isCampusPlus ? (
                            <PremiumProfileFrame size="sm">
                              {row.icon}
                            </PremiumProfileFrame>
                          ) : (
                            <div className="p-1.5 bg-cream-card dark:bg-slate-800 rounded-lg border border-navy/5 dark:border-slate-700">
                              {row.icon}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-navy dark:text-slate-200">{row.label}</span>
                            {row.id === 'acc-row' && isCampusPlus && (
                              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                                <Crown className="w-2.5 h-2.5 fill-current text-amber-200" />
                                <span>Plus</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {row.isToggle ? (
                          // Toggle Switch
                          <button
                            id="dark-mode-toggle"
                            onClick={() => row.onToggle?.(!row.toggleValue)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              row.toggleValue ? 'bg-terracotta' : 'bg-navy/10'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                row.toggleValue ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        ) : (
                          // Clickable row
                          <div className="flex items-center gap-2 text-xs text-navy/40 dark:text-slate-400 font-medium shrink-0">
                            <span className="truncate max-w-[110px] sm:max-w-[200px]">{row.value}</span>
                            {row.badgesPreview && row.badgesPreview.length > 0 && (
                              <div className="flex items-center -space-x-1.5 shrink-0" id="acc-row-badges-preview">
                                {row.badgesPreview.map((badge) => (
                                  <div key={badge.id} className="relative z-0 hover:z-10 transition-transform hover:scale-110">
                                    <BadgeMedallion badgeId={badge.id} isEarned={true} size="xs" />
                                  </div>
                                ))}
                              </div>
                            )}
                            {row.clickable && <ChevronRight className="w-4 h-4 text-navy/30 dark:text-slate-500 shrink-0" />}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* CONDITIONAL DEVELOPER CONTROLS FOR ADMIN ACCOUNT */}
            {profile.email === 'admin@campus.edu' && (
              <div className="space-y-2" id="developer-controls-section">
                <h3 className="text-[10px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 px-1 flex items-center gap-1">
                  <Terminal className="w-3 h-3" /> Developer Controls (Admin Only)
                </h3>
                <div className="bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-navy dark:text-slate-100 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Reset Daily Coffee Status
                      </h4>
                      <p className="text-[10px] text-navy/60 dark:text-slate-400">
                        Clears today's coffee record to re-test the Morning Coffee widget immediately.
                      </p>
                    </div>
                  </div>

                  <button
                    id="dev-reset-coffee-btn"
                    onClick={async () => {
                      localStorage.removeItem('campus_last_coffee_date');
                      try {
                        await useCampus().progressRepository.updateProgress({ lastCoffeeDate: '' });
                      } catch (e) {}
                      window.location.reload();
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Coffee className="w-3.5 h-3.5" />
                    <span>⚡ Reset Coffee Today & Reload</span>
                  </button>
                </div>
              </div>
            )}

            {/* Account Settings / Sign Out */}
            <div className="space-y-2" id="account-settings-section">
              <h3 className="text-[10px] uppercase tracking-wider font-bold text-navy/40 dark:text-slate-500 px-1">{t.accountHeader}</h3>
              <div className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                <button
                  id="sign-out-btn"
                  onClick={logout}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/45 dark:hover:bg-slate-800 text-navy dark:text-slate-200 text-xs font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                >
                  <LogOut className="w-3.5 h-3.5 text-terracotta animate-pulse" />
                  {t.signOutBtn}
                </button>
              </div>
            </div>

            {/* Danger Zone / Reset */}
            <div className="space-y-2" id="danger-zone-section">
              <h3 className="text-[10px] uppercase tracking-wider font-bold text-red-600 px-1">{t.dangerZoneHeader}</h3>
              <div className="bg-white dark:bg-slate-900 border border-red-100 dark:border-red-950/40 rounded-2xl p-4 shadow-sm space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-red-50 dark:bg-red-950/20 rounded-lg text-red-600 border border-red-100 dark:border-red-900/40 shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-navy dark:text-slate-200">{t.resetRecordTitle}</h4>
                    <p className="text-[11px] text-navy/60 dark:text-slate-400 leading-relaxed">
                      {t.resetRecordDesc}
                    </p>
                  </div>
                </div>

                <button
                  id="reset-academic-record-btn"
                  onClick={handleReset}
                  className="w-full bg-red-500/10 hover:bg-red-500 text-red-700 dark:text-red-400 hover:text-white text-xs font-semibold py-3 px-4 rounded-xl border border-red-200 dark:border-red-950/40 hover:border-transparent transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {t.resetSemesterBtn}
                </button>
              </div>
            </div>

            {/* Footer Credits */}
            <div className="text-center space-y-1 py-4" id="settings-footer">
              <p className="text-[10px] font-mono font-semibold text-navy/30 dark:text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1">
                <Code className="w-3.5 h-3.5" /> Phase 1 Visual Architecture
              </p>
              <p className="text-[9px] text-navy/20 dark:text-slate-600 font-medium leading-relaxed">
                TWA Optimized • Client-Side React SPA (Vite)
              </p>
            </div>
          </motion.div>
        ) : (
          // ACTIVE SUBSCREEN CONTENT
          <motion.div
            key="subscreen"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.2 }}
            id="subscreen-container"
          >
            {activeSubscreen === 'profile' && (
              <StudentProfileSubscreen onBack={() => setActiveSubscreen(null)} />
            )}
            {activeSubscreen === 'notifications' && (
              <NotificationsSubscreen onBack={() => setActiveSubscreen(null)} />
            )}
            {activeSubscreen === 'helpdesk' && (
              <HelpdeskSubscreen onBack={() => setActiveSubscreen(null)} />
            )}
            {activeSubscreen === 'about' && (
              <AboutSubscreen
                onBack={() => setActiveSubscreen(null)}
                onOpenPrivacyPolicy={() => setActiveSubscreen('privacy')}
              />
            )}
            {activeSubscreen === 'privacy' && (
              <PrivacyPolicySubscreen onBack={() => setActiveSubscreen(null)} />
            )}
            {activeSubscreen === 'subscription' && (
              <CampusPlusSubscreen onBack={() => setActiveSubscreen(null)} />
            )}
            {activeSubscreen === 'language' && (
              <LanguageSubscreen onBack={() => setActiveSubscreen(null)} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <VocabularyNotebookModal
        isOpen={isVocabModalOpen}
        onClose={() => setIsVocabModalOpen(false)}
      />
    </div>
  );
};
