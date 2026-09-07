import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '',
  timeout: 15000,
})

http.interceptors.request.use((config) => {
  const raw = localStorage.getItem('zzmed_session')
  if (raw) {
    try {
      const session = JSON.parse(raw) as { token?: string }
      if (session.token) {
        config.headers.Authorization = `Bearer ${session.token}`
      }
    } catch {
      /* ignore */
    }
  }
  return config
})

http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('zzmed_session')
      if (!location.pathname.startsWith('/login')) {
        location.href = `/login?redirect=${encodeURIComponent(location.pathname)}`
      }
    }
    return Promise.reject(error)
  },
)

export default http
