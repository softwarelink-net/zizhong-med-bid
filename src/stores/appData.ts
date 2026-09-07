import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  ClinicalPathway,
  PerformanceRecord,
  QualityIndicator,
  WorkflowTask,
} from '@/types'
import {
  MOCK_PATHWAYS,
  MOCK_PERFORMANCE,
  MOCK_QUALITY,
  MOCK_WORKFLOWS,
} from '@/data/mock'
import { execWrite, getDatabase, queryAll } from '@/services/db'

export const useAppDataStore = defineStore('appData', () => {
  const ready = ref(false)
  const quality = ref<QualityIndicator[]>([...MOCK_QUALITY])
  const performance = ref<PerformanceRecord[]>([...MOCK_PERFORMANCE])
  const pathways = ref<ClinicalPathway[]>([...MOCK_PATHWAYS])
  const workflows = ref<WorkflowTask[]>([...MOCK_WORKFLOWS])

  async function init() {
    if (ready.value) return
    try {
      const db = await getDatabase()
      const qRows = queryAll<QualityIndicator>(
        db,
        `SELECT id, indicator_code, indicator_name, target_value, current_value, unit, department, report_date, status
         FROM zzmed_quality_indicators ORDER BY id`,
      )
      if (qRows.length) quality.value = qRows

      const pRows = queryAll<{
        id: number
        user_name: string
        department: string
        month: string
        base_score: number
        drg_bonus: number
        penalty: number
      }>(
        db,
        `SELECT id, user_name, department, month, base_score, drg_bonus, penalty
         FROM zzmed_performance_records ORDER BY id`,
      )
      if (pRows.length) {
        performance.value = pRows.map((r) => ({
          ...r,
          total_score: Number(r.base_score) + Number(r.drg_bonus) - Number(r.penalty),
        }))
      }

      const pathRows = queryAll<ClinicalPathway>(
        db,
        `SELECT id, pathway_name, disease_code, disease_name, standard_days, deviation_rate, status, updated_at
         FROM zzmed_clinical_pathways ORDER BY id`,
      )
      if (pathRows.length) pathways.value = pathRows

      const wRows = queryAll<WorkflowTask>(
        db,
        `SELECT id, title, category, applicant, department, status, created_at, priority
         FROM zzmed_workflow_tasks ORDER BY id DESC`,
      )
      if (wRows.length) workflows.value = wRows
    } catch (e) {
      console.warn('[db] fallback to mock data', e)
    } finally {
      ready.value = true
    }
  }

  async function updateWorkflowStatus(id: number, status: WorkflowTask['status']) {
    workflows.value = workflows.value.map((w) => (w.id === id ? { ...w, status } : w))
    try {
      const db = await getDatabase()
      execWrite(db, `UPDATE zzmed_workflow_tasks SET status = ? WHERE id = ?`, [status, id])
    } catch {
      /* demo noop */
    }
  }

  return {
    ready,
    quality,
    performance,
    pathways,
    workflows,
    init,
    updateWorkflowStatus,
  }
})
