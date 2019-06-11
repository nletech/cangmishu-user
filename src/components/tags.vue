<template>
          <div :class="$style.public_List">
              <slot name="header"
                    :class="$style.header">
              </slot>
              <slot name="tab"
                    :class="$style.tab">
              </slot>
              <slot name="pagination"
                    :class="$style.pagination">
              </slot>
          </div>
</template>

<script>
export default {
  name: 'tags',
};
</script>
<style lang="less" module>
  .public_List {
    margin: 10px 10px 10px 10px;
    width: 90%;
  }
</style>

