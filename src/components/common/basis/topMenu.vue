<template>
  <div class="topMenu">
  	<div class="topMenuLeft">
      <i :class="asideMenuIcon" @click="handleMenuStatus" style="font-size: 22px;"></i>
      <i class="iconfont APS-icon-goback" @click="handleGoback" style="font-size: 22px;"></i>
    </div>
    <div class="topMenuRight" > 
      <el-menu mode="horizontal">
        <el-menu-item index="2" @click="handleMessage">
        	<el-badge :value="value">
            <i class="iconfont APS-icon-xiaoxi"></i>
          </el-badge>
        </el-menu-item>
      <!--   <el-submenu index="3">
          <template slot="title">
            <i class="iconfont APS-icon-yonghu"></i>
          </template>
          <el-menu-item index="3-1" @click="handleOut">切换用户</el-menu-item>
          <el-menu-item index="3-2" @click="handleOut">退出</el-menu-item>
        </el-submenu> -->
        <el-submenu index="4">
          <template slot="title">
            <i class="iconfont APS-icon-yuyan-shi"></i>
          </template>
          <el-menu-item index="4-1" class="selectedColor">中文</el-menu-item>
          <el-menu-item index="4-2" class="defaultColor" @click="handleLanguage('英文')">英文</el-menu-item>
          <el-menu-item index="4-3" class="defaultColor" @click="handleLanguage('日语')">日语</el-menu-item>
          <el-menu-item index="4-4" class="defaultColor" @click="handleLanguage('法语')">法语</el-menu-item>
          <el-menu-item index="4-5" class="defaultColor" @click="handleLanguage('韩语')">韩语</el-menu-item>
          <el-menu-item index="4-6" class="defaultColor" @click="handleLanguage('德语')">德语</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import qs from 'qs'
  import bus from '../../../assets/public/js/eventBus'  
  import $ from 'jquery'
  import signalR from '../../../assets/public/js/jquery.signalR-2.4.0.min'
  export default {
    data() {
      return {
        isCollapse: false, 
        asideMenuIcon:'iconfont APS-icon-shouqicaidan', 
        value: "",
      };
    },
    computed:{
      ...mapGetters(['token']),
    }, 
    mounted() {
      var $this = this;
      // $this.connectServer();
    },
    methods: { 
        //websocket消息推送
       /* connectServer() {
          var $this = this;
          var conn = $.hubConnection(Yukon.Url.Signalr, { qs: "token=" + this.token })
          $this.proxy = conn.createHubProxy("TenantHub");
          $this.getMsg();
          conn.start().done((data) => {
              $this.sendMsg();
          }).fail((data) => {
          });
        },
        sendMsg() {
          var $this = this;
          $this.proxy.invoke("subscribeMsg").done((msg) => {
          });
        },
        getMsg() {
          var $this = this;
          // 未读消息
          $this.proxy.on("unreadMsg", (data) => {
            $this.value = data;
          })
          // 广播消息
          $this.proxy.on("broadcastMsg", (data) => {
            alter(data);
          });
        },*/
      //退出
/*      handleOut(){
        this.$http.post(Yukon.Url.Bus,qs.stringify({
            "name":Yukon.ServiceName.Tenant,
            "operation":"Logout",
            "token":this.token,
        }),{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response)=>{
          var result = response.data;
          if(result.code == 0){
            this.$store.dispatch("token","");
            this.$router.push({name: Yukon.Route.Login})
          }
        }).catch((error)=>{
          console.log(error)
        })  
      },*/
      //消息
      handleMessage(){
        this.$alert('未提供此服务', '提示', {
          confirmButtonText: '确定',
            callback: action => { 
          }
        });
      },
      //语言切换
      handleLanguage(val){ 
        this.$alert('您还未购买'+val+'版本服务', '提示', {
          confirmButtonText: '确定',
            callback: action => { 
          }
        });
      },
      // 左侧菜单栏的展开收缩
      handleMenuStatus(){
        if (this.isCollapse) {
          this.isCollapse=false;
          this.asideMenuIcon="iconfont APS-icon-shouqicaidan";
        }else{
          this.isCollapse=true;
          this.asideMenuIcon="iconfont APS-icon-zhankaicaidan"
        }
        bus.$emit('asideMenuState',this.isCollapse)
      },
      //返回到官网
      handleGoback(){
        window.location.href = Yukon.Url.Home;
      },
    }
  }
</script>

