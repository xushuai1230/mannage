const getters = {
  token:state => state.user.token,
  mid:state => state.user.mid, 
  loginName:state => state.user.loginName, 
  currentHref:state => state.user.currentHref,
  list_z:state => state.list.WFlist,
  WFData:state => state.list.WFData
}
export default getters
