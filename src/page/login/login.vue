<template>
        <page-model>
                    <el-form  ref="refelogin"
                              :model="form"
                              :rules="rules"
                              :class="$style.input_item">
                              <el-form-item  prop="email"
                                             class="login_model_form">
                                             <el-input  :placeholder="$t('PleaseEnterTheMailbox')"
                                                        clearable
                                                        v-model="form.email"
                                                        @keyup.enter.native="goLogin"
                                                        size="small">
                                             </el-input>
                              </el-form-item>
                              <el-form-item prop="password"
                                            :class="$style.item_password"
                                            class="login_model_form">
                                            <el-input  v-model="form.password"
                                                       @keyup.enter.native="goLogin"
                                                       :type="input_type ? 'password' : 'text'"
                                                       :placeholder="$t('PleaseInputApassword')" size="small">
                                                       <i  slot="suffix"
                                                           @click="input_type = !input_type"
                                                           class="el-input__icon el-icon-view">
                                                       </i>
                                            </el-input>
                              </el-form-item>
                              <el-form-item :class="$style.save_user_info">
                                            <div :class="$style.item_user_info">
                                                  <div :class="$style.user_info_left"
                                                       class="user_info_left">
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
                                            <el-button  type="primary"
                                                        :loading="isButtonLoading()"
                                                        @click="goLogin">
                                                        登录
                                            </el-button>
                              </el-form-item>
                              <el-form-item class="user_register_button">
                                            <el-button  @click="$router.push({name: 'register'})"
                                                        plain>
                                                        一步注册为用户
                                            </el-button>
                              </el-form-item>
                    </el-form>
        </page-model>
</template>
<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';
import PageModel from './components/page_model';

export default {
  mixins: [mixin],
  components: {
    PageModel,
  },
  data() {
    return {
      input_type: true, // 密码显示开关
      keep: false, // 保存用户信息开关
      rules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      },
      form: {
        email: '', // 用户邮箱
        password: '', // 用户密码
      },
    };
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
      // validate() 方法对填入的表单进行校验
      this.$refs.refelogin.validate((valid) => {
        if (!valid) return; // 验证不通过禁止发起请求
        $http.login(this.form)
          .then((res) => {
            if (res.status) return;
            // console.log(res, '登录信息');
            // 将token保存到本地
            this.$store.commit('token/addToken', {
              token: res.data.token.token_value,
              keep: this.keep,
              id: res.data.token.id,
            });
            // 存入用户信息
            this.$store.commit('config/setWarehouseName', res.data.user.default_warehouse.name_cn);
            this.$store.commit('config/setWarehouseId', res.data.user.default_warehouse.id);
            localStorage.setItem('setUser', res.data.user.id); // 存入用户 id
            localStorage.setItem('setUAvatar', res.data.user.avatar); // 存入用户 头像
            localStorage.setItem('setUnickName', res.data.user.nickname); // 存入用户 昵称
            localStorage.setItem('setUEmail', res.data.user.email); // 存入用户 昵称
            localStorage.setItem('setUModules', JSON.stringify(res.data.modules)); // 存入用户 昵称
            localStorage.setItem('setUType', res.data.user.boss_id); // 存入员工标识 不为 0 则是员工类型
            // 跳转到首页
            this.$router.push({
              name: 'home',
            });
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
