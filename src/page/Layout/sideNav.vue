<template>
  <div class="side-nav">
    <el-menu
      :default-active="this.$route.name"
      class="el-menu-vertical-demo"
      background-color="#444154"
      text-color="#fff"
      active-text-color="#ffd04b"
      :collapse="true"
    >
      <el-submenu
        style="text-align: center"
        v-for="children in sideList"
        :key="children.name"
        :index="children.name"
      >
        <template slot="title">
          <i style="color: #fff" class="iconfont" v-html="children.icon"></i>
          <span slot="title" style="font-size: 16px">{{
            $t(`${children.name}`)
          }}</span>
        </template>
        <template v-for="item in children.children">
          <el-menu-item-group
            v-if="item.nav === 2 || typeIsChildrenGroup(item.type)"
            :key="item.name"
          >
            <span
              v-if="typeIsChildrenGroup(item.type)"
              slot="title"
              :style="{
                display: 'block',
                margin: typeIsChildrenGroup(item.type) ? '15px 20px' : '0',
              }"
              >{{ $t(`${item.name}`) }}
            </span>
            <el-menu-item
              v-if="item.nav === 2"
              @click="$router.push({ name: item.name, path: item.path })"
              :index="item.name"
            >
              <span style="font-size: 14px">{{ $t(`${item.name}`) }}</span>
            </el-menu-item>
          </el-menu-item-group>
        </template>
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
      console.log(this.sideNavList, 'sideNavList')
      return this.sideNavList;
    },
    sideNavStatus() {
      return +this.$store.state.config.shutdown_status;
    },
  },
  methods: {
    typeIsChildrenGroup(value) {
      if (value === 'children-group') {
        return true
      } else {
        return false
      }
    },
    handlerClick(name) {
      this.$router.push({ name: `${name}` });
    },
  },
};
</script>
<style lang="less">
@import "../../less/public_variable.less";
.side-nav {
  height: calc(100vh - 80px);
  background: #444154;
  overflow-y: auto;
  overflow-x: hidden;
  position: fixed;
  left: 0;
  z-index: 100;
  .router-link-active {
    border-radius: 5px;
  }
  .el-menu-vertical-demo {
    margin-top: 20px;
    width: 120px;
    border: none;
    .el-submenu {
      .el-submenu__title {
        padding: 0 !important;
        .iconfont {
          font-size: 1.6rem;
        }
        span {
          visibility: initial;
          font-size: 16px;
          color: #fff;
          width: 40px;
          height: 40px;
          line-height: 40px;
        }
      }
    }
  }
}
</style>
<style>
.el-menu-item {
  height: 45px;
  line-height: 45px;
}
.el-menu-item-group__title {
  color: rgba(255, 255, 255, 0.45);
  font-weight: bold;
  font-size: 16px;
  padding: 0 !important;
  margin: 0px;
}
.el-menu-item-group ul > li:hover {
  color: #ffd04b !important;
}
</style>
