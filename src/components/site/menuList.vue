<template>
  <div class="menu">
    <div class="toolBar">
      <div class="actionBarList" >
        <div class="operationBtn changeline" v-for="btn in buttonArray">
          <el-button size="mini" :icon="btn.icon" @click="Action(btn.btn)">{{btn.text}}</el-button>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="contentLeft">
        <div class="leftTop">
          <el-table
            highlight-current-row
            tooltip-effect="dark"
            :show-overflow-tooltip="true"
            :data="menuData"
            ref="multipleTable"
            height="100%"
            border
            empty-text="  "
            @row-click="handleMenuCurrentChange">
            <el-table-column type='index' label='序号' width="55"></el-table-column>
            <el-table-column   
              v-for="col in firstCols"  
              :prop="col.prop" 
              :label="col.label" 
              :key="col.prop">
            </el-table-column>
          </el-table>  
        </div>
        <div class="leftbottom"> 
          <el-pagination
            @size-change="pageChange"
            @current-change="pageCurrentChange"
            :current-page="menuCurrentPage"
            :page-sizes="[10, 20, 30]"
            :page-size="menuPageSize"
            layout="prev, pager, next"
            :total="totalItems">
          </el-pagination>
        </div>
      </div>
      <div class="contentRight">
        <TreeGrid :columns="codeFields" :tree-structure="true" :data-source="tableData"  v-on:selectedRow="getSelectedRow"></TreeGrid>
      </div>
    </div>
    <!--操作日志-->
    <dialogOperationLog
      v-if="dialogOperLogVisible"
      :dialogOperLogVisible="dialogOperLogVisible"
      :serviceName="serviceName"
      :dialogCode="dialogCode"
      :operationTableName="operationTableName"
      :IdList="IdList"
      v-on:dialogVisibleFalse="dialogOperLogClose">  
    </dialogOperationLog>
  </div>
