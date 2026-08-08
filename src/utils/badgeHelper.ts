/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProgress, Chapter, SkillType, ChapterType } from '../data/models';
import { translations } from './translations';

export interface Badge {
  id: string;
  titleKey: string;
  descKey: string;
  iconName: string;
  check: (progress: UserProgress, chapters: Chapter[]) => boolean;
}

export function getBadgeTitle(badge: Badge, t: Record<string, any>): string {
  if (t && t[badge.titleKey]) {
    return t[badge.titleKey];
  }
  if (translations.EN && (translations.EN as any)[badge.titleKey]) {
    return (translations.EN as any)[badge.titleKey];
  }
  return badge.id
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getBadgeDesc(badge: Badge, t: Record<string, any>): string {
  if (t && t[badge.descKey]) {
    return t[badge.descKey];
  }
  if (translations.EN && (translations.EN as any)[badge.descKey]) {
    return (translations.EN as any)[badge.descKey];
  }
  return '';
}

export const BADGE_DEFINITIONS: Badge[] = [
  {
    id: 'rug_investigator',
    titleKey: 'badge_rug_investigator_title',
    descKey: 'badge_rug_investigator_desc',
    iconName: 'Compass',
    check: (progress) => {
      return localStorage.getItem('campus_badge_rug_investigator') === 'true' || progress.rugInvestigated === true;
    },
  },
  {
    id: 'first_steps',
    titleKey: 'badge_first_steps_title',
    descKey: 'badge_first_steps_desc',
    iconName: 'Footprints',
    check: (progress) => progress.completedChapterIds.includes('1'),
  },
  {
    id: 'bookworm',
    titleKey: 'badge_bookworm_title',
    descKey: 'badge_bookworm_desc',
    iconName: 'BookOpen',
    check: (progress, chapters) => {
      return chapters.filter(ch => ch.skill === SkillType.READING && progress.completedChapterIds.includes(ch.id)).length >= 5;
    },
  },
  {
    id: 'night_owl',
    titleKey: 'badge_night_owl_title',
    descKey: 'badge_night_owl_desc',
    iconName: 'Moon',
    check: (progress) => {
      return localStorage.getItem('campus_badge_night_owl') === 'true';
    },
  },
  {
    id: 'full_house',
    titleKey: 'badge_full_house_title',
    descKey: 'badge_full_house_desc',
    iconName: 'Map',
    check: (progress) => {
      return Number(progress.currentChapterId) >= 46 || progress.completedChapterIds.length >= 45 || progress.currentChapterId === '51';
    },
  },
  {
    id: 'perfect_attendance',
    titleKey: 'badge_perfect_attendance_title',
    descKey: 'badge_perfect_attendance_desc',
    iconName: 'CalendarCheck',
    check: (progress, chapters) => {
      const chaptersByLocation: { [locId: string]: number } = {};
      chapters.forEach(ch => {
        if (progress.completedChapterIds.includes(ch.id)) {
          chaptersByLocation[ch.locationId] = (chaptersByLocation[ch.locationId] || 0) + 1;
        }
      });
      return Object.values(chaptersByLocation).some(count => count >= 5);
    },
  },
  {
    id: 'wordsmith',
    titleKey: 'badge_wordsmith_title',
    descKey: 'badge_wordsmith_desc',
    iconName: 'PenTool',
    check: (progress, chapters) => {
      return chapters.filter(ch => ch.skill === SkillType.WRITING && progress.completedChapterIds.includes(ch.id)).length >= 5;
    },
  },
  {
    id: 'conversationalist',
    titleKey: 'badge_conversationalist_title',
    descKey: 'badge_conversationalist_desc',
    iconName: 'MessageSquare',
    check: (progress, chapters) => {
      return chapters.filter(ch => {
        const isSpeakingOrDiscussion = ch.skill === SkillType.SPEAKING || ch.type === ChapterType.DISCUSSION || ch.type === ChapterType.CAMPUS_LIFE;
        return isSpeakingOrDiscussion && progress.completedChapterIds.includes(ch.id);
      }).length >= 5;
    },
  },
  {
    id: 'halfway_there',
    titleKey: 'badge_halfway_there_title',
    descKey: 'badge_halfway_there_desc',
    iconName: 'Flag',
    check: (progress) => progress.completedChapterIds.length >= 25,
  },
  {
    id: 'semester_complete',
    titleKey: 'badge_semester_complete_title',
    descKey: 'badge_semester_complete_desc',
    iconName: 'GraduationCap',
    check: (progress) => progress.completedChapterIds.length >= 50,
  },
  {
    id: 'social_butterfly',
    titleKey: 'badge_social_butterfly_title',
    descKey: 'badge_social_butterfly_desc',
    iconName: 'Heart',
    check: (progress) => {
      return Object.values(progress.friendshipPoints || {}).some(points => points >= 30);
    },
  },
  {
    id: 'scholar',
    titleKey: 'badge_scholar_title',
    descKey: 'badge_scholar_desc',
    iconName: 'Award',
    check: (progress, chapters) => {
      return chapters.filter(ch => ch.type === ChapterType.LECTURE && progress.completedChapterIds.includes(ch.id)).length >= 5;
    },
  },
  {
    id: 'master_of_skills',
    titleKey: 'badge_master_of_skills_title',
    descKey: 'badge_master_of_skills_desc',
    iconName: 'Sparkles',
    check: (progress) => {
      return Object.values(progress.skills).every(score => score >= 50);
    },
  },
];
