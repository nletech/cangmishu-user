<template>
  <el-upload
    class="upload-demo"
    drag
    :headers="Authorization"
    :on-success="handleAvatarSuccess"
    :on-error="handleError"
    :before-remove="beforeRemove"
    :on-exceed="handleExceed"
    :action="api"
    :limit="3"
    name="pdf"
    :file-list="fileList"
    multiple
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  </el-upload>
</template>

<script>
import baseApi from '@/lib/axios/base_api';

export default {
  data() {
    return {
      // myPhoto: this.photo,
      fileList: []
    };
  },
  computed: {
    Authorization() {
      return { Authorization: this.$store.state.token.token };
    },
    api() {
      return `${baseApi.BASE_URL}/upload/pdf`;
    }
  },
  methods: {
    handleExceed() {
      this.$message.warning('当前限制最多选择 3 个文件');
    },
    // 上传截图成功回调
    handleAvatarSuccess(res) {
      if (res.status === 0) {
        // this.myPhoto = res.data.url.substring(1);
        this.$emit('addFile', res.data);
      } else if (res.status === 1) {
        this.$notify({
          message: res.msg,
          type: 'warning'
        });
      }
    },
    handleError() {
      this.$message.warning('当前文件上传失败');
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
};
</script>

<style lang="less" module></style>

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
