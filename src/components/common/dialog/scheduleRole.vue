<template>
  <el-dialog
    v-dialogDrag
    ref="dialog__wrapper"
    top="0"
    :title="dialogCode"
    :visible.sync="dialogVisible"
    :before-close="cancel"
    :closeOnClickModal=false
    class="medium_dialog">
      <el-table
        v-loading="loading"
        class="el-dialog-tableCss"
        :data="tableData"  
        height="100%"
        ref="multipleTable"
        highlight-current-row
        tooltip-effect="dark"
        :show-overflow-tooltip="true"
        stripe 
        border
        empty-text="  "
        :default-sort = "{Code: 'ID', order: 'descending'}"> 
          <el-table-column   
            v-for="col in colText"  
            :prop="col.EngCode" 
            :label="col.ShowCode" 
            :key="col.EngCode" 
            sortable>
          </el-table-column>
          <el-table-column v-for="col in colControl" :show-overflow-tooltip="true" :prop="col.EngCode" :label="col.ShowCode" :key="col.EngCode">
          <template slot-scope="scope">
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
    props:['dialogScheduleRoleVisible','dialogCode','IdList','operationTableName'],
    data(){
      return{
        dialogVisible                 :this.dialogScheduleRoleVisible,
        tableData                     :[],
        item                          :[],
        optionsData                   :[],
        listData                      :false, 
        index                         :1,
        objData                       :[],
        dropNum                       :0,
        inval                         :'',
        loading                       :false,
        colText:[{
          EngCode:'Code',
          ShowCode:'编号',
        },{
          EngCode:'Name',
          ShowCode:'名称',
        }],
        colControl:[{
          EngCode:'State',
          ShowCode:'授权状态',
          EditType:'SelectMulti'
        }],
      }
    },
    computed:{
      ...mapGetters(['token']),
    },
    created(){
      this.getData();
    },
    methods:{
      getData(){  
        this.loading=true;
        var data={
          "Name":this.operationTableName,
          "DefaultVal":"GetScheduleRule",
          "IdList":this.IdList,
        }
        var reqInfoData=JSON.stringify(data);
        this.$http.post(Yukon.Url.Bus,qs.stringify({
          "name":Yukon.ServiceName.Tenant,
          "operation":"GetJsonData",
          "token":this.token,
          "reqInfo":reqInfoData,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response)=>{ 
          this.loading = false;
          var result = response.data;
          if(result.code == 0){
            for(var i=0;i<result.data.length;i++){
              this.tableData.push({
                Id:result.data[i].Id,
                Code:result.data[i].Code,
                Name:result.data[i].Name,
                State:result.data[i].State
              });
            }
          }
        })
        .catch((error)=> {
        })
      },
      save(){
        this.loading=true;
        var list = [];
        for(var i=0;i<this.tableData.length;i++){
          if(this.tableData[i].State == true){
            list.push(this.tableData[i].Id);
          }
        }
        var propery = {
          Id:this.IdList[0],
          List:list
        }
        var data = {
          "Name":this.operationTableName,
          "DefaultVal": "UpdateScheduleRule",
          "PropertyValueMap": propery
        };
        var dataJson = JSON.stringify(data);
        this.$http.post(Yukon.Url.Bus,qs.stringify({
          "name":Yukon.ServiceName.Tenant,
          "operation":"SetJsonData",
          "token":this.token,
          "data":dataJson,
        }),{
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response)=>{ 
          this.loading = false;
          var result = response.data;
          if(result.code == 0){
            this.$message({
              type: 'success',
              message: "保存成功"
            });
            this.dialogVisible= false;
            this.$emit('dialogVisibleFalse',false) ;
          }
          else{
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
      }
    }
  }
</script>