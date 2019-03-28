<template>
  <div class="edit">
    <el-row class="editBoxRow">
      <el-col :span="24">
        <el-button size="mini" icon="el-icon-edit" @click="Save">保存</el-button>
      </el-col>
    </el-row>
    <div class="editBoxTable">
      <el-form ref="form" :model="form" class="form"  label-position="left" size="mini" :inline="true"
          label-width="200px">
        <el-col :span="12" >
          <el-form-item label="编号*">
             <el-input v-model="form.code" size="mini"></el-input>
          </el-form-item> 
        </el-col> 
        <el-col :span="12" >
          <el-form-item label="名称">
             <el-input v-model="form.name" size="mini"></el-input>
          </el-form-item> 
        </el-col>
        <el-col :span="12" >
          <el-form-item label="模块*">
              <el-select v-model="form.module" auto-complete="off" size="mini" @visible-change="ClickOption($event,form.module)">
              <el-option
                v-for="item in moduleOption"
                :key="item.key"
                :label="item.value" 
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item> 
        </el-col>
        <el-col :span="12" >
          <el-form-item label="单据*">
              <el-select v-model="form.bill" auto-complete="off" size="mini" @visible-change="ClickNextOption($event,'Bill')">
              <el-option
                v-for="item in billOption"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item> 
        </el-col>  
        <el-col :span="12" >
          <el-form-item label="操作*">
              <el-select v-model="form.operation" auto-complete="off" size="mini" @visible-change="ClickNextOption($event,'Operation')">
              <el-option
                v-for="item in operOption"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item> 
        </el-col>  
        <el-col :span="12" >
          <el-form-item label="工作流">
              <el-select v-model="form.businessFlow" auto-complete="off" size="mini" @visible-change="ClickFlowOption($event,'BusinessFlow')">
              <el-option
                v-for="item in businessOption"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item> 
        </el-col>  
        <el-col :span="12" >
          <el-form-item label="备注">
              <el-input type="textarea" v-model="form.remark" size="mini"></el-input>
          </el-form-item>
        </el-col>  
        <el-col :span="12" >
          <el-form-item label="是否启用">
              <el-select v-model="form.checkbox" auto-complete="off" size="mini">
              <el-option
                v-for="item in checkOption"
                :key="item.Id"
                :label="item.Name"
                :value="item.Name">
              </el-option>
            </el-select>
          </el-form-item> 
        </el-col> 
      </el-form>
    </div>
  </div>
