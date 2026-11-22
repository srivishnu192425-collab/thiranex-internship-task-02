import React from 'react';
import { useSocket } from '../context/SocketContext';
import {
  CheckCircle2,
  Info,
  RefreshCw,
  Trash2,
  X,
  Radio
} from 'lucide-react';

export default function RealTimeActivityToast() {
  const { toasts, removeToast } = useSocket();

  if (toasts.length === 0) return null;

  const iconMap = {
    created: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    updated: <Info className="w-4 h-4 text-blue-500 shrink-0" />,
    status: <RefreshCw className="w-4 h-4 text-indigo-500 shrink-0" />,
    deleted: <Trash2 className="w-4 h-4 text-rose-500 shrink-0" />,
  };

  const borderMap = {
    created: 'border-emerald-200 bg-white',
    updated: 'border-blue-200 bg-white',
    status: 'border-indigo-200 bg-white',
    deleted: 'border-rose-200 bg-white',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-2xl border shadow-lg backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200 ${
            borderMap[toast.type] || 'border-slate-200 bg-white'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5">{iconMap[toast.type] || <Radio className="w-4 h-4 text-indigo-500" />}</div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                Live Update
              </div>
              <p className="text-xs font-semibold text-slate-800 mt-0.5 leading-snug">
                {toast.message}
              </p>
            </div>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
