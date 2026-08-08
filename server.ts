import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import { evaluateOpenEndedInput } from './src/utils/evaluationEngine';

// Load base .env first, then let .env.local (gitignored) override it for local development,
// mirroring Vite's own env file precedence.
dotenv.config();
dotenv.config({ path: path.join(process.cwd(), '.env.local'), override: true });

const app = express();
const PORT = 3000;

const KEYS_FILE = path.join(process.cwd(), 'keys-store.json');

interface KeysStore {
  password?: string;
  keys: string[];
  model?: 'gemini-2.5-flash' | 'gemini-2.5-flash-lite';
}

let currentKeyIndex = 0;

function loadKeysStore(): KeysStore {
  try {
    if (fs.existsSync(KEYS_FILE)) {
      const data = fs.readFileSync(KEYS_FILE, 'utf-8');
      const store = JSON.parse(data);
      if (!store.model) {
        store.model = 'gemini-2.5-flash';
      }
      return store;
    }
  } catch (err) {
    console.error('Error reading keys store:', err);
  }

  const defaultStore: KeysStore = {
    password: process.env.ADMIN_PASSWORD || 'admin',
    keys: process.env.GEMINI_API_KEY ? [process.env.GEMINI_API_KEY] : [],
    model: 'gemini-2.5-flash'
  };
  saveKeysStore(defaultStore);
  return defaultStore;
}

function saveKeysStore(store: KeysStore) {
  try {
    fs.writeFileSync(KEYS_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing keys store:', err);
  }
}

function isQuotaError(error: any): boolean {
  if (!error) return false;
  const msg = String(error.message || error).toLowerCase();
  return (
    error.status === 429 ||
    msg.includes('429') ||
    msg.includes('quota') ||
    msg.includes('resource_exhausted') ||
    msg.includes('rate limit')
  );
}

async function callGeminiWithKeysAndModel(
  keys: string[],
  model: string,
  prompt: string,
  systemInstruction?: string
): Promise<{ text: string }> {
  let attempts = 0;
  const maxAttempts = keys.length;
  let allQuotaErrors = true;
  let lastError: any = null;

  while (attempts < maxAttempts) {
    const activeKeyIndex = currentKeyIndex % keys.length;
    const apiKey = keys[activeKeyIndex];
    const maskedKey = apiKey.slice(-4);

    console.log(`[Gemini Rotation] Attempt ${attempts + 1}/${maxAttempts} using model "${model}" and key index ${activeKeyIndex} (...${maskedKey})`);

    try {
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || undefined,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              score: {
                type: 'INTEGER',
                description: 'Total overall score evaluated on a 100-point academic rubric scale (0 to 100).'
              },
              letterGrade: {
                type: 'STRING',
                description: 'Academic letter grade corresponding to the total score (e.g. A, A-, B+, B, C, D, F).'
              },
              skillPointsContribution: {
                type: 'INTEGER',
                description: 'Scaled skill points contribution (between 5 and 20 points).'
              },
              feedback: {
                type: 'STRING',
                description: 'Constructive feedback formatted as two short bullet points (max 15 words each): one key strength and one area for growth.'
              },
              suggestedCorrection: {
                type: 'STRING',
                description: 'One grammatically polished academic version matching the length of the student input.'
              },
              rubricBreakdown: {
                type: 'OBJECT',
                properties: {
                  academicVocabulary: {
                    type: 'OBJECT',
                    properties: {
                      score: { type: 'INTEGER', description: 'Score out of 30' },
                      maxScore: { type: 'INTEGER', description: 'Max points (30)' },
                      feedback: { type: 'STRING', description: 'Exactly 1 brief, punchy sentence (max 12-15 words) evaluating vocabulary usage.' }
                    },
                    required: ['score', 'maxScore', 'feedback']
                  },
                  grammaticalAccuracy: {
                    type: 'OBJECT',
                    properties: {
                      score: { type: 'INTEGER', description: 'Score out of 30' },
                      maxScore: { type: 'INTEGER', description: 'Max points (30)' },
                      feedback: { type: 'STRING', description: 'Exactly 1 brief, punchy sentence (max 12-15 words) evaluating grammar and syntax.' }
                    },
                    required: ['score', 'maxScore', 'feedback']
                  },
                  coherenceFlow: {
                    type: 'OBJECT',
                    properties: {
                      score: { type: 'INTEGER', description: 'Score out of 20' },
                      maxScore: { type: 'INTEGER', description: 'Max points (20)' },
                      feedback: { type: 'STRING', description: 'Exactly 1 brief, punchy sentence (max 12-15 words) evaluating flow and coherence.' }
                    },
                    required: ['score', 'maxScore', 'feedback']
                  },
                  topicRelevance: {
                    type: 'OBJECT',
                    properties: {
                      score: { type: 'INTEGER', description: 'Score out of 20' },
                      maxScore: { type: 'INTEGER', description: 'Max points (20)' },
                      feedback: { type: 'STRING', description: 'Exactly 1 brief, punchy sentence (max 12-15 words) evaluating prompt relevance.' }
                    },
                    required: ['score', 'maxScore', 'feedback']
                  }
                },
                required: ['academicVocabulary', 'grammaticalAccuracy', 'coherenceFlow', 'topicRelevance']
              }
            },
            required: ['score', 'feedback', 'suggestedCorrection', 'rubricBreakdown']
          }
        }
      });

      if (!response.text) {
        throw new Error('Empty response from Gemini');
      }

      return { text: response.text };
    } catch (error: any) {
      console.error(`[Gemini Rotation] Error with model "${model}" and key index ${activeKeyIndex}:`, error.message || error);
      lastError = error;
      if (!isQuotaError(error)) {
        allQuotaErrors = false;
      }
      currentKeyIndex++;
      attempts++;
    }
  }

  throw {
    message: lastError?.message || 'All keys failed',
    allQuotaErrors,
    status: lastError?.status
  };
}

