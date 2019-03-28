<template>
  <div class="edit">
      <el-row class="editBoxRow" >
        <el-col :span="24">
          <el-button size="mini" icon="el-icon-edit" @click="Save">保存</el-button>
        </el-col> 
      </el-row>
      <div class="editBoxTable">
         <el-form 
         :inline="true" 
         :model="form"  
         class="form" 
         size="mini" 
         ref="form"   
         :rules="rules"
         label-position="left"
         label-width="200px">
            <div v-for="item in controlTypeData" v-if="item.IsDispaly!=0" >
              <!--========================普通文本框======================-->
               <el-col :span="12" v-if="item.ControlType=='Input'" >
                    <el-form-item                  
                    :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName" 
                    :prop="item.Code"> 
                         <el-input
                         :disabled="item.IsReadOnly==1"  
                         v-model="form[item.Code]" 
                         size="mini" 
                         @change="ChangeValue(item.Code,form[item.Code])">            
                         </el-input>
                    </el-form-item>
               </el-col>
                 <!--========================密码框======================-->
                <el-col :span="12" v-if="item.ControlType=='Password'" > 
                    <el-form-item v-if="currentEditId==''" :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName"  :prop="item.Code">
                      <el-input 
                      type="password" 
                      :disabled="item.IsReadOnly==1"
                      v-model="form[item.Code]" 
                      size="mini" 
                      @change="ChangeValue(item.Code,form[item.Code])" 
                      auto-complete="off"> 
                      </el-input>       
                    </el-form-item>
                    <el-form-item v-if="currentEditId!=''" :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName"  :prop="item.Code">
                      <el-input 
                      type="password" 
                      :disabled="item.IsReadOnly==1"
                      :readonly="item.CanEdit!=1"
                      v-model="form[item.Code]" 
                      size="mini" 
                      @change="ChangeValue(item.Code,form[item.Code])" 
                      auto-complete="off"> 
                      </el-input>       
                    </el-form-item>
                </el-col>
               <!--========================日期选择器======================-->
                <el-col :span="12" v-if="item.ControlType=='DatePicker'" >
                    <el-form-item
                      
                    :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName" 
                    :prop="item.Code">
                      <el-date-picker 
                      v-model="form[item.Code]" 
                      type="date" 
                      size="mini" 
                      :prop="item.Code"
                      :disabled="item.IsReadOnly==1"  
                      value-format="yyyy-MM-dd"
                      @change="ChangeValue(item.Code,form[item.Code])">       
                      </el-date-picker>      
                    </el-form-item>
                </el-col>

                <!--========================日期时间选择器======================-->
              <el-col :span="12" v-if="item.ControlType =='DateTimePicker'">
                   <el-form-item 
                    :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName" 
                    :prop="item.Code"
                    >  
                      <el-date-picker    
                    v-model="form[item.Code]" 
                    type="datetime"
                    :prop="item.Code"
                    :disabled="item.IsReadOnly==1"
                    @change="ChangeValue(item.Code,form[item.Code])">      
                    </el-date-picker>
                    </el-form-item>  
              </el-col>
              <!--========================时间选择器======================-->
               <el-col :span="12" v-if="item.ControlType=='TimePicker'">               
                   <el-form-item 
                    :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName" 
                    :prop="item.Code"
                    > 
                     <el-time-picker
                      v-model="form[item.Code]"
                      :disabled="item.IsReadOnly==1"
                      :picker-options="{selectableRange: '18:30:00 - 20:30:00' }"
                      @change="ChangeValue(item.Code,form[item.Code])"
                      placeholder="任意时间点">
                    </el-time-picker> 
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
                      v-model="form[item.Code]"
                      type="datetime"
                      placeholder="选择日期时间"
                      @change="ChangeValue(item.Code,form[item.Code])">
                    </el-date-picker> 
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
                      v-model="form[item.Code]" 
                      filterable 
                      size="mini"
                      :prop="item.Code" 
                      @visible-change="item.options || GetEnumData(item.Code)" 
                      @change="ChangeValue(item.Code,form[item.Code])">
                        <el-option 
                           v-for="op in item.options" 
                           :key="op.key" 
                           :label="op.value" 
                           :value="op.key">  
                        </el-option>
                      </el-select>  
                    </el-form-item>  
              </el-col>
                    <!--========================多选下拉框======================-->
               <el-col :span="12" v-if="item.ControlType=='SelectMulti'" >
                    <el-form-item                  
                    :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName" 
                    :prop="item.Code"> 
                         <el-select
                          v-model="form[item.Code]"
                          multiple
                          collapse-tags
                          :prop="item.Code"
                          @visible-change="item.options || GetEnumData(item.Code)" 
                          @change="ChangeValue(item.Code,form[item.Code])">
                          <el-option
                            v-for="op in item.options"
                            :key="op.key"
                            :label="op.value"
                            :value="op.key">
                          </el-option>
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
                      :disabled="item.IsReadOnly==1" 
                      :options="optionsCascader"
                      :prop="item.Code"
                      @change="handleCascaderChange"
                      @focus="GetEnumDataCascader(item.Code)"
                      change-on-select 
                      clearable
                      filterable
                      size='mini'
                      v-model='form[item.Code]'>  
                      </el-cascader>
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
                        v-model="form[item.Code]"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="ChangeValue(item.Code,form[item.Code])">
                      </el-switch>  
                    </el-form-item> 
              </el-col>
             <!--========================滑块======================-->
              <el-col :span="12" v-if="item.ControlType=='Slider'">
               
                   <el-form-item 
                    :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName" 
                    :prop="item.Code"> 
                       <el-slider 
                         :disabled="item.IsReadOnly==1"
                         v-model="form[item.Code]"  
                         @change="ChangeValue(item.Code,form[item.Code])">     
                      </el-slider> 
                    </el-form-item>
               </el-col> 
                <!--========================单选选择======================-->
              <el-col :span="12" v-if="item.ControlType=='Radio'">
                   <el-form-item 
                    :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName" 
                    :prop="item.Code"
                   > 
                     <el-radio-group 
                       v-model="form[item.Code]" 
                        :disabled="item.IsReadOnly==1" 
                       @change="ChangeValue(item.Code,form[item.Code])">
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
                      v-model="form[item.Code]" 
                      @change="ChangeValue(item.Code,form[item.Code])">
                     </el-checkbox>    
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
                      v-model="form[item.Code]" 
                      @change="ChangeValue(item.Code,form[item.Code])" 
                      :min="0"
                      label="描述文字"> 
                    </el-input-number> 
                    </el-form-item>  
              </el-col>
             <!--========================上传======================-->
               <el-col :span="12" v-if="item.ControlType=='Upload'">            
                  <el-form-item 
                    :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName" 
                    :prop="item.Code">  
                    </el-form-item>  
              </el-col>
              <!--========================评分======================-->
              <el-col :span="12" v-if="item.ControlType=='Rate'">
                  <el-form-item 
                    :label="item.CanBeNull=='0'?item.CnName+'*':item.CnName" 
                    :prop="item.Code"
                    :disabled="item.IsReadOnly==1">
                      <el-rate  
                      v-model="form[item.Code]" 
                      @change="ChangeValue(item.Code,form[item.Code])"> 
                      </el-rate>  
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
  import formValidator from '../../../assets/public/js/formValidator'  //表单验证类型
   export default {
    props:['serviceName','operationTableName','editId','targetName'],
    data() {   
      return{
        form:{
        },
        controlTypeDataTemp:[],
        controlTypeData    :[],//控件数据
        setData            :{},//保存数据
        currentEditId      :'',//当前ID
        fieldNameArray     :[],//字段集合
        optionsCascader    :[],//联动下拉框
        selectCascader     :[],//联动下拉框model
        options            :[],
        rules              :{},//表单验证规则
   
      };      
    },
    computed:{
      ...mapGetters(['token']),
    },
    watch: {
       editId(newVal,oldVal){     
        if(newVal.substring(0,2)=='ID'){
          this.currentEditId = "";
          this.getColumns();
        }else {
          let idArray =newVal.split(",");
          this.currentEditId = idArray[1];
          this.getColumns();
        }
        this.form={};
        this.setData={};
       }
    },
    mounted () { 
      if(this.editId.substring(0,2)=='ID'){
        this.currentEditId = '';
      }else{
        let idArray =this.editId.split(",");
        this.currentEditId = idArray[1];
      }
        this.getColumns();
    },
    methods: {
     cboxChange(val){
      if (val=="是") {
        val=true;
      }else{
        val=false;
      }
        return val;
     },
     getColumns(){ 
        var data = { "name":"DBField","TblName":this.operationTableName};
        var reqInfoData = JSON.stringify(data); 
        this.$http.post(Yukon.Url.Bus,qs.stringify({
          "name":this.serviceName,
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
            this.controlTypeData = Object.assign({},this.controlTypeDataTemp);
            if (this.currentEditId != null && this.currentEditId != ""){
              this.getJsonData();
            }
            for(var i in this.controlTypeDataTemp){ //表单验证
               if (this.controlTypeDataTemp[i].CanBeNull=="0") {
               this.rules[this.controlTypeDataTemp[i].Code]=[
                      { validator: formValidator.checkNull, trigger: 'blur' }
                    ]
               }
            }
          }
        }).catch((error)=>{
          console.log(error);
        })
      if(this.operationTableName == 'CstUser') {
          this.GetEnumDataCascader('Department_Name');
        } 
     },
     getJsonData(){
        var data = {
          "Name":this.operationTableName,
          "DefaultVal":"Search", 
          "Filter":"Id,==,"+this.currentEditId+",And;"            
        }
        var reqInfoData = JSON.stringify(data);
        this.$http.post(Yukon.Url.Bus,qs.stringify({
          "name":this.serviceName,
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
              columnsData = columnsData[0].PropertyValueMap;
            }
            this.columnsDataT=columnsData
            for (var i in columnsData) {
              for(var p in this.controlTypeDataTemp){
                if (this.controlTypeDataTemp[p].Code == i){ 
                  this.form[this.controlTypeDataTemp[p].Code] = columnsData[i] 
                }

              }
            }
            if(this.operationTableName == 'CstUser'){
              // this.selectCascader = [];              
              for (var i in columnsData) {
                if (i=="DepartmentExtend" && columnsData[i]!=null && columnsData[i]!='') {
                    // this.selectCascader = columnsData[i].split(',');
                    this.form['Department_Name'] = columnsData[i].split(','); 
                } 
              }
            }
            if (this.operationTableName == 'SysModular') {//用户角色'是'=true
            if (this.form.CanSell=='是') {
                this.form.CanSell=true;
            }else{
                this.form.CanSell=false;
            }if (this.form.IsEssential=='是') {
              this.form.IsEssential=true;
            }else{
              this.form.IsEssential=false;
            }
              this.form.CanSell=='是'?true:false;
              this.form.IsEssential=='是'?true:false;
            }
          }
          this.form = Object.assign({},this.form);
        }).catch((error)=> { 
          console.log(error);
        })
     },
     Save(){
       debugger
       // this.$refs.form.validate((valid) => {//表单验证
       
       //       if (valid) {//验证通过
              var operation = 'NewSave';
              if(this.currentEditId !== ''){
                operation = 'EditSave';
                this.setData['Id']=this.currentEditId;
              }        
              var objData = {
                "Name": this.operationTableName,
                "DefaultVal": operation,
                "PropertyValueMap": this.setData
              }
              var data = JSON.stringify(objData);
              this.$http.post(Yukon.Url.Bus,qs.stringify({
                "name":this.serviceName,
                "operation":"SetJsonData",
                "token":this.token,
                "data": data
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
                      bus.$emit('colseTabs',this.targetName);
                    }
                  });
                }else{
                  this.$alert(result.msg, '提示', {
                    confirmButtonText: '确定',
                      callback: action => {              
                    }
                  });
                }
            }).catch(function (error) {
              console.log(error);
           });
        //   } else {//验证失败
        //     this.$alert('存在必填项未填写', '提示', {
        //           confirmButtonText: '确定',
        //             callback: action => { 
        //           }
        //     });
        //     return false;
        //   }
        // });
     
     },
     GetEnumDataCascader(Code){
        if (Code!==undefined) {  
          var data={
            "Name": this.operationTableName,
            "EnumField":Code,
            "DefaultVal": "SearchEnum"
          }
          var reqInfoData=JSON.stringify(data);
          this.$http.post(Yukon.Url.Bus,qs.stringify({
            "name":this.serviceName,
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
            // this.form.DepartmentExtend=result.data;
            // this.form = Object.assign({},this.form);           
         })
          .catch((error)=>{
            console.log(error);
          }); 
          }    
     },
     GetEnumData(Code){ 
      if (Code!==undefined) { 
          var data={
            "Name": this.operationTableName,
            "EnumField":Code,
            "DefaultVal": "SearchEnum"
          }
          var reqInfoData=JSON.stringify(data);
          this.$http.post(Yukon.Url.Bus,qs.stringify({
            "name":this.serviceName,
            "operation":"GetJsonData",
            "token":this.token,
            "reqInfo":reqInfoData,
          }),{
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then((response)=>{
              var  result = response.data;  
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
        if(this.operationTableName == 'CstUser') {
          this.setData['DepartmentExtend'] = val.join(",");
          this.setData['DepartmentId'] = val[val.length-1];
        }
     },
     ChangeValue(Code,Value){
      this.setData[Code] = Value;
     }
    }
  }
</script>
