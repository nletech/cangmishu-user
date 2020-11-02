<template>
      <div :class="$style.page">
        <div :class="$style.main">
            <div  :class="$style.header">
                <slot name="search"></slot>
            </div>
            <slot></slot>
        </div>
      </div>
</template>
<style lang="less" module>

.page {
  .main {
    margin: 0 auto;
    .header {
      margin: 0 0 10px 0;
      .header_btn {
        font-size: @fontSize;
      }
    }
  }
}
.pagination {
  margin: 10px 0 0 0;
  float: right;
}
</style>