async function callGeminiWithRotation(prompt: string, systemInstruction?: string): Promise<string> {
  const store = loadKeysStore();
  let keys = store.keys;

  if (keys.length === 0) {
    if (process.env.GEMINI_API_KEY) {
      keys = [process.env.GEMINI_API_KEY];
    } else {
      throw new Error('No Gemini API keys configured');
    }
  }

  const selectedModel = store.model || 'gemini-2.5-flash';

  try {
    const result = await callGeminiWithKeysAndModel(keys, selectedModel, prompt, systemInstruction);
    return result.text;
  } catch (err: any) {
    // If ALL stored keys hit a 429 quota error on the currently selected model, retry with gemini-2.5-flash-lite
    if (err && err.allQuotaErrors && selectedModel !== 'gemini-2.5-flash-lite') {
      console.warn(`[Gemini Rotation] ALL keys hit quota limits (429) on "${selectedModel}". Retrying with "gemini-2.5-flash-lite"...`);
      try {
        const fallbackResult = await callGeminiWithKeysAndModel(keys, 'gemini-2.5-flash-lite', prompt, systemInstruction);
        return fallbackResult.text;
      } catch (fallbackErr: any) {
        console.error(`[Gemini Rotation] Fallback retry with gemini-2.5-flash-lite also failed:`, fallbackErr);
        throw fallbackErr;
      }
    } else {
      throw err;
    }
  }
}

// Ensure the keys store file exists at boot
loadKeysStore();

// Middleware for JSON parsing
app.use(express.json());

// Express Static Routing for Decor and Campus Images
const assetsImagesPath = path.resolve(process.cwd(), 'src/assets/images');
const publicImagesPath = path.resolve(process.cwd(), 'public/images');
app.use('/images', express.static(fs.existsSync(assetsImagesPath) ? assetsImagesPath : publicImagesPath));

// Supabase Configuration - strictly sourced from environment variables, no hardcoded fallbacks.
const rawSupabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';

function sanitizeSupabaseUrl(url: string): string {
  let cleaned = (url || '').trim();
  cleaned = cleaned.replace(/\/+$/, '');
  cleaned = cleaned.replace(/\/auth\/v1\/?$/, '');
  cleaned = cleaned.replace(/\/rest\/v1\/?$/, '');
  if (cleaned && !cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'https://' + cleaned;
  }
  return cleaned;
}

const supabaseUrl = sanitizeSupabaseUrl(rawSupabaseUrl);
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[Supabase] Missing SUPABASE_URL/SUPABASE_ANON_KEY environment variables. ' +
      'Set them in .env.local (see .env.example) or Supabase-backed routes will fail.'
  );
}

function getSupabaseClient(accessToken?: string) {
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  if (accessToken) {
    if ((client as any).rest) {
      (client as any).rest.headers = {
        ...(client as any).rest.headers,
        Authorization: `Bearer ${accessToken}`
      };
    }
    client.auth.setSession({
      access_token: accessToken,
      refresh_token: ''
    }).catch((err) => {
      console.error('Error in setSession:', err);
    });
  }

  return client;
}

// User authorization middleware
const supabaseAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
    }
    (req as any).user = user;
    (req as any).token = token;
    next();
  } catch (err) {
    console.error('[Supabase Auth Middleware Error]', err);
    return res.status(401).json({ error: 'Unauthorized: Authentication failed' });
  }
};

// --- AUTHENTICATION API ROUTES ---

