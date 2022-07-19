// 导入vue库
import Vue from 'vue'
// 导入路由库
import VueRouter from 'vue-router'
// 引入登录组件
import LoginView from '../views/LoginView.vue'
// 引入注册组件
import RegisterView from '../views/RegisterView.vue'
// 引入重置密码组件
import ResetPasswordView from '../views/ResetPasswordView.vue'
// 挂载路由
Vue.use(VueRouter)
// 配置路由导航
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/resetpwd',
    name: 'resetpwd',
    component: ResetPasswordView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]
// new一个路由实例
const router = new VueRouter({
  routes
})
// 导出路由
export default router
