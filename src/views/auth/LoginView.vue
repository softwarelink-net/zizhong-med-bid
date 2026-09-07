<template>
  <div class="w-full max-w-md">
    <div class="mb-6 text-center">
      <img src="/logo.png" width="56" height="56" alt="资中县人民医院" class="mx-auto mb-3 h-14 w-14 rounded-xl object-cover" />
      <h1 class="text-2xl font-bold text-slate-800">资中县人民医院</h1>
      <p class="mt-1 text-sm text-slate-500">医务管理系统</p>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" size="large" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
            @keyup.enter="onSubmit"
          />
        </el-form-item>
        <el-button type="primary" class="!w-full" size="large" :loading="loading" @click="onSubmit">
          登录
        </el-button>
      </el-form>

      <div class="mt-5 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
        <div class="mb-1 font-medium text-slate-600">演示账号</div>
        <div>超级管理员：admin / admin123</div>
        <div>医务科长：doctor_head / password123</div>
        <div>普通医生：clinician_01 / password123</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  username: 'admin',
  password: 'admin123',
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function onSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    const result = auth.login(form.username.trim(), form.password)
    if (!result.ok) {
      ElMessage.error(result.message)
      return
    }
    ElMessage.success(result.message)
    const redirect = (route.query.redirect as string) || '/'
    await router.replace(redirect)
  } finally {
    loading.value = false
  }
}
</script>
