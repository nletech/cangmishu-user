
<template>
  <wms-tags
    :tagList="tag_data"
    @change="storeType"
    v-model="params.status">
    <el-table
      :data="renters_list_data"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        prop="name_cn"
        label="仓库名称">
      </el-table-column>
      <el-table-column
        prop="name_en"
        label="外文名称">
      </el-table-column>
      <el-table-column
        prop="country"
        label="国家">
      </el-table-column>
      <el-table-column
        prop="contact_user"
        label="联系人">
      </el-table-column>
      <el-table-column
        prop="contact_number"
        label="联系方式">
      </el-table-column>
      <!-- <el-table-column
        label="储存温度">
        <template slot-scope="scope">
          {{scope.row.temperature | temperatureType}}
        </template>
      </el-table-column> -->
      <el-table-column
        prop="area"
        label="面积(㎡)">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          {{scope.row.lease_status | statusType}}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        width="180"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="$router.push({
            name: 'MayApplyStoreInfo',
            query: {
              type: 'StoreLeases',
              id: scope.row.id,
            },
          })" size="mini">详情</el-button>
        </template>
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
        { name: '0', label: '全部' },
        { name: '1', label: '待审核' },
        { name: '2', label: '已通过' },
        { name: '3', label: '未通过' },
      ],
      params: {
        warehouse_id: '',
        status: '0',
      },
      renters_list_data: [],
    };
  },
  mixins: [mixin],
  components: {
    WmsTags,
    PaginationAndButtons,
  },
  created() {
  },
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
      $http.renterslist(this.params).then((res) => {
        this.renters_list_data = res.data.data;
        this.params.data_count = res.data.total;
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