</template>
<script>
import qs from 'qs';
import {mapGetters} from 'vuex'
import bus from '../../../assets/public/js/eventBus' 
export default {
  props: ['refresh','event', 'editId','targetName'],
  data() {
    return {
      form: {
        code:'',
        name:'',
        module:'',
        bill:'',
        operation:'',
        businessFlow:'',
        remark:'',
        checkbox:''
      },
      ModuleName: '',
      BillName: "",
      OperationName: "",
      currentEditId:'',
      divHeight:'',
      moduleOption:[],
      businessOption:[],
      billOption:[],
      operOption:[],
      moduleValue:'',
      checkOption:[{
        Id:'true',
        Name:'是'
      },{
        Id:'false',
        Name:'否'
      },],
    }
  },
  computed:{
    currentView(){    
      return this.arr[this.index];
    },
    ...mapGetters(['token']), 
  },
  watch: {
    editId: function(newVal,oldVal){
        if(newVal.substring(0,2)=='ID'){
          this.currentEditId = "";
          this.form ={
            code:'',
            name:'',
            module:'',
            bill:'',
            operation:'',
            businessFlow:'',
            remark:'',
            checkbox:'',
          }
        }else{
          let idArray =newVal.split(",");
          this.currentEditId = idArray[1];  
        }
          this.getData();
       }
  },
  mounted () { 
    if(this.editId.substring(0,2)=='ID'){
      this.currentEditId = '';
      this.form ={
        code:'',
        name:'',
        module:'',
        bill:'',
        operation:'',
        businessFlow:'',
        remark:'',
        checkbox:'',
      }
    }else{
       let idArray =this.editId.split(",");
      this.currentEditId = idArray[1];
    }
      this.getData();
  },
  methods: {
    //编辑查询
    getData(){
      var data = {
        "Name": "EventFilter",
        "DefaultVal": "Search",
        "Filter":"Id,==," +this.currentEditId+ ",And;"
      }
      var dataStr = JSON.stringify(data);
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        "name":Yukon.ServiceName.Workflow,
        "operation":"GetJsonData",
        "token":this.token,
        "reqInfo":dataStr,
      }),{
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response)=>{ 
        var result = response.body;
        if(result.code == 0){
          var property = [];
          if (result.data && result.data.length > 0) {
            for (var i = 0; i < result.data.length; i++) {
              property.push(result.data[i].PropertyValueMap)
            }
            this.form.code=property[0].Code,
          this.form.name=property[0].Name,
          this.form.remark=property[0].Remark,
          this.form.checkbox = property[0].IsSendMessage,
          this.form.module = property[0].Module,
          this.form.bill = property[0].Bill,
          this.form.operation = property[0].Operation,
          this.form.businessFlow = property[0].BusinessFlow,
          this.ClickOption(true,this.form.module);
          this.ClickNextOption(true,"Bill");
          this.ClickNextOption(true,"Operation");
          this.ClickFlowOption(true,"BusinessFlow");
          }else {
            this.ClickOption(true,this.form.module);
          this.ClickNextOption(true,"Bill");
          this.ClickNextOption(true,"Operation");
          this.ClickFlowOption(true,"BusinessFlow");
          }
          
        }else{
          this.$message({
            type: 'error',
            message: result.msg,
          }); 
        }
      })
      .catch((error)=> {
        console.log(error);
      });
    },
      //获取下拉框数据
     ClickOption(row,val){ 
        if(row==true){
          var data={
           "Name": "EventFilter",
           "EnumField":"Module",
           "DefaultVal":"SearchEnum",
          }
          this.moduleValue = val;
          var reqInfoData = JSON.stringify(data);
          this.$http.post(Yukon.Url.Bus,qs.stringify({
            "name":Yukon.ServiceName.Workflow,
            "operation":"GetJsonData",
            "token":this.token,
            "reqInfo":reqInfoData,
          }),{
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then((response)=>{ 
            var result = response.body;
            if(result.code == 0){
              this.moduleOption = result.data;
              for(var i=0;i<this.moduleOption.length;i++){
                if(this.form.model==this.moduleOption[i].key){
                  this.form.model=this.moduleOption[i].value
                }
              }
            }
          })
          .catch((error)=>{
            console.log(error);
          }); 
        }else if (val != undefined){
          this.moduleValue=val;
        }
     },
     ClickNextOption(row,val){
        if(row==true && this.moduleValue !=""){
          var data={
           "Name": "EventFilter",
           "EnumField":val,
           "DefaultVal":"SearchEnum",
           "Id": this.moduleValue
          }
          var reqInfoData=JSON.stringify(data);
          this.$http.post(Yukon.Url.Bus,qs.stringify({
            "name":Yukon.ServiceName.Workflow,
            "operation":"GetJsonData",
            "token":this.token,
            "reqInfo":reqInfoData,
          }),{
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then((response)=>{ 
            var result = response.body;
            if(result.code == 0){
              if(val=="Bill"){
                this.billOption = result.data;
                for(var i=0;i<this.billOption;i++){
                  if(this.form.bill==this.billOption[i].key){
                    this.form.bill=this.billOption[i].value
                  }
                }
              }else{
                this.operOption=result.data;
                for(var i=0;i<this.operOption;i++){
                  if(this.form.operation==this.operOption[i].key){
                    this.form.operation=this.operOption[i].value
                  }
                }
              }
            }
          })
          .catch((error)=>{
            console.log(error);
          }); 
        }else if(row==true && this.moduleValue ==""){
          this.form.bill = "",
          this.form.operation = "",
          this.$alert("请先选择模块！", '提示', {
            confirmButtonText: '确定',
              callback: action => {
            }
          });
        }
     },
     ClickFlowOption(row,val){
        if(row==true){
          var data={
           "Name": "EventFilter",
           "EnumField":val,
           "DefaultVal":"SearchEnum",
          }
          var reqInfoData=JSON.stringify(data);
          this.$http.post(Yukon.Url.Bus,qs.stringify({
            "name":Yukon.ServiceName.Workflow,
            "operation":"GetJsonData",
            "token":this.token,
            "reqInfo":reqInfoData,
          }),{
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then((response)=>{ 
            var result = response.body;
            if(result.code == 0){
              this.businessOption = result.data;
              for(var i=0;i<this.businessOption;i++){
                if(this.form.businessFlow==this.businessOption[i].key){
                  this.form.businessFlow=this.businessOption[i].value
                }
              }
            }
          })
          .catch((error)=>{
            console.log(error);
        }); 
      }
    },
    //保存按钮
    Save(){
      if(this.form.code==''){
        this.$alert("编号为必填项！", '提示', {
          confirmButtonText: '确定',
            callback: action => {
          }
        });
      }else if(this.form.operation==''){
        this.$alert("操作为必填项！", '提示', {
          confirmButtonText: '确定',
            callback: action => {
          }
        });
      }else if(this.form.checkbox==''){
        this.$alert("是否启用为必填项！", '提示', {
          confirmButtonText: '确定',
            callback: action => {
          }
        });
      }else{
        var operation = '-1';
        //下拉框数据
        for(var i=0;i<this.billOption.length;i++){
           if(this.billOption[i].key == this.form.bill) {
            this.BillName = this.billOption[i].value
          }
          if(this.form.bill ==this.billOption[i].Name){
            this.form.bill = this.billOption[i].Id;
            break;
          }
        }
        for(var j=0;j<this.operOption.length;j++){
           if(this.operOption[j].key == this.form.operation) {
            this.OperationName = this.operOption[j].value
          }
          if(this.form.operation ==this.operOption[j].Name){
            this.form.operation = this.operOption[j].Id;
            break;
          }
        }
        for(var j=0;j<this.businessOption.length;j++){
          if(this.form.businessFlow ==this.businessOption[j].Name){
            this.form.businessFlow = this.businessOption[j].Id;
            break;
          }
        }
        for(var k=0;k<this.checkOption.length;k++){
          if(this.form.checkbox ==this.checkOption[k].Name){
            this.form.checkbox = this.checkOption[k].Id; 
            break;
          }
        }
        for(let i =0;i < this.moduleOption.length;i++) {
          if(this.moduleOption[i].key == this.form.module) {
            this.ModuleName = this.moduleOption[i].value
          }
        }
        if (this.currentEditId != null && this.currentEditId != ""){
          //编辑保存
          operation = "EditSave";
        }else{
          //新增保存
          operation = "NewSave";
        }
        if(operation== '-1'){
        }else{
            var dataparams = {
            "Name": "EventFilter",
            "DefaultVal": operation,
            "PropertyValueMap": {
              "Id": this.currentEditId,
              "Code": this.form.code,
              "Name": this.form.name,
              "Module":this.form.module,
              "Bill": this.form.bill,
              "Operation": this.form.operation,
              "BusinessFlow": this.form.businessFlow,
              "IsSendMessage": this.form.checkbox,
              "Remark": this.form.remark,
              "ModuleName": this.ModuleName,
              "BillName": this.BillName,
              "OperationName": this.OperationName
            }
          }
          var datas = JSON.stringify(dataparams);
          this.$http.post(Yukon.Url.Bus,qs.stringify({
            "name":Yukon.ServiceName.Workflow,
            "operation":"SetJsonData",
            "token":this.token,
            "data":datas,
          }),{
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then((response)=>{ 
            var result = response.body;
            if(result.code == '0'){
              this.$message({
                type: 'success',
                message: '保存成功',
              }); 
              bus.$emit('listenerRefreshTable','refresh');  
              bus.$emit('colseTabs',this.targetName);
              this.form ={
                code:'',
                name:'',
                module:'',
                bill:'',
                operation:'',
                businessFlow:'',
                remark:'',
                checkbox:'',
              }
            }else{
              this.$message({
                type: 'error',
                message: result.msg,
              }); 
            }
          })
          .catch(function (error) {
            console.log(error);
          });
        }
      }
    },
  }
}
</script>

