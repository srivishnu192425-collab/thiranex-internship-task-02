import React from 'react';
import {
  Layers,
  Clock,
  CheckCircle,
  AlertOctagon
} from 'lucide-react';

export default function StatsOverview({ stats }) {
  const cards = [
    {
      title: 'Total Tasks',
      value: stats?.total || 0,
      icon: Layers,
      color: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50/70',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-100'
    },
    {
      title: 'In Progress',
      value: stats?.inProgress || 0,
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50/70',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-100'
    },
    {
      title: 'Completed',
      value: stats?.completed || 0,
      suffix: stats?.total ? `(${Math.round((stats.completed / stats.total) * 100)}%)` : '',
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50/70',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-100'
    },
    {
      title: 'Urgent & Overdue',
      value: (stats?.urgent || 0) + (stats?.overdue || 0),
      icon: AlertOctagon,
      color: 'from-rose-500 to-pink-600',
      bgLight: 'bg-rose-50/70',
      textColor: 'text-rose-700',
      borderColor: 'border-rose-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl bg-white border ${card.borderColor} shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.bgLight} ${card.textColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.value}
              </span>
              {card.suffix && (
                <span className="text-xs font-semibold text-slate-400">{card.suffix}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
