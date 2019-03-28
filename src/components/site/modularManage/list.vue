<template>
  <div> 
    <common-list  
    :serviceName        = "serviceName"
    :operationTableName = "operationTableName" 
    :searchName         = "searchName" 
    :searchFields       = "searchFields"
    :editPageLable      = "editPageLable"
    :editPageKey        = "editPageKey"/>  
  </div>
</template>
<script>
import commonList from '../../common/normal/list.vue'
export default{
  components:{commonList},
  data() {    
    return {
      serviceName        : Yukon.ServiceName.Tenant,
      operationTableName :'SysModular',
      searchName         :'名称',
      searchFields       :'Name',
      editPageLable      :'模块维护',
      editPageKey        :'ModularManageEdit',
    }
  }
}
</script>