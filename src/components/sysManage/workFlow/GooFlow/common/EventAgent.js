/**
 * GooFlow-Vue - Web端流程设计器
 * @author foolegg126 (sdlddr)
 * @version v1.2.0
 * @license Commercially licensed to 永凯软件技术(上海)有限公司-913101157867305734(imclouds)
 **/
const hasDom=function(e,t){for(let n=0;n<t.length;++n)if(e==t[n])return!0;return!1},stopEventPop=function(e){e||(e=window.event),window.event?e.cancelBubble=!0:e.stopPropagation()},preventDefault=function(e){window.event?window.event.returnValue=!1:e.preventDefault()},EventAgent=function(e,t,n,o,r){"function"==typeof r&&e.addEventListener(t,function(t){t||(t=window.event);let u=e.querySelectorAll(n),a=t.target;for(;a!==e&&!hasDom(a,u);)a=a.parentNode;return a&&a!==e&&(t.data=o,!1===r(t,a)&&stopEventPop(t)),!1})};export default EventAgent;