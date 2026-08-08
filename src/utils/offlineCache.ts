/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chapter } from '../data/models';

export const OFFLINE_CACHE_LIMIT_FREE = 2;
export const OFFLINE_CACHE_LIMIT_PLUS = 10;

export interface OfflineCacheStatus {
  cachedCount: number;
  limit: number;
  isCampusPlus: boolean;
  cachedChapterIds: string[];
}

const STORAGE_KEY = 'campus_offline_cached_chapters';

export function getOfflineCacheLimit(isCampusPlus: boolean): number {
  return isCampusPlus ? OFFLINE_CACHE_LIMIT_PLUS : OFFLINE_CACHE_LIMIT_FREE;
}

export function getCachedChapters(): Chapter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('[offlineCache] Failed to parse cached chapters:', e);
    return [];
  }
}

export function saveChapterToOfflineCache(chapter: Chapter, isCampusPlus: boolean): { success: boolean; isAtCapacity: boolean; currentCount: number; limit: number } {
  const current = getCachedChapters();
  const limit = getOfflineCacheLimit(isCampusPlus);
  
  // Check if already cached
  const existingIndex = current.findIndex(c => c.id === chapter.id);
  if (existingIndex >= 0) {
    current[existingIndex] = chapter; // Update in place
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return { success: true, isAtCapacity: false, currentCount: current.length, limit };
  }

  // If new, check limit
  if (current.length >= limit) {
    return { success: false, isAtCapacity: true, currentCount: current.length, limit };
  }

  current.push(chapter);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  return { success: true, isAtCapacity: false, currentCount: current.length, limit };
}

export function getOfflineCacheStatus(isCampusPlus: boolean): OfflineCacheStatus {
  const cached = getCachedChapters();
  const limit = getOfflineCacheLimit(isCampusPlus);
  return {
    cachedCount: cached.length,
    limit,
    isCampusPlus,
    cachedChapterIds: cached.map(c => c.id)
  };
}

export function clearOfflineCache(): void {
  localStorage.removeItem(STORAGE_KEY);
}
