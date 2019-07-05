<template>
  <div class="edit">
    <el-row class="editBoxRow">
      <el-button size="mini" icon="el-icon-edit" class="subminMessage" @click="submit">保存</el-button>
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
        <el-col>
          <el-col :span="12">
            <el-form-item label="流程名称：">
              <el-select
                v-model="select"
                clearable
                placeholder="请选择"
                size="mini"
                @change="changeName"
                id="select"
              >
                <el-option
                  v-for="item in processName"
                  :key="item.NodeId"
                  :label="item.NodeName"
                  :value="item.NodeName"
                >
                  <!-- value是把item传给v-model的title，然后添加时统一传给子组件-->
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-form-item label="源租户">
            <el-select v-model="Billselect" placeholder="请选择" size="mini" @change="BillChange">
              <el-option
                v-for="item in selectData"
                :key="item.PropertyValueMap.Id"
                :label="item.PropertyValueMap.Name"
                :value="item.PropertyValueMap.Id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目标租户">
            <el-select v-model="ToBillselect" placeholder="请选择" size="mini" @change="ToBillChange">
              <el-option
                v-for="item in selectData"
                :key="item.PropertyValueMap.Id"
                :label="item.PropertyValueMap.Name"
                :value="item.PropertyValueMap.Id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户名称">
            <el-input v-model="Bill" size="mini" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户名称">
            <el-input v-model="ToBill" size="mini" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="消息内容">
            <el-input placeholder="请输入内容" v-model="textareaHtml"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="消息内容">
            <el-input placeholder="请输入内容" v-model="textareaHtml2"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用">
            <el-select v-model="checkboxEdit1" placeholder="请选择" size="mini">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <div id="TenantId">{{TenantId}}</div>
        <div>{{NodeId}}</div>
        <div>{{currentId}}</div>
        <el-col :span="12">
          <el-form-item label="是否启用">
            <el-select v-model="checkboxEdit2" placeholder="请选择" size="mini">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <div id="TenantId">{{ToTenantId}}</div>
      </el-form>
    </div>
  </div>
