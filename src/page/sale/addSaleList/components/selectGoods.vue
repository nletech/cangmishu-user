<template>
  <!--
  * 仓秘书免费开源WMS仓库管理系统+订货订单管理系统
  *
  * (c) Hunan NLE Network Technology Co., Ltd. <cangmishu.com>
  *
  * For the full copyright and license information, please view the LICENSE
  * file that was distributed with this source code.
  *
  -->
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
        :data="goodsList"
        style="width: 100%"
        :row-style="{ cursor: 'pointer' }"
      >
        <el-table-column type="expand" width="55">
          <template slot-scope="scope">
            <el-table :data="scope.row.specs" @row-click="rowClickGoods" border>
              <el-table-column width="55">
                <template slot-scope="scope">
                  <label class="el-checkbox">
                    <span class="el-checkbox__input" :class="scope.row.checked && 'is-checked'">
                      <span class="el-checkbox__inner"></span>
                    </span>
                  </label>
                </template>
              </el-table-column>
              <el-table-column label="SKU" prop="relevance_code"> </el-table-column>
              <el-table-column label="规格中文名" prop="name_cn"> </el-table-column>
              <el-table-column label="规格外文名" prop="name_en"> </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="商品中文名称" prop="name_cn"> </el-table-column>
        <el-table-column prop="name_en" label="商品英文名称"> </el-table-column>
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
        <el-row>
          <el-col :span="2" :offset="22">
            <el-button
              type="primary"
              @click="confirmSelected"
              :class="$style.submit_btn"
              :loading="$store.state.btn_loading"
            >
              {{ $t('submit') }}
            </el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';

export default {
  name: 'selectGoods',
  props: {
    visible_goods: {
      type: Boolean,
      default: false
    }
  },
  mixins: [mixin],
  data() {
    return {
      goodsList: [],
      total: '',
      goodsSelected: [], // 初选
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
  methods: {
    getGoodsList() {
      // eslint-disable-next-line
      const warehouse_data = {
        warehouse_id: this.warehouse_id
      };
      $http.getProducts(warehouse_data).then(res => {
        if (res.status) return;
        this.goodsList = res.data.data;
        this.total = res.data.total;
        this.currentPage = res.data.current_page;
      });
    }, // 获取商品列表
    rowClickGoods(row) {
      this.$set(row, 'checked', !row.checked);
      if (row.checked) {
        // eslint-disable-next-line
        this.goodsSelected.some(item => item.id === row.id) || this.goodsSelected.push(row);
        return;
      }
      this.goodsSelected = this.goodsSelected.filter(item => +item.id !== +row.id);
    },
    // 以上修改
    handleSelected(arr) {
      this.selected = [];
      for (let i = 0; i < arr.length; i += 1) {
        this.selected.push(arr[i]);
      }
    }, // 将选中项缓存起来
    handleSelectGoods() {
      this.visible_goods = true;
    },
    confirmSelected() {
      this.goodsList = [...this.goodsSelected];
      this.$emit('select-goods_data', this.goodsList); // 回传给父组件
      this.$emit('update:visible_goods', false);
      this.handleClose();
    }, // 提交
    handleClose() {
      this.goodsSelected = [];
      this.$emit('update:visible_goods', false);
    },
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
          this.goodsList = res.data.data;
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
