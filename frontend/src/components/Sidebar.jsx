import React from 'react';
import {
  Inbox,
  Clock,
  PlayCircle,
  CheckCircle2,
  Flame,
  Tag,
  Sparkles,
  X
} from 'lucide-react';

export default function Sidebar({
  currentFilter,
  onFilterChange,
  stats,
  isOpen,
  onClose,
  onLoadDemoData
}) {
  const completionRate =
    stats && stats.total > 0
      ? Math.round((stats.completed / stats.total) * 100)
      : 0;

  const navItems = [
    { id: 'all', label: 'All Tasks', icon: Inbox, count: stats?.total || 0 },
    { id: 'pending', label: 'To Do', icon: Clock, count: stats?.pending || 0, color: 'text-amber-500' },
    { id: 'in-progress', label: 'In Progress', icon: PlayCircle, count: stats?.inProgress || 0, color: 'text-blue-500' },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, count: stats?.completed || 0, color: 'text-emerald-500' },
  ];

  const categories = ['All', 'Frontend', 'Backend', 'Design', 'DevOps', 'QA', 'General'];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 p-4 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:w-64 lg:min-h-[calc(100vh-4rem)] flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Header on mobile */}
          <div className="flex items-center justify-between lg:hidden pb-3 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-700">Navigation</span>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Navigation Views */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Workflow Status
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentFilter.status === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onFilterChange({ status: item.id });
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${item.color || ''}`} />
                      <span>{item.label}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Priorities */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Priority Focus
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onFilterChange({
                    priority: currentFilter.priority === 'urgent' ? 'all' : 'urgent'
                  });
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition ${
                  currentFilter.priority === 'urgent'
                    ? 'bg-rose-50 text-rose-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>Urgent Tasks</span>
                </div>
                {stats?.urgent > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                    {stats.urgent}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Categories / Tags Filter */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Tag className="w-3 h-3" />
              <span>Categories</span>
            </div>
            <div className="flex flex-wrap gap-1.5 px-2">
              {categories.map((cat) => {
                const isSelected =
                  (cat === 'All' && (!currentFilter.category || currentFilter.category === 'all')) ||
                  currentFilter.category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      onFilterChange({ category: cat === 'All' ? 'all' : cat });
                      if (onClose) onClose();
                    }}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section: Progress & Quick Action */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          {/* Progress Card */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Goal Progress</span>
              <span className="text-indigo-600">{completionRate}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              {stats?.completed || 0} of {stats?.total || 0} tasks finished
            </p>
          </div>

          {/* Load Sample Tasks Button */}
          {onLoadDemoData && (
            <button
              onClick={onLoadDemoData}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200/50 rounded-xl transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Load Demo Tasks</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
