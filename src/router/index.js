import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { public: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPasswordView.vue'),
      meta: { public: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/auth/ResetPasswordView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      name: 'overview',
      component: () => import('@/views/OverviewView.vue'),
    },
    {
      path: '/admins',
      name: 'admins',
      component: () => import('@/views/AdminsView.vue'),
    },
    {
      path: '/drivers',
      name: 'drivers',
      component: () => import('@/views/DriversView.vue'),
    },
    {
      path: '/drivers/active',
      name: 'active-drivers',
      component: () => import('@/views/ActiveDriversView.vue'),
    },
    {
      path: '/drivers/active/:driverId',
      name: 'active-driver-detail',
      component: () => import('@/views/ActiveDriverDetailView.vue'),
    },
    {
      path: '/drivers/:driverId',
      name: 'driver-detail',
      component: () => import('@/views/DriverDetailView.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const { accessToken } = storeToRefs(authStore)
  const { bootAppRequest } = authStore

  await bootAppRequest()

  const isAuthenticated = !!accessToken.value
  const isPublic = !!to.meta.public

  if (!isAuthenticated && !isPublic) return { name: 'login' }
  if (isAuthenticated && isPublic) return { name: 'overview' }
})

export default router
