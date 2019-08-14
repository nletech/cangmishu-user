<template>
  <el-upload
    class="avatar-uploader"
    :disabled="disabled"
    :headers="Authorization"
    :on-success="handleAvatarSuccess"
    :on-remove="handleRemove"
    :on-exceed="handleExceed"
    :action=api
    :limit="limit"
    :file-list="fileList"
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
    pictures: {
      type: Array,
      default() {
        return [];
      },
    },
    fileList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      // myPhoto: this.photo,
      muiltPicture: [], // 上传多个文件
    };
  },
  watch: {
    muiltPicture: {
      handler() {
        this.$emit('update:pictures', this.muiltPicture);
      },
      immediate: true,
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
    handleExceed() {
      this.$notify({
        message: this.$t('onlyOnePicture'),
        type: 'warning',
      });
    },
    // 上传截图成功回调
    handleAvatarSuccess(res) {
      if (res.status === 0) {
        switch (this.limit) {
          case 1:
            this.$emit('update:photo', res.data.url); // 上传一个图片
            return;
          case 3:
            this.muiltPicture.push(res.data.url); // 上传三个图片
            console.log(res, '上传三个图片');
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
    handleRemove(file, fileList) {
      switch (this.limit) {
        case 1:
          this.$emit('update:photo', '');
          return;
        case 3:
          console.log(fileList, '删除三个图片fileList');
          console.log(file, '删除三个图片');
          for (let i = 0; i < this.muiltPicture.length; i += 1) {
            if ((file.response.data && this.muiltPicture[i] === file.response.data.url) || this.muiltPicture[i] === fileList.url) {
              this.muiltPicture.splice(i, 1);
            }
          } // 删除数组中已有的 Url
          console.log(this.muiltPicture, 'this.muiltPicture');
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
