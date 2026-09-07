<template>
  <div>
    <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="page-title">临床路径管理</h2>
        <p class="page-subtitle">标准化诊疗方案 · 变异追踪 · 优化建议</p>
      </div>
      <el-input
        v-model="keyword"
        clearable
        placeholder="搜索路径/病种"
        class="!w-56"
      />
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="item in filtered"
        :key="item.id"
        class="page-card transition hover:shadow-md"
      >
        <div class="mb-2 flex items-start justify-between gap-2">
          <h3 class="text-base font-semibold text-slate-800">{{ item.pathway_name }}</h3>
          <el-tag :type="item.status === 'active' ? 'success' : item.status === 'draft' ? 'info' : 'warning'" size="small">
            {{ statusLabel(item.status) }}
          </el-tag>
        </div>
        <div class="space-y-1 text-sm text-slate-600">
          <div>病种：{{ item.disease_name }}（{{ item.disease_code }}）</div>
          <div>标准住院日：{{ item.standard_days }} 天</div>
          <div>
            变异率：
            <span :class="item.deviation_rate > 10 ? 'text-rose-600 font-medium' : 'text-emerald-600'">
              {{ item.deviation_rate }}%
            </span>
          </div>
          <div class="text-xs text-slate-400">更新于 {{ item.updated_at }}</div>
        </div>
        <div class="mt-4">
          <el-progress
            :percentage="Math.min(100, Math.round(100 - item.deviation_rate))"
            :status="item.deviation_rate > 10 ? 'exception' : 'success'"
            :stroke-width="10"
          />
          <div class="mt-1 text-xs text-slate-400">路径依从度</div>
        </div>
        <el-alert
          v-if="item.deviation_rate > 10"
          class="!mt-3"
          type="warning"
          :closable="false"
          title="AI 提醒：建议复核高变异节点（检验时机 / 出院标准）"
          show-icon
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppDataStore } from '@/stores/appData'

const appData = useAppDataStore()
const keyword = ref('')

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return appData.pathways
  return appData.pathways.filter(
    (p) =>
      p.pathway_name.toLowerCase().includes(kw) ||
      p.disease_name.toLowerCase().includes(kw) ||
      p.disease_code.toLowerCase().includes(kw),
  )
})

function statusLabel(s: string) {
  if (s === 'active') return '启用'
  if (s === 'draft') return '草稿'
  return '归档'
}
</script>
