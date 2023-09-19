import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Панель',
        meta: { title: 'Панель', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Профиль',
        meta: { title: 'Профиль', icon: 'user', noCache: true }
      }
    ]
  },



]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  {
    path: '/server',
    component: Layout,
    redirect: '/server/list',
    name: 'Управление серверами',
    meta: {
      title: 'Управление серверами',
      icon: 'servers',
      roles: ['admin']
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/server/create'),
        name: 'Добавить',
        meta: { title: 'Добавить сервер', icon: 'edit',roles: ['admin'] }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/server/edit'),
        name: 'Список серверов',
        meta: { title: 'Список серверов', noCache: true, activeMenu: '/server/list' ,roles: ['admin'] },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/server/list'),
        name: 'Список',
        meta: { title: 'Список серверов', icon: 'list' }
      }
    ]
  },

  {
    path: '/adminUser',
    component: Layout,
    redirect: '/adminUser/list',
    name: 'Пользователи',
    meta: {
      title: 'Управление пользователями',
      icon: 'peoples',
      roles: ['admin']
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/adminUser/create'),
        name: 'Создать пользователя',
        meta: { title: 'Создать пользователя', icon: 'edit' }
      },
      {
        path: 'list',
        component: () => import('@/views/adminUser/list'),
        name: 'Cписок пользователей',
        meta: { title: 'Cписок пользователей', icon: 'list' }
      }
    ]
  },

  {
    path: '/account',
    component: Layout,
    name:'account',
    meta:{icon: 'tab', title:"Статистика v2ray"},
    children: [
      {
        path: 'userAccount',
        component: () => import('@/views/account/userAccount'),
        name: 'User Account',
        meta: { title: 'Пользователи v2ray',  icon: "peoples", roles: ['admin'] },
      },
      {
        path: 'VipAccount',
        component: () => import('@/views/account/VipAccount'),
        name: 'Статистика',
        meta: { title: 'Доступы и статистика', icon: "qr", roles: ['vip'] }

      }
    ]
  },

  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/list',
    name: 'Уведомления пользователей',
    meta: {
      title: 'Уведомления пользователей',
      icon: 'message',
      roles: ['admin']
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/notice/create'),
        name: 'Создать уведомление',
        meta: { title: 'Создать уведомление', icon: 'edit',roles: ['admin'] }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/notice/edit'),
        name: 'Редактировать уведомление',
        meta: { title: 'Редактировать уведомление', noCache: true, activeMenu: '/notice/list' ,roles: ['admin'] },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/notice/list'),
        name: 'Список уведомлений',
        meta: { title: 'Список уведомлений', icon: 'list' }
      }
    ]
  }
  ,
  {
    path: '/inviteCode',
    component: Layout,
    redirect: '/inviteCode/list',
    name: 'inviteCode',
    meta: {
      title: 'Приглашения',
      icon: 'list',
      roles: ['vip']
    },
    children: [

      {
        path: 'list',
        component: () => import('@/views/inviteCode/list'),
        name: 'Приглашения',
        meta: { title: 'Приглашения', icon: 'invite' }
      }
    ]
  }
  ,
  {
    path: '/serverConfig',
    component: Layout,
    redirect: '/serverConfig/list',
    name: 'Настройки',
    meta: {
      title: 'Настройки',
      icon: 'settings',
      roles: ['admin']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/serverConfig/list'),
        name: 'Список параметров',
        meta: { title: 'Список', icon: 'list' }
      },
      {
        path: 'create',
        component: () => import('@/views/serverConfig/create'),
        name: 'Создать параметр',
        meta: { title: 'Создать', icon: 'edit',roles: ['admin'] }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/serverConfig/edit'),
        name: 'Изменить',
        meta: { title: 'Изменить', noCache: true, activeMenu: '/serverConfig/list' ,roles: ['admin'] },
        hidden: true
      }
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
