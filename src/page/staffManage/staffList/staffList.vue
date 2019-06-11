<template>
  <div>
    <wms-tags>
    <el-row>
      <!-- 搜索框 -->
      <el-col :span="4" :offset="17">
              <my-staff-search  @searchStaff="searchStaff"
                                @clearSearchContent="handleClearSearch">
              </my-staff-search>
      </el-col>
      <!-- 添加员工 -->
      <el-col   :span="2" :offset="1">
                <el-button  type="text"
                            @click="$router.push({name: 'staffAdd'})"
                            icon="el-icon-plus">
                            {{$t('staffAdd')}}
                </el-button>
      </el-col>
    </el-row>
      <!-- 员工列表数据表格 -->
      <el-table  :data="staff_data"
                 border>
                <!-- #序号 -->
                  <el-table-column  align="center"
                                    header-align="center"
                                    type="index"
                                    label="#"
                                    width="70">
                  </el-table-column>
                <!-- 用户名 -->
                  <el-table-column  align="center"
                                    header-align="center"
                                    prop="nickname"
                                    label="用户名"
                                    width="100">
                                    <template slot-scope="scope">
                                              <i  class="staffLock_icon"
                                                  v-show="scope.row.is_locked">
                                              </i>
                                              {{scope.row.nickname}}
                                    </template>
                  </el-table-column>
                  <!-- 姓名 -->
                  <el-table-column  align="center"
                                    header-align="center"
                                    prop="staff_name"
                                    label="姓名"
                                    width="100">
                                    <template  slot-scope="scope">
                                              {{scope.row.name}}
                                    </template>
                  </el-table-column>
                  <!-- 邮箱 -->
                  <el-table-column  align="center"
                                    header-align="center"
                                    prop="staff_email"
                                    label="邮箱"
                                    width="200">
                                    <template   slot-scope="scope">
                                                {{scope.row.email}}
                                    </template>
                  </el-table-column>
                  <!-- 手机号 -->
                  <el-table-column  align="center"
                                    header-align="center"
                                    prop="phone"
                                    label="手机号"
                                    width="160">
                                    <template slot-scope="scope">
                                              {{scope.row.phone}}
                                    </template>
                  </el-table-column>
                  <!-- 所属员工组 -->
                  <el-table-column  header-align="center"
                                    prop="groups"
                                    label="所属员工组">
                                    <template slot-scope="scope">
                                              <span  :class="$style.GroupName_title"
                                                    v-for="(item, index) in scope.row.groups"
                                                    :key="index">
                                                    {{ item.name }}
                                              </span>
                                    </template>
                  </el-table-column>
                  <!-- 最后登陆时间 -->
                  <el-table-column  align="center"
                                    header-align="center"
                                    prop="last_login_at"
                                    label="最后登陆时间"
                                    width="180">
                                    <template   slot-scope="scope">
                                                <i  class="el-icon-time"
                                                    v-show="Boolean(scope.row.last_login_at)">
                                                </i>
                                                <span>{{scope.row.last_login_at}}</span>
                                    </template>
                  </el-table-column>
                  <!-- 操作 -->
                  <el-table-column  header-align="center"
                                    prop="staff_operations"
                                    label="操作"
                                    width="240">
                                    <template slot-scope="scope">
                                              <el-button  type="primary"
                                                          style="
                                                            margin: 10px 0 2px 10px;
                                                            padding: 8px;
                                                          "
                                                          :class="$style.operation_btn"
                                                          plain
                                                          size="mini"
                                                          @click="edit_staff_info(scope.row)">
                                                          编辑资料
                                              </el-button>
                                              <el-button  type="success"
                                                          style="
                                                            margin: 10px 0 2px 10px;
                                                            padding: 8px;
                                                          "
                                                          plain
                                                          size="mini"
                                                          @click="modify_staff_psw(scope.row)">
                                                          修改密码
                                              </el-button>
                                              <!-- 禁止登录 -->
                                              <el-button  type="warning"
                                                          style="
                                                            margin: 10px 0 2px 10px;
                                                            padding: 8px;
                                                          "
                                                          plain
                                                          size="mini"
                                                          @click="forbid_staff_login(scope.row)">
                                                          {{scope.row.is_locked === 0 ? '禁止登录' : '允许登录'}}
                                              </el-button>
                                              <el-button  type="danger"
                                                          style="
                                                            margin: 10px 0 2px 10px;
                                                            padding: 8px;
                                                          "
                                                          plain
                                                          size="mini"
                                                          @click="delete_staff_account(scope.row)">
                                                          删除账号
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
import myStaffSearch from '@/components/my_staff_search/index'; // 搜索框
import $http from '@/api';
import buttonPagination from '@/components/pagination_and_buttons';
import getStaffList from '@/mixin/staffList';

