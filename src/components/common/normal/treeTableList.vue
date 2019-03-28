<template>
  <div class="menu">
    <div class="toolBar">
        <el-button class="bar" size="mini" icon="el-icon-circle-plus-outline" @click="Edit('0',selectRowId)">新增</el-button>
        <el-button class="bar" size="mini" icon="el-icon-circle-plus-outline" @click = "Refresh">刷新</el-button>
    </div>
    <div class="content">
      <div class="contentLeft">
        <div class="leftTop">
          <el-table
            highlight-current-row
            tooltip-effect="dark"
            :show-overflow-tooltip="true"
            :data="menuData"
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
  <dialogTreeTable
    v-if="dialogTreeVisible"
    :dialogTreeVisible="dialogTreeVisible"
    :dialogCode="dialogCode"
    :operationTableName="operationTableName"
    :editId="editId"
    v-on:dialogVisibleFalse="dialogTreeClose">  
  </dialogTreeTable>
</div>
</template>
<script>
  import qs from 'qs';
  import {mapGetters}    from 'vuex'
  import axios           from 'axios'
  import TreeGrid        from '../treeTable/treeGrid.vue'
  import '../../../assets/sass/menu.scss' 
  import bus             from '../../../assets/public/js/eventBus' 
  import dialogTreeTable from '../dialog/treeTableDialog.vue'
  export default {
    props: ['operationTableName','editPageLable','editPageKey','TreeGrid'],
    components: {
      TreeGrid,dialogTreeTable
    },
    data() {
      return {
        props: {
          stripe: true,
          border: true,
          showHeader: true,
          showSummary: false,
          showRowHover: true,
          showIndex: true,
          treeType: true,
          isFold: true,
          expandType: false,
          selectionType: false,
        },
        dialogTreeVisible:false,
        IdList:[],
        dialogCode:'',
        divHeight:'',
        value: '',
        type: '',
        input: '',
        state:false,
        tablerows:0,
        formLabelWidth: '120px',
        changeAddEdit:0,
        selectRowId:'',
        tableData: [],
        editId:'',
        roleData:[],
        dialogData: {},
        pagesize:15,//每页的数据条数
        currentPage: 1,
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
            prop: 'State', 
            label: '状态'
          },{
            prop: 'Remark', 
            label: '备注'
          },{
            prop: 'CreateTime', 
            label: '创建时间'
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
        totalItems     :0, //总条数
        operates:[
          {
            id:'1',
            label: '新增',
            type: '',
            icon:'el-icon-news',
            show: true,
            disabled: false,
            method: (index, row) => {
              this.Edit(index, row.Id)
            }
          },{
            id:'2',
            label: '编辑',
            type: '',
            icon:'el-icon-edit',
            show: true,
            disabled: false,
            method: (index, row) => {
              this.Edit(index, row.Id)
            }
          },{
            id:'3',
            label: '删除',
            type: '',
            icon:'el-icon-delete',
            show: true,
            disabled: false,
            method: (index, row) => {
              this.Delete(index, row.Id)
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
      ...mapGetters(['token']),//获取存入vuex的token，获取方法this.user.token
    },
    created(){
      this.getmenuData();
    },
    methods: {
      getData(){
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
          alert(error)
        });
      },
      getmenuData(){
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
          var result = response.data;
          if(result.code == 0){
            let columns= result.data
            let fields = new Array()//获取字段模型
            for (let p in columns) {
              fields[p] = columns[p].PropertyValueMap;
            } 
            this.menuData = fields;
            this.operationTableName=fields[0].Code;
            this.getData();
          }
        })
        .catch(function (error) {
          alert(error)
        });
      },
      //点击左侧列表
      handleMenuCurrentChange(val) {
        if(val !== null){
          this.operationTableName=val.Code;
          this.getData();
        }
      },
      //刷新
      Refresh(){
        this.getData();
      },
      //编辑
      Edit(type,editId){
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
        this.dialogTreeVisible=true;
      },
      //删除
      Delete(val,id) {
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
              this.getData();
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
        this.dialogTreeVisible=val;
        this.getData();
      },
      handleSizeChange(val) {
        this.currentPage = 1;
        this.pagesize=val;
      },
      handleCurrentChange(val) {
        this.currentPage = val;
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

