<template>
  <div class="addressManagement">
      <div  :class="$style.addressManagement">
          <div  :class="$style.am_main">
              <el-row>
                  <div :class="$style.am_operation_btn">
                      <span @click="addCategory()">
                        <i class="iconfont">&#xe618;</i>
                        {{$t('commodityClassificationManage')}}
                      </span>
                  </div>
                  <el-table
                      element-loading-text="loading"
                      v-loading="isButtonLoading()"
                      :data="category_list"
                      :class="$style.table_main"
                      :fit = true
                      border
                      style="width: 100%">
                      <el-table-column
                          label="#"
                          type="index"
                          header-align="center"
                          align="center">
                      </el-table-column>
                      <el-table-column
                          :label="$t('cnName')"
                          prop="name_cn"
                          header-align="center"
                          align="center">
                      </el-table-column>
                      <el-table-column
                          :label="$t('enName')"
                          v-if="isEnabledLangInput()"
                          prop="name_en"
                          header-align="center"
                          align="center">
                      </el-table-column>
                      <el-table-column
                          :label="$t('SKUProperty')"
                          prop="need_expiration_date"
                          header-align="center"
                          align="center"
                          width="280px">
                          <template slot-scope="scope">
                              <el-tag type="success"
                                      size="medium"
                                      v-if="scope.row.need_expiration_date == 1">
                                      {{$t('Expirydate')}}
                              </el-tag>
                              <el-tag type="success"
                                      size="medium"
                                      v-if="scope.row.need_production_batch_number == 1">
                                      {{$t('ProductionBatch')}}
                              </el-tag>
                              <el-tag type="success"
                                      size="medium"
                                      v-if="scope.row.need_best_before_date == 1">
                                      {{$t('bestUseTime')}}
                              </el-tag>
                          </template>
                      </el-table-column>
                      <el-table-column  :label="$t('WhetherToEnable')"
                                        header-align="center"
                                        align="center">
                                        <template slot-scope="scope">
                                                  <span v-if="scope.row.is_enabled==1">是</span>
                                                  <span v-if="scope.row.is_enabled==0">否</span>
                                        </template>
                      </el-table-column>
                      <el-table-column header-align="center"
                                    prop="address"
                                    width="180"
                                    :label="$t('opreation')">
                        <template slot-scope="scope">
                          <el-tooltip :content="$t('edit')" placement="top">
                            <el-button size="mini" icon="el-icon-edit" round @click="editCategory(scope.row)"></el-button>
                          </el-tooltip>
                          <el-tooltip :content="$t('delete')" placement="top">
                            <el-button  size="mini" icon="el-icon-delete" @click="delCategory(scope.row)" type="danger" round>
                            </el-button>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                  </el-table>
                  <el-pagination  :class="$style.pagination"
                                  v-show="+total"
                                  :page-size="10"
                                  @current-change="handleCurrentChange"
                                  :current-page="currentPage"
                                  layout="total, prev, pager, next, jumper"
                                  :total="+total">
                  </el-pagination>
              </el-row>
          </div>
    </div>
      <!-- 编辑货品分类 -->
      <el-dialog
          :title="getDailogTitle()"
          :visible.sync="dialogVisible"
          width="800">
          <el-form
              ref="editForm"
              :rules="rules"
              :model="model"
              label-width="140px">
            <h4>{{$t('Essentialformrmation')}}</h4>
                    <el-form-item :label="$t('categoryNameCN')"
                                  prop="name_cn">
                        <el-input v-model="model.name_cn" maxlength="10" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('categoryNameEN')"
                                  prop="name_en"  v-if="isEnabledLangInput()">
                        <el-input v-model="model.name_en" maxlength="20" show-word-limit></el-input>
                    </el-form-item>
            <h4>{{$t('notNecessaryInfo')}}</h4>
                <el-form-item :label="$t('Expirydate')"
                              prop="need_expiration_date">
                    <el-row>
                        <el-switch v-model="model.need_expiration_date" :active-value="1" :inactive-value="0"></el-switch>
                        <el-popover placement="right-start" :title="$t('Expirydate')" width="300" trigger="hover"
                        :content="$t('dateTips')">
                        <el-button size="mini" type="text" slot="reference" icon="el-icon-question"></el-button>
                        </el-popover>
                    </el-row>
                </el-form-item>
                <el-form-item :label="$t('ProductionBatch')"
                              prop="need_production_batch_number">
                    <el-switch v-model="model.need_production_batch_number" :active-value="1" :inactive-value="0"></el-switch>
                    <el-popover placement="right-start" :title="$t('ProductionBatch')" width="300" trigger="hover"
                        :content="$t('patchTips')">
                        <el-button size="mini" type="text" slot="reference" icon="el-icon-question"></el-button>
                    </el-popover>
                </el-form-item>
                <el-form-item :label="$t('bestUseTime')"
                              prop="need_best_before_date">
                    <el-switch v-model="model.need_best_before_date" :active-value="1" :inactive-value="0"></el-switch>
                    <el-popover placement="right-start" :title="$t('bestUseTime')" width="300" trigger="hover"
                        :content="$t('goodsTips')">
                        <el-button size="mini" type="text" slot="reference" icon="el-icon-question"></el-button>
                    </el-popover>
                </el-form-item>
                <el-form-item :label="$t('WhetherToEnable')"
                              prop="is_enabled">
                    <el-switch v-model="model.is_enabled" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
          </el-form>
          <span slot="footer"
                class="dialog-footer">
                <el-button type="primary" @click="subimtData">
                  {{$t('submit')}}
                </el-button>
          </span>
      </el-dialog>
  </div>
