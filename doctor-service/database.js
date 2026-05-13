const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./doctors.db", (err) => {
  if (err) {
    console.error("Error opening doctors database:", err.message);
  } else {
    console.log("Connected to doctors SQLite database.");
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT
  )
`);

module.exports = db;