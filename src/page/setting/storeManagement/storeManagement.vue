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
        prop="address"
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
    <!-- <div
      :class="$style.pagination"
    >
      <pagination-andButtons></pagination-andButtons>
    </div> -->
    <el-pagination
      :class="$style.pagination"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      layout="total, prev, pager, next, jumper"
      :total="100"
    >
    </el-pagination>
  </div>
  <!-- 添加仓库 -->
  <el-dialog
    :visible.sync="showAddWarehouse"
  >
    <add-warehouse></add-warehouse>
  </el-dialog>
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
      warehouses: [],
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
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
  methods: {
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 获取仓库列表
    getList() {
      // this.params.owner_id = this.ownerId;
      $http.warehouses().then((res) => {
        this.warehouses = res.data.data;
      });
    },
    handleClick() {
      this.$router.push({ name: 'addWarehouse' });
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
