<template>
<div class="storeManage">
  <wms-tags>
    <my-group>
      <!-- 添加员工组 -->
      <el-col :span="4" :offset="22">
        <el-button
          type="text"
          @click="$router.push({name: 'staffGroupAdd'})"
          icon="el-icon-plus"
        >
          {{$t('staffGroupAdd')}}
        </el-button>
      </el-col>
    </my-group>
    <!-- 员工组数据表格 -->
    <el-table
      :data="staffGroupData"
      border
    >
    <!-- #序号 -->
      <el-table-column
        align="center"
        header-align="center"
        type="index"
        label="#"
        width="120"
      >
      </el-table-column>
    <!-- 员工组名称 -->
      <el-table-column
        align="center"
        header-align="center"
        prop="nickname"
        label="员工组名称"
      >
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <!-- 员工数 -->
      <el-table-column
        align="center"
        prop="staff_name"
        label="员工数"
      >
        <template slot-scope="scope">
          {{scope.row.user_amount}}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        header-align="center"
        prop="staff_operations"
        label="操作"
        width="360"
      >
        <template slot-scope="scope">
          <!-- 基本信息 -->
          <el-button
            type="primary"
            plain
            size="mini"
            @click="handleBasicInfo(scope.row)"
          >
            基本信息
          </el-button>
          <!-- 限权 -->
          <el-button
            type="success"
            plain
            size="mini"
            @click="handlePermissions(scope.row)"
          >
            权限
          </el-button>
           <!-- 查看员工 -->
          <el-button
            type="danger"
            plain
            size="mini"
            @click="showStaff(scope.row)"
          >
            查看员工
          </el-button>
           <!-- 删除 -->
          <el-button
            type="danger"
            plain
            size="mini"
            @click="deleteStaffGroup(scope.row)"
          >
            删除
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
// buttonPagination 和 getStaffGroupList 是一起的
import buttonPagination from '@/components/pagination_and_buttons';
import getStaffGroupList from '@/mixin/staffGroupList';

export default {
  components: {
    WmsTags,
    MyInput,
    MyGroup,
    buttonPagination,
  },
  mixins: [getStaffGroupList],
  data() {
    return {
      staffGroupData: [], // 员工组列表信息
    };
  },
  methods: {
    // 获取员工组列表数据
    getList() {
      // params 携带的当前页的和当前页显示数目的条数
      $http.getStaffGroups(this.params)
        .then((res) => {
          console.log('员工列表');
          this.staffGroupData = res.data.data;
          this.params.data_count = res.data.total; // 页面总数
        })
        .catch(() => {
          console.log('获取员工数据出错');
        });
    },
    // 模块--基本信息
    handleBasicInfo(staffGroupInfo) {
      // 预处理 基本信息 模块需要的数据
      const copyInfo = {
        name: staffGroupInfo.name,
        remark: staffGroupInfo.remark,
        group_id: staffGroupInfo.id, // 分组 ID
      };
      // 将 copyInfo 的数据存入 localStorage
      for (const item in copyInfo) {
        if (Object.prototype.hasOwnProperty.call(copyInfo, item)) {
          // 存入对象和属性
          localStorage.setItem(item, copyInfo[item]);
        }
      }
      // 跳转到员工组基本信息
      this.$router.push({
        name: 'staffGroupBasicInfo',
        params: {
          groupId: staffGroupInfo.id,
        },
      });
    },
    // 模块--查看员工
    showStaff(staffGroupInfo) {
      this.$router.push({
        name: 'staffGroupShowEmployee',
        params: {
          groupId: staffGroupInfo.id,
        },
      });
    },
    // 模块--权限
    handlePermissions(staffGroupInfo) {
      this.$router.push({
        name: 'staffGroupPermissions',
        params: {
          groupId: staffGroupInfo.id,
        },
      });
    },
    // 模块--删除
    deleteStaffGroup(userInfo) {
      // 请求参数预处理
      const copyInfo = {
        group_id: userInfo.id, // 分组 id
      };
      this.$confirm('此操作将永久删除，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          $http.deleteStaffGroup(copyInfo.group_id)
            .then((res) => {
              if (res.status === 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功',
                });
                // 刷新数据列表
                $http.getStaffGroups(this.params)
                  .then((re) => {
                    this.staffGroupData = re.data.data;
                    this.params.data_count = re.data.total; // 页面总数
                  })
                  .catch(() => {
                  });
              }
            })
            .catch(() => {
              console.log('删除失败');
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

.util {
  text-align: right;
  margin: 20px;
}
</style>
