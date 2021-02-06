<template>
  <div class="login">
    <div class="login-main">
      <div class="left"></div>
      <div class="right">
        <div class="title-container">
          <div class="title">
            <img class="logo" src="../../assets/img/logo@2x.png" /><span>{{
              $t('SecretaryWarehouse')
            }}</span>
          </div>
          <div v-if="!whetherBindOldAccount" class="wechat-scan">{{ $t('wechatScanLogin') }}</div>
        </div>
        <div v-if="!whetherBindOldAccount" class="whether-bind-container">
          <div class="progress">
            <div class="item">
              <div class="point">1</div>
              <div class="text">{{ $t('openWechatScan') }}</div>
            </div>
            <div class="item">
              <div class="point">2</div>
              <div class="text">{{ $t('scanBelowQrcode') }}</div>
            </div>
            <div class="item">
              <div class="point">3</div>
              <div class="text">{{ $t('autoRegisterLogin') }}</div>
            </div>
          </div>
          <div class="whether-bind">
            <h3>登陆成功，是否和老账号进行绑定</h3>
            <el-button @click="cyclingViewWhetherScan(0)">不用了，此账号直接登录</el-button>
            <el-button @click="goTobindOldAccount">前往绑定老账号</el-button>
          </div>
          <div class="help">{{ $t('cantUse') }}</div>
          <div class="demonstration">
            <el-button @click="expLogin" type="primary" plain style="width: 200px">{{
              $t('demonstrationLogin')
            }}</el-button>
          </div>
        </div>
        <div v-if="whetherBindOldAccount" class="bind-old-account">
          <el-button
            type="primary"
            @click="backFirst"
            class="icon-back"
            icon="el-icon-back"
            circle
          ></el-button>
          <el-tabs stretch v-model="activeName" @tab-click="onTabsChange">
            <el-tab-pane label="绑定已有邮箱账户" name="email">
              <el-form ref="registerEmail" :model="form" :rules="rules" label-width="80px">
                <el-form-item :label="$t('email')" prop="email">
                  <el-input
                    v-model="form.email"
                    :placeholder="$t('PleaseFillInYourEmailAddress')"
                    size="small"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item :label="$t('password')" prop="password">
                  <el-input
                    v-model="form.password"
                    type="password"
                    :placeholder="$t('PleaseFillInYourPassword')"
                    size="small"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item class="login-button">
                  <el-button @click="cyclingViewWhetherScan(1)" type="primary">
                    {{ $t('confirm') }}
                  </el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="绑定已有公众号账户" name="qrcode">
              <el-image class="official-account-img" :src="officialAccountQrcode">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="translate" @click="handlerTranslate($event)">
        <span id="cn" :class="['translate_cn', lang === 'cn' ? 'translate_active' : '']">
          中文
        </span>
        |
        <span id="en" :class="['translate_en', lang === 'en' ? 'translate_active' : '']">
          English
        </span>
      </div>
      <div class="model_footer">
        <div class="footer_main">
          <span>Copyright © {{ year }} {{ $t('copyright') }} {{ version }} </span>
          <i class="footer_main_logo"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';

