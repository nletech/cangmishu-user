<template>
          <div>
              <el-table  :data="Area_data"
                         border
                         style="width: 100%">
                         <el-table-column  type="index"
                                          label="#">
                         </el-table-column>
                         <el-table-column  prop="code"
                                          label="编号">
                         </el-table-column>
                         <el-table-column  prop="name_cn"
                                          label="名称">
                         </el-table-column>
                         <el-table-column  prop="functions"
                                          label="启用状态">
                            <template slot-scope="scope">
                              {{scope.row.is_enabled | switchTypeCn}}
                            </template>
                         </el-table-column>
                         <el-table-column  label="操作"
                                          width="320">
                            <template slot-scope="scope">
                              <el-tooltip content="编辑" placement="top">
                                <el-button size="mini" icon="el-icon-edit" round
                                            @click="edit(scope.row.id)"></el-button>
                              </el-tooltip>
                              <el-tooltip content="删除" placement="top">
                                <el-button  size="mini" icon="el-icon-delete"
                                                 @click="del(scope.row.id)"
                                                 type="danger" round>
                                </el-button>
                              </el-tooltip>
                            </template>
                         </el-table-column>
              </el-table>
              <!-- 分页组件 -->
              <el-pagination  :class="$style.pagination"
                              v-show="+total"
                              @current-change="handleCurrentChange"
                              :current-page="currentPage"
                              layout="total, prev, pager, next, jumper"
                              :total="+total">
              </el-pagination>
          </div>
</template>

<script>
import $http from '@/api';

export default {
  props: {
    id: [String],
    show_data_flag: [String],
  },
  watch: {
    show_data_flag(val) {
      if (val === '货区') {
        this.active = true;
        this.get_data();
      }
    },
  },
  data() {
    return {
      active: false, // 父组件已经选中标志
      Area_data: [],
      params: {}, // 分页参数
      total: '', // 分页的总数
      currentPage: 1, // 当前页(默认值 1)
    };
  },
  methods: {
    get_data() {
      if (this.active) {
        $http.getWarehouseArea({ warehouse_id: this.$route.query.warehouse_id })
          .then((res) => {
            this.Area_data = res.data.data;
            this.total = res.data.total;
            this.current_page = res.data.current_page;
          });
      }
    },
    handleCurrentChange(val) {
      $http.checkWarehouseArea({
        page: val,
        warehouse_id: this.$route.query.warehouse_id,
      })
        .then((res) => {
          this.Area_data = res.data.data;
          this.total = res.data.total;
          this.current_page = res.data.current_page;
        });
    },
    del(areaId) {
      this.$confirm('此操作将永久删除该货区, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          $http.delWarehouseArea(areaId)
            .then(() => {
              this.$message({
                message: '删除成功',
                type: 'success',
                showClose: true,
              });
              this.get_data();
            });
        });
    },
    edit(id) {
      this.$router.push({
        name: 'editCargoArea',
        query: {
          warehouse_id: this.$route.query.warehouse_id,
          area_id: id, // 当前货区 id
          edit: true,
        },
      });
    },
  },
};
</script>

<style lang="less" module>
.pagination {
  margin: 2px 0 0 0;
  float: right;
}
</style>
