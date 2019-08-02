<template>
  <section v-show="loading" :class="$style.loading_main">
      <div :class="$style.loading_animation">
          <div :class="$style.loading_img">
          </div>
      </div>
  </section>
</template>

<script>
export default {
  name: 'loading',
  data() {
    return {
      loading: true,
    };
  },
};
</script>

<style lang="less" module>
</style>

