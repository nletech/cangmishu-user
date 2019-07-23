<template>
  <div class="addressManagement">
      <div  :class="$style.addressManagement">
            <div  :class="$style.am_main">
                  <!-- 标签页 -->
                  <el-row>
                        <!-- 添加按钮 -->
                        <div :class="$style.am_operation_btn">
                          <span @click="dialogVisible = true;">
                            <i class="iconfont">&#xe618;</i>
                            {{'添加货品分类'}}
                          </span>
                        </div>
                        <!-- 列表信息-->
                        <el-table  :data="category_list"
                                   :class="$style.table_main"
                                   :fit = true
                                   border
                                   style="width: 100%">
                                   <el-table-column  label="#"
                                                    type="index"
                                                    header-align="center"
                                                    align="center">
                                   </el-table-column>
                                   <el-table-column  label="货品分类中文名"
                                                     prop="name_cn"
                                                     header-align="center"
                                                     align="center">
                                   </el-table-column>
                                   <el-table-column  label="货品分类外文名"
                                                    prop="name_en"
                                                    header-align="center"
                                                    align="center">
                                   </el-table-column>
                                   <el-table-column  label="SKU属性"
                                                     prop="need_expiration_date"
                                                     header-align="center"
                                                     align="center"
                                                     width="280px">
                                                     <template slot-scope="scope">
                                                              <el-tag type="success"
                                                                      size="medium"
                                                                      v-if="scope.row.need_expiration_date == 1">
                                                                      保质期
                                                              </el-tag>
                                                              <el-tag type="success"
                                                                      size="medium"
                                                                      v-if="scope.row.need_production_batch_number == 1">
                                                                      生产批次
                                                              </el-tag>
                                                              <el-tag type="success"
                                                                      size="medium"
                                                                      v-if="scope.row.need_best_before_date == 1">
                                                                      最佳食用期
                                                              </el-tag>
                                                     </template>
                                   </el-table-column>
                                   <el-table-column  label="是否启用"
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
                                                  label="操作">
                                                  <template slot-scope="scope">
                                                    <el-button size="mini"
                                                              @click="editCategory(scope.row)">
                                                              编辑
                                                    </el-button>
                                                    <el-button size="mini"
                                                              type="danger"
                                                              @click="delClassification(scope.row)">
                                                              删除
                                                    </el-button>
                                                  </template>
                                   </el-table-column>
                        </el-table>
                        <!-- 分页 -->
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
      <!-- 添加货品分类 -->
      <el-dialog  title="添加货品分类"
                  :visible.sync="dialogVisible"
                  @close="handlerClose"
                  width="40%">
                  <el-form  ref="form"
                            :rules="rules"
                            :model="category_info_add"
                            label-width="140px">
                            <el-form-item label="分类中文名:"
                                          style="width: 80%;"
                                          prop="name_cn">
                                          <el-input v-model="category_info_add.name_cn"></el-input>
                            </el-form-item>
                            <el-form-item label="分类英文名:"
                                          style="width: 80%;"
                                          prop="name_en">
                                          <el-input v-model="category_info_add.name_en"></el-input>
                            </el-form-item>
                            <el-form-item label="SKU属性:"
                                          prop="add_sku_property">
                                          <el-checkbox-group  v-model="add_sku_property"
                                                              @change="handleChangeCheckbox">
                                                              <el-checkbox label="保质期"></el-checkbox>
                                                              <el-checkbox label="生产批次"></el-checkbox>
                                                              <el-checkbox label="最佳食用期"></el-checkbox>
                                          </el-checkbox-group>
                            </el-form-item>
                            <el-form-item  label="是否启用"
                                           prop="is_enabled">
                                           <el-switch  v-model="category_info_add.is_enabled"
                                                       active-color="#13ce66"
                                                       active-value="1"
                                                       inactive-value="0"
                                                       inactive-color="#ccc">
                                           </el-switch>
                            </el-form-item>
                  </el-form>
                  <span  slot="footer"
                         class="dialog-footer">
                         <el-button type="primary" @click="submit_form">提 交</el-button>
                  </span>
      </el-dialog>
      <!-- 编辑货品分类 -->
      <el-dialog  title="编辑货品分类"
                  :visible.sync="editDialogVisible"
                  @close="handlerCloseEdit"
                  width="40%">
                  <el-form  ref="editForm"
                            :rules="rules"
                            :model="category_info_edit"
                            label-width="140px">
                            <el-form-item label="分类中文名:"
                                          style="width: 80%;"
                                          prop="name_cn">
                                          <el-input v-model="category_info_edit.name_cn"></el-input>
                            </el-form-item>
                            <el-form-item label="分类英文名:"
                                          style="width: 80%;"
                                          prop="name_en">
                                          <el-input v-model="category_info_edit.name_en"></el-input>
                            </el-form-item>
                            <el-form-item label="SKU属性:"
                                          prop="add_sku_property">
                                          <el-checkbox-group  v-model="edit_sku_property"
                                                              @change="handleChangeCheckboxEdit">
                                                              <el-checkbox label="保质期"></el-checkbox>
                                                              <el-checkbox label="生产批次"></el-checkbox>
                                                              <el-checkbox label="最佳食用期"></el-checkbox>
                                          </el-checkbox-group>
                            </el-form-item>
                            <el-form-item  label="是否启用"
                                           prop="is_enabled">
                                           <el-switch  v-model="category_info_edit.is_enabled"
                                                       active-color="#13ce66"
                                                       :active-value="1"
                                                       :inactive-value="0"
                                                       inactive-color="#ccc">
                                           </el-switch>
                           </el-form-item>
                  </el-form>
                  <span  slot="footer"
                         class="dialog-footer">
                         <el-button type="primary" @click="edit_submit_form">提 交</el-button>
                  </span>
      </el-dialog>
  </div>
