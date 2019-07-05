<template>
  <div>
    <el-row class="actionBarList">
      <div class="operationBtn" v-for="btn in buttonArray">
        <el-button
          size="mini"
          :icon="btn.icon"
          v-if="btn.text!='导入'"
          :disabled="btnDisabled"
          @click="Action(btn.btn)"
        >{{btn.text}}</el-button>
        <el-upload
          class="upload-demo"
          :before-upload="beforeAvatarUpload"
          action="http://192.168.0.119:8071/api/Manage/Import"
          multiple
        >
          <el-button
            size="mini"
            :icon="btn.icon"
            :disabled="btnDisabled"
            v-if="btn.text=='导入'"
            @click="Action(btn.btn)"
          >{{btn.text}}</el-button>
        </el-upload>
      </div>
      <!--搜索按钮组-->
      <div class="inputCont">
        <span class="selectTitle" id="Logo">{{searchName}}</span>
        <el-input v-model="input" size="mini"></el-input>
        <el-button class="selectButton" size="mini" icon="el-icon-search" @click="btnSearch">搜索</el-button>
      </div>
    </el-row>
    <div></div>
    <!--续约-->
    <dialogRenewContract
      v-if="dialogRenewContractVisible"
      :dialogRenewContractVisible="dialogRenewContractVisible"
      :dialogCode="dialogCode"
      :operationTableName="operationTableName"
      :IdList="IdList"
      v-on:dialogVisibleFalse="dialogRenewContractClose"
    ></dialogRenewContract>
    <!--升级-->
    <dialogCustomerUpgrade
      v-if="dialogCustomerUpgradeVisible"
      :dialogCustomerUpgradeVisible="dialogCustomerUpgradeVisible"
      :dialogCode="dialogCode"
      :operationTableName="operationTableName"
      :IdList="IdList"
      v-on:dialogVisibleFalse="dialogCustomerUpgradeClose"
    ></dialogCustomerUpgrade>
    <!--授权-->
    <dialogGrantAuthorization
      v-if="dialogGrantVisible"
      :dialogGrantVisible="dialogGrantVisible"
      :dialogCode="dialogCode"
      :operationTableName="operationTableName"
      :IdList="IdList"
      v-on:dialogVisibleFalse="dialogGrantClose"
    ></dialogGrantAuthorization>
    <!--审核-->
    <dialogApproveResult
      v-if="dialogApproveVisible"
      :dialogApproveVisible="dialogApproveVisible"
      :dialogCode="dialogCode"
      :operationTableName="operationTableName"
      :IdList="IdList"
      :approveData="approveData"
      v-on:dialogVisibleFalse="dialogApproveClose"
    ></dialogApproveResult>
    <!--更改密码-->
    <dialogChangePassword
      v-if="dialogPasswordVisible"
      :dialogPasswordVisible="dialogPasswordVisible"
      :dialogCode="dialogCode"
      :operationTableName="operationTableName"
      :IdList="IdList"
      v-on:dialogVisibleFalse="dialogPasswordClose"
    ></dialogChangePassword>
    <!-- 更改默认账户 -->
    <dialogChangeDefaultAcount
      v-if="dialogDefaultAcountVisible"
      :dialogDefaultAcountVisible="dialogDefaultAcountVisible"
      :dialogCode="dialogCode"
      :IdList="IdList"
      :operationTableName="operationTableName"
      v-on:dialogVisibleFalse="dialogDefaultAcountClose"
    ></dialogChangeDefaultAcount>
    <!--排程参数-->
    <dialogScheduleParam
      v-if="dialogScheduleParamVisible"
      :dialogScheduleVisible="dialogScheduleParamVisible"
      :serviceName="serviceName"
      :dialogCode="dialogCode"
      :operationTableName="operationTableName"
      :IdList="IdList"
      v-on:dialogVisibleFalse="dialogScheduleParamClose"
    ></dialogScheduleParam>
    <!--排程规则-->
    <dialogScheduleRole
      v-if="dialogScheduleRoleVisible"
      :dialogScheduleRoleVisible="dialogScheduleRoleVisible"
      :serviceName="serviceName"
      :dialogCode="dialogCode"
      :operationTableName="operationTableName"
      :IdList="IdList"
      v-on:dialogVisibleFalse="dialogScheduleRoleClose"
    ></dialogScheduleRole>
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
    <!-- 高级权限 -->
    <dialogAdvancedPermission
      v-if="dialogAdvancedPermissionVisible"
      :dialogAdvancedPermissionVisible="dialogAdvancedPermissionVisible"
      :serviceName="serviceName"
      :dialogCode="dialogCode"
      :operationTableName="operationTableName"
      :IdList="IdList"
      v-on:dialogVisibleFalse="dialogAdvancedPermissionClose"
    ></dialogAdvancedPermission>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import qs from "qs";
