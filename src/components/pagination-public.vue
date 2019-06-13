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
  // 二次封装分页公共组件
  name: 'paginationPublic',
  props: {
    params: {
      type: Object,
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit('changePage', val);
    },
  },
};
</script>
