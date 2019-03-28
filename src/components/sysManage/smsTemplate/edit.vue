<template>
  <div> 
    <common-edit 
     :serviceName       ="serviceName"
     :editId            ="editId"
     :operationTableName="operationTableName"
     :targetName        ="targetName"
     />
  </div>
</template>
<script>
import commonEdit from '../../common/normal/edit.vue'
export default{
  components:{commonEdit},
  props:['editId','targetName'],
  data() {  	
		return {  
      serviceName       : Yukon.ServiceName.Message,
		  operationTableName:'SmsTemplate',
		}
	},
  
}
</script>