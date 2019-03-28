<template>
  <div class="lock">
    <div class="animated">
      <h3 class="text-white">重新登录</h3>
      <div class="lockContent" @keydown.13='login()'>
           <el-input type="password" v-model="password" placeholder="请输入登录密码"></el-input>
            <el-row>
              <el-button type="primary" class="iconfont APS-icon-unlock" @click="login"></el-button>
            </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import qs from 'qs'
import { mapGetters } from 'vuex';
import "../../assets/public/sass/lock.scss"
export default {
  data() {
    return {
      password: "",
      username:''
    };
  },
  computed: {
    ...mapGetters(['currentHref','loginName'])  
  },
  methods: {
    login() {
      this.username = this.loginName;
      if(this.currentHref!=null && this.currentHref!=''){
        var reqInfo = JSON.stringify({
          Uname: this.username,
          Upwd: this.password,
          TrmlType:"Web",
        });
        this.$http.post(Yukon.Url.Bus,qs.stringify({
          "name":Yukon.ServiceName.Tenant,
          "operation":"Login", 
          "reqInfo": reqInfo
        }),{
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then(response => {
          var result = response.body;
          if(result!=null && result.code == 0){
            this.$store.dispatch("token", result.data.token);
            var url = this.$common.replaceUrlParam(this.currentHref,'token',result.data.token);
            window.location.href = url;
          }else{
            this.$message({
              type: 'error',
              message: '密码有误!'
            });
          }
        }).catch(error => {
          console.log(error);
        });
      }
    }
  }
};
</script>