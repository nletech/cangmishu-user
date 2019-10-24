<template>
    <el-dialog
        :title="$t('ChangePassword')"
        width="40%"
        @update:visible="$emit('update:visible', $event)"
        :visible="visible"
        center>
        <el-form
            label-width="120px"
            :rules="rules"
            ref="validator"
            :model="form">
            <el-form-item
                :label="$t('oldPassword')"
                prop="password">
                <el-input
                    v-model="form.password"
                    :type="input_type ? 'password' : 'text'">
                    <i  slot="suffix"
                        @click="input_type = !input_type"
                        class="el-input__icon el-icon-view">
                    </i>
                </el-input>
            </el-form-item>
            <el-form-item
                :label="$t('newPassword')"
                prop="password_confirmation">
                <el-input
                    v-model="form.password_confirmation"
                    :type="input_type2 ? 'password' : 'text'">
                    <i  slot="suffix"
                        @click="input_type2 = !input_type2"
                        class="el-input__icon el-icon-view">
                    </i>
                </el-input>
            </el-form-item>
        </el-form>
        <span
            slot="footer"
            class="dialog-footer">
            <el-button
                type="primary"
                @click="submit">
                {{$t('confirm')}}
            </el-button>
        </span>
    </el-dialog>
</template>
<script>
import $http from '@/api';

export default {
  name: 'changePassWord',
  props: {
    visible: [Boolean],
  },
  data() {
    return {
      input_type: true,
      input_type2: true,
      form: {
        password: '',
        password_confirmation: '',
      },
      rules: {
        password: [
          { required: true, message: this.$t('inputPsw'), trigger: 'blur' },
        ],
        password_confirmation: [
          { required: true, message: this.$t('inputPsw'), trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    user_id() {
      return +localStorage.getItem('setUser');
    },
  },
  watch: {
    visible() {
      if (!this.visible) {
        this.input_type = true;
        this.input_type2 = true;
        this.form.password = '';
        this.form.password_confirmation = '';
      }
    },
  },
  methods: {
    submit() {
      this.$refs.validator.validate((valid) => {
        if (valid) {
          $http.modifyPsw(this.user_id, this.form)
            .then((res) => {
              if (res.status) return;
              this.$emit('update:visible', false);
              this.$message({
                type: 'success',
                message: this.$t('success'),
              });
            });
        }
      });
    },
  },
};
</script>
<style lang="less" module>

</style>
