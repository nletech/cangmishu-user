<template>
        <div :class="$style.setOutbound">
              <div :class="$style.background">
                  <el-form label-width="150px" label-position="left">
                      <el-row>
                              <el-col :span="6" :class="$style.systemInfo">
                                      <h1>仓秘书仓储系统</h1>
                              </el-col>
                      </el-row>
                      <el-row>
                              <el-col :span="4">
                                      <h2>普通出库单</h2>
                              </el-col>
                              <el-col :span="3" :offset="12">
                                      <div :class="$style.img">
                                          <img v-if="row_data" :src="row_data.out_sn_barcode" alt="">
                                      </div>
                                      <div>
                                          <span v-if="row_data">{{row_data.out_sn}}</span>
                                      </div>
                              </el-col>
                      </el-row>
                      <el-row :gutter="12" v-if="row_data" :class="$style.contact">
                        <el-col :span="12">
                          <el-card shadow="never">
                              <el-row >
                                      <el-col :span="4">发件信息:</el-col>
                              </el-row>
                              <el-row >
                                      <el-col>{{row_data.send_fullname}} {{row_data.send_phone}}</el-col>
                              </el-row>
                              <el-row>
                                  <el-col>{{row_data.send_province}}{{row_data.send_city}}{{row_data.send_district}}{{row_data.send_address}}</el-col>
                              </el-row>
                          </el-card>
                        </el-col>
                        <el-col :span="12">
                          <el-card shadow="never">
                              <el-row>
                                  <el-col :span="4">收件信息:</el-col>
                            </el-row>
                            <el-row >
                                  <el-col>{{row_data.receiver_fullname}} {{row_data.receiver_phone}}</el-col>
                            </el-row>
                            <el-row>
                                  <el-col>{{row_data.receiver_province}}{{row_data.receiver_city}}{{row_data.receiver_district}}{{row_data.receiver_address}}</el-col>
                            </el-row>
                          </el-card>
                        </el-col>
                      </el-row>
                      <br/>
                      <el-row>
                              <el-col>
                                      <el-table  v-if="row_data" :data="row_data.order_items" border>
                                          <el-table-column type="index" width="60">
                                          </el-table-column>
                                          <el-table-column prop="name_cn" label="中文名称">
                                              <template slot-scope="scope">
                                                {{scope.row.name_cn}}({{scope.row.spec_name_cn}})
                                              </template>
                                          </el-table-column>
                                          <el-table-column prop="relevance_code" label="SKU">
                                                            <template slot-scope="scope">
                                                                    <div><img :src="scope.row.relevance_code_barcode"/></div>
                                                                    <div>{{scope.row.relevance_code}}</div>
                                                            </template>
                                          </el-table-column>
                                          <el-table-column prop="sale_price" label="销售单价（元）" width="120" align="center">
                                          </el-table-column>
                                          <el-table-column prop="amount" label="下单数量*" width="100" align="center">
                                          </el-table-column>
                                          <el-table-column label="仓库库存" width="100" align="center">
                                            <template slot-scope="scope">
                                              {{scope.row.spec.total_shelf_num}}
                                            </template>
                                          </el-table-column>
                                          <el-table-column label="实际出库数量*" prop="pick_num, amount">
                                              <template slot-scope="scope">
                                                        <el-input-number
                                                            size="mini" type="number"
                                                            :min="0"
                                                            :max="scope.row.amount"
                                                            v-model="scope.row.pick_num">
                                                        </el-input-number>
                                              </template>
                                          </el-table-column>
                                      </el-table>
                              </el-col>
                      </el-row>
                      <el-row :class="$style.desc_detail">
                          <el-col>
                              <div  :class="$style.desc_main">
                                    <div  :class="$style.desc_item">
                                          <span>{{$t('remark')}}:</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{row_data.remark}}</span>
                                    </div>
                                    <div  :class="$style.desc_item">
                                          <span>仓库:</span><span v-if="row_data.warehouse">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{row_data.warehouse.name_cn}}</span>
                                    </div>
                                    <div  :class="$style.desc_item">
                                          <span>{{$t('createdTime')}}:</span><span>&nbsp;&nbsp;{{row_data.created_at}}</span>
                                    </div>
                                    <div  :class="$style.desc_item">
                                          <span>出库日期:</span>
                                          <span>&nbsp;&nbsp;
                                                <el-date-picker
                                                    v-model="delivery_date"
                                                    style="margin: 20px 0 20px 0;"
                                                    type="date"
                                                    size="small"
                                                    format="yyyy 年 MM 月 dd 日"
                                                    value-format="yyyy-MM-dd"
                                                    placeholder="预计出库时间">
                                                </el-date-picker>
                                          </span>
                                    </div>
                              </div>
                              <el-row>
                                      <hr />
                              </el-row>
                              <el-row>
                                <el-col :span="10">
                                    <el-form-item label="运输方式(选填):">
                                        <el-select
                                            v-model="express_code"
                                            size="mini">
                                            <el-option
                                              v-for="item in expressList"
                                              :key="item.code"
                                              :label="item.name"
                                              :value="item.code">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="9" :offset="1">
                                    <el-form-item label="运单号(选填):">
                                        <el-input size="mini" v-model="express_num" maxlength="40"></el-input>
                                    </el-form-item>
                                </el-col>
                              </el-row>
                          </el-col>
                      </el-row>
                      <el-row>
                          <el-col :span="4" :offset="10">
                                  <el-button :class="$style.btn"
                                              @click="handlerSubmit">
                                              {{$t('submit')}}
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
    handlerSubmit() {
      if (!this.delivery_date) {
        this.$message({
          message: '出库时间必填',
          type: 'error',
        });
        return false;
      }
      let arr = [];
      for (let i = 0, len = this.row_data.order_items; i < len.length; i += 1) {
        let obj = {
          order_item_id: '',
          pick_num: '',
        };
        obj.order_item_id = len[i].id;
        obj.pick_num = len[i].pick_num;
        arr.push(obj);
      };
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
            message: '出库成功!',
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
@import '../../../../less/public_variable.less';
.setOutbound {
  width: 96%;
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
    .contact{
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
.content_box{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
</style>


