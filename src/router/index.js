import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const index = resolve => require(['../components/home/index.vue'],resolve)
const login = resolve => require(['../components/login/login.vue'], resolve)
const lock  = resolve => require(['../components/lock/lock.vue'], resolve)
export default new Router({
  /*mode:"history",*/
  routes: [
    {
      path: '/',                               // 默认页面
      redirect :'/login.html'
    },
    {
      path : '/login.html',  
      name : 'login',
      component :  login   
    },
    {
      path : '/index.html',
      name : 'index',
      component :  index
    },
    {
      path : '/lock.html',
      name : 'lock',
      component :  lock
    }
  ]
})