export default {
  mixins: [mixin],
  data() {
    return {
      qr: '', // 登录二维码
      qr_key: '',
      lang: '',
      whetherBindOldAccount: false,
      activeName: 'email',
      form: {
        type: 'email',
        email: '', // 用户邮箱
        password: '' // 密码
      },
      rules: {
        email: [{ required: true, tigger: 'bulr' }],
        password: [{ required: true, tigger: 'bulr' }]
      },
      officialAccountQrcode: '',
      officialAccountBindkey: '',
      timer: ''
    };
  },
  computed: {
    version() {
      return process.env.VUE_APP_VERSION;
    },
    year() {
      return new Date().getFullYear();
    },
    translate_lang() {
      return this.lang;
    }
  },
  created() {
    this.lang = localStorage.getItem('lang') || 'cn';
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    backFirst() {
      this.whetherBindOldAccount = false;
      clearInterval(this.timer);
      this.timer = null;
    },
    onTabsChange(val) {
      if (this.timer) return;
      if (val.name === 'qrcode') {
        this.getLoginOfficialAccountQrcode();
      }
    },
    goTobindOldAccount() {
      if (!this.timer && this.activeName === 'qrcode') {
        this.getLoginOfficialAccountQrcode();
      }
      this.whetherBindOldAccount = true;
    },
    cyclingViewWhetherScan(type) {
      // 状态 0  为直接登录
      // 状态 1  为绑定邮箱
      // 状态 2  为绑定扫码
      const params = {
        type,
        secret: this.$route.query.secret
      };
      if (type === 1) {
        params.email = this.form.email;
        params.password = this.form.password;
      } else if (type === 2) {
        params.bind_key = this.officialAccountBindkey;
      }
      $http
        .bindOfficialAccountQrcode(params)
        .then(res => {
          if (res.data && res.data.token) {
            clearInterval(this.timer);
            this.hadnlerLoginData(res);
          }
        })
        .catch(err => {
          console.log(err, 'err');
        });
    },
    getLoginOfficialAccountQrcode() {
      $http.getLoginOfficialAccountQrcode({ secret: this.$route.query.secret }).then(res => {
        if (res.data && res.data.url) {
          this.officialAccountQrcode = res.data.url;
          this.officialAccountBindkey = res.data.bind_key;
          this.timer = setInterval(() => {
            this.cyclingViewWhetherScan(2);
          }, 3000);
        }
      });
    },
    handlerTranslate(event) {
      switch (event.target.id) {
        case 'cn':
          this.lang = 'cn';
          this.$i18n.locale = 'cn';
          localStorage.setItem('lang', 'cn');
          break;
        case 'en':
          this.lang = 'en';
          this.$i18n.locale = 'en';
          localStorage.setItem('lang', 'en');
          break;
        default:
          break;
      }
    },
    hadnlerLoginData(data) {
      this.$store.commit('token/addToken', data.data.token.token_value); // 将token保存到本地
      // 存入用户信息
      const defaultWarehouse = data.data.user.default_warehouse || {};
      this.$store.commit('config/setWarehouseName', defaultWarehouse.name_cn);
      this.$store.commit('config/setWarehouseId', defaultWarehouse.id);
      this.$store.commit('config/updateUserInfo', data.data.user);
      this.$router.push({
        path: '/initPage/home'
      }); // 跳转到首页
    }, // 处理登录信息
    // 演示账号登录
    expLogin() {
      $http.expLogin().then(res => {
        this.hadnlerLoginData(res);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  background-color: #323232;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .login-main {
    display: flex;
    .left {
      width: 560px;
      height: 580px;
      background-image: url('../../assets/img/cangmishu-signin-bg.png');
      background-repeat: no-repeat;
      background-size: cover;
    }
    .right {
      width: 560px;
      background-color: #fff;
      text-align: center;
      padding: 30px;
      box-sizing: border-box;
      .whether-bind-container {
      }
      .bind-old-account {
        margin-top: 20px;
        .icon-back {
          margin: 0 0 0 auto;
          display: block;
        }
        .login-button {
          ::v-deep .el-form-item__content {
            text-align: left;
          }
          button {
            width: 150px;
          }
        }
        .official-account-img {
          width: 300px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          ::v-deep .el-icon-picture-outline {
            font-size: 40px;
          }
        }
      }
      .title-container {
        .title {
          color: #5745c5;
          font-size: 24px;
          span {
            vertical-align: middle;
          }
          .logo {
            width: 64px;
            height: 64px;
            vertical-align: middle;
          }
        }
        .wechat-scan {
          margin: 22px 0;
          font-size: 16px;
        }
      }
      .progress {
        display: flex;
        align-content: center;
        justify-content: space-between;
        .item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          .point {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #5745c5;
            color: #fff;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .text {
            width: 100px;
            color: #5745c5;
          }
          &:nth-child(2)::before,
          &:nth-child(3)::before {
            content: '';
            display: block;
            width: 164px;
            height: 1px;
            background-color: #d7d0ff;
            position: absolute;
            left: -131px;
            top: 9px;
          }
          &:nth-child(3)::before {
            width: 162px;
          }
        }
      }
      .whether-bind {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        button {
          width: 250px;
          margin: 15px 0;
        }
      }
      .help {
        margin: 20px 0;
      }
    }
  }
  .bottom {
    .translate {
      margin: 15px auto;
      height: 16px;
      line-height: 16px;
      text-align: center;
      font-size: 16px;
      color: #ccc;
      .translate_active {
        color: white;
      }
      .translate_cn {
        width: 40px;
        margin-right: 2px;
        cursor: pointer;
      }
      .translate_en {
        width: 40px;
        margin-left: 2px;
        cursor: pointer;
      }
    }
    .model_footer {
      width: 1432px;
      margin-top: 20px;
      text-align: center;
      color: white;
      .footer_main_logo {
        background-image: url('../../assets/img/homeLogin.png');
        display: inline-block;
        width: 72px;
        height: 15px;
        vertical-align: middle;
      }
    }
  }
}
</style>
