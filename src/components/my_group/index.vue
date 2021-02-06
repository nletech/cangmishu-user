<template>
  <div :class="$style.my_group">
    <el-row :gutter="20">
      <slot></slot>
    </el-row>
  </div>
</template>

<script>

export default {
  created() {
    this.$on('change', this.onChangeValue);
    this.$on('pre-submit', this.onSubmit);
  },
  props: {
    value: [Object],
  },
  provide() {
    return {
      params: this.value,
    };
  },
  methods: {
    onChangeValue(key, val) {
      const newValue = { ...this.value, [key]: val };
      // eslint-disable-next-line
      newValue.__proto__ = this.value.__proto__;
      this.$emit('input', newValue);
    },
    onSubmit() {
      this.$emit('submit', this.value);
    },
  },
  watch: {
    value: {
      handler(newValue) {
        this.$emit('input', newValue);
      },
      deep: true,
    },
  },
};
</script>

<style lang="less" module>
  
  .my_group {
    width: 100%;
    margin-bottom: 10px;
  }
</style>
