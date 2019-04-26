<template>
  <page-model title="注册" :type="tips">
    <el-form :rules="registerRules" ref="refelogin" :model="form" :class="$style.input_item">
      <el-form-item  class="login_model_form" prop="email">
        <el-input placeholder="请输入您的邮箱" v-model="form.email" size="small">
        </el-input>
      </el-form-item>
      <el-form-item :class="$style.item_password" class="login_model_form" prop="password">
        <el-input type="password" placeholder="请输入您的密码" v-model="form.password" size="small">
        </el-input>
      </el-form-item>
      <el-form-item :class="$style.item_password" class="login_model_form" prop="password">
        <el-input
        type="password"
        placeholder="请确认您的密码"
        v-model="form.password_confirmation"
        size="small">
        </el-input>
      </el-form-item>
      <el-form-item class="user_login_button">
        <el-button type="primary" @click="goRegister">发送激活邮件</el-button>
      </el-form-item>
    </el-form>
    <span slot="bottom_text" @click="$router.go(-1)">返回登录</span>
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
      form: {
        email: '', // 用户邮箱
        password: '', // 密码
        password_confirmation: '', // 重复密码
      },
      tips: false,
      registerRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    goRegister() {
      $http.register(this.form).then(() => {
        this.tips = true;
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
