const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const PORT = process.env.PORT || 3000;

/**
 * @constant {express.Application}
 */
const app = express();

/** Middleware to parse JSON bodies */
app.use(express.json());

/**
 * SQLite database connection
 * @type {sqlite3.Database}
 */
const db = new sqlite3.Database(':memory:');

/**
 * Initialize the database by creating the tasks table
 */
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

/**
 * GET /api/tasks
 * Retrieve all tasks
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 */
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
      console.error(err);
      return;
    }
    rows.forEach(row => {
      try {
        row.tags = JSON.parse(row.tags);
      } catch (e) {
        row.tags = [];
      }
    });
    res.json({ tasks: rows });
  });
});

/**
 * POST /api/tasks
 * Create a new task
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 */
app.post('/api/tasks', (req, res) => {
  const { title, completed, priority, deadline, creationDate, tags } = req.body;
  db.run(
    'INSERT INTO tasks (title, completed, priority, deadline, creationDate, tags) VALUES (?, ?, ?, ?, ?, ?)',
    [title, completed ? 1 : 0, priority || 0, deadline, creationDate || new Date().toISOString(), JSON.stringify(tags || [])],
    function (err) {
      if (err) {
        res.status(500).json({ error: 'Internal server error' });
        console.error(err);
        return;
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

/**
 * PUT /api/tasks/:id
 * Update an existing task
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 */
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed, priority, deadline, tags } = req.body;
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Invalid title' });
  }
  db.run(
    'UPDATE tasks SET title = ?, completed = ?, priority = ?, deadline = ?, tags = ? WHERE id = ?',
    [title, completed ? 1 : 0, priority || 0, deadline, JSON.stringify(tags || []), id],
    function (err) {
      if (err) {
        res.status(500).json({ error: 'Internal server error' });
        console.error(err);
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Task not found' });
      } else {
        res.json({ changes: this.changes });
      }
    }
  );
});

/**
 * DELETE /api/tasks/:id
 * Delete a task
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 */
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', id, function (err) {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
      console.error(err);
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.json({ changes: this.changes });
    }
  });
});

/**
 * Start the Express server
 */
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});