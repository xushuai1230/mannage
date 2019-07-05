/**
 * GooFlow-Vue - Web端流程设计器
 * @author foolegg126 (sdlddr)
 * @version v1.2.0
 * @license Commercially licensed to 永凯软件技术(上海)有限公司-913101157867305734(imclouds)
 **/
export default{hasClass:function(s,e){return 0!==(e=e||"").replace(/\s/g,"").length&&new RegExp(" "+e+" ").test(" "+s.className+" ")},addClass:function(s,e){this.hasClass(s,e)||(s.className=""===s.className?e:s.className+" "+e)},removeClass:function(s,e){if(this.hasClass(s,e)){let a=" "+s.className.replace(/[\t\r\n]/g,"")+" ";for(;a.indexOf(" "+e+" ")>=0;)a=a.replace(" "+e+" "," ");s.className=a.replace(/^\s+|\s+$/g,"")}},css:function(s,e){for(let a in e)s.style[a]=e[a]}};