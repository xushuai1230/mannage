<template>
  <el-row class="tac">
    <el-col :span="24">
    <div class="logo" id="logo">{{title}}</div>
      <el-menu
        :default-active="num"
        class="el-menu-vertical-demo"
        theme="dark" 
        :unique-opened="true"
        @open="handleOpen"
        @close="handleClose"
        background-color="#20222A"
        text-color="#fff"
        :collapse="isCollapse"
        active-text-color="#ffd04b">
        <template v-for="(v,k) in compList">
          <!-- 有子元素显示 -->
          <el-submenu v-if="v.hasChild==true"  :index="v.numP" >
            <template slot="title">
              <i :class="v.icon"></i>
              <span>{{v.label}}</span>
            </template>
            <el-menu-item v-for="v2 in v.child" :index="v2.num" :key="v2.key" 
            @click="openTabs(v2.key,v2.label,v2.hasChild,v2.url)">
              <span>{{v2.label}}</span>
            </el-menu-item>
          </el-submenu>
          <!--没有子元素-->
          <el-menu-item :index="v.numP" v-else  @click="openTabs(v.key,v.label,v.hasChild,v.url)">
            <i :class="v.icon"></i>
            <span>{{v.label}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-col>
  </el-row>
</template>
<script>
import qs from "qs";
import { mapGetters } from "vuex";
import bus from "../../../assets/public/js/eventBus";
export default {
  data() {
    return {
      isCollapse  : false,    // false展开
      logoText    : true,
      compList    : {},       // 菜单数据
      title       : Yukon.Url.Title,
      num         : '',
    };
  },
  computed: {
    ...mapGetters(["token", "mid"])  
  },
  created() {
    this.getFold();
    this.getMenuData();
  },
  methods: {
    // 菜单展开折叠
    getFold() {
      bus.$on("asideMenuState", message => {
        if (message) {
          this.logoText = false;
          this.$emit("getAsideWidth", "66px");
        } else {
          this.logoText = true;
          this.$emit("getAsideWidth", "200px");
        }
        this.isCollapse = message;
      });
    },
    // 获取菜单数据
    getMenuData() {
      var filterAry = [];
      var filterObj = {
        Menu: Yukon.ServiceName.Tenant,
        MId: this.mid
      };
      filterAry.push(filterObj);
      var filter = JSON.stringify(filterAry);
      var data = {
        Name: "Authorization",
        DefaultVal: "GetMenuData",
        Filter: filter
      };
      var reqInfoData = JSON.stringify(data);
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        name: Yukon.ServiceName.Tenant,
        operation: "GetJsonData",
        token: this.token,
        reqInfo: reqInfoData
      }),{
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(response => {
        var result = response.data;
        if (result.code == 0) {
          var data = result.data;
          if(data!=null && data.A!=null){
            var page = data.A;
            if(page.hasChild){
              if(page.child!=null && page.child.length>0){
                var childF = page.child[0];
                this.num = childF.num;
              }
            }
          }
          this.compList = data;
          bus.$emit('menuData',data);
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
    //打开tabs
    openTabs(key, label, hasChild, url) {
      bus.$emit("receivesCreateTabValue", key, label, hasChild, url, "");
    },
    handleOpen(key, keyPath) {
    },
    handleClose(key, keyPath) {
    },
  }
};
</script>
