<template>
  <el-dialog
    title="查看出库单"
    width="70%"
    @close="close"
    @update:visible="$emit('update:visible', $event)"
    :visible="visible"
  >
  <el-row :gutter="10">
    <el-col :span="6" :offset="9">
      <h2>({{warehouse_name}})出库单</h2>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="3">出库单分类</el-col>
    <el-col :span="10">
      <!-- <span v-if="outboundInfo.order_type">{{outboundInfo.order_type.name}}</span> -->
      {{outboundInfo.order_type ?  outboundInfo.order_type.name : ''}}
    </el-col>
  </el-row>
  <!-- <el-row :gutter="20">
    <el-col :span="3">出库单编号</el-col>
    <el-col :span="10">{{outboundInfo.order_code}}</el-col>
  </el-row> -->
  <el-row :gutter="20">
    <el-col :span="3">物流单号</el-col>
    <el-col :span="10">{{outboundInfo.express_num}}</el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="3">出库状态</el-col>
    <el-col :span="10">{{outboundInfo.status_name}}</el-col>
  </el-row>
  <h3>货品列表</h3>
    <el-table :data="outboundList" border style="width: 100%">
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
        prop="product_name"
        label="货品库中文名称"
      >
      </el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        prop="name_cn"
        label="外部中文名称"
      >
      </el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        prop="relevance_code"
        label="外部编码"
      >
      </el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        prop="amount"
        label="出库数量(个)"
      >
      </el-table-column>
      <!-- <el-table-column prop="amount" label="每箱件数">
      </el-table-column> -->
      <!-- <el-table-column prop="expiration_date" label="保质期">
      </el-table-column>
      <el-table-column prop="batch_code" label="批次号">
      </el-table-column> -->
    </el-table>

    <el-row>
      <el-col :span="8" :offset="16">
        <el-row>
          <el-col :span="8">出库总数:</el-col>
          <el-col :span="14">{{totalAmount}}</el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="8">核验人:</el-col>
          <el-col :span="14">{{outboundInfo.operator_user}}</el-col>
        </el-row> -->
        <el-row>
          <el-col :span="8">预计出库日期:</el-col>
          <el-col :span="14">{{outboundInfo.delivery_date}}</el-col>
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
    // outboundInfo: Object,
    id: Number,
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
      warehouse_name: '',
      totalAmount: '',
    };
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId;
    },
  },
  watch: {
    warehouseId() {
      this.getList();
    },
    id: {
      handler(value) {
        this.getList();
      },
      deep: true,
    },
  },
  methods: {
    close() {
      // this.page_params.page = 1;
    },
    getList() {
      let total = 0;
      if (!this.id || !this.warehouseId) return;
      $http.outboundDetail(this.id,{warehouse_id:this.warehouseId}).then((res) => {
        this.outboundInfo = res.data;
        this.outboundList = res.data.order_items;
        this.warehouse_name = res.data.warehouse.name_cn;
        // this.distributor_name = res.data.distributor.name_cn;
        // this.category_name = res.data.batch_type.name;
        this.outboundList.forEach(item => {
          total += item.amount
        })
        this.totalAmount = total;
      });
    },
  },
};
</script>
