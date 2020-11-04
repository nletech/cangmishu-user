<template>
  <el-dialog
    :title="title"
    width="800px"
    @update:visibleFlag="$emit('update:visibleFlag', $event)"
    :before-close="handleClose"
    :visible="visibleFlag"
  >
    <el-form
      :class="$style.staff_form"
      label-width="140px"
      size="middle"
      label-position="left"
      :model="form"
      ref="form"
      :rules="info_Verify_rules"
    >
      <el-form-item prop="full_name" :label="$t('name')" size="middle">
        <el-input v-model="form.full_name"></el-input>
      </el-form-item>
      <el-form-item prop="phone" :label="$t('phone')" size="middle">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item prop="address" :label="$t('SSQ')" size="middle">
        <el-cascader
          :props="props"
          :options="addressInfo"
          v-model="form.address"
          style="width: 100%;"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item prop="addressDetail" :label="$t('addressDetial')" size="middle">
        <el-input type="textarea" v-model="form.addressDetail"> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="infoSubmit">{{ $t('submit') }}</el-button>
      </el-form-item>
    </el-form>
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
      default: false
    },
    addressText: {
      type: String
    },
    row_data: {
      type: Object
    }
  },
  watch: {
    row_data() {
      this.form.full_name = this.row_data.fullname;
      this.form.phone = this.row_data.phone;
      this.form.address = [this.row_data.province, this.row_data.city, this.row_data.district];
      this.form.addressDetail = this.row_data.address;
    }
  },

  data() {
    // 自定义的验证规则
    const check = {
      full_name: (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('Pleasetypeinyourname')));
        } else {
          callback();
        }
      },
      phone: (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('PleaseEnterPhone')));
        } else {
          callback();
        }
      },
      address: (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('pleaseInputCity')));
        } else {
          callback();
        }
      },
      addressDetail: (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('Pleaseenteradetailedaddress')));
        } else {
          callback();
        }
      }
    };
    return {
      form: {
        full_name: '', // 姓名
        phone: '', // 电话
        address: [], // 地址
        addressDetail: '' // 详细地址
      },
      addressInfo: Address, // 选择地址联动
      props: {
        label: 'value', // json 数据的 value 属性对应联动组件的 label 属性
        value: 'value',
        children: 'children'
      },
      formInfo: {}, // 提交的表格
      info_Verify_rules: {
        // 表单输入验证提醒
        full_name: [{ validator: check.full_name, trigger: 'blur', required: true }],
        phone: [{ validator: check.phone, trigger: 'blur', required: true }],
        address: [{ type: Array, validator: check.address, trigger: 'blur', required: true }],
        addressDetail: [{ validator: check.addressDetail, trigger: 'blur', required: true }]
      }
    };
  },

  computed: {
    title() {
      if (this.addressText === '发件人') {
        return `${this.$t('edit')} ${this.$t('sender')}`;
      } else if (this.addressText === '收件人') {
        return `${this.$t('edit')} ${this.$t('receiver')}`;
      } else {
        return '';
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visibleFlag', false);
    },
    infoSubmit() {
      // 提交的表单信息处理
      /* eslint-disable */
      this.formInfo.fullname = this.form.full_name;
      this.formInfo.phone = this.form.phone;
      this.formInfo.province = this.form.address[0];
      this.formInfo.city = this.form.address[1];
      this.formInfo.district = this.form.address[2];
      this.formInfo.address = this.form.addressDetail;
      this.$refs.form.validate(validate => {
        if (validate) {
          if (this.addressText === '发件人') {
            $http.editSenderAddress(this.row_data.id, this.formInfo).then(res => {
              if (res.status) return;
              this.$emit('update:visibleFlag', false);
              this.$message({
                type: 'success',
                message: this.$t('success')
              });
            });
          } else if (this.addressText === '收件人') {
            $http.editReceiverAddress(this.row_data.id, this.formInfo).then(re => {
              if (re.status) return;
              this.$emit('update:visibleFlag', false);
              this.$message({
                type: 'success',
                message: this.$t('success')
              });
            });
          }
        }
      });
    },
    getEditData() {
      $http
        .getASenderAddress(this.$route.query.id, { warehouse_id: this.$route.query.warehouse_id })
        .then(res => {
          if (res.status) return;
          const data = res.data;
          /* eslint-disable */
          this.form.full_name = data.fullname; // 姓名
          this.form.phone = data.phone; // 电话
          this.form.address = [data.province, data.city, data.district]; // 地址
          this.form.addressDetail = data.address; // 详细地址
        });
    }
  }
};
</script>

<style lang="less" module>
.edit_sender {
  margin: 20px 0 10px 0;
  background-color: #fff !important;
  .staff_form {
    margin: 0 auto;
    background-color: white;
  }
  .staff_title {
    display: inline-block;
    margin: 10px 0 40px 0;
    font-size: 16px;
    font-weight: 400;
  }
  .submit_btn {
    background-color: @ThemeColor;
    color: #fff;
  }
}
</style>
