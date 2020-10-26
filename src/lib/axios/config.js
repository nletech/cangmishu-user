import Axios from 'axios';
import qs from 'qs';
import nprogress from 'nprogress';
import { Message } from 'element-ui';
import store from '@/store';
import router from '@/router';
import baseApi from './base_api';

Axios.defaults.baseURL = baseApi; // 默认前缀连接
Axios.defaults.timeout = 60000; // 超时时间
Axios.defaults.transformRequest = [
  function form(params) {
    return qs.stringify(params);
  },
];

// 发送请求之前
function requestTime(config) {
  if (!config.isBtnLoading) {
    store.commit('config/loading', true);
  }
  config.headers.Authorization = store.state.token.token;
  config.headers.Language = localStorage.getItem('lang') || 'cn'; // 后端语言标识
  nprogress.start();
  return config;
}

// 请求错误
function requestError(error) {
  store.commit('config/loading', false);
  return Promise.reject(error);
}

// 请求拦截器
Axios.interceptors.request.use(requestTime, requestError);

// 响应成功
function responseSuccess(response) {
  store.commit('config/loading', false);
  nprogress.done();
  if (+response.data.status) {
    Message({
      message: response.data.msg,
      type: 'error',
      showClose: true,
    });
    return Promise.reject(response.data);
  }
  return response.data;
}

// 响应失败
function responseError(error) {
  nprogress.done();
  store.commit('config/loading', false);
  const ERRORSTATUS = error.response && error.response.status; // 捕获错误状态码
  switch (ERRORSTATUS) {
    case 401:
      store.commit('token/delToken');
      router.push({
        name: 'login',
      });
      break;
    case 403:
      Message({
        message: error.response.data.msg,
        type: 'error',
        showClose: true,
      });
      break;
    case 404:
      Message({
        message: error.response.data.msg,
        type: 'error',
        showClose: true,
      });
      break;
    case 422:
      Message({
        message: error.response.data.msg,
        type: 'error',
        showClose: true,
      });
      break;
    case 500:
      Message({
        message: '服务器出错，请稍后重试...',
        type: 'error',
        showClose: true,
      });
      break;
    default:
      break;
  }
  return Promise.reject(error);
}
// 响应拦截器
Axios.interceptors.response.use(responseSuccess, responseError);

export default Axios;
