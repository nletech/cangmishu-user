<template>
  <div>
    <el-pagination  :class="$style.pagination"
                    v-show="+total"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="+total">
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: 'cmsPagination',
  props: {
    params: [Object],
  },
  data() {
    return {
      currentPage: 1,
      total: 20,
    };
  },
  methods: {
    handleCurrentChange() {
      console.log('分页组件');
    },
  },
};
</script>

<style lang="less" module>
.pagination {
  margin: 10px 0 10px 0;
  position: relative;
  top: -10px;
  right: 10px;
}
</style>
