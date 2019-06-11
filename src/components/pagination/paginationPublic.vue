<template>
  <div class="pagination_and_buttons">
    <el-row>
      <el-col :lg="6" :md="8" :sm="8">
              <el-button  v-for="(item, index) in lists"
                          :key="index"
                          @click="item.method"
                          :loading="item.loading"
                          :disabled="item.disabled ? item.disabled : false">
                          {{item.name}}
                          </el-button>
      </el-col>

      <el-col  v-if="+pageParams.data_count"
               :lg="{span: 13, offset: lists?5:11}"
               :md="{span: 15, offset: lists?1:9}"
               :sm="{span: 16, offset: lists?0:8}"
               style="text-align:right;">
               <el-pagination  @current-change="pageParams.__proto__.handleCurrentChange"
                               :current-page="pageParams.page"
                               :page-size="pageParams.size"
                               layout="total, prev, pager, next, jumper"
                               :total="+pageParams.data_count">
               </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    sizesList: {
      type: Array,
      default() {
        return [10, 20, 50, 100, 200];
      },
    },
    pageParams: Object,
    lists: Array,
  },
};
</script>
<style lang="less">
  .pagination_and_buttons{
    padding: 20px 5px;
    // background: #fff;
    .el-button+.el-button{
      margin-left: 0;
      border-left: none;
    }
    .el-pager li {
      background: transparent;
    }
    .btn-next,.btn-prev {
      background: transparent;
    }
    .el-pagination button.disabled {
      background: transparent;
    }
    .el-button{
      border-radius: 0;
      color: #636f7a;
      border-color: #bfbfbf;
      padding: 8px 13px;
      font-size: 14px;
      text-align: center;
      &:hover{
        background-color: #d4d4d4;
        border: 1px solid #c4c4c4;
      }
      &:focus{
        border-color: #bfbfbf;
      }
      &:first-child{
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
      }
      &:last-child{
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
      }
    }
    .is-disabled{
      &:focus, &:hover{
        color: #888;
      }
    }
    .el-pagination{
      .el-pagination__sizes{
        margin: 0 0 0 10px;
      }
      .el-pagination__total{
        margin: 0 0 0 10px;
      }
    }
  }
</style>
