<template>
<div>
  <div
    :class="$style.top_nav"
    class="top_nav"
  >
    <div :class="$style.nav">
       <div
        :class="$style.top_nav_logo"
        :style="{ width: sideNavStatus ? '80px' : '231px' }"
      >
        <span v-if="!sideNavStatus">仓秘书</span>
        <img v-else src="../../assets/img/cang.png" alt="仓秘书">
      </div>
      <div
        @click="closeSideNav"
        :class="$style.side_nav_switch"
      >
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
      <!-- 以上是wms旧代码 -->
      <!-- 选择按钮 -->
      <div
        :class="$style.selectedTag"
      >
        <el-dropdown
          :class="$style.selectedTag_main"
        >
          <el-button
            :class="$style.selectedTag_main_btn"
          >
            <span>{{'某某仓库'}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu
            slot="dropdown"
            :class="$style.selectedTag_main_dropdown"
            style="width: 200px; text-align: center;"
          >
            <el-dropdown-item>
              仓库配置
            </el-dropdown-item>
            <el-dropdown-item>
              创建仓库
            </el-dropdown-item>
            <el-dropdown-item>
              切换仓库
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
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
      <el-radio-button
        :class="$style.selectline"
        v-for="item in warehouseList"
        :label="item.warehouse.name_cn"
        :key="item.warehouse.id"
      >
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
    .selectedTag {
      width: 200px;
      height: 80px;
      border-right: 1px solid #d8d3f4;
      // background-color:#ccc;
      // .el-dropdown {
      //   width: 100%;
      //   height: 80px;
      // }
      .selectedTag_main {
        width: 100%;
        height: 100%;
        // background-color: orange;
        display: flex;
        justify-content: center;
        align-items: center;
        .selectedTag_main_btn {
          border: none;
        }
        .selectedTag_main_dropdown {
          width: 200px;
        }
        .selectedTag_main_desc {
          text-align: center;
          font-size: 1.3rem;
        }
      }
    }

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
    height: 80px;
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
      height: 80px;
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
