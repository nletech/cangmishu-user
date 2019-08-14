const baseUrl = location.hostname;
let base;
switch (baseUrl) {
  case 'dev.cangmishu.com':
    base = 'https://dev-api.cangmishu.com/'; // 仓秘书开发服
    break;
  case 'demo.cangmishu.com':
    base = 'https://demo-api.cangmishu.com'; // 仓秘书正式服
    break;
  default:
    // base = 'https://demo-api.cangmishu.com/'; // 仓秘书正式服
    base = 'https://dev-api.cangmishu.com/'; // 仓秘书开发服
    // base = 'https://weapp.cangmishu.com/'; // 本地
    break;
}
const baseApi = base;
export default baseApi;
