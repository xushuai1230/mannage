<template>
  <div class="treeTable" >
    <el-row class="operationBtn">
        <el-button class="el-button-zk" size="mini" icon="el-icon-circle-plus-outline" @click="NewParent">新增</el-button>
        <el-button class="el-button-zk" size="mini" icon="el-icon-circle-plus-outline" @click = "Refresh">刷新</el-button>
    </el-row>
    <div class="mainTable">
      <TreeGrid :columns="columns" :tree-structure="true" :data-source="tableData" :operates="operates"></TreeGrid>
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
     <!-- 弹框 -->
        <el-dialog 
          v-dialogDrag
          ref="dialog__wrapper"
          top="0"
          :closeOnClickModal=false 
          title="部门维护" 
          class="cover_dialog"
          :visible.sync="dialogFormVisible">
            <div class="cover_dialog_body singleColumn" >
              <el-form size="mini" label-width="120px">
                  <el-form-item label="角色">
                     <el-select v-model="value" placeholder="请选择" auto-complete="off" size="small">
                      <el-option
                        v-for="itemOption in roleData"
                        :key="itemOption.Id"
                        :label="itemOption.Name"
                        :value="itemOption.Id"
                        >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="部门代码">
                     <el-input auto-complete="off" v-model="dialogData.Code" size="small"></el-input>
                  </el-form-item>
                  <el-form-item label="部门名称">
                     <el-input auto-complete="off" v-model="dialogData.Name" size="small"></el-input>
                  </el-form-item>
                  <el-form-item label="备注">
                      <el-input type="textarea" v-model="dialogData.Remark" :rows="5" size="small"></el-input>
                  </el-form-item>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
              <el-button type="primary" size="small" @click="Save">保存</el-button>
            </div>
        </el-dialog>
  </div>
</template>
<script>
  import qs from 'qs';
  import {mapGetters} from 'vuex'
  import TreeGrid from '../common/treeTable/treeGrid.vue'
  export default { 
    components: {
      TreeGrid,
    },
    data() {
      return {
        value: '',
        input: '',
        state:false,
        formLabelWidth: '120px',
        dialogFormVisible:false,
        changeAddEdit:0,
        selectRowId:'',
        tableData: [],
        tablerows:0,
        pagesize:15,//每页的数据条数
        currentPage:1,//默认开始页面
        roleData:[],
        dialogData: {},
        columns: [
          {
            prop: '', 
            width: '80',
            label: ''
          },{
            prop: 'Code', 
            label: '部门代码'
          },{
            prop: 'Name', 
            label: '部门名称'
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
        operates:[
          {
            id:'1',
            label: '新增',
            type: '',
            icon:'el-icon-news',
            show: true,
            disabled: false,
            method: (index, row) => {
              this.New(index, row)
            }
          },{
            id:'2',
            label: '编辑',
            type: '',
            icon:'el-icon-edit',
            show: true,
            disabled: false,
            method: (index, row) => {
              this.Edit(index, row)
            }
          },{
            id:'3',
            label: '删除',
            type: '',
            icon:'el-icon-delete',
            show: true,
            disabled: false,
            method: (index, row) => {
              this.Delete(index, row)
            }
          },
        ],       
      };
    },
    computed: {
      ...mapGetters(['token']),
    },
    created(){
     this.getData();
    },
    methods: { 
      New (index, row) {
        row.RoleId = null; 
        this.changeAddEdit = '1';
        this.getRoleData(row.RoleId);
        this.openForm(row.Id);
      },
      // 编辑
      Edit (index, row) {
        this.changeAddEdit = '2';
        this.getRoleData(row.RoleId);
        this.openForm(row.Id);
      },
      // 删除
      Delete (index, row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          ancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var id=row.Id;
          var dataparams = {"Id": id,"Name": "CstDepartment","DefaultVal": "Delete",}
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
            
          }).catch(function (error) {
            console.log(error);
          });    
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });     
        });
      },
      getData(){
        var dataparams = {
            "Name": "CstDepartment",
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
          var result = response.data;
          if(result.code == 0){
            if(result.data!=null){
              this.tableData = result.data.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize);
              this.tablerows = result.data.length;
            }
          }
        })
        .catch(function (error) {
          alert(error)
        });
      },
      //获取角色下拉框
      getRoleData(roleId){
        var dataparams = {
            "Name": "CstRole",
            "DefaultVal": "SearchAll",
            "Properties": ["Id","Name"]
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
          if(result.code == '0'){
            var property = [];
            if (result.data && result.data.length > 0) {
                for (var idx = 0; idx < result.data.length; idx++) {
                    property.push(result.data[idx].PropertyValueMap)
                }
            }
            this.roleData=property;
            this.value=roleId;
          }else{
            this.$message({
              type: 'error',
              message: result.msg,
            }); 
          }
        })
        .catch(function (error) {
          alert(error)
        });
      },
      getDataById(row){
        var IdList=row;
        var dataparams = {
            "Name": "CstDepartment",
            "DefaultVal": "Search",
            "Filter":"Id,==," +IdList+ ",And;"
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
          if(result.code == '0'){
            var property = [];
            if (result.data && result.data.length > 0) {
                for (var idx = 0; idx < result.data.length; idx++) {
                    property.push(result.data[idx].PropertyValueMap)
                }
            }
            this.selectRowId = property[0].Id;
            if(this.changeAddEdit == '2'){
              this.dialogData = property[0];
            }else{
              this.dialogData={};
            }
          }else{
            this.$message({
              type: 'error',
              message: result.msg,
            }); 
          }
        })
        .catch(function (error) {
          console.log(error);
          alert(error)
        });
      },
      openForm(row){
          this.dialogFormVisible = true;//打开弹框
          this.getDataById(row);
      },
      //刷新
      Refresh(){
        this.getData();
      },
      //新增父节点
      NewParent() {
        this.changeAddEdit = '0';
        this.dialogData={};
        this.dialogFormVisible = true;//打开弹框
        this.getRoleData();
      },
       //保存
      Save(){
        var operation = '-1';
        var paramId = '';
        var paramParentId = '';
        if(this.changeAddEdit == '0'){ //新增父节点 或 子节点
          operation = "NewSave";
        }else if(this.changeAddEdit == '1'){
          operation = "NewSave";
          paramParentId = this.selectRowId;
        } else if(this.changeAddEdit == '2'){ 
          operation = "EditSave";
          paramId = this.selectRowId;
        }
        if(operation== '-1'){

        }else{
          var dataparams = {
            "Name": "TMP_CstDepartment",
            "DefaultVal": operation,
            "PropertyValueMap": {
                "Id": paramId,
                "ParentId": paramParentId,
                "RoleId": this.value,
                "Code": this.dialogData.Code,
                "Name": this.dialogData.Name,
                "Remark": this.dialogData.Remark
            }
          }
          var datas = JSON.stringify(dataparams);
          this.$http.post(Yukon.Url.Bus,qs.stringify({
            "name":Yukon.ServiceName.Tenant,
            "operation":"SetJsonData",
            "token":this.token,
            "data": datas
          }),{
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then((response)=>{ 
            var result = response.data;
            if(result.code == '0'){
              this.dialogFormVisible = false;//关闭弹框
              this.getData();//刷新页面
            }else{
              this.$message({
                type: 'error',
                message: result.msg,
              }); 
            }
          })
          .catch(function (error) {
            console.log(error);
            alert(error)
          });
        }
      },
      handleSizeChange(val) {
       this.currentPage = 1;
       this.pagesize=val;
       this.getData();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getData();
      }
    },
  };
</script>
<style scoped lang="less">
</style>