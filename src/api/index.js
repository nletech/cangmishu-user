import Axios from '@/lib/axios/config';

const $http = {
  getVerificationCode(data) {
    return Axios.post('/user/activateCode', data);
  }, // 获取验证码
  register(data) {
    return Axios.post('/register', data);
  }, // 注册
  login(data) {
    return Axios.post('/login', data);
  }, // 登陆
  logout(data) {
    return Axios.post('/logout', data);
  }, // 登出
  //                                                          库存
  // 货品管理
  //                                                          设置-仓库管理
  warehouses() {
    return Axios.get('/warehouses');
  }, // 仓库列表
  addWarehouse(data) {
    return Axios.post('/warehouses', data);
  }, // 添加仓库
  modifyWarehouse(id, data) {
    return Axios.put(`/warehouses/${id}`, data);
  }, // 编辑仓库
  checkWarehouses(data) {
    return Axios.get('/warehouses', { params: data });
  }, // 仓库列表分页查询
  //                                              仓库管理(基本配置)
  //                               基本配置-货区
  getWarehouseArea(data) {
    return Axios.get('areas', { params: data });
  }, // 获取货区列表
  addWarehouseArea(data) {
    return Axios.post('/areas', data);
  }, // 添加货区
  delWarehouseArea(id) {
    return Axios.delete(`/areas/${id}`);
  }, // 删除货区
  editWarehouseArea(id, data) {
    return Axios.put(`/areas/${id}`, data);
  }, // 编辑货区
  checkWarehouseArea(data) {
    return Axios.get('/areas', { params: data });
  }, // 分页查询--货区列表
  //                               基本配置-货位
  getWarehouseshelf(data) {
    return Axios.get('/locations', { params: data });
  }, // 获取货位列表
  addWarehouseshelf(data) {
    return Axios.post('/locations', data);
  }, // 添加货位
  delWarehouseshelf(id) {
    return Axios.delete(`/locations/${id}`);
  }, // 删除货位
  editWarehouseshelf(id, data) {
    return Axios.put(`/locations/${id}`, data);
  }, // 编辑货位
  checkWarehouseshelf(data) {
    return Axios.get('/locations', { params: data });
  }, // 分页查询--货位列表
  //                                                          设置 -地址管理
  addSenderAddress(data) {
    return Axios.post('/senderAddress', data);
  }, // 添加发件人信息
  getSenderAddress() {
    return Axios.get('/senderAddress');
  }, // 获取发件人信息列表
  editSenderAddress(id, data) {
    return Axios.put(`/senderAddress/${id}`, data);
  }, // 编辑发件人
  checkSenderAddress(data) {
    return Axios.get('/senderAddress', { params: data });
  }, // 发件人分页查询
  deleteSender(id) {
    return Axios.delete(`/senderAddress/${id}`);
  }, // 删除发件人
  addReceiverAddress(data) {
    return Axios.post('/receiverAddress', data);
  }, // 添加收件人信息
  getReceiverAddress() {
    return Axios.get('/receiverAddress');
  }, // 获取收件人信息列表
  editReceiverAddress(id, data) {
    return Axios.put(`/receiverAddress/${id}`, data);
  }, // 编辑收件人
  checkReceiverAddress(data) {
    return Axios.get('/receiverAddress', { params: data });
  }, // 收件人分页查询
  deleteReceiver(id) {
    return Axios.delete(`/receiverAddress/${id}`);
  }, // 删除收件人
  //                                                            设置-供应商管理
  addDistributor(data) {
    return Axios.post('/distributor', data);
  }, // 添加供应商
  getDistributor() {
    return Axios.get('/distributor');
  }, // 获取供应商列表
  checkDistributor(data) {
    return Axios.get('/distributor', { params: data });
  }, // 分页查询供应商
  deleteDistributor(id) {
    return Axios.delete(`/distributor/${id}`);
  }, // 删除供应商
  editDistributor(id, data) {
    return Axios.put(`/distributor/${id}`, data);
  }, // 编辑供应商
  //                                                            设置-分类管理
  getCategoryManagement() {
    return Axios.get('/categories');
  }, // 获取分类列表
  addCategoryManagement(data) {
    return Axios.post('/categories', data);
  }, // 添加分类列表
  checkCategoryManagement(data) {
    return Axios.get('/categories', { params: data });
  }, // 分页查询分类列表
  editCategoryManagement(id, data) {
    return Axios.put(`/categories/${id}`, data);
  }, // 编辑分类信息
  deleteCategoryManagement(id) {
    return Axios.delete(`/categories/${id}`);
  }, // 删除分类信息
  //                                                            设置-出入库分类
  //                               入库单分类
  getBatchType() {
    return Axios.get('/batchType');
  }, // 获取入库单分类
  addBatchType(data) {
    return Axios.post('/batchType', data);
  }, // 添加入库单分类
  delBatchType(id) {
    return Axios.delete(`/batchType/${id}`);
  }, // 删除入库单分类
  editBatchType(id, data) {
    return Axios.put(`/batchType/${id}`, data);
  }, // 编辑入库单分类
  checkBatchType(data) {
    return Axios.get('/batchType', { params: data });
  }, // 分页查询--入库单分类
  //                               出库单分类
  getOrderType() {
    return Axios.get('/orderType');
  }, // 获取出库单分类
  addOrderType(data) {
    return Axios.post('/orderType', data);
  }, // 添加出库单分类
  delOrderType(id) {
    return Axios.delete(`/orderType/${id}`);
  }, // 删除出库单分类
  editOrderType(id, data) {
    return Axios.put(`/orderType/${id}`, data);
  }, // 编辑出库单分类
  checkOrderType(data) {
    return Axios.get('/orderType', { params: data });
  }, // 分页查询--出库单分类
  // =========== 以上是仓秘书
  // 切换仓库
  toggleWarehouse(data) {
    return Axios.get(`user/setWarehouse/${data}`);
  },
  // 找回密码发送邮件
  forgetPwd(data) {
    return Axios.post('user/forgetPassword', data);
  },
  // 找回密码
  resetPwdEnd(data) {
    return Axios.post('user/resetPassword', data);
  },
  // 获取街道及城市
  getCityStreet(data) {
    return Axios.post('nladdress', data);
  },
  // 用户注册
  // 仓库列表
  warehouse(data) {
    return Axios.get('warehouse', { params: data });
  },
  // 仓库认证
  apply(data) {
    return Axios.put('owner/apply', data);
  },
  // 添加仓库
  warehousePut(data, type) {
    if (type) return Axios.post('warehouse', data);
    return Axios.put('warehouse', data);
  },
  // 单条仓库
  WarehouseInfo(data) {
    return Axios.get(`warehouse/${data}`);
  },
  // 货区列表
  warehouseArea(data) {
    return Axios.get('warehouseArea', { params: data });
  },
  // 货区特性列表
  warehouseFeature(data) {
    return Axios.get('warehouseFeature', { params: data });
  },
  // 添加或编辑货区特性
  addWarehouseFeature(data, type) {
    if (type) return Axios.post('warehouseFeature', data);
    return Axios.put('warehouseFeature', data);
  },
  // 单条特性
  getInfoWarehouseFeature(data) {
    return Axios.get(`warehouseFeature/${data}`);
  },
  // 删除特性
  delWarehouseFeature(data) {
    return Axios.delete('warehouseFeature', { params: data });
  },
  // 单条货区
  getInfoWarehouseArea(data) {
    return Axios.get(`warehouseArea/${data}`);
  },
  // 单条货架
  shelfInfo(data) {
    return Axios.get(`warehouseLocation/${data}`);
  },
  // 删除货架
  delShelf(data) {
    return Axios.delete('warehouseLocation', { params: data });
  },
  // 托盘列表
  tray(data) {
    return Axios.get('tray', { params: data });
  },
  // 添加托盘
  addTray(data, type) {
    if (type) return Axios.post('tray', data);
    return Axios.put('tray', data);
  },
  // 删除托盘
  delTray(data) {
    return Axios.delete('tray', { params: data });
  },
  // 单条托盘
  TrayInfo(data) {
    return Axios.get(`tray/${data}`);
  },
  // 篮子列表
  kep(data) {
    return Axios.get('kep', { params: data });
  },
  // 篮子详情
  kepInfo(data) {
    return Axios.get(`kep/${data}`);
  },
  // 温度列表
  temperatures() {
    return Axios.get('temperatures');
  },
  // 添加员工
  addEmployee(data, type) {
    if (type) return Axios.post('employee', data);
    return Axios.put('employee', data);
  },
  // 员工信息
  EmployeeInfo(data) {
    return Axios.get(`employee/${data}`, data);
  },
  // 拉取用户信息
  findList(data) {
    return Axios.get('user/find', { params: data });
  },
  // 添加/编辑篮子
  addKep(data, edit) {
    if (edit) return Axios.post('kep', data);
    return Axios.put('kep', data);
  },
  // 删除篮子
  delKep(data) {
    return Axios.delete('kep', { params: data });
  },
  // 货品库列表
  goodsList(data) {
    return Axios.get('products', { params: data });
  },
  // 设置商品分类
  setGoodscategory(data) {
    return Axios.post('product/setCategory', data);
  },
  // 添加货品
  GoodsAdd(data, type) {
    if (type) return Axios.post('products', data);
    return Axios.put('products', data);
  },
  // 添加规格
  addSpec(data, type) {
    if (type) return Axios.post('spec', data);
    return Axios.put('spec', data);
  },
  // 删除规格
  delSpec(data) {
    return Axios.delete('spec', { params: data });
  },
  // 单条货品信息
  getGoodsInfo(data, warehouseID) {
    return Axios.get(`product/${data}`, { params: warehouseID });
  },
  // 已申请列表
  ownerList(data) {
    return Axios.get('owner', { params: data });
  },
  // 租赁仓库列表
  rentersList(data) {
    return Axios.get('renters', { params: data });
  },
  // 可租赁仓库列表
  check(data) {
    return Axios.post('owner/check', data);
  },
  // 找回密码
  changePwd(data) {
    return Axios.post('user/editPassword', data);
  },
  // 租赁者查看仓库申请列表
  renterslist(data) {
    return Axios.get('renters/list', { params: data });
  },
  // 租赁仓库认证
  rentersApply(data) {
    return Axios.put('renters/apply', data);
  },
  // 租赁仓库认证詳情
  ownerInfo(data) {
    return Axios.get(`owner/${data}`);
  },
  // 租赁仓库认证详情
  rentersShow(data) {
    return Axios.get(`renters/show/${data}`);
  },
  // 确认租赁
  renters(data) {
    return Axios.put('renters', data);
  },
  // 我的信息
  account() {
    return Axios.get('user/account');
  },
  // 产地列表
  originList() {
    return Axios.get('origin');
  },
  // 添加产地
  originAdd(data, type) {
    if (type) return Axios.post('origin', data);
    return Axios.put('origin', data);
  },
  // 删除产地
  originDel(data) {
    return Axios.delete('origin', { params: data });
  },
  // 分类列表(增加出入库单页)
  categoryList(data) {
    return Axios.get('category', { params: data });
  },
  // 入库单列表
  inboundList(data) {
    return Axios.get('batch', { params: data });
  },
  // 入库单添加
  inboundAdd(data) {
    return Axios.put('batch', data);
  },
  // 删除供应商
  distributorDel(data) {
    return Axios.delete('distributor', { params: data });
  },
  // 供应商列表
  distributorList(data) {
    return Axios.get('distributor', { params: data });
  },
  // 添加编辑供应商
  distributorAdd(data, edit) {
    if (edit) return Axios.post('distributor', data);
    return Axios.put('distributor', data);
  },
  // 删除入库单
  inboundDel(data) {
    return Axios.delete('batch', { params: data });
  },
  // 入库单编号
  batchCode(data) {
    return Axios.post('batch/batchCode', data);
  },
  // 入库单详情
  inboundDetail(id, data) {
    return Axios.get(`batch/${id}`, { params: data });
  },
  // 下载入库单
  inboundDownload(data, api, warehouseID) {
    return Axios.get(`batch/${data}/download?api_token=${api}&warehouse_id=${warehouseID}`);
  },
  // 出库单列表
  outboundList(data) {
    return Axios.get('order', { params: data });
  },
  // 出库单详情
  outboundDetail(data, warehouseId) {
    return Axios.get(`order/${data}`, { params: warehouseId });
  },
  // 出库单添加
  outboundAdd(data) {
    return Axios.put('order', data);
  },
  // 货品分类详情
  getInfoCategoryType(data, warehouseId) {
    return Axios.get(`category/${data}`, { params: warehouseId });
  },
  // 删除货品分类
  delCategory(data) {
    return Axios.delete('category', { params: data });
  },
  // 拉取库存报警
  inventoryWarn() {
    return Axios.get('warning/stock');
  },
  // 编辑库存报警
  stockWarningAdd(data) {
    return Axios.post('warning/stock', data);
  },
  // 拉取保质期报警
  expirationWarn() {
    return Axios.get('warning/expiration');
  },
  // 编辑保质期报警
  expirationWarningAdd(data) {
    return Axios.post('warning/expiration', data);
  },
  // 拉取库存列表
  stockList(data) {
    return Axios.get('stockList', { params: data });
  },
  // 出入库详情
  inventoryDetail(data) {
    return Axios.get('stock/log', { params: data });
  },
  // 拉取库存报警
  noticeList() {
    return Axios.get('home/notice');
  },
  // 首页仓库数据
  homeWarehouseData(data) {
    return Axios.get('home/analyze', { params: data });
  },
  // 首页图表数据
  echartsData(data) {
    return Axios.get('home/analyzeTable', { params: data });
  },
  // 员工列表
  staffList(data) {
    return Axios.get('employee', { params: data });
  },
  // 员工添加
  staffAdd(data, type) {
    if (type) return Axios.post('employee', data);
    return Axios.put('employee', data);
  },
  // 员工组列表
  warehouseRole(data) {
    return Axios.get(`warehouse/${data}/role`);
  },
  // 添加员工
  AddwarehouseEmployee(data) {
    return Axios.put(`warehouse/${data.warehouse_id}/employee`, data);
  },
  // 员工列表
  warehouseEmployee(data) {
    return Axios.get(`warehouse/${data.warehouse_id}/employee`, { params: data });
  },
  // 删除员工
  delWarehouseEmployee(data) {
    return Axios.delete(`warehouse/${data.warehouse_id}/employee`, { params: data });
  },
  // 添加备用员工
  addSpareEmployee(data) {
    return Axios.put(`warehouse/${data.warehouse_id}/employee`, data);
  },
  // 发件人 - 列表
  senderList(data, type) {
    if (+type) {
      return Axios.get('sender', { params: data });
    }
    return Axios.get('receiver', { params: data });
  },
  // 发件人 - 添加
  addAddress(data, type) {
    if (type === 'addSender') {
      return Axios.put('sender', data);
    }
    return Axios.put('receiver', data);
  },
  // 地址 - 编辑
  editAddress(data, type) {
    if (type !== 'editAddressee') {
      return Axios.post('sender', data);
    }
    return Axios.post('receiver', data);
  },
  // 拉取默认
  isDefault(type) {
    if (+type) {
      return Axios.get('sender/default');
    }
    return Axios.get('/receiver/default');
  },
  // 设置默认
  setDefault(data, type) {
    if (+type) {
      return Axios.post(`sender/${data}/setDefault`);
    }
    return Axios.post(`/receiver/${data}/setDefault`);
  },
  // 地址信息
  senderInfo(data, type) {
    if (type !== 'editAddressee') {
      return Axios.get(`sender/${data}`, { params: data });
    }
    return Axios.get(`receiver/${data}`, { params: data });
  },
  // 地址信息
  delAddress(data, type) {
    if (+type) {
      return Axios.delete('sender', { params: data });
    }
    return Axios.delete('receiver', { params: data });
  },
  // 地址信息
  getTrackInfo(data) {
    return Axios.post('getTrackInfo', data);
  },
  // 获取分类列表
  categoriesList(data) {
    return Axios.get('category', { params: data });
  },
  // 获取sku出入库记录
  skuInfo(data) {
    return Axios.get('stock/log/sku', { params: data });
  },
  // 导出库存
  ExportStock(data, type) {
    if (type) {
      return Axios.get('stock/export', { params: data });
    }
    return Axios.get('stock/export-sku', { params: data });
  },
  // 同步订单
  synchronousOrder(data) {
    console.log(data);
    return Axios.post('order/status/push', data);
  },
};

export default $http;
