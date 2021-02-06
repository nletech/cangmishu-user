export default {
  methods: {
    isButtonLoading() {
      return this.$store.state.config.button_loading;
    }
  }
};
