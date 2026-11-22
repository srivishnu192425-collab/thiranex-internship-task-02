const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log(`Connected to SQLite database at: ${dbPath}`);
  }
});

// Enable WAL mode & foreign keys for performance and data integrity
db.run('PRAGMA foreign_keys = ON;');
db.run('PRAGMA journal_mode = WAL;');

// Promise wrappers
const queryGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const queryAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const queryRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

// Initialize schema
const initDB = async () => {
  try {
    await queryRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        avatar TEXT,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRun(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT CHECK(status IN ('pending', 'in-progress', 'completed')) DEFAULT 'pending',
        priority TEXT CHECK(priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
        category TEXT DEFAULT 'General',
        due_date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await queryRun(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        task_id INTEGER,
        action TEXT NOT NULL,
        details TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await queryRun(`CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)`);
    await queryRun(`CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)`);
    await queryRun(`CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority)`);
    await queryRun(`CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date)`);
    await queryRun(`CREATE INDEX IF NOT EXISTS idx_activity_user_id ON activity_logs(user_id)`);

    console.log('Database tables & indexes initialized successfully.');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

module.exports = {
  db,
  queryGet,
  queryAll,
  queryRun,
  initDB
};
