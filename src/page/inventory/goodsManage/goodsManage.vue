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
  <div :class="$style.page">
    <div :class="$style.main">
      <div :class="$style.header">
        <goods-list-search @queryParams="handlerQueryParams"></goods-list-search>
        <br />
      </div>
      <!-- 货品数据展示列表 -->
      <el-table
        element-loading-text="loading"
        v-loading="isButtonLoading"
        :data="goods_list_data"
        @selection-change="handleSelectionChange"
        border
      >
        <!-- 右箭头 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.specs" border>
              <el-table-column type="index" label="#" header-align="center" align="center">
              </el-table-column>
              <el-table-column
                prop="relevance_code"
                label="SKU"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="name_cn"
                :label="$t('specificationChineseName')"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="name_en"
                v-if="isEnabledLangInput()"
                :label="$t('specificationEnglishName')"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="gross_weight"
                :label="$t('grossWeight')"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="purchase_price"
                :label="$t('PurchasePrice')"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="sale_price"
                :label="$t('SalePrice')"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="total_stock_num"
                align="center"
                header-align="center"
                :label="$t('inventory')"
              >
              </el-table-column>
              <el-table-column align="center" header-align="center" label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" @click="showStockDetail(scope.row.id)">详细</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <!-- 中文名称 -->
        <el-table-column
          prop="name_cn"
          align="center"
          width="300"
          header-align="center"
          :label="$t('cnName')"
        >
        </el-table-column>
        <!-- 外文名称 -->
        <el-table-column
          prop="name_en"
          width="300"
          v-if="isEnabledLangInput()"
          align="center"
          header-align="center"
          :label="$t('enName')"
        >
        </el-table-column>
        <!-- 分类 -->
        <el-table-column
          prop="category.name_cn"
          align="center"
          header-align="center"
          width="100"
          :label="$t('category')"
        >
        </el-table-column>
        <!-- 零售价 -->
        <el-table-column
          prop="purchase_price"
          align="center"
          header-align="center"
          :label="$t('PurchasePrice')"
        >
        </el-table-column>
        <el-table-column
          prop="sale_price"
          align="center"
          header-align="center"
          :label="$t('SalePrice')"
        >
        </el-table-column>
        <el-table-column
          prop="total_stock_num"
          align="center"
          header-align="center"
          :label="$t('inventory')"
        >
        </el-table-column>
        <!-- 最后修改时间 -->
        <el-table-column
          prop="updated_at"
          align="center"
          header-align="center"
          :label="$t('LastUpdated')"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.updated_at }}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          border
          :label="$t('operation')"
          width="180"
          header-align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-tooltip content="详细" placement="top">
              <el-button
                :loading="isButtonLoading"
                size="mini"
                icon="el-icon-view"
                @click="viewCommodity(scope.row.id)"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip :content="$t('edit')" placement="top">
              <el-button
                :loading="isButtonLoading"
                size="mini"
                icon="el-icon-edit"
                @click="editCommodity(scope.row.id, scope.row.warehouse_id, scope.row)"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip :content="$t('remove')" placement="top">
              <el-button
                :loading="isButtonLoading"
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteCommodity(scope.row.id)"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="2" :offset="22">
          <pagination-public
            :class="$style.pagination"
            :params="params"
            @changePage="handlerChangePage"
          >
          </pagination-public>
        </el-col>
      </el-row>
    </div>
    <!-- 设置分类弹框 -->
    <el-dialog :visible.sync="centerDialogVisible" width="30%" center>
      <el-select
        v-if="this.selectGoods.length > 0"
        size="middle"
        :class="$style.centerSelection"
        v-model="selectCategory_id"
      >
        <el-option v-for="item in typeList" :label="item.name_cn" :value="item.id" :key="item.id">
        </el-option>
      </el-select>
      <span v-else :class="$style.centerText">请先选择货品</span>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="this.selectGoods.length > 0"
          :loading="isButtonLoading"
          @click="centerDialogVisible = false"
        >
          {{ $t('cancel') }}
        </el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ $t('confirm') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';
import paginationPublic from '@/components/pagination-public';
import goodsListSearch from './components/goodsListSearch';

