<template>
<div>
  <el-table
    :data="Area_list_data"
    border
    style="width: 100%">
    <el-table-column
      type="index"
      label="#">
    </el-table-column>
    <el-table-column
      prop="code"
      label="编号">
    </el-table-column>
    <el-table-column
      prop="name_cn"
      label="名称">
    </el-table-column>
    <el-table-column
      label="功能分类">
      <template slot-scope="scope">
        {{scope.row.function_names}}
      </template>
    </el-table-column>
    <el-table-column
      prop="feature.name_cn"
      label="仓库特性">
    </el-table-column>
    <el-table-column
      prop="functions"
      label="启用状态">
      <template slot-scope="scope">
        {{scope.row.is_enabled | switchTypeCn}}
      </template>
    </el-table-column>
    <el-table-column
      width="320"
      label="操作">
      <template slot-scope="scope">
        <el-button size="mini" @click="edit(scope.row.id)">编辑</el-button>
        <el-button  type="danger" @click="del(scope.row.id)" size="mini">删除</el-button>
        <!-- <el-button size="mini" @click="seeArea(scope.row.id)"
         type="success">查看货位</el-button> -->
      </template>
    </el-table-column>
  </el-table>
  <pagination-and-buttons :pageParams="params">
  </pagination-and-buttons>
</div>
</template>

<script>
import mixin from '@/mixin/list';
import $http from '@/api';
import PaginationAndButtons from '@/components/pagination_and_buttons';

export default {
  mixins: [mixin],
  data() {
    return {
      Area_list_data: [],
      params: {
        warehouse_id: this.$route.query.id,
      },
    };
  },
  components: {
    PaginationAndButtons,
  },
  methods: {
    getList() {
      $http.warehouseArea(this.params).then((res) => {
        this.Area_list_data = res.data.data;
        this.params.data_count = res.data.total;
      });
    },
    del(id) {
      this.$confirm('此操作将永久删除该货区, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        $http.delWarehouseArea({
          area_id: id,
        }).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success',
            showClose: true,
          });
          this.getList();
        });
      });
    },
    edit(id) {
      this.$router.push({
        name: 'editCargoArea',
        query: {
          areaId: id,
          id: this.$route.query.id,
        },
      });
    },
    seeArea(id) {
      this.$router.replace({
        query: { ...this.$route.query, warehouse_area_id: id },
      });
      this.$emit('change', id);
    },
  },
};
</script>

<style>

</style>
