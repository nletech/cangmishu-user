<template>
      <el-dialog  :title="`编辑${addressText}`"
                  width="80%"
                  :before-close="handleClose"
                  :visible.sync="visibleFlag">
                  <div  :class="$style.edit_sender">
                      <el-row :class="$style.am_main">
                              <el-col :span="10"
                                      :offset="6">
                                      <el-form  :class="$style.staff_form"
                                                label-width="140px"
                                                size="middle"
                                                label-position="left"
                                                :model="form"
                                                ref="form"
                                                :rules="info_Verify_rules">
                                        <el-form-item  prop="full_name"
                                                      label="姓名"
                                                      size="middle">
                                                      <el-input  v-model="form.full_name"></el-input>
                                        </el-form-item>
                                        <el-form-item  prop="phone"
                                                      label="电话"
                                                      size="middle">
                                                      <el-input  v-model="form.phone"></el-input>
                                        </el-form-item>
                                        <el-form-item  prop="address"
                                                      label="省市区"
                                                      size="middle">
                                                      <el-cascader  :props="props"
                                                                    :options="addressInfo"
                                                                    v-model="form.address"
                                                                    style="width: 260px;">
                                                      </el-cascader>
                                        </el-form-item>
                                        <el-form-item  prop="addressDetail"
                                                      label="详细地址"
                                                      size="middle">
                                                      <el-input  type="textarea"
                                                                  v-model="form.addressDetail">
                                                      </el-input>
                                        </el-form-item>
                                      </el-form>
                                      <el-row  :class="$style.submit_btn">
                                              <el-col  :span="2"
                                                        :offset="13">
                                                        <el-button  type="success"
                                                                    @click="infoSubmit">
                                                                    提交
                                                        </el-button>
                                              </el-col>
                                      </el-row>
                              </el-col>
                      </el-row>
                  </div>
      </el-dialog>
</template>

<script>
import $http from '@/api';
import Address from '@/assets/address.json';

export default {
  name: 'senderAndReceiverEdit',
  props: {
    visibleFlag: {
      type: Boolean,
      default: false,
    },
    addressText: {
      type: String,
    },
    row_data: {
      type: Object,
    },
  },
  watch: {
    visibleFlag() {
      console.log(this.visibleFlag, 'propvisi');
    },
    row_data() {
      this.form.full_name = this.row_data.fullname;
      this.form.phone = this.row_data.phone;
      this.form.address = [this.row_data.province, this.row_data.city, this.row_data.district];
      this.form.addressDetail = this.row_data.address;
    },
  },
  data() {
    // 自定义的验证规则
    const check = {
      full_name: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入姓名'));
        } else {
          callback();
        }
      },
      phone: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入电话'));
        } else {
          callback();
        }
      },
      address: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入省市区'));
        } else {
          callback();
        }
      },
      addressDetail: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入详细地址'));
        } else {
          callback();
        }
      },
    };
    return {
      form: {
        full_name: '', // 姓名
        phone: '', // 电话
        address: [], // 地址
        addressDetail: '', // 详细地址
      },
      addressInfo: Address, // 选择地址联动
      props: {
        label: 'value', // json 数据的 value 属性对应联动组件的 label 属性
        value: 'value',
        children: 'children',
      },
      formInfo: {}, // 提交的表格
      info_Verify_rules: { // 表单输入验证提醒
        full_name: [
          { validator: check.full_name, trigger: 'blur', required: true },
        ],
        phone: [
          { validator: check.phone, trigger: 'blur', required: true },
        ],
        address: [
          { type: Array, validator: check.address, trigger: 'blur', required: true },
        ],
        addressDetail: [
          { validator: check.addressDetail, trigger: 'blur', required: true },
        ],
      },
    };
  },
  methods: {
    handleClose() {
      this.$emit('update:visibleFlag', false);
    },
    infoSubmit() {
      // 提交的表单信息处理
      /* eslint-disable */
      this.formInfo.fullname = this.form.full_name;
      this.formInfo.phone     = this.form.phone;
      this.formInfo.province  = this.form.address[0];
      this.formInfo.city      = this.form.address[1];
      this.formInfo.district  = this.form.address[2];
      this.formInfo.address   = this.form.addressDetail;
      this.$refs.form.validate((validate) => {
        if (validate) {
          this.$confirm('确认提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              if (this.addressText === '发件人') {
                $http.editSenderAddress(this.row_data.id, this.formInfo)
                  .then((res) => {
                    if (res.status) return;
                    this.$emit('update:visibleFlag', false);
                  })
                  .catch(() => {});
              } else if (this.addressText === '收件人') {
                  $http.editReceiverAddress(this.row_data.id, this.formInfo)
                    .then((re) => {
                      if (re.status) return;
                      this.$emit('update:visibleFlag', false);
                    })
              }
            })
            .catch(() => {});
        }
      });
    },
    getEditData() {
      $http.getASenderAddress(this.$route.query.id, { warehouse_id: this.$route.query.warehouse_id })
        .then((res) => {
          if (res.status) return;
          const data = res.data;
          /* eslint-disable */
          this.form.full_name       = data.fullname; // 姓名
          this.form.phone           = data.phone; // 电话
          this.form.address         = [data.province, data.city, data.district]; // 地址
          this.form.addressDetail   = data.address; // 详细地址
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="less" module>
@import '../../../../less/public_variable.less';

  .edit_sender {
    margin: 20px 0 10px 0;
    background-color: #fff !important;
    .am_main {
      width: 90%;
      margin: 0 auto;
      position: relative;
      background-color: #fff;
      .am_operation_btn {
        position: absolute;
        top: 80px;
        right: 20px;
        z-index: 3;
        border: none;
        font-size: 1.2rem;
        color: @ThemeColor;
      }
    }
    .staff_form {
      width: 400px;
      height: 400px;
      margin: 0 auto;
      background-color: white;
    }
    .staff_title {
      display: inline-block;
      margin: 10px 0 40px 0;
      font-size: 16px;
      font-weight: 400;
    }
  }
</style>
