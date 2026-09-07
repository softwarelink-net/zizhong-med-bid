import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { AuthSession, UserProfile, UserRole } from '@/types'
import { DEMO_ACCOUNTS, hasPermission, ROLE_LABELS } from '@/utils/rbac'

const STORAGE_KEY = 'zzmed_session'

function loadSession(): AuthSession | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const session = JSON.parse(raw) as AuthSession
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

function makeToken(username: string) {
  const payload = btoa(`${username}:${Date.now()}`)
  return `zzmed.${payload}.demo`
}

export const useAuthStore = defineStore('auth', () => {
  const session = ref<AuthSession | null>(loadSession())

  const isAuthenticated = computed(() => !!session.value)
  const user = computed(() => session.value?.user ?? null)
  const role = computed<UserRole | null>(() => session.value?.user.role ?? null)
  const roleLabel = computed(() =>
    session.value ? ROLE_LABELS[session.value.user.role] : '',
  )

  function login(username: string, password: string): { ok: boolean; message: string } {
    const account = DEMO_ACCOUNTS[username]
    if (!account || account.password !== password) {
      return { ok: false, message: '用户名或密码错误' }
    }
    const profile: UserProfile = {
      id: Object.keys(DEMO_ACCOUNTS).indexOf(username) + 1,
      username,
      role: account.role,
      displayName: account.displayName,
      email: account.email,
      department: account.department,
    }
    const next: AuthSession = {
      token: makeToken(username),
      user: profile,
      expiresAt: Date.now() + 8 * 60 * 60 * 1000,
    }
    session.value = next
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    return { ok: true, message: '登录成功' }
  }

  function logout() {
    session.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  function can(permission: string) {
    if (!session.value) return false
    return hasPermission(session.value.user.role, permission)
  }

  return {
    session,
    isAuthenticated,
    user,
    role,
    roleLabel,
    login,
    logout,
    can,
  }
})
