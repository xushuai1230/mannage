<template>
  <div class="edit" >
    <el-row class="editBoxRow">
      <el-col :span="24">
        <el-button size="mini" icon="el-icon-edit" @click="Save">保存</el-button>
      </el-col>
    </el-row>
    <div class="editBoxTable">
       <el-form ref="form" :model="form" class="form" size="mini"  label-position="left"
         label-width="200px" >
       	 <div v-for="item in controlTypeData">
       	 	<!--输入框-->
	          <el-col :span="12" v-if="item.ControlType=='Input'">
		            <el-form-item :label="item.CnName">
                  <el-input  v-model="form[item.Code]" size="mini" ></el-input>  
                </el-form-item> 
		        </el-col>

	        <!--下拉框-->
	        <el-col :span="12"  v-if="item.ControlType=='Select'"> 
	            	<el-form-item :label="item.CnName">
                    <el-select  v-model="form[item.Code]" auto-complete="off" size="mini">
                      <el-option 
                      v-for="item in options" 
                      :key="item.value" 
                      :label="item.label" 
                      :value="item.value">
                    </el-option>
                  </el-select>  
                </el-form-item> 
	        </el-col>
	        <!--富文本-->
	        <el-col :span="12" v-if="item.ControlType=='Textarea'">		       
		          	<el-form-item :label="item.CnName">
                   <el-input type="textarea" class="selectType" v-model="form[item.Code]" size="mini"></el-input>   
                </el-form-item> 
	        </el-col>  
         </div>
      </el-form>
    </div>
    
  </div>
</template>
<script>
  import qs from 'qs';
 import {mapGetters} from 'vuex'
 export default {
  props: ['operationTableName', 'editId'],
  data() {
    return {
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
    }
  },

  computed:{
    currentView(){    
      return this.arr[this.index];
    },
    ...mapGetters(['token']),//获取存入vuex的token，获取方法this.user.token  
  },
  watch: {
     editId(newVal,oldVal){
        var ary =newVal.split(",");//转化为数组 ;
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
        { "Code": "Url",   "EnName":  "Url",   "CnName": "Url",  "ControlType": "Input"},
        { "Code": "Remark","EnName": "Remark","CnName": "备注",  "ControlType": "Textarea"},
      ];
      this.form={Name: '',Type:0,Icon: '',Sort:'',TabId:'',Remark:'',Url:''};
      this.getData();
  	},
    getData(){
      if(this.changeAddEdit == '0' || this.changeAddEdit == '1'){
      	for(var i in this.controlTypeData){
      		this.form[this.controlTypeData[i].Code]='';
      	}
        return;
      }
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
        var result = response.data;
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
    Save(){
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
    }
  }
}
</script>
