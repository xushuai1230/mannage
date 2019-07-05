<template>
  <div> 
    <common-list  
    :serviceName        = "serviceName"
    :operationTableName = "operationTableName" 
    :toolBarName        = "toolBarName" 
    :searchName         = "searchName" 
    :searchFields       = "searchFields">  
    </common-list >
  </div>
</template>
<script>
import commonList from '../common/normal/list.vue'
export default{
  components:{commonList},
  data() {    
    return {
      serviceName       : Yukon.ServiceName.Tenant,
      operationTableName:'CstInformation',
      toolBarName       :'CstInformationAdvanced',
      searchName        :'名称',
      searchFields      :'Name',
    }
  }
}
</script>s