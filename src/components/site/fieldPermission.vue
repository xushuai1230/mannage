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
      leftTableName          : 'CstRole',                // 左侧表Name
      rightTableName         : 'FieldPermission',        // 右侧表Name
      rightGetName           : 'Authorization',          // 右侧查询数据Name
      rightGetDefaultVal     : 'GetFieldPermissionTree', // 右侧查询数据方法名
      paramField             : 'RoleId',                 // 右侧表查询、保存时用
      property               : 'DefaultId',              // 右侧查询属性
    }
  }
}
</script>