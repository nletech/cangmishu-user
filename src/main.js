import ElementUI from 'element-ui';
import Vue from 'vue';
import VueI18n from 'vue-i18n';

import App from './App';
import router from './router';
import './lib/elementUi/index.css';
import store from './store/index';
import './filter';
import Messages from './lib/l18n/index';
import MyTableHeader from './components/my_table_header';
import MyTableItem from './components/my_table_header/my_table_item';
import CancelButton from './components/cancel_button';

Vue.config.productionTip = false;
Vue.use(ElementUI);

Vue.use(VueI18n);

Vue.component('my-table-header', MyTableHeader);
Vue.component('my-table-item', MyTableItem);
Vue.component('cancel-button', CancelButton);

const i18n = new VueI18n({
  locale: 'cn', // set locale
  messages: Messages, // set locale messages
});
store.commit('token/getToken');
store.commit('config/getSideNavStatus');
// store.dispatch('token/getVipInfo');
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value),
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>',
});
