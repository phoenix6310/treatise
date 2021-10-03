import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login',
}, {
  path: '/login',
  name: 'Login',
  component: () => import( /* webpackChunkName: "login" */ '@/views/login/')
}, {
  path: '/index',
  name: 'Index',
  component: () => import( /* webpackChunkName: "index" */ '@/views/index/index.vue')
}]

const router = new VueRouter({
  routes
})

export default router