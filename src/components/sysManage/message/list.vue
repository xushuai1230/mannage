<template>
  <div class="conmmonlist">
    <div class="actionBar">
      <el-row  class="actionBarList">
        <div class="operationBtn" v-for="btn in buttonArray" >
          <el-button size="mini" :icon="btn.icon" @click="Action(btn.btn)" >{{btn.text}}</el-button>
        </div>
      </el-row>
  </div>
    <!-- 列表 -->
    <div class="commonTable" >  
        <div class="listTable">
          <el-table :data="tableData"  
          ref="multipleTable" 
          @selection-change="handleSelectionChange"
          highlight-current-row
          tooltip-effect="dark"
          show-overflow-tooltip="true"
          empty-text="  "
          stripe 
          border
          height="100%"
          :default-sort = "{Code: 'Id', order: 'descending'}"
          style="width: 100%;">   
            <el-table-column type='index' :index='CalculationIndex' label='序号' width="55" fixed> </el-table-column>
            <el-table-column type="selection" width="55" fixed> </el-table-column>
            <el-table-column v-for="col in cols" :prop="col.Code" :label="col.CnName" :key="col.Code"  sortable>
            </el-table-column>
          </el-table>
        </div>
    </div>
    <div class="pages">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes='[10, 20, 30, 40, 50]'
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalItems">
      </el-pagination>
   </div>
  </div>
</div>
</template>
<script>
  import qs from 'qs';
  import {mapGetters} from 'vuex'
  import axios from 'axios'
  export default {
    name: 'permission',
    props: ['refresh','event'],
    data() {
      return {
        buttonArray: [],
        tablerows:0,
        tableData: [],
        pagesize:15,//每页的数据条数
        currentPage: 1,
        totalItems:0,
        cols:[{
          CnName:'类型',
          Code:'Type'
        },{
          CnName:'标题',
          Code:'Title'
        },{
          CnName:'内容',
          Code:'Content'
        },{
          CnName:'时间',
          Code:'CreateTime'
        }],
        emptyText:'正在加载中',  
        index:1,
        isRead:false,
      };
    },
    computed: {
      ...mapGetters(["token", "mid"])
    },
    created(){
      this.getActionBar();
      this.getData();
    },
    methods: { 
      // 获取操作栏
      getActionBar() {
        var filter = {
          Service: Yukon.ServiceName.Tenant,
          ModularId: this.mid,
          TabName: "Message"
        };
        var filterJson = JSON.stringify(filter);
        var objData = {
          Name: "Authorization",
          DefaultVal: "GetOperationAuthority",
          Filter: filterJson
        };
        var jsonData = JSON.stringify(objData);
        this.$http.post(Yukon.Url.Bus,qs.stringify({
          name: Yukon.ServiceName.Tenant,
          operation: "GetJsonData",
          token: this.token,
          reqInfo: jsonData
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then(response => {
          var result = response.data;
          if (result.code == 0) {
            var columnsData = result.data;
            this.buttonArray = columnsData;
          }
        })
        .catch(error => {
          console.log(error);
        });
      },
      getData(){
        var dataparams = {
          "Name": "SysMessage",
          "DefaultVal": "SearchPage",
          "Filter": "IsRead,==," + this.isRead + ",and;",
          "Properties": ["Id", "Type", "Title", "Content", "CreateTime"]}
        var datas = JSON.stringify(dataparams);
        this.$http.post(Yukon.Url.Bus,qs.stringify({
          "name":Yukon.ServiceName.Tenant,
          "operation":"GetJsonData",
          "token":this.token,
          "reqInfo":datas,
        }),{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response)=>{
          var result = response.data;
          if(result.code == 0){
            let columns= result.data
            let fields = new Array()
            for (let p in columns) {
              fields[p] = columns[p].PropertyValueMap;
            }           
            this.emptyText="暂无数据"                             
            this.tableData= fields;
            this.tablerows = this.tableData.length;
          }
        })
        .catch(function (error) {
          alert(error)
        });
      },
      Action(name) {
        this[name]();
      },
      //刷新
      Refresh(){
        this.getData();
      },
      Unread(){
        this.isRead=false;
        this.getData();
      },
      Readly(){
        this.isRead=true;
        this.getData();
      }, 
      //删除
      Delete(){
        if(!this.multipleSelection || this.multipleSelection.length <= 0){
            this.$alert('请至少选择一条！', '提示', {
              confirmButtonText: '确定',
              callback: action => {
              //点击确定之后的操作
            }});
          }else{
              var IdList = [];
              for(var i=0;i<this.multipleSelection.length;i++){
                IdList.push(this.multipleSelection[i].Id);
              }
              var dataparams = {"Name": "SysMessage","DefaultVal": "Delete","IdList": IdList}
              var datas = JSON.stringify(dataparams);
              this.$http.post(Yukon.Url.Bus,qs.stringify({
                "name":Yukon.ServiceName.Tenant,
                "operation":"SetJsonDelete",
                "token":this.token,
                "reqInfo":datas,
              }),{
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              }).then((response)=>{
                var result = response.data;
                if(result.code == '0'){
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  this.getData();
                }else{
                  this.$message({
                    type: 'error',
                    message: result.msg,
                  }); 
                }                  
              })
              .catch((error)=> {
                this.$message({
                  type: 'error',
                  message: '执行出错'
                });
              })
          }
      },
      SignRead(){
        if(!this.multipleSelection || this.multipleSelection.length <= 0){
            this.$alert('请至少选择一条！', '提示', {
              confirmButtonText: '确定',
              callback: action => {
              //点击确定之后的操作
            }});
          }else{
              if(this.isRead == true){
                this.$alert('已是历史信息！', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                  //点击确定之后的操作
                }});
              }else{
                var IdList = [];
                for(var i=0;i<this.multipleSelection.length;i++){
                  IdList.push(this.multipleSelection[i].Id);
                }
                var dataparams = {
                    "Name": "SysMessage",
                    "DefaultVal": "Edit",
                    "PropertyValueMap": {"MessageId":IdList}
                  }
                var datas = JSON.stringify(dataparams);
                this.$http.post(Yukon.Url.Bus,qs.stringify({
                  "name":Yukon.ServiceName.Tenant,
                  "operation":"SetJsonData",
                  "token":this.token,
                  "data":datas,
                }),{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  }
                }).then((response)=>{
                  var result = response.data;
                  if(result.code == '0'){
                    this.$message({
                      type: 'success',
                      message: '标记成功!'
                    });
                    this.getData();
                  }else{
                    this.$message({
                      type: 'error',
                      message: result.msg,
                    }); 
                  }                  
                })
                .catch((error)=> {
                  this.$message({
                    type: 'error',
                    message: '执行出错'
                  });
                })
            }
          }
      },
      handleSizeChange(val) {
        this.currentPage = 1;
        this.pagesize=val;
      },
      CalculationIndex(index){
        return index + (this.index - 1) * this.pagesize + 1;
      },
      handleCurrentChange(val) {
        this.currentPage = val;
      },
      // 每勾选一个CheckBox都会触发的事件
      handleSelectionChange(val) {
        this.multipleSelection = val;   
      },
      // 点击当前行选中checkbox状态
      toggleSelection(rows) {
        this.$refs.multipleTable.toggleRowSelection(rows); 
      },
    },
  };
</script>
<style scoped lang="less">
.switch-list {
  margin: 20px 0;
  list-style: none;
  overflow: hidden;
  display: none;
}
.switch-item {
  margin: 20px;
  float: left;
}
</style>
