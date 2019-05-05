const baseUrl = location.hostname;
let base;
switch (baseUrl) {
  case 'testv2-business-wms.eutechne.nl':
    base = 'https://testv2-nl-wms-api.eutechne.nl/';
    break;
  case 'dev-business-wms-v2.nle-tech.com':
    base = 'https://dev-api.cangmishu.com/'; // 仓秘书
    break;
  case 'mywms.eutechne.com':
    base = 'https://nl-v2-wms-api.eutechne.com/';
    break;
  default:
    base = 'https://dev-api.cangmishu.com/'; // 仓秘书
    // base = 'http://192.168.0.79:10007';
    // base = 'https://nl-v2-wms-api.eutechne.com/';
    // base = 'https://dev-wms-api-v2.nle-tech.com/';
    // base = 'http://192.168.0.199:19977';
    // base = 'https://testv2-nl-wms-api.eutechne.nl/';
    // base = 'http://192.168.0.199:10016/';
    // base = 'http://192.168.0.79:10000/';
    // base = 'http://192.168.0.199:10005/';
    break;
}
const baseApi = base;
export default baseApi;
