<template>
  <div class="addressManagement">
    <div :class="$style.addressManagement">
      <div :class="$style.am_main">
        <!-- 标签页 -->
        <el-row>
          <!-- 点击按键 -->
          <div :class="$style.am_operation_btn">
            <span @click="info_add_btn">
              <i class="iconfont">&#xe618;</i>
              {{`添加供应商`}}
            </span>
          </div>
        <!-- 对应的标签页内容 -->
          <el-table
            :class="$style.table_main"
            :data="info_data"
            border
          >
            <el-table-column
              header-align="center"
              align="center"
              type="index"
              width="80"
              label="#">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="name_cn"
              label="供应商中文名">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="name_en"
              label="供应商英文名">
            </el-table-column>
            <el-table-column
              header-align="center"
              width="240"
              label="操作">
              <template slot-scope="scope">
                <el-button size="mini"
                            @click="edit(scope.row)">
                            编辑
                </el-button>
                <el-button size="mini"
                            type="danger"
                            @click="delete(scope.row)">
                            删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :class="$style.pagination"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            layout="total, prev, pager, next, jumper"
            :total="+total"
          >
          </el-pagination>
        </el-row>
      </div>
    </div>
    <!-- 添加供应商 -->
    <el-dialog
      title="添加供应商"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="form" :model="distributor" label-width="100px">
        <el-form-item label="供应商中文名:">
          <el-input v-model="distributor.name_cn"></el-input>
        </el-form-item>
        <el-form-item label="供应商英文名:">
          <el-input v-model="distributor.name_en"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit_form">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import $http from '@/api';

export default {
  name: 'supplierManagement',
  data() {
    return {
      dialogVisible: false,
      distributor: {
        name_cn: '',
        name_en: '',
      },
      //
      info_data: [], // 数据
      total: '', // 列表总条数
      currentPage: 1, // 当前页
    };
  },
  methods: {
    get_distributor_data() {
      $http.getDistributor()
        .then((re) => {
          if (re.status) return;
          // console.log(re.data, 'data');
          this.info_data = re.data.data;
          this.total = re.data.total;
        })
        .catch(() => {});
    },
    submit_form() {
      $http.addDistributor(this.distributor)
        .then((re) => {
          if (re.status) return;
          this.dialogVisible = false;
        })
        .catch(() => {});
    },
    info_add_btn() {
      this.dialogVisible = true;
    }, // 添加信息按钮
    handleCurrentChange(val) {
      $http.checkDistributor({ page: val })
        .then((res) => {
          this.info_data = res.data.data;
        })
        .catch(() => {});
    }, // 分页查询
    edit() {},
    delete(id) {
      console.log(id, 'no');
      $http.deleteReceiver(id)
        .then(() => {})
        .catch(() => {});
    },
  },
  created() {
    this.get_distributor_data();
  },
};
</script>
<style lang="less" module>
@import '../../../less/public_variable.less';

.addressManagement {
  margin: 80px 0 10px 0;
  .am_main {
    width: 90%;
    margin: 0 auto;
    position: relative;
    background-color: #fff;
    .am_operation_btn {
      position: absolute;
      top: -40px;
      right: 20px;
      z-index: 3;
      border: none;
      font-size: 1.1rem;
    }
  }
}
</style>
<style lang="less">
  .addressManagement {
    .el-tabs__nav-scroll {
      .el-tabs__nav {
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
        // background-color: orange;
        float: none;
        .el-tabs__item {
          width: 50%;
          text-align: center;
          font-size: 1.2rem;
        }
      }
    }
    .el-tabs {
      .el-tabs__content {
        margin: 80px 0 0 0;
      }
    }
  }
  .el-pagination {
    margin: 20px 0 0 0;
    float: right;
  }
</style>

