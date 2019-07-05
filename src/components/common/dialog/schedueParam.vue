<template>
  <div>
    <el-dialog
      v-dialogDrag
      ref="dialog__wrapper"
      top="0"
      class="medium_dialog"
      :title="dialogCode"
      :before-close="cancel"
      :closeOnClickModal="false"
      :visible.sync="dialogVisible"
    >
      <el-form :inline="true" size="mini">
        <el-tree
          :data="treesData"
          ref="tree"
          show-checkbox
          node-key="id"
          check-on-click-node
          :props="defaultProps"
          :default-checked-keys="selectKey"
          ></el-tree>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取消</el-button>
        <el-button type="primary" size="small" @click="save">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import qs from "qs";
import { mapGetters } from "vuex";
import bus from "../../../assets/public/js/eventBus";
export default {
  props: [
    "dialogScheduleVisible",
    "dialogCode",
    "IdList",
    "operationTableName",
    "serviceName"
  ],
  data() {
    return {
      dialogVisible: this.dialogScheduleVisible,
      treesData: [],
      selectKey: [],
      array: [],
      newPassword: "",
      nowPassword: "",
      newDisabled: true,
      nowDisabled: true,
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  computed: {
    ...mapGetters(["token"])
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      var dataparams = {
        Name: this.operationTableName,
        DefaultVal: "GetScheduleParam",
        IdList: this.IdList
      };
      var datas = JSON.stringify(dataparams);
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: Yukon.ServiceName.Tenant,
            operation: "GetJsonData",
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
          var result = response.body;
          if (result.code == 0) {
            this.treesData = result.data.data;
            this.selectKey = result.data.selectKey;
          } else {
            this.treesData = [];
          }
        })
        .catch(function(error) {});
    },
    save() {
      var nodeKey = this.$refs.tree.getCheckedKeys();
      var property = {
        Id: this.IdList[0],
        List: nodeKey
      };
      var objData = {
        Name: this.operationTableName,
        DefaultVal: "UpdateScheduleParam",
        PropertyValueMap: property
      };
      var data = JSON.stringify(objData);
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: this.serviceName,
            operation: "SetJsonData",
            token: this.token,
            data: data
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
            this.dialogVisible = false;
            this.$emit("dialogVisibleFalse", false);
          } else {
            this.$message({
              type: "error",
              message: result.msg
            });
          }
        })
        .catch(function(error) {});
      this.dialogVisible = false;
      this.$emit("dialogVisibleFalse", false);
    },
    cancel() {
      this.dialogVisible = false;
      this.$emit("dialogVisibleFalse", false);
    }
  }
};
</script>