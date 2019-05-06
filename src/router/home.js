// 按需加载
const loadOnDemand = function loadOnDemand(file) {
  return () => import(/* webpackChunkName: "chunk" */ `@/page/${file}`);
};
// 布局
const LayoutTop = loadOnDemand('NavMenu/top');
const LayoutSide = loadOnDemand('NavMenu/side');
// 仓秘书

// 登陆
const Login = loadOnDemand('login/login');
const Register = loadOnDemand('login/register');
const BackPassword = loadOnDemand('login/back_password');

// 首页
const Home = loadOnDemand('initPage/home');

// 入库
const InboundList = loadOnDemand('inbound/inboundList/inboundList');// 入库单列表
const AddInbound = loadOnDemand('inbound/addInbound/addInbound');// 添加入库单

// 出库
const OutboundList = loadOnDemand('outbound/outboundList/outboundList');// 出库单列表
const AddOutbound = loadOnDemand('outbound/addOutbound/addOutbound');// 添加出库单

// 库存
const MyGoodsList = loadOnDemand('inventory/goodsManage/myGoodsList');// 货品管理
const StockTaking = loadOnDemand('inventory/stockTaking/stockTaking');// 库存盘点 (新模块)
const InventoryManage = loadOnDemand('inventory/inventoryManage/inventoryManage');// 库存管理
const InventoryAlarm = loadOnDemand('inventory/goodsAlarm/goodsAlarm');// 库存报警

// 报表
const InboundDetail = loadOnDemand('report/inboundDetail/inboundDetail');// 入库单明细
const OutboundDetail = loadOnDemand('report/outboundDetail/outboundDetail');// 出库单明细

// 设置
const StoreManagement = loadOnDemand('setting/storeManagement/storeManagement'); // 仓库管理
const AddressManagement = loadOnDemand('setting/addressManagement/addressManagement'); // 地址管理
const SupplierManagement = loadOnDemand('setting/supplierManagement/supplierManagement'); // 供应商管理

// 额外的
// 个人资料
export const routerMap = [
  {
    component: LayoutTop,
    redirect: 'initPage/home',
    path: '/',
    children: [
      {
        name: 'initPage',
        path: 'initPage',
        component: LayoutSide,
        redirect: 'initPage/home',
        icon: '&#xeb3b;',
        nav: 1,
        id: 'initPage',
        children: [
          {
            path: 'home',
            name: 'home',
            component: Home,
            nav: 2,
          },
        ],
      },
      {
        name: 'inbound', // 侧边栏 入库
        path: 'inbound',
        component: LayoutSide,
        icon: '&#xeb1b;',
        nav: 1,
        id: 'inbound',
        children: [
          {
            name: 'inboundList', // 入库单列表
            path: 'inboundList',
            component: InboundList,
            nav: 2,
          },
          {
            name: 'addInbound', // 添加入库单
            path: 'inbound/addInbound',
            component: AddInbound,
            nav: 2,
          },
        ],
      },
      {
        name: 'outbound', // 侧边栏 出库
        path: 'outbound',
        component: LayoutSide,
        icon: '&#xeb1c;',
        nav: 1,
        id: 'outbound',
        children: [
          {
            name: 'outboundList', // 出库单列表
            path: 'outboundList',
            component: OutboundList,
            nav: 2,
          },
          {
            name: 'addOutbound', // 添加出库单
            path: 'outboundList/addOutbound',
            component: AddOutbound,
            nav: 2,
          },
        ],
      },
      {
        name: 'inventory', // 侧边栏 库存
        path: 'inventory',
        component: LayoutSide,
        icon: '&#xeb25;',
        nav: 1,
        id: 'inventory',
        children: [
          {
            name: 'myGoodsList', // 货品管理
            path: 'myGoodsList',
            component: MyGoodsList,
            nav: 2,
          },
          {
            name: 'stockTaking', // 库存盘点
            path: 'stockTaking',
            component: StockTaking,
            nav: 2,
          },
          {
            name: 'inventoryManage', // 库存管理
            path: 'inventoryManage',
            component: InventoryManage,
            nav: 2,
          },
          {
            name: 'inventoryAlarm', // 库存报警
            path: 'inventoryAlarm',
            component: InventoryAlarm,
            nav: 2,
          },
        ],
      },
      {
        name: 'report', // 侧边栏 报表
        path: 'report',
        component: LayoutSide,
        icon: '&#xeb2e;',
        nav: 1,
        id: 'report',
        children: [
          {
            name: 'inboundDetail', // 入库单明细
            path: 'inboundDetail',
            component: InboundDetail,
            nav: 2,
          },
          {
            name: 'outboundDetail', // 出库单明细
            path: 'outboundDetail',
            component: OutboundDetail,
            nav: 2,
          },
        ],
      },
      {
        name: 'setting', // 侧边栏 设置
        path: 'setting',
        component: LayoutSide,
        icon: '&#xeb41;',
        nav: 1,
        id: 'setting',
        children: [
          {
            name: 'storeManage', // 仓库管理
            path: 'storeManage',
            component: StoreManagement,
            nav: 2,
          },
          {
            name: 'addressManagement', // 地址管理
            path: 'addressManagement',
            component: AddressManagement,
            nav: 2,
          },
          {
            name: 'supplierManagement', // 供应商管理
            path: 'supplierManagement',
            component: SupplierManagement,
            nav: 2,
          },
        ],
      },
    ],
  },
];
// addComponent(routerMap);
export const homeRoute = [
  {
    component: LayoutTop,
    redirect: 'initPage/home',
    path: '/',
    children: [],
  },
  {
    name: 'login',
    path: '/login',
    component: Login,
  },
  {
    name: 'register',
    path: '/register',
    component: Register,
  },
  {
    name: 'backPassword',
    path: '/backPassword',
    component: BackPassword,
  },
];

// addComponent(homeRoute);
