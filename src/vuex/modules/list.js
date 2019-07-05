const list = {
  state: {
    WFlist: {},          //工作流列表点击信息
    WFData: []
  },
  mutations: {
    LISTCHECK(state, val) {
      state.WFlist = val
    },
    WFDATD(state, val) {
      state.WFData = val
    }
  },
  actions: {
    listcheck({ commit }, val) {
      commit("LISTCHECK", val)
    },
    wfdata({ commit }, val) {
      commit("WFDATD", val)
    }
  }
}

export default list