// Supabase Signup
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name, major, dorm } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  try {
    const anonClient = getSupabaseClient();
    const { data, error } = await anonClient.auth.signUp({ email, password });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const session = data.session;
    const user = data.user;

    if (!user) {
      return res.status(400).json({ error: 'Failed to create user' });
    }

    if (session) {
      const userClient = getSupabaseClient(session.access_token);
      
      // Insert profile
      const userProfilePayload: any = {
        id: user.id,
        hero_name: name,
        major: major || 'Undecided',
        dorm: dorm || 'Elm Hall',
        exam_preference: req.body.examPreference || 'TOEFL'
      };
      let { error: profileErr } = await userClient.from('users').insert(userProfilePayload);
      if (profileErr && profileErr.message?.includes('exam_preference')) {
        delete userProfilePayload.exam_preference;
        const retry = await userClient.from('users').insert(userProfilePayload);
        profileErr = retry.error;
      }
      if (profileErr) console.error('Error inserting user profile:', profileErr);

      // Insert story state
      const { error: storyErr } = await userClient.from('story_state').insert({
        user_id: user.id,
        current_chapter_id: '1',
        npc_relationships: {},
        story_flags: { completedChapterIds: [] }
      });
      if (storyErr) console.error('Error inserting story state:', storyErr);

      // Insert skill scores
      const { error: skillErr } = await userClient.from('skill_scores').insert({
        user_id: user.id,
        listening_score: 0,
        speaking_score: 0,
        writing_score: 0,
        reading_score: 0
      });
      if (skillErr) console.error('Error inserting skill scores:', skillErr);

      return res.json({
        session,
        profile: {
          name,
          major: major || 'Undecided',
          dorm: dorm || 'Elm Hall',
          examPreference: req.body.examPreference || 'TOEFL',
          isOnboarded: true,
          email: user.email
        },
        progress: {
          skills: { Listening: 0, Speaking: 0, Writing: 0, Reading: 0 },
          completedChapterIds: [],
          currentChapterId: '1',
          friendshipPoints: {}
        }
      });
    } else {
      return res.json({
        message: 'Registration successful! Please check your email for verification link.',
        requiresVerification: true
      });
    }
  } catch (err: any) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: err.message || 'Signup failed' });
  }
});

