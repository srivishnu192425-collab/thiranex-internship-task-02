import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  PlayCircle,
  Edit3,
  Trash2,
  AlertCircle
} from 'lucide-react';

export default function TaskListView({
  tasks,
  onEdit,
  onDelete,
  onStatusChange
}) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <p className="text-slate-500 font-medium text-sm">No tasks match the active filters.</p>
        <p className="text-xs text-slate-400 mt-1">Try clearing your search or adding a new task.</p>
      </div>
    );
  }

  const priorityStyles = {
    urgent: 'bg-rose-50 text-rose-700 border-rose-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    low: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4 w-12 text-center">Status</th>
              <th className="py-3 px-4">Task Details</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {tasks.map((task) => {
              const isOverdue =
                task.due_date &&
                task.status !== 'completed' &&
                new Date(task.due_date) < new Date(new Date().setHours(0, 0, 0, 0));

              return (
                <tr
                  key={task.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Status Toggle Icon */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => {
                        const next =
                          task.status === 'completed'
                            ? 'pending'
                            : task.status === 'pending'
                            ? 'in-progress'
                            : 'completed';
                        onStatusChange(task.id, next);
                      }}
                      className="p-1 text-slate-400 hover:text-indigo-600 transition"
                      title="Click to advance status"
                    >
                      {task.status === 'completed' && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      )}
                      {task.status === 'in-progress' && (
                        <PlayCircle className="w-5 h-5 text-blue-500" />
                      )}
                      {task.status === 'pending' && (
                        <Circle className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
                      )}
                    </button>
                  </td>

                  {/* Title & Description */}
                  <td className="py-3.5 px-4 max-w-md">
                    <div
                      className={`font-semibold ${
                        task.status === 'completed'
                          ? 'line-through text-slate-400'
                          : 'text-slate-800'
                      }`}
                    >
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-xs text-slate-500 truncate max-w-sm mt-0.5">
                        {task.description}
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-600">
                      {task.category || 'General'}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 text-[11px] uppercase tracking-wider rounded-md border font-semibold ${
                        priorityStyles[task.priority] || priorityStyles.medium
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {task.due_date ? (
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          isOverdue ? 'text-rose-600 font-bold' : 'text-slate-600'
                        }`}
                      >
                        {isOverdue && <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
                        {task.due_date}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">None</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(task)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="Edit Task"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(task)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