</template>
<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';

export default {
  name: 'categoryManagement',
  mixins: [mixin],
  data() {
    return {
      dialogVisible: false, // 显示弹窗
      model: {
        id: 0,
        name_cn: '', // 中文名
        name_en: '', // 英文名
        need_expiration_date: 0, // 是否保质期
        need_production_batch_number: 0, // 是否生产批次
        need_best_before_date: 0, // 是否最佳体验期
        is_enabled: 1, // 是否启用
        warehouse_id: this.warehouseId,
      }, // 编辑分类
      rules: {
        name_cn: [
          { required: true, message: '请填写分类中文名', trigger: 'blur' },
        ],
        name_en: [
          { required: true, message: '请填写分类英文名', trigger: 'blur' },
        ],
      },
      category_list: [], // 分类列表数据
      total: '', // 列表总条数
      currentPage: 1, // 当前页
      current_page: 1, // 编辑的当前页(当选中的信息不在第一页时)
    };
  },
  computed: {
    dailogTitle() {
      return this.$t('add');
    },
  },
  created() {
    this.loadData(); // 初始化列表数据
  },
  methods: {
    setData(model) { // 填充数据
      this.model.id = model.id;
      this.model.name_cn = model.name_cn;
      this.model.name_en = model.name_en;
      this.model.need_expiration_date = model.need_expiration_date;
      this.model.need_production_batch_number = model.need_production_batch_number;
      this.model.need_best_before_date = model.need_best_before_date;
      this.model.warehouse_id = model.warehouse_id;
      this.model.is_enabled = model.is_enabled;
    },
    emptyData() { // 清空数据
      this.setData({
        id: 0,
        name_cn: '', // 中文名
        name_en: '', // 英文名
        need_expiration_date: 0, // 是否保质期
        need_production_batch_number: 0, // 是否生产批次
        need_best_before_date: 0, // 是否最佳体验期
        warehouse_id: this.warehouseId,
        is_enabled: 1,
      });
    },
    getDailogTitle() { // 标题
      return this.model.id === 0 ? this.$t('add') : this.$t('edit');
    },
    getData() { // 填充数据
      return this.model;
    },
    addCategory() {
      this.dialogVisible = true;
      this.emptyData();
    },
    editCategory(row) {
      this.dialogVisible = true;
      this.setData(row);
    }, // 编辑信息按钮
    loadData() {
      this.emptyData();
      this.dialogVisible = false;
      $http.getCategoryManagement({ warehouse_id: this.warehouseId })
        .then((re) => {
          if (re.status) return;
          this.category_list = re.data.data;
          this.total = re.data.total;
        });
    },
    delCategory(row) {
      $http.deleteCategoryManagement(row.id)
        .then((re) => {
          if (re.status) return;
          this.loadData();
        });
    }, // 删除信息按钮
    subimtData() {
      this.$refs.editForm.validate((validate) => {
        if (!validate) return;
        const formData = this.getData();
        if (formData.id > 0) {
          // 修改信息
          $http.editCategoryManagement(formData.id, formData)
            .then((re) => {
              if (re.status) return;
              this.$message({
                type: 'success',
                message: '修改成功',
              });
              // 更新数据
              this.loadData();
            });
        } else {
          // 添加信息
          $http.addCategoryManagement(formData)
            .then((re) => {
              if (re.status) return;
              this.$message({
                type: 'success',
                message: '添加成功',
              });
              // 更新数据
              this.loadData();
            });
        }
      });
    }, // 提交表单
    handleCurrentChange(val) {
      // 缓存当前页
      this.current_page = val;
      $http.checkCategoryManagement({
        page: val,
        warehouse_id: this.warehouseId,
      })
        .then((res) => {
          this.category_list = res.data.data;
          this.total = res.data.total;
          this.currentPage = res.data.current_page;
        });
    }, // 分页查询--货品分类信息
  },
};
</script>
<style lang="less" module>
@import '../../../less/public_variable.less';

.addressManagement {
  margin: 50px 0 10px 0;
  .am_main {
    width: @width;
    margin: 0 auto;
    position: relative;
    background-color: #fff;
    .am_operation_btn {
      position: absolute;
      top: -30px;
      right: 10px;
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
