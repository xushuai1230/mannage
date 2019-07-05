<template>
  <div class="edit">
    <el-row class="editBoxRow">
      <el-col :span="24">
        <el-button size="mini" icon="el-icon-edit" @click="Save">保存</el-button>
      </el-col>
    </el-row>
    <div class="editBoxTable">
      <el-form
        :model="formData"
        :inline="true"
        class="form"
        size="mini"
        :rules="rules"
        label-position="left"
        label-width="200px"
        ref="form"
      >
        <div v-for="item in controlData" v-if="item.IsDispaly=='1'">
          <!--========================普通文本框======================-->
          <el-col :span="12" v-if="item.ControlType=='Input'">
            <el-form-item
              :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName"
              :prop="item.Code"
            >
              <el-input
                :disabled="item.IsReadOnly==1"
                v-model="formData[item.Code]"
                size="mini"
                @change="ChangeValue(item.Code,formData[item.Code])"
              ></el-input>
            </el-form-item>
          </el-col>
          <!--========================密码框======================-->
          <el-col :span="12" v-if="item.ControlType=='Password'">
            <el-form-item
              v-if="currentId==''"
              :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName"
              :prop="item.Code"
            >
              <el-input
                type="password"
                :disabled="item.IsReadOnly==1"
                v-model="formData[item.Code]"
                size="mini"
                @change="ChangeValue(item.Code,formData[item.Code])"
                auto-complete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="currentId!=''"
              :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName"
              :prop="item.Code"
            >
              <el-input
                type="password"
                :disabled="item.IsReadOnly==1"
                :readonly="item.CanEdit!=1"
                v-model="formData[item.Code]"
                size="mini"
                @change="ChangeValue(item.Code,formData[item.Code])"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <!--========================日期选择器======================-->
          <el-col :span="12" v-if="item.ControlType=='DatePicker'">
            <el-form-item
              :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName"
              :prop="item.Code"
            >
              <el-date-picker
                v-model="formData[item.Code]"
                type="date"
                size="mini"
                :prop="item.Code"
                :disabled="item.IsReadOnly==1"
                value-format="yyyy-MM-dd"
                @change="ChangeValue(item.Code,formData[item.Code])"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <!--========================日期时间选择器======================-->
          <el-col :span="12" v-if="item.ControlType =='DateTimePicker'">
            <el-form-item
              :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName"
              :prop="item.Code"
            >
              <el-date-picker
                v-model="formData[item.Code]"
                type="datetime"
                :prop="item.Code"
                :disabled="item.IsReadOnly==1"
                @change="ChangeValue(item.Code,formData[item.Code])"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <!--========================时间选择器======================-->
          <el-col :span="12" v-if="item.ControlType=='TimePicker'">
            <el-form-item
              :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName"
              :prop="item.Code"
            >
              <el-time-picker
                v-model="formData[item.Code]"
                :disabled="item.IsReadOnly==1"
                :picker-options="{selectableRange: '18:30:00 - 20:30:00' }"
                @change="ChangeValue(item.Code,formData[item.Code])"
                placeholder="任意时间点"
              ></el-time-picker>
            </el-form-item>
          </el-col>
          <!--========================时间组合(09:00-18:00)======================-->
          <el-col :span="12" v-if="item.ControlType=='TimePickerGroup'">
            <el-form-item
              :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName"
              :prop="item.Code"
            >
              <el-date-picker
                :disabled="item.IsReadOnly==1"
                v-model="formData[item.Code]"
                type="datetime"
                placeholder="选择日期时间"
                @change="ChangeValue(item.Code,formData[item.Code])"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <!--========================下拉框======================-->
          <el-col :span="12" v-if="item.ControlType=='Select'">
            <el-form-item
              :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName"
              :prop="item.Code"
            >
              <el-select
                :disabled="item.IsReadOnly==1"
                v-model="formData[item.Code]"
                filterable
                size="mini"
                :prop="item.Code"
                @visible-change="GetEnumData($event,item.Code)"
                @change="ChangeSelect(item.Code,formData[item.Code],item.Options)"
              >
                <el-option
                  v-for="op in item.Options"
                  :key="op.key"
                  :label="op.value"
                  :value="op.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--========================多选下拉框======================-->
          <el-col :span="12" v-if="item.ControlType=='SelectMulti'">
            <el-form-item
              :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName"
              :prop="item.Code"
            >
              <el-select
                v-model="formData[item.Code]"
                multiple
                collapse-tags
                :prop="item.Code"
                @visible-change="GetEnumData(item.Code)"
                @change="ChangeValue(item.Code,formData[item.Code])"
              >
                <el-option
                  v-for="op in item.Options"
                  :key="op.key"
                  :label="op.value"
                  :value="op.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--========================级联选择器======================-->
          <el-col :span="12" v-if="item.ControlType=='Cascader'">
            <el-form-item
              :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName"
              :prop="item.Code"
            >
              <el-cascader
                v-model="formData[item.Code]"
                :disabled="item.IsReadOnly==1"
                :options="item.Cascaders"
                :prop="item.Code"
                change-on-select
                @change="handleCascaderChange"
                @focus="GetEnumDataCascader(item.Code)"
                size="mini"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <!--========================开关======================-->
          <el-col :span="12" v-if="item.ControlType=='Switch'">
            <el-form-item
              :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName"
              :prop="item.Code"
            >
              <el-switch
                :disabled="item.IsReadOnly==1"
                v-model="formData[item.Code]"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="ChangeValue(item.Code,formData[item.Code])"
              ></el-switch>
            </el-form-item>
          </el-col>
          <!--========================滑块======================-->
          <el-col :span="12" v-if="item.ControlType=='Slider'">
            <el-form-item
              :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName"
              :prop="item.Code"
            >
              <el-slider
                :disabled="item.IsReadOnly==1"
                v-model="formData[item.Code]"
                @change="ChangeValue(item.Code,formData[item.Code])"
              ></el-slider>
            </el-form-item>
          </el-col>
          <!--========================单选选择======================-->
          <el-col :span="12" v-if="item.ControlType=='Radio'">
            <el-form-item
              :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName"
              :prop="item.Code"
            >
              <el-radio-group
                v-model="formData[item.Code]"
                :disabled="item.IsReadOnly==1"
                @change="ChangeValue(item.Code,formData[item.Code])"
              >
                <el-radio :label="3">备选项</el-radio>
                <el-radio :label="6">备选项</el-radio>
                <el-radio :label="9">备选项</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!--========================复选框======================-->
          <el-col :span="12" v-if="item.ControlType=='Checkbox'">
            <el-form-item
              :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName"
              :prop="item.Code"
            >
              <el-checkbox
                :disabled="item.IsReadOnly==1"
                v-model="formData[item.Code]"
                @change="ChangeValue(item.Code,formData[item.Code])"
              ></el-checkbox>
            </el-form-item>
          </el-col>
          <!--========================计数器======================-->
          <el-col :span="12" v-if="item.ControlType=='InputNumber'">
            <el-form-item
              :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName"
              :prop="item.Code"
            >
              <el-input-number
                :disabled="item.IsReadOnly==1"
                v-model="formData[item.Code]"
                @change="ChangeValue(item.Code,formData[item.Code])"
                :min="0"
                label="描述文字"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <!--========================上传======================-->
          <el-col :span="12" v-if="item.ControlType=='Upload'">
            <el-form-item
              :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName"
              :prop="item.Code"
            ></el-form-item>
          </el-col>
          <!--========================评分======================-->
          <el-col :span="12" v-if="item.ControlType=='Rate'">
            <el-form-item
              :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName"
              :prop="item.Code"
              :disabled="item.IsReadOnly==1"
            >
              <el-rate
                v-model="formData[item.Code]"
                @change="ChangeValue(item.Code,formData[item.Code])"
              ></el-rate>
            </el-form-item>
          </el-col>
          <!--========================搜索======================-->
          <el-col :span="12"  v-if="item.ControlType=='Search'">
            <el-form-item :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName"
              :prop="item.Code"
              :disabled="item.IsReadOnly==1">
              <el-input
                :disabled="item.IsReadOnly==1"
                :readonly ="true"
                v-model="formData[item.Code]"    
                @change="ChangeValue(item.Code,formData[item.Code])"
              >
              <el-button style="margin: -1px -10px;" @click="openSearchTable(item)" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
    </div>
    <searchTableDialog
      v-if="searchTableVisible"
      :SearchKey="searchKey"
      :SearchTable="searchTable"
      :SearchDisplay="searchDisplay"
      :searchTableVisible="searchTableVisible"
      v-on:searchReceiveValue="searchReceiveValue"
      v-on:dialogVisible="dialogVisible"
    />
  </div>
