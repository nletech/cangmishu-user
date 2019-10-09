import ElementUI from 'element-ui';
import Vue from 'vue';
import 'babel-polyfill';
import App from './App';
import router from './router';
import './lib/elementUi/index.css';
import store from './store/index';
import './filter';
import i18n from './lib/l18n/index';
import CancelButton from './components/cancel_button';
// eslint-disable-next-line
require("es6-promise").polyfill();

Vue.config.productionTip = false;
Vue.use(ElementUI);

Vue.component('cancel-button', CancelButton);

store.commit('token/getToken');
store.commit('config/getSideNavStatus');

// event bus

Vue.prototype.$EventBus = new Vue();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>',
});
