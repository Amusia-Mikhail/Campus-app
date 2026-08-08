/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCampus } from '../context/CampusContext';
import { Mail, Lock, Loader2, GraduationCap } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login } = useCampus();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    // Fix Admin Login Bypass: BEFORE calling Supabase auth or form validation
    if (cleanEmail === 'admin@campus.edu') {
      setLoading(true);
      try {
        await login('admin@campus.edu', password || 'admin123');
      } catch (err: any) {
        setAuthError(err.message || 'Admin login failed');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!cleanEmail || !password.trim()) {
      setAuthError('Please enter email and password.');
      return;
    }

    setLoading(true);
    setAuthError('');
    try {
      await login(cleanEmail, password);
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 bg-cream dark:bg-slate-950 text-navy dark:text-slate-100 font-sans select-none">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto border border-terracotta/20">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-burgundy dark:text-rose-400">Campus Login</h2>
          <p className="text-xs text-navy/60 dark:text-slate-400">Sign in to your student account</p>
        </div>

        <form onSubmit={handleLogin} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-navy dark:text-slate-200 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-terracotta" /> Email Address
            </label>
            <input
              type="text"
              placeholder="student@campus.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (authError) setAuthError('');
              }}
              className="w-full bg-cream dark:bg-slate-950 border border-navy/10 dark:border-slate-800 rounded-xl p-3 text-xs text-navy dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-terracotta transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-navy dark:text-slate-200 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-terracotta" /> Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (authError) setAuthError('');
              }}
              className="w-full bg-cream dark:bg-slate-950 border border-navy/10 dark:border-slate-800 rounded-xl p-3 text-xs text-navy dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-terracotta transition-all"
            />
          </div>

          {authError && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">{authError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
