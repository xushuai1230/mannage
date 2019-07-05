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
      :visible.sync="dialogCustomerUpgradeVisible"
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
  props: ["dialogCustomerUpgradeVisible", "dialogCode", "IdList", "operationTableName"],
  data() {
    return {
      dialogVisible: this.dialogCustomerUpgradeVisible,
      optionsData: [],
      array: [
        {
          EngCode: "Level",
          ShowCode: "Aps等级",
          EditType: "Select"
        },
        {
          EngCode: "UserCount",
          ShowCode: "人员数量",
          EditType: "InputNumber",
          value: 0
        },
        {
          EngCode: "ImplementDays",
          ShowCode: "实施人天",
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
        EnumField: "TenentLevel"
      };
      var reqInfoData = JSON.stringify(data);
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: Yukon.ServiceName.Tenant,
            operation: "GetJsonData",
            token: this.token,
            reqInfo: reqInfoData
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(response => {
          var result = response.data.data;
          if (response.data.code == 0) {
            this.optionsData = result;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    save() {
      for (var i = 0; i < this.array.length; i++) {
        if (this.array[i].EngCode == "Level") {
          var level = this.array[i].key;
        } else if (this.array[i].EngCode == "UserCount") {
          var userCount = this.array[i].value;
        } else if (this.array[i].EngCode == "ImplementDays") {
          var implementDays = this.array[i].value;
        }
      }
      var propery = {
        Level: level,
        UserCount: userCount,
        ImplementDays: implementDays,
        IdList: this.IdList
      };
      var dataparams = {
        Name: this.operationTableName,
        DefaultVal: "Upgrade",
        PropertyValueMap: propery
      };
      var datas = JSON.stringify(dataparams);
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
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
        )
        .then(response => {
          var result = response.data;
          if (result.code == 0) {
            this.$message({
              type: "success",
              message: "升级成功!"
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
    },
  }
};
</script>