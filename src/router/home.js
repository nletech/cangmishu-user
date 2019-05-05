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
const InboundList = loadOnDemand('goodsManage/inboundList'); // 入库单列表
const AddInbound = loadOnDemand('goodsManage/addInbound'); // 添加入库单
// 出库
const OutboundList = loadOnDemand('goodsManage/outboundList'); // 出库单列表
const AddOutbound = loadOnDemand('goodsManage/addOutbound'); // 添加出库单
// 库存
const MyGoodsList = loadOnDemand('goodsManage/myGoodsList'); // 货品管理
// 库存盘点 (新模块)
const InventoryManage = loadOnDemand('goodsManage/inventoryManage'); // 库存管理
const InventoryAlarm = loadOnDemand('goodsManage/goodsAlarm'); // 库存报警

// 报表
// 入库明细单
// 入库明细单

// 设置
// 个人资料
// const StoreManage = loadOnDemand('myStore/storeManage'); // 仓库管理
// 地址管理
// 供应商管理

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
        redirect: 'inbound/inboundList',
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
        redirect: 'outbound/outboundList',
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
        redirect: 'inventory/myGoodsList',
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
