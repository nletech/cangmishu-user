<template>
  <div>
    <el-table
      element-loading-text="loading"
      v-loading="isButtonLoading"
      :data="Area_data"
      border
      style="width: 100%"
    >
      <el-table-column type="index" label="#"> </el-table-column>
      <el-table-column prop="code" :label="$t('AreaCode')"> </el-table-column>
      <el-table-column prop="name_cn" :label="$t('AreaName')">
      </el-table-column>
      <el-table-column prop="functions" :label="$t('AreaStatus')">
        <template slot-scope="scope">
          {{ scope.row.is_enabled === 1 ? $t('yes') : $t('no') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('operation')" width="320">
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
  props: {
    id: [String],
    show_data_flag: [String]
  },
  watch: {
    show_data_flag(val) {
      if (val === '货区') {
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
      Area_data: [],
      params: {}, // 分页参数
      total: '', // 分页的总数
      currentPage: 1 // 当前页(默认值 1)
    };
  },
  methods: {
    get_data() {
      if (this.active) {
        $http
          .getWarehouseArea({ warehouse_id: this.queryWarehouseId })
          .then(res => {
            this.Area_data = res.data.data;
            this.total = res.data.total;
            this.current_page = res.data.current_page;
          });
      }
    },
    handleCurrentChange(val) {
      $http
        .checkWarehouseArea({
          page: val,
          warehouse_id: this.queryWarehouseId
        })
        .then(res => {
          this.Area_data = res.data.data;
          this.total = res.data.total;
          this.current_page = res.data.current_page;
        });
    },
    del(areaId) {
      this.$confirm(this.$t('AcrionTips'), this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        $http.delWarehouseArea(areaId).then(() => {
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
        name: 'editCargoArea',
        query: {
          warehouse_id: this.queryWarehouseId,
          area_id: id, // 当前货区 id
          edit: true
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
