import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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

export default router
