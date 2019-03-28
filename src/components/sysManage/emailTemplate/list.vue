<template>
  <div> 
    <common-list 
    :serviceName="serviceName"
    :operationTableName="operationTableName" 
    :searchName="searchName" 
    :searchFields="searchFields"
    :editPageLable="editPageLable"
    :editPageKey="editPageKey">
    </common-list>
  </div>
</template>
<script>
import commonList from '../../common/normal/list.vue'
export default{
  data() {  	
		return {  
      serviceName       : Yukon.ServiceName.Message,
		  operationTableName:'EmailTemplate',
      searchName        :'名称',
      searchFields      :'Name',
      editPageLable     :'邮件模板维护',
      editPageKey       :'EmailTemplateEdit',
		}
	},
  components:{
    commonList
  }
}
</script>

