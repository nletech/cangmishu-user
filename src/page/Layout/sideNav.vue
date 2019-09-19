<template>
  <div :class="$style.side_nav" class="side_nav">
      <el-menu
          default-active="1-4-1"
          class="el-menu-vertical-demo"
          background-color="#444154"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="!!sideNavStatus">
          <el-submenu
              style="text-align: center;"
              v-for="(item, index) in sideList"
              :key="item.name"
              :index="`${index + 1}`">
              <template slot="title">
                  <i style="color: #fff;" class="iconfont" v-html="item.icon"></i>
                  <span slot="title" style="font-size: 1.3rem;">{{$t(`${item.name}`)}}</span>
              </template>
              <el-menu-item-group>
                  <el-menu-item
                    style="text-align: center;"
                    v-for="(item, i) in sideList[index].children"
                    :key="i"
                    v-if="item.nav === 2"
                    @click="$router.push({ name: item.name, path: item.path});"
                    :index="new Date()">
                    <span style="font-size: 1.1rem;">{{$t(`${item.name}`)}}</span>
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
@import '../../less/public_variable.less';
.side_nav {
  height: 100%;
  position: fixed;
  left: 0;
  top: 80px;
  z-index: 1000;
  min-width: 80px;
  background: #444154;
  .side_nav_title {
    background:rgba(185,173,255,.2);
    font-size:16px;
    color: @white;
    display: flex;
    flex-flow: row wrap;
    i {
      font-size: 17px;
    }
    span {
      display: block;
      margin-top: 1px;
      font-weight: 600;
      margin-left: 11px;
    }
  }
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
      font-size: 16px;
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
        background: #463F74;
      }
    }
  }
  .NavChild {
    margin: 0;
    padding: 0; // 解决浏览器中 ul 自动右移 40px
    width: 200px;
    list-style: none;
    text-align: center;
    position: absolute;
    top: 0;
    left: 200px;
    .NavChild_li {
      color: #fff;
      background-color: #444154;
      padding: 20px 0 0 0;
      width: 100%;
      height: 40px;
      font-size: 1.1rem;
      &:hover {
        cursor: pointer;
        background: #463F74;
      }
    }
  }
  .nav_hidden {
    background-color: red;
    position: relative;
    .nav_li_hidden {
      padding: 4px;
    }
  }
  .NavChild1 {
    margin: 0;
    padding: 0; // 解决浏览器中 ul 自动右移 40px
    background-color: red;
    width: 160px;
    list-style: none;
    text-align: center;
    position: absolute;
    top: 0;
    left: 80px;
    .NavChild_li1 {
      color: #fff;
      background-color: #444154;
      padding: 20px 0 0 0;
      width: 100%;
      height: 40px;
      font-size: 1.1rem;
      &:hover {
        cursor: pointer;
        background: #463F74;
      }
    }
  }
}

</style>
<style lang="less">
@import '../../less/public_variable.less';
.side_nav {
  .router-link-active {
    border-radius: 5px;
  }
  .el-menu-vertical-demo {
    margin-top: 60px;
  }
  .el-menu {
    border: none;
  }
  .el-menu--collapse {
    width: 80px;
  }
  .iconfont {
    font-size: 1.8rem;
  }
}
</style>
<style>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
