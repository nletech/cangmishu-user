<template>
  <div class="addressManagement">
    <div :class="$style.addressManagement">
      <div :class="$style.am_main">
        <!-- 标签页 -->
        <el-row
        >
          <!-- 点击按键 -->
          <div :class="$style.am_operation_btn">
            <span @click="info_add_btn">
              <i class="iconfont">&#xe618;</i>
              {{`添加${active_add_text}信息`}}
            </span>
          </div>N
          <!-- 标签页 -->
          <el-tabs
            :class="$style.am_tabs"
            v-model="active_tab_item"
            >
            <el-tab-pane
              :class="$style.am_tabs_item"
              v-for="item in tabs"
              :key="item.id"
              :label="item.name"
              :name="item.name">
              <!-- 对应的标签页内容 -->
                <el-table
                  :class="$style.table_main"
                  :data="info_data"
                  border
                >
                  <el-table-column
                    header-align="center"
                    align="center"
                    type="index"
                    width="80"
                    label="#">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="fullname"
                    label="姓名">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="phone"
                    label="电话">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="full_address"
                    label="地址">
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    width="240"
                    label="操作">
                    <template slot-scope="scope">
                      <el-button size="mini"
                                 @click="edit(scope.row)">
                                  编辑
                      </el-button>
                      <el-button size="mini"
                                 type="danger"
                                 @click="delete(scope.row)">
                                  删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  :class="$style.pagination"
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
      :visible.sync = "switchFlag"
      :tabs="tabs"
      :active_tab_item="active_tab_item"
      :active_add_text="active_add_text"
    >
    </add-info>
  </div>
</template>
<script>
import $http from '@/api';
import AddInfo from './components/addAddressInfo';

export default {
  name: 'addressManagement',
  components: {
    AddInfo,
  },
  data() {
    return {
      tabs: [
        {
          id: 1,
          name: '发件信息',
          item: '发件人',
        }, {
          id: 2,
          name: '收件信息',
          item: '收件人',
        },
      ],
      active_tab_item: '', // 默认选择的标签页
      active_add_text: '', // 默认添加按钮文字
      switchFlag: false,
      info_data: [], // 数据
      total: '', // 列表总条数
      currentPage: 1, // 当前页
    };
  },
  methods: {
    info_add_btn() {
      this.switchFlag = true;
    }, // 添加信息按钮
    active_item_check(item) {
      if (item === '发件人') {
        $http.getSenderAddress()
          .then((re) => {
            if (re.status) return;
            this.info_data = re.data.data;
            this.total = re.data.total;
            this.current_page = re.data.current_page;
          })
          .catch(() => {});
      } else if (item === '收件人') {
        $http.getReceiverAddress()
          .then((re) => {
            if (re.status) return;
            this.info_data = re.data.data;
            this.total = re.data.total;
            this.current_page = re.data.current_page;
          })
          .catch(() => {});
      }
    }, // 检测选中的标签页
    handleCurrentChange(val) {
      if (this.active_tab_item.replace(/信息/, '人') === '发件人') {
        $http.checkSenderAddress({ page: val })
          .then((res) => {
            this.info_data = res.data.data;
          })
          .catch(() => {});
      }
      if (this.active_tab_item.replace(/信息/, '人') === '收件人') {
        $http.checkReceiverAddress({ page: val })
          .then((res) => {
            this.info_data = res.data.data;
          })
          .catch(() => {});
      }
    }, // 分页查询
    edit() {},
    delete(id) {
      console.log(id, 'no');
      if (this.active_tab_item.replace(/信息/, '人') === '发件人') {
        console.log(id, 'is');
        $http.deleteSender(id)
          .then(() => {})
          .catch(() => {});
      }
      if (this.active_tab_item.replace(/信息/, '人') === '收件人') {
        $http.deleteReceiver(id)
          .then(() => {})
          .catch(() => {});
      }
    },
  },
  watch: {
    active_tab_item() {
      const checked = this.active_tab_item.replace(/信息/, '人');
      this.active_add_text = checked; // 根据不同的标签页对应不同的添加按钮
      this.active_item_check(checked); // 点击不同的标签页显示不同的数据
    },
  },
  created() {
    this.active_tab_item = this.tabs[0].name; // 默认选中标签页
    this.active_add_text = this.tabs[0].item; // 默认选中添加按钮
  },
};
</script>
<style lang="less" module>
@import '../../../less/public_variable.less';

.addressManagement {
  margin: 40px 0 10px 0;
  .am_main {
    width: 90%;
    margin: 0 auto;
    position: relative;
    background-color: #fff;
    .am_operation_btn {
      position: absolute;
      top: 60px;
      right: 20px;
      z-index: 3;
      border: none;
      font-size: 1.1rem;
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
        // background-color: orange;
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
