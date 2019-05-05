import Vue from 'vue';

Vue.filter('switchTypeCn', (val) => {
  let name = '';
  switch (+val) {
    case 1:
      name = '是';
      break;
    case 0:
      name = '否';
      break;
    default:
      name = '是';
      break;
  }
  return name;
});

Vue.filter('storeType', (val) => {
  let name = '';
  switch (+val) {
    case 2:
      name = '自用仓库';
      break;
    case 1:
      name = '公用仓库';
      break;
    default:
      name = '自用仓库';
      break;
  }
  return name;
});
Vue.filter('temperatureType', (val) => {
  let name = '';
  switch (+val) {
    case 1:
      name = '常温';
      break;
    case 2:
      name = '冷藏';
      break;
    case 3:
      name = '冷冻';
      break;
    case 4:
      name = '不限';
      break;
    default:
      name = '不限';
      break;
  }
  return name;
});
Vue.filter('statusType', (val) => {
  let name = '';
  switch (+val) {
    case 1:
      name = '待审核';
      break;
    case 2:
      name = '已通过';
      break;
    case 3:
      name = '未通过';
      break;
    default:
      name = '全部';
      break;
  }
  return name;
});
Vue.filter('num_is_no', (val) => {
  if (!val) {
    return 0;
  }
  return val;
});
