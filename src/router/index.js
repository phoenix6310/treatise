import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../layout'


/*
 *角色  role
 *超级管理员       10001
 */
export const constantRouterMap = [{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/',
    redirect: '/competition',
    name: 'index',
    hidden: true
  }, {
    path: '/competition',
    component: Layout,
    name: 'competition',
    redirect: '/competition/create',
    hidden: true,
    meta: {
      title: '竞赛',
      roles: [10001]
    },
    children: [{
      path: '/competition/create',
      component: () => import('@/views/competition/create'),
      name: 'competition_create',
      meta: {
        title: '创建竞赛',
      }
    }, {
      path: '/competition/manage',
      component: () => import('@/views/competition/manage'),
      name: 'competition_manage',
      meta: {
        title: '竞赛管理',
      }
    }]
  }, {
    path: '/upload',
    component: Layout,
    name: 'upload',
    redirect: '/upload/video',
    hidden: true,
    children: [{
      path: '/upload/video',
      component: () => import('@/views/upload/video'),
      name: 'upload_video',
    }]
  }, {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  }, { path: '*', redirect: '/404', hidden: true }
]
