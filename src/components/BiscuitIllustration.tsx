/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import biscuitAlert from '../assets/images/biscuit_alert.jpg';
import biscuitSleeping from '../assets/images/biscuit_sleeping.jpg';
import biscuitPlayful from '../assets/images/biscuit_playful.jpg';
import biscuitWalking from '../assets/images/biscuit_walking.jpg';
import biscuitWatching from '../assets/images/biscuit_watching.jpg';

import img2264 from '../assets/images/IMG_2264.PNG';
import img2265 from '../assets/images/IMG_2265.PNG';
import img2266 from '../assets/images/IMG_2266.PNG';
import img2267 from '../assets/images/IMG_2267.PNG';
import img2268 from '../assets/images/IMG_2268.PNG';
import img2269 from '../assets/images/IMG_2269.PNG';
import img2270 from '../assets/images/IMG_2270.PNG';
import img2271 from '../assets/images/IMG_2271.PNG';
import img2272 from '../assets/images/IMG_2272.PNG';
import img2273 from '../assets/images/IMG_2273.PNG';
import img2274 from '../assets/images/IMG_2274.PNG';
import img2275 from '../assets/images/IMG_2275.PNG';
import img2276 from '../assets/images/IMG_2276.PNG';
import img2277 from '../assets/images/IMG_2277.PNG';
import img2279 from '../assets/images/IMG_2279.PNG';
import img2280 from '../assets/images/IMG_2280.PNG';
import img2281 from '../assets/images/IMG_2281.PNG';
import img2282 from '../assets/images/IMG_2282.PNG';
import img2283 from '../assets/images/IMG_2283.PNG';

import img2308 from '../assets/images/IMG_2308.PNG';
import img2309 from '../assets/images/IMG_2309.PNG';
import img2310 from '../assets/images/IMG_2310.PNG';
import img2311 from '../assets/images/IMG_2311.PNG';
import img2312 from '../assets/images/IMG_2312.PNG';
import img2313 from '../assets/images/IMG_2313.PNG';
import img2314 from '../assets/images/IMG_2314.PNG';
import img2315 from '../assets/images/IMG_2315.PNG';
import img2316 from '../assets/images/IMG_2316.PNG';
import img2317 from '../assets/images/IMG_2317.PNG';

export interface BiscuitIllustrationProps {
  className?: string;
  sleeping?: boolean;
  pose?: string;
}

const poseImages: Record<string, string> = {
  // Kitten Stage
  sleeping: biscuitSleeping,
  playful: biscuitPlayful,
  kitten_curious: img2265,
  kitten_cozy: img2266,
  kitten_pouncing: img2267,
  kitten_yawning: img2268,
  kitten_peekaboo: img2269,
  kitten_grooming: img2270,
  kitten_cuddly: img2271,
  kitten_exploring: img2272,
  kitten_playful_ball: img2273,
  kitten_window_gazer: img2274,

  // Adolescent Stage
  alert: biscuitAlert,
  adolescent_sunbathing: img2275,
  walking: biscuitWalking,
  adolescent_rooftop: img2276,
  adolescent_prowling: img2277,

  // Adult Stage
  watching: biscuitWatching,
  adult_archway: img2279,
  adult_scholar: img2280,
  adult_bench: img2281,
  plus_crown: img2282,
  plus_diploma: img2283,

  // 10 Premium Chapter Progression Poses
  plus_kitten_1: img2308,
  plus_kitten_2: img2309,
  plus_kitten_3: img2310,
  plus_adolescent_1: img2311,
  plus_adolescent_2: img2312,
  plus_adolescent_3: img2313,
  plus_adult_1: img2314,
  plus_adult_2: img2315,
  plus_adult_3: img2316,
  plus_semester_finale: img2317,
};

