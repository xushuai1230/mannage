
<template>
  <el-dialog
    title="流转"
    class="medium_dialog transformDialog"
    :before-close="btnCancel"
    :visible.sync="dialogVisible"
    v-dialogDrag
    top="0"
  >
    <div class="formcenter">
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="21%"
        class="demo-ruleForm"
      >
        <el-form-item label="服务" prop="server">
          <el-select v-model="ruleForm.server" @change="getDocumentList()" placeholder="请选择">
            <el-option
              v-for="item in serverData"
              :key="item.Name"
              :label="item.DisplayName"
              :value="item.Name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单据" prop="documents">
          <el-select v-model="ruleForm.documents" placeholder="请选择">
            <el-option
              v-for="item in documentsData"
              :key="item.Name"
              :label="item.DisplayName"
              :value="item.Name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="条件" prop="conditions">
          <el-input v-model="ruleForm.conditions"></el-input>
        </el-form-item>
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
  props: ["liuzhaunDialogVisible", "nodeId"],
  data() {
    return {
      dialogVisible: this.liuzhaunDialogVisible,
      ruleForm: {
        server: "",
        documents: "",
        conditions: ""
      },
      serverData: [],
      documentsData: []
    };
  },
  computed: {
    ...mapGetters(["token", "WFData"])
  },
  mounted() {
    this.getServerList();
  },
  methods: {
    // 获取导入导出服务列表
    getServerList() {
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
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取导入导出单据list
    getDocumentList() {
      var reqInfo = JSON.stringify({
        Name: "ServiceTable",
        Filter: JSON.stringify({
          ServiceName: this.ruleForm.server
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
            this.documentsData = result.data;
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



