const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || './data/bot.db';
let db;

// Initialize database
async function initDatabase() {
  return new Promise((resolve, reject) => {
    // Create data directory if it doesn't exist
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Open database
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        reject(err);
      } else {
        // Create tables
        createTables(db)
          .then(resolve)
          .catch(reject);
      }
    });
  });
}

// Create database tables
async function createTables(database) {
  return new Promise((resolve, reject) => {
    database.serialize(() => {
      // Users table
      database.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY,
          telegram_id INTEGER UNIQUE NOT NULL,
          username TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Applied codes table
      database.run(`
        CREATE TABLE IF NOT EXISTS applied_codes (
          id INTEGER PRIMARY KEY,
          user_id INTEGER NOT NULL,
          code TEXT NOT NULL,
          applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'pending',
          response TEXT,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Settings table
      database.run(`
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY,
          user_id INTEGER NOT NULL,
          setting_key TEXT NOT NULL,
          setting_value TEXT,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

// Get database instance
function getDatabase() {
  return db;
}

// Query database
async function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Run database command
async function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

module.exports = {
  initDatabase,
  getDatabase,
  query,
  run
};
