<template>
  <div :class="$style.top_nav_container">
    <div :class="$style.top_nav" class="top_nav">
      <div :class="$style.nav">
        <div :class="$style.top_nav_logo">
          <img src="../../assets/img/cang.png" alt="仓秘书" />
        </div>
        <!-- 切换仓库 选择按钮 -->
        <div :class="$style.selectedTag">
          <div v-if="+UType !== 0">
            <div style="font-size: 1.2rem; text-align: center; line-height: 80px;">
              <i class="medium el-icon-house"></i>
              <span>{{ warehouseName }}</span>
            </div>
          </div>
          <div v-else>
            <el-dropdown :class="$style.selectedTag_main">
              <el-button type="text">
                <i class="medium el-icon-house"></i>
                <strong>{{ warehouseName }}</strong>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu
                slot="dropdown"
                :class="$style.selectedTag_main_dropdown"
                style="width: 200px; text-align: center;"
              >
                <el-dropdown-item @click.native="to_store_management">
                  <span>{{ $t('WarehouseList') }}</span>
                </el-dropdown-item>
                <el-dropdown-item @click.native="shift_warehouse">
                  <span>{{ $t('selectdWh') }}</span>
                </el-dropdown-item>
                <el-dropdown-item @click.native="to_create_store">
                  <span>{{ $t('addStoreManage') }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <!-- 用户信息 -->
      <div :class="$style.user_info">
        <div :class="$style.selectLang" v-if="true">
          <span @click="handlerClick">
            <!-- {{$t('CurrentLanguage')}}: -->
            {{ this.$i18n.locale | langFilter }}
          </span>
        </div>
        <div
          v-if="isShowSelectWarehouseIcon"
          @click="toggleWarehouseIcon"
          :class="$style.warehouse"
        >
          <i class="iconfont">&#xe6bf;</i>
          <span>{{ selectWarehouse }}</span>
        </div>
        <div :class="$style.user">
          <div :class="$style.img" @click="show_user_info_flag = true">
            <!-- @click="handleChangeUserinfo"
            @mouseleave="handlerAvatarMouseLeave"
            @mouseover="handlerAvatarMouseOver" -->
            <span v-if="!userInfo.avatar" style="border: 1px solid;">管</span>
            <img v-else :class="$style.avatar" :src="userInfo.avatar" />
            <!-- <div
              :class="$style.avatar_hover_text"
              v-show="visible_avatar_text && this.$i18n.locale === 'cn'"
            >
              <span>修改资料</span>
            </div> -->
          </div>
          <div :class="$style.UnickName">
            <span v-html="userInfo.nickname"></span>
          </div>
          <div :class="$style.logout">
            <el-dropdown>
              <span class="iconfont">&#xe60e;</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleChangePassWord">{{
                  $t('modifyPassword')
                }}</el-dropdown-item>
                <el-dropdown-item @click.native="logout">{{ $t('LogOut') }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
    <!-- 切换仓库 -->
    <el-dialog
      :title="$t('SwitchWarehouse')"
      :append-to-body="true"
      :visible.sync="showWarehousesDialog"
    >
      <el-form>
        <el-form-item :label="$t('warehouse')">
          <el-select v-model="currentWarehouseId" :placeholder="$t('checkedWh')">
            <el-option
              v-for="item in warehouseList"
              :label="item.name_cn"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showWarehousesDialog = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{ $t('confirm') }}</el-button>
      </div>
    </el-dialog>
    <user-avatar-dialog :dialogVisible.sync="show_user_info_flag"></user-avatar-dialog>
  </div>
</template>

<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';
import UserAvatarDialog from './components/userAvatarDialog';

