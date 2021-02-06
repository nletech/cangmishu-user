<template>
  <div :class="$style.main">
    <el-tabs tab-position="left" v-model="activeName">
      <el-tab-pane :label="$t('contactus')" name="help_tag">
        <div>
          <el-row>
            <el-col>
              <div :class="$style.api_text">
                <span>{{ $t('tips2') }}</span>
              </div>
              <div :class="$style.api_text" style="margin: 0 0 0 243px;">
                <img src="../../../src/assets/img/help.png" />
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('ApiDoucment')" name="api_tag">
        <div :class="$style.article_text">
          <span style="font-size: 1.2rem; color: #303133;"
            >仓秘书开发文档接口地址:&nbsp;&nbsp;&nbsp;&nbsp;</span
          ><a
            rel="noopener"
            target="_blank"
            href="https://www.eolinker.com/#/share/index?shareCode=eDeUap&tdsourcetag=s_pctim_aiomsg"
            >https://www.eolinker.com/#/share/index?shareCode=eDeUap&tdsourcetag=s_pctim_aiomsg</a
          >
          <el-collapse v-model="activeArticleNames">
            <el-collapse-item title="请求签名方式简介" name="1">
              <article>
                <article style="width: 80%;">
                  <div>
                    <p>第1章 引言</p>
                    <p><b>1.1 文档用途</b></p>
                    <p>
                      本文档描述了仓秘书数据服务开放平台接口，包括接口规范、具体接口的接口编码、
                      接口名称、功能描述、输入与输出参数定义，以供合作机构接入时使用。
                    </p>
                    <p><b>1.2 阅读对象 </b></p>
                    <p>本说明书的读者对象为软件设计人员、软件开发人员、软件测试人员等。</p>
                    <p><b>1.3 缩略语与名词解释</b></p>
                    <table style="width: 90%;">
                      <tbody>
                        <tr>
                          <td>缩略语</td>
                          <td>全称</td>
                          <td>简称</td>
                        </tr>
                        <tr>
                          <td>API</td>
                          <td>仓秘书API，指仓秘书开放平台对外的接口能力</td>
                          <td>开放平台</td>
                        </tr>
                        <tr>
                          <td>app_key</td>
                          <td>合作机构标识，用于调用接口时鉴权</td>
                          <td>app_key</td>
                        </tr>
                        <tr>
                          <td>app_secret</td>
                          <td>合作机构标识，用于调用接口时鉴权</td>
                          <td>app_secret</td>
                        </tr>
                        <tr>
                          <td>加密</td>
                          <td>指根据开放平台的签名规则，为报文设置签名</td>
                          <td>加签</td>
                        </tr>
                        <tr>
                          <td>验签</td>
                          <td>指根据签名规则，对请求签名进行验证</td>
                          <td>验签</td>
                        </tr>
                      </tbody>
                    </table>
                    <p><b>第2章 总体设计</b></p>
                    <p><b>2.1 接口形式</b></p>
                    <p>
                      接口协议使用 HTTPS，由服务提供方提供访问的 URL 规范，合作机构使用 HTTPS
                      POST/GET 方法发送请求并获取应答报文，合作机构作为服务提供方的 HTTPS 客户端，服
                      务提供方作为合作机构的 HTTPS 服务端，发起和返回报文统一使用 UTF-8
                      编码。外部调用 方与开放平台之间交互同步等待超时时间建议最大值设置为 10 秒。
                    </p>
                    <p>
                      本文档包含订单新增、查询接口、库存新增查询接口。同时也支持库存变化、订单变化自动推送给合作机构。
                    </p>
                    <p>可根据实际业务需求选择接入，并获取对应的数据服务。</p>
                    <p><b>2.2 接入流程 </b></p>
                    <p>具体接入流程可以找客服申请，一个仓库可以免费申请一个。</p>
                    <p><b>2.3 接口接入描述 </b></p>
                    <p><b>2.3.1 接入报文</b></p>
                    <p>接入报文分为包头和包体两部分:包头为固定格式，包体为业务接口的请求参数。</p>
                    <p><b>2.3.1.1 包头为固定格式(适用所有接口)</b></p>
                    <table style="width: 90%;">
                      <tbody>
                        <tr>
                          <td>名称</td>
                          <td>参数</td>
                          <td>必须</td>
                          <td>参数说明</td>
                        </tr>
                        <tr>
                          <td>来源应用标识</td>
                          <td>app_key</td>
                          <td>Y</td>
                          <td>由仓秘书分配的app_key, 例如：W001</td>
                        </tr>
                        <tr>
                          <td>时间戳</td>
                          <td>timestamp</td>
                          <td>Y</td>
                          <td>毫秒数，例如:1567081794，13 位毫秒数</td>
                        </tr>
                        <tr>
                          <td>签名</td>
                          <td>sign</td>
                          <td>Y</td>
                          <td>签名，例如:12CB4D809B373A54504C29360D819C24, 只支持MD5</td>
                        </tr>
                        <tr>
                          <td>类型</td>
                          <td>method</td>
                          <td>Y</td>
                          <td>推送类型，分别是stockChange、orderCancel、orderShipped</td>
                        </tr>
                      </tbody>
                    </table>
                    <p><br /></p>
                    <p><b>2.3.2 调用报文样例</b></p>
                    <p>
                      <a
                        href="https://api.cangmishu.com/open/api/stock/spec?app_key=K0*5&amp;timestamp=1567081963&amp;code=KG1Z%2CKG2Z&amp;sign=e2983dcd*****b5cad535d3**6020"
                        target="_blank"
                        >https://api.cangmishu.com/open/api/stock/spec?app_key=K0*5&times;tamp=1567081963&amp;code=KG1Z%2CKG2Z&amp;sign=e2983dcd*****b5cad535d3**6020</a
                      >
                    </p>
                    <p><b>2.3.3 返回报文结构</b></p>
                    <table style="width: 90%;">
                      <tbody>
                        <tr>
                          <td>名称</td>
                          <td>参数</td>
                          <td>类型</td>
                          <td>参数说明</td>
                        </tr>
                        <tr>
                          <td>响应编码</td>
                          <td>status</td>
                          <td>int</td>
                          <td>开放平台返回的响应编码，分别是200成功，500失败，401权限不足</td>
                        </tr>
                        <tr>
                          <td>响应描述</td>
                          <td>msg</td>
                          <td>string</td>
                          <td>响应描述，例如:调用成功、服务不可用或未授权等</td>
                        </tr>
                        <tr>
                          <td>响应包体</td>
                          <td>data</td>
                          <td>json</td>
                          <td>详细数据</td>
                        </tr>
                      </tbody>
                    </table>
                    <p><b>2.3.4 签名 SIGN 机制</b></p>
                    <p>
                      调用接口时需要对请求包头参数进行签名验证，服务器也会对该请求参数进行验证是否
                      合法的。过程如下:根据包头参数名称将所有请求参数按照字母先后顺序排序，如:将入参
                      foo=1, bar=2, baz=3 排序为
                      bar=2,baz=3,foo=1;再将参数名和参数值连接后，得到拼装后的 字符串 bar2baz3foo1。
                    </p>
                    <p>系统支持 MD5 加密方式:</p>
                    <p>MD5:将 app_secret 拼接到参数字符串头尾进行 MD5 加密，格式为:</p>
                    <p>MD5(app_secretkey1=value1&amp;key2=value2...)</p>
                    <p><b>2.3.4.1 生成签名步骤</b></p>
                    <p><b>拼装请求 </b></p>
                    <p>timestamp=1567081963</p>
                    <p>app_key=key****a60d</p>
                    <p>sku=A01 &lt;-这里为实际接口所需要参数,</p>
                    <p><b>按首字母升序排列</b></p>
                    <p>app_key=key****a60d</p>
                    <p>sku=A01</p>
                    <p>timestamp=1567081963</p>
                    <p><b>连接字符串</b></p>
                    <p>app_key=key****a60d&amp;sku=A01&times;tamp=1567081963</p>
                    <p><b>生成签名</b></p>
                    <p>*app_secret 为你的实际KEY</p>
                    <p>MD5(app_secretapp_key=key****a60d&amp;sku=A01&times;tamp=1567081963)</p>
                    <p><b>2.3.5 注意事项</b></p>
                    <p>
                      所有的请求和响应数据编码皆为 UTF-8 格式。查询类接口建议用 GET 请求，交易等隐
                    </p>
                    <p>私信息查询和修改类接口建议用 POST 请求。</p>
                    <p><br /></p>
                  </div>
                </article>
              </article>
            </el-collapse-item>
            <el-collapse-item title="推送签名方式简介" name="2">
              <article>
                <article style="width: 80%;">
                  <div>
                    <p>第1章 引言</p>
                    <p><b>1.1 文档用途</b></p>
                    <p>
                      本文档描述了仓秘书数据服务开放平台推送给第三方接口，包括接口规范、具体接口的接口编码、
                      接口名称、功能描述、输入与输出参数定义，以供合作机构接入时使用。
                    </p>
                    <p><b>1.2 阅读对象 </b></p>
                    <p>本说明书的读者对象为软件设计人员、软件开发人员、软件测试人员等。</p>
                    <p><b>1.3 缩略语与名词解释</b></p>
                    <table style="width: 90%;">
                      <tbody>
                        <tr>
                          <td>缩略语</td>
                          <td>全称</td>
                          <td>简称</td>
                        </tr>
                        <tr>
                          <td>API</td>
                          <td>仓秘书API，指仓秘书开放平台对外的接口能力</td>
                          <td>开放平台</td>
                        </tr>
                        <tr>
                          <td>app_key</td>
                          <td>合作机构标识，用于调用接口时鉴权</td>
                          <td>app_key</td>
                        </tr>
                        <tr>
                          <td>app_secret</td>
                          <td>合作机构标识，用于调用接口时鉴权</td>
                          <td>app_secret</td>
                        </tr>
                        <tr>
                          <td>加密</td>
                          <td>指根据开放平台的签名规则，为报文设置签名</td>
                          <td>加签</td>
                        </tr>
                        <tr>
                          <td>验签</td>
                          <td>指根据签名规则，对请求签名进行验证</td>
                          <td>验签</td>
                        </tr>
                      </tbody>
                    </table>
                    <p><b>第2章 总体设计</b></p>
                    <p><b>2.1 接口形式</b></p>
                    <p>
                      接口协议使用 HTTPS，由服务提供方提供访问的 URL 规范，合作机构使用 HTTPS
                      POST/GET 方法发送请求并获取应答报文，合作机构作为服务提供方的 HTTPS 客户端，服
                      务提供方作为合作机构的 HTTPS 服务端，发起和返回报文统一使用 UTF-8
                      编码。外部调用 方与开放平台之间交互同步等待超时时间建议最大值设置为 10 秒。
                    </p>
                    <p>
                      本文档包含订单新增、查询接口、库存新增查询接口。同时也支持库存变化、订单变化自动推送给合作机构。
                    </p>
                    <p>可根据实际业务需求选择接入，并获取对应的数据服务。</p>
                    <p><b>2.2 接入流程 </b></p>
                    <p>具体接入流程可以找客服申请，一个仓库可以免费申请一个。</p>
                    <p><b>2.3 接口接入描述 </b></p>
                    <p><b>2.3.1 接入报文</b></p>
                    <p>接入报文分为包头和包体两部分:包头为固定格式，包体为业务接口的请求参数。</p>
                    <p><b>2.3.1.1 包头为固定格式(适用所有接口)</b></p>
                    <table style="width: 90%;">
                      <tbody>
                        <tr>
                          <td>名称</td>
                          <td>参数</td>
                          <td>必须</td>
                          <td>参数说明</td>
                        </tr>
                        <tr>
                          <td>来源应用标识</td>
                          <td>app_key</td>
                          <td>Y</td>
                          <td>由仓秘书分配的app_key, 例如：W001</td>
                        </tr>
                        <tr>
                          <td>时间戳</td>
                          <td>timestamp</td>
                          <td>Y</td>
                          <td>毫秒数，例如:1567081794，13 位毫秒数</td>
                        </tr>
                        <tr>
                          <td>签名</td>
                          <td>sign</td>
                          <td>Y</td>
                          <td>签名，例如:12CB4D809B373A54504C29360D819C24, 只支持MD5</td>
                        </tr>
                        <tr>
                          <td>类型</td>
                          <td>method</td>
                          <td>Y</td>
                          <td>推送类型，分别是stockChange、orderCancel、orderShipped</td>
                        </tr>
                      </tbody>
                    </table>
                    <p><br /></p>
                    <p><b>2.3.2 调用报文样例</b></p>
                    <p>
                      http(s)://第三方回调网址<a
                        href="https://api.cangmishu.com/open/api/stock/spec?app_key=K0*5&amp;timestamp=1567081963&amp;code=KG1Z%2CKG2Z&amp;sign=e2983dcd*****b5cad535d3**6020"
                        target="_blank"
                        >?app_key=K0*5&times;tamp=1567081963&amp;method=stockChange&amp;sign=e2983dcd*****b5cad535d3**6020</a
                      >
                    </p>
                    <p><b>2.3.3 返回报文结构</b></p>
                    <table style="width: 90%;">
                      <tbody>
                        <tr>
                          <td>名称</td>
                          <td>参数</td>
                          <td>类型</td>
                          <td>参数说明</td>
                        </tr>
                        <tr>
                          <td>响应状态码</td>
                          <td>status</td>
                          <td>int</td>
                          <td>200代码成功，其他为不成功</td>
                        </tr>
                      </tbody>
                    </table>
                    <p><b>2.3.4 签名 SIGN 机制</b></p>
                    <p>
                      验证调用接口时需要对请求包头参数进行签名验证，服务器也会对该请求参数进行验证是否
                      合法的。过程如下:根据包头参数名称将所有请求参数按照字母先后顺序排序，如:将入参
                      foo=1, bar=2, baz=3 排序为
                      bar=2,baz=3,foo=1;再将参数名和参数值连接后，得到拼装后的 字符串 bar2baz3foo1。
                    </p>
                    <p>系统支持 MD5 加密方式:</p>
                    <p>MD5:将 app_secret 拼接到参数字符串头尾进行 MD5 加密，格式为:</p>
                    <p>MD5(app_secretkey1=value1&amp;key2=value2...)</p>
                    <p><b>2.3.4.1 生成签名步骤</b></p>
                    <p><b>拼装请求 </b></p>
                    <p>timestamp=1567081963</p>
                    <p>app_key=key****a60d</p>
                    <p>sku=A01 &lt;-这里为实际接口所需要参数,</p>
                    <p><b>按首字母升序排列</b></p>
                    <p>app_key=key****a60d</p>
                    <p>sku=A01</p>
                    <p>timestamp=1567081963</p>
                    <p><b>连接字符串</b></p>
                    <p>app_key=key****a60d&amp;sku=A01&times;tamp=1567081963</p>
                    <p><b>生成签名</b></p>
                    <p>*app_secret 为你的实际KEY</p>
                    <p>MD5(app_secretapp_key=key****a60d&amp;sku=A01&times;tamp=1567081963)</p>
                    <p><b>2.3.5 注意事项</b></p>
                    <p>
                      所有的请求和响应数据编码皆为 UTF-8 格式。查询类接口建议用 GET 请求，交易等隐
                    </p>
                    <p>私信息查询和修改类接口建议用 POST 请求。</p>
                    <p><b>第3章 推送接口</b></p>
                    <p>
                      根据合作机构提供的 URL 进行推送，如推送失败会立即重试;如仍然失败则每隔 30
                      秒重试，最多重试 3 次
                    </p>
                    <p><b>3.1 库存变动</b></p>
                    <p>接口类型： stockChange 接口描述：当库存发生变化时进行推送提醒</p>
                    <p>业务输出参数</p>
                    <table class="" style="width: 90%;">
                      <tbody>
                        <tr>
                          <td>名称</td>
                          <td>参数</td>
                          <td>类型</td>
                          <td>参数说明</td>
                        </tr>
                        <tr>
                          <td>SKU编码</td>
                          <td>sku</td>
                          <td>String</td>
                          <td>根据货品库规格编码</td>
                        </tr>
                        <tr>
                          <td>数量</td>
                          <td>qty</td>
                          <td>Int</td>
                          <td>最终的数量</td>
                        </tr>
                      </tbody>
                    </table>
                    <p><b>3.2 销售单取消</b></p>
                    <p style="color: rgb(51, 51, 51); font-family:">
                      接口类型： orderCancel
                      接口描述：订单取消，只能请求一次，只能在仓库未拣货的时候取消，其它状态不支持
                    </p>
                    <p style="color: rgb(51, 51, 51); font-family:">业务输出参数</p>
                    <table style="color: rgb(51, 51, 51); width: 90%;">
                      <tbody>
                        <tr>
                          <td>名称</td>
                          <td>参数</td>
                          <td>类型</td>
                          <td>参数说明</td>
                        </tr>
                        <tr>
                          <td>外部编码</td>
                          <td>out_sn</td>
                          <td>String</td>
                          <td>通过API下单时的编码</td>
                        </tr>
                        <tr>
                          <td><br /></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                    <p><b>3.3 发货成功</b></p>
                    <p style="color: rgb(51, 51, 51); font-family:">
                      接口类型： orderShipped 接口描述：订单发货，当仓库填了发货的快递公司后触发
                    </p>
                    <p style="color: rgb(51, 51, 51); font-family:">业务输出参数</p>
                    <table style="width: 90%;">
                      <tbody>
                        <tr>
                          <td>名称</td>
                          <td>参数</td>
                          <td>类型</td>
                          <td>参数说明</td>
                        </tr>
                        <tr>
                          <td>外部编码</td>
                          <td>out_sn</td>
                          <td>String</td>
                          <td>通过API下单时的编码</td>
                        </tr>
                        <tr>
                          <td>快递公司类型</td>
                          <td>express_code</td>
                          <td>String</td>
                          <td>快递公司类型，如ems、yuantong</td>
                        </tr>
                        <tr>
                          <td>快递公司单号</td>
                          <td>express_num</td>
                          <td>String</td>
                          <td>快递单号，如123123123123123213</td>
                        </tr>
                      </tbody>
                    </table>
                    <p><br /></p>
                  </div>
                </article>
              </article>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'help',
  data() {
    return {
      activeName: 'help_tag',
      activeArticleNames: ''
    };
  }
};
</script>

<style lang="less" module>
.main {
  margin: 50px 50px 0 50px;
  background-color: #fff !important;
  table {
    border-collapse: collapse;
  }
  td {
    border: 1px solid #ccc;
    padding: 3px 5px;
    min-width: 50px;
    height: 20px;
  }
  a {
    outline: none;
  }
}
.api_text {
  text-align: left;
  font-size: 1.2rem;
  margin: 0 0 20px 20px;
}
.article_text {
  margin: 0 0 0 20px;
}
</style>
<style>
.el-collapse-item__header {
  font-size: 1.2rem;
}
</style>
