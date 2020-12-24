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
          <div class="wechat-scan">{{ $t('wechatScanLogin') }}</div>
        </div>
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
        <div id="wx-qr-code-box" class="qr-code"></div>
        <div class="help">{{ $t('cantUse') }}</div>
        <div class="demonstration">
          <el-button @click="expLogin" type="primary" plain style="width: 200px">{{
            $t('demonstrationLogin')
          }}</el-button>
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
import WxLogin from 'WxLogin';
import $http from '@/api';
import mixin from '@/mixin/form_config';
import baseApi from '@/lib/axios/base_api';

export default {
  mixins: [mixin],
  data() {
    return {
      qr: '', // 登录二维码
      qr_key: '',
      timer: '',
      lang: '',
      wxLoginObj: {}
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
    this.getWeChatQR();
    this.timer = setInterval(() => {
      this.getWeChatQR();
    }, 240 * 1000);
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
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
    getWeChatQR() {
      $http.getLoginQR().then(res => {
        if (res.status) return;
        let state = btoa(baseApi.BASE_STATE);
        this.wxLoginObj = new WxLogin({
          id: 'wx-qr-code-box',
          appid: res.data.app_id,
          scope: 'snsapi_login',
          state,
          redirect_uri: res.data.callback_url,
          href: `${baseApi.BASE_URL}css/qrcode.css`
        });
      });
    }, // 获取微信二维码
    hadnlerLoginData(data) {
      this.$store.commit('token/addToken', data.data.token.token_value); // 将token保存到本地
      // 存入用户信息
      this.$store.commit('config/setWarehouseName', data.data.user.default_warehouse.name_cn);
      this.$store.commit('config/setWarehouseId', data.data.user.default_warehouse.id);
      this.$store.commit('config/updateUserInfo', data.data.user);
      // localStorage.setItem('setUser', data.data.user.id); // 存入用户 id
      // localStorage.setItem('setUModules', JSON.stringify(data.data.modules)); // 存入用户 昵称
      // localStorage.setItem('setUType', data.data.user.boss_id); // 存入员工标识 不为 0 则是员工类型
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
      .qr-code {
        height: 200px;
        overflow: hidden;
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
