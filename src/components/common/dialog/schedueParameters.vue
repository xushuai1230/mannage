<template>
	<div>
    <el-dialog 
      v-dialogDrag
      ref="dialog__wrapper"
      top="0" 
      class="cover_dialog"
      :title="dialogCode"
      :before-close="btnCancel"
      :closeOnClickModal=false
      :visible.sync="dialogVisible">
      <el-form :inline="true" size="mini">
      <div class="cover_dialog_body singleColumn"> 
          <el-tree 
          :data="treesData"
          ref="tree"
          show-checkbox 
          node-key="id" 
          check-on-click-node
          :props="defaultProps" 
          :default-checked-keys='selectKey'></el-tree>
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
    props:['dialogScheduleVisible','dialogCode','IdList','operationTableName','serviceName'],
    data() {
      return { 
        dialogVisible:this.dialogScheduleVisible,      //弹框
        treesData:[],
        selectKey:[],
        array:[],
        newPassword:'',
        nowPassword:'',
        newDisabled:true,
        nowDisabled:true,
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    computed:{
      ...mapGetters(['token']), //获取vuex的token，获取方法this.auser
    },
    watch:{
      dialogCode(newVal ,oldVal){
      },
    },
    created(){
      this.getTreeTableData();
    },
    methods: {
      //获取数据
      getTreeTableData(){
        var dataparams = {
          "Name": this.operationTableName,
          "DefaultVal": "GetScheduleParam",
          "IdList":this.IdList
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
          if(result.code == 0){
            this.treesData = result.data.data;
            this.selectKey=result.data.selectKey;
          }else{
            this.treesData = [];
          }
        })
        .catch(function (error) {
          alert(error)
        });
      },
      btnSure(){
        var nodeKey=this.$refs.tree.getCheckedKeys();
        var property={
          "Id":this.IdList[0],
          "List":nodeKey,
        }
        var objData = {
            "Name": this.operationTableName,
            "DefaultVal": "UpdateScheduleParam",
            "PropertyValueMap": property
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
        this.dialogVisible= false;
        this.$emit('dialogVisibleFalse',false) ;
      },
      btnCancel(){
        this.dialogVisible= false;
        this.$emit('dialogVisibleFalse',false) ;
      },
  }
}
</script>