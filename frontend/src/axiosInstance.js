import axios from 'axios'
import router from './router'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
})

// Автоматически добавляем токен к запросам
axiosInstance.interceptors.request.use(config => {
  if (!config.url.startsWith('/public')) {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Обработка 401 ошибки
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      if (router.currentRoute.value.meta?.requiresAuth) {
        window.location.href = '/' // Полный редирект для очистки состояния
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance