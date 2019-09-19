<template>
  <div :class="$style.side_nav" class="side_nav">
      <!-- 菜单列表 -->
      <div
          v-if="!sideNavStatus"
          :class="$style.nav"
          @mouseleave="handleLeave()">
          <!-- 侧边栏导航 -->
          <ul  :class="$style.side_nav_ul">
                <li
                    :class="$style.side_nav_li"
                    v-for="(item, index) in sideList"
                    :key="index"
                    @click="handleHomeClick(item.name)"
                    @mouseover="showItem(item.name, index)">
                    <i
                        :class="$style.li_icon"
                        class="iconfont"
                        v-html="item.icon">
                    </i>
                    <span
                        :class="$style.li_title">
                        {{$t(item.name)}}
                    </span>
                </li>
          </ul>
          <!-- 对应的子菜单 -->
          <ul  :class="$style.NavChild"
                ref="NavChild"
                v-show="li_show_switch"
                @click="handleClickCloseNavChild">
                <li
                    :class="$style.NavChild_li"
                    v-for="item in li_NavChild"
                    @click.self="handlerClick(item.name)"
                    :key="item.name">
                    {{$t(item.name)}}
                </li>
          </ul>
      </div>
      <div
          v-show="sideNavStatus"
          @mouseleave="handleLeave1()">
          <!-- 侧边栏导航收缩之后 -->
          <ul style="padding: 0;">
              <li
                  v-for="(item, index) in sideList"
                  style="width: 100%; line-height: 80px;
                          height: 80px; text-align: center;
                          list-style: none; cursor: pointer;"
                  :key="index"
                  @click="handleHomeClick1(item.name)"
                  @mouseover="showItem1(item.name, index)">
                  <i
                      class="iconfont"
                      v-html="item.icon"
                      style="color: #ccc;">
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
                      @click="handlerClick1(item.name)"
                      :key="item.name">
                      {{$t(item.name)}}
                </li>
          </ul>
      </div>
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
    innerHeight() {
      let a = window.innerHeight;
      return a;
    },
  },
  methods: {
    handlerClick(name) {
      this.$router.push({ name: `${name}` });
    },
    // 子菜单操作
    showItem(itemName, index) {
      this.$refs.NavChild.style.position = ``; // 初始化
      // this.$refs.NavChild.style.bottom = ``; // 初始化
      /* eslint-disable */
      let subMeanu = []; // 缓存子菜单
      let distance; // 缓存计算的距离
      let innerHeight = window.innerHeight; // 当前窗口的高度
      let subMeanuInnerHeight = ''; // 子路由列表的总 innerHeight
      let menu = this.checkedSideNavList();
      for (let i = 0; i < menu.length; i += 1) {
        if (menu[i].name === itemName) {
          if (index === 0 || index === 4 || index === 6 ) {
            this.li_show_switch = false;
            return;
          } // 鼠标悬浮到侧边栏 首页 和 帮助 模块的时候不显示子列表
          this.li_show_switch = true;
          menu[i].children.forEach((e) => {
            if (e.nav === 2) {
              subMeanu.push(e);
            } // 这里是筛特定的子路由作为子菜单
          });
          distance = `${(i * 80) + 40}`; // 根据计算修改子菜单对应的布局
          subMeanuInnerHeight = `${+distance + (subMeanu.length * 80) + 80}`;
        }
      } // 这个循环实现的思路：通过点击不同的侧边栏导航项来展示不同的导航项对应的子菜单
      if (subMeanuInnerHeight > innerHeight) { // 兼容小屏幕
        // this.$refs.NavChild.style.position = `fixed `; // 沉底
        // this.$refs.NavChild.style.bottom = `0 `; // 沉底
      } else {
        this.$refs.NavChild.style.margin = `${distance}px 0 0 0 `; // 输出处理后的子菜单 margin 计算值
      }
      this.li_NavChild = subMeanu; // 输出子菜单
    },
    handleClickCloseNavChild() {
      this.li_show_switch = false;
    }, // 点击关闭子菜单
    handleLeave() {
      this.li_show_switch = false;
      this.$refs.NavChild.style.margin = 'none'; // 输出处理后的子菜单 margin 计算值
    }, // 移出鼠标，关闭子菜单
    handleHomeClick(name) {
      if (name === 'initPage') {
        this.$router.push({ name: 'home' });
      }
      if (name === 'help') {
        this.$router.push({ name: 'helpCenter' });
      }
      if (name === 'shops') {
        this.$router.push({ name: 'shops' });
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
      const menu = this.checkedSideNavList();
      for (let i = 0; i < menu.length; i += 1) {
        if (menu[i].name === itemName) {
          if (index === 0 || index === 4 || index === 6  ) {
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
      if (name === 'help') {
        this.$router.push({ name: 'helpCenter' });
      }
      if (name === 'shops') {
        this.$router.push({ name: 'shops' });
      }
    }, // 只有点击侧边栏 首页 路由跳转才生效
    checkedSideNavList () {
      if (+localStorage.getItem('setUType') !== 0) { // 如果是员工账号则检测对应的模块权限
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
        return result;
      }
      return this.sideNavList;
    }
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
