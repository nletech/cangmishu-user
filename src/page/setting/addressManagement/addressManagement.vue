<template>
  <div class="addressManagement">
    <div :class="$style.addressManagement">
      <div :class="$style.am_main">
        <!-- 标签页 -->
        <el-row
        >
          <div :class="$style.am_operation_btn">
            <span @click="addInfo"><i class="iconfont">&#xe618;</i>添加发件信息</span>
          </div>
          <el-tabs
            :class="$style.am_tabs"
            v-model="activeName"
            >
            <el-tab-pane
              :class="$style.am_tabs_item"
              label="收件信息"
              name="first">
            </el-tab-pane>
            <el-tab-pane
              :class="$style.am_tabs_item"
              label="发件信息"
              name="second">
              配置管理
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'addressManagement',
  data() {
    return {
      tabs: [
        {
          item: '发件信息',
          btn_text: '添加发件信息',
        }, {
          item: '收件信息',
          btn_text: '添加收件信息',
        },
      ],
    };
  },
  methods: {
    addInfo() {
      console.log('add');
    },
  },
};
</script>
<style lang="less" module>
@import '../../../less/public_variable.less';

.addressManagement {
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
      font-size: 1.1rem;
    }
  }
}
</style>
<style lang="less">
  .addressManagement {
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
