<template>
  <div class="addressManagement">
      <div  :class="$style.addressManagement">
            <div  :class="$style.am_main">
                  <!-- 标签页 -->
                  <el-row>
                        <!-- 添加按钮 -->
                        <div :class="$style.am_operation_btn">
                          <span @click="info_add_btn">
                            <i class="iconfont">&#xe618;</i>
                            {{'添加货品分类'}}
                          </span>
                        </div>
                        <!-- 列表信息-->
                        <el-table  :data="category_list_data"
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
      <!-- 添加分类信息 -->
      <el-dialog  :title="this.id ? '编辑分类信息' : '添加分类信息 '"
                  :visible.sync="dialogVisible"
                  width="40%">
                  <el-form  ref="form"
                            :rules="rules"
                            :model="category_info_form"
                            label-width="140px">
                            <el-form-item label="分类中文名:"
                                          style="width: 80%;"
                                          prop="name_cn">
                                          <el-input v-model="category_info_form.name_cn"></el-input>
                            </el-form-item>
                            <el-form-item label="分类英文名:"
                                          style="width: 80%;"
                                          prop="name_en">
                                          <el-input v-model="category_info_form.name_en"></el-input>
                            </el-form-item>
                            <el-form-item label="SKU属性:"
                                          prop="sku_property">
                                          <el-checkbox-group  v-model="sku_property">
                                                              <el-checkbox label="保质期"></el-checkbox>
                                                              <el-checkbox label="生产批次"></el-checkbox>
                                                              <el-checkbox label="最佳食用期"></el-checkbox>
                                          </el-checkbox-group>
                            </el-form-item>
                            <el-form-item  label="是否启用"
                                           prop="is_enabled">
                                           <el-switch  v-model="category_info_form.is_enabled"
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
  </div>
</template>
<script>
import $http from '@/api';

export default {
  name: 'categoryManagement',
  data() {
    return {
      category_info_form: {
        name_cn: '', // 中文名
        name_en: '', // 英文名
        need_expiration_date: 0, // 是否保质期
        need_production_batch_number: 0, // 是否生产批次
        need_best_before_date: 0, // 是否最佳体验期
        is_enabled: 0, // 是否启用
      },
      form_info: { // 表单提交预处理
        name_cn: '', // 中文名
        name_en: '', // 英文名
        need_expiration_date: 0, // 是否保质期
        need_production_batch_number: 0, // 是否生产批次
        need_best_before_date: 0, // 是否最佳体验期
        is_enabled: 0, // 是否启用
      },
      sku_property: [], // sku属性
      check_list: ['保质期', '生产批次', '最佳食用期'], // 检测sku属性
      // =====
      dialogVisible: false,
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
      category_list_data: [], // 分类列表数据
      total: '', // 列表总条数
      currentPage: 1, // 当前页
      current_page: 1, // 编辑的当前页(当选中的信息不在第一页时)
    };
  },
  created() {
    this.get_category_list_data(); // 初始化列表数据
  },
  methods: {
    info_add_btn() {
      this.sku_property = []; // 清空
      this.category_info_form = {}; // 清空
      this.dialogVisible = true; // 打开弹窗
    }, // 添加信息按钮
    editCategory(info) {
      this.dialogVisible = true;
      // 选中 sku属性
      /* eslint-disable */
      info.need_best_before_date === 1 // 最佳食用期
        ? this.sku_property.push('最佳食用期')
        : this.sku_property.push('');
      info.need_expiration_date === 1 // 保质期
        ? this.sku_property.push('保质期')
        : this.sku_property.push('');
      info.need_production_batch_number === 1 // 生产批次
        ? this.sku_property.push('生产批次')
        : this.sku_property.push('');
      this.category_info_form = info;
      this.category_info_form.is_enabled = `${info.is_enabled}`;
      this.id = info.id; // 用于编辑
    }, // 编辑信息按钮
    delClassification(info) {
      $http.deleteCategoryManagement(info.id)
        .then((re) => {
          if (re.status) return;
          this.get_category_list_data();
        })
        .catch(() => {});
    }, // 删除信息按钮
    get_category_list_data() {
      $http.getCategoryManagement()
        .then((re) => {
          if (re.status) return;
          console.log(re.data, 'data   getCategoryManagement');
          this.category_list_data = re.data.data;
          this.total = re.data.total;
        })
        .catch(() => {});
    }, // 获取货品分类信息
    submit_form() {
      this.$refs.form.validate((validate) => {
        if (validate) {
          // console.log(this.category_info_form.is_enabled, 'this.category_info_form.is_enabled');
          this.form_info.name_cn = this.category_info_form.name_cn;
          this.form_info.name_en = this.category_info_form.name_en;
          this.form_info.is_enabled = this.category_info_form.is_enabled || 0; // 是否启用
          const arr = this.sku_property;
          for (let i = 0; i < arr.length; i += 1) {
            if (arr[i] === '保质期') {
              this.form_info.need_expiration_date = 1;
            } else if (arr[i] === '生产批次') {
              this.form_info.need_production_batch_number = 1;
            } else if (arr[i] === '最佳食用期') {
              this.form_info.need_best_before_date = 1;
            }
          }
          console.log(this.form_info, 'form_info');
          this.$confirm('确认提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              if (+this.id) {
                this.form_info.id = this.id; // 用于编辑
                $http.editCategoryManagement(this.id, this.form_info)
                  .then((re) => {
                    if (re.status) return;
                    this.$message({
                      type: 'success',
                      message: '修改成功',
                    });
                    console.log('编辑');
                    this.id = '';
                    // 更新数据
                    this.handleCurrentChange(this.current_page);
                  })
                  .catch(() => {});
              } else {
                // 添加信息
                $http.addCategoryManagement(this.form_info)
                  .then((re) => {
                    if (re.status) return;
                    this.$message({
                      type: 'success',
                      message: '添加成功',
                    });
                    this.id = '';
                    // 更新数据
                    this.get_category_list_data();
                  })
                  .catch(() => {});
              }
            })
            .catch(() => {});
          // 编辑信息
          this.dialogVisible = false;
        }
      });
    }, // 提交表单
    handleCurrentChange(val) {
      // 缓存当前页
      this.current_page = val;
      $http.checkCategoryManagement({ page: val })
        .then((re) => {
          // console.log(re, '分页查询');
          this.category_list_data = re.data.data;
          this.total = re.data.total;
          this.currentPage = re.data.current_page;
        })
        .catch(() => {});
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

