<template>
  <div class="conmmonlist">
    <div class="actionBar">
      <el-row class="actionBarList">
        <div class="operationBtn changeline" v-for="(btn,index) in buttonArray" :key="index">
          <el-button size="mini" :icon="btn.icon" @click="Action(btn.btn)">{{btn.text}}</el-button>
        </div>
        <div class="inputCont">
          <span class="selectTitle">流程名称</span>
          <el-input
            v-model="clientCode"
            @keyup.enter.native="Search"
            placeholder="请输入内容"
            size="mini"
          ></el-input>
          <el-button class="selectButton" size="mini" @click="Search" icon="el-icon-search">搜索</el-button>
        </div>
      </el-row>
    </div>
    <!-- 列表 -->
    <div class="commonTable">
      <div class="listTable">
        <el-table
          :data="tableData"
          ref="multipleTable"
          stripe
          border
          height="100%"
          highlight-current-row
          tooltip-effect="dark"
          empty-text="  "
          @selection-change="handleSelectionChange"
          @row-click="toggleSelection"
          :default-sort="{prop: 'date', order: 'descending'}"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            v-for="col in cols"
            :prop="col.Code"
            :label="col.CnName"
            :key="col.Code"
            sortable
          ></el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="pages">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentpage"
          :page-sizes="[30, 45, 60]"
          :page-size="PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
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
      v-on:dialogVisibleFalse="dialogOperLogClose"
    ></dialogOperationLog>
  </div>
