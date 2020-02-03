<template>
    <div :class="$style.outboundList">
        <div  :class="$style.outboundList_main">
            <el-row :class="$style.outboundList_tags">
                <outbound-list-search
                    @data_cb="handlerCallBackData"
                    @queryParams="handlerQueryParams">
                </outbound-list-search>
            </el-row>
            <el-row>
                <el-col :span="2" :offset="19">
                    <el-button
                        size="small"
                        :disabled="isDisabled"
                        @click="handlerExportOrder">
                        {{$t('Export')}}
                    </el-button>
                </el-col>
                <el-col :span="2" :offset="1">
                    <el-button
                        type="text"
                        :class="$style.btn"
                        @click="addOutbound"
                        icon="el-icon-plus">
                        {{$t('addOutbound')}}
                    </el-button>
                </el-col>
            </el-row>
            <el-table
                element-loading-text="loading"
                v-loading="isButtonLoading"
                stripe
                :data="outbound_list_data"
                border>
                <el-table-column
                    label="#"
                    header-align="center"
                    align="center"
                    type="index">
                </el-table-column>
                <el-table-column
                    :label="$t('outboundNumber')"
                    header-align="center"
                    align="center"
                    width="200"
                    prop="out_sn">
                    <template slot-scope="scope">
                      <span>{{scope.row.out_sn}}</span>
                      <el-tooltip
                          effect="light"
                          :content="$t('paid')"
                          style="cursor: pointer;"
                          placement="top">
                          <i v-if="scope.row.pay_status === 2" style="position: relative; left: 10px; color: red; font-weight: 400;" class="iconfont">&#xe668;</i>
                      </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('Status')"
                    header-align="center"
                    align="center"
                    prop="status_name">
                </el-table-column>
                <el-table-column
                    :label="$t('expressOrder')"
                    header-align="center"
                    align="center"
                    width="120"
                    prop="express_num">
                </el-table-column>
                <el-table-column
                    prop="source"
                    :label="$t('orderSources')"
                    width="120"
                    header-align="center"
                    align="center" >
                </el-table-column>
                <el-table-column
                    :label="$t('outboundType')"
                    header-align="center"
                    align="center"
                    prop="order_type.name"
                    width="160">
                </el-table-column>
                <el-table-column
                    :label="$t('OrderQty')"
                    header-align="center"
                    align="center"
                    prop="sub_order_qty">
                </el-table-column>
                <el-table-column
                    :label="$t('OutboundQuantity')"
                    header-align="center"
                    align="center"
                    prop="sub_pick_num">
                </el-table-column>
                <el-table-column
                    :label="$t('OutboundDate')"
                    header-align="center"
                    align="center"
                    prop="delivery_date" width="100">
                </el-table-column>
                <el-table-column
                    :label="$t('CreateTime')"
                    header-align="center"
                    align="center"
                    prop="created_at" width="155">
                </el-table-column>
                <el-table-column
                    :label="$t('operation')"
                    header-align="center"
                    width="200">
                    <template slot="header">
                        <span>{{$t('operation')}}</span>
                        <el-popover
                            placement="top-start"
                            title="Tips:"
                            width="360"
                            trigger="hover">
                            <span>{{$t('outboundTips')}}</span>
                            <el-button size="mini" type="text" slot="reference" icon="el-icon-question"></el-button>
                        </el-popover>
                    </template>
                    <template slot-scope="scope">
                      <el-tooltip :content="$t('detail')" placement="top">
                          <el-button
                              style="margin: 8px 0 0 0;"
                              size="mini" icon="el-icon-view" round
                              @click="viewDetails(scope.row)"
                              :loading="isButtonLoading">
                          </el-button>
                      </el-tooltip>
                      <el-tooltip :content="$t('CheckOrder')" placement="top">
                          <el-button
                            v-if="scope.row.status === 1"
                            style="margin: 8px 0 0 0;"
                            size="mini" type="primary"
                            icon="el-icon-sell"
                            :loading="isButtonLoading"
                            @click="checkedOutbound(scope.row)"
                            round>
                          </el-button>
                      </el-tooltip>
                      <el-tooltip :content="$t('PrintPicking')" placement="top">
                            <el-button
                                v-if="scope.row.status === 4 || scope.row.status === 5 || scope.row.status === 7"
                                style="margin: 8px 0 0 0;"
                                size="mini"
                                icon="el-icon-printer"
                                :loading="isButtonLoading"
                                @click="onPrint(scope.row)" round>
                            </el-button>
                      </el-tooltip>
                      <el-tooltip :content="$t('cancelOrder')" placement="top">
                          <el-button
                              v-if="scope.row.status === 1"
                              style="margin: 8px 0 0 0;"
                              size="mini"
                              icon="el-icon-circle-close"
                              :loading="isButtonLoading"
                              @click="cancelOrder(scope.row)"
                              type="danger" round>
                          </el-button>
                      </el-tooltip>
                      <el-tooltip :content="$t('Track')" placement="top">
                          <el-button
                              v-if="scope.row.status === 4 || scope.row.status === 5"
                              style="margin: 8px 0 0 0;"
                              size="mini"
                              icon="el-icon-truck"
                              :loading="isButtonLoading"
                              @click="showExpressDialog(scope.row)" round>
                          </el-button>
                      </el-tooltip>
                      <el-tooltip :content="$t('Signing')" placement="top">
                            <el-button
                                v-if="scope.row.status === 5"
                                style="margin: 8px 0 0 0;"
                                size="mini"
                                icon="el-icon-finished"
                                :loading="isButtonLoading"
                                @click="showReceviceDialog(scope.row)" round>
                            </el-button>
                      </el-tooltip>
                      <el-tooltip :content="$t('Trace')" placement="top">
                            <el-button
                                v-if="scope.row.status === 5"
                                style="margin: 8px 0 0 0;"
                                size="mini"
                                icon="el-icon-position"
                                :loading="isButtonLoading"
                                @click="handlerTrack(scope.row)" round>
                            </el-button>
                      </el-tooltip>
                      <el-tooltip :content="$t('Paid2')" placement="top">
                            <el-button
                                v-if="scope.row.status === 1 ||scope.row.status === 4 || scope.row.status === 5 || scope.row.status === 7"
                                style="margin: 8px 0 0 0;"
                                size="mini"
                                icon="el-icon-money"
                                :loading="isButtonLoading"
                                @click="onPayment(scope.row)" round>
                            </el-button>
                      </el-tooltip>
                      <!-- 确认签收 -->
                      <el-dialog
                        align="center"
                        :visible.sync="receviceDialog"
                        width="20%">
                        <div>
                          <span style="font-size: 1.4rem;">{{$t('Submit')}} ?</span>
                        </div>
                        <span slot="footer" class="dialog-footer">
                          <el-button
                              @click="receviceDialog = false"
                              :loading="isButtonLoading"
                              size="small">
                              {{$t('cancel')}}
                          </el-button>
                          <el-button
                              type="primary"
                              :loading="isButtonLoading"
                              @click="confirmRecevice()"
                              size="small">
                              {{$t('confirm')}}
                          </el-button>
                        </span>
                      </el-dialog>
                      <!-- 确认签收 -->
                      <el-dialog
                        :title="$t('EditTrack')"
                        :visible.sync="expressDialog"
                        width="60%">
                        <el-row>
                          <el-col :span="18" :offset="3">
                            <el-form
                                :model="expressForm"
                                :rules="rules"
                                label-width="160px">
                                <el-form-item :label="$t('DeliveryCompany')">
                                    <el-select v-model="expressForm.express_code" :placeholder="$t('Pleaseselect')">
                                        <el-option
                                          v-for="item in expressList"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.code">
                                        </el-option>
                                      </el-select>
                                </el-form-item>
                                <el-form-item :label="$t('TrackingNumber')">
                                    <el-input value="number" v-model="expressForm.express_num" maxlength="20" show-word-limit></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('remark')">
                                    <el-input type="textarea" v-model="expressForm.shop_remark" maxlength="100" show-word-limit></el-input>
                                </el-form-item>
                            </el-form>
                          </el-col>
                        </el-row>
                        <span slot="footer" class="dialog-footer">
                          <el-button
                              :loading="isButtonLoading"
                              @click="expressDialog = false"
                              size="mini">
                              {{$t('cancel')}}
                          </el-button>
                          <el-button
                              :loading="isButtonLoading"
                              type="primary"
                              @click="editExpress()"
                              size="mini">
                              {{$t('confirm')}}
                          </el-button>
                        </span>
                      </el-dialog>
                      <el-dialog
                          :visible.sync="paymentDialog"
                          width="60%">
                          <el-row>
                              <el-col :span="18" :offset="3">
                                  <el-form
                                      :model="payment"
                                      :rules="rules"
                                      label-width="160px">
                                      <el-form-item :label="$t('Payment')">
                                          <el-select v-model="payment.pay_type" placeholder="请选择">
                                            <el-option
                                              v-for="item in paymentType"
                                              :key="item.id"
                                              :label="item.name"
                                              :value="item.id">
                                            </el-option>
                                          </el-select>
                                      </el-form-item>
                                      <el-form-item :label="$t('PayStatus')">
                                          <el-select v-model="payment.pay_status" placeholder="请选择">
                                            <el-option
                                              v-for="item in paymentStatus"
                                              :key="item.id"
                                              :label="item.name"
                                              :value="item.id">
                                            </el-option>
                                          </el-select>
                                      </el-form-item>
                                      <el-form-item :label="$t('Paid')">
                                          <el-input value="number" v-model="payment.sub_pay" maxlength="15"></el-input>
                                      </el-form-item>
                                      <el-form-item :label="$t('No')">
                                          <el-input v-model="payment.payment_account_number" maxlength="100"></el-input>
                                      </el-form-item>
                                  </el-form>
                              </el-col>
                          </el-row>
                          <span slot="footer" class="dialog-footer">
                              <el-button
                                  :loading="isButtonLoading"
                                  @click="paymentDialog = false"
                                  size="mini">
                                  {{$t('cancel')}}
                              </el-button>
                              <el-button
                                  :loading="isButtonLoading"
                                  type="primary"
                                  @click="ChangPayment(scope.row)"
                                  size="mini">
                                  {{$t('confirm')}}
                              </el-button>
                          </span>
                      </el-dialog>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="6" :offset="18">
                        <pagination-public
                            :class="$style.pagination"
                            :params="params"
                            @changePage="handlerChangePage">
                        </pagination-public>
                </el-col>
            </el-row>
            <!-- 入库单详情弹框 -->
            <outbound-detail
                :visible.sync="outboundDialogVisible"
                :id="id"
                :row_data="row_data">
            </outbound-detail>
        </div>
    </div>
