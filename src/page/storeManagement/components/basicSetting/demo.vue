<template>
  <div class="addressManagement">
    <div :class="$style.addressManagement">
      <div :class="$style.am_main">
        <!-- 标签页 -->
        <el-row>
          <!-- 点击按键 -->
          <div :class="$style.am_operation_btn">
            <span @click="info_add_btn">
              <i class="iconfont">&#xe618;</i>
              {{`${active_add_text}`}}
            </span>
          </div>
          <!-- 标签页 -->
          <el-tabs  v-model="active_tab_item"
                    :class="$style.am_tabs">
                    <el-tab-pane  :class="$style.am_tabs_item"
                                  v-for="item in tabs"
                                  :key="item.id"
                                  :label="item.name"
                                  :name="item.name">
                                  <!-- 对应的标签页内容 -->
                                  <el-table  :data="info_data"
                                             :class="$style.table_main"
                                             border>
                                             <el-table-column  label="#"
                                                               header-align="center"
                                                               align="center"
                                                               type="index"
                                                               width="80">
                                             </el-table-column>
                                             <el-table-column  label="编号"
                                                               header-align="center"
                                                               align="center"
                                                               prop="code">
                                             </el-table-column>
                                             <el-table-column  label="类型名称"
                                                               header-align="center"
                                                               align="center"
                                                               prop="name_cn">
                                             </el-table-column>
                                             <el-table-column  label="启用状态"
                                                               header-align="center"
                                                               align="center">
                                                               <template  slot-scope="scope">
                                                                          <span v-if="scope.row.is_enabled==1">是</span>
                                                                         <span v-if="scope.row.is_enabled==0">否</span>
                                                               </template>
                                             </el-table-column>
                                             <el-table-column  label="操作"
                                                               header-align="center"
                                                               width="240">
                                                               <template  slot-scope="scope">
                                                                          <el-button  size="mini"
                                                                                      @click="edit(scope.row)">
                                                                                      编辑
                                                                          </el-button>
                                                                          <el-button  size="mini"
                                                                                      type="danger"
                                                                                      @click="delete_data(scope.row)">
                                                                                      删除
                                                                          </el-button>
                                                               </template>
                                             </el-table-column>
                                  </el-table>
                                  <el-pagination  :class="$style.pagination"
                                                  v-show="+total"
                                                  @current-change="handleCurrentChange"
                                                  :current-page="currentPage"
                                                  layout="total, prev, pager, next, jumper"
                                                  :total="+total">
                                  </el-pagination>
                    </el-tab-pane>
          </el-tabs>
        </el-row>
      </div>
    </div>
    <!-- 添加收发人信息 -->
    <store-info
      :visible.sync = "switchFlag"
      :tabs="tabs"
      :active_tab_item="active_tab_item"
      :active_add_text="active_add_text"
      :row_data="row_data"
      @updata_data="handle_updata_data"
      @updata_data_list="handle_updata_data_list"
      :clear_is_enabled="clear_is_enabled"
    >
    </store-info>
  </div>
</template>
<script>
import $http from '@/api';
import StoreInfo from './components/storeInfo';

export default {
  name: 'demo',
  components: {
    StoreInfo,
  },
  mounted() {
    console.log(this.$route.params.warehouses_id, 'this.$route.params.warehouses_id');
  },
  data() {
    return {
      tabs: [
        {
          id: 1,
          name: '货区',
          btn_text: '添加货区',
        }, {
          id: 2,
          name: '货位',
          btn_text: '添加货位',
        },
      ],
      clear_is_enabled: 0,
      row_data: {}, // 行数据
      active_tab_item: '', // 默认选择的标签页 (主要判断标志)
      active_add_text: '', // 默认添加按钮文字
      switchFlag: false,
      info_data: [], // 数据
      total: '', // 列表总条数
      currentPage: 1, // 当前页
      current_page: 1, // 当前页(编辑的时候)
    };
  },
  watch: {
    active_tab_item() {
      /* eslint-disable */
      let active_tag = this.active_tab_item;
      active_tag === '货区'
        ? this.active_add_text = this.tabs[0].btn_text
        : this.active_add_text = this.tabs[1].btn_text;
      this.active_item_check(active_tag); // 点击不同的标签页显示不同的数据
    }, // 选中不同标签页，显示不同的添加按钮
  },
  created() {
    this.active_tab_item = this.tabs[0].name; // 默认选中标签页
  },
  methods: {
    handle_updata_data_list(val) {
      this.active_item_check(val);
    }, // 添加之后更新信息
    handle_updata_data(active_item) {
      this.handleCurrentChange(this.current_page);
    }, // 编辑信息之后更新信息
    info_add_btn() {
      this.row_data = {};
      this.clear_is_enabled = 1;
      this.switchFlag = true;
    }, // 添加信息按钮
    active_item_check(item) {
      item === '货区'
      ? $http.getWarehouseArea({ warehouse_id: this.$route.params.warehouses_id })
          .then((re) => {
            if (re.status) return;
            this.info_data = re.data.data;
            this.total = re.data.total;
            this.current_page = re.data.current_page;
          })
          .catch(() => {})
      : $http.getWarehouseshelf({ warehouse_id: this.$route.params.warehouses_id })
          .then((re) => {
            if (re.status) return;
            this.info_data = re.data.data;
            this.total = re.data.total;
            this.current_page = re.data.current_page;
          })
          .catch(() => {});
    }, // 检测选中的标签页
    handleCurrentChange(val) {
      this.current_page = val;
      this.active_tab_item === '货区'
      ? $http.checkWarehouseArea({
        page: val,
        warehouse_id: this.$route.params.warehouses_id,
      })
          .then((re) => {
            this.info_data = re.data.data;
            this.total = re.data.total;
            this.current_page = re.data.current_page;
          })
          .catch(() => {})
      : $http.checkWarehouseshelf({
          page: val,
          warehouse_id: this.$route.params.warehouses_id,
      })
          .then((re) => {
            this.info_data = re.data.data;
            this.total = re.data.total;
            this.current_page = re.data.current_page;
          })
          .catch(() => {});
    }, // 分页查询
    edit(info) {
      this.row_data = info;
      this.switchFlag = true;
    },
    delete_data(info) {
      const active_item = this.active_tab_item;
      active_item === '货区'
      ? $http.delWarehouseArea(info.id)
          .then(() => {
            if (status) return;
            this.$message({
              type: 'success',
              message: '删除货区成功',
            });
            this.active_item_check(active_item);
          })
          .catch(() => {})
      : $http.delWarehouseshelf(info.id)
          .then(() => {
            if (status) return;
            this.$message({
              type: 'success',
              message: '删除货位成功',
            });
            this.active_item_check(active_item);
          })
          .catch(() => {});
    },
  },
};
</script>
<style lang="less" module>
@import '../../../../less/public_variable.less';

.addressManagement {
  margin: 20px 0 10px 0;
  .am_main {
    width: 90%;
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
