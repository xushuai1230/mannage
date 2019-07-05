<template>
  <div>
    <el-dialog
      v-dialogDrag
      ref="dialog__wrapper"
      top="0"
      class="mini_dialog"
      :title="dialogCode"
      :before-close="cancel"
      :closeOnClickModal="false"
      :visible.sync="dialogVisible">
      <div class="formcenter">
        <el-form :inline="true" size="mini">
          <el-col>
            <el-col :span="7" style="text-align: right;">
              <el-form-item label="用户名"></el-form-item>
            </el-col>
            <el-col :span="17">
              <el-input type="text" v-model="username" size="mini"></el-input>
            </el-col>
          </el-col>
          <el-col>
            <el-col :span="7" style="text-align: right;">
              <el-form-item label="密码"></el-form-item>
            </el-col>
            <el-col :span="17">
              <el-tooltip
                class="item"
                :disabled="newDisabled"
                effect="dark"
                content="密码必须1到12位，且不能出现空格"
                placement="right">
                <el-input type="password" v-model="password" size="mini"></el-input>
              </el-tooltip>
            </el-col>
          </el-col>
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
  props: ["dialogDefaultAcountVisible", "dialogCode", "IdList", "operationTableName"],
  data() {
    return {
      dialogVisible: this.dialogDefaultAcountVisible,  
      optionsData: [],
      array: [],
      username: "",
      password: "",
      newDisabled: true
    };
  },
  computed: {
    ...mapGetters(["token"])  
  },
  created() {
    this.getData();
  },
  methods: {
    getData(){
      var data={
        "Name":this.operationTableName,
        "DefaultVal":"GetDefaultAccount",
        "IdList":this.IdList,
      }
      var reqInfoData=JSON.stringify(data);
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        "name":Yukon.ServiceName.Tenant,
        "operation":"GetJsonData",
        "token":this.token,
        "reqInfo":reqInfoData,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response)=>{
        var result = response.data;
        if(result.code == 0 && result.data != null){
          this.username = result.data.code;
        }
      })
      .catch((error)=> {
      })
    },
    save() {
      var objData = {
        Name: "CstInformation",
        DefaultVal: "UpdateDefaultAccount",
        PropertyValueMap: {
          Id: this.IdList[0],
          Code: this.username,
          Password: this.password
        }
      };
      var data = JSON.stringify(objData);
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        "name":Yukon.ServiceName.Tenant,
        "operation":"SetJsonData",
        token: this.token,
        data: data
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(response => {
        var result = response.data;
        if (result.code == 0) {
          this.dialogVisible = false;
          this.$emit("dialogVisibleFalse", false);
          this.$message({
            type: "success",
            message: "保存成功!"
          });
        } else {
          this.newDisabled = true;
          this.$message({
            type: "error",
            message: result.msg
          });
        }
      })
      .catch(function(error) {
      });
    },
    cancel() {
      this.dialogVisible = false;
      this.$emit("dialogVisibleFalse", false);
    }
  }
};
</script>