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
      serviceName       : Yukon.ServiceName.Message,
      operationTableName:'EmailSetting',
      searchName        :'名称',
      searchFields      :'Name',
      editPageLable     :'邮箱维护',
      editPageKey       :'EmailSettingEdit',
    }
  }
}
</script>