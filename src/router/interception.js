import store from '@/store';
import { Message } from 'element-ui';
import { routerMap } from './home';

const whiteList = ['login', 'register', 'backPassword'];
const VisitWhiteList = ['login', 'register', 'backPassword', 'home', 'editPassword'];
const ownerList = ['myStore'];
const ownerLists = ['StoreLease'];
const businessCenter = ['commodityManage'];

function addRouerMap(router, next, to) {
  store.commit('routerData/switchPermissionMapFilterStatus', true);
  store.commit('routerData/addRouterTable', routerMap);
  router.addRoutes(routerMap);
  next({ path: to.path, query: to.query });
}

export default function (router) {
  return (to, from, next) => {
    if (store.state.token.token) {
      if (to.name === 'login') {
        next('/');
      } else if (!store.state.routerData.isPermissionFilter) {
        addRouerMap(router, next, to);
      } else if (store.state.token.vip_info) { // 当vip信息不为空的时候执行
        // 如果用户账户处于未激活状态下提示
        if (!store.state.token.vip_info.is_activated && !VisitWhiteList.includes(to.name)) {
          Message({
            type: 'error',
            showClose: true,
            message: '您的账号未激活，没有权限访问此模块',
          });
          next(false);
          store.dispatch('token/getVipInfo'); // 刷新vipinfo接口
        } else if (+store.state.token.vip_info.certification_owner_status !== 2
          && ownerList.includes(to.path.split('/')[1])) { // 如果客户没有认证过仓库时进入提示
          Message({
            type: 'error',
            showClose: true,
            message: +store.state.token.vip_info.certification_owner_status
              ? '您的仓库认证正在审核中，没有权限访问此模块'
              : '您没有创建仓库权限，请您前往个人中心申请认证',
          });
          next(false);
          store.dispatch('token/getVipInfo');
        } else if (+store.state.token.vip_info.certification_renter_status !== 2
          && ownerLists.includes(to.path.split('/')[1])) { // 如果客户没有认证过仓库认证的情况下提示
          Message({
            type: 'error',
            showClose: true,
            message: +store.state.token.vip_info.certification_renter_status
              ? '您的租赁仓库认证正在审核中，没有权限访问此模块'
              : '您没有租赁仓库权限，请您前往个人中心申请认证',
          });
          next(false);
          store.dispatch('token/getVipInfo');
        } else if (store.state.config.noneWarehouseId
          && businessCenter.includes(to.path.split('/')[1])) { // 如果客户没有仓库数的情况下提示
          Message({
            type: 'error',
            showClose: true,
            message: '您暂无仓库，请先创建或租赁仓库',
          });
          next(false);
          store.dispatch('token/getVipInfo');
        } else {
          next();
        }
      } else {
        next();
      }
    } else if (!store.state.token.token) {
      if (whiteList.includes(to.name)) {
        next();
      } else {
        next('/login');
        // Message({
        //   type: 'error',
        //   message: '请重新登录',
        // });
      }
    }
  };
}
