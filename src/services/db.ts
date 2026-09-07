import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import {
  MOCK_PATHWAYS,
  MOCK_PERFORMANCE,
  MOCK_QUALITY,
  MOCK_WORKFLOWS,
} from '@/data/mock'

const DB_STORAGE_KEY = 'zzmed_sqlite_v1'
const R2_DB_URL =
  import.meta.env.VITE_R2_DB_URL || '/database.sqlite'

let SQL: SqlJsStatic | null = null
let db: Database | null = null
let readyPromise: Promise<Database> | null = null

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS zzmed_departments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS zzmed_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'doctor_head', 'clinician', 'auditor', 'guest')),
  email TEXT,
  display_name TEXT,
  department TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS zzmed_system_configs (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS zzmed_quality_indicators (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  indicator_code TEXT UNIQUE NOT NULL,
  indicator_name TEXT NOT NULL,
  target_value REAL,
  current_value REAL,
  unit TEXT,
  department TEXT,
  report_date DATE,
  status TEXT CHECK(status IN ('normal', 'warning', 'critical'))
);

CREATE TABLE IF NOT EXISTS zzmed_performance_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_name TEXT NOT NULL,
  department TEXT,
  month TEXT NOT NULL,
  base_score REAL DEFAULT 0,
  drg_bonus REAL DEFAULT 0,
  penalty REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS zzmed_clinical_pathways (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pathway_name TEXT NOT NULL,
  disease_code TEXT,
  disease_name TEXT,
  standard_days INTEGER,
  deviation_rate REAL,
  status TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS zzmed_workflow_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT,
  applicant TEXT,
  department TEXT,
  status TEXT,
  created_at TEXT,
  priority TEXT
);
`

function seed(database: Database) {
  const count = database.exec('SELECT COUNT(*) as c FROM zzmed_users')
  if (count[0]?.values?.[0]?.[0]) return

  database.run(`
    INSERT INTO zzmed_system_configs (key, value, description) VALUES
    ('enable_dr_g_module', 'true', 'Enable DRG/DIP performance module'),
    ('enable_ai_assistant', 'false', 'Enable AI clinical assistant'),
    ('maintenance_mode', 'false', 'System maintenance mode');
  `)

  database.run(`
    INSERT INTO zzmed_users (username, password_hash, role, email, display_name, department) VALUES
    ('admin', 'admin123', 'admin', 'admin@zizhong-hospital.cn', '系统管理员', '信息科'),
    ('doctor_head', 'password123', 'doctor_head', 'med.director@zizhong-hospital.cn', '医务科长', '医务科'),
    ('clinician_01', 'password123', 'clinician', 'zhang.yi@zizhong-hospital.cn', '张医生', '内科'),
    ('auditor_01', 'password123', 'auditor', 'li.audit@zizhong-hospital.cn', '李审计', '质控办'),
    ('guest', 'guest123', 'guest', 'guest@zizhong-hospital.cn', '访客', '公开区');
  `)

  for (const q of MOCK_QUALITY) {
    database.run(
      `INSERT INTO zzmed_quality_indicators
       (indicator_code, indicator_name, target_value, current_value, unit, department, report_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        q.indicator_code,
        q.indicator_name,
        q.target_value,
        q.current_value,
        q.unit,
        q.department,
        q.report_date,
        q.status,
      ],
    )
  }

  for (const p of MOCK_PERFORMANCE) {
    database.run(
      `INSERT INTO zzmed_performance_records
       (user_name, department, month, base_score, drg_bonus, penalty)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [p.user_name, p.department, p.month, p.base_score, p.drg_bonus, p.penalty],
    )
  }

  for (const path of MOCK_PATHWAYS) {
    database.run(
      `INSERT INTO zzmed_clinical_pathways
       (pathway_name, disease_code, disease_name, standard_days, deviation_rate, status, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        path.pathway_name,
        path.disease_code,
        path.disease_name,
        path.standard_days,
        path.deviation_rate,
        path.status,
        path.updated_at,
      ],
    )
  }

  for (const w of MOCK_WORKFLOWS) {
    database.run(
      `INSERT INTO zzmed_workflow_tasks
       (title, category, applicant, department, status, created_at, priority)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [w.title, w.category, w.applicant, w.department, w.status, w.created_at, w.priority],
    )
  }
}

function persistLocal(database: Database) {
  const data = database.export()
  const arr = Array.from(data)
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(arr))
}

async function loadFromLocal(SQLLib: SqlJsStatic): Promise<Database | null> {
  const raw = localStorage.getItem(DB_STORAGE_KEY)
  if (!raw) return null
  try {
    const bytes = new Uint8Array(JSON.parse(raw) as number[])
    return new SQLLib.Database(bytes)
  } catch {
    return null
  }
}

async function loadFromR2(SQLLib: SqlJsStatic): Promise<Database | null> {
  try {
    const res = await fetch(R2_DB_URL, { cache: 'no-store' })
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    if (buf.byteLength < 100) return null
    return new SQLLib.Database(new Uint8Array(buf))
  } catch {
    return null
  }
}

export async function getDatabase(): Promise<Database> {
  if (db) return db
  if (readyPromise) return readyPromise

  readyPromise = (async () => {
    SQL = await initSqlJs({ locateFile: () => wasmUrl })
    let instance =
      (await loadFromLocal(SQL)) ||
      (await loadFromR2(SQL)) ||
      new SQL.Database()

    instance.run(SCHEMA_SQL)
    seed(instance)
    persistLocal(instance)
    db = instance
    return instance
  })()

  return readyPromise
}

export function queryAll<T>(
  database: Database,
  sql: string,
  params: unknown[] = [],
): T[] {
  const stmt = database.prepare(sql)
  stmt.bind(params as never[])
  const rows: T[] = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as T)
  }
  stmt.free()
  return rows
}

export function execWrite(database: Database, sql: string, params: unknown[] = []) {
  database.run(sql, params as never[])
  persistLocal(database)
}

/** Serialize DB for R2 upload (demo helper). */
export async function exportDatabaseBlob(): Promise<Blob> {
  const database = await getDatabase()
  const bytes = database.export()
  const copy = new Uint8Array(bytes)
  return new Blob([copy.buffer], { type: 'application/x-sqlite3' })
}
