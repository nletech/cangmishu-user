<template>
          <div>
               <el-select  v-model="value"
                           clearable
                           size="small"
                           @clear="handlerClear"
                           @change="handlerChange"
                           :placeholder="select.placeholder">
                           <el-option  v-for="item in this.select.options"
                                       :key="item.value"
                                       :label="item.name"
                                       :value="item.id">
                           </el-option>
               </el-select>
          </div>
</template>
<script>
import $http from '@/api';

export default {
  name: 'selectPublic',
  props: {
    select: {
      type: Object,
    },
  },
  data() {
    return {
      value: '',
    };
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  methods: {
    handlerChange(val) {
      if (this.select.cb_flag === 0) { // 搜索入库单分类
        $http.getInboundPage({
          warehouse_id: this.warehouseId,
          type_id: val,
        })
          .then((res) => {
            this.$emit('data_cb', res);
          });
      } else if (this.select.cb_flag === 1) { // 搜索入库单状态
        $http.getInboundPage({
          warehouse_id: this.warehouseId,
          status: val,
        })
          .then((res) => {
            this.$emit('data_cb', res);
          });
      } else if (this.select.cb_flag === 2) { // 供应商
        $http.getInboundPage({
          warehouse_id: this.warehouseId,
          distributor_id: val,
        })
          .then((res) => {
            this.$emit('data_cb', res);
          });
      } else if (this.select.cb_flag === 3) { // 出库单状态
        $http.getOutbound({
          warehouse_id: this.warehouseId,
          status: val,
        })
          .then((res) => {
            this.$emit('data_cb', res);
          });
      }
    },
    handlerClear() {
      if (this.select.cb_flag !== 3) {
        $http.getInbounds({
          warehouse_id: this.warehouseId,
        })
          .then((res) => {
            this.$emit('data_cb', res);
          });
      } else {
        $http.getOutbound({
          warehouse_id: this.warehouseId,
        })
          .then((res) => {
            this.$emit('data_cb', res);
          });
      }
    }, // 清空的时候重新拉取列表
  },
};
</script>
