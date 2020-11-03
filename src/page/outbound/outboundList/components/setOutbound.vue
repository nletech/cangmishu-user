<template>
  <div :class="$style.setOutbound">
    <div :class="$style.background">
      <el-form label-width="170px" label-position="left">
        <el-row>
          <el-col :span="6" :class="$style.systemInfo">
            <h1>{{ $t('CangmishuWMS') }}</h1>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <h2>{{ $t('OrdinaryOutboundOrder') }}</h2>
          </el-col>
          <el-col :span="3" :offset="12">
            <div :class="$style.img">
              <img v-if="row_data" :src="row_data.out_sn_barcode" alt="" />
            </div>
            <div>
              <span v-if="row_data">{{ row_data.out_sn }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="12" v-if="row_data" :class="$style.contact">
          <el-col :span="12">
            <el-card shadow="never">
              <el-row>
                <el-col :span="4">{{ $t('sender') }}</el-col>
              </el-row>
              <el-row>
                <el-col
                  >{{ row_data.send_fullname }}
                  {{ row_data.send_phone }}</el-col
                >
              </el-row>
              <el-row>
                <el-col
                  >{{ row_data.send_province }}{{ row_data.send_city
                  }}{{ row_data.send_district
                  }}{{ row_data.send_address }}</el-col
                >
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="never">
              <el-row>
                <el-col :span="4">{{ $t('receiver') }}</el-col>
              </el-row>
              <el-row>
                <el-col
                  >{{ row_data.receiver_fullname }}
                  {{ row_data.receiver_phone }}</el-col
                >
              </el-row>
              <el-row>
                <el-col
                  >{{ row_data.receiver_province }}{{ row_data.receiver_city
                  }}{{ row_data.receiver_district
                  }}{{ row_data.receiver_address }}</el-col
                >
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <br />
        <el-row>
          <el-col>
            <el-table v-if="row_data" :data="row_data.order_items" border>
              <el-table-column
                align="center"
                header-align="center"
                type="index"
                width="60"
              >
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
              <el-table-column
                align="center"
                header-align="center"
                prop="relevance_code"
                label="SKU"
              >
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
              <el-table-column
                align="center"
                header-align="center"
                :label="$t('Stock')"
                width="100"
              >
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
          </el-col>
        </el-row>
        <el-row :class="$style.desc_detail">
          <el-col>
            <div :class="$style.desc_main">
              <div :class="$style.desc_item">
                <span>{{ $t('remark') }}:</span
                ><span
                  >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                    row_data.remark
                  }}</span
                >
              </div>
              <div :class="$style.desc_item">
                <span>{{ $t('warehouse') }}:</span
                ><span v-if="row_data.warehouse"
                  >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                    row_data.warehouse.name_cn
                  }}</span
                >
              </div>
              <div :class="$style.desc_item">
                <span>{{ $t('createdTime') }}:</span
                ><span>&nbsp;&nbsp;{{ row_data.created_at }}</span>
              </div>
              <div :class="$style.desc_item">
                <span>{{ $t('Date') }}:</span>
                <span
                  >&nbsp;&nbsp;
                  <el-date-picker
                    v-model="delivery_date"
                    style="margin: 20px 0 20px 0;"
                    type="date"
                    size="small"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    :placeholder="$t('EstimatedOutboundDate')"
                  >
                  </el-date-picker>
                </span>
              </div>
            </div>
            <el-row>
              <hr />
            </el-row>
            <el-row>
              <el-col :span="10">
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
              <el-col :span="10">
                <el-form-item :label="$t('Tracking')">
                  <el-input
                    size="mini"
                    v-model="express_num"
                    maxlength="40"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :offset="10">
            <el-button :class="$style.btn" @click="handlerSubmit">
              {{ $t('submit') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import $http from '@/api';
import baseApi from '@/lib/axios/base_api'
import buttonPagination from '@/components/pagination_and_buttons';

export default {
  name: 'setOutbound',
  props: {
    visible: Boolean,
    id: Number,
  },
  data() {
    return {
      row_data: {
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
      expressList: [],
    };
  },
  mounted() {
    this.get_data();
    this.getExpressList();
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
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
            name: 'outboundList',
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
  }
}
.content_box {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
</style>


