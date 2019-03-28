<template>
  <div> 
    <common-list  
    :serviceName="serviceName"
    :operationTableName="operationTableName" 
    :searchName="searchName" 
    :searchFields="searchFields"
    :editPageLable="editPageLable"
    :editPageKey="editPageKey">  
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
      operationTableName:'CstUser',
      searchName        :'用户名',
      searchFields      :'Name',
      editPageLable     :'用户维护',
      editPageKey       :'CstUserEdit',
    }
  }
}
</script>