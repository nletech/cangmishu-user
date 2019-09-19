<template>
    <div :class="$style.stockTaking">
        <div :class="$style.stockTaking_main">
            <div :class="$style.stockTaking_table">
              <el-row>
                    <el-col  :span="2" :offset="22">
                        <el-button
                            type="text"
                            :class="$style.btn"
                            @click="handlerCheckStock"
                            icon="el-icon-plus">
                            新增盘点
                        </el-button>
                    </el-col>
              </el-row>
            </div>
            <el-table
                element-loading-text="loading"
                v-loading="isButtonLoading()"
                :data="outbound_list_data"
                border
                style="width:100%">
                <el-table-column
                    label="#"
                    type="index"
                    header-align="center"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="单据编号"
                    prop="recount_no"
                    header-align="center"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="盘点商品"
                    header-align="center"
                    align="center">
                    <template slot-scope="scope">
                      <div
                          :title="scope.row.stocks | filtersTitle"
                          v-for="(item, index) of scope.row.stocks"
                          :key="index">
                          <span v-if="index === 0">{{item.name_cn}}&nbsp;...</span>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="盘点状态"
                    prop="product_name"
                    header-align="center"
                    align="center">
                    <template slot-scope="scope">
                      {{scope.row.status | statusFilter}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="盘点日期"
                    prop="updated_at"
                    header-align="center"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="操作"
                    header-align="center"
                    width="180">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="handleCheck(scope.row)"
                            :loading="isButtonLoading()">
                            明细
                        </el-button>
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
            <!-- 盘点弹框 -->
            <stock-taking-check
                :visible.sync="showCheckSwitch"
                :row_data="row_data"
                @success="handleSuccess"
                @close="handleClose">
            </stock-taking-check>
            <!-- 记录 -->
            <record
              :row="row"
              :visible.sync="record_visible">
            </record>
            <!-- 明细 -->
            <el-dialog
              :visible.sync="visible"
              width="90%"
              style="width: 100%;"
              title="盘点明细预览">
              <el-row>
                <el-col>
                  <div v-html="content" v-if="visible"></div>
                </el-col>
              </el-row>
              <el-row>
                  <el-col :span="2" :offset="21">
                      <el-button
                          :disable="disable"
                          :loading="isButtonLoading()"
                          style="margin-top: 20px;"
                          type="primary"
                          @click="onDownload">
                          下载
                      </el-button>
                  </el-col>
              </el-row>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import $http from '@/api';
import baseApi from '@/lib/axios/base_api';
import mixin from '@/mixin/form_config';
import paginationPublic from '@/components/pagination-public';
import stockTakingCheck from './components/stockTakingCheck'; // 盘点弹框
import Record from './components/record'; // 记录弹框

export default {
  name: 'stockTaking',
  mixins: [mixin],
  components: {
    paginationPublic,
    stockTakingCheck,
    Record,
  },
  data() {
    return {
      params: { total: 1 }, // 分页数据
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
      content: '',
      visible: false,
      stockId: '',
      disable: false,
    };
  },
  filters: {
    filtersTitle(val) {
      if (Array.isArray(val)) {
        let title = '';
        for (let i = 0; i < val.length; i += 1) {
          title += `${val[i].name_cn},`;
        }
        return title;
      }
    },
    statusFilter(val) {
      switch (+val) {
        case 0:
          return '无盈亏';
        case 1:
          return '有盈亏';
        default:
          return '无盈亏';
      }
    },
  },
  created() {
    this.checkStockList();
  },
  watch: {
    visible() {
      if (this.visible) {
        this.previewStockDetails(this.stockId);
      }
    },
    warehouseId() {
      this.checkStockList();
    },
  },
  computed: {
    api() {
      return this.$store.state.token.token.substring(7);
    },
  },
  methods: {
    previewStockDetails(stockId) {
      if (!this.warehouseId) return;
      $http.Stockpreview(stockId)
        .then((res) => {
          if (res.status) return;
          this.content = res;
        });
    },
    onDownload() {
      if (!this.stockId) return;
      this.disable = true;
      this.visible = false;
      window.open(`${baseApi}recount/${this.stockId}/download/?api_token=${this.api}&lang`);
      this.disable = false;
    },
    handlerChangePage(val) {
      this.checkStockList({ page: val });
    }, // 分页回调
    handlerCheckStock() {
      this.$router.push({
        name: 'addCheckStock',
      });
    },
    checkStockList(query) {
      if (!this.warehouseId) return;
      const data = {
        warehouse_id: this.warehouseId,
      };
      if (query && query.page) {
        data.page = query.page;
      } // 分页查询
      $http.checkStockList(data)
        .then((res) => {
          if (res.status) return;
          this.outbound_list_data = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
        });
    },
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
      // this.$router.push({
      //   name: 'checkStockDetail',
      //   query: {
      //     stockId: rowInfo.id,
      //   },
      // });
      this.stockId = rowInfo.id;
      this.visible = true;
    },
    handleRecord(rowInfo) {
      this.record_visible = true;
      this.row = rowInfo;
      this.row.warehouseId = this.warehouseId;
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
  margin: @margin;
  .stockTaking_main {
    width: @width;
    margin: 0 auto;
  }
  .stockTaking_table {
    margin: 0 0 20px 0;
  }
  .btn {
    font-size: @fontSize;
  }
  .pagination {
    margin: 10px 0 0 0;
    float: right;
  }
}
</style>