export default {
  name: 'goodsManage',
  data() {
    return {
      inventorySwitch: 0, // 低于库存
      params: {
        total: 1
      }, // 分页参数
      goods_list_data: [], // 货品库列表
      typeList: [], // 分类列表
      selectGoods: [], // 选择商品
      centerDialogVisible: false,
      importVisible: false,
      importgoods: '',
      selectCategory_id: '',
      dialogVisible: true,
      select_batch_code: {
        placeholder: 'ProductnameorSKU',
        flag: 3
      },
      query: {
        warehouse_id: '',
        category_id: '',
        keywords: '',
        page: '',
        show_low_stock: ''
      }
    };
  },
  components: {
    paginationPublic,
    goodsListSearch
  },
  mixins: [mixin],
  filters: {
    is_warning_filter(val) {
      // eslint-disable-next-line
      switch (+val) {
        case 1:
          return this.$t('yes');
        case 0:
          return this.$t('no');
      }
    }
  },
  created() {
    this.query.warehouse_id = this.warehouseId;
    this.getList(this.query);
  },
  computed: {
    Authorization() {
      return { Authorization: this.$store.state.token.token };
    }
  },
  watch: {
    warehouseId() {
      this.query.warehouse_id = this.warehouseId;
      this.getList(this.query);
      this.getTypeList();
    }
  },
  methods: {
    showStockDetail(id) {
      this.$router.push({
        name: 'inventoryDetail',
        query: {
          id: id
        }
      });
    }, // 规格库存详细
    handlerQueryParams(params) {
      this.query = params;
      this.getList(this.query);
    },
    /*
     * 说明: 获取货品列表以及复合查询接口
     * @query {Object} 必须
     */
    getList(query) {
      if (!this.query.warehouse_id) return;
      $http.getProducts(query).then(res => {
        if (res.status) return;
        this.goods_list_data = res.data.data;
        this.params.total = res.data.total;
        this.params.currentPage = res.data.current_page;
      });
    },

    handlerInventorySwitch(val) {
      if (val === 1) {
        this.query.show_low_stock = 1;
      } else {
        this.query.show_low_stock = '';
      }
      this.getList(this.query);
    }, // 查询库存

    handlerClear() {
      this.query.warehouse_id = this.warehouseId;
      this.query.category = '';
      this.query.keywords = '';
      this.query.page = '';
      this.query.show_low_stock = '';
      this.getList(this.query);
    }, // 清空选择框回调

    handlerSelect(categoryId) {
      if (categoryId === 0) {
        this.query.category_id = '';
      } else {
        this.query.category_id = categoryId;
      }
      this.getList(this.query);
    }, // 选择货品分类回调

    handlerChangePage(pageVal) {
      if (pageVal === 0) {
        this.query.page = '';
      } else {
        this.query.page = pageVal;
      }
      this.getList(this.query);
    },
    handleSelectionChange(val) {
      this.selectGoods = [];
      val.forEach(element => {
        this.selectGoods.push({ id: element.id });
      });
    },

    handleSubmit() {
      if (!this.warehouseId || this.selectGoods.length === 0) {
        this.centerDialogVisible = false;
        return;
      }
      $http
        .setGoodscategory({
          category_id: this.selectCategory_id,
          product_ids: this.selectGoods,
          warehouse_id: this.warehouseId
        })
        .then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.centerDialogVisible = false;
          this.getList(this.query);
        });
    },

    setGoodsType() {
      this.centerDialogVisible = false;
    },
    viewCommodity(id) {
      this.$router.push({
        name: 'goodsDetail',
        query: {
          id: id
        }
      });
    },
    editCommodity(idVal, wID) {
      this.$router.push({
        name: 'goodsEdit',
        query: {
          id: idVal,
          warehouse_id: wID,
          isCheck: true
        }
      });
    }, // 编辑货品

    deleteCommodity(id) {
      this.$confirm(this.$t('AcrionTips'), this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        $http.deleteProducts(id).then(res => {
          if (res.status) return;
          this.$message({
            message: this.$t('success'),
            type: 'success'
          });
          this.getList(this.query);
        });
      });
    } // 查看货品
  }
};
</script>

<style lang="less" module>
.page {
  .main {
    margin: 0 auto;
    .header {
      margin: 0 0 10px 0;
      .header_btn {
        font-size: @fontSize;
        vertical-align: middle;
      }
    }
  }
}

.centerSelection {
  position: relative;
  margin-left: 50%;
  transform: translateX(-50%);
}
.centerText {
  width: 100%;
  display: inline-block;
  font-size: 20px;
  text-align: center;
}
.uploaddemo {
  display: inline-block;
  text-align: center;
}
.text_modify {
  margin: 0 0 10px 0;
}
.line {
  position: relative;
  left: 100px;
  width: 2px;
  height: 120px;
  border-right: 1px solid #ccc;
}
.pagination {
  margin: 10px 0 0 0;
  float: right;
}
</style>
