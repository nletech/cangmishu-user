<template>
  <el-dialog  title="出库单详细"
              :fullscreen="true"
              @update:visible="$emit('update:visible', $event)"
              :visible="visible">
              <el-row>
                <el-col>
                  <div style="float:right">
                      <div :class="$style.img">
                           <img :src="row_data.out_sn_barcode" alt="">
                      </div>
                      <span>{{row_data.out_sn}}</span>
                  </div>
                  <h1>普通出库单</h1>
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
                                    <el-col>{{row_data.send_full_address}}</el-col>
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
                                <el-col>{{row_data.receiver_full_address}}</el-col>
                          </el-row>
                        </el-card>
                      </el-col>
              </el-row>
              <el-row>
                  <el-col>
                      <el-table :data="row_data.order_items" border>
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
                            <el-table-column prop="sale_price" align="center" label="销售单价 (元)" width="120"></el-table-column>
                            <el-table-column prop="amount"  align="center" label="下单数量" width="120"></el-table-column>
                            <el-table-column prop="pick_num"  align="center" label="出库数量" width="120"></el-table-column>
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
};
</script>

<style lang="less" module>
.systemInfo {
  margin: 0 0 30px 0;
}
.img {
  margin: 0 20px 0 0;
}
.contact{
  font-weight: bold;
  line-height: 35px;
  margin-bottom: 20px;
}
.desc_detail {
  font-weight: bold;
  margin-top: 20px;
  .desc_remark {
    word-wrap: none;
  }
  .desc_main {
    text-align: left;
  }
}
</style>
