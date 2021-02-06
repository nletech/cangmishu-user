<template>
  <!--
  * 仓秘书免费开源WMS仓库管理系统+订货订单管理系统
  *
  * (c) Hunan NLE Network Technology Co., Ltd. <cangmishu.com>
  *
  * For the full copyright and license information, please view the LICENSE
  * file that was distributed with this source code.
  *
  -->
  <div>
    <el-table
      element-loading-text="loading"
      v-loading="isButtonLoading"
      :data="shelf_list_data"
      border
      style="width: 100%"
    >
      <el-table-column type="index" label="#"> </el-table-column>
      <el-table-column prop="code" :label="$t('ShelfCode')"> </el-table-column>
      <el-table-column prop="warehouse_area.name_cn" :label="$t('ShelfArea')"> </el-table-column>
      <el-table-column :label="$t('ShelfStatus')">
        <template slot-scope="scope">
          {{ scope.row.is_enabled === 1 ? $t('yes') : $t('no') }}
        </template>
      </el-table-column>
      <el-table-column width="260" :label="$t('operation')">
        <template slot-scope="scope">
          <el-tooltip :content="$t('edit')" placement="top">
            <el-button
              size="mini"
              icon="el-icon-edit"
              round
              @click="edit(scope.row.id)"
            ></el-button>
          </el-tooltip>
          <el-tooltip :content="$t('delete')" placement="top">
            <el-button
              size="mini"
              icon="el-icon-delete"
              @click="del(scope.row.id)"
              type="danger"
              round
            >
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :class="$style.pagination"
      v-show="+total"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      layout="total, prev, pager, next, jumper"
      :total="+total"
    >
    </el-pagination>
  </div>
</template>

<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';

export default {
  mixins: [mixin],
  mounted() {
    if (this.show_data_flag === '货位') {
      this.get_data();
      this.active = true;
    }
  },
  props: {
    id: [String],
    show_data_flag: [String]
  },
  watch: {
    show_data_flag(val) {
      if (val === '货位') {
        this.active = true;
        this.get_data();
      }
    }
  },
  computed: {
    queryWarehouseId() {
      if (+this.$route.query.warehouse_id) {
        return +this.$route.query.warehouse_id;
      }
      return localStorage.getItem('warehouseId');
    }
  },
  data() {
    return {
      active: false, // 父组件已经选中标志
      shelf_list_data: [],
      params: {}, // 分页参数
      total: '',
      currentPage: 1,
      area_list_data: [],
      warehouse_name_cn: ''
    };
  },
  methods: {
    handleCurrentChange(val) {
      $http
        .checkWarehouseshelf({
          page: val,
          warehouse_id: this.queryWarehouseId
        })
        .then(res => {
          this.shelf_list_data = res.data.data;
          this.total = res.data.total;
          this.currentPage = res.data.current_page;
        });
    },
    get_data() {
      if (this.active) {
        $http.getWarehouseshelf({ warehouse_id: this.queryWarehouseId }).then(res => {
          this.shelf_list_data = res.data.data;
          this.total = res.data.total;
        });
      }
    }, // 获取数据列表
    del(id) {
      this.$confirm(this.$t('AcrionTips'), this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        $http.delWarehouseshelf(id).then(() => {
          this.$message({
            message: this.$t('success'),
            type: 'success',
            showClose: true
          });
          this.get_data();
        });
      });
    },
    edit(id) {
      this.$router.push({
        name: 'editCargoShelf',
        query: {
          shelfId: id, // 该条数据的 id
          warehouse_id: this.queryWarehouseId, // 当前仓库 id
          edit: true,
          currentPage: this.currentPage // 这个参数是用来查询不在首页的数据(因为拿到的数据分页)
        }
      });
    }
  }
};
</script>

<style lang="less" module>
.pagination {
  margin: 2px 0 0 0;
  float: right;
}
</style>
