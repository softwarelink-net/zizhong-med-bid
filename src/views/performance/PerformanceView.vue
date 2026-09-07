<template>
  <div>
    <div class="mb-5">
      <h2 class="page-title">DRG / DIP 绩效管理</h2>
      <p class="page-subtitle">病种成本核算 · 工作量积分 · 奖金分配模拟</p>
    </div>

    <div class="mb-4 grid gap-3 md:grid-cols-4">
      <div class="page-card !p-4">
        <div class="text-xs text-slate-500">人均总分</div>
        <div class="mt-1 text-2xl font-bold text-slate-800">{{ avgTotal.toFixed(1) }}</div>
      </div>
      <div class="page-card !p-4">
        <div class="text-xs text-slate-500">DRG 奖励合计</div>
        <div class="mt-1 text-2xl font-bold text-blue-600">{{ sumDrg.toFixed(1) }}</div>
      </div>
      <div class="page-card !p-4">
        <div class="text-xs text-slate-500">扣减合计</div>
        <div class="mt-1 text-2xl font-bold text-rose-500">{{ sumPenalty.toFixed(1) }}</div>
      </div>
      <div class="page-card !p-4">
        <div class="text-xs text-slate-500">模拟月度奖金池</div>
        <div class="mt-1 text-2xl font-bold text-emerald-600">¥{{ bonusPool.toLocaleString() }}</div>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="page-card">
        <h3 class="mb-3 text-sm font-semibold text-slate-700">个人绩效构成</h3>
        <ChartPanel :option="stackOption" :height="288" />
      </div>
      <div class="page-card">
        <h3 class="mb-3 text-sm font-semibold text-slate-700">奖金分配模拟</h3>
        <el-form label-width="110px" class="mb-4">
          <el-form-item label="奖金池（元）">
            <el-input-number v-model="bonusPool" :min="10000" :step="5000" />
          </el-form-item>
          <el-form-item label="CMI 权重">
            <el-slider v-model="cmiWeight" :min="0.5" :max="1.5" :step="0.05" show-input />
          </el-form-item>
        </el-form>
        <el-table :data="bonusRows" size="small" stripe>
          <el-table-column prop="user_name" label="姓名" width="90" />
          <el-table-column prop="department" label="科室" width="90" />
          <el-table-column prop="total_score" label="总分" width="80" />
          <el-table-column prop="share" label="模拟奖金(元)" />
        </el-table>
      </div>
    </div>

    <div class="page-card mt-4">
      <el-table :data="appData.performance" stripe>
        <el-table-column prop="month" label="月份" width="100" />
        <el-table-column prop="user_name" label="姓名" width="100" />
        <el-table-column prop="department" label="科室" width="100" />
        <el-table-column prop="base_score" label="基础分" width="100" />
        <el-table-column prop="drg_bonus" label="DRG加分" width="100" />
        <el-table-column prop="penalty" label="扣减" width="90" />
        <el-table-column prop="total_score" label="总分" width="90" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ChartPanel from '@/components/ChartPanel.vue'
import { useAppDataStore } from '@/stores/appData'

const appData = useAppDataStore()
const bonusPool = ref(120000)
const cmiWeight = ref(1.0)

const avgTotal = computed(() => {
  const list = appData.performance
  if (!list.length) return 0
  return list.reduce((s, r) => s + r.total_score, 0) / list.length
})
const sumDrg = computed(() => appData.performance.reduce((s, r) => s + r.drg_bonus, 0))
const sumPenalty = computed(() => appData.performance.reduce((s, r) => s + r.penalty, 0))

const weightedTotal = computed(() =>
  appData.performance.reduce((s, r) => s + r.total_score * cmiWeight.value, 0),
)

const bonusRows = computed(() =>
  appData.performance.map((r) => ({
    ...r,
    share: Math.round((r.total_score * cmiWeight.value) / (weightedTotal.value || 1) * bonusPool.value),
  })),
)

const stackOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['基础分', 'DRG加分', '扣减'] },
  grid: { left: 40, right: 20, top: 40, bottom: 30 },
  xAxis: {
    type: 'category',
    data: appData.performance.map((r) => r.user_name),
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: '基础分',
      type: 'bar',
      stack: 'total',
      data: appData.performance.map((r) => r.base_score),
      itemStyle: { color: '#1d4ed8' },
    },
    {
      name: 'DRG加分',
      type: 'bar',
      stack: 'total',
      data: appData.performance.map((r) => r.drg_bonus),
      itemStyle: { color: '#0ea5e9' },
    },
    {
      name: '扣减',
      type: 'bar',
      stack: 'total',
      data: appData.performance.map((r) => -r.penalty),
      itemStyle: { color: '#f43f5e' },
    },
  ],
}))
</script>
