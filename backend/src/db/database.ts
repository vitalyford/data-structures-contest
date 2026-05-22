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

export default db;
