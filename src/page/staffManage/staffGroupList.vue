<template>
<div class="storeManage">
   <wms-tags>
    <my-group
      v-model="params"
      @submit="onSubmit">
      <el-col :span="5">
        <my-select :clearable="false" keyName="warehouse_id">
          <el-option
          v-for="item in warehouseList"
          :value="item.id"
          :label="item.name_cn"
          :key="item.id">
          </el-option>
        </my-select>
      </el-col>
      <!-- <el-col :span="2" :offset="17" style="text-align: right;">
        <el-button
        type="text"
        @click="$router.push({name: 'staffGroupAdd'})"
        icon="el-icon-plus">
          {{$t('staffGroupAdd')}}
        </el-button>
      </el-col> -->
    </my-group>
    <el-table
      :data="staff_group_data"
      border>
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="name_cn"
        :label="$t('MemberGroup')">
      </el-table-column>
      <el-table-column
        prop="name_en"
        :label="$t('MemberGroupe')">
      </el-table-column>
      <el-table-column
        prop="employees_count"
        :label="$t('NumberOfMembers')">
      </el-table-column>
      <el-table-column
        width="100"
        label="操作">
        <template slot-scope="scope">
          <!-- <el-button size="mini">查看详情</el-button> -->
          <el-button
          size="mini"
          @click="getEmployee(scope.row.id, scope.row.name_cn)">成员</el-button>
        </template>
      </el-table-column>
    </el-table>
    <button-pagination :pageParams="params"></button-pagination>

  </wms-tags>
  <el-dialog
    :title="`${name}列表`"
    :visible.sync="dialogVisible"
    width="80%"
    :before-close="handleClose">
    <div :class="$style.add_back">
      <el-button
      size="mini"
      icon="el-icon-plus"
      @click="addStaff">添加员工</el-button>
    </div>
    <el-table
    :data="warehouseEmployeeList"
    border>
      <el-table-column
      type="index">
      </el-table-column>
      <el-table-column
      label="用户名（NLE账户邮箱）">
      <template slot-scope="scope">
        {{scope.row.employee && scope.row.employee.email}}
      </template>

      </el-table-column>
      <!-- <el-table-column
      label="姓名">

      </el-table-column>
      <el-table-column
      label="手机号">

      </el-table-column> -->
      <el-table-column
      label="最后登录时间">
        <template slot-scope="scope">
          {{scope.row.employee.last_login_at}}
        </template>
      </el-table-column>
      <el-table-column
      width="80"
      label="操作">
        <template slot-scope="scope">
          <el-button
          size="mini"
          type="danger"
          @click="delEmployee(scope.row.id, scope.row.role_id)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <button-pagination :pageParams="warehouse_staff"></button-pagination>
    <el-dialog
      width="80%"
      title="备用员工列表"
      :visible.sync="is_add_staff"
      append-to-body>
      <el-table
        :data="staff_data"
        @select="handleSelectionChange"
        border>
        <el-table-column
          type="selection"
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
      </el-table>
      <button-pagination :pageParams="staff_list"></button-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button
        @click="backEmployeeList">取 消</el-button>
        <el-button
        :loading="$store.state.config.button_loading"
        type="primary" @click="addSpareEmployee">确 定</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</div>
</template>

<script>
import getListData from '@/mixin/list';
import WmsTags from '@/components/wms_tags';
import MySelect from '@/components/my_select';
import MyGroup from '@/components/my_group';
import buttonPagination from '@/components/pagination_and_buttons';
import $http from '@/api';

export default {
  data() {
    return {
      staff_group_data: [], // 员工组列表
      params: {
        warehouse_id: '',
      },
      warehouse_staff: {
        page: 1,
        page_szie: 10,
        data_count: 0,
      },
      staff_list: {
        page: 1,
        page_szie: 10,
        data_count: 0,
      },
      warehouseList: [],
      dialogVisible: false,
      warehouseEmployeeList: [],
      name: '',
      is_add_staff: false,
      staff_data: [],
      SelectEmployeeArr: [],
      role_id: 0,
    };
  },
  mixins: [getListData],
  components: {
    WmsTags,
    MyGroup,
    MySelect,
    buttonPagination,
  },
  // created() {
  // },
  computed: {
    vip_id() {
      return this.$store.state.token.vip_info && this.$store.state.token.vip_info.id;
    },
  },
  methods: {
    // 添加员工组
    addCommodity() {
      this.$router.push({
        name: 'staffGroupAdd',
      });
    },
    // 拉取仓库列表
    getList() {
      $http.warehouse({ from: 1 }).then((res) => {
        this.warehouseList = res.data.data;
        console.log(this.warehouseList);
        this.params.warehouse_id = this.warehouseList[0].id;
        this.params.data_count = res.data.total;
        this.EmployeeList();
      });
    },
    // 拉取员工组列表
    EmployeeList() {
      $http.warehouseRole(this.params.warehouse_id).then((res) => {
        this.staff_group_data = res.data.data;
      });
    },
    // 获取员工列表
    getStffList() {
      $http.staffList({ ...this.staff_list, user_id: this.vip_id }).then((res) => {
        this.staff_data = res.data.data;
        this.staff_list.data_count = res.data.total;
      });
    },
    // 拉取仓库员工列表
    getEmployee(roelId, name) {
      this.dialogVisible = true;
      this.role_id = roelId;
      this.name = name;
      $http.warehouseEmployee({
        warehouse_id: this.params.warehouse_id,
        role_id: roelId,
        ...this.warehouse_staff,
      }).then((res) => {
        this.warehouseEmployeeList = res.data.data;
        this.warehouse_staff.data_count = res.data.total;
      });
    },
    // 删除员工列表
    delEmployee(ids, roelId) {
      this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        $http.delWarehouseEmployee({ warehouse_id: this.params.warehouse_id, id: ids }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功',
          });
          this.getEmployee(roelId, this.name);
        });
      });
    },
    handleClose() {
      this.dialogVisible = false;
      this.warehouseEmployeeList = [];
      this.getList();
    },
    addStaff() {
      this.is_add_staff = true;
      this.getStffList();
    },
    // 获取新增仓库员工
    handleSelectionChange(row) {
      this.SelectEmployeeArr = [];
      row.forEach((item) => {
        this.SelectEmployeeArr.push(item.user_id);
      });
    },
    // 添加备用员工
    addSpareEmployee() {
      if (!this.SelectEmployeeArr.length) {
        this.$message({
          type: 'error',
          message: '您还没选择需要添加的员工',
        });
        return;
      }
      $http.addSpareEmployee({
        warehouse_id: this.params.warehouse_id,
        user_id: this.SelectEmployeeArr,
        role_id: this.role_id,
      }).then(() => {
        this.is_add_staff = false;
        this.backEmployeeList();
      });
    },
    // 返回员工列表
    backEmployeeList() {
      this.is_add_staff = false;
      this.staff_data = [];
      this.getEmployee(this.role_id, this.name);
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
.add_back {
  width: 100%;
  margin:  0 0 10px 0;
  text-align: right;
}
</style>
