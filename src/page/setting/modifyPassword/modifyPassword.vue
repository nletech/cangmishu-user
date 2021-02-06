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
  <div class="modify-password">
    <el-card class="box-card">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="password-ruleForm"
      >
        <el-form-item label="旧密码" prop="old_password">
          <el-input v-model="ruleForm.old_password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password_confirmation">
          <el-input
            v-model="ruleForm.password_confirmation"
            type="password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onConfirm">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import $http from '@/api';

export default {
  name: 'modifyPassword',
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    const minLength = {
      min: 6,
      max: 21,
      message: '最少输入6位数密码',
      trigger: 'blur'
    };
    return {
      ruleForm: {
        password: '',
        password_confirmation: '',
        old_password: ''
      },
      rules: {
        old_password: [{ required: true, message: '请输入旧密码', trigger: 'blur' }, minLength],
        password: [{ required: true, message: '请输入新密码', trigger: 'blur' }, minLength],
        password_confirmation: [
          { required: true, validator: validatePass2, trigger: 'blur' },
          minLength
        ]
      }
    };
  },
  methods: {
    onConfirm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          $http.modifyPsw(this.ruleForm).then(res => {
            if (res.status) return;
            this.$refs.ruleForm.resetFields();
            this.$message({
              type: 'success',
              message: this.$t('success')
            });
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.modify-password {
  .password-ruleForm {
    max-width: 500px;
  }
}
</style>
