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
    <!-- <el-table-column
      prop="id"
      label="编号">
    </el-table-column> -->
    <el-table-column
      prop="name_cn"
      :label="$t('propertyCnName')">
    </el-table-column>
    <el-table-column
      prop="name_en"
      :label="$t('propertyEnName')">
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
      console.log(this.params);
      $http.warehouseFeature(this.params).then((res) => {
        this.Area_list_data = res.data.data;
        this.params.data_count = res.data.total;
      });
    },
    del(id) {
      this.$confirm('此操作将永久删除该特性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        $http.delWarehouseFeature({
          id,
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
        name: 'editCargoProperty',
        query: {
          propertyId: id,
          id: this.$route.query.id,
        },
      });
    },
  },
};
</script>

<style>

</style>
