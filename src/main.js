import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import message from '@/utils/resetMessage.js'
import 'normalize.css/normalize.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // progress bar style

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '@/style/index.scss'
Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.prototype.$message = message;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')