</template>
<script>
import qs from 'qs';
import { mapGetters} from "vuex";
export default {
  data() {
    return {
      form: {},
      select: "",
      ToBill: "",
      Bill: "",
      NodeId: "",
      processName: [], //流程名称数据
      ArrayDataMessage: [], //传给后台的数据
      process: "",
      currentId: "", //当前流程的ID
      options2: [
        {
          value: "true",
          label: "是"
        },
        {
          value: "false",
          label: "否"
        }
      ],
      selectData: [], //租户下拉框
      Billselect: "", //原租户选中的数据
      ToBillselect: "", //目标租户选中的数据
      textareaHtml: "",
      textareaHtml2: "",
      checkboxEdit1: "",
      checkboxEdit2: "",
      TenantId: "",
      ToTenantId: "",
      obj: {},
      ShowSave: "", //判断是新增还是编辑
      divHeight: ""
    };
  },
  computed: {
    ...mapGetters(["token","list_z","processName_z"])
  },
  created() {
    this.getlist();
    this.SourceTenant();
  },
  mounted() {},
  methods: {
    //获取流程名称
    getlist() {
      var setId = "Id ,== ," + this.list_z[0].Id + ",And;";
      var data = {
        Name: "YWF_BusinessRemind",
        DefaultVal: "Search",
        Filter: setId
      };
      var data2 = JSON.stringify(data); //转成json字符串
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        "name":Yukon.ServiceName.Workflow,
        "operation":"GetJsonData",
        "token":this.token,
        "reqInfo":data2,
      }),{
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response)=>{ 
          var result = response.data;
          if(result.code == 0){
            var data = result.data;
            this.processName = data.Item;
            this.currentId = data.Id;
            //判断当前是新增还是编辑
            if (data.Id == undefined || data.Id == null || data.Id == "") {
              this.ShowSave = "NewSave";
            } else {
              this.ShowSave = "EditSave";
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //切换流程名称显示
    changeName() {
      var mysel = $("#select");
      var oldValue = mysel.data("last", mysel.val())[0].value; //获取变更之前的值
      var newValue = this.select;
      this.Billselect = "";
      this.ToBillselect = "";
      if (oldValue !== "请选择" && this.NodeId !== "") {
        var objMessage = {};
        objMessage.NodeId = this.NodeId;
        objMessage.NodeName = oldValue; //把旧的选中内容赋值
        objMessage.Tenant = {};
        if (this.checkboxEdit1 == "否") {
          objMessage.Tenant.IsSend = false;
        } else {
          objMessage.Tenant.IsSend = true;
        }
        objMessage.Tenant.Bill = this.Bill;
        objMessage.Tenant.TenantId = this.TenantId;
        objMessage.Tenant.Content = this.textareaHtml;
        objMessage.ToTenant = {};
        if (this.checkboxEdit2 == "否") {
          objMessage.ToTenant.IsSend = false;
        } else {
          objMessage.ToTenant.IsSend = true;
        }
        objMessage.ToTenant.Bill = this.ToBill;
        objMessage.ToTenant.TenantId = this.ToTenantId;
        objMessage.ToTenant.Content = this.textareaHtml2;
        //判断不能重复
        var containId = false;
        for (var i = 0; i < this.processName.length; i++) {
          if (this.processName[i].NodeId == objMessage.NodeId) {
            this.processName[i] = objMessage;
            containId = true;
            i++;
          }
        }
        if (!containId) {
          this.processName.push(objMessage);
        }
      }
      if (newValue !== "请选择") {
        for (var i = 0; i < this.processName.length; i++) {
          if (this.select == this.processName[i].NodeName) {
            this.Bill = this.processName[i].Tenant.Bill;
            this.ToBill = this.processName[i].ToTenant.Bill;
            this.NodeId = this.processName[i].NodeId;
            this.process = this.processName[i].NodeName;
            this.TenantId = this.processName[i].Tenant.TenantId;
            this.ToTenantId = this.processName[i].ToTenant.TenantId;
            this.textareaHtml = this.processName[i].Tenant.Content;
            this.textareaHtml2 = this.processName[i].ToTenant.Content;
            if (this.processName[i].ToTenant.IsSend == true) {
              this.checkboxEdit2 = "是";
            } else {
              this.checkboxEdit2 = "否";
            }
            if (this.processName[i].Tenant.IsSend == true) {
              this.checkboxEdit1 = "是";
            } else {
              this.checkboxEdit1 = "否";
            }
          }
        }
      }
    },
    //源租户
    SourceTenant() {
      var dataparams1 = {
        Name: "YMS_SmsTemplate",
        DefaultVal: "SearchAll"
      };
      var data1 = JSON.stringify(dataparams1); //转成json字符串
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        "name":Yukon.ServiceName.Message,
        "operation":"GetJsonData",
        "token":this.token,
        "reqInfo":data1,
      }),{
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response)=>{ 
          var result = response.data;
          if(result.code == 0){
            var data = result.data;
            this.selectData = data;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //切换原租户
    BillChange() {
      for (var i = 0; i < this.selectData.length; i++) {
        if (this.Billselect == this.selectData[i].PropertyValueMap.Id) {
          this.textareaHtml = this.selectData[i].PropertyValueMap.Content;
        }
      }
    },
    //切换目标租户
    ToBillChange() {
      for (var i = 0; i < this.selectData.length; i++) {
        if (this.ToBillselect == this.selectData[i].PropertyValueMap.Id) {
          this.textareaHtml2 = this.selectData[i].PropertyValueMap.Content;
        }
      }
    },
    submit() {
      // console.log(this.checkboxEdit2)
      var objMessage = {};
      objMessage.NodeId = this.NodeId;
      objMessage.NodeName = this.select; //把旧的选中内容赋值
      objMessage.Tenant = {};
      if (this.checkboxEdit1 == "否") {
        objMessage.Tenant.IsSend = false;
      } else {
        objMessage.Tenant.IsSend = true;
      }
      objMessage.Tenant.Bill = "";
      objMessage.Tenant.TenantId = this.TenantId;
      objMessage.Tenant.Content = this.textareaHtml;
      objMessage.ToTenant = {};
      if (this.checkboxEdit2 == "否") {
        objMessage.ToTenant.IsSend = false;
      } else {
        objMessage.ToTenant.IsSend = true;
      }
      objMessage.ToTenant.Bill = "";
      objMessage.ToTenant.TenantId = this.ToTenantId;
      objMessage.ToTenant.Content = this.textareaHtml2;
      //判断不能重复
      var containId = false;
      for (var i = 0; i < this.processName.length; i++) {
        if (this.processName[i].NodeId == objMessage.NodeId) {
          this.processName[i] = objMessage;
          containId = true;
          i++;
        }
      }
      if (!containId) {
        this.processName.push(objMessage);
      }
      var datas = JSON.stringify(this.processName); //转json字符串//最后拼好的数据
      var data = {
        Name: "YWF_BusinessRemind",
        DefaultVal: this.ShowSave,
        PropertyValueMap: {
          Id: this.currentId,
          BusinessFlowId: this.list_z[0].Id,
          DataMap: datas
        }
      };
      var data2 = JSON.stringify(data); //转成json字符串
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        "name":Yukon.ServiceName.Workflow,
        "operation":"SetJsonData",
        "token":this.token,
        "data":data2,
      }),{
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response)=>{ 
          var result = response.data;
          if (result.code == 0) {
            this.$alert("提交成功", "提示", {
              confirmButtonText: "确定",
              callback: action => {
                //点击确定之后的操作
              }
            });
          } else {
            this.$message({
              type: "error",
              message: result.msg
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
<style lang="scss">
.el-form-item {
  margin-bottom: 0px;
}
</style>
<!-- <style lang="scss">
	.message{
		.el-form-item{
			height: 30px;
			margin-bottom: 0;
			display: inline-block;
			.el-form-item__content{
				height: 30px;
			}
			.el-form-item__label{
				line-height: 30px !important;
			}
		}
		.proName{
			.el-form-item__label{
				line-height: 43px !important;
			}
		}
		.inputMessage{
			.el-form-item__content{
				margin-left: 0 !important;
			}
			.el-input__inner{
				width: 192px;
			}
		}
		.content{
			.input-group{
				margin-top: 10px;
				position: absolute;
			    right: 60px;
			    top: -1px;
			}
			.el-select{
				display: block;
			}
			.form-group{
				margin-top: 18px;
				.el-textarea{
					margin-top: 10px;
				}
			}
			.checkbox{
				margin-top: 18px;
			}
		}
		.btnsMessage{
			width: 600px;
			text-align: center;
		}
		
	}
</style> -->