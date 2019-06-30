export default {
  namespaced: true,
  state: {
    button_loading: false,
    shutdown_status: false,
    setWarehouseName: '', // 设置仓库名
    setWarehouseId: '', // 仓库 id
    noneWarehouseId: false,
    warehouseList: '',
    avatar: '', // 用户头像URL
    nickName: '', // 用户名
  },
  mutations: {
    // 设置用户头像和用户名
    setUserInfo(state, data) {
      state.avatar = data.avatar; // 用户头像URL
      state.nickName = data.nickName; // 用户名
      localStorage.setItem('setUAvatar', data.avatar);
      localStorage.setItem('setUnickName', data.nickName);
    },
    // 设置仓库
    setWarehouseName(state, data) {
      state.setWarehouseName = data;
      localStorage.setItem('warehouseName', data);
    },
    // 设置选择的warehouseid
    setWarehouseId(state, data) {
      state.setWarehouseId = data;
      localStorage.setItem('warehouseId', data);
    },
    // 仓秘书
    // 设置是否含有warehouseid
    ifHaveWarehouse(state, data) {
      state.noneWarehouseId = data;
    },
    // 储存仓库列表
    warehouseLists(state, data) {
      state.warehouseList = data;
    },
    // 按钮动画配置
    loading(state, data) {
      state.button_loading = data;
    },
    // 关闭侧边栏
    closeSideNav(state, data) {
      state.shutdown_status = data;
      localStorage.setItem('sideNavStatus', +data);
    },
    // 读取侧边栏状态
    getSideNavStatus(state) {
      state.shutdown_status = localStorage.getItem('sideNavStatus') || false;
    },
  },
};
