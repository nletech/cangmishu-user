<template>
  <el-dialog
    title="更改头像"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="30%"
    :before-close="onClose"
  >
    <el-form label-width="90px">
      <el-form-item label="名称">
        <el-input v-model="userInfo.nickname" disabled></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <my-upload
          :img.sync="avatarUrl"
          :width="180"
          :height="180"
          @uploadSuccessCallBack="handlerUploadSuccessCallBack"
        >
          <template slot="btnTitle">{{ $t('upload') }}</template>
        </my-upload>
      </el-form-item>
      <el-form-item><el-button type="primary" @click="onSubmit">确定</el-button></el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import $http from '@/api';
import MyUpload from '@/components/imageUpload/index';
export default {
  name: 'modifyUserAvatar',
  props: ['dialogVisible'],
  components: { MyUpload },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.avatarUrl = this.userInfo.avatar;
      }
    }
  },
  data() {
    return {
      avatarUrl: ''
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.config.userInfo;
    }
  },
  created() {},
  methods: {
    onClose() {
      this.$emit('update:dialogVisible', false);
    },
    handlerUploadSuccessCallBack(url) {
      this.avatarUrl = url;
    },
    onSubmit() {
      $http.modifyUserAvatar({ avatar: this.avatarUrl }).then(res => {
        if (res.status) return;
        this.$store.dispatch('config/getUserInfo');
        this.onClose();
        this.$message({
          type: 'success',
          message: this.$t('success')
        });
      });
    }
  }
};
</script>
