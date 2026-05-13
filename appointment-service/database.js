const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./appointments.db", (err) => {
  if (err) {
    console.error("Error opening appointments database:", err.message);
  } else {
    console.log("Connected to appointments SQLite database.");
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT NOT NULL
  )
`);

module.exports = db;