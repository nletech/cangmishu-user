<template>
<div class="goodsAlarm">
    <mdoel-form>
      <el-form
          slot="left"
          label-width="120px"
          :rules="rules"
          :model="form"
          ref="form">
          <el-form-item
              :label="$t('warningEmail')"
              prop="warning_email">
              <el-row>
                <el-col
                    :span="8">
                    <el-input
                        v-model="form.warning_email"
                        :placeholder="$t('PleaseenterEmail')"
                        size="small">
                    </el-input>
                </el-col>
              </el-row>
          </el-form-item>
          <el-form-item :label="$t('categoryManagement')">
              <el-table
                  element-loading-text="loading"
                  v-loading="isButtonLoading"
                  :data="stockList"
                  border style="width: 100%">
                  <el-table-column
                      align="center" header-align="center"
                      type="index"
                      width="55px;">
                  </el-table-column>
                  <el-table-column
                      :label="$t('categoryName')"
                      align="center" header-align="center"
                      prop="name_cn">
                  </el-table-column>
                  <el-table-column
                      :label="$t('MinimumInventory')"
                      align="center" header-align="center"
                      width="180px;">
                      <template
                          slot-scope="scope">
                          <el-input-number
                              :min="1"
                              size="small"
                              v-model="scope.row.warning_stock">
                          </el-input-number>
                      </template>
                  </el-table-column>
              </el-table>
          </el-form-item>
          <el-form-item>
            <el-row>
                <el-col :span="2" :offset="10">
                    <el-button
                        @click="onSubmit"
                        type="primary"
                        :loading="isButtonLoading">
                        {{$t('save')}}
                    </el-button>
                </el-col>
            </el-row>
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
          { required: true, message: this.$t('EmailInput'), trigger: 'blur' },
          { type: 'email', message: this.$t('PleaseEnterTheContactEmails'), trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    this.Warning();
  },
  watch: {
    warehouseId() {
      this.Warning();
    },
  },
  methods: {
    Warning() {
      $http.Warning({ warehouse_id: this.warehouseId })
        .then((res) => {
          if (res.status) return;
          this.stockList = res.data.warning_data;
          this.form.warning_email = res.data.warning_email;
        });
    },
    onSubmit() {
      this.form.warning_data = [];
      this.stockList.forEach((item) => {
        this.form.warning_data.push({
          category_id: item.id,
          warning_stock: item.warning_stock,
        });
      });
      this.form.warehouse_id = this.warehouseId;
      this.$refs.form.validate((valid) => {
        if (valid) {
          $http.addWarning(this.form).then(() => {
            this.$message({
              message: this.$t('editSuccess'),
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
