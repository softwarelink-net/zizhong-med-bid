<template>
  <div>
    <div class="mb-5">
      <h2 class="page-title">运营驾驶舱</h2>
      <p class="page-subtitle">实时掌握全院运营、质控预警与资源利用情况</p>
    </div>

    <div class="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div v-for="card in statCards" :key="card.label" class="page-card !p-4">
        <div class="text-xs text-slate-500">{{ card.label }}</div>
        <div class="mt-2 text-2xl font-bold text-slate-800">
          {{ card.value }}<span class="ml-1 text-sm font-normal text-slate-400">{{ card.unit }}</span>
        </div>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="page-card">
        <h3 class="mb-3 text-sm font-semibold text-slate-700">近7日门诊量趋势</h3>
        <ChartPanel :option="outpatientOption" :height="256" />
      </div>
      <div class="page-card">
        <h3 class="mb-3 text-sm font-semibold text-slate-700">科室床位占用率</h3>
        <ChartPanel :option="bedOption" :height="256" />
      </div>
      <div class="page-card lg:col-span-2">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-slate-700">质控异常告警</h3>
          <RouterLink to="/quality" class="text-xs text-blue-600 hover:underline">查看全部</RouterLink>
        </div>
        <el-table :data="alerts" size="small" stripe>
          <el-table-column prop="indicator_name" label="指标" min-width="160" />
          <el-table-column prop="department" label="科室" width="100" />
          <el-table-column prop="current_value" label="当前值" width="100" />
          <el-table-column prop="target_value" label="目标值" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="statusType(row.status)" size="small">{{ statusLabel(row.status) }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ChartPanel from '@/components/ChartPanel.vue'
import { DASHBOARD_STATS } from '@/data/mock'
import { useAppDataStore } from '@/stores/appData'

const appData = useAppDataStore()

const statCards = [
  { label: '今日门诊', value: DASHBOARD_STATS.outpatientToday, unit: '人次' },
  { label: '在院患者', value: DASHBOARD_STATS.inpatientCount, unit: '人' },
  { label: '今日手术', value: DASHBOARD_STATS.surgeryToday, unit: '台' },
  { label: '待办审批', value: DASHBOARD_STATS.pendingApprovals, unit: '件' },
  { label: '质控告警', value: DASHBOARD_STATS.qualityAlerts, unit: '项' },
  { label: '平均住院日', value: DASHBOARD_STATS.avgLos, unit: '天' },
  { label: '床位占用率', value: DASHBOARD_STATS.bedOccupancy, unit: '%' },
  { label: 'DRG CMI', value: DASHBOARD_STATS.drgCmi, unit: '' },
]

const alerts = computed(() =>
  appData.quality.filter((q) => q.status !== 'normal'),
)

const outpatientOption = {
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 20, top: 30, bottom: 30 },
  xAxis: {
    type: 'category',
    data: ['09-01', '09-02', '09-03', '09-04', '09-05', '09-06', '09-07'],
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: '门诊量',
      type: 'line',
      smooth: true,
      areaStyle: { color: 'rgba(29,78,216,0.15)' },
      itemStyle: { color: '#1d4ed8' },
      data: [1120, 1186, 1240, 1098, 1310, 980, 1268],
    },
  ],
}

const bedOption = {
  tooltip: { trigger: 'axis' },
  grid: { left: 50, right: 20, top: 30, bottom: 30 },
  xAxis: {
    type: 'category',
    data: ['内科', '外科', '妇产', '儿科', '骨科', '急诊'],
  },
  yAxis: { type: 'value', max: 100 },
  series: [
    {
      name: '占用率%',
      type: 'bar',
      itemStyle: { color: '#0ea5e9', borderRadius: [4, 4, 0, 0] },
      data: [92, 88, 85, 79, 94, 71],
    },
  ],
}

function statusType(s: string) {
  if (s === 'critical') return 'danger'
  if (s === 'warning') return 'warning'
  return 'success'
}

function statusLabel(s: string) {
  if (s === 'critical') return '危急'
  if (s === 'warning') return '预警'
  return '正常'
}
</script>
