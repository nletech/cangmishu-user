<template>
  <div :class="$style.storeManage">
        <div :class="$style.body_main">
              <div :class="$style.btn">
                  <i class="el-icon-plus"></i>
                  <span @click="handleClick">{{$t('addWarehouse')}}</span>
              </div>
              <!-- 表格 -->
              <el-table
                  :class="$style.table_main"
                  :data="warehouses"
                  border>
                  <el-table-column
                      header-align="center"
                      align="center"
                      type="index"
                      width="80"
                      label="#">
                  </el-table-column>
                  <el-table-column
                      header-align="center"
                      align="center"
                      prop="code"
                      :label="$t('warehouseNO')">
                  </el-table-column>
                  <el-table-column
                      header-align="center"
                      align="center"
                      prop="name_cn"
                      :label="$t('storeName')">
                  </el-table-column>
                  <el-table-column
                      header-align="center"
                      align="center"
                      prop="warehouse_address"
                      width="300"
                      :label="$t('address')">
                  </el-table-column>
                  <el-table-column
                      header-align="center"
                      align="center"
                      prop="area"
                      :label="$t('WarehouseArea')">
                  </el-table-column>
                  <el-table-column
                      header-align="center" fixed="right"
                      :label="$t('operation')" width="240">
                      <template slot-scope="scope">
                          <el-tooltip
                              :content="$t('edit')" placement="top">
                              <el-button size="mini" icon="el-icon-edit" round
                                          @click="edit(scope.row)">
                              </el-button>
                          </el-tooltip>
                          <el-tooltip
                              :content="$t('warehouseConfig')" placement="top">
                              <el-button type="primary" size="mini" icon="el-icon-setting" round
                                        @click="config(scope.row)">
                              </el-button>
                          </el-tooltip>
                          <el-tooltip
                              :content="$t('setDefault')" placement="top">
                              <el-button
                                  size="mini"
                                  v-if="!scope.row.is_default_warehouse" round
                                  icon="el-icon-house"
                                  @click="setDefaultWarehouse(scope.row)">
                              </el-button>
                          </el-tooltip>
                          <el-tooltip
                              :content="$t('delete')" placement="top">
                              <el-button
                                  size="mini"
                                  type="danger" round
                                  v-if="!scope.row.is_default_warehouse"
                                  icon="el-icon-delete"
                                  @click="deleteWarehouse(scope.row)">
                              </el-button>
                          </el-tooltip>
                      </template>
                  </el-table-column>
              </el-table>
              <!-- 分页 -->
              <el-pagination
                  :class="$style.pagination"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  layout="total, prev, pager, next, jumper"
                  :total="+this.total">
              </el-pagination>
        </div>
        <!-- 添加仓库 -->
        <edit-warehouse
            :visible.sync="switchFlag"
            :row_data="row_data"
            @updata_data="handle_updata_data">
        </edit-warehouse>
  </div>
</template>

<script>
import cms from '@/components/cms';
import PaginationAndButtons from '@/components/pagination_and_buttons';
import $http from '@/api';
import EditWarehouse from './components/editWarehouse';

export default {
  name: 'storeManage',
  data() {
    return {
      switchFlag: false,
      all_warehouses_data: {}, // 所有仓库列表信息
      current_page: 1, // 编辑之后跳转的页面
      warehouses: [], // 仓库列表
      total: '', // 列表总条数
      currentPage: 1, // 当前页
      row_data: {},
    };
  },
  components: {
    cms,
    PaginationAndButtons,
    EditWarehouse,
  },
  created() {
    this.getWarehouse(); // 拉取仓库列表
  },
  mounted() {
    if (sessionStorage.getItem('show_create_warehouse')) {
      this.handleClick();
    }
    const timer2 = setTimeout(() => {
      sessionStorage.removeItem('show_create_warehouse');
      clearTimeout(timer2);
    }, 500);
  },
  methods: {
    handle_updata_data(val) {
      if (val) {
        this.handleCurrentChange(this.current_page);
      }
    }, // 更新数据
    clear(val) {
      this.row_data = val;
    },
    handleCurrentChange(val) {
      this.current_page = +val;
      $http.checkWarehouses({ page: val })
        .then((res) => {
          this.warehouses = res.data.data;
        });
    },
    getWarehouse() {
      $http.warehouses()
        .then((res) => {
          this.warehouses = res.data.data;
          this.total = res.data.total;
          this.current_page = res.data.current_page;
          this.all_warehouses_data = res.data;
        });
    },
    handleClick() {
      this.$router.push({ name: 'addWarehouse' });
    },
    edit(info) {
      this.row_data = info;
      this.switchFlag = true;
    },
    config(info) {
      this.$router.push({
        name: 'basicSetting',
        query: {
          warehouse_id: info.id,
        },
      });
    },
    deleteWarehouse(info) {
      this.$confirm(this.$t('AcrionTips'), this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning',
      }).then(() => {
        $http.deleteWarehouse(info.id)
          .then(() => {
            this.$message({
              message: this.$t('success'),
              type: 'success',
            });
            this.getWarehouse();
          });
      });
    },
    setDefaultWarehouse(info) {
      $http.setDefaultWarehouse(info.id)
        .then((res) => {
          if (res.status) return;
          this.getWarehouse();
        });
    },
  },
};
</script>

<style lang="less" module>
@import '../../less/public_variable.less';
@import '../../less/public_variable.less';

.storeManage {
  position: relative;
  margin: 20px 0 20px 0;
  .body_main {
    margin: 0 auto;
    width: 96%;
    .btn {
      display: block;
      font-size: 1.2rem;
      color: @ThemeColor;
      cursor: pointer;
      position: relative;
      top: 0;
      left: 90%;
      margin: 10px 10px 20px 10px;
    }
    .table_main {
      width: 100%;
    }
    .pagination {
      margin: 20px 0 0 0;
      float: right;
    }
  }
};
</style>
