<template>
  <!--
  * 仓秘书免费开源WMS仓库管理系统+订货订单管理系统
  *
  * (c) Hunan NLE Network Technology Co., Ltd. <cangmishu.com>
  *
  * For the full copyright and license information, please view the LICENSE
  * file that was distributed with this source code.
  *
  -->
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
      <el-col :span="10" :offset="6">
        <el-form
          :class="$style.staff_form"
          label-width="80px"
          label-position="left"
          :model="staff_info_form_changed"
          :rules="info_Verify_rules"
        >
          <label :class="$style.staff_title"> 基本信息 </label>
          <el-form-item label="用户名" prop="nickname">
            <span>{{ staff_info_form_changed.nickname }}</span>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            {{ this.staff_info_form_changed.email }}
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="staff_info_form_changed.name"></el-input>
          </el-form-item>
          <label :class="$style.staff_title">
            选填信息
          </label>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="staff_info_form_changed.phone"></el-input>
          </el-form-item>
          <el-form-item :label="$t('remark')" prop="remark">
            <el-input type="textarea" v-model="staff_info_form_changed.remark"> </el-input>
          </el-form-item>
          <el-form-item>
            <el-col :span="2" :offset="8">
              <el-button :class="$style.submit_btn" @click="submit_staff_info_changed">
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
import mixin from '@/mixin/form_config';

export default {
  name: 'editStaffData',
  components: {},
  mixins: [mixin],
  mounted() {
    this.getUser();
  },
  beforeDestroy() {
    this.deleteStorage();
  },
  data() {
    return {
      imageUrl: '',
      staff_info_form_changed: {
        // 员工信息表单
        nickname: '',
        user_id: '',
        name: '',
        email: '',
        phone: '',
        remark: ''
      },
      info_Verify_rules: {
        // 员工信息表单输入验证提醒
        name: [{ required: true, message: '姓名不能为空' }],
        remark: ''
      }
    };
  },
  methods: {
    // 获取在 localStorage 中的用户数据
    getUser() {
      if (this.$route.params.userNickname === localStorage.getItem('nickname')) {
        for (const item in localStorage) {
          if (Object.prototype.hasOwnProperty.call(localStorage, item)) {
            // 取出用户数据
            this.staff_info_form_changed[item] = localStorage.getItem(item);
          }
        }
      }
    },
    // 离开页面销毁存储数据
    deleteStorage() {
      for (const item in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, item)) {
          // 删除对象和属性
          localStorage.removeItem(item);
        }
      }
    },
    // 提交修改信息
    submit_staff_info_changed() {
      this.$confirm('确认修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 推送员工信息
        $http.editStaffInfo(this.$route.params.user_id, this.staff_info_form_changed).then(res => {
          // 处理添加成功
          if (res.status === 0) {
            // 显示成功消息
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
            // 跳转员工列表页
            this.$router.go(-1);
          } else {
            this.$message({
              type: 'info',
              message: '保存失败'
            });
          }
        });
      });
    }
  }
};
</script>

<style lang="less" module>
.staffAdd_main {
  width: 92%;
  min-height: 507px;
  margin: 10px auto;
  padding: 30px 0 0 0;
  background-color: white;
  .avatar_name {
    display: inline-block;
    margin: 20px 0 10px 20px;
  }
}
.staff_form {
  width: 360px;
  height: 560px;
  margin: 0 auto;
  background-color: #fff;
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
