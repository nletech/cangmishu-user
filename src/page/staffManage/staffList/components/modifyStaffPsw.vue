<template>
          <div>
                <el-row :class="$style.modifyStaffPsw_main">
                        <el-form  :rules="changeRules"
                                  label-width="100px"
                                  :model="reset_form_psw"
                                  :class="$style.reset_form_main">
                                  <el-form-item  prop="password"
                                                 label='新密码'>
                                                 <el-input  :type="showPswSwitch_1 ? 'text' : 'password' "
                                                            v-model="reset_form_psw.password">
                                                            <i  v-show="reset_form_psw.password"
                                                                slot="suffix"
                                                                class="el-icon-view el-input__icon"
                                                                @click="handleShowPsw_1">
                                                            </i>
                                                 </el-input>
                                  </el-form-item>
                                  <el-form-item  prop="password"
                                                 label='确认新密码'>
                                                 <el-input  :type="showPswSwitch_2 ? 'text' : 'password' "
                                                            v-model="reset_form_psw.password_confirmation">
                                                            <i  v-show="reset_form_psw.password_confirmation"
                                                                slot="suffix"
                                                                class="el-icon-view el-input__icon"
                                                                @click="handleShowPsw_2">
                                                            </i>
                                                 </el-input>
                                  </el-form-item>
                                  <el-form-item>
                                                <el-col :span="2" :offset="8">
                                                        <el-button
                                                                    :class="$style.submit_btn"
                                                                    @click="submit_modification">
                                                                    保存
                                                        </el-button>
                                                </el-col>
                                  </el-form-item>
                        </el-form>
                </el-row>
          </div>
</template>

<script>
import $http from '@/api';

export default {
  name: 'modifyStaffPsw',
  data() {
    return {
      showPswSwitch_1: false, // 显示密码
      showPswSwitch_2: false, // 显示密码
      reset_form_psw: {
        password: '',
        password_confirmation: '',
      },
    };
  },
  computed: {
    changeRules() {
      return {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码不能少于6个字符', trigger: 'blur' },
        ],
        password_confirmation: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码不能少于6个字符', trigger: 'blur' },
        ],
      };
    },
  },
  methods: {
    handleShowPsw_1() {
      this.showPswSwitch_1 = !this.showPswSwitch_1;
    },
    handleShowPsw_2() {
      this.showPswSwitch_2 = !this.showPswSwitch_2;
    },
    submit_modification() {
      if (this.reset_form_psw.password === '' || this.reset_form_psw.password_confirmation === '') {
        this.$message({
          type: 'error',
          message: '请正确填写密码!',
        });
        return;
      }
      this.$confirm('确认重置密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 推送修改信息
          $http.modifyStaffPsw(this.$route.params.userId, this.reset_form_psw)
            .then((res) => {
              // 处理添加成功
              if (res.status === 0) {
                // 显示成功消息
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                });
                // 跳转员工列表页
                this.$router.push({
                  name: 'staffList',
                  params: {
                    userId: this.$route.params.userId,
                  },
                });
              } else {
                this.$message({
                  type: 'info',
                  message: '修改失败',
                });
              }
            })
            .catch(() => {
              console.log('resetPsw is wrong!');
            });
        })
        .catch(() => {
          // 显示取消消息
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
    },
  },
};
</script>

<style lang="less" module>
  @import '../../../../less/public_variable.less';

  .modifyStaffPsw_main {
    width: 92%;
    min-height: 607px;
    margin: 10px auto;
    padding: 80px 10px 0 10px;
    background-color: white;
    .reset_form_main {
      width: 500px;
      margin: 0 auto;
      .submit_btn {
        background-color: @ThemeColor;
        color: @white;
      }
    }
  }
</style>
