<template>
  <div class="from" :class="$style.from">
    <div :class="$style.from_container">
      <el-row :gutter="99">
        <el-col :lg="colValue">
          <slot name="left"></slot>
        </el-col>
        <el-col :lg="24-colValue">
          <slot name="right"></slot>
        </el-col>
      </el-row>
    </div>
    <div :class="$style.submit">
      <slot name="submit"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    colValue: {
      type: Number,
      default: 14,
    },
  },
  data() {
    return {
      checkList: [],
      something: '',
    };
  },
};
</script>

<style lang="less" module>

.from {
  .from_container {
    padding: 45px;
    background: @white;
    min-height: 507px;
    box-shadow:2px 0px 8px rgba(109,96,186,0.3);
    margin: 10px;
  }
  .submit {
    margin: 10px;
    width: 80%;
  }
}
</style>

<style lang="less">
.from {
  .el-checkbox {
    font-weight: bold;
  }
}
</style>
