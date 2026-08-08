/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCampus } from '../context/CampusContext';
import { LocationSvgScene } from './LocationSvgScenes';

// Raw camera asset imports
import img2177 from '../assets/images/IMG_2177.PNG';
import img2178 from '../assets/images/IMG_2178.PNG';
import img2180 from '../assets/images/IMG_2180.PNG';
import img2181 from '../assets/images/IMG_2181.PNG';
import img2183 from '../assets/images/IMG_2183.PNG';
import img2184 from '../assets/images/IMG_2184.PNG';
import img2205 from '../assets/images/IMG_2205.PNG';
import img2207 from '../assets/images/IMG_2207.PNG';
import img2208 from '../assets/images/IMG_2208.PNG';
import img2209 from '../assets/images/IMG_2209.PNG';
import img2210 from '../assets/images/IMG_2210.PNG';
import img2222 from '../assets/images/IMG_2222.PNG';
import img2249 from '../assets/images/IMG_2249.PNG';
import img2250 from '../assets/images/IMG_2250.PNG';

// Day variants (existing standard files)
import dormDay from '../assets/images/dorm_day.jpg';
import lectureHallDay from '../assets/images/lecture_hall_day.jpg';
import libraryDay from '../assets/images/library_day.jpg';
import oakDay from '../assets/images/oak_hall_day_1784541386784.jpg';
import pineDay from '../assets/images/pine_hall_day_1784541415432.jpg';

// Night variants (existing standard files)
import dormNight from '../assets/images/dorm_night.jpg';
import lectureHallNight from '../assets/images/lecture_hall_night.jpg';
import libraryNight from '../assets/images/library_night.jpg';
import oakNight from '../assets/images/oak_hall_night_1784541403453.jpg';
import pineNight from '../assets/images/pine_hall_night_1784541430027.jpg';

// Explicit mapping dictionary connecting target locations and Day/Night states to imported assets
const locationImageMap: Record<string, { day: string; night: string }> = {
  // University Quad: Day IMG_2249.PNG | Night IMG_2250.PNG
  quad: { day: img2249, night: img2250 },
  university_quad: { day: img2249, night: img2250 },
  universityquad: { day: img2249, night: img2250 },

  // Science Lab: Day IMG_2177.PNG | Night IMG_2222.PNG
  science_lab: { day: img2177, night: img2222 },
  sciencelab: { day: img2177, night: img2222 },
  lab: { day: img2177, night: img2222 },

  // Seminar Room: Day IMG_2184.PNG | Night IMG_2210.PNG
  seminar_room: { day: img2184, night: img2210 },
  seminarroom: { day: img2184, night: img2210 },
  seminar: { day: img2184, night: img2210 },

  // Student Union: Day IMG_2181.PNG | Night IMG_2208.PNG
  student_union: { day: img2181, night: img2208 },
  studentunion: { day: img2181, night: img2208 },
  union: { day: img2181, night: img2208 },

  // Writing Center: Day IMG_2180.PNG | Night IMG_2207.PNG
  writing_center: { day: img2180, night: img2207 },
  writingcenter: { day: img2180, night: img2207 },

  // Dining Hall: Day IMG_2178.PNG | Night IMG_2205.PNG
  dining_hall: { day: img2178, night: img2205 },
  dininghall: { day: img2178, night: img2205 },
  dining: { day: img2178, night: img2205 },

  // Career Center: Day IMG_2183.PNG | Night IMG_2209.PNG
  career_center: { day: img2183, night: img2209 },
  careercenter: { day: img2183, night: img2209 },
  career: { day: img2183, night: img2209 },

  // Additional campus locations
  lecture_hall: { day: lectureHallDay, night: lectureHallNight },
  lecturehall: { day: lectureHallDay, night: lectureHallNight },

  library: { day: libraryDay, night: libraryNight },
};

interface LocationIllustrationProps {
  locationId?: string;
  location?: string;
  className?: string;
  dimmed?: boolean;
}

export const LocationIllustration: React.FC<LocationIllustrationProps> = ({
  locationId,
  location,
  className = 'w-full h-full',
  dimmed = false
}) => {
  let darkMode = false;
  let dormType = 'Elm Hall';
  try {
    const campus = useCampus();
    darkMode = campus.darkMode;
    if (campus.profile && campus.profile.dorm) {
      dormType = campus.profile.dorm;
    }
  } catch (e) {
    // Fallback if rendered outside of CampusProvider
  }

  const isDark = darkMode;
  const filterStyle = dimmed ? 'grayscale opacity-60' : '';

  // Track if an image asset failed to load in the browser so we can fallback gracefully
  const [imgFailed, setImgFailed] = React.useState(false);

  // Normalize location key: flexible string resolution regardless of snake_case, camelCase, or kebab-case
  const rawKey = locationId || location || '';
  const key = String(rawKey)
    .toLowerCase()
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]/g, '_');

  React.useEffect(() => {
    setImgFailed(false);
  }, [locationId, location, key, isDark, dormType]);

  // Retrieve the corresponding image source based on key, dormType, and day/night mode
  const getImageSrc = (): string => {
    if (imgFailed) {
      if (key.includes('quad')) {
        return isDark ? img2250 : img2249;
      }
      return isDark ? img2208 : img2181;
    }

    // Special handling for dorm variations based on user profile dorm selection
    if (
      key.includes('dorm') ||
      key.includes('elm_hall') ||
      key.includes('oak_hall') ||
      key.includes('pine_hall')
    ) {
      if (dormType === 'Oak Hall') {
        return isDark ? oakNight : oakDay;
      } else if (dormType === 'Pine Hall') {
        return isDark ? pineNight : pineDay;
      } else {
        return isDark ? dormNight : dormDay;
      }
    }

    // Flexible key matching for all custom camera artwork locations
    if (key.includes('quad')) {
      return isDark ? img2250 : img2249;
    }

    if (key.includes('science') || key.includes('lab')) {
      return isDark ? img2222 : img2177;
    }

    if (key.includes('seminar')) {
      return isDark ? img2210 : img2184;
    }

    if (key.includes('student') || key.includes('union')) {
      return isDark ? img2208 : img2181;
    }

    if (key.includes('writing')) {
      return isDark ? img2207 : img2180;
    }

    if (key.includes('dining')) {
      return isDark ? img2205 : img2178;
    }

    if (key.includes('career')) {
      return isDark ? img2209 : img2183;
    }

    if (key.includes('lecture')) {
      return isDark ? lectureHallNight : lectureHallDay;
    }

    if (key.includes('library')) {
      return isDark ? libraryNight : libraryDay;
    }

    const mapped = locationImageMap[key];
    if (mapped) {
      return isDark ? mapped.night : mapped.day;
    }

    return isDark ? img2250 : img2249;
  };

  const imageSrc = getImageSrc();

  return (
    <div 
      className={`relative w-full h-full overflow-hidden transition-all duration-500 ${filterStyle} ${className}`} 
      id={`location-art-${key}`}
    >
      {imageSrc ? (
        <img
          key={`${key}-${isDark ? 'night' : 'day'}-${dormType}`}
          src={imageSrc}
          alt={locationId || location || 'location'}
          className="w-full h-full object-cover rounded-2xl"
          onError={() => setImgFailed(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <LocationSvgScene locationId={locationId || location || ''} isDark={isDark} className="w-full h-full object-cover rounded-2xl" />
      )}
    </div>
  );
};



