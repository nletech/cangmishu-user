<template>
    <page-model :title="$t('log_in')">
        <el-tabs
            stretch
            v-model="activeName"
            style="position: relative; top: -40px;">
            <el-tab-pane label="账号密码" name="account">
                <el-form
                    ref="refelogin"
                    :model="form"
                    :rules="rules"
                    :class="$style.input_item">
                    <el-form-item
                        prop="email"
                        class="login_model_form">
                        <el-input  :placeholder="$t('PleaseEnterTheMailbox')"
                                  clearable
                                  v-model="form.email"
                                  @keyup.enter.native="goLogin"
                                  size="small">
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        prop="password"
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
                    <el-form-item
                        :class="$style.save_user_info">
                        <div :class="$style.item_user_info">
                              <div :class="$style.user_info_left">
                                    <el-checkbox v-model="keep">
                                      {{$t('AutoFill')}}
                                    </el-checkbox>
                              </div>
                              <div :class="$style.user_info_right">
                                    <router-link :to="{name: 'backPassword'}">
                                      {{$t('ForgetPassword')}}
                                    </router-link>
                              </div>
                        </div>
                    </el-form-item>
                    <el-form-item class="user_login_button">
                                  <el-button  type="primary"
                                              style="position: relative; margin-top: 30px;"
                                              @click="goLogin">
                                              {{$t('log_in')}}
                                  </el-button>
                    </el-form-item>
                    <el-form-item class="user_register_button">
                        <slot name="bottom_text">
                            <el-button
                                @click="$router.push({name: 'register'})"
                                type="text"
                                plain>
                                {{$t('register')}}
                            </el-button>
                        </slot>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="微信公众号(快捷)" name="wechat">
                <div style="text-align: center;">
                  <img style="display: inline-block; padding: 2px; margin: 10px; border: 1px solid #ccc;" width="200px" height="200px" :src="qr" alt="">
                  <span style="display: inline-block; font-size: 1.2rem;">无需注册，微信扫码关注公众号即可登录</span>
                </div>
                <div class="user_register_button" style="margin: 20px 0 0 0;">
                    <slot name="bottom_text">
                        <el-button
                            @click="$router.push({name: 'register'})"
                            type="text"
                            plain>
                            {{$t('register')}}
                        </el-button>
                    </slot>
                </div>
            </el-tab-pane>
        </el-tabs>
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
      qr: '', // 登录二维码
      qr_key: '',
      rules: {
        email: [
          { required: true, message: '请输入您的邮箱或电话号码', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      },
      form: {
        email: '', // 用户邮箱
        password: '', // 用户密码
      },
      activeName: 'account',
      timer: '',
      timer1: '',
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
    this.getWeChatQR(); // 初始化
  },
  destoryed() {
    clearInterval(this.timer);
    clearInterval(this.timer1);
  },
  watch: {
    activeName: {
      handler(val) {
        if (val === 'wechat') {
          this.timer = setInterval(() => {
            this.getWeChatQR();
          }, 120 * 1000);
          this.timer1 = setInterval(() => {
            this.getQRChecked();
          }, 2000);
        } else {
          clearInterval(this.timer);
          clearInterval(this.timer1);
        }
      },
      immediate: true,
    }, // 监听微信扫码登录
  },
  methods: {

    getWeChatQR() {
      $http.LoginQR()
        .then((res) => {
          if (res.status) return;
          this.qr = res.data.qr;
          this.qr_key = res.data.qr_key;
        });
    }, // 获取微信二维码

    getQRChecked() {
      $http.LoginQRCheck({ qr_key: this.qr_key })
        .then((res) => {
          if (res.status) return;
          if (res.data.is_valid) {
            this.hadnlerLoginData(res);
            clearInterval(this.timer);
            clearInterval(this.timer1);
          }
        });
    }, // 校验微信二维码

    hadnlerLoginData(data) {
      this.$store.commit('token/addToken', {
        token: data.data.token.token_value,
        keep: this.keep,
        id: data.data.token.id,
      }); // 将token保存到本地
      // 存入用户信息
      this.$store.commit('config/setWarehouseName', data.data.user.default_warehouse.name_cn);
      this.$store.commit('config/setWarehouseId', data.data.user.default_warehouse.id);
      this.$store.commit('config/setUserInfo', data.data.user.avatar);
      localStorage.setItem('setUser', data.data.user.id); // 存入用户 id
      localStorage.setItem('setUAvatar', data.data.user.avatar); // 存入用户 头像
      localStorage.setItem('setUnickName', data.data.user.nickname); // 存入用户 昵称
      localStorage.setItem('setUEmail', data.data.user.email); // 存入用户 昵称
      localStorage.setItem('setUModules', JSON.stringify(data.data.modules)); // 存入用户 昵称
      localStorage.setItem('setUType', data.data.user.boss_id); // 存入员工标识 不为 0 则是员工类型
      this.$router.push({
        name: 'home',
      }); // 跳转到首页
    }, // 处理登录信息

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
            this.hadnlerLoginData(res);
          });
      });
    }, // 邮箱手机登陆
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
