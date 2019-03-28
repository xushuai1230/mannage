import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import store from './vuex/store.js'
import axios from "axios"
import 'babel-polyfill'
/* CSS */
import 'element-ui/lib/theme-chalk/index.css'
import './assets/public/iconfont/iconfont.css'      // 阿里图标库样式
import './assets/public/sass/main.scss'             // 公共的样式
/* JS */
import './assets/public/js/chart.min.js'            // Chart.js
import './assets/public/js/chartColors.js'          // ChartColors.js
import './assets/public/js/directives.js'           // 弹框拖拽JS
import common from './assets/public/js/common.js'   // 通用js
import echarts from '../static/echarts.min.js'      // echarts.js
import '../static/WebConfig.js'                     // 配置文件
import qs from "qs";

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueResource)
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;
Vue.prototype.$common = common;

router.beforeEach(({meta, path}, from, next) => {
  var urlTemp = window.location.href;
  var token = common.getUrlParam("token",urlTemp) // 获取token
  var mid = common.getUrlParam("mid",urlTemp)     // 获取模块id
  var { auth = true } = meta
  if(path === '/index.html'){
    store.dispatch("currentHref", urlTemp);
    if(token!="") {
      store.dispatch("token",token);
      store.dispatch("mid",mid);
    }
  }
  var loginName = store.state.user.loginName;
  if(loginName == null || loginName == ''){
    token = store.state.user.token;
    if(token!=''){
      var reqInfo = JSON.stringify({
        Name: "Authorization",
        DefaultVal: "GetUserByToken"
      });
      axios.post(Yukon.Url.Bus,qs.stringify({
        "name":Yukon.ServiceName.Tenant,
        "operation":"GetJsonData",
        "token": token,
        "reqInfo": reqInfo
      }),{
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then((response) => {
        var loginName = '';
        var result = response.data;
        if(result.code == 0){
          store.dispatch("loginName", result.data.LoginName);
        }
      });
    }
  }
  next()
})

// token是否失效，锁屏
Vue.http.interceptors.push(function (request, next) {
  next(function (response) {
    var result = response.body;
    if (result.code == -2) {
      this.$store.dispatch("token", "");
      this.$router.push({name: Yukon.Route.Lock})
    }
    return response
  })
})

let startApp = function () {
  axios.get(Yukon.Url.Config).then((res) => {
    Yukon.Url.Signalr = res.data.Signalr;
    Yukon.Url.Bus = res.data.Bus;
    Yukon.Url.Tenant_Import = res.data.ApsPost + "Api/Manage/Import",
    Yukon.Url.Tenant_Export = res.data.ApsPost + "Api/Manage/Export",  
    Yukon.Url.Home = res.data.Home,
    new Vue({
      el: '#app',
      router,
       store,
      components: { App },
      template: '<App/>'
    })
  })
}
startApp()
