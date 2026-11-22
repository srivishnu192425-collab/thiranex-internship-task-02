const { queryGet, queryRun } = require('../config/db');

const User = {
  async create({ name, email, password, avatar = null, role = 'user' }) {
    const res = await queryRun(
      `INSERT INTO users (name, email, password, avatar, role) VALUES (?, ?, ?, ?, ?)`,
      [name, email.toLowerCase().trim(), password, avatar, role]
    );
    return this.findById(res.lastID);
  },

  async findByEmail(email) {
    return queryGet(`SELECT * FROM users WHERE email = ?`, [email.toLowerCase().trim()]);
  },

  async findById(id) {
    const user = await queryGet(`SELECT id, name, email, avatar, role, created_at FROM users WHERE id = ?`, [id]);
    return user;
  }
};

module.exports = User;
