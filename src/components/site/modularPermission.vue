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
      leftTableName          : 'SysModular',             // 左侧表Name
      rightTableName         : 'SysPermission',          // 右侧表Name
      rightGetName           : 'Authorization',          // 右侧查询数据Name
      rightGetDefaultVal     : 'GetPermissionTree',      // 右侧查询数据方法名
      paramField             : 'ModularId',              // 右侧表查询、保存时用
      property               : 'MenuId',                 // 右侧查询属性
    }
  }
}
</script>