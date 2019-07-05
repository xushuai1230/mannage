<template>
  <div class="container homechart" style="background: #f3f3f3;">
    <div class="chart">
      <div class="chart-container" style="width:100%;float:left">
        <div class="chart-pic">
          <div id="canvas" v-bind:style="{height: heightHalfMap}"></div>
          <div class="behaviorEchart">
            <el-form :inline="true" size="mini" class="weightTitle">
              <el-form-item label="权重" class="weightTitle" style="font-weight: bolder;"></el-form-item>
            </el-form>
            <div v-for="(item,index) in proportionData" :key="index">
              <el-form :inline="true" size="mini" label-width="80px">
                <el-form-item :label="item.name">
                  <el-slider
                    :style="{width: weightWidth}"
                    style="height:0px;"
                    v-model="item.value"
                    @change="changeByPro"
                  ></el-slider>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div class="chart-pic">
          <div id="canvas2" v-bind:style="{height: heightHalfMap,width:widthHalfMap}"></div>
        </div>
      </div>
      <div class="chart-container" style="width:100%;float:left">
        <div class="chart-pic" style="width:40%;padding: 5% 0 0 15%;">
          <div style="height: 100%;">
            <el-form :inline="true" size="mini">
              <el-col>
                <el-form-item label="意向类型：">
                  <el-select
                    v-model="typeSelect"
                    filterable
                    clearable
                    size="mini"
                    @visible-change="GetTypeData($event)"
                  >
                    <el-option
                      v-for="op in optionsTypeData"
                      :key="op.key"
                      :label="op.value"
                      :value="op.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="租户名称：">
                  <el-select
                    v-model="nameSelect"
                    filterable
                    clearable
                    size="mini"
                    @visible-change="GetNameData($event)"
                  >
                    <el-option
                      v-for="op in optionsNameData"
                      :key="op.key"
                      :label="op.value"
                      :value="op.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-button
                size="mini"
                icon="el-icon-search"
                style="margin-left: 82px;"
                @click="btnSearch"
              >搜索</el-button>
            </el-form>
          </div>
        </div>
        <div class="chart-pic" style="width:60%">
          <div id="canvas3" v-bind:style="{height: '380px',width:widthHalfMap}"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import qs from 'qs';
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      typeSelect: "",
      nameSelect: "",
      optionsTypeData: [],
      optionsNameData: [],
      proportionData: [],
      heightMap: "",
      heightHalfMap: "",
      widthMap: "",
      widthHalfMap: "",
      weightWidth: "",
      filter: "Selection,==,意向高,and;"
    };
  },
  computed: {
    ...mapGetters(["token"])  
  },
  created() {
    this.CalculationHeight(); // 计算高度 
  },
  mounted() {
    this.pieGetData(); //饼图
    this.barChartData(); //柱状图
    this.doughnutData(); //甜甜圈
    this.getProportionData(); //权重图
    var _this = this;
    window.onresize = function() {
      _this.CalculationHeight();
      // _this.CalculationWidth();
    };
  },
  methods: {
    CalculationHeight() {
      this.heightHalfMap = (window.innerHeight - 180) / 2 + "px";
      if (window.screen.height < 1080 || window.innerWidth < 1450) {
        this.weightWidth = 50 + "px";
      } else {
        this.weightWidth = 100 + "px";
      }
    },
    CalculationWidth() {
      this.widthHalfMap = (window.innerWidth - 220) / 2 + "px";
    },
    //饼图数据
    pieGetData() {
      let myChart = this.$echarts.init(document.getElementById("canvas"));
      var data = {
        Name: "SysLogStatistics",
        DefaultVal: "ChartPie",
        Filter: ""
      };
      var data2 = JSON.stringify(data); //转成json字符串
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        "name":Yukon.ServiceName.Log,
        "operation":" GetJsonData",
        "token":this.token,
        "reqInfo":data2,
      }),{
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response)=>{ 
          var result = response.data;
          if(result.code == 0){
            this.barChartData(); //柱状图
            var data = result.data;
            this.optionsTypeData = [];
            for (var i = 0; i < data.data.length; i++) {
              var obj = { key: i, value: data.data[i].name };
              this.optionsTypeData.push(obj);
            }
            myChart.clear();
            myChart.setOption({
              title: {
                text: data.name,
                left: "44%"
              },
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} :{c}%"
              },
              legend: {
                orient: "vertical",
                left: "10%",
                top: "45%"
              },
              color: data.colors,
              series: [
                {
                  name: "用户分析",
                  type: data.chartType,
                  radius: "60%",
                  center: ["60%", "55%"],
                  data: data.data,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                  }
                }
              ]
            });
          }
        })
        .catch(function(error) {});
    },
    //甜甜圈
    doughnutData() {
      let myChart = this.$echarts.init(document.getElementById("canvas2"));
      var data = {
        Name: "SysLogStatistics",
        DefaultVal: "ChartDoughnut",
        Filter: ""
      };
      var data2 = JSON.stringify(data); //转成json字符串
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        "name":Yukon.ServiceName.Log,
        "operation":"GetJsonData",
        "token":this.token,
        "reqInfo":data2,
      }),{
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response)=>{ 
          var result = response.data;
          if(result.code == 0){
            var data = result.data;
            var lables = [];
            myChart.clear();
            myChart.setOption({
              title: {
                text: data.name,
                right: "50%"
              },
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} :{c}%"
              },
              legend: {
                right: "15%",
                top: 20,
                bottom: 20,
                orient: "vertical",
                type: "scroll"
              },
              series: [
                {
                  name: "访问来源",
                  type: data.chartType,
                  radius: ["40%", "60%"],
                  center: ["40%", "55%"],
                  avoidLabelOverlap: false,
                  label: {
                    normal: {
                      show: false,
                      position: "center"
                    },
                    emphasis: {
                      show: true,
                      textStyle: {
                        fontSize: "30",
                        fontWeight: "bold"
                      }
                    }
                  },
                  data: data.data
                }
              ]
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 柱状图
    barChartData() {
      let myChart = this.$echarts.init(document.getElementById("canvas3"));
      var data = {
        Name: "SysLogStatistics",
        DefaultVal: "Histogram",
        Filter: this.filter
      };
      var data2 = JSON.stringify(data); //转成json字符串
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        "name":Yukon.ServiceName.Log,
        "operation":"GetJsonData",
        "token":this.token,
        "reqInfo":data2,
      }),{
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response)=>{ 
          var result = response.data;
          if(result.code == 0){
            var data = result.data;
            if (data.groupData.length > 0) {
              myChart.clear();
              myChart.setOption({
                title: {
                  text: data.name,
                  left: "40%"
                },
                tooltip: {
                  trigger: "axis",
                  axisPointer: {
                    type: "shadow"
                  }
                },
                legend: {
                  data: data.group,
                  right: "20%",
                  orient: "vertical",
                  type: "scroll"
                },
                grid: {
                  left: "0%",
                  right: "30%",
                  bottom: "0%",
                  containLabel: true
                },
                color: data.colors,
                xAxis: {
                  type: "value",
                  show: false
                },
                yAxis: {
                  type: data.chartType,
                  data: data.xdata,
                  axisLabel: {
                    color: "black",
                    fontWeight: "bolder"
                  },
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    show: false
                  },
                  splitLine: {
                    show: false
                  }
                },
                series: [
                  {
                    name: data.groupData[0].name,
                    type: data.groupData[0].type,
                    data: data.groupData[0].data,
                    label: data.groupData[0].label,
                    itemStyle: {  
                      normal: {
                        // 定制显示（按顺序）
                        color: function(params) {
                          var colorList = data.colorList;
                          return colorList[params.dataIndex];
                        }
                      }
                    }
                  }
                ]
              });
            } else {
              var dataXdata = []
              for(let i =0;i<data.xdata.length;i++) {
                dataXdata.push('')
              }
               myChart.clear();
               myChart.setOption({
                title: {
                  text: data.name,
                  left: "40%"
                },
                tooltip: {
                  trigger: "axis",
                  axisPointer: {
                    type: "shadow"
                  }
                },
                legend: {
                  data: data.group,
                  right: "20%",
                  orient: "vertical",
                  type: "scroll"
                },
                grid: {
                  left: "0%",
                  right: "30%",
                  bottom: "0%",
                  containLabel: true
                },
                color: data.colors,
                xAxis: {
                  type: "value",
                  show: false
                },
                yAxis: {
                  type: data.chartType,
                  data: data.xdata,
                  axisLabel: {
                    color: "black",
                    fontWeight: "bolder"
                  },
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    show: false
                  },
                  splitLine: {
                    show: false
                  }
                },
                series: [
                  {
                    name: '意向高',
                    type:"bar",
                    data: dataXdata,
                    label:{
                      "normal": {
                        "show": true,
                        "position": "inside"
                    },
                    itemStyle: {  
                      normal: {
                        // 定制显示（按顺序）
                        color: function(params) {
                          var colorList = data.colorList;
                          return colorList[params.dataIndex];
                        }
                      }
                    }
                  }
                  }],
              });
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //权重图
    getProportionData() {
      var data = {
        Name: "SysLogStatistics",
        DefaultVal: "WeightValue"
      };
      var data2 = JSON.stringify(data); //转成json字符串
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        "name":Yukon.ServiceName.Log,
        "operation":"GetJsonData",
        "token":this.token,
        "reqInfo":data2,
      }),{
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response)=>{ 
          var result = response.data;
          if(result.code == 0){
            var data = result.data;
            this.proportionData = data;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //修改权重
    changeByPro() {
      var propery = this.proportionData;
      var data = {
        Name: "SysLogStatistics",
        DefaultVal: "Modify",
        PropertyValueMap: {
          data: propery
        }
      };
      var data2 = JSON.stringify(data); //转成json字符串
      this.$http.post(Yukon.Url.Bus,qs.stringify({
        "name":Yukon.ServiceName.Log,
        "operation":"SetStatisticsData",
        "token":this.token,
        "data":data2,
      }),{
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response)=>{ 
          var result = response.data;
          if (result.code == 0) {
            if (this.typeSelect != "") {
              this.filter = "Selection,==," + this.typeSelect + ",and;";
            }
            this.nameSelect = "";
            this.pieGetData(); //饼图
          } else{
            this.$alert(result.msg, "提示", {
              confirmButtonText: "确定",
              callback: action => {}
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    btnSearch() {
      if (this.typeSelect != "" && this.nameSelect != "") {
        this.filter =
          "Selection,==," +
          this.typeSelect +
          ",and;OwnerName,==," +
          this.nameSelect +
          ",and;";
      } else if (this.typeSelect != "" && this.nameSelect == "") {
        this.filter = "Selection,==," + this.typeSelect + ",and;";
      } else if (this.typeSelect == "" && this.nameSelect != "") {
        this.filter = "OwnerName,==," + this.nameSelect + ",and;";
      } else {
        this.filter = "Selection,==,意向高,and;";
      }
      this.barChartData();
    },
    GetTypeData(val) {
      if (val == false) {
        if (this.typeSelect != "") {
          var OwnerFilter = "Selection,==," + this.typeSelect + ",and;";
        } else {
          var OwnerFilter = "Selection,==,意向高,and;";
        }
        var data = {
          Name: "SysLogStatistics",
          DefaultVal: "OwnerName",
          Filter: OwnerFilter
        };
        var data2 = JSON.stringify(data); //转成json字符串
        this.$http.post(Yukon.Url.Bus,qs.stringify({
          "name":Yukon.ServiceName.Log,
          "operation":"GetJsonData",
          "token":this.token,
          "reqInfo":data2,
        }),{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response)=>{ 
            var result = response.data;
            if(result.code == 0){
              var data = result.data;
              var num = 0;
              this.optionsNameData = data;
              for (var i = 0; i < this.optionsNameData.length; i++) {
                if (this.nameSelect == this.optionsNameData[i].value) {
                  num = 1;
                  break;
                }
              }
              if (num == 0) {
                this.nameSelect = "";
              }
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    GetNameData(val) {
      if (val == true) {
        if (this.typeSelect != "") {
          var OwnerFilter = "Selection,==," + this.typeSelect + ",and;";
          var data = {
            Name: "SysLogStatistics",
            DefaultVal: "OwnerName",
            Filter: OwnerFilter
          };
          var data2 = JSON.stringify(data); //转成json字符串
          this.$http.post(Yukon.Url.Bus,qs.stringify({
            "name":Yukon.ServiceName.Log,
            "operation":"GetJsonData",
            "token":this.token,
            "reqInfo":data2,
          }),{
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then((response)=>{ 
              var result = response.data;
              if(result.code == 0){
                var data = result.data;
                this.optionsNameData = data;
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          var OwnerFilter = "Selection,==,意向高,and;";
          this.optionsNameData = [];
        }
      }
    }
  }
};
</script>
<style lang="scss">
.homechart {
  #canvas {
    float: left;
    width: 70%;
  }
  .behaviorEchart {
    height: 100%;
    width: 30%;
    float: right; 
    
    >div {
      padding-left:8% 
    }
    .el-slider__runway {
      width: 100%;
      height: 5px !important;
      margin: 10px 0;
      background-color: #e4e7ed;
    }
    .el-slider__button {
      width: 12px;
      height: 12px;
      border: 2px solid #bec6ce;
      background-color: #fff;
    }
    .el-slider__bar {
      height: 5px;
      background-color: #a8d0f9;
    }
    .el-form-item__label {
      font-size: 12px;
      color: black;
    }
    .el-form-item {
      margin: 0px 0px 0px 0px !important;
      height: 20px;
    }
    .weightTitle {
      margin-bottom: 13%;
      text-align: center;
      .el-form-item__label {
        font-size: 18px !important;
        font-weight: bolder;
      }
    }
  }
  .chart {
    background: #f3f3f3;
    border: 0;
    height: 100%;
    .chart-pic {
      width: 49%;
      height: 100%;
      float: left;
      margin-top: 20px;
    }
  }
}
</style>