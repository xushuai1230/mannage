<template>
  <div id="DemoDragadd">
    <goo-flow :property="myProps" :global="global" :plugIns="plugIns" ref="gooFlow"></goo-flow>
    <sendPerson
      v-on:DialogVisibleFalse="sendDialogClose"
      v-if="sendDialogVisible"
      :nodeId="nodeId"
      :sendDialogVisible="sendDialogVisible"
    />
  </div>
</template>

<script>
import GooFlow from "../workFlow//GooFlow/GooFlow";
import global from "../workFlow//GooFlow/assets/global"; //该配置项仅供参考，不随其它JS文件一起打包发布
import Group from "../workFlow//GooFlow/extends/group"; //GooFlow扩展泳道支持
import Memo from "../workFlow//GooFlow/extends/memo"; //GooFlow扩展便笺支持
import AutoAlign from "../workFlow//GooFlow/extends/autoalign"; //GooFlow扩展自动对齐支持
import Dragadd from "../workFlow//GooFlow/extends/dragadd"; //GooFlow扩展重新定义添加块状元素的操作方式为visio的拖拽式
import Print from "../workFlow//GooFlow/extends/print"; //GooFlow扩展将流程图打印或另存为PDF的支持
import MyAuth from "@/assets/js/myAuth";
import qs from "qs";
import bus from "@/assets/public/js/eventBus";
import { mapGetters } from "vuex";

import sendPerson from "./dialog/sendPerson";

export default {
  name: "DemoDragadd",
  components: {
    GooFlow,
    sendPerson
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
        toolBtns: ["start round mix", "end round", "liuzhuan"],
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
      global: global,
      plugIns: [Group, Memo, AutoAlign, Dragadd, Print],
      sendDialogVisible: false,
       checkId: localStorage.getItem("processCheckId"),
      checkName: localStorage.getItem("processCheckName"),
      nodeId: "",
       nodeList: {
        approvalData: []
      },
    };
  },
  computed: {
    ...mapGetters(["token", "WFData"])
  },
  mounted() {
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
      },
      onItemRightClick(id, type) {
        document.oncontextmenu = function() {
          return false;
        };
        var getRightId = "";
        var obj = this.prop.$nodes[id];
        if (obj) {
        }
        if (obj.type == "liuzhuan") {
          that.sendDialogVisible = true;
          that.nodeId = id;
        }
      },
      onItemAdd: function(id, type, json) {
         if (type === "node" && json.type === "liuzhuan") {
          json.name = "审批流";
        }
      },
      onItemDel(id, type) {
        var obj = this.prop.$nodes[id];
      },
      onBtnSaveClick() {
        var processData = that.demo.exportData(); //节点对象
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
            if (processData.nodes[key].type == "chat") {
              startShow = true;
            }
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
        var FlowData = {
          NodeData: processData //节点数据
        };
        var workFlow = [];
        var approvalData = that.WFData.approvalData;
        //单据流转
        if ("undefined" != typeof approvalData && approvalData.length > 0) {
          //业务流转
          for (let i in approvalData) {
            workFlow.push(approvalData[i]);
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
                if (BusinessData[i].Name == "审批流") {
                  this.nodeList.approvalData.push(BusinessData[i]);
                }
              }
              this.$store.dispatch("wfdata", this.nodeList);
            } else {
              this.nodeList.approvalData = [];
              this.$store.dispatch("wfdata", this.nodeList);
            }
          }
        })
        .catch(error => {});
    },
    sendDialogClose(val) {
      this.sendDialogVisible = val;
    }
  }
};
</script>

<style>
@import "../workFlow/GooFlow/assets/GooFlow.css";
@import "../workFlow/GooFlow/assets/workflow.css";
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
