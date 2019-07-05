<template>
  <div id="DemoDragadd">
    <goo-flow :property="myProps" :global="global" :plugIns="plugIns" ref="gooFlow"></goo-flow>
    <!-- 单据 -->
    <exportDialog
      :exportDialogVisible="exportDialogVisible"
      :nodeId="nodeId"
      v-on:DialogVisibleFalse="exportDialogClose"
      v-if="exportDialogVisible"
    ></exportDialog>
    <!-- 发送信息 -->
    <messageDialog
      :messageDialogVisible="messageDialogVisible"
      :nodeId="nodeId"
      :eventId= eventId
      v-on:DialogVisibleFalse="messageDialogClose"
      v-if="messageDialogVisible"
    ></messageDialog>
    <!-- 给用户发送信息 -->
    <userMessage
      :userDialogVisible="userDialogVisible"
      :nodeId="nodeId"
      v-on:DialogVisibleFalse="userDialogClose"
      v-if="userDialogVisible"
    ></userMessage>
    <!-- 排程 -->
    <operationDialog
      :scheduleDialogVisible="scheduleDialogVisible"
      :nodeId="nodeId"
      v-on:DialogVisibleFalse="scheduleDialogClose"
      v-if="scheduleDialogVisible"
    ></operationDialog>
    <!--  流转 -->
    <transformDialog
      :liuzhaunDialogVisible="liuzhaunDialogVisible"
      :nodeId="nodeId"
      v-on:DialogVisibleFalse="transformDialogClose"
      v-if="liuzhaunDialogVisible"
    ></transformDialog>
  </div>
</template>

