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
  <page-model :title="$t('SetupNewPassword')" :lableIshow="false">
    <el-form :rules="registerRules" ref="refelogin" :model="form" :class="$style.input_item">
      <template v-if="this.$route.query.token">
        <el-form-item class="login_model_form">
          <el-input
            :placeholder="$t('inputPsw')"
            type="password"
            v-model="form.password"
            size="small"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="login_model_form">
          <el-input
            :placeholder="$t('PswAgain')"
            type="password"
            v-model="form.password_confirmation"
            size="small"
          >
          </el-input>
        </el-form-item>
      </template>

      <el-form-item v-else class="login_model_form" prop="email">
        <el-input
          :placeholder="$t('EmailInput')"
          v-model="form.email"
          style="margin: 0 0 40px 0;"
          size="small"
        >
        </el-input>
      </el-form-item>
      <el-form-item class="user_login_button">
        <el-button type="primary" @click="SendMail">{{ buttonText }}</el-button>
      </el-form-item>
    </el-form>
    <span
      slot="bottom_text"
      style="position: relative; top: -300px;"
      @click="$router.push({ name: 'login' })"
      >{{ $t('BackToLoginPage') }}</span
    >
  </page-model>
</template>
<script>
import $http from '@/api';
// import PageModel from './components/page_model';

export default {
  name: 'modifyPassword',
  components: {
    // PageModel,
  },
  data() {
    return {
      form: {
        email: '', // 用户邮箱
        password: '', // 密码
        password_confirmation: '', // 重复密码
        token: this.$route.query.token
      },
      registerRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    };
  },
  computed: {
    buttonText() {
      if (this.$route.query.token) {
        return this.$t('confirm');
      }
      return this.$t('SendEmail');
    }
  },
  methods: {
    SendMail() {
      if (this.$route.query.token) {
        this.confirm();
        return;
      }
      $http.forgetPwd(this.form).then(() => {
        this.$message({
          type: 'success',
          title: this.$t('success'),
          message: this.$t('Themailhasbeensent')
        });
        this.$router.push({ name: 'login' });
      });
    },
    confirm() {
      $http.resetPwdEnd(this.form).then(() => {
        this.$router.push({ name: 'login' });
        this.$message({
          type: 'success',
          message: this.$t('success')
        });
      });
    }
  }
};
</script>

<style lang="less" module>
.login_model_form {
  .el-input-group__append {
    border-color: @white;
    border-radius: 0;
    background: RGBA(87, 195, 138, 1);
    color: @white;
  }
}
</style>
