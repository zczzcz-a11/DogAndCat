import { createRouter, createWebHistory } from 'vue-router'

// 路由表配置
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    meta: {
      type: 'page',
      keepAlive: false
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home'),
    meta: {
      type: 'view',
      keepAlive: true
    }
  },
  {
    path: '/fond',
    name: 'fond',
    component: () => import('@/views/fond'),
    meta: {
      type: 'view',
      keepAlive: false
    }
  },
  {
    path: '/comment',
    name: 'comment',
    component: () => import('@/views/comment'),
    meta: {
      type: 'view',
      keepAlive: false
    }
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/user'),
    meta: {
      type: 'view',
      keepAlive: false
    }
  },
  {
    path: '/add',
    name: 'add',
    component: () => import('@/pages/addPet'),
    meta: {
      type: 'page',
      keepAlive: false
    }
  },
  {
    path: '/mypet',
    name: 'mypet',
    component: () => import('@/pages/myPet'),
    meta: {
      type: 'page',
      keepAlive: false
    }
  },
  {
    path: '/updatauser',
    name: 'updatauser',
    component: () => import('@/pages/updataUser'),
    meta: {
      type: 'page',
      keepAlive: false
    }
  },
  {
    path: '/userSpace',
    name: 'userSpace',
    component: () => import('@/pages/userSpace'),
    meta: {
      type: 'userSpace',
      keepAlive: false
    }
  },
  {
    path: '/petSpace',
    name: 'petSpace',
    component: () => import('@/pages/petSpace'),
    meta: {
      type: 'petSpace',
      keepAlive: false
    }
  },
  {
    path: '/chatPage',
    name: 'chatPage',
    component: () => import('@/pages/chatPage'),
    meta: {
      type: 'page',
      keepAlive: false
    }
  }
]

// 全局路由守卫
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL), // 切换到 history模式，接受一个base字符串可选参数，该参数提供了一个基础路径。
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  if (!localStorage.getItem('token') && to.name !== 'login') {
    return next({
      name: 'login'
    })
  }
  next()
})

export default router
