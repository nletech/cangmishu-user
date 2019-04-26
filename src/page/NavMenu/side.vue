<template>
  <div :class="[$style.side_nav, !sideNavStatus ? $style.nav_left : $style.init_nav_left]">
    <side-nav :nav="nav"></side-nav>
    <div :class="$style.title">
      <el-row :class="[$style.title_text, $style.title_texts][sideNavStatus]">
        <el-col :span="12">
          {{$t(key)}}
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <el-button type="text" @click="$router.go(-1)" icon="el-icon-back">返回</el-button>
        </el-col>
      </el-row>
    </div>
    <router-view :key="key" :class="$style.content"></router-view>
    <div :class="$style.footer">
      Copyright © 2018 EU Techne B.V.（2.0.1）技术支持<i class="iconfont">&#xe604;</i>
    </div>
  </div>
</template>
<script>
import sideNav from './sideNav';

export default {
  components: {
    sideNav,
  },
  computed: {
    nav() {
      return this.$store.state.routerData.routerMap[0].children.filter(
        item => item.name === this.$route.matched[1].name,
      )[0];
    },
    key() {
      return this.$route.name;
    },
    sideNavStatus() {
      return +this.$store.state.config.shutdown_status;
    },
  },
  name: 'side',
};
</script>
<style lang="less" module>
@import '../../less/public_variable.less';
.nav_left {
  padding-left: 231px;
}
.init_nav_left {
  padding-left: 76px;
}
.side_nav {
  .title_text {
    margin: 0 30px 0 260px;
  }
  .title_texts {
    margin: 0 30px 0 100px;
  }
  .content {
    min-height: 76.6vh;
    padding-top: 140px;
    width: 100%;
    background: url('../../assets/img/img.png') no-repeat right bottom;
  }
  .title {
    height: 60px;
    width: 100%;
    top: 80px;
    position: fixed;
    border: 1px solid @separateLine;
    background: @white;
    color: @textColor;
    font-size: 18px;
    z-index: 99;
    left: 0px;
    line-height: 60px;
  }
  .footer {
    height: 80px;
    border: 1px solid @separateLine;
    background: @white;
    color: @textColor;
    text-align: center;
    line-height: 80px;
    i {
      font-size: 40px;
      position: relative;
      top: 20px;
      left: 5px;
      color: @separateLine;
    }
  }
}
</style>
