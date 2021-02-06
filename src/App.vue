<template>
  <router-view id="app" />
</template>

<script>
const doc = document;
export default {
  name: 'App',
  mounted() {
    doc.body.removeChild(doc.getElementById('wrapper'));
  }
};
</script>

<style lang="less">
@import './less/public_style.less';
@import './lib/nprogress/nprogress.css';
</style>
