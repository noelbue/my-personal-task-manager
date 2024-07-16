const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0,
    priority INTEGER NOT NULL DEFAULT 0,
    deadline TEXT,
    creationDate TEXT NOT NULL,
    tags TEXT
  )`);
});

// GET /api/tasks

// POST /api/tasks

// PUT /api/tasks/:id

// DELETE /api/tasks/:id