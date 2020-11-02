<template>
    <div class="addressManagement">
        <div :class="$style.addressManagement">
            <div :class="$style.am_main">
              <el-row>
                <div :class="$style.am_operation_btn">
                    <span @click="info_add_btn">
                      <i class="iconfont">&#xe618;</i>
                      {{$t('addsupplier')}}
                    </span>
                </div>
                <el-table
                    element-loading-text="loading"
                    v-loading="isButtonLoading"
                    :class="$style.table_main"
                    :data="info_data"
                    border>
                    <el-table-column  label="#"
                                      header-align="center"
                                      align="center"
                                      type="index"
                                      width="80">
                    </el-table-column>
                    <el-table-column  :label="$t('supplierNameCN')"
                                      header-align="center"
                                      align="center"
                                      prop="name_cn">
                    </el-table-column>
                    <!-- <el-table-column  label="供应商英文名"
                                      header-align="center"
                                      align="center"
                                      prop="name_en" v-if="isEnabledLangInput()">
                    </el-table-column> -->
                    <el-table-column
                        :label="$t('operation')"
                        header-align="center"
                        width="240">
                        <template
                            slot-scope="scope">
                            <el-button
                                size="mini"
                                @click="edit(scope.row)">
                                {{$t('edit')}}
                            </el-button>
                            <el-button
                                size="mini"
                                type="danger"
                                @click="delete_data(scope.row)">
                                {{$t('delete')}}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination  :class="$style.pagination"
                                v-show="+total"
                                @current-change="handleCurrentChange"
                                :current-page="currentPage"
                                layout="total, prev, pager, next, jumper"
                                :total="+total">
                </el-pagination>
              </el-row>
            </div>
        </div>
        <!-- 添加供应商 -->
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="30%">
            <el-form
                :rules="rules"
                ref="form"
                :model="distributor"
                label-position="left"
                :label-width="labelWidth">
                <el-form-item
                    prop="name_cn"
                    :label="$t('supplierNameCN')">
                    <el-input v-model="distributor.name_cn"></el-input>
                </el-form-item>
                <!-- <el-form-item
                    label="供应商英文名:">
                    <el-input v-model="distributor.name_en"></el-input>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">{{$t('cancel')}}</el-button>
                    <el-button type="primary" @click="submit_form">{{$t('confirm')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';

export default {
  name: 'supplierManagement',
  mixins: [mixin],
  data() {
    return {
      dialogVisible: false,
      distributor: {
        name_cn: '',
        // name_en: '',
      },
      id: '', // 供应商的id（编辑）
      rules: {
        name_cn: [
          { required: true, message: this.$t('Pleaseentersuppliername'), trigger: 'blur' },
        ],
      },
      //
      info_data: [], // 数据
      total: '', // 列表总条数
      currentPage: 1, // 当前页
      current_page: 1, // 编辑的当前页(当选中的信息不在第一页时)
      labelWidth: '120px',
    };
  },
  created() {
    this.get_distributor_data();
  },
  watch: {
    dialogVisible() {
      if (!this.dialogVisible) {
        this.distributor.name_cn = '';
        // this.distributor.name_en = '';
        this.id = '';
      }
    },
  },

  computed: {
    title() {
      const title = this.id ? this.$t('edit') : this.$t('add');
      return `${title} ${this.$t('supplier')}`;
    },
  },

  methods: {
    get_distributor_data() {
      $http.getDistributor({ warehouse_id: this.warehouseId })
        .then((res) => {
          if (res.status) return;
          this.info_data = res.data.data;
          this.total = res.data.total;
        });
    },
    submit_form() {
      this.$refs.form.validate((validate) => {
        this.distributor.warehouse_id = this.warehouseId;
        if (validate) {
          if (+this.id) { // 编辑信息
            $http.editDistributor(this.id, this.distributor)
              .then((re) => {
                if (re.status) return;
                this.id = '';
                this.dialogVisible = false;
                this.successTips(true, false);
                this.handleCurrentChange(this.current_page); // 更新数据
              });
          } else { // 添加信息
            $http.addDistributor(this.distributor)
              .then((re) => {
                if (re.status) return;
                this.dialogVisible = false;
                this.successTips(false, false);
                this.handleCurrentChange(this.current_page); // 更新数据
              });
          }
        }
      });
    },
    info_add_btn() {
      this.dialogVisible = true;
    }, // 添加信息按钮
    handleCurrentChange(val) {
      // 缓存当前页
      this.current_page = val;
      $http.checkDistributor({
        page: val,
        warehouse_id: this.warehouseId,
      })
        .then((res) => {
          this.info_data = res.data.data;
          this.total = res.data.total;
          this.current_page = res.data.current_page;
        });
    }, // 分页查询
    edit(info) {
      this.dialogVisible = true;
      this.id = info.id;
      this.distributor.name_cn = info.name_cn;
      // this.distributor.name_en = info.name_en;
    },
    delete_data(info) {
      this.$confirm(this.$t('AcrionTips'), this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning',
      }).then(() => {
        $http.deleteDistributor(info.id)
          .then(() => {
            if (!status) {
              this.$message({
                type: 'success',
                message: this.$t('success'),
              });
              this.handleCurrentChange(this.current_page); // 更新数据
            }
          });
      });
    },
  },
};
</script>
<style lang="less" module>


.addressManagement {
  .am_main {
    position: relative;
    background-color: #fff;
    .am_operation_btn {
      float: right;
      margin: 20px 0;
      z-index: 3;
      border: none;
      font-size: 1.2rem;
      color: @ThemeColor;
      cursor: pointer;
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

