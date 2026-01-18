import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IS_VERCEL = !!process.env.VERCEL;

let db;
let dbOperations = {};

if (IS_VERCEL) {
  console.log(
    'Running on Vercel: Using In-Memory Database (Data will be lost on restart)'
  );
  const users = [];

  dbOperations.initDB = () => {
    console.log('Memory DB initialized');
  };

  dbOperations.createUser = (name, email, password) => {
    return new Promise((resolve, reject) => {
      try {
        const id = users.length + 1;
        users.push({ id, name, email, password });
        resolve({ id, name, email });
      } catch (err) {
        reject(err);
      }
    });
  };

  dbOperations.findUserByEmail = (email) => {
    return new Promise((resolve) => {
      const user = users.find((u) => u.email === email);
      resolve(user);
    });
  };
} else {
  const dbPath = path.resolve(__dirname, '../../database.sqlite');
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database', err.message);
    } else {
      console.log('Connected to the SQLite database.');
      dbOperations.initDB();
    }
  });

  dbOperations.initDB = () => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )`,
      (err) => {
        if (err) {
          console.error('Error creating table', err.message);
        }
      }
    );
  };

  dbOperations.createUser = (name, email, password) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
      db.run(sql, [name, email, password], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, name, email });
        }
      });
    });
  };

  dbOperations.findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE email = ?`;
      db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  };
}

export const { initDB, createUser, findUserByEmail } = dbOperations;
export default db;
