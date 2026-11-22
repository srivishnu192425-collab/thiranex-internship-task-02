import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, fallback }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Loading TaskFlow...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback;
  }

  return children;
}
