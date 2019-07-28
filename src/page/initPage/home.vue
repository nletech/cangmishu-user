<template>
  <div :class="$style.myWms_home">
    <welcome></welcome>
  </div>
</template>
<script>
import NoAuthentication from './components/no_authentication';
import ActivationStatus from './components/activation_status';
import UnderReview from './components/under_review';
import welcome from './components/welcome';
import LeaseWarehouse from './components/lease_warehouse';
import LeaseWarehBy from './components/lease_wareh_by';

export default {
  name: 'home',
  components: {
    NoAuthentication,
    ActivationStatus,
    UnderReview,
    welcome,
    LeaseWarehouse,
    LeaseWarehBy,
  },
  data() {
    return {
      noticelist: [],
    };
  },
  computed: {
    status() {
      return this.$store.state.token.vip_info || {};
    },
  },
};
</script>

<style module lang="less">
  @import '../../less/public_variable.less';
</style>
