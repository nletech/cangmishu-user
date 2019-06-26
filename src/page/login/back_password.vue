<template>
  <page-model title="找回密码" :lableIshow="false">
    <el-form :rules="registerRules" ref="refelogin" :model="form" :class="$style.input_item">
      <template v-if="this.$route.query.token">
        <el-form-item  class="login_model_form">
          <el-input
          placeholder="请输入密码"
          type="password"
          v-model="form.password"
          size="small">
          </el-input>
        </el-form-item>
        <el-form-item  class="login_model_form">
          <el-input
          placeholder="请再次输入密码"
          type="password"
          v-model="form.password_confirmation"
          size="small">
          </el-input>
        </el-form-item>
      </template>

      <el-form-item v-else  class="login_model_form" prop="email">
        <el-input
        placeholder="请输入邮箱"
        v-model="form.email"
        style="margin: 0 0 40px 0;"
        size="small">
        </el-input>
      </el-form-item>
      <el-form-item class="user_login_button">
        <el-button type="primary" @click="SendMail">{{buttonText}}</el-button>
      </el-form-item>
    </el-form>
    <span slot="bottom_text" style="position: relative; top: -260px;" @click="$router.push({ name: 'login' })">返回登录</span>
  </page-model>
</template>
<script>
import $http from '@/api';
import PageModel from './components/page_model';

export default {
  name: 'modifyPassword',
  components: {
    PageModel,
  },
  data() {
    return {
      form: {
        email: '', // 用户邮箱
        password: '', // 密码
        password_confirmation: '', // 重复密码
        token: this.$route.query.token,
      },
      registerRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    buttonText() {
      if (this.$route.query.token) {
        return '确认';
      }
      return '发送邮件';
    },
  },
  methods: {
    SendMail() {
      if (this.$route.query.token) {
        this.confirm();
        return;
      }
      $http.forgetPwd(this.form).then(() => {
        this.$notify({
          type: 'success',
          title: '操作成功',
          message: '邮件已发送，请查收',
        });
        this.$router.push({ name: 'login' });
      });
    },
    confirm() {
      $http.resetPwdEnd(this.form).then(() => {
        this.$router.push({ name: 'login' });
        this.$notify({
          type: 'success',
          title: '操作成功',
          message: '找回密码成功',
        });
      });
    },
  },
};
</script>

<style lang="less" module>
@import '../../less/public_variable.less';
.login_model_form {
  .el-input-group__append {
    border-color: @white;
    border-radius: 0;
    background: RGBA(87, 195, 138, 1);
    color: @white;
  }
}
</style>
