<template>
  <div :class="$style.page_model">
    <div :class="$style.model" v-if="!type">
      <div :class="$style.model_left">
        <div :class="$style.left_text">
          <p>{{$t('welcome')}}</p>
          <p>{{$t('NLEWarehouseManagementSystem')}}</p>
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
          <p :class="$style.register_text"><slot name="bottom_text"></slot></p>
        </div>
      </div>
    </div>
    <div :class="$style.model_success" v-else>
      <p :class="$style.model_title"> </p>
      <img src="../../../assets/img/gou.png" width="63px" height="49px">
      <p :class="$style.mail_sent_success">{{$t('MailSentSuccess')}}</p>
      <p :class="$style.mail_sent_text">{{$t('MailSentSuccesss')}}</p>
      <el-button
      @click="$router.push({name: 'login'})"
      type="primary" :class="$style.back_Login">
      {{$t('BackToLogin')}}
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '登录',
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
  name: 'login',
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
      width: 824px;
      height: 406px;
      display: flex;
      flex-flow: row wrap;
      position: absolute;
      top: 50%;
      background: @white;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      .model_left {
        width: 50%;
        height: 406px;
        overflow: hidden;
        background-image: url('../../../assets/img/bg.png');
        position: relative;
        .left_text {
          position: absolute;
          top: 40%;
          left: 30px;
          color: @white;
          transform: translateY(-40%);
          p:nth-child(1) {
            font-size: 1.5rem;
            font-weight: 100;
            margin: 0;
          }
          p:nth-child(2) {
            margin: 0;
            font-size: 2.25rem;
          }
        }
      }
      .model_right {
        position: relative;
        width: 50%;
        height: 406px;
        .right_title {
          text-indent: 26px;
          line-height: 24px;
          border-left: 8px solid @ThemeColor;
          margin-top: 15px;
          font-size: 1.125rem;
        }
        .form {
          padding: 25px;
          margin-top: 55px;
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
        font-size: 1.125rem;
        height: 20px;
        text-align: center;
        cursor: pointer;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  .model_success {
    width: 824px;
    height: 406px;
    position: absolute;
    top: 50%;
    background: @white;
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
  }
}
.user_login_button {
  margin-top: -5px;
  .el-button {
    width: 100%;
    font-size: 18px;
  }
}
</style>
