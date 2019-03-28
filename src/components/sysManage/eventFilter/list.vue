<template>
  <div> 
    <common-list 
    :serviceName="serviceName"
    :operationTableName="operationTableName" 
    :searchName="searchName" 
    :searchFields="searchFields"
    :editPageLable="editPageLable"
    :editPageKey="editPageKey"/> 
  </div>
</template>
<script>
import commonList from '../../common/normal/list.vue'
export default{
  components:{commonList},
  data() {  	
		return {  
      serviceName       : Yukon.ServiceName.Workflow,
		  operationTableName:'EventFilter',
      searchName        :'名称',
      searchFields      :'Name',
      editPageLable     :'事件设置维护',
      editPageKey       :'EventFilterEdit',
		}
	},
 
}
</script>