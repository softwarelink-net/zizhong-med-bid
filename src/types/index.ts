export type UserRole = 'admin' | 'doctor_head' | 'clinician' | 'auditor' | 'guest'

export interface UserProfile {
  id: number
  username: string
  role: UserRole
  displayName: string
  email?: string
  department?: string
}

export interface AuthSession {
  token: string
  user: UserProfile
  expiresAt: number
}

export type QualityStatus = 'normal' | 'warning' | 'critical'

export interface QualityIndicator {
  id: number
  indicator_code: string
  indicator_name: string
  target_value: number
  current_value: number
  unit: string
  department: string
  report_date: string
  status: QualityStatus
}

export interface PerformanceRecord {
  id: number
  user_name: string
  department: string
  month: string
  base_score: number
  drg_bonus: number
  penalty: number
  total_score: number
}

export interface ClinicalPathway {
  id: number
  pathway_name: string
  disease_code: string
  disease_name: string
  standard_days: number
  deviation_rate: number
  status: 'active' | 'draft' | 'archived'
  updated_at: string
}

export interface WorkflowTask {
  id: number
  title: string
  category: 'leave' | 'procurement' | 'policy'
  applicant: string
  department: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  priority: 'low' | 'medium' | 'high'
}

export interface BidInfo {
  id: string
  title: string
  publisher: string
  publishDate: string
  budget: string
  keywords: string[]
  summary: string
  techPoints: string[]
  innovations: string[]
}

export interface SeoMeta {
  title: string
  description: string
  keywords: string
  ogImage?: string
  datePublished?: string
}
