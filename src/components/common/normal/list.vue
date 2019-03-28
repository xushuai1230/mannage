<template>
<div class="conmmonlist" >
	<div class="actionBar" >
		<toolbar
      :serviceName="serviceName"
		  :operationTableName="operationTableName" 
		  :searchName="searchName" 
		  :searchFields="searchFields"
		  :multipleSelection="multipleSelection"
		  :editPageLable="editPageLable"
      :editPageKey="editPageKey"
		  v-on:listenerRefreshTable="refreshTable"
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
          <el-table-column type='index' :index='CalculationIndex' align="center" label='序号' width="55" fixed> </el-table-column>
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
			  :page-sizes="[30, 45, 60]"
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
   props:['serviceName','operationTableName','searchName','searchFields','editPageLable','editPageKey'],
   components:{toolbar},
   computed:{
	   ...mapGetters(['token']),  
	},
   data(){
   	 return{
	      tableData        :[],
        cols             :[],  //列信息
      	codeFields       :[],  //字段集合
        totalItems       :0,   //总条数
      	currentPage      :1,   //初始页数
        pageSize         :30,  //初始化页码
        index            :1,   //序号
        filter           :'',  //查询条件
        multipleSelection:[],  //选中行的值
        totalItems       :0,
        loading          :false//loading
   	 }
  },
  mounted(){
  	this.getColsJsondata();
    this.refreshTable();
  },
   methods:{
    //刷新table
    refreshTable(val,parameter){
      this.loading=true;
      if (val=="refresh") //删除,工单发放
      {
          this.getTableJsonData();
      }
      else if(val=="btnSearch" && parameter != "" && this.searchFields != undefined)//查询按钮事件
      {
          this.currentPage = 1;
          this.filter="" + this.searchFields + ',%,' + "" +parameter + ",And";
          this.getTableJsonData();
       }
       else if(parameter == "")
       {
          this.filter = "";
          this.getTableJsonData();
       }
      else  //编辑页保存刷新
      {
         this.filter="";
         bus.$on('listenerRefreshTable',(message)=>{//
          if (message) {
            this.getTableJsonData();
          }
        })
      }
    },
    //获取表列的信息
    getColsJsondata(){
          var colsData = { "name":"DBField","TblName":this.operationTableName}
          var reqInfoColsData = JSON.stringify(colsData);
          this.$http.post(Yukon.Url.Bus,qs.stringify({
            "name":this.serviceName,
            "operation":"GetJsonData",
            "token":this.token,
            "reqInfo":reqInfoColsData,
          }),{
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
              this.getTableJsonData();
            }
          }).catch((error)=>{
            console.log(error)
          })                 
    },
    //获取表格数据
    getTableJsonData(){
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
          }),{
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
              this.emptyText="暂无数据"
              this.tableData=getJsonDatafields
              // this.totalItems = JSON.parse(response.body.TotalRow);        
              this.totalItems = result.TotalRow;
            }
          }).catch((error)=> { 
            console.log(error)
            this.loading=false;
          })
    },
    //点击行checkbox
    toggleSelection(rows) {
       this.$refs.multipleTable.toggleRowSelection(rows); 
    },
    //点击checkbox状态
    handleSelectionChange(val) {
       this.multipleSelection = val; 
    },
    //pageSize方法
    handleSizeChange(val) {
      	this.pageSize=val
        this.currentPage=1;
        this.handleCurrentChange(this.currentPage);
    },
    //currentPage
    handleCurrentChange(val) {
    	  this.currentPage = val; 
        this.index = val;
        this.getTableJsonData(); 
    },
    //计算分页
    CalculationIndex(index){
          return index + (this.index - 1) * this.pageSize + 1;
    },
   }
}
</script>
