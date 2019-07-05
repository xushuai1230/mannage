
<template>
  <el-dialog
    title="单据流转"
    :visible.sync="dialogVisible"
    top="0"
    class="big_dialog exportImport"
    v-dialogDrag
    :before-close="btnCancel"
  >
    <div class="formcenter">
      <el-form>
        <div class="workTop">
          <span>服务</span>
          <el-select
            class="combobox"
            v-model="server"
            placeholder="请选择"
            @change="getDocumentList(false)"
          >
            <el-option
              v-for="item in serverData"
              :key="item.Name"
              :label="item.DisplayName"
              :value="item.Name"
            ></el-option>
          </el-select>
        </div>
        <div class="workTop">
          <span>服务</span>
          <el-select
            class="combobox"
            v-model="server"
            placeholder="请选择"
            @change="getDocumentList(false)"
          >
            <el-option
              v-for="item in serverData"
              :key="item.Name"
              :label="item.DisplayName"
              :value="item.Name"
            ></el-option>
          </el-select>
        </div>
        <div class="workInput">
          <span>单据</span>
          <el-select
            class="combobox"
            v-model="leftDocuments"
            placeholder="请选择"
            @change="getleftFieldlist(false)"
          >
            <el-option
              v-for="item in leftDocumentsData"
              :key="item.Name"
              :label="item.DisplayName"
              :value="item.Name"
            ></el-option>
          </el-select>
          <span>源租户</span>
          <el-select class="combobox" v-model="sourceTenant" placeholder="请选择">
            <el-option
              v-for="item in sourceTenantData"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id"
            ></el-option>
          </el-select>
          <span>字段</span>
          <el-select class="combobox" v-model="leftField" placeholder="请选择">
            <el-option
              v-for="item in leftFieldData"
              :key="item.Name"
              :label="item.DisplayName"
              :value="item.Name"
            ></el-option>
          </el-select>
        </div>
        <div class="workInput">
          <span>单据</span>
          <el-select
            class="combobox"
            v-model="rightDocuments"
            placeholder="请选择"
            @change="getrightFieldlist(false)"
          >
            <el-option
              v-for="item in rightDocumentsData"
              :key="item.Name"
              :label="item.DisplayName"
              :value="item.Name"
            ></el-option>
          </el-select>
          <span>目标租户</span>
          <el-select class="combobox" v-model="targetTenant" multiple filterable placeholder="请选择">
            <el-option
              v-for="item in targetTenantData"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id"
            ></el-option>
          </el-select>
          <span>字段</span>
          <el-select class="combobox" v-model="rightField" placeholder="请选择">
            <el-option
              v-for="item in rightFieldData"
              :key="item.Name"
              :label="item.DisplayName"
              :value="item.Name"
            ></el-option>
          </el-select>
        </div>

        <div class="edit">
          <span>条件</span>
          <el-input placeholder="请输入内容" v-model="conditions"></el-input>
        </div>
        <div class="workerFlowBomBtn">
          <el-button class="commit" @click="addField" type="text" size="mini">新 增</el-button>
          <el-button
            class="commit"
            @click="fileDelete"
            type="text"
            :disabled="fileDeleData.length==0"
            size="mini"
          >删 除</el-button>
        </div>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%;"
      height="260"
      size="mini"
      @selection-change="tableSelectionChange"
      @current-change="currentChange"
    >
      <el-table-column type="index" width="50" fixed align="center"></el-table-column>
      <el-table-column type="selection" width="55" fixed align="center"></el-table-column>
      <el-table-column prop="From" label="源租户" align="center"></el-table-column>
      <el-table-column prop="To" label="目标租户" align="center"></el-table-column>
    </el-table>

    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="btnCancel">取消</el-button>
      <el-button size="small" type="primary" @click="getPair">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import "../GooFlow/assets/dialog.scss";
