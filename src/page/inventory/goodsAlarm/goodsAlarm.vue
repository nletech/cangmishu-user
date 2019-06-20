<template>
<div class="goodsAlarm">
      <mdoel-form>
        <el-form slot="left"
                 label-width="120px"
                 :rules="rules"
                 :model="form"
                 ref="form">
                 <!-- <el-form-item>
                              <el-row>
                                      <el-col :span="8">
                                              <el-input v-model="Search_Classification"
                                                        placeholder="请输入分类名"
                                                        size="small">
                                              </el-input>
                                      </el-col>
                                      <el-col :span="2">
                                              <el-button size="small"
                                                          @click="search_btn">
                                                          搜索
                                              </el-button>
                                      </el-col>
                              </el-row>
                 </el-form-item> -->
                <el-form-item :label="$t('warningEmail')"
                              prop="warning_email">
                              <el-row>
                                <el-col :span="8">
                                        <el-input v-model="form.warning_email"
                                                  placeholder="请输入报警邮箱"
                                                  size="small">
                                        </el-input>
                                </el-col>
                              </el-row>
                </el-form-item>
                <el-form-item label="最低默认库存">
                              <el-row>
                                      <el-col  :span="4">
                                               <el-input-number  :min="1"
                                                                 v-model="form.default_warning_stock"
                                                                  size="small">
                                               </el-input-number>
                                      </el-col>
                              </el-row>
                </el-form-item>
                <el-form-item>
                  <el-table  :data="stockList"
                             border style="width: 100%">
                            <el-table-column  type="index"
                                              width="55px;">
                            </el-table-column>
                            <!-- 货品分类名称 -->
                            <el-table-column  label="货品分类名称"
                                              prop="category.name_cn">
                            </el-table-column>
                            <!-- 最低库存 -->
                            <el-table-column label="最小库存"
                                              width="180px;">
                                              <template  slot-scope="scope">
                                                         <el-input-number  :min="1"
                                                                           size="small"
                                                                           v-model="scope.row.warning_stock">
                                                         </el-input-number>
                                              </template>
                            </el-table-column>
                  </el-table>
                </el-form-item>
                <el-form-item>
                              <el-button  @click="onStock"
                                          type="primary"
                                          :loading="$store.state.config.button_loading">
                                          保存
                              </el-button>
                </el-form-item>
        </el-form>
      </mdoel-form>
</div>
</template>

<script>
import MdoelForm from '@/components/form';
import mixin from '@/mixin/form_config';
import $http from '@/api';

export default {
  components: {
    MdoelForm,
  },
  mixins: [mixin],
  data() {
    return {
      form: {
        default_warning_stock: '',
        warning_email: '',
        warning_data: [],
      },
      stocks: {
        category_id: '', // 分类 id
        warning_stock: '', // 报警库存
      },
      stockList: [], // 预警表格
      rules: {
        warning_email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    this.Warning();
  },
  methods: {
    Warning() {
      $http.Warning()
        .then((res) => {
          if (res.status) return;
          this.stockList = res.data.warning_data;
          this.form.default_warning_stock = res.data.default_warning_stock;
          this.form.warning_email = res.data.warning_email;
          console.log(res, 'warning');
        });
    },
    search_btn() {
      //
    }, // 搜索货品分类
    onStock() {
      this.form.warning_data = [];
      this.stockList.forEach((item) => {
        this.form.warning_data.push({
          category_id: item.category_id,
          warning_stock: item.warning_stock,
        });
      });
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form, 'this.form');
          $http.addWarning(this.form).then(() => {
            this.$message({
              message: '修改成功',
              type: 'success',
            });
            this.Warning();
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.goodsAlarm {
  width: 95%;
  margin: 0 auto;
  .el-tabs__nav{
    transform: translateX(100%);
    width:100%;
    text-align:center;
    .el-tabs__item{
      width:50%;
    }
  }
}
.goodsAlarm {
  margin-left: 20px;
}
</style>
