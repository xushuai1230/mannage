import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import list from './modules/list'
import getters from './getters'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: { user,list },
  getters,
  plugins: [createPersistedState({
    key:'admin',
    storage: window.sessionStorage,
    reducer(val) {
      return {
        // 只储存state中的某个值
        user: val.user,
      }
    }
  })]
})

export default store