// Supabase Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password, name, major, dorm } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const anonClient = getSupabaseClient();
    const { data, error } = await anonClient.auth.signInWithPassword({ email, password });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const session = data.session;
    const user = data.user;

    if (!session || !user) {
      return res.status(400).json({ error: 'Failed to authenticate user' });
    }

    const userClient = getSupabaseClient(session.access_token);

    // Fetch or create user profile
    let { data: profileRow, error: profileGetErr } = await userClient
      .from('users')
      .select('*')
      .maybeSingle();

    if (!profileRow) {
      console.log(`Profile row not found for user ${user.id}. Creating default/provided profile...`);
      await userClient.from('users').insert({
        id: user.id,
        hero_name: name || 'Hero',
        major: major || 'Undecided',
        dorm: dorm || 'Elm Hall'
      });
      const { data: reloaded } = await userClient.from('users').select('*').maybeSingle();
      profileRow = reloaded;
    }

    // Fetch or create story state
    let { data: storyRow } = await userClient
      .from('story_state')
      .select('*')
      .maybeSingle();

    if (!storyRow) {
      console.log(`Story state row not found for user ${user.id}. Creating...`);
      await userClient.from('story_state').insert({
        user_id: user.id,
        current_chapter_id: '1',
        npc_relationships: {},
        story_flags: { completedChapterIds: [] }
      });
      const { data: reloadedStory } = await userClient.from('story_state').select('*').maybeSingle();
      storyRow = reloadedStory;
    }

    // Fetch or create skill scores
    let { data: skillRow } = await userClient
      .from('skill_scores')
      .select('*')
      .maybeSingle();

    if (!skillRow) {
      console.log(`Skill scores row not found for user ${user.id}. Creating...`);
      await userClient.from('skill_scores').insert({
        user_id: user.id,
        listening_score: 0,
        speaking_score: 0,
        writing_score: 0,
        reading_score: 0
      });
      const { data: reloadedSkill } = await userClient.from('skill_scores').select('*').maybeSingle();
      skillRow = reloadedSkill;
    }

    const profile = {
      name: profileRow?.hero_name || name || 'Hero',
      major: profileRow?.major || major || 'Undecided',
      dorm: profileRow?.dorm || dorm || 'Elm Hall',
      examPreference: profileRow?.exam_preference || profileRow?.examPreference || 'TOEFL',
      isOnboarded: true,
      email: user.email
    };

    const progress = {
      skills: {
        Listening: Number(skillRow?.listening_score || 0),
        Speaking: Number(skillRow?.speaking_score || 0),
        Writing: Number(skillRow?.writing_score || 0),
        Reading: Number(skillRow?.reading_score || 0)
      },
      completedChapterIds: storyRow?.story_flags?.completedChapterIds || [],
      currentChapterId: storyRow?.current_chapter_id || '1',
      friendshipPoints: storyRow?.npc_relationships || {}
    };

    return res.json({
      session,
      profile,
      progress
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// Logout endpoint (informational)
app.post('/api/auth/logout', async (req, res) => {
  res.json({ success: true });
});

// Refresh session token endpoint
app.post('/api/auth/refresh', async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  try {
    const anonClient = getSupabaseClient();
    const { data, error } = await anonClient.auth.refreshSession({ refresh_token });

    if (error || !data.session) {
      console.error('[Supabase Session Refresh Error]', error);
      return res.status(401).json({ error: error?.message || 'Failed to refresh session' });
    }

    return res.json({
      session: data.session
    });
  } catch (err: any) {
    console.error('Session refresh error:', err);
    return res.status(500).json({ error: err.message || 'Session refresh failed' });
  }
});

// --- USER PROFILE API ROUTES ---

app.get('/api/user/profile', supabaseAuth, async (req, res) => {
  const token = (req as any).token;
  try {
    const userClient = getSupabaseClient(token);
    const { data: profileRow, error } = await userClient
      .from('users')
      .select('*')
      .maybeSingle();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!profileRow) {
      return res.json({ name: '', major: 'Undecided', dorm: 'Elm Hall', examPreference: 'TOEFL', isOnboarded: false });
    }

    res.json({
      name: profileRow.hero_name,
      major: profileRow.major,
      dorm: profileRow.dorm,
      examPreference: profileRow.exam_preference || profileRow.examPreference || 'TOEFL',
      isOnboarded: true,
      email: (req as any).user.email
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch profile' });
  }
});

app.post('/api/user/profile', supabaseAuth, async (req, res) => {
  const token = (req as any).token;
  const user = (req as any).user;
  const { name, major, dorm, examPreference } = req.body;
  try {
    const userClient = getSupabaseClient(token);
    const upsertPayload: any = {
      id: user.id,
      hero_name: name,
      major,
      dorm,
      exam_preference: examPreference || 'TOEFL'
    };

    let { data: updatedRow, error } = await userClient
      .from('users')
      .upsert(upsertPayload)
      .select()
      .maybeSingle();

    if (error && error.message?.includes('exam_preference')) {
      delete upsertPayload.exam_preference;
      const retry = await userClient
        .from('users')
        .upsert(upsertPayload)
        .select()
        .maybeSingle();
      updatedRow = retry.data;
      error = retry.error;
    }

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      name: updatedRow?.hero_name || name,
      major: updatedRow?.major || major,
      dorm: updatedRow?.dorm || dorm,
      examPreference: updatedRow?.exam_preference || updatedRow?.examPreference || examPreference || 'TOEFL',
      isOnboarded: true,
      email: user.email
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update profile' });
  }
});

// Semester Report History API
app.get('/api/user/reports', supabaseAuth, async (req, res) => {
  const token = (req as any).token;
  const user = (req as any).user;
  try {
    const userClient = getSupabaseClient(token);
    const { data, error } = await userClient
      .from('semester_reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[server] Supabase semester_reports select error:', error.message);
      return res.json({ reports: [] });
    }
    return res.json({ reports: data || [] });
  } catch (err: any) {
    return res.json({ reports: [] });
  }
});

app.post('/api/user/reports', supabaseAuth, async (req, res) => {
  const token = (req as any).token;
  const user = (req as any).user;
  const { snapshotData } = req.body;

  if (!snapshotData) {
    return res.status(400).json({ error: 'Missing snapshotData' });
  }

  try {
    const userClient = getSupabaseClient(token);
    const id = 'rep_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newReport = {
      id,
      user_id: user.id,
      created_at: new Date().toISOString(),
      snapshot_data: snapshotData
    };

    const { data, error } = await userClient
      .from('semester_reports')
      .insert(newReport)
      .select();

    if (error) {
      console.warn('[server] Supabase semester_reports insert error:', error.message);
      return res.json({ report: newReport, warning: error.message });
    }

    return res.json({ report: data ? data[0] : newReport });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/user/change-password', supabaseAuth, async (req, res) => {
  const token = (req as any).token;
  const user = (req as any).user;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  try {
    // 1. Verify current password
    const anonClient = getSupabaseClient();
    const { error: signInError } = await anonClient.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    });

    if (signInError) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    // 2. Update password
    const userClient = getSupabaseClient(token);
    const { error: updateError } = await userClient.auth.updateUser({ password: newPassword });

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error('Password update error:', err);
    res.status(500).json({ error: err.message || 'Failed to update password' });
  }
});

app.delete('/api/user/delete-account', supabaseAuth, async (req, res) => {
  const token = (req as any).token;

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseAnonKey
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Delete Account Error from Supabase Auth]', errText);
      try {
        const parsed = JSON.parse(errText);
        return res.status(response.status).json({ error: parsed.error || parsed.msg || 'Failed to delete auth account' });
      } catch (e) {
        return res.status(response.status).json({ error: 'Failed to delete auth account: ' + errText });
      }
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error('Delete account error:', err);
    res.status(500).json({ error: err.message || 'Failed to delete account' });
  }
});

// --- PROGRESS API ROUTES ---

