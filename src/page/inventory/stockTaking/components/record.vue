<template>
  <!--
  * 仓秘书免费开源WMS仓库管理系统+订货订单管理系统
  *
  * (c) Hunan NLE Network Technology Co., Ltd. <cangmishu.com>
  *
  * For the full copyright and license information, please view the LICENSE
  * file that was distributed with this source code.
  *
  -->
  <el-dialog width="80%" @update:visible="$emit('update:visible', $event)" :visible="visible">
    <h1 class="details-h1">({{ row.sku }})出入库记录</h1>
    <el-table :data="inventoryList" fit border>
      <el-table-column type="index" align="center" header-align="center" width="60">
      </el-table-column>
      <el-table-column label="类型" prop="type" align="center" header-align="center" width="60">
      </el-table-column>
      <el-table-column label="操作数量" prop="operation_num" align="center" header-align="center">
      </el-table-column>
      <el-table-column label="入库批次" align="center" header-align="center" prop="sku">
      </el-table-column>
      <el-table-column label="操作时间" align="center" header-align="center" prop="created_at">
      </el-table-column>
      <el-table-column
        label="仓库库存"
        align="center"
        header-align="center"
        prop="sku_total_stockin_num"
      >
      </el-table-column>
      <el-table-column label="相关单号" prop="order_sn" align="center" header-align="center">
      </el-table-column>
      <el-table-column :label="$t('remark')" prop="remark" align="center" header-align="center">
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import $http from '@/api';

export default {
  name: 'record',
  props: {
    visible: Boolean,
    row: {
      type: Object,
      default() {
        return {};
      }
    },
    warehouseId: String,
    warehouseName: String
  },
  data() {
    return {
      inventoryList: []
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        const data = { warehouse_id: this.row.warehouseId };
        this.queryInventory(this.row.stock_id, data);
      } else {
        this.inventoryList = [];
      }
    }
  },
  methods: {
    // eslint-disable-next-line
    queryInventory(stock_id, data) {
      $http.queryInboundOutboundRecord(stock_id, data).then(res => {
        if (res.status) return;
        this.inventoryList = res.data.data;
      });
    }
  }
};
</script>

<style lang="less">
.details-h1 {
  text-align: center;
}
</style>
