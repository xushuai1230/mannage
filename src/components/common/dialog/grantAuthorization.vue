<template>
  <el-dialog
    v-dialogDrag
    ref="dialog__wrapper"
    top="0"
    :title="dialogCode"
    :visible.sync="dialogVisible"
    :before-close="cancel"
    :closeOnClickModal=false
    class="cover_dialog">
      <el-table
        v-loading="loading"
        class="el-dialog-tableCss"
        :data="tableData"  
        height="100%"
        ref="multipleTable" 
        @selection-change="handleSelectionChange"
        highlight-current-row
        tooltip-effect="dark"
        :show-overflow-tooltip="true"
        stripe 
        border
        empty-text="  "
        :default-sort = "{Code: 'ID', order: 'descending'}"> 
          <el-table-column   
            v-for="col in colss"  
            :prop="col.EngCode" 
            :label="col.ShowCode" 
            :key="col.EngCode" 
            sortable>
          </el-table-column>
          <el-table-column v-for="col in cols" :show-overflow-tooltip="true" :prop="col.EngCode" :label="col.ShowCode" :key="col.EngCode">
          <template slot-scope="scope">
            <el-select 
              v-model="scope.row[col.EngCode]" 
              v-if="col.EditType=='Select'" 
              filterable placeholder="--请选择--" size="mini"  @visible-change="GetDropdownData($event)">
              <el-option
                v-for="item in optionsData"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
            <el-input-number v-if="col.EditType=='InputNumber'"  ref="num" :min="0" v-model="scope.row[col.EngCode]" size="mini"></el-input-number>
            <el-checkbox v-if="col.EditType=='SelectMulti'" width="55" v-model="scope.row[col.EngCode]"></el-checkbox>
            <el-input type="text" v-if="col.EditType=='Input'" v-model="scope.row[col.EngCode]" size="mini" disabled></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取消</el-button>
        <el-button type="primary" size="small" @click="save">保存</el-button>
      </span>
    </el-dialog>
  </template>
