CREATE TABLE IF NOT EXISTS groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  join_code TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  group_id INTEGER REFERENCES groups(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contest_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL REFERENCES groups(id),
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 90,
  start_time TEXT,
  is_active INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  problem_id TEXT NOT NULL,
  contest_session_id INTEGER NOT NULL REFERENCES contest_sessions(id),
  is_correct INTEGER NOT NULL,
  elapsed_seconds INTEGER NOT NULL,
  submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, problem_id, contest_session_id)
);

CREATE TABLE IF NOT EXISTS focus_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  contest_session_id INTEGER NOT NULL REFERENCES contest_sessions(id),
  occurred_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contest_logins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  contest_session_id INTEGER NOT NULL REFERENCES contest_sessions(id),
  occurred_at TEXT NOT NULL DEFAULT (datetime('now'))
);
