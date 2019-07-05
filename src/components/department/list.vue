<template>
  <div class="treeTable" >
      <div class="actionBar">
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
      <div class="mainTable">
        <TreeGrid :columns="codeFields" :tree-structure="true" :data-source="tableData"  v-on:selectedRow="getSelectedRow"></TreeGrid>
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
</template>
<script>
import qs from "qs";
import { mapGetters } from "vuex";
import TreeGrid from "../common/treeTable/treeGrid.vue";
import "../../assets/sass/department.scss";
import bus from "../../assets/public/js/eventBus";
import toolbar from '../common/normal/toolbar.vue'
export default {
    components: { TreeGrid,toolbar},
    data() {
      return {
        tableData: [],
        tablerows: 0,
        pagesize: 15, //每页的数据条数
        currentPage: 1, //默认开始页面
        codeFields:[],  //字段集合
        serviceName: Yukon.ServiceName.Tenant,
        operationTableName:'CstDepartment',
        multipleSelection:[],
        editPageLable:"部门维护",
        editPageKey:'CstDepartmentEdit',
        searchName:'编号',
        searchFields:'code'
      };
    },
    computed: {
      ...mapGetters(["token"]),
    },
    mounted(){
      this.getColsJsondata();
      this.refreshTable();
    },
    methods: {
      //子组件传过来Id
      getSelectedRow(data){
          this.multipleSelection = data;
      },
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
            var colsData = { "name":"DBField","TblName":'CstDepartment'}
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
              var result = response.body;
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
                this.getTableJsonData();
              }
            }).catch((error)=>{
              console.log(error)
            })                 
      },
      //获取table数据
      getTableJsonData() {
        var dataparams = {
          Name: "CstDepartment",
          DefaultVal: "SearchAll"
        };
        var datas = JSON.stringify(dataparams);
        this.$http.post(Yukon.Url.Bus,qs.stringify({
              name: Yukon.ServiceName.Tenant,
              operation: "GetJsonData",
              token: this.token,
              reqInfo: datas
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            }
          )
          .then(response => {
            var result = response.data;
            if (result.code == 0) {
              if (result.data != null) {
                this.tableData = result.data.slice(
                  (this.currentPage - 1) * this.pagesize,
                  this.currentPage * this.pagesize
                );
                this.tablerows = result.data.length;
              }
            }
          })
          .catch(function(error) {
            alert(error);
          });
      },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pagesize = val;
      this.getTableJsonData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableJsonData();
    }
  }
};
</script>
