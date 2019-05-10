<template>
  <div>
    <div :class="$style.addressManagement">
      <div :class="$style.am_main">
        <!-- 标签页 -->
        <el-row>
          <el-col>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="用户管理" name="first">
              </el-tab-pane>
              <el-tab-pane label="配置管理" name="second">
                配置管理
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col>
            <el-button>添加something</el-button>
          </el-col>
        </el-row>
        <el-row>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'addressManagement',
};
</script>
<style lang="less" module>
@import '../../../less/public_variable.less';

.addressManagement {
  margin: 40px 0 10px 0;
  .am_main {
    width: 90%;
    margin: 0 auto;
    // background-color: red;
  }
}
</style>

<!-- <div class="storeManage">
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
</div> -->

<!-- <script>
import WmsTags from '@/components/wms_tags';
import getListData from '@/mixin/list';
import PaginationAndButtons from '@/components/pagination_and_buttons';
import $http from '@/api';

export default {
  data() {
    return {
      store_list_data: [],
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
    storeType() {
      this.getList();
    },
    getList() {
      $http.warehouse(this.params)
        .then((res) => {
          this.store_list_data = res.data.data;
          this.params.data_count = res.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    edit(idVal) {
      this.$router.push({
        name: 'viewEdit',
        query: {
          id: idVal,
        },
      });
    },
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

</style> -->
