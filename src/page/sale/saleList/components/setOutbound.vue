<template>
  <div class="setOutbound">
    <model-form :colValue="24">
      <el-form slot="left" label-width="120px">
        <el-form-item>
          <el-row :gutter="20" type="flex" justify="end">
            <el-col :span="2" :sm="4" :lg="2">
              <el-button
                :loading="isButtonLoading"
                @click="handlerDownload()"
                style="float:right"
                icon="el-icon-download"
                size="small"
              >
                下载出库单
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
        <hr style="clear:both" />
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
            <div class="label">{{ row_data.status_name }}</div>
          </el-col>
          <el-col :span="3">
            <span class="gray-text">总计金额:</span>
            <div class="label">{{ row_data.sub_total }}</div>
          </el-col>
          <el-col :span="3">
            <span class="gray-text">实收金额:</span>
            <div class="label">{{ row_data.sub_pay }}</div>
          </el-col>
        </el-row>
        <!-- 出库清单表 -->
        <hr />
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>详细清单</span>
          </div>
          <el-table v-if="row_data" :data="row_data.order_items" border>
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
                <div><img :src="scope.row.relevance_code_barcode" /></div>
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
            <el-table-column align="center" header-align="center" :label="$t('Stock')" width="100">
              <template slot-scope="scope">
                {{ scope.row.spec.total_shelf_num }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              :label="$t('ConfirmQty')"
              prop="pick_num, amount"
            >
              <template slot-scope="scope">
                <el-input-number
                  size="mini"
                  type="number"
                  :min="0"
                  :max="scope.row.amount"
                  v-model="scope.row.pick_num"
                >
                </el-input-number>
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
            <el-form-item :label="$t('Date')">
              <el-date-picker
                v-model="delivery_date"
                type="date"
                size="mini"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                :placeholder="$t('EstimatedOutboundDate')"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Shipping')">
              <el-select v-model="express_code" size="mini">
                <el-option
                  v-for="item in expressList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Tracking')">
              <el-input size="mini" v-model="express_num" maxlength="40"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 提交按钮 -->
        <el-form-item>
          <el-row :gutter="20" type="flex" justify="end">
            <el-col :span="2" :sm="4" :lg="2">
              <el-button
                :loading="isButtonLoading"
                type="primary"
                @click="handlerSubmit()"
                style="float:right"
              >
                {{ $t('submit') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </model-form>
    <!-- 入库单详情弹框 -->
    <outbound-detail :visible.sync="outboundDialogVisible" :id="row_data.id" :row_data="row_data">
    </outbound-detail>
  </div>
</template>

<script>
/* eslint-disable */
import modelForm from '@/components/form';
import $http from '@/api';
import mixin from '@/mixin/form_config';
import baseApi from '@/lib/axios/base_api'
import buttonPagination from '@/components/pagination_and_buttons';
import outboundDetail from './outbound_detail';

export default {
  name: 'setOutbound',
  components: {
    outboundDetail,
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
    };
  },
  mounted() {
    this.get_data();
    this.getExpressList();
  },
  methods: {
    getExpressList() {
      $http.AllExpress()
        .then((res) => {
          if (res.status) return;
          this.expressList = res.data;
        });
    },
    notHaveOutputNumber(OutputList) {
      let noOutputNumber = false;

      if (!Array.isArray(OutputList)) {
        throw TypeError('OutputList is no an Array');
      }

      OutputList.map(item => {
        if (item.pick_num === 0) {
          noOutputNumber = true;
        }
      });

      if (noOutputNumber === true) {
        return true;
      } else {
        return false;
      }
    },
    handlerDownload() {
      window.open(
        `${baseApi.BASE_URL}order/${this.row_data.id}/download/out/?api_token=${this.api}&lang`
      );
    },
    handlerSubmit() {
      if (!this.delivery_date) {
        this.$message({
          message: this.$t('DateMust'),
          type: 'error',
        });
        return false;
      }
      let arr = [];
      this.row_data.order_items.map(item => {
        arr.push({
          order_item_id: item.id,
          pick_num: item.pick_num,
        })
      });
      if (this.notHaveOutputNumber(arr)) {
        this.$message({
          type: 'error',
          message: this.$t('PickingQuantityCannotEqualTo'),
        });
        return;
      }
      $http.checkedOutbound({
        warehouse_id: this.warehouseId,
        order_id: this.$route.query.order_id,
        delivery_date: this.delivery_date,
        express_code: this.express_code,
        express_num: this.express_num,
        items: arr,
      })
        .then((res) => {
          if (res.status) return;
          this.$router.push({
            name: 'saleList',
          });
          this.$message({
            message: this.$t('success'),
            type: 'success',
          });
        });
    },
    get_data() {
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
.setOutbound {
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
  }
}
.content_box {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
</style>


