<template>
  <div class="login">
    <div class="loginCont">
      <p class="loginTitle">登录</p>
      <p class="tips" v-show="tipsShow">{{errortips}}</p>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item  prop="user">
            <el-input placeholder="用户名" prefix-icon="iconfont people_fill APS-icon-people_fill" size="small" v-model="form.user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input type="password" placeholder="密码" prefix-icon="iconfont lock_fill APS-icon-lock_fill" size="small" v-model="form.password" @keyup.native.enter="EnterLogin($event,'form')"></el-input>
        </el-form-item>
        <el-form-item class="code" prop="code">
            <el-input placeholder="验证码" prefix-icon="iconfont APS-icon-ziyuan" size="small" v-model="form.code" @keyup.native.enter="EnterLogin($event,'form')"></el-input>
            <img width="98" height="34" class="codeImg" id="img">
            <span class="changeImg" @click="changeImg">换一张</span>
        </el-form-item>
        <el-form-item>
            <el-checkbox-group v-model="form.automaticLogon">
              <el-checkbox label="自动登录" name="type"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit('form')" class="loginBtn" v-loading="loading" 
            element-loading-spinner="el-icon-loading">登录</el-button>
        </el-form-item>
       <!--  <router-link :to="{name:'ManagePlatformRegister'}"><div class="registerBtn">没有账号？立即注册</div></router-link> -->
      </el-form>
    </div>
  </div>
</template>
<script>
  import qs from 'qs';
  import '../../assets/public/sass/login.scss'
  export default {
    data() {
       //手机号
      var checkTel = (rule, value, callback) => {
        // if (!(/^1\d{10}$/.test(value))) {
        //   callback(new Error('手机号码格式有误，请输入正确的手机号!'));
        //   return false
        // }
      };
      //密码
      var checkPassword = (rule, value, callback) => {
        // if (!(/^(?![a-zA-z]+$)(?!\d+$)(?![~!@#$%^&*()_\+\-\=\[\]\{\}\\|`;:"'<>,.?\/]+$)[a-zA-Z\d~!@#$%^&*()_\+\-\=\[\]\{\}\\|`;:"'<>,.?\/]{6,20}$/.test(value))) {
        //   callback(new Error('必须由6-20位字母，数字和符号两种以上组合'));
        //   return false
        // }
        // callback()
      }
      //验证码
      var code = (rule, value, callback) => {
        var code=this.imgCode
        if (value.toUpperCase() !== code.toUpperCase()) {
              callback(new Error('验证码不正确'));
            } else {
              callback()
            }
      };
      return {
        form: {
          user:'',//手机号
          password:'',//密码
          code:'',//验证码
          automaticLogon:'',//自动登录
        },
        rules: {
          user: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
            { validator: code, trigger: 'blur'}
          ]
        },
        tipsShow:false,
        errortips:'',
        imgCode:'',
        loading:false,
      }
    },
    created(){
      this.changeImg()
    },
    methods: {
      onSubmit(formName) {       
        this.login(formName);
      },
      //回车登录
      EnterLogin(ev,formName){  
        if(ev.keyCode == 13){        
         this.login(formName);   
        }  
      },
      login(formName){
         this.$refs[formName].validate((valid) => {
         if (valid) {
                this.loading = true
                var data={
                  "Uname":this.form.user,
                  "Upwd":this.form.password,
                  "Code":this.form.code,
                  "TrmlType":"TenantClient"
                }
                var reqInfoData=JSON.stringify(data);
                this.$http.post(Yukon.Url.Bus,qs.stringify({
                  "name":Yukon.ServiceName.Tenant,
                  "operation":"Login",
                  "reqInfo":reqInfoData,
                }),{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  }
                }).then((response)=>{
                  var result = response.data;
                  if(result.code == 0){
                    var data = result.data;
                    this.loading = false;
                    if (result.code == -1) {
                      this.tipsShow = true;
                      this.errortips = result.msg;
                      this.changeImg();
                    }else{
                      this.tipsShow = false;
                      this.$store.dispatch("token",data.token);       // 用户信息存入vuex
                      this.$router.push({name: Yukon.Route.Index})
                    }
                  }
                })
                .catch(function(error) {
                  
                })
              } else {
                console.log('error submit!!');
                return false;
              }
              });
      },
      //获取验证码
      getImgCode(){
            var data = {
              "Name":"Login",
              "DefaultVal":"GetVerification"
            }
            var dataChange = JSON.stringify(data);
            this.$http.post(Yukon.Url.Bus,qs.stringify({
              "name":Yukon.ServiceName.Tenant,
              "operation":"GetJsonDataAnonymous",
              "reqInfo":dataChange,
            }),{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then((response)=>{
              var result = response.data
              this.imgCode = result.code;
              return 'data:image/png;base64,'+ result.imgByte;
            })
            .then(data => {
              $('#img').attr('src', data);
            })
            .catch(function(error) {
               console.log('error submit!!');
            })
      },
      //点击切换图片验证码
      changeImg(){
        this.getImgCode();
      }
    }
  }
</script>




