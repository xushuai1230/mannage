<template>
  <div> 
    <common-list  
    :serviceName        = "serviceName"
    :operationTableName = "operationTableName" 
    :searchName         = "searchName" 
    :searchFields       = "searchFields"
    :editPageLable      = "editPageLable"
    :editPageKey        = "editPageKey">
    </common-list>  
  </div>
</template>
<script>
import commonList from '../../../common/normal/list.vue'
export default{
  components:{commonList},
  data() {    
    return {
     serviceName       : Yukon.ServiceName.Tenant,
      operationTableName:'SysDictionaryCity',
      searchName        :'名称',
      searchFields      :'Name',
      editPageLable     :'市',
      editPageKey       :'CityEdit',
    }
  }
}
</script>