import store from '@/store';
import { routerMap } from './home';

const whiteList = ['login', 'register', 'backPassword'];

function addRouerMap(router, next, to) {
  store.commit('routerData/switchPermissionMapFilterStatus', true);
  store.commit('routerData/addRouterTable', routerMap);
  router.addRoutes(routerMap); // 添加模块路由
  next({ path: to.path, query: to.query });
}

export default function (router) {
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
      if (whiteList.includes(to.name)) {
        next();
      } else {
        next('/login');
      }
    }
  };
}
