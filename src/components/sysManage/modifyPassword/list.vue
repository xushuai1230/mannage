<template>
  <div class="edit">
      <el-row class="editBoxRow" >
        <el-col :span="24">
          <el-button size="mini" icon="el-icon-edit" @click="Save">保存</el-button>
        </el-col> 
      </el-row>
      <div class="editBoxTable">
        <el-form :inline="true"  :model="form"  class="form" size="mini" ref="form"  label-position="left"
         label-width="200px">
         <el-col>
            <el-col :span="12">
                <el-form-item  label="当前密码：">
                    <el-tooltip class="item" :disabled="curDisabled" effect="dark" :content="contentPassword" placement="right">
                    <el-input type="password" v-model="currentPassword"  size="mini" ></el-input>
                   </el-tooltip>
                </el-form-item>
          </el-col>
            <el-col :span="12">&nbsp;</el-col>
        </el-col>
          <el-col>
            <el-col :span="12">
                <el-form-item  label="新密码：">
                    <el-tooltip class="item" :disabled="newDisabled" effect="dark" content="密码必须1到12位，且不能出现空格" placement="right">
                     <el-input type="password" v-model="newPassword"  size="mini"></el-input>
                   </el-tooltip>
                </el-form-item>     
            </el-col>
            <el-col :span="12">&nbsp;</el-col>
          </el-col>
          <el-col>
            <el-col :span="12">    
                <el-form-item  label="确认新密码：">
                    <el-tooltip class="item" :disabled="nowDisabled" effect="dark" content="两次密码输入不一致" placement="right">
                      <el-input type="password" v-model="nowPassword"  size="mini" ></el-input>
                    </el-tooltip>
                </el-form-item>
          </el-col>
          <el-col :span="12">&nbsp;</el-col>
        </el-col>
        </el-form>
      </div>
</div>
</template>
<script>
  import qs from 'qs';
  import {mapGetters} from 'vuex'
  import axios from 'axios'
  export default {
    props: ['refresh','event'],
    data() {
      return{
        form:{},
        inputCss:'',
        currentPassword:'',
        newPassword:'',
        nowPassword:'',
        contentPassword:'',
        curDisabled:true,
        newDisabled:true,
        nowDisabled:true,
      };     
    },
    computed:{
      ...mapGetters(['token']), 
    },
    created(){
    },
    methods: { 
      Save(){
        var count = this.newPassword.match(/\s+/ig) ? this.newPassword.match(/\s+/ig).length : 0;
        if(this.currentPassword=='' || this.newPassword =='' || this.nowPassword ==''){
          this.contentPassword="必填项不能为空"
          this.$alert('必填项不能为空', '提示', {
            confirmButtonText: '确定',
              callback: action => { 
              bus.$emit('listenerRefreshTable','refresh');                
            }
          });
          if(this.currentPassword==''){
            this.curDisabled=false;
            this.newDisabled=true;
            this.nowDisabled=true;
          }else if(this.newPassword==''){
            this.curDisabled=true;
            this.newDisabled=false;
            this.nowDisabled=true;
          }
        }else if(this.newPassword != this.nowPassword){
          this.curDisabled=true;
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
            Password:this.currentPassword,
            NewPassword:this.newPassword,
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
        }
      },
    },
  };
</script>
<style type="text/css">
  .css1{
    border-color: #dcdfe6; 
  }
  .css2{
    border-color: #f56c6c; 
  }
</style>