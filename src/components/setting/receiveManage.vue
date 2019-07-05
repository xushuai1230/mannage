<template>
  <div class="conmmonlist">
    <div class="actionBar">
      <div class="actionBarList">
        <div class="operationBtn">
          <el-button size="mini" icon="el-icon-circle-plus-outline" @click="refresh">刷新</el-button>
        </div>
        <div class="operationBtn">
          <el-button size="mini" icon="el-icon-circle-plus-outline" @click="Save">保存</el-button>
        </div>
      </div>
    </div>
    <div class="commonTable">
      <div class="listTable receiveManage">
        <el-table
          border
          highlight-current-row
          v-loading="loading"
          height="100%"
          ref="multipleTable"
          :data="tableData"
          empty-text="暂无事件"
          @row-click="toggleSelection"
          @selection-change="handleSelectionChange"
          @select="select"
        >
          <el-table-column type="selection" align="center" width="25"></el-table-column>
          <el-table-column label="消息类型" prop="Name"></el-table-column>
          <el-table-column align="left" width="250" :render-header="RenderHeader">
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.row.SendSys"
                @change="change('SendSys',scope.row.SendSys)"
              />
            </template>
          </el-table-column>
          <el-table-column align="left" :render-header="Renderh" width="250">
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.row.SendEmail"
                @change="change('SendEmail',scope.row.SendEmail)"
              />
            </template>
          </el-table-column>
          <el-table-column align="left" :render-header="Header" width="250">
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.row.SendSms"
                @change="change('SendSms',scope.row.SendSms)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import qs from "qs";
import { mapGetters } from "vuex";
import bus from "../../assets/public/js/eventBus";
export default {
  props: [
    "serviceName",
    "operationTableName",
    "toolBarName",
    "searchName",
    "searchFields",
    "editPageLable",
    "editPageKey"
  ],
  computed: {
    ...mapGetters(["token"])
  },
  data() {
    return {
      tableData: [],
      checkone: false,
      checktwo: false,
      checkthree: false,
      cols: [], // 列信息
      codeFields: [], // 字段集合
      index: 1, // 序号
      filter: "", // 查询条件
      multipleSelection: [], // 选中行的值
      loading: false // loading
    };
  },
  mounted() {
    this.getTableData();
  },

  methods: {
    //复选框事件
    change(data, val) {
      for (var i = 0; i < this.tableData.length; i++) {
        if (data == "SendSys") {
          if (this.tableData[i].SendSys == false) {
            this.checkone = false;
            break;
          } else {
            this.checkone = true;
          }
        }
        if (data == "SendEmail") {
          if (this.tableData[i].SendEmail == false) {
            this.checktwo = false;
            break;
          } else {
            this.checktwo = true;
          }
        }
        if (data == "SendSms") {
          if (this.tableData[i].SendSms == false) {
            this.checkthree = false;
            break;
          } else {
            this.checkthree = true;
          }
        }
      }
    },
    // 获取表格数据
    getTableData() {
      var data = {
        Name: "EventMessageConfig",
        DefaultVal: "SearchPage",
        CurrentPage: 1,
        PageSize: 10,
        Properties: ["Id", "Name", "SendSys", "SendSms", "SendEmail"]
      };
      var reqInfoData = JSON.stringify(data);
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: Yukon.ServiceName.Workflow,
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
            if (getJsonDatafields) {
              for (var i = 0; i < getJsonDatafields.length; i++) {
                if (getJsonDatafields[i].SendEmail == "否") {
                  getJsonDatafields[i].SendEmail = false;
                }
                if (getJsonDatafields[i].SendEmail == "是") {
                  getJsonDatafields[i].SendEmail = true;
                }
                if (getJsonDatafields[i].SendSms == "否") {
                  getJsonDatafields[i].SendSms = false;
                }
                if (getJsonDatafields[i].SendSms == "是") {
                  getJsonDatafields[i].SendSms = true;
                }
                if (getJsonDatafields[i].SendSys == "否") {
                  getJsonDatafields[i].SendSys = false;
                }
                if (getJsonDatafields[i].SendSys == "是") {
                  getJsonDatafields[i].SendSys = true;
                }
              }
            }
            console.log(getJsonDatafields);
            this.tableData = getJsonDatafields;
            this.totalItems = result.TotalRow;
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    //系统
    RenderHeader(h) {
      return h("span", [
        h("el-checkbox", {
          on: {
            change: val => {
              this.checkone = val;
              for (var i = 0; i < this.tableData.length; i++) {
                if (val == true) {
                  this.tableData[i].SendSys = true;
                } else {
                  this.tableData[i].SendSys = false;
                }
              }
            }
          },
          props: {
            value: this.checkone
          },
          style: {
            "margin-right": "5px"
          }
        }),
        h("span", "系统")
      ]);
    },
    //邮箱
    Renderh(h) {
      return h("span", [
        h("el-checkbox", {
          on: {
            change: val => {
              this.checktwo = val;

              for (var i = 0; i < this.tableData.length; i++) {
                if (val == true) {
                  this.tableData[i].SendEmail = true;
                } else {
                  this.tableData[i].SendEmail = false;
                }
              }
            }
          },
          props: {
            value: this.checktwo
          },
          style: {
            "margin-right": "5px"
          }
        }),
        h("span", "邮箱")
      ]);
    },
    //短信
    Header(h) {
      return h("span", [
        h("el-checkbox", {
          on: {
            change: val => {
              this.checkthree = val;

              for (var i = 0; i < this.tableData.length; i++) {
                if (val == true) {
                  this.tableData[i].SendSms = true;
                } else {
                  this.tableData[i].SendSms = false;
                }
              }
            }
          },
          props: {
            value: this.checkthree
          },
          style: {
            "margin-right": "5px"
          }
        }),
        h("span", "短信")
      ]);
    },
    select(selection, row) {},
    refresh() {
      this.getTableData();
      this.$message({
        type: "success",
        message: "刷新成功"
      });
    },
    //保存
    Save() {
      if (this.multipleSelection.length <= 0) {
        this.$message({
          type: "warning",
          message: "请选择事件"
        });
        return false;
      }
      var data = {
        Name: "EventMessageConfig",
        DefaultVal: "EditSave",
        PropertyValueMaps: this.multipleSelection
      };
      var reqInfoData = JSON.stringify(data);
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: Yukon.ServiceName.Workflow,
            operation: "SetJsonData",
            token: this.token,
            data: reqInfoData
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
              message: "保存成功"
            });
            this.getTableData();
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    // 点击行checkbox
    toggleSelection(rows) {
      //   this.$refs.multipleTable.toggleRowSelection(rows);
    },
    //点击checkbox状态
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // pageSize方法
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.handleCurrentChange(this.currentPage);
    },
    // currentPage
    handleCurrentChange(val) {
      this.currentPage = val;
      this.index = val;
      this.getTableData();
    }
    // 计算分页
  }
};
</script>
<style>
.receiveManage .el-table th {
  border-right: none;
}
.receiveManage .el-table td {
  border-right: none;
}
</style>
