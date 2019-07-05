<template>
  <div> 
    <common-tree-list  
    :serviceName            = "serviceName"
    :leftTableName          = "leftTableName"
    :rightTableName         = "rightTableName" 
    :rightGetName           = "rightGetName"
    :rightGetDefaultVal     = "rightGetDefaultVal" 
    :paramField             = "paramField"
    :property               = "property"
    />  
  </div>
</template>
<script>
import commonTreeList from '../common/normal/authorization.vue'
export default{
  components:{commonTreeList},
  data() {    
    return {
      serviceName            : Yukon.ServiceName.Tenant,
      leftTableName          : 'SysScheduleRule',           // 左侧表Name
      rightTableName         : 'SysScheduleRulePermission', // 右侧表Name
      rightGetName           : 'SysScheduleParam',          // 右侧查询数据Name
      rightGetDefaultVal     : 'GetScheduleParamTree',      // 右侧查询数据方法名
      paramField             : 'ScheduleRuleId',            // 右侧表查询、保存时用
      property               : 'ScheduleParamId',           // 右侧查询属性
    }
  }
}
</script>