app.get('/api/user/progress', supabaseAuth, async (req, res) => {
  const token = (req as any).token;
  const user = (req as any).user;
  try {
    const userClient = getSupabaseClient(token);
    
    let { data: storyRow } = await userClient
      .from('story_state')
      .select('*')
      .maybeSingle();

    if (!storyRow) {
      await userClient.from('story_state').insert({
        user_id: user.id,
        current_chapter_id: '1',
        npc_relationships: {},
        story_flags: { completedChapterIds: [] }
      });
      const { data: reloadedStory } = await userClient.from('story_state').select('*').single();
      storyRow = reloadedStory;
    }

    let { data: skillRow } = await userClient
      .from('skill_scores')
      .select('*')
      .maybeSingle();

    if (!skillRow) {
      await userClient.from('skill_scores').insert({
        user_id: user.id,
        listening_score: 0,
        speaking_score: 0,
        writing_score: 0,
        reading_score: 0
      });
      const { data: reloadedSkill } = await userClient.from('skill_scores').select('*').single();
      skillRow = reloadedSkill;
    }

    const completionDates: string[] = storyRow?.story_flags?.completionDates || [];
    try {
      const { data: userAttempts } = await userClient
        .from('attempts')
        .select('created_at');
      if (userAttempts && userAttempts.length > 0) {
        userAttempts.forEach((a: any) => {
          if (a.created_at) {
            const dateStr = new Date(a.created_at).toISOString().split('T')[0];
            if (!completionDates.includes(dateStr)) {
              completionDates.push(dateStr);
            }
          }
        });
      }
    } catch (e) {
      // attempts query fallback
    }

    res.json({
      skills: {
        Listening: Number(skillRow?.listening_score || 0),
        Speaking: Number(skillRow?.speaking_score || 0),
        Writing: Number(skillRow?.writing_score || 0),
        Reading: Number(skillRow?.reading_score || 0)
      },
      completedChapterIds: storyRow?.story_flags?.completedChapterIds || [],
      currentChapterId: storyRow?.current_chapter_id || '1',
      friendshipPoints: storyRow?.npc_relationships || {},
      completionDates,
      encounteredPoses: storyRow?.story_flags?.encounteredPoses || []
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch progress' });
  }
});

app.post('/api/user/progress', supabaseAuth, async (req, res) => {
  const token = (req as any).token;
  const user = (req as any).user;
  const { currentChapterId, completedChapterIds, friendshipPoints, skills } = req.body;
  try {
    const userClient = getSupabaseClient(token);
    
    let { data: storyRow } = await userClient.from('story_state').select('*').maybeSingle();
    let { data: skillRow } = await userClient.from('skill_scores').select('*').maybeSingle();

    if (currentChapterId !== undefined || completedChapterIds !== undefined || friendshipPoints !== undefined) {
      const updates: any = {};
      if (currentChapterId !== undefined) updates.current_chapter_id = currentChapterId;
      if (friendshipPoints !== undefined) updates.npc_relationships = friendshipPoints;
      if (completedChapterIds !== undefined) {
        updates.story_flags = { completedChapterIds };
      }

      if (!storyRow) {
        await userClient.from('story_state').insert({
          user_id: user.id,
          current_chapter_id: '1',
          npc_relationships: {},
          story_flags: { completedChapterIds: [] },
          ...updates
        });
      } else {
        await userClient.from('story_state').update(updates).eq('user_id', user.id);
      }
    }

    if (skills !== undefined) {
      const updates: any = {};
      if (skills.Listening !== undefined) updates.listening_score = skills.Listening;
      if (skills.Speaking !== undefined) updates.speaking_score = skills.Speaking;
      if (skills.Writing !== undefined) updates.writing_score = skills.Writing;
      if (skills.Reading !== undefined) updates.reading_score = skills.Reading;

      if (!skillRow) {
        await userClient.from('skill_scores').insert({
          user_id: user.id,
          listening_score: 0,
          speaking_score: 0,
          writing_score: 0,
          reading_score: 0,
          ...updates
        });
      } else {
        await userClient.from('skill_scores').update(updates).eq('user_id', user.id);
      }
    }

    let { data: reloadedStory } = await userClient.from('story_state').select('*').maybeSingle();
    let { data: reloadedSkill } = await userClient.from('skill_scores').select('*').maybeSingle();

    res.json({
      skills: {
        Listening: Number(reloadedSkill?.listening_score || 0),
        Speaking: Number(reloadedSkill?.speaking_score || 0),
        Writing: Number(reloadedSkill?.writing_score || 0),
        Reading: Number(reloadedSkill?.reading_score || 0)
      },
      completedChapterIds: reloadedStory?.story_flags?.completedChapterIds || [],
      currentChapterId: reloadedStory?.current_chapter_id || '1',
      friendshipPoints: reloadedStory?.npc_relationships || {}
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update progress' });
  }
});

app.post('/api/user/progress/increment-skill', supabaseAuth, async (req, res) => {
  const token = (req as any).token;
  const user = (req as any).user;
  const { skill, amount } = req.body;
  if (!skill || amount === undefined) {
    return res.status(400).json({ error: 'Skill and amount are required' });
  }

  try {
    const userClient = getSupabaseClient(token);
    let { data: skillRow } = await userClient.from('skill_scores').select('*').maybeSingle();
    
    if (!skillRow) {
      await userClient.from('skill_scores').insert({
        user_id: user.id,
        listening_score: 0,
        speaking_score: 0,
        writing_score: 0,
        reading_score: 0
      });
      const { data: reloaded } = await userClient.from('skill_scores').select('*').single();
      skillRow = reloaded;
    }

    const columnMap: { [key: string]: string } = {
      Listening: 'listening_score',
      Speaking: 'speaking_score',
      Writing: 'writing_score',
      Reading: 'reading_score'
    };

    const dbColumn = columnMap[skill];
    if (!dbColumn) {
      return res.status(400).json({ error: 'Invalid skill type' });
    }

    const currentVal = Number(skillRow[dbColumn] || 0);
    const newVal = Math.min(100, currentVal + amount);

    await userClient.from('skill_scores').update({
      [dbColumn]: newVal
    }).eq('user_id', user.id);

    let { data: storyRow } = await userClient.from('story_state').select('*').maybeSingle();
    let { data: finalSkillRow } = await userClient.from('skill_scores').select('*').maybeSingle();

    res.json({
      skills: {
        Listening: Number(finalSkillRow?.listening_score || 0),
        Speaking: Number(finalSkillRow?.speaking_score || 0),
        Writing: Number(finalSkillRow?.writing_score || 0),
        Reading: Number(finalSkillRow?.reading_score || 0)
      },
      completedChapterIds: storyRow?.story_flags?.completedChapterIds || [],
      currentChapterId: storyRow?.current_chapter_id || '1',
      friendshipPoints: storyRow?.npc_relationships || {}
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to increment skill' });
  }
});

app.post('/api/user/progress/complete-chapter', supabaseAuth, async (req, res) => {
  const token = (req as any).token;
  const user = (req as any).user;
  const { chapterId } = req.body;
  if (!chapterId) {
    return res.status(400).json({ error: 'chapterId is required' });
  }

  try {
    const userClient = getSupabaseClient(token);
    let { data: storyRow } = await userClient.from('story_state').select('*').maybeSingle();

    if (!storyRow) {
      await userClient.from('story_state').insert({
        user_id: user.id,
        current_chapter_id: '1',
        npc_relationships: {},
        story_flags: { completedChapterIds: [] }
      });
      const { data: reloaded } = await userClient.from('story_state').select('*').single();
      storyRow = reloaded;
    }

    const completed = storyRow.story_flags?.completedChapterIds || [];
    if (!completed.includes(chapterId)) {
      completed.push(chapterId);
    }

    const completionDates = storyRow.story_flags?.completionDates || [];
    const todayStr = new Date().toISOString().split('T')[0];
    if (!completionDates.includes(todayStr)) {
      completionDates.push(todayStr);
    }

    const encounteredPoses = storyRow.story_flags?.encounteredPoses || [];
    const milestoneChapterNum = Number(chapterId);
    const MILESTONE_POSES: Record<number, string> = {
      5: 'plus_kitten_1',
      10: 'plus_kitten_2',
      15: 'plus_kitten_3',
      21: 'plus_adolescent_1',
      27: 'plus_adolescent_2',
      33: 'plus_adolescent_3',
      38: 'plus_adult_1',
      44: 'plus_adult_2',
      49: 'plus_adult_3',
      50: 'plus_semester_finale',
    };
    if (MILESTONE_POSES[milestoneChapterNum]) {
      const pId = MILESTONE_POSES[milestoneChapterNum];
      if (!encounteredPoses.includes(pId)) {
        encounteredPoses.push(pId);
      }
    }

    const nextId = String(Number(chapterId) + 1);
    let nextChapterId = storyRow.current_chapter_id || '1';
    
    if (Number(nextId) <= 50) {
      nextChapterId = nextId;
    }

    await userClient.from('story_state').update({
      current_chapter_id: nextChapterId,
      story_flags: { completedChapterIds: completed, completionDates, encounteredPoses }
    }).eq('user_id', user.id);

    let { data: finalStoryRow } = await userClient.from('story_state').select('*').maybeSingle();
    let { data: skillRow } = await userClient.from('skill_scores').select('*').maybeSingle();

    res.json({
      skills: {
        Listening: Number(skillRow?.listening_score || 0),
        Speaking: Number(skillRow?.speaking_score || 0),
        Writing: Number(skillRow?.writing_score || 0),
        Reading: Number(skillRow?.reading_score || 0)
      },
      completedChapterIds: finalStoryRow?.story_flags?.completedChapterIds || [],
      currentChapterId: finalStoryRow?.current_chapter_id || '1',
      friendshipPoints: finalStoryRow?.npc_relationships || {},
      completionDates: finalStoryRow?.story_flags?.completionDates || completionDates,
      encounteredPoses: finalStoryRow?.story_flags?.encounteredPoses || encounteredPoses
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to complete chapter' });
  }
});

app.post('/api/user/progress/increment-friendship', supabaseAuth, async (req, res) => {
  const token = (req as any).token;
  const user = (req as any).user;
  const { npcName, amount } = req.body;
  if (!npcName || amount === undefined) {
    return res.status(400).json({ error: 'npcName and amount are required' });
  }

  try {
    const userClient = getSupabaseClient(token);
    let { data: storyRow } = await userClient.from('story_state').select('*').maybeSingle();

    if (!storyRow) {
      await userClient.from('story_state').insert({
        user_id: user.id,
        current_chapter_id: '1',
        npc_relationships: {},
        story_flags: { completedChapterIds: [] }
      });
      const { data: reloaded } = await userClient.from('story_state').select('*').single();
      storyRow = reloaded;
    }

    const currentPoints = storyRow.npc_relationships || {};
    const currentVal = Number(currentPoints[npcName] || 0);
    const newVal = currentVal + amount;
    currentPoints[npcName] = newVal;

    await userClient.from('story_state').update({
      npc_relationships: currentPoints
    }).eq('user_id', user.id);

    res.json({ friendshipPoints: currentPoints, score: newVal });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to increment friendship' });
  }
});

function getMockFeedback(skill?: string): { feedback: string; score: number } {
  const score = 15;
  let feedback = "Your practice submission has been successfully received and processed. Your response demonstrates a strong command of the topic, balanced structure, and appropriate vocabulary. Keep up this high level of effort in your English studies!";
  if (skill === 'Writing' || skill === 'Academic Writing') {
    feedback = "Your writing submission demonstrates a clear academic structure, cohesive paragraph transitions, and relevant context analysis. Great work on organizing your thoughts and supporting them with key points!";
  } else if (skill === 'Speaking' || skill === 'Academic Speaking') {
    feedback = "Your spoken response shows good pronunciation rhythm, clear structural progression, and excellent delivery of arguments. Keep practicing your oral fluency and vocabulary usage!";
  } else if (skill === 'Listening' || skill === 'Academic Listening') {
    feedback = "Your listening reflection accurately captures the main ideas, supporting details, and professor arguments from the audio lecture. Excellent work summarizing key points!";
  } else if (skill === 'Reading' || skill === 'Academic Reading') {
    feedback = "Your reading response shows deep comprehension of the text, identifying the central thesis and supporting structures correctly. Fantastic work on your reading comprehension practice!";
  }
  return { feedback, score };
}

// API: Grading endpoint using 100-Point Fair Academic Rubric
app.post('/api/grade', async (req, res) => {
  const { text, prompt, context, skill, type, chapterId } = req.body;

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Text input is required' });
  }

  const systemInstruction = `You are an elite university ESL professor evaluating open-ended student practice submissions using a 100-point academic rubric across 4 weighted dimensions:
1. Academic Vocabulary & Lexical Diversity (30% weight, max 30 pts)
2. Grammatical Accuracy & Syntax Structure (30% weight, max 30 pts)
3. Coherence & Logical Flow (20% weight, max 20 pts)
4. Topic Relevance & Task Completion (20% weight, max 20 pts)

CONCISE OUTPUT RULES:
- rubricBreakdown: For ALL 4 criteria, write EXACTLY 1 brief, punchy sentence (max 12-15 words per criterion).
- feedback: Write EXACTLY 2 short bullet points (max 15 words each), e.g. "• Strength: Strong core topic focus.\n• Growth: Use more academic connectors."
- suggestedCorrection: Provide 1 polished academic version matching original input length.

FAIRNESS & EVALUATION GUARANTEES:
- Prevent Over-Penalization: Minor typos or punctuation errors must NOT cause massive score drops (maintain fair tolerance).
- Prevent Exploitation: Long filler sentences or repetitive words must NOT automatically trigger top scores (100/100).
- Return structured JSON matching the requested schema.`;

  const userPrompt = `
Assignment Type: ${type || 'general'}
Skill Focus: ${skill || 'Academic English'}
Prompt / Context: ${prompt || 'General Academic Practice'} (Extra Context: ${context || ''})
Student Submission: "${text}"
`;

  let evalResponse: any = null;

  try {
    const rawResult = await callGeminiWithRotation(userPrompt, systemInstruction);
    evalResponse = JSON.parse(rawResult);
    res.json(evalResponse);
  } catch (error: any) {
    console.error('[API Grade Error] Falling back to local fair evaluation engine:', error);
    // Execute local 100-point fair rubric evaluation engine
    const inputType = (type === 'independent_work' || type === 'essay') ? 'essay' : (type === 'campus_life' || type === 'dialogue') ? 'dialogue' : 'writing';
    evalResponse = evaluateOpenEndedInput(text, inputType, prompt, context);
    res.json(evalResponse);
  }

  // Attempt logging to Supabase
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const supabase = getSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user && evalResponse) {
        const userClient = getSupabaseClient(token);
        const { error: attemptErr } = await userClient.from('attempts').insert({
          user_id: user.id,
          chapter_id: chapterId || 'unknown',
          attempt_type: skill || 'unknown',
          raw_input: text,
          ai_feedback: evalResponse,
          score: evalResponse.score || 75
        });
        if (attemptErr) {
          console.error('Error logging attempt to Supabase:', attemptErr);
        } else {
          console.log(`Successfully logged attempt for chapter ${chapterId} and user ${user.id}`);
        }
      }
    } catch (e) {
      console.error('Failed to log attempt to database:', e);
    }
  }
});

// GET /api/user/notes - Retrieve lecture notes and attempts containing freeform notebook text
app.get('/api/user/notes', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid user token' });
    }
    const userClient = getSupabaseClient(token);
    const { data, error } = await userClient
      .from('attempts')
      .select('id, chapter_id, raw_input, created_at, attempt_type')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching attempts for notes:', error);
      return res.status(500).json({ error: error.message });
    }

    const notes = (data || [])
      .filter((att: any) => {
        const isLecture = att.attempt_type === 'LECTURE' || att.attempt_type === 'Listening' || att.attempt_type === 'lecture';
        const hasText = att.raw_input && typeof att.raw_input === 'string' && att.raw_input.trim().length > 0;
        return isLecture && hasText;
      })
      .map((att: any) => ({
        id: String(att.id),
        chapterId: att.chapter_id,
        text: att.raw_input,
        createdAt: att.created_at,
        type: att.attempt_type
      }));

    res.json({ notes });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch notes' });
  }
});

