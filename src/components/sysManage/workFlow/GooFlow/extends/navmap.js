/**
 * GooFlow-Vue - Web端流程设计器
 * @author foolegg126 (sdlddr)
 * @version v1.2.0
 * @license Commercially licensed to 永凯软件技术(上海)有限公司-913101157867305734(imclouds)
 **/
import canvasExtend from"../common/canvasExtend";import Calc from"../common/Calc";import Class from"../common/Class";let Cmder2={canvasExtend:function(){canvasExtend()},_toNum:function(e){return null!==e&&""!==e?parseInt(e.split("px")[0],10):void 0},_analyseArea:function(e){let t=e.querySelector(".bg"),o=Calc.getRealStyle(t);return{top:this._toNum(e.style.top),left:this._toNum(e.style.left),width:e.offsetWidth,height:e.offsetHeight,borderColor:o.borderTopColor,bgColor:o.backgroundColor,opacity:parseFloat(o.opacity)}},renderAreas:function(e,t,o){for(let l in t){let r=t[l];e.save(),r.bgColor=r.bgColor.replace("rgb","rgba").replace(")",", "+r.opacity+")"),r.borderColor=r.borderColor.replace("rgb","rgba").replace(")",", "+r.opacity+")"),e.fillStyle=r.bgColor,e.strokeStyle=r.borderColor,e.beginPath(),e.rect(r.left*o,r.top*o,r.width*o,r.height*o),e.fill(),e.stroke(),e.closePath(),e.restore()}},_analyseMemo:function(e,t){let o=Calc.getRealStyle(e);return{top:this._toNum(e.style.top)*t,left:this._toNum(e.style.left)*t,width:e.offsetWidth*t,height:e.offsetHeight*t,bgColor:o.color}},renderMemos:function(e,t){for(let o in t){let l=t[o];e.save(),e.fillStyle=l.bgColor,e.beginPath(),e.moveTo(l.left+5,l.top),e.lineTo(l.left+l.width,l.top),e.lineTo(l.left+l.width,l.top+l.height),e.lineTo(l.left,l.top+l.height),e.lineTo(l.left,l.top+5),e.lineTo(l.left+5,l.top),e.closePath(),e.fill(),e.restore(),e.save(),e.fillStyle="rgba(0,0,0,0.1)",e.beginPath(),e.moveTo(l.left+5,l.top),e.lineTo(l.left+5,l.top+5),e.lineTo(l.left,l.top+5),e.lineTo(l.left+5,l.top),e.closePath(),e.fill(),e.restore()}},_analyseNode:function(e,t){let o="";Class.hasClass(e,"item_ellipse")&&(o="ellipse"),Class.hasClass(e,"item_rhomb")&&(o="rhomb"),Class.hasClass(e,"item_round")&&(o="round"),Class.hasClass(e,"item_parallelogram")&&(o="parallelogram"),Class.hasClass(e,"item_custom")&&(o="custom");let l=Calc.getRealStyle(e),r={top:this._toNum(e.style.top)*t,left:this._toNum(e.style.left)*t,width:e.offsetWidth*t,height:e.offsetHeight*t,borderColor:l.borderTopColor,borderWidth:this._toNum(l.borderTopWidth)*t,bgColor:l.backgroundColor,borderRadius:this._toNum(l.borderTopLeftRadius),spClass:o};return"custom"===o&&(r.borderColor="#999999"),r},renderNodes:function(e,t){e.save();for(let o in t){let l=t[o];e.fillStyle=l.bgColor,"ellipse"===l.spClass?e.BezierEllipse(l.left+l.width/2,l.top+l.height/2,l.width/2,l.height/2).fill():"rhomb"===l.spClass?(e.save(),e.translate(l.left+l.width/2,l.top+l.height/2),e.rotate(45*Math.PI/180),e.roundRect(-l.width/2,-l.height/2,l.width-l.borderWidth,l.height-l.borderWidth,l.borderRadius).fill(),e.restore()):"parallelogram"===l.spClass?(e.save(),e.translate(l.left+l.width/2,l.top+l.height/2),e.transform(1,0,-12/l.height,1,0,0),e.roundRect(-l.width/2,-l.height/2,l.width-l.borderWidth,l.height-l.borderWidth,l.borderRadius).fill(),e.restore()):"custom"===l.spClass?(e.save(),e.strokeStyle=l.borderColor,e.lineCap="round",e.roundRect(l.left,l.top,l.width,l.height,l.borderRadius).stroke(),e.beginPath(),e.moveTo(l.left+2,l.top+2),e.lineTo(l.left+l.width-2,l.top+l.height-2),e.moveTo(l.left+2,l.top+l.height-2),e.lineTo(l.left+l.width-2,l.top+2),e.closePath(),e.stroke(),e.restore()):e.roundRect(l.left,l.top,l.width,l.height,l.borderRadius).fill(),"custom"!==l.spClass&&(e.strokeStyle=l.borderColor,e.lineWidth=0!==l.borderWidth?l.borderWidth:.1,e.stroke())}e.restore()},_analyseLine:function(e,t){let o=e.querySelector("path[stroke-linecap]"),l=o.getAttribute("marker-end"),r={color:o.getAttribute("stroke"),lineWidth:o.getAttribute("stroke-width")*t,lineCap:"round",noArrow:!l||null==l},a=o.style.strokeDasharray;r.lineDash=a&&null!=a;let s=o.getAttribute("d"),i=s.substring(2,s.length).split(/[L|Q]/),n=[];for(let e=0;e<i.length;++e){i[e]=i[e].replace(/^\s+|\s+$/gm,"");let o=i[e].split(" ");2===o.length?n.push({x:parseFloat(o[0])*t,y:parseFloat(o[1])*t}):n.push({x:parseFloat(o[0])*t,y:parseFloat(o[1])*t,dX:parseFloat(o[2])*t,dY:parseFloat(o[3])*t})}r.points=n;let h=n.length,d=n[h-1].x-n[h-2].x,p=n[h-1].y-n[h-2].y;return r.angle=Math.atan2(p,d),r},renderLines:function(e,t){for(let o in t){let l=t[o];e.save(),e.setLineDash(l.lineDash?[2,3]:[]),e.strokeStyle=l.color,e.lineWidth=l.lineWidth,e.lineCap=l.lineCap;let r=l.points;e.beginPath(),e.moveTo(r[0].x,r[0].y);for(let t=1;t<r.length;++t)if(r[t].dX){let o=r[t].y===r[t].dY?Math.abs(r[t].x-r[t].dX):Math.abs(r[t].y-r[t].dY);e.arcTo(r[t].x,r[t].y,r[t].dX,r[t].dY,o),e.moveTo(r[t].dX,r[t].dY)}else e.lineTo(r[t].x,r[t].y),t!==r.length-1&&e.moveTo(r[t].x,r[t].y);e.closePath(),e.stroke(),l.noArrow||(e.translate(r[r.length-1].x,r[r.length-1].y),e.rotate(l.angle),e.fillStyle=l.color,e.beginPath(),e.moveTo(1*l.lineWidth,0),e.lineTo(-6*l.lineWidth,-3*l.lineWidth),e.lineTo(-6*l.lineWidth,3*l.lineWidth),e.lineTo(1*l.lineWidth,0),e.closePath(),e.fill()),e.restore()}},_clearMap:function(e){e.getContext("2d").clearRect(0,0,parseInt(e.getAttribute("width")),parseInt(e.getAttribute("height")));let t=e.nextSibling;t&&null!=t&&"viewbox"===t.className&&(t.style.top=0,t.style.left=0,t.style.width="100%",t.style.height="100%")}};export default{flag:"navmap",initFuncName:"canvasExtend",methods:{canvasExtend(){Cmder2.canvasExtend()},_locateViewBox(e){let t=this.prop.$navMap.querySelector(".viewbox"),o=this.$refs.$workArea.parentNode,l=o.scrollLeft*e,r=o.scrollTop*e;t.style.left=l+"px",t.style.top=r+"px",t.style.width=o.clientWidth*e+"px",t.style.height=o.clientHeight*e+"px"},refreshMap(){let e=this.prop.$navMap.querySelector("canvas"),t=e.getContext("2d");Cmder2._clearMap(e);let o=this._buildWorkSize();if(!o.haveData)return;let l=e.width/o.width>e.height/o.height?e.height/o.height:e.width/o.width;this.prop.$navMap.dataset.scale=""+l;let r={},a=this.$refs.$group.querySelectorAll(".GooFlow_area");for(let e=0;e<a.length;++e)r[a[e].id]=Cmder2._analyseArea(a[e]);Cmder2.renderAreas(t,r,l);let s={},i=this.$refs.$paper.querySelectorAll(".GooFlow_memo");for(let e=0;e<i.length;++e)s[i[e].id]=Cmder2._analyseMemo(i[e],l);Cmder2.renderMemos(t,s);let n={},h=this.$refs.$workArea.querySelectorAll(".GooFlow_item");for(let e=0;e<h.length;++e)n[h[e].id]=Cmder2._analyseNode(h[e],l);Cmder2.renderNodes(t,n);let d={},p=this.$refs.$draw.querySelectorAll("g");for(let e=0;e<p.length;++e)"GooFlow_tmp_line"!==p[e].getAttribute("tid")&&(d[p[e].id]=Cmder2._analyseLine(p[e],l));Cmder2.renderLines(t,d),this._locateViewBox(l)},_initNavMap(e){if(!e||null==e||""===e)return;if(this.prop.$navMap=document.querySelector(e),!this.prop.$navMap||null==this.prop.$navMap)return void delete this.prop.$navMap;let t=this.prop.$navMap.clientWidth,o=this.prop.$navMap.clientHeight;this.prop.$navMap.className="GooFlow_nav_map",this.prop.$navMap.style.width=t+"px",this.prop.$navMap.style.height=o+"px",this.prop.$navMap.setAttribute("unselectable","on"),this.prop.$navMap.setAttribute("onselectstart","return false"),this.prop.$navMap.setAttribute("onselect","document.selection.empty()");let l=document.createElement("canvas");l.className="map",l.width=t,l.height=o,this.prop.$navMap.appendChild(l),(window.ActiveXObject||"ActiveXObject"in window||navigator.userAgent.indexOf("Edge")>-1)&&(l=window.G_vmlCanvasManager.initElement(l));let r=document.createElement("div");r.className="viewbox",this.prop.$navMap.appendChild(r);let a=this;this.$refs.$workArea.parentNode.addEventListener("scroll",function(e){a._locateViewBox(parseFloat(a.prop.$navMap.dataset.scale))}),this.prop.$navMap.querySelector(".viewbox").addEventListener("mousedown",function(e){this.parentNode.dataset.isDown="1";let t=Calc.mouseP(e),o=a.$refs.$workArea.parentNode,l=t.x,r=t.y,s=o.scrollLeft,i=o.scrollTop,n=parseFloat(this.parentNode.dataset.scale);document.onmousemove=function(e){if("1"!==a.prop.$navMap.dataset.isDown)return;e||(e=window.event);let t=Calc.mouseP(e);if(l===t.x&&r===t.y)return!1;o.scrollLeft=s+(t.x-l)/n,o.scrollTop=i+(t.y-r)/n},document.onmouseup=function(){document.onmousemove=null,document.onmouseup=null,a.prop.$navMap.dataset.isDown=void 0}})}}};