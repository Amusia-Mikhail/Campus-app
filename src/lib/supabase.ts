/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!rawSupabaseUrl || !rawSupabaseAnonKey) {
  console.error(
    '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables. ' +
      'Copy .env.example to .env.local and fill in your Supabase project credentials.'
  );
}

const getSanitizedSupabaseUrl = (url: string): string => {
  let sanitizedUrl = (url || '').trim();
  // Ensure trailing slashes and redundant auth/v1 or rest/v1 paths are removed
  sanitizedUrl = sanitizedUrl
    .replace(/\/+$/, '')
    .replace(/\/auth\/v1\/?$/, '')
    .replace(/\/rest\/v1\/?$/, '');

  if (sanitizedUrl && !sanitizedUrl.startsWith('http://') && !sanitizedUrl.startsWith('https://')) {
    sanitizedUrl = 'https://' + sanitizedUrl;
  }

  return sanitizedUrl;
};

export const sanitizedSupabaseUrl = getSanitizedSupabaseUrl(rawSupabaseUrl || '');

export const supabaseAnonKey = rawSupabaseAnonKey || '';

export const supabase = createClient(sanitizedSupabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
