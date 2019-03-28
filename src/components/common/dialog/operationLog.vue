<template>
	<div class="listTable">
    <el-dialog 
      v-dialogDrag
      ref="dialog__wrapper"
      top="0" 
      class="cover_dialog"
      :title="dialogCode"
      :fit="true"
      :before-close="btnCancel"
      :closeOnClickModal=false
      :visible.sync="dialogOperLogVisible">
      <el-form :inline="true" size="mini" style="height: 100%;position:relative">
      <div class="divTableCss">
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
             v-if="col.EngCode!='Id'" 
             :prop="col.EngCode" 
             :label="col.ShowCode" 
             :key="col.EngCode"
             :show-overflow-tooltip="true"  
             sortable>
            </el-table-column>
        </el-table>
        <div class="pages" style="width:100%;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[15, 25, 35]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalItems">
          </el-pagination>
        </div>
      </div>
    </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnSure">保存</el-button>
      </div>
    </el-dialog>
	</div>
</template>
<script>
  import qs from 'qs';
  import {mapGetters} from 'vuex'
  import bus          from '../../../assets/public/js/eventBus' 
  export default {
    props:['dialogOperLogVisible','dialogCode','serviceName','IdList','operationTableName'],
    data() {
      return { 
        dialogVisible:this.dialogOperLogVisible,      //弹框
        optionsData:[],
        tableData:[],
        multipleSelection:[],  //选中行的值
        totalItems       :0,   //总条数
        currentPage      :1,   //初始页数
        pageSize         :15,  //初始化页码
        index            :1,   //序号
        loading          :false,//loading
        cols:[{
          EngCode:'Id',
          ShowCode:'ID',
        },{
          EngCode:'Operation',
          ShowCode:'操作',
        },{
          EngCode:'Result',
          ShowCode:'结果',
        },{
          EngCode:'Operator',
          ShowCode:'操作人',
        },{
          EngCode:'OperationTime',
          ShowCode:'操作时间',
        }],
      }
    },
    computed:{
      ...mapGetters(['token']), // 获取vuex的token，获取方法this.auser
    },
    watch:{
      dialogCode(newVal ,oldVal){
          // this.getLogTableJsonData();
      },
    },
    created(){
      this.getLogTableJson();
    },
    methods: {
    //获取表格数据
    getLogTableJson(){
      this.loading=true;
      var data = {
        "Name":"BusinessLog",
        "DefaultVal":"OperationLog", 
        "PageSize":this.pageSize,
        "CurrentPage":this.currentPage,
        "IdList":this.IdList
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
          this.tableData=result.data;  
          this.totalItems = result.TotalRow;
        }
      }).catch((error)=> { 
        this.loading=false;
      })
    },
    btnCancel(){
      this.dialogVisible= false;
      this.$emit('dialogVisibleFalse',false) ;
    },
    //计算分页
    CalculationIndex(index){
      return index + (this.index - 1) * this.pageSize + 1;
    },
    //点击checkbox状态
    handleSelectionChange(val) {
      this.multipleSelection = val; 
    },
    //点击行checkbox
    toggleSelection(rows) {
       this.$refs.multipleTable.toggleRowSelection(rows); 
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
        this.getLogTableJson(); 
    },
    btnSure(){
      this.dialogVisible= false;
      this.$emit('dialogVisibleFalse',false) ;
    },
  }
}
</script>
 <style lang="scss" scoped>
  .cover_dialog {
    /deep/ .el-dialog__body {
       padding: 16px 20px 0 20px;
    }
  } 
  .cover_dialog .divTableCss {
    height: 100%;
    padding-bottom: 30px;
 }
</style>
