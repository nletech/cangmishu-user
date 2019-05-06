<template>
<div class="goodsAlarm">
  <!-- <el-tabs v-model="activeLabel">
    <el-tab-pane :label="$t('stockWarning')" name="1"> -->
      <mdoel-form>
        <el-form slot="left" label-width="120px" :rules="rules" :model="form" ref="form">
          <el-form-item :label="$t('warningEmail')">
            <el-input v-model="form.warning_email" size="small" style="width:250px"></el-input>
          </el-form-item>
          <el-form-item label="默认最低库存">
            <el-input-number
                    :min="1"
                    size="small"
                    style="width:250px"
                    v-model="form.default_warning_stock">
            </el-input-number>
          </el-form-item>
          <el-form-item>
            <el-table
            :data="stockList"
            border style="width: 100%">
              <el-table-column type="index" width="55px;">
              </el-table-column>
              <el-table-column :label="$t('categoryName')" prop="name_cn">
              </el-table-column>
              <el-table-column :label="$t('minStock')" width="180px;">
                <template slot-scope="scope">
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
            <el-button
              type="primary"
              @click="onStock('form')"
              :loading="$store.state.config.button_loading">保存</el-button>
            <!-- <el-button @click="$router.go(-1)">取消</el-button> -->
          </el-form-item>
        </el-form>
      </mdoel-form>
    <!-- </el-tab-pane>

    <el-tab-pane :label="$t('expirationWarning')" name="2">
      <mdoel-form>
        <el-form slot="left" label-width="120px" :rules="rules1" :model="form" ref="form">
          <el-form-item :label="$t('warningEmail')">
            <el-input v-model="form.warning_expiration_email" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-table
            :data="expirationList"
            border style="width: 100%">
              <el-table-column type="index" width="55px">
              </el-table-column>
              <el-table-column :label="$t('categoryName')" prop="name_cn">
              </el-table-column>
              <el-table-column label="最低离到期时间(天)" width="180px">
                <template slot-scope="scope">
                  <el-input-number
                    size="small"
                    v-model="scope.row.warning_expiration">
                  </el-input-number>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onExpiration"
              :loading="$store.state.config.button_loading">提交</el-button>
            <el-button @click="$router.go(-1)">取消</el-button>
          </el-form-item>
        </el-form>
      </mdoel-form>
    </el-tab-pane>
  </el-tabs> -->
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
      // expirationList: [],
      // activeLabel: '',
      rules: {
        warning_email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' },
        ],
      },
      // rules1: {
      //   warning_expiration_email: [
      //     { type: 'email', required: true, message: '请输入邮箱', trigger: 'blur' },
      //     { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' },
      //   ],
      // },
    };
  },
  created() {
    this.getStockWarn();
    // this.activeLabel = '1';
  },
  // watch: {
  //   activeLabel(newValue) {
  //     switch (newValue) {
  //       case '1':
  //         this.getStockWarn();
  //         break;
  //       case '2':
  //         this.getExpirationWarn();
  //         break;
  //       default:
  //         this.getStockWarn();
  //     }
  //   },
  // },
  methods: {
    // 获得库存预警
    getStockWarn() {
      $http.inventoryWarn().then((res) => {
        this.form = res.data.set_data;
        res.data.warning_data.forEach((item) => {
          if (item.usercategorywarning) {
            item.warning_stock = item.usercategorywarning.warning_stock;
            return;
          }
          item.warning_stock = res.data.set_data.default_warning_stock;
        });
        this.stockList = res.data.warning_data;
      });
    },
    // 拉取保质期报警
    // getExpirationWarn() {
    //   $http.expirationWarn().then((res) => {
    //     this.form = res.data.set_data;
    //     res.data.warning_data.forEach((item) => {
    //       if (item.userexpirationwarning) {
    //         item.warning_expiration = item.userexpirationwarning.warning_expiration;
    //         return;
    //       }
    //       item.warning_expiration = 1;
    //     });
    //     this.expirationList = res.data.warning_data;
    //   });
    // },
    // 编辑库存预警
    onStock(formName) {
      this.form.warning_data = [];
      // this.form.default_warning_stock = 10;
      this.stockList.forEach((item) => {
        this.form.warning_data.push({
          category_id: item.id,
          warning_stock: item.warning_stock,
        });
      });
      this.$refs[formName].validate((valid) => {
        if (valid) {
          $http.stockWarningAdd(this.form).then(() => {
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
      // $http.stockWarningAdd(this.form).then(() => {
      //   this.$message({
      //     message: '修改成功',
      //     type: 'success',
      //   });
      // });
    },
    // 编辑保质期预警
    // onExpiration() {
    //   this.form.warning_data = [];
    //   this.form.default_warning_expiration = 10;
    //   this.expirationList.forEach((item) => {
    //     this.form.warning_data.push({
    //       category_id: item.id,
    //       warning_expiration: item.warning_expiration,
    //     });
    //   });
    //   this.form.warning_email = this.form.warning_expiration_email;
    //   $http.expirationWarningAdd(this.form).then(() => {
    //     this.$message({
    //       message: '修改成功',
    //       type: 'success',
    //     });
    //   });
    // },
  },
};
</script>

 <style lang="less" module>
//  .goodsAlarm {
//    margin-left: 50px;
//  }
</style>

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

