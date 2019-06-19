<template>
  <page-model title="一步注册为用户" :type="tips">
              <!-- 注册表单 -->
              <el-form ref="register"
                      :model="form"
                      :rules="rules"
                      :class="$style.input_item">
                      <el-form-item  prop="email"
                                    :class="$style.item_email"
                                    class="login_model_form">
                                    <el-input  placeholder="请输入邮箱"
                                                v-model="form.email"
                                                size="small">
                                    </el-input>
                      </el-form-item>
                      <el-form-item  prop="verificationCode"
                                     :class="$style.item_verificationCode"
                                     class="login_model_form">
                        <el-input  v-model="form.code"
                                   type="text"
                                   placeholder="请输入验证码"
                                   size="small">
                        </el-input>
                      </el-form-item>
                      <el-form-item  :class="$style.item_password"
                                     class="login_model_form"
                                     prop="password">
                                     <el-input  v-model="form.password"
                                                :type="input_type ? 'password' : 'text'"
                                                placeholder="请输入登录密码"
                                                size="small">
                                     </el-input>
                      </el-form-item>
                      <el-form-item  prop="password_confirmation"
                                     :class="$style.item_passwordConfirmation"
                                     class="login_model_form">
                                    <el-input  v-model="form.password_confirmation"
                                              :type="input_type ? 'password' : 'text'"
                                              placeholder="请再次输入登录密码"
                                              size="small">
                                              <i  @click="input_type = !input_type"
                                                  slot="suffix"
                                                  class="el-input__icon el-icon-view">
                                              </i>
                                    </el-input>
                      </el-form-item>
                      <el-form-item  prop="warehouse_name"
                                     :class="$style.item_warehouseName"
                                     class="login_model_form">
                                     <el-input  placeholder="请输入仓库名称"
                                                type="text"
                                                v-model="form.warehouse_name"
                                                size="small">
                                     </el-input>
                      </el-form-item>
                      <el-form-item  prop="warehouse_area"
                                     :class="$style.item_warehouseSpace"
                                     class="login_model_form">
                                     <el-input  v-model="form.warehouse_area"
                                                type="text"
                                                placeholder="请输入仓库面积"
                                                size="small">
                                     </el-input>
                      </el-form-item>
                      <span class="warehouseSpaece_desc">
                        平方米
                      </span>
                      <el-form-item :class="$style.save_user_info">
                                    <div :class="$style.item_user_info">
                                         <el-checkbox  v-model="keep"
                                                       @click="user_agreement_dialog">
                                                       <p>我同意<span>用户协议</span></p>
                                         </el-checkbox>
                                    </div>
                      </el-form-item>
                      <el-form-item class="user_login_button">
                                    <el-button  @click="goRegister"
                                                type="primary">
                                                注册
                                    </el-button>
                      </el-form-item>
                      <div  class="user_account_exist"
                            @click="$router.push({name: 'login'})">
                            我有账号
                      </div>
                      <span  class="sendVerifCode"
                             @click="flag && sendVerificationCode()">
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
  computed: {
    rules() {
      // const validatorCode = (rule, value, callback) => {
      //   const length = value.split().length;
      //   if (length < 4) {
      //     return callback(Error('仓库名称必须包含4个字符以上'));
      //   }
      //   return callback();
      // };
      // const validatorUserAgreement = (rule, value, callback) => {
      //   console.log(value, 'ruleeeee');
      //   // if (length < 4) {
      //   //   return callback(Error('仓库名称必须包含4个字符以上'));
      //   // }
      //   return callback(Error(value, '我是val'));
      // };
      return {
        // email: [
        //   { required: true, message: '邮箱不能为空', tigger: 'bulr' },
        // ],
        // verificationCode: [
        //   { required: true, message: '验证码不能为空', tigger: 'bulr' },
        // ],
        // password: [
        //   { required: true, message: '密码不能为空', tigger: 'bulr' },
        // ],
        // password_confirmation: [
        //   { required: true, message: '密码不能为空', tigger: 'bulr' },
        // ],
        // warehouse_name: [
        //   { required: true, message: '仓库名称不能为空', tigger: 'bulr' },
        //   { validator: validatorCode, trigger: 'blur' },
        // ],
        // warehouse_area: [
        //   { required: true, message: '仓库面积不能为空', tigger: 'bulr' },
        // ],
        // user_agreement: [
        //   { required: true, message: '必须勾选用户协议', tigger: 'bulr' },
        //   { validator: validatorUserAgreement, trigger: 'bulr' },
        // ],
      };
    },
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
    user_agreement_dialog() {

    }, // 处理用户协议弹窗
    goRegister() {
      this.$refs.register.validate((valid) => {
        if (valid) {
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
        }
      });
    }, // 登录
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
