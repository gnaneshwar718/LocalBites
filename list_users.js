import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
    process.exit(1);
  }
});

db.all(`SELECT * FROM users`, [], (err, rows) => {
  if (err) {
    throw err;
  }
  if (rows.length === 0) {
    console.log('No users found in the database.');
  } else {
    console.table(rows);
  }
  db.close();
});
