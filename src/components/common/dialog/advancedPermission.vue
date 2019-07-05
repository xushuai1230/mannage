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
      :visible.sync="dialogAdvancedPermissionVisible"
    >
      <div class="formcenter">
        <el-form>
          <div v-for="item in fields">
            <el-col v-show="item.ControlType=='Checkbox'">
              <el-col :span="17" style="padding-bottom:5px">
               <span style="width:95px;display:inline-block">{{item.CnName}}</span>
                <el-checkbox v-model="form[item.Code]"></el-checkbox>
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
  props: [
    "dialogAdvancedPermissionVisible",
    "dialogCode",
    "IdList",
    "operationTableName"
  ],
  data() {
    return {
      dialogVisible: this.dialogAdvancedPermissionVisible,
      optionsData: [],
      fields:[],
      form: {},
    };
  },
  computed: {
    ...mapGetters(["token"])
  },
  created() {
    this.getColumns();
  },
  methods: {
    // 获取字段信息
    getColumns(){
      var colsData = { "name":"DBField","TblName":'CstAdvancedPermission'}
      var reqInfoColsData = JSON.stringify(colsData);
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        "name":Yukon.ServiceName.Tenant,
        "operation":"GetJsonData",
        "token":this.token,
        "reqInfo":reqInfoColsData,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response)=>{
        var result = response.body;
        if(result.code == 0){
          let columns= result.data
          let fields = new Array()//获取字段模型
          for (let p in columns) {
            fields[p] = columns[p].PropertyValueMap;
            fields[p].Value = false;
          }                                        
          this.fields = fields;
          if(this.fields.length>0){
            this.getData();
          }
        }
      }).catch((error)=>{
        console.log(error)
      })                 
    },
    getData() {
      var data = {
        Name: this.operationTableName,
        DefaultVal: "GetAdvancedPermission",
        ID: this.IdList.join("")
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
      }).then((response) => {
        var result = response.data;
        if(result.code == 0){
          if(result.data!=null && result.data.PropertyValueMap!=null){
            var data = result.data.PropertyValueMap;
            for (var i = 0; i < this.fields.length; i++) {
              var value = data[this.fields[i].Code];
              value = value == '是'? true:value;
              value = value == '否'? false:value;
              this.form[this.fields[i].Code] = value;
            }
            this.form = Object.assign({}, this.form);
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
    cancel() {
      this.dialogVisible = false;
      this.$emit("dialogVisibleFalse", false);
    },
    save() {
      var propery = this.form;
      propery.TenantId = this.IdList.join("");
      var dataparams = {
        Name: this.operationTableName,
        DefaultVal: "UpdateAdvancedPermission",
        PropertyValueMap: propery
      };
      var datas = JSON.stringify(dataparams);
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        name: Yukon.ServiceName.Tenant,
        operation: "SetJsonData",
        token: this.token,
        data: datas
      }),{
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(response => {
        var result = response.data;
        if (result.code == 0) {
          this.$message({
            type: "success",
            message: "操作成功!"
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
      }).catch(error => {
        this.$message({
          type: "error",
          message: "执行出错"
        });
      });
    }
  }
};
</script>