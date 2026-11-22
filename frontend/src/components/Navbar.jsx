import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  CheckSquare,
  LogOut,
  Wifi,
  WifiOff,
  Menu,
  Activity,
  Plus
} from 'lucide-react';

export default function Navbar({ onOpenNewTask, onToggleMobileSidebar, onToggleActivityDrawer }) {
  const { user, logout } = useAuth();
  const { isConnected } = useSocket();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <CheckSquare className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
                  TaskFlow
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200/60">
                  Task 02
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions, Live Indicator, User Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Real-time sync badge */}
            <div
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition ${
                isConnected
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
              title={isConnected ? 'Connected to WebSocket live sync' : 'Reconnecting to real-time sync...'}
            >
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {isConnected ? 'Live Sync Active' : 'Connecting...'}
            </div>

            {/* Activity log toggle button */}
            <button
              onClick={onToggleActivityDrawer}
              className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition relative"
              title="Recent Activity Log"
            >
              <Activity className="w-5 h-5" />
            </button>

            {/* Quick + Task button on header */}
            <button
              onClick={onOpenNewTask}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-300 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`}
                alt={user?.name}
                className="w-8 h-8 rounded-full ring-2 ring-indigo-500/20 object-cover bg-slate-100"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.name || 'User'}</p>
                <p className="text-[11px] text-slate-400 leading-tight truncate max-w-[120px]">{user?.email}</p>
              </div>

              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
