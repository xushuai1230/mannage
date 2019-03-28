<template>
  <div> 
    <common-dictionary  
    :serviceName="serviceName"
    :operationTableName="operationTableName" 
    :searchName="searchName" 
    :searchFields="searchFields">  
    </common-dictionary>
  </div>
</template>
<script>
import commonDictionary from '../../common/normal/dictionary.vue'
export default{
  components:{commonDictionary},
  data() {    
    return {
      serviceName       : Yukon.ServiceName.Tenant,
      operationTableName:'SysSiteInfo',
      searchName        :'站点信息',
      searchFields      :'Name',
    }
  }
}
</script>