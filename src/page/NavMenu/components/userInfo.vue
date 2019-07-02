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
                                <el-form-item label="邮箱"
                                              prop="userEmail">
                                              <el-input type="small"
                                                        disabled
                                                        v-model="userEmail">
                                              </el-input>
                                </el-form-item>
                                <el-form-item label="用户名"
                                              prop="nickname">
                                              <el-input type="small"
                                                        v-model="form.nickname">
                                              </el-input>
                                </el-form-item>
                                <el-form-item label="头像"
                                              prop="avatar">
                                              <el-upload  class="avatar-uploader"
                                                          :action="api"
                                                          :headers="Authorization"
                                                          :show-file-list="false"
                                                          name="image"
                                                          :file-list="fileList"
                                                          :on-success="handleAvatarSuccess"
                                                          :before-upload="beforeAvatarUpload">
                                                          <img  v-if="imageUrl"
                                                                :src="imageUrl"
                                                                class="avatar">
                                                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                              </el-upload>
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
import baseApi from '@/lib/axios/base_api';

export default {
  name: 'userInfo',
  props: {
    visible: [Boolean],
  },
  components: {
    api() {
      return `${baseApi}/upload/image`;
    },
  },
  data() {
    return {
      form: {
        nickname: '',
        photos: '',
      },
      userEmail: '',
      fileList: [],
      imageUrl: '',
      rules: {
        nickname: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
      },
    };
  },
  mounted() {
    this.userEmail = this.user_email;
    this.imageUrl = localStorage.getItem('setUAvatar');
    this.form.nickname = localStorage.getItem('setUnickName');
  },
  computed: {
    Authorization() {
      return { Authorization: this.$store.state.token.token };
    }, // token
    user_id() {
      return +localStorage.getItem('setUser');
    }, // 用户 id
    user_email() {
      return localStorage.getItem('setUEmail');
    }, // 用户名
    api() {
      return `${baseApi}/upload/image`;
    }, // 上传图片
  },
  methods: {
    handleAvatarSuccess(res) {
      if (res.status === 0) {
        this.imageUrl = res.data.url;
      } else if (res.status === 1) {
        this.$notify({
          message: res.msg,
          type: 'warning',
        });
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }, // 请求接口之前的处理
    submit() {
      this.$refs.validator.validate((valid) => {
        if (valid) {
          $http.modifyUserAvatar(this.user_id, { avatar: this.imageUrl })
            .then((re) => {
              if (re.status) return;
              this.form.photos = this.imageUrl;
              $http.modifyUserInfo(this.user_id, this.form)
                .then((res) => {
                  if (res.status) return;
                  // 更新旧的头像和用户名
                  this.$store.commit('config/setUserInfo',
                    { avatar: this.imageUrl,
                      nickName: this.form.nickname,
                    });
                  this.$emit('update:visible', false);
                  this.$message({
                    type: 'success',
                    message: '操作成功',
                  });
                });
            });
        }
      });
    },
  },
};
</script>
