<template>
  <div class="chart-box" :style="{ height: `${height}px` }">
    <v-chart :option="option" autoresize class="chart-el" />
  </div>
</template>

<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
])

withDefaults(
  defineProps<{
    option: Record<string, unknown>
    height?: number
  }>(),
  { height: 256 },
)
</script>

<style scoped>
.chart-box {
  position: relative;
  width: 100%;
  max-height: 400px;
  overflow: hidden;
}
.chart-el {
  position: absolute !important;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
}
</style>
