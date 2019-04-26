const routerData = {
  namespaced: true,
  state: {
    isPermissionFilter: false,
    routerMap: [],
  },
  mutations: {
    // 添加路由成功
    switchPermissionMapFilterStatus(state, data) {
      state.isPermissionFilter = data;
    },
    // 添加路由表
    addRouterTable(state, data) {
      state.routerMap = data;
    },
  },
};

export default routerData;
