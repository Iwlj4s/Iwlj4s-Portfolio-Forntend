import axios from 'axios'
import router from './router'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
})

// Интерцептор ответов
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const route = router.currentRoute.value
      if (route.meta.requiresAuth) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        router.push({ name: 'Login' })
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
