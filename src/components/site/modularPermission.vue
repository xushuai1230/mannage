<template>
  <div> 
    <common-tree-list  
    :serviceName            = "serviceName"
    :operationTableName     = "operationTableName" 
    :operationTreeName      = "operationTreeName"
    :operationListName      = "operationListName"
    :powerGroupLeft         = "powerGroupLeft"
    :powerGroupRight        = "powerGroupRight"
    :operationTreeDefaultVal= "operationTreeDefaultVal" 
    :paramField             = "paramField"
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
      operationTableName     : 'SysPermission',
      operationTreeName      : 'Authorization',
      operationListName      : 'SysModular',
      powerGroupLeft         : '模块',
      powerGroupRight        : '详细信息',
      operationTreeDefaultVal: 'GetPermissionTree',
      paramField             : 'ModularId',
      /*
       注释：
       operationTableName     ： 点击左侧菜单接口参数/保存接口参数
       operationTreeName      ： 右侧树节点请求参数
       powerGroupLeft         ： 左侧权限组名提示文本
       powerGroupRight        : 右侧提示文本
       operationListName      : 左侧列表接口参数
       operationTreeDefaultVal:保存接口参数DefaultVal
       paramField             :点击左侧查询的filter中的字段/保存中的data中的字段
      */
    }
  }
}
</script>