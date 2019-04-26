
<template>
  <wms-tags
    :tagList="tag_data"
    @change="getList"
    :addText="addNmae"
    v-model="params.type">
    <el-table
      :data="address_list_data"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        prop="fullname"
        :label="nameCn">
      </el-table-column>
      <el-table-column
        :label="$t('address')">
        <template slot-scope="scope">
          {{scope.row.city}} {{scope.row.address}} {{scope.row.door_no}}
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        :label="$t('ContactInformations')">
      </el-table-column>
      <el-table-column
        :label="$t('IsItDefault')">
        <template slot-scope="scope">
          {{scope.row.is_default | switchTypeCn}}
        </template>
      </el-table-column>
      <el-table-column
        width="280"
        :label="$t('operation')">
        <template slot-scope="scope">
         <el-button size="mini" @click="eidtAddress(scope.row.id)">编辑</el-button>
          <el-button
          size="mini"
          v-if="!scope.row.is_default"
          @click="IsItDefault(scope.row.id)"
          type="success">设为默认</el-button>
          <el-button
          size="mini"
          v-else
          :disabled="scope.row.is_default"
          @click="IsItDefault(scope.row.id)"
          type="info">默认地址</el-button>
          <el-button size="mini" type="danger" @click="delAddress(scope.row.id)">删除</el-button>
        </template>
        <!-- <template slot-scope="scope">
          <el-button @click="$router.push({
            name: 'MayApplyStoreInfo',
            query: {
              type: 'StoreLeases',
              id: scope.row.id,
            },
          })" size="mini">详情</el-button>
        </template> -->
      </el-table-column>
    </el-table>
    <pagination-and-buttons :pageParams="params">
    </pagination-and-buttons>
  </wms-tags>
</template>

<script>
import WmsTags from '@/components/wms_tags';
import mixin from '@/mixin/list';
import $http from '@/api';
import PaginationAndButtons from '@/components/pagination_and_buttons';

export default {
  data() {
    return {
      tag_data: [
        { name: '0', label: '收件人管理' },
        { name: '1', label: '发件人管理' },
      ],
      params: {
        type: this.$route.query.type || '0',
      },
      address_list_data: [],
    };
  },
  mixins: [mixin],
  components: {
    WmsTags,
    PaginationAndButtons,
  },
  computed: {
    nameCn() {
      if (+this.params.type) {
        return this.$t('Sendername');
      }
      return this.$t('addresseename');
    },
    addNmae() {
      if (+this.params.type) {
        return 'addSender';
      }
      return 'addAddressee';
    },
    editNmae() {
      if (+this.params.type) {
        return 'editSender';
      }
      return 'editAddressee';
    },
  },
  methods: {
    // 获取仓库列表
    getList() {
      this.address_list_data = [];
      $http.senderList(this.params, this.params.type).then((res) => {
        this.address_list_data = res.data.data;
        this.params.data_count = res.data.total;
      });
    },
    eidtAddress(ids) {
      this.$router.push({
        name: this.editNmae,
        query: {
          id: ids,
        },
      });
    },
    // 是否启用
    IsItDefault(id) {
      $http.setDefault(id, this.params.type).then(() => {
        this.getList();
      });
    },
    delAddress(ids) {
      this.$confirm('此操作将永久删除该地址, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        $http.delAddress({ id: ids }, this.params.type).then(() => {
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
  @import '../../less/public_variable.less';
</style>
<style lang="less">
  @import '../../less/public_variable.less';
</style>
