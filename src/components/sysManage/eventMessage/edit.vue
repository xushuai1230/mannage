<template>
  <div class="edit">
    <el-row class="editBoxRow">
      <el-col :span="24">
        <el-button size="mini" icon="el-icon-edit" @click="Save">保存</el-button>
      </el-col>
    </el-row>
    <div class="editBoxTable">
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        class="form"
        size="mini"
        label-position="left"
        label-width="200px"
        :rules="rules"
      >
        <el-col :span="12">
          <el-form-item label="事件">
            <el-select
              v-model="form.eventId"
              auto-complete="off"
              size="mini"
              @visible-change="getEventMethod"
            >
              <el-option key="0" value="请选择"></el-option>
              <el-option
                v-for="item in eventOption"
                :key="item.Id"
                :label="item.Name"
                :value="item.Name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="消息类型">
            <el-select v-model="form.sendType" auto-complete="off" size="mini">
              <el-option
                v-for="item in sendOption"
                :key="item.Id"
                :label="item.Name"
                :value="item.Name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="短信模板" prop="smsTemplateId">
            <el-select
              v-model="form.smsTemplateId"
              auto-complete="off"
              size="mini"
              @visible-change="getSMSTemplate"
            >
              <el-option key="0" value="请选择"></el-option>
              <el-option
                v-for="item in smsOption"
                :key="item.Id"
                :label="item.Name"
                :value="item.Name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮件模板" prop="emailTemplateId">
            <el-select
              v-model="form.emailTemplateId"
              auto-complete="off"
              size="mini"
              @visible-change="getMailTemplate"
            >
              <el-option key="0" value="请选择"></el-option>
              <el-option
                v-for="item in emailOption"
                :key="item.Id"
                :label="item.Name"
                :value="item.Name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="短信内容">
            <el-input v-model="form.smsContent" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮件内容">
            <el-input v-model="form.emailContent" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮件标题">
            <el-input v-model="form.emailTitle" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收件人">
            <el-select
              v-model="form.userId"
              auto-complete="off"
              size="mini"
              @visible-change="getAddressee"
            >
              <el-option key="0" value="请选择"></el-option>
              <el-option
                v-for="item in userOption"
                :key="item.Id"
                :label="item.Name"
                :value="item.Name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注">
            <el-input v-model="form.remark" size="mini"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
  </div>
