import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/layout';
Vue.use(Router)
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: '主页',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '主页', icon: 'el-icon-tickets' }
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    redirect: '/goods/goodslist',
    meta: {
      title: '商品管理',
      icon: 'el-icon-goods'
    },
    children: [
      {
        path: 'goodslist',
        name: '商品管理',
        component: () => import('@/views/goods/index'),
        meta: { title: '商品管理', icon: '' }
      },
      {
        path: 'giving',
        name: '赠品管理',
        component: () => import('@/views/goods/giving'),
        meta: { title: '赠品管理', icon: '' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/orderlist',
    meta: {
      title: '订单管理',
      icon: 'el-icon-star-on'
    },
    children: [
      {
        path: 'orderlist',
        name: '订单管理',
        component: () => import('@/views/order/index'),
        meta: { title: '订单管理', icon: '' }
      },
      {
        path: 'repeatOrder',
        name: '重复订单管理',
        component: () => import('@/views/repeatOrder/index'),
        meta: { title: '重复订单管理', icon: '' }
      }
    ]
  },
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/customerList',
    meta: {
      title: '顾客管理',
      icon: 'el-icon-goods'
    },
    children: [
      {
        path: 'customerList',
        name: '顾客管理',
        component: () => import('@/views/customer/index'),
        meta: { title: '顾客管理', icon: '' }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: '商品管理',
  //     icon: 'el-icon-star-on'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1', icon: '' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1', icon: '' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2', icon: '' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () =>
  //                 import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1', icon: '' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () =>
  //                 import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2', icon: '' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3', icon: '' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2', icon: '' }
  //     }
  //   ]
  // }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
