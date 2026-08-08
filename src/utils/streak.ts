/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Calculates consecutive active calendar days streak from an array of date strings.
 * Pressure-free, non-judgmental calculation.
 */
export function calculateActiveStreak(completionDates: string[] = []): number {
  if (!completionDates || completionDates.length === 0) {
    return 0;
  }

  const getLocalDateStr = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const todayStr = getLocalDateStr(today);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateStr(yesterday);

  const uniqueDatesSet = new Set<string>();
  completionDates.forEach((dStr) => {
    if (dStr) {
      const normalized = dStr.includes('T')
        ? getLocalDateStr(new Date(dStr))
        : dStr.substring(0, 10);
      uniqueDatesSet.add(normalized);
    }
  });

  const hasToday = uniqueDatesSet.has(todayStr);
  const hasYesterday = uniqueDatesSet.has(yesterdayStr);

  if (!hasToday && !hasYesterday) {
    return 0;
  }

  let count = 0;
  let checkDate = new Date(hasToday ? today : yesterday);

  while (true) {
    const checkStr = getLocalDateStr(checkDate);
    if (uniqueDatesSet.has(checkStr)) {
      count++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return count;
}
