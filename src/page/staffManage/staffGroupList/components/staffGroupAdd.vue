<template>
  <div>
    <el-row :class="$style.staffGroupAdd_main">
      <el-col :span="12" :offset="6">
        <el-form
          label-width="80px"
          :model="staffGroupAdd_form"
          ref="form_ref"
          :rules="info_Verify_rules"
        >
          <el-form-item label="员工组名" prop="name">
            <el-input v-model="staffGroupAdd_form.name"> </el-input>
          </el-form-item>
          <el-form-item :label="$t('remark')">
            <el-input type="textarea" v-model="staffGroupAdd_form.remark"> </el-input>
          </el-form-item>
          <el-form-item>
            <el-col :span="2" :offset="10">
              <el-button :class="$style.submit_btn" @click="submit_staffGroupAdd_form">
                保存
              </el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import $http from '@/api';

export default {
  components: {},
  data() {
    return {
      info_Verify_rules: {
        name: [{ required: true, message: '员工组名不能为空', trigger: 'blur' }]
      },
      staffGroupAdd_form: {
        name: '',
        remark: ''
      }
    };
  },
  methods: {
    // 提交添加信息
    submit_staffGroupAdd_form() {
      this.$refs.form_ref.validate(valid => {
        if (!valid) return;
        // 推送添加信息
        $http.addStaffGroup(this.staffGroupAdd_form).then(res => {
          // 处理添加成功
          if (res.status === 0) {
            // 显示成功消息
            this.$message({
              type: 'success',
              message: this.$t('success')
            });
            // 跳转
            this.$router.push({ name: 'staffGroupList' });
          }
        });
      });
    }
  }
};
</script>

<style lang="less" module>
.staffGroupAdd_main {
  width: 92%;
  min-height: 607px;
  margin: 10px auto;
  padding: 30px 0 0 0;
  background-color: white;
  .submit_btn {
    background-color: @ThemeColor;
    color: #fff;
  }
}
.label {
  font-size: 18px;
}
</style>
