<template>
  <el-dialog  title="出库单详情"
              align="center"
              width="70%"
              @close="close"
              @update:visible="$emit('update:visible', $event)"
              :visible="visible">
              <el-row>
                      <el-col :span="6">
                              <h1>仓秘书仓储系统</h1>
                      </el-col>
              </el-row>
              <el-row>
                      <el-col :span="4">
                              <h2>普通出库单</h2>
                      </el-col>
                      <el-col :span="3" :offset="14">
                              <span>占位</span>
                      </el-col>
              </el-row>
              <el-row>
                <el-col></el-col>
                <el-col></el-col>
              </el-row>
              <el-row>
                      <el-col>
                              <el-table :data="row.order_items" border style="width: 92%;">
                                        <el-table-column type="index" width="60">
                                        </el-table-column>
                                        <el-table-column prop="name_cn" label="中文名称">
                                        </el-table-column>
                                        <el-table-column prop="relevance_code" label="SKU">
                                        </el-table-column>
                                        <el-table-column prop="amount" label="数量">
                                        </el-table-column>
                              </el-table>
                      </el-col>
              </el-row>
              <el-row>
                      <el-col>
                              <el-row>
                                      <el-col :span="3">
                                              <span>备注:</span>
                                      </el-col>
                              </el-row>
                              <el-row>
                                      <el-col :span="3">
                                              <span>仓库:{{row.warehouse.name_cn}}</span>
                                      </el-col>
                              </el-row>
                              <el-row>
                                      <el-col :span="3">
                                              <span>创建日期:{{row.created_at}}</span>
                                      </el-col>
                              </el-row>
                              <el-row>
                                      <hr />
                              </el-row>
                              <el-row>
                                      <el-col :span="3">运输方式:</el-col>
                                      <el-col :span="3" :offset="3">运单号:{{row.express_num}}</el-col>
                              </el-row>
                              <el-row>
                                      <el-col :span="10" :offset="15">
                                              <span>仓秘书免费的共享仓储管理系统  http://www.cangmishu.com</span>
                                      </el-col>
                              </el-row>
                      </el-col>
              </el-row>
  </el-dialog>
</template>

<script>
/* eslint-disable */
import $http from '@/api';

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
        console.log(this.row_data, 'this.row_dataidididid')
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
      let total = 0;
      if (!this.id || !this.warehouseId) return;
      // $http.outboundDetail(this.id,{warehouse_id:this.warehouseId}).then((res) => {
      //   this.outboundInfo = res.data;
      //   this.outboundList = res.data.order_items;
      //   console.log(this.outboundList,'仓库')
      //   this.warehouse_name = res.data.warehouse.name_cn;
      //   // this.distributor_name = res.data.distributor.name_cn;
      //   // this.category_name = res.data.batch_type.name;
      //   this.outboundList.forEach(item => {
      //     total += item.amount
      //   })
      //   this.totalAmount = total;
      // });
    },
  },
};
</script>
