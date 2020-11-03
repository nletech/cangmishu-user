<template>
  <div :class="$style.storeManage">
    <div :class="$style.main">
      <el-row>
        <!-- 添加员工组 -->
        <el-col :span="4" :offset="21">
          <el-button
            type="text"
            :class="$style.add_btn"
            @click="$router.push({ name: 'staffGroupAdd' })"
            icon="el-icon-plus"
          >
            {{ $t('staffGroupAdd') }}
          </el-button>
        </el-col>
      </el-row>
      <!-- 员工组数据表格 -->
      <el-table :data="staffGroupData" border>
        <!-- #序号 -->
        <el-table-column
          type="index"
          align="center"
          header-align="center"
          label="#"
          width="80"
        >
        </el-table-column>
        <!-- 员工组名称 -->
        <el-table-column
          prop="nickname"
          align="center"
          header-align="center"
          label="员工组名称"
        >
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <!-- 所属仓库 -->
        <el-table-column
          align="center"
          header-align="center"
          label="所属仓库"
          prop="warehouse.name_cn"
          width="120"
        >
        </el-table-column>
        <!-- 员工数 -->
        <el-table-column prop="staff_name" align="center" label="员工数">
          <template slot-scope="scope">
            {{ scope.row.user_amount }}
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          prop="staff_operations"
          header-align="center"
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
      <el-row>
        <el-col :span="2" :offset="22">
          <pagination-public
            :class="$style.pagination"
            :params="params"
            @changePage="handlerChangePage"
          >
          </pagination-public>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import MyGroup from '@/components/my_group';
import $http from '@/api';
import paginationPublic from '@/components/pagination-public';

export default {
  components: {
    MyGroup,
    paginationPublic
  },
  data() {
    return {
      staffGroupData: [], // 员工组列表信息
      params: {
        total: 0,
        currentPage: 1
      } // 分页数据
    };
  },
  mounted() {
    this.getList();
  },
  computed: {
    warehouseId() {
      return (
        this.$store.state.config.setWarehouseId ||
        +localStorage.getItem('warehouseId')
      );
    }
  },
  watch: {
    warehouseId() {
      this.getList();
    }
  },
  methods: {
    handlerChangePage(val) {
      $http
        .getStaffGroups({
          page: val
        })
        .then(res => {
          this.staffGroupData = res.data.data;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current_page;
        });
    },
    // 获取员工组列表数据
    getList() {
      // params 携带的当前页的和当前页显示数目的条数
      $http.getStaffGroups().then(res => {
        this.staffGroupData = res.data.data;
        this.params.total = res.data.total; // 页面总数
        this.params.currentPage = res.data.current_page;
      });
    },
    // 模块--基本信息
    handleBasicInfo(staffGroupInfo) {
      // 预处理 基本信息 模块需要的数据
      const copyInfo = {
        name: staffGroupInfo.name,
        remark: staffGroupInfo.remark,
        group_id: staffGroupInfo.id // 分组 ID
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
          groupId: staffGroupInfo.id
        }
      });
    },
    // 模块--查看员工
    showStaff(staffGroupInfo) {
      if (staffGroupInfo.warehouse_id === 0) {
        this.$message({
          type: 'error',
          message: '添加员工之前，请先配置权限!'
        });
        return;
      } // 如果员工组没有权限(即没有分配仓库), 则无法添加员工
      this.$router.push({
        name: 'staffGroupShowEmployee',
        query: {
          warehouse_id: staffGroupInfo.warehouse_id,
          groupId: staffGroupInfo.id
        }
      });
    },
    // 模块--权限
    handlePermissions(staffGroupInfo) {
      this.$router.push({
        name: 'staffGroupPermissions',
        params: {
          groupId: staffGroupInfo.id
        }
      });
    },
    // 模块--删除
    deleteStaffGroup(userInfo) {
      // 请求参数预处理
      const copyInfo = {
        group_id: userInfo.id // 分组 id
      };
      this.$confirm(this.$t('AcrionTips'), this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        $http.deleteStaffGroup(copyInfo.group_id).then(res => {
          if (res.status === 0) {
            this.$message({
              type: 'success',
              message: this.$t('success')
            });
            // 刷新数据列表
            $http.getStaffGroups(this.params).then(re => {
              this.staffGroupData = re.data.data;
              this.params.total = re.data.total; // 页面总数
            });
          }
        });
      });
    }
  }
};
</script>

<style lang="less" module>
.storeManage {
  margin: 20px 0 0 0;
  .main {
    width: @width;
    margin: 0 auto;
    .add_btn {
      display: inline-block;
      margin: 0 0 10px 0;
      font-size: 1.2rem;
    }
    .pagination {
      margin: 10px 0 0 0;
      float: right;
    }
  }
}
</style>
