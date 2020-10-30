// 按需加载
const loadOnDemand = function loadOnDemand(file) {
  return () => import(/* webpackChunkName: "chunk" */ `@/page/${file}`);
};
// 布局
const LayoutTop = loadOnDemand('Layout/top');
const LayoutSide = loadOnDemand('Layout/side');

// 登陆
const Login = loadOnDemand('login/login');
// const Register = loadOnDemand('login/register');
// const BackPassword = loadOnDemand('login/back_password');

// 首页
const Home = loadOnDemand('initPage/home');

// 采购
const PurchaseList = loadOnDemand('purchase/purchaseList/purchaseList');// 采购单列表
const AddPurchase = loadOnDemand('purchase/addPurchase/addPurchase');// 添加采购单

// 入库
const InboundList = loadOnDemand('inbound/inboundList/inboundList');// 入库单列表
const InboundCategory = loadOnDemand('inbound/inboundCategory/inboundCategory');// 入库单分类
const AddInbound = loadOnDemand('inbound/addInbound/addInbound');// 添加入库单
const InboundShelf = loadOnDemand('inbound/inboundList/components/inboundShelf');// 入库上架

// 销售
const OutboundList = loadOnDemand('outbound/outboundList/outboundList');// 销售单列表
const AddOutbound = loadOnDemand('outbound/addOutbound/addOutbound');// 添加销售单
const SetOutbound = loadOnDemand('outbound/outboundList/components/setOutbound');// 设为出库
const EditSender = loadOnDemand('outbound/addOutbound/components/editSender');// 编辑发件人信息
const EditRecevier = loadOnDemand('outbound/addOutbound/components/editRecevier');// 编辑收件人信息
const SaleCategory = loadOnDemand('outbound/saleCategory/saleCategory');// 销售单分类

// 库存
const InventoryManage = loadOnDemand('inventory/inventoryManage/inventoryManage');// 库存管理
const InventoryAlarm = loadOnDemand('inventory/inventoryAlarm/inventoryAlarm');// 库存报警
const GoodsManage = loadOnDemand('inventory/goodsManage/goodsManage'); // 货品管理
const GoodsAdd = loadOnDemand('inventory/goodsManage/components/goodsAdd'); // 商品新增
const GoodsEdit = loadOnDemand('inventory/goodsManage/components/goodsEdit'); // 商品编辑
const StockTaking = loadOnDemand('inventory/stockTaking/stockTaking');// 库存盘点 (新模块)
const AddCheckStock = loadOnDemand('inventory/stockTaking/components/addCheckStock');// 库存盘点 (新模块)
const CheckStockDetail = loadOnDemand('inventory/stockTaking/components/checkStockDetail');// 库存盘点 (新模块)
// 员工管理
// 员工列表
// const StaffList = loadOnDemand('staffManage/staffList/staffList'); // 员工列表
// const StaffAdd = loadOnDemand('staffManage/staffList/components/staffAdd'); // 新增员工
// const EditStaffData = loadOnDemand('staffManage/staffList/components/editStaffData'); // 编辑资料
// const ModifyStaffPsw = loadOnDemand('staffManage/staffList/components/modifyStaffPsw'); // 修改密码

// // 员工组列表
// const StaffGroupList = loadOnDemand('staffManage/staffGroupList/staffGroupList'); // 员工组列表
// const StaffGroupAdd = loadOnDemand('staffManage/staffGroupList/components/staffGroupAdd'); // 添加员工组
// const StaffGroupBasicInfo = loadOnDemand('staffManage/staffGroupList/components/staffGroupBasicInfo'); // 基本信息
// const StaffGroupShowEmployee = loadOnDemand('staffManage/staffGroupList/components/staffGroupShowEmployee'); // 添加员工组
// const StaffGroupAddEmployee = loadOnDemand('staffManage/staffGroupList/components/staffGroupAddEmployee'); // (查看员工组)添加员工
// const StaffGroupPermissions = loadOnDemand('staffManage/staffGroupList/components/staffGroupPermissions'); // 权限
// 设置
const StoreManagement = loadOnDemand('storeManagement/storeManagement'); // 仓库管理
const BasicSetting = loadOnDemand('storeManagement/components/basicSetting/basicSetting'); // - demo
const AddWarehouse = loadOnDemand('storeManagement/components/addWarehouse'); // 添加仓库
const ModifyPassword = loadOnDemand('setting/modifyPassword/modifyPassword');
const BindPhone = loadOnDemand('setting/bindPhone/bindPhone');
const BindEmail = loadOnDemand('setting/bindEmail/bindEmail');
const OfficialAccounts = loadOnDemand('setting/officialAccounts/officialAccounts');
const ModifyInfo = loadOnDemand('setting/modifyInfo/modifyInfo');

