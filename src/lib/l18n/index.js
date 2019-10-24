import Vue from 'vue';
import ElementUILocale from 'element-ui/lib/locale';
import VueI18n from 'vue-i18n';
import cn from './cn';
import en from './en';

Vue.use(VueI18n);

Vue.use(ElementUILocale);

const i18n = new VueI18n({
  locale: localStorage.getItem('lang') || 'cn',
  messages: {
    cn,
    en,
  },
});

ElementUILocale.i18n((key, value) => i18n.t(key, value));

export default i18n;
