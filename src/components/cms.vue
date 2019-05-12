<template>
  <div class="cms">
    <div :class="$style.addressManagement">
      <div :class="$style.am_main">
        <!-- 标签页 -->
        <el-row
        >
          <div :class="$style.am_operation_btn">
            <span @click="addInfo">
              <i class="iconfont">&#xe618;</i>
              添加发件信息
            </span>
          </div>
          <el-tabs
            :class="$style.am_tabs"
            v-model="tabsInfo.active_name"
            >
              <el-tab-pane
                :class="$style.am_tabs_item"
                v-for="item in tabsInfo.tabs"
                :key="item.id"
                :label="item.name"
                :name="item.name">
              </el-tab-pane>
          </el-tabs>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'cms',
  props: {
    tabsInfo: [Object],
    btn_text: [String],
  },
  data() {
    return {
    };
  },
  methods: {
    addInfo() {
      console.log('addInfo');
    },
  },
};
</script>
<style lang="less" module>
@import '../less/public_variable.less';

.cms {
  margin: 40px 0 10px 0;
  .am_main {
    width: 90%;
    margin: 0 auto;
    position: relative;
    .am_operation_btn {
      position: absolute;
      top: 50px;
      right: 0;
      z-index: 3;
      border: none;
      font-size: 1.15rem;
      &:hover {
        color: @ThemeColor;
      }
    }
  }
}
</style>
<style lang="less">
  .cms{
    .el-tabs__nav-scroll {
      .el-tabs__nav {
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
        // background-color: orange;
        float: none;
        .el-tabs__item {
          width: 50%;
          text-align: center;
          font-size: 1.2rem;
        }
      }
    }
    .el-tabs {
      .el-tabs__content {
        margin: 80px 0 0 0;
      }
    }
  }
</style>
