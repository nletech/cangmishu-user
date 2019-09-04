<template>
  <el-upload
    class="avatar-uploader"
    :disabled="disabled"
    :headers="Authorization"
    :on-success="handleAvatarSuccess"
    :on-remove="handleRemove"
    :showFileList="false"
    :action=api
    list-type="picture"
    name="image">
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
    limit: {
      type: Number,
    },
  },
  computed: {
    Authorization() {
      return { Authorization: this.$store.state.token.token };
    },
    api() {
      return `${baseApi}/upload/image`;
    },
  },
  methods: {
    // 上传截图成功回调
    handleAvatarSuccess(res) {
      if (res.status === 0) {
        switch (this.limit) {
          case 1:
            this.$emit('update:photo', res.data.url); // 上传一个图片
            console.log(res, 'res');
            return;
          default:
            throw Error('picture upload went wrong');
        }
      } else if (res.status === 1) {
        this.$notify({
          message: res.msg,
          type: 'warning',
        });
      }
    },
    handleRemove() {
      switch (this.limit) {
        case 1:
          this.$emit('update:photo', '');
          return;
        default:
          throw Error('picture upload went wrong');
      }
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
