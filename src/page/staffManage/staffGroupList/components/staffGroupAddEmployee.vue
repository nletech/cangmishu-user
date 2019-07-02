<template>
        <div :class="$style.staffGroupAddEmployee_main">
              <wms-tags>
                        <!-- 搜索框 -->
                        <el-col  :span="4"
                                 :offset="17"
                                 :class="$style.search_box">
                                 <my-staff-search  @searchStaff="searchStaff"
                                                   @clearSearchContent="handleClearSearch"
                                                   :componentFlag = "componentName"
                                                   @clearComponentFlag = "handleComponentFlag">
                                 </my-staff-search>
                        </el-col>
                        <!-- 员工列表数据表格 -->
                        <el-table  :data="staff_data"
                                   border>
                                   <!-- #序号 -->
                                   <el-table-column  type="index"
                                                     label="#"
                                                     width="80"
                                                     align="center"
                                                     header-align="center">
                                   </el-table-column>
                                   <!-- 用户名 -->
                                   <el-table-column  prop="nickname"
                                                     label="用户名"
                                                     width="120"
                                                     align="center"
                                                     header-align="center">
                                                     <template slot-scope="scope">
                                                               {{scope.row.nickname}}
                                                     </template>
                                   </el-table-column>
                                   <!-- 姓名 -->
                                   <el-table-column  prop="staff_name"
                                                     label="姓名"
                                                     width="120"
                                                     align="center"
                                                     header-align="center">
                                                     <template slot-scope="scope">
                                                               {{scope.row.name}}
                                                     </template>
                                   </el-table-column>
                                   <!-- 邮箱 -->
                                   <el-table-column  prop="staff_email"
                                                     label="邮箱"
                                                     width="200"
                                                     align="center"
                                                     header-align="center">
                                                     <template  slot-scope="scope">
                                                                {{scope.row.email}}
                                                     </template>
                                   </el-table-column>
                                   <!-- 手机号 -->
                                   <el-table-column  prop="phone"
                                                     label="手机号"
                                                     align="center"
                                                     header-align="center">
                                                     <template slot-scope="scope">
                                                               {{scope.row.phone}}
                                                     </template>
                                   </el-table-column>
                                   <!-- 最后登录时间 -->
                                   <el-table-column  prop="last_login_at"
                                                     label="最后登录时间"
                                                     align="center"
                                                     header-align="center">
                                                     <template  slot-scope="scope">
                                                                <i  class="el-icon-time"
                                                                    v-show="Boolean(scope.row.last_login_at)">
                                                                </i>
                                                                <span>{{scope.row.last_login_at}}</span>
                                                     </template>
                                   </el-table-column>
                                   <!-- 操作 -->
                                   <el-table-column  prop="staff_operations"
                                                     label="操作"
                                                     width="240"
                                                     header-align="center">
                                                     <template slot-scope="scope">
                                                               <el-button  type="danger"
                                                                           plain
                                                                           size="mini"
                                                                           @click="addGroupEmployee(scope.row)">
                                                                           添加
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
import MyInput from '@/components/my_input';
import MyGroup from '@/components/my_group';
import $http from '@/api';
import buttonPagination from '@/components/pagination_and_buttons';
import getStaffList from '@/mixin/staffList';
import myStaffSearch from '@/components/my_staff_search'; // 搜索框

export default {
  components: {
    WmsTags,
    MyInput,
    MyGroup,
    buttonPagination,
    myStaffSearch,
  },
  mixins: [getStaffList],
  data() {
    return {
      staff_data: [], // 员工列表信息
      componentName: '', // 添加员工组件 (给复用组件的标识)
    };
  },
  mounted() {
    this.componentName = 'AddEmployee'; // 添加员工组件 (给复用组件的标识)
  },
  methods: {
    handleComponentFlag(val) {
      if (val) {
        this.getList();
      }
    },
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
    // 获取员工列表1
    getList() {
      // 去除组内已存在的员工
      this.params.rm = 1;
      this.params.group_id = this.$route.query.groupId;
      $http.getStaffs(this.params)
        .then((res) => {
          // 员工信息
          this.staff_data = res.data.data;
          this.params.data_count = res.data.total;
        });
    },
    // 提交员工添加
    addGroupEmployee(userInfo) {
      // 请求参数预处理
      const copyInfo = {
        group_id: Number(this.$route.query.groupId), // 分组 id
        user_id: userInfo.id, // 员工id
      };
      $http.addStaffTo(copyInfo)
        .then((res) => {
          if (res.status === 0) {
            this.$message({
              type: 'success',
              message: '添加成功',
            });
            this.$router.push({
              name: 'staffGroupShowEmployee',
              query: {
                groupId: this.$route.query.groupId,
              },
            });
            this.getList();
          }
        });
    },
  },
};
</script>

<style lang="less" module>
@import '../../../../less/public_variable.less';
.staffGroupAddEmployee_main {
  .search_box {
    margin: 0 0 8px 0;
  }
}
</style>
