<template>
  <div class="cms">
    <div :class="$style.am">
      <div :class="$style.am_main">
          <!-- 点击按键 -->
          <div :class="$style.am_operation_btn">
               <span  @click="add_btn">
                      <i class="iconfont">&#xe618;</i>
                      {{`添加${active_tab_name_cms}`}}
               </span>
          </div>
          <!-- 标签页 -->
          <el-tabs  v-model="active_tab_name_cms"
                    :class="$style.am_tabs">
                    <el-tab-pane  :class="$style.am_tabs_item"
                                  v-for="item in tabs_cms"
                                  :key="item.id"
                                  :label="item.name"
                                  :name="item.name">
                    </el-tab-pane>
          </el-tabs>

          <!-- 插入数据 -->
          <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'cms-model',
  props: {
    tabs: [Array], // 标签列表
    active_tab_name: [String], // 当前选定的 tab
  },
  mounted() {
    this.tabs_cms = this.tabs; // 避免直接修改 props
    this.active_tab_name_cms = this.active_tab_name; // 避免直接修改 props
  },
  data() {
    return {
      tabs_cms: [],
      active_tab_name_cms: '',
    };
  },
  watch: {
    active_tab_name_cms() {
      this.$emit('act_name_callback', this.active_tab_name_cms); // 显示不同的 tab 数据
      return this.active_tab_name_cms; // 监听活动标签
    },
  },
  methods: {
    add_btn() {
      this.$emit('add_callback', this.active_tab_name_cms);
    },
  },
};
</script>
<style lang="less" module>
@import '../../less/public_variable.less';

.am {
  .am_main {
    width: 90%;
    margin: 0 auto;
    position: relative;
    .am_tabs {
      height: 60px;
      background: #fff;
    }
    .am_operation_btn {
      position: relative;
      top: 0;
      left: 90%;
      margin: 0 0 15px 0;
      border: none;
      font-size: 1.2rem;
      // font-weight: bold;
      color: @ThemeColor;
      cursor: pointer;
    }
  }
}
</style>
<style lang="less">
  .cms {
    .el-tabs__nav-scroll {
      .el-tabs__nav {
        display: flex;
        position: relative;
        justify-content: space-around;
        align-items: center;
        padding: 10px 0 10px 0;
        float: none;
        .el-tabs__item {
          // width: 50%;
          flex: 1;
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
  .el-pagination {
    margin: 20px 0 0 0;
    float: right;
  }
</style>
