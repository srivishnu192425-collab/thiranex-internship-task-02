import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useSocket } from '../context/SocketContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsOverview from '../components/StatsOverview';
import FilterBar from '../components/FilterBar';
import KanbanBoard from '../components/KanbanBoard';
import TaskListView from '../components/TaskListView';
import TaskModal from '../components/TaskModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import ActivityDrawer from '../components/ActivityDrawer';
import RealTimeActivityToast from '../components/RealTimeActivityToast';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    sortBy: 'created_at',
    sortOrder: 'DESC',
  });

  // Modals and Drawers
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatusForNew, setDefaultStatusForNew] = useState('pending');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const { lastEvent } = useSocket();

  // Load tasks & stats
  const fetchData = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const [tasksRes, statsRes] = await Promise.all([
        api.tasks.getAll(filters),
        api.tasks.getStats(),
      ]);

      if (tasksRes.success) {
        setTasks(tasksRes.data || []);
      }
      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks/stats:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  // Real-time synchronization when a socket event arrives
  useEffect(() => {
    if (lastEvent) {
      // Re-fetch quietly in background without full screen spinner
      fetchData(false);
    }
  }, [lastEvent, fetchData]);

  const handleFilterChange = (partialFilter) => {
    setFilters((prev) => ({ ...prev, ...partialFilter }));
  };

  // Open modal for creating a new task
  const handleOpenNewTask = (status = 'pending') => {
    setEditingTask(null);
    setDefaultStatusForNew(status);
    setIsTaskModalOpen(true);
  };

  // Open modal for editing existing task
  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Submit task (create or update)
  const handleSubmitTask = async (formData) => {
    if (editingTask) {
      await api.tasks.update(editingTask.id, formData);
    } else {
      await api.tasks.create(formData);
    }
    // Refresh list
    fetchData(false);
  };

  // Quick 1-click or drag-and-drop status update
  const handleQuickStatusChange = async (taskId, newStatus) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      await api.tasks.update(taskId, { status: newStatus });
      fetchData(false);
    } catch (err) {
      console.error('Failed to update status:', err);
      fetchData(false);
    }
  };

  // Delete task modal trigger
  const handlePromptDelete = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (taskId) => {
    setIsDeleting(true);
    try {
      await api.tasks.delete(taskId);
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      fetchData(false);
    } catch (err) {
      console.error('Failed to delete task:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Load demo tasks for the user
  const handleLoadDemoData = async () => {
    const sampleBatch = [
      {
        title: 'Complete System Architecture Review',
        description: 'Verify database schema, API routing, and WebSocket integration.',
        status: 'completed',
        priority: 'high',
        category: 'Backend',
        dueDate: '2026-11-20'
      },
      {
        title: 'Optimize Tailwind CSS Layout for Mobile',
        description: 'Ensure cards and action drawers adapt smoothly to small screens.',
        status: 'in-progress',
        priority: 'medium',
        category: 'Frontend',
        dueDate: '2026-11-28'
      },
      {
        title: 'Execute Automated End-to-End API Tests',
        description: 'Run comprehensive test suite validating full CRUD and JWT security.',
        status: 'pending',
        priority: 'urgent',
        category: 'QA',
        dueDate: '2026-12-01'
      }
    ];

    for (const t of sampleBatch) {
      await api.tasks.create(t);
    }
    fetchData(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        onOpenNewTask={() => handleOpenNewTask('pending')}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onToggleActivityDrawer={() => setIsActivityDrawerOpen(true)}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6 items-start">
        {/* Left Sidebar */}
        <Sidebar
          currentFilter={filters}
          onFilterChange={handleFilterChange}
          stats={stats}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          onLoadDemoData={handleLoadDemoData}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Key Metrics Overview */}
          <StatsOverview stats={stats} />

          {/* Search, Filter, Sort and View Switcher */}
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onOpenNewTask={() => handleOpenNewTask('pending')}
          />

          {/* Tasks Display */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Loading tasks...
              </p>
            </div>
          ) : viewMode === 'kanban' ? (
            <KanbanBoard
              tasks={tasks}
              onEdit={handleOpenEditTask}
              onDelete={handlePromptDelete}
              onStatusChange={handleQuickStatusChange}
              onOpenNewTaskWithStatus={handleOpenNewTask}
            />
          ) : (
            <TaskListView
              tasks={tasks}
              onEdit={handleOpenEditTask}
              onDelete={handlePromptDelete}
              onStatusChange={handleQuickStatusChange}
            />
          )}
        </main>
      </div>

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleSubmitTask}
        initialData={editingTask}
        defaultStatus={defaultStatusForNew}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        task={taskToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Activity Drawer */}
      <ActivityDrawer
        isOpen={isActivityDrawerOpen}
        onClose={() => setIsActivityDrawerOpen(false)}
      />

      {/* Real-Time WebSocket Toast Notifications */}
      <RealTimeActivityToast />
    </div>
  );
}
