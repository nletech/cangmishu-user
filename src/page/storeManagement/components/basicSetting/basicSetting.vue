<template>
  <div :class="$style.address_management">
    <cms-model
      :tabs="tabs"
      :active_tab_name="active_tab_name"
      @act_name_callback="handle_tab_name_callback"
      @add_callback="handle_add_callback"
    >
      <!-- 货区数据 -->
      <warehouse-area v-show="show_data === '货区'" :show_data_flag="show_data"> </warehouse-area>
      <!-- 货位数据 -->
      <warehouse-shelf v-show="show_data === '货位'" :show_data_flag="show_data"> </warehouse-shelf>
    </cms-model>
  </div>
</template>
<script>
import CmsModel from '@/components/cms-model/cms-model';
import WarehouseArea from './components/warehouseArea';
import WarehouseShelf from './components/warehouseShelf';

export default {
  created() {
    // if (this.$route.query.quickTag) {
    //   this.tempWarehouseId = localStorage.getItem('warehouseId');
    // }
    if (this.$route.query.backType === 'shelf') {
      this.active_tab_name = '货位';
    } else if (this.$route.query.backType === 'area') {
      this.active_tab_name = '货区';
    }
    const { name, params, query } = this.$route;
    this.$router.replace({
      name,
      params,
      query: { ...query, backType: '' }
    });
  },
  name: 'basicSetting',
  components: {
    CmsModel,
    WarehouseArea,
    WarehouseShelf
  },
  watch: {
    show_data() {
      // this.show_data = this.show_data;
    }
  },
  data() {
    return {
      tempWarehouseId: '',
      tabs: [
        {
          tag: 1,
          title: 'Section',
          name: '货区',
          btn_text: '添加货区'
        },
        {
          tag: 2,
          title: 'Rack',
          name: '货位',
          btn_text: '添加货位'
        }
      ],
      active_tab_name: '货区',
      show_data: ''
    };
  },
  computed: {
    queryWarehouseId() {
      if (+this.$route.query.warehouse_id) {
        return +this.$route.query.warehouse_id;
      }
      return localStorage.getItem('warehouseId');
    }
  },
  methods: {
    handle_add_callback(val) {
      if (val === '货区') {
        this.$router.push({
          name: 'addCargoArea',
          query: { warehouse_id: this.queryWarehouseId }
        });
        //
      } else if (val === '货位') {
        this.$router.push({
          name: 'addCargoShelf',
          query: { warehouse_id: this.queryWarehouseId }
        });
      }
    },
    handle_tab_name_callback(activeTab) {
      this.show_data = activeTab;
    }
  }
};
</script>
<style lang="less" module>
.address_management {
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>
