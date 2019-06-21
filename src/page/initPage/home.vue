<template>
  <div :class="$style.myWms_home">
    <!-- <activation-status v-if="!status.is_activated"></activation-status>
    <no-authentication v-else-if="!status.certification_owner_status && status.is_activated">
    </no-authentication>
    <under-review
    v-else-if="status.certification_owner_status == 1
    && status.is_activated
    && status.certification_renter_status != 1">
    </under-review>
    <lease-warehouse
    v-else-if="status.certification_renter_status == 1
    && status.is_activated
    && status.certification_owner_status != 1"></lease-warehouse>
    <lease-wareh-by
    v-else-if="status.certification_renter_status === 2
    && status.is_activated"></lease-wareh-by> -->
    <normal-home></normal-home>
  </div>
</template>
<script>
import NoAuthentication from './components/no_authentication';
import ActivationStatus from './components/activation_status';
import UnderReview from './components/under_review';
import normalHome from './components/normal_home';
import LeaseWarehouse from './components/lease_warehouse';
import LeaseWarehBy from './components/lease_wareh_by';

export default {
  name: 'home',
  components: {
    NoAuthentication,
    ActivationStatus,
    UnderReview,
    normalHome,
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
