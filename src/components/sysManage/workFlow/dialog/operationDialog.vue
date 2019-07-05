
<template>
  <el-dialog
    title="排程"
    id="messageDialog"
    class="medium_dialog"
    :before-close="btnCancel"
    :visible.sync="dialogVisible"
    top="0"
    v-dialogDrag
  >
    <div class="formcenter">
      <el-form>
        <div class="rowDiv">
          <span>排程方案</span>
          <el-select class="opSelect" v-model="schedulingSelect" placeholder="请选择">
            <el-option
              v-for="(item,index) in schedulingSelectData"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="btnCancel">取消</el-button>
      <el-button size="small" type="primary" @click="operationOK">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import "../GooFlow/assets/dialog.scss";
import bus from "../../../../assets/public/js/eventBus";
import { mapGetters } from "vuex";
export default {
  name: "exportDialog",
  props: ["scheduleDialogVisible", "nodeId"],
  data() {
    return {
      dialogVisible: this.scheduleDialogVisible,
      // 排程操作
      schedulingSelect: "", //排程方案值
      schedulingSelectData: [], //排程方案list
      operationData: [] // 接口数据
    };
  },
  computed: {
    ...mapGetters(["token", "WFData"])
  },
  mounted() {
    this.getSchedulingSelect();
    this.history();
  },
  methods: {
    history() {
      let historyData = this.WFData.operationData;
      if (historyData.length > 0) {
        for (let i in historyData) {
          if (historyData[i].InParameters.Params.Id == this.nodeId) {
            this.schedulingSelect = historyData[i].InParameters.Params.CMD;
          }
        }
      }
    },
    //获取排程方案下拉框
    getSchedulingSelect(val) {
      var dataparams1 = {
        Name: "ApsParam",
        Filter: "",
        SortCondition: "",
        Properties: []
      };
      var reqInfo = JSON.stringify(dataparams1); //转成json字符串
      this.$http
        .post(Yukon.Url.Bus, {
          name: Yukon.ServiceName.APS,
          operation: "GetJsonData",
          token: this.token,
          reqInfo: reqInfo
        })
        .then(res => {
          var result = res.data;
          if (result.code == 0) {
            var nodeData = result.data.nodeRoot;
            var relData = [];
            for (var i = 0; i < nodeData.length; i++) {
              relData.push(unescape(nodeData[i]));
            }
            this.schedulingSelectData = relData;
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
    operationOK() {
      this.operationData = this.WFData.operationData;
      let operationShow = true;
      for (let i in this.operationData) {
        if (this.operationData[i].InParameters.Params.Id == this.nodeId) {
          operationShow = false;
          this.operationData[i].InParameters.Params.CMD = this.schedulingSelect;
        }
      }
      if (operationShow) {
        var data = {
          Id: this.nodeId,
          Name: "排程",
          InParameters: {
            Params: {
              Id: this.nodeId,
              CMD: this.schedulingSelect
            }
          }
        };
        this.operationData.push(data);
      }
      this.WFData.operationData = this.operationData;
      this.$store.dispatch("wfdata", this.WFData);
      this.dialogVisible = false;
      this.$emit("DialogVisibleFalse", false);
    },
    btnCancel() {
      this.dialogVisible = false;
      this.$emit("DialogVisibleFalse", false);
    }
  }
};
</script>

<style>
</style>



