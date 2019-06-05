<template>
<div>
  <div
    :class="$style.top_nav"
    class="top_nav"
  >
    <div :class="$style.nav">
       <div  :class="$style.top_nav_logo"
             :style="{ width: sideNavStatus ? '80px' : '231px' }">
             <span v-if="!sideNavStatus">仓秘书</span>
             <img v-else src="../../assets/img/cang.png" alt="仓秘书">
      </div>
      <div  @click="closeSideNav"
            :class="$style.side_nav_switch">
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
      <!-- 切换仓库 选择按钮 -->
      <div  :class="$style.selectedTag">
            <el-dropdown  :class="$style.selectedTag_main">
                          <el-button :class="$style.selectedTag_main_btn">
                                    <span>{{default_warehouse_name}}</span>
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                          <el-dropdown-menu  slot="dropdown"
                                            :class="$style.selectedTag_main_dropdown"
                                            style="width: 200px; text-align: center;">
                                            <el-dropdown-item>
                                                              <span @click="to_store_management">仓库管理</span>
                                            </el-dropdown-item>
                                            <el-dropdown-item>
                                                            <span @click="to_create_store">创建仓库</span>
                                            </el-dropdown-item>
                                            <el-dropdown-item>
                                                            <span @click="shift_warehouse">切换仓库</span>
                                            </el-dropdown-item>
                          </el-dropdown-menu>
            </el-dropdown>
      </div>
    </div>
    <!-- 用户信息 -->
    <div :class="$style.user_info">
         <div  v-if="isShowSelectWarehouseIcon"
               @click="toggleWarehouseIcon"
               :class="$style.warehouse">
               <i v-show="iconShow" class="iconfont">&#xe6bf;</i>
               <span>{{selectWarehouse}}</span>
         </div>
         <div :class="$style.user">
              <el-dropdown>
                          <div  :class="$style.img"
                                @click="handleChangeUserinfo">
                            <span>管</span>
                            <!-- <img src="#" alt="管理员"> -->
                          </div>
                          <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item @click.native="handleChangePassWord">{{'修改密码'}}</el-dropdown-item>
                                            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                          </el-dropdown-menu>
              </el-dropdown>
         </div>
    </div>
  </div>
    <!-- 切换仓库 -->
    <el-dialog  :visible="showWarehousesSwitch"
                width="30%"
                :show-close="false"
                :close-on-click-modal="false"
                center>
                <div :class="$style.dialogcentered">
                      <p>请选择仓库</p>
                      <el-radio-group  :class="$style.radio_group"
                                      v-model="selectWarehouse">
                                      <el-radio-button  :class="$style.selectline"
                                                        v-for="item in all_warehouse"
                                                        :key="item.id"
                                                        :label="item.name_cn"
                                                        :value="item.id">
                                      </el-radio-button>
                      </el-radio-group>
                </div>
                <span slot="footer"
                      class="dialog-footer">
                      <el-button type="primary" @click="handleConfirm">确 定</el-button>
                </span>
    </el-dialog>
    <!-- 修改密码 -->
    <change-pass-word :visible.sync="show_psw_flag"></change-pass-word>
    <user-info :visible.sync="show_user_info_flag"></user-info>
</div>
</template>

<script>
import $http from '@/api';
import ChangePassWord from './components/changePassWord'; // 修改密码
import UserInfo from './components/userInfo'; // 修改个人资料

export default {
  name: 'topNav',
  components: {
    ChangePassWord,
    UserInfo,
  },
  data() {
    return {
      show_user_info_flag: false,
      show_psw_flag: false,
      all_warehouse: '', // 仓库列表
      selectWarehouse: '', // 切换仓库选择的仓库
      showWarehousesSwitch: false, // 切换仓库弹窗开关
      warehouses: [], // 仓库列表
      currentWarehouseId: '', // 当前选中仓库 Id
      // 仓秘书
      centerDialogVisible: false,
      isShowSelectWarehouseIcon: false,
      noWarehouse: true,
      iconShow: true,
      warehouseList: '',
    };
  },
  created() {
    this.getWarehouses(); // 获取仓库列表
  },
  watch: {
    default_warehouse_name(val) {
      // console.log(val, '监听仓库id');
      const arr = this.all_warehouse;
      // 监听当前选择的仓库名称，如果选中的名称改变，则缓存改仓库的 id
      for (let i = 0; i < arr.length; i += 1) {
        if (val === arr[i].name_cn) {
          this.currentWarehouseId = +arr[i].id;
          // console.log(this.currentWarehouseId, 'this.currentWarehouseId');
          this.$store.commit('config/setWarehouseId', +arr[i].id); // 设置仓库 id
          this.$store.commit('config/setWarehouseName', this.selectWarehouse); // 设置仓库名
        }
      }
    },
  },
  methods: {
    handleChangeUserinfo() {
      this.show_user_info_flag = true;
    }, // 修改个人资料
    handleChangePassWord() {
      this.show_psw_flag = true;
    }, // 修改密码
    init_warehouse(
      //
    ) {}, // 初始化登陆后的默认仓库
    to_store_management() {
      this.$router.replace({ name: 'storeManage' });
    }, // 跳转到仓库管理
    to_create_store() {
      sessionStorage.setItem('show_create_warehouse', true);
      const timer1 = setTimeout(() => {
        this.$router.replace({ name: 'storeManage' });
        clearTimeout(timer1);
      }, 500);
    }, // 跳转到创建仓库
    shift_warehouse() {
      this.showWarehousesSwitch = true;
      // const timer = setTimeout(() => {
      //   this.showWarehousesSwitch = true;
      //   clearTimeout(timer);
      // }, 300);
    }, // 切换仓库--确定按钮
    getWarehouses() {
      $http.warehouses().then((re) => {
        const data = re.data.data;
        this.all_warehouse = data;
        this.$set(this.all_warehouse);
      });
    }, // 获取仓库列表
    handleConfirm() {
      console.log(this.currentWarehouseId, '当前仓库id', this.selectWarehouse, '当前仓库name');
      this.$store.commit('config/setWarehouseId', this.currentWarehouseId);
      this.$store.commit('config/setWarehouseName', this.selectWarehouse);
      this.showWarehousesSwitch = false; // 关闭对话框
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
          // 删除登录的信息
          localStorage.removeItem('email');
          localStorage.removeItem('warehouseId');
          localStorage.removeItem('warehouseName');
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
    default_warehouse_name() {
      return this.$store.state.config.setWarehouseName || localStorage.getItem('warehouseName');
    }, // 初始化默认仓库
    topNavData() {
      return this.$store.state.routerData.routerMap[0].children;
    },
    email() {
      return localStorage.getItem('email');
    },
    sideNavStatus() {
      return +this.$store.state.config.shutdown_status;
    }, // 隐藏侧边栏标志
  },
};
</script>

<style lang="less" module>
@import '../../less/public_variable.less';

.dialogcentered {
  margin: auto;
  text-align: center;
  font-size: 20px;
  .radio_group {
    width: 400px;
    height: 300px;
    overflow: auto;
  }
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
