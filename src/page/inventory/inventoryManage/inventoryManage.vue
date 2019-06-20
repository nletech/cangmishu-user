<template>
        <div  class="inventoryManage">
              <wms-tags>
                        <el-row :gutter="10">
                                <el-col :span="4"
                                        :offset="15">
                                        <el-input  size="small"
                                                   @clear="handlerClear"
                                                   clearable
                                                   v-model="search_stock_value"
                                                   placeholder="货品名称">
                                        </el-input>
                                </el-col>
                                <el-col :span="4">
                                        <el-input size="small"
                                                  clearable
                                                  @clear="handlerClear"
                                                  v-model="search_sku_value"
                                                  placeholder="SKU">
                                        </el-input>
                                </el-col>
                                <el-col :span="1">
                                        <el-button  size="small"
                                                    @click="handlerSearch">
                                                    搜索
                                        </el-button>
                                </el-col>
                        </el-row>
                        <el-row>
                                <el-col :span="2"
                                        :offset="22">
                                        <el-button  icon="el-icon-plus"
                                                    type="text"
                                                    style="margin: 10px;"
                                                    :loading="$store.state.config.button_loading"
                                                    @click="dialogVisible = true">
                                                    导出库存管理
                                        </el-button>
                                </el-col>
                        </el-row>
                        <el-table  :data="stockList"
                                   border>
                                   <el-table-column  type="expand">
                                                    <template  slot-scope="props">
                                                                <el-table   :data="props.row.stocks"
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
                                                                            <el-table-column label="仓库库存" prop="stockin_num">

                                                                            </el-table-column>
                                                                            <el-table-column label="盘点次数" prop="shelf_num_waiting">

                                                                            </el-table-column>
                                                                            <el-table-column label="位置" prop="shelf_num">

                                                                            </el-table-column>
                                                                            <el-table-column label="出入库记录">
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
                                  <el-table-column  prop="stock_in_warehouse"
                                                    label="仓库库存">
                                  </el-table-column>
                                  <el-table-column  label="锁定/可用库存">
                                                      <template slot-scope="scope">
                                                                {{scope.row.reserved_num}} / {{scope.row.available_num}}
                                                      </template>
                                  </el-table-column>
                                  <el-table-column  label="入库次数/数量">
                                                    <template slot-scope="scope">
                                                              {{scope.row.stock_entrance_times}} / {{scope.row.stock_entrance_qty}}
                                                    </template>
                                  </el-table-column>
                                  <el-table-column  prop="stock_out_times"
                                                    label="出库次数/数量">
                                                    <template slot-scope="scope">
                                                              {{scope.row.stock_out_times}} / {{scope.row.stock_out_qty}}
                                                      </template>
                                  </el-table-column>
                                  <el-table-column  label="出入库记录">
                                                    <template slot-scope="scope">
                                                              <el-button size="mini" @click="viewDetails(scope.row)">详情</el-button>
                                                    </template>
                                  </el-table-column>
                        </el-table>
                        <el-row  :class="$style.pagination">
                                <pagination-public  :params="params"
                                                    @changePage="handlerChangePage">
                                </pagination-public>
                        </el-row>
              </wms-tags>
              <!-- 导出商品库存弹框 -->
              <el-dialog  title="导出商品库存"
                          :visible.sync="dialogVisible"
                          width="500px">
                          <el-checkbox-group  v-model="export_data">
                                              <el-checkbox value="1" label="1">导出货品列表</el-checkbox>
                                              <el-checkbox value="2" label="2">导出SKU列表</el-checkbox>
                          </el-checkbox-group>
                          <span  slot="footer" class="dialog-footer">
                                <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
                                <el-button size="mini" type="primary" @click="exportStock">确 定</el-button>
                          </span>
              </el-dialog>
              <!-- 出入库详情弹框 -->
              <DetailDialog  :visible.sync="inventoryDialogVisible"
                             :rowInfo="rowInfo"
                             :warehouseName="warehouseName"
                             :id="id">
              </DetailDialog>
              <SkuDetails  :visible.sync="skuDetalisSwitch"
                           :stock_id="stock_id"
                           :warehouseId="warehouseId"
                           :warehouseName="warehouseName"
                           :rowInfo="rowInfo">
              </SkuDetails>
        </div>
</template>

<script>
import $http from '@/api';
import WmsTags from '@/components/wms_tags';
import paginationPublic from '@/components/pagination-public';
import baseApi from '@/lib/axios/base_api';
import inputPublic from '@/components/input-public';
import DetailDialog from './components/inventory_detail';
import SkuDetails from './components/sku_Details';

export default {
  data() {
    return {
      search_stock_value: '', // 搜索货品名称
      search_sku_value: '', // 搜索SKU
      // 重写
      params: {
        total: '',
        currentPage: 1,
      }, // 分页数据
      checked: false,
      boundList: [], // 入库仓库列表
      stockList: [],
      id: 0,
      export_data: [],
      warehouseName: '',
      rowInfo: {},
      dialogVisible: false,
      inventoryDialogVisible: false,
      skuDetalisSwitch: false,
      stock_id: 0,
    };
  },
  components: {
    DetailDialog,
    WmsTags,
    SkuDetails,
    paginationPublic,
    inputPublic,
  },
  computed: {
    ownerId() {
      return this.$store.state.token.id;
    },
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  watch: {
    warehouseId() {
      this.getStocks();
    },
  },
  created() {
    this.getStocks();
  },
  methods: {
    handlerSearch() {
      // eslint-disable-next-line
      if (!this.search_stock_value && !this.search_sku_value) return; // 无输入数据, 则不处理
      $http.getStocks({ // 查询货品（通过货品和sku）
        warehouse_id: this.warehouseId,
        product_name: this.search_stock_value || '',
        sku: this.search_sku_value || '',
      })
        .then((res) => {
          this.stockList = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
        });
    }, // 搜索响应
    handlerClear() {
      // eslint-disable-next-line
      this.getStocks(); // 刷新列表
    }, // 清除输入框
    handlerInputQuery(res) {
      this.stockList = res.data.data;
      this.params.total = res.data.total;
      this.params.currentPage = res.data.current_page;
    }, // 输入框回调
    handlerChangePage(val) {
      $http.getStocks({
        warehouse_id: this.warehouseId,
        page: val,
      })
        .then((res) => {
          this.stockList = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
        });
    }, // 分页响应
    showStockDetail(row) {
      this.skuDetalisSwitch = true;
      this.stock_id = row.stock_id;
      this.rowInfo = row;
    }, // sku 的详情
    getStocks() {
      $http.getStocks({ warehouse_id: this.warehouseId })
        .then((res) => {
          if (res.status) return;
          this.stockList = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
        });
    }, // 获取库存列表
    // eslint-disable-next-line
    exportStock() {
      // eslint-disable-next-line
      const exportParams = `&product_name=${this.search_stock_value}&sku=${this.search_sku_value}`;
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
        console.log('default', `${baseApi}/export/sku?warehouse_id=${
          this.warehouseId
        }&api_token=${this.$store.state.token.token}${exportParams}`);
        //
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

.mycheck {
  height: 32px;
  line-height: 32px;
}
.pagination {
  margin: 10px  0 10px 0;
  float: right;
}
</style>
