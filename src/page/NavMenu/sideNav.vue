<template>
  <div :class="$style.side_nav" class="side_nav">
      <!-- 菜单列表 -->
      <transition name="fade">
                  <!-- 仓秘书 -->
                  <div  v-if="!sideNavStatus"
                        :class="$style.nav"
                        @mouseleave="handleLeave()">
                        <!-- 侧边栏导航 -->
                        <ul  :class="$style.side_nav_ul">
                              <li  :class="$style.side_nav_li"
                                  v-for="(item, index) in sideList"
                                  :key="index"
                                  @mouseover="showItem(item.name, index)">
                                  <i  :class="$style.li_icon"
                                        class="iconfont"
                                        v-html="item.icon">
                                  </i>
                                  <span   :class="$style.li_title"
                                          @click="handleHomeClick(item.name)">
                                          {{$t(item.name)}}
                                  </span>
                              </li>
                        </ul>
                        <!-- 对应的子菜单 -->
                        <ul  :class="$style.NavChild"
                            ref="NavChild"
                            v-show="li_show_switch"
                            @click="handleClickCloseNavChild">
                              <li  :class="$style.NavChild_li"
                                   v-for="item in li_NavChild"
                                   @click.self="handlerClick(item.name)"
                                   :key="item.name">
                                   {{$t(item.name)}}
                              </li>
                        </ul>
                  </div>
      </transition>
      <transition name="fade">
                  <!-- 仓秘书 -->
                  <div  v-show="sideNavStatus"
                        @mouseleave="handleLeave1()">
                        <!-- 侧边栏导航 -->
                        <ul  style="padding: 0;">
                              <li  v-for="(item, index) in sideList" style="width: 100%; line-height: 80px; height: 80px; text-align: center; list-style: none; cursor: pointer;"
                                  :key="index"
                                  @mouseover="showItem1(item.name, index)">
                                  <i  class="iconfont"
                                      v-html="item.icon"
                                      style="color: #ccc;"
                                      @click="handleHomeClick1(item.name)">
                                  </i>
                              </li>
                        </ul>
                        <!-- 对应的子菜单 -->
                        <ul  :class="$style.NavChild1"
                             ref="NavChild1"
                             v-show="li_show_switch"
                             @click="handleClickCloseNavChild">
                              <li  v-for="item in li_NavChild"
                                   :class="$style.NavChild_li1"
                                   @click.self="handlerClick1(item.name)"
                                   :key="item.name">
                                   {{$t(item.name)}}
                              </li>
                        </ul>
                  </div>
      </transition>
  </div>
</template>
<script>
export default {
  name: 'sideNav',
  props: ['nav', 'sideNavList'],
  data() {
    return {
      li_show_switch: true, // 子菜单显示开关
      li_NavChild: [], // 子菜单数组
      ul_Nav: this.sideNavList, // 缓存的路由表
    };
  },
  methods: {
    handlerClick(name) {
      this.$router.push({ name: `${name}` });
    },
    // 子菜单操作
    showItem(itemName, index) {
      /* eslint-disable */
      let subMeanu = []; // 缓存子菜单
      let distance; // 缓存计算的距离
      const menu = this.sideNavList;
      for (let i = 0; i < menu.length; i += 1) {
        if (menu[i].name === itemName) {
          if (index === 0) {
            this.li_show_switch = false;
            return;
          } // 鼠标悬浮到侧边栏首页不展示子列表
          this.li_show_switch = true;
          distance = `${(i * 80) + 40}px`; // 根据计算修改子菜单对应的布局
          menu[i].children.forEach((e) => {
            if (e.nav === 2) { // 这里是筛特定的路由
              subMeanu.push(e);
            }
          });
        }
      } // 这个循环实现的思路：通过点击不同的侧边栏导航项来展示不同的导航项对应的子菜单
      this.$refs.NavChild.style.margin = `${distance} 0 0 0 `; // 输出处理后的计算值
      this.li_NavChild = subMeanu; // 输出子菜单
    },
    handleClickCloseNavChild() {
      this.li_show_switch = false;
    }, // 点击关闭子菜单
    handleLeave() {
      this.li_show_switch = false;
    }, // 移出鼠标，关闭子菜单
    handleHomeClick(name) {
      if (name === 'initPage') {
        this.$router.push({ name: 'home' });
      }
    }, // 只有点击侧边栏 首页 路由跳转才生效
    // 以下是收缩之后
    handlerClick1(name) {
      this.$router.push({ name: `${name}` });
    },
    // 子菜单操作
    showItem1(itemName, index) {
      /* eslint-disable */
      let subMeanu = []; // 缓存子菜单
      let distance; // 缓存计算的距离
      const menu = this.sideNavList;
      for (let i = 0; i < menu.length; i += 1) {
        if (menu[i].name === itemName) {
          if (index === 0) {
            this.li_show_switch = false;
            return;
          } // 鼠标悬浮到侧边栏首页不展示子列表
          this.li_show_switch = true;
          distance = `${(i * 80) + 40}px`; // 根据计算修改子菜单对应的布局
          menu[i].children.forEach((e) => {
            if (e.nav === 2) { // 这里是筛特定的路由
              subMeanu.push(e);
            }
          });
        }
      } // 这个循环实现的思路：通过点击不同的侧边栏导航项来展示不同的导航项对应的子菜单
      this.$refs.NavChild1.style.margin = `${distance} 0 0 0 `; // 输出处理后的计算值
      this.li_NavChild = subMeanu; // 输出子菜单
    },
    handleClickCloseNavChild() {
      this.li_show_switch = false;
    }, // 点击关闭子菜单
    handleLeave1() {
      this.li_show_switch = false;
    }, // 移出鼠标，关闭子菜单
    handleHomeClick1(name) {
      if (name === 'initPage') {
        this.$router.push({ name: 'home' });
      }
    }, // 只有点击侧边栏 首页 路由跳转才生效
  },
  computed: {
    sideList() {
      // console.log(this.sideNavList, 'this.sideNavList');
      return this.sideNavList;
    },
    // 仓秘书
    sideNavData() {
      return this.nav.children.filter(item => item.nav === 2);
    },
    sideNavTitle() {
      return this.nav;
    },
    sideNavStatus() {
      return +this.$store.state.config.shutdown_status;
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
  padding-top: 40px;
  .side_nav_title {
    margin-top: 61px;
    background:rgba(185,173,255,.2);
    font-size:16px;
    color: @white;
    display: flex;
    flex-flow: row wrap;
    // padding-left: 50px;
    line-height: 34px;
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
    min-width: 231px;
    width: 231px;
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
    background-color: red;
    width: 200px;
    list-style: none;
    text-align: center;
    position: absolute;
    top: 0;
    left: 231px;
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
    margin-top: 70px;
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
