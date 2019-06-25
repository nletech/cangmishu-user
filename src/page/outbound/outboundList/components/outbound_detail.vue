<template>
  <el-dialog  title=""
              align="center"
              width="70%"
              @close="close"
              @update:visible="$emit('update:visible', $event)"
              :visible="visible">
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
                                   <img :src="row_data.out_sn_barcode" alt="">
                              </div>
                              <div>
                                   <span>{{row_data.out_sn}}</span>
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
                                                <el-col :span="4">{{row_data.send_fullname}}</el-col>
                                                <el-col :span="4" :offset="4">{{row_data.send_phone}}</el-col>
                                        </el-row>
                                        <el-row :class="$style.address_detail">
                                                <el-col :span="4">{{row_data.send_full_address}}</el-col>
                                        </el-row>
                                </el-col>
                                <el-col :span="10" :class="$style.address">
                                        <el-row :class="$style.address_title">
                                                <el-col :span="4">收件信息:</el-col>
                                        </el-row>
                                        <el-row :class="$style.address_info">
                                                <el-col :span="4">{{row_data.receiver_fullname}}</el-col>
                                                <el-col :span="4" :offset="4">{{row_data.receiver_phone}}</el-col>
                                        </el-row>
                                        <el-row :class="$style.address_detail">
                                                <el-col :span="4">{{row_data.receiver_full_address}}</el-col>
                                        </el-row>
                                </el-col>
                           </el-row>
                      </div>
              </el-row>
              <el-row>
                      <el-col>
                              <el-table :data="row_data.order_items" border style="width: 92%;">
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
                                        <el-table-column prop="amount" label="数量">
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
  </el-dialog>
</template>

<script>
// import $http from '@/api';

export default {
  name: 'outbound-order-detail',
  props: {
    visible: Boolean,
    id: Number,
    row_data: {
      type: Object,
    },
  },
  data() {
    return {
      outboundList: [],
      outboundInfo: {},
      statusMap: {
        0: '订单被取消',
        1: '待拣货',
        2: '待出库',
        3: '已出库',
        4: '拣货中',
        5: '已收货',
      },
      // 以下填写信息
      row: {
        order_items: [],
        warehouse: {
          name_cn: '',
        },
        express_num: '',
        created_at: '',
      },
      warehouse_name: '',
      totalAmount: '',
      senderInfo: {},
    };
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  watch: {
    id: {
      handler(value) {
        console.log(value, this.row_data, '查看详情');
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    close() {
      // this.page_params.page = 1;
    },
    getList() {
      //
    },
  },
};
</script>

<style lang="less" module>
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
    width: 49%;
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
      margin: 4px 0 4px 0;
    }
  }
}
.desc_detail {
  margin: 20px 0 20px 0;
  font-weight: bold;
  .desc_remark {
    word-wrap: none;
  }
  .desc_main {
    width: 92%;
    text-align: left;
  }
}
</style>
