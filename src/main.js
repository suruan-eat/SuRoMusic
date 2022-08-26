/* 该文件是整个项目的入口 */
//引入vue
import Vue from 'vue'
//引入App组件，是所有组件的父组件
import App from './App.vue'

import '../src/assets/font/iconfont.css'
//引入路由
import VueRouter from 'vue-router'
import router from './router'
// 引入Store
import store from './store'
//引入ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//引入Day.js
import dayjs from 'dayjs'
Vue.prototype.$dayJs = dayjs


Vue.use(ElementUI)
Vue.use(VueRouter)
//关闭vue的生产提示
Vue.config.productionTip = false

/* new Vue({
  render: h => h(App),
}).$mount('#app') */

new Vue({
  el: '#app',
  //将App组件放入容器中
  render: h => h(App),
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this //添加全局事件总线
  }
})

