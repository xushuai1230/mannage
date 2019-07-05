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
import commonList from '../../common/normal/list.vue'
export default{
  components:{commonList},
  data() {    
    return {
      serviceName       : Yukon.ServiceName.Workflow,
      operationTableName:'BusinessFlow',
      searchName        :'名称',
      searchFields      :'Name',
      editPageLable     :'工作流维护',
      editPageKey       :'BusinessFlowEdit',
    }
  }
}
</script>