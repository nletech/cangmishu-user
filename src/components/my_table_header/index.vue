<template>
  <el-table
    border
    @header-dragend="tableHeaderChange"
    v-bind="$attrs"
    v-on="$listeners"
    style="width: 100%">
    <slot></slot>
  </el-table>
</template>
<script>
const width = JSON.parse(localStorage.getItem('storeManage')) || null;
export default {
  props: {
    keys: {
      type: String,
      required: true,
    },
  },
  provide() {
    return {
      keys: this.keys,
    };
  },
  methods: {
    tableHeaderChange(newWidth, oldWidth, column) {
      if (!width) {
        localStorage.setItem(
          this.$route.name,
          JSON.stringify({ [column.property + this.keys]: newWidth }));
        return;
      }
      width[column.property + this.keys] = newWidth;
      localStorage.setItem(this.$route.name, JSON.stringify(width));
    },
  },
};
</script>
