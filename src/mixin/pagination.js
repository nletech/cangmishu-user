export default {
  // 这个函数用于响应分页处理
  /**
   * @params
   *  params 用于 el-pagination 的初始化数据
   * handler(val) 用于处理分页请求 和 列表双向通信, val 是列表传入的数据
  */
 methods: {
   handlerPaginations(val) {
    console.log(val, '列表传进来的处理函数');
   }, // 处理分页
 }
}