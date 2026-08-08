/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NoteEntry {
  id: string;
  chapterId: string;
  text: string;
  createdAt: string;
  type?: string;
}

const LOCAL_STORAGE_KEY = 'campus_user_notes';

export async function fetchUserNotes(): Promise<NoteEntry[]> {
  let localNotes: NoteEntry[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        localNotes = parsed
          .filter((n): n is NoteEntry => Boolean(n && typeof n === 'object'))
          .map((n, idx) => ({
            id: String(n.id || `local_note_${idx}`),
            chapterId: String(n.chapterId || '1'),
            text: String(n.text || '').trim(),
            createdAt: n.createdAt ? String(n.createdAt) : new Date().toISOString(),
            type: n.type ? String(n.type) : 'LECTURE'
          }));
      }
    }
  } catch (e) {
    console.error('Failed to parse local notes:', e);
  }

  const token = localStorage.getItem('campus_auth_token');
  if (token) {
    try {
      const res = await fetch('/api/user/notes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.notes)) {
          const serverNotes: NoteEntry[] = data.notes
            .filter((sn: any) => Boolean(sn && typeof sn === 'object'))
            .map((sn: any, idx: number) => ({
              id: String(sn.id || `server_note_${idx}`),
              chapterId: String(sn.chapterId || '1'),
              text: String(sn.text || '').trim(),
              createdAt: sn.createdAt ? String(sn.createdAt) : new Date().toISOString(),
              type: sn.type ? String(sn.type) : 'LECTURE'
            }));
          
          // Merge local and server notes, avoiding duplicates
          const mergedMap = new Map<string, NoteEntry>();
          localNotes.forEach(n => {
            const safeText = (n.text || '').trim();
            const key = `${n.chapterId}_${safeText}`;
            if (safeText) mergedMap.set(key, n);
          });
          serverNotes.forEach(sn => {
            const safeText = (sn.text || '').trim();
            const key = `${sn.chapterId}_${safeText}`;
            if (safeText) {
              if (!mergedMap.has(key)) {
                mergedMap.set(key, sn);
              } else {
                mergedMap.set(key, { ...mergedMap.get(key)!, ...sn });
              }
            }
          });

          const merged = Array.from(mergedMap.values());
          merged.sort((a, b) => {
            const timeA = new Date(a.createdAt).getTime() || 0;
            const timeB = new Date(b.createdAt).getTime() || 0;
            return timeB - timeA;
          });
          
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
          } catch (e) {
            // storage full fallback
          }
          return merged;
        }
      }
    } catch (e) {
      console.warn('Could not fetch server notes, falling back to local notes:', e);
    }
  }

  localNotes = localNotes.filter(n => Boolean(n.text.trim()));
  localNotes.sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime() || 0;
    const timeB = new Date(b.createdAt).getTime() || 0;
    return timeB - timeA;
  });
  return localNotes;
}

export async function saveUserNote(chapterId: string, text: string): Promise<NoteEntry | null> {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const newNote: NoteEntry = {
    id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    chapterId,
    text: trimmed,
    createdAt: new Date().toISOString(),
    type: 'LECTURE'
  };

  let localNotes: NoteEntry[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) localNotes = JSON.parse(raw);
  } catch (e) {
    // empty
  }

  // Prevent duplicate exact note entry
  const exists = localNotes.some(n => n.chapterId === chapterId && n.text.trim() === trimmed);
  if (!exists) {
    localNotes.unshift(newNote);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localNotes));
    } catch (e) {
      // storage quota fallback
    }
  }

  const token = localStorage.getItem('campus_auth_token');
  if (token) {
    try {
      await fetch('/api/user/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          chapterId,
          text: trimmed
        })
      });
    } catch (e) {
      console.warn('Failed to sync note to server:', e);
    }
  }

  return newNote;
}
