<template>
  <div class="main-layout min-h-screen bg-slate-100">
    <StickyBanner />
    <div class="flex min-h-[calc(100vh-40px)]">
      <aside
        class="hidden w-60 shrink-0 border-r border-slate-200 bg-slate-900 text-slate-100 md:flex md:flex-col"
      >
        <div class="border-b border-slate-700 px-4 py-5">
          <div class="text-sm font-semibold tracking-wide text-cyan-300">资中县人民医院</div>
          <div class="mt-1 text-base font-bold text-white">医务管理系统</div>
        </div>
        <nav class="flex-1 space-y-1 overflow-y-auto p-3">
          <RouterLink
            v-for="item in visibleMenus"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
            active-class="!bg-blue-600 !text-white"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>
        <div class="border-t border-slate-700 p-4 text-xs text-slate-400">
          zizhong-med-bid
        </div>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <header
          class="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm"
        >
          <div class="flex items-center gap-3">
            <el-button class="md:!hidden" text @click="drawer = true">
              <el-icon><Menu /></el-icon>
            </el-button>
            <h1 class="text-sm font-semibold text-slate-700 md:text-base">{{ pageTitle }}</h1>
          </div>
          <div class="flex items-center gap-3">
            <el-tag size="small" type="info">{{ auth.roleLabel }}</el-tag>
            <span class="hidden text-sm text-slate-600 sm:inline">{{ auth.user?.displayName }}</span>
            <el-button size="small" @click="onLogout">退出</el-button>
          </div>
        </header>

        <main class="flex-1 overflow-auto p-4 md:p-6">
          <slot />
        </main>
      </div>
    </div>

    <el-drawer v-model="drawer" direction="ltr" size="240px" title="导航菜单">
      <div class="space-y-1">
        <RouterLink
          v-for="item in visibleMenus"
          :key="item.path"
          :to="item.path"
          class="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          @click="drawer = false"
        >
          {{ item.label }}
        </RouterLink>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  DataAnalysis,
  Document,
  FirstAidKit,
  Menu,
  Notebook,
  OfficeBuilding,
  Setting,
  TrendCharts,
} from '@element-plus/icons-vue'
import StickyBanner from '@/components/StickyBanner.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const drawer = ref(false)

const menus = [
  { path: '/', label: '运营驾驶舱', icon: DataAnalysis, permission: 'dashboard' },
  { path: '/quality', label: '医疗质控', icon: FirstAidKit, permission: 'quality' },
  { path: '/performance', label: '绩效管理', icon: TrendCharts, permission: 'performance' },
  { path: '/pathway', label: '临床路径', icon: Notebook, permission: 'pathway' },
  { path: '/workflow', label: '行政协同', icon: OfficeBuilding, permission: 'workflow' },
  { path: '/bid/N5110252026000107', label: '招标公告', icon: Document, permission: '' },
  { path: '/system/users', label: '用户权限', icon: Setting, permission: '*', roles: ['admin'] },
  { path: '/announcements', label: '公告培训', icon: Document, permission: 'announcements' },
]

const visibleMenus = computed(() =>
  menus.filter((m) => {
    if (m.roles && auth.role && !m.roles.includes(auth.role)) return false
    if (m.permission === '*') return auth.role === 'admin'
    if (!m.permission) return true
    if (auth.role === 'guest') return m.permission === 'announcements'
    return auth.can(m.permission)
  }),
)

const pageTitle = computed(() => (route.meta.seo as { title?: string } | undefined)?.title?.split(' - ')[0] || '医务管理系统')

function onLogout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>
