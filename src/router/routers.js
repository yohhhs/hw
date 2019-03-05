import Main from '@/views/layout/layout.vue'
// 不是main组件的子组件
export const loginRouter = {
  path: '/login',
  name: 'login',
  component: resolve => require(['@/views/login/login.vue'], resolve)
}
export const page404 = {
  path: '/*',
  name: 'err-404',
  component: resolve => require(['@/views/error-page/page404.vue'], resolve)
}
export const page403 = {
  path: '/403',
  name: 'err-403',
  component: resolve => require(['@/views/error-page/page403.vue'], resolve)
}
// 是mian组件的子组件，但不在侧边导航栏显示
export const otherRouter = {
  path: '/home',
  name: 'other-router',
  component: Main,
  children: [
    {
      path: 'home-index',
      name: 'home-index',
      meta: {
        title: '首页'
      },
      component: resolve => require(['@/views/home/home.vue'], resolve)
    }]
}
// 是mian组件的子组件，在侧边导航栏显示
export const appRouter = [
  {
    path: '/develop-setting',
    name: 'develop-setting',
    component: Main,
    children: [
      {
        path: 'permissions-setting',
        name: 'permissions-setting',
        component: resolve => require(['@/views/permissions-setting/permissions-setting.vue'], resolve)
      }
    ]
  },
  {
    path: '/system-setting',
    name: 'system-setting',
    component: Main,
    children: [
      {
        path: 'user-setting',
        name: 'user-setting',
        component: resolve => require(['@/views/user-setting/user-setting.vue'], resolve)
      },
      {
        path: 'role-setting',
        name: 'role-setting',
        component: resolve => require(['@/views/role-setting/role-setting.vue'], resolve)
      }
    ]
  },
  {
    path: '/mall-manager',
    name: 'mall-manager',
    component: Main,
    children: [
      {
        path: 'base-goods',
        name: 'base-goods',
        component: resolve => require(['@/views/mall-manager/base-goods.vue'], resolve)
      },
      {
        path: 'collect-goods',
        name: 'collect-goods',
        component: resolve => require(['@/views/mall-manager/collect-goods.vue'], resolve)
      },
      {
        path: 'goods-brand',
        name: 'goods-brand',
        component: resolve => require(['@/views/mall-manager/goods-brand.vue'], resolve)
      },
      {
        path: 'goods-type',
        name: 'goods-type',
        component: resolve => require(['@/views/mall-manager/goods-type.vue'], resolve)
      },
      {
        path: 'supplier-manager',
        name: 'supplier-manager',
        component: resolve => require(['@/views/mall-manager/supplier-manager.vue'], resolve)
      }
    ]
  },
  {
    path: '/operation-manager',
    name: 'operation-manager',
    component: Main,
    children: [
      {
        path: 'collect-count',
        name: 'collect-count',
        component: resolve => require(['@/views/operation-manager/collect-count.vue'], resolve)
      },
      {
        path: 'deal-count',
        name: 'deal-count',
        component: resolve => require(['@/views/operation-manager/deal-count.vue'], resolve)
      },
      {
        path: 'gift-count',
        name: 'gift-count',
        component: resolve => require(['@/views/operation-manager/gift-count.vue'], resolve)
      },
      {
        path: 'userdata-count',
        name: 'userdata-count',
        component: resolve => require(['@/views/operation-manager/userdata-count.vue'], resolve)
      }
    ]
  },
  {
    path: '/order-manager',
    name: 'order-manager',
    component: Main,
    children: [
      {
        path: 'all-order',
        name: 'all-order',
        component: resolve => require(['@/views/order-manager/all-order.vue'], resolve)
      },
      {
        path: 'send-order',
        name: 'send-order',
        component: resolve => require(['@/views/order-manager/send-order.vue'], resolve)
      },
      {
        path: 'wait-order',
        name: 'wait-order',
        component: resolve => require(['@/views/order-manager/wait-order.vue'], resolve)
      }
    ]
  },
  {
    path: '/finance-manager',
    name: 'finance-manager',
    component: Main,
    children: [
      {
        path: 'already-paid-report',
        name: 'already-paid-report',
        component: resolve => require(['@/views/finance-manager/already-paid-report.vue'], resolve)
      },
      {
        path: 'costs-count',
        name: 'costs-count',
        component: resolve => require(['@/views/finance-manager/costs-count.vue'], resolve)
      },
      {
        path: 'wait-paid-report',
        name: 'wait-paid-report',
        component: resolve => require(['@/views/finance-manager/wait-paid-report.vue'], resolve)
      }
    ]
  },
  {
    path: '/active-manager',
    name: 'active-manager',
    component: Main,
    children: [
      {
        path: 'active-list',
        name: 'active-list',
        component: resolve => require(['@/views/active-manager/active-list.vue'], resolve)
      },
      {
        path: 'add-active',
        name: 'add-active',
        component: resolve => require(['@/views/active-manager/add-active.vue'], resolve)
      }
    ]
  },
  {
    path: '/base-manager',
    name: 'base-manager',
    component: Main,
    children: [
      {
        path: 'inside-user',
        name: 'inside-user',
        component: resolve => require(['@/views/base-manager/inside-user.vue'], resolve)
      },
      {
        path: 'organize-manager',
        name: 'organize-manager',
        component: resolve => require(['@/views/base-manager/organize-manager.vue'], resolve)
      }
    ]
  },
  {
    path: '/user-namager',
    name: 'user-namager',
    component: Main,
    children: [
      {
        path: 'broker',
        name: 'broker',
        component: resolve => require(['@/views/user-namager/broker.vue'], resolve)
      },
      {
        path: 'organize-user',
        name: 'organize-user',
        component: resolve => require(['@/views/user-namager/organize-user.vue'], resolve)
      }
    ]
  }
]
/*
 [{
 route: 'develop-setting',
 children: [
 {
 route: 'permissions-setting',
 },
 {
 route: 'school-permissions-setting',
 }
 ]
 }]
 [{
 route: 'develop-setting',
 name: '开发设置'
 },{
 route: 'permissions-setting',
 name: '权限设置'
 },{
 route: 'school-permissions-setting',
 name: '学校权限设置'
 }]
 */
