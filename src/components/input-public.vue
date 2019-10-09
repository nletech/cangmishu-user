<template>
    <div>
        <el-row>
            <el-col :span="20">
                    <el-input v-model="value"
                              clearable
                              @change="handlerChange"
                              @clear="handlerClear"
                              size="small"
                              :placeholder="$t(`${select.placeholder}`)">
                    </el-input>
            </el-col>
            <el-col :span="2">
                <el-button size="small"
                            @click="handlerSearch">
                            {{$t('Search')}}
                </el-button>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';

export default {
  name: 'inputPublic',
  mixins: [mixin],
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
  methods: {
    handlerSearch() {
      if (!this.value) return;
      if (this.select.flag === 1) {
        if (!this.select.shopId) return;
        $http.goodsInShop(this.select.shopId, { // 查询货商品名称
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
      }
    },
    handlerClear() {
      if (this.select.flag === 1) {
        $http.goodsInShop(this.select.shopId, {
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
      }
    }, // 清空的时候重新拉取列表
    handlerChange(val) {
      if (val === '') {
        this.handlerClear();
      }
    },
  },
};
</script>
