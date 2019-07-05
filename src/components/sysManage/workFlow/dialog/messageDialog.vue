
<template>
  <el-dialog
    title="消息"
    id="messageDialog"
    class="medium_dialog"
    :visible.sync="dialogVisible"
    top="0"
    v-dialogDrag
    :before-close="btnCancel"
  >
    <div class="formcenter">
      <el-form>
        <div class="rowDiv">
          <!-- <span>类型</span>
          <el-select class="opSelect" v-model="sendMessageType" placeholder="请选择">
            <el-option
              v-for="item in typeData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>-->
          <span>接收用户</span>
          <el-select
            class="opSelect"
            v-model="receiveCustomer"
            filterable
            multiple
            collapse-tags
            placeholder="请选择"
          >
            <el-option
              v-for="item in receiveUser"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id"
            ></el-option>
          </el-select>
          <span>标题</span>
          <el-input
            class="opSelect"
            style="width:74%;"
            placeholder="请输入内容"
            v-model="sendMessageTitle"
          ></el-input>

          <span>发送内容</span>
          <el-input
            type="textarea"
            style="max-width: 74%;width:74%;max-height:350px;vertical-align: middle;margin-top: 10px;border-radius: 4px"
            :rows="5"
            placeholder="请输入内容"
            v-model="sendMessageContent"
          ></el-input>
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="btnCancel">取消</el-button>
      <el-button size="small" type="primary" @click="sendMessageOK">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import "../GooFlow/assets/dialog.scss";
import bus from "../../../../assets/public/js/eventBus";
import { mapGetters } from "vuex";
export default {
  name: "messageDialog",
  props: ["messageDialogVisible", "nodeId", "eventId"],
  data() {
    return {
      dialogVisible: this.messageDialogVisible,
      sendMessageTitle: "", //标题
      receiveCustomer: [], // 接收客户值
      receiveUser: [], // 接收用户list
      sendMessageContent: "", // 消息内容
      sendMessageData: [] //接口数据
    };
  },
  computed: {
    ...mapGetters(["token", "WFData"])
  },
  mounted() {
    this.history();
    this.getUser();
  },
  methods: {
    history() {
      let historyData = this.WFData.sendMessageData;
      let oldValue = true;
      if (historyData.length > 0) {
        for (var i = 0; i < historyData.length; i++) {
          if (this.nodeId == historyData[i].InParameters.Params.Id) {
            oldValue = false;
            this.sendMessageContent =
              historyData[i].InParameters.Params.Content;
            this.sendMessageTitle = historyData[i].InParameters.Params.Title;
            this.receiveCustomer = historyData[i].InParameters.Params.username;
          }
        }
      }
      if (oldValue) {
        this.sendMessageContent = "";
        this.sendMessageTitle = "";
        this.receiveCustomer = "";
      }
    },
    getUser() {
      var data = {
        Name: "BusinessFlow",
        EnumField: "BusinessFlowUser",
        DefaultVal: "SearchEnum",
        Filter: this.eventId
      };
      var reqInfo = JSON.stringify(data);
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
            this.receiveUser = result.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    btnCancel() {
      this.dialogVisible = false;
      this.$emit("DialogVisibleFalse", false);
    },
    sendMessageOK() {
      // 发送信息确定
      if (this.receiveCustomer.length <= 0) {
        this.$message({
          type: "warning",
          message: "请选择接收客户"
        });
      } else {
        var connect = [];
        var ReceiverData = [];
        let sendOldValue = true;
        this.sendMessageData = this.WFData.sendMessageData;
        if (this.sendMessageData.length > 0) {
          for (var i = 0; i < this.sendMessageData.length; i++) {
            if (this.nodeId == this.sendMessageData[i].InParameters.Params.Id) {
              sendOldValue = false;
              this.sendMessageData[
                i
              ].InParameters.Params.Content = this.sendMessageContent;
              this.sendMessageData[
                i
              ].InParameters.Params.Title = this.sendMessageTitle;
              this.sendMessageData[
                i
              ].InParameters.Params.username = this.receiveCustomer;
              this.sendMessageData[i].InParameters.Params.Id = this.nodeId;
              this.sendMessageData[
                i
              ].InParameters.Params.EventId = this.eventId;
            }
            if (sendOldValue) {
              var data = {
                Id: this.nodeId,
                EventId: this.eventId,
                Title: this.sendMessageTitle, //（用于发邮件）
                Content: this.sendMessageContent, //消息内容（用于发短信、邮件）
                username: this.receiveCustomer
              };
              var data = {
                Id: this.nodeId,
                Name: "发送消息",
                InParameters: {
                  Params: data
                }
              };
              this.sendMessageData.push(data);
            }
          }
        } else {
          var data = {
            Id: this.nodeId,
            EventId: this.eventId,
            Title: this.sendMessageTitle, //（用于发邮件）
            Content: this.sendMessageContent, //消息内容（用于发短信、邮件）
            username: this.receiveCustomer
          };
          var data = {
            Id: this.nodeId,
            Name: "发送消息",
            InParameters: {
              Params: data
            }
          };
          this.sendMessageData.push(data);
        }
        this.WFData.sendMessageData = this.sendMessageData;
        this.$store.dispatch("wfdata", this.WFData);
        this.dialogVisible = false;
        this.$emit("DialogVisibleFalse", false);
      }
    }
  }
};
</script>

<style>
</style>



