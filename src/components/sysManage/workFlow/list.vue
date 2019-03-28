<template>
  <div>
	<div class="conmmonlist">
     <div class="actionBar">
       <el-row  class=" actionBarList">
        <div class="operationBtn">
            <el-button size="mini" icon="el-icon-edit" @click="refreshList">刷新</el-button>
            <el-button size="mini" icon="el-icon-circle-plus-outline" @click="openCover('BusinessFlowEdit','工作流维护','false')">新增</el-button>
            <el-button size="mini" icon="el-icon-edit" @click="open">编辑</el-button>
            <el-button size="mini" icon="el-icon-delete" @click="deleted">删除</el-button>
            <el-button size="mini" icon="el-icon-success" @click="process">流程设计</el-button>
            <el-button size="mini" icon="el-icon-success" @click="message('BusinessFlowMessageSet','消息设置','false')">消息设置</el-button>
        </div>
        <div class="inputCont">
          <span class="selectTitle">客户代码</span>
          <el-input v-model="input" placeholder="请输入内容" size="mini"></el-input>
          <el-button size="mini" icon="el-icon-search">搜索</el-button>
        </div>
    </el-row>
    </div>
    <!-- 列表 -->
    <div class="commonTable">
      <div class="listTable">
         <el-table :data="tableData3" 
          ref="multipleTable"  
          stripe 
          border
          height="100%"
          highlight-current-row
          tooltip-effect="dark"
          empty-text="  "
          @selection-change="handleSelectionChange"
          @row-click="toggleSelection"
          :default-sort = "{prop: 'date', order: 'descending'}">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column 
              v-for="col in cols"
              :prop="col.prop" :label="col.label" :key="col.prop" sortable>
            </el-table-column>
          </el-table>
      </div>
      
    <!-- 分页 -->
    <div class="pages">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentpage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </div>
    </div>
    
	</div>
  </div>
