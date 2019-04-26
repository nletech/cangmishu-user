<template>
  <el-table-column
  :width="widthValue[prop + keys] || width"
  v-bind="$attrs"
  v-on="$listeners">
  <template slot-scope="scope">
    <slot :row="scope.row">{{scope.row[prop]}}</slot>
  </template>
  </el-table-column>
</template>

<script>
export default {
  props: {
    prop: [String],
    width: [String, Number],
  },
  inject: ['keys'],
  computed: {
    widthValue() {
      const valueObj = JSON.parse(localStorage.getItem(this.$route.name)) || {};
      return valueObj;
    },
  },
};
</script>
