// import $http from '@/api';
import router from '@/router';
// 返回处理过的token数据
function tokenData(value) {
  return `Bearer ${value}`;
}

// 将本地数据移除
function removeToken(key) {
  localStorage.setItem(key, '');
  sessionStorage.setItem(key, '');
}

// 将数据添加到本地
function addToken(key, val) {
  localStorage.setItem(key, val);
  return val;
}

// 获取到本地数据
function getData(kye) {
  return localStorage.getItem(kye) || sessionStorage.getItem(kye) || '';
}
// 状态对象
const token = {
  namespaced: true,
  state: {
    token: '',
    vip_info: null
  },
  mutations: {
    // TOKEN 相关
    getToken(state) {
      if (router.currentRoute.path === '/initPage/home' && router.currentRoute.query.token) {
        state.token = router.currentRoute.query.token;
        addToken('TOKEN', tokenData(router.currentRoute.query.token));
      } else {
        state.token = getData('TOKEN');
      }
    }, // 写入token
    addToken(state, data) {
      state.token = addToken('TOKEN', tokenData(data));
    }, // 添加token
    delToken(state) {
      state.token = '';
      removeToken('TOKEN');
    } // 删除token
  }
};

export default token;
