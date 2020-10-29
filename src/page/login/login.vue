<template>
  <div class="login">
    <div class="login-main">
      <div class="left"></div>
      <div class="right">
        <div class="title-container">
          <div class="title">
            <img class="logo" src="../../assets/img/logo@2x.png" /><span
              >{{$t('SecretaryWarehouse')}}</span
            >
          </div>
          <div class="wechat-scan">{{$t('wechatScanLogin')}}</div>
        </div>
        <div class="progress">
          <div class="item">
            <div class="point">1</div>
            <div class="text">{{ $t("openWechatScan") }}</div>
          </div>
          <div class="item">
            <div class="point">2</div>
            <div class="text">{{ $t("scanBelowQrcode") }}</div>
          </div>
          <div class="item">
            <div class="point">3</div>
            <div class="text">{{ $t("autoRegisterLogin") }}</div>
          </div>
        </div>
        <div class="qr-code">
          <img :src="qr" class="qr-code-img" alt="" />
        </div>
        <div class="help">{{ $t("cantUse") }}</div>
        <div class="demonstration">
          <el-button
            @click="expLogin"
            type="primary"
            plain
            style="width: 200px"
            >{{ $t("demonstrationLogin") }}</el-button
          >
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="translate" @click="handlerTranslate($event)">
        <span
          id="cn"
          :class="['translate_cn', lang === 'cn' ? 'translate_active' : '']"
        >
          中文
        </span>
        |
        <span
          id="en"
          :class="['translate_en', lang === 'en' ? 'translate_active' : '']"
        >
          English
        </span>
      </div>
      <div class="model_footer">
        <div class="footer_main">
          <span>Copyright © 2019，Hunan NLE Network Technolgy Co, Ltd</span>
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
      timer: '',
      timer1: '',
      lang: '',
    };
  },
  computed: {
    translate_lang() {
      return this.lang;
    },
  },
  created() {
    this.lang = localStorage.getItem('lang') || 'cn';
    this.getWeChatQR();
    this.timer = setInterval(() => {
      this.getWeChatQR();
    }, 120 * 1000);
    this.timer1 = setInterval(() => {
      if (this.qr_key) {
        this.getQRChecked();
      }
    }, 2000);
  },
  destoryed() {
    clearInterval(this.timer);
    clearInterval(this.timer1);
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
    expLogin() {
      $http.expLogin().then((res) => {
        this.hadnlerLoginData(res);
      });
    },
  },
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
      background-image: url("../../assets/img/cangmishu-signin-bg.png");
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
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: #5745c5;
            color: #fff;
            margin-bottom: 5px;
          }
          .text {
            color: #5745c5;
          }
          &:nth-child(2)::before,
          &:nth-child(3)::before {
            content: "";
            display: block;
            width: 172px;
            height: 1px;
            background-color: #d7d0ff;
            position: absolute;
            left: -140px;
            top: 8px;
          }
          &:nth-child(3)::before {
            width: 165px;
          }
        }
      }
      .qr-code {
        .qr-code-img {
          display: inline-block;
          padding: 2px;
          margin: 10px;
          border: 1px solid #ccc;
          width: 200px;
          height: 200px;
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
        background-image: url("../../assets/img/homeLogin.png");
        display: inline-block;
        width: 72px;
        height: 15px;
        vertical-align: middle;
      }
    }
  }
}
</style>
