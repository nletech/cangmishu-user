export default {
  computed: {
    warehouseId() {
      return parseInt(this.$store.state.config.setWarehouseId || localStorage.getItem('warehouseId'), 10);
    }, // 初始化默认仓库
    warehouseName() {
      return this.$store.state.config.setWarehouseName || localStorage.getItem('warehouseName');
    }, // 初始化默认仓库
    isButtonLoading() {
      return this.$store.state.config.button_loading;
    },
  },
  methods: {
    getWarehouseId() {
      return this.$store.state.config.setWarehouseId || +localStorage.getItem('warehouseId');
    },
    getOwnerToken() {
      return this.$store.state.token.id;
    },
    isEnabledLangInput() {
      return false;
    },
    successTips(is, routerGo) {
      this.$message({
        message: !is ? this.$t('addSuccess') : this.$t('editSuccess'),
        type: 'success',
        showClose: true,
      });
      if (routerGo) {
        this.$router.go(-1);
      }
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
