<template>
  <div class="addressManagement">
      <div  :class="$style.addressManagement">
            <div  :class="$style.am_main">
                  <!-- 标签页 -->
                  <el-row>
                        <!-- 添加按钮 -->
                        <div :class="$style.am_operation_btn">
                          <span @click="addCategory()">
                            <i class="iconfont">&#xe618;</i>
                            添加货品分类
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
                                                              @click="delCategory(scope.row)">
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
      <!-- 编辑货品分类 -->
      <el-dialog  :title="getDailogTitle()"
                  :visible.sync="dialogVisible"
                  width="800">
                  <el-form  ref="editForm"
                            :rules="rules"
                            :model="model"
                            label-width="140px">
                    <h4>基本信息</h4>
                            <el-form-item label="分类中文名:"
                                          prop="name_cn">
                                <el-input v-model="model.name_cn" maxlength="10" show-word-limit></el-input>
                            </el-form-item>
                            <el-form-item label="分类英文名:"
                                          prop="name_en">
                                <el-input v-model="model.name_en" maxlength="20" show-word-limit></el-input>
                            </el-form-item>
                    <h4>选填项</h4>
                            <el-form-item label="保质期"
                                          prop="name_en">
                                <el-row>
                                    <el-switch v-model="model.need_expiration_date" :active-value="1" :inactive-value="0"></el-switch>
                                    <el-popover placement="right-start" title="保质期作用" width="300" trigger="hover"
                                    content="开启此选项,该分类下面所有货品上架都需要填写保质期,出库将按商品的保质期截止日期从近到远来出库">
                                    <el-button size="mini" type="text" slot="reference" icon="el-icon-question"></el-button>
                                    </el-popover>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="生产批次"
                                          prop="name_en">
                                <el-switch v-model="model.need_production_batch_number" :active-value="1" :inactive-value="0"></el-switch>
                                <el-popover placement="right-start" title="生产批次作用" width="300" trigger="hover"
                                    content="开启此选项,该分类下面所有货品上架都需要填写生产批次,方便出库时候查询到每次出库的批次信息">
                                    <el-button size="mini" type="text" slot="reference" icon="el-icon-question"></el-button>
                                </el-popover>
                            </el-form-item>
                            <el-form-item label="最佳食用期"
                                          prop="name_en">
                                <el-switch v-model="model.need_best_before_date" :active-value="1" :inactive-value="0"></el-switch>
                                <el-popover placement="right-start" title="最佳食用期作用" width="300" trigger="hover"
                                    content="开启此选项,该分类下面所有货品上架都需要填写最佳食用期,主要用于食品行业">
                                    <el-button size="mini" type="text" slot="reference" icon="el-icon-question"></el-button>
                                </el-popover>
                            </el-form-item>

                  </el-form>
                  <span  slot="footer"
                         class="dialog-footer">
                         <el-button type="primary" @click="subimtData">提 交</el-button>
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
      dialogVisible: false, // 显示弹窗
      dailogTitle: '新增',
      model: {
        id: 0,
        name_cn: '', // 中文名
        name_en: '', // 英文名
        need_expiration_date: 0, // 是否保质期
        need_production_batch_number: 0, // 是否生产批次
        need_best_before_date: 0, // 是否最佳体验期
        is_enabled: '0', // 是否启用
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
    },
    emptyData() { // 清空数据
      this.setData({
        id: 0,
        name_cn: '', // 中文名
        name_en: '', // 英文名
        need_expiration_date: 0, // 是否保质期
        need_production_batch_number: 0, // 是否生产批次
        need_best_before_date: 0, // 是否最佳体验期
      });
    },
    getDailogTitle() { // 得到标题
      return this.model.id === 0 ? '新增' : '修改';
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
      $http.getCategoryManagement()
        .then((re) => {
          if (re.status) return;
          // console.log(re.data, 'data   getCategoryManagement');
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