</template> 
<script>
import { mapGetters } from "vuex";
import qs from "qs";
import bus from "../../../assets/public/js/eventBus";
import formValidator from "../../../assets/public/js/formValidator"; //表单验证类型
import searchTableDialog from "@/components/common/dialog/searchTable";
export default {
  components: {
    searchTableDialog
  },
  props: [
    "serviceName",
    "operationTableName",
    "editId",
    "targetName",
    "multipleSelection"
  ],
  data() {
    return {
      currentId: "",               // 当前ID
      parentId: "",                // 父子结构数据使用
      fields: [],                  // 字段集合
      controlData: [],             // 控件数据
      formData: {},                // 保存数据
      changeData: {},              // 保存时只提交改变的数据
      tableName: "",               // 当前操作表名
      action: "",                  // 操作 (例如: NewSave EditSave)
      rules: {},                   // 表单验证规则
      searchTableVisible: false,
      searchKey:"",
      searchTable:"",
      searchDisplay:""
    };
  },
  computed: {
    ...mapGetters(["token"])
  },
  watch: {
    editId(newVal, oldVal) {
      if (newVal.Action == "NewSave") {
        this.currentId = "";
      } else {
        this.currentId = newVal.EditId;
      }
      if (newVal.TableName != null) {
        this.tableName = newVal.TableName;
      }
      if (this.tableName == null || this.tableName == "") {
        this.tableName = this.operationTableName;
      }
      this.parentId = newVal.ParentId;
      this.action = newVal.Action;
      this.getColumns();
    }
  },
  mounted() {
    if (this.editId.Action == "NewSave") {
      this.currentId = "";
    } else {
      this.currentId = this.editId.EditId;
    }
    if (this.editId.TableName != null) {
      this.tableName = this.editId.TableName;
    }
    if (this.tableName == null || this.tableName == "") {
      this.tableName = this.operationTableName;
    }
    this.parentId = this.editId.ParentId;
    this.action = this.editId.Action;
    this.getColumns();
  },
  methods: {
    getColumns() {
      this.fields = [];
      this.controlData = [];
      this.formData = {};
      this.changeData = {};
      var data = { name: "DBField", TblName: this.tableName };
      var reqInfoData = JSON.stringify(data);
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: this.serviceName,
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
          var result = response.data;
          if (result.code == 0) {
            var data = result.data;
            for (var i in data) {
              // 获取控件数据，下拉框、级联选择器 数据源 赋值空数组
              this.fields[i] = data[i].PropertyValueMap.Code;
              this.controlData[i] = data[i].PropertyValueMap;
              this.controlData[i].Options = [];
              this.controlData[i].Cascaders = [];
            }
            // 开启表单验证
            if (this.action == "EditSave") {
              this.getData();
            }
            this.controlData = Object.assign({}, this.controlData);
            for (var i in this.controlData) {
              if (this.controlData[i].CanBeNull == "0") {
                this.rules[this.controlData[i].Code] = [
                  { validator: formValidator.checkNull, trigger: "blur" }
                ];
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData() {
      var data = {
        Name: this.tableName,
        DefaultVal: "Search",
        Properties: this.fields,
        Filter: "Id,==," + this.currentId + ",And;"
      };
      var reqInfoData = JSON.stringify(data);
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: this.serviceName,
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
          var result = response.data;
          if (result.code == 0 && result.data != null) {
            var data = result.data[0].PropertyValueMap;
            for (var i in data) {
              for (var j in this.controlData) {
                if (this.controlData[j].Code == i) {
                  // 目前关联属性只支持一级 例如  Role_Id
                  var fieldVal = "";
                  var fieldStr = this.controlData[j].Code;
                  var fieldKey = fieldStr;
                  var fieldAry = fieldStr.split("_");
                  if (fieldAry.length > 1 && fieldAry[1] == "Id") {
                    fieldKey = fieldAry[0] + "_Name";
                    fieldVal = data[fieldKey];
                    if (this.controlData[j].ControlType == "Cascader") {
                      if (this.tableName == "CstUser") {
                        fieldVal = data["DepartmentExtend"].split(",");
                      }
                    }
                  } else {
                    fieldVal = data[fieldKey];
                  }
                  this.formData[fieldStr] = fieldVal;
                }
              }
            }
            if (this.tableName == "SysModular") {
              if (this.formData.CanSell == "是") {
                this.formData.CanSell = true;
              } else {
                this.formData.CanSell = false;
              }
              if (this.formData.IsEssential == "是") {
                this.formData.IsEssential = true;
              } else {
                this.formData.IsEssential = false;
              }
              this.formData.CanSell == "是" ? true : false;
              this.formData.IsEssential == "是" ? true : false;
            }
            if (this.tableName == "EventFilter") {
              this.formData.TenantId = this.formData.TenantName;
              this.formData.Module = this.formData.ModuleName;
              this.formData.Bill = this.formData.BillName;
              this.formData.Operation = this.formData.OperationName;
            }
          }
          if (this.tableName == "CstUser") {
            this.GetEnumDataCascader("Department_Id");
          }
          this.formData = Object.assign({}, this.formData);
        })
        .catch(error => {
          console.log(error);
        });
    },
    Save() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false;
        }
      });
      for (var i in this.controlData) {
        if (
          this.controlData[i].CanBeNull == "0" &&
          this.controlData[i].IsDispaly == "1"
        ) {
          var columnsList = this.controlData[i].EnName;
          var name = this.controlData[i].CnName;
          var columnVal = this.formData[columnsList];
          columnVal = $.trim(columnVal);
          if (columnVal == "") {
            this.$alert("[" + name + "]　 未填写", "提示", {
              confirmButtonText: "确定",
              callback: action => {}
            });
            return false;
          }
        }
      }
      if (this.tableName == "CstUser") {
        delete this.changeData.Department_Id;
      }
      if (this.action == "NewSave") {
        this.changeData["Id"] = "";
      } else if (this.action == "EditSave") {
        this.changeData["Id"] = this.currentId;
      }
      if (this.tableName == "CstDepartment") {
        if (this.action == "NewSave" && this.currentId == "") {
          this.changeData["ParentId"] = this.parentId;
        }
      }
      var objData = {
        Name: this.tableName,
        DefaultVal: this.action,
        PropertyValueMap: this.changeData
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
            this.$alert("保存成功", "提示", {
              confirmButtonText: "确定",
              callback: action => {
                bus.$emit("listenerRefreshTable", "refresh");
                bus.$emit("colseTabs", this.targetName);
              }
            });
          } else {
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
    GetEnumDataCascader(code) {
      if (code !== undefined) {
        var data = {
          Name: this.tableName,
          EnumField: code,
          DefaultVal: "SearchEnum"
        };
        var reqInfoData = JSON.stringify(data);
        this.$http
          .post(
            Yukon.Url.Bus,
            qs.stringify({
              name: this.serviceName,
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
            var result = response.data;
            if (result.code == 0) {
              for (var i in this.controlData) {
                if (this.controlData[i].Code == code) {
                  this.controlData[i].Cascaders = result.data;
                }
              }
            }
            this.controlData = Object.assign({}, this.controlData);
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    GetEnumData(event, code) {
      /*event true 展开*/
      var execute = false;
      if (event == true && code !== undefined && code !== "") {
        execute = true;
      }
      if (execute) {
        var data = {
          Name: this.tableName,
          EnumField: code,
          DefaultVal: "SearchEnum"
        };
        if (this.tableName == "EventFilter") {
          if (code == "Bill") {
            data = {
              Name: this.tableName,
              EnumField: code,
              DefaultVal: "SearchEnum",
              ID: this.changeData["Module"]
            };
          }
          if (code == "Operation") {
            data = {
              Name: this.tableName,
              EnumField: code,
              DefaultVal: "SearchEnum",
              ID: this.changeData["Module"]
            };
          }
        }
        var reqInfoData = JSON.stringify(data);
        this.$http
          .post(
            Yukon.Url.Bus,
            qs.stringify({
              name: this.serviceName,
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
            var result = response.data;
            if (result.code == 0) {
              for (var i in this.controlData) {
                if (this.controlData[i].Code == code) {
                  this.controlData[i].Options = result.data;
                }
              }
              this.controlData = Object.assign({}, this.controlData);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    handleCascaderChange(val) {
      if (this.tableName == "CstUser") {
        this.changeData["DepartmentExtend"] = val.join(",");
        this.changeData["DepartmentId"] = val[val.length - 1];
      }
    },
    ChangeValue(code, value) {
      this.formData[code] = value;
      this.changeData[code] = value;
    },
    ChangeSelect(code, value, options) {
      this.formData[code] = value;
      this.changeData[code] = value;
      if (this.tableName == "EventFilter") {
        var temp = options.find(item => {
          return item.key === value;
        });
        temp = temp.value;
        switch (code) {
          case "TenantId":
            this.changeData["TenantName"] = temp;
            break;
          case "Module":
            this.changeData["ModuleName"] = temp;
            break;
          case "Bill":
            this.changeData["BillName"] = temp;
            break;
          case "Operation":
            this.changeData["OperationName"] = temp;
            break;
        }
      }
    },
    searchReceiveValue(code,data) {
      if(data!==null){
        this.formData[code] = data[this.searchDisplay];
        this.changeData[code] = data['Id'];
      }
    },
    openSearchTable(item) {
      this.searchKey = item.Code;
      this.searchTable = item.SearchTable;
      this.searchDisplay = item.SearchDisplay;
      this.searchTableVisible = true;
    },
    dialogVisible(val) {
      this.searchTableVisible = val;
    }
  }
};
</script>
