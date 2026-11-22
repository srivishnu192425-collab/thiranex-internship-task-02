import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  CheckSquare,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function LoginPage({ onNavigateRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@thiranex.com');
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* App Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white shadow-xl shadow-indigo-500/30 mb-3">
            <CheckSquare className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            TaskFlow
          </h1>
          <p className="text-sm text-indigo-200/80 mt-1">
            Task Management Platform • Internship Task 02
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Welcome Back</h2>
              <p className="text-xs text-slate-500">Sign in to manage your tasks & workflow</p>
            </div>
            {/* Quick Demo Credentials Filler */}
            <button
              type="button"
              onClick={handleFillDemo}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition"
              title="Auto-fill sample login credentials"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Demo Fill</span>
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-300 transition active:scale-98 mt-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <button
                onClick={onNavigateRegister}
                className="font-semibold text-indigo-600 hover:text-indigo-800 transition underline underline-offset-2"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>

        {/* Feature Highlights Pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-[11px] text-slate-400">
          <span className="px-2 py-1 bg-white/5 rounded-md border border-white/10">JWT Auth</span>
          <span className="px-2 py-1 bg-white/5 rounded-md border border-white/10">CRUD Tasks</span>
          <span className="px-2 py-1 bg-white/5 rounded-md border border-white/10">Socket.io Live Sync</span>
          <span className="px-2 py-1 bg-white/5 rounded-md border border-white/10">Kanban Board</span>
        </div>
      </div>
    </div>
  );
}
