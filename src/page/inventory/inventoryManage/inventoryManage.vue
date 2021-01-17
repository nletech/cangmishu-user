<template>
  <div :class="$style.page">
    <div :class="$style.main">
      <search @queryParams="handlerQueryParams"></search>
      <el-table element-loading-text="loading" v-loading="isButtonLoading" :data="stockList" border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.stocks" border>
              <el-table-column
                align="center"
                header-align="center"
                :label="$t('Inboundbatchnumber')"
                prop="sku"
              >
              </el-table-column>
              <el-table-column
                align="center"
                header-align="center"
                :label="$t('bestUseTime')"
                prop="best_before_date"
              >
              </el-table-column>
              <el-table-column
                align="center"
                header-align="center"
                :label="$t('Expirydate')"
                prop="expiration_date"
              >
              </el-table-column>
              <el-table-column
                align="center"
                header-align="center"
                :label="$t('ProductionBatch')"
                prop="production_batch_number"
              >
              </el-table-column>
              <el-table-column align="center" header-align="center" label="EAN" prop="ean">
              </el-table-column>
              <el-table-column
                align="center"
                header-align="center"
                :label="$t('warehouseStock')"
                prop="stock_num"
              >
              </el-table-column>
              <el-table-column
                align="center"
                header-align="center"
                :label="$t('StockCheck')"
                prop="recount_times"
              >
              </el-table-column>
              <el-table-column
                align="center"
                header-align="center"
                :label="$t('Location')"
                prop="warehouse_location_code"
              >
              </el-table-column>
              <el-table-column align="center" header-align="center" :label="$t('StockHistory')">
                <template slot-scope="scope">
                  <el-button size="small" @click="showStockDetail(scope.row)">{{
                    $t('detail')
                  }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column align="center" header-align="center" type="index" label="#">
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          width="300"
          :label="$t('ProductName')"
        >
          <template slot-scope="scope">
            {{ scope.row.product_name }}
          </template>
        </el-table-column>
        <el-table-column align="center" header-align="center" :label="$t('Chinesespecifications')">
          <template slot-scope="scope">
            {{ scope.row.name_cn }}
          </template>
        </el-table-column>
        <el-table-column align="center" header-align="center" prop="relevance_code" label="SKU">
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="total_stock_num"
          :label="$t('warehouseStock')"
        >
        </el-table-column>
        <el-table-column align="center" header-align="center" :label="$t('Inboundtimesnumbers')">
          <template slot-scope="scope">
            {{ scope.row.total_stockin_times }} / {{ scope.row.total_stockin_num }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="stock_out_times"
          :label="$t('Outboundtimesnumbers')"
        >
          <template slot-scope="scope">
            {{ scope.row.total_stockout_times }} / {{ scope.row.total_stockout_num }}
          </template>
        </el-table-column>
        <el-table-column align="center" header-align="center" :label="$t('StockHistory')">
          <template slot-scope="scope">
            <el-button size="mini" @click="viewDetails(scope.row)">{{ $t('detail') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="2" :offset="22">
          <pagination-public
            :class="$style.pagination"
            :params="query"
            @changePage="handlerChangePage"
          >
          </pagination-public>
        </el-col>
      </el-row>
    </div>
    <!-- 出入库详情弹框 -->
    <inventory-detail
      :visible.sync="inventoryDialogVisible"
      :rowInfo="rowInfo"
      :warehouseName="warehouseName"
      :id="id"
    >
    </inventory-detail>
    <!-- SKU详情 弹窗 -->
    <SkuDetails
      :visible.sync="skuDetalisSwitch"
      :stock_id="stock_id"
      :warehouseId="warehouseId"
      :warehouseName="warehouseName"
      :rowInfo="rowInfo"
    >
    </SkuDetails>
  </div>
</template>

<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';
import paginationPublic from '@/components/pagination-public';
import inventoryDetail from './components/inventory_detail';
import SkuDetails from './components/sku_Details';
import search from './components/search';

export default {
  mixins: [mixin],
  components: {
    inventoryDetail,
    SkuDetails,
    paginationPublic,
    search
  },
  data() {
    return {
      params: {
        total: '',
        currentPage: 1
      }, // 分页数据
      checked: false,
      boundList: [], // 入库仓库列表
      stockList: [],
      id: 0,
      export_data: [],
      // warehouseName: '',
      rowInfo: {},
      dialogVisible: false,
      inventoryDialogVisible: false,
      skuDetalisSwitch: false,
      stock_id: 0,
      query: {
        warehouse_id: '',
        show_low_stock: 0, // 低于库存
        keywords: '', // 搜索货品名称
        sku: '', // 搜索SKU
        page: '', // 分页
        total: '',
        currentPage: 1
      }
    };
  },
  computed: {
    ownerId() {
      return this.$store.state.token.id;
    }
  },
  watch: {
    warehouseId() {
      this.query.warehouse_id = this.warehouseId;
      this.getStocks(this.query);
    }
  },
  created() {
    this.query.warehouse_id = this.warehouseId;
    this.getStocks(this.query);
    if (this.$route.query.checked) {
      this.handlerInventorySwitch(1);
    }
  },
  methods: {
    handlerQueryParams(params) {
      this.query = params;
      this.getStocks(this.query);
    },
    getStocks(query) {
      if (!query.warehouse_id) return;
      $http.getStocks(query).then(res => {
        if (res.status) return;
        this.stockList = res.data.data;
        this.query.total = res.data.total;
        this.query.currentPage = res.data.current_page;
      });
    }, // 获取库存列表
    handlerChangePage(val) {
      this.query.page = val;
      this.getStocks(this.query);
    }, // 分页响应
    showStockDetail(row) {
      this.skuDetalisSwitch = true;
      this.stock_id = row.id;
      this.rowInfo = row;
    }, // sku 的详情
    viewDetails(row) {
      this.inventoryDialogVisible = true;
      this.id = row.id;
      this.rowInfo = row;
    } // 入库单详情弹框
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
    .pagination {
      margin: 10px 0 0 0;
      float: right;
    }
  }
}

.mycheck {
  height: 32px;
  line-height: 32px;
}
</style>
