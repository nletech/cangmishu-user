export default {
  namespaced: true,
  state: {
    button_loading: false,
    setWarehouseName: '', // 设置仓库名
    setWarehouseId: '', // 仓库 id
    noneWarehouseId: false,
    warehouseList: '',
    avatar: '', // 用户头像URL
    nickName: '', // 用户名
    currentLanguage: '', // 当前语言
  },
  mutations: {
    setCurrentLanguage(state, data) {
      state.currentLanguage = data;
    },

    setUserInfo(state, data) {
      state.avatar = data.avatar; // 用户头像URL
      state.nickName = data.nickName; // 用户名
      localStorage.setItem('setUAvatar', data.avatar);
      localStorage.setItem('setUnickName', data.nickName);
    }, // 设置用户头像和用户名

    setWarehouseName(state, data) {
      state.setWarehouseName = data;
      localStorage.setItem('warehouseName', data);
    }, // 设置仓库

    setWarehouseId(state, data) {
      state.setWarehouseId = data;
      localStorage.setItem('warehouseId', data);
    }, // 设置选择的warehouseid

    ifHaveWarehouse(state, data) {
      state.noneWarehouseId = data;
    }, // 设置是否含有warehouseid

    warehouseLists(state, data) {
      state.warehouseList = data;
    }, // 储存仓库列表

    loading(state, data) {
      state.button_loading = data;
    }, // 按钮动画配置
  },
};
