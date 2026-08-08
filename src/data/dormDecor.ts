/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DecorCategory = 'academic' | 'cozy' | 'art';

export interface DecorCategoryInfo {
  id: DecorCategory;
  name: string;
  description: string;
}

export const DECOR_CATEGORIES: DecorCategoryInfo[] = [
  {
    id: 'academic',
    name: 'Academic & Focus',
    description: 'Study essentials and campus memories.',
  },
  {
    id: 'cozy',
    name: 'Cozy & Comfort',
    description: 'Plants and warm decorative accents.',
  },
  {
    id: 'art',
    name: 'Art & Inspiration',
    description: 'Wall art and aesthetic posters.',
  },
];

export interface DecorItem {
  id: string;
  name: string;
  category: DecorCategory;
  image: string;
  description: string;
  position: {
    top: string;
    left: string;
    width: string;
    zIndex: number;
  };
  unlockedByDefault?: boolean;
  isUnlocked?: boolean;
  requiredChapters?: number;
  requiredLocationsCompleted?: number;
  requiredLocationId?: string;
}

export const DORM_DECOR_ITEMS: DecorItem[] = [
  {
    id: 'backpack',
    name: 'Academic Backpack',
    category: 'academic',
    image: '/images/decor_backpack.png',
    description: 'A sturdy backpack filled with notebooks and campus essentials.',
    position: { top: '70.2%', left: '2.2%', width: '15.8%', zIndex: 2 },
    requiredLocationsCompleted: 1,
    requiredLocationId: 'dorm',
  },
  {
    id: 'corkboard',
    name: 'Memories Corkboard',
    category: 'academic',
    image: '/images/decor_corkboard.png',
    description: 'A corkboard filled with polaroids, reminders, and favorite notes.',
    position: { top: '3.6%', left: '-1.2%', width: '13.2%', zIndex: 2 },
    requiredLocationsCompleted: 3,
    requiredLocationId: 'seminar_room',
  },
  {
    id: 'mug',
    name: 'Ceramic Coffee Mug',
    category: 'academic',
    image: '/images/decor_mug.png',
    description: 'A warm mug to keep you energized during late-night study sessions.',
    position: { top: '50.3%', left: '16.8%', width: '7.0%', zIndex: 3 },
    requiredLocationsCompleted: 2,
    requiredLocationId: 'lecture_hall',
  },
  {
    id: 'monstera',
    name: 'Window Monstera Plant',
    category: 'cozy',
    image: '/images/decor_plant.png',
    description: 'A lush monstera bringing fresh greenery and peace to your room.',
    position: { top: '34.7%', left: '42.0%', width: '14.1%', zIndex: 2 },
    requiredLocationsCompleted: 5,
    requiredLocationId: 'library',
  },
  {
    id: 'owl',
    name: 'Cozy Owl Statue',
    category: 'cozy',
    image: '/images/decor_owl.png',
    description: 'A small wooden owl keeping watch over your bookshelf.',
    position: { top: '33.4%', left: '71.2%', width: '6.4%', zIndex: 3 },
    requiredLocationsCompleted: 4,
    requiredLocationId: 'writing_center',
  },
  {
    id: 'mountain_frame',
    name: 'Mountain Landscape',
    category: 'art',
    image: '/images/decor_poster_mountain.png',
    description: 'A calming framed painting of serene mountain peaks.',
    position: { top: '13.8%', left: '63.8%', width: '12.0%', zIndex: 2 },
    requiredLocationsCompleted: 6,
    requiredLocationId: 'dining_hall',
  },
  {
    id: 'edinburgh_poster',
    name: 'Edinburgh Art Poster',
    category: 'art',
    image: '/images/decor_poster_edinburgh.png',
    description: 'A vintage travel poster highlighting the charm of Edinburgh.',
    position: { top: '11.5%', left: '79.4%', width: '17.2%', zIndex: 2 },
    requiredLocationsCompleted: 7,
    requiredLocationId: 'student_union',
  },
];
