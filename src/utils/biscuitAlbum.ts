/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BiscuitStageId = 'kitten' | 'adolescent' | 'adult';

export type BiscuitPoseId = 'sleeping' | 'alert' | 'playful' | 'walking' | 'watching' | string;

export interface BiscuitPoseMeta {
  id: BiscuitPoseId;
  stage: BiscuitStageId;
  translationKeyTitle: string;
  translationKeyDesc: string;
  defaultUnlocked?: boolean;
  isPlusExclusive?: boolean;
  isPremiumProgression?: boolean;
  reqChapter?: number;
  isFinale?: boolean;
  defaultTitle?: string;
  defaultDesc?: string;
}

export const ALL_BISCUIT_POSES: BiscuitPoseMeta[] = [
  // Kitten Stage Poses (15 total: 12 free + 3 premium)
  {
    id: 'sleeping',
    stage: 'kitten',
    translationKeyTitle: 'biscuitPoseSleeping',
    translationKeyDesc: 'biscuitPoseSleepingDesc',
    defaultUnlocked: true,
    defaultTitle: 'Sleeping Biscuit',
    defaultDesc: 'Curled up into a peaceful ball of fur, dreaming of treats.',
  },
  {
    id: 'playful',
    stage: 'kitten',
    translationKeyTitle: 'biscuitPosePlayful',
    translationKeyDesc: 'biscuitPosePlayfulDesc',
    defaultTitle: 'Playful Paw',
    defaultDesc: 'Batting enthusiastically at a stray ray of sunlight.',
  },
  {
    id: 'kitten_curious',
    stage: 'kitten',
    translationKeyTitle: 'biscuitPoseKittenCurious',
    translationKeyDesc: 'biscuitPoseKittenCuriousDesc',
    defaultTitle: 'Curious Paws',
    defaultDesc: 'Investigating a stack of newly opened textbooks.',
  },
  {
    id: 'kitten_cozy',
    stage: 'kitten',
    translationKeyTitle: 'biscuitPoseKittenCozy',
    translationKeyDesc: 'biscuitPoseKittenCozyDesc',
    defaultTitle: 'Cozy Tote Bag',
    defaultDesc: 'Snuggled inside a canvas student bag for a warm catnap.',
  },
  {
    id: 'kitten_pouncing',
    stage: 'kitten',
    translationKeyTitle: 'biscuitPoseKittenPouncing',
    translationKeyDesc: 'biscuitPoseKittenPouncingDesc',
    defaultTitle: 'Mid-Air Pounce',
    defaultDesc: 'Practicing hunting skills on an innocent dust mote.',
  },
  {
    id: 'kitten_yawning',
    stage: 'kitten',
    translationKeyTitle: 'biscuitPoseKittenYawning',
    translationKeyDesc: 'biscuitPoseKittenYawningDesc',
    defaultTitle: 'Sleepy Yawn',
    defaultDesc: 'A big, tiny-fanged yawn after a long study session.',
  },
  {
    id: 'kitten_peekaboo',
    stage: 'kitten',
    translationKeyTitle: 'biscuitPoseKittenPeekaboo',
    translationKeyDesc: 'biscuitPoseKittenPeekabooDesc',
    defaultTitle: 'Dorm Room Peekaboo',
    defaultDesc: 'Peeking out from behind the desk chair leg.',
  },
  {
    id: 'kitten_grooming',
    stage: 'kitten',
    translationKeyTitle: 'biscuitPoseKittenGrooming',
    translationKeyDesc: 'biscuitPoseKittenGroomingDesc',
    defaultTitle: 'Careful Grooming',
    defaultDesc: 'Meticulously cleaning a tiny front paw.',
  },
  {
    id: 'kitten_cuddly',
    stage: 'kitten',
    translationKeyTitle: 'biscuitPoseKittenCuddly',
    translationKeyDesc: 'biscuitPoseKittenCuddlyDesc',
    defaultTitle: 'Cuddly Lap Cat',
    defaultDesc: 'Demanding immediate petting while you try to read.',
  },
  {
    id: 'kitten_exploring',
    stage: 'kitten',
    translationKeyTitle: 'biscuitPoseKittenExploring',
    translationKeyDesc: 'biscuitPoseKittenExploringDesc',
    defaultTitle: 'Hallway Explorer',
    defaultDesc: 'Venturing bravely down the long dorm corridor.',
  },
  {
    id: 'kitten_playful_ball',
    stage: 'kitten',
    translationKeyTitle: 'biscuitPoseKittenPlayfulBall',
    translationKeyDesc: 'biscuitPoseKittenPlayfulBallDesc',
    defaultTitle: 'Ball Chaser',
    defaultDesc: 'Rolling around with a fuzzy jingle ball.',
  },
  {
    id: 'kitten_window_gazer',
    stage: 'kitten',
    translationKeyTitle: 'biscuitPoseKittenWindowGazer',
    translationKeyDesc: 'biscuitPoseKittenWindowGazerDesc',
    defaultTitle: 'Window Gazer',
    defaultDesc: 'Watching raindrops slide down the window pane.',
  },

  // Premium Progression Poses for Kitten Stage
  {
    id: 'plus_kitten_1',
    stage: 'kitten',
    translationKeyTitle: 'biscuitPosePlusKitten1',
    translationKeyDesc: 'biscuitPosePlusKitten1Desc',
    isPremiumProgression: true,
    reqChapter: 5,
    defaultTitle: 'Autumn Leaf Chaser',
    defaultDesc: 'A curious kitten playfully catching falling autumn leaves.',
  },
  {
    id: 'plus_kitten_2',
    stage: 'kitten',
    translationKeyTitle: 'biscuitPosePlusKitten2',
    translationKeyDesc: 'biscuitPosePlusKitten2Desc',
    isPremiumProgression: true,
    reqChapter: 10,
    defaultTitle: 'Bookstack Peekaboo',
    defaultDesc: 'Peeking adorably over a stack of antique library books.',
  },
  {
    id: 'plus_kitten_3',
    stage: 'kitten',
    translationKeyTitle: 'biscuitPosePlusKitten3',
    translationKeyDesc: 'biscuitPosePlusKitten3Desc',
    isPremiumProgression: true,
    reqChapter: 15,
    defaultTitle: 'Teal Yarn Acrobat',
    defaultDesc: 'Tangled in a cozy ball of teal yarn during playtime.',
  },

  // Adolescent Stage Poses (8 total: 5 free + 3 premium)
  {
    id: 'alert',
    stage: 'adolescent',
    translationKeyTitle: 'biscuitPoseAlert',
    translationKeyDesc: 'biscuitPoseAlertDesc',
    defaultTitle: 'Alert Listener',
    defaultDesc: 'Ears perked up at the sound of a snack bag opening.',
  },
  {
    id: 'adolescent_sunbathing',
    stage: 'adolescent',
    translationKeyTitle: 'biscuitPoseAdolescentSunbathing',
    translationKeyDesc: 'biscuitPoseAdolescentSunbathingDesc',
    defaultTitle: 'Sunlit Nap',
    defaultDesc: 'Basking in a warm golden beam on the library rug.',
  },
  {
    id: 'walking',
    stage: 'adolescent',
    translationKeyTitle: 'biscuitPoseWalking',
    translationKeyDesc: 'biscuitPoseWalkingDesc',
    defaultTitle: 'Campus Stroll',
    defaultDesc: 'Strutting proudly across the central quad.',
  },
  {
    id: 'adolescent_rooftop',
    stage: 'adolescent',
    translationKeyTitle: 'biscuitPoseAdolescentRooftop',
    translationKeyDesc: 'biscuitPoseAdolescentRooftopDesc',
    defaultTitle: 'Rooftop Observer',
    defaultDesc: 'Perched high above watching the sunset over campus.',
  },
  {
    id: 'adolescent_prowling',
    stage: 'adolescent',
    translationKeyTitle: 'biscuitPoseAdolescentProwling',
    translationKeyDesc: 'biscuitPoseAdolescentProwlingDesc',
    defaultTitle: 'Garden Prowler',
    defaultDesc: 'Stalking through the botanical garden bushes.',
  },

  // Premium Progression Poses for Adolescent Stage
  {
    id: 'plus_adolescent_1',
    stage: 'adolescent',
    translationKeyTitle: 'biscuitPosePlusAdolescent1',
    translationKeyDesc: 'biscuitPosePlusAdolescent1Desc',
    isPremiumProgression: true,
    reqChapter: 21,
    defaultTitle: 'Sunlit Windowsill Gazer',
    defaultDesc: 'Standing tall at the windowsill, watching campus life outside.',
  },
  {
    id: 'plus_adolescent_2',
    stage: 'adolescent',
    translationKeyTitle: 'biscuitPosePlusAdolescent2',
    translationKeyDesc: 'biscuitPosePlusAdolescent2Desc',
    isPremiumProgression: true,
    reqChapter: 27,
    defaultTitle: 'Velvet Lounge Slumber',
    defaultDesc: 'Blissfully snoozing upside down on a soft armchair.',
  },
  {
    id: 'plus_adolescent_3',
    stage: 'adolescent',
    translationKeyTitle: 'biscuitPosePlusAdolescent3',
    translationKeyDesc: 'biscuitPosePlusAdolescent3Desc',
    isPremiumProgression: true,
    reqChapter: 33,
    defaultTitle: 'Maple Leaf Retriever',
    defaultDesc: 'Proudly holding a golden maple leaf in his mouth.',
  },

  // Adult Stage Poses (10 total: 6 free + 4 premium)
  {
    id: 'watching',
    stage: 'adult',
    translationKeyTitle: 'biscuitPoseWatching',
    translationKeyDesc: 'biscuitPoseWatchingDesc',
    defaultTitle: 'Campus Watchdog',
    defaultDesc: 'Keeping a watchful eye on students rushing to class.',
  },
  {
    id: 'adult_archway',
    stage: 'adult',
    translationKeyTitle: 'biscuitPoseAdultArchway',
    translationKeyDesc: 'biscuitPoseAdultArchwayDesc',
    defaultTitle: 'Archway Guardian',
    defaultDesc: 'Sitting majestically under the historic stone archway.',
  },
  {
    id: 'adult_scholar',
    stage: 'adult',
    translationKeyTitle: 'biscuitPoseAdultScholar',
    translationKeyDesc: 'biscuitPoseAdultScholarDesc',
    defaultTitle: 'Library Scholar',
    defaultDesc: 'Overseeing study sessions atop computer science textbooks.',
  },
  {
    id: 'adult_bench',
    stage: 'adult',
    translationKeyTitle: 'biscuitPoseAdultBench',
    translationKeyDesc: 'biscuitPoseAdultBenchDesc',
    defaultTitle: 'Park Bench Mascot',
    defaultDesc: 'Enjoying the sun near the campus library entrance.',
  },
  {
    id: 'plus_crown',
    stage: 'adult',
    translationKeyTitle: 'biscuitPosePlusCrown',
    translationKeyDesc: 'biscuitPosePlusCrownDesc',
    defaultTitle: 'Golden Crown Mascot',
    defaultDesc: 'Wearing a tiny paper crown with noble feline poise.',
  },
  {
    id: 'plus_diploma',
    stage: 'adult',
    translationKeyTitle: 'biscuitPosePlusDiploma',
    translationKeyDesc: 'biscuitPosePlusDiplomaDesc',
    defaultTitle: 'Honorary Graduate',
    defaultDesc: 'Graduating with top honors in nap management.',
  },

  // Premium Progression Poses for Adult Stage
  {
    id: 'plus_adult_1',
    stage: 'adult',
    translationKeyTitle: 'biscuitPosePlusAdult1',
    translationKeyDesc: 'biscuitPosePlusAdult1Desc',
    isPremiumProgression: true,
    reqChapter: 38,
    defaultTitle: 'Ancient Tome Scholar',
    defaultDesc: 'Sitting regally atop a stack of vintage leather textbooks.',
  },
  {
    id: 'plus_adult_2',
    stage: 'adult',
    translationKeyTitle: 'biscuitPosePlusAdult2',
    translationKeyDesc: 'biscuitPosePlusAdult2Desc',
    isPremiumProgression: true,
    reqChapter: 44,
    defaultTitle: 'Honorary Diploma Nuzzle',
    defaultDesc: 'Affectionately nuzzling against an academic diploma scroll.',
  },
  {
    id: 'plus_adult_3',
    stage: 'adult',
    translationKeyTitle: 'biscuitPosePlusAdult3',
    translationKeyDesc: 'biscuitPosePlusAdult3Desc',
    isPremiumProgression: true,
    reqChapter: 49,
    defaultTitle: 'Night Lantern Guardian',
    defaultDesc: 'Keeping quiet watch beside a glowing kerosene lantern.',
  },
  {
    id: 'plus_semester_finale',
    stage: 'adult',
    translationKeyTitle: 'biscuitPosePlusFinale',
    translationKeyDesc: 'biscuitPosePlusFinaleDesc',
    isPremiumProgression: true,
    reqChapter: 50,
    isFinale: true,
    defaultTitle: 'Golden Hour Farewell',
    defaultDesc: 'Sitting along the autumn pathway at sunset, seeing you off at the end of the semester.',
  },
];

