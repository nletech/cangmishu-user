<template>
<div>
  <div :class="$style.top_nav" class="top_nav">
    <div :class="$style.nav">
       <div :style="{ width: sideNavStatus ? '80px' : '231px' }" :class="$style.top_nav_logo">
        <span v-if="!sideNavStatus">EUT WMS</span>
        <img v-else src="../../assets/img/logowmsut.png" alt="">
      </div>
      <div @click="closeSideNav" :class="$style.side_nav_switch">
        <i class="iconfont">&#xe622;</i>
      </div>
      <!-- <div :class="$style.lang_switch">
        <el-dropdown>
          <span class="el-dropdown-link">
            English<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">简体中文</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div> -->
      <ul :class="$style.top_nav_ul">
        <li :class="$style.top_nav_li" v-for="(item, index) in topNavData"
             @click="emitSelectWarehouse(index)"
             :key="item.name">
          <router-link :to="{name: item.name}">
            <i class="iconfont" v-html="item.icon"></i>
            {{$t(item.name)}}
          </router-link>
        </li>
      </ul>
    </div>
    <div :class="$style.user_info">
      <div v-if="isShowSelectWarehouseIcon" @click="toggleWarehouseIcon"
          :class="$style.warehouse">
          <i v-show="iconShow" class="iconfont">&#xe6bf;</i>
          <span>{{selectWarehouse}}</span>
      </div>
      <div :class="$style.user">
        <el-dropdown>
          <div :class="$style.img">
            管
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>{{email}}</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <div :class="$style.mdoel" v-for="index in 3" :key="index">
          <div @click="goIcon(index)"
            :class="$style.model_top"
            :style="{color: ['#ffbb17', '#57c38a', '#e7e5f9'][index-1]}">
            <i class="iconfont">&#xe653;</i>
          </div>
          <span>{{['创建', '租赁', '员工'][index-1]}}</span>
        </div> -->
        <div :class="$style.mdoel">
          <div @click="goIcon(1)"
            :class="$style.model_top"
            :style="{color: isOwner ? '#ffbb17' : '#e7e5f9'}">
            <i class="iconfont">&#xe653;</i>
          </div>
          <span>创建</span>
        </div>
        <div :class="$style.mdoel">
          <div @click="goIcon(2)"
            :class="$style.model_top"
            :style="{color: isRenter ? '#57c38a' : '#e7e5f9'}">
            <i class="iconfont">&#xe653;</i>
          </div>
          <span>租赁</span>
        </div>
        <!-- <div :class="$style.mdoel">
          <div @click="goIcon(3)"
            :class="$style.model_top"
            :style="{color:'#e7e5f9'}">
            <i class="iconfont">&#xe653;</i>
          </div>
          <span>员工</span>
        </div> -->
      </div>
    </div>
  </div>
 <el-dialog
   :visible.sync="centerDialogVisible"
   width="30%"
   center>
   <div v-if='noWarehouse' :class="$style.dialogcentered">
     <p>您暂无仓库，</p>
     <p>请先创建或租赁仓库</p>
   </div>
   <div v-else :class="$style.dialogcentered">
     <p>请选择仓库</p>
    <el-radio-group v-model="selectWarehouse">
      <el-radio-button :class="$style.selectline"
                       v-for="item in warehouseList"
                       :label="item.warehouse.name_cn" :key="item.warehouse.id">
      </el-radio-button>
    </el-radio-group>
   </div>
   <span slot="footer" class="dialog-footer">
     <el-button type="primary" @click="handleConfirm">确 定</el-button>
   </span>
 </el-dialog>
</div>
</template>

<script>
import $http from '@/api';

