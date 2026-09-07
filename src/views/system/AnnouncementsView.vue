<template>
  <div>
    <div class="mb-5">
      <h2 class="page-title">公告与培训</h2>
      <p class="page-subtitle">公开信息区 · 访客只读</p>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="page-card">
        <h3 class="mb-3 text-sm font-semibold text-slate-700">院内公告</h3>
        <el-collapse>
          <el-collapse-item v-for="a in announcements" :key="a.title" :title="a.title" :name="a.title">
            <p class="text-sm leading-6 text-slate-600">{{ a.content }}</p>
            <div class="mt-2 text-xs text-slate-400">{{ a.date }}</div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="page-card">
        <h3 class="mb-3 text-sm font-semibold text-slate-700">培训资料</h3>
        <ul class="space-y-3">
          <li
            v-for="t in trainings"
            :key="t.title"
            class="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-3"
          >
            <div>
              <div class="text-sm font-medium text-slate-800">{{ t.title }}</div>
              <div class="text-xs text-slate-400">{{ t.category }} · {{ t.duration }}</div>
            </div>
            <el-tag size="small" type="info">PDF</el-tag>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const announcements = [
  {
    title: '关于开展2026年第三季度医疗质量专项检查的通知',
    content: '请各临床科室于9月15日前完成自查表填报，重点核查病历质量、手术安全核查与抗菌药物使用。',
    date: '2026-09-03',
  },
  {
    title: 'DRG/DIP 绩效核算规则宣讲安排',
    content: '医务科将于本周五下午在学术厅组织宣讲，欢迎科室主任及核算员参加。',
    date: '2026-09-01',
  },
  {
    title: '信息系统维护窗口提示',
    content: '本周日 02:00–04:00 进行例行备份演练，期间可能出现短暂只读，请提前做好业务安排。',
    date: '2026-08-28',
  },
]

const trainings = [
  { title: '电子病历书写规范（2026修订）', category: '病历质量', duration: '45分钟' },
  { title: '临床路径变异管理实操', category: '路径管理', duration: '30分钟' },
  { title: '移动端电子签名合规指引', category: '信息安全', duration: '20分钟' },
  { title: '合理用药监测系统使用手册', category: '药事管理', duration: '35分钟' },
]
</script>
