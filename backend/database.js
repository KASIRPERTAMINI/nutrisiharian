const sqlite3 = require('sqlite3').verbose();
const DB_PATH = './calories.db';

// Menghubungkan ke database SQLite, akan membuat file jika belum ada
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Membuat tabel jika belum ada
    db.serialize(() => {
      // Tabel untuk log makanan
      db.run(`CREATE TABLE IF NOT EXISTS food_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        calories INTEGER NOT NULL,
        protein INTEGER NOT NULL,
        mealTime TEXT NOT NULL,
        date TEXT NOT NULL
      )`);

      // Tabel untuk menyimpan target (hanya satu baris)
      db.run(`CREATE TABLE IF NOT EXISTS targets (
        id INTEGER PRIMARY KEY,
        calorieTarget INTEGER,
        proteinTarget INTEGER
      )`, (err) => {
        if (!err) {
          // Jika tabel baru dibuat, masukkan nilai default
          db.get('SELECT COUNT(*) as count FROM targets', (err, row) => {
            if (row.count === 0) {
              db.run('INSERT INTO targets (id, calorieTarget, proteinTarget) VALUES (1, 2500, 120)');
            }
          });
        }
      });
    });
  }
});

module.exports = db;
