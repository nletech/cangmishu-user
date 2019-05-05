<template>
  <el-table-column
  :label="label"
  :width="width">
    <template slot-scope="scope">
      <slot v-if="scope.row.$_edit" :row="scope.row">
        <el-input size="mini" v-model="scope.row[prop]"
                  :disabled="isDisabled&&scope.row.is_add">
        </el-input>
      </slot>
      <slot name="props" v-else :row="scope.row">
        <span>{{ scope.row[prop] }}</span>
      </slot>
    </template>
  </el-table-column>
</template>

<script>
export default {
  props: {
    prop: [String],
    label: [String],
    width: [String],
    isDisabled: [Boolean],
  },
};
</script>
