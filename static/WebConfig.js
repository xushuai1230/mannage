if (typeof Yukon == 'undefined') {
  Yukon = {};
}
/* 
  服务器config.json
  Bus: "http://116.62.162.194:6200/message"
  ApsPost:"https://api.imclouds.com.cn/"
*/
Yukon.Url = {
  Title:'',
  Bus: '',
  Home:'',
  Login:'',
  Signalr: '',
  Tenant_Import:'',
  Tenant_Export:'',  
  Config:'/static/config.json',
  /*发布使用*/
  /*Config:'/manage/static/config.json' */
};
Yukon.ServiceName={
  Tenant:'Tenant',
  JobBooking:'JobBooking',
  Workflow:'Workflow',
  WMS:'WMS',
  APS:'APS',
  Sale:'Sale',
  Message:'Message',
  Agent:'Agent',
  Log:'Log',
  ServiceLoadField:'ServiceLoadField' 
};
Yukon.Operation = {
  Search: "Search",         // 查询       操作
  SearchAll: "SearchAll",   // 查询所有
  SearchPage: "SearchPage", // 分页查询
  New: "New",               // 新建
  Copy: "Copy",             // 复制
  Edit: "Edit",             // 编辑
  Modify: "Modify",         // 更改
  NewSave: "NewSave",       // 新建保存
  EditSave: "EditSave",     // 修改保存
  ModifySave: "ModifySave", // 更改保存
  Save: "Save",             // 保存
  Submit: "Submit",         // 提交
  Undo: "Undo",             // 撤销
  Confirm: "Confirm",       // 确认
  Cancel: "Cancel",         // 取消
  Delete: "Delete",         // 删除
  Start: "Start",           // 启用
  Stop: "Stop"              // 停用
};
Yukon.Route = {
  Login: "login",         
  Index: "index",
  Lock:  "lock"    
};