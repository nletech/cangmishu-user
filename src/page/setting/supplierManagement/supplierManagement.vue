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
              {{'添加供应商'}}
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
                            @click="delete_data(scope.row)">
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
      :title="this.id ? '编辑供应商' : '添加供应商 '"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form
        :rules="rules"
        ref="form"
        :model="distributor"
        label-width="140px">
        <el-form-item label="供应商中文名:"
                      prop="name_cn">
          <el-input v-model="distributor.name_cn"></el-input>
        </el-form-item>
        <el-form-item label="供应商英文名:"
                      prop="name_cn">
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
      id: '', // 供应商的id（编辑）
      rules: {
        name_cn: [
          { required: true, message: '供应商中文名', trigger: 'blur' },
        ],
        name_en: [
          { required: true, message: '供应商英文名', trigger: 'blur' },
        ],
      },
      //
      info_data: [], // 数据
      total: '', // 列表总条数
      currentPage: 1, // 当前页
    };
  },
  watch: {
    dialogVisible() {
      if (!this.dialogVisible) {
        this.distributor.name_cn = '';
        this.distributor.name_en = '';
        this.id = '';
      }
    },
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
      this.$refs.form.validate((validate) => {
        if (validate) {
          if (+this.id) {
            $http.editDistributor(this.id, this.distributor)
              .then((re) => {
                if (re.status) return;
                this.id = '';
                this.dialogVisible = false;
                // 更新数据
                this.get_distributor_data();
              })
              .catch(() => {});
          }
          $http.addDistributor(this.distributor)
            .then((re) => {
              if (re.status) return;
              this.dialogVisible = false;
              // 更新数据
              this.get_distributor_data();
            })
            .catch(() => {});
        }
      });
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
    edit(info) {
      this.dialogVisible = true;
      this.id = info.id;
      this.distributor.name_cn = info.name_cn;
      this.distributor.name_en = info.name_en;
    },
    delete_data(info) {
      $http.deleteDistributor(info.id)
        .then(() => {
          if (!status) {
            this.get_distributor_data();
          }
        })
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
      font-size: 1.2rem;
      background-color: #fff;
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

