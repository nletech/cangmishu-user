import Vue from 'vue';
import Vuex from 'vuex';
import token from './token/token';
import routerData from './routerData';
import config from './config';

Vue.use(Vuex);

const Store = new Vuex.Store({
  modules: {
    token,
    routerData,
    config,
  },
});

export default Store;
