<template>
<div class="conmmonlist" >
	<div class="actionBar" >
      <el-row class="actionBarList">
        <div class="operationBtn">
             <el-button size="mini" icon="el-icon-circle-plus" :disabled="btnDisabled" @click="refreshTable">刷新</el-button>
        </div>
          <div class="inputCont">
            <span class="selectTitle">开始日期</span>
             <el-date-picker
              v-model="startTimeValue"
              type="datetime"
              size="mini"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择开始日期时间"
              @change="startTimeChange">
            </el-date-picker>
            <span class="selectTitle">结束日期</span>
             <el-date-picker
              v-model="endTimeValue"
              type="datetime"
              size="mini"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择结束日期时间"
              @change="endTimeChange">
            </el-date-picker>
            <span class="selectTitle" id="Logo">租户</span>
            <el-select 
            v-model="selectModelValue" 
            filterable 
            clearable 
            placeholder="请选择" 
            size="mini"
            @change="selectChang">
              <el-option
                v-for="item in options"
                :key="item.key"
                :label="item.label"
                :value="item.key">
              </el-option>
           </el-select>
           <el-button size="mini" icon="el-icon-search" @click="btnSearch">搜索 </el-button>
        </div>
      </el-row>
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
          <el-table-column type='index' :index='CalculationIndex' label='序号' width="55" fixed> </el-table-column>
			    <el-table-column type="selection"  width="55"  fixed> </el-table-column>
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
			  :page-sizes="[15, 30, 45, 60]"
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
export default{
   props:['serviceName','operationTableName','searchName','searchFields','defaultVal'],
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
        pageSize         :15,  //初始化页码
        index            :1,   //序号
        filter           :'',  //查询条件
        multipleSelection:[],  //选中行的值
        totalItems       :0,
        loading          :false,//loading
        btnDisabled      :false, //刷新按钮状态
        selectModelValue :'',   //用户下拉框model数据
        options          :[],   //用户下拉框数据集
        startTimeValue   :"",   //开始日期
        endTimeValue     :"",   //结束日期
        startValue       :"",
        endValue         :"",
        selectValue      :"",
   	 }
  },
  mounted(){
  	this.getColsJsondata();
    this.getUserList();
  },
   methods:{
    //刷新table
    refreshTable(val,parameter){
      this.loading=true;
      this.btnDisabled=true;
      this.getTableJsonData();
    },
    //获取用户下拉框数据
    getUserList(){
          var Properties=["Id","Name"]
          var data = {
            "Name":"CstInformation",
            "DefaultVal":"SearchAll", 
            "Properties":Properties,
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
            var result = response.data;
            this.loading=false;        
            if(result.code == 0){
              var columnsData= result.data         
              var getJsonDatafields = new Array()
              for (var p in columnsData) {
                getJsonDatafields[p] = columnsData[p].PropertyValueMap;
              } 
              let optionsTemp=[];
              for(var i in getJsonDatafields){
                 var obj={};
                obj["label"]=getJsonDatafields[i].Name,
                obj["key"]=getJsonDatafields[i].Id,
                optionsTemp.push(obj)
                
              }
              this.options=optionsTemp;
            } 
          }).catch((error)=> { 
            console.log(error)
            this.loading=false;
          })
    },
    //下拉框选择值变化
    selectChang(value){

      if (value=="") {
        this.selectValue="";
      }else{
       this.selectValue="TenantId,==,"+value+",AND;"
      }   
    },
    //搜索
    btnSearch(){
       this.getTableJsonData();
    },
    startTimeChange(value){
      if (value==""|| value==null) {
        this.startValue=""
      }else{
        this.startValue="CreateTime,>=,"+value+",and;"
      }
   
    },
    endTimeChange(value){
      if (value=="" || value==null) {
        this.endValue=""
      }else{
        this.endValue="CreateTime,<=,"+value+",and;"
      }
  
    },
    //获取表列的信息
    getColsJsondata(){
          var colsData = { "name":"DBField","TblName":this.operationTableName}
          var reqInfoColsData = JSON.stringify(colsData);
          this.$http.post(Yukon.Url.Bus,qs.stringify({
            "name":Yukon.ServiceName.Log,
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
            "DefaultVal":this.defaultVal, 
            "CurrentPage":this.currentPage,
            "PageSize":this.pageSize,
            "Properties":this.codeFields,
            "Filter":this.selectValue+this.startValue+this.endValue
          }
          var reqInfoData=JSON.stringify(data);
          this.$http.post(Yukon.Url.Bus,qs.stringify({
            "name":Yukon.ServiceName.Log,
            "operation":"GetJsonData",
            "token":this.token,
            "reqInfo":reqInfoData,
          }),{
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then((response)=>{ 
            var result = response.data;
            this.loading=false; 
            this.btnDisabled=false;  
            if(result.code == 0){
              var columnsData= result.data         
              var getJsonDatafields = new Array()
              for (var p in columnsData) {
                getJsonDatafields[p] = columnsData[p].PropertyValueMap;
              } 
              this.emptyText="暂无数据"
              this.tableData=getJsonDatafields      
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
