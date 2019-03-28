<template>
  <div>
   	<iframe class="iframeClass" :src="url" ></iframe>
  </div>
</template>
<script>
	import {mapGetters} from 'vuex'
	import bus from '../../../assets/public/js/eventBus' 
	export default {
	props: ['targetName'],
	data() {
	    return {
            url:'', 
        } 
	},
	created(){
		let _this = this;
        //这里可放到全局，提供给子 iframe 调用
		window.iframeClose = (_this) => {
			this.vueFunc(_this) 
		}	
	},
    mounted () {  
        this.url = Yukon.StaticFileUrl.ProcessDesign;
    },
	methods: {
		vueFunc(){
          	bus.$emit('colseTabs',this.targetName);//关闭页面
		}
	}
}
</script>