export function getPosesForStage(stage: BiscuitStageId): BiscuitPoseMeta[] {
  return ALL_BISCUIT_POSES.filter((p) => p.stage === stage);
}

export function getDiscoveredPosesForStage(stage: BiscuitStageId, discovered: BiscuitPoseId[]): BiscuitPoseId[] {
  const stagePoseIds = getPosesForStage(stage).map((p) => p.id);
  return discovered.filter((id) => stagePoseIds.includes(id));
}

const LOCAL_STORAGE_KEY = 'biscuit_discovered_poses';

export function getDiscoveredPoses(): BiscuitPoseId[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as BiscuitPoseId[];
      }
    }
  } catch (e) {
    console.warn('Failed to parse biscuit_discovered_poses from localStorage', e);
  }
  return ['sleeping'];
}

export function unlockBiscuitPose(pose: BiscuitPoseId): BiscuitPoseId[] {
  const current = getDiscoveredPoses();
  if (!current.includes(pose)) {
    const updated = [...current, pose];
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save biscuit_discovered_poses to localStorage', e);
    }
    return updated;
  }
  return current;
}

const ENCOUNTERED_STORAGE_KEY = 'biscuit_encountered_poses';

export function getEncounteredPoses(): string[] {
  try {
    const raw = localStorage.getItem(ENCOUNTERED_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as string[];
      }
    }
  } catch (e) {
    console.warn('Failed to parse biscuit_encountered_poses from localStorage', e);
  }
  return [];
}

