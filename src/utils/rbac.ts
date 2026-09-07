import type { UserRole } from '@/types'

/** Demo accounts — passwords are plaintext for local demo only */
export const DEMO_ACCOUNTS: Record<
  string,
  { password: string; role: UserRole; displayName: string; email: string; department: string }
> = {
  admin: {
    password: 'admin123',
    role: 'admin',
    displayName: '系统管理员',
    email: 'admin@zizhong-hospital.cn',
    department: '信息科',
  },
  doctor_head: {
    password: 'password123',
    role: 'doctor_head',
    displayName: '医务科长',
    email: 'med.director@zizhong-hospital.cn',
    department: '医务科',
  },
  clinician_01: {
    password: 'password123',
    role: 'clinician',
    displayName: '张医生',
    email: 'zhang.yi@zizhong-hospital.cn',
    department: '内科',
  },
  auditor_01: {
    password: 'password123',
    role: 'auditor',
    displayName: '李审计',
    email: 'li.audit@zizhong-hospital.cn',
    department: '质控办',
  },
  guest: {
    password: 'guest123',
    role: 'guest',
    displayName: '访客',
    email: 'guest@zizhong-hospital.cn',
    department: '公开区',
  },
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: '超级管理员',
  doctor_head: '医务科长',
  clinician: '普通医生',
  auditor: '审计员',
  guest: '访客',
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['*'],
  doctor_head: [
    'dashboard',
    'quality',
    'performance',
    'pathway',
    'workflow',
    'bid',
    'reports',
  ],
  clinician: ['dashboard', 'pathway', 'workflow', 'quality:view'],
  auditor: ['dashboard', 'quality', 'workflow', 'bid', 'compliance'],
  guest: ['announcements', 'training'],
}

export function hasPermission(role: UserRole, permission: string): boolean {
  const list = ROLE_PERMISSIONS[role] || []
  if (list.includes('*')) return true
  if (list.includes(permission)) return true
  const base = permission.split(':')[0]
  return list.includes(base)
}
