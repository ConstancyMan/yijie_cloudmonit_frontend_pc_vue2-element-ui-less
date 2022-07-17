// 导入vue库
import Vue from 'vue'
// 导入App组件
import App from './App.vue'
// 导入路由配置：
import router from './router'
// 导入vuex状态管理
import store from './store'
// 导入自己写的全局样式：
import './assets/css/global.less'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入axios:
import axios from 'axios'
// 配置请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 挂载element-ui
Vue.use(ElementUI)
// 挂载axios,axios不能使用use,只能挂载到原型上
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
