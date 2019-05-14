<template>
<div class="storeManage">
  <cms-tags
    :tagList="tag_data"
    v-model="type"
    :addText="addText"
    @change="initArea"
    :query="this.$route.query.id"
  >
    <warehouse-area @change="seeArea" v-if="type == 1"></warehouse-area>
    <warehouse-shelf :id="warehouse_area_id" v-else-if="type == 2"></warehouse-shelf>
    <batch-type v-else-if="type == 3"></batch-type>
    <order-type v-else-if="type == 4"></order-type>
  </cms-tags>
</div>
</template>

<script>
import CmsTags from '@/components/cms'; // 标签复用组件
import WarehouseArea from './components/warehouseArea'; // 货区
import WarehouseShelf from './components/warehouseShelf'; // 货位
import BatchType from './components/batchType'; // 入库单分类数据表
import OrderType from './components/orderType'; // 入库单分类数据表

export default {
  data() {
    return {
      tag_data: [
        { name: '1', label: '货区', addName: 'addCargoArea' },
        { name: '2', label: '货位', addName: 'addCargoShelf' },
        { name: '3', label: '入库单分类', addName: 'addBatchType' },
        { name: '4', label: '出库单分类', addName: 'addOrderType' },
      ],
      type: '1',
      warehouse_area_id: '',
    };
  },
  components: {
    CmsTags,
    WarehouseArea,
    WarehouseShelf,
    OrderType,
    BatchType,
  },
  computed: {
    addText() {
      let name = '';
      for (const item of this.tag_data) {
        if (item.name === this.type) {
          name = item.addName;
        }
      }
      return name;
    },
  },
  created() {
    this.type = this.$route.query.type || '1';
  },
  methods: {
    seeArea(id) {
      this.type = '3';
      this.warehouse_area_id = id;
    },
    initArea() {
      this.warehouse_area_id = '';
    },
  },
};
</script>
