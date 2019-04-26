function getView(viewName) {
  return (resolve, reject) => {
    require.ensure(
      [],
      (require) => {
        const mapItem = {
          login: require('@/page/login/login'), // 登录
          register: require('@/page/login/register'), // 注册
          backPassword: require('@/page/login/back_password'), // 找回密码
          topNav: require('@/page/NavMenu/top'), // 顶部导航
          home: require('@/page/myWms/home'), // 首页
          myAuthentication: require('@/page/myWms/my_authentication'), // 我的认证
          // homeSetup: getView('@/page/myWms/home_setup'), // 首页配置
          editPassword: require('@/page/myWms/edit_password'), // 修改密码
          authenticationForm: require('@/page/myWms/add_authentication'), // 添加认证
          storeManage: require('@/page/newStore/storeManage'), // 仓库管理
          addStoreManage: require('@/page/newStore/addStoreManage'), // 添加仓库
          viewEdit: require('@/page/newStore/addStoreManage'), // 编辑查看仓库
          BasicsConfig: require('@/page/newStore/BasicsConfig'), // 基础配置
          addCargoArea: require('@/page/newStore/addCargoArea'), // 添加货架
          addCargoShelf: require('@/page/newStore/addCargoShelf'), // 添加货区
          addBatchType: require('@/page/newStore/addBatchType'), // 添加入库单
          addOrderType: require('@/page/newStore/addOrderType'), // 添加出库单
          seeApplication: require('@/page/newStore/seeApplication'), // 查看申请
          MayApplyStore: require('@/page/StoreLease/MayApplyStore'), // 查看可申请仓库
          StoreLeases: require('@/page/StoreLease/StoreLease'), // 租赁仓库
          MyGoodsList: require('@/page/goodsManage/myGoodsList'), // 我的商品库
          goodsAddEdit: require('@/page/goodsManage/goodsAddEdit'), // 商品编辑新增
          inventoryManage: require('@/page/goodsManage/inventoryManage'), // 库存管理
          goodsAlarm: require('@/page/goodsManage/goodsAlarm'), // 商品预警
          inboundList: require('@/page/goodsManage/inboundList'), // 入库单列表
          addInbound: require('@/page/goodsManage/addInbound'), // 添加入库单
          outboundList: require('@/page/goodsManage/outboundList'), // 出库单列表
          addOutbound: require('@/page/goodsManage/addOutbound'), // 添加入库单
          logisticsQuery: require('@/page/goodsManage/logisticsQuery'), // 物流查询
          staffList: require('@/page/staffManage/staffList'), // 员工列表
          staffAdd: require('@/page/staffManage/staffAdd'), // 新增员工组
          staffGroupList: require('@/page/staffManage/staffGroupList'), // 员工组列表
          staffGroupAdd: require('@/page/staffManage/staffGroupAdd'), // 新增员工组
          addCargoTray: require('@/page/newStore/addCargoTray'), // 添加托盘
          addCargoKep: require('@/page/newStore/addCargoKep'), // 添加篮子
          MayApplyStoreInfo: require('@/page/StoreLease/MayApplyStoreInfo'), // 详情
          LeaseAudit: require('@/page/StoreLease/LeaseAudit'), // 租赁审核
          LeasingReview: require('@/page/StoreLease/LeaseAudit'), // 租赁审核
          addApply: require('@/page/myWms/add_apply'), // 添加租赁仓库认证
          AddressManage: require('@/page/AddressManage/AddressManage'), // 地址管理
        };
        resolve(mapItem[viewName]);
      },
      reject,
      'home',
    );
  };
}
// /* eslint-disable */
// const getView = function (file) {
//   return () => import(/* webpackChunkName: "chunk" */ file);
// };

// const login = getView('@/page/login'); // 登录
// const register = getView('@/page/register'); // 注册
// const backPassword = getView('@/page/login/back_password'); // 找回密码
// const topNav = getView('@/page/NavMenu/top'); // 顶部导航
// const home = getView('@/page/myWms/home'); // 首页
// const myAuthentication = getView('@/page/myWms/my_authentication'); // 我的认证
// const editPassword = getView('@/page/myWms/edit_password'); // 修改密码
// const authenticationForm = getView('@/page/myWms/add_authentication'); // 添加认证
// const storeManage = getView('@/page/newStore/storeManage'); // 仓库管理
// const addStoreManage = getView('@/page/newStore/addStoreManage'); // 添加仓库
// const BasicsConfig = getView('@/page/newStore/BasicsConfig'); // 基础配置
// const addCargoArea = getView('@/page/newStore/addCargoArea'); // 添加货架
// const addCargoShelf = getView('@/page/newStore/addCargoShelf'); // 添加货区
// const addBatchType = getView('@/page/newStore/addBatchType'); // 添加入库单
// const addOrderType = getView('@/page/newStore/addOrderType'); // 添加出库单
// const seeApplication = getView('@/page/newStore/seeApplication'); // 查看申请
// const MayApplyStore = getView('@/page/StoreLease/MayApplyStore'); // 查看可申请仓库
// const StoreLeases = getView('@/page/StoreLease/StoreLease'); // 租赁仓库
// const MyGoodsList = getView('@/page/goodsManage/myGoodsList'); // 我的商品库
// const goodsAddEdit = getView('@/page/goodsManage/goodsAddEdit'); // 商品编辑新增
// const inventoryManage = getView('@/page/goodsManage/inventoryManage'); // 库存管理
// const goodsAlarm = getView('@/page/goodsManage/goodsAlarm'); // 商品预警
// const inboundList = getView('@/page/goodsManage/inboundList'); // 入库单列表
// const addInbound = getView('@/page/goodsManage/addInbound'); // 添加入库单
// const outboundList = getView('@/page/goodsManage/outboundList'); // 出库单列表
// const addOutbound = getView('@/page/goodsManage/addOutbound'); // 添加入库单
// const logisticsQuery = getView('@/page/goodsManage/logisticsQuery'); // 物流查询
// const staffList = getView('@/page/staffManage/staffList'); // 员工列表
// const staffAdd = getView('@/page/staffManage/staffAdd'); // 新增员工组
// const staffGroupList = getView('@/page/staffManage/staffGroupList'); // 员工组列表
// const staffGroupAdd = getView('@/page/staffManage/staffGroupAdd'); // 新增员工组
// const addCargoTray = getView('@/page/newStore/addCargoTray'); // 添加托盘
// const addCargoKep = getView('@/page/newStore/addCargoKep'); // 添加篮子
// const MayApplyStoreInfo = getView('@/page/StoreLease/MayApplyStoreInfo'); // 详情
// const LeaseAudit = getView('@/page/StoreLease/LeaseAudit'); // 租赁审核
// const LeasingReview = getView('@/page/StoreLease/LeaseAudit'); // 租赁审核
// const addApply = getView('@/page/myWms/add_apply'); // 添加租赁仓库认证
// const AddressManage = getView('@/page/AddressManage/AddressManage'); // 地址管理

function addComponent(routes) {
  routes.forEach((v) => {
    if (!v.component && !v.redirect) {
      v.component = getView(v.name);
      // v.component = v.name;
    }
    if (v.children) {
      addComponent(v.children);
    }
  });
}

export default addComponent;
