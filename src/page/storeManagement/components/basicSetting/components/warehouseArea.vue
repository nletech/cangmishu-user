<template>
<div>
  <el-table
    :data="Area_data"
    border
    style="width: 100%"
  >
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
  <!-- <pagination-and-buttons :pageParams="params">
  </pagination-and-buttons> -->
</div>
</template>

<script>
// import mixin from '@/mixin/list';
import $http from '@/api';
// import PaginationAndButtons from '@/components/pagination_and_buttons';

export default {
  props: {
    warehouse_id: [Number],
    id: [String],
    show_data_flag: [String],
  },
  watch: {
    warehouse_id(val) {
      console.log(this.warehouse_id, val, 'this.warehouse_id');
    },
    show_data_flag(val) {
      console.log(this.show_data_flag, val, 'show_data_flag');
      if (val === '货区') {
        console.log(this.show_data_flag, val, 'show_data_flag');
        this.active = true;
        this.get_data();
      }
    },
  },
  // mixins: [mixin],
  data() {
    return {
      active: false, // 父组件已经选中标志
      Area_data: [],
      // params: {
      //   warehouse_id: this.$route.query.id,
      // },
    };
  },
  components: {
    // PaginationAndButtons,
  },
  methods: {
    get_data() {
      if (this.active) {
        console.log('货区请求');
        console.log(this.warehouse_id, '当前仓库id');
        $http.getWarehouseArea({ warehouse_id: this.warehouse_id })
          .then((res) => {
            this.Area_data = res.data.data;
            this.$set(this.Area_data);
            console.log(res, 'res');
            console.log(this.Area_data, 'this.Area_data');
          });
      }
    },
    getList() {
      // $http.getWarehouseArea(this.params).then((res) => {
      //   this.Area_list_data = res.data.data;
      //   this.params.data_count = res.data.total;
      // });
    }, // 获取货区信息
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
  },
};
</script>

<style>

</style>
