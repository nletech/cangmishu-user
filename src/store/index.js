import Vue from 'vue';
import Vuex from 'vuex';
import token from './token/token';
import routerData from './routerData';
import config from './config';
import tagsView from './tagsView';

Vue.use(Vuex);

const Store = new Vuex.Store({
  modules: {
    token,
    routerData,
    config,
    tagsView
  }
});

export default Store;