</template>
<script>
import qs from "qs";
import { mapGetters } from "vuex";
import bus from "../../../assets/public/js/eventBus";
import dialogOperationLog from "../../common/dialog/operationLog.vue";
export default {
  components: { dialogOperationLog },
  props: ["event", "operationTableName", "searchName", "searchFields"],
  data() {
    return {
      tableData: [],
      cols: [],
      indexNum: "",
      multipleSelection: [], //是否选中数据
      title: "",
      clientCode: "",
      dialogVisible: false, //高级搜索的弹框
      dialogVisibleColumn: false, //列设置的弹框
      items: [],
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      tableSelectedRowId: [], //table行被选中的id数组
      total: 0, //总条数
      currentpage: 1,
      PageSize: 30,
      buttonArray: [],
      dialogOperLogVisible: false, //操作日志弹框
      dialogCode: "",
      IdList: [],
      serviceName: ""
    };
  },
  created() {
    this.getActionBar();
    this.getColumns();
    this.EditRefresh();
  },
  computed: {
    ...mapGetters(["token", "mid"])
  },
  methods: {
    //渲染bar
    getActionBar() {
      var filter = {
        Service: Yukon.ServiceName.Tenant,
        ModularId: this.mid,
        TabName: "BusinessFlow"
      };
      var filterJson = JSON.stringify(filter);
      var objData = {
        Name: "Authorization",
        DefaultVal: "GetOperationAuthority",
        Filter: filterJson
      };
      var jsonData = JSON.stringify(objData);
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
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
    // 获取字段
    getColumns() {
      var dataparams = JSON.stringify({
        Name: "DBField",
        TblName: "BusinessFlow"
      });
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: Yukon.ServiceName.Workflow,
            operation: "GetJsonData",
            token: this.token,
            reqInfo: dataparams
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(response => {
          var result = response.body;
          var colArr = [];
          var editArr = [];
          if (result.code == 0) {
            var resultData = result.data;
            for (var i = 0; i < resultData.length; i++) {
              if (resultData[i].PropertyValueMap.IsDispaly != 0) {
                colArr.push(resultData[i].PropertyValueMap);
              }
            }
            for (var i = 0; i < resultData.length; i++) {
              editArr.push(resultData[i].PropertyValueMap);
            }
            this.cols = colArr;
            this.getData();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 获取列表数据
    getData() {
      var dataparams = {
        Name: "BusinessFlow",
        DefaultVal: "SearchPage",
        PageSize: this.PageSize,
        CurrentPage: this.currentpage
      };
      var dataJson = JSON.stringify(dataparams);
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: Yukon.ServiceName.Workflow,
            operation: "GetJsonData",
            token: this.token,
            reqInfo: dataJson
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(response => {
          var result = response.body;
          if (result.code == 0) {
            var data = [];
            this.total = result.TotalRow;
            for (var i = 0; i < result.data.length; i++) {
              if (result.data[i].PropertyValueMap.State == 1) {
                result.data[i].PropertyValueMap.State = "是";
              } else if (result.data[i].PropertyValueMap.State == 2) {
                result.data[i].PropertyValueMap.State = "否";
              }
              data.push(result.data[i].PropertyValueMap);
            }
            this.tableData = data;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    Action(name) {
      this.btnDisabled = true;
      this[name]();
    },
    // 搜索
    Search() {
      var proArr = [];
      for (var i = 0; i < this.cols.length; i++) {
        proArr.push(this.cols[i].Code);
      }
      var filter = "";
      if (this.clientCode.length > 0) {
        filter = "Name,%," + this.clientCode + ",And";
      }
      var searchparams = JSON.stringify({
        Name: "BusinessFlow",
        DefaultVal: "SearchPage",
        PageSize: 10,
        CurrentPage: 1,
        Properties: proArr,
        Filter: filter
      });
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: Yukon.ServiceName.Workflow,
            operation: "GetJsonData",
            token: this.token,
            reqInfo: searchparams
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(response => {
          var result = response.body;
          if (result.code === 0) {
            var data = [];
            for (var i = 0; i < result.data.length; i++) {
              data.push(result.data[i].PropertyValueMap);
            }
            this.tableData = data;
          }
        })
        .catch(err => {});
    },
    // 编辑保存刷新表格
    EditRefresh() {
      bus.$on("workFlowRefreshTable", message => {
        if (message) {
          this.getData();
        }
      });
    },
    // 加载默认工作流
    LoadWorkflow() {
      var loadData = JSON.stringify({
        Name: "BusinessFlow",
        DefaultVal: "LoadDefault"
      });
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: Yukon.ServiceName.Workflow,
            operation: "SetJsonData",
            token: this.token,
            data: loadData
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(res => {
          var result = res.body;
          if (result.code == 0) {
            this.getData();
          } else {
            this.$message({
              type: "warning",
              message: result.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 编辑
    Edit() {
      if (this.multipleSelection.length <= 0) {
        this.$alert("请至少选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
      } else if (this.multipleSelection.length > 1) {
        this.$alert("只能选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
      } else {
        this.$store.dispatch("listcheck", this.multipleSelection);
        this.event("BusinessFlowEdit", "工作流维护"); //子组件调用父组件的方法
      }
    },
    //刷新
    Refresh() {
      this.getData();
      this.multipleSelection = "";
    },
    //新增
    New() {
      this.$store.dispatch("listcheck", "");
      this.event("BusinessFlowEdit", "工作流维护"); //子组件调用父组件的方法
    },
    //删除
    Delete() {
      //循环得到选中了哪些id
      for (var i = 0; i < this.multipleSelection.length; i++) {
        this.tableSelectedRowId.push(this.multipleSelection[i].Id);
      }
      if (this.multipleSelection == "") {
        this.$alert("请至少选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            //点击确定之后的操作
          }
        });
      } else {
        var dataparams = {
          Name: "BusinessFlow",
          DefaultVal: "Delete",
          IdList: this.tableSelectedRowId
        };
        var data2 = JSON.stringify(dataparams);
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$http
              .post(
                Yukon.Url.Bus,
                qs.stringify({
                  name: Yukon.ServiceName.Workflow,
                  operation: "SetJsonDelete",
                  token: this.token,
                  reqInfo: data2
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
                    type: "success",
                    message: "删除成功!"
                  });
                  this.getData();
                  this.tableSelectedRowId = [];
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          })
          .catch(() => {
            this.$message({
              type: "error",
              message: "已取消删除"
            });
          });
      }
    },
    //流程设计
    WFProcessDesign() {
      //判断是否选中
      if (this.multipleSelection == "") {
        this.$alert("请至少选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            //点击确定之后的操作
          }
        });
      } else if (this.multipleSelection.length > 1) {
        this.$alert("只能选择一条进行设置", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            //点击确定之后的操作
          }
        });
      } else {
        this.$store.dispatch("listcheck", this.multipleSelection); //流程设计用到的参数
        localStorage.setItem("processCheckId", this.multipleSelection[0].Id);
        localStorage.setItem(
          "processCheckName",
          this.multipleSelection[0].Name
        );
        localStorage.setItem("userToken", this.token);
        this.event("ApprovalFlowProcess", "流程设计"); //子组件调用父组件的方法
      }
    },
    //消息设置
    WFMessage() {
      //判断是否选中
      if (this.multipleSelection == "") {
        this.$alert("请至少选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            //点击确定之后的操作
          }
        });
      } else if (this.multipleSelection.length > 1) {
        this.$alert("只能选择一条进行设置", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            //点击确定之后的操作
          }
        });
      } else {
        this.$store.dispatch("listcheck", this.multipleSelection);
        this.event("BusinessFlowMessageSet", "消息设置"); //子组件调用父组件的方法
      }
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
        this.serviceName = Yukon.ServiceName.Workflow;
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
    },
    handleSizeChange(val) {
      this.currentpage = 1;
      this.PageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentpage = val;
      this.getData();
    }
  }
};
</script>
