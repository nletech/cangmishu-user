<template>
        <div v-if="+total > 0">
              <el-pagination  @current-change="handleCurrentChange"
                              :current-page="this.params.currentPage"
                              layout="total, prev, pager, next, jumper"
                              :total="+this.params.total">
              </el-pagination>
        </div>
</template>
<script>
export default {
  // 二次封装分页公共组件
  name: 'paginationPublic',
  props: {
    params: {
      type: Object,
    },
  },
  computed: {
    total() {
      if (this.params.total) {
        return this.params.total;
      }
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit('changePage', val);
    },
  },
};
</script>
