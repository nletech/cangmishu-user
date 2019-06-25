<template>
        <div :class="$style.setOutbound">
              <div :class="$style.background">
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
                    <el-row>
                            <div :class="$style.main">
                                <el-row>
                                      <el-col :span="10" :class="$style.address">
                                              <el-row :class="$style.address_title">
                                                      <el-col :span="4">发件信息:</el-col>
                                              </el-row>
                                              <el-row :class="$style.address_info">
                                                      <el-col :span="4" v-if="row_data">{{row_data.send_fullname}}</el-col>
                                                      <el-col :span="4" :offset="4" v-if="row_data">{{row_data.send_phone}}</el-col>
                                              </el-row>
                                              <el-row :class="$style.address_detail">
                                                      <el-col :span="8" v-if="row_data" :class="$style.address_text">{{row_data.send_full_address}}</el-col>
                                              </el-row>
                                      </el-col>
                                      <el-col :span="10" :class="$style.address">
                                              <el-row :class="$style.address_title">
                                                      <el-col :span="4">收件信息:</el-col>
                                              </el-row>
                                              <el-row :class="$style.address_info">
                                                      <el-col :span="4" v-if="row_data">{{row_data.receiver_fullname}}</el-col>
                                                      <el-col :span="4" :offset="4" v-if="row_data">{{row_data.receiver_phone}}</el-col>
                                              </el-row>
                                              <el-row :class="$style.address_detail">
                                                      <el-col :span="8" v-if="row_data"  :class="$style.address_text">{{row_data.receiver_full_address}}</el-col>
                                              </el-row>
                                      </el-col>
                                </el-row>
                            </div>
                    </el-row>
                    <el-row>
                            <el-col>
                                    <el-table  v-if="row_data" :data="row_data.order_items" border style="width: 92%;">
                                              <el-table-column type="index" width="60">
                                              </el-table-column>
                                              <el-table-column prop="name_cn" label="中文名称">
                                              </el-table-column>
                                              <el-table-column prop="relevance_code" label="SKU">
                                                                <template slot-scope="scope">
                                                                        <div><img :src="scope.row.relevance_code_barcode"/></div>
                                                                        <div>{{scope.row.relevance_code}}</div>
                                                                </template>
                                              </el-table-column>
                                              <el-table-column prop="amount" label="预计出库数量">
                                              </el-table-column>
                                              <el-table-column label="实际出库数量" prop="pick_num, amount">
                                                                <template slot-scope="scope">
                                                                          <el-input-number type="number"
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
                                                <span>备注:</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{row_data.remark}}</span>
                                          </div>
                                          <div  :class="$style.desc_item">
                                                <span>仓库:</span><span v-if="row_data.warehouse">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{row_data.warehouse.name_cn}}</span>
                                          </div>
                                          <div  :class="$style.desc_item">
                                                <span>创建日期:</span><span>&nbsp;&nbsp;{{row_data.created_at}}</span>
                                          </div>
                                    </div>
                                    <el-row>
                                            <hr />
                                    </el-row>
                                    <el-row>
                                            <el-col :span="6">运输方式:{{row_data.delivery_type}}</el-col>
                                            <el-col :span="6" :offset="1">运单号:{{row_data.express_num}}</el-col>
                                    </el-row>
                                    <el-row>
                                            <el-col :span="10" :offset="14">
                                                    <span>仓秘书免费的共享仓储管理系统  http://www.cangmishu.com</span>
                                            </el-col>
                                    </el-row>
                            </el-col>
                    </el-row>
                    <el-row>
                          <el-col :span="4" :offset="10">
                                  <el-button :class="$style.btn"
                                             @click="handlerSubmit">
                                             确认出库
                                  </el-button>
                          </el-col>
                    </el-row>
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
    };
  },
  mounted() {
    this.get_data();
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  methods: {
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
        // console.log(len[i], 'len[i]');
        obj.order_item_id = len[i].id;
        obj.pick_num = len[i].pick_num;
        arr.push(obj);
      };
      console.log(arr, 'arr');
      console.log(this.row_data.order_items, 'this.row_data.order_items');
      $http.checkedOutbound({
        warehouse_id: this.warehouseId,
        order_id: this.$route.query.order_id,
        delivery_date: this.delivery_date,
        items: arr,
      })
        .then((res) => {
          if (res.status) return;
          this.$router.push({
            name: 'outboundList',
          });
        });
      console.log(this.row_data, 'this.row_data');
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
  box-shadow:2px 0px 8px rgba(109,96,186,0.3);
  width: 92%;
  height: 120%;
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
    .img {
      margin: 0 20px 0 0;
    }
    .main {
      width: 92%;
      margin: 20px 0 20px 40px;
      .address {
        width: 48%;
        min-height: 200px;
        border: 1px solid #ccc;
        margin: 0 5px 0 0;
        padding: 10px 0 30px 30px;
        font-size: 1.1rem;
        font-weight: bold;
        .address_title {
          margin: 0 0 20px 0;
        }
        .address_info {
          margin: 4px 0 4px 0;
        }
        .address_detail {
          margin: 20px 0 4px 0;
          .address_text {
            min-width: 500px;
            text-align: left;
            word-wrap: none;
          }
        }
      }
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


