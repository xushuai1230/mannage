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
        <el-col>
          <el-col :span="7" style="text-align: right;">
             <el-form-item  label="新密码："></el-form-item> 
          </el-col>
          <el-col :span="13">
            <el-tooltip class="item" :disabled="newDisabled" effect="dark" content="密码必须1到12位，且不能出现空格" placement="right">
              <el-input type="password" v-model="newPassword"  size="mini"></el-input>
            </el-tooltip>
          </el-col>
        </el-col>
        <el-col>
          <el-col :span="7" style="text-align: right;">
             <el-form-item  label="确认新密码："></el-form-item> 
          </el-col>
          <el-col :span="13">
            <el-tooltip class="item" :disabled="nowDisabled" effect="dark" content="两次密码输入不一致" placement="right">
              <el-input type="password" v-model="nowPassword"  size="mini" ></el-input>
            </el-tooltip>
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
    props:['dialogPasswordVisible','dialogCode','IdList','operationTableName'],
    data() {
      return { 
        dialogVisible:this.dialogPasswordVisible,      //弹框
        optionsData:[],
        array:[],
        newPassword:'',
        nowPassword:'',
        newDisabled:true,
        nowDisabled:true,
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
    },
    methods: {
      btnSure(){
        var count = this.newPassword.match(/\s+/ig) ? this.newPassword.match(/\s+/ig).length : 0;
        if(this.newPassword ==''){
          this.$alert('密码必须1到12位，且不能出现空格', '提示', {
            confirmButtonText: '确定',
              callback: action => { 
              bus.$emit('listenerRefreshTable','refresh');                
            }
          });
          this.newDisabled=false;
          this.nowDisabled=true;
        }else if(this.newPassword != this.nowPassword){
          this.newDisabled=true;
          this.nowDisabled=false;
          this.$alert('两次密码输入不一致', '提示', {
            confirmButtonText: '确定',
              callback: action => { 
              bus.$emit('listenerRefreshTable','refresh');                
            }
          });
        }else{
          var propery={
            NewPassword:this.newPassword,
            Id:this.IdList[0]
          }
          var objData = {
            "Name": "CstUser",
            "DefaultVal": "UpdatePassword",
            "PropertyValueMap": propery
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
              this.dialogVisible= false;
              this.$emit('dialogVisibleFalse',false) ; 
              this.$message({
                type: 'success',
                message: '保存成功!'
              });
            }else  {
              this.newDisabled=true;
              this.nowDisabled=true;    
              this.$message({
                type: 'error',
                message: result.msg,
              }); 
            }
          }).catch(function (error) {
              console.log(error);
          });
        }
      },
      btnCancel(){
        this.dialogVisible= false;
        this.$emit('dialogVisibleFalse',false) ;
      },
  }
}
</script>