</template>

<script>
import paginationPublic from '@/components/pagination-public';
import $http from '@/api';
import baseApi from '@/lib/axios/base_api';
import mixin from '@/mixin/form_config';
import datePickerPublic from '@/components/date-picker-public';
import selectPublic from '@/components/select-public';
import datePickerSingePublic from '@/components/date-picker-singe-public';
import outboundDetail from './components/outbound_detail';
import outboundListSearch from './components/outboundListSearch';


export default {
  mixins: [mixin],
  components: {
    outboundDetail,
    datePickerPublic,
    datePickerSingePublic,
    selectPublic,
    outboundListSearch,
    paginationPublic,
  },

  data() {
    return {
      rules: {},
      expressForm: {
        express_code: '', // 快递公司代码
        express_num: '', // 快递单号
        shop_remark: '', // 备注
      },
      expressList: [], // 快递公司列表
      expressDialog: false, // 编辑物流
      receviceDialog: false, // 确认收货
      date: '', // 查询日期
      outbound_date: '', // 预计出库日期
      outbound_status: '', // 出库状态
      outbound_status_options: '', // 出库状态选项列表
      outbound_list_data: [], // 出库单列表
      outbound_number_search: '', // 出库单号查询
      // 分页的参数
      total: '1', // 列表总条数
      currentPage: 1, // 当前页
      id: 0,
      outboundDialogVisible: false, // 出库单详情弹框
      params: {
        total: 0,
        currentPage: 1,
      }, // 分页数据
      row_data: {},
      outboundId: '', // 临时 出库单 id
      tempParmas: {},
      tempStr: '',
      isDisabled: false,
      paymentStatus: [],
      paymentType: [],
      paymentDialog: false,
      payment: {
        pay_type: 0,
        pay_status: 0,
        sub_pay: '',
        payment_account_number: '',
      },
      payId: 0,
    };
  },

  created() {
    this.getOutbounds();
    this.getExpressList();
    this.getPayStatus();
    this.getPayTypes();
  },
  computed: {
    api() {
      return this.$store.state.token.token.substring(7);
    },
    currentLang() {
      return localStorage.getItem('lang') || 'cn';
    },
  },
  watch: {
    paymentDialog() {
      if (!this.paymentDialog) {
        const copy = {
          pay_type: 0,
          pay_status: 0,
          sub_pay: '',
          payment_account_number: '',
        };
        this.payment = copy;
      }
    },
    warehouseId() {
      this.getOutbounds();
    },
    expressDialog() {
      if (!this.expressDialog) {
        const clearExpressForm = {
          id: '', // 订单 id
          express_code: '', // 快递公司代码
          express_num: '', // 快递单号
          shop_remark: '', // 备注
        };
        this.expressForm = clearExpressForm;
      }
    },
  },
  methods: {
    onPayment(row) {
      this.payId = row.id;
      this.paymentDialog = true;
      this.payment.pay_type = row.pay_type || 1;
      this.payment.pay_status = row.pay_status;
      this.payment.sub_pay = row.sub_pay || '';
      this.payment.payment_account_number = row.payment_account_number || '';
    },

    handlerTrack(row) {
      if (row.track_url === '') return;
      window.open(`${row.track_url}`);
    }, // 跟踪

    onPrint(row) {
      window.open(`${baseApi}order/${row.id}/download/pick/?api_token=${this.api}&lang=${this.currentLang}`);
    }, // 打印拣货单

    getPayStatus() {
      $http.payStatus().then((res) => {
        this.paymentStatus = res.data;
      });
    }, // 支付状态

    getPayTypes() {
      $http.payTypes().then((res) => {
        this.paymentType = res.data;
      });
    }, // 支付类型

    ChangPayment() {
      if (!this.payId) return;
      $http.ChangPayment(this.payId, this.payment).then((res) => {
        if (res.status) return;
        this.paymentDialog = false;
        this.getOutbounds();
      });
    },

    handlerQueryParams(params) {
      this.tempParmas = params;
      // eslint-disable-next-line
      let str = '';
      // eslint-disable-next-line
      for (const item in this.tempParmas) {
        if (Object.prototype.hasOwnProperty.call(this.tempParmas, item)) {
          if (!this.tempParmas[item]) {
            this.tempParmas[item] = '';
          }
          str += `${item}=${this.tempParmas[item]}&`;
        }
      }
      this.tempStr = str;
    },

    handlerExportOrder() {
      if (!this.warehouseId) return;
      this.isDisabled = true;
      const timer = setTimeout(() => {
        this.isDisabled = false;
        clearTimeout(timer);
      }, 2000);
      window.open(`${baseApi}order/export?api_token=${this.api}&warehouse_id=${this.warehouseId}&${this.tempStr}`);
    },

    showExpressDialog(row) {
      this.outboundId = '';
      this.outboundId = row.id;
      // 编辑
      this.expressForm.express_code = row.express_code;
      this.expressForm.express_num = row.express_num;
      this.expressForm.shop_remark = row.shop_remark;
      this.expressDialog = true;
    }, // 编辑物流弹窗

    showReceviceDialog(row) {
      this.outboundId = '';
      this.outboundId = row.id;
      this.receviceDialog = true;
    }, // 签收弹窗

    confirmRecevice() {
      if (!this.outboundId) return;
      $http.editReceiveStatus(this.outboundId)
        .then((res) => {
          if (res.status) return;
          this.getOutbounds();
        });
      this.receviceDialog = false;
    },

    editExpress() {
      if (!this.outboundId) return;
      $http.changeOutboundStatus(this.outboundId, this.expressForm)
        .then((res) => {
          if (res.status) return;
          this.getOutbounds();
        });
      this.expressDialog = false;
    },

    getExpressList() {
      $http.AllExpress()
        .then((res) => {
          if (res.status) return;
          this.expressList = res.data;
        });
    },

    handlerChangePage(val) {
      $http.getOutbound({
        warehouse_id: this.warehouseId,
        page: val,
      })
        .then((res) => {
          this.outbound_list_data = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
        });
    }, // 分页回调

    handlerCallBackData(res) {
      this.outbound_list_data = res.data.data;
      this.params.total = res.data.total;
      this.params.currentPage = res.data.current_page;
      this.$set(this.params);
    }, // 搜索回调

    addOutbound() {
      this.$router.push({
        name: 'addOutbound',
      });
    }, // 添加出库单

    getOutbounds() {
      if (!this.warehouseId) return;
      $http.getOutbound({ warehouse_id: this.warehouseId })
        .then((res) => {
          if (res.status) return;
          this.outbound_list_data = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
        });
    }, // 获取出库单列表

    checkedOutbound(row) {
      this.$router.push({
        name: 'setOutbound',
        query: {
          order_id: row.id,
        },
      });
    }, // 设为出库

    viewDetails(row) {
      this.outboundDialogVisible = true;
      this.id = row.id;
      this.row_data = row;
    }, // 出库单详情弹框

    cancelOrder(row) {
      this.$confirm(this.$t('checkTips'), this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
      })
        .then(() => {
          $http.cancelOutbound(row.id, { warehouse_id: row.warehouse_id })
            .then((res) => {
              if (res.status) return;
              this.getOutbounds();
              this.$message({
                type: 'success',
                message: res.msg,
              });
            });
        });
    }, // 取消订单
  },
};
</script>

<style lang="less" module>
@import '../../../less/public_variable.less';

.outboundList {
  margin: @margin;
  .outboundList_main {
    width: @width;
    margin: 0 auto;
    .outboundList_tags {
      margin: 0 0 10px 0;
      .btn {
        font-size: @fontSize;
      }
    }
    .pagination {
      margin: 10px  0 10px 0;
      float: right;
    }
    .btn {
      font-size: 1.2rem;
    }
  }
}
</style>
