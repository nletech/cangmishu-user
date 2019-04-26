<template>
<div class="storeManage">
  <wms-tags>
    <my-group
      v-model="params"
      @submit="onSubmit">
      <el-col :span="14">
          <span>面积(平方米)</span>
          <el-input
          v-model="params.area_min"
          size="mini"
          placeholder="最小值"
          @keyup.enter.native="onSubmit" style="width:150px;"></el-input> -
          <el-input
          v-model="params.area_max"
          size="mini"
          placeholder="最大值"
          @keyup.enter.native="onSubmit" style="width:150px;"></el-input>
      </el-col>
      <!-- <el-col :span="3">
        <el-input
          v-model="params.area_max"
          size="mini"
          placeholder="最大值"
          @keyup.enter.native="onSubmit" style="width:150px;"></el-input>
      </el-col> -->
      <el-col :span="4" :offset="6">
        <my-input keyName="keywords"></my-input>
      </el-col>
    </my-group>
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
        prop="address"
        width="180"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="info(scope.row.id)" size="mini">详情</el-button>
          <el-button @click="LeaseAudit(scope.row.name_cn, scope.row.id)" size="mini">租赁</el-button>
        </template>
      </el-table-column>
    </el-table>

    <button-pagination :pageParams="params"></button-pagination>
  </wms-tags>
</div>
</template>

<script>
import WmsTags from '@/components/wms_tags';
import mixin from '@/mixin/list';
import $http from '@/api';
import MyInput from '@/components/my_input';
import MyGroup from '@/components/my_group';
import buttonPagination from '@/components/pagination_and_buttons';

export default {
  data() {
    return {
      params: {
        area_min: '',
        area_max: '',
      },
      renters_list_data: [], // 仓库列表状态
    };
  },
  mixins: [mixin],
  components: {
    WmsTags,
    buttonPagination,
    MyInput,
    MyGroup,
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
    storeType(val) {
      console.log(val);
    },
    // 获取仓库列表
    getList() {
      $http.rentersList(this.params).then((res) => {
        this.renters_list_data = res.data.data;
        this.params.data_count = res.data.total;
      });
    },
    // 租赁审核
    LeaseAudit(names, ids) {
      this.$router.push({
        name: 'LeasingReview',
        query: {
          name: names,
          id: ids,
        },
      });
    },
    // 查看详情
    info(ids) {
      this.$router.push({
        name: 'MayApplyStoreInfo',
        query: {
          id: ids,
        },
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
