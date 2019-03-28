<template>
	<div>
    <el-dialog 
      v-dialogDrag
      ref="dialog__wrapper"
      top="0" 
      class="cover_dialog"
      :title="dialogCode"
      :fit="true"
      :before-close="cancel"
      :closeOnClickModal=false
      :visible.sync="dialogMenuVisible">
      <el-form ref="form" :model="form" class="form" size="mini" >
         <div v-for="item in controlTypeData" >
          <!--输入框-->
            <el-col :span="12" v-if="item.ControlType=='Input'">
              <el-col :span="7" style="text-align: right;">
                 <el-form-item  :label="item.CnName"></el-form-item> 
              </el-col>
              <el-col :span="13">
                 <el-input  v-model="form[item.Code]" size="mini" ></el-input>  
              </el-col>
            </el-col>
          <!--下拉框-->
          <el-col :span="12"  v-if="item.ControlType=='Select'"> 
            <el-col :span="7" style="text-align: right;">
               <el-form-item  :label="item.CnName"></el-form-item> 
            </el-col>
            <el-col :span="13">
               <el-select  v-model="form[item.Code]" auto-complete="off" size="mini">
                    <el-option 
                    v-for="item in options" 
                    :key="item.value" 
                    :label="item.label" 
                    :value="item.value">
                  </el-option>
                </el-select>   
            </el-col> 
          </el-col>
          <!--富文本-->
          <el-col :span="12" v-if="item.ControlType=='Textarea'">  
              <el-col :span="7" style="text-align: right;">
                 <el-form-item  :label="item.CnName"></el-form-item> 
              </el-col>
              <el-col :span="13">
                 <el-input type="textarea" class="selectType" v-model="form[item.Code]" size="mini"></el-input>  
              </el-col>        
          </el-col>  
         </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button type="primary" size="small" @click="save">保存</el-button>
      </div>
    </el-dialog>
	</div>
</template>
<script>
  import qs from 'qs';
  import {mapGetters} from 'vuex'
  import bus          from '../../../assets/public/js/eventBus' 
  export default {
    props:['dialogMenuVisible','dialogCode','editId','operationTableName'],
    data() {
      return { 
        dialogVisible:this.dialogMenuVisible, 
        form: {},
        changeAddEdit:0,
        id:'',
        controlTypeData:[],//控件数据
        options        :[{
          value: 0,
          label: '页面'
          },{
          value: 1,
          label: '操作'
         }],
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
    watch: {
       editId(newVal,oldVal){          var ary =newVal.split(",");//转化为数组 ;
          if(ary[0].substring(0,2)=='ID'){
            this.id = "";
            this.changeAddEdit = ary[1];
          }else{
            this.id = ary[1];
            this.changeAddEdit = ary[2];
          }
           this.form={};
           this.controlTypeData=[];
           this.getColumns();
        }
    },
    created(){
     var ary =this.editId.split(",");//转化为数组 ;
     if(ary[0].substring(0,2)=='ID'){
        this.id = "";
        this.changeAddEdit = ary[1];
      }else{
        this.id = ary[1];
        this.changeAddEdit = ary[2];
      }
      this.getColumns();
    },
    methods: {
      getColumns(){
        this.controlTypeData=[
          { "Code": "Code",  "EnName": "Code",  "CnName": "编号",  "ControlType": "Input"},
          { "Code": "Name",  "EnName": "Name",  "CnName": "名称",  "ControlType": "Input"},
          { "Code": "Type",  "EnName": "Type",  "CnName": "类型",  "ControlType": "Select"},
          { "Code": "Icon",  "EnName": "Icon",  "CnName": "图标",  "ControlType": "Input"},
          { "Code": "Sort",  "EnName": "Sort",  "CnName": "排序",  "ControlType": "Input"},
          { "Code": "TabId", "EnName": "TabId", "CnName": "Tabld", "ControlType": "Input"},
          { "Code": "Url",   "EnName": "Url",   "CnName": "Url",   "ControlType": "Input"},
          { "Code": "Remark","EnName": "Remark","CnName": "备注",  "ControlType": "Textarea"},
        ];
        this.form={Code:'',Name: '',Type:0,Icon: '',Sort:'',TabId:'',Remark:'',Url:''};
        if(this.changeAddEdit == '1'){
          this.getData();
        }
      },
      getData(){
        var dataparams = {
          "Name": this.operationTableName,
          "DefaultVal": "Search",
          "Filter":"Id,==," +this.id+ ",And;"
        }
        var datas = JSON.stringify(dataparams);
        this.$http.post(Yukon.Url.Bus,qs.stringify({
          "name":Yukon.ServiceName.Tenant,
          "operation":"GetJsonData",
          "token":this.token,
          "reqInfo":datas,
        }),{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response)=>{ 
          var result = response.body;
          if(result.code == '0'){
            var property = [];
            if (result.data && result.data.length > 0) {
              for (var i = 0; i < result.data.length; i++) {
                property.push(result.data[i].PropertyValueMap)
              }
            }
            this.form = property[0];
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
      },
    cancel(){
      this.dialogVisible = false;
      this.$emit('dialogVisibleFalse',false) ;
    },
    save(){
      this.type = 0;
      var operation = '-1';
      var paramId = '';
      var paramParentId = '';
      if(this.value == "操作"){
        this.type = 1;
      };
      if(this.changeAddEdit == '0'){ //新增父节点 或 子节点
        operation = "NewSave";
      }else if(this.changeAddEdit == '1'){
        operation = "NewSave";
        paramParentId = this.id;
      } else if(this.changeAddEdit == '2'){ 
        operation = "EditSave";
        paramId = this.id;
      }
      if(operation== '-1'){

      }else{
        var dataparams = {
          "Name": this.operationTableName,
          "DefaultVal": operation,
          "PropertyValueMap": {
            "Id": paramId,
            "ParentId": paramParentId,
            "Code": this.form.Code,
            "Name": this.form.Name,
            "Type": this.type,
            "Icon": this.form.Icon,
            "Sort": this.form.Sort,
            "TabId": this.form.TabId,
            "Remark": this.form.Remark,
            "Url":this.form.Url,
          }
        }
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
            this.dialogVisible = false;
            this.$emit('dialogVisibleFalse',false) ;
            this.$message({
              type: 'success',
              message: '保存成功',
            }); 
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
    },
  }
}
</script>