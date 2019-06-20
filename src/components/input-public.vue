<template>
          <div>
                <el-row>
                        <el-col :span="20">
                                <el-input v-model="value"
                                          clearable
                                          @clear="handlerClear"
                                          size="small"
                                          :placeholder="select.placeholder">
                                </el-input>
                        </el-col>
                        <el-col :span="2">
                                <el-button size="small"
                                           @click="handlerSearch">
                                           搜索
                                </el-button>
                        </el-col>
                </el-row>
          </div>
</template>
<script>
import $http from '@/api';

export default {
  name: 'inputPublic',
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
    handlerSearch() {
      if (!this.value) return;
      if (this.select.flag === 1) {
        $http.getOutbound({ // 搜索出库单
          warehouse_id: this.warehouseId,
          keywords: this.value,
        })
          .then((res) => {
            this.$emit('data_cb', res);
          });
      } else if (this.select.flag === 2) { // 搜索入库单
        $http.getInboundPage({
          warehouse_id: this.warehouseId,
          keywords: this.value,
        })
          .then((res) => {
            this.$emit('data_cb', res);
          });
      } else if (this.select.flag === 3) {
        $http.queryProducts({ // 查询货品（通过货品和sku）
          warehouse_id: this.warehouseId,
          keywords: this.value,
        })
          .then((res) => {
            this.$emit('data_cb', res);
          });
      } else if (this.select.flag === 4) {
        $http.getStocks({ // 查询货品（通过货品和sku）
          warehouse_id: this.warehouseId,
          keywords: this.value,
        })
          .then((res) => {
            this.$emit('data_cb', res);
          });
      }
    },
    handlerClear() {
      if (this.select.flag === 1) {
        $http.getOutbound({
          warehouse_id: this.warehouseId,
        })
          .then((res) => {
            this.$emit('data_cb', res);
          });
      } else if (this.select.flag === 2) {
        $http.getInbounds({
          warehouse_id: this.warehouseId,
        })
          .then((res) => {
            this.$emit('data_cb', res);
          });
      } else if (this.select.flag === 3) {
        $http.getProducts({
          warehouse_id: this.warehouseId,
        })
          .then((res) => {
            this.$emit('data_cb', res);
          });
      } else if (this.select.flag === 4) {
        $http.getStocks({
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
