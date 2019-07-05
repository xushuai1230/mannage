<template>
  <div class="jurisdiction">
    <div class="toolBar">
      <div class="actionBarList">
        <div class="operationBtn changeline" v-for="btn in buttonArray" >
          <el-button size="mini" :icon="btn.icon" @click="Action(btn.btn)" >{{btn.text}}</el-button>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="contentLeft">
        <div class="leftTop">
          <el-table
            highlight-current-row
            tooltip-effect="dark"
            :show-overflow-tooltip="true"
            :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            height="100%"
            border
            empty-text="  "
            @row-click="handleCurrentChange">
            <el-table-column type='index' label='序号' width="55"></el-table-column>
            <el-table-column  
              v-for="col in columns"  
              v-if="col.IsDisplay==true" 
              :prop="col.Code" 
              :label="col.Name" 
              :key="col.Code">
            </el-table-column>
          </el-table>  
        </div>
        <div class="leftbottom"> 
          <el-pagination
            @size-change="pageChange"
            @current-change="pageCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30]"
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="totalItems">
          </el-pagination>
        </div>
      </div>
      <div class="contentRight">
        <tree-table :data="treeData" :columns="treeColumns" border @getAuth="getAuth"></tree-table>
      </div>
    </div>
  </div>
</template>
<script>
import qs from "qs";
import { mapGetters } from "vuex";
import "../../../assets/sass/jurisdiction.scss";
import treeTable from "../treeTableAuthorization/index.vue";
export default {
  props: [
    "serviceName",
    "leftTableName",
    "rightGetName",
    "rightGetDefaultVal",
    "rightTableName",
    "paramField",
    "property"
  ],
  components: { treeTable },
  data() {
    return {
      tableData: [],
      tableId: "",
      nodeId: [], //选中的节点ID
      pageSize: 20, // 每页大小默认值
      currentPage: 1, // 默认第一页
      totalItems: 0, //总条数
      buttonArray: [],
      columns: [
        {
          Code: "Id",
          Name: "Id",
          IsDisplay: false
        },
        {
          Code: "Code",
          Name: "编号",
          IsDisplay: true
        },
        {
          Code: "Name",
          Name: "名称",
          IsDisplay: true
        }
      ],
      treeData: [],
      treeColumns: [
        {
          text: "菜单列表",
          value: "description",
          width: 260,
          option: "sonData"
        },
        {
          text: "功能权限",
          value: "sonData",
          option: "sonData",
          width: '', 
          act: "act"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["token", "mid"]) 
  },
  created() {
    this.getActionBar();
    this.getLeftTableData();
    this.getRightTableData();
  },
  methods: {
    // 右侧树形表格初始化
    getAuth(data) {
      let opt = [];
      data.forEach(val => {
        opt.push(val.id);
        if (val.children) {
          val.children.forEach(el => {
            if (el.selectchecked.length) {
              opt.push(el.id);
              opt.push(el.selectchecked);
            }
          });
        }
      });
      opt = opt.join().split(",").filter(n => {
        return n;
      });
    },
    // 获取操作栏
    getActionBar() {
      var filter = {
        Service: this.serviceName,
        ModularId: this.mid,
        TabName: this.rightTableName
      };
      var filterJson = JSON.stringify(filter);
      var objData = {
        Name: "Authorization",
        DefaultVal: "GetOperationAuthority",
        Filter: filterJson
      };
      var jsonData = JSON.stringify(objData);
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        name: this.serviceName,
        operation: "GetJsonData",
        token: this.token,
        reqInfo: jsonData
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(response => {
        var result = response.data;
        if (result.code == 0) {
          var columnsData = result.data;
          this.buttonArray = columnsData;
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
    // 获取左侧表格数据
    getLeftTableData() {
      this.tableData = [];
      var data = {
        Name: this.leftTableName,
        DefaultVal: "SearchPage",
        PageSize:100,
        CurrentPage:1,
        Properties: ["Id", "Code", "Name"]
      };
      var dataJson = JSON.stringify(data); //转成json字符串
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        name: this.serviceName,
        operation: "GetJsonData",
        token: this.token,
        reqInfo: dataJson
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(response => {
        var result = response.body;
        if (result.code == 0) {
          for(var i = 0; i < result.data.length; i++) {
            this.tableData.push(result.data[i].PropertyValueMap);
          }
          this.totalItems = this.tableData.length;
        }
      }).catch(function(error) {});
    },
    // 获取右侧树形表格数据
    getRightTableData(){
      var data = {
        Name: this.rightGetName,
        DefaultVal: this.rightGetDefaultVal
      };
      var dataJson = JSON.stringify(data);
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        name: this.serviceName,
        operation: "GetJsonData",
        token: this.token,
        reqInfo: dataJson
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(response => {
        var result = response.body;
        if (result.code == 0) {
          this.treeData = result.data;
        }
      }).catch(function(error) {});
    },
    // 点击左侧列表数据,刷新右侧表数据
    handleCurrentChange(val) {
      if(val !== null) {
        this.tableId = val.Id;
        var data = {
          Name: this.rightTableName,
          DefaultVal: "Search",
          Filter: this.paramField + ",==," + this.tableId + ",And;",
          Properties: [this.property]
        };
        var dataJson = JSON.stringify(data);
        this.$http.post(Yukon.Url.Bus,qs.stringify({
          name: this.serviceName,
          operation: "GetJsonData",
          token: this.token,
          reqInfo: dataJson
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then(response => {
          this.nodeId = [];
          if (this.treeData != null && this.treeData.length > 0) {
            for (var k = 0; k < this.treeData.length; k++) {
              this.treeData[k].selectchecked = [];
              this.treeData[k].checkAll = false;
              this.treeData[k].isIndeterminate = false;
              if(this.treeData[k].children != null) {
                for(var j = 0; j < this.treeData[k].children.length; j++) {
                  this.treeData[k].children[j].selectchecked = [];
                  this.treeData[k].children[j].checkAll = false;
                  this.treeData[k].children[j].isIndeterminate = false;
                  if(this.treeData[k].children[j].children != null) {
                    for(var m = 0;m < this.treeData[k].children[j].children.length;m++) {
                      this.treeData[k].children[j].children[m].selectchecked = [];
                      this.treeData[k].children[j].children[m].checkAll = false;
                      this.treeData[k].children[j].children[m].isIndeterminate = false;
                    }
                  }
                }
              }
            }
          }
          var result = response.body;
          if(result.code == -1) {
            this.$message.error(result.msg);
          } 
          else {
            for (var i = 0; i < result.data.length; i++) {
              var data = result.data[i].PropertyValueMap;
              this.nodeId.push(data[this.property]);
            }
            if(this.nodeId.length == 0) {
              this.$message({
                type: "warning",
                message: "未设置权限"
              });
            } 
            else {
              if(this.treeData != null && this.treeData.length > 0) {
                for (var k = 0; k < this.treeData.length; k++) {
                  if (this.treeData[k].children != null) {
                    for (var j = 0;j < this.treeData[k].children.length;j++) {
                      if (this.treeData[k].children[j].children != null) {
                        for (var m = 0;m < this.treeData[k].children[j].children.length;m++) {
                          if (
                            this.treeData[k].children[j].children[m].sonData != null
                          ) {
                            for (var n = 0;n <this.treeData[k].children[j].children[m].sonData.length;n++) {
                              var id = this.treeData[k].children[j].children[m].sonData[n].id;
                              if (this.nodeId.indexOf(id) > -1) {
                                this.treeData[k].children[j].children[m].selectchecked.push(id);
                              }
                            }
                            // 第三层 CheckBox状态
                            var selectedLengthT = this.treeData[k].children[j].children[m].selectchecked.length;
                            var sonLengthT = this.treeData[k].children[j].children[m].sonData.length;
                            if (selectedLengthT == sonLengthT &&sonLengthT != 0) {
                              this.treeData[k].children[j].children[m].checkAll = true;
                              this.treeData[k].children[j].children[m].isIndeterminate = false;
                            } else if (selectedLengthT != 0) {
                              this.treeData[k].children[j].children[m].checkAll = false;
                              this.treeData[k].children[j].children[m].isIndeterminate = true;
                            }
                            var idT = this.treeData[k].children[j].children[m].id;
                            if (sonLengthT == 0) {
                              if (this.nodeId.indexOf(idT) > -1) {
                                this.treeData[k].children[j].children[m].checkAll = true;
                                this.treeData[k].children[j].children[m].isIndeterminate = false;
                              }
                            }
                          }
                        }
                        // 第二层
                        var checkParentS = true;
                        var isIndeterminateParentS = false;
                        this.treeData[k].children[j].children.forEach(
                          model => {
                            if (model.checkAll) {
                              isIndeterminateParentS = true;
                            } else {
                              checkParentS = false;
                            }
                            if (model.isIndeterminate) {
                              isIndeterminateParentS = true;
                            }
                          }
                        );
                        if (checkParentS) {
                          isIndeterminateParentS = false;
                        }
                        this.treeData[k].children[j].checkAll = checkParentS;
                        this.treeData[k].children[j].isIndeterminate = isIndeterminateParentS;
                      }
                    }
                    // 第一层
                    var checkParentF = true;
                    var isIndeterminateParentF = false;
                    this.treeData[k].children.forEach(model => {
                      if (model.checkAll) {
                        isIndeterminateParentF = true;
                      } 
                      else {
                        checkParentF = false;
                      }
                      if (model.isIndeterminate) {
                        isIndeterminateParentF = true;
                      }
                    });
                    if (checkParentF) {
                      isIndeterminateParentF = false;
                    }
                    this.treeData[k].checkAll = checkParentF;
                    this.treeData[k].isIndeterminate = isIndeterminateParentF;
                  }
                }
              }
            }
          }
        }).catch(function(error) {});
      }
    },
    Action(name) {
      this.btnDisabled = true;
      this[name]();
    },
    // 刷新
    Refresh() {
      this.nodeId = [];
      this.getLeftTableData();
      this.getRightTableData();
    },
    // 保存
    Save() {
      if (this.tableId == "") {
        this.$alert("请选择左侧菜单数据！", "提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
      } 
      else {
        var data = {
          [this.paramField]: this.tableId,
          Permission: []
        };
        if (this.treeData != null && this.treeData.length > 0) {
          for (var k = 0; k < this.treeData.length; k++) {
            if (this.treeData[k].children != null) {
              for (var j = 0; j < this.treeData[k].children.length; j++) {
                if (this.treeData[k].children[j].children != null) {
                  for (var m = 0;m < this.treeData[k].children[j].children.length;m++) {
                    var itemT = this.treeData[k].children[j].children[m];
                    var selectedAry = this.treeData[k].children[j].children[m].selectchecked;
                    selectedAry.forEach(model => {
                      data.Permission.push({
                        MenuId: model,
                        Type: itemT.parent.parentId
                      });
                    });
                    var checkAllT = this.treeData[k].children[j].children[m].checkAll;
                    var isIndeterminateT = this.treeData[k].children[j].children[m].isIndeterminate;
                    if (checkAllT || isIndeterminateT) {
                      data.Permission.push({
                        MenuId: itemT.id,
                        Type: itemT.parent.parentId
                      });
                    }
                  }
                }
                var checkAllF = this.treeData[k].children[j].checkAll;
                var isIndeterminateF = this.treeData[k].children[j].isIndeterminate;
                if (checkAllF || isIndeterminateF) {
                  var itemF = this.treeData[k].children[j];
                  data.Permission.push({
                    MenuId: itemF.id,
                    Type: itemF.parentId
                  });
                }
              }
            }
          }
        }
        var obj = {
          Name: this.rightTableName,
          DefaultVal: "NewSave",
          PropertyValueMap: data
        };
        var dataJson = JSON.stringify(obj);
        this.$http.post(Yukon.Url.Bus,qs.stringify({
          name: this.serviceName,
          operation: "SetJsonData",
          token: this.token,
          data: dataJson
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then(response => {
          var result = response.body;
          if (result.code == 0) {
            this.$message({
              type: "success",
              message: "保存成功"
            });
          } 
          else {
            this.$message({
              type: "error",
              message: result.msg
            });
          }
        }).catch(function(error) {});
      }
    },
    // 分页
    pageChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
    },
    pageCurrentChange(val) {
      this.currentPage = val;
    },
  }
};
</script>