<script>
  import {mapGetters} from 'vuex'
  import qs from 'qs';
  export default {
     props:['dialogGrantVisible','dialogCode','IdList','operationTableName'],
    data(){
      return{
        dialogVisible:this.dialogGrantVisible,
        tableData:[],
        cols:[],
        colss:[],
        cols1:[{
          EngCode:'Selected',
          ShowCode:'授权',
          EditType:'SelectMulti'
        },{
          EngCode:'Type',
          ShowCode:'类型',
          EditType:'Select'
        },{
          EngCode:'Duration',
          ShowCode:'时间',
          EditType:'InputNumber'
        }],
        cols2:[{
          EngCode:'ModularName',
          ShowCode:'模块',
        }],
        cols3:[{
          EngCode:'ModularName',
          ShowCode:'模块',
        },{
          EngCode:'ExpiryTime',
          ShowCode:'截止日期',
        }],
        cols4:[{
          EngCode:'OperationDel',
          ShowCode:'删除',
          EditType:'SelectMulti'
        }],
        item:[],
        optionsData: [],
        listData:false,//选择列表是否显示
        index:1,
        objData:[],
        dropNum:0,
        inval:'',
        ModularType:[],
        loading: false
      }
    },
    computed:{
      ...mapGetters(['token']),
    },
    created(){
      this.getColumnData();
    },
    watch: {
      dialogCode(newVal ,oldVal){
          this.getColumnData();
      },
    },
    methods:{
      getColumnData(){
        this.loading=true;
        switch(this.dialogCode){
            case '授权':
              this.cols= this.cols1;
              this.colss=this.cols2;
              this.GetModularData();
              break;
            case '模块管理':
              this.colss=this.cols3;
              this.cols= this.cols4;
              this.GetModularData();
              break;
        }
      },
      GetDropdownData(val){
        if(val == true){
          switch(this.dialogCode){
            case '授权':
              this.GetParaData();
              break;
          }
        }
      },
      ClickOption(val){
        if(val==false){
          var tempNum = true;
          for(var i=0;i<this.tableData.length;i++){
            for(var k=0;k<this.optionsRuleData.length;k++){
              if(this.objData[i] == this.optionsRuleData[k].value){
                tempNum = false;
              }
            }
            if(this.tableData[i].name == "工作相关参数"){
              if(tempNum == true){
                this.inval=this.objData[i];
              }else{
                this.inval="";
              }
              this.tableData[i].name = this.objData[i];
              this.$emit('dialogWorkOpen',this.inval) ;
              this.dropNum=i;
            }else{
              for(var j=0;j<this.tableData.length;j++){
                if(this.tableData[i].name==this.tableData[j].name && this.tableData[i].id != this.tableData[j].id){
                  this.tableData[j].name = "";
                  break;
                }
              }
            }
          }
        }else{
          this.objData=[];
          for(var i=0;i<this.tableData.length;i++){
            this.objData.push(this.tableData[i].name);
          }
        }
      },
      getTableData(){
        var j=0;
        var chlength = 0;
        if(this.ruleString.length>1){
          var chString = new Array();
          var chArray=this.ruleString.split("#");
          chArray.splice(0,1);
          for(var z=0;z<chArray.length;z++){
            var cbj = chArray[z].split(";");
            for(var a =0;a<cbj.length;a++){
              var zbj = cbj[a].split("|");
              if(zbj.length<2){
                var xbj = cbj[a].substring(0,cbj[a].length-2);
                var ybj = cbj[a].substring(cbj[a].length-2,cbj[a].length);
                chString.push(xbj);
                chString.push(ybj);
              }else{
                var xbj = zbj[1]
                var ybj = zbj[0].substring(zbj[0].length-2,zbj[0].length);
                chString.push(xbj);
                chString.push(ybj);
              }
            }
          }
          chlength = (chString.length)/2;
          this.tableData=[];
          for(var i=0;i<chlength;i++){
            var obj = {name: chString[j],sort:chString[j+1],id:i+1};
            this.tableData.push(obj);
            j=j+2;
          }
        }
        var abj ={name: '',sort:'',id:chlength+1};
        this.tableData.push(abj);
      },
      //获取模块类型下拉框数据
      GetModularData(){  
          if(this.dialogCode=="授权"){
            var data={
              "Name":"SysModular",
              "DefaultVal":"SearchAll",
              "Filter":"CanSell,==,1,And;"
            }
          }else{
            var data={
              "Name":this.operationTableName,
              "DefaultVal":"GetModular",
              "IdList":this.IdList,
            }
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
            this.loading=false;
            if(response.data.code == 0){
              var fields = new Array()//获取字段模型
              if(this.dialogCode=="授权"){
                for (let p in result) {
                  fields[p] = result[p].PropertyValueMap;
                }  
                this.ModularType=fields;
                for(var i=0;i<fields.length;i++){
                  this.tableData.push({ModularName:fields[i].Name,Selected:false,Type:"",Duration:""});
                }
              }else{
                this.ModularType=result;
                for(var i=0;i<result.length;i++){
                  this.tableData.push({ModularId:result[i].ModularId,ModularName:result[i].ModularName,ExpiryTime:result[i].ExpiryTime,OperationDel:false});
                }
              }
            }
          })
          .catch((error)=> {
            console.log(error)  
          })
      },
      GetParaData(){
        var data={
            "Name":this.operationTableName,
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
      //授权
      save(){
        this.loading=true;
        var obj=[];
        var objString='';
        if(this.dialogCode=="授权"){
          for(var j=0;j<this.tableData.length;j++){
            if(this.tableData[j].Selected == true){
              obj.push({ModularId:this.ModularType[j].Id,Type:this.tableData[j].Type,Duration:this.tableData[j].Duration});
            }
          }
          objString='Empower'
        }else{
          for(var j=0;j<this.tableData.length;j++){
            if(this.tableData[j].OperationDel == true){
              obj.push({ModularId:this.tableData[j].ModularId});
            }
          }
          objString='DeleteModular'
        }
        var propery = {
          Modular:obj,
          IdList:this.IdList,
        }
        var dataparams = {"Name":this.operationTableName,"DefaultVal": objString,"PropertyValueMap": propery}
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
          this.loading=false;
          var essage='';
          if(this.dialogCode=="授权"){
            essage='授权成功!'
          }else{
            essage='删除成功!'
          }
          if(result.code == '0'){
            this.$message({
              type: 'success',
              message: essage
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
      cancel(){
        this.dialogVisible = false;
        this.$emit('dialogVisibleFalse',false) ;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;     
      },
    }
  }
</script>