<script>
import GooFlow from "./GooFlow/GooFlow";
import global from "./GooFlow/assets/global"; //该配置项仅供参考，不随其它JS文件一起打包发布
import Group from "./GooFlow/extends/group"; //GooFlow扩展泳道支持
import Memo from "./GooFlow/extends/memo"; //GooFlow扩展便笺支持
import AutoAlign from "./GooFlow/extends/autoalign"; //GooFlow扩展自动对齐支持
import Dragadd from "./GooFlow/extends/dragadd"; //GooFlow扩展重新定义添加块状元素的操作方式为visio的拖拽式
import Print from "./GooFlow/extends/print"; //GooFlow扩展将流程图打印或另存为PDF的支持
import MyAuth from "@/assets/js/myAuth";
import qs from "qs";
import bus from "@/assets/public/js/eventBus";
import { mapGetters } from "vuex";
import exportDialog from "./dialog/exportDialog"; // 单据
import messageDialog from "./dialog/messageDialog"; // 发送信息
import userMessage from "./dialog/userMessage"; // 发送信息
import operationDialog from "./dialog/operationDialog"; // 排程
import transformDialog from "./dialog/transformDialog"; // 流转
export default {
  name: "DemoDragadd",
  components: {
    GooFlow,
    exportDialog,
    messageDialog,
    operationDialog,
    transformDialog,
    userMessage
  },
  props: ["targetName"],
  data() {
    return {
      myProps: {
        id: "workflow",
        haveHead: true,
        headLabel: false,
        headBtns: ["new", "open", "save", "undo", "redo", "reload", "print"], //如果haveHead=true，则定义HEAD区的按钮
        haveTool: true,
        dragAddOper: true, //改用拖拽式添加块状元素的操作方式
        useOperStack: true,
        haveMulti: true,
        haveDirDashed: true,
        haveSegment: true,
        haveSegDashed: true,
        toolBtns: [
          "start round mix",
          "end round",
          "liuzhuan",
          "node",
          "plug",
          "chat",
          "join"
        ],
        //如果haveTool=true，为可编辑则定义工具栏的按钮
        // nodeCustoms: {
        //   huber: {
        //     class: "custom_huber",
        //     width: 102,
        //     height: 50
        //   },
        //   router: {
        //     class: "custom_router",
        //     width: 115,
        //     height: 52
        //   }
        // },
        auth: MyAuth
      },
      checkId: localStorage.getItem("processCheckId"),
      checkName: localStorage.getItem("processCheckName"),
      NodeData: {},
      demo: "",
      nodeList: {
        sendMessageData: [],
        operationData: [],
        workFlowData: []
      },
      nodeId: "",
      eventId:"",
      exportDialogVisible: false,
      messageDialogVisible: false,
      userDialogVisible: false,
      scheduleDialogVisible: false,
      liuzhaunDialogVisible: false,
      global: global,
      plugIns: [Group, Memo, AutoAlign, Dragadd, Print]
    };
  },
  computed: {
    ...mapGetters(["token", "WFData","list_z"])
  },
  mounted() {
    console.log(this.list_z)
    this.getNode();
    var that = this;
    this.demo = this.$refs.gooFlow;
    this.demo.bindOperEvent({
      onPrintClick: function() {
        that.demo.print();
      },
      onBtnNewClick() {
        that.NodeData = {};
        that.demo.loadData(that.NodeData);
        that.WFData.sendMessageData = [];
        that.WFData.operationData = [];
        that.WFData.workFlowData = [];
      },
      onItemRightClick(id, type) {
        document.oncontextmenu = function() {
          return false;
        };
        var getRightId = "";
        var obj = this.prop.$nodes[id];
        if (obj) {
          if (obj.type == "plug") {
            that.exportDialogVisible = true;
            that.nodeId = id;
          }
          if (obj.type == "node") {
            that.scheduleDialogVisible = true;
            that.nodeId = id;
          }
          if (obj.type == "chat") {
            that.messageDialogVisible = true;
            that.nodeId = id;
            console.log(that.list_z)
            that.eventId = that.list_z[0].Event_Id
          }
          if (obj.type == "liuzhuan") {
            that.liuzhaunDialogVisible = true;
            that.nodeId = id;
          }
          if (obj.type == "join") {
            that.userDialogVisible = true;
            that.nodeId = id;
          }
        }
      },
      onItemAdd: function(id, type, json) {
        console.log(json.type);
        if (type === "node" && json.type === "plug") {
          json.name = "单据流转";
        }
        if (type === "node" && json.type === "chat") {
          json.name = "消息";
        }
        if (type === "node" && json.type === "node") {
          json.name = "排程";
        }
        if (type === "node" && json.type === "start") {
          json.name = "开始";
        }
        if (type === "node" && json.type === "liuzhuan") {
          json.name = "流转";
        }
        if (type === "node" && json.type === "join") {
          json.name = "联合节点";
        }
        if (type === "node" && json.type === "end") {
          json.name = "结束";
        }
        if (type === "area") {
          json.name = "区域编辑";
        }
      },
      onItemDel(id, type) {
        var obj = this.prop.$nodes[id];
        if (obj) {
          if (obj.type == "plug") {
            var exportData = that.WFData.workFlowData;
            for (var i = 0; i < exportData.length; i++) {
              if (exportData[i].InParameters.Params.id == id) {
                exportData.splice(i, 1);
              }
            }
            that.WFData.workFlowData = exportData;
            this.$store.dispatch("wfdata", that.WFData);
          }
          if (obj.type == "node") {
            var operationData = that.WFData.operationData;
            for (var i = 0; i < operationData.length; i++) {
              if (operationData[i].InParameters.Params.Id == id) {
                operationData.splice(i, 1);
              }
            }
            that.WFData.operationData = operationData;
            this.$store.dispatch("wfdata", that.WFData);
          }
          if (obj.type == "chat") {
            var sendMessageData = that.WFData.sendMessageData;
            for (var i = 0; i < sendMessageData.length; i++) {
              if (sendMessageData[i].InParameters.Params.Id == id) {
                sendMessageData.splice(i, 1);
              }
            }
            that.WFData.sendMessageData = sendMessageData;
            this.$store.dispatch("wfdata", that.WFData);
          }
        }
      },
      onBtnSaveClick() {
        var processData = that.demo.exportData(); //节点对象
        console.log(processData);

        var lineKey = Object.keys(processData.lines);
        var nodeKey = Object.keys(processData.nodes);
        if (nodeKey.length > 0) {
          var endIndex = "";
          var startIndex = "";
          if (lineKey.length <= 0 && nodeKey.length > 0) {
            this.$message({
              type: "warning",
              message: "请选择有向连线"
            });
            return false;
          }
          if (lineKey.length < nodeKey.length - 1) {
            this.$message({
              type: "warning",
              message: "请选择有向连线"
            });
            return false;
          }
          var lineData = [];

          var startShow = false;
          var endShow = false;
          var startFrom = false;
          var endTo = false;
          nodeKey.forEach(function(key) {
            if (processData.nodes[key].type == "end") {
              endShow = true;
              for (var i = 0; i < lineKey.length; i++) {
                if (processData.lines[lineKey[i]].to == key) {
                  endIndex = key;
                  endTo = true;
                }
              }
            }
            if (processData.nodes[key].type == "start") {
              startShow = true;
              for (var i = 0; i < lineKey.length; i++) {
                if (processData.lines[lineKey[i]].from == key) {
                  startIndex = key;
                  startFrom = true;
                }
              }
            }
          });
          if (!startShow) {
            this.$message({
              type: "warning",
              message: "请选择开始节点"
            });
            return false;
          }
          if (!endShow) {
            this.$message({
              type: "warning",
              message: "请选择结束节点"
            });
            return false;
          }
          if (!startFrom) {
            this.$message({
              type: "warning",
              message: "存在错误连线"
            });
            return false;
          }
          if (!endTo) {
            this.$message({
              type: "warning",
              message: "存在错误连线"
            });
            return false;
          }
        }
        var endIndexShow = false;
        var startIndexShow = false;
        lineKey.forEach(function(key) {
          if (processData.lines[key].from == endIndex) {
            endIndexShow = true;
          }
          if (processData.lines[key].to == startIndex) {
            startIndexShow = true;
          }
        });
        if (endIndexShow) {
          this.$message({
            type: "warning",
            message: "结束节点有误"
          });
          return false;
        }
        if (startIndexShow) {
          this.$message({
            type: "warning",
            message: "开始节点有误"
          });
          return false;
        }

        for (var i = 0; i < lineKey.length; i++) {
          if (processData.lines[lineKey[i]].from == startIndex) {
            lineData.push(startIndex);
            startIndex = processData.lines[lineKey[i]].to;
            i = -1;
          }
        }
        lineData.push(endIndex);
        console.log(lineData);
        var FlowData = {
          NodeData: processData //节点数据
        };
        var workFlow = [];
        // console.log(that.WFData);
        var exportData = that.WFData.workFlowData;
        var operationData = that.WFData.operationData;
        var sendMessageData = that.WFData.sendMessageData;
        // console.log(operationData);
        //单据流转
        if ("undefined" != typeof exportData && exportData.length > 0) {
          //业务流转
          for (let i in exportData) {
            workFlow.push(exportData[i]);
          }
        }
        //排程
        if ("undefined" != typeof operationData && operationData.length > 0) {
          //操作
          for (let i in operationData) {
            workFlow.push(operationData[i]);
          }
        }
        //发送消息
        if (
          "undefined" != typeof sendMessageData &&
          sendMessageData.length > 0
        ) {
          // 发送信息
          for (let i in sendMessageData) {
            workFlow.push(sendMessageData[i]);
          }
        }
        let dataTemp = {
          lineData: lineData,
          FlowData: FlowData,
          BusinessData: workFlow
        };
        var data2 = {
          Name: "YWF_BusinessFlowNode",
          PropertyValueMap: {
            Id: that.checkId,
            Name: that.checkName
          },
          DefaultVal: "NewSave",
          Data: dataTemp
        };
        var forData = JSON.stringify(data2);
        that.$http
          .post(
          Yukon.Url.Bus,
            qs.stringify({
              name: Yukon.ServiceName.Workflow,
              operation: "SetJsonData",
              token: that.token,
              data: forData
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            }
          )
          .then(response => {
            var result = response.body;
            if (result.code == 0) {
              this.$message({
                type: "success",
                message: "保存成功"
              });
              bus.$emit("colseTabs", that.targetName); //关闭页面
            }
          })
          .catch(err => {});
      }
    });
  },
  methods: {
    getNode() {
      var Id = "Id,==," + this.checkId + ",And";
      var reqInfoData = JSON.stringify({
        Name: "YWF_BusinessFlowNode",
        DefaultVal: "Search",
        Filter: Id
      });
      this.$http
        .post(
          Yukon.Url.Bus,
          qs.stringify({
            name: Yukon.ServiceName.Workflow,
            operation: "GetJsonData",
            token: this.token,
            reqInfo: reqInfoData
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(response => {
          var result = response.body;
          if (result.code == 0) {
            if (result.data.FlowData) {
              var datas = JSON.parse(result.data.FlowData);
              this.NodeData = datas.NodeData;
              this.demo.loadData(this.NodeData);
              var BusinessData = JSON.parse(result.data.BusinessData);
              for (let i in BusinessData) {
                if (BusinessData[i].Name == "单据流转") {
                  this.nodeList.workFlowData.push(BusinessData[i]);
                }
                if (BusinessData[i].Name == "排程") {
                  this.nodeList.operationData.push(BusinessData[i]);
                }
                if (BusinessData[i].Name == "发送消息") {
                  this.nodeList.sendMessageData.push(BusinessData[i]);
                }
              }
              this.$store.dispatch("wfdata", this.nodeList);
            } else {
              this.nodeList.operationData = [];
              this.nodeList.sendMessageData = [];
              this.nodeList.workFlowData = [];
              this.$store.dispatch("wfdata", this.nodeList);
            }
          }
        })
        .catch(error => {});
    },
    exportDialogClose(val) {
      this.exportDialogVisible = val;
    },
    messageDialogClose(val) {
      this.messageDialogVisible = val;
    },
    userDialogClose(val) {
      this.userDialogVisible = val;
    },
    scheduleDialogClose(val) {
      this.scheduleDialogVisible = val;
    },
    transformDialogClose(val) {
      this.liuzhaunDialogVisible = val;
    }
  }
};
</script>

<style>
@import "GooFlow/assets/GooFlow.css";
@import "GooFlow/assets/workflow.css";
/* .GooFlow .ico_huber {
  background: url(/static/img/gooflow_icon.png) no-repeat -116px -45px;
  opacity: 1 !important;
  filter: Alpha(Opacity=100) !important;
}
.GooFlow .ico_router {
  background: url(/static/img/gooflow_icon.png) no-repeat -97px -45px;
  opacity: 1 !important;
  filter: Alpha(Opacity=100) !important;
}
.GooFlow .custom_huber {
  background: url(/static/img/gooflow_icon.png) no-repeat -1px -84px;
  opacity: 1 !important;
  filter: Alpha(Opacity=100) !important;
}
.GooFlow .custom_router {
  background: url(/static/img/gooflow_icon.png) no-repeat -106px -83px;
  opacity: 1 !important;
  filter: Alpha(Opacity=100) !important;
}
.GooFlow .ico_plug2 {
  background: url(/static/img/gooflow_icon.png) no-repeat -135px -45px;
  opacity: 1 !important;
  filter: Alpha(Opacity=100) !important;
} */
</style>
