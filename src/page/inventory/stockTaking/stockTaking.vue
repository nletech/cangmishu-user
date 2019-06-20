<template>
        <div :class="$style.stockTaking">
            <div :class="$style.stockTaking_main">
                 <el-row>
                        <el-col  :span="6">
                                <el-input placeholder="请扫描货位或者SKU"
                                          v-model="code"
                                          size="small">
                                          <i  style="color: #000;"
                                              class="iconfont el-input__icon"
                                              slot="suffix">
                                              &#xe623;
                                          </i>
                                </el-input>
                        </el-col>
                        <el-col :span="1">
                                <el-button size="small"
                                           @click="handleSearch">
                                           确定
                                </el-button>
                        </el-col>
                 </el-row>
                 <el-table  :data="outbound_list_data"
                            :class="$style.stockTaking_table"
                            border
                            style="width:100%">
                            <el-table-column  label="#"
                                              type="index"
                                              header-align="center"
                                              align="center">
                            </el-table-column>
                            <el-table-column  label="入库批次"
                                              prop="sku"
                                              header-align="center"
                                              align="center">
                            </el-table-column>
                            <el-table-column  label="SKU"
                                              prop="relevance_code"
                                              header-align="center"
                                              align="center">
                            </el-table-column>
                            <el-table-column  label="商品名(规格)"
                                              prop="product_name"
                                              header-align="center"
                                              align="center">
                            </el-table-column>
                            <el-table-column  label="货位库存"
                                              prop="shelf_num"
                                              header-align="center"
                                              align="center">
                            </el-table-column>
                            <el-table-column  label="EAN码"
                                              prop="ean"
                                              header-align="center"
                                              align="center">
                            </el-table-column>
                            <el-table-column  label="操作"
                                              header-align="center"
                                              width="180">
                                              <template slot-scope="scope">
                                                        <el-button  size="mini"
                                                                    @click="handleCheck(scope.row)"
                                                                    :loading="$store.state.config.button_loading">
                                                                    盘点
                                                        </el-button>
                                                        <el-button  size="mini"
                                                                    @click="handleRecord(scope.row)"
                                                                    :loading="$store.state.config.button_loading">
                                                                    记录
                                                        </el-button>
                                              </template>
                            </el-table-column>
                 </el-table>
                 <el-pagination  v-show="+total"
                                 :class="$style.pagination"
                                 layout=" total, prev, pager, next, jumper"
                                 @current-change="handleCurrentChange"
                                 :current-page="currentPage"
                                 :total="+total">
                 </el-pagination>
                 <!-- 盘点弹框 -->
                 <stock-taking-check  :visible.sync="showCheckSwitch"
                                      :row_data="row_data"
                                      @success="handleSuccess"
                                      @close="handleClose">
                 </stock-taking-check>
                 <!-- 记录 -->
                 <record :row="row"
                         :visible.sync="record_visible">
                 </record>
            </div>
        </div>
</template>

<script>
import $http from '@/api';
import stockTakingCheck from './components/stockTakingCheck'; // 盘点弹框
import Record from './components/record'; // 记录弹框

export default {
  name: 'stockTaking',
  components: {
    stockTakingCheck,
    Record,
  },
  data() {
    return {
      row: {},
      record_visible: false, // 记录
      row_data: {},
      code: '', // sku码
      showCheckSwitch: false, // 开关
      stock_list_data: [], // 商品列表
      id: 0,
      typeList: [],
      distributorList: [],
      outbound_list_data: [], // 表格数组
      //
      total: '', // 列表总条数
      currentPage: 1, // 当前页
    };
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  methods: {
    handleSuccess(val, sku) {
      if (val) {
        $http.queryInventory({
          warehouse_id: this.warehouseId,
          code: sku,
        })
          .then((res) => {
            this.code = ''; // 初始化
            if (res.status) return;
            this.outbound_list_data = res.data.data;
            this.total = res.data.total;
            this.currentPage = res.data.current_page;
          });
      }
    },
    handleClose(val) {
      this.showCheckSwitch = val;
    },
    handleCurrentChange(val) {
      $http.checkOrder({
        warehouse_id: this.warehouseId,
        page: val,
      })
        .then((res) => {
          if (res.status) return;
          this.outbound_list_data = res.data.data;
          this.total = res.data.total;
          this.currentPage = res.data.current_page;
        });
    },
    handleCheck(rowInfo) {
      this.showCheckSwitch = true;
      this.row_data = rowInfo;
    },
    handleRecord(rowInfo) {
      this.record_visible = true;
      this.row = rowInfo;
      this.row.warehouseId = this.warehouseId;
      console.log(rowInfo, 'handleRecord');
    },
    handleSearch() {
      if (this.code) {
        $http.queryInventory({
          warehouse_id: this.warehouseId,
          code: this.code,
        })
          .then((res) => {
            this.code = ''; // 初始化
            if (res.status) return;
            this.outbound_list_data = res.data.data;
            this.total = res.data.total;
            this.currentPage = res.data.current_page;
          });
      }
    },
    // 获取入库单列表
  },
};
</script>

<style lang="less" module>
@import '../../../less/public_variable.less';

.stockTaking {
  margin: 20px 0 0 0 ;
  .stockTaking_main {
    width: 90%;
    margin: 0 auto;
  }
  .stockTaking_table {
    margin: 10px 0 0 0;
  }
  .pagination {
    margin: 10px 0 0 0;
    float: right;
  }
}
</style>
