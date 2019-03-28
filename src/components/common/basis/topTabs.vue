<template>
  <div class="topTabs">
     <el-tabs
      v-model="tabsValue" 
      @tab-click="changeTab"
      @tab-remove="closeTab"
      closable>
  	  <el-tab-pane 
          v-for="(v,k) in tabItems"
          :key="v.name"
          :label="v.label" 
          :name="v.name"
          :url="v.url"
          :value='v.Id'>
          <span slot="label"  v-if="v.name=='home'">
             <i class="iconfont APS-icon-zhuye"></i> 
          </span>
  	  </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import bus from '../../../assets/public/js/eventBus' 
export default {
	data() {
      return {
        tabsValue :  '2',    
        currentTab:  '',//当前页
        refresh   :  '',//刷新
        tabItems  :  [],//tabs数据列表
        targetName:  '',
        Id        :  '',//维护页面Id
        url       :  '',//自定义跳转页面地址
      }
    },
    mounted(){
       this.asideMenuCurrent();
       this.receviesHomePage();
       this.colsePage();
    },
    methods: {
     //接收asideMenu选中的值
      asideMenuCurrent(){
        bus.$on('receivesCreateTabValue',(key,label,hasChild,url,Id)=>{
           this.createTab(key,label,hasChild,url,Id);
        })
      },
    //接受首页信息
     receviesHomePage(){
        bus.$on('homePage',(key,label,hasChild,url)=>{
           this.createTab(key,label,hasChild,url);
         })
     },
   //关闭页面
      colsePage(){
        bus.$on('colseTabs',(message)=>{ 
           this.closeTab(message);   
         })
      },
    //添加标签页 
      createTab(key,label,hasChild,url,Id) {
          this.targetName=key;
          this.Id=Id;
          this.url=url;
          if (hasChild) return false;
          if(this.tabItems!=null){
            let isExist = false;//判断是否存在
            this.tabItems.forEach((item, index) => {
              if(item.name == key){
                isExist = true;
              }
            })
            if(isExist) {
              this.refresh = false;
               for(var i in this.tabItems){
                 if (key==this.tabItems[i].name) {
                     this.tabItems[i].url=url;
                     this.tabItems[i].Id=Id;
                 }
              }
            }else{
              let obj = {
                name:key,
                label:label,
                url:url, 
                Id:Id,   
              };
              this.tabItems.push(obj); 
              this.refresh = true;
            }
            this.tabsValue = key;
          }
          console.log(this.tabItems)
          this.currentTab = key;//显示组件
          bus.$emit('currentTab',this.currentTab,this.Id,this.url);
      },
      // 切换标签页
      changeTab(tab,editId) {
          this.currentTab = tab.name;
          this.refresh=false;
          this.url=tab.$attrs.url; 
          this.Id=tab.$attrs.value;
          bus.$emit('currentTab',this.currentTab,this.Id,this.url);   
      },

      // 关闭标签页
      closeTab(targetName) {
        let tabs = this.tabItems;
        let activeName = '';
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            //删除选中前一个或是后一个
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
              this.url = nextTab.url; //给url重新赋值
            }
          }
        });
        this.tabsValue = activeName;
        this.currentTab = activeName;
        this.tabItems = tabs.filter(tab => tab.name !== targetName);//这里是删除选中的tab的key
        bus.$emit('currentTab',this.currentTab,this.Id,this.url);
      },
    }
}
</script>


