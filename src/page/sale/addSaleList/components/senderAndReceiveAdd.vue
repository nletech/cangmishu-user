<template>
  <!--
  * 仓秘书免费开源WMS仓库管理系统+订货订单管理系统
  *
  * (c) Hunan NLE Network Technology Co., Ltd. <cangmishu.com>
  *
  * For the full copyright and license information, please view the LICENSE
  * file that was distributed with this source code.
  *
  -->
  <el-dialog
    :title="this.addressText === '发件人' ? $t('sender') : $t('receiver')"
    width="800px"
    @update:visible_add="$emit('update:visible_add', $event)"
    :before-close="handleClose"
    :visible="visible_add"
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
          style="width:100%;"
          :props="addressTagProps"
          :options="addressInfo"
          v-model="form.address"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item prop="addressDetail" :label="$t('addressDetial')" size="middle">
        <el-input type="textarea" v-model="form.addressDetail"> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="infoSubmit">
          {{ $t('submit') }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import $http from '@/api';
import Address from '@/assets/address.json';

export default {
  name: 'senderAndReceiveAdd',
  props: {
    visible_add: {
      type: Boolean,
      default: false
    },
    addressText: {
      type: String
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
      addressTagProps: {
        label: 'value', // json 数据的 value 属性对应联动组件的 label 属性
        value: 'label', // 选中之后拿到的值
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
  watch: {
    visible_add() {
      if (!this.visible_add) {
        this.form = {};
      }
    } // 清空数据
  },
  methods: {
    handleClose() {
      this.$emit('update:visible_add', false);
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
            $http.addSenderAddress(this.formInfo).then(res => {
              if (res.status) return;
              this.$emit('update:visible_add', false);
            });
          } else if (this.addressText === '收件人') {
            $http.addReceiverAddress(this.formInfo).then(res => {
              if (res.status) return;
              this.$emit('update:visible_add', false);
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="less" module>
.add_sender {
  margin: @margin;
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
  .submit_btn {
    background-color: @ThemeColor;
    color: #fff;
  }
}
</style>
