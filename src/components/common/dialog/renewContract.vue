<template>
	<div>
    <el-dialog 
      v-dialogDrag
      ref="dialog__wrapper"
      top="0" 
      class="cover_dialog"
      :title="dialogCode"
      :fit="true"
      :before-close="btnCancel"
      :closeOnClickModal=false
      :visible.sync="dialogParaVisible">
      <el-form :inline="true" size="mini">
      <div v-for="item in array" class="cover_dialog_body singleColumn">
        <el-col v-show="item.EditType=='Select'" >
          <el-col :span="7" style="text-align: right;">
             <el-form-item  :label="item.ShowCode"></el-form-item> 
          </el-col>
          <el-col :span="13">
            <el-select 
              v-model="item.key" 
              filterable placeholder="--请选择--" size="mini"  @visible-change="GetDropdownData($event)">
                <el-option
                  v-for="item in optionsData"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
            </el-select>
          </el-col>
        </el-col>
        <el-col v-show="item.EditType=='InputNumber'" >
          <el-col :span="7" style="text-align: right;">
             <el-form-item  :label="item.ShowCode"></el-form-item> 
          </el-col>
          <el-col :span="13">
            <el-input-number ref="num" :min="0" v-model="item.value" size="mini"></el-input-number>
          </el-col>
        </el-col>
        <el-col v-show="item.EditType=='SelectMulti'" >
          <el-col :span="7" style="text-align: right;">&nbsp;</el-col>
          <el-col :span="13">
            <el-checkbox v-model="item.checked" :label="item.label"></el-checkbox>
          </el-col>
        </el-col>
      </div>
    </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnSure">保存</el-button>
      </div>
    </el-dialog>
	</div>
</template>
<script>
  import qs from 'qs';
  import {mapGetters} from 'vuex'
  import bus          from '../../../assets/public/js/eventBus' 
  export default {
    props:['dialogParaVisible','dialogCode','IdList','operationTableName'],
    data() {
      return { 
        dialogVisible:this.dialogParaVisible,      //弹框
        optionsData:[],
        array:[],
        array1:[{
          EngCode:'Type',
          ShowCode:'类型',
          EditType:'Select'
        },{
          EngCode:'Duration',
          ShowCode:'时间',
          EditType:'InputNumber',
          value:0,
        }],
        array2:[{
          EngCode:'Level',
          ShowCode:'Aps等级',
          EditType:'Select'
        },{
          EngCode:'UserCount',
          ShowCode:'人员数量',
          EditType:'InputNumber',
          value:0,
        },{
          EngCode:'ImplementDays',
          ShowCode:'实施人天',
          EditType:'InputNumber',
          value:0,
        }],
      }
    },
    computed:{
      ...mapGetters(['token']), // 获取vuex的token，获取方法this.auser
    },
    watch:{
      dialogCode(newVal ,oldVal){
          this.getColumnData();
      },
    },
    created(){
      this.getColumnData();
    },
    methods: {
      getColumnData(){
        switch(this.dialogCode){
            case '续约':
              this.array= this.array1;
              break;
            case '升级':
              this.array= this.array2;
              break;
        }
      },
      GetDropdownData(val){
        if(val == true){
          switch(this.dialogCode){
            case '续约':
              this.GetParaData();
              break;
            case '升级':
              this.GetUpgradeData();
              break;
          }
        }
      },
      btnSure(){
        switch(this.dialogCode){
            case '续约':
              this.btnSureRenew();
              break;
            case '升级':
              this.btnSureUpgrade();
              break;
          }
      },
      btnCancel(){
        this.dialogVisible= false;
        this.$emit('dialogVisibleFalse',false) ;
      },
    GetParaData(){
      var data={
          "Name": this.operationTableName,
          "DefaultVal":"SearchEnum",
          "EnumField":"LeaseMode"
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
          var result = response.data.data;
          if(response.data.code == 0){
            this.optionsData = result;
          }
        })
        .catch((error)=> {
          console.log(error)  
        })
    },
    btnSureRenew(){
      for(var i=0;i<this.array.length;i++){
        if(this.array[i].EngCode=="Type"){
          var type=this.array[i].key;
        }else if(this.array[i].EngCode=="Duration"){
          var duration=this.array[i].value;
        }
      }
      var propery = {
        Type:type,
        Duration:duration,
        IdList:this.IdList,
      }
      var dataparams = {"Name":this.operationTableName,"DefaultVal": "Renewal","PropertyValueMap": propery}
      var datas = JSON.stringify(dataparams);
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        "name":Yukon.ServiceName.Tenant,
        "operation":"SetJsonData",
        "token":this.token,
        "data":datas,
      }),{
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response)=>{ 
        var result = response.data;
        if(result.code == '0'){
          this.$message({
            type: 'success',
            message: '续约成功!'
          });
          this.array=[];
          this.dialogVisible= false;
          this.$emit('dialogVisibleFalse',false) ;
        }else{
          this.$message({
            type: 'error',
            message: result.msg,
          }); 
        }                  
      })
      .catch((error)=> {
        this.$message({
          type: 'error',
          message: '执行出错'
        });
      })
    },
    // 升级
    GetUpgradeData(){
      var data={
        "Name":this.operationTableName,
        "DefaultVal":"SearchEnum",
        "EnumField":"TenentLevel"
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
        var result = response.data.data;
        if(response.data.code == 0){
          this.optionsData = result;
        }
      })
      .catch((error)=> {
        console.log(error)  
      })
    },
    btnSureUpgrade(){
      for(var i=0;i<this.array.length;i++){
        if(this.array[i].EngCode=="Level"){
          var level=this.array[i].key;
        }else if(this.array[i].EngCode=="UserCount"){
          var userCount=this.array[i].value;
        }else if(this.array[i].EngCode=="ImplementDays"){
          var implementDays=this.array[i].value;
        }
      }
      var propery = {
        Level:level,
        UserCount:userCount,
        ImplementDays:implementDays,
        IdList:this.IdList,
      }
      var dataparams = {"Name":this.operationTableName,"DefaultVal": "Upgrade","PropertyValueMap": propery}
      var datas = JSON.stringify(dataparams);
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        "name":Yukon.ServiceName.Tenant,
        "operation":"SetJsonData",
        "token":this.token,
        "data":datas,
      }),{
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response)=>{ 
        var result = response.data;
      if(result.code == '0'){
        this.$message({
          type: 'success',
          message: '升级成功!'
        });
        this.array=[];
        this.dialogVisible= false;
        this.$emit('dialogVisibleFalse',false) ;
      }else{
        this.$message({
          type: 'error',
          message: result.msg,
        }); 
      }                  
    })
    .catch((error)=> {
      this.$message({
        type: 'error',
        message: '执行出错'
      });
    })
    },
  }
}
</script>