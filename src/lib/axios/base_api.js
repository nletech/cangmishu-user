const baseUrl = location.hostname;
let baseApi;

switch (baseUrl) {
  case 'dev.cangmishu.com':
    // 仓秘书开发服
    baseApi = {
      BASE_URL: 'https://dev-api.cangmishu.com/',
      BASE_STATE: 'https://dev.cangmishu.com/#/'
    };
    break;
  case 'my.cangmishu.com':
    // 仓秘书正式服
    baseApi = {
      BASE_URL: 'https://api.cangmishu.com/',
      BASE_STATE: 'https://my.cangmishu.com/#/'
    };
    break;
  case 'localhost':
    baseApi = {
      BASE_URL: 'https://dev-api.cangmishu.com/',
      BASE_STATE: 'http://localhost:8081/#/'
    };
    break;
  default:
    baseApi = {
      BASE_URL: 'https://dev-api.cangmishu.com/',
      BASE_STATE: 'https://dev.cangmishu.com/#/'
    };
    break;
}
export default baseApi;
