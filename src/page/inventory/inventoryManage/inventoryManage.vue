<template>
    <div :class="$style.page">
        <div :class="$style.main">
            <el-row :class="$style.header">
                    <el-col :span="4">
                        <el-input
                            size="small"
                            @clear="handlerClear"
                            clearable
                            v-model="query.product_name"
                            placeholder="货品名称">
                        </el-input>
                    </el-col>
                    <el-col :span="4" :offset="1">
                        <el-input
                            size="small"
                            clearable
                            @clear="handlerClear"
                            v-model="query.sku"
                            placeholder="入库批次号">
                        </el-input>
                    </el-col>
                    <el-col :span="1">
                        <el-button  size="small"
                                    @click="handlerSearch">
                                    搜索
                        </el-button>
                    </el-col>
                    <!-- 低于库存 -->
                    <el-col :span="2" :offset="1">
                        <div style="position: relative; top: 5px; font-size: 1.2rem;">
                            <el-checkbox
                                :true-label="1"
                                @change="handlerInventorySwitch"
                                v-model="query.show_low_stock">
                              低于库存
                            </el-checkbox>
                        </div>
                    </el-col>
                    <el-col :span="2" :offset="9">
                        <el-button
                            icon="el-icon-plus"
                            type="text"
                            :class="$style.header_btn"
                            :loading="isButtonLoading()"
                            @click="dialogVisible = true">
                            导出商品库存
                        </el-button>
                    </el-col>
            </el-row>
            <el-table  :data="stockList"
                        border>
                        <el-table-column  type="expand">
                            <template  slot-scope="props">
                                <el-table
                                    :data="props.row.stocks"
                                    border>
                                    <el-table-column label="入库批次" prop="sku">
                                    </el-table-column>
                                    <el-table-column label="最佳食用期" prop="best_before_date">
                                    </el-table-column>
                                    <el-table-column label="保质期" prop="expiration_date">
                                    </el-table-column>
                                    <el-table-column label="生产批次号" prop="production_batch_number">
                                    </el-table-column>
                                    <el-table-column label="EAN" prop="ean">
                                    </el-table-column>
                                    <el-table-column label="仓库库存" prop="stock_num">
                                    </el-table-column>
                                    <el-table-column label="盘点次数" prop="recount_times">
                                    </el-table-column>
                                    <el-table-column label="位置" prop="warehouse_location_code">
                                    </el-table-column>
                                    <el-table-column
                                        label="出入库记录">
                                        <template slot-scope="scope">
                                          <el-button
                                          size="small"
                                          @click="showStockDetail(scope.row)">详情</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                      </el-table-column>
                      <el-table-column  type="index"
                                        label="#">
                      </el-table-column>
                      <el-table-column  label="货品名称">
                                        <template slot-scope="scope">
                                                  {{scope.row.product_name}}
                                        </template>
                      </el-table-column>
                      <el-table-column  label="中文规格">
                                        <template slot-scope="scope">
                                                  {{scope.row.name_cn}}
                                        </template>
                      </el-table-column>
                      <el-table-column  prop="relevance_code"
                                        label="SKU">
                      </el-table-column>
                      <el-table-column  prop="total_stock_num"
                                        label="仓库库存">
                      </el-table-column>
                      <el-table-column  label="入库次数/数量">
                          <template slot-scope="scope">
                              {{scope.row.total_stockin_times}} / {{scope.row.total_stockin_num}}
                          </template>
                      </el-table-column>
                      <el-table-column  prop="stock_out_times"
                                        label="出库次数/数量">
                          <template slot-scope="scope">
                              {{scope.row.total_stockout_times}} / {{scope.row.total_stockout_num}}
                          </template>
                      </el-table-column>
                      <el-table-column  label="出入库记录">
                          <template slot-scope="scope">
                              <el-button size="mini" @click="viewDetails(scope.row)">详情</el-button>
                          </template>
                      </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="2" :offset="22">
                    <pagination-public  :class="$style.pagination"
                                        :params="params"
                                        @changePage="handlerChangePage">
                    </pagination-public>
              </el-col>
            </el-row>
        </div>
        <!-- 导出商品库存弹框 -->
        <el-dialog
            title="导出商品库存"
            :visible.sync="dialogVisible"
            width="500px">
            <el-checkbox-group
                v-model="export_data">
                <el-checkbox value="1" label="1">导出货品列表</el-checkbox>
                <el-checkbox value="2" label="2">导出货品规格列表</el-checkbox>
            </el-checkbox-group>
            <span  slot="footer" class="dialog-footer">
                <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="exportStock">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 出入库详情弹框 -->
        <inventory-detail
            :visible.sync="inventoryDialogVisible"
            :rowInfo="rowInfo"
            :warehouseName="warehouseName"
            :id="id">
        </inventory-detail>
        <!-- SKU详情 弹窗 -->
        <SkuDetails
            :visible.sync="skuDetalisSwitch"
            :stock_id="stock_id"
            :warehouseId="warehouseId"
            :warehouseName="warehouseName"
            :rowInfo="rowInfo">
        </SkuDetails>
    </div>
