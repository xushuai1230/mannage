/**
 * GooFlow-Vue - Web端流程设计器
 * @author foolegg126 (sdlddr)
 * @version v1.2.0
 * @license Commercially licensed to 永凯软件技术(上海)有限公司-913101157867305734(imclouds)
 **/
export default function(){CanvasRenderingContext2D.prototype.roundRect=function(t,e,i,o,r){return i<2*r&&(r=i/2),o<2*r&&(r=o/2),this.beginPath(),this.moveTo(t+r,e),this.arcTo(t+i,e,t+i,e+o,r),this.arcTo(t+i,e+o,t,e+o,r),this.arcTo(t,e+o,t,e,r),this.arcTo(t,e,t+i,e,r),this.closePath(),this},CanvasRenderingContext2D.prototype.BezierEllipse=function(t,e,i,o){let r=.5522848,s=i*r,h=o*r;return this.beginPath(),this.moveTo(t-i,e),this.bezierCurveTo(t-i,e-h,t-s,e-o,t,e-o),this.bezierCurveTo(t+s,e-o,t+i,e-h,t+i,e),this.bezierCurveTo(t+i,e+h,t+s,e+o,t,e+o),this.bezierCurveTo(t-s,e+o,t-i,e+h,t-i,e),this.closePath(),this}}