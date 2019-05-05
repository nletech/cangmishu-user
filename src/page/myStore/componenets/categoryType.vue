<template>
<div class="storeManage">
    <el-table
      :data="category_list_data"
      :fit = true
      border
      style="width: 100%">
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        prop="name_cn"
        label="分类中文名">
      </el-table-column>
      <el-table-column
        prop="name_en"
        label="分类外文名">
      </el-table-column>
      <el-table-column
        prop="feature.name_cn"
        label="仓库特性">
      </el-table-column>
      <el-table-column
        prop="need_expiration_date"
        width="280px"
        label="SKU属性">
        <template slot-scope="scope">
          <el-tag type="success" size="medium" v-if="scope.row.need_expiration_date==1">保质期</el-tag>
          <el-tag type="success"
                  size="medium" v-if="scope.row.need_production_batch_number==1">生产批次号</el-tag>
          <el-tag type="success"
                  size="medium" v-if="scope.row.need_best_before_date==1">最佳食用期</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="是否启用">
        <template slot-scope="scope">
          <span v-if="scope.row.is_enabled==1">是</span>
          <span v-if="scope.row.is_enabled==0">否</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        width="180"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="editCategory(scope.row.id)" size="mini">编辑</el-button>
          <el-button size="mini"
                     type="danger"
                     @click="delClassification(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
     <button-pagination :pageParams="params"></button-pagination>
</div>
</template>

<script>
import buttonPagination from '@/components/pagination_and_buttons';
import mixin from '@/mixin/list';
import $http from '@/api';

export default {
  data() {
    return {
      category_list_data: [], // 仓库列表状态
      params: {
        warehouse_id: this.$route.query.id,
      },
    };
  },
  mixins: [mixin],
  components: {
    buttonPagination,
  },
  // created() {
  //   this.getList();
  // },
  computed: {
    ownerId() {
      return this.$store.state.token.id;
    },
  },
  methods: {
    // 获取仓库货品分类列表
    getList() {
      $http.categoriesList(this.params).then((res) => {
        this.category_list_data = res.data.data;
        this.params.data_count = res.data.total;
      });
    },
    addCategory() {
      this.$router.push({
        name: 'addCategory',
      });
    },
    editCategory(id) {
      this.$router.push({
        name: 'editCategory',
        query: {
          ...this.$route.query, categoryId: id,
        },
      });
    },
    delClassification(ids) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        $http.delCategory({
          id: ids,
          warehouse_id: this.$route.query.id,
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功',
          });
          this.getList();
        });
      });
    },
  },
};
</script>

<style lang="less" module>
  @import '../../../less/public_variable.less';
  .top_button {
  width: 93%;
  padding: 10px 45px 0px 45px;
  display: inline-flex;
  justify-content: flex-end;
  align-items: baseline;
  .top_notice {
    color: red;
    padding-right: 10px;
  }
}
</style>