</template>
<script>
import qs from "qs";
import { mapGetters } from "vuex";
import bus from "../../../assets/public/js/eventBus";
export default {
  props: ["refresh", "event", "editId", "targetName"],
  data() {
    var smsTemplateId = (rule, value, callback) => {
      if (value.trim() == "") {
        callback(new Error("编号未填写"));
      } else {
        callback();
      }
    };
    var emailTemplateId = (rule, value, callback) => {
      if (value.trim() == "") {
        callback(new Error("编号未填写"));
      } else {
        callback();
      }
    };
    return {
      form: {
        smsContent: "",
        emailContent: "",
        emailTitle: "",
        remark: "",
        eventId: "",
        sendType: "",
        smsTemplateId: "",
        emailTemplateId: "",
        userId: "",
        eventName: ""
      },
      eventOption: "",
      smsOption: "",
      emailOption: "",
      userOption: "",
      divHeight: "",
      currentEditId: "",
      sendOption: [
        {
          Id: "0",
          Name: "请选择"
        },
        {
          Id: "Sys",
          Name: "系统"
        },
        {
          Id: "Sms",
          Name: "短信"
        },
        {
          Id: "Email",
          Name: "邮件"
        },
        {
          Id: "Event",
          Name: "事件"
        }
      ],

      rules: {
        smsTemplateId: [{ validator: smsTemplateId, trigger: "change" }],
        emailTemplateId: [{ validator: emailTemplateId, trigger: "change" }]
      }
    };
  },
  computed: {
    currentView() {
      return this.arr[this.index];
    },
    ...mapGetters(["token"])
  },
  watch: {
    editId: function(newVal, oldVal) {
      this.getEventMethod();
      this.getSMSTemplate();
      this.getMailTemplate();
      this.getAddressee();
      if (this.editId.Action == "NewSave") {
        this.currentEditId = "";
        this.form = {
          smsContent: "",
          emailContent: "",
          emailTitle: "",
          remark: "",
          eventId: "",
          sendType: "",
          smsTemplateId: "",
          emailTemplateId: "",
          userId: ""
        };
      } else {
        this.form = {}; //清除缓存
        this.currentEditId = this.editId.EditId;
        this.getData();
      }
    }
  },
  mounted() {
    this.getEventMethod();
    this.getSMSTemplate();
    this.getMailTemplate();
    this.getAddressee();
    if (this.editId.Action == "NewSave") {
      this.currentEditId = "";
      this.form = {
        smsContent: "",
        emailContent: "",
        emailTitle: "",
        remark: "",
        eventId: "",
        sendType: "",
        smsTemplateId: "",
        emailTemplateId: "",
        userId: ""
      };
    } else {
      this.currentEditId = this.editId.EditId;
      this.getData();
    }
  },
  methods: {
    //事件下拉框查询
    getEventMethod() {
      var data = {
        Name: "EventFilter",
        DefaultVal: "SearchAll"
      };
      var dataStr = JSON.stringify(data);
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: Yukon.ServiceName.Workflow,
            operation: "GetJsonData",
            token: this.token,
            reqInfo: dataStr
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(response => {
          var result = response.body;
          if (result.code == "0") {
            var property = [];
            if (result.data && result.data.length > 0) {
              for (var i = 0; i < result.data.length; i++) {
                property.push(result.data[i].PropertyValueMap);
              }
            }
            this.eventOption = property;
          } else {
            this.$message({
              type: "error",
              message: result.msg
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    changeBySms() {
      var smsValues = "";
      for (var i = 0; i < this.smsOption.length; i++) {
        if (this.form.smsTemplateId == this.smsOption[i].Name) {
          smsValues = this.smsOption[i];
          break;
        }
      }
      this.form.smsContent = smsValues.Content;
    },
    //短信模板下拉框查询
    getSMSTemplate() {
      var data = {
        Name: "SmsTemplate",
        DefaultVal: "SearchAll"
      };
      var dataStr = JSON.stringify(data);
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: Yukon.ServiceName.Message,
            operation: "GetJsonData",
            token: this.token,
            reqInfo: dataStr
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(response => {
          var result = response.body;
          if (result.code == "0") {
            var property = [];
            if (result.data && result.data.length > 0) {
              for (var i = 0; i < result.data.length; i++) {
                property.push(result.data[i].PropertyValueMap);
              }
            }
            this.smsOption = property;
            this.changeBySms();
            // this.form.smsTemplateId= property;
          } else {
            this.$message({
              type: "error",
              message: result.msg
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    changeByEmail() {
      var emailValues = "";
      for (var j = 0; j < this.emailOption.length; j++) {
        if (this.form.emailTemplateId == this.emailOption[j].Name) {
          emailValues = this.emailOption[j];
          break;
        }
      }
      this.form.emailContent = emailValues.Content;
      this.form.emailTitle = emailValues.Title;
    },
    //邮件模板
    getMailTemplate() {
      var data = {
        Name: "EmailTemplate",
        DefaultVal: "Search"
      };
      var dataStr = JSON.stringify(data);
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: Yukon.ServiceName.Message,
            operation: "GetJsonData",
            token: this.token,
            reqInfo: dataStr
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(response => {
          var result = response.body;
          if (result.code == "0") {
            var property = [];
            if (result.data && result.data.length > 0) {
              for (var i = 0; i < result.data.length; i++) {
                property.push(result.data[i].PropertyValueMap);
              }
            }
            this.emailOption = property;
            this.changeByEmail();
          } else {
            this.$message({
              type: "error",
              message: result.msg
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    changeByUser() {
      var emailValues = "";
      for (var j = 0; j < this.emailOption.length; j++) {
        if (this.form.emailTemplateId == this.emailOption[j].Name) {
          emailValues = this.emailOption[j];
          break;
        }
      }
      this.form.emailContent = emailValues.Content;
      this.form.emailTitle = emailValues.Title;
    },
    //收件人
    getAddressee() {
      var data = {
        Name: "CstUser",
        DefaultVal: "Search",
        Properties: ["Id", "Code", "Name", "Email", "Mobile"],
        SortCondition: { CreateTime: "DESC" },
        PageSize: 1000
      };
      var dataStr = JSON.stringify(data);
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: Yukon.ServiceName.Tenant,
            operation: "GetJsonData",
            token: this.token,
            reqInfo: dataStr
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(response => {
          var result = response.body;
          if (result.code == "0") {
            var property = [];
            if (result.data && result.data.length > 0) {
              for (var i = 0; i < result.data.length; i++) {
                property.push(result.data[i].PropertyValueMap);
              }
            }
            this.userOption = property;
            this.changeByUser();
          } else {
            this.$message({
              type: "error",
              message: result.msg
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //编辑查询
    getData() {
      var data = {
        Name: "EventMessage",
        DefaultVal: "Search",
        Filter: "Id,==," + this.currentEditId + ",And;"
      };
      var dataStr = JSON.stringify(data);
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: Yukon.ServiceName.Message,
            operation: "GetJsonData",
            token: this.token,
            reqInfo: dataStr
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(response => {
          var result = response.body;
          this.form = {};
          if (result.code == "0") {
            var property = [];
            if (result.data && result.data.length > 0) {
              for (var i = 0; i < result.data.length; i++) {
                property.push(result.data[i].PropertyValueMap);
              }
            }
            (this.form.smsContent = property[0].SmsContent),
              (this.form.emailTitle = property[0].EmailTitle),
              (this.form.emailContent = property[0].EmailContent),
              (this.form.remark = property[0].Remark);
            //下拉框数据
            for (var i = 0; i < this.eventOption.length; i++) {
              if (property[0].EventId == this.eventOption[i].Id) {
                this.form.eventId = this.eventOption[i].Name;
                break;
              }
            }
            for (var j = 0; j < this.sendOption.length; j++) {
              if (property[0].SendType == this.sendOption[j].Id) {
                this.form.sendType = this.sendOption[j].Name;
                break;
              }
            }
            for (var k = 0; k < this.smsOption.length; k++) {
              if (property[0].SmsTemplateId == this.smsOption[k].Id) {
                this.form.smsTemplateId = this.smsOption[k].Name;
                break;
              }
            }
            for (var a = 0; a < this.emailOption.length; a++) {
              if (property[0].EmailTemplateId == this.emailOption[a].Id) {
                this.form.emailTemplateId = this.emailOption[a].Name;
                break;
              }
            }
            if (
              property[0].Receives != null &&
              property[0].Receives.length > 0
            ) {
              for (var b = 0; b < property[0].Receives.length; b++) {
                for (var c = 0; c < this.userOption.length; c++) {
                  if (property[0].Receives[b].UserId == this.userOption[c].Id) {
                    this.form.userId = this.userOption[c].Name;
                    return;
                  }
                }
              }
            }
          } else {
            this.$message({
              type: "error",
              message: result.msg
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //保存数据
    Save() {
        this.$refs["form"].validate(valid => {
        if (valid) {
        } else {
          return false;
        }
        })
      if (
        this.form.smsTemplateId == "" ||
        this.form.smsTemplateId == "请选择" ||
        "undefined" == typeof this.form.smsTemplateId
      ) {
        this.$alert("［短信模板］为必填", "提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
      } else if (
        this.form.emailTemplateId == "" ||
        this.form.emailTemplateId == "请选择" ||
        "undefined" == typeof this.form.emailTemplateId
      ) {
        this.$alert("［邮件模板］为必填", "提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
      } else {
        var operation = "-1";
        var userId = "";
        var userName = "";
        var userEmail = "";
        var userMobile = "";
        //下拉框数据
        for (var i = 0; i < this.eventOption.length; i++) {
          if (this.form.eventId == this.eventOption[i].Name) {
            this.form.eventId = this.eventOption[i].Id;
            break;
          }
        }
        for (var j = 0; j < this.sendOption.length; j++) {
          if (this.form.sendType == this.sendOption[j].Name) {
            this.form.sendType = this.sendOption[j].Id;
            break;
          }
        }
        for (var k = 0; k < this.smsOption.length; k++) {
          if (this.form.smsTemplateId == this.smsOption[k].Name) {
            this.form.smsTemplateId = this.smsOption[k].Id;
            break;
          }
        }
        for (var a = 0; a < this.emailOption.length; a++) {
          if (this.form.emailTemplateId == this.emailOption[a].Name) {
            this.form.eventName = this.emailOption[a].Name;
            this.form.emailTemplateId = this.emailOption[a].Id;
            break;
          }
        }
        for (var b = 0; b < this.userOption.length; b++) {
          if (this.form.userId == this.userOption[b].Name) {
            userId = this.userOption[b].Id;
            userName = this.userOption[b].Name;
            userEmail = this.userOption[b].Email;
            userMobile = this.userOption[b].Mobile;
            break;
          }
        }
        var receives = [
          {
            PropertyValueMap: {
              UserId: userId,
              UserName: userName,
              UserEmail: userEmail,
              UserMobile: userMobile
            }
          }
        ];
        if (this.currentEditId != null && this.currentEditId != "") {
          //编辑保存
          operation = "EditSave";
        } else {
          //新增保存
          operation = "NewSave";
        }
        if (operation == "-1") {
        } else {
          var dataparams = {
            Name: "EventMessage",
            DefaultVal: operation,
            PropertyValueMap: {
              Id: this.currentEditId,
              EventId: this.form.eventId,
              SendType: this.form.sendType,
              SmsTemplateId: this.form.smsTemplateId,
              SmsContent: this.form.smsContent,
              EmailTemplateId: this.form.emailTemplateId,
              EmailTitle: this.form.emailTitle,
              EmailContent: this.form.emailContent,
              Remark: this.form.remark,
              EventName: this.form.eventName
            },
            SubCollection: receives
          };
          var datas = JSON.stringify(dataparams);
          this.$http
            .post(
              Yukon.Url.Bus,
              qs.stringify({
                name: Yukon.ServiceName.Message,
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
              var result = response.body;
              if (result.code == "0") {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
                bus.$emit("listenerRefreshTable", "refresh");
                bus.$emit("colseTabs", this.targetName);
                this.form = {
                  smsContent: "",
                  emailContent: "",
                  emailTitle: "",
                  remark: "",
                  eventId: "",
                  sendType: "",
                  smsTemplateId: "",
                  emailTemplateId: "",
                  userId: "",
                  eventName: ""
                };
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
      }
    }
  }
};
</script>

