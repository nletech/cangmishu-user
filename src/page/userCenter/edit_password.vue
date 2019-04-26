<template>
  <mdoel-form>
    <el-form
    slot="left"
    ref="eidtPassword"
    :model="form"
    :rules="validatorEditPassword"
    label-width="120px">
      <el-form-item :label="$t('oldPassword')" prop="password_old">
        <el-input v-model="form.password_old" type="password" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('newPassword')" prop="password">
        <el-input v-model="form.password" type="password" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('Repeatnewpassword')" prop="password_confirmation">
        <el-input v-model="form.password_confirmation" type="password" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
        :loading="$store.state.config.button_loading"
        @click="onSubmit">
        {{$t('ChangeNow')}}
        </el-button>
        <cancel-button></cancel-button>
      </el-form-item>
    </el-form>
  </mdoel-form>
</template>

<script>
import MdoelForm from '@/components/form';
import $http from '@/api';
import CancelButton from '@/components/cancel_button';

export default {
  components: {
    MdoelForm,
    CancelButton,
  },
  data() {
    return {
      form: {
        password_old: '', // 原密码
        password: '', // 新密码
        password_confirmation: '', // 新密码
      },
    };
  },
  computed: {
    validatorEditPassword() {
      return {
        password_old: [
          { required: true, message: this.$t('PleaseEnterPasswordOld'), trigger: 'blur' },
          { min: 6, max: 16, message: this.$t('TheLengthIs16'), trigger: 'blur' },
        ], // 原密码
        password: [
          { required: true, message: this.$t('PleaseEnternewPassword'), trigger: 'blur' },
          { min: 6, max: 16, message: this.$t('TheLengthIs16'), trigger: 'blur' },
        ], // 新密码
        password_confirmation: [
          { required: true, message: this.$t('PleaseEnterRepeatnewpassword'), trigger: 'blur' },
          { min: 6, max: 16, message: this.$t('TheLengthIs16'), trigger: 'blur' },
        ], // 新密码
      };
    },
  },
  name: 'editPassword',
  methods: {
    onSubmit() {
      this.$refs.eidtPassword.validate((valid) => {
        if (!valid) return;
        $http.changePwd(this.form).then((res) => {
          if (res.status) return;
          this.$store.commit('token/delToken');
          this.$router.push({
            name: 'login',
          });
        });
      });
    },
  },
};
</script>

<style lang="less" module>
  .label {
    font-size: 18px;
  }
  .avatar_uploader {
    margin-top: 10px;
  }
</style>
