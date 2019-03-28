<template>
  <div class="topMenu">
  	<div class="topMenuLeft">
     <i :class="asideMenuIcon" @click="handleAsideMenuStatus" style="font-size: 22px;"></i>
     <i class="iconfont APS-icon-goback" @click="handleGoback" style="font-size: 22px;"></i>
    </div>
    <div class="topMenuRight" > 
      <el-menu mode="horizontal">
        <el-menu-item index="2" @click="selectNews">
        	<el-badge :value="value">
            <i class="iconfont APS-icon-xiaoxi"></i>
          </el-badge>
        </el-menu-item>
        <el-submenu index="3">
          <template slot="title">
            <i class="iconfont APS-icon-yonghu"></i>
          </template>
          <el-menu-item index="3-1" @click="Out">切换用户</el-menu-item>
          <el-menu-item index="3-2" @click="Out">退出</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="iconfont APS-icon-yuyan-shi"></i>
          </template>
          <el-menu-item index="4-1" class="selectedColor">中文</el-menu-item>
          <el-menu-item index="4-2" class="defaultColor" @click="selectSubmenu('英文')">英文</el-menu-item>
          <el-menu-item index="4-3" class="defaultColor" @click="selectSubmenu('日语')">日语</el-menu-item>
          <el-menu-item index="4-4" class="defaultColor" @click="selectSubmenu('法语')">法语</el-menu-item>
          <el-menu-item index="4-5" class="defaultColor" @click="selectSubmenu('韩语')">韩语</el-menu-item>
          <el-menu-item index="4-6" class="defaultColor" @click="selectSubmenu('德语')">德语</el-menu-item>
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
      selectSubmenu(val){ 
        this.$alert('您还未购买'+val+'版本服务', '提示', {
          confirmButtonText: '确定',
            callback: action => { 
          }
        });
      },
      selectNews(){
        this.$alert('未提供此服务', '提示', {
          confirmButtonText: '确定',
            callback: action => { 
          }
        });
      },
      Out(){
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
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handleAsideMenuStatus(){
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
      //跳转页面
      StepNavigation(val){
        var label=val.label
        var data={"key":val.url,"label":val.label,"url":val.url};
        bus.$emit('receivesCreateTabValue', data.key,data.label,'',data.url);//页面跳转需要引入commonvue
      },
    }
  }
</script>

