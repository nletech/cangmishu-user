<template>
  <page-model title="一步注册为用户" :type="tips">
    <!-- 注册表单 -->
    <el-form ref="refelogin" :model="form" :class="$style.input_item">
      <el-form-item
        :class="$style.item_email"
        class="login_model_form"
        prop="email"
      >
        <el-input
          placeholder="请输入您的邮箱"
          v-model="form.email"
          size="small"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        :class="$style.item_verificationCode"
        class="login_model_form"
        prop="verificationCode"
      >
        <el-input
          type="text"
          placeholder="请输入验证码"
          v-model="form.code"
          size="small"
        >
        </el-input>
      </el-form-item>
      <el-form-item :class="$style.item_password" class="login_model_form" prop="password">
        <el-input
          :type="input_type ? 'password' : 'text'"
          placeholder="请输入你的登陆密码"
          v-model="form.password"
          size="small"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        :class="$style.item_passwordConfirmation"
        class="login_model_form"
        prop="password_confirmation"
      >
        <el-input
          :type="input_type ? 'password' : 'text'"
          placeholder="请再次输入你的登陆密码"
          v-model="form.password_confirmation"
          size="small"
        >
        <i
          slot="suffix"
          @click="input_type = !input_type"
          class="el-input__icon el-icon-view"
        >
        </i>
        </el-input>
      </el-form-item>
      <el-form-item
        :class="$style.item_warehouseName"
        class="login_model_form"
        prop="warehouse_name"
      >
        <el-input
          type="text"
          placeholder="请输入仓库名称"
          v-model="form.warehouse_name"
          size="small"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        :class="$style.item_warehouseSpace"
        class="login_model_form"
        prop="warehouse_area"
      >
        <el-input
          type="text"
          placeholder="请输入仓库面积"
          v-model="form.warehouse_area"
          size="small"
        >
        </el-input>
      </el-form-item>
      <span class="warehouseSpaece_desc">
        平方米
      </span>
      <el-form-item :class="$style.save_user_info">
        <div :class="$style.item_user_info">
              <el-checkbox v-model="keep">
                <p>我同意<span>用户协议</span></p>
              </el-checkbox>
        </div>
      </el-form-item>
      <el-form-item class="user_login_button">
        <el-button
          type="primary"
          @click="goRegister"
        >
          注册
        </el-button>
      </el-form-item>
      <div class="user_account_exist"
        @click="$router.push({name: 'login'})"
      >
        我有账号
      </div>
      <span
        class="sendVerifCode"
        @click="flag && sendVerificationCode()"
      >
        {{sendVerCode}}
      </span>
    </el-form>
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
      keep: false, // 同意用户协议 默认为 true
      sendVerCode: '发送验证码',
      flag: true, // 禁用发送验证码标志，默认为 true
      form: {
        email: '', // 用户邮箱
        code: '', // 验证码
        password: '', // 密码
        warehouse_name: '', // 仓库名称
        warehouse_area: '', // 仓库面积
        password_confirmation: '', // 重复密码
      },
      tips: false,
    };
  },
  methods: {
    // 登陆
    goRegister() {
      $http.register(this.form)
        .then(() => {
          this.$message({
            type: 'success',
            message: '注册成功!',
          });
          // 跳转到登陆页
          this.$router.replace({
            name: 'login',
          });
          // this.tips = true;
        })
        .catch(() => {
          console.log('表单请求错误');
        });
    },
    /**
     * 发送验证码
     * 大致思路：
     * post表单请求,获取响应之后判断 status值，然后进行定时操作
     */
    sendVerificationCode() {
      $http.getVerificationCode(this.form)
        .then((res) => {
          // 计时函数
          function timer60s(that) {
            // 进入定时阶段，无法响应点击事件
            that.flag = false;
            // 定时 60s
            let time = 60;
            // eslint-disable-next-line
            let timer = null;
            timer = setInterval(() => {
              time -= 1;
              // 实时文字显示
              that.$data.sendVerCode = `${time}s 后，重新获取`;
              if (time === 0) {
                // 计时完毕,清除定时器
                clearInterval(timer);
                // 开放点击事件
                that.flag = true;
                // 更新显示文字
                that.$data.sendVerCode = '发送验证码';
              }
            }, 1000);
          }
          // 验证码发送成功
          if (res.status === 0) {
            // 开始计时
            const that = this;
            timer60s(that);
          }
        })
        .catch(() => {
          console.log('邮箱不能为空');
        });
    },
  },
};
</script>
<style module lang="less">
.input_item {
  margin-top: 10px;
  .item_email {
    margin-top: -8px;
  }
  .item_verificationCode {
    margin-top: -8px;
  }
  .item_password {
    margin-top: -8px;
  }
  .item_passwordConfirmation {
    margin-top: -8px;
  }
  .item_warehouseName {
    margin-top: -8px;
  }
  .item_warehouseSpace {
    margin-top: -8px;
  }
  .item_user_info {
    .item_password;
      display: flex;
      flex-flow: row wrap;
  }
}

</style>
<style lang="less">
.user_account_exist {
  font-size: 18px;
  color: #5745C5;
  width: 100%;
  text-align: center;
  font-weight:400;
  line-height:24px;
  cursor: pointer;
}
.sendVerifCode {
  font-size: 16px;
  color: #27B738;
  position: absolute;
  top: 26%;
  right: 25%;
  z-index: 2;
  cursor: pointer;
}
.warehouseSpaece_desc {
  font-size: 16px;
  color: #333333;
  line-height:24px;
  position: absolute;
  top: 66%;
  right: 25%;
}
</style>
