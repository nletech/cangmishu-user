import Vue from 'vue';
import Router from 'vue-router';
import { homeRoute } from './home';
import interception from './interception';

Vue.use(Router);
const routes = [].concat(homeRoute).concat([]);

const route = new Router({
  routes,
});

route.beforeEach(interception(route));

export default route;
