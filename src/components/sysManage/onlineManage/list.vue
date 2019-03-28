<template>
    <div class="conmmonlist">
      <div class="actionBar">
        <el-row  class="actionBarList">
          <div class="operationBtn">
             <el-button size="mini" icon="el-icon-refresh" @click="Refresh">刷新</el-button>
             <el-button size="mini" icon="el-icon-delete" @click = "ToBreakOff">断开连接</el-button>
          </div>
        </el-row>
       </div>
      <!-- 列表 -->
      <div class="commonTable" >  
        <div class="listTable">
          <el-table :data="tableData"  
          ref="multipleTable" 
          @selection-change="handleSelectionChange"
          @row-click="toggleSelection"
          highlight-current-row
          tooltip-effect="dark"
          :show-overflow-tooltip="true"
          height="100%"
          empty-text="  "
          stripe 
          border
          :default-sort = "{Code: 'Id', order: 'descending'}">   
            <el-table-column type='index' :index='CalculationIndex' label='序号' width="55" fixed> </el-table-column>
            <el-table-column type="selection" width="55" fixed> </el-table-column>
            <el-table-column v-for="col in cols"  v-if="col.IsDisplayList==1" :prop="col.Code" :label="col.CnName" :key="col.Code"  sortable>
            </el-table-column>
          </el-table>
        </div>
     </div>
      <div class="pages">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes='[15, 25, 50]'
        :page-size="pagesize"
        :current-page="currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tablerows">
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
        divHeight:'',
        height:'',
        tablerows:0,
        tableData: [],
        pagesize:15,//每页的数据条数
        currentPage: 1,
        cols:[],
        emptyText:'正在加载中',  
        index:1,
      };
    },
    computed: {
      propList() {
        return Object.keys(this.props).map(item => ({
          name: item,
        }));
      },
      ...mapGetters(['token']), 
    },
    created(){
      this.getColumns();
    },
    methods: {
      getColumns(){
        var colsData = {"name":"DBField","TblName":"OnLineUser"}
        var reqInfoColsData = JSON.stringify(colsData);
        this.$http.post(Yukon.Url.Bus,qs.stringify({
          "name":Yukon.ServiceName.Tenant,
          "operation":"GetJsonData",
          "token":this.token,
          "reqInfo":reqInfoColsData,
        }),{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response)=>{
          var result = response.data;
          if(result.code == 0){
            let columns= result.data
            let fields = new Array()//获取字段模型
            for (let p in columns) {
              fields[p] = columns[p].PropertyValueMap;
            }                                        
            this.cols= fields;
            let codeFields= new Array();      
            for(let i in fields){
              if (fields[i].IsDisplayList!=0) {   
                codeFields.push(fields[i].Code)
              }         
            }
            this.getData();
          }
        }).catch((error)=>{
          console.log(error)
        })                 
      },    
      getData(){
        var dataparams = {"Name":"OnLineUser"}
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
            this.tablerows = result.data.length;
          }else{
            this.tablerows=0;
          }
          this.emptyText="暂无数据"
          this.tableData = result.data;
        })
        .catch(function (error) {
          alert(error)
        });
      },
      //断开连接
      ToBreakOff(){
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
              var dataparams = {"Name":"OnLineUser","IdList":IdList}
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
                    message: '断开成功!'
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
      //刷新
      Refresh(){
        this.getData();
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
