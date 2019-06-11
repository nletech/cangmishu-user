<template>
  <div>
    <el-pagination
                    v-show="+params.total"
                    @current-change="handleCurrentChange"
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
          total: 1,
          currentPage: 1,
        };
      },
    },
  },
  methods: {
    handleCurrentChange(val) {
      console.log(val, '分页组件');
    },
  },
  watch: {
    params() {
      console.log(this.params, 'parmas');
    },
  },
};
</script>
