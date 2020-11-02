<template>
  <div class="side">
    <!-- 侧边栏导航 -->
    <side-nav :nav="nav" :sideNavList="sideNavList"></side-nav>
    <div class="content-container">
      <div class="tags-view">
        <tags-view />
      </div>
      <!-- 右侧主要内容展示区 -->
      <div class="content">
        <router-view style="padding: 20px" :key="key + change"></router-view>
        <!-- 底部说明 -->
        <div class="footer">
          <div class="footer_description">
            <span
              >Copyright © {{ year }}，Hunan NLE Network Technolgy Co, Ltd {{version}}</span
            >
            <i class="iconfont">&#xe604;</i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import sideNav from './sideNav';
import TagsView from './components/tagsView';

export default {
  name: 'side',
  components: {
    sideNav,
    TagsView,
  },
  computed: {
    version() { return process.env.VUE_APP_VERSION },
    year() {
      return new Date().getFullYear()
    },
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
  },
};
</script>
<style lang="less">
.side {
  display: flex;
  overflow-x: hidden;
  transition: 0.5s;
  display: grid;
  grid-template-columns: 120px 1fr;
  .content-container {
    display: grid;
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;
    .content {
      min-height: calc(100vh - 143px);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: url("../../assets/img/img.png") no-repeat right bottom;
      width: 100%;
      overflow-x: hidden;
      position: absolute;
      top: 62px;
    }
    .tags-view {
      width: calc(100% - 134px);
      height: 60px;
      position: fixed;
      top: 80px;
      border: 1px solid @separateLine;
      background: @white;
      color: @textColor;
      font-size: 16px;
      z-index: 99;
      line-height: 60px;
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
