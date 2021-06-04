<template>
  <div v-if="dataInfo">
    <!--盘点库存-->
    <recount-drawer
      :dataList="recountDataList"
      @success="refreshLocationStockData()"
    ></recount-drawer>
    <move-location :dataList="moveDataList" @success="refreshAllData()"></move-location>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h2 align="center" style="margin:0px;">
          {{ dataInfo.product_name }}
        </h2>
      </div>
      <div>
        <el-row :gutter="20" class="total-area">
          <el-col :span="4">
            <h3>{{ dataInfo.total_stock_num }}</h3>
            可用库存
          </el-col>
          <el-col :span="4">
            <h3>0</h3>
            期初库存
          </el-col>
          <el-col :span="4">
            <h3>{{ dataInfo.total_stockin_num }}</h3>
            入库总量
          </el-col>
          <el-col :span="4">
            <h3>{{ dataInfo.total_stockout_num }}</h3>
            出库总量
          </el-col>
          <el-col :span="4">
            <h3>{{ dataInfo.purchase_price }}</h3>
            进货价格
          </el-col>
          <el-col :span="4">
            <h3>{{ dataInfo.sale_price }}</h3>
            销售价格
          </el-col>
        </el-row>
      </div>
    </el-card>
    <br />
    <!-- 入库记录 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        入库记录
      </div>
      <el-table :data="dataInfo.stocks" border ref="stocksTable" @select="onTableSelect">
        <el-table-column type="selection" width="55"> </el-table-column>
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
          scope="locations"
        >
          <template slot-scope="scope">
            <el-popover placement="left" width="400" trigger="click">
              <el-table :data="scope.row.locations">
                <el-table-column
                  width="150"
                  property="warehouse_location_code"
                  label="货位"
                ></el-table-column>
                <el-table-column width="100" property="shelf_num" label="数量"></el-table-column>
                <el-table-column
                  width="300"
                  property="updated_at"
                  label="最后操作日期"
                ></el-table-column>
              </el-table>
              <el-button slot="reference" size="mini"
                >货位({{ scope.row.locations.length }})</el-button
              >
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button @click="handlerRecount()">盘点库存</el-button>
        <el-button @click="handlerMove()">移动货位</el-button>
      </div>
    </el-card>
    <br />
    <!-- 操作记录 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        操作记录
      </div>
      <el-table :data="logs.dataList" border>
        <el-table-column type="index" align="center" header-align="center" width="60">
        </el-table-column>
        <el-table-column :label="$t('Type')" align="center" header-align="center">
          <template slot-scope="scope">
            {{ scope.row.type }}
          </template>
        </el-table-column>
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
          :label="$t('OperationNumber')"
          prop="operation_num"
        >
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="spec_total_stock_num"
          :label="$t('TotalInventory')"
        >
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="created_at"
          :label="$t('Operationdate')"
        >
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="order_sn"
          :label="$t('OrderNumber')"
        >
        </el-table-column>
        <el-table-column align="center" header-align="center" prop="remark" :label="$t('remark')">
        </el-table-column>
      </el-table>
      <pagination-public
        style="float: right"
        :params="logs.params"
        @changePage="handlerLogsChangePage"
      ></pagination-public>
    </el-card>
  </div>
</template>

<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';
import paginationPublic from '@/components/pagination-public';
import recountDrawer from '@/components/recount/index';
import moveLocation from '@/components/move-location/index';

export default {
  mixins: [mixin],
  components: {
    paginationPublic,
    recountDrawer,
    moveLocation
  },
  data() {
    return {
      dataInfo: {
        stocks: []
      },
      recountDataList: [],
      moveDataList: [],
      logs: {
        dataList: [],
        params: {
          total: 0,
          page: 1
        }
      },
      query: {
        id: '',
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
      this.loadData(this.query);
    }
  },
  created() {
    this.query.id = this.$route.query.id;
    this.loadData();
    this.loadLogs();
  },
  methods: {
    refreshAllData() {
      this.$message({
        type: 'success',
        message: '操作成功'
      });
      this.loadData();
      this.loadLogs();
    },
    onTableSelect(rows, row) {
      // let selected = rows.length && rows.indexOf(row) !== -1;
      console.log(row);
    },
    refreshLocationStockData() {
      this.loadData();
      this.$confirm('盘点成功, 是否查看库存盘点记录列表').then(() => {
        this.$router.replace({
          name: 'stockTaking'
        });
      });
    },
    handlerRecount() {
      console.log(this.$refs.stocksTable.selection.length);
      if (this.$refs.stocksTable.selection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选中一行数据！'
        });
        return;
      }
      let recountDataList = [];
      this.$refs.stocksTable.selection.forEach(row => {
        row.locations.forEach(location => {
          recountDataList.push({
            id: location.id,
            stock_sku: location.sku,
            shelf_num_orgin: location.shelf_num,
            num: location.shelf_num,
            location_code: location.warehouse_location_code
          });
        });
      });
      this.recountDataList = recountDataList;
    },
    handlerMove() {
      console.log(this.$refs.stocksTable.selection.length);
      if (this.$refs.stocksTable.selection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选中一行数据！'
        });
        return;
      }
      let moveDataList = [];
      this.$refs.stocksTable.selection.forEach(row => {
        row.locations.forEach(location => {
          moveDataList.push({
            id: location.id,
            stock_sku: location.sku,
            shelf_num_orgin: location.shelf_num,
            num: location.shelf_num,
            location_code: location.warehouse_location_code
          });
        });
      });
      this.moveDataList = moveDataList;
    },
    handlerQueryParams(params) {
      this.query = params;
      this.loadData(this.query);
    },
    loadData() {
      $http.getSpecStocks(this.query.id, {}).then(res => {
        if (res.status) return;
        this.dataInfo = res.data;
      });
    }, // 分页响应
    loadLogs() {
      $http.getStockLogs(this.query.id, this.logs.params).then(res => {
        this.logs.dataList = res.data.data;
        this.logs.params.total = res.data.total;
        this.logs.params.page = res.data.current_page;
      });
    },
    handlerLogsChangePage(val) {
      this.logs.params.page = val;
      this.loadLogs();
    } // 分页响应
  }
};
</script>

<style lang="less" scope>
.total-area {
  text-align: center;
  font-size: 12px;
  color: #666666;
  h3 {
    font-size: 16px;
    color: #000000;
  }
}
</style>
