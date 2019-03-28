<template>
  <div> 
    <commonList 
    :serviceName="serviceName"
    :operationTableName="operationTableName" 
    :searchName="searchName" 
    :searchFields="searchFields"
    :editPageLable="editPageLable"
    :editPageKey="editPageKey"
    /> 
  </div>
</template>
<script>
import commonList from '../../common/normal/list.vue'
export default{
  components:{commonList},
  data() {  	
		return {  
      serviceName       : Yukon.ServiceName.Message,
		  operationTableName:'EventMessage',
      searchName        :'名称',
      searchFields      :'Name',
      editPageLable     :'事件消息维护',
      editPageKey       :'EventMessageEdit',
		}
	},
 
}
</script>