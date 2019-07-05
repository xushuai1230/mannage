import Vue from 'vue'
import ElementUI from 'element-ui'
Vue.use(ElementUI)
export default {
    email(val) {
        var reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
        if (!reg.test(val)) {
            return false;
          }else {
            return true;
          }
    }
}