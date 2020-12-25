<template>
  <div class="bind-phone">
    <el-card class="box-card">
      <el-row>
        <el-col :span="12">
          <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="120px"
            class="bind-phone-ruleform"
          >
            <el-form-item label="当前手机号" prop="oldphone">
              <el-input disabled v-model="userInfo.phone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="更改手机号" prop="phone">
              <el-col :span="16">
                <el-input v-model="ruleForm.phone" autocomplete="off"></el-input>
              </el-col>
              <el-col :span="8" style="text-align: right">
                <el-button
                  :loading="codeBtnLoading"
                  :disabled="isSendCode"
                  style="width: 80%"
                  @click="sendCode"
                  type="primary"
                  plain
                  >{{ !isSendCode ? '发送验证码' : sendCodeCount }}</el-button
                >
              </el-col>
            </el-form-item>
            <el-form-item label="请输入验证码" prop="code">
              <el-input v-model="ruleForm.code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onConfirm">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="10" :offset="2">
          <div class="title">订阅通知消息</div>
          <div v-for="item in subscribeMessagesList" :key="item.type" class="switch">
            <el-switch
              v-model.number="item.status"
              @change="onSubscribeChange"
              inactive-value="0"
              :active-value="1"
            >
            </el-switch>
            <span>{{ item.name }}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import $http from '@/api';

export default {
  name: 'bindPhone',
  data() {
    const minLength = { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' };
    return {
      ruleForm: {
        phone: '',
        code: ''
      },
      rules: {
        phone: [{ required: true, message: '请输入更改手机号', trigger: 'blur' }, minLength],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      isSendCode: false,
      sendCodeCount: 59,
      sendCodeInterval: null,
      codeBtnLoading: false,
      subscribeMessagesList: [],
      subscribeTimer: null
    };
  },
  created() {
    this.getSubscribeMessages();
  },
  computed: {
    userInfo() {
      return this.$store.state.config.userInfo;
    }
  },
  methods: {
    onSubscribeChange() {
      if (this.subscribeTimer) {
        clearInterval(this.subscribeTimer);
      }
      this.subscribeTimer = setInterval(() => {
        $http
          .setSubscribeMessages('phone', this.subscribeMessagesList)
          .then(res => {
            this.$message({
              message: res.msg,
              type: 'success'
            });
            clearInterval(this.subscribeTimer);
            this.subscribeTimer = null;
          })
          .catch(() => (this.subscribeTimer = null));
      }, 1000);
    },
    getSubscribeMessages() {
      $http.getSubscribeMessages('phone').then(res => {
        this.subscribeMessagesList = res.data;
      });
    },
    sendCode() {
      this.$refs.ruleForm.validateField('phone', valid => {
        if (!valid) {
          this.codeBtnLoading = true;
          $http
            .getPhoneCode({ phone: this.ruleForm.phone })
            .then(res => {
              this.isSendCode = true;
              this.$message({
                message: res.msg,
                type: 'success'
              });
              this.sendCodeInterval = setInterval(() => {
                if (this.sendCodeCount === 1) {
                  clearInterval(this.sendCodeInterval);
                  this.sendCodeCount = 59;
                  this.isSendCode = false;
                }
                this.sendCodeCount--;
              }, 1000);
            })
            .finally(() => (this.codeBtnLoading = false));
        }
      });
    },
    onConfirm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          $http.bindPhone(this.ruleForm).then(res => {
            if (res.status) return;
            clearInterval(this.sendCodeInterval);
            this.sendCodeCount = 59;
            this.$refs.ruleForm.resetFields();
            this.$store.dispatch('config/getUserInfo');
            this.$message({
              type: 'success',
              message: res.msg
            });
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.bind-phone {
  .bind-phone-ruleform {
    max-width: 600px;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .switch {
    margin: 20px 0;
    div {
      margin-right: 20px;
    }
  }
}
</style>
