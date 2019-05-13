<template>
  <div :class="$style.storeManage">
    <div :class="$style.body_main">
      <div :class="$style.btn">
        <i class="el-icon-plus"></i>
        <span @click="handleClick">添加仓库</span>
      </div>
      <!-- 表格 -->
      <el-table
        :class="$style.table_main"
        :data="warehouses"
        border
      >
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
          prop="name_cn"
          label="仓库名称">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="code"
          label="仓库编号">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="warehouse_address"
          label="地址">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="area"
          label="仓库面积(㎡)">
        </el-table-column>
        <el-table-column
          header-align="center"
          width="240"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="edit(scope.row.id)">查看编辑</el-button>
            <el-button size="mini" @click="config(scope.row.id)">基础配置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        :class="$style.pagination"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        layout="total, prev, pager, next, jumper"
        :total="+this.total"
      >
      </el-pagination>
    </div>
    <!-- 添加仓库 -->
    <add-warehouse
      :visible.sync = "switchFlag"
    >
    </add-warehouse>
  </div>
</template>

<script>
import cms from '@/components/cms';
import PaginationAndButtons from '@/components/pagination_and_buttons';
import $http from '@/api';
import AddWarehouse from './components/addWarehouse';

export default {
  name: 'storeManage',
  data() {
    return {
      switchFlag: false,
      all_warehouses_data: {}, // 所有仓库列表信息
      warehouses: [], // 仓库列表
      total: '', // 列表总条数
      currentPage: 1, // 当前页
    };
  },
  components: {
    cms,
    PaginationAndButtons,
    AddWarehouse,
  },
  computed: {
    ownerId() {
      return this.$store.state.token.id;
    },
  },
  created() {
    this.getWarehouse(); // 拉取仓库列表
  },
  methods: {
    handleCurrentChange(val) {
      $http.checkWarehouses({ page: val })
        .then((res) => {
          this.warehouses = res.data.data;
        })
        .catch(() => {});
    },
    getWarehouse() {
      $http.warehouses()
        .then((res) => {
          this.warehouses = res.data.data;
          this.total = res.data.total;
          this.current_page = res.data.current_page;
          this.all_warehouses_data = res.data;
        })
        .catch(() => {});
    },
    handleClick() {
      this.switchFlag = true;
    },
    edit(row) {
      console.log(row, 'edit');
    },
    config(row) {
      console.log(row, 'config');
    },
  },
};
</script>

<style lang="less" module>
@import '../../../less/public_style.less';
@import '../../../less/public_variable.less';

.storeManage {
  position: relative;
  margin: 40px 0 20px 0;
  .body_main {
    margin: 0 auto;
    width: 90%;
    .btn {
      display: block;
      font-size: 1.2rem;
      color: @ThemeColor;
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
