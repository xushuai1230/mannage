<template>
  <div> 
    <common-list  
    :serviceName="serviceName"
    :operationTableName="operationTableName" 
    :defaultVal="defaultVal"
    :searchName="searchName" 
    :searchFields="searchFields">  
    </common-list >
  </div>
</template>
<script>
import commonList from '../../common/normal/dataAnalysisList.vue'
export default{
  components:{commonList},
  data() {  	
		return {
      serviceName       : Yukon.ServiceName.Tenant,
      operationTableName:'SysLog',
      searchName        :'用户名',
      searchFields      :'Name',
      defaultVal        :'SearchPage'
		}
	}
}
</script>