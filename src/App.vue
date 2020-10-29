<template>
  <router-view id="app" />
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="less">
@import "./less/public_style.less";
@import "./less/public_variable.less";
@import "./lib/nprogress/nprogress.css";
</style>

<style>
body .el-table th.gutter {
  display: table-cell !important;
} /*解决 element-ui 列表 表头和内容错位*/
</style>