</template>
<script>
import $http from '@/api';

export default {
  name: 'categoryManagement',
  data() {
    return {
      editDialogVisible: false, // 编辑弹窗
      category_info_edit: {
        name_cn: '', // 中文名
        name_en: '', // 英文名
        need_expiration_date: 0, // 是否保质期
        need_production_batch_number: 0, // 是否生产批次
        need_best_before_date: 0, // 是否最佳体验期
        is_enabled: '0', // 是否启用
      }, // 编辑分类
      category_info_add: {
        name_cn: '', // 中文名
        name_en: '', // 英文名
        is_enabled: '1', // 是否启用
      }, // 添加分类
      add_sku_property: [], // sku属性
      edit_sku_property: [], // 编辑 sku 属性
      check_list: ['保质期', '生产批次', '最佳食用期'], // 检测sku属性
      // =====
      dialogVisible: false, // 添加弹窗
      id: '', // 分类货品的id（编辑）
      rules: {
        name_cn: [
          { required: true, message: '请填写分类中文名', trigger: 'blur' },
        ],
        name_en: [
          { required: true, message: '请填写分类英文名', trigger: 'blur' },
        ],
      },
      //
      category_list: [], // 分类列表数据
      total: '', // 列表总条数
      currentPage: 1, // 当前页
      current_page: 1, // 编辑的当前页(当选中的信息不在第一页时)
    };
  },
  created() {
    this.get_category_list_data(); // 初始化列表数据
  },
  methods: {
    get_category_list_data() {
      $http.getCategoryManagement()
        .then((re) => {
          if (re.status) return;
          // console.log(re.data, 'data   getCategoryManagement');
          this.category_list = re.data.data;
          this.total = re.data.total;
        });
    }, // 获取货品分类信息
    handleChangeCheckbox(sku) {
      this.add_sku_property = [];
      this.add_sku_property = [...sku];
    },
    handleChangeCheckboxEdit(sku) {
      this.edit_sku_property = [];
      this.edit_sku_property = [...sku];
    },
    handlerClose() {
      this.add_sku_property = [];
      // eslint-disable-next-line
      for (const i in this.category_info_add) {
        this.category_info_add[i] = '';
        this.category_info_add.is_enabled = '1';
      }
      this.id = '';
    },
    handlerCloseEdit() {
      this.add_sku_property = [];
      // eslint-disable-next-line
      for (const i in this.category_info_edit) {
        this.category_info_edit[i] = '';
      }
      this.id = '';
    },
    editCategory(row) {
      this.editDialogVisible = true;
      this.category_info_edit.name_cn = row.name_cn;
      this.category_info_edit.name_en = row.name_en;
      this.category_info_edit.is_enabled = row.is_enabled;
      this.edit_sku_property = [];
      /* eslint-disable */
      for (const item in row) {
        if (String(item) === 'need_best_before_date' && row[item] === 1) {
          this.edit_sku_property.push('最佳食用期');
        }
        if (String(item) === 'need_expiration_date' && row[item] === 1) {
          this.edit_sku_property.push('保质期');
        }
        if (String(item) === 'need_production_batch_number' && row[item] === 1) {
          this.edit_sku_property.push('生产批次');
        }
      }
      this.id = row.id; // 用于编辑
    }, // 编辑信息按钮
    delClassification(row) {
      $http.deleteCategoryManagement(row.id)
        .then((re) => {
          if (re.status) return;
          this.get_category_list_data();
        });
    }, // 删除信息按钮
    submit_form() {
      this.$refs.form.validate((validate) => {
        if (!validate) return;
        let form_add = {};
        form_add.name_cn = this.category_info_add.name_cn;
        form_add.name_en = this.category_info_add.name_en;
        form_add.is_enabled = this.category_info_add.is_enabled || '1'; // 是否启用
        form_add.need_expiration_date = 0;
        form_add.need_production_batch_number = 0;
        form_add.need_best_before_date = 0;
        let arr = this.add_sku_property;
        for (let i = 0; i < arr.length; i += 1) {
          if (arr[i] === '保质期') {
            form_add.need_expiration_date = 1;
          }
          if (arr[i] === '生产批次') {
            form_add.need_production_batch_number = 1;
          }
          if (arr[i] === '最佳食用期') {
            form_add.need_best_before_date = 1;
          }
        }
        // 添加信息
        $http.addCategoryManagement(form_add)
          .then((re) => {
            if (re.status) return;
            this.$message({
              type: 'success',
              message: '添加成功',
            });
            this.id = ''; // 初始化编辑标志
            // 更新数据
            this.get_category_list_data();
          });
        // 编辑信息
        for (const item in this.category_info_add) {
          this.category_info_add[item] = '';
        } // 清空表单
        this.dialogVisible = false;
      });
    }, // 提交表单
    edit_submit_form() {
      this.$refs.editForm.validate((validate) => {
        if (!validate) return;
        let form_edit = {};
        form_edit.name_cn = this.category_info_edit.name_cn;
        form_edit.name_en = this.category_info_edit.name_en;
        form_edit.is_enabled = this.category_info_edit.is_enabled || 0; // 是否启用
        form_edit.need_expiration_date = 0;
        form_edit.need_production_batch_number = 0;
        form_edit.need_best_before_date = 0;
        let arr = this.edit_sku_property;
        for (let i = 0; i < arr.length; i += 1) {
          if (arr[i] === '保质期') {
            form_edit.need_expiration_date = 1;
          }
          if (arr[i] === '生产批次') {
            form_edit.need_production_batch_number = 1;
          }
          if (arr[i] === '最佳食用期') {
            form_edit.need_best_before_date = 1;
          }
        }
        if (+this.id) {
          form_edit.id = this.id; // 用于编辑
          $http.editCategoryManagement(this.id, form_edit)
            .then((re) => {
              if (re.status) return;
              this.$message({
                type: 'success',
                message: '修改成功',
              });
              // 更新数据
              this.handleCurrentChange(this.current_page);
            });
        }
        for (const item in this.category_info_edit) {
          this.category_info_edit[item] = '';
        } // 清空表单
        this.editDialogVisible = false;
      });
    }, // 编辑提交表单
    handleCurrentChange(val) {
      // 缓存当前页
      this.current_page = val;
      $http.checkCategoryManagement({ page: val })
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

