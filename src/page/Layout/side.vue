<template>
  <div :class="[$style.side_nav]">
    <!-- 侧边栏导航 -->
    <side-nav :nav="nav" :sideNavList="sideNavList"></side-nav>
    <div :class="$style.content_container">
      <!-- 返回 -->
      <div :class="[$style.title, !sideNavStatus ? $style.nav_left : $style.init_title_left]">
        <el-row :class="[$style.title_text, $style.title_texts][sideNavStatus]">
          <el-col :span="12">
            {{$t(key)}}&nbsp;
            <span v-if="shopName">/</span>
            &nbsp;&nbsp;
            <span>{{shopName}}</span>
            <el-popover
              v-if="shopTips"
              placement="top-start"
              title="Tips:"
              width="360"
              trigger="hover"
            >
              <span>{{$t('shoptips')}}</span>
              <el-button size="mini" type="text" slot="reference" icon="el-icon-question"></el-button>
            </el-popover>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button type="text" @click="$router.go(-1)" icon="el-icon-back">{{$t('Back')}}</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 右侧主要内容展示区 -->
      <router-view
        :key="key + change"
        :class="[$style.content, !sideNavStatus ? $style.nav_left : $style.init_content_left]"
      ></router-view>

      <!-- 底部说明 -->
      <div :class="$style.footer">
        <div :class="$style.footer_description">
          <span>Copyright © 2019，Hunan NLE Network Technolgy Co, Ltd</span>
          <i class="iconfont">&#xe604;</i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import sideNav from './sideNav';

export default {
  name: 'side',
  components: {
    sideNav,
  },
  computed: {
    nav() {
      return this.$store.state.routerData.routerMap[0].children.filter(
        item => item.name === this.$route.matched[1].name,
      )[0];
    },
    // 仓秘书
    sideNavList() {
      return this.$store.state.routerData.routerMap[0].children;
    },
    key() {
      return this.$route.name;
    },
    change() {
      return this.$store.state.config.currentLanguage;
    },
    shopName() {
      return this.$route.query.shopName_cn;
    },
    shopTips() {
      return this.$route.name === 'shopsManagement';
    },
    sideNavStatus() {
      return +this.$store.state.config.shutdown_status;
    },
  },
};
</script>
<style lang="less" module>
@import "../../less/public_variable.less";
.side_nav {
  display: flex;
  overflow-x: hidden;
  transition: .5s;
  .content_container {
    display: flex;
    flex-direction: column;
    width: 100%;
    .title_text {
      margin: 0 30px 0 80px;
    }
    .title_texts {
      margin: 0 30px 0 100px;
    }
    .content {
      min-height: 76.6vh;
      background: url("../../assets/img/img.png") no-repeat right bottom;
      margin-left: 200px;
      margin-top: 72px;
      overflow-x: hidden;
    }
    .title {
      height: 60px;
      width: calc(100% - 200px);
      top: 80px;
      position: fixed;
      margin-left: 200px;
      border: 1px solid @separateLine;
      background: @white;
      color: @textColor;
      font-size: 16px;
      z-index: 99;
      left: 0px;
      line-height: 60px;
    }
    .init_title_left {
      margin-left: 0;
      width: 100%;
    }
    .init_content_left {
      margin-left: 80px;
    }
    .footer {
      border: 1px solid @separateLine;
      background: @white;
      color: @textColor;
      text-align: center;
      height: 80px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        font-size: 40px;
        position: relative;
        top: 10px;
        color: @separateLine;
      }
    }
  }
}
</style>
