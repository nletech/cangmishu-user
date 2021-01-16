<template>
  <div class="saleDetail">
    <div>
      <el-steps :active="2" align-center>
        <el-step title="待确认" description="确认出库详细数量"></el-step>
        <el-step title="待发货" description="填写物流信息"></el-step>
        <el-step title="待签收" description="等待客人签收"></el-step>
        <el-step title="完成" description="订单已经完成"></el-step>
      </el-steps>
    </div>
    <!--支付弹窗-->
    <el-dialog title="设置收款" :visible.sync="paymentDialog" width="60%">
      <el-row>
        <el-col :span="18" :offset="3">
          <el-form :model="payment" label-width="160px">
            <el-form-item :label="$t('Payment')">
              <el-select v-model="payment.pay_type" placeholder="请选择">
                <el-option
                  v-for="item in paymentType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('PayStatus')">
              <el-select v-model="payment.pay_status" placeholder="请选择">
                <el-option
                  v-for="item in paymentStatus"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Paid')">
              <el-input value="number" v-model="payment.sub_pay" maxlength="15"></el-input>
            </el-form-item>
            <el-form-item :label="$t('remark')">
              <el-input v-model="payment.payment_account_number" maxlength="100"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="isButtonLoading" @click="paymentDialog = false" size="mini">
          {{ $t('cancel') }}
        </el-button>
        <el-button :loading="isButtonLoading" type="primary" @click="submitPayment()" size="mini">
          {{ $t('confirm') }}
        </el-button>
      </span>
    </el-dialog>
    <!--添加物流-->
    <el-dialog :title="$t('EditTrack')" :visible.sync="expressDialog" width="60%">
      <el-row>
        <el-col :span="18" :offset="3">
          <el-form :model="expressForm" label-width="160px">
            <el-form-item :label="$t('DeliveryCompany')">
              <el-select v-model="expressForm.express_code" :placeholder="$t('Pleaseselect')">
                <el-option
                  v-for="item in expressList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('TrackingNumber')">
              <el-input
                value="number"
                v-model="expressForm.express_num"
                maxlength="20"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('remark')">
              <el-input
                type="textarea"
                v-model="expressForm.shop_remark"
                maxlength="100"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="isButtonLoading" @click="expressDialog = false" size="mini">
          {{ $t('cancel') }}
        </el-button>
        <el-button :loading="isButtonLoading" type="primary" @click="submitDelivery()" size="mini">
          {{ $t('confirm') }}
        </el-button>
      </span>
    </el-dialog>
    <!--主界面-->
    <model-form :colValue="24">
      <el-form slot="left" label-width="120px">
        <el-form-item>
          <el-row :gutter="20" type="flex" justify="end">
            <el-col>
              <el-button
                :loading="isButtonLoading"
                @click="handlerDownload()"
                style="float:right"
                icon="el-icon-download"
                size="small"
              >
                下载订单
              </el-button>
              <el-button
                :loading="isButtonLoading"
                @click="handlerDownloadPick()"
                style="float:right"
                v-if="row_data.status >= 4"
                icon="el-icon-printer"
                size="small"
                type="button"
              >
                打印拣货单
              </el-button>
              <el-button
                :loading="isButtonLoading"
                @click="handleExpress()"
                v-if="row_data.status === 4 || row_data.status === 5"
                style="float:right"
                icon="el-icon-truck"
                size="small"
                type="button"
              >
                设置物流
              </el-button>
              <el-button
                :loading="isButtonLoading"
                @click="handleFinish()"
                style="float:right"
                v-if="row_data.status === 5"
                icon="el-icon-finished"
                size="small"
                type="button"
              >
                设置签收
              </el-button>
              <el-button
                :loading="isButtonLoading"
                @click="handlerCancel()"
                style="float:right"
                icon="el-icon-circle-close"
                size="small"
                type="danger"
                v-if="row_data.status === 1"
              >
                取消订单
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <h2 align="center" style="margin:0px;">
          <div style="float:right">
            <div :class="$style.img">
              <img v-if="row_data" :src="row_data.out_sn_barcode" alt="" />
            </div>
            <div>
              <span style="font-size:12px;" v-if="row_data">{{ row_data.out_sn }}</span>
            </div>
          </div>
          {{ $t('OrderItems') }}
        </h2>
        <div :class="$style.desc_item">
          <span>{{ $t('createdTime') }}:</span>
          <span>{{ row_data.created_at }}</span>
        </div>
        <el-divider></el-divider>
        <el-row type="flex" justify="space-between">
          <el-col :span="8">
            <div :class="$style.desc_item">
              <span>{{ $t('warehouse') }}:</span>
              <span v-if="row_data.warehouse">
                {{ row_data.warehouse.name_cn }}
              </span>
            </div>
            <br />
            {{ $t('OutboundTag') }} {{ $t('OrdinaryOutboundOrder') }}
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户" label-width="50px">
              <!-- 收件人输入框 -->
              {{ row_data.receiver_fullname }} {{ row_data.receiver_phone }} <br />
              {{ row_data.receiver_province }}
              {{ row_data.receiver_city }}
              {{ row_data.receiver_district }}
              {{ row_data.receiver_address }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出库日期" label-width="100px">
              {{ row_data.delivery_date }}
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <span class="gray-text">状态:</span>
            <div class="label status-name">{{ row_data.status_name }}</div>
          </el-col>
          <el-col :span="3">
            <span class="gray-text">总计金额:</span>
            <div class="label sub-total">{{ row_data.sub_total }}</div>
          </el-col>
          <el-col :span="3">
            <span class="gray-text">实收金额:</span>
            <div class="label sub-pay">{{ row_data.sub_pay }}</div>
            <el-button
              :loading="isButtonLoading"
              @click="handlerPayment()"
              icon="el-icon-money"
              size="small"
              type="button"
              v-if="
                row_data.status === 1 ||
                  row_data.status === 4 ||
                  row_data.status === 5 ||
                  row_data.status === 7
              "
            >
              设置收款
            </el-button>
          </el-col>
        </el-row>
        <!-- 出库清单表 -->
        <el-divider></el-divider>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>详细清单</span>
          </div>
          <el-table
            v-if="row_data"
            :data="row_data.order_items"
            border
            show-summary
            :summary-method="getSummaries"
          >
            <el-table-column align="center" header-align="center" type="index" width="60">
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              prop="name_cn"
              :label="$t('cnName')"
              width="300"
            >
              <template slot-scope="scope">
                {{ scope.row.name_cn }}({{ scope.row.spec_name_cn }})
              </template>
            </el-table-column>
            <el-table-column align="center" header-align="center" prop="relevance_code" label="SKU">
              <template slot-scope="scope">
                <div>{{ scope.row.relevance_code }}</div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              prop="sale_price"
              :label="$t('SalePrice')"
            >
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              prop="amount"
              :label="$t('OrderQty')"
              width="100"
            >
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              label="金额"
              prop="amount,sale_price"
            >
              <template slot-scope="scope">
                {{ parseFloat(scope.row.amount * scope.row.sale_price).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              :label="$t('ConfirmQty')"
              width="120"
              prop="pick_num"
            >
              <template slot-scope="scope">
                {{ scope.row.pick_num }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <div :class="$style.desc_main" style="padding-top:20px;">
          <div :class="$style.desc_item">
            <span>{{ $t('remark') }}:</span>
            <span>{{ row_data.remark }}</span>
          </div>
        </div>
        <hr />
        <el-row :class="$style.desc_detail">
          <el-col :span="8">
            运输方式: {{ row_data.express_code }} <br /><br />
            快递单号: {{ row_data.express_num }}
          </el-col>
        </el-row>
        <!-- 提交按钮 -->
        <el-form-item>
          <el-row :gutter="20" type="flex" justify="end">
            <el-col :span="2" :sm="4" :lg="2">
              <el-button
                :loading="isButtonLoading"
                type="primary"
                icon="el-icon-sell"
                @click="handlerNext()"
                style="float:right"
                v-if="row_data.status === 1"
              >
                核对清单
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </model-form>
  </div>
</template>

<script>
/* eslint-disable */
import modelForm from '@/components/form';
import $http from '@/api';
import mixin from '@/mixin/form_config';
import baseApi from '@/lib/axios/base_api'
import buttonPagination from '@/components/pagination_and_buttons';

export default {
  name: 'saleDetail',
  components: {
    modelForm
  },
  props: {
    visible: Boolean,
    id: Number,
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
    api() {
      return this.$store.state.token.token.substring(7);
    }
  },
  mixins: [mixin],
  data() {
    return {
      isButtonLoading: false,
      row_data: {
        id: 0,
        out_sn_barcode: '',
        send_fullname: '',
        send_phone: '',
        send_full_address: '',
        receiver_fullname: '',
        receiver_phone: '',
        receiver_full_address: '',
        remark: '',
        warehouse: '',
        created_at: '',
        delivery_type: '',
        express_num: '',
      },
      delivery_date: '',
      express_code: '',
      express_num: '',
      outboundDialogVisible: false,
      expressList: [],
      paymentStatus: [],
      paymentType: [],
      paymentDialog: false,
      payment: {
        pay_type: 0,
        pay_status: 0,
        sub_pay: '',
        payment_account_number: ''
      },
      expressDialog: false,
      expressForm: {
        express_code: '', // 快递公司代码
        express_num: '', // 快递单号
        shop_remark: '' // 备注
      },
    };
  },
  mounted() {
    this.loadData();
    this.getExpressList();
    this.getPayStatus();
    this.getPayTypes();
  },
  methods: {
    getPayStatus() {
      $http.payStatus().then(res => {
        this.paymentStatus = res.data;
      });
    }, // 支付状态
    getPayTypes() {
      $http.payTypes().then(res => {
        this.paymentType = res.data;
      });
    }, // 支付类型
    getExpressList() {
      $http.AllExpress().then(res => {
        if (res.status) return;
        this.expressList = res.data;
      });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if ((index >= 3) && !values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
        if (index === 3) {
          sums[index] = Number(sums[index]).toFixed(2);
        } else if (index === 5) {
          sums[5] = Number(this.row_data.sub_total).toFixed(2);
        }
      });
      return sums;
    },
    handleFinish() {
      this.$confirm('确定要签收成功吗?', '签收提示', {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel')
      }).then(() => {
        $http.editReceiveStatus(this.row_data.id).then(res => {
          this.loadData();
        });
      });
    },// 设置为签收
    submitDelivery() {
      $http.changeOutboundStatus(this.row_data.id, this.expressForm).then(res => {
        if (res.status) return;
        this.loadData();
      });
      this.expressDialog = false;
    },
    handleExpress(row) {
      // 编辑
      this.expressForm.express_code = this.row_data.express_code;
      this.expressForm.express_num = this.row_data.express_num;
      this.expressForm.shop_remark = this.row_data.shop_remark;
      this.expressDialog = true;
    }, // 编辑物流弹窗
    submitPayment() {
      $http.ChangPayment(this.row_data.id, this.payment).then(res => {
        if (res.status) return;
        this.paymentDialog = false;
        this.loadData();
      });
    },
    handlerPayment() {
      this.paymentDialog = true;
      this.payment.pay_type = this.row_data.pay_type || 1;
      this.payment.pay_status = this.row_data.pay_status;
      this.payment.sub_pay = this.row_data.sub_pay || '';
      this.payment.payment_account_number = this.row_data.payment_account_number || '';
    },
    handlerCancel() {
      this.$confirm(this.$t('checkTips'), this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel')
      }).then(() => {
        $http.cancelOutbound(this.row_data.id, { warehouse_id: this.row_data.warehouse_id }).then(res => {
          if (res.status) return;
          this.loadData();
          this.$message({
            type: 'success',
            message: res.msg
          });
        });
      });
    },
    handlerDownloadPick() {
      window.open(
        `${baseApi.BASE_URL}order/${this.row_data.id}/download/pick/?api_token=${this.api}&lang`
      );
    },
    handlerDownload() {
      window.open(
        `${baseApi.BASE_URL}order/${this.row_data.id}/download/out/?api_token=${this.api}&lang`
      );
    },
    handlerNext() {
      this.$router.push({
        name: 'setOutbound',
        query: {
          order_id: this.row_data.id
        }
      });
    },
    loadData() {
      $http.getOutboundDetail(this.$route.query.order_id)
        .then((res) => {
          if (res.status) return;
          this.row_data = res.data;
        });
    },
  },
};
</script>

<style lang="less" module>
.saleDetail {
  padding: 0 0 0 10px;
  .background {
    margin: 10px 0 0 0;
    width: 92%;
    height: 100%;
    background-color: #fff !important;
    padding: 0 40px 0 40px;
    .systemInfo {
      margin: 0 0 30px 0;
    }
    .contact {
      font-weight: bold;
      line-height: 35px;
    }
    .img {
      margin: 0 20px 0 0;
    }
    .desc_detail {
      margin: 20px 0 20px 0;
      font-weight: bold;
    }
    .btn {
      background-color: @ThemeColor;
      color: @white;
      margin: 0 0 20px 0;
    }
    .gray-text {
      color: @baseGray
    }
    .status-name {
      font-weight: bold;
    }
    .sub-total {
      color: red;
    }
  }
}
.content_box {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
</style>