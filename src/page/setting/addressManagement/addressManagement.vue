<template>
  <div class="addressManagement">
    <div class="clearfix">
      <div class="fr">
        <el-button size="small" type="primary" @click="info_add_btn">
          {{ $t(`${active_add_text}`) }}
        </el-button>
      </div>
    </div>
    <!-- 点击按键 -->
    <div :class="$style.addressManagement" style="clear:both; margin-top:50px;">
      <div :class="$style.am_main">
        <!-- 标签页 -->
        <el-row>
          <!-- 标签页 -->
          <el-tabs :class="$style.am_tabs" v-model="active_tab_item">
            <el-tab-pane
              :class="$style.am_tabs_item"
              v-for="item in tabs"
              :key="item.id"
              :label="$t(`${item.title}`)"
              :name="item.name"
            >
              <!-- 对应的标签页内容 -->
              <el-table
                element-loading-text="loading"
                v-loading="isButtonLoading"
                :class="$style.table_main"
                :data="info_data"
                border
              >
                <el-table-column
                  header-align="center"
                  align="center"
                  type="index"
                  width="80"
                  label="#"
                >
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="fullname"
                  :label="$t('name')"
                >
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="phone"
                  :label="$t('phone')"
                >
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="full_address"
                  width="350"
                  :label="$t('address')"
                >
                </el-table-column>
                <el-table-column header-align="center" width="240" :label="$t('operation')">
                  <template slot-scope="scope">
                    <el-tooltip :content="$t('edit')" placement="top">
                      <el-button
                        size="mini"
                        icon="el-icon-edit"
                        round
                        :loading="isButtonLoading"
                        @click="edit(scope.row)"
                      >
                      </el-button>
                    </el-tooltip>
                    <el-tooltip :content="$t('delete')" placement="top">
                      <el-button
                        size="mini"
                        icon="el-icon-delete"
                        :loading="isButtonLoading"
                        @click="delete_data(scope.row)"
                        type="danger"
                        round
                      >
                      </el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                :class="$style.pagination"
                v-show="+total"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                layout="total, prev, pager, next, jumper"
                :total="+total"
              >
              </el-pagination>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </div>
    </div>
    <!-- 添加收发人信息 -->
    <add-info
      :visible.sync="switchFlag"
      :active_tab_item="active_tab_item"
      :active_add_text="active_add_text"
      :row_data="row_data"
      @updata_data="handle_updata_data"
      @updata_data_list="handle_updata_data_list"
    >
    </add-info>
  </div>
</template>
<script>
import $http from '@/api';
import mixin from '@/mixin/form_config';
import AddInfo from './components/addAddressInfo';

export default {
  name: 'addressManagement',
  mixins: [mixin],
  components: {
    AddInfo
  },
  data() {
    return {
      switchFlag: false,
      tabs: [
        {
          id: 1,
          title: 'sender',
          name: '发件人信息',
          btn_text: 'addsender'
        },
        {
          id: 2,
          title: 'receiver',
          name: '收件人信息',
          btn_text: 'addreceiver'
        }
      ],
      row_data: {}, // 行数据
      active_tab_item: '', // 默认选择的标签页 (主要判断标志)
      active_add_text: '', // 默认添加按钮文字
      info_data: [], // 数据
      total: '', // 列表总条数
      currentPage: 1, // 当前页
      current_page: 1 // 当前页(编辑的时候)
    };
  },
  watch: {
    active_tab_item(val) {
      if (val === '发件人信息') {
        this.active_add_text = this.tabs[0].btn_text;
      } else {
        this.active_add_text = this.tabs[1].btn_text;
      }
      this.active_item_check(val); // 点击不同的标签页显示不同的数据
    } // 选中不同标签页，显示不同的添加按钮
  },
  created() {
    this.active_tab_item = this.tabs[0].name; // 默认选中标签页
  },
  methods: {
    handle_visible(val) {
      console.log(val, 'val');
    },
    handleAddVisible(val) {
      console.log(val, 'val');
    },
    handle_updata_data_list(val) {
      this.active_item_check(val);
    }, // 添加之后更新信息
    handle_updata_data() {
      this.handleCurrentChange(this.current_page);
    }, // 编辑信息之后更新信息
    info_add_btn() {
      this.row_data = {};
      this.switchFlag = true;
    }, // 添加信息按钮
    async active_item_check(item) {
      this.info_data = [];
      const data = { warehouse_id: this.warehouseId };
      let res;
      if (item === '发件人信息') {
        res = await $http.getSenderAddress(data);
      } else {
        res = await $http.getReceiverAddress(data);
      }
      if (res.status) return;
      this.info_data = res.data.data;
      this.total = res.data.total;
      this.current_page = res.data.current_page;
    }, // 检测选中的标签页
    async handleCurrentChange(val) {
      this.current_page = val;
      const data = {
        page: val,
        warehouse_id: this.warehouseId
      };
      let res;
      if (this.active_tab_item === '发件人信息') {
        res = await $http.checkSenderAddress(data);
      } else {
        res = await $http.checkReceiverAddress(data);
      }
      if (res.status) return;
      this.info_data = res.data.data;
      this.total = res.data.total;
      this.current_page = res.data.current_page;
    }, // 分页查询
    edit(info) {
      this.row_data = { ...info };
      this.switchFlag = true;
    },
    async delete_data(info) {
      let res;
      if (this.active_tab_item === '发件人信息') {
        res = await $http.deleteSender(info.id);
      } else {
        res = await $http.deleteReceiver(info.id);
      }
      if (res.status) return;
      this.$message({
        type: 'success',
        message: this.$t('success')
      });
      this.active_item_check(this.active_tab_item);
    } // 删除操作
  }
};
</script>
<style lang="less" module>
.addressManagement {
  .am_main {
    margin: 0 auto;
    position: relative;
    background-color: #fff;
    .am_operation_btn {
      position: absolute;
      top: 80px;
      right: 20px;
      z-index: 3;
      border: none;
      font-size: 1.2rem;
      color: @ThemeColor;
      cursor: pointer;
    }
  }
}
</style>
<style lang="less">
.addressManagement {
  .el-tabs__nav-scroll {
    .el-tabs__nav {
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;
      padding: 10px 0 10px 0;
      float: none;
      .el-tabs__item {
        width: 50%;
        text-align: center;
        font-size: 1.2rem;
      }
    }
  }
  .el-tabs {
    .el-tabs__content {
      margin: 80px 0 0 0;
    }
  }
}
.el-pagination {
  margin: 20px 0 0 0;
  float: right;
}
</style>
