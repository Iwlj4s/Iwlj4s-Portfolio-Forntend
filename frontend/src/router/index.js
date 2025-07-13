import { createRouter, createWebHistory } from 'vue-router'
import Callback from '@/views/Callback.vue'
import Login from '@/views/Login.vue'
import Profile from '@/views/Profile.vue'
import PublicProfile from '@/views/PublicProfile.vue'



const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { forGuests: true }
  },
  {
    path: '/admin/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/public/profile',
    name: 'PublicProfile',
    component: PublicProfile,
    meta: { requiresAuth: false }
  },
  {
    path: '/auth/callback',
    component: () => import('@/views/Callback.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  const token = localStorage.getItem('access_token')
  
  // Если route требует авторизации, а токена нет
  if (to.meta.requiresAuth && !token) {
    return '/'
  }
  
  // Если route только для гостей, а пользователь авторизован
  if (to.meta.forGuests && token) {
    return '/admin/profile' // Перенаправляем в админку
  }
})

export default router