import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { Plus, Clock, PlayCircle, CheckCircle2 } from 'lucide-react';

export default function KanbanBoard({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onOpenNewTaskWithStatus
}) {
  const [dragOverCol, setDragOverCol] = useState(null);

  const columns = [
    {
      id: 'pending',
      title: 'To Do',
      icon: Clock,
      barColor: 'bg-amber-400',
      badgeColor: 'bg-amber-100 text-amber-800',
      bgDrop: 'bg-amber-50/50 border-amber-300',
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      icon: PlayCircle,
      barColor: 'bg-blue-500',
      badgeColor: 'bg-blue-100 text-blue-800',
      bgDrop: 'bg-blue-50/50 border-blue-300',
    },
    {
      id: 'completed',
      title: 'Completed',
      icon: CheckCircle2,
      barColor: 'bg-emerald-500',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      bgDrop: 'bg-emerald-50/50 border-emerald-300',
    },
  ];

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDragLeave = (e, colId) => {
    if (dragOverCol === colId) {
      setDragOverCol(null);
    }
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskIdStr = e.dataTransfer.getData('text/plain');
    if (taskIdStr) {
      const taskId = parseInt(taskIdStr, 10);
      onStatusChange(taskId, targetStatus);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
      {columns.map((col) => {
        const Icon = col.icon;
        const columnTasks = tasks.filter((t) => t.status === col.id);
        const isHovered = dragOverCol === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={(e) => handleDragLeave(e, col.id)}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex flex-col bg-slate-100/70 border-2 rounded-2xl p-4 transition-all duration-200 min-h-[500px] ${
              isHovered
                ? `${col.bgDrop} ring-2 ring-indigo-400/30 scale-[1.01]`
                : 'border-transparent'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.barColor}`} />
                <h3 className="font-bold text-sm text-slate-800 tracking-tight flex items-center gap-1.5">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{col.title}</span>
                </h3>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badgeColor}`}
              >
                {columnTasks.length}
              </span>
            </div>

            {/* Task list container */}
            <div className="flex-1 space-y-3">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              ))}

              {columnTasks.length === 0 && (
                <div className="h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                  <span>No tasks here</span>
                  <span className="text-[10px] text-slate-400">Drag a card or create new</span>
                </div>
              )}
            </div>

            {/* Bottom Add Task button */}
            <button
              onClick={() => onOpenNewTaskWithStatus(col.id)}
              className="mt-4 w-full py-2 px-3 border border-dashed border-slate-300 hover:border-indigo-400 hover:bg-white text-slate-600 hover:text-indigo-600 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to {col.title}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
