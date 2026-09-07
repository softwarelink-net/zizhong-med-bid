<template>
  <div>
    <div class="mb-5">
      <h2 class="page-title">医疗质量控制</h2>
      <p class="page-subtitle">关键指标实时监测 · 异常值自动告警</p>
    </div>

    <div class="mb-4 grid gap-3 md:grid-cols-3">
      <div class="page-card !p-4">
        <div class="text-xs text-slate-500">正常指标</div>
        <div class="mt-1 text-2xl font-bold text-emerald-600">{{ counts.normal }}</div>
      </div>
      <div class="page-card !p-4">
        <div class="text-xs text-slate-500">预警指标</div>
        <div class="mt-1 text-2xl font-bold text-amber-500">{{ counts.warning }}</div>
      </div>
      <div class="page-card !p-4">
        <div class="text-xs text-slate-500">危急指标</div>
        <div class="mt-1 text-2xl font-bold text-rose-600">{{ counts.critical }}</div>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-5">
      <div class="page-card lg:col-span-3">
        <h3 class="mb-3 text-sm font-semibold text-slate-700">指标达成对比</h3>
        <ChartPanel :option="chartOption" :height="288" />
      </div>
      <div class="page-card lg:col-span-2">
        <h3 class="mb-3 text-sm font-semibold text-slate-700">告警处置建议</h3>
        <el-timeline>
          <el-timeline-item
            v-for="item in advice"
            :key="item.title"
            :type="item.type"
            :timestamp="item.time"
          >
            <div class="text-sm font-medium text-slate-700">{{ item.title }}</div>
            <div class="mt-1 text-xs text-slate-500">{{ item.desc }}</div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>

    <div class="page-card mt-4">
      <el-table :data="appData.quality" stripe>
        <el-table-column prop="indicator_code" label="编码" width="120" />
        <el-table-column prop="indicator_name" label="指标名称" min-width="160" />
        <el-table-column prop="department" label="责任科室" width="110" />
        <el-table-column label="当前 / 目标" width="140">
          <template #default="{ row }">
            {{ row.current_value }}{{ row.unit }} / {{ row.target_value }}{{ row.unit }}
          </template>
        </el-table-column>
        <el-table-column prop="report_date" label="报告日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'critical' ? 'danger' : row.status === 'warning' ? 'warning' : 'success'" size="small">
              {{ row.status === 'critical' ? '危急' : row.status === 'warning' ? '预警' : '正常' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ChartPanel from '@/components/ChartPanel.vue'
import { useAppDataStore } from '@/stores/appData'

const appData = useAppDataStore()

const counts = computed(() => ({
  normal: appData.quality.filter((q) => q.status === 'normal').length,
  warning: appData.quality.filter((q) => q.status === 'warning').length,
  critical: appData.quality.filter((q) => q.status === 'critical').length,
}))

const chartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['当前值', '目标值'] },
  grid: { left: 40, right: 20, top: 40, bottom: 60 },
  xAxis: {
    type: 'category',
    data: appData.quality.map((q) => q.indicator_name),
    axisLabel: { rotate: 20, fontSize: 11 },
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: '当前值',
      type: 'bar',
      data: appData.quality.map((q) => q.current_value),
      itemStyle: { color: '#1d4ed8' },
    },
    {
      name: '目标值',
      type: 'bar',
      data: appData.quality.map((q) => q.target_value),
      itemStyle: { color: '#94a3b8' },
    },
  ],
}))

const advice = [
  {
    title: '病历甲级率偏低',
    desc: '建议组织病案室专项质控会，对缺陷病历限期整改。',
    time: '2026-09-07 08:30',
    type: 'danger' as const,
  },
  {
    title: '手术安全核查未达100%',
    desc: '核查手术室签到记录，补齐术前/术中/术后三方核查节点。',
    time: '2026-09-06 16:10',
    type: 'warning' as const,
  },
  {
    title: '抗菌药物强度达标',
    desc: '继续执行处方前置审核与临床药师点评机制。',
    time: '2026-09-05 10:00',
    type: 'success' as const,
  },
]
</script>
