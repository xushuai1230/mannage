
<template>
  <el-dialog
    title="消息"
    class="medium_dialog messageDialog"
    :visible.sync="dialogVisible"
    top="0"
    v-dialogDrag
    :before-close="btnCancel"
  >
    <div class="formcenter">
      <el-form>
        <div class="rowDiv">
          <span>类型</span>
          <el-select class="opSelect" v-model="sendMessageType" placeholder="请选择">
            <el-option
              v-for="item in typeData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span>标题</span>
          <el-input class="opSelect" placeholder="请输入内容" v-model="sendMessageTitle"></el-input>
          <span>接收客户</span>
          <el-select
            class="opSelect"
            v-model="receiveCustomer"
            filterable
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in receiveCustomerData"
              :key="item.PropertyValueMap.Id"
              :label="item.PropertyValueMap.Name"
              :value="item.PropertyValueMap.Id"
            ></el-option>
          </el-select>
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
  name: "userDialog",
  props: ["userDialogVisible", "nodeId"],
  data() {
    return {
      dialogVisible: this.userDialogVisible,
      // 发送信息/邮件
      sendMessageType: "0", //发送信息类型值
      typeData: [
        {
          value: "0",
          label: "邮件"
        },
        {
          value: "1",
          label: "短信"
        }
      ], // 类型list
      sendMessageTitle: "", //标题
      receiveCustomer: [], // 接收客户值
      receiveCustomerData: [], // 接收客户list
      sendMessageContent: "", // 消息内容
      sendMessageData: [] //接口数据
    };
  },
  computed: {
    ...mapGetters(["token", "WFData"])
  },
  mounted() {},
  methods: {
    btnCancel() {
      this.dialogVisible = false;
      this.$emit("DialogVisibleFalse", false);
    },
    sendMessageOK() {
      this.dialogVisible = false;
      this.$emit("DialogVisibleFalse", false);
    }
  }
};
</script>

<style>
</style>



