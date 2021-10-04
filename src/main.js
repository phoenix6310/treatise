import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
import 'normalize.css/normalize.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // progress bar style
import '@/styles/index.scss'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import './permission' // permission control

Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
