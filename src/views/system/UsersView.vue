<template>
  <div>
    <div class="mb-5">
      <h2 class="page-title">用户与权限</h2>
      <p class="page-subtitle">RBAC 角色矩阵 · 仅超级管理员可访问</p>
    </div>

    <div class="page-card mb-4 overflow-x-auto">
      <table class="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr class="border-b border-slate-200 text-slate-500">
            <th class="py-2 pr-3">角色</th>
            <th class="py-2 pr-3">权限范围</th>
            <th class="py-2">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in matrix" :key="row.role" class="border-b border-slate-100">
            <td class="py-3 pr-3 font-medium text-slate-800">{{ row.role }}</td>
            <td class="py-3 pr-3 text-slate-600">{{ row.perms }}</td>
            <td class="py-3 text-slate-500">{{ row.desc }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="page-card">
      <el-table :data="users" stripe>
        <el-table-column prop="username" label="用户名" width="140" />
        <el-table-column prop="displayName" label="姓名" width="120" />
        <el-table-column prop="roleLabel" label="角色" width="120" />
        <el-table-column prop="department" label="科室" width="120" />
        <el-table-column prop="email" label="邮箱" min-width="200" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DEMO_ACCOUNTS, ROLE_LABELS } from '@/utils/rbac'

const matrix = [
  { role: 'Super Admin', perms: '全部模块 / 用户管理 / 系统配置 / 审计日志', desc: '平台完全控制权' },
  { role: 'Medical Director', perms: '质控 / 绩效审阅 / 报表分析', desc: '查看临床数据并审批质控干预' },
  { role: 'Department Head', perms: '科室统计 / 排班 / 请假审批', desc: '管理本科室流程与人员' },
  { role: 'Clinician', perms: '病历 / 医嘱 / 任务执行', desc: '创建编辑患者记录与提交医嘱' },
  { role: 'Auditor', perms: '合规检查 / 差错报告 / 争议处理', desc: '审阅标记病例与争议流程' },
  { role: 'Guest/Viewer', perms: '公告 / 培训资料', desc: '只读访问非敏感公开信息' },
]

const users = Object.entries(DEMO_ACCOUNTS).map(([username, a]) => ({
  username,
  displayName: a.displayName,
  roleLabel: ROLE_LABELS[a.role],
  department: a.department,
  email: a.email,
}))
</script>
