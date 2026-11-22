import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 gap-3 text-white">
        <div className="w-10 h-10 border-4 border-indigo-400/30 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
          Initializing TaskFlow...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authView === 'login' ? (
      <LoginPage onNavigateRegister={() => setAuthView('register')} />
    ) : (
      <RegisterPage onNavigateLogin={() => setAuthView('login')} />
    );
  }

  return (
    <SocketProvider>
      <DashboardPage />
    </SocketProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
