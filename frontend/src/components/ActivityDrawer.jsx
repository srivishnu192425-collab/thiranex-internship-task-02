import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useSocket } from '../context/SocketContext';
import {
  X,
  Activity,
  PlusCircle,
  Edit2,
  Trash2,
  RefreshCw,
  Clock
} from 'lucide-react';

export default function ActivityDrawer({ isOpen, onClose }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const { lastEvent } = useSocket();

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await api.tasks.getActivities(20);
      if (res.success && res.data) {
        setActivities(res.data);
      }
    } catch (err) {
      console.error('Failed to load activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchActivities();
    }
  }, [isOpen, lastEvent]);

  if (!isOpen) return null;

  const actionIcons = {
    CREATED: <PlusCircle className="w-4 h-4 text-emerald-500" />,
    UPDATED: <Edit2 className="w-4 h-4 text-blue-500" />,
    STATUS_CHANGED: <RefreshCw className="w-4 h-4 text-indigo-500" />,
    DELETED: <Trash2 className="w-4 h-4 text-rose-500" />,
  };

  const actionColors = {
    CREATED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    UPDATED: 'bg-blue-50 text-blue-700 border-blue-200',
    STATUS_CHANGED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    DELETED: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-base">Activity Stream</h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={fetchActivities}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white transition"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Activity items list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No recorded activities yet.
              </div>
            ) : (
              activities.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-indigo-200 transition-all flex items-start gap-3"
                >
                  <div className="mt-0.5 shrink-0">
                    {actionIcons[item.action] || <Activity className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-md border ${
                          actionColors[item.action] || 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.action.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {item.details}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
