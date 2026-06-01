import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, 'contest.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Run schema migration
const schema = fs.readFileSync(
  path.join(__dirname, 'schema.sql'),
  'utf8'
);
db.exec(schema);

// Migrate: add problem_set column to existing databases
const cols = db.prepare("PRAGMA table_info(contest_sessions)").all() as { name: string }[];
if (!cols.some(c => c.name === 'problem_set')) {
  db.prepare("ALTER TABLE contest_sessions ADD COLUMN problem_set TEXT NOT NULL DEFAULT 'A'").run();
}

export default db;
