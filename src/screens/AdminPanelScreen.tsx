import React, { useState, useEffect } from 'react';
import { Shield, Key, Plus, Trash2, ArrowLeft, Loader2, Check, AlertCircle } from 'lucide-react';

interface MaskedKey {
  index: number;
  masked: string;
  length: number;
}

export const AdminPanelScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [keysList, setKeysList] = useState<MaskedKey[]>([]);
  const [newKey, setNewKey] = useState('');
  const [activeModel, setActiveModel] = useState<'gemini-2.5-flash' | 'gemini-2.5-flash-lite'>('gemini-2.5-flash');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load from local storage to keep password session-active if refreshed
  useEffect(() => {
    const savedPassword = sessionStorage.getItem('admin_password');
    if (savedPassword) {
      setPassword(savedPassword);
      verifyPassword(savedPassword);
    }
  }, []);

  const fetchActiveModel = async (pwd = password) => {
    try {
      const response = await fetch('/api/admin/model', {
        headers: {
          'x-admin-password': pwd
        }
      });
      if (response.ok) {
        const data = await response.json();
        setActiveModel(data.model || 'gemini-2.5-flash');
      }
    } catch (err) {
      console.error('Error fetching active model:', err);
    }
  };

  const handleModelChange = async (newModel: 'gemini-2.5-flash' | 'gemini-2.5-flash-lite') => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('/api/admin/model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify({ model: newModel })
      });
      if (response.ok) {
        setActiveModel(newModel);
        setSuccess(`Active model updated to ${newModel === 'gemini-2.5-flash' ? 'Gemini Flash' : 'Gemini Flash-Lite'}!`);
      } else {
        const errData = await response.json();
        setError(errData.error || 'Failed to update active model');
      }
    } catch (err) {
      setError('Connection to backend server failed');
    } finally {
      setLoading(false);
    }
  };

  const verifyPassword = async (pwdToVerify: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': pwdToVerify
        }
      });

      if (response.ok) {
        setIsVerified(true);
        sessionStorage.setItem('admin_password', pwdToVerify);
        fetchKeys(pwdToVerify);
        fetchActiveModel(pwdToVerify);
      } else {
        setError('Invalid admin password');
        setIsVerified(false);
        sessionStorage.removeItem('admin_password');
      }
    } catch (err) {
      setError('Connection to backend server failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    verifyPassword(password);
  };

  const fetchKeys = async (pwd = password) => {
    try {
      const response = await fetch('/api/admin/keys', {
        headers: {
          'x-admin-password': pwd
        }
      });
      if (response.ok) {
        const data = await response.json();
        setKeysList(data.keys || []);
      } else {
        setError('Failed to fetch keys list');
      }
    } catch (err) {
      setError('Error contacting server');
    }
  };

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/admin/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify({ key: newKey.trim() })
      });

      if (response.ok) {
        setSuccess('Gemini API key added successfully!');
        setNewKey('');
        fetchKeys();
      } else {
        const errData = await response.json();
        setError(errData.error || 'Failed to add key');
      }
    } catch (err) {
      setError('Failed to add key due to a network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async (index: number) => {
    if (!window.confirm('Are you sure you want to delete this Gemini API key?')) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/keys/${index}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': password
        }
      });

      if (response.ok) {
        setSuccess('Key deleted successfully!');
        fetchKeys();
      } else {
        const errData = await response.json();
        setError(errData.error || 'Failed to delete key');
      }
    } catch (err) {
      setError('Network error: failed to delete key');
    } finally {
      setLoading(false);
    }
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6 select-none">
        <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-red-500/10 rounded-full text-red-400">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Admin Key Vault</h1>
            <p className="text-xs text-slate-400">Gated multi-key management panel for AI grading</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Admin Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-red-600 hover:bg-red-500 disabled:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Decrypt & Authenticate'}
            </button>
          </form>

          <button
            onClick={onClose}
            className="w-full text-center text-xs text-slate-400 hover:text-slate-200 transition-colors pt-2"
          >
            ← Return to Student Campus
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 overflow-y-auto">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4" /> Secure Admin Zone
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Gemini API Keys</h1>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to App
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-2xl flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-4 rounded-2xl flex items-start gap-2.5">
            <Check className="w-5 h-5 mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Add Key Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" /> Enroll New API Key
          </h2>
          <form onSubmit={handleAddKey} className="flex gap-2.5">
            <input
              type="password"
              placeholder="Paste Gemini API Key (e.g. AIzaSy...)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100 transition-all font-mono"
            />
            <button
              type="submit"
              disabled={loading || !newKey.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white text-xs font-bold px-5 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Key
            </button>
          </form>
          <p className="text-[10px] text-slate-500">
            Enrolling multiple keys enables automatic rate-limit (HTTP 429) rotation. Keys are stored safely in memory/server-side filesystem storage.
          </p>
        </div>

        {/* Model Selector Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" /> Active AI Model Config
            </h2>
            <div className="text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              Active: {activeModel === 'gemini-2.5-flash' ? 'Gemini Flash' : 'Gemini Flash-Lite'}
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Selected Model for grading submissions</label>
            <select
              value={activeModel}
              onChange={(e) => handleModelChange(e.target.value as any)}
              disabled={loading}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-sans cursor-pointer"
            >
              <option value="gemini-2.5-flash">Gemini Flash (gemini-2.5-flash) - Faster & Balanced</option>
              <option value="gemini-2.5-flash-lite">Gemini Flash-Lite (gemini-2.5-flash-lite) - High free-tier daily quota</option>
            </select>
          </div>
          
          <p className="text-[10px] text-slate-500">
            If the selected model hits 429 Rate Limit (Quota Exceeded) across all keys, the system automatically falls back to <b>Gemini Flash-Lite</b> to complete the grading request.
          </p>
        </div>

        {/* Stored Keys List */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase font-bold tracking-wider text-slate-400">Stored Rotation Keys ({keysList.length})</h2>
          {keysList.length === 0 ? (
            <div className="bg-slate-900/50 border border-dashed border-slate-800 text-center py-8 rounded-3xl text-xs text-slate-500 italic">
              No custom keys added yet. Using system default GEMINI_API_KEY from environment.
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden divide-y divide-slate-800">
              {keysList.map((key) => (
                <div key={key.index} className="flex items-center justify-between p-4 hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-500 font-semibold bg-slate-950 px-2.5 py-1 rounded-lg">Key #{key.index + 1}</span>
                    <span className="text-xs font-mono text-slate-300">{key.masked}</span>
                    <span className="text-[10px] font-mono text-slate-500">({key.length} chars)</span>
                  </div>
                  <button
                    onClick={() => handleDeleteKey(key.index)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                    title="Delete Key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
