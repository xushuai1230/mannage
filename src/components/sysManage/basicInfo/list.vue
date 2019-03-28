<template>
  <div class="edit">
    <el-row class="editBoxRow" >
      <el-col :span="24">
        <el-button size="mini" icon="el-icon-edit" @click="Save">保存</el-button>
      </el-col> 
    </el-row>
    <div class="editBoxTable">
      <el-form :inline="true" :model="form"  class="form" size="mini" ref="form"  label-position="left"
         label-width="200px"> 
        <div v-for="item in controlTypeData" v-if="item.IsDispaly!=0" >
          <el-col :span="12" v-if="item.ControlType=='Input'" >           
              <el-form-item  :label="item.CnName">
                   <el-input 
                :disabled="item.IsReadOnly==1"
                :readonly="item.IsReadOnly == 1"
                ref="input"
                v-model="item.Value" 
                size="mini" 
                @change="ChangeValue(item.Code,item.Value)">            
              </el-input>
              </el-form-item>
          </el-col>

          <el-col :span="12" v-if="item.ControlType=='Password'" >
              <el-form-item  :label="item.CnName" prop="checkPass">
                   <el-input type="password" 
                  :readonly="item.IsReadOnly == 1" 
                  ref="input" 
                  v-model="item.Value" 
                  size="mini" 
                  @change="ChangeValue(item.Code,item.Value)" 
                  auto-complete="off"> 
                 </el-input>    
              </el-form-item> 
          </el-col>

          <el-col :span="12" v-if="item.ControlType =='DatePicker'">
              <el-form-item  :label="item.CnName">
                  <el-date-picker 
                  v-model="item.Value" 
                  type="date" 
                  size="mini"  
                  value-format="yyyy-MM-dd"
                  @change="ChangeValue(item.Code,item.Value)">       
                </el-date-picker>
              </el-form-item> 
          </el-col>

          <el-col :span="12" v-if="item.ControlType =='DateTimePicker'">
              <el-form-item  :label="item.CnName">
                 <el-date-picker 
                v-model="item.Value" 
                type="datetime"
                @change="ChangeValue(item.Code,item.Value)">      
                </el-date-picker>
              </el-form-item> 
          </el-col>
          <!--下拉框-->
          <el-col :span="12" v-if="item.ControlType=='Select'">
              <el-form-item  :label="item.CnName">          
                <el-select  
                v-model="item.Value" 
                filterable size="mini" 
                @visible-change="item.options || GetEnumData(item.Code)" 
                @change="ChangeValue(item.Code,item.Value)">
                  <el-option 
                      v-for="op in item.options" 
                      :key="op.key" 
                      :label="op.value" 
                      :value="op.key">  
                  </el-option>
                </el-select>
              </el-form-item> 
          </el-col>

          <el-col :span="12" v-if="item.ControlType=='Cascader'">
              <el-form-item  :label="item.CnName" >
                 <el-cascader
                :options="optionsCascader"
                @change="handleCascaderChange"
                @focus="GetEnumDataCascader(item.Code)"
                change-on-select 
                clearable
                filterable
                size='mini'
                v-model='selectCascader'>  
              </el-cascader>
              </el-form-item> 
          </el-col>

          <el-col :span="12" v-if="item.ControlType=='Switch'">
              <el-form-item  :label="item.CnName" >
                   <el-switch
                  v-model="item.Value"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="ChangeValue(item.Code,item.Value)">
                </el-switch>
              </el-form-item> 
          </el-col>

          <el-col :span="12" v-if="item.ControlType=='Slider'">
            
              <el-form-item  :label="item.CnName" >
                  <el-slider v-model="item.Value"  @change="ChangeValue(item.Code,item.Value)"></el-slider>
              </el-form-item> 

          </el-col>
              
          <el-col :span="12" v-if="item.ControlType=='Radio'">
              <el-form-item  :label="item.CnName" >
                   <el-radio-group v-model="item.Value"  @change="ChangeValue(item.Code,item.Value)">
                    <el-radio :label="3">备选项</el-radio>
                    <el-radio :label="6">备选项</el-radio>
                    <el-radio :label="9">备选项</el-radio>
                  </el-radio-group>
              </el-form-item> 
          </el-col>
 
          <el-col :span="12" v-if="item.ControlType=='Checkbox'">
              <el-form-item  :label="item.CnName" >
                   <el-checkbox v-model="item.Value" @change="ChangeValue(item.Code,item.Value)">{{item.CnName}}</el-checkbox> 
              </el-form-item> 
          </el-col>
               
          <el-col :span="12" v-if="item.ControlType=='InputNumber'">           
              <el-form-item  :label="item.CnName" >
                    <el-input-number v-model="item.Value" @change="ChangeValue(item.Code,item.Value)" :min="1" :max="10" label="描述文字"> 
                    </el-input-number>
              </el-form-item> 
          </el-col>

          <el-col :span="12" v-if="item.ControlType=='TimePicker'">        
              <el-form-item  :label="item.CnName" >
                  <el-time-picker
                  v-model="item.Value"
                  :picker-options="{selectableRange: '18:30:00 - 20:30:00' }"
                  @change="ChangeValue(item.Code,item.Value)"
                  placeholder="任意时间点">
                </el-time-picker>
              </el-form-item> 
          </el-col>
             
          <el-col :span="12" v-if="item.ControlType=='DateTimePicker'">         
              <el-form-item  :label="item.CnName" >
                 <el-date-picker
                v-model="item.Value"
                type="datetime"
                placeholder="选择日期时间"
                @change="ChangeValue(item.Code,item.Value)">
              </el-date-picker>
              </el-form-item>
          </el-col>

          <el-col :span="12" v-if="item.ControlType=='Upload'">
              <el-form-item  :label="item.CnName" ></el-form-item> 
          </el-col>

          <el-col :span="12" v-if="item.ControlType=='Rate'">
              <el-form-item  :label="item.CnName" >
                 <el-rate v-model="item.Value" @change="ChangeValue(item.Code,item.Value)"></el-rate>
              </el-form-item>   
          </el-col>

          </div>
        </el-form>
      </div>
