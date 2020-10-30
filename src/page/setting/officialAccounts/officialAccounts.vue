<template>
  <div class="official-accounts">
    <el-card class="box-card">
      <el-row>
        <el-col :span="12">
          <el-steps direction="vertical" :active="3">
            <el-step>
              <div class="step-height" slot="title">
                <div>第一步打开微信扫一扫</div>
                <div><img class="wechat-scan" src="../../../assets/img/wechat-scan.png" /></div>
              </div>
            </el-step>
            <el-step>
              <div class="step-height" slot="title">
                <div>扫描下面二维码</div>
                <div><img /></div>
              </div>
            </el-step>
            <el-step title="完成关注与帐号的绑定"> </el-step>
          </el-steps>
        </el-col>
        <el-col :span="10" :offset="2">
          <div class="title">订阅通知消息</div>
          <div class="switch">
            <el-switch v-model="value"> </el-switch>
            <span>开启下单通知</span>
          </div>
          <div class="switch">
            <el-switch v-model="value"> </el-switch>
            <span>开启库存预警通知</span>
          </div>
          <div class="switch">
            <el-switch v-model="value"> </el-switch>
            <span>开启经营日报</span>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import $http from '@/api';

export default {
  name: 'officialAccounts',
  data() {
    return {
      value: '',
    };
  },
  computed: {
    user_id() {
      return +localStorage.getItem('setUser');
    },
  },
  methods: {
    onConfirm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          $http.modifyPsw(this.user_id, this.ruleForm)
            .then((res) => {
              if (res.status) return;
              this.$refs.ruleForm.resetFields();
              this.$message({
                type: 'success',
                message: this.$t('success'),
              });
            });
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.official-accounts {
  .step-height {
    min-height: 200px;
    .wechat-scan {
      width: 150px;
      height: 150px;
      margin-top: 15px;
    }
  }
  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .switch {
    margin: 40px 0;
  }
}
</style>