</template>
<script>
  import qs from 'qs';
  import {mapGetters}    from 'vuex'
  import axios           from 'axios'
  import TreeGrid        from '../common/treeTable/treeGrid.vue'
  import                      '../../assets/sass/menu.scss' 
  import bus             from '../../assets/public/js/eventBus' 
  import toolbar         from '../common/normal/toolbar.vue'
  import dialogOperationLog from "../common/dialog/operationLog.vue"
  export default {
    components: {
      TreeGrid,toolbar,dialogOperationLog
    },
    data() {
      return {
        operationTableName:'',
        serviceName:Yukon.ServiceName.Tenant,
        multipleSelection:[],
        editPageLable:"栏目菜单",
        editPageKey:'MenuEdit',
        searchName:'编号',
        searchFields:'code',
        dialogOperLogVisible:false,//操作日志
        dialogCode:'',
        selectRowId:'',
        tableData: [],
        editId:'',
        buttonArray:[],
        codeFields:[],  //字段集合
        firstCols:[{
          prop: 'Code',
          label: '编号'
        },{
          prop: 'Name',
          label: '名称'
        }],
        menuData:[],
        menuPageSize       :20,// 每页大小默认值
        menuCurrentPage    :1, // 默认第一页
        totalItems         :0, //总条数
        IdList:[],
      };
    },
    computed: {
      ...mapGetters(['token','mid']), 
      propList() {
        return Object.keys(this.props).map(item => ({
          name: item,
        }));
      },
    },
    created(){
      this.getActionBar()
    },
    mounted(){
     this.getMenuData();
     this.refreshTable();
    },
    methods: {
      // 子组件传过来Id
      getSelectedRow(data){
          this.multipleSelection = data;
      },
      // 渲染bar
      getActionBar() {
        var filter = {
          Service: Yukon.ServiceName.Tenant,
          ModularId: this.mid,
          TabName: "SysDictionaryMenu"
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
        }).catch(error => {
          console.log(error);
        });
      },
      Action(name) {
        this.btnDisabled = true;
        this[name]();
      },
      //刷新table
      refreshTable(val,parameter){
        this.loading = true;
        if(val=="refresh"){
           this.getMenuData();
        }
        else if(val=="btnSearch" && parameter != "" && this.searchFields != undefined){
          this.currentPage = 1;
          this.filter="" + this.searchFields + ',%,' + "" +parameter + ",And";
          this.getMenuData();
        }
        else if(parameter == ""){
          this.filter = "";
          this.getMenuData();
        } 
        else{
          this.filter="";
          bus.$on('listenerRefreshTable',(message)=>{
            if (message) {
              this.getMenuData();
            }
          })
        }
      },
      // 刷新
      Refresh(){
        this.getTableJsonData();
      },
      // 左侧菜单数据
      getMenuData(){
        var dataparams = {
          "Name": "SysDictionaryMenu",
          "DefaultVal": "SearchAll",
          "Properties":["Id","Code","Name"],
        }
        var datas = JSON.stringify(dataparams);
        this.$http.post(Yukon.Url.Bus,qs.stringify({
          "name":Yukon.ServiceName.Tenant,
          "operation":"GetJsonData",
          "token":this.token,
          "reqInfo":datas,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response)=>{ 
          this.menuData = [];
          var result = response.body;
          if(result.code == 0){
            if(result.data!=null){
              result.data.forEach((item,index) => {
                this.menuData.push(item.PropertyValueMap);
              });
              if(this.menuData.length>0){
                this.$refs.multipleTable.setCurrentRow(this.menuData[0]);
                this.operationTableName = this.menuData[0].Code;
                this.getColsJsondata();
                this.getTableJsonData();
              }
            }
          }
        })
        .catch(function (error) {
          alert(error)
        });
      },
       //右侧表列的信息
      getColsJsondata(){
        var colsData = { "name":"DBField","TblName":'SysDictionaryMenu'}
        var reqInfoColsData = JSON.stringify(colsData);
        this.$http.post(Yukon.Url.Bus,qs.stringify({
          "name":Yukon.ServiceName.Tenant,
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
          this.codeFields = [];
          if(result.code == 0){
            let columns= result.data
            let fields = new Array()//获取字段模型
            for (let p in columns) {
              fields[p] = columns[p].PropertyValueMap;
            }                                        
            this.cols= fields; 
            this.codeFields.push({
              prop: '',
              label: '',
              isDisplay:1,
              width:'80'
            })
            for(let i in fields){
              this.codeFields.push({
                prop: fields[i].Code,
                label: fields[i].CnName,
                isDisplay:fields[i].IsDisplayList
              });
            }
          }
        }).catch((error)=>{
          console.log(error)
        })                 
      },
      // 右侧表数据
      getTableJsonData(){
        var dataparams = {
          "Name": this.operationTableName,
          "DefaultVal": "SearchAll",
        }
        var datas = JSON.stringify(dataparams);
        this.$http.post(Yukon.Url.Bus,qs.stringify({
          "name":Yukon.ServiceName.Tenant,
          "operation":"GetJsonData",
          "token":this.token,
          "reqInfo":datas,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response)=>{ 
          var result = response.body;
          if(result.code == 0){
            this.tableData = result.data;
          }
          else{
            this.tableData = [];
          }
        }).catch(function (error) {
        });
      },
      //点击左侧列表
      handleMenuCurrentChange(val) {
        if(val !== null){
          this.operationTableName = val.Code;
          this.getTableJsonData();
        }
      },
      // 新建
      New() {
        var timestamp = (new Date()).getTime();
        var data ={
          Time:timestamp,
          Action:'NewSave',
          TableName:this.operationTableName
        };
        bus.$emit('receivesCreateTabValue',this.editPageKey,this.editPageLable,"","",data);
        this.btnDisabled = false;
      },
      // 新增子项
      NewChild(){
        if(this.multipleSelection.length == 1) {
          var timestamp = (new Date()).getTime();
          var data ={
            Time:timestamp,
            Action:'NewSave',
            ParentId:this.multipleSelection[0].Id,
            TableName:this.operationTableName
          };
          bus.$emit('receivesCreateTabValue',this.editPageKey,this.editPageLable,'','',data);
        }
        else{
          this.$alert('请至少选择一条！', '提示', {
            confirmButtonText: '确定',
            callback: action => {
          }});
        }
        this.btnDisabled = false; 
      },
      // 编辑
      Edit(){
        if(this.multipleSelection.length==0) {
          this.$alert('请至少选择一条！', '提示', {
            confirmButtonText: '确定',
            callback: action => {
          }});
        } 
        else if(this.multipleSelection.length >1){
          this.$alert('只能选择一条！', '提示', {
            confirmButtonText: '确定',
            callback: action => {
            this.btnDisabled=false; 
          }});
        }
        else{
          var timestamp = (new Date()).getTime();
          var data ={
            Time:timestamp,
            Action:'EditSave',
            EditId:this.multipleSelection[0].Id,
            TableName:this.operationTableName
          };
          bus.$emit('receivesCreateTabValue',this.editPageKey,this.editPageLable,"","",data);
        }
      },
      // 删除
      Delete(){
        if(!this.multipleSelection || this.multipleSelection.length <= 0){
          this.$alert('请至少选择一条！', '提示', {
            confirmButtonText: '确定',
            callback: action => {
            this.btnDisabled=false; 
            //点击确定之后的操作
          }});
        }
        else{
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var IdList = [];
            for(var i=0;i<this.multipleSelection.length;i++){
              IdList.push(this.multipleSelection[i].Id);
            }
            var dataparams = {"IdList": IdList,"Name":this.operationTableName,"DefaultVal": "Delete",}
            var datas = JSON.stringify(dataparams);
            this.$http.post(Yukon.Url.Bus,qs.stringify({
              "name":Yukon.ServiceName.Tenant,
              "operation":"SetJsonDelete",
              "token":this.token,
              "reqInfo": datas
            }),
            {
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
                this.getTableJsonData();
              }
              else{
                this.$message({
                  type: 'error',
                  message: result.msg,
                }); 
              }
              this.btnDisabled=false;                  
            }).catch((error)=> {
              this.$message({
                type: 'error',
                message: '执行出错'
              });
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });    
            this.btnDisabled=false;       
          });
        }
      },
      // 操作日志
      OperationLog() {
        if(!this.multipleSelection || this.multipleSelection.length <= 0) {
          this.$alert("请至少选择一条！", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.btnDisabled = false;
            }
          });
        } 
        else if(this.multipleSelection.length > 1) {
          this.$alert("只能选择一条！", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.btnDisabled = false;
            }
          });
        } 
        else {
          this.IdList = [];
          this.IdList.push(this.multipleSelection[0].Id);
          this.dialogCode = "操作日志";
          this.dialogOperLogVisible = true;
          this.serviceName = Yukon.ServiceName.Tenant;
        }
      },
      dialogOperLogClose(val) {
        this.btnDisabled = false;
        this.dialogOperLogVisible = val;
      },
      pageChange(val) {
        this.menuPageSize = val
        this.menuCurrentPage = 1;
      },
      pageCurrentChange(val) {
        this.menuCurrentPage = val;
      },
    },
  };
</script>