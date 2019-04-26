// import addComponent from './addComponent';

// const navTop = require('@/page/NavMenu/top.vue');
// const navSide = require('@/page/NavMenu/side');
// const addAddressees = require('@/page/AddressManage/addAddressee');

// const LayoutTop = r => require.ensure([], () => r(navTop), 'LayoutTop');
// const LayoutSide = r => require.ensure([], () => r(navSide), 'LayoutSide');
// const addAddressee = r => require.ensure([], () => r(addAddressees), 'LayoutSide');

// 按需加载
const loadOnDemand = function loadOnDemand(file) {
  return () => import(/* webpackChunkName: "chunk" */ `@/page/${file}`);
};

const LayoutTop = loadOnDemand('NavMenu/top');
const LayoutSide = loadOnDemand('NavMenu/side');
// 登陆
const Login = loadOnDemand('login/login');
const Register = loadOnDemand('login/register');
const BackPassword = loadOnDemand('login/back_password');
// 首页
const Home = loadOnDemand('initPage/home'); // 首页
// 个人中心
const MyAuthentication = loadOnDemand('userCenter/my_authentication'); // 我的认证
const EditPassword = loadOnDemand('userCenter/edit_password'); // 修改密码
const AuthenticationForm = loadOnDemand('userCenter/add_authentication'); // 添加认证
const AddApply = loadOnDemand('userCenter/add_apply'); // 添加租赁仓库认证

const StoreManage = loadOnDemand('myStore/storeManage'); // 仓库管理
const AddStoreManage = loadOnDemand('myStore/addStoreManage'); // 添加仓库
const BasicsConfig = loadOnDemand('myStore/BasicsConfig'); // 基础配置
const AddCargoArea = loadOnDemand('myStore/addCargoArea'); // 添加货架
const AddCargoProperty = loadOnDemand('myStore/addCargoProperty'); // 添加货区
const AddCargoShelf = loadOnDemand('myStore/addCargoShelf'); // 添加货区
const AddBatchType = loadOnDemand('myStore/addBatchType'); // 添加入库单
const AddOrderType = loadOnDemand('myStore/addOrderType'); // 添加出库单
const AddCategory = loadOnDemand('myStore/addCategoryType'); // 增加编辑分类
const SeeApplication = loadOnDemand('myStore/seeApplication'); // 查看申请
const AddCargoTray = loadOnDemand('myStore/addCargoTray'); // 添加托盘
const AddCargoKep = loadOnDemand('myStore/addCargoKep'); // 添加篮子
const ViewEdit = loadOnDemand('myStore/addStoreManage'); // 编辑查看仓库

const MayApplyStoreInfo = loadOnDemand('StoreLease/MayApplyStoreInfo'); // 详情
const LeaseAudit = loadOnDemand('StoreLease/LeaseAudit'); // 租赁审核
const LeasingReview = loadOnDemand('StoreLease/LeaseAudit'); // 租赁审核
const MayApplyStore = loadOnDemand('StoreLease/MayApplyStore'); // 查看可申请仓库
const StoreLeases = loadOnDemand('StoreLease/StoreLease'); // 租赁仓库

const MyGoodsList = loadOnDemand('goodsManage/myGoodsList'); // 我的商品库
const GoodsAddEdit = loadOnDemand('goodsManage/goodsAddEdit'); // 商品编辑新增
const InventoryManage = loadOnDemand('goodsManage/inventoryManage'); // 库存管理
const InventoryAlarm = loadOnDemand('goodsManage/goodsAlarm'); // 库存报警
const InboundList = loadOnDemand('goodsManage/inboundList'); // 入库单列表
const AddInbound = loadOnDemand('goodsManage/addInbound'); // 添加入库单
const OutboundList = loadOnDemand('goodsManage/outboundList'); // 出库单列表
const AddOutbound = loadOnDemand('goodsManage/addOutbound'); // 添加入库单
// const LogisticsQuery = loadOnDemand('goodsManage/logisticsQuery'); // 物流查询
// const AddressManage = loadOnDemand('AddressManage/AddressManage'); // 地址管理
// const AddAddressee = loadOnDemand('AddressManage/addAddressee'); // 地址管理
// const shopConfig = loadOnDemand('goodsManage/shopConfig'); // 店铺配置

// const StaffList = loadOnDemand('staffManage/staffList'); // 员工列表
// const StaffAdd = loadOnDemand('staffManage/staffAdd'); // 新增员工组
// const StaffGroupList = loadOnDemand('staffManage/staffGroupList'); // 员工组列表
// const StaffGroupAdd = loadOnDemand('staffManage/staffGroupAdd'); // 新增员工组

