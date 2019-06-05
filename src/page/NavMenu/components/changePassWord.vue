<template>
          <el-dialog  title="修改个人资料"
                      width="40%"
                      @update:visible="$emit('update:visible', $event)"
                      :visible="visible"
                      center>
                      <el-form  label-width="120px"
                                :rules="rules"
                                ref="validator"
                                :model="form">
                                <el-form-item label="新密码"
                                              prop="password">
                                              <el-input type="small"
                                                        v-model="form.password">
                                              </el-input>
                                </el-form-item>
                                <el-form-item label="确认密码"
                                              prop="password_confirmation">
                                              <el-input type="small"
                                                        v-model="form.password_confirmation"></el-input>
                                </el-form-item>
                      </el-form>
                      <span slot="footer"
                            class="dialog-footer">
                            <el-button type="primary" @click="submit">确 定</el-button>
                      </span>
          </el-dialog>
</template>
<script>
import $http from '@/api';

export default {
  name: 'changePassWord',
  props: {
    visible: [Boolean],
  },
  data() {
    return {
      form: {
        password: '',
        password_confirmation: '',
      },
      rules: {
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
        ],
        password_confirmation: [
          { required: true, message: '请确认密码', trigger: 'blur' },
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
    submit() {
      this.$refs.validator.validate((valid) => {
        if (valid) {
          console.log(this.form, '提交的表单');
          $http.modifyPsw(this.user_id, this.form)
            .then((res) => {
              if (res.status) return;
              this.$emit('update:visible', false);
              this.$message({
                type: 'success',
                message: '操作成功',
              });
            });
        }
      });
    },
  },
};
</script>
<style lang="less" module>

</style>