</template>

<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';
import paginationPublic from '@/components/pagination-public';
import baseApi from '@/lib/axios/base_api';
import inventoryDetail from './components/inventory_detail';
import SkuDetails from './components/sku_Details';

export default {
  mixins: [mixin],
  components: {
    inventoryDetail,
    SkuDetails,
    paginationPublic,
  },
  data() {
    return {
      params: {
        total: '',
        currentPage: 1,
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
        product_name: '', // 搜索货品名称
        sku: '', // 搜索SKU
        page: '', // 分页
      },
    };
  },
  computed: {
    ownerId() {
      return this.$store.state.token.id;
    },
  },
  watch: {
    warehouseId() {
      this.query.warehouse_id = this.warehouseId;
      this.getStocks(this.query);
    },
  },
  created() {
    this.query.warehouse_id = this.warehouseId;
    this.getStocks(this.query);
  },
  methods: {
    getStocks(query) {
      if (!query.warehouse_id) return;
      $http.getStocks(query)
        .then((res) => {
          if (res.status) return;
          this.stockList = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
        });
    }, // 获取库存列表
    handlerInventorySwitch(val) {
      if (val === 1) {
        this.query.show_low_stock = 1;
      } else {
        this.query.show_low_stock = 0;
      }
      this.getStocks(this.query);
    }, // 查询库存
    handlerSearch() {
      // eslint-disable-next-line
      if (!this.query.product_name && !this.search_sku_value) return; // 无输入数据, 则不处理
      this.getStocks(this.query);
    }, // 搜索响应
    handlerClear() {
      this.getStocks(this.query);
    }, // 清除输入框
    handlerInputQuery(res) {
      this.stockList = res.data.data;
      this.params.total = res.data.total;
      this.params.currentPage = res.data.current_page;
    }, // 输入框回调
    handlerChangePage(val) {
      this.query.page = val;
      this.getStocks(this.query);
    }, // 分页响应
    showStockDetail(row) {
      this.skuDetalisSwitch = true;
      this.stock_id = row.id;
      this.rowInfo = row;
    }, // sku 的详情
    // eslint-disable-next-line
    exportStock() {
      // eslint-disable-next-line
      const exportParams = `&product_name=${this.query.product_name}&sku=${this.query.sku}`;
      if (this.export_data.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择导出方式',
        });
        return;
      }
      if (this.export_data.length === 2) { // 同时导出两个
        // 导出 SKU 列表
        window.open(`${baseApi}/export/sku?warehouse_id=${
          this.warehouseId
        }&api_token=${this.$store.state.token.token}${exportParams}`);
        // 导出 货品库列表
        window.open(`${baseApi}/export/stock?warehouse_id=${
          this.warehouseId
        }&api_token=${this.$store.state.token.token}${exportParams}`);
      } else if (this.export_data[0] === '1') { // 单独导出货品列表
        window.open(`${baseApi}/export/stock?warehouse_id=${
          this.warehouseId
        }&api_token=${this.$store.state.token.token}${exportParams}`);
      } else {
        window.open(`${baseApi}/export/sku?warehouse_id=${ // 单独导出 sku
          this.warehouseId
        }&api_token=${this.$store.state.token.token}${exportParams}`);
      }
      this.dialogVisible = false;
    }, // 导出库存
    viewDetails(row) {
      this.inventoryDialogVisible = true;
      this.id = row.id;
      this.rowInfo = row;
    }, // 入库单详情弹框
  },
};
</script>

<style lang="less" module>
@import '../../../less/public_variable.less';

.page {
  margin: @margin;
  .main {
    width: @width;
    margin: 0 auto;
    .header {
      margin: 0 0 10px 0;
      .header_btn {
        font-size: @fontSize;
        vertical-align: middle;
      }
    }
    .pagination {
      margin: 10px  0 0 0;
      float: right;
    }
  }
}

.mycheck {
  height: 32px;
  line-height: 32px;
}
</style>
