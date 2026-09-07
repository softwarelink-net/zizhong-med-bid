-- D1 / SQLite schema for Allworld DB (prefix: zzmed_)
-- Prepared for Cloudflare D1 database named `Allworld`

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
    department_id INTEGER,
    department TEXT,
    report_date DATE,
    status TEXT CHECK(status IN ('normal', 'warning', 'critical')),
    FOREIGN KEY(department_id) REFERENCES zzmed_departments(id)
);

CREATE TABLE IF NOT EXISTS zzmed_performance_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    user_name TEXT,
    department TEXT,
    month TEXT NOT NULL,
    base_score REAL DEFAULT 0,
    drg_bonus REAL DEFAULT 0,
    penalty REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES zzmed_users(id)
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

INSERT OR IGNORE INTO zzmed_system_configs (key, value, description) VALUES
('enable_dr_g_module', 'true', 'Enable DRG/DIP performance module'),
('enable_ai_assistant', 'false', 'Enable AI clinical assistant'),
('maintenance_mode', 'false', 'System maintenance mode');

INSERT OR IGNORE INTO zzmed_users (username, password_hash, role, email, display_name, department) VALUES
('admin', '$2b$10$examplehash...', 'admin', 'admin@zizhong-hospital.cn', '系统管理员', '信息科');