</template>
<script>
  import qs from 'qs';
  import {mapGetters} from 'vuex'
  import bus from '../../../assets/public/js/eventBus' 
  export default {
    props: ['event'],
     data() {
      return {
        tableData3: [],
        cols: [
          {prop: 'Name', label: '流程名称'},
          {prop: 'Remark', label: '备注'},
          {prop: 'State', label: '是否启用'},
        ],
        indexNum:"",
        multipleSelection: [],//是否选中数据   

        title:"",
        input: '',
        dialogVisible :false,//高级搜索的弹框
        dialogVisibleColumn:false,//列设置的弹框
        items:[],
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        idList:[],//被选中的id数组
        total:0,//总条数
        currentpage:1,
        PageSize:10,
      }
    },
    created(){
      this.getList();
      this.refreshTable();
    },
    computed:{
        ...mapGetters(['token']), 
    },
    methods: {
      //刷新表格
      refreshTable(){
       bus.$on('workFlowRefreshTable',(message)=>{//
          if (message) {
            this.getList();
          }
        })
      },
        // 高级搜索添加input
        add(type,name){
           //判断不能重复添加
            var containId = false;
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].title == this.title) {
                    containId = true;
                    i++;
                }
            }
            //等于false就添加
            if(!containId){
                this.items.push({
                  title: this.title,
                  type: type,                
                  inputValue: '',
                  name:''
              })
            }
            // console.log(this.items)
        }, 
        //获取列表数据
        getList(){
          var dataparams = {
              "Name": "BusinessFlow",
              "DefaultVal":"SearchPage",
              "PageSize":this.PageSize,
              "CurrentPage":this.currentpage,
          }
          var data2 = JSON.stringify(dataparams)
          this.$http.post(Yukon.Url.Bus,qs.stringify({
            "name":Yukon.ServiceName.Workflow,
            "operation":"GetJsonData",
            "token":this.token,
            "reqInfo":data2,
          }),{
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then((response)=>{ 
            var result = response.body;
            if(result.code == 0) {
               var data = [];
              this.total = result.TotalRow;
              for (var i = 0; i < result.data.length; i++) {
                data.push(result.data[i].PropertyValueMap)
              }
              this.tableData3 = data;
            }
          })
          .catch(function (error) {
              console.log(error);
          });
        },

        // 点击高级搜索
        submitSearch(){
          this.dialogVisible = false
        },                         
        addCol(){
            this.cols.push({prop: 'address', label: '地址'})
        },
        // 点击当前行选中checkbox状态
        toggleSelection(rows) {
          this.$refs.multipleTable.toggleRowSelection(rows);
        },
        // 每勾选一个CheckBox都会触发的事件
        handleSelectionChange(val) {
          this.multipleSelection = val; 
        },
        // 编辑
        open(key,label,hasChild) {
          //判断是否选中
          if(this.multipleSelection == ""){
            this.$alert('请至少选择一条！', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                //点击确定之后的操作
              }
            });
          }else{
            this.$store.dispatch('listcheck',this.multipleSelection)
            this.event('BusinessFlowEdit','工作流维护');//子组件调用父组件的方法
          }
        },
        //刷新
        refreshList(){
          this.getList();
          this.multipleSelection = "";
        },
        //新增
        openCover(key,label,hasChild) {
          this.$store.dispatch('listcheck',"")
          this.event(key,label);//子组件调用父组件的方法
        },
        //删除
        deleted() {
          //循环得到选中了哪些id
          for (var i = 0; i < this.multipleSelection.length; i++) {
            this.idList.push(this.multipleSelection[i].Id)
          }  
          if(this.multipleSelection == ""){
              this.$alert('请至少选择一条！', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  //点击确定之后的操作
                }
              });
          }else{
            var dataparams = {
                "Name":"BusinessFlow",
                "DefaultVal":"Delete", 
                "IdList":this.idList

            }
            var data2 = JSON.stringify(dataparams)
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http.post(Yukon.Url.Bus,qs.stringify({
                "name":Yukon.ServiceName.Workflow,
                "operation":"SetJsonDelete",
                "token":this.token,
                "reqInfo":data2,
              }),{
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              }).then((response)=>{ 
                var result = response.data;
                if(result.code == 0){
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  this.getList();
                  this.idList = [];
                }
              })
              .catch(function (error) {
                  console.log(error);
              });
            }).catch(() => {
              this.$message({
                type: 'error',
                message: '已取消删除'
              });          
            });
          }
        },
        //流程设计
        process(){
          //判断是否选中
          if(this.multipleSelection == ""){
            this.$alert('请至少选择一条！', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                //点击确定之后的操作
              }
            });
          }else if(this.multipleSelection.length > 1){
            this.$alert('只能选择一条进行设置', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                //点击确定之后的操作
              }
            });
          }else{
            // console.log(this.multipleSelection)
            this.$store.dispatch('listcheck',this.multipleSelection);//流程设计用到的参数
            localStorage.setItem('processCheckId', this.multipleSelection[0].Id);
            localStorage.setItem('processCheckName', this.multipleSelection[0].Name);   
            localStorage.setItem('userToken', this.token);
            this.event('BusinessFlowProcess','流程设计');//子组件调用父组件的方法
          }
        },
        message(){
          //判断是否选中
          if(this.multipleSelection == ""){
            this.$alert('请至少选择一条！', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                //点击确定之后的操作
              }
            });
          }else if(this.multipleSelection.length > 1){
            this.$alert('只能选择一条进行设置', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                //点击确定之后的操作
              }
            });
          }else{
            this.$store.dispatch('listcheck',this.multipleSelection)
            this.event('BusinessFlowMessageSet','消息设置');//子组件调用父组件的方法
          }
        },
        //搜索
        query(){
          this.dialogVisible = true;
        },
        handleClose(done) {
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
        },
        handleSizeChange(val) {
          this.currentPage = 1;
          this.pagesize = val;
          this.handleCurrentChange(this.currentPage);
        },
        handleCurrentChange(val) {
          this.currentPage=val;
          this.getList();
        }
  }
}
</script>