// POST /api/user/notes - Log a new lecture notebook note attempt
app.post('/api/user/notes', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const { chapterId, text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text required' });
    }
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid user token' });
    }
    const userClient = getSupabaseClient(token);
    const { data, error } = await userClient
      .from('attempts')
      .insert({
        user_id: user.id,
        chapter_id: chapterId || 'unknown',
        attempt_type: 'LECTURE',
        raw_input: text.trim(),
        ai_feedback: { note: 'Lecture Notebook Note' },
        score: 0
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error inserting lecture note attempt:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      note: {
        id: String(data.id),
        chapterId: data.chapter_id,
        text: data.raw_input,
        createdAt: data.created_at,
        type: data.attempt_type
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save note' });
  }
});


// Password verification middleware for admin routes
const adminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const store = loadKeysStore();
  const inputPassword = typeof req.headers['x-admin-password'] === 'string' 
    ? req.headers['x-admin-password'].trim() 
    : '';

  const envPassword = process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD.trim() : null;
  const storePassword = store.password ? store.password.trim() : 'admin';

  console.log(`[Admin Auth] Received authentication attempt.`);

  const isMatched = 
    (envPassword !== null && inputPassword === envPassword) || 
    (inputPassword === storePassword);

  if (!inputPassword || !isMatched) {
    return res.status(401).json({ error: 'Unauthorized: Invalid password' });
  }
  next();
};

