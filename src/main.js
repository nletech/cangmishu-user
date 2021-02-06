import ElementUI from 'element-ui';
import Vue from 'vue';
import App from './App';
import router from './router';
import './lib/elementUi/index.css';
import store from './store/index';
import './filter';
import i18n from './lib/l18n/index';
import CancelButton from './components/cancel_button';
import moment from 'moment';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$moment = moment;
Vue.component('cancel-button', CancelButton);
store.commit('token/getToken');

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
});
