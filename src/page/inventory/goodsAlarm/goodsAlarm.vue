<template>
<div class="goodsAlarm">
      <mdoel-form>
        <el-form slot="left"
                 label-width="120px"
                 :rules="rules"
                 :model="form"
                 ref="form">
                <el-form-item :label="$t('warningEmail')">
                              <el-row>
                                <el-col :span="5">
                                        <el-input v-model="form.warning_email"
                                                  size="small"
                                                  style="width:250px">
                                        </el-input>
                                </el-col>
                                <el-col :span="5"
                                        :offset="10">
                                        <el-input v-model="form.warning_email"
                                                  size="mini"
                                                  style="width:250px">
                                        </el-input>
                                        <el-button size="mini" style="position: relative; top: -40px; right: -270px;">搜索</el-button>
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
                                              prop="name_cn">
                            </el-table-column>
                            <!-- 最低库存 -->
                            <el-table-column :label="$t('minStock')"
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
                  <el-button  @click="onStock('form')"
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
      },
      stockList: [], // 预警表格
      search_text: '', // 搜索按钮
      rules: {
        warning_email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    this.getStockWarn();
    this.getGoods();
  },
  methods: {
    // 获取货品分类名称列表
    getGoods() {
      $http.getCategoryManagement()
        .then((res) => {
          if (res.status) return;
          this.stockList = res.data.data;
        })
        .catch();
    },
    // 获得库存预警
    getStockWarn() {
      $http.getWarning()
        .then((res) => {
          console.log(res, 'getWarning');
          // this.stockList = res.data.warning_data;
        });
    },
    // 编辑库存预警
    onStock(formName) {
      this.form.warning_data = [];
      this.stockList.forEach((item) => {
        this.form.warning_data.push({
          category_id: item.id,
          warning_stock: item.warning_stock,
        });
      });
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form, 'this.form');
          $http.addWarning(this.form).then(() => {
            this.$message({
              message: '修改成功',
              type: 'success',
            });
          });
        } else {
          console.log('error submit!!');
          return false;
        }
        return true;
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
