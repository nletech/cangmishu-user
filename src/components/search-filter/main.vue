<template>
  <div class="top clearfix">
    <el-button type="default" @click="clear" size="mini">
      重置所有条件
    </el-button>
    <div style="margin-top: 10px;">
      <slot ref="slot" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchFilter',
  props: {
    search: {
      type: Function,
      default: () => {}
    },
    clear: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.clearfix {
  clear: both;
}
.top {
  border-top: solid 1px #ebeef6;
  margin-top: 20px;
  padding-top: 20px;
}
.left {
  margin-right: 200px;
  padding-right: 10px;
}
.right {
  float: right;
  width: 100px;
  padding-left: 10px;
}
</style>
