<template>
  <div class="container homechart" style="background: #f3f3f3;">
    <div class="chart">
      <div class="chart-container">
            <div class='chart-div'>
                <div class='chart-canvas'>
                    <canvas id='canvas' />
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
</template>
<script>
  import {mapGetters} from 'vuex'
  import qs from 'qs';
  export default {
    data(){
      return{
      }
    },
    computed:{
        ...mapGetters(['token']), 
      },
    created(){
    },
    mounted(){
      this.pieGetData();//饼图
      this.barChartData();//柱状图
      this.doughnutData();//甜甜圈
      this.lineData();
    },
    methods:{
      //饼图数据
        pieGetData(){
          var data = {
              "Name": "SysLogin",
              "DefaultVal":"ChartPie",
              "Filter":"StartTime=="
          }
          var data2 = JSON.stringify(data)//转成json字符串
            this.$http.post(Yukon.Url.Bus,qs.stringify({
              "name":Yukon.ServiceName.Log,
              "operation":"GetJsonData",
                "token":this.token,
                "reqInfo": data2
            }),{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then((response)=>{ 
              var result = response.data;
              if(result.code == 0){
                var data = result.data;
                //饼状图
                var config = {
                    type: 'pie',
                    data: {
                        datasets: [{
                            data: data.data,
                            backgroundColor: [
                                window.chartColors.red,
                                window.chartColors.orange,
                                window.chartColors.yellow,
                                window.chartColors.green,
                                window.chartColors.blue,
                            ],
                            label: 'Dataset 1'
                        }],
                        labels:data.labels
                    },
                    options: {
                        responsive: true,
                        title: {
                    display: true,
                    text: "生产计划详情"
                  },
                        legend: {
                          display: true,
                          position:'right'
                      },
                    }
                };
                var ctx = document.getElementById("canvas").getContext("2d");
                    window.myPie = new Chart(ctx, config);
                }
              })
            .catch(function (error) {
              console.log(error);
            });
        },
        //柱状图
        barChartData(){
          var data = {
              "Name": "SysLogin",
              "DefaultVal":"ChartBarGraph",
              "Filter":"StartTime=="
          }
          var data2 = JSON.stringify(data)//转成json字符串
            this.$http.post(Yukon.Url.Bus,qs.stringify({
              "name":Yukon.ServiceName.Log,
              "operation":"GetJsonData",
                "token":this.token,
                "reqInfo": data2
            }),{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then((response)=>{ 
              var result = response.data;
              if(result.code == 0){
                var data = result.data;
                var dataList = [];
                var backgroundColor = [
                  window.chartColors.red,
                  window.chartColors.orange,
                  window.chartColors.yellow,
                  window.chartColors.green,
                  window.chartColors.blue,
                  window.chartColors.purple,
                  window.chartColors.red
                ]
                //把datasets赋给数组
                for (var i = 0; i < data.datasets.length; i++) {
                  dataList.push(data.datasets[i])
                }
                //把background付给数组
                for (var i = 0; i < dataList.length; i++) {
                  dataList[i].backgroundColor = backgroundColor
                }
                //柱状图
                var barChartData = {
                    labels: data.labels,
                    datasets: dataList
                };
                var ctx2 = document.getElementById("canvas2").getContext("2d");
                    window.myBar2 = new Chart(ctx2, {
                        type: 'bar',
                        data: barChartData,
                        options: {
                            responsive: true,
                            legend: {
                          display: true,
                          position:'right'
                      },
                            title: {
                                display: true,
                                text: "料品比例"
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: true
                            },
                            scales: {
                                yAxes: [{
                                    type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                    display: true,
                                    position: "left",
                                    id: "y-axis-1",
                                }, {
                                    type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                    display: true,
                                    position: "right",
                                    id: "y-axis-2",
                                    gridLines: {
                                        drawOnChartArea: false
                                    }
                                }],
                            }
                        }
                    });
                }
              })
              .catch(function (error) {
                  console.log(error);
            });
        },
        //甜甜圈
        doughnutData(){
          var data = {
              "Name": "SysLogin",
              "DefaultVal":"ChartDoughnut",
              "Filter":"StartTime=="
          }
          var data2 = JSON.stringify(data)//转成json字符串
            this.$http.post(Yukon.Url.Bus,qs.stringify({
              "name":Yukon.ServiceName.Log,
              "operation":"GetJsonData",
                "token":this.token,
                "reqInfo": data2
            }),{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then((response)=>{ 
              var result = response.data;
              if(result.code == 0){
                var data = result.data;
                //甜甜圈
                var config3 = {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: data.data,
                            backgroundColor:[
                                window.chartColors.red,
                                window.chartColors.orange,
                                window.chartColors.yellow,
                                window.chartColors.green,
                                window.chartColors.blue,
                            ],
                            label: "需要完成订单"
                        }],
                        labels: data.labels
                    },
                    options: {
                        responsive: true,
                        legend:{
                          display: true,
                          position:'right'
                      },
                        title: {
                            display: true,
                            text: '订单数量比'
                        },
                        animation: {
                            animateScale: true,
                            animateRotate: true
                        }
                    }
                  };
                  var ctx3 = document.getElementById("canvas3").getContext("2d");
                  window.myDoughnut = new Chart(ctx3, config3);
                }
                })
              .catch(function (error) {
                  console.log(error);
            });
        },
        //折线图
        lineData(){
          var data = {
              "Name": "SysLogin",
              "DefaultVal":"ChartLine",
              "Filter":"StartTime=="
          }
          var data2 = JSON.stringify(data)//转成json字符串
            this.$http.post(Yukon.Url.Bus,qs.stringify({
              "name":Yukon.ServiceName.Log,
              "operation":"GetJsonData",
                "token":this.token,
                "reqInfo": data2
            }),{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then((response)=>{ 
              var result = response.data;
              if(result.code == 0){
                var data = result.data;
              var dataList = [];
              var borderColor = [
                  window.chartColors.blue,
                  window.chartColors.red
              ];
              //把datasets赋给数组
              for (var i = 0; i < data.datasets.length; i++) {
                dataList.push(data.datasets[i])
              }
              for (var i = 0; i < dataList.length; i++) {
                dataList[i].fill = false;
              }
              //把boder颜色赋给数组
              for (var i = 0; i < borderColor.length; i++) {
                dataList[i].borderColor = borderColor[i];
                dataList[i].backgroundColor = borderColor[i];
              }
              //折线图
              var config4 = {
                  type: 'line',
                  data: {
                      labels: data.labels,
                      datasets: dataList
                  },
                  options: {
                      responsive: true,
                      legend:{
                        display: true,
                        position:'right'
                    },
                      title: {
                          display: true,
                          text: '交货订单数量'
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
                        }
                      }
                    };
                  var ctx4 = document.getElementById("canvas4").getContext("2d");
                  window.myLine = new Chart(ctx4, config4);
                }
              })
              .catch(function (error) {
                  console.log(error);
            });
        },
    }
  }
</script>