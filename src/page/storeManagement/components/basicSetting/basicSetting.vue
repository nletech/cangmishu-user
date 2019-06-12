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
    </cms-model>
  </div>
</template>
<script>
import CmsModel from '@/components/cms-model/cms-model';
import WarehouseArea from './components/warehouseArea';
import WarehouseShelf from './components/warehouseShelf';

export default {
  created() {
    if (this.$route.params.add_shelf_back) {
      this.active_tab_name = '货位';
    } // 用于添加货位之后的返回操作
  },
  name: 'basicSetting',
  components: {
    CmsModel,
    WarehouseArea,
    WarehouseShelf,
  },
  watch: {
    show_data() {
      this.show_data = this.show_data;
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
    handle_add_callback(val) {
      if (val === '货区') {
        this.$router.push({
          name: 'addCargoArea',
          params: { warehouse_id: this.warehouse_id },
        });
        //
      } else if (val === '货位') {
        this.$router.push({
          name: 'addCargoShelf',
          params: { warehouse_id: this.warehouse_id },
        });
      }
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
