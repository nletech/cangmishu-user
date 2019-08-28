<template>
  <div>
    <el-table  :data="shelf_list_data"
               border
               style="width: 100%">
               <el-table-column
                 type="index"
                 label="#">
               </el-table-column>
               <el-table-column  prop="code"
                                 label="编号">
               </el-table-column>
               <el-table-column  prop="warehouse_area.name_cn"
                                 label="所属货区">
               </el-table-column>
               <el-table-column  label="启用状态">
                                 <template slot-scope="scope">
                                   {{scope.row.is_enabled === 1 ? '是' : '否'}}
                                 </template>
               </el-table-column>
               <el-table-column  width="260"
                                 label="操作">
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
  mounted() {
    if (this.show_data_flag === '货位') {
      this.get_data();
      this.active = true;
    }
  },
  props: {
    id: [String],
    show_data_flag: [String],
  },
  watch: {
    show_data_flag(val) {
      if (val === '货位') {
        this.active = true;
        this.get_data();
      }
    },
  },
  computed: {
    queryWarehouseId() {
      if (+this.$route.query.warehouse_id) {
        return +this.$route.query.warehouse_id;
      }
      return localStorage.getItem('warehouseId');
    },
  },
  data() {
    return {
      active: false, // 父组件已经选中标志
      shelf_list_data: [],
      params: {}, // 分页参数
      total: '',
      currentPage: 1,
      area_list_data: [],
      warehouse_name_cn: '',
    };
  },
  methods: {
    handleCurrentChange(val) {
      $http.checkWarehouseshelf({
        page: val,
        warehouse_id: this.queryWarehouseId,
      })
        .then((res) => {
          this.shelf_list_data = res.data.data;
          this.total = res.data.total;
          this.currentPage = res.data.current_page;
        });
    },
    get_data() {
      if (this.active) {
        $http.getWarehouseshelf({ warehouse_id: this.queryWarehouseId })
          .then((res) => {
            this.shelf_list_data = res.data.data;
            this.total = res.data.total;
          });
      }
    }, // 获取数据列表
    del(id) {
      this.$confirm('此操作将永久删除该货位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        $http.delWarehouseshelf(id)
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
        name: 'editCargoShelf',
        query: {
          shelfId: id, // 该条数据的 id
          warehouse_id: this.queryWarehouseId, // 当前仓库 id
          edit: true,
          currentPage: this.currentPage, // 这个参数是用来查询不在首页的数据(因为拿到的数据分页)
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
