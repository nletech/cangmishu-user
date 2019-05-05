<template>
<div class="storeManage">
  <wms-tags
    :tagList="tag_data"
    v-model="type"
    :addText="addText"
    @change="initArea"
    :query="this.$route.query.id">
    <warehouse-property v-if="type == 1"></warehouse-property>
    <warehouse-area @change="seeArea" v-if="type == 2"></warehouse-area>
    <warehouse-shelf :id="warehouse_area_id" v-else-if="type == 3"></warehouse-shelf>
    <warehouse-tray v-else-if="type == 4"></warehouse-tray>
    <warehouse-kep v-else-if="type == 5"></warehouse-kep>
    <batch-type v-else-if="type == 6"></batch-type>
    <order-type v-else-if="type == 7"></order-type>
    <category-type v-else-if="type == 8"></category-type>
    <!-- <goods-alarm v-else-if="type == 9"></goods-alarm> -->
  </wms-tags>
</div>
</template>

<script>
import WmsTags from '@/components/wms_tags';
import WarehouseProperty from './componenets/warehouseProperty';
import WarehouseArea from './componenets/warehouseArea';
import WarehouseShelf from './componenets/warehouseShelf';
import WarehouseTray from './componenets/warehouseTray';
import WarehouseKep from './componenets/warehouseKep';
import BatchType from './componenets/batchType';
import OrderType from './componenets/orderType';
import CategoryType from './componenets/categoryType';

export default {
  data() {
    return {
      tag_data: [
        { name: '1', label: '仓库特性', addName: 'addCargoProperty' },
        { name: '2', label: '货区', addName: 'addCargoArea' },
        { name: '3', label: '货位', addName: 'addCargoShelf' },
        // { name: '4', label: '托盘', addName: 'addCargoTray' },
        { name: '5', label: '篮筐', addName: 'addCargoKep' },
        { name: '6', label: '入库单分类', addName: 'addBatchType' },
        { name: '7', label: '出库单分类', addName: 'addOrderType' },
        { name: '8', label: '货品分类', addName: 'addCategory' },
        // { name: '9', label: '报警管理' },
      ],
      type: '1',
      warehouse_area_id: '',
    };
  },
  components: {
    WarehouseProperty,
    WmsTags,
    WarehouseArea,
    WarehouseShelf,
    WarehouseTray,
    WarehouseKep,
    OrderType,
    BatchType,
    CategoryType,
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

<style lang="less" module>
  @import '../../less/public_variable.less';
</style>
<style lang="less">
  @import '../../less/public_variable.less';
</style>
