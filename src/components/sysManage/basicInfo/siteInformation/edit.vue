<template>
  <div> 
    <common-edit 
    :serviceName        ="serviceName"
    :operationTableName = "operationTableName" 
    :editId             = "editId"
    :targetName         = "targetName">
    </common-edit>
  </div>
</template>
<script>
import commonEdit from '../../../common/normal/edit.vue'
export default{
  props:['editId','targetName'],
  components:{commonEdit},
  data() {    
    return {  
      serviceName       : Yukon.ServiceName.Tenant,
      operationTableName:'SysSiteInfo',
    }
  },
}
</script>