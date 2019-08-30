<template>
  <div :class="[$style.side_nav, !sideNavStatus ? $style.nav_left : $style.init_nav_left]">
    <!-- 侧边栏导航 -->
    <side-nav
      :nav="nav"
      :sideNavList="sideNavList"
    >
    </side-nav>
    <!-- 返回 -->
    <div :class="$style.title">
      <el-row :class="[$style.title_text, $style.title_texts][sideNavStatus]">
        <el-col :span="12">
          {{$t(key)}}&nbsp;
          <span v-if="shopName">/</span>
          &nbsp;&nbsp;
          <span></span>{{shopName}}
          <el-popover
              v-if="shopTips"
              placement="top-start"
              title="Tips:"
              width="360"
              trigger="hover"
              >
              <span>
                您可以通过新增店铺生成仓库专属的订货小程序，
                生成店铺后添加商品就能同步仓库内的货品至您的订货小程序，
                用户通过小程序下单可直接生成货品出库单。
                在仓库的业务往来中，无需再手动填单、下单，用订货小程序一键下单即可生成货品出库单。
                （一个仓库可生成多个店铺小程序哦!）
              </span>
              <el-button size="mini" type="text" slot="reference" icon="el-icon-question"></el-button>
          </el-popover>
        </el-col>
        <el-col
          :span="12"
          style="text-align: right;"
        >
          <el-button
            type="text"
            @click="$router.go(-1)"
            icon="el-icon-back"
          >
            返回
          </el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 右侧主要内容展示区 -->
    <router-view
      :key="key"
      :class="$style.content"
    >
    </router-view>
    <!-- 底部产权说明 -->
    <div :class="$style.footer">
      <div :class="$style.footer_description">
          <span>Copyright © 2019，Hunan NLE Network Technolgy Co, Ltd</span>
          <i class="iconfont">&#xe604;</i>
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
@import '../../less/public_variable.less';
.nav_left {
  padding-left: 200px;
}
.init_nav_left {
  padding-left: 76px;
}
.side_nav {
  .title_text {
    margin: 0 30px 0 220px;
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
</style>
