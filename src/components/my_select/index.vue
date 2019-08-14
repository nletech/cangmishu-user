<template>
  <el-select
    size="small"
    :value="selectValue"
    :clearable="clearable"
    :placeholder=placeholder
    @change="updateValue"
    style="width: 100%">
    <slot></slot>
  </el-select>
</template>

<script>
import mixin from '../mixin';

export default {
  mixins: [mixin],
  props: {
    placeholder: [String],
    clearable: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    selectValue() {
      if (!isNaN(+this.value) && (+this.value !== 0)) {
        return +this.value;
      }
      return this.value;
    },
  },
  methods: {
    updateValue(val) {
      this.$emit('change', val);
      this.change(val);
      this.value = val;
      this.submit();
      this.replaceRoute(this.keyName, val);
    },
  },
};
</script>

<style>

</style>
