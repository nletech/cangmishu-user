import $http from '@/api';

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
function addToken(keep, key, val) {
  if (keep) {
    localStorage.setItem(key, val);
  } else {
    sessionStorage.setItem(key, val);
  }
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
    // id: '',
    vip_info: null,
    user: {}, // 用户登录存的信息(默认仓库啥的)
  },
  mutations: {
    // 写入token
    getToken(state) {
      state.token = getData('TOKEN');
    },
    // 添加token
    addToken(state, data) {
      state.token = addToken(data.keep, 'TOKEN', tokenData(data.token));
    },
    // 删除token
    delToken(state) {
      state.token = '';
      removeToken('TOKEN');
    },
  },
  actions: {
    getVipInfo({ state }) {
      return new Promise(() => {
        if (!state.token) return;
        $http.account()
          .then((res) => {
            state.vip_info = res.data;
            console.log(res.data, 'actions的数据');
          })
          .catch(() => {
            console.log('actions was wrong!');
          });
      });
    },
  },
};

export default token;
