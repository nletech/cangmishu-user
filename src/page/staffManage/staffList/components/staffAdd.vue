<template>
          <div>
              <el-row :class="$style.staffAdd_main">
                      <!-- 上传用户头像 -->
                      <!-- <el-col :span="4" :offset="1">
                        <span :class="$style.avatar_name">头像</span>
                          <el-upload
                            class="avatar-uploader"
                            :show-file-list="false"
                            action="#"
                          >
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                          </el-upload>
                      </el-col> -->
                      <!-- 新增员工信息列表 -->
                      <el-col :span="10" :offset="7">
                              <el-form  :class="$style.staff_form"
                                        label-width="80px"
                                        ref="addStaff"
                                        label-position="left"
                                        :model="staff_info_form"
                                        :rules="info_Verify_rules">
                                        <label :class="$style.staff_title"> 基本信息 </label>
                                        <el-form-item  label="用户名"
                                                      prop="nickname">
                                                      <el-input  v-model="staff_info_form.nickname"
                                                                  placeholder="用户名不能修改">
                                                      </el-input>
                                        </el-form-item>
                                        <el-form-item  label="姓名"
                                                      prop="name">
                                                      <el-input  v-model="staff_info_form.name"></el-input>
                                        </el-form-item>
                                        <el-form-item  label="密码"
                                                      prop="password">
                                                      <el-input  type="password"
                                                                  v-model="staff_info_form.password">
                                                      </el-input>
                                        </el-form-item>
                                        <el-form-item  label="确认密码"
                                                      prop="password_confirmation">
                                                      <el-input  type="password"
                                                                  v-model="staff_info_form.password_confirmation">
                                                      </el-input>
                                        </el-form-item>
                                        <el-form-item  label="邮箱"
                                                      prop="email">
                                                      <el-input v-model="staff_info_form.email"></el-input>
                                        </el-form-item>
                                        <label :class="$style.staff_title">
                                          选填信息
                                        </label>
                                        <el-form-item  label="手机号"
                                                      prop="phone">
                                                      <el-input  v-model="staff_info_form.phone"></el-input>
                                        </el-form-item>
                                        <el-form-item :label="$t('remark')"
                                                      prop="remark">
                                                      <el-input  type="textarea"
                                                                  v-model="staff_info_form.remark">
                                                      </el-input>
                                        </el-form-item>
                                        <el-form-item>
                                                      <el-col :span="2" :offset="6">
                                                              <el-button  :class="$style.submit_btn"
                                                                          @click="submit_staff_info">
                                                                          保存
                                                              </el-button>
                                                      </el-col>
                                                      <el-col :span="2" :offset="8">
                                                              <el-button  @click="delete_staff_info">
                                                                清空
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
import mixin from '@/mixin/form_config';

export default {
  name: 'staffAdd',
  components: {
  },
  mixins: [mixin],
  data() {
    return {
      imageUrl: '',
      form_submit_blank: false, // 提交空白表单提示
      staff_info_form: { // 员工信息表单
        nickname: '',
        name: '',
        password: '',
        password_confirmation: '',
        email: '',
        phone: '',
        remark: '',
      },
      info_Verify_rules: { // 员工信息表单输入验证提醒
        nickname: [{ required: true, message: '用户名不能为空' }],
        name: [{ required: true, message: '姓名不能为空' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码不能少于6个字符', trigger: 'blur' },
        ],
        password_confirmation: [{ required: true, message: '请再次输入密码' }],
        email: [
          { type: 'email', required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  methods: {
    // 提交员工信息
    submit_staff_info() {
      // 检验表单必填信息
      // const arr = Object.values(this.staff_info_form);
      // for (let i = 0; i < arr.length - 2; i += 1) {
      //   // 必填项有空，无法弹出保存选项框
      //   if (arr[i] !== '') {
      //     this.form_submit_blank = true;
      //   }
      // }
      this.$refs.addStaff.validate((valid) => {
        if (!valid) return;
        // 必选项全部填写
        this.$confirm('确认添加员工', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          // 推送员工信息
          $http.addStaff(this.staff_info_form).then((res) => {
            // 处理添加成功
            if (res.status === 0) {
              // 显示成功消息
              this.$message({
                type: 'success',
                message: this.$t('success'),
              });
              this.$router.replace({ name: 'staffList' });
            }
          });
        });
      });
    },
    delete_staff_info() {
      Object.keys(this.staff_info_form).forEach((item) => {
        if (item !== '') {
          this.staff_info_form[item] = '';
        }
      });
    },
  },
};
</script>

<style lang="less" module>

.staffAdd_main {
  width: 92%;
  min-height: 507px;
  background-color: white;
  margin: 10px auto;
  padding: 20px 0 0 0;
  .avatar_name {
    display: inline-block;
    margin: 20px 0 10px 20px;
  }
}
.staff_form {
  width: 360px;
  min-height: 507px;
  .submit_btn {
    background-color: @ThemeColor;
    color: @white;
  }
}
.staff_title {
  display: inline-block;
  margin: 10px 0 20px 0;
  font-size: 16px;
  font-weight: 400;
}

</style>
