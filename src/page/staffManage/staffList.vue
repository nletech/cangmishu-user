<template>
<div class="storeManage">
  <wms-tags>
    <my-group
      v-model="params"
      @submit="onSubmit">
      <el-col :span="4" :offset="17">
        <my-input keyName="keywords"></my-input>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button
        type="text"
        @click="$router.push({name: 'staffAdd'})"
        icon="el-icon-plus">
          {{$t('staffAdd')}}
        </el-button>
      </el-col>
    </my-group>
    <el-table
      :data="staff_data"
      border>
      <el-table-column
        type="index"
        label="#"
        width="55">
      </el-table-column>
      <el-table-column
        prop="email"
        label="用户名（EUT账户邮箱）">
        <template slot-scope="scope">
          {{scope.row.employee && scope.row.employee.email}}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="updated_at"
        label="最后登陆时间">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.row.employee.id, scope.row.id)">编辑资料</el-button>
        </template>
      </el-table-column>
    </el-table>

    <button-pagination :pageParams="params"></button-pagination>

  </wms-tags>
</div>
</template>

<script>
import getListData from '@/mixin/list';
import WmsTags from '@/components/wms_tags';
import MyInput from '@/components/my_input';
import MyGroup from '@/components/my_group';
import $http from '@/api';
import buttonPagination from '@/components/pagination_and_buttons';

export default {
  data() {
    return {
      staff_data: [], // 员工列表
    };
  },
  components: {
    WmsTags,
    MyInput,
    MyGroup,
    buttonPagination,
  },
  mixins: [getListData],
  computed: {
    vip_id() {
      return this.$store.state.token.vip_info && this.$store.state.token.vip_info.id;
    },
  },
  methods: {
    // 获取员工列表
    getList() {
      $http.staffList({ ...this.params, user_id: this.vip_id }).then((res) => {
        this.staff_data = res.data.data;
        this.params.data_count = res.data.total;
      });
    },
    edit(userId, id) {
      this.$router.push({
        name: 'staffAdd',
        query: {
          user_id: userId,
          staff_id: id,
        },
      });
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