// 仓库列表--基础配置
const PATH = 'storeManagement/components/basicSetting/components';
const AddCargoArea = loadOnDemand(`${PATH}/components/addCargoArea`); // 添加货区
const AddCargoShelf = loadOnDemand(`${PATH}/components/addCargoShelf`); // 添加货位
const EditCargoArea = loadOnDemand(`${PATH}/components/editCargoArea`); // 编辑货区
const EditCargoShelf = loadOnDemand(`${PATH}/components/editCargoShelf`); // 编辑货位

const AddressManagement = loadOnDemand('setting/addressManagement/addressManagement'); // 地址管理
const SupplierManagement = loadOnDemand('setting/supplierManagement/supplierManagement'); // 供应商管理
const CategoryManagement = loadOnDemand('setting/categoryManagement/categoryManagement'); // 货品分类管理

// 店铺管理
const Shops = loadOnDemand('h5Store/shops/shops'); // 店铺管理
const StoreGoods = loadOnDemand('h5Store/storeGoods/storeGoods'); // 店铺商品管理
// 帮助
// const Help = loadOnDemand('helpCenter/help'); // 货品分类管理

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
        index: 1, // 后端路由鉴权
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
        name: 'navSale', // 大菜单 销售
        path: 'navSale',
        component: LayoutSide,
        icon: '&#xeb1c;',
        nav: 1,
        id: 'navSale',
        index: 3, // 后端路由鉴权
        children: [
          {
            name: 'navSale', // 子菜单-分组 销售
            type: 'children-group',
            path: '',
          },
          {
            name: 'outboundList', // 子菜单-销售列表
            path: 'outboundList',
            component: OutboundList,
            nav: 2,
          },
          {
            name: 'addOutbound', // 子菜单-添加销售单
            path: 'addOutbound',
            component: AddOutbound,
            nav: 3,
          },
          {
            name: 'editSender', // 子菜单-添加销售单-编辑发件人
            path: 'editSender',
            component: EditSender,
            nav: 3,
          },
          {
            name: 'editRecevier', // 子菜单-添加销售单-编辑收件人
            path: 'editRecevier',
            component: EditRecevier,
            nav: 3,
          },
          {
            name: 'setOutbound', // 子菜单-添加销售单-编辑收件人
            path: 'setOutbound',
            component: SetOutbound,
            nav: 3,
          },
          {
            name: 'saleCategory', // 子菜单-销售单分类
            path: 'saleCategory',
            component: SaleCategory,
            nav: 2,
          },
          {
            name: 'shops', // 子菜单-分组 店铺
            type: 'children-group',
            path: '',
          },
          {
            name: 'shopsManagement', // 子菜单-店铺列表
            path: 'shopsManagement',
            component: Shops,
            nav: 2,
          },
        ],
      },
      {
        name: 'client',
        path: 'client',
        component: LayoutSide,
        icon: '&#xeb47;',
        nav: 1,
        id: 'client',
        index: 10,
        children: [
          {
            name: 'client', // 子菜单-分组 客户
            path: '',
            type: 'children-group',
          },
          {
            name: 'addressManagement', // 子菜单-地址管理
            path: 'addressManagement',
            component: AddressManagement,
            nav: 2,
          },
          {
            name: 'supplier', // 子菜单-分组 供应商
            path: '',
            type: 'children-group',
          },
          {
            name: 'supplierManagement', // 子菜单-供应商管理
            path: 'supplierManagement',
            component: SupplierManagement,
            nav: 2,
          },
        ],
      },
      {
        name: 'inventory', // 大菜单 库存
        path: 'inventory',
        component: LayoutSide,
        icon: '&#xeb25;',
        nav: 1,
        id: 'inventory',
        index: 4, // 后端路由鉴权
        children: [
          {
            name: 'inventory', // 子菜单-分组 库存
            path: '',
            type: 'children-group',
          },
          {
            name: 'inventoryManage', // 子菜单-库存管理
            path: 'inventoryManage',
            component: InventoryManage,
            nav: 2,
          },
          {
            name: 'stockTaking', // 子菜单-库存盘点
            path: 'stockTaking',
            component: StockTaking,
            nav: 2,
          },
          {
            name: 'inventoryAlarm', // 子菜单-库存报警
            path: 'inventoryAlarm',
            component: InventoryAlarm,
            nav: 2,
          },
          {
            name: 'inbound', // 子菜单-分组 入库
            path: '',
            type: 'children-group',
          },
          {
            name: 'inboundList', // 子菜单-入库单列表
            path: 'inboundList',
            component: InboundList,
            nav: 2,
          },
          {
            name: 'inboundCategory', // 子菜单-入库单分类
            path: 'inboundCategory',
            component: InboundCategory,
            nav: 2,
          },
          {
            name: 'addInbound', // 子菜单-添加入库单
            path: 'inbound/addInbound',
            component: AddInbound,
            nav: 3,
          },
          {
            name: 'inboundShelf', // 组件-入库上架
            path: 'inboundList/inboundShelf',
            component: InboundShelf,
            nav: 3,
          },
          {
            name: 'goods', // 子菜单-分组 商品
            path: '',
            type: 'children-group',
          },
          {
            name: 'GoodsManage', // 子菜单-商品管理
            path: 'goodsManage',
            component: GoodsManage,
            nav: 2,
          },
          {
            name: 'goodsAdd', // 模块 货品管理--添加货品
            path: 'goodsManage/goodsAdd',
            component: GoodsAdd,
            nav: 3,
          },
          {
            name: 'goodsEdit', // 模块  // 模块 货品管理--编辑货品
            path: 'goodsManage/goodsEdit',
            component: GoodsEdit,
            nav: 3,
          },
          {
            name: 'addCheckStock', // 模块  // 模块 货品管理--编辑货品
            path: 'stockTaking/addCheckStock',
            component: AddCheckStock,
            nav: 3,
          },
          {
            name: 'checkStockDetail', // 模块  // 模块 货品管理--编辑货品
            path: 'stockTaking/checkStockDetail',
            component: CheckStockDetail,
            nav: 3,
          },
          {
            name: 'categoryManagement', // 子菜单- 商品分类管理
            path: 'categoryManagement',
            component: CategoryManagement,
            nav: 2,
          },
        ],
      },
      {
        name: 'warehouse', // 仓库
        path: 'warehouse',
        component: LayoutSide,
        icon: '&#xeb47;',
        nav: 1,
        id: 'inbound',
        index: 10,
        children: [
          {
            name: 'warehouse', // 子菜单-分组 仓库
            path: '',
            type: 'children-group',
          },
          // {
          //   name: 'areaAndShelf', // 子菜单 货区货位
          //   redirect: {
          //     name: 'basicSetting',
          //     query: {
          //       quickTag: true,
          //     },
          //   },
          //   path: '/setting/basicSetting',
          //   component: BasicSetting,
          //   nav: 2,
          // },
          {
            name: 'areaAndShelf', // 仓库管理-基本配置
            path: 'areaAndShelf',
            component: BasicSetting,
            nav: 2,
          },
          {
            name: 'purchaseList', // 采购单列表
            path: 'purchase/purchaseList',
            component: PurchaseList,
            nav: 2,
          },
          {
            name: 'addPurchase', // 子菜单-添加采购单
            path: 'purchaseList/addPurchase',
            component: AddPurchase,
            nav: 3,
          },
          {
            name: 'storeManage', // 子菜单-仓库管理
            path: 'storeManage',
            component: StoreManagement,
            nav: 2,
          },
        ],
      },
      // {
      //   name: 'staff', // 大菜单 员工
      //   path: 'staff',
      //   component: LayoutSide,
      //   icon: '&#xeb3e;',
      //   nav: 1,
      //   id: 'staff',
      //   index: 6, // 后端路由鉴权
      //   children: [
      //     {
      //       name: 'staffList', // 子菜单-员工列表
      //       path: 'staffList',
      //       component: StaffList,
      //       nav: 2,
      //     },
      //     {
      //       name: 'staffGroupList', // 子菜单-员工组列表
      //       path: 'staffGroupList',
      //       component: StaffGroupList,
      //       nav: 2,
      //     },
      //     {
      //       name: 'staffAdd', // 模块-添加员工
      //       path: 'staffAdd',
      //       component: StaffAdd,
      //       nav: 3,
      //     },
      //     {
      //       name: 'editStaffData', // 模块-编辑员工信息
      //       path: 'editStaffData',
      //       component: EditStaffData,
      //       nav: 3,
      //     },
      //     {
      //       name: 'modifyStaffPsw', // 模块-修改员工密码
      //       path: 'modifyStaffPsw',
      //       component: ModifyStaffPsw,
      //       nav: 3,
      //     },
      //     {
      //       name: 'staffGroupAdd', // 模块-添加员工组
      //       path: 'staffGroupAdd',
      //       component: StaffGroupAdd,
      //       nav: 3,
      //     },
      //     {
      //       name: 'staffGroupBasicInfo', // 模块-员工组基本信息
      //       path: 'staffGroupBasicInfo',
      //       component: StaffGroupBasicInfo,
      //       nav: 3,
      //     },
      //     {
      //       name: 'staffGroupShowEmployee', // 模块-员工组查看员工
      //       path: 'staffGroupShowEmployee',
      //       component: StaffGroupShowEmployee,
      //       nav: 3,
      //     },
      //     {
      //       name: 'staffGroupAddEmployee', // 模块-员工组添加员工
      //       path: 'staffGroupAddEmployee',
      //       component: StaffGroupAddEmployee,
      //       nav: 3,
      //     },
      //     {
      //       name: 'staffGroupPermissions', // 模块-员工组权限
      //       path: 'staffGroupPermissions',
      //       component: StaffGroupPermissions,
      //       nav: 3,
      //     },
      //   ],
      // },
      {
        name: 'setting', // 大菜单 设置
        path: 'setting',
        component: LayoutSide,
        icon: '&#xeb41;',
        nav: 1,
        id: 'setting',
        index: 5, // 后端路由鉴权
        children: [
          {
            name: 'bindPhone',
            path: 'bindPhone',
            component: BindPhone,
            nav: 2,
          },
          {
            name: 'bindEmail',
            path: 'bindEmail',
            component: BindEmail,
            nav: 2,
          },
          {
            name: 'officialAccounts',
            path: 'officialAccounts',
            component: OfficialAccounts,
            nav: 2,
          },
          {
            name: 'modifyInfo',
            path: 'modifyInfo',
            component: ModifyInfo,
            nav: 2,
          },
          {
            name: 'modifyPassword',
            path: 'modifyPassword',
            component: ModifyPassword,
            nav: 2,
          },
          // {
          //   name: 'basicSetting', // 仓库管理-基本配置
          //   path: 'basicSetting',
          //   component: BasicSetting,
          //   nav: 3,
          // },
          {
            name: 'addWarehouse', // 仓库管理-添加仓库
            path: 'storeManage/addWarehouse',
            component: AddWarehouse,
            nav: 3,
          },
          {
            name: 'addCargoArea', // 组件-基础配置-添加货区
            path: 'addCargoArea',
            component: AddCargoArea,
            nav: 3,
          },
          {
            name: 'addCargoShelf', // 组件-基本配置-添加货位
            path: 'addCargoShelf',
            component: AddCargoShelf,
            nav: 3,
          },
          {
            name: 'editCargoArea', // 组件-基础配置-编辑货区
            path: 'editCargoArea',
            component: EditCargoArea,
            nav: 3,
          },
          {
            name: 'editCargoShelf', // 组件-基本配置-编辑货位
            path: 'editCargoShelf',
            component: EditCargoShelf,
            nav: 3,
          },
          {
            name: 'storeGoods', // 店铺管理--店铺列表
            path: 'storeGoods',
            component: StoreGoods,
            nav: 3,
          },
        ],
      },
      // {
      //   name: 'help', // 大菜单 帮助
      //   path: 'help',
      //   component: LayoutSide,
      //   icon: '&#xeb38;',
      //   nav: 1,
      //   id: 'helpCenter',
      //   index: 7, // 后端路由鉴权
      //   children: [
      //     {
      //       name: 'helpCenter', // 帮助
      //       path: 'helpCenter',
      //       component: Help,
      //       nav: 2,
      //     },
      //   ],
      // },
    ],
  },
];

export const homeRoute = [
  {
    path: '/redirect',
    component: LayoutTop,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('../page/Layout/redirect/index'),
      },
    ],
  },
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
  // {
  //   name: 'register',
  //   path: '/register',
  //   component: Register,
  // },
  // {
  //   name: 'backPassword',
  //   path: '/backPassword',
  //   component: BackPassword,
  // },
];
