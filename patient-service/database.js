const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./patients.db", (err) => {
  if (err) {
    console.error("Error opening patients database:", err.message);
  } else {
    console.log("Connected to patients SQLite database.");
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT
  )
`);

module.exports = db;