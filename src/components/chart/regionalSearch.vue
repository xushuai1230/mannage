<template>
	<div class="RegionalSearch">
		<div class="chartDiv">
			<span class="container_title">区域搜索</span>
		</div>
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
		</div>
		<div class="chartDiv">
			<span class="container_title">供应商分布</span>
		</div>
		<div class="mapStyle" >
			<div class="mapCss" id='allmap' v-bind:style="{height: heightMap}"></div>
		</div>
    </div>
</template>
<script>
	import {MP} from '../../assets/js/map'
	import '../../assets/sass/chart.scss'
	export default {
		name: 'chart',
		props: ['refresh','event', 'editId'],
		data() {
			return {
				form: {},
				value:'',
				heightMap:'',
			}
		},
		components:{
		},
		created(){  
	      this.CalculationHeight(); // 计算高度
	    },
		mounted(){
			this.$nextTick(function () {
	            MP("gunzdTw6GkbgSE5s51VUC20p3elQxAKL").then( BMap => {
	               this.mapDatas();//地图
	            })
	        });
		   	this.pieGetData();//饼图
		    this.barChartData();//柱状图
	    },
	    methods: { 
	  	CalculationHeight() {
            this.heightMap = (window.innerHeight-85)/2 - 25 + 'px';  
        },
	  	pieGetData(){
	  		var randomScalingFactor = function() {
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
	  					label: 'Dataset 1'
	  				}],
	  				labels: [
	  				"省内",
	  				"省外",
	  				"同城",
	  				"国外",
	  				"其它"
	  				]
	  			},
	  			options: {
	  				responsive: true,
	  				title: {
	  					display: true,
	  					text: '供应商距离'
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
	  	barChartData(){
	  		var randomScalingFactor = function() {
	  			return Math.round(Math.random() * 100);
	  		};
	  		var barChartData = {
	  			labels: ["0-100", "100-300", "300-500", "500-1000", "1000-3000", "3000-5000", "10000+"],
	  			datasets: [{
	  				label: '供应商规模',
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
	  			},
	  			]

	  		};
	  		var ctx2 = document.getElementById("canvas2").getContext("2d");
	  		window.myBar2 = new Chart(ctx2, {
	  			type: 'bar',
	  			data: barChartData,
	  			options: {
	  				responsive: true,
	  				title: {
	  					display: true,
	  					text: "供应商资质"

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
	  	mapDatas(){
	      	// 百度地图API功能
	      	var map = new BMap.Map("allmap");
	      	var point = new BMap.Point(120.691496,27.984764);
	      	map.centerAndZoom(point, 11);
	      	// map.centerAndZoom(point,15);
            // map.enableScrollWheelZoom();
			// 编写自定义函数,创建标注
			function addMarker(point) {
				var marker = new BMap.Marker(point);
				map.addOverlay(marker);
				marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
			}
			// 随机向地图添加25个标注
			var bounds = map.getBounds();
			var sw = bounds.getSouthWest();
			var ne = bounds.getNorthEast();
			var lngSpan = Math.abs(sw.lng - ne.lng);
			var latSpan = Math.abs(ne.lat - sw.lat);

			addMarker(new BMap.Point(120.4943,27.985274));
			addMarker(new BMap.Point(120.76911,28.117383));
			addMarker(new BMap.Point(120.877194,28.038851));
			addMarker(new BMap.Point(120.977229,28.029669));
			addMarker(new BMap.Point(120.73059,28.137261));
			addMarker(new BMap.Point(120.753012,27.912264));
			addMarker(new BMap.Point(120.749563,28.166308));
			addMarker(new BMap.Point(120.540293,27.863222));
			addMarker(new BMap.Point(120.518447,28.133693));
			addMarker(new BMap.Point(120.76681,27.859134));
			addMarker(new BMap.Point(120.950783,28.109226));
		}
	}
}
</script>