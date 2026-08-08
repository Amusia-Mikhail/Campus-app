/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCampus } from '../context/CampusContext';
import { GraduationCap, Landmark, Sparkles, User, MapPin, Mail, Lock, Loader2, ArrowLeft, Globe, ChevronDown, Check, BookOpen } from 'lucide-react';
import { translations } from '../utils/translations';

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

export const OnboardingScreen: React.FC = () => {
  const { login, signup, uiLanguage, setUiLanguage } = useCampus();
  const t = translations[uiLanguage] || translations.EN;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [major, setMajor] = useState<'Psychology' | 'Computer Science' | 'Business' | 'Undecided'>('Undecided');
  const [dorm, setDorm] = useState('Elm Hall');
  const [examPreference, setExamPreference] = useState<'TOEFL' | 'IELTS' | 'NONE'>('TOEFL');
  const [error, setError] = useState('');

  // Language selector state
  const [showLangSelector, setShowLangSelector] = useState(false);
  const activeLang = LANGUAGES.find((l) => l.code === uiLanguage) || LANGUAGES[0];

  // Authentication Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Default to log-in first!
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setStep(2);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    // Fix Admin Login Bypass BEFORE calling Supabase auth or form validation
    if (cleanEmail === 'admin@campus.edu') {
      setLoading(true);
      try {
        await login('admin@campus.edu', password || 'admin123');
      } catch (err: any) {
        setAuthError(err.message || 'Authentication failed.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!cleanEmail || !password.trim()) {
      setAuthError(t.onboardingEmailPasswordRequiredError);
      return;
    }
    if (password.length < 6) {
      setAuthError(t.onboardingPasswordMinLengthError);
      return;
    }

    setAuthError('');

    if (isSignUp) {
      // For sign-up, transition to step 3 (Character Creation)
      setStep(3);
    } else {
      // For log-in, execute log-in directly
      setLoading(true);
      try {
        await login(cleanEmail, password);
      } catch (err: any) {
        setAuthError(err.message || 'Authentication failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCharacterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t.onboardingNameRequiredError);
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signup(email.trim(), password, {
        name: name.trim(),
        major,
        dorm,
        examPreference
      });
    } catch (err: any) {
      setAuthError(err.message || 'Signup failed. Please try again.');
      // Return to step 2 so user can see/correct any authentication/sign-up errors
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const majors: { value: typeof major; label: string; icon: React.ReactNode }[] = [
    { value: 'Psychology', label: t.majorPsychology, icon: <Sparkles className="w-4 h-4" /> },
    { value: 'Computer Science', label: t.majorCS, icon: <GraduationCap className="w-4 h-4" /> },
    { value: 'Business', label: t.majorBusiness, icon: <Landmark className="w-4 h-4" /> },
    { value: 'Undecided', label: t.majorUndecided, icon: <User className="w-4 h-4" /> }
  ];

  const dorms = [
    { value: 'Elm Hall', label: t.dormElm },
    { value: 'Oak Hall', label: t.dormOak },
    { value: 'Pine Hall', label: t.dormPine }
  ];

  return (
    <div
      className="relative flex-1 flex flex-col justify-between px-6 pb-6 bg-cream dark:bg-slate-950 text-navy dark:text-slate-100 font-sans select-none overflow-hidden"
      style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}
      id="onboarding-container"
    >
      {/* Language Selector Top Right Dropdown */}
      <div className="absolute right-4 z-30" style={{ top: 'max(1rem, env(safe-area-inset-top))' }}>
        <button
          id="onboarding-language-toggle"
          type="button"
          onClick={() => setShowLangSelector(!showLangSelector)}
          className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-navy/15 dark:border-slate-800 shadow-sm px-3 py-1.5 rounded-full text-xs font-semibold text-navy dark:text-slate-200 hover:border-terracotta dark:hover:border-rose-400 transition-all cursor-pointer active:scale-95"
        >
          <Globe className="w-3.5 h-3.5 text-terracotta" />
          <span className="text-sm leading-none">{activeLang.flag}</span>
          <span>{activeLang.label}</span>
          <ChevronDown className="w-3 h-3 text-navy/40 dark:text-slate-500" />
        </button>

        {showLangSelector && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setShowLangSelector(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-navy/15 dark:border-slate-800 rounded-2xl shadow-xl py-1.5 z-40 max-h-80 overflow-y-auto"
            >
              {LANGUAGES.map((lang) => {
                const isSelected = uiLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    id={`onboarding-lang-opt-${lang.code.toLowerCase()}`}
                    type="button"
                    onClick={() => {
                      setUiLanguage(lang.code);
                      setShowLangSelector(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-terracotta/10 text-terracotta font-bold dark:bg-terracotta/20'
                        : 'text-navy/80 dark:text-slate-300 hover:bg-navy/5 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-terracotta" />}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </div>
      {step === 1 && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="flex-1 flex flex-col justify-between py-12"
          id="step-1-content"
        >
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta mb-4 border border-terracotta/20 shadow-inner">
              <GraduationCap className="w-12 h-12 stroke-[1.5]" />
            </div>

            <h1 className="font-serif text-5xl font-semibold tracking-tight text-burgundy dark:text-rose-400" id="app-title">
              {t.onboardingWelcomeTitle}
            </h1>

            <p className="font-serif italic text-navy/80 dark:text-slate-300 text-lg leading-relaxed max-w-xs">
              {t.onboardingWelcomeSubtitle.split('\n')[0]}
              <br />
              {t.onboardingWelcomeSubtitle.split('\n')[1]}
            </p>

            <div className="h-px w-16 bg-terracotta/30 my-2"></div>

            <p className="text-sm text-navy/60 dark:text-slate-400 max-w-xs leading-relaxed">
              {t.onboardingWelcomeDesc}
            </p>
          </div>

          <div className="space-y-4 shrink-0">
            <button
              id="get-started-btn"
              onClick={handleNext}
              className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-sans py-4 px-6 rounded-2xl shadow-md transition-all duration-200 font-medium active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 text-base"
            >
              {t.onboardingGetStarted}
            </button>
            <p className="text-center text-xs text-navy/40 dark:text-slate-500">{t.onboardingConnectedSupabase}</p>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.form
          key="auth"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAuthSubmit}
          noValidate
          className="flex-1 flex flex-col justify-between py-6"
          id="step-2-form"
        >
          <div className="space-y-6 overflow-y-auto max-h-[64vh] pr-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-xs font-semibold text-navy/60 dark:text-slate-400 hover:text-terracotta dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t.onboardingBackToWelcome}
            </button>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-terracotta">
                {isSignUp ? t.onboardingCreateAccount : t.onboardingSignIn}
              </span>
              <h2 className="font-serif text-3xl font-semibold text-burgundy dark:text-rose-400">
                {isSignUp ? t.onboardingCreateYourAccount : t.onboardingWelcomeBack}
              </h2>
              <p className="text-sm text-navy/60 dark:text-slate-400">
                {isSignUp 
                  ? t.onboardingAuthDescSignUp 
                  : t.onboardingAuthDescSignIn}
              </p>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="auth-email" className="text-sm font-semibold text-navy dark:text-slate-200 flex items-center gap-2">
                <Mail className="w-4 h-4 text-terracotta" />
                {t.onboardingEmailAddress}
              </label>
              <input
                id="auth-email"
                type="email"
                placeholder={t.onboardingEmailPlaceholder}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (authError) setAuthError('');
                }}
                className="w-full bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-2xl p-4 text-navy dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="auth-password" className="text-sm font-semibold text-navy dark:text-slate-200 flex items-center gap-2">
                <Lock className="w-4 h-4 text-terracotta" />
                {t.onboardingPassword}
              </label>
              <input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (authError) setAuthError('');
                }}
                className="w-full bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-2xl p-4 text-navy dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all"
                minLength={6}
                required
              />
              {authError && <p className="text-xs text-red-600 dark:text-red-400 font-medium leading-relaxed">{authError}</p>}
            </div>
          </div>

          <div className="pt-4 space-y-4 shrink-0">
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-terracotta hover:bg-terracotta-dark disabled:bg-terracotta/50 text-white font-sans py-4 px-6 rounded-2xl shadow-md transition-all duration-200 font-medium active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.onboardingPleaseWait}
                </>
              ) : isSignUp ? (
                t.onboardingContinueToCharacter
              ) : (
                t.onboardingSignInRestore
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setAuthError('');
              }}
              className="w-full text-center text-sm font-semibold text-navy/70 dark:text-slate-300 hover:text-terracotta dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              {isSignUp ? t.onboardingAlreadyHaveAccount : t.onboardingDontHaveAccount}
            </button>
          </div>
        </motion.form>
      )}

      {step === 3 && (
        <motion.form
          key="setup"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCharacterSubmit}
          className="flex-1 flex flex-col justify-between py-2 sm:py-4"
          id="step-3-form"
        >
          <div className="space-y-3.5 pr-1">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 text-xs font-semibold text-navy/60 dark:text-slate-400 hover:text-terracotta dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t.onboardingBackToAuth}
            </button>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-terracotta">{t.onboardingHeroProfile}</span>
              <h2 className="font-serif text-2xl font-bold text-burgundy dark:text-rose-400">{t.onboardingCreateCharacter}</h2>
              <p className="text-xs text-navy/60 dark:text-slate-400">{t.onboardingChooseHowEnter}</p>
            </div>

            {/* Name Input */}
            <div className="space-y-1">
              <label htmlFor="hero-name" className="text-xs font-semibold text-navy dark:text-slate-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-terracotta" />
                {t.onboardingWhatIsName}
              </label>
              <input
                id="hero-name"
                type="text"
                placeholder={t.onboardingNamePlaceholder}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                className="w-full bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-xl p-2.5 text-sm text-navy dark:text-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all"
                maxLength={20}
              />
              {error && <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>}
            </div>

            {/* Major Chip-Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-navy dark:text-slate-200 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-terracotta" />
                {t.onboardingSelectMajor}
              </label>
              <div className="grid grid-cols-2 gap-1.5" id="major-select-grid">
                {majors.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMajor(m.value)}
                    className={`flex items-center gap-1.5 p-2 rounded-xl text-xs sm:text-sm border font-medium transition-all text-left cursor-pointer ${
                      major === m.value
                        ? 'bg-terracotta/10 border-terracotta text-terracotta shadow-xs dark:bg-terracotta/20'
                        : 'bg-white dark:bg-slate-900 hover:bg-navy/5 dark:hover:bg-slate-800 border-navy/10 dark:border-slate-800 text-navy/70 dark:text-slate-300'
                    }`}
                  >
                    <span className={major === m.value ? 'text-terracotta' : 'text-navy/40 dark:text-slate-500'}>
                      {m.icon}
                    </span>
                    <span className="truncate">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dorm Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-navy dark:text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-terracotta" />
                {t.onboardingChooseDorm}
              </label>
              <div className="flex gap-1.5" id="dorm-select-grid">
                {dorms.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDorm(d.value)}
                    className={`flex-1 text-center p-2 rounded-xl text-xs sm:text-sm border font-medium transition-all cursor-pointer ${
                      dorm === d.value
                        ? 'bg-terracotta/10 border-terracotta text-terracotta shadow-xs dark:bg-terracotta/20'
                        : 'bg-white dark:bg-slate-900 hover:bg-navy/5 dark:hover:bg-slate-800 border-navy/10 dark:border-slate-800 text-navy/70 dark:text-slate-300'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Exam Preference Selection - 3 Column Row */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-navy dark:text-slate-200 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-terracotta" />
                {t.onboardingSelectExam || 'Which exam are you preparing for?'}
              </label>
              <div className="grid grid-cols-3 gap-1.5" id="exam-select-grid">
                {[
                  { value: 'TOEFL', label: 'TOEFL iBT' },
                  { value: 'IELTS', label: 'IELTS' },
                  { value: 'NONE', label: 'Not Sure' }
                ].map((e) => (
                  <button
                    key={e.value}
                    type="button"
                    onClick={() => setExamPreference(e.value as 'TOEFL' | 'IELTS' | 'NONE')}
                    className={`text-center p-2 rounded-xl text-xs border font-medium transition-all cursor-pointer truncate ${
                      examPreference === e.value
                        ? 'bg-terracotta/10 border-terracotta text-terracotta shadow-xs dark:bg-terracotta/20'
                        : 'bg-white dark:bg-slate-900 hover:bg-navy/5 dark:hover:bg-slate-800 border-navy/10 dark:border-slate-800 text-navy/70 dark:text-slate-300'
                    }`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2.5 space-y-2 shrink-0">
            <button
              id="enter-campus-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-terracotta hover:bg-terracotta-dark disabled:bg-terracotta/50 text-white font-sans py-3 px-5 rounded-xl shadow-md transition-all duration-200 font-bold active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.onboardingPleaseWait}
                </>
              ) : (
                t.onboardingCreateStartStory
              )}
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
};
