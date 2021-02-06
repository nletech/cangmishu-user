<template>
  <el-button
    :type="type"
    :class="$style.btn"
    :size="size"
    @click="handleClick"
    :icon="icon"
    :loading="loading"
  >
    {{ $t(text) }}
  </el-button>
</template>

<script>
export default {
  name: 'buttonPublic',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    },
    size: {
      type: String,
      default: 'small'
    },
    icon: {
      type: String,
      default: 'el-icon-plus'
    },
    text: {
      type: String,
      default: '',
      required: true
    }
  },
  methods: {
    handleClick() {
      this.$emit('handleClickCallBack', true);
    }
  }
};
</script>

<style lang="less" module>
.btn {
  font-size: @fontSize;
}
</style>