export default {
  name: 'topNav',
  data() {
    return {
      centerDialogVisible: false,
      isShowSelectWarehouseIcon: false,
      noWarehouse: true,
      iconShow: true,
      warehouseList: '',
      selectWarehouse: '',
    };
  },
  created() {
    this.getWarehouseLists();
  },
  watch: {
    $route(to) {
      if (to.path.split('/')[1] === 'commodityManage' && this.warehouseList.length === 1) {
        this.isShowSelectWarehouseIcon = true;
        this.iconShow = false;
      } else if (to.path.split('/')[1] === 'commodityManage' && this.warehouseList.length > 1) {
        this.isShowSelectWarehouseIcon = true;
        this.iconShow = true;
      }
    },
  },
  methods: {
    getWarehouseLists() {
      const sessionID = sessionStorage.getItem('WAREHOUSEID');
      const sessionNAME = sessionStorage.getItem('WAREHOUSENAME');
      $http.warehouseLists().then((res) => {
        this.warehouseList = res.data;
        this.noWarehouse = !this.warehouseList.length;
        this.$store.commit('config/ifHaveWarehouse', !res.data.length);
        this.$store.commit('config/warehouseLists', res.data);
        if (this.warehouseList.length === 1) {
          this.selectWarehouse = this.warehouseList[0].warehouse.name_cn;
          this.$store.commit('config/setWarehouseId', res.data[0].warehouse.id);
          this.isShowSelectWarehouseIcon = true;
          this.iconShow = false;
        }
        if (sessionID) {
          this.$store.commit('config/setWarehouseId', sessionID);
          this.isShowSelectWarehouseIcon = true;
          this.selectWarehouse = sessionNAME;
        }
      });
    },
    handleConfirm() {
      this.centerDialogVisible = false;
      this.warehouseList.forEach((element) => {
        if (element.warehouse.name_cn === this.selectWarehouse) {
          this.$store.commit('config/setWarehouseId', element.warehouse.id);
          sessionStorage.setItem('WAREHOUSEID', element.warehouse.id);
          sessionStorage.setItem('WAREHOUSENAME', element.warehouse.name_cn);
          $http.toggleWarehouse(element.warehouse.id).then(() => {
          });
        }
      });
    },
    toggleWarehouseIcon() {
      if (this.warehouseList.length === 1) { return; }
      this.centerDialogVisible = true;
    },
    // 注销
    logout() {
      this.$confirm('此操作将退出系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        $http.logout().then(() => {
          this.$store.commit('token/delToken');
          this.$store.commit('config/setWarehouseId', '');
          sessionStorage.setItem('WAREHOUSEID', '');
          sessionStorage.setItem('WAREHOUSENAME', '');
          this.$router.push({
            name: 'login',
          });
        });
      });
    },
    // 关闭导航栏
    closeSideNav() {
      this.$store.commit('config/closeSideNav', !+this.sideNavStatus);
    },
    emitSelectWarehouse(index) {
      this.iconShow = true;
      this.isShowSelectWarehouseIcon = (index === 4 && this.warehouseList.length >= 1);
      if (this.warehouseList.length === 1) { this.iconShow = false; }
      if (index === 4 && !this.$store.state.config.setWarehouseId && this.warehouseList.length) {
        this.centerDialogVisible = true;
      }
    },
    // goIcon(val) {
    //   let text = '';
    //   switch (val) {
    //     case 1:
    //       text = 'storeManage';
    //       break;
    //     case 2:
    //       text = 'StoreLeases';
    //       break;
    //     case 3:
    //       text = 'staffList';
    //       break;
    //     default:
    //       text = 'storeManage';
    //       break;
    //   }
    //   this.$router.push({
    //     name: text,
    //   });
    // },
    goIcon() {
      this.$router.push({
        name: 'myAuthentication',
      });
    },
  },
  computed: {
    topNavData() {
      return this.$store.state.routerData.routerMap[0].children;
    },
    email() {
      return this.$store.state.token.vip_info && this.$store.state.token.vip_info.email;
    },
    isOwner() {
      // eslint-disable-next-line
      return this.$store.state.token.vip_info && this.$store.state.token.vip_info.certification_owner_status === 2;
    },
    isRenter() {
      // eslint-disable-next-line
      return this.$store.state.token.vip_info && this.$store.state.token.vip_info.certification_renter_status === 2;
    },
    sideNavStatus() {
      return +this.$store.state.config.shutdown_status;
    },
  },
};
</script>

<style lang="less" module>
@import '../../less/public_variable.less';
.selectcentered {
  width: 200px;
  position: relative;
  margin-left: 50%;
  transform: translateX(-50%);
}
.dialogcentered {
  margin: auto;
  text-align: center;
  font-size: 20px;
}
.selectline {
  display: block!important;
  margin-top: 20px;
  span {
    display: inline-block;
    width: 200px;
    border-left: 1px solid #ccc;
    border-radius: 4px;
  }
}
.top_nav {
  height: 80px;
  background-color: @white;
  position: fixed;
  top: 0;
  z-index: 999;
  width: 100%;
  min-width: 1280px;
  display: flex;
  border-bottom: 1px solid;
  border-color: @separateLine;
  .nav {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
  }
  .switch(@width) {
    border-right: 1px solid;
    border-color: @separateLine;
    width: @width;
    text-align: center;
    line-height: 80px;
  }
  .top_nav_logo {
    width: 231px;
    height: 80px;
    background-color: @ThemeColor;
    color: @white;
    font-size: 36px;
    line-height: 80px;
    font-weight: 600;
    text-align: center;
    img {
      margin-top: 15px;
      width: 50px;
    }
  }
  .side_nav_switch {
    .switch(103px);
    i {
      font-size: 30px;
      color: @ThemeColor;
      cursor: pointer;
    }
  }
  .lang_switch {
    .switch(113px)
  }
  .top_nav_ul {
    padding: 0;
    margin: 25px 0 0 39px;
    display: flex;
    flex-wrap: row;
    min-width: 460px;
    .top_nav_li {
      list-style: none;
      text-align: center;
      margin-right: 39px;
      a {
        text-decoration: none;
        color:  @textColor;
        font-size: 14px;
        &:hover {
          color:  @ThemeColor;
        }
        i {
          display: block;
          margin-bottom: 3px;
        }
      }
    }
  }
  .user_info {
    width: 40%;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    .warehouse {
      cursor: pointer;
      line-height: 80px;
      text-align: right;
      i {
        vertical-align: middle;
        font-size: 26px;
        line-height: 80px;
      }
      span {
        font-size: 16px;
        line-height: 26px;
      }
    }
    .user {
      border-left: 1px solid;
      margin-left: 20px;
      display: flex;
      flex-flow: row wrap;
      border-right: 1px solid;
      border-color: @separateLine;
      min-width: 180px;
      text-align: center;
      .img {
        width: 41px;
        height: 41px;
        border-radius: 50%;
        border: 1px solid;
        cursor: pointer;
        line-height: 41px;
        color: @ThemeColor;
        margin: 20px 15px 28px 37px;
      }
    }
    .model_color(@color) {
      width: 21px;
      height: 21px;
      background: @textColor;
      color: @color;
      line-height: 21px;
      margin: 0 auto;
      border-radius: 50%;
    }
    .mdoel {
      margin-top: 25px;
      cursor: pointer;
      width: 35px;
      font-size: 10px;
      .model_top {
        .model_color(RGBA(255, 187, 23, 1));
        i {
          font-size: 12px;
        }
      }
    }
  }
  // @media screen and(max-width: 1300px) {
  //   .user_info {
  //     display: none;
  //   }
  // }
}
</style>

<style lang="less">
@import '../../less/public_variable.less';
.top_nav {
  .router-link-active {
    color:  @ThemeColor !important;
  }
}
</style>
