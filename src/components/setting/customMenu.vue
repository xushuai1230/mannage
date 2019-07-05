<template>
	<div class="conmmonlist">
    <div class="actionBar">
       <el-row class="actionBarList">
         <div class="operationBtn"  v-for="btn in buttonArray" >
           <el-button size="mini" :icon="btn.icon"   @click="Action(btn.btn)" >{{btn.text}}</el-button>
         </div>
      </el-row>
    </div>
		<div class="commonTable" >  
      <el-table   
        ref="multipleTable"  
        highlight-current-row
        tooltip-effect="dark"
        show-overflow-tooltip="true"
        height="100%"
        stripe 
        border
        empty-text="  "
        :data="tableData"
        :default-sort = "{Code: 'Id', order: 'descending'}"
        @selection-change="handleSelectionChange">   
          <el-table-column type='index'  label='序号' width="55"> </el-table-column>
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="编号"  :show-overflow-tooltip="true"sortable  prop="Code"></el-table-column>
          <el-table-column label="名称"  :show-overflow-tooltip="true"sortable  prop="Name"></el-table-column>
          <el-table-column label="图标"  :show-overflow-tooltip="true"sortable prop="Icon"></el-table-column>
          <el-table-column label="排序"  :show-overflow-tooltip="true"sortable  prop="Sort"></el-table-column>
          <el-table-column label="Url地址":show-overflow-tooltip="true" sortable  prop="Url"></el-table-column>
          <el-table-column label="状态"  :show-overflow-tooltip="true"sortable   prop="State"></el-table-column>
          <el-table-column label="备注"  :show-overflow-tooltip="true"sortable prop="Remark"></el-table-column>
          <el-table-column label="创建时间" :show-overflow-tooltip="true"sortable prop="CreateTime"></el-table-column>    
       </el-table>
    </div>
    <el-dialog
      v-dialogDrag
      ref="dialog__wrapper"
      title="自定义菜单"
      top="0"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :closeOnClickModal=false
      class="medium_dialog">
      <div class="formcenter">
         <el-form :inline="true" size="mini">
            <div>
              <el-col>
                <el-col :span="7" style="text-align: right;">
                  <el-form-item label="编号"></el-form-item>
                </el-col>
                <el-col :span="17">
                  <el-input v-model="form.Code" size="mini"></el-input>
                </el-col>
              </el-col>
              <el-col>
                <el-col :span="7" style="text-align: right;">
                  <el-form-item label="菜单名称"></el-form-item>
                </el-col>
                <el-col :span="17">
                  <el-input v-model="form.Name" size="mini"></el-input>
                </el-col>
              </el-col>
              <el-col>
                <el-col :span="7" style="text-align: right;">
                  <el-form-item label="图标"></el-form-item>
                </el-col>
                <el-col :span="17">
                  <el-input v-model="form.Icon" size="mini"></el-input>
                </el-col>
              </el-col>
              <el-col>
                <el-col :span="7" style="text-align: right;">
                  <el-form-item label="排序"></el-form-item>
                </el-col>
                <el-col :span="17">
                  <el-input v-model="form.Sort" size="mini"></el-input>
                </el-col>
              </el-col>
              <el-col>
                <el-col :span="7" style="text-align: right;">
                  <el-form-item label="Url地址"></el-form-item>
                </el-col>
                <el-col :span="17">
                  <el-input v-model="form.Url" size="mini"></el-input>
                </el-col>
              </el-col>
              <el-col>
                <el-col :span="7" style="text-align: right;">
                  <el-form-item label="状态"></el-form-item>
                </el-col>
                <el-col :span="17">
                  <el-radio v-model="form.State" label="13" >启用</el-radio>
                  <el-radio v-model="form.State" label="14" >停用</el-radio>
                </el-col>
              </el-col>
              <el-col>
                <el-col :span="7" style="text-align: right;">
                  <el-form-item label="创建时间"></el-form-item>
                </el-col>
                <el-col :span="17">
                  <el-input v-model="form.CreateTime" size="mini" :disabled="true"></el-input>
                </el-col>
              </el-col>
              <el-col>
                <el-col :span="7" style="text-align: right;">
                  <el-form-item label="备注"></el-form-item>
                </el-col>
                <el-col :span="17">
                  <el-input v-model="form.Remark" size="mini"></el-input>
                </el-col>
              </el-col>
            </div>
        </el-form>
      </div>   
      <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" size="small" @click="Save">保存</el-button>
      </div>
    </el-dialog>
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
import qs from "qs";
import { mapGetters } from "vuex";
import dialogOperationLog from "../common/dialog/operationLog.vue";
export default {
  components: { dialogOperationLog },
  props: ["operationTableName", "searchName", "searchFields"],
  data() {
    return {
      tableData: [],
      form: {
        Id: "",
        Code: "",
        Name: "",
        Icon: "",
        Sort: "",
        Url: "",
        State: "0",
        Remark: ""
      },
      buttonArray: [],
      emptyText: "正在加载中",
      index: "1",
      dialogVisible: false, //控制对话框显示隐藏
      multipleSelection: [],
      dialogOperLogVisible: false, //操作日志弹框
      IdList: [],
      dialogCode: "",
      serviceName: ""
    };
  },
  computed: {
    ...mapGetters(["token", "mid"])
  },
  mounted() {
    this.getTableDataValue();
    this.getActionBar();
  },
  methods: {
    //渲染bar
    getActionBar() {
      var filter = {
        Service: Yukon.ServiceName.Tenant,
        ModularId: this.mid,
        TabName: "CstUserDefinedMenu"
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
          }
        )
        .then(response => {
          var result = response.data;
          if (result.code == 0) {
            var columnsData = result.data;
            this.buttonArray = columnsData;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    Action(name) {
      this.btnDisabled = true;
      this[name]();
    },
    Refresh() {
      this.getTableDataValue();
    },
    //获取table数据
    getTableDataValue() {
      var data = {
        Name: "CstUserDefinedMenu",
        DefaultVal: "SearchAll",
        Properties: [
          "Id",
          "Code",
          "Name",
          "Icon",
          "Sort",
          "Url",
          "State",
          "Remark",
          "CreateTime"
        ]
      };
      var reqInfoData = JSON.stringify(data);
      this.$http.post(Yukon.Url.Bus,qs.stringify({
            name: Yukon.ServiceName.Tenant,
            operation: "GetJsonData",
            token: this.token,
            reqInfo: reqInfoData
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
            var columnsData = result.data;
            var getJsonDatafields = new Array();
            for (var p in columnsData) {
              getJsonDatafields[p] = columnsData[p].PropertyValueMap;
            }
            this.emptyText = "暂无数据";
            this.tableData = getJsonDatafields;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //关闭对话框
    handleClose(done) {
      this.dialogVisible = false;
      this.getTableDataValue();
    },
    //打开新增界面
    New() {
      this.dialogVisible = true;
      this.form = {
        Id: "",
        Code: "",
        Name: "",
        Icon: "",
        Sort: "",
        Url: "",
        State: "13",
        Remark: "",
        CreateTime: ""
      };
    },
    //打开编辑界面
    Edit() {
      if (!this.multipleSelection || this.multipleSelection.length <= 0) {
          this.$alert("请至少选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            //点击确定之后的操作
          }
        });
      } else {
        if (this.multipleSelection[0].State == "启用") {
            this.multipleSelection[0].State = "13";
        } else {
            this.multipleSelection[0].State = "14";
        }
            this.form = this.multipleSelection[0];
            this.dialogVisible = true;
      }
    },
    //删除
    Delete() {
      if (!this.multipleSelection || this.multipleSelection.length <= 0) {
        this.$alert("请至少选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            //点击确定之后的操作
          }
        });
      } else {
        var idArray = [];
        for (var i in this.multipleSelection) {
           idArray.push(this.multipleSelection[i].Id);
        }
        var dataparams = {
          IdList: idArray,
          Name: "CstUserDefinedMenu",
          DefaultVal: "Delete"
        };
        var datas = JSON.stringify(dataparams);
        this.$http.post(Yukon.Url.Bus, qs.stringify({
              name: Yukon.ServiceName.Tenant,
              operation: "SetJsonDelete",
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
            if (result.code == "0") {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getTableDataValue();
            } else {
              this.$message({
                type: "error",
                message: result.msg
              });
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    //保存
    Save() {
      var operation = "NewSave";
      if (this.form.Id != "") {
        operation = "EditSave";
      }
      var obj = new Object();
      var setData = {
        Name: "CstUserDefinedMenu",
        DefaultVal: operation,
        PropertyValueMap: this.form
      };
      var data = JSON.stringify(setData);
      this.$http.post(Yukon.Url.Bus,qs.stringify({
            name: Yukon.ServiceName.Tenant,
            operation: "SetJsonData",
            token: this.token,
            data: data
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
            this.$message({
              message: "保存成功",
              type: "success"
            });
            //刷新页面
            this.dialogVisible = false;
            this.getTableDataValue();
          } else {
            this.$alert(result.msg, "提示", {
              confirmButtonText: "确定",
              callback: action => {}
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //操作日志
    OperationLog() {
      if (!this.multipleSelection || this.multipleSelection.length <= 0) {
        this.$alert("请至少选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.btnDisabled = false;
          }
        });
      } else if (this.multipleSelection.length > 1) {
        this.$alert("只能选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.btnDisabled = false;
          }
        });
      } else {
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
    // 点击当前行选中checkbox状态
    toggleSelection(rows) {
      this.$refs.multipleTable.toggleRowSelection(rows);
    },
    // 每勾选一个CheckBox都会触发的事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>
