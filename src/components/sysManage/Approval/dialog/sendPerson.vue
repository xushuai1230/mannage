<template>
  <el-dialog
    title="提示"
    top="0"
    class="small_dialog sendPerson"
    v-dialogDrag
    :visible.sync="dialogVisible"
    :before-close="btnCancel"
  >
    <span>接收人</span>
    <el-select v-model="person" placeholder="请选择">
    <el-option
      v-for="item in personData"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="btnCancel">取 消</el-button>
      <el-button size="small" type="primary" @click="sendOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import "../../workFlow/GooFlow/assets/dialog.scss";
import { mapGetters } from "vuex";
export default {
  props: ["sendDialogVisible", "nodeId"],
  data() {
    return {
      dialogVisible: this.sendDialogVisible,
      personData:[{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }],
        person:"",
        approvalData:[]
    };
  },
  computed: {
    ...mapGetters(["token", "WFData"])
  },
  methods: {
    btnCancel() {
      this.dialogVisible = false;
      this.$emit("DialogVisibleFalse", false);
    },
    sendOk() {
     
      this.approvalData = this.WFData.approvalData;
      let approvalShow = true;
      for (let i in this.approvalData) {
        if (this.approvalData[i].Id == this.nodeId) {
          approvalShow = false;
          this.approvalData[i].InParameters.Params.name = this.person;
        }
      }
      if (approvalShow) {
        var data = {
          Id: this.nodeId,
          Name: "审批流",
          InParameters: {
            Params: {
               name:this.person
            }
          }
        };
        this.approvalData.push(data);
      }
      this.WFData.approvalData = this.approvalData; 
      this.$store.dispatch("wfdata", this.WFData);
      this.dialogVisible = false;
      this.$emit("DialogVisibleFalse", false);
    }
  }
};
</script>

<style>
</style>
