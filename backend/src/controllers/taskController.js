const Task = require('../models/taskModel');
const { emitToUser } = require('../socket/socketHandler');

const taskController = {
  async getTasks(req, res, next) {
    try {
      const { search, status, priority, category, sortBy, sortOrder } = req.query;
      const tasks = await Task.findAllByUser(req.user.id, {
        search,
        status,
        priority,
        category,
        sortBy,
        sortOrder
      });

      res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
      });
    } catch (error) {
      next(error);
    }
  },

  async getTaskById(req, res, next) {
    try {
      const { id } = req.params;
      const task = await Task.findById(id, req.user.id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found or access denied'
        });
      }

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  },

  async createTask(req, res, next) {
    try {
      const { title, description, status, priority, category, dueDate } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Task title is required'
        });
      }

      const task = await Task.create({
        userId: req.user.id,
        title,
        description,
        status: status || 'pending',
        priority: priority || 'medium',
        category: category || 'General',
        dueDate: dueDate || null
      });

      // Log activity
      await Task.logActivity({
        userId: req.user.id,
        taskId: task.id,
        action: 'CREATED',
        details: `Created task "${task.title}"`
      });

      // Real-time WebSocket emission to all user sessions
      emitToUser(req.user.id, 'task_created', {
        task,
        message: `Task "${task.title}" was created.`
      });

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      });
    } catch (error) {
      next(error);
    }
  },

  async updateTask(req, res, next) {
    try {
      const { id } = req.params;
      const existingTask = await Task.findById(id, req.user.id);

      if (!existingTask) {
        return res.status(404).json({
          success: false,
          message: 'Task not found or access denied'
        });
      }

      const updatedTask = await Task.update(id, req.user.id, req.body);

      // Check if status changed
      const isStatusChanged = req.body.status && req.body.status !== existingTask.status;

      // Log activity
      const activityDetail = isStatusChanged
        ? `Status changed from "${existingTask.status}" to "${updatedTask.status}" on "${updatedTask.title}"`
        : `Updated task "${updatedTask.title}"`;

      await Task.logActivity({
        userId: req.user.id,
        taskId: updatedTask.id,
        action: isStatusChanged ? 'STATUS_CHANGED' : 'UPDATED',
        details: activityDetail
      });

      // Real-time WebSocket emission
      emitToUser(req.user.id, 'task_updated', {
        task: updatedTask,
        isStatusChanged,
        message: activityDetail
      });

      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: updatedTask
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      const existingTask = await Task.findById(id, req.user.id);

      if (!existingTask) {
        return res.status(404).json({
          success: false,
          message: 'Task not found or access denied'
        });
      }

      await Task.delete(id, req.user.id);

      // Log activity
      await Task.logActivity({
        userId: req.user.id,
        taskId: parseInt(id),
        action: 'DELETED',
        details: `Deleted task "${existingTask.title}"`
      });

      // Real-time WebSocket emission
      emitToUser(req.user.id, 'task_deleted', {
        taskId: parseInt(id),
        message: `Task "${existingTask.title}" was deleted.`
      });

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async getStats(req, res, next) {
    try {
      const stats = await Task.getStats(req.user.id);
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  async getActivities(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 15;
      const activities = await Task.getRecentActivities(req.user.id, limit);
      res.status(200).json({
        success: true,
        data: activities
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = taskController;
