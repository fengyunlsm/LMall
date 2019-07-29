// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import Vuex from 'vuex'

Vue.use(Vuex)
Vue.use(infiniteScroll)
Vue.config.productionTip = false
Vue.use(VueLazyload, {
  loading: '/static/loading/loading-bars.svg'
})

const store = new Vuex.Store({
  // state  全局变量
  // getter 提供用来回去state 数据的方法
  // actions 提供跟后台接口打交道的方法
  // mutations  提供存储设置state 数据的方法
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: {
    // 提供存储全局变量的方法
    updateUserInfo(state, nickName) {
      console.log(nickName)
      state.nickName = nickName
    },
    updateCartCount(state, cartCount) {
      state.cartCount += cartCount
    },
    initCartCount(state, cartCount) {
      state.cartCount = cartCount
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: store,
  components: { App },
  template: '<App/>'
})