import bus from "../../../../assets/public/js/eventBus";
import { mapGetters } from "vuex";
export default {
  name: "exportDialog",
  props: ["exportDialogVisible", "nodeId"],
  data() {
    return {
      dialogVisible: this.exportDialogVisible,
      // 订单信息 导入导出字段对应设置
      emailDialogVisible: false,
      scheduleDialogVisible: false,
      conditions: "", // 条件
      tableData: [], // 导入导出表格
      vaildTableArr: [], //验证 导入导出表格是否重复
      server: "", //服务值
      serverData: [], // 服务list
      leftDocuments: "", // 左边单据值
      rightDocuments: [], // 右边单据值
      leftDocumentsData: "", // 左边单据list
      rightDocumentsData: [], // 右边单据list
      sourceTenant: "", // 源租户值
      sourceTenantData: "", // 源租户list
      targetTenant: [], // 目标租户值
      targetTenantData: "", // 目标租户list
      leftField: "", // 左边字段值
      leftFieldData: [], // 左边字段list
      rightField: "", // 右边字段值
      rightFieldData: [], // 右边字段list
      getRightData: "", //表格历史几率值
      fileDeleData: [] //表格删除数据
    };
  },
  computed: {
    ...mapGetters(["token", "WFData"])
  },
  mounted() {
    this.tenant();
    this.history();
  },
  methods: {
    //历史信息
    history() {
      var getWorkData = this.WFData.workFlowData;
      var workShow = true;
      if (getWorkData.length > 0) {
        //如果存入缓存的接口数据不为空就取接口数据，否则就取之前存入缓存的数据
        for (var i = 0; i < getWorkData.length; i++) {
          if (getWorkData[i].InParameters.Params.id == this.nodeId) {
            workShow = false;
            this.vaildTableArr = [];
            this.getRightData = getWorkData[i].InParameters.Params;
            this.vaildTableArr =
              getWorkData[i].InParameters.Params.DataMap.PropertyValueMap;
          }
        }
      }
      if (workShow) {
        this.getServerList(false);
      } else {
        this.getServerList(true);
      }
    },
    // 获取导入导出服务列表
    getServerList(val) {
      var reqInfo = JSON.stringify({
        Name: "GetService"
      });
      this.$http
        .post(Yukon.Url.Bus, {
          name: Yukon.ServiceName.Workflow,
          operation: "GetJsonData",
          token: this.token,
          reqInfo: reqInfo
        })
        .then(res => {
          var result = res.data;
          if (result.code == 0) {
            this.serverData = result.data;
            if (val) {
              this.listData(true);
            }
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //工单流转
    listData(val) {
      this.server = this.getRightData.Service;
      this.conditions = this.getRightData.TriggerState;
      this.targetTenant = this.getRightData.ToTenant;
      this.sourceTenant = this.getRightData.Tenant;
      if (val) {
        this.getDocumentList(true);
      }
    },
    // 获取导入导出单据list
    getDocumentList(val) {
      if (!val) {
        this.leftDocuments = "";
        this.rightDocuments = "";
        this.conditions = "";
        this.targetTenant = [];
        this.leftFieldData = [];
        this.leftField = "";
        this.rightFieldData = [];
        this.rightField = "";
        this.vaildTableArr = [];
        this.tableData = [];
      }

      var reqInfo = JSON.stringify({
        Name: "ServiceTable",
        Filter: JSON.stringify({
          ServiceName: this.server
        })
      });
      this.$http
        .post(Yukon.Url.Bus, {
          name: Yukon.ServiceName.Workflow,
          operation: "GetJsonData",
          token: this.token,
          reqInfo: reqInfo
        })
        .then(res => {
          var result = res.data;
          if (result.code == 0) {
            this.leftDocumentsData = result.data;
            this.rightDocumentsData = result.data;
            if (val) {
              this.leftDocuments = this.getRightData.Bill;
              this.rightDocuments = this.getRightData.ToBill;
              let arr = JSON.stringify(
                this.getRightData.DataMap.PropertyValueMap
              );
              this.tableData = JSON.parse(arr);
              this.getrightFieldlist(val);
              this.getleftFieldlist(val);
            }
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
    // 获取导入导出用户信息
    tenant() {
      var data = {
        Name: "CstInformation",
        Properties: ["Id", "Code", "Name"],
        SortCondition: {
          CreateTime: "DESC"
        },
        PageSize: 1000,
        DefaultVal: "SearchAll"
      };
      var reqInfo = JSON.stringify(data);
      this.$http
        .post(Yukon.Url.Bus, {
          name: Yukon.ServiceName.Tenant,
          operation: "GetJsonData",
          token: this.token,
          reqInfo: reqInfo
        })
        .then(res => {
          var result = res.data;
          if (result.code == 0) {
            var data = [];
            for (var i = 0; i < result.data.length; i++) {
              data.push(result.data[i].PropertyValueMap);
            }
            this.sourceTenantData = data;
            this.targetTenantData = data;
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取订单信息 导入导出 左边字段list
    getleftFieldlist(val) {
      var reqInfo = JSON.stringify({
        Name: Yukon.ServiceName.ServiceLoadField,
        Filter: JSON.stringify({
          ServiceName: this.server,
          ServiceTable: this.leftDocuments
        })
      });
      this.$http
        .post(Yukon.Url.Bus, {
          name: Yukon.ServiceName.Workflow,
          operation: "GetJsonData",
          token: this.token,
          reqInfo: reqInfo
        })
        .then(res => {
          var result = res.data;
          if (result.code == 0) {
            this.leftFieldData = result.data;
            this.leftField = this.leftFieldData[0].Name;
            if (val) {
              if (this.tableData.length > 0) {
                this.leftField = this.getRightData.DataMap.PropertyValueMap[0].From;
                for (let i = 0; i < this.leftFieldData.length; i++) {
                  for (let j = 0; j < this.tableData.length; j++) {
                    if (this.leftFieldData[i].Name == this.tableData[j].From) {
                      this.tableData[j].From = this.leftFieldData[
                        i
                      ].DisplayName;
                    }
                  }
                }
              }
            } else {
              this.tableData = [];
              this.vaildTableArr = [];
            }
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取订单信息 导入导出 右边字段list
    getrightFieldlist(val) {
      var reqInfo = JSON.stringify({
        Name: Yukon.ServiceName.ServiceLoadField,
        Filter: JSON.stringify({
          ServiceName: this.server,
          ServiceTable: this.rightDocuments
        })
      });
      this.$http
        .post(Yukon.Url.Bus, {
          name: Yukon.ServiceName.Workflow,
          operation: "GetJsonData",
          token: this.token,
          reqInfo: reqInfo
        })
        .then(res => {
          var result = res.data;
          if (result.code == 0) {
            this.rightFieldData = result.data;
            this.rightField = this.rightFieldData[0].Name;
            if (val) {
              if (this.tableData.length > 0) {
                this.rightField = this.getRightData.DataMap.PropertyValueMap[0].To;

                for (let i = 0; i < this.rightFieldData.length; i++) {
                  for (let j = 0; j < this.tableData.length; j++) {
                    if (this.rightFieldData[i].Name == this.tableData[j].To) {
                      this.tableData[j].To = this.rightFieldData[i].DisplayName;
                    }
                  }
                }
              }
            } else {
              this.tableData = [];
              this.vaildTableArr = [];
            }
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 订单信息 导入导出新增
    addField() {
      if (this.rightField != "" && this.leftField != "") {
        if (this.vaildTableArr.length > 0) {
          var tempArr = {
            // "Bill":this.sourceTenant,
            //  "Tobill": this.targetTenant,
            From: this.leftField,
            To: this.rightField,
            Format: ""
          };
          var flag = true;
          for (var i = 0; i < this.vaildTableArr.length; i++) {
            if (
              this.vaildTableArr[i].From == tempArr.From &&
              this.vaildTableArr[i].To == tempArr.To
            ) {
              flag = false;
            }
          }
          if (flag) {
            this.vaildTableArr.push(tempArr);
          } else {
            this.$message({
              type: "warning",
              message: "已添加此选项"
            });
          }
        } else {
          this.vaildTableArr.push({
            // "Bill":this.sourceTenant,
            //  "Tobill": this.targetTenant,
            From: this.leftField,
            To: this.rightField,
            Format: ""
          });
        }
      } else {
        //   alert('请选择字段')
      }
      this.tableData = this.unque(
        JSON.parse(JSON.stringify(this.vaildTableArr))
      );
    },
    fileDelete() {
      for (var i = 0; i < this.tableData.length; i++) {
        this.fileDeleData.forEach(val => {
          if (
            val.From == this.tableData[i].From &&
            val.To == this.tableData[i].To
          ) {
            if (this.vaildTableArr.length > 0) {
              let arr = JSON.stringify(this.vaildTableArr);
              var vaildTableData = this.unque(JSON.parse(arr));
              for (var j = 0; j < vaildTableData.length; j++) {
                if (
                  this.tableData[i].From == vaildTableData[j].From &&
                  this.tableData[i].To == vaildTableData[j].To
                ) {
                  this.vaildTableArr.splice(j, 1);
                }
              }
            }
            this.tableData.splice(i, 1);
          }
        });
      }
    },
    tableSelectionChange(val) {
      this.fileDeleData = val;
    },
    currentChange(val) {
      console.log(val);
    },
    // 订单信息 导入导出表格更改显示内容
    unque(array) {
      for (let i = 0; i < this.leftFieldData.length; i++) {
        for (let j = 0; j < array.length; j++) {
          if (this.leftFieldData[i].Name == array[j].From) {
            array[j].From = this.leftFieldData[i].DisplayName;
          }
        }
      }
      for (let i = 0; i < this.rightFieldData.length; i++) {
        for (let j = 0; j < array.length; j++) {
          if (this.rightFieldData[i].Name == array[j].To) {
            array[j].To = this.rightFieldData[i].DisplayName;
          }
        }
      }
      return array;
    },
    //订单信息 导入导出表格删除
    handleClick(val) {
      for (var i = 0; i < this.tableData.length; i++) {
        if (
          val.From == this.tableData[i].From &&
          val.To == this.tableData[i].To
        ) {
          if (this.vaildTableArr.length > 0) {
            let arr = JSON.stringify(this.vaildTableArr);
            var vaildTableData = this.unque(JSON.parse(arr));
            for (var j = 0; j < vaildTableData.length; j++) {
              if (
                this.tableData[i].From == vaildTableData[j].From &&
                this.tableData[i].To == vaildTableData[j].To
              ) {
                this.vaildTableArr.splice(j, 1);
              }
            }
          }
          this.tableData.splice(i, 1);
        }
      }
    },
    btnCancel() {
      this.dialogVisible = false;
      this.$emit("DialogVisibleFalse", false);
    },
    getPair() {
      var data = {};
      data.Service = this.server;
      data.Bill = this.leftDocuments;
      data.ToBill = this.rightDocuments;
      data.TriggerState = this.conditions;
      data.Tenant = this.sourceTenant;
      data.ToTenant = this.targetTenant;
      data.id = this.nodeId;
      data.DataMap = {};
      data.DataMap.PropertyValueMap = this.vaildTableArr;
      var workData = this.WFData.workFlowData;
      console.log(workData);
      if (workData.length > 0) {
        for (let i = 0; i < workData.length; i++) {
          if (this.nodeId == workData[i].InParameters.Params.id) {
            workData[i].InParameters.Params = data;
          } else {
            workData.push({
              Id: this.nodeId,
              Name: "单据流转",
              InParameters: {
                Params: data
              }
            });
          }
        }
      } else {
        var paramsData = {
          Id: this.nodeId,
          Name: "单据流转",
          InParameters: {
            Params: data
          }
        };
        workData.push(paramsData);
      }
      console.log(workData);
      this.WFData.workFlowData = workData;
      this.$store.dispatch("wfdata", this.WFData);
      this.dialogVisible = false;
      this.$emit("DialogVisibleFalse", false);
    }
  }
};
</script>



