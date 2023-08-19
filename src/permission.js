import router from './router'
import store from './store'

import { getMenu } from '@/modules/system/api/menu'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式

import { registerRoutes } from './utils/getViews'

// 设置全局导航守卫，观察页面加载进度
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path !== '/login') {
    // 判断是否存在token
    if (!sessionStorage.token && to.path !== '/fogot') {
      next({path: '/login'})
      NProgress.done()
    } else if (to.path === '/fogot') {
      /**
       * 20190506 多加的一个重置密码路由 xwy
       */
      next()
    } else {
      // 加载routes，通过vuex状态管理保证实时刷新路由
      if (store.getters.isReload) {
        store.dispatch('setReload')
        let routes
        getMenu().then(response => {
          routes = registerRoutes(response.obj)
          routes.push({
            path: '*',
            redirect: '/404'
          })
          router.addRoutes(routes)
          next({...to, replace: true}) // 强制导航，保证addroutes完成
        }).catch(() => {
        })
      } else {
        next()
      }
    }
  } else {
    sessionStorage.clear()
    next()
  }
})
router.afterEach(() => {
  NProgress.done()
})
