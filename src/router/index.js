import Vue from "vue";
import Router from "vue-router";
import Layout from "@/layout";
Vue.use(Router);
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "主页",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "主页", icon: "el-icon-tickets" }
      }
    ]
  },
  {
    path: "/goods",
    component: Layout,
    redirect: "/goods/goodslist",
    meta: {
      title: "商品管理",
      icon: "el-icon-goods"
    },
    children: [
      {
        path: "goodslist",
        name: "VR商品管理",
        component: () => import("@/views/goods/index"),
        meta: { title: "VR商品管理", icon: "" }
      },
      {
        path: "giving",
        name: "VR赠品管理",
        component: () => import("@/views/goods/giving"),
        meta: { title: "VR赠品管理", icon: "" }
      },
      {
        path: "goodslist2",
        name: "HB商品管理",
        component: () => import("@/views/goods2/index"),
        meta: { title: "HB商品管理", icon: "" }
      },
      {
        path: "giving2",
        name: "HB赠品管理",
        component: () => import("@/views/goods2/giving"),
        meta: { title: "HB赠品管理", icon: "" }
      }
    ]
  },
  {
    path: "/order",
    component: Layout,
    redirect: "/order/orderlist",
    meta: {
      title: "订单管理",
      icon: "el-icon-star-on"
    },
    children: [
      {
        path: "orderlist",
        name: "VR订单管理",
        component: () => import("@/views/order/index"),
        meta: { title: "VR订单管理", icon: "" }
      },
      {
        path: "repeatOrder",
        name: "VR重复订单管理",
        component: () => import("@/views/repeatOrder/index"),
        meta: { title: "VR重复订单管理", icon: "" }
      },
      {
        path: "orderlist2",
        name: "HB订单管理",
        component: () => import("@/views/order2/index"),
        meta: { title: "HB订单管理", icon: "" }
      },
      {
        path: "repeatOrder2",
        name: "HB重复订单管理",
        component: () => import("@/views/repeatOrder2/index"),
        meta: { title: "HB重复订单管理", icon: "" }
      }
    ]
  },
  {
    path: "/customer",
    component: Layout,
    redirect: "/customer/customerList",
    meta: {
      title: "顾客管理",
      icon: "el-icon-goods"
    },
    children: [
      {
        path: "customerList",
        name: "VR顾客管理",
        component: () => import("@/views/customer/index"),
        meta: { title: "VR顾客管理", icon: "el-icon-goods" }
      },
      {
        path: "customerList2",
        name: "HB顾客管理",
        component: () => import("@/views/customer2/index"),
        meta: { title: "HB顾客管理", icon: "el-icon-goods" }
      }
    ]
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
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
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
