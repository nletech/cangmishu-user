<template>
  <div>
    <el-table
      :data="shelf_list_data"
      @filter-change="filterChange"
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
        prop="warehouse_name"
        :filters="area_list_data"
        :filter-method="filterTag"
        label="所属货区"
      >
      </el-table-column>
      <el-table-column
        prop="capacity"
        label="容积（m³）">
      </el-table-column>
      <!-- <el-table-column
        prop="passage"
        label="通道">
      </el-table-column>
      <el-table-column
        prop="row"
        label="排">
      </el-table-column>
      <el-table-column
        prop="col"
        label="列">
      </el-table-column>
      <el-table-column
        prop="floor"
        label="层">
      </el-table-column> -->
      <el-table-column
        label="启用状态">
        <template slot-scope="scope">
          {{scope.row.is_enabled | switchTypeCn}}
        </template>
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
      shelf_list_data: [],
      params: {
        warehouse_id: this.$route.query.id,
      },
      area_list_data: [],
      isGetAreaData: false,
      warehouse_name_cn: '',
    };
  },
  components: {
    PaginationAndButtons,
  },
  props: ['id'],
  methods: {
    getList() {
      this.params.warehouse_area_id = this.id;
      if (localStorage.getItem('shelfID') && this.params.page === 1) {
        this.params.page = parseInt(localStorage.getItem('shelfID'), 10);
      }
      $http.Warehouseshelf({
        page: this.params.page,
        page_size: this.params.page_size,
        warehouse_id: this.params.warehouse_id,
        warehouse_area_id: '',
        is_enabled: '',
      }).then((res) => {
        localStorage.removeItem('shelfID');
        this.shelf_list_data = res.data.data;
        this.params.data_count = res.data.total;
        this.shelf_list_data.forEach((val) => {
          val.warehouse_name = val.warehouse_area && val.warehouse_area.name_cn;
        });
      });
      if (!this.isGetAreaData) {
        $http.warehouseArea({
          warehouse_id: this.params.warehouse_id,
          page: 1,
          page_size: 200,
          is_enabled: 1 }).then((res) => {
          this.area_list_data = res.data.data;
          this.area_list_data.forEach((val) => {
            val.text = val.name_cn;
            val.value = val.name_cn;
          });
          this.isGetAreaData = true;
        });
      }
    },
    del(id) {
      this.$confirm('此操作将永久删除该货位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        $http.delShelf({
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
    filterTag(value, row) {
      return row.warehouse_name === value;
    },
    filterChange(filter) {
      const areaArray = [];
      for (const key of Object.keys(filter)) {
        this.warehouse_name_cn = filter[key];
      }
      this.area_list_data.forEach((val) => {
        if (this.warehouse_name_cn.indexOf(val.name_cn) !== -1) {
          areaArray.push(val.id);
        }
      });
      this.params.warehouse_area_id = areaArray.join(',');
      console.log(this.params.warehouse_area_id, 'filter');
      $http.Warehouseshelf(this.params).then((res) => {
        this.shelf_list_data = res.data.data;
        this.params.data_count = res.data.total;
        this.shelf_list_data.forEach((val) => {
          val.warehouse_name = val.warehouse_area && val.warehouse_area.name_cn;
        });
      });
    },
    edit(id) {
      localStorage.setItem('shelfID', this.params.page);
      this.$router.push({
        name: 'editCargoShelf',
        query: {
          shelfId: id,
          id: this.$route.query.id,
        },
      });
    },
  },
};
</script>

<style>

</style>
