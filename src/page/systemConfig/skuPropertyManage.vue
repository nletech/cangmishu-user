<template>
<div class="inboundList">
  <wms-tags>
    <my-group
      v-model="params"
      @submit="onSubmit">
      <el-col :span="2" :offset="22">
        <el-button
        type="text"
        @click="addSkuProperty"
        icon="el-icon-plus">
          {{$t('AddSkuProperty')}}
        </el-button>
      </el-col>
    </my-group>
    <el-table
      :data="inbound_list_data"
      border
      style="width:100%">
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        prop="status_name"
        label="状态">
      </el-table-column>
      <el-table-column
        prop="warehouse.name_cn"
        :label="$t('propertyCnName')">
      </el-table-column>
      <el-table-column
        prop="batch_type.name"
        :label="$t('propertyEnName')">
      </el-table-column>
      <el-table-column
        prop="batch_code"
        :label="$t('inputFormat')">
      </el-table-column>
      <el-table-column
        prop="confirmation_number"
        :label="$t('isHandheldSideInput')">
      </el-table-column>
      <el-table-column
        width="180"
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini"
            @click="editProperty(scope.row)">
            编辑
          </el-button>
          <el-button
            size="mini"
            @click="inboundDelete(scope.row.id)"
            type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <button-pagination :pageParams="params"></button-pagination>
  </wms-tags>
</div>
</template>

<script>
import buttonPagination from '@/components/pagination_and_buttons';
import getListData from '@/mixin/list';
import $http from '@/api';
import WmsTags from '@/components/wms_tags';
import MyInput from '@/components/my_input';
import MySelect from '@/components/my_select';
import MyGroup from '@/components/my_group';
import MyDate from '@/components/my_date';

export default {
  data() {
    return {
      inbound_list_data: [], // 入库单列表
      inboundDialogVisible: false, // 入库单详情弹框
      inbound_info: {},
      id: 0,
      boundList: [],
    };
  },
  components: {
    WmsTags,
    MyInput,
    MyGroup,
    MyDate,
    MySelect,
    buttonPagination,
  },
  mixins: [getListData],
  created() {
    this.getBoundList();
  },
  computed: {
  },
  methods: {
    // 添加属性
    addSkuProperty() {
      this.$router.push({
        name: 'AddSkuProperty',
      });
    },
    // 获取仓库列表
    getBoundList() {
      const warehouseParams = {
        page: 1,
        page_size: 100,
        from: 1,
      };
      $http.warehouse(warehouseParams).then((res) => {
        this.boundList = res.data.data;
      });
    },
    // 获取入库单列表
    getList() {
      $http.inboundList(this.params).then((res) => {
        this.inbound_list_data = res.data.data;
        this.params.data_count = res.data.total;
      });
    },
    // 编辑属性
    editProperty(idVal) {
      this.$router.push({
        name: 'AddSkuProperty',
        query: {
          id: idVal,
        },
      });
    },
    // 删除入库单
    inboundDelete(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        $http.inboundDel({
          batch_id: id,
        }).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success',
            showClose: true,
          });
          this.getList();
        });
      }).catch(() => {});
    },
  },
};
</script>

<style lang="less" module>
@import '../../less/public_variable.less';

.util {
  text-align: right;
  margin: 20px;
}
</style>
