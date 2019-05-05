<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
};
</script>

<style lang="less">
@import './less/public_style.less';
@import './less/public_variable.less';
@import './lib/nprogress/nprogress.css';
</style>