export default {
  name: 'topNav',
  components: { UserAvatarDialog },
  mixins: [mixin],
  data() {
    return {
      visible_avatar_text: false,
      show_user_info_flag: false,
      show_psw_flag: false,
      warehouseList: [], // 仓库列表
      selectWarehouse: '', // 切换仓库选择的仓库
      showWarehousesDialog: false, // 切换仓库弹窗开关
      centerDialogVisible: false,
      isShowSelectWarehouseIcon: false,
      currentWarehouseId: this.warehouseId
    };
  },
  created() {
    this.getWarehouses(); // 获取仓库列表
    this.getUserInfo();
  },
  watch: {
    currentWarehouseId(val) {
      const arr = this.warehouseList;
      // 监听当前选择的仓库名称，如果选中的名称改变，则缓存改仓库的 id
      for (let i = 0; i < arr.length; i += 1) {
        if (val === arr[i].id) {
          this.selectWarehouse = arr[i].name_cn; // 设置仓库名
        }
      }
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.config.userInfo;
    }, // 用户头像
    UType() {
      return +localStorage.getItem('setUType');
    } // 用户类型: 商家或员工
  },

  filters: {
    langFilter(val) {
      if (val === 'cn') {
        return 'EN';
      }
      return '中文';
    }
  },
  methods: {
    handlerClick() {
      // eslint-disable-next-line
      this.$i18n.locale === 'cn' ? (this.$i18n.locale = 'en') : (this.$i18n.locale = 'cn');
      this.$store.commit('config/setCurrentLanguage', this.$i18n.locale);
      localStorage.setItem('lang', `${this.$i18n.locale}`);
      // this.$store.commit('config/setCurrentLanguage', this.$i18n.locale);
    },
    handlerAvatarMouseOver() {
      this.visible_avatar_text = true;
    },
    handlerAvatarMouseLeave() {
      this.visible_avatar_text = false;
    },
    handleChangeUserinfo() {
      this.show_user_info_flag = true;
    }, // 修改个人资料
    handleChangePassWord() {
      this.show_psw_flag = true;
    }, // 修改密码
    to_store_management() {
      this.$router.push({ name: 'storeManage' });
    }, // 跳转到-----仓库管理
    to_create_store() {
      this.$router.replace({ name: 'addWarehouse' });
    }, // 跳转到-----创建仓库
    shift_warehouse() {
      this.showWarehousesDialog = true;
      this.getWarehouses();
    }, // 切换仓库--确定按钮
    getWarehouses() {
      $http.warehouses().then(res => {
        const data = res.data.data;
        this.warehouseList = data;
      });
    }, // 获取仓库列表
    getUserInfo() {
      $http.getUserInfo().then(res => {
        this.$store.commit('config/setWarehouseName', res.data.user.default_warehouse.name_cn);
        this.$store.commit('config/setWarehouseId', res.data.user.default_warehouse.id);
        this.$store.commit('config/updateUserInfo', res.data.user);
        // localStorage.setItem('setUser', data.data.user.id); // 存入用户 id
        // localStorage.setItem('setUModules', JSON.stringify(data.data.modules)); // 存入用户 昵称
        // localStorage.setItem('setUType', data.data.user.boss_id); // 存入员工标识 不为 0 则是员工类型
      });
    },
    handleConfirm() {
      this.$store.commit('config/setWarehouseId', this.currentWarehouseId);
      this.$store.commit('config/setWarehouseName', this.selectWarehouse);
      this.showWarehousesDialog = false;
    },
    toggleWarehouseIcon() {
      if (this.warehouseList.length === 1) {
        return;
      }
      this.centerDialogVisible = true;
    },
    logout() {
      this.$confirm(this.$t('LogoutTips'), this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        $http.logout().then(() => {
          this.$store.commit('token/delToken');
          this.$store.commit('config/setWarehouseId', '');
          this.$store.commit('config/updateUserInfo', {});
          // 删除登录的信息
          // localStorage.removeItem('warehouseId');
          // localStorage.removeItem('warehouseName');
          // localStorage.removeItem('setUType');
          // localStorage.removeItem('setUser');
          // localStorage.removeItem('setUModules');
          this.$router.push({
            name: 'login'
          });
        });
      });
    } // 注销
  }
};
</script>

<style lang="less" module>
.dialogcentered {
  margin: auto;
  text-align: center;
  font-size: 20px;
  .radio_group {
    width: 400px;
    height: 200px;
    overflow: auto;
  }
}

.selectline {
  display: block !important;
  margin-top: 20px;
  span {
    display: inline-block;
    width: 40%;
    border-left: 1px solid #ccc;
    border-radius: 4px;
  }
}

.top_nav_container {
  position: sticky;
  top: 0;
  z-index: 999;
  .top_nav {
    height: 80px;
    background-color: @white;
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-color: @separateLine;
    .nav {
      display: flex;
      .selectedTag {
        width: 200px;
        height: 80px;
        border-right: 1px solid #d8d3f4;
        .selectedTag_main {
          width: 100%;
          height: 100%;
          margin: 20px 0 0 0;
          font-size: 1.2rem;
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
      width: 120px;
      height: 80px;
      background-color: @ThemeColor;
      color: @white;
      font-size: 36px;
      line-height: 80px;
      font-weight: 600;
      text-align: center;
      transition: width 0.3s ease-in-out; // 修改 bug
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
      .switch(113px);
    }

    .user_info {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
      .selectLang {
        box-sizing: border-box;
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
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
        border-right: 1px solid;
        border-color: @separateLine;
        min-width: 240px;
        height: 80px;
        text-align: center;
        .img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          cursor: pointer;
          color: @ThemeColor;
          margin: 0 10px 0 10px;
          position: relative;
          transform: scale(0.8);
          .avatar {
            display: inline-block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
          .avatar_hover_text {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            vertical-align: middle;
            border-radius: 50%;
            font-size: 1.1rem;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover {
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              transition: all 0.3s ease-in-out;
            }
          }
        }

        .UnickName {
          width: 100px;
          height: 100%;
          display: flex; // 文字垂直居中
          justify-content: flex-start;
          align-items: center;
          overflow: hidden; // 以下样式 单行超出用 省略号代替
          text-align: left;
          span {
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 1.1rem;
          }
        }

        .logout {
          width: 80px;
          height: 100%;
          display: flex; // 文字垂直居中
          justify-content: center;
          align-items: center;
          cursor: pointer;
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
}
</style>

<style lang="less">
.top_nav {
  .router-link-active {
    color: @ThemeColor !important;
  }
}
</style>
