<template>
  <div class="locationStock">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-button style="float: right; padding: 3px 0" type="text" @click="gotoAreaMange"
              >管理</el-button
            >
            <h3 style="margin:0px"><i class="el-icon-s-home"></i> 货位货区</h3>
          </div>
          <div class="location-area" v-for="(area, index) in locationAreaList" :key="index">
            <div class="area-name"><i class="el-icon-arrow-right"></i> {{ area.name }}</div>
            <div class="area-location">
              <div v-for="(location, index2) in area.locations" :key="index2">
                <span class="stock-count">
                  {{ location.total_shelf_num }}
                </span>
                <el-button
                  type="text"
                  style="font-color: #000000"
                  @click="loadLocationStockData(location.id, location.name)"
                  >{{ location.name }}</el-button
                >
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="20">
        <recount-drawer
          :dataList="recountDataList"
          @success="refreshLocationStockData()"
        ></recount-drawer>
        <move-location :dataList="moveDataList" @success="refreshAllData()"></move-location>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span> {{ tableTitle }} </span>
          </div>
          <search @queryParams="handlerQueryParams"></search>
          <el-table :data="tableData" style="width: 100%" ref="stocksTable">
            <el-table-column type="selection" width="85"> </el-table-column>
            <el-table-column prop="location_code" label="货区"
              ><template slot-scope="scope">
                <span>{{ locationAreaNameObj[scope.row.location_id] }}</span>
              </template></el-table-column
            >
            <el-table-column prop="location_code" label="货位"> </el-table-column>
            <el-table-column prop="name_cn" label="商品规格及名称"> </el-table-column>
            <el-table-column prop="relevance_code" label="SKU"> </el-table-column>
            <el-table-column prop="stock_sku" label="入库批次号"> </el-table-column>
            <el-table-column label="当前库存"
              ><template slot-scope="scope">
                <span style="font-size:16px; font-weight:bold; text-aliign:right">{{
                  scope.row.shelf_num_now
                }}</span>
              </template></el-table-column
            >
            <el-table-column label="最后操作" width="180">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.updated_at }}</span>
              </template>
            </el-table-column>
          </el-table>
          <br />
          <el-row :gutter="20">
            <el-col :span="12">
              <el-button @click="handlerRecount()">盘点库存</el-button>
              <el-button @click="handlerMove()">移动货位</el-button>
            </el-col>
            <el-col :span="12">
              <div class="fr">
                <pagination-public :params="params" @changePage="handlerChangePage">
                </pagination-public>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';
import paginationPublic from '@/components/pagination-public';
import recountDrawer from '@/components/recount/index';
import search from './components/search';
import moveLocation from '@/components/move-location/index';

export default {
  mixins: [mixin],
  components: {
    paginationPublic,
    search,
    recountDrawer,
    moveLocation
  },
  created() {
    this.loadData();
    this.loadLocationStockData(0);
  },
  methods: {
    handlerRecount() {
      if (this.$refs.stocksTable.selection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选中一行数据！'
        });
        return;
      }
      let recountDataList = [];
      this.$refs.stocksTable.selection.forEach(row => {
        recountDataList.push({
          id: row.id,
          stock_sku: row.stock_sku,
          shelf_num_orgin: row.shelf_num_now,
          num: row.shelf_num_now,
          location_code: row.location_code
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
        moveDataList.push({
          id: row.id,
          stock_sku: row.stock_sku,
          shelf_num_orgin: row.shelf_num_now,
          num: 0,
          location_code: row.location_code
        });
      });
      this.moveDataList = moveDataList;
    },
    handlerQueryParams(params) {
      this.query = params;
      this.loadLocationStockData();
    },
    handlerChangePage(val) {
      this.query.page = val;
      this.loadLocationStockData();
    },
    gotoAreaMange() {
      this.$router.push({
        name: 'areaAndShelf',
        query: {
          warehouse_id: this.warehouseId
        }
      });
    },
    loadData() {
      $http.getAreaStockData().then(res => {
        if (res.status) return;
        this.locationAreaList = res.data;
        res.data.forEach(area => {
          area.locations.forEach(location => {
            this.$set(this.locationAreaNameObj, location.id, area.name);
          });
        });
      });
    },
    refreshAllData() {
      this.$message({
        type: 'success',
        message: '操作成功'
      });
      this.loadData();
      this.loadLocationStockData(this.locationId, this.tableTitle);
    },
    refreshLocationStockData() {
      this.$message({
        type: 'success',
        message: '盘点操作成功'
      });
      this.loadLocationStockData(this.locationId, this.tableTitle);
    },
    loadLocationStockData(id, title = '全部') {
      this.tableTitle = title;
      this.locationId = id;
      let query = this.query;
      query.id = id;
      $http.getLocationStockData(query).then(res => {
        if (res.status) return;
        this.tableData = res.data.data;
        this.params.total = res.data.total;
        this.params.currentPage = res.data.current_page;
      });
    }
  },

  data() {
    return {
      params: {
        total: '',
        currentPage: 1
      }, // 分页数据
      locationAreaList: [],
      locationAreaNameObj: {},
      tableTitle: '全部',
      tableData: [],
      locationId: 0,
      recountDataList: [],
      moveDataList: [],
      query: {
        id: 0
      }
    };
  }
};
</script>
<style lang="less" scope>
.locationStock {
  line-height: 35px;
  .location-area {
    line-height: 35px;
    height: 35px;
    clear: both;
    margin-bottom: 20px;
    .area-name {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
    .area-location {
      line-height: 45px;
      div {
        clear: both;
        height: 45px;
        padding-left: 20px;
        .stock-count {
          float: right;
          font-size: 12px;
          padding-right: 10px;
          color: #5745c5;
        }
        .el-button--text {
          display: block;
          color: #444;
          font-size: 14px;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
