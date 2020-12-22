// import $http from '@/api';
import store from '@/store';
import { routerMap } from './home';

const whiteList = ['login', 'bindAccount', 'register', 'backPassword'];

function addRouerMap(router, next, to) {
  store.commit('routerData/switchPermissionMapFilterStatus', true);
  store.commit('routerData/addRouterTable', routerMap);
  router.addRoutes(routerMap); // 添加模块路由
  next({ path: to.path, query: to.query });
}

export default function(router) {
  return (to, from, next) => {
    if (store.state.token.token) {
      if (to.name === 'login') {
        next('/');
      } else if (!store.state.routerData.isPermissionFilter) {
        addRouerMap(router, next, to); // 添加登录的路由
      } else {
        next();
      }
    } else if (!store.state.token.token) {
      if (to.path === '/initPage/home' && to.query.token) {
        store.commit('token/addToken', to.query.token);
        // $http.getUserInfo().then(data => {
        //   store.commit('config/setWarehouseName', data.data.user.default_warehouse.name_cn);
        //   store.commit('config/setWarehouseId', data.data.user.default_warehouse.id);
        //   store.commit('config/updateUserInfo', data.data.user);
        //   // localStorage.setItem('setUser', data.data.user.id); // 存入用户 id
        //   // localStorage.setItem('setUModules', JSON.stringify(data.data.modules)); // 存入用户 昵称
        //   // localStorage.setItem('setUType', data.data.user.boss_id); // 存入员工标识 不为 0 则是员工类型
        // });
        next({ path: to.path, query: {} });
      } else if (whiteList.includes(to.name)) {
        next();
      } else {
        next('/login');
      }
    }
  };
}
