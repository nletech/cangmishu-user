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
  </cms-tags>
</div>
</template>

<script>
import CmsTags from '@/components/cms'; // 标签复用组件
import WarehouseArea from './components/warehouseArea'; // 货区
import WarehouseShelf from './components/warehouseShelf'; // 货位

export default {
  data() {
    return {
      tag_data: [
        { name: '1', label: '货区', addName: 'addCargoArea' },
        { name: '2', label: '货位', addName: 'addCargoShelf' },
      ],
      type: '1',
      warehouse_area_id: '',
    };
  },
  components: {
    CmsTags,
    WarehouseArea,
    WarehouseShelf,
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
