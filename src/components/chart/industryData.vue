<template>
	<div class="IndustryData">
		<div class="chartDiv">
			<span class="container_title">行业数据展示</span>
		</div>
		<div class="chartDivOne">
			<el-row :gutter="20" class="elRowStyle">
				<el-col :span="6">
					<div class="bgsa">
						<span>区域产能对比:</span>
						<span class="bgsa_num">1/2/3</span>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="bgsa">
						<span>月配送比:</span>
						<span class="bgsa_num">5/8</span>
					</div>
				</el-col>
				<el-col :span="6">
					<div  class="bgsa">
						<span>供求关系:</span>
						<span class="bgsa_num">5/12</span>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="bgsa">
						<span>行业景气指数:</span>
						<span class="bgsa_num">56.8</span>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="containerDiv">
			<span class="container_title">行业数据图表</span>
		</div>
		<div class="chartDivTwo">
			<div class="chart">
				<div class="chart-container">
					<div class='chart-div'>
						<div class='chart-canvas'>
							<canvas class="canvasStyle" id='myChart' />
						</div>
					</div>
					<div class='chart-div'>
						<div class='chart-canvas'>
							<canvas class="canvasStyle" id='canvas2' />
						</div>
					</div>
				</div>
				<div class="chart-container chart-container2">
					<div class='chart-div'>
						<div class='chart-canvas'>
							<canvas class="canvasStyle" id='canvas3' />
						</div>
					</div>
					<div class='chart-div'>
						<div class='chart-canvas'>
							<canvas class="canvasStyle" id='canvas4' />
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
		props: ['refresh','event', 'editId'],
		data() {
			return {
				form: {},
				value:'',
			}
		},
		components:{
		},
		mounted () {  
   	      this.pieGetData();//饼图
          this.barGraphData();//柱状图
          this.barChartData();//供求关系
          this.annularDatas();//折线图
        }, 
        methods: { 
    	//饼图数据
    	pieGetData(){
    		var randomScalingFactor = function() {
    			return Math.round(Math.random() * 100);
    		};
    		var config = {
				type: 'pie',//饼图
				data: {
					datasets: [{
						data: [
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						],
						backgroundColor: [
						window.chartColors.blue,
						window.chartColors.green,
						window.chartColors.orange,
						],
						label: '区域产能对比'
						}],
						labels: [
						"浙江温州",
						"河北永年",
						"浙江海盐",
						]
					},
					options: {
						responsive: true,
						title: {
							display: true,
							text: '区域产能比',
							position: 'top'
						},
						animation: {
							animateScale: true,
							animateRotate: true
						},
						legend: {
				            position:'right',
				        },
					}
				};
	      var ctx = document.getElementById("myChart").getContext("2d");
	      window.myPie = new Chart(ctx, config);
	  },
	    //柱状图
	    barGraphData(){
	    	var randomScalingFactor = function() {
	    		return Math.round(Math.random() * 100);
	    	};
	    	var barGraphData = {
				labels: ["一月", "二月", "三月", "四月", "五月", "六月", "七月"],//柱状图
				datasets: [{
					label: '已生产',
					backgroundColor: [
					window.chartColors.green,
					window.chartColors.green,
					window.chartColors.green,
					window.chartColors.green,
					window.chartColors.green,
					window.chartColors.green,
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
				},{
					label: '需配送',
					backgroundColor: window.chartColors.blue,
					yAxisID: "y-axis-2",
					data: [
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor()
					]
				}]
			};
			var ctx2 = document.getElementById("canvas2").getContext("2d");
			window.myBar2 = new Chart(ctx2, {
				type: 'bar',
				data: barGraphData,
				options: {
					responsive: true,
					title: {
						display: true,
						text: "月生产配送比"
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
						},{
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
			            position:'right',
			        },
				}
			});
	  },
		//供求关系
		barChartData(){
			var randomScalingFactor = function() {
				return Math.round(Math.random() * 100);
			};
			var barChartData02 = {
			    labels: ["一月", "二月", "三月", "四月", "五月", "六月", "七月"],//柱状图
			    datasets: [{
			    	label: '需求',
			    	backgroundColor: [
			    	window.chartColors.green,
			    	window.chartColors.green,
			    	window.chartColors.green,
			    	window.chartColors.green,
			    	window.chartColors.green,
			    	window.chartColors.green,
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
			    }, {
			    	label: '库存',
			    	backgroundColor: window.chartColors.blue,
			    	yAxisID: "y-axis-2",
			    	data: [
			    	randomScalingFactor(),
			    	randomScalingFactor(),
			    	randomScalingFactor(),
			    	randomScalingFactor(),
			    	randomScalingFactor(),
			    	randomScalingFactor(),
			    	randomScalingFactor()
			    	]
			    }]

			};
			var ctx3 = document.getElementById("canvas3").getContext("2d");
			window.myBar2 = new Chart(ctx3, {
				type: 'bar',
				data: barChartData02,
				options: {
					responsive: true,
					title: {
						display: true,
						text: "供求关系"
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
			            position:'right',
			        },
				    }
				});
		},
		//环形
		annularDatas(){
			var randomScalingFactor = function() {
				return Math.round(Math.random() * 100);
			};
			var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			var config4 = {
				type: 'line',//折线图
				data: {
					labels: ["一月", "二月", "三月", "四月", "五月", "六月", "七月"],
					datasets: [{
						label: "行业景气指数",
						backgroundColor: window.chartColors.orange,
						borderColor: window.chartColors.orange,
						data: [
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor()
						],
						fill: false,
					},
					]
				},
				options: {
					responsive: true,
					title: {
						display: true,
						text: '行业景气度'
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
				            position:'right',
				        },
				}
			};
			var ctx4 = document.getElementById("canvas4").getContext("2d");
			window.myLine = new Chart(ctx4, config4);
		}
	}
}
</script>
