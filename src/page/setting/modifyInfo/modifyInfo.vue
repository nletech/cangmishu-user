<template>
  <div class="modify-info">
    <el-card class="box-card">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="modify-info-ruleform"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="商户名称" prop="name">
              <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系地址" prop="contact_address">
              <el-input v-model="ruleForm.contact_address" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="ruleForm.contact" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onConfirm">提交</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import $http from '@/api';

export default {
  name: 'bindPhone',
  data() {
    return {
      value: '',
      ruleForm: {
        name: '',
        contact_address: '',
        contact: ''
      },
      rules: {
        name: [{ required: true, message: '请输入商户名称', trigger: 'blur' }],
        contact_address: [{ required: true, message: '请输入联系人地址', trigger: 'blur' }],
        contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }]
      },
      imageUrl: ''
    };
  },
  computed: {
    user_id() {
      return +localStorage.getItem('setUser');
    }
  },
  created() {
    this.getUserProfile();
  },
  methods: {
    getUserProfile() {
      $http.getUserProfile().then(res => {
        if (res.status) return;
        this.ruleForm = res.data;
      });
    },
    onConfirm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          $http.modifyUserInfo(this.ruleForm).then(res => {
            if (res.status) return;
            this.$message({
              type: 'success',
              message: this.$t('success')
            });
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.modify-info {
  .modify-info-ruleform {
    // max-width: 500px;
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