// Admin get model
app.get('/api/admin/model', adminAuth, (req, res) => {
  const store = loadKeysStore();
  res.json({ model: store.model || 'gemini-2.5-flash' });
});

// Admin set model
app.post('/api/admin/model', adminAuth, (req, res) => {
  const { model } = req.body;
  if (model !== 'gemini-2.5-flash' && model !== 'gemini-2.5-flash-lite') {
    return res.status(400).json({ error: 'Invalid model name' });
  }
  const store = loadKeysStore();
  store.model = model;
  saveKeysStore(store);
  res.json({ success: true, model });
});

// Admin verify endpoint
app.post('/api/admin/verify', adminAuth, (req, res) => {
  res.json({ success: true });
});

// Admin list keys
app.get('/api/admin/keys', adminAuth, (req, res) => {
  const store = loadKeysStore();
  const maskedKeys = store.keys.map((key, index) => {
    const last4 = key.slice(-4);
    const masked = key.length > 4 ? '*'.repeat(Math.max(0, key.length - 4)) + last4 : key;
    return {
      index,
      masked: `...${last4}`,
      length: key.length
    };
  });
  res.json({ keys: maskedKeys });
});

// Admin add key
app.post('/api/admin/keys', adminAuth, (req, res) => {
  const { key } = req.body;
  if (!key || typeof key !== 'string' || !key.trim()) {
    return res.status(400).json({ error: 'Invalid key format' });
  }

  const store = loadKeysStore();
  store.keys.push(key.trim());
  saveKeysStore(store);
  res.json({ success: true });
});

// Admin delete key
app.delete('/api/admin/keys/:index', adminAuth, (req, res) => {
  const index = parseInt(req.params.index, 10);
  const store = loadKeysStore();

  if (isNaN(index) || index < 0 || index >= store.keys.length) {
    return res.status(400).json({ error: 'Invalid key index' });
  }

  store.keys.splice(index, 1);
  saveKeysStore(store);
  res.json({ success: true });
});

// Start server and handle Vite asset serving / SPA fallback
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
