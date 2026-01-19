import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/pages/Profile.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/leave',
    name: 'LeaveList',
    component: () => import('@/pages/LeaveList.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/expense',
    name: 'ExpenseList',
    component: () => import('@/pages/ExpenseList.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/expense/new',
    name: 'ExpenseNew',
    component: () => import('@/pages/ExpenseNew.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/expense/:id',
    name: 'ExpenseEdit',
    component: () => import('@/pages/ExpenseNew.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/attendance',
    name: 'AttendanceList',
    component: () => import('@/pages/AttendanceList.vue'),
    meta: { requiresAuth: true },
  },
]

let router = createRouter({
  history: createWebHistory('/portal'),
  routes,
})

import { session } from './data/session'

router.beforeEach(async (to, from, next) => {
  if (!session.initialized) {
    await session.init()
  }

  if (to.meta.requiresAuth && !session.isLoggedIn) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && session.isLoggedIn) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
