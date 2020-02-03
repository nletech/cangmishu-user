<template>
  <div :class="$style.page_model">
    <div :class="$style.model" v-if="!type">
      <div :class="$style.model_left">
        <div :class="$style.left_text">
          <p>{{$t('Welcome')}}</p>
          <p>{{$t('WelcomeText')}}</p>
        </div>
      </div>
      <div :class="$style.model_right">
        <div :class="$style.right_title">
          {{title}}
        </div>
        <div :class="$style.form">
          <label v-if="lableIshow" :class="$style.form_label">
            EMAIL
          </label>
          <slot></slot>
          <p :class="$style.register_text">
            <slot name="bottom_text"></slot>
          </p>
        </div>
      </div>
      <div :class="$style.translate" @click=handlerTranslate($event)>
        <span
          id="cn"
          :class="[
            $style.translate_cn,
            lang === 'cn' ? $style.translate_active: ''
          ]">
          中文
        </span>
        |
        <span
          id="en"
          :class="[
            $style.translate_en,
            lang === 'en' ? $style.translate_active: ''
          ]">
          English
          </span>
      </div>
      <div :class="$style.model_footer">
        <div :class="$style.footer_main">
          <span>Copyright © 2019，Hunan NLE Network Technolgy Co, Ltd</span>
          <i :class="$style.footer_main_logo"></i>
        </div>
      </div>
    </div>
    <div :class="$style.model_success" v-else>
      <p :class="$style.model_title"> </p>
      <img src="../../../assets/img/gou.png" width="63px" height="49px">
      <p :class="$style.mail_sent_success">{{$t('MailSentSuccess')}}</p>
      <p :class="$style.mail_sent_text">{{$t('MailSentSuccesss')}}</p>
      <el-button
        :class="$style.back_Login"
        type="primary"
        @click="$router.push({name: 'login'})"
      >
        {{$t('BackToLogin')}}
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',

  props: {
    title: {
      type: String,
    },
    type: {
      type: Boolean,
      default: false,
    },
    lableIshow: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
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
  },
};
</script>

<style lang="less" module>
  @import '../../../less/public_variable.less';
  .page_model {
    background: @loginColor;
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -1;
    .model {
      width: 1432px;
      height: 670px;
      display: flex;
      flex-flow: row wrap;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      background: @white;
      .model_left {
        width: 50%;
        height: 670px;
        overflow: hidden;
        background-image: url('../../../assets/img/bg1.jpg');
        position: relative;
        text-align: center;
        .left_text {
          position: absolute;
          top: 246px;
          left: 12%;
          text-align: left;
          color: @white;
          p:nth-child(1) {
            font-size: 3.42rem;
            font-weight: 100;
            margin: 0;
            font-family: PingFang-SC-Regular;
          }
          p:nth-child(2) {
            margin: 0;
            font-size: 1.71rem;
          }
        }
      }
      .model_right {
        position: relative;
        width: 50%;
        height: 670px;
        .right_title {
          width: 600px;
          font-size:24px;
          font-family:MicrosoftYaHei;
          font-weight:400;
          color:rgba(87,69,197,1);
          margin: 92px 400px 20px 180px;
        }
        .form {
          margin: 48px 181px 169px 178px;
          .form_label {
            color: @ThemeColor;
            font-size: 0.625rem;
          }
          i {
            cursor: pointer;
          }
        }
      }
      .register_text {
        color: @ThemeColor;
        font-size: 18px;
        height: 20px;
        text-align: center;
        cursor: pointer;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
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
        color: @white;
        .footer_main_logo {
          background-image: url('../../../assets/img/homeLogin.png');
          display: inline-block;
          width: 72px;
          height: 15px;
          vertical-align: middle;
        }
      }
      .model_footer_main {
        padding: 80px;
        font-size: 12px;
        color: #CACACA;
      }
      .mian_copyRight {
        text-align: left;
      }
      .main_tecSupport {
        display: inline-block;
        width: 60px;
        text-align: center;
      }
    }
  }
  .model_success {
    width: 824px;
    height: 406px;
    background: @white;
    position: absolute;
    top: 50%;
    left: 50%;
    text-align: center;
    transform: translateX(-50%) translateY(-50%);
    .model_title {
      font-size: 1.125rem;
      text-align: center;
      padding: 1.875rem 0 1rem 0;
    }
    .mail_sent_success {
      font-size: 1.5rem;
      color: @ThemeColor;
      font-weight: bold;
      margin: 0;
    }
    .mail_sent_text {
      width: 453px;
      height: 58px;
      margin: 20px auto;
      text-align: left;
      font-size: 0.8125rem;
      line-height: 24px;
    }
    .back_Login {
      width: 357px;
      height: 50px;
      font-size: 1.125rem;
    }
  }
</style>

<style lang="less">
@import '../../../less/public_variable.less';
.login_model_form {
  .el-input__inner {
    border-radius: 0;
    border-color:  @white @white #dcdfe6 @white;
    padding: 0 5px;
    border-top: none;// 隐藏 左 上 右 边框
    border-left: none;
    border-right: none;
  }
}
.user_login_button {
  margin-top: 27px;
  .el-button {
    width: 100%;
    font-size: 18px;
  }
}
.user_register_button {
  .el-button {
    width: 100%;
    font-size: 18px;
  }
}
</style>
