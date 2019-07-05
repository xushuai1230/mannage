<template>
  <div class="conmmonlist" >
    <div class="actionBar" >
      <toolbar
        :serviceName              = "serviceName"
        :operationTableName       = "operationTableName" 
        :toolBarName              = "toolBarName" 
        :searchName               = "searchName" 
        :searchFields             = "searchFields"
        :multipleSelection        = "multipleSelection"
        :editPageLable            = "editPageLable"
        :editPageKey              = "editPageKey"
        v-on:listenerRefreshTable = "refreshTable"
      />
    </div>
  <div class="commonTable" >  
    <div class="listTable">
      <el-table
        border
        stripe
        highlight-current-row
        v-loading="loading"
        height="100%"
        ref="multipleTable"
        :data="tableData"
        empty-text="  "
        @row-click="toggleSelection"
        @selection-change="handleSelectionChange">
        <el-table-column type='index' :index='calculationIndex' align="center" label='序号' width="55" fixed> </el-table-column>
        <el-table-column type="selection" align="center" width="55"  fixed> </el-table-column>
        <el-table-column   
          v-for="col in cols"  
          v-if="col.IsDisplayList==1" 
          :prop="col.Code" 
          :label="col.CnName" 
          :key="col.Code"
          :show-overflow-tooltip="true"  
          sortable>
        </el-table-column>
      </el-table>
    </div>
    <div class="pages">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[30, 50, 100]"
        :page-size="pageSize"
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
  import bus from '../../../assets/public/js/eventBus' 
  import toolbar from './toolbar.vue'
  export default{
    props:['serviceName','operationTableName','toolBarName','searchName','searchFields','editPageLable','editPageKey'],
    components:{toolbar},
    computed:{
     ...mapGetters(['token']),  
  },
  data(){
    return{
      tableData        :[],
      cols             :[],   // 列信息
      codeFields       :[],   // 字段集合
      totalItems       :0,    // 总条数
      currentPage      :1,    // 初始页数
      pageSize         :30,   // 初始化页码
      index            :1,    // 序号
      filter           :'',   // 查询条件
      multipleSelection:[],   // 选中行的值
      totalItems       :0,
      loading          :false, // loading
      
    }
  },
  mounted(){
    this.getColumns();
    this.refreshTable();
  },
   methods:{
    // 刷新table
    refreshTable(val,parameter){
      this.filter = "";
      this.loading = true;
      this.currentPage = 1;
      this.index = 1;
      if (val=="refresh"){
        this.getTableData();
        this.$message({
          type: "success",
          message: "刷新成功!"
        });
      }
      else if(val=="btnSearch" && parameter != "" && this.searchFields != undefined){
        // 搜索按钮
        this.filter = this.searchFields + ',%,' + parameter + ",And";
        this.getTableData();
      }
      else if(parameter == ""){
        this.getTableData();
      }
      else {   // 编辑页保存刷新
        bus.$on('listenerRefreshTable',(message)=>{ 
          if (message) {
            this.getTableData();
          }
        })
      }
    },
    // 获取字段信息
    getColumns(){
      var colsData = { "name":"DBField","TblName":this.operationTableName}
      var reqInfoColsData = JSON.stringify(colsData);
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        "name":this.serviceName,
        "operation":"GetJsonData",
        "token":this.token,
        "reqInfo":reqInfoColsData,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response)=>{
        var result = response.body;
        if(result.code == 0){
          let columns= result.data
          let fields = new Array()//获取字段模型
          for (let p in columns) {
            fields[p] = columns[p].PropertyValueMap;
          }                                        
          this.cols= fields;     
          for(let i in fields){
             if (fields[i].DisplayPosition!=-1) {  
              this.codeFields.push(fields[i].Code);
            }
          }
          this.getTableData();
        }
      }).catch((error)=>{
        console.log(error)
      })                 
    },
    // 获取表格数据
    getTableData(){
      var data = {
        "Name":this.operationTableName,
        "DefaultVal":"SearchPage", 
        "CurrentPage":this.currentPage,
        "PageSize":this.pageSize,
        "Properties":this.codeFields,
        "Filter":this.filter
      }
      var reqInfoData=JSON.stringify(data);
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        "name":this.serviceName,
        "operation":"GetJsonData",
        "token":this.token,
        "reqInfo":reqInfoData,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response)=>{ 
        var result = response.body;
        this.loading=false;         
        if(result.code == 0){
          var columnsData= result.data         
          var getJsonDatafields = new Array()
          for (var p in columnsData) {
            getJsonDatafields[p] = columnsData[p].PropertyValueMap;
          } 
          this.emptyText = "暂无数据";
          this.tableData = getJsonDatafields;  
          this.totalItems = result.TotalRow;
        }
      }).catch((error)=> {
        this.loading=false;
      })
    },
    // 点击行checkbox
    toggleSelection(rows) {
      this.$refs.multipleTable.toggleRowSelection(rows); 
    },
    //点击checkbox状态
    handleSelectionChange(val) {
      this.multipleSelection = val; 
    },
    // 页大小改变默认第一页
    handleSizeChange(val) {
      this.pageSize=val
      this.currentPage=1;
      this.handleCurrentChange(this.currentPage);
    },
    // currentPage
    handleCurrentChange(val) {
      this.currentPage = val; 
      this.index = val;
      this.getTableData(); 
    },
    // 计算分页
    calculationIndex(index){
      return index + (this.index - 1) * this.pageSize + 1;
    },
  }
}
</script>
