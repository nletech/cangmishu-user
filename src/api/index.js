import Axios from '@/lib/axios/config';

const $http = {
  getVerificationEmailCode(data) {
    return Axios.post('/emailCode', data);
  }, // 获取验证码
  getVerificationPhoneCode(data) {
    return Axios.post('/smsCode', data);
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
  resetPwdEnd(data) {
    return Axios.post('/user/resetPassword', data);
  }, // 重置密码
  forgetPwd(data) {
    return Axios.post('/user/forgetPassword', data);
  },
  // 首页
  // 首页仓库数据
  homeWarehouseData(data) {
    return Axios.get('home/analyze', { params: data });
  },
  // 首页图表数据
  echartsData(data) {
    return Axios.get('home/analyzeTable', { params: data });
  },
  // 入库
  //                                    入库单列表
  addInbound(data) {
    return Axios.post('/batch', data);
  }, // 添加入库单
  getInbounds(data) {
    return Axios.get('/batch', { params: data });
  }, // 获取入库单列表
  getInboundPage(data) {
    return Axios.get('/batch', { params: data });
  }, // 入库单列表(分页查询和其他查询符合接口)
  getInboundDetail(id, data) {
    return Axios.get(`/batch/${id}`, { params: data });
  }, // 获取单个入库单
  deleteInbound(id) {
    return Axios.delete(`/batch/${id}`);
  }, // 删除入库单
  editInbound(id, data) {
    return Axios.put(`/batch/${id}`, data);
  }, // 编辑入库单
  toInbound(data) {
    return Axios.post('/batch/shelf', data);
  }, // 入库单上架
  downloadInbound(id, template) {
    return Axios.get(`/batch/${id}/download/${template}`);
  }, // 入库单下载
  previewInbound(id, template) {
    return Axios.get(`/batch/${id}/pdf/${template}`);
  }, // 入库单预览(查看详情)
  checkSku(skuId, data) {
    return Axios.get(`/stock/sku/${skuId}`, { params: data });
  }, // 扫描sku获取库存详情
  //                                                          出库
  //                                    出库单列表
  addSaleList(data) {
    return Axios.post('/order', data);
  }, // 新增出库单
  getOutbound(data) {
    return Axios.get('/order', { params: data });
  }, // 获取出库单列表
  getOutboundTypes() {
    return Axios.get('/order/status');
  }, // 获取出库单列表
  cancelOutbound(id, data) {
    return Axios.put(`/order/cancel/${id}`, data);
  }, // 取消出库单(取消订单)
  checkedOutbound(data) {
    return Axios.post('/order/out', data);
  }, // 出库单出库（设为出库）
  editOutbound(id, data) {
    return Axios.put(`/order/data/${id}`, data);
  }, // 编辑出库单
  checkOrder(data) {
    return Axios.get('/order', { params: data });
  }, // 分页查询--出库单分类
  queryOrder(data) {
    return Axios.get('/order', { params: data });
  }, // 出库单查询接口
  getOutboundDetail(id) {
    return Axios.get(`/order/${id}`);
  }, // 编辑出库单
  //                                                          库存
  //                                            货品管理
  getProducts(data) {
    return Axios.get('/products', { params: data });
  }, // 获取货品列表
  getProductsPage(data) {
    return Axios.get('/products', { params: data });
  }, // 分页
  queryProducts(data) {
    return Axios.get('/products', { params: data });
  }, // 查询货品
  getAProducts(id, data) {
    return Axios.get(`/products/${id}`, { params: data });
  }, // 获取单个货品
  addProducts(data) {
    return Axios.post('/products', data);
  }, // 添加货品
  editProducts(id, data) {
    return Axios.put(`/products/${id}`, data);
  }, // 编辑货品
  deleteProducts(id) {
    return Axios.delete(`/products/${id}`);
  }, // 删除货品
  importProducts(data) {
    return Axios.post('/products/import', data);
  }, // 导入货品
  importSpecs(data) {
    return Axios.post('/specs/import', data);
  }, // 导入货品规格
  deleteSpecs(id) {
    return Axios.delete(`/specs/${id}`);
  }, // 删除货品规格
  querySpecs(data) {
    return Axios.get('/specs', { params: data });
  }, // 查询规格商品
  //                                               库存盘点
  queryInventory(data) {
    return Axios.get('stock/code', { params: data });
  }, // 通过输入 sku 查询商品
  queryInboundOutboundRecord(id, data) {
    return Axios.get(`stock/sku/log/${id}`, { params: data });
  },
  editInventory(id, data) {
    return Axios.put(`/stock/${id}`, data);
  },
  //                                               库存管理
  getStocks(data) {
    return Axios.get('/stock', { params: data });
  }, // 获取库存列表
  editStock(id, data) {
    return Axios.put(`/stock/${id}`, { params: data });
  }, // 编辑库存(盘点)
  getStockLogs(id, data) {
    return Axios.get(`/stock/spec/log/${id}`, { params: data });
  }, // 获取库存列表(复合分页查询)
  queryGoodsRecord(id, data) {
    return Axios.get(`stock/sku/log/${id}`, { params: data });
  }, // 特定sku出入库记录(规格详情)
  //                                               库存报警
  addWarning(data) {
    return Axios.post('/warning', data);
  }, // 添加库存报警
  deleteWarning(data) {
    return Axios.delete('/warning', { params: data });
  }, // 删除库存报警
  getWarning() {
    return Axios.get('/warning');
  }, // 获取库存报警详情
  //                                                          员工
  //                                              员工列表
  addStaff(data) {
    return Axios.post('/employee', data);
  }, // 添加员工
  getStaffs(data) {
    return Axios.get('/employee', { params: data });
  }, // 获取员工列表
  editStaffInfo(id, data) {
    return Axios.put(`/employee/${id}`, data);
  }, // 编辑员工资料
  modifyStaffPsw(id, data) {
    return Axios.post(`/user/${id}/password`, data);
  }, // 修改员工密码
  delStaff(id) {
    return Axios.delete(`/employee/${id}`);
  }, // 删除员工
  forbidStaff(id, data) {
    return Axios.post(`/employee/${id}/lock`, data);
  }, // 禁止员工登录
  //                                              员工组列表
  addStaffGroup(data) {
    return Axios.post('/group', data);
  }, // 添加员工组
  editStaffGroup(id, data) {
    return Axios.put(`/group/${id}`, data);
  }, // 编辑员工组
  deleteStaffGroup(id) {
    return Axios.delete(`/group/${id}`);
  }, // 删除员工组
  getStaffGroups(data) {
    return Axios.get('/group', { params: data });
  }, // 获取员工组列表(耦合了分页查询接口)
  addStaffTo(data) {
    return Axios.post('/relation', data);
  }, // 添加员工至分组
  getStaffDetail(id) {
    return Axios.get(`/group/${id}`);
  }, // 获取员工分组详情(权限)
  addStaffGroupDetail(data) {
    return Axios.post('/privilege', data);
  }, // 添加员工分组权限
  deleteStaffInGroup(data) {
    return Axios.delete('/relation', { params: data });
  }, // 从分组删除员工
  getThisGroupStaffs(data) {
    return Axios.get('/employee', { params: data });
  }, // 获取该分组下的员工列表
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
  deleteWarehouse(id) {
    return Axios.delete(`/warehouses/${id}`);
  }, // 删除仓库
  setDefaultWarehouse(id) {
    return Axios.post(`/warehouses/default/${id}`);
  }, // 设为默认仓库
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
    return Axios.post('/senderAddress', data, { isBtnLoading: true });
  }, // 添加发件人信息
  getSenderAddress(data) {
    return Axios.get('/senderAddress', { params: data });
  }, // 获取发件人信息列表
  getASenderAddress(id) {
    return Axios.get(`/senderAddress/${id}`);
  }, // 获取单个发件人信息
  editSenderAddress(id, data) {
    return Axios.put(`/senderAddress/${id}`, data, { isBtnLoading: true });
  }, // 编辑发件人
  checkSenderAddress(data) {
    return Axios.get('/senderAddress', { params: data });
  }, // 发件人分页查询
  deleteSender(id) {
    return Axios.delete(`/senderAddress/${id}`);
  }, // 删除发件人
  addReceiverAddress(data) {
    return Axios.post('/receiverAddress', data, { isBtnLoading: true });
  }, // 添加收件人信息
  getReceiverAddress(data) {
    return Axios.get('/receiverAddress', { params: data });
  }, // 获取收件人信息列表
  getAReceiverAddress(id) {
    return Axios.get(`/receiverAddress/${id}`);
  }, // 获取单个收件人信息
  editReceiverAddress(id, data) {
    return Axios.put(`/receiverAddress/${id}`, data, { isBtnLoading: true });
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
  getDistributor(data) {
    return Axios.get('/distributor', { params: data });
  }, // 获取供应商列表
  checkDistributor(data) {
    return Axios.get('/distributor', { params: data });
  }, // 分页查询供应商
  queryDistributor(data) {
    return Axios.get('/distributor', { params: data });
  }, // 分页查询供应商
  deleteDistributor(id) {
    return Axios.delete(`/distributor/${id}`);
  }, // 删除供应商
  editDistributor(id, data) {
    return Axios.put(`/distributor/${id}`, data);
  }, // 编辑供应商
  //                                                            设置-货品分类管理
  getCategoryManagement(data) {
    return Axios.get('/categories', { params: data });
  }, // 获取货品分类列表
  addCategoryManagement(data) {
    return Axios.post('/categories', data);
  }, // 添加货品分类列表
  checkCategoryManagement(data) {
    return Axios.get('/categories', { params: data });
  }, // 分页查询货品分类列表
  editCategoryManagement(id, data) {
    return Axios.put(`/categories/${id}`, data);
  }, // 编辑货品分类信息
  deleteCategoryManagement(id) {
    return Axios.delete(`/categories/${id}`);
  }, // 删除货品分类信息
  //                                                            设置-出入库分类
  //                               入库单分类
  getBatchType(data) {
    return Axios.get('/batchType', { params: data });
  }, // 获取入库单分类
  getBatchCode(data) {
    return Axios.post('/batchCode', data);
  }, // 入库单号
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
  getOrderType(data) {
    return Axios.get('/orderType', { params: data });
  }, // 获取出库单分类列表
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
  // 辅助功能
  modifyPsw(id, data) {
    return Axios.post(`user/${id}/password`, data);
  }, // 修改密码
  modifyUserInfo(id, data) {
    return Axios.post(`user/${id}/info`, data);
  }, // 修改用户信息
  modifyUserAvatar(id, data) {
    return Axios.post(`user/${id}/avatar`, data);
  }, // 修改头像
  Warning(data) {
    return Axios.get('warning', { params: data });
  }, // 已设置的库存报警信息
  // 店铺管理
  getShops(data) {
    return Axios.get('shop/', { params: data });
  }, // 创建店铺
  addNewShop(data) {
    return Axios.post('shop/', data);
  }, // 创建店铺
  editShop(id, data) {
    return Axios.put(`shop/${id}`, data);
  }, // 编辑店铺信息
  deleteShop(id) {
    return Axios.delete(`shop/${id}`);
  }, // 删除店铺
  detailShop(id) {
    return Axios.get(`shop/${id}`);
  }, // 店铺详情
  goodsInShop(shopId, data) {
    return Axios.get(`shop/${shopId}/product`, { params: data });
  }, // 店铺商品列表
  goodsDetailInShop(shopId, goodsId) {
    return Axios.get(`shop/${shopId}/product/${goodsId}`);
  }, // 店铺商品详情
  deleteGoodsInShop(shopId, goodsId) {
    return Axios.delete(`shop/${shopId}/product/${goodsId}`);
  }, // 删除店铺商品
  shelvesStatus(shopId, data) {
    return Axios.put(`shop/${shopId}/product`, data);
  }, // 店铺商品是否上下架
  addGoodsToShop(shopId, data) {
    return Axios.post(`shop/${shopId}/product`, data);
  }, // 添加已有商品至店铺
  editGoodsInShop(shopId, goodsId, data) {
    return Axios.put(`shop/${shopId}/product/${goodsId}`, data);
  }, // 编辑店铺中已有的商品(详情)
  // ==== 新增
  editReceiveStatus(outBoundId) {
    return Axios.put(`order/completed/${outBoundId}`);
  }, // 确认签收
  AllExpress() {
    return Axios.get('open/express');
  }, // 快递公司列表
  changeOutboundStatus(outBoundId, data) {
    return Axios.put(`order/express/${outBoundId}`, data);
  }, // 更改发货状态(填写运单号)
  // 盘点新增
  checkStockList(data) {
    return Axios.get('recount', { params: data });
  }, // 盘点列表
  addCheckStock(data) {
    return Axios.post('recount', data);
  }, // 新增盘点
  checkStockDetail(StockId) {
    return Axios.get(`recount/${StockId}`);
  }, // 盘点清单详细
  queryLocations(data) {
    return Axios.post('specs/locations', data);
  }, // 通过规格查货位 id
  OutboundDetails(outboundId, template) {
    return Axios.get(`order/${outboundId}/pdf/${template}`);
  }, // 获取出库单 拣货单
  downloadOutboundDetails(outboundId, template) {
    return Axios.get(`order/${outboundId}/download/${template}`);
  }, // 下载出库单 拣货单
  Stockpreview(StockId) {
    return Axios.get(`recount/${StockId}/pdf/`);
  }, // 获取出库单 拣货单
  exportOrder(data) {
    return Axios.get('order/export/', { params: data });
  }, // 导出出库单
  payStatus() {
    return Axios.get('order/pay/status');
  }, // 支付状态列表
  payTypes() {
    return Axios.get('order/pay/type');
  }, // 支付方式列表
  ChangPayment(OrderId, data) {
    return Axios.put(`order/pay/${OrderId}`, data);
  }, // 支付方式列表
  stocktypes() {
    return Axios.get('stock/log/types');
  },
  openCaptcha() {
    return Axios.get('open/captcha');
  },
  getLoginQR() {
    return Axios.get('websiteConfig');
  },
  LoginQR() {
    return Axios.get('open/wechat/qr');
  },
  LoginQRCheck(data) {
    return Axios.get('open/wechat/scan/login_callback', { params: data, notNeedNprogress: true });
  },
  expLogin() {
    return Axios.post('expLogin');
  },
  // 采购模块
  purchaseList(data) {
    return Axios.get('purchase', { params: data });
  }, // 采购单列表(包含每条采购单详情)
  purchaseDetial(id, data) {
    return Axios.get(`purchase/${id}`, { params: data });
  }, // 采购单详情
  addPurchase(data) {
    return Axios.post('purchase', data);
  }, // 添加--采购单
  getPurchaseCode(data) {
    return Axios.get('purchaseCode', { params: data });
  }, // 获取--采购单编号
  editPurchase(id, data) {
    return Axios.put(`purchase/${id}`, data);
  }, // 修改--采购单
  delPurchase(id) {
    return Axios.delete(`purchase/${id}`);
  }, // 删除采购单
  downloadPurchase(id) {
    return Axios.get(`purchase/${id}/download`);
  }, // 下载采购单
  previewPurchase(id) {
    return Axios.get(`purchase/${id}/pdf`);
  }, // 预览采购单
  finishePurchase(id) {
    return Axios.post(`purchase/${id}/done`);
  }, // 设置采购单为完成
  PurchaseDetailData(id, data) {
    return Axios.get(`/purchase/item/${id}/logs`, { params: data });
  }, // 采购单单项详情
  finishePurchaseItem(id) {
    return Axios.post(`purchase/item/${id}/done`);
  }, // 采购单单项详情--设为到货
  editPurchaseItem(id, data) {
    return Axios.put(`purchase/item/${id}`, data);
  }, // 采购单单项详情--修改
  getUserInfo() {
    return Axios.get(`me`);
  },
  getHomeSaleData(params) {
    return Axios.get(`index/salesData`, { params });
  },
  getHomeStockData(params) {
    return Axios.get(`index/stockData`, { params });
  },
  getHomeTotalData() {
    return Axios.get(`index/totalData`);
  },
  getSaleTotalData() {
    return Axios.get(`sales/totalData`);
  },
  getSaleGraphData(params) {
    return Axios.get(`sales/graphData`, { params });
  },
  getSaleDetailData(params) {
    return Axios.get(`sales/detailData`, { params });
  },
  getCustomersData(params) {
    return Axios.get(`customers/dailyData`, { params });
  },
  getCustomersOrderRankData(params) {
    return Axios.get(`customers/orderRank`, { params });
  },
  getCustomersTotalData() {
    return Axios.get(`customers/totalData`);
  },
  getCustomersSupplierRankData() {
    return Axios.get(`customers/supplierRank`);
  },
  getStocksTotalData() {
    return Axios.get(`stocks/totalData`);
  },
  getStocksGraphData(params) {
    return Axios.get(`stocks/graphData`, { params });
  },
  getStocksRankData(params) {
    return Axios.get(`stocks/salesRank`, { params });
  },
  getStocksWarningData(params) {
    return Axios.get(`stocks/warningRank`, { params });
  }
};
export default $http;
