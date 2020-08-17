<template>
  <div :class="$style.side_nav" class="side_nav">
    <el-menu
      :default-active="this.$route.name"
      class="el-menu-vertical-demo"
      background-color="#444154"
      text-color="#fff"
      active-text-color="#ffd04b"
      :collapse="!!sideNavStatus"
    >
      <el-submenu
        style="text-align: center;"
        v-for="(item, index) in sideList"
        :key="item.name"
        :index="item.name"
      >
        <template slot="title">
          <i style="color: #fff;" class="iconfont" v-html="item.icon"></i>
          <span slot="title" style="font-size: 16px;">{{$t(`${item.name}`)}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            style="text-align: left; padding-left: 96px;"
            :class="$style.menuItem"
            v-for="item in sideList[index].children"
            :key="item.name"
            v-if="item.nav === 2"
            @click="$router.push({ name: item.name, path: item.path});"
            :index="item.name"
          >
            <span style="font-size: 14px;">{{$t(`${item.name}`)}}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: 'sideNav',
  props: ['nav', 'sideNavList'],
  computed: {
    sideList() {
      if (+localStorage.getItem('setUType') !== 0) { // 如果是员工账号则检测对应的模块权限
        /* eslint-disable */
        let user = JSON.parse(localStorage.getItem('setUModules')); // 拿到的模块权限
        let result = []; // 预渲染的路由模块
        result.push(this.sideNavList[0]); // 首页模块是账号默认有的
        for (let i = 0; i < user.length; i += 1) { // 后端拿到的权限模块和前端的路由模块进行映射
          for (let j = 0; j < this.sideNavList.length; j += 1) {
            if (user[i] === this.sideNavList[j].index) {
              result.push(this.sideNavList[j]);
            }
          }
        }
        result.push(this.sideNavList[6]); // 帮助模块是账号默认有的
        return result;
      }
      return this.sideNavList;
    },
    sideNavStatus() {
      return +this.$store.state.config.shutdown_status;
    },
  },
  methods: {
    handlerClick(name) {
      this.$router.push({ name: `${name}` });
    },
  },
};
</script>
<style lang="less" module>
@import "../../less/public_variable.less";
.side_nav {
  height: calc(100vh - 80px);
  background: #444154;
  overflow-y: auto;
  overflow-x: hidden;
  position: fixed;
  left: 0;
  z-index: 100;
  .side_nav_ul {
    min-width: 200px;
    width: 200px;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    .side_nav_li {
      list-style: none;
      width: 100%;
      cursor: pointer;
      height: 80px;
      line-height: 80px;
      text-align: center;
      color: @white;
      margin: 0px auto;
      position: relative;
      .li_icon {
        display: inline-block;
        padding: 0 10px 0 0;
      }
      .li_title {
        display: inline-block;
        position: relative;
        top: -4px;
      }
      &:hover {
        background: #463f74;
      }
    }
  }
}
</style>
<style lang="less">
@import "../../less/public_variable.less";
.side_nav {
  font-size: 14px;
  .router-link-active {
    border-radius: 5px;
  }
  .el-menu-vertical-demo {
    margin-top: 20px;
    width: 200px;
  }
  .el-menu {
    border: none;
  }
  .el-menu--collapse {
    width: 80px;
  }
  .iconfont {
    font-size: 1.4rem;
    // font-weight: 400;
  }
}
</style>
<style>
.el-menu-item-group > .el-menu-item {
  padding-left: 60px;
}
.el-menu-item-group__title {
  display: none;
}
.el-menu-item-group ul > li:hover {
  color: #ffd04b !important;
}
.el-menu--vertical .el-menu .el-menu-item {
  padding: 0 !important;
  text-align: center !important;
}
</style>
