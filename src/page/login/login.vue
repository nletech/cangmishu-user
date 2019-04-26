<template>
  <page-model>
    <el-form :rules="loginRules" ref="refelogin" :model="form" :class="$style.input_item">
      <el-form-item  class="login_model_form" prop="email">
        <el-input
        :placeholder="$t('PleaseEnterTheMailbox')"
        v-model="form.email"
        @keyup.enter.native="goLogin"
        size="small">
        </el-input>
      </el-form-item>
      <el-form-item :class="$style.item_password" class="login_model_form" prop="password">
        <el-input v-model="form.password"
        @keyup.enter.native="goLogin"
        :type="input_type ? 'password' : 'text'"
        :placeholder="$t('PleaseInputApassword')" size="small">
          <i slot="suffix"
           @click="input_type = !input_type"
           class="el-input__icon el-icon-view"></i>
        </el-input>
      </el-form-item>
      <el-form-item :class="$style.save_user_info">
        <div :class="$style.item_user_info">
          <div :class="$style.user_info_left" class="user_info_left">
              <el-checkbox v-model="keep">
                保存用户信息
              </el-checkbox>
          </div>
          <div :class="$style.user_info_right">
            <router-link :to="{name: 'backPassword'}">忘记密码</router-link>
          </div>
        </div>
      </el-form-item>
      <el-form-item class="user_login_button">
        <el-button type="primary"
        :loading="$store.state.config.button_loading"
        @click="goLogin">
        登录
        </el-button>
      </el-form-item>
    </el-form>
    <span slot="bottom_text" @click="$router.push({
      name: 'register'
    })">立即注册</span>
  </page-model>
</template>
<script>
import $http from '@/api';
import PageModel from './components/page_model';

export default {
  components: {
    PageModel,
  },
  data() {
    return {
      input_type: true, // 密码显示开关
      keep: false, // 保存用户信息开关
      form: {
        email: '', // 用户邮箱
        password: '', // 用户密码
      },
    };
  },
  computed: {
    loginRules() {
      return {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
        ], // 邮件
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码不能少于6个字符', trigger: 'blur' },
        ], // 密码
      };
    },
  },
  mounted() {
    this.form.email = localStorage.getItem('myEmail');
    this.form.password = localStorage.getItem('myPassword');
    if (!this.form.email || !this.form.password) {
      this.form.email = '';
      this.form.password = '';
    } else {
      this.keep = true;
    }
  },
  methods: {
    // 登陆
    goLogin() {
      if (this.keep) {
        localStorage.setItem('myEmail', this.form.email);
        localStorage.setItem('myPassword', this.form.password);
      } else {
        localStorage.setItem('myEmail', '');
        localStorage.setItem('myPassword', '');
      }
      // 获取到用户输入信息是否符合
      this.$refs.refelogin.validate((valid) => {
        if (!valid) return; // 如果不符合valied将等于false，则终止运行
        $http.login(this.form).then((res) => {
          if (res.status) return;
          // 将token保存到本地
          this.$store.commit('token/addToken', { token: res.data.token.token_value, keep: this.keep, id: res.data.token.id });
          this.$router.push({
            name: 'home',
          });
          this.$store.dispatch('token/getVipInfo');
        });
      });
    },
  },
};
</script>

<style module lang="less">
.input_item {
  margin-top: 10px;
  .item_password {
    margin-top: -8px;
  }
  .item_user_info {
    .item_password;
    display: flex;
    flex-flow: row wrap;
    .user_info_left {
      width: 50%;
    }
    .user_info_right {
      width: 50%;
      text-align: right;
      a {
        color: #606266;
        text-decoration: none;
      }
    }
  }
}
</style>
