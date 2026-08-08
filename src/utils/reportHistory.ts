/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SkillType } from '../data/models';

export interface SemesterReportSnapshot {
  id: string;
  createdAt: string;
  studentName: string;
  major: string;
  dorm: string;
  completedCount: number;
  totalChapters: number;
  skills: Record<string, number>;
  toeflEst: string;
  ieltsEst: number;
}

const LOCAL_SNAPSHOTS_KEY = 'campus_semester_report_snapshots';

export async function getSavedReportSnapshots(): Promise<SemesterReportSnapshot[]> {
  const token = localStorage.getItem('campus_auth_token');
  
  // Read local storage snapshots first
  let localList: SemesterReportSnapshot[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_SNAPSHOTS_KEY);
    localList = raw ? JSON.parse(raw) : [];
  } catch (e) {
    localList = [];
  }

  // Try fetching from Supabase backend route if authenticated
  if (token) {
    try {
      const res = await fetch('/api/user/reports', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reports && Array.isArray(data.reports)) {
          const formatted: SemesterReportSnapshot[] = data.reports.map((r: any) => {
            if (r.snapshot_data) {
              return {
                id: r.id,
                createdAt: r.created_at || new Date().toISOString(),
                ...r.snapshot_data
              };
            }
            return r;
          });
          // Merge local and server snapshots so local ones are preserved if server is empty
          const map = new Map<string, SemesterReportSnapshot>();
          for (const item of localList) {
            map.set(item.id, item);
          }
          for (const item of formatted) {
            map.set(item.id, item);
          }
          const sorted = Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          localStorage.setItem(LOCAL_SNAPSHOTS_KEY, JSON.stringify(sorted));
          return sorted;
        }
      }
    } catch (err) {
      console.warn('[reportHistory] Supabase fetch error, falling back to localStorage:', err);
    }
  }

  // Local Storage fallback
  return localList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function saveReportSnapshot(
  data: Omit<SemesterReportSnapshot, 'id' | 'createdAt'>
): Promise<SemesterReportSnapshot> {
  const token = localStorage.getItem('campus_auth_token');
  const snapshot: SemesterReportSnapshot = {
    id: 'snap_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
    ...data
  };

  // Try Supabase endpoint
  if (token) {
    try {
      const res = await fetch('/api/user/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ snapshotData: data })
      });
      if (res.ok) {
        const result = await res.json();
        if (result.report && result.report.id) {
          snapshot.id = result.report.id;
          if (result.report.created_at) {
            snapshot.createdAt = result.report.created_at;
          }
        }
      }
    } catch (err) {
      console.warn('[reportHistory] Supabase save error, keeping local snapshot:', err);
    }
  }

  // Update local storage directly
  try {
    const raw = localStorage.getItem(LOCAL_SNAPSHOTS_KEY);
    const current: SemesterReportSnapshot[] = raw ? JSON.parse(raw) : [];
    const updated = [snapshot, ...current.filter(s => s.id !== snapshot.id)];
    localStorage.setItem(LOCAL_SNAPSHOTS_KEY, JSON.stringify(updated));
  } catch (e) {
    localStorage.setItem(LOCAL_SNAPSHOTS_KEY, JSON.stringify([snapshot]));
  }
  return snapshot;
}

export async function deleteReportSnapshot(id: string): Promise<void> {
  const token = localStorage.getItem('campus_auth_token');
  if (token) {
    try {
      await fetch(`/api/user/reports/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.warn('[reportHistory] Supabase delete error:', err);
    }
  }

  const raw = localStorage.getItem(LOCAL_SNAPSHOTS_KEY);
  if (raw) {
    try {
      const current: SemesterReportSnapshot[] = JSON.parse(raw);
      const updated = current.filter(s => s.id !== id);
      localStorage.setItem(LOCAL_SNAPSHOTS_KEY, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  }
}
