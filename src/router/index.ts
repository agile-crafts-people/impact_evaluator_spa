import { createRouter, createWebHistory } from 'vue-router'
import { useAuth, hasStoredRole } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/testruns'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: { requiresAuth: false }
    },
    
    // Control domain: TestRun
    {
      path: '/testruns',
      name: 'TestRuns',
      component: () => import('@/pages/TestRunsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/testruns/new',
      name: 'TestRunNew',
      component: () => import('@/pages/TestRunNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/testruns/:id',
      name: 'TestRunEdit',
      component: () => import('@/pages/TestRunEditPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Control domain: TestData
    {
      path: '/testdatas',
      name: 'TestDatas',
      component: () => import('@/pages/TestDatasListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/testdatas/new',
      name: 'TestDataNew',
      component: () => import('@/pages/TestDataNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/testdatas/:id',
      name: 'TestDataEdit',
      component: () => import('@/pages/TestDataEditPage.vue'),
      meta: { requiresAuth: true }
    },
    
    
    // Create domain: Grade
    {
      path: '/grades',
      name: 'Grades',
      component: () => import('@/pages/GradesListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/grades/new',
      name: 'GradeNew',
      component: () => import('@/pages/GradeNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/grades/:id',
      name: 'GradeView',
      component: () => import('@/pages/GradeViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    
    // Consume domain: Profile
    {
      path: '/profiles',
      name: 'Profiles',
      component: () => import('@/pages/ProfilesListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profiles/:id',
      name: 'ProfileView',
      component: () => import('@/pages/ProfileViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Admin route
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/pages/AdminPage.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' }
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const { isAuthenticated } = useAuth()
  
  // Check authentication
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  // Check role-based authorization
  const requiredRole = to.meta.requiresRole as string | undefined
  if (requiredRole && !hasStoredRole(requiredRole)) {
    // Redirect to default page if user doesn't have required role
    next({ name: 'TestRuns' })
    return
  }
  
  next()
})

router.afterEach((to) => {
  document.title = to.path === '/login' ? 'Creators Dashboard Login' : 'Evaluator'
})

export default router