<template>
  <div :class="$style.address_management">
    <cms-model  :tabs="tabs"
                :active_tab_name="active_tab_name"
                @act_name_callback="handle_tab_name_callback"
                @add_callback="handle_add_callback">
                <!-- 货区数据 -->
                <warehouse-area  v-show="show_data === '货区'"
                                 :show_data_flag="show_data"
                                 :warehouse_id="warehouse_id">
                </warehouse-area>
                <!-- 货位数据 -->
                <warehouse-shelf  v-show="show_data === '货位'"
                                  :show_data_flag="show_data"
                                  :warehouse_id="warehouse_id">
                </warehouse-shelf>
                <cms-pagination slot="pagination"></cms-pagination>
    </cms-model>
  </div>
</template>
<script>
import CmsModel from '../../../../components/cms-model/cms-model';
import CmsPagination from '../../../../components/cms-pagination';
import WarehouseArea from './components/warehouseArea';
import WarehouseShelf from './components/warehouseShelf';

export default {
  mounted() {
    console.log(this.warehouse_id, 'this.warehouse_idthis.warehouse_id');
  },
  name: 'demo1',
  components: {
    CmsModel,
    CmsPagination,
    WarehouseArea,
    WarehouseShelf,
  },
  watch: {
    show_data() {
      this.show_data = this.show_data;
      // this.warehouse_id = this.warehouse_id;
    },
  },
  data() {
    return {
      tabs: [
        {
          id: 1,
          name: '货区',
          btn_text: '添加货区',
        }, {
          id: 2,
          name: '货位',
          btn_text: '添加货位',
        },
      ],
      active_tab_name: '货区',
      show_data: '',
      warehouse_id: +localStorage.getItem('warehouseId'),
    };
  },
  methods: {
    handle_add_callback() {
    },
    handle_tab_name_callback(activeTab) {
      this.show_data = activeTab;
    },
  },
};
</script>
<style lang="less" module>
@import '../../../../less/public_variable.less';

.address_management {
  margin: 20px 0 0 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background: #ccc;
}
</style>
