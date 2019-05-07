<template>
  <el-dialog
    title="盘点详情"
    :visible.sync="this.showCheck"
    width="60%"
  >
  <span>这里有一表单</span>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="handleCloseDialog">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'stockTakingCheck',
  props: {
    showCheck: Boolean,
  },
  methods: {
    handleCloseDialog() {
      this.showCheck = false;
      this.$emit('update: showCheck', false);
    },
  },
};
</script>

<style lang="less" module>
.util {
  text-align: right;
  margin: 20px;
}
.el-col {
  margin-bottom: 20px;
}
</style>
