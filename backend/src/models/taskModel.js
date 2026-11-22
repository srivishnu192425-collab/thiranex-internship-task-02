const { queryGet, queryAll, queryRun } = require('../config/db');

const Task = {
  async create({ userId, title, description = '', status = 'pending', priority = 'medium', category = 'General', dueDate = null }) {
    const res = await queryRun(
      `INSERT INTO tasks (user_id, title, description, status, priority, category, due_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, title.trim(), description.trim(), status, priority, category.trim(), dueDate]
    );
    return this.findById(res.lastID, userId);
  },

  async findById(id, userId) {
    return queryGet(`SELECT * FROM tasks WHERE id = ? AND user_id = ?`, [id, userId]);
  },

  async findAllByUser(userId, { search, status, priority, category, sortBy = 'created_at', sortOrder = 'DESC' } = {}) {
    let sql = `SELECT * FROM tasks WHERE user_id = ?`;
    const params = [userId];

    if (search) {
      sql += ` AND (title LIKE ? OR description LIKE ? OR category LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (status && status !== 'all') {
      sql += ` AND status = ?`;
      params.push(status);
    }

    if (priority && priority !== 'all') {
      sql += ` AND priority = ?`;
      params.push(priority);
    }

    if (category && category !== 'all') {
      sql += ` AND category = ?`;
      params.push(category);
    }

    const allowedSort = ['created_at', 'due_date', 'priority', 'title', 'status'];
    const safeSort = allowedSort.includes(sortBy) ? sortBy : 'created_at';
    const safeOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    sql += ` ORDER BY ${safeSort} ${safeOrder}`;

    return queryAll(sql, params);
  },

  async update(id, userId, fields) {
    const allowed = ['title', 'description', 'status', 'priority', 'category', 'due_date'];
    const updates = [];
    const params = [];

    for (const [key, value] of Object.entries(fields)) {
      const dbKey = key === 'dueDate' ? 'due_date' : key;
      if (allowed.includes(dbKey)) {
        updates.push(`${dbKey} = ?`);
        params.push(value);
      }
    }

    if (updates.length === 0) return this.findById(id, userId);

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id, userId);

    await queryRun(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
      params
    );

    return this.findById(id, userId);
  },

  async delete(id, userId) {
    const res = await queryRun(`DELETE FROM tasks WHERE id = ? AND user_id = ?`, [id, userId]);
    return res.changes > 0;
  },

  async getStats(userId) {
    const totalRow = await queryGet(`SELECT COUNT(*) as count FROM tasks WHERE user_id = ?`, [userId]);
    const pendingRow = await queryGet(`SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'pending'`, [userId]);
    const inProgressRow = await queryGet(`SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'in-progress'`, [userId]);
    const completedRow = await queryGet(`SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'completed'`, [userId]);
    const overdueRow = await queryGet(
      `SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status != 'completed' AND due_date IS NOT NULL AND date(due_date) < date('now')`,
      [userId]
    );
    const urgentRow = await queryGet(
      `SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND priority = 'urgent' AND status != 'completed'`,
      [userId]
    );

    return {
      total: totalRow ? totalRow.count : 0,
      pending: pendingRow ? pendingRow.count : 0,
      inProgress: inProgressRow ? inProgressRow.count : 0,
      completed: completedRow ? completedRow.count : 0,
      overdue: overdueRow ? overdueRow.count : 0,
      urgent: urgentRow ? urgentRow.count : 0
    };
  },

  async logActivity({ userId, taskId, action, details }) {
    try {
      await queryRun(
        `INSERT INTO activity_logs (user_id, task_id, action, details) VALUES (?, ?, ?, ?)`,
        [userId, taskId || null, action, details]
      );
    } catch (e) {
      console.error('Failed to log activity:', e.message);
    }
  },

  async getRecentActivities(userId, limit = 15) {
    return queryAll(
      `SELECT a.*, t.title as task_title FROM activity_logs a
       LEFT JOIN tasks t ON a.task_id = t.id
       WHERE a.user_id = ?
       ORDER BY a.created_at DESC LIMIT ?`,
      [userId, limit]
    );
  }
};

module.exports = Task;
