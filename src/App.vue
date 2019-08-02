<template>
  <div id="app">
    <router-view />
    <!-- <loading></loading> -->
  </div>
</template>
<script>
// import loading from '@/components/loading';

export default {
  name: 'App',
  components: {
    // loading,
  },
};
</script>

<style lang="less">
@import './less/public_style.less';
@import './less/public_variable.less';
@import './lib/nprogress/nprogress.css';
</style>
