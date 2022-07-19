// 全局状态管理：
import Vue from 'vue'
import Vuex from 'vuex'
// 挂载Vuex
Vue.use(Vuex)
// 导出创建的Vuex实例
export default new Vuex.Store({
  // 状态
  state: {
    userId: 0 // 用户id
  },
  getters: {
  },
  // 修改状态：
  mutations: {
    // 修改userId:(函数第一参数为状态，第二个参数为触发时传过来的值)
    setUserId (state, userId) {
      state.userId = userId
    }
  },
  // 异步处理状态：
  actions: {
  },
  modules: {
  }
})
