<template>
<div>
  <el-table
    :data="tray_list_data"
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
      prop="capacity"
      label="容积(m³)">
    </el-table-column>
    <el-table-column
      label="容器重量（g）">
      <template slot-scope="scope">
        {{scope.row.weight}}
      </template>
    </el-table-column>
    <el-table-column
      prop="functions"
      label="启用状态">
      <template slot-scope="scope">
        {{scope.row.is_enabled | switchTypeCn}}
      </template>
    </el-table-column>
    <el-table-column
      prop="created_at"
      label="更新时间">
    </el-table-column>
    <el-table-column
      width="260"
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
      tray_list_data: [],
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
      $http.kep(this.params).then((res) => {
        this.tray_list_data = res.data.data;
        this.params.data_count = res.data.total;
      });
    },
    del(id) {
      this.$confirm('此操作将永久删除该篮筐, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        $http.delKep({
          kep_id: id,
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
        name: 'editCargoKep',
        query: {
          kepId: id,
          id: this.$route.query.id,
        },
      });
    },
  },
};
</script>
