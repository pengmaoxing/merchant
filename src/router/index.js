import Vue from 'vue'
import Router from 'vue-router'

import layout from '@/modules/layout/layout'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: '登录',
      // webpack动态import语法
      component: () => import('@/modules/login')
    },
    {
      path: '/fogot',
      name: '找回密码',
      // webpack动态import语法
      component: () => import('@/modules/fogot')
    },
    {
      path: '/',
      component: layout,
      redirect: '/index',
      children: [
        {
          name: '首页',
          path: 'index',
          component: () => import('@/modules/index/index')
        }
      ]
    },
    {
      path: '/pointGoods',
      component: layout,
      redirect: '/member/views/pointGoodsAdd',
      children: [
        {
          name: '新增积分活动',
          path: 'pointGoodsAdd',
          component: () => import('@/modules/member/views/pointGoodsAdd')
        }
      ]

    },
    {
      path: '/couponMarketing',
      component: layout,
      redirect: '/member/views/createCoupon',
      children: [
        {
          name: '创建新卡券',
          path: 'createCoupon',
          component: () => import('@/modules/member/views/createCoupon')
        }
      ]

    },
    {
      path: '/couponMarketing',
      component: layout,
      redirect: '/member/views/couponDetail',
      children: [
        {
          name: '卡券详情',
          path: 'couponDetail',
          component: () => import('@/modules/member/views/couponDetail')
        }
      ]

    },
    {
      path: '/restaurant/views',
      component: layout,
      redirect: '/restaurant/views/tableType',
      children: [
        {
          name: '餐桌类型',
          path: 'tableType',
          component: () => import('@/modules/restaurant/views/tableType')
        },
        {
          name: '餐桌位置',
          path: 'tableRoom',
          component: () => import('@/modules/restaurant/views/tableRoom')
        }
      ]
    },
    {path: '/404', name: '404', component: () => import('@/modules/404')}
  ]
})