</div>
</template> 
<script>
  import {mapGetters} from 'vuex'
  import qs from 'qs'
  import bus from '../../../assets/public/js/eventBus' 
   export default {
    props:['serviceName','targetName'],
    data() {
      return{
        form:{},
        controlTypeDataTemp:[],
        controlTypeData    :[],//控件数据
        setData            :{},//保存数据
        currentEditId      :'',//当前ID
        fieldNameArray     :[],//字段集合
        optionsCascader    :[],//联动下拉框
        selectCascader     :[],//联动下拉框model
        options            :[],
      };      
    },
    computed:{
      ...mapGetters(['token']),
    },
    mounted () { 
        this.getColumns();
    },
    methods: {
     getColumns(){ 
        var data = { "name":"DBField","TblName":"CstUser"};
        var reqInfoData = JSON.stringify(data);
        this.$http.post(Yukon.Url.Bus,qs.stringify({
            "name":Yukon.ServiceName.Tenant,
            "operation":"GetJsonData",
            "token":this.token,
            "reqInfo":reqInfoData,
        }),{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response)=>{
          var result = response.data;
          if(result.code == 0){
            var columns = result.data;
            for (var p in columns) {
              columns[p].PropertyValueMap.Value = '';
              this.controlTypeDataTemp[p] = columns[p].PropertyValueMap;
              this.fieldNameArray[p] = columns[p].PropertyValueMap.Code;
            }    
            this.getJsonData();
          }
        }).catch((error)=>{
          console.log(error);
        })
        this.GetEnumDataCascader('Department_Name');
     },
     getJsonData(){
        var data = {
          "Name":"CstUser",
          "DefaultVal":"SearchPersonalInfo", 
          "Filter":""           
        }
        var reqInfoData = JSON.stringify(data);
        this.$http.post(Yukon.Url.Bus,qs.stringify({
            "name":Yukon.ServiceName.Tenant,
            "operation":"GetJsonData",
            "token":this.token,
            "reqInfo":reqInfoData,
        }),{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response)=>{
          var result = response.data;
          if(result.code == 0){
            var columnsData = result.data;
            if(columnsData != null){
              columnsData = columnsData.PropertyValueMap;
            }
            for (var i in columnsData) {
              for(var p in this.controlTypeDataTemp){
                if (this.controlTypeDataTemp[p].Code == i){   
                  this.controlTypeDataTemp[p]["Value"] = columnsData[i];
                }
              }
            }
            this.selectCascader = [];              
            for (var i in columnsData) {
              if (i=="DepartmentExtend" && columnsData[i]!=null && columnsData[i]!='') {
                  this.selectCascader = columnsData[i].split(',');
              }
            }
          }
          this.controlTypeData = Object.assign({},this.controlTypeDataTemp);
        }).catch((error)=> { 
          console.log(error);
        })
     },
     Save(){     
        var objData = {
          "Name": "CstUser",
          "DefaultVal": 'UpdatePersonalInfo',
          "PropertyValueMap": this.setData
        }
        var data = JSON.stringify(objData);
        this.$http.post(Yukon.Url.Bus,qs.stringify({
            "name":Yukon.ServiceName.Tenant,
            "operation":"SetJsonData",
            "token":this.token,
            "data":data,
        }),{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response)=>{
          var result = response.data;
          if (result.code == 0) {
            this.$alert('保存成功', '提示', {
              confirmButtonText: '确定',
                callback: action => { 
                bus.$emit('listenerRefreshTable','refresh');  
                // bus.$emit('colseTabs',this.targetName);
              }
            });
          }else {
            this.$alert(result.msg, '提示', {
              confirmButtonText: '确定',
                callback: action => {              
              }
            });
          }
        }).catch(function (error) {
            console.log(error);
        });
     },
     GetEnumDataCascader(Code){
        if (Code!==undefined) {  
          var data={
            "Name": "CstUser",
            "EnumField":Code,
            "DefaultVal": "SearchEnum"
          }
          var reqInfoData=JSON.stringify(data);
          this.$http.post(Yukon.Url.Bus,qs.stringify({
            "name":Yukon.ServiceName.Tenant,
            "operation":"GetJsonData",
            "token":this.token,
            "reqInfo":reqInfoData,
          }),{
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then((response)=>{
            var result = response.data;
            if(result.code == 0){
              this.optionsCascader = result.data;
            }                     
         })
          .catch((error)=>{
            console.log(error);
          }); 
          }    
     },
     GetEnumData(Code){ 
      if (Code!==undefined) { 
          var data={
            "Name": "CstUser",
            "EnumField":Code,
            "DefaultVal": "SearchEnum"
          }
          var reqInfoData=JSON.stringify(data);
          this.$http.post(Yukon.Url.Bus,qs.stringify({
            "name":Yukon.ServiceName.Tenant,
            "operation":"GetJsonData",
            "token":this.token,
            "reqInfo":reqInfoData,
          }),{
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then((response)=>{
              var result = response.data;   
              if(result.code == 0){
                this.options =result.data; 
                for (var i in this.controlTypeDataTemp) {
                  if (this.controlTypeDataTemp[i].Code==Code) {                            
                    this.controlTypeDataTemp[i]["options"]= this.options;                                             
                  } 
                } 
                this.controlTypeData=Object.assign({},this.controlTypeDataTemp); 
              }                  
         })
          .catch((error)=>{
            console.log(error);
          });
          }    
     },
     handleCascaderChange(val){
      this.setData['DepartmentExtend'] = val.join(",");
      this.setData['DepartmentId'] = val[val.length-1];
     },
     ChangeValue(Code,Value){
      this.setData[Code] = Value;
     }
    }
  }
</script>
