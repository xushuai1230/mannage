<template>
    <el-dialog 
      v-dialogDrag
      ref="dialog__wrapper"
      top="0"
      class="cover_dialog"
      :title="dialogCode"
      :closeOnClickModal=false
      :visible.sync="dialogVisible"
      :before-close="cancel">
      <div class="cover_dialog_body singleColumn" style="padding-right: 5%;">
        <el-form :inline="true" size="mini">
        <div>
          <div  v-for="item in approveArray">
            <el-col :span="12">
              <el-col :span="7" style="text-align: right;">
                 <el-form-item  :label="item.ShowCode"></el-form-item> 
              </el-col>
              <el-col :span="17" style="white-space: nowrap;">
                <el-input v-model="item.value" placeholder="" size="mini"></el-input>
                <!-- <el-form-item  :label="item.value"></el-form-item>  -->
              </el-col>
            </el-col>
          </div>
          <el-col :span="24">
          </el-col>
        </div>
        <el-col>
          <el-col :span="12">
            <el-col :span="7" style="text-align: right;">
               <el-form-item  label="审批结果"></el-form-item> 
            </el-col>
            <el-col :span="17" >
              <el-radio-group v-model="checkedRadio">
                <el-radio :label="1">审批通过</el-radio>
                <el-radio :label="2">审批驳回</el-radio>
              </el-radio-group>
            </el-col>
          </el-col>
        </el-col>
        <el-col>
          <el-col :span="12">
            <el-col :span="7" style="text-align: right;">
               <el-form-item  label="邮箱验证码"></el-form-item> 
            </el-col>
            <el-col :span="13" >
              <el-input
                  v-model="EmailVerification" 
                  placeholder=""  
                  size="mini">
              </el-input>
            </el-col>
            <el-button size="mini" style="margin: 3px 0 0 5px;" @click="setCodedata">发送</el-button>
          </el-col>
        </el-col>
        <el-col>
          <el-col :span="12">
            <el-col :span="7" style="text-align: right;">
               <el-form-item  label="审批意见"></el-form-item> 
            </el-col>
            <el-col :span="17" >
              <el-input
                v-model="ApproveOpinion" 
                placeholder=""  
                size="mini">
              </el-input>
            </el-col>
          </el-col>
        </el-col>
    </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnSure">保存</el-button>
      </div>
    </el-dialog>
</template>
<script>
import {mapGetters} from 'vuex'
import bus from '../../../assets/public/js/eventBus' 
import qs from 'qs';
export default {
  props:['dialogApproveVisible','dialogCode','IdList','operationTableName',"approveData"],
  data(){
    return {
      selectedTransfer:[],
      checkedRadio:1,
      dialogVisible:this.dialogApproveVisible,
      EmailVerification:'',
      ApproveOpinion:'',
      approveArray:[{
            EngCode:'Name',
            ShowCode:'名称',
          },{
            EngCode:'Abbreviation',
            ShowCode:'简称',
          },{
            EngCode:'LinkMan',
            ShowCode:'联系人',
          },{
            EngCode:'Telephone',
            ShowCode:'电话',
          },{
            EngCode:'Mobile',
            ShowCode:'手机号',
          },{
            EngCode:'Email',
            ShowCode:'邮箱',
          },{
            EngCode:'WebSite',
            ShowCode:'网址',
          },{
            EngCode:'Address',
            ShowCode:'地址',
          },{
            EngCode:'Industry',
            ShowCode:'行业',
          },{
            EngCode:'Region',
            ShowCode:'区域',
          }],
      }
    },  
  computed:{
      ...mapGetters(['token']), // 获取vuex的token，获取方法this.user
    },
  mounted () {    
  },
  created(){
    this.getJsondata();
  },
  methods:{
    //列设置取消
    cancel(){
        this.dialogVisible = false;
        this.$emit('dialogVisibleFalse',false) ;
    },
    getJsondata(){
      var columns= this.approveData
      for (let p in columns) {
        for(var i=0;i<this.approveArray.length;i++){
          if(p==this.approveArray[i].EngCode){
                this.approveArray[i].value = columns[p];
          }
        }
        }
        console.log(this.approveArray)
    },
    //发送验证码
    setCodedata(){
      var colsData = { "Name":this.operationTableName,"DefaultVal":"SendVerification","IdList": this.IdList,}
      var reqInfoColsData = JSON.stringify(colsData);
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        "name":Yukon.ServiceName.Tenant,
        "operation":"GetJsonData",
        "token":this.token,
        "reqInfo":reqInfoColsData,
      }),{
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response)=>{ 
       var result = response.data
        if(result.code=="0"){
          this.$message({
            type: 'success',
            message: '验证码发送成功!'
          });
        }else{
          this.$message({
            type: 'error',
            message: '验证码发送失败!'
          });
        }
      }).catch((error)=>{
        console.log(error)
      })                 
    },
  //列设置保存
  btnSure(){
      var result = "";
      if(this.checkedRadio == 1){
        result="Approved"
      }else{
        result="Rejected"
      }
        var dataparams = 
        {"Name":this.operationTableName,
      "DefaultVal": "Approve",
      "PropertyValueMap":{
        "IdList": this.IdList,
        "ApproveResult":result,
        "EmailVerification":this.EmailVerification,
        "ApproveOpinion":this.ApproveOpinion,
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
         var result = response.data
          if(result.code == '0'){
            this.$message({
              type: 'success',
              message: '执行成功!'
            });
          this.dialogVisible = false;
          this.$emit('dialogVisibleFalse',false) ;
          }else{
            this.$message({
              type: 'error',
              message: result.msg,
            }); 
          }
          this.btnDisabled=false;                  
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