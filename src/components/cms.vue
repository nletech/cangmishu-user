<template>
  <div class="wms-tag">
    <div :class="$style.wms_tag_container_table">
      <div :class="$style.wms_tag_container">
        <el-row>
          <el-col :span="20">
            <!-- 标签页  -->
            <el-tabs :value="value"
                     @tab-click="handleClick">
                     <el-tab-pane  v-for="item in tagList"
                                   :label="item.label"
                                   :name="item.name"
                                   :key="item.name">
                     </el-tab-pane>
            </el-tabs>
          </el-col>
          <!-- 添加按钮 -->
          <el-col v-if="addText"
                  :span="4"
                  :class="$style.text_right">
                  <el-button  type="text"
                              @click="$router.push({
                                name: addText,
                                query: {id: query && query}
                              })"
                              icon="el-icon-plus">
                              {{$t(addText)}}
                  </el-button>
          </el-col>
        </el-row>
      </div>
      <!-- 自定义插槽 -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tagList: [Array], // 标签页数组
    value: [String], // 选择标签页的值
    addText: [String], // 添加按钮文字
    query: [String, Number], // 查询路由
  },
  methods: {
    // 返回选中的tag
    handleClick(val) {
      this.$emit('input', val.name);
      this.$emit('change', val.name);
      this.$router.replace({
        query: { ...this.$route.query, type: val.name },
      });
    },
  },
};
</script>

<style lang="less" module>
@import '../less/public_variable.less';
.wms_tag_container {
  margin: 10px 0 10px 0;
  padding: 0 20px 0 48px;
  background: @white;
  .text_right {
    text-align: right;
    line-height: 48px;
  }
}
.wms_tag_container_table {
  padding: 10px 25px 20px 25px ;
  .page {
    margin-top: 10px;
  }
}
</style>
<style lang="less">
@import '../less/public_variable.less';
.wms-tag {
  .el-tabs__nav-wrap::after {
    display: none;
  }
  .el-tabs__header {
    margin: 0;
    .el-tabs__item {
      height:50px;
      line-height: 50px;
      font-size: 16px;
    }
  }
}
</style>
