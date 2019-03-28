<template>
  <div class="menu">
    <div class="toolBar">
        <el-button class="bar" size="mini" icon="el-icon-circle-plus-outline" @click="edit('0',selectRowId)">新增</el-button>
        <el-button class="bar" size="mini" icon="el-icon-circle-plus-outline" @click = "refresh">刷新</el-button>
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
              v-for="col in cols"  
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
        <TreeGrid :columns="columns" :tree-structure="true" :data-source="tableData" :operates="operates"></TreeGrid>
      </div>
    </div>
  <!--弹框-->
  <dialogMenu
    v-if="dialogMenuVisible"
    :dialogMenuVisible="dialogMenuVisible"
    :dialogCode="dialogCode"
    :operationTableName="operationTableName"
    :editId="editId"
    v-on:dialogVisibleFalse="dialogTreeClose">  
  </dialogMenu>
</div>
</template>
<script>
  import qs from 'qs';
  import {mapGetters}    from 'vuex'
  import axios           from 'axios'
  import TreeGrid        from '../common/treeTable/treeGrid.vue'
  import                      '../../assets/sass/menu.scss' 
  import bus             from '../../assets/public/js/eventBus' 
  import dialogMenu from '../common/dialog/menuDialog.vue'
  export default {
    components: {
      TreeGrid,dialogMenu
    },
    data() {
      return {
        operationTableName:'',
        dialogMenuVisible:false,
        dialogCode:'',
        selectRowId:'',
        tableData: [],
        editId:'',
        columns: [
          {
            prop: '', 
            width: '80',
            label: ''
          },{
            prop: 'Code', 
            label: '编号'
          },{
            prop: 'Name', 
            label: '名称'
          },{
            prop: 'TabId', 
            label: '页面唯一码'
          },{
            prop: 'Type', 
            label: '类型'
          },{
            prop: 'Icon', 
            label: '图标'
          },{
            prop: 'Sort', 
            label: '排序'
          },{
            prop: 'Remark', 
            label: '备注'
          }
        ],
        cols:[{
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
        operates:[
          {
            id:'1',
            label: '新增',
            icon:'el-icon-news',
            show: true,
            disabled: false,
            method: (index, row) => {
              this.edit(index, row.Id)
            }
          },{
            id:'2',
            label: '编辑',
            icon:'el-icon-edit',
            show: true,
            disabled: false,
            method: (index, row) => {
              this.edit(index, row.Id)
            }
          },{
            id:'3',
            label: '删除',
            icon:'el-icon-delete',
            show: true,
            disabled: false,
            method: (index, row) => {
              this.delete(index, row.Id)
            }
          },
        ],   
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
      this.getMenuData();
    },
    methods: {
      // 刷新
      refresh(){
        this.getMenuData();
      },
      // 左侧菜单数据
      getMenuData(){
        var dataparams = {
          "Name": "DictionaryMenu",
          "DefaultVal": "SearchAll",
          "Properties":["Id","Code","Name"],
        }
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
          this.menuData = [];
          var result = response.body;
          if(result.code == 0){
            if(result.data!=null){
              result.data.forEach((item,index) => {
                this.menuData.push(item.PropertyValueMap);
              });
              if(this.menuData.length>0){
                this.operationTableName = this.menuData[0].Code;
                this.$refs.multipleTable.setCurrentRow(this.menuData[0]);
                this.getTreeTableData();
              }
            }
          }
        })
        .catch(function (error) {
          alert(error)
        });
      },
      // 右侧表数据
      getTreeTableData(){
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
        }),{
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response)=>{ 
          var result = response.body;
          if(result.code == 0){
            this.tableData = result.data;
          }else{
            this.tableData = [];
          }
        })
        .catch(function (error) {
        });
      },
      //点击左侧列表
      handleMenuCurrentChange(val) {
        if(val !== null){
          this.operationTableName = val.Code;
          this.getTreeTableData();
        }
      },
      //编辑
      edit(type,editId){
        if(type==0){
          this.dialogCode="新增"
        }else{
          this.dialogCode="编辑"
        }
        var timestamp = (new Date()).getTime();
        var editIdTemp = "";
        if (editId=="") {//新增
          editIdTemp = "ID" + timestamp;
        }else{  //编辑
          editIdTemp = "Edit" + timestamp+","+editId
        }
        this.editId = editIdTemp+','+ type + ',' ;
        this.dialogMenuVisible=true;
      },
      //删除
      delete(val,id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          ancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var dataparams = {"Id": id,"Name": this.operationTableName,"DefaultVal": "Delete",}
          var datas = JSON.stringify(dataparams);
          this.$http.post(Yukon.Url.Bus,qs.stringify({
            "name":Yukon.ServiceName.Tenant,
            "operation":"SetJsonDelete",
            "token":this.token,
            "reqInfo": datas
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
              this.getTreeTableData();
            }else{
              this.$message({
                type: 'error',
                message: result.msg,
              }); 
            }
          })
        .catch(function (error) {
          console.log(error);
        });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });  
        });
      },
      dialogTreeClose(val){
        this.dialogMenuVisible=val;
        this.getTreeTableData();
      },
      // 分页
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