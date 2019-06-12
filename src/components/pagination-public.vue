<template>
  <div>
    <el-pagination  @current-change="handleCurrentChange"
                    :current-page="params.currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="+params.total">
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: 'paginationPublic',
  props: {
    params: {
      type: Object,
      default() {
        return {
          total: this.params.total,
          currentPage: 1,
        };
      },
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit('changePage', val);
    },
  },
  watch: {
    params() {
      console.log(this.params, 'parmas');
    },
  },
};
</script>
