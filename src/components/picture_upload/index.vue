<template>
  <el-upload
    class="avatar-uploader"
    :disabled="disabled"
    :headers="Authorization"
    :on-success="handleAvatarSuccess"
    :on-remove="handleRemove"
    :on-exceed="handleExceed"
    :action=api
    :limit="1"
    name="image"
    :file-list="fileList">
    <img v-if="this.photo"
    :src="this.photo"
    class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
import baseApi from '@/lib/axios/base_api';

export default {
  props: {
    photo: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
  },
  data() {
    return {
      // myPhoto: this.photo,
      fileList: [],
    };
  },
  computed: {
    Authorization() {
      return { Authorization: this.$store.state.token.token };
    },
    api() {
      return `${baseApi}/upload/image`;
    },
    // imgUrl() {
    //   return `${baseApi}${this.photo}`;
    // },
  },
  methods: {
    handleExceed() {
      this.$notify({
        message: this.$t('onlyOnePicture'),
        type: 'warning',
      });
    },
    // 上传截图成功回调
    handleAvatarSuccess(res) {
      if (res.status === 0) {
        // this.myPhoto = res.data.url.substring(1);
        this.$emit('update:photo', res.data.url);
      } else if (res.status === 1) {
        this.$notify({
          message: res.msg,
          type: 'warning',
        });
      }
    },
    handleRemove() {
      // this.myPhoto = '';
      this.$emit('update:photo', '');
    },
  },
};
</script>

<style lang="less" module>
@import '../../less/public_variable.less';

</style>

<style lang="less" scoped>
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  border: none;
}
</style>
