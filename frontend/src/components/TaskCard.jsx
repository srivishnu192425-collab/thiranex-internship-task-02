import React from 'react';
import {
  Calendar,
  Clock,
  MoreVertical,
  CheckCircle2,
  Circle,
  PlayCircle,
  Edit3,
  Trash2,
  AlertCircle
} from 'lucide-react';

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  isDraggable = true
}) {
  const isOverdue =
    task.due_date &&
    task.status !== 'completed' &&
    new Date(task.due_date) < new Date(new Date().setHours(0, 0, 0, 0));

  const priorityStyles = {
    urgent: 'bg-rose-50 text-rose-700 border-rose-200/80 font-bold',
    high: 'bg-orange-50 text-orange-700 border-orange-200/80 font-semibold',
    medium: 'bg-amber-50 text-amber-700 border-amber-200/80 font-medium',
    low: 'bg-slate-100 text-slate-600 border-slate-200 font-normal',
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id.toString());
  };

  const nextStatusMap = {
    pending: 'in-progress',
    'in-progress': 'completed',
    completed: 'pending'
  };

  const nextStatusLabel = {
    pending: 'Start task',
    'in-progress': 'Mark as completed',
    completed: 'Reopen task'
  };

  return (
    <div
      draggable={isDraggable}
      onDragStart={handleDragStart}
      className={`group relative bg-white rounded-2xl p-4 border transition-all duration-200 hover:shadow-md cursor-grab active:cursor-grabbing ${
        task.status === 'completed'
          ? 'border-emerald-200/70 bg-emerald-50/20'
          : 'border-slate-200/90 hover:border-indigo-300'
      }`}
    >
      {/* Top row: Priority & Category */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-md border ${
              priorityStyles[task.priority] || priorityStyles.medium
            }`}
          >
            {task.priority}
          </span>
          <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 text-slate-600">
            {task.category || 'General'}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(task)}
            className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
            title="Edit Task"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Task Title */}
      <h4
        className={`text-sm font-semibold leading-snug mb-1.5 transition ${
          task.status === 'completed'
            ? 'line-through text-slate-400'
            : 'text-slate-800 group-hover:text-indigo-900'
        }`}
      >
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Bottom Footer: Due Date & Quick Status Toggle */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
        {/* Due date */}
        {task.due_date ? (
          <div
            className={`flex items-center gap-1.5 font-medium ${
              isOverdue
                ? 'text-rose-600 font-bold'
                : task.status === 'completed'
                ? 'text-slate-400'
                : 'text-slate-500'
            }`}
            title={isOverdue ? 'Overdue!' : 'Due Date'}
          >
            {isOverdue ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            ) : (
              <Calendar className="w-3.5 h-3.5" />
            )}
            <span>{task.due_date}</span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400">No due date</span>
        )}

        {/* Quick status progress button */}
        <button
          onClick={() => onStatusChange(task.id, nextStatusMap[task.status])}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
            task.status === 'completed'
              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
              : task.status === 'in-progress'
              ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          title={nextStatusLabel[task.status]}
        >
          {task.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
          {task.status === 'in-progress' && <PlayCircle className="w-3 h-3 text-blue-600" />}
          {task.status === 'pending' && <Circle className="w-3 h-3 text-slate-400" />}
          <span className="capitalize">{task.status.replace('-', ' ')}</span>
        </button>
      </div>
    </div>
  );
}
