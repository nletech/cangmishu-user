<template>
<div class="storeManage">
  <wms-tags
    :tagList="tag_data"
    @change="storeType"
    v-model="params.type"
  >
    <my-table-header
      keys="addStoreManage"
      :data="store_list_data"
    >
      <el-table-column
        align="center"
        header-align="center"
        type="index"
        label="#"
      >
      </el-table-column>
      <my-table-item
        align="center"
        header-align="center"
        prop="name_cn"
        label="姓名"
      >
      </my-table-item>
      <my-table-item
        align="center"
        header-align="center"
        prop="code"
        label="电话"
      >
      </my-table-item>
      <my-table-item
        header-align="center"
        align="center"
        prop="contact_user"
        label="地址"
      >
      </my-table-item>
      <el-table-column
        header-align="center"
        width="240"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.row.id)">编辑</el-button>
          <el-button size="mini" @click="config(scope.row.id)">删除</el-button>
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
        { name: '1', label: '收件信息' },
        { name: '2', label: '发件信息' },
      ],
      params: {
        type: '1',
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
      $http.warehouse(this.params)
        .then((res) => {
          this.store_list_data = res.data.data;
          this.params.data_count = res.data.total;
        })
        .catch((err) => {
          console.log(err);
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
