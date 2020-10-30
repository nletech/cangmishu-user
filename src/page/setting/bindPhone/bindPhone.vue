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
            <el-form-item label="当前手机号" prop="currentPhone">
              <el-input
                disabled
                v-model="ruleForm.currentPhone"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="更改手机号" prop="phone">
              <el-col :span="16">
                <el-input
                  v-model="ruleForm.phone"
                  autocomplete="off"
                ></el-input>
              </el-col>
              <el-col :span="8" style="text-align: right">
                <el-button type="primary" plain>发送验证码</el-button>
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
  name: 'bindPhone',
  data() {
    const minLength = { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' };
    return {
      value: '',
      ruleForm: {
        phone: '',
        code: '',
      },
      rules: {
        phone: [
          { required: true, message: '请输入更改手机号', trigger: 'blur' },
          minLength,
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],
      },
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
.bind-phone {
  .bind-phone-ruleform {
    max-width: 500px;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .switch {
    margin: 20px 0;
  }
}
</style>
