<template>
<div  :class="$style.storeManage">
      <wms-tags>
                <!-- 搜索框 -->
                <el-col :span="4" :offset="17">
                        <my-staff-search
                          @searchStaff="searchStaff"
                          @clearSearchContent="handleClearSearch"
                        ></my-staff-search>
                </el-col>
                <!-- 添加员工 -->
                <el-col :span="2" :offset="1">
                        <el-button  type="text"
                                    :class="$style.add_btn"
                                    @click="addStaffGroupMember"
                                    icon="el-icon-plus">
                                    {{$t('staffAdd')}}
                        </el-button>
                </el-col>
                <!-- 员工列表数据表格 -->
                <el-table  :data="staff_data"
                           border>
                <!-- #序号 -->
                  <el-table-column  type="index"
                                    align="center"
                                    header-align="center"
                                    label="#"
                                    width="70">
                  </el-table-column>
                <!-- 用户名 -->
                  <el-table-column  prop="nickname"
                                    align="center"
                                    header-align="center"
                                    label="用户名"
                                    width="120">
                                    <template slot-scope="scope">
                                              {{scope.row.nickname}}
                                    </template>
                  </el-table-column>
                  <!-- 姓名 -->
                  <el-table-column  prop="staff_name"
                                    align="center"
                                    header-align="center"
                                    label="姓名"
                                    width="120">
                                    <template slot-scope="scope">
                                              {{scope.row.name}}
                                    </template>
                  </el-table-column>
                  <!-- 邮箱 -->
                  <el-table-column  prop="staff_email"
                                    align="center"
                                    header-align="center"
                                    label="邮箱"
                                    width="300">
                                    <template slot-scope="scope">
                                              {{scope.row.email}}
                                    </template>
                  </el-table-column>
                  <!-- 手机号 -->
                  <el-table-column  prop="phone"
                                    align="center"
                                    header-align="center"
                                    label="手机号">
                                    <template slot-scope="scope">
                                              {{scope.row.phone}}
                                    </template>
                  </el-table-column>
                  <!-- 最后登陆时间 -->
                  <el-table-column  prop="last_login_at"
                                    align="center"
                                    header-align="center"
                                    label="最后登陆时间">
                                    <template slot-scope="scope">
                                              <i  class="el-icon-time"
                                                  v-show="Boolean(scope.row.last_login_at)">
                                              </i>
                                              <span>{{scope.row.last_login_at}}</span>
                                    </template>
                  </el-table-column>
                  <!-- 操作 -->
                  <el-table-column  prop="staff_operations"
                                    align="center"
                                    header-align="center"
                                    label="操作"
                                    width="240">
                                    <template slot-scope="scope">
                                              <el-button  type="danger"
                                                          plain
                                                          size="mini"
                                                          @click="deleteStaff(scope.row)">
                                                          移除
                                              </el-button>
                                    </template>
                  </el-table-column>
                </el-table>
                <button-pagination :pageParams="params"></button-pagination>
      </wms-tags>
</div>
</template>

<script>
import WmsTags from '@/components/wms_tags';
import $http from '@/api';
import buttonPagination from '@/components/pagination_and_buttons';
import getStaffGroupShowEmployeeList from '@/mixin/staffGroupShowEmployeeList';
import myStaffSearch from '@/components/my_staff_search'; // 搜索框

export default {
  components: {
    WmsTags,
    buttonPagination,
    myStaffSearch,
  },
  mixins: [getStaffGroupShowEmployeeList],
  data() {
    return {
      staff_data: [], // 员工列表信息
    };
  },
  computed: {
    warehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
  },
  methods: {
    // getStaffs() {
    //   //
    // }, // 获取该分组下的员工列表
    // 以上是重写
    // 监听搜索用户名清空事件
    handleClearSearch(val) {
      if (val) {
        this.getList();
      }
    },
    // 监听搜索用户名自定义事件
    searchStaff(data) {
      this.staff_data = data;
      this.params.data_count = 1;
    },
    // 获取员工列表
    getList() {
      // 获取该分组下的员工列表
      const info = {
        warehouse_id: this.warehouseId,
        group_id: this.$route.query.groupId,
      };
      $http.getThisGroupStaffs(info)
        .then((res) => {
          // 员工信息
          this.staff_data = res.data.data;
          this.params.data_count = res.data.total;
        });
    },
    deleteStaff(userInfo) {
      // 请求参数预处理
      const copyInfo = {
        group_id: Number(this.$route.query.groupId), // 分组 id
        user_id: userInfo.id,
      };
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          $http.deleteStaffInGroup(copyInfo)
            .then((res) => {
              // console.log(res);
              if (res.status === 0) {
                this.$message({
                  type: 'success',
                  message: '移除成功',
                });
                this.getList();
              }
            });
        });
    },
    // 添加员工
    addStaffGroupMember() {
      this.$router.push({
        name: 'staffGroupAddEmployee',
        query: {
          groupId: this.$route.query.groupId,
        },
      });
    },
  },
};
</script>

<style lang="less" module>
@import '../../../../less/public_variable.less';

.storeManage {
  .add_btn {
    font-size: 1.2rem;
  }
}
</style>
