const baseUrl = location.hostname;
// eslint-disable-next-line
let baseApi;

switch (baseUrl) {
  case 'dev.cangmishu.com':
    baseApi = 'https://dev-api.cangmishu.com/'; // 仓秘书开发服
    break;
  case 'my.cangmishu.com': // 仓秘书正式服
    baseApi = 'https://api.cangmishu.com/';
    break;
  default:
    baseApi = 'https://api.cangmishu.com/'; // 仓秘书正式服
    // baseApi = 'https://dev-api.cangmishu.com/'; // 仓秘书开发服
    // baseApi = 'https://weapp.cangmishu.com/'; // 本地
    break;
}
export default baseApi;