import bus from "../../../assets/public/js/eventBus";
import dialogScheduleRole from "../dialog/scheduleRole.vue";
import dialogScheduleParam from "../dialog/schedueParam.vue";
import dialogRenewContract from "../dialog/renewContract.vue";
import dialogCustomerUpgrade from "../dialog/customerUpgrade.vue";
import dialogGrantAuthorization from "../dialog/grantAuthorization.vue";
import dialogApproveResult from "../dialog/approveResult.vue";
import dialogChangePassword from "../dialog/changePassword.vue";
import dialogChangeDefaultAcount from "../dialog/changeDefaultAcount.vue";
import dialogOperationLog from "../dialog/operationLog.vue";
import dialogAdvancedPermission from "../dialog/advancedPermission.vue";
export default {
  components: {
    dialogRenewContract,
    dialogCustomerUpgrade,
    dialogGrantAuthorization,
    dialogApproveResult,
    dialogChangePassword,
    dialogChangeDefaultAcount,
    dialogScheduleParam,
    dialogScheduleRole,
    dialogOperationLog,
    dialogAdvancedPermission
  },
  props: [
    "serviceName",
    "operationTableName",
    "toolBarName",
    "searchName",
    "searchFields",
    "multipleSelection",
    "editPageLable",
    "editPageKey"
  ],
  data() {
    return {
      input: "", // 搜索输入框
      buttonArray: [], //
      dialogRenewContractVisible: false, // 续约
      dialogCustomerUpgradeVisible: false, // 升级
      dialogGrantVisible: false, // 授权
      dialogApproveVisible: false, // 审核
      dialogPasswordVisible: false, // 更改密码
      dialogDefaultAcountVisible: false, // 更改默认账户
      dialogScheduleParamVisible: false, // 排程参数
      dialogScheduleRoleVisible: false, // 排程规则
      dialogOperLogVisible: false, // 操作日志
      dialogAdvancedPermissionVisible: false, // 高级权限
      dialogCode: "",
      itemParaValue: "",
      Frequency: "",
      Population: "",
      optionsData: "",
      IdList: [],
      btnDisabled: false,
      approveData: []
    };
  },
  computed: {
    ...mapGetters(["token", "mid"])
  },
  created() {
    this.getActionBar();
  },
  methods: {
    getActionBar() {
      var name = this.toolBarName;
      if (name == null || name == "") {
        name = this.operationTableName;
      }
      var filter = {
        Service: Yukon.ServiceName.Tenant,
        ModularId: this.mid,
        TabName: name
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
        .catch(error => {});
    },
    beforeAvatarUpload(file) {
      var objData = {
        Name: this.operationTableName
      };
      var data = JSON.stringify(objData);
      this.formData = null;
      this.formData = new FormData();
      this.formData.append("token", this.token);
      this.formData.append("data", data);
      this.formData.append("", file);
      this.$http
        .post(Yukon.Url.Tenant_Import, this.formData, {})
        .then(function(response) {
          var result = response.body;
          if (result.code == "0") {
            this.$message({
              type: "success",
              message: "导入成功!"
            });
            this.$emit("listenerRefreshTable", "refresh"); //刷新table
          } else {
            this.$message({
              type: "error",
              message: result.msg
            });
          }
          this.btnDisabled = false;
        })
        .catch(function(error) {
          this.btnDisabled = false;
        });
      return false;
    },
    // ------------------- 操作栏 ------------------- //
    // 刷新 Refresh 新建 New  新增子类 NewChild    复制 Copy    编辑 Edit    保存 Save     提交 Submit  撤销 Undo  浏览 Browse 查询 Search 确认 Confirm
    // 取消 Cancel  审核 Approve  更改 Modify  删除 Delete  启用 StartUse 停用 StopUse 打印 Print 预览 Preview 导入 Import 导出 Export
    // 上传 Upload  下载 Download 续约 Renewal 升级 Upgrade 授权 Empower  排程规则 ScheduleRole
    // 断开连接 Disconnect  流程设计 WFProcessDesign 消息设置 WFMessage 未读 Unread 已读 Read 标记已读 SignRead 转发 Forward aps高级 ApsPermission
    // ---------------------------------------------- //
    Action(name) {
      this.btnDisabled = true;
      this[name]();
    },
    // 新建
    New() {
      var timestamp = new Date().getTime();
      var data = {
        Time: timestamp,
        Action: "NewSave"
      };
      bus.$emit(
        "receivesCreateTabValue",
        this.editPageKey,
        this.editPageLable,
        "",
        "",
        data
      );
      this.btnDisabled = false;
    },
    //新增子项
    NewChild() {
      if (this.multipleSelection.length == 1) {
        var timestamp = new Date().getTime();
        var data = {
          Time: timestamp,
          ParentId: this.multipleSelection[0].Id,
          Action: "NewSave"
        };
        bus.$emit(
          "receivesCreateTabValue",
          this.editPageKey,
          this.editPageLable,
          "",
          "",
          data
        );
      } else {
        this.$alert("请至少选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
      }
      this.btnDisabled = false;
    },
    // 复制
    Copy() {},
    // 编辑
    Edit() {
      if (this.multipleSelection.length == 0) {
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
        var timestamp = new Date().getTime();
        var data = {
          Time: timestamp,
          EditId: this.multipleSelection[0].Id,
          Action: "EditSave"
        };
        bus.$emit(
          "receivesCreateTabValue",
          this.editPageKey,
          this.editPageLable,
          "",
          "",
          data
        );
      }
      this.btnDisabled = false;
    },
    //搜索
    btnSearch() {
      this.$emit("listenerRefreshTable", "btnSearch", this.input.trim()); //刷新table
      this.btnDisabled = false;
    },
    // 保存
    Save() {
      this.$emit("listenerRefreshTable", "refresh"); //刷新table
      this.btnDisabled = false;
    },
    // 提交
    Submit() {
      this.$emit("listenerRefreshTable", "refresh"); //刷新table
      this.btnDisabled = false;
    },
    // 撤销
    Undo() {
      this.$emit("listenerRefreshTable", "refresh"); //刷新table
      this.btnDisabled = false;
    },
    // 刷新
    Refresh() {
      this.$emit("listenerRefreshTable", "refresh", ""); //刷新table
      this.btnDisabled = false;
    },
    // 浏览
    Browse() {
      this.btnDisabled = false;
    },
    // 查询
    Search() {
      this.btnDisabled = false;
    },
    // 确认
    Confirm() {
      this.btnDisabled = false;
    },
    // 取消
    Cancel() {
      this.btnDisabled = false;
      this.$emit("listenerRefreshTable", "refresh"); //刷新table
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
      }
    },
    UpdateDefaultAccount() {
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
        this.dialogCode = "更改默认账户";
        this.dialogDefaultAcountVisible = true;
      }
    },
    //更改密码
    UpdatePassword() {
      if (!this.multipleSelection || this.multipleSelection.length <= 0) {
        this.$alert("请至少选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.btnDisabled = false;
          }
        });
      } else {
        this.IdList = [];
        this.IdList.push(this.multipleSelection[0].Id);
        this.dialogCode = "更改密码";
        this.dialogPasswordVisible = true;
      }
    },
    // 审核
    Approve() {
      if (!this.multipleSelection || this.multipleSelection.length <= 0) {
        this.$alert("请至少选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.btnDisabled = false;
          }
        });
      } else {
        this.IdList = [];
        this.IdList.push(this.multipleSelection[0].Id);
        this.approveData = this.multipleSelection[0];
        this.dialogCode = "审核";
        this.dialogApproveVisible = true;
      }
    },
    // 更改
    Modify() {
      this.btnDisabled = false;
    },
    //排程参数
    ScheduleParam() {
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
        this.dialogCode = "排程参数";
        this.dialogScheduleParamVisible = true;
      }
    },
    // 排程规则
    ScheduleRole() {
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
        this.dialogCode = "排程规则";
        this.dialogScheduleRoleVisible = true;
      }
    },
    // 删除
    Delete() {
      if (!this.multipleSelection || this.multipleSelection.length <= 0) {
        this.$alert("请至少选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.btnDisabled = false;
          }
        });
      } else {
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            var IdList = [];
            for (var i = 0; i < this.multipleSelection.length; i++) {
              IdList.push(this.multipleSelection[i].Id);
            }
            var dataparams = {
              IdList: IdList,
              Name: this.operationTableName,
              DefaultVal: "Delete"
            };
            var datas = JSON.stringify(dataparams);
            this.$http
              .post(
                Yukon.Url.Bus,
                qs.stringify({
                  name: this.serviceName,
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
                  this.$emit("listenerRefreshTable", "refresh"); //刷新table
                } else {
                  this.$message({
                    type: "error",
                    message: result.msg
                  });
                }
                this.btnDisabled = false;
              })
              .catch(error => {
                this.$message({
                  type: "error",
                  message: "执行出错"
                });
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
            this.btnDisabled = false;
          });
      }
    },
    //邀请
    InvitationRegister() {
      if (!this.multipleSelection || this.multipleSelection.length <= 0) {
        this.$alert("请至少选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.btnDisabled = false;
          }
        });
      } else {
        var IdList = [];
        for (var i = 0; i < this.multipleSelection.length; i++) {
          IdList.push(this.multipleSelection[i].Id);
        }
        var dataparams = {
          IdList: IdList,
          Name: this.operationTableName,
          DefaultVal: "InvitationRegister"
        };
        var datas = JSON.stringify(dataparams);
        this.$http
          .post(
            Yukon.Url.Bus,
            qs.stringify({
              name: this.serviceName,
              operation: "SetJsonData",
              token: this.token,
              data: datas
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
                message: "邀请成功!"
              });
              //this.$emit("listenerRefreshTable", "refresh"); //刷新table
            } else {
              this.$message({
                type: "error",
                message: result.msg
              });
            }
            this.btnDisabled = false;
          })
          .catch(error => {
            this.$message({
              type: "error",
              message: "执行出错"
            });
          });
      }
    },
    // 启用
    StartUse() {
      if (!this.multipleSelection || this.multipleSelection.length <= 0) {
        this.$alert("请至少选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.btnDisabled = false;
          }
        });
      } else {
        var IdList = [];
        for (var i = 0; i < this.multipleSelection.length; i++) {
          IdList.push(this.multipleSelection[i].Id);
        }
        var dataparams = {
          PropertyValueMap: {
            Id: IdList[0]
          },
          Name: this.operationTableName,
          DefaultVal: "Start"
        };
        var datas = JSON.stringify(dataparams);
        this.$http
          .post(
            Yukon.Url.Bus,
            qs.stringify({
              name: this.serviceName,
              operation: "SetJsonData",
              token: this.token,
              data: datas
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
                message: "启用成功!"
              });
              this.$emit("listenerRefreshTable", "refresh"); //刷新table
            } else {
              this.$message({
                type: "error",
                message: result.msg
              });
            }
            this.btnDisabled = false;
          })
          .catch(error => {
            this.$message({
              type: "error",
              message: "执行出错"
            });
            this.btnDisabled = false;
          });
      }
    },
    // 停用
    StopUse() {
      if (!this.multipleSelection || this.multipleSelection.length <= 0) {
        this.$alert("请至少选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.btnDisabled = false;
          }
        });
      } else {
        var IdList = [];
        for (var i = 0; i < this.multipleSelection.length; i++) {
          IdList.push(this.multipleSelection[i].Id);
        }
        var dataparams = {
          PropertyValueMap: {
            Id: IdList[0]
          },
          Name: this.operationTableName,
          DefaultVal: "Stop"
        };
        var datas = JSON.stringify(dataparams);
        this.$http
          .post(
            Yukon.Url.Bus,
            qs.stringify({
              name: this.serviceName,
              operation: "SetJsonData",
              token: this.token,
              data: datas
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
                message: "禁用成功!"
              });
              this.$emit("listenerRefreshTable", "refresh"); //刷新table
            } else {
              this.$message({
                type: "error",
                message: result.msg
              });
            }
            this.btnDisabled = false;
          })
          .catch(error => {
            this.$message({
              type: "error",
              message: "执行出错"
            });
            this.btnDisabled = false;
          });
      }
    },
     //流程设计
    WFProcessDesign() {
      this.btnDisabled = false;
      if (this.multipleSelection == "") {
        this.$alert("请至少选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
      } else if (this.multipleSelection.length > 1) {
        this.$alert("只能选择一条进行设置", "提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
      } else {
        this.$store.dispatch("listcheck", this.multipleSelection); //流程设计用到的参数
        localStorage.setItem("processCheckId", this.multipleSelection[0].Id);
        localStorage.setItem("processCheckName", this.multipleSelection[0].Name);
        bus.$emit(
          "receivesCreateTabValue",
          "BusinessFlowProcess",
          "流程设计",
          "",
          "/index"
        );
      }
    },
    // 打印
    Print() {
      this.btnDisabled = false;
    },
    // 预览
    Preview() {
      this.btnDisabled = false;
    },
    // 导入
    Import() {
      this.btnDisabled = false;
    },
    // 导出
    Export() {
      var objData = {
        Name: this.operationTableName
      };
      var reqInfo = JSON.stringify(objData);
      var form = $("<form>");
      form.attr("style", "display:none");
      form.attr("target", "");
      form.attr("method", "post");
      form.attr("action", Yukon.Url.Tenant_Export);
      var inputToken = $("<input>");
      inputToken.attr("type", "hidden");
      inputToken.attr("name", "token");
      inputToken.attr("value", this.token);
      var inputReqInfo = $("<input>");
      inputReqInfo.attr("type", "hidden");
      inputReqInfo.attr("name", "reqInfo");
      inputReqInfo.attr("value", reqInfo);
      $("body").append(form);
      form.append(inputToken);
      form.append(inputReqInfo);
      form.submit();
      this.btnDisabled = false;
    },
    // 上传
    Upload() {
      this.btnDisabled = false;
    },
    // 下载
    Download() {
      this.btnDisabled = false;
    },
    // 续约
    Renewal() {
      if (!this.multipleSelection || this.multipleSelection.length <= 0) {
        this.$alert("请至少选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.btnDisabled = false;
          }
        });
      } else {
        this.IdList = [];
        for (var i = 0; i < this.multipleSelection.length; i++) {
          this.IdList.push(this.multipleSelection[i].Id);
        }
        this.dialogCode = "续约";
        this.dialogRenewContractVisible = true;
      }
    },
    // 升级
    Upgrade() {
      if (!this.multipleSelection || this.multipleSelection.length <= 0) {
        this.$alert("请至少选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.btnDisabled = false;
          }
        });
      } else {
        this.IdList = [];
        for (var i = 0; i < this.multipleSelection.length; i++) {
          this.IdList.push(this.multipleSelection[i].Id);
        }
        this.dialogCode = "升级";
        this.dialogCustomerUpgradeVisible = true;
      }
    },
    //授权
    Empower() {
      if (!this.multipleSelection || this.multipleSelection.length <= 0) {
        this.$alert("请至少选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.btnDisabled = false;
          }
        });
      } else {
        this.IdList = [];
        for (var i = 0; i < this.multipleSelection.length; i++) {
          this.IdList.push(this.multipleSelection[i].Id);
        }
        this.dialogCode = "授权";
        this.dialogGrantVisible = true;
      }
    },
    //模块管理
    ModularManage() {
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
        for (var i = 0; i < this.multipleSelection.length; i++) {
          this.IdList.push(this.multipleSelection[i].Id);
        }
        this.dialogCode = "模块管理";
        this.dialogGrantVisible = true;
      }
    },
    //高级权限
    AdvancedPermission() {
      if (!this.multipleSelection || this.multipleSelection.length <= 0) {
        this.$alert("请至少选择一条！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.btnDisabled = false;
          }
        });
      } else {
        this.IdList = [];
        for (var i = 0; i < this.multipleSelection.length; i++) {
          this.IdList.push(this.multipleSelection[i].Id);
        }
        this.dialogCode = "高级权限";
        this.dialogAdvancedPermissionVisible = true;
      }
    },
    dialogOperLogClose(val) {
      this.btnDisabled = false;
      this.dialogOperLogVisible = val;
    },
    dialogAdvancedPermissionClose(val) {
      this.dialogAdvancedPermissionVisible = val;
      //this.$emit("listenerRefreshTable", "refresh"); //刷新table

      this.btnDisabled = false;
    },
    dialogScheduleParamClose(val) {
      this.btnDisabled = false;
      this.dialogScheduleParamVisible = val;
    },
    dialogScheduleRoleClose(val) {
      this.btnDisabled = false;
      this.dialogScheduleRoleVisible = val;
    },
    dialogRenewContractClose(val) {
      this.dialogRenewContractVisible = val;
      //this.$emit("listenerRefreshTable", "refresh"); //刷新table
      this.btnDisabled = false;
    },
    dialogCustomerUpgradeClose(val) {
      this.dialogCustomerUpgradeVisible = val;
      //this.$emit("listenerRefreshTable", "refresh"); //刷新table
      this.btnDisabled = false;
    },
    dialogGrantClose(val) {
      this.dialogGrantVisible = val;
      //this.$emit("listenerRefreshTable", "refresh"); //刷新table
      this.btnDisabled = false;
    },
    dialogApproveClose(val) {
      this.dialogApproveVisible = val;
      //this.$emit("listenerRefreshTable", "refresh"); //刷新table
      this.btnDisabled = false;
    },
    dialogPasswordClose(val) {
      this.dialogPasswordVisible = val;
      //this.$emit("listenerRefreshTable", "refresh"); //刷新table
      this.btnDisabled = false;
    },
    dialogDefaultAcountClose(val) {
      this.dialogDefaultAcountVisible = val;
      //this.$emit("listenerRefreshTable", "refresh"); //刷新table
      this.btnDisabled = false;
    }
  }
};
</script>
