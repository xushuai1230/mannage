<template>
  <div class="edit">
    <el-row class="editBoxRow">
      <el-button size="mini" icon="el-icon-edit" @click="submit" v-show="submitBtn">保存</el-button>
      <el-button size="mini" icon="el-icon-edit" @click="getEdit" v-show="getEditBTn">保存</el-button>
    </el-row>
    <div class="editBoxTable">
      <el-form
        ref="form"
        :model="form"
        class="form"
        size="mini"
        label-position="left"
        label-width="200px"
      >
        <el-col :span="12">
          <el-form-item label="编号：">
            <el-input v-model="form.code" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="流程名称：">
            <el-input v-model="form.name" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注：">
            <el-input v-model="form.remark" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用：">
            <el-select v-model="form.state" clearable placeholder="请选择" size="mini">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <div>{{showEdit}}</div>
  </div>
</template>
<script>
import qs from "qs";
import bus from "../../../assets/public/js/eventBus";
import { mapGetters } from "vuex";
export default {
  props: ["event", "targetName"],
  data() {
    return {
      form: {
        code: "",
        name: "",
        remark: "",
        checked: "",
        state: ""
      },
      options2: [
        {
          value: "1",
          label: "是"
        },
        {
          value: "2",
          label: "否"
        }
      ],
      getEditBTn: false,
      submitBtn: false,
      divHeight: ""
    };
  },
  computed: {
    ...mapGetters(["token", "list_z"]),
    showEdit() {
      console.log(this.list_z);
      //根据是否有id判断按钮显示
      if (this.list_z === undefined) {
        this.getEditBTn = false;
        this.submitBtn = true;
      } else {
        if (this.list_z === "") {
          this.getEditBTn = false;
          this.submitBtn = true;
          this.form.name = "";
          this.form.remark = "";
          this.form.state = "";
          this.form.code = "";
        } else {
          this.form.name = this.list_z[0].Name;
          this.form.remark = this.list_z[0].Remark;
          this.form.state = this.list_z[0].State;
          this.form.code = this.list_z[0].Code;
          this.getEditBTn = true;
          this.submitBtn = false;
        }
      }
    }
  },
  created() {},
  methods: {
    submit() {
      var data = {
        Name: "BusinessFlow",
        DefaultVal: "NewSave",
        PropertyValueMap: {
          Id: "",
          Code: this.form.code,
          Name: this.form.name,
          Remark: this.form.remark,
          State: this.form.state
        }
      };
      var data2 = JSON.stringify(data); //转成json字符串
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: Yukon.ServiceName.Workflow,
            operation: "SetJsonData",
            token: this.token,
            data: data2
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
            this.$alert("提交成功", "提示", {
              confirmButtonText: "确定",
              callback: action => {
                bus.$emit("colseTabs", this.targetName); //关闭维护页面
                bus.$emit("workFlowRefreshTable", true); //刷新首页
              }
            });
          } else{
            this.$alert(result.msg, "提示", {
              confirmButtonText: "确定",
              callback: action => {}
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getEdit() {
			  console.log(this.form.code);
      var data = {
        Name: "BusinessFlow",
        DefaultVal: "EditSave",
        PropertyValueMap: {
          Id: this.list_z[0].Id,
          Code: this.form.code,
          Name: this.form.name,
          Remark: this.form.remark,
          State: this.form.state
        }
      };
      var data2 = JSON.stringify(data); //转成json字符串
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: Yukon.ServiceName.Workflow,
            operation: "SetJsonData",
            token: this.token,
            data: data2
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
            this.$alert("提交成功", "提示", {
              confirmButtonText: "确定",
              callback: action => {
                bus.$emit("colseTabs", this.targetName); //关闭维护页面
                bus.$emit("workFlowRefreshTable", true); //刷新首页
              }
            });
          } else{
            this.$alert(result.msg, "提示", {
              confirmButtonText: "确定",
              callback: action => {}
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
<!-- <style lang="scss">
.AddFlowName{
	.el-form-item{
		margin-bottom: 0;
	}
	.el-form-item__label{
		font-size: 12px;
		line-height: 32px;
	}
	.el-select{
		display: block;
	}
}
</style> -->