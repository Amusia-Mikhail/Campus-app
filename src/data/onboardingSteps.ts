/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getOnboardingTranslation } from './onboardingTranslations';

export interface StepDefinition {
  id: number;
  stepKey: string;
  targetId: string;
  tab: 'home' | 'story' | 'map' | 'progress' | 'settings';
  title: string;
  desc: string;
  description?: string;
  preferredPlacement?: 'top' | 'bottom' | 'auto';
}

export function getOnboardingSteps(langOrT?: string | Record<string, any>): StepDefinition[] {
  let langStr = 'en';

  if (typeof langOrT === 'string') {
    langStr = langOrT;
  } else if (langOrT && typeof langOrT === 'object') {
    if (langOrT.language) {
      langStr = String(langOrT.language);
    } else if (langOrT.lang) {
      langStr = String(langOrT.lang);
    }
  }

  const stepKeys = [
    { id: 1, stepKey: 'welcome_nav', targetId: 'bottom-navigation-bar', tab: 'home' as const },
    { id: 2, stepKey: 'continue_story', targetId: 'story-hero-card', tab: 'home' as const },
    { id: 3, stepKey: 'skill_breakdown', targetId: 'skills-overview-section', tab: 'home' as const },
    { id: 4, stepKey: 'campus_map', targetId: 'map-header', tab: 'map' as const },
    { id: 5, stepKey: 'biscuit_album', targetId: 'map-biscuit-cat', tab: 'map' as const, preferredPlacement: 'top' as const },
    { id: 6, stepKey: 'exam_predictor', targetId: 'exam-estimator-card', tab: 'progress' as const },
    { id: 7, stepKey: 'semester_report', targetId: 'semester-report-btn', tab: 'progress' as const },
    { id: 8, stepKey: 'achievements_badges', targetId: 'toggle-badges-tab', tab: 'progress' as const },
    { id: 9, stepKey: 'app_settings', targetId: 'settings-header', tab: 'settings' as const },
    { id: 10, stepKey: 'official_transcript', targetId: 'view-official-transcript-btn', tab: 'progress' as const },
    { id: 11, stepKey: 'jordan_stories_counter', targetId: 'jordan-friendship-progress-card', tab: 'progress' as const },
    { id: 12, stepKey: 'dorm_room_decor', targetId: 'decorate-room-btn', tab: 'home' as const },
    { id: 13, stepKey: 'coffee_dialogue', targetId: 'cozy-coffee-corner-widget', tab: 'home' as const },
    { id: 14, stepKey: 'academic_vocabulary_notebook', targetId: 'vocab-notebook-pill', tab: 'home' as const },
  ];

  return stepKeys.map((step) => {
    const translation = getOnboardingTranslation(step.stepKey, langStr);

    // Fallback lookup if object dictionary t was passed directly
    let title = translation.title;
    let desc = translation.desc;

    if (langOrT && typeof langOrT === 'object') {
      const dictTitle = langOrT[`onboarding.step${step.id}.title`] || langOrT[`tourStepTitle${step.id}`];
      const dictDesc = langOrT[`onboarding.step${step.id}.desc`] || langOrT[`tourStepDesc${step.id}`];
      if (dictTitle) title = dictTitle;
      if (dictDesc) desc = dictDesc;
    }

    return {
      id: step.id,
      stepKey: step.stepKey,
      targetId: step.targetId,
      tab: step.tab,
      preferredPlacement: step.preferredPlacement,
      title,
      desc,
      description: desc,
    };
  });
}