const poseLabels: Record<string, string> = {
  // Kitten Stage
  sleeping: 'Biscuit (Sleeping)',
  playful: 'Biscuit (Playful)',
  kitten_curious: 'Biscuit (Curious Paws)',
  kitten_cozy: 'Biscuit (Cozy Tote Bag)',
  kitten_pouncing: 'Biscuit (Mid-Air Pounce)',
  kitten_yawning: 'Biscuit (Sleepy Yawn)',
  kitten_peekaboo: 'Biscuit (Textbook Peekaboo)',
  kitten_grooming: 'Biscuit (Paw Grooming)',
  kitten_cuddly: 'Biscuit (Warm Lap Nap)',
  kitten_exploring: 'Biscuit (Bookstack Explorer)',
  kitten_playful_ball: 'Biscuit (Yarn Chaser)',
  kitten_window_gazer: 'Biscuit (Rainy Window Gazer)',

  // Adolescent Stage
  alert: 'Biscuit (Curious)',
  adolescent_sunbathing: 'Biscuit (Fountain Sunbathing)',
  walking: 'Biscuit (Strolling)',
  adolescent_rooftop: 'Biscuit (Terrace Perch)',
  adolescent_prowling: 'Biscuit (Evening Patrol)',

  // Adult Stage
  watching: 'Biscuit (Watching)',
  adult_archway: 'Biscuit (Archway Guardian)',
  adult_scholar: 'Biscuit (Library Scholar)',
  adult_bench: 'Biscuit (Quad Bench Snoozer)',
  plus_crown: 'Biscuit (Golden Crown)',
  plus_diploma: 'Biscuit (Starry Scholar)',

  // Labels for 10 Premium Chapter Progression Poses
  plus_kitten_1: 'Biscuit (First Paws)',
  plus_kitten_2: 'Biscuit (Library Nook)',
  plus_kitten_3: 'Biscuit (Sunlit Whisker)',
  plus_adolescent_1: 'Biscuit (Quad Fountain Stroll)',
  plus_adolescent_2: 'Biscuit (Terrace Perch)',
  plus_adolescent_3: 'Biscuit (Twilight Patrol)',
  plus_adult_1: 'Biscuit (Archway Mascot)',
  plus_adult_2: 'Biscuit (Quad Bench Royal)',
  plus_adult_3: 'Biscuit (Honorary Legend)',
  plus_semester_finale: 'Biscuit (Semester Finale)',
};

export function getPoseImage(poseId?: string): string {
  if (!poseId) return biscuitAlert;
  return poseImages[poseId] || biscuitAlert;
}

export function getPoseLabel(poseId?: string): string {
  if (!poseId) return 'Biscuit the Cat';
  return poseLabels[poseId] || 'Biscuit the Cat';
}

export const BiscuitIllustration: React.FC<BiscuitIllustrationProps> = ({
  className = 'w-80 md:w-96 shadow-lg hover:scale-[1.02] transition-all duration-300',
  sleeping = false,
  pose,
}) => {
  const selectedPose = pose || (sleeping ? 'sleeping' : 'alert');
  const imgSrc = poseImages[selectedPose] || biscuitAlert;
  const imgLabel = poseLabels[selectedPose] || 'Biscuit the Cat';

  return (
    <div
      className={`flex flex-col items-center justify-center p-4 sm:p-5 bg-cream-card dark:bg-slate-800 rounded-[28px] border border-navy/10 dark:border-slate-700 shadow-md ${className}`}
      id="biscuit-cat-container"
    >
      <div className="w-full aspect-square rounded-[20px] overflow-hidden shadow-inner border border-navy/5 dark:border-slate-700/60 flex items-center justify-center bg-amber-50/50 dark:bg-slate-900 shrink-0">
        <img
          src={imgSrc}
          alt={imgLabel}
          className="w-full h-full object-cover select-none pointer-events-none"
          referrerPolicy="no-referrer"
        />
      </div>
      <span className="text-[10px] font-mono uppercase tracking-widest text-navy/60 dark:text-amber-200/90 font-bold mt-3.5 whitespace-nowrap">
        {imgLabel}
      </span>
    </div>
  );
};
