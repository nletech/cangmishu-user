<template>
  <div class="top-nav">
    <top-nav></top-nav>
    <router-view />
  </div>
</template>
<script>
import TopNav from './topNav';

export default {
  components: {
    TopNav,
  },
  name: 'Tnav',
};
</script>
