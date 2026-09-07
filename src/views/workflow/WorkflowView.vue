<template>
  <div>
    <div class="mb-5">
      <h2 class="page-title">行政协同审批</h2>
      <p class="page-subtitle">请假 · 采购 · 制度更新 — 全流程电子化审批</p>
    </div>

    <div class="mb-4 flex flex-wrap gap-2">
      <el-radio-group v-model="filter" size="small">
        <el-radio-button value="all">全部</el-radio-button>
        <el-radio-button value="pending">待审批</el-radio-button>
        <el-radio-button value="approved">已通过</el-radio-button>
        <el-radio-button value="rejected">已驳回</el-radio-button>
      </el-radio-group>
    </div>

    <div class="page-card">
      <el-table :data="filtered" stripe>
        <el-table-column prop="title" label="事项" min-width="220" />
        <el-table-column prop="category" label="类型" width="100">
          <template #default="{ row }">{{ categoryLabel(row.category) }}</template>
        </el-table-column>
        <el-table-column prop="applicant" label="申请人" width="100" />
        <el-table-column prop="department" label="科室" width="100" />
        <el-table-column prop="priority" label="优先级" width="90">
          <template #default="{ row }">
            <el-tag :type="row.priority === 'high' ? 'danger' : row.priority === 'medium' ? 'warning' : 'info'" size="small">
              {{ row.priority === 'high' ? '高' : row.priority === 'medium' ? '中' : '低' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="提交时间" width="150" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 'approved' ? 'success' : row.status === 'rejected' ? 'danger' : 'warning'" size="small">
              {{ row.status === 'approved' ? '通过' : row.status === 'rejected' ? '驳回' : '待审' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <template v-if="row.status === 'pending' && canApprove">
              <el-button type="success" link size="small" @click="approve(row.id)">通过</el-button>
              <el-button type="danger" link size="small" @click="reject(row.id)">驳回</el-button>
            </template>
            <span v-else class="text-xs text-slate-400">—</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useAppDataStore } from '@/stores/appData'
import { useAuthStore } from '@/stores/auth'

const appData = useAppDataStore()
const auth = useAuthStore()
const filter = ref('all')

const canApprove = computed(() =>
  auth.role === 'admin' || auth.role === 'doctor_head' || auth.role === 'auditor',
)

const filtered = computed(() => {
  if (filter.value === 'all') return appData.workflows
  return appData.workflows.filter((w) => w.status === filter.value)
})

function categoryLabel(c: string) {
  if (c === 'leave') return '请假'
  if (c === 'procurement') return '采购'
  return '制度'
}

async function approve(id: number) {
  await appData.updateWorkflowStatus(id, 'approved')
  ElMessage.success('已通过')
}

async function reject(id: number) {
  await appData.updateWorkflowStatus(id, 'rejected')
  ElMessage.warning('已驳回')
}
</script>
