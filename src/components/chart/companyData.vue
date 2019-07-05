<template>
  <div class="CompanyData">
    <div class="chartDiv">
      <span class="container_title">企业大数据展示</span>
    </div>
    <div class="chartDivOne">
      <el-row :gutter="20" class="elRowStyle">
        <el-col :span="6">
          <div class="bgsa">
            <span>订单交付周期:</span>
            <span class="bgsa_num">20月</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="bgsa">
            <span>客户满意率:</span>
            <span class="bgsa_num">70.3%</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="bgsa">
            <span>交付率:</span>
            <span class="bgsa_num">43.7%</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="bgsa">
            <span>采购指数:</span>
            <span class="bgsa_num">54.5</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="containerDiv">
      <span class="container_title">企业运营数据展示</span>
    </div>
    <div class="chartDivTwo">
      <div class="chart">
        <div class="chart-container">
          <div class='chart-div'>
            <div class='chart-canvas'>
              <canvas id='myChart' />
            </div>
          </div>
          <div class='chart-div'>
            <div class='chart-canvas'>
              <canvas id='canvas2' />
            </div>
          </div>
        </div>
        <div class="chart-container">
          <div class='chart-div'>
            <div class='chart-canvas'>
              <canvas id='canvas3' />
            </div>
          </div>
          <div class='chart-div'>
            <div class='chart-canvas'>
              <canvas id='canvas4' />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import '../../assets/sass/chart.scss'
  export default {
    name: 'chart',
    props: ['refresh', 'event', 'editId'],
    data() {
      return {
        form: {},
        value: '',
        height: '',
      }
    },
    components: {},
    created() {
      this.CalculationHeight(); // 计算高度
    },
    mounted() {
      this.pieGetData(); //饼图
      this.barGraphData(); //柱状图
      this.barChartData(); //供求关系
      this.annularDatas(); //折线图
    },
    methods: {
      CalculationHeight() {
        this.height = window.innerHeight - 150 + 'px';
      },
      //饼图数据
      pieGetData() {
        var randomScalingFactor = function () {
          return Math.round(Math.random() * 100);
        };
        var config = {
          type: 'pie',
          data: {
            datasets: [{
              data: [
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
              ],
              backgroundColor: [
                window.chartColors.green,
                window.chartColors.blue,
                window.chartColors.yellow,
                window.chartColors.green,
                window.chartColors.blue,
              ],
              label: '月份'
            }],
            labels: [
              "浙鼎",
              "邦信",
              "华泰",
              "阳泰",
              "叶丰"
            ]
          },
          options: {
            responsive: true,
            title: {
              display: true,
              text: '订单交付周期（月）'
            },
            animation: {
              animateScale: true,
              animateRotate: true
            },
            legend: {
              position: 'right',
            },
          }
        };
        var ctx = document.getElementById("myChart").getContext("2d");
        window.myPie = new Chart(ctx, config);
      },
      //柱状图
      barGraphData() {
        var randomScalingFactor = function () {
          return Math.round(Math.random() * 100);
        };
        var barGraphData = {
          labels: ["浙鼎", "邦信", "华泰", "阳泰", "叶丰", ],
          datasets: [{
            label: '企业客户满意率',
            backgroundColor: [
              window.chartColors.green,
              window.chartColors.blue,
              window.chartColors.green,
              window.chartColors.blue,
              window.chartColors.green,
              window.chartColors.blue,
              window.chartColors.green
            ],
            yAxisID: "y-axis-1",
            data: [
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor()
            ]
          }, ]
        };
        var ctx2 = document.getElementById("canvas2").getContext("2d");
        window.myBar2 = new Chart(ctx2, {
          type: 'bar',
          data: barGraphData,
          options: {
            responsive: true,
            title: {
              display: true,
              text: "客户满意率"
            },
            tooltips: {
              mode: 'index',
              intersect: true
            },
            scales: {
              yAxes: [{
                type: "linear",
                display: true,
                position: "left",
                id: "y-axis-1",
              }, {
                type: "linear",
                display: true,
                position: "right",
                id: "y-axis-2",
                gridLines: {
                  drawOnChartArea: false
                }
              }],
            },
            legend: {
              position: 'right',
            },
          }
        });
      },
      //供求关系
      barChartData() {
        var randomScalingFactor = function () {
          return Math.round(Math.random() * 100);
        };
        var config3 = {
          type: 'doughnut',
          data: {
            datasets: [{
              data: [
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
              ],
              backgroundColor: [
                window.chartColors.green,
                window.chartColors.blue,
                window.chartColors.green,
                window.chartColors.blue,
                window.chartColors.yellow,
              ],
              label: 'Dataset 1'
            }],
            labels: [
              "浙鼎",
              "邦信",
              "华泰",
              "阳泰",
              "叶丰"
            ]
          },
          options: {
            responsive: true,
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: '交付率（%）'
            },
            animation: {
              animateScale: true,
              animateRotate: true
            },
            legend: {
              position: 'right',
            },
          }
        };
        var ctx3 = document.getElementById("canvas3").getContext("2d");
        window.myDoughnut = new Chart(ctx3, config3);
      },
      //环形
      annularDatas() {
        var randomScalingFactor = function () {
          return Math.round(Math.random() * 100);
        };
        var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
          "November", "December"
        ];
        var config4 = {
          type: 'line',
          data: {
            labels: ["一月", "二月", "三月", "四月", "五月", "六月", "七月"],
            datasets: [{
              label: "采购经理人指数",
              fill: false,
              backgroundColor: window.chartColors.blue,
              borderColor: window.chartColors.blue,
              data: [
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor()
              ],
            }]
          },
          options: {
            responsive: true,
            title: {
              display: true,
              text: '采购指数'
            },
            tooltips: {
              mode: 'index',
              intersect: false,
            },
            hover: {
              mode: 'nearest',
              intersect: true
            },
            scales: {
              xAxes: [{
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: 'Month'
                }
              }],
              yAxes: [{
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: 'Value'
                }
              }]
            },
            legend: {
              position: 'right',
            },
          }
        };
        var ctx4 = document.getElementById("canvas4").getContext("2d");
        window.myLine = new Chart(ctx4, config4);
      }
    }
  }

</script>
