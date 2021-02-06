<template>
  <div :class="$style.select_goods">
    <!-- 选择商品弹窗 -->
    <el-dialog
      title="选择商品"
      width="80%"
      :visible.sync="visible_goods"
      :before-close="handleClose"
    >
      <el-table
        ref="table"
        border
        :data="goods"
        style="width: 100%"
        @selection-change="handleSelected"
        :row-style="{ cursor: 'pointer' }"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="商品名称" prop="name_cn"> </el-table-column>
        <el-table-column prop="specs[0].relevance_code" label="SKU"> </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        :class="$style.pagination"
        v-show="+total"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        layout="total, prev, pager, next, jumper"
        :total="+total"
      >
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="confirmSelected"
          :class="$style.submit_btn"
          :loading="$store.state.btn_loading"
        >
          {{ $t('submit') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $http from '@/api';

export default {
  name: 'selectGoods',
  props: {
    visible_goods: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      goods: [],
      total: '',
      selected: [], // 初选
      currentPage: 1,
      all_selected: [] // 总的选择存储（因为有分页）
    };
  },
  watch: {
    visible_goods() {
      if (this.visible_goods) {
        this.getGoodsList();
      }
    }
  },
  computed: {
    warehouse_id() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    }
  },
  methods: {
    handleSelected(arr) {
      this.selected = [];
      for (let i = 0; i < arr.length; i += 1) {
        this.selected.push(arr[i]);
      }
    }, // 将选中项缓存起来
    getGoodsList() {
      // eslint-disable-next-line
      const warehouse_data = {
        warehouse_id: this.warehouse_id
      };
      $http.getProducts(warehouse_data).then(res => {
        if (res.status) return;
        this.goods = res.data.data;
        this.total = res.data.total;
        this.currentPage = res.data.current_page;
      });
    }, // 获取商品列表
    handleClose() {
      this.$emit('update:visible_goods', false);
    },
    handleSelectGoods() {
      this.visible_goods = true;
    },
    confirmSelected() {
      for (let i = 0; i < this.selected.length; i += 1) {
        this.all_selected.push(this.selected[i]);
      }
      // 这里对包含对象的数组进行去重（根据对象的id属性）
      function removeArrObj(arr) {
        const obj = {}; // 用作记录的对象
        const result = []; // 接收去重后的数组
        // eslint-disable-next-line
        let subObj = arr;
        for (let i = 0; i < subObj.length; i += 1) {
          if (!obj[subObj[i].id]) {
            result.push(subObj[i]);
            obj[subObj[i].id] = true;
          } // 在数组的对象中, id 唯一则推入到 result 数组
        }
        return result;
      }
      const result = removeArrObj(this.all_selected);
      this.all_selected = []; // 初始化
      this.$emit('select-goods_data', result); // 回传给父组件
      this.$emit('update:visible_goods', false);
    }, // 提交
    handleCurrentChange(val) {
      for (let i = 0; i < this.selected.length; i += 1) {
        this.all_selected.push(this.selected[i]);
      } // 缓存当前页的选中项
      // 分页请求
      $http
        .getProductsPage({
          page: val,
          warehouse_id: this.warehouse_id
        })
        .then(res => {
          if (res.status) return;
          this.goods = res.data.data;
          this.total = res.data.total;
          this.currentPage = res.data.current_page;
        });
    } // 分页
  }
};
</script>

<style lang="less" module>
.select_goods {
  .select_goods_btn {
    margin: 0 0 10px 0;
  }
  .pagination {
    margin: 10px 0 10px 0;
    float: right;
  }
  .submit_btn {
    margin: 10px 0 0 0;
  }
}
</style>
