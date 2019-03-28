<template>
  <div> 
    <common-edit 
    :serviceName       ="serviceName"
    :editId            ="editId" 
    :operationTableName="operationTableName" 
    :targetName        = "targetName">
    </common-edit>
  </div>
</template>
<script>
import commonEdit from '../../common/normal/edit.vue'
export default{
  props:['editId','targetName'],
  data() {  	
	  return {  
      serviceName       : Yukon.ServiceName.Message,
		  operationTableName:'EmailTemplate',
		}
	},
  components:{
    commonEdit
  }
}
</script>