export default {
  components: {
    WmsTags,
    buttonPagination,
    myStaffSearch,
  },
  mixins: [getStaffList],
  data() {
    return {
      staff_data: [], // 员工列表信息
    };
  },
  methods: {
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
      $http.getStaffs(this.params)
        .then((res) => {
          console.log(res, 'staffList');
          // 员工信息
          this.staff_data = res.data.data;
          this.params.data_count = res.data.total;
        })
        .catch(() => {
          console.log('get staffList_info error');
        });
    },
    // 模块--编辑资料
    edit_staff_info(userInfo) {
      // 复制需要提交的表单信息
      const copyUserInfo = {
        user_id: userInfo.id,
        nickname: userInfo.nickname,
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        remark: userInfo.remark,
      };
      // 将 copyUserInfo 的数据存入 localStorage
      for (const item in copyUserInfo) {
        if (Object.prototype.hasOwnProperty.call(copyUserInfo, item)) {
          // 存入对象和属性
          localStorage.setItem(item, copyUserInfo[item]);
        }
      }
      this.$router.push({
        name: 'editStaffData',
        params: {
          user_id: userInfo.id,
          userNickname: userInfo.nickname,
        },
      });
    },
    // 模块--修改密码
    modify_staff_psw(userInfo) {
      this.$router.push({
        name: 'modifyStaffPsw',
        params: {
          userId: userInfo.id,
        },
      });
    },
    // 模块--禁止登陆
    forbid_staff_login(userInfo) {
      // 锁标志取反
      userInfo.is_locked = !userInfo.is_locked;
      const forbidInfo = {
        lock: Number(userInfo.is_locked),
      };
      // 发送禁止登陆的状态
      $http.forbidStaff(userInfo.id, forbidInfo)
        .then((res) => {
          if (res.status === 0) {
            // 刷新员工列表数据
            $http.staffList()
              .then((re) => {
                // 员工信息
                this.staff_data = re.data.data;
              })
              .catch(() => {
                console.log('get staffList_info error');
              });
          }
        })
        .catch(() => { console.log('set forbidLogin error'); });
    },
    // 模块--删除账号
    delete_staff_account(userInfo) {
      const copyInfo = {
        user_id: userInfo.id,
      };
      this.$confirm('此操作将永久删除，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          $http.delStaff(copyInfo.user_id)
            .then((res) => {
              if (res.status === 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功',
                });
                // 刷新员工列表数据
                $http.staffList()
                  .then((re) => {
                    // 员工信息
                    this.staff_data = re.data.data;
                    this.params.data_count = res.data.total; // 更新分页
                  })
                  .catch(() => {
                    console.log('get staffList_info error');
                  });
              }
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '删除失败',
              });
              console.log('delete employee  error');
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
    },
  },
};
</script>

<style lang="less" module>
@import '../../../less/public_variable.less';
  .GroupName_title {
    display: inline-block;
    margin: 0 5px 0 0;
    padding: 2px;
    border: 1px solid #ccc;
  }
</style>
<style scoped>
  .staffLock_icon {
    display: inline-block;
    width: 12px;
    height: 12px;
    padding: 0 5px 0 0;
    content: url('../../../assets/img/staffLock.png');
  }
</style>

