<template>
<div>
  <el-table
    :data="odo_list_data"
    border
    style="width: 100%"
  >
    <el-table-column
      type="index"
      label="#"
    >
    </el-table-column>
    <edit-table
      prop="name"
      label="类型名称"
    >
    </edit-table>
    <edit-table
      label="收货区">
      <el-select
        filterable
        slot-scope="scope"
        v-model="scope.row.area_id"
        size="small"
        placeholder="请选择指定收货区"
      >
        <el-option
          v-for="item in area_list_data"
          :key="item.id"
          :label="item.name_cn"
          :disabled="!item.is_enabled"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span slot="props" slot-scope="scope" v-if="scope.row.warehouse_area">
        {{scope.row.warehouse_area.name_cn}}
      </span>
    </edit-table>
    <edit-table
      label="启用状态">
      <el-switch
        slot-scope="scope"
        v-model="scope.row.is_enabled"
        :active-value="1"
        :inactive-value="0"
      >
      </el-switch>
      <span slot-scope="scope" slot="props">
        {{scope.row.is_enabled | switchTypeCn}}
      </span>
    </edit-table>
    <table-function
      :saveEdit="edit"
      label="操作"
    >
      <el-button
        type="danger"
        size="mini"
        slot-scope="scope"
        :disabled="!!scope.row.batches_count"
        @click="del(scope.row.id)"
      >
        删除
      </el-button>
    </table-function>
  </el-table>
  <pagination-and-buttons :pageParams="params">
  </pagination-and-buttons>
</div>
</template>

<script>
import mixin from '@/mixin/list';
import $http from '@/api';
import EditTable from '@/components/my_edit_table';
import TableFunction from '@/components/my_edit_table/table_function';
import PaginationAndButtons from '@/components/pagination_and_buttons';

export default {
  mixins: [mixin],
  data() {
    return {
      odo_list_data: [],
      params: {
        warehouse_id: this.$route.query.id,
      },
      area_list_data: [],
      is_enabled: true,
    };
  },
  components: {
    EditTable,
    TableFunction,
    PaginationAndButtons,
  },
  methods: {
    // 出库单列表
    getList() {
      $http.batchType(this.params).then((res) => {
        this.odo_list_data = res.data.data;
        this.params.data_count = res.data.total;
      });
      $http.warehouseArea(this.params).then((res) => {
        this.area_list_data = res.data.data;
        this.area_list_data.unshift({ id: 0, is_enabled: true, name_cn: '请选择' });
      });
    },
    // 删除出库单
    del(id) {
      this.$confirm('此操作将永久删除该入库单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        $http.delBatchType({
          batch_type_id: id,
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
    // 编辑出库单
    edit(row) {
      $http.editBatchType({
        name: row.name,
        area_id: row.area_id,
        is_enabled: +row.is_enabled,
        batch_type_id: row.id,
      }).then(() => {
        this.getList();
      });
    },
  },
};
</script>
