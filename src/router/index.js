import Vue from 'vue';
import Router from 'vue-router';
import { homeRoute } from './home';
import interception from './interception';

Vue.use(Router);
const routes = [].concat(homeRoute);

const route = new Router({
  routes,
  // eslint-disable-next-line
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }; // 路由跳转后初始到顶部
  },
});

route.beforeEach(interception(route));

export default route;