// const SkuPropertyManage = loadOnDemand('systemConfig/skuPropertyManage'); // sku属性管理
// const AddSkuProperty = loadOnDemand('systemConfig/addSkuProperty'); // 增加sku属性
// const CommodityManage = loadOnDemand('systemConfig/commodityManage'); // 货品分类
// const AddCategory = loadOnDemand('systemConfig/addCategory'); // 增加编辑分类
// const GoodsAlarm = loadOnDemand('systemConfig/goodsAlarm'); // 预警管理
// const pickGoodsConfig = loadOnDemand('systemConfig/pickGoodsConfig'); // 拣货配置


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
        icon: '&#xe641;',
        nav: 1,
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
        name: 'userCenter',
        path: 'userCenter',
        component: LayoutSide,
        redirect: 'userCenter/myAuthentication',
        icon: '&#xe67f;',
        nav: 1,
        children: [
          {
            path: 'myAuthentication',
            name: 'myAuthentication',
            component: MyAuthentication,
            nav: 2,
          },
          {
            path: 'myAuthentication/addAuthentication',
            name: 'authenticationForm',
            component: AuthenticationForm,
            nav: 0,
          },
          {
            path: 'myAuthentication/add_apply',
            name: 'addApply',
            component: AddApply,
            nav: 0,
          },
          // {
          //   path: 'homeSetup',
          //   name: 'homeSetup',
          //   nav: 2,
          // },
          {
            path: 'editPassword',
            name: 'editPassword',
            component: EditPassword,
            nav: 2,
          },
        ],
      },
      {
        name: 'myStore',
        path: 'myStore',
        icon: '&#xe600;',
        component: LayoutSide,
        redirect: 'myStore/storeManage',
        nav: 1,
        children: [
          {
            name: 'storeManage',
            path: 'storeManage',
            component: StoreManage,
            nav: 2,
          },
          {
            name: 'BasicsConfig',
            path: 'storeManage/BasicsConfig',
            component: BasicsConfig,
            nav: 0,
          },
          {
            name: 'addCargoShelf',
            path: 'storeManage/addCargoShelf',
            component: AddCargoShelf,
            nav: 0,
          },
          {
            name: 'editCargoShelf',
            path: 'storeManage/editCargoShelf',
            component: AddCargoShelf,
            nav: 0,
          },
          {
            name: 'addCargoProperty',
            path: 'storeManage/addCargoProperty',
            component: AddCargoProperty,
            nav: 0,
          },
          {
            name: 'editCargoProperty',
            path: 'storeManage/editCargoProperty',
            component: AddCargoProperty,
            nav: 0,
          },
          {
            name: 'addCargoKep',
            path: 'storeManage/addCargoKep',
            component: AddCargoKep,
            nav: 0,
          },
          {
            name: 'editCargoKep',
            path: 'storeManage/editCargoKep',
            component: AddCargoKep,
            nav: 0,
          },
          {
            name: 'addCargoArea',
            path: 'storeManage/addCargoArea',
            component: AddCargoArea,
            nav: 0,
          },
          {
            name: 'editCargoArea',
            path: 'storeManage/editCargoArea',
            component: AddCargoArea,
            nav: 0,
          },
          {
            name: 'addCargoTray',
            path: 'storeManage/addCargoTray',
            component: AddCargoTray,
            nav: 0,
          },
          {
            name: 'addBatchType',
            path: 'storeManage/addBatchType',
            component: AddBatchType,
            nav: 0,
          },
          {
            name: 'addOrderType',
            path: 'storeManage/addOrderType',
            component: AddOrderType,
            nav: 0,
          },
          {
            name: 'addStoreManage',
            path: 'storeManage/addStoreManage',
            component: AddStoreManage,
            nav: 0,
          },
          {
            name: 'addCategory',
            path: 'storeManage/addCategory',
            component: AddCategory,
            nav: 0,
          },
          {
            name: 'editCategory',
            path: 'storeManage/editCategory',
            component: AddCategory,
            nav: 0,
          },
          {
            name: 'viewEdit',
            path: 'storeManage/addStoreManage',
            component: ViewEdit,
            nav: 0,
          },
          {
            name: 'seeApplication',
            path: 'seeApplication',
            component: SeeApplication,
            nav: 2,
          },
        ],
      },
      {
        name: 'StoreLease',
        path: 'StoreLease',
        icon: '&#xe633',
        component: LayoutSide,
        redirect: 'StoreLease/StoreLeases',
        nav: 1,
        children: [
          {
            name: 'StoreLeases',
            path: 'StoreLeases',
            component: StoreLeases,
            nav: 2,
          },
          {
            name: 'MayApplyStore',
            path: 'MayApplyStore',
            component: MayApplyStore,
            nav: 2,
          },
          {
            name: 'MayApplyStoreInfo',
            path: 'MayApplyStore/MayApplyStoreInfo',
            component: MayApplyStoreInfo,
            nav: 0,
          },
          {
            name: 'LeasingReview',
            path: 'StoreLeases/LeasingReview',
            component: LeasingReview,
            nav: 0,
          },
          {
            name: 'LeaseAudit',
            path: 'MayApplyStore/LeaseAudit',
            component: LeaseAudit,
            nav: 0,
          },
        ],
      },
      {
        name: 'commodityManage',
        path: 'commodityManage',
        component: LayoutSide,
        redirect: 'commodityManage/MyGoodsList',
        icon: '&#xe625;',
        nav: 1,
        children: [
          {
            name: 'MyGoodsList',
            path: 'MyGoodsList',
            component: MyGoodsList,
            nav: 2,
          },
          {
            name: 'goodsAdd',
            path: 'MyGoodsList/goodsAdd',
            component: GoodsAddEdit,
            nav: 0,
          },
          {
            name: 'goodsEdit',
            path: 'MyGoodsList/goodsEdit',
            component: GoodsAddEdit,
            nav: 0,
          },
          {
            name: 'inventoryManage',
            path: 'inventoryManage',
            component: InventoryManage,
            nav: 2,
          },
          {
            name: 'inventoryAlarm',
            path: 'inventoryAlarm',
            component: InventoryAlarm,
            nav: 2,
          },
          {
            name: 'inboundList',
            path: 'inboundList',
            component: InboundList,
            nav: 2,
          },
          {
            name: 'addInbound',
            path: 'inboundList/addInbound',
            component: AddInbound,
            nav: 0,
          },
          {
            name: 'addOutbound',
            path: 'outboundList/addOutbound',
            component: AddOutbound,
            nav: 0,
          },
          {
            name: 'outboundList',
            path: 'outboundList',
            component: OutboundList,
            nav: 2,
          },
          // {
          //   name: 'AddressManage',
          //   path: 'AddressManage',
          //   component: AddressManage,
          //   nav: 2,
          // },
          // {
          //   name: 'logisticsQuery',
          //   path: 'logisticsQuery',
          //   component: LogisticsQuery,
          //   nav: 2,
          // },
          // {
          //   name: 'shopConfig',
          //   path: 'shopConfig',
          //   component: shopConfig,
          //   nav: 2,
          // },
          // {
          //   name: 'addSender',
          //   path: 'AddressManage/addSender',
          //   component: AddAddressee,
          //   nav: 0,
          // },
          // {
          //   name: 'addAddressee',
          //   path: 'AddressManage/addAddressee',
          //   component: AddAddressee,
          //   nav: 0,
          // },
          // {
          //   name: 'editSender',
          //   path: 'AddressManage/editSender',
          //   component: AddAddressee,
          //   nav: 0,
          // },
          // {
          //   name: 'editAddressee',
          //   path: 'AddressManage/editAddressee',
          //   component: AddAddressee,
          //   nav: 0,
          // },
        ],
      },
      // {
      //   name: 'staffManage',
      //   path: 'staffManage',
      //   component: LayoutSide,
      //   redirect: 'staffManage/staffList',
      //   icon: '&#xe67f;',
      //   nav: 1,
      //   children: [
      //     {
      //       name: 'staffList',
      //       path: 'staffList',
      //       component: StaffList,
      //       nav: 2,
      //     },
      //     {
      //       name: 'staffAdd',
      //       path: 'staffList/staffAdd',
      //       component: StaffAdd,
      //       nav: 0,
      //     },
      //     {
      //       name: 'staffGroupList',
      //       path: 'staffGroupList',
      //       component: StaffGroupList,
      //       nav: 2,
      //     },
      //     {
      //       name: 'staffGroupAdd',
      //       path: 'staffGroupList/staffGroupAdd',
      //       component: StaffGroupAdd,

      //       nav: 0,
      //     },
      //   ],
      // },
      // {
      //   name: 'config',
      //   path: 'config',
      //   icon: '&#xe88d;',
      //   component: LayoutSide,
      //   redirect: 'config/commodityClassificationManage',
      //   nav: 1,
      //   children: [
      //     // {
      //     //   name: 'SkuPropertyManage',
      //     //   path: 'SkuPropertyManage',
      //     //   component: SkuPropertyManage,
      //     //   nav: 2,
      //     // },
      //     // {
      //     //   name: 'AddSkuProperty',
      //     //   path: 'SkuPropertyManage/AddSkuProperty',
      //     //   component: AddSkuProperty,
      //     //   nav: 0,
      //     // },
      //     {
      //       name: 'commodityClassificationManage',
      //       path: 'commodityClassificationManage',
      //       component: CommodityManage,
      //       nav: 2,
      //     },
      //     {
      //       name: 'addCategory',
      //       path: 'commodityClassificationManage/addCategory',
      //       component: AddCategory,
      //       nav: 0,
      //     },
      //     {
      //       name: 'goodsAlarm',
      //       path: 'goodsAlarm',
      //       component: GoodsAlarm,
      //       nav: 2,
      //     },
      //     // {
      //     //   name: 'pickGoodsConfig',
      //     //   path: 'pickGoodsConfig',
      //     //   component: pickGoodsConfig,
      //     //   nav: 2,
      //     // },
      //   ],
      // },
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
