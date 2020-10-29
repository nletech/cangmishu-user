<template>
  <div class="modify-password">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="password-ruleForm"
    >
      <el-form-item label="旧密码" prop="old_password">
        <el-input
          v-model="ruleForm.old_password"
          type="password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="ruleForm.password"
          type="password"
          autocomplete="off"
        ></el-input>
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
  </div>
</template>
<script>
import $http from '@/api';

export default {
  name: 'modifyPassword',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        password: '',
        password_confirmation: '',
        old_password: '',
      },
      rules: {
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ],
        password_confirmation: [
          { required: true, validator: validatePass2, trigger: 'blur' },
        ],
        old_password: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    user_id() {
      return +localStorage.getItem('setUser');
    },
  },
  methods: {
    onConfirm() {
      this.$refs.ruleForm((valid) => {
        if (valid) {
          $http.modifyPsw(this.user_id, this.form)
            .then((res) => {
              if (res.status) return;
              this.$emit('update:visible', false);
              this.$message({
                type: 'success',
                message: this.$t('success'),
              });
            });
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.modify-password {
  .password-ruleForm {
    max-width: 500px;
  }
}
</style>
