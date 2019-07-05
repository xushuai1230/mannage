<template>
  <div>
    <el-dialog
      v-dialogDrag
      ref="dialog__wrapper"
      top="0"
      class="medium_dialog"
      :title="dialogCode"
      :fit="true"
      :before-close="cancel"
      :closeOnClickModal="false"
      :visible.sync="dialogRenewContractVisible"
    >
      <div class="formcenter">
        <el-form :inline="true" size="mini">
          <div v-for="(item,index) in array" :key="index">
            <el-col v-show="item.EditType=='Select'">
              <el-col :span="7" style="text-align: right;">
                <el-form-item :label="item.ShowCode"></el-form-item>
              </el-col>
              <el-col :span="17">
                <el-select
                  v-model="item.key"
                  filterable
                  placeholder="--请选择--"
                  size="mini"
                  @visible-change="getDropdownData()"
                >
                  <el-option
                    v-for="item in optionsData"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  ></el-option>
                </el-select>
              </el-col>
            </el-col>
            <el-col v-show="item.EditType=='InputNumber'">
              <el-col :span="7" style="text-align: right;">
                <el-form-item :label="item.ShowCode"></el-form-item>
              </el-col>
              <el-col :span="17">
                <el-input-number ref="num" :min="0" v-model="item.value" size="mini"></el-input-number>
              </el-col>
            </el-col>
            <el-col v-show="item.EditType=='SelectMulti'">
              <el-col :span="7" style="text-align: right;">&nbsp;</el-col>
              <el-col :span="17">
                <el-checkbox v-model="item.checked" :label="item.ShowCode"></el-checkbox>
              </el-col>
            </el-col>
          </div>
        </el-form>
      </div>
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
  props: ["dialogRenewContractVisible", "dialogCode", "IdList", "operationTableName"],
  data() {
    return {
      dialogVisible: this.dialogRenewContractVisible,
      optionsData: [],
      array: [
        {
          EngCode: "Type",
          ShowCode: "类型",
          EditType: "Select"
        },
        {
          EngCode: "Duration",
          ShowCode: "时间",
          EditType: "InputNumber",
          value: 0
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["token"])
  },
  created() {
  },
  methods: {
    getDropdownData() {
      var data = {
        Name: this.operationTableName,
        DefaultVal: "SearchEnum",
        EnumField: "LeaseMode"
      };
      var reqInfoData = JSON.stringify(data);
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        name: Yukon.ServiceName.Tenant,
        operation: "GetJsonData",
        token: this.token,
        reqInfo: reqInfoData
      }),{
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      ).then(response => {
        var result = response.data.data;
        if (response.data.code == 0) {
          this.optionsData = result;
        }
      }).catch(error => {});
    },
    save() {
      for (var i = 0; i < this.array.length; i++) {
        if (this.array[i].EngCode == "Type") {
          var type = this.array[i].key;
        } else if (this.array[i].EngCode == "Duration") {
          var duration = this.array[i].value;
        }
      }
      var propery = {
        Type: type,
        Duration: duration,
        IdList: this.IdList
      };
      var dataparams = {
        Name: this.operationTableName,
        DefaultVal: "Renewal",
        PropertyValueMap: propery
      };
      var datas = JSON.stringify(dataparams);
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        name: Yukon.ServiceName.Tenant,
        operation: "SetJsonData",
        token: this.token,
        data: datas
      }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      ).then(response => {
        var result = response.data;
        if (result.code == "0") {
          this.$message({
            type: "success",
            message: "续约成功!"
          });
          this.array = [];
          this.dialogVisible = false;
          this.$emit("dialogVisibleFalse", false);
        } else {
          this.$message({
            type: "error",
            message: result.msg
          });
        }
      })
      .catch(error => {
        this.$message({
          type: "error",
          message: "执行出错"
        });
      });
    },
    cancel() {
      this.dialogVisible = false;
      this.$emit("dialogVisibleFalse", false);
    }
  }
};
</script>