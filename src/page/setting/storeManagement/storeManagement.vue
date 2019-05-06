<template>
<div class="storeManage">
  <wms-tags
    :tagList="tag_data"
    addText="addStoreManage"
    @change="storeType"
    v-model="params.type">
    <my-table-header
      keys="addStoreManage"
      :data="store_list_data">
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <my-table-item
        prop="name_cn"
        label="仓库名称">
      </my-table-item>
      <my-table-item
        prop="code"
        label="仓库编号">
      </my-table-item>
      <my-table-item
        prop="country"
        label="国家">
      </my-table-item>
      <my-table-item
        prop="contact_user"
        label="联系人">
      </my-table-item>
      <my-table-item
        prop="contact_number"
        label="联系方式">
      </my-table-item>
      <my-table-item
        prop="area"
        label="仓库面积(㎡)">
      </my-table-item>
      <my-table-item
        label="仓库类型">
        <template slot-scope="scope">
          {{scope.row.type | storeType}}
        </template>
      </my-table-item>
      <my-table-item
        label="开通状态">
        <template slot-scope="scope">
          {{scope.row.status | switchTypeCn}}
        </template>
      </my-table-item>
      <my-table-item
        v-if="params.type == 1"
        prop="apply_num"
        label="申请数量">
      </my-table-item>
      <!-- <my-table-item
        label="使用状态">
        <template slot-scope="scope">
          {{scope.row.is_used | switchTypeCn}}
        </template>
      </my-table-item> -->
      <el-table-column
        width="240"
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.row.id)">查看编辑</el-button>
          <el-button size="mini" @click="config(scope.row.id)">基础配置</el-button>
        </template>
      </el-table-column>
    </my-table-header>
    <pagination-and-buttons :pageParams="params">
    </pagination-and-buttons>
  </wms-tags>
</div>
</template>

<script>
import WmsTags from '@/components/wms_tags';
import getListData from '@/mixin/list';
import PaginationAndButtons from '@/components/pagination_and_buttons';
import $http from '@/api';

export default {
  data() {
    return {
      store_list_data: [], // 仓库列表状态
      tag_data: [
        { name: '2', label: '自用仓库' },
        { name: '1', label: '共享仓库' },
      ],
      params: {
        type: '2',
      },
    };
  },
  mixins: [getListData],
  components: {
    WmsTags,
    PaginationAndButtons,
  },
  name: 'storeManage',
  computed: {
    ownerId() {
      return this.$store.state.token.id;
    },
  },
  methods: {
    // 获取到选中仓库类型
    storeType() {
      this.getList();
    },
    // 获取仓库列表
    getList() {
      // this.params.owner_id = this.ownerId;
      $http.warehouse(this.params).then((res) => {
        this.store_list_data = res.data.data;
        this.params.data_count = res.data.total;
      });
    },
    // 编辑仓库
    edit(idVal) {
      this.$router.push({
        name: 'viewEdit',
        query: {
          id: idVal,
        },
      });
    },
    // 基础配置
    config(idVal) {
      this.$router.push({
        name: 'BasicsConfig',
        query: {
          id: idVal,
        },
      });
    },
  },
};
</script>

<style lang="less" module>
</style>
<style lang="less">
</style>
