export default {
  methods: {
    successTips(is) {
      this.$message({
        message: !is ? this.$t('addSuccess') : this.$t('editSuccess'),
        type: 'success',
        showClose: true,
      });
      this.$router.go(-1);
    },
    errorTips(is) {
      this.$message({
        message: !is ? this.$t('addFailure') : this.$t('editFailure'),
        type: 'error',
        showClose: true,
      });
    },
  },
};
