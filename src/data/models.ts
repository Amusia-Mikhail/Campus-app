/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum SkillType {
  LISTENING = 'Listening',
  SPEAKING = 'Speaking',
  WRITING = 'Writing',
  READING = 'Reading'
}

export enum ChapterType {
  NARRATIVE = 'NARRATIVE',
  LECTURE = 'LECTURE',
  DISCUSSION = 'DISCUSSION',
  INDEPENDENT_WORK = 'INDEPENDENT_WORK',
  LIBRARY = 'LIBRARY',
  CAMPUS_LIFE = 'CAMPUS_LIFE'
}

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctIndex: number;
}

export interface ClassmateOpinion {
  name: string;
  avatarSeed: string;
  text: string;
  stance: 'agree' | 'disagree' | 'neutral';
}

export interface Chapter {
  id: string;
  title: string;
  type: ChapterType;
  skill: SkillType;
  locationId: string; // matches building on the map: 'dorm' | 'lecture_hall' | 'library' | 'dining_hall' | 'advisor_office'
  intro: string;
  prose?: string[]; // for NARRATIVE or general introduction
  transcript?: string; // for LECTURE
  questions?: Question[]; // for LECTURE & LIBRARY
  discussionPrompt?: string; // for DISCUSSION
  classmateReplies?: ClassmateOpinion[]; // for DISCUSSION
  essayPrompt?: string; // for INDEPENDENT_WORK
  minWords?: number; // for INDEPENDENT_WORK
  documentTitle?: string; // for LIBRARY
  documentBody?: string; // for LIBRARY
  npcName?: string; // for CAMPUS_LIFE
  initialGreeting?: string; // for CAMPUS_LIFE
  npcLines?: string[]; // for CAMPUS_LIFE (canned NPC lines to cycle through)
  biscuitCatMentioned?: boolean;
  biscuitCatIllustration?: boolean;
}

export interface HeroProfile {
  name: string;
  major: 'Psychology' | 'Computer Science' | 'Business' | 'Undecided';
  dorm: string;
  examPreference?: 'TOEFL' | 'IELTS' | string;
  isOnboarded: boolean;
  email?: string;
  isAdmin?: boolean;
}

export interface UserProgress {
  skills: {
    [key in SkillType]: number;
  };
  completedChapterIds: string[];
  currentChapterId: string;
  friendshipPoints: { [npcName: string]: number };
  completionDates?: string[];
  encounteredPoses?: string[];
  lastCoffeeDate?: string;
  coffeeStreak?: number;
  savedWordIds?: string[];
  equippedDecorIds?: string[];
  unlockedDecorIds?: string[];
  completedLocationIds?: string[];
  rugInvestigated?: boolean;
}