export function recordEncounteredPose(poseId: string): string[] {
  const current = getEncounteredPoses();
  if (!current.includes(poseId)) {
    const updated = [...current, poseId];
    try {
      localStorage.setItem(ENCOUNTERED_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save biscuit_encountered_poses to localStorage', e);
    }
    return updated;
  }
  return current;
}

export function syncPosesFromCompletedChapters(
  completedChapterIds: string[] = [],
  isCampusPlus: boolean = false,
  encounteredPoses: string[] = []
): BiscuitPoseId[] {
  const discovered = new Set<BiscuitPoseId>();
  
  const count = completedChapterIds.length;
  discovered.add('sleeping');

  // Kitten stage unlocks (Ch 1-15)
  if (count >= 1) discovered.add('playful');
  if (count >= 3) discovered.add('kitten_curious');
  if (count >= 4) discovered.add('kitten_cozy');
  if (count >= 5) discovered.add('kitten_pouncing');
  if (count >= 7) discovered.add('kitten_yawning');
  if (count >= 8) discovered.add('kitten_peekaboo');
  if (count >= 10) discovered.add('kitten_grooming');
  if (count >= 11) discovered.add('kitten_cuddly');
  if (count >= 12) discovered.add('kitten_exploring');
  if (count >= 14) discovered.add('kitten_playful_ball');
  if (count >= 15) discovered.add('kitten_window_gazer');

  // Adolescent stage unlocks (Ch 16-33)
  if (count >= 16) discovered.add('alert');
  if (count >= 20) discovered.add('adolescent_sunbathing');
  if (count >= 24) discovered.add('walking');
  if (count >= 28) discovered.add('adolescent_rooftop');
  if (count >= 32) discovered.add('adolescent_prowling');

  // Adult stage unlocks (Ch 34-50)
  if (count >= 34) discovered.add('watching');
  if (count >= 37) discovered.add('adult_archway');
  if (count >= 40) discovered.add('adult_scholar');
  if (count >= 42) discovered.add('plus_crown');
  if (count >= 43) discovered.add('adult_bench');
  if (count >= 46) discovered.add('plus_diploma');

  // Local encountered poses
  const localEncountered = getEncounteredPoses();
  const allEncountered = Array.from(new Set([...encounteredPoses, ...localEncountered]));
  for (const enc of allEncountered) {
    discovered.add(enc);
  }

  // Campus Plus Exclusive Unlocks
  if (isCampusPlus) {
    // Retroactive & progression unlock for Campus Plus users:
    const premiumPoses = ALL_BISCUIT_POSES.filter((p) => p.isPremiumProgression);
    for (const p of premiumPoses) {
      if ((p.reqChapter && count >= p.reqChapter) || allEncountered.includes(p.id)) {
        discovered.add(p.id);
      }
    }
  }

  const updatedArray = Array.from(discovered);
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedArray));
  } catch (e) {
    console.warn('Failed to sync biscuit_discovered_poses', e);
  }
  return updatedArray;
}

export interface BiscuitStageInfo {
  stage: 'kitten' | 'adolescent' | 'adult';
  stageIndex: number;
  stageNameKey: string;
  stageDescKey: string;
  progressPercentage: number;
}

export function getBiscuitStageInfo(completedCount: number): BiscuitStageInfo {
  if (completedCount < 16) {
    return {
      stage: 'kitten',
      stageIndex: 0,
      stageNameKey: 'biscuitStageKitten',
      stageDescKey: 'biscuitStageKittenDesc',
      progressPercentage: Math.min(100, Math.round((completedCount / 15) * 100)),
    };
  } else if (completedCount < 34) {
    return {
      stage: 'adolescent',
      stageIndex: 1,
      stageNameKey: 'biscuitStageAdolescent',
      stageDescKey: 'biscuitStageAdolescentDesc',
      progressPercentage: Math.min(100, Math.round(((completedCount - 15) / 18) * 100)),
    };
  } else {
    return {
      stage: 'adult',
      stageIndex: 2,
      stageNameKey: 'biscuitStageAdult',
      stageDescKey: 'biscuitStageAdultDesc',
      progressPercentage: Math.min(100, Math.round(((Math.min(50, completedCount) - 33) / 17) * 100)),
    };
  }
}
