import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { applySeoMeta, injectNewsArticleJsonLd, removeJsonLd } from '@/utils/seo'
import type { SeoMeta } from '@/types'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: string[]
    permission?: string
    layout?: 'auth' | 'main'
    seo?: SeoMeta
    newsArticle?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      layout: 'auth',
      seo: {
        title: '登录 - 资中县人民医院医务管理系统',
        description: '登录资中县人民医院医务管理系统参考实现。',
        keywords: '登录,医务管理系统,资中县人民医院',
      },
    },
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: {
      requiresAuth: true,
      permission: 'dashboard',
      layout: 'main',
      seo: {
        title: '运营驾驶舱 - 资中县人民医院医务管理系统',
        description: '医院运营状态、患者流量与资源利用率实时看板。',
        keywords: '驾驶舱,医院运营,医务管理,资中县人民医院',
      },
    },
  },
  {
    path: '/quality',
    name: 'quality',
    component: () => import('@/views/quality/QualityView.vue'),
    meta: {
      requiresAuth: true,
      permission: 'quality',
      layout: 'main',
      seo: {
        title: '医疗质量控制 - 资中县人民医院医务管理系统',
        description: '实时监控抗菌药物、手术安全核查等关键质控指标。',
        keywords: '医疗质控,抗菌药物,手术安全,资中县人民医院',
      },
    },
  },
  {
    path: '/performance',
    name: 'performance',
    component: () => import('@/views/performance/PerformanceView.vue'),
    meta: {
      requiresAuth: true,
      permission: 'performance',
      layout: 'main',
      seo: {
        title: 'DRG/DIP绩效管理 - 资中县人民医院医务管理系统',
        description: '基于DRG/DIP的成本分析、工作量核算与奖金模拟。',
        keywords: 'DRG,DIP,绩效考核,成本核算',
      },
    },
  },
  {
    path: '/pathway',
    name: 'pathway',
    component: () => import('@/views/pathway/PathwayView.vue'),
    meta: {
      requiresAuth: true,
      permission: 'pathway',
      layout: 'main',
      seo: {
        title: '临床路径管理 - 资中县人民医院医务管理系统',
        description: '标准化诊疗方案、变异追踪与优化建议。',
        keywords: '临床路径,诊疗规范,变异管理',
      },
    },
  },
  {
    path: '/workflow',
    name: 'workflow',
    component: () => import('@/views/workflow/WorkflowView.vue'),
    meta: {
      requiresAuth: true,
      permission: 'workflow',
      layout: 'main',
      seo: {
        title: '行政协同审批 - 资中县人民医院医务管理系统',
        description: '请假、采购与制度更新的电子审批链路。',
        keywords: '行政审批,无纸化办公,移动审批',
      },
    },
  },
  {
    path: '/bid/:id',
    name: 'bid-detail',
    component: () => import('@/views/bid/BidDetailView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'main',
      newsArticle: true,
      seo: {
        title: '【招标公告】资中县人民医院医务管理系统(二次)竞争性谈判',
        description:
          '资中县人民医院拟对医务管理系统进行二次竞争性谈判采购，预算金额50万元。项目编号N5110252026000107。',
        keywords: '资中县人民医院,医务管理系统,竞争性谈判,政府采购,四川',
        datePublished: '2026-09-03',
      },
    },
  },
  {
    path: '/system/users',
    name: 'system-users',
    component: () => import('@/views/system/UsersView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      layout: 'main',
      seo: {
        title: '用户与权限 - 资中县人民医院医务管理系统',
        description: '系统用户与RBAC权限管理。',
        keywords: '用户管理,RBAC,权限',
      },
    },
  },
  {
    path: '/announcements',
    name: 'announcements',
    component: () => import('@/views/system/AnnouncementsView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'main',
      seo: {
        title: '公告与培训 - 资中县人民医院医务管理系统',
        description: '公开公告与培训资料。',
        keywords: '公告,培训',
      },
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/system/NotFoundView.vue'),
    meta: {
      layout: 'auth',
      seo: {
        title: '页面未找到 - 资中县人民医院医务管理系统',
        description: '您访问的页面不存在。',
        keywords: '404',
      },
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }

  if (to.meta.roles?.length && auth.role && !to.meta.roles.includes(auth.role)) {
    return { name: 'dashboard' }
  }

  if (to.meta.permission && auth.isAuthenticated && !auth.can(to.meta.permission)) {
    if (auth.role === 'guest') return { name: 'announcements' }
    return { name: 'dashboard' }
  }

  return true
})

router.afterEach((to) => {
  if (to.meta.seo) {
    applySeoMeta(to.meta.seo)
    if (to.meta.newsArticle) injectNewsArticleJsonLd(to.meta.seo)
    else removeJsonLd()
  }
})